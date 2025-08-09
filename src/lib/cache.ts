import { AsyncLocalStorage } from "node:async_hooks";

type CacheContext = {
  duration?: CacheLength;
};

declare global {
  var CACHE: AsyncLocalStorage<CacheContext>;
}

const CACHE = (globalThis.CACHE ??= new AsyncLocalStorage<CacheContext>());

export type CacheLength =
  | "default"
  | "never"
  | "seconds"
  | "minutes"
  | "hours"
  | "days"
  | "weeks"
  | "max";

const SECOND = 1;
const MINUTE = 60 * SECOND;
const FIVE_MINUTES = 5 * MINUTE;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;
const WEEK = 7 * DAY;
const YEAR = 365 * DAY;

const cacheLengths = {
  default: [FIVE_MINUTES, 15 * MINUTE, YEAR],
  never: [0, 0, 0],
  seconds: [0, SECOND, SECOND],
  minutes: [FIVE_MINUTES, MINUTE, HOUR],
  hours: [FIVE_MINUTES, HOUR, DAY],
  days: [FIVE_MINUTES, DAY, WEEK],
  weeks: [FIVE_MINUTES, WEEK, 30 * DAY],
  max: [FIVE_MINUTES, 30 * DAY, YEAR],
} satisfies Record<
  CacheLength,
  [stale: number, revalidate: number, expires: number]
>;

export function getCacheLength(length: CacheLength) {
  if (!cacheLengths[length]) {
    throw new Error(`Invalid cache length: ${length}`);
  }

  return cacheLengths[length];
}

export function cacheRoute(duration: CacheLength = "default") {
  const ctx = CACHE.getStore();
  if (!ctx) {
    console.warn("Cache not provided, did you forget to call provideCache?");
    return;
  }
  if (ctx.duration === "never") return;

  const current = ctx.duration
    ? getCacheLength(ctx.duration)
    : ([, Number.MAX_SAFE_INTEGER] as const);
  const next = getCacheLength(duration);

  if (next[1] < current[1]) {
    ctx.duration = duration;
  }
}

export function provideCache(request: Request, cb: () => Promise<Response>) {
  const ctx: CacheContext = {};
  return CACHE.run(ctx, async () => {
    const response = await cb();

    if (
      !(request.method === "GET" || request.method === "HEAD") ||
      !ctx.duration ||
      ctx.duration === "never"
    )
      return response;

    const headers = new Headers(response.headers);

    const [stale, revalidate, expires] = getCacheLength(ctx.duration);
    if (import.meta.env.PROD && stale > 0) {
      headers.append("Cache-Control", `public, max-age=${stale}, no-cache`);
    }
    if (revalidate > 0 || expires > 0) {
      headers.append(
        "Vercel-CDN-Cache-Control",
        `public, s-maxage=${revalidate}, stale-while-revalidate=${expires}`
      );
    }

    if (
      Array.from(headers.keys()).length >
      Array.from(response.headers.keys()).length
    ) {
      return new Response(response.body, {
        headers,
        status: response.status,
        statusText: response.statusText,
      });
    }

    return response;
  });
}
