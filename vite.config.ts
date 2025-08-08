import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import rsc from "@vitejs/plugin-rsc/plugin";
import { defineConfig, normalizePath } from "vite";
import devtoolsJson from "vite-plugin-devtools-json";
import tsconfigPaths from "vite-tsconfig-paths";

const manualChunks: Record<string, string> = {
  react: "react",
  "react-dom": "react",
  "@vitejs/plugin-rsc": "react",
  "react-router": "react-router",
  "@conform-to/dom": "validation",
  "@conform-to/react": "validation",
  "@conform-to/zod": "validation",
  zod: "validation",
};

export default defineConfig({
  environments: {
    client: {
      build: {
        rollupOptions: {
          output: {
            manualChunks(id) {
              if (id.includes("node_modules")) {
                const normalized = normalizePath(id);
                const lastIndex = normalized.lastIndexOf("node_modules/");
                const mod = normalized.slice(
                  lastIndex + "node_modules/".length
                );
                const [first, second] = mod.split("/");
                const pkg = first.startsWith("@")
                  ? `${first}/${second}`
                  : first;
                if (manualChunks[pkg]) {
                  return manualChunks[pkg];
                }
              }
            },
          },
        },
      },
      optimizeDeps: {
        include: [
          "@conform-to/react",
          "@conform-to/zod/v4",
          "react",
          "react-router",
          "react-router/internal/react-server-client",
        ],
      },
    },
  },
  plugins: [
    tsconfigPaths(),
    tailwindcss(),
    react(),
    rsc({
      entries: {
        client: "src/entry.browser.tsx",
        rsc: "src/entry.rsc.tsx",
        ssr: "src/entry.ssr.tsx",
      },
    }),
    devtoolsJson(),
  ],
});
