import { AsyncLocalStorage } from "node:async_hooks";

import type { Session } from "react-router";
import { createCookieSessionStorage } from "react-router";
import { env } from "std-env";

type SessionData = {
  user?: { id: string };
};

type SessionContext = {
  emptySession: Session<SessionData, SessionData>;
  session: Session<SessionData, SessionData>;
};

declare global {
  var SESSION: AsyncLocalStorage<SessionContext>;
}

const SESSION =
  globalThis.SESSION ??
  (globalThis.SESSION = new AsyncLocalStorage<SessionContext>());

const POISON_AFTER_RESPONSE_GENERATED = new Set(["flash", "set", "unset"]);

function proxySession<S extends Session>(
  session: S
): { responseGenerated(): void; session: S } {
  let responseGenerated = false;
  return {
    responseGenerated() {
      responseGenerated = true;
    },
    session: new Proxy(session, {
      get(target, prop, receiver) {
        if (
          responseGenerated &&
          typeof prop === "string" &&
          POISON_AFTER_RESPONSE_GENERATED.has(prop)
        ) {
          throw new Error(
            `Cannot mutate session after response is generated: getSession().${prop}() was called after the response was generated.`
          );
        }
        return Reflect.get(target, prop, receiver);
      },
    }),
  };
}

const SESSION_SECRET = env.SESSION_SECRET!;
if (!SESSION_SECRET) {
  throw new Error("SESSION_SECRET environment variable is not set");
}

export async function provideSession(
  request: Request,
  cb: () => Promise<Response>
): Promise<Response> {
  const sessionStorage = createCookieSessionStorage({
    cookie: {
      path: "/",
      httpOnly: true,
      sameSite: "lax",
      secrets: [SESSION_SECRET],
    },
  });

  const [_session, _emptySession] = await Promise.all([
    sessionStorage.getSession(request.headers.get("Cookie")),
    sessionStorage.getSession(),
  ]);

  const valuesHash = JSON.stringify(_session.data);

  const sessionProxy = proxySession(_session);
  const emptySessionProxy = proxySession(_emptySession);

  const ctx: SessionContext = {
    emptySession: emptySessionProxy.session,
    session: sessionProxy.session,
  };

  const response = await SESSION.run(ctx, cb);

  sessionProxy.responseGenerated();
  emptySessionProxy.responseGenerated();

  if (valuesHash === JSON.stringify(ctx.session.data)) {
    return response;
  }

  const headers = new Headers(response.headers);
  headers.append("Set-Cookie", await sessionStorage.commitSession(ctx.session));

  return new Response(response.body, {
    headers,
    status: response.status,
    statusText: response.statusText,
  });
}

export function getSession(): Session<SessionData, SessionData> {
  const ctx = SESSION.getStore();
  if (!ctx) {
    throw new Error("No session context");
  }
  return ctx.session;
}

export function destroySession() {
  const ctx = SESSION.getStore();
  if (!ctx) {
    throw new Error("No session context");
  }

  ctx.session = ctx.emptySession;
}
