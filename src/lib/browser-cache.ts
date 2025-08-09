import { unstable_getRSCStream as getRSCStream } from "react-router";

// Generate a unique cache ID for this session/tab
const CACHE_ID = `cachedFetch_${crypto.randomUUID()}`;

let cacheInstance: Cache | null = null;

declare global {
  interface Window {
    _cachedInitialPage?: boolean;
  }
}

const initialURL = new URL(window.location.href);
initialURL.pathname =
  initialURL.pathname === "/" ? "_root.rsc" : `${initialURL.pathname}.rsc`;
if (!window._cachedInitialPage) {
  window._cachedInitialPage = true;

  getCache()
    .then((cache) => {
      const body = getRSCStream();

      return cache.put(new Request(initialURL), new Response(body));
    })
    .catch((error) => {
      console.error("Failed to cache initial page:", error);
    });
}

async function getCache(): Promise<Cache> {
  if (!cacheInstance) {
    cacheInstance = await caches.open(CACHE_ID);
  }
  return cacheInstance;
}

async function bustCache(): Promise<void> {
  try {
    await caches.delete(CACHE_ID);
    cacheInstance = null; // Reset the instance so it gets recreated
  } catch (error) {
    console.warn("Failed to bust cache:", error);
  }
}

async function cleanupCache(): Promise<void> {
  try {
    await caches.delete(CACHE_ID);
  } catch (error) {
    console.warn("Failed to cleanup cache on tab close:", error);
  }
}

// Clean up cache when tab is closed
if (typeof window !== "undefined") {
  window.addEventListener("beforeunload", () => {
    // Note: beforeunload has limited time, so we use the synchronous approach
    // The cleanup will happen, but we can't await it
    cleanupCache();
  });

  // Also clean up on page hide (better for mobile)
  window.addEventListener("pagehide", () => {
    cleanupCache();
  });

  // Clean up on visibility change (when tab becomes hidden)
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "hidden") {
      cleanupCache();
    }
  });
}

function createCacheKey(
  request: RequestInfo | URL,
  init?: RequestInit
): Request {
  return new Request(request, init);
}

export async function cachedFetch(
  input: RequestInfo | URL,
  init?: RequestInit
): Promise<Response> {
  // Create a Request object to easily access method and other properties
  const request = new Request(input, init);
  const method = request.method.toUpperCase();

  // If it's a POST request, bust the cache and make the request
  if (method === "POST") {
    await bustCache();
    return fetch(request);
  }

  // If it's not a GET request, just make the request without caching
  if (method !== "GET") {
    return fetch(request);
  }

  // Handle GET requests with caching
  const cache = await getCache();
  const cacheKey = createCacheKey(input, init);

  // Check if we have a cached response
  const cachedResponse = await cache.match(cacheKey);
  if (cachedResponse) {
    // Return a clone to avoid consuming the cached response
    return cachedResponse.clone();
  }

  // Make the request
  const response = await fetch(request);

  // Only cache successful responses
  if (response.ok) {
    try {
      // Clone the response before caching to avoid consuming it
      await cache.put(cacheKey, response.clone());
    } catch (error) {
      console.warn("Failed to cache response:", error);
    }
  }

  return response;
}

// // Utility function to manually clear the cache (optional)
export async function clearCachedFetch(): Promise<void> {
  await bustCache();
}
