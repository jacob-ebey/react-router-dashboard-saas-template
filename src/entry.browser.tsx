import {
  createFromReadableStream,
  createTemporaryReferenceSet,
  encodeReply,
  setServerCallback,
} from "@vitejs/plugin-rsc/browser";
import { startTransition, StrictMode } from "react";
import { hydrateRoot } from "react-dom/client";
import {
  unstable_createCallServer as createCallServer,
  unstable_getRSCStream as getRSCStream,
  unstable_RSCHydratedRouter as RSCHydratedRouter,
  type unstable_RSCPayload as RSCServerPayload,
  type DataRouter,
} from "react-router";

import { cachedFetch, clearCachedFetch } from "@/lib/browser-cache";

// Create and set the callServer function to support post-hydration server actions.
setServerCallback(
  createCallServer({
    createFromReadableStream,
    createTemporaryReferenceSet,
    encodeReply,
    fetch: cachedFetch,
  })
);

// Get and decode the initial server payload
createFromReadableStream<RSCServerPayload>(getRSCStream()).then((payload) => {
  startTransition(async () => {
    const formState =
      payload.type === "render" ? await payload.formState : undefined;

    hydrateRoot(
      document,
      <StrictMode>
        <RSCHydratedRouter
          createFromReadableStream={createFromReadableStream}
          fetch={cachedFetch}
          payload={payload}
        />
      </StrictMode>,
      {
        // @ts-expect-error - no types for this yet
        formState,
      }
    );
  });
});

if (import.meta.hot) {
  import.meta.hot.on("rsc:update", () => {
    clearCachedFetch().finally(() => {
      (window as unknown as { __router: DataRouter }).__router.revalidate();
    });
  });
}
