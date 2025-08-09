import { redirect, type unstable_MiddlewareFunction } from "react-router";

import { getSession } from "@/lib/session";
import { assert, validateRedirect } from "@/lib/utils";

export const redirectIfLoggedInMiddleware: unstable_MiddlewareFunction = (
  { request },
  next
) => {
  if (getUser()) {
    const url = new URL(request.url);

    return redirect(
      validateRedirect(url.searchParams.get("redirectTo"), "/app")
    );
  }

  return next();
};

export const requireUserMiddleware: unstable_MiddlewareFunction = (
  { request },
  next
) => {
  if (!getUser()) {
    const url = new URL(request.url);
    const searchParams = new URLSearchParams();
    searchParams.set("redirectTo", url.pathname + url.search);

    return redirect(`/login?${searchParams}`);
  }

  return next();
};

export function getUser() {
  const session = getSession();
  return session.get("user");
}

export function requireUser() {
  const userId = getUser();
  assert(userId, "User must be authenticated to access this resource.");
  return userId;
}
