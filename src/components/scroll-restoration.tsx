"use client";

import * as React from "react";
import {
  UNSAFE_DataRouterContext,
  UNSAFE_DataRouterStateContext,
  UNSAFE_NavigationContext,
  useLocation,
  useMatches,
  useNavigation,
  type GetScrollRestorationKeyFunction,
  type Location,
  type ScriptsProps,
  type UIMatch,
} from "react-router";

export type ScrollRestorationProps = ScriptsProps & {
  /**
   * A function that returns a key to use for scroll restoration. This is useful
   * for custom scroll restoration logic, such as using only the pathname so
   * that later navigations to prior paths will restore the scroll. Defaults to
   * `location.key`. See {@link GetScrollRestorationKeyFunction}.
   *
   * ```tsx
   * <ScrollRestoration
   *   getKey={(location, matches) => {
   *     // Restore based on a unique location key (default behavior)
   *     return location.key
   *
   *     // Restore based on pathname
   *     return location.pathname
   *   }}
   * />
   * ```
   */
  getKey?: GetScrollRestorationKeyFunction;

  scrollRef?: React.Ref<HTMLElement>;

  /**
   * The key to use for storing scroll positions in [`sessionStorage`](https://developer.mozilla.org/en-US/docs/Web/API/Window/sessionStorage).
   * Defaults to `"react-router-scroll-positions"`.
   */
  storageKey?: string;
};

/**
 * Emulates the browser's scroll restoration on location changes. Apps should only render one of these, right before the {@link Scripts} component.
 *
 * ```tsx
 * import { ScrollRestoration } from "react-router";
 *
 * export default function Root() {
 *   return (
 *     <html>
 *       <body>
 *         <ScrollRestoration />
 *         <Scripts />
 *       </body>
 *     </html>
 *   );
 * }
 * ```
 *
 * This component renders an inline `<script>` to prevent scroll flashing. The `nonce` prop will be passed down to the script tag to allow CSP nonce usage.
 *
 * ```tsx
 * <ScrollRestoration nonce={cspNonce} />
 * ```
 *
 * @public
 * @category Components
 * @mode framework
 * @mode data
 * @param props Props
 * @param {ScrollRestorationProps.getKey} props.getKey n/a
 * @param {ScriptsProps.nonce} props.nonce n/a
 * @param {ScrollRestorationProps.ref} props.ref n/a
 * @param {ScrollRestorationProps.storageKey} props.storageKey n/a
 * @returns A [`<script>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/script)
 * tag that restores scroll positions on navigation.
 */
export function ScrollRestoration({
  getKey,
  scrollRef,
  storageKey,
  ...props
}: ScrollRestorationProps) {
  let { basename } = React.useContext(UNSAFE_NavigationContext);
  let location = useLocation();
  let matches = useMatches();
  useScrollRestoration({ getKey, scrollRef, storageKey });

  // In order to support `getKey`, we need to compute a "key" here so we can
  // hydrate that up so that SSR scroll restoration isn't waiting on React to
  // hydrate. *However*, our key on the server is not the same as our key on
  // the client!  So if the user's getKey implementation returns the SSR
  // location key, then let's ignore it and let our inline <script> below pick
  // up the client side history state key
  let ssrKey = React.useMemo(
    () => {
      if (!getKey) return null;
      let userKey = getScrollRestorationKey(
        location,
        matches,
        basename,
        getKey
      );
      return userKey !== location.key ? userKey : null;
    },
    // Nah, we only need this the first time for the SSR render
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  // In SPA Mode, there's nothing to restore on initial render since we didn't
  // render anything on the server
  //   if (!remixContext || remixContext.isSpaMode) {
  //     return null;
  //   }

  let restoreScroll = ((storageKey: string, restoreKey: string) => {
    if (!window.history.state || !window.history.state.key) {
      let key = Math.random().toString(32).slice(2);
      window.history.replaceState({ key }, "");
    }
    try {
      let positions = JSON.parse(sessionStorage.getItem(storageKey) || "{}");
      let storedY = positions[restoreKey || window.history.state.key];
      if (typeof storedY === "number") {
        const element =
          (typeof scrollRef === "object" && scrollRef && scrollRef.current) ||
          window;
        element.scrollTo(0, storedY);
      }
    } catch (error: unknown) {
      console.error(error);
      sessionStorage.removeItem(storageKey);
    }
  }).toString();

  return (
    <script
      {...props}
      suppressHydrationWarning
      dangerouslySetInnerHTML={{
        __html: `(${restoreScroll})(${JSON.stringify(
          storageKey || SCROLL_RESTORATION_STORAGE_KEY
        )}, ${JSON.stringify(ssrKey)})`,
      }}
    />
  );
}

const SCROLL_RESTORATION_STORAGE_KEY = "react-router-scroll-positions";
let savedScrollPositions: Record<string, number> = {};

function stripBasename(pathname: string, basename: string): string | null {
  if (basename === "/") return pathname;

  if (!pathname.toLowerCase().startsWith(basename.toLowerCase())) {
    return null;
  }

  // We want to leave trailing slash behavior in the user's control, so if they
  // specify a basename with a trailing slash, we should support it
  let startIndex = basename.endsWith("/")
    ? basename.length - 1
    : basename.length;
  let nextChar = pathname.charAt(startIndex);
  if (nextChar && nextChar !== "/") {
    // pathname does not start with basename/
    return null;
  }

  return pathname.slice(startIndex) || "/";
}

function getScrollRestorationKey(
  location: Location,
  matches: UIMatch[],
  basename: string,
  getKey?: GetScrollRestorationKeyFunction
) {
  let key: string | null = null;
  if (getKey) {
    if (basename !== "/") {
      key = getKey(
        {
          ...location,
          pathname:
            stripBasename(location.pathname, basename) || location.pathname,
        } as Location,
        matches
      );
    } else {
      key = getKey(location, matches);
    }
  }
  if (key == null) {
    key = location.key;
  }
  return key;
}

/**
 * When rendered inside a {@link RouterProvider}, will restore scroll positions
 * on navigations
 *
 * <!--
 * Not marked `@public` because we only export as UNSAFE_ and therefore we don't
 * maintain an .md file for this hook
 * -->
 *
 * @name UNSAFE_useScrollRestoration
 * @category Hooks
 * @mode framework
 * @mode data
 * @param options Options
 * @param options.getKey A function that returns a key to use for scroll restoration.
 * This is useful for custom scroll restoration logic, such as using only the pathname
 * so that subsequent navigations to prior paths will restore the scroll. Defaults
 * to `location.key`.
 * @param options.ref A ref to the element to restore scroll to. Defaults to `window`.
 * @param options.storageKey The key to use for storing scroll positions in
 * `sessionStorage`. Defaults to `"react-router-scroll-positions"`.
 * @returns {void}
 */
function useScrollRestoration({
  getKey,
  scrollRef,
  storageKey,
}: {
  getKey?: GetScrollRestorationKeyFunction;
  scrollRef?: React.Ref<HTMLElement>;
  storageKey?: string;
} = {}): void {
  let { router } = React.use(UNSAFE_DataRouterContext) ?? {};
  let { restoreScrollPosition, preventScrollReset } =
    React.use(UNSAFE_DataRouterStateContext) ?? {};
  let { basename } = React.use(UNSAFE_NavigationContext);
  let location = useLocation();
  let matches = useMatches();
  let navigation = useNavigation();

  // Trigger manual scroll restoration while we're active
  React.useEffect(() => {
    window.history.scrollRestoration = "manual";
    return () => {
      window.history.scrollRestoration = "auto";
    };
  }, []);

  // Save positions on pagehide
  usePageHide(
    React.useCallback(() => {
      const element =
        (typeof scrollRef === "object" && scrollRef && scrollRef.current) ||
        window;
      if (navigation.state === "idle") {
        let key = getScrollRestorationKey(location, matches, basename, getKey);
        savedScrollPositions[key] =
          "scrollY" in element ? element.scrollY : element.scrollTop;
      }
      try {
        sessionStorage.setItem(
          storageKey || SCROLL_RESTORATION_STORAGE_KEY,
          JSON.stringify(savedScrollPositions)
        );
      } catch (error) {
        console.warn(
          `Failed to save scroll positions in sessionStorage, <ScrollRestoration /> will not work properly (${error}).`
        );
      }
      window.history.scrollRestoration = "auto";
    }, [navigation.state, getKey, basename, location, matches, storageKey])
  );

  // Read in any saved scroll locations
  if (typeof document !== "undefined") {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    React.useLayoutEffect(() => {
      try {
        let sessionPositions = sessionStorage.getItem(
          storageKey || SCROLL_RESTORATION_STORAGE_KEY
        );
        if (sessionPositions) {
          savedScrollPositions = JSON.parse(sessionPositions);
        }
      } catch (e) {
        // no-op, use default empty object
      }
    }, [storageKey]);

    // Enable scroll restoration in the router
    // eslint-disable-next-line react-hooks/rules-of-hooks
    React.useLayoutEffect(() => {
      let disableScrollRestoration = router?.enableScrollRestoration(
        savedScrollPositions,
        () => {
          const element =
            (typeof scrollRef === "object" && scrollRef && scrollRef.current) ||
            window;
          return "scrollY" in element ? element.scrollY : element.scrollTop;
        },
        getKey
          ? (location, matches) =>
              getScrollRestorationKey(location, matches, basename, getKey)
          : undefined
      );
      return () => disableScrollRestoration && disableScrollRestoration();
    }, [router, basename, getKey]);

    // Restore scrolling when state.restoreScrollPosition changes
    // eslint-disable-next-line react-hooks/rules-of-hooks
    React.useLayoutEffect(() => {
      // Explicit false means don't do anything (used for submissions or revalidations)
      if (restoreScrollPosition === false) {
        return;
      }

      const element =
        (typeof scrollRef === "object" && scrollRef && scrollRef.current) ||
        window;

      // been here before, scroll to it
      if (typeof restoreScrollPosition === "number") {
        element.scrollTo(0, restoreScrollPosition);
        return;
      }

      // try to scroll to the hash
      try {
        if (location.hash) {
          let el = document.getElementById(
            decodeURIComponent(location.hash.slice(1))
          );
          if (el) {
            el.scrollIntoView();
            return;
          }
        }
      } catch {
        console.warn(
          `"${location.hash.slice(
            1
          )}" is not a decodable element ID. The view will not scroll to it.`
        );
      }

      // Don't reset if this navigation opted out
      if (preventScrollReset === true) {
        return;
      }

      // otherwise go to the top on new locations
      element.scrollTo(0, 0);
    }, [location, restoreScrollPosition, preventScrollReset]);
  }
}

/*
 * Setup a callback to be fired on the window's `pagehide` event. This is
 * useful for saving some data to `window.localStorage` just before the page
 * refreshes.  This event is better supported than beforeunload across browsers.
 *
 * Note: The `callback` argument should be a function created with
 * `React.useCallback()`.
 */
function usePageHide(
  callback: (event: PageTransitionEvent) => any,
  options?: { capture?: boolean }
): void {
  let { capture } = options || {};
  React.useEffect(() => {
    let opts = capture != null ? { capture } : undefined;
    window.addEventListener("pagehide", callback, opts);
    return () => {
      window.removeEventListener("pagehide", callback, opts);
    };
  }, [callback, capture]);
}
