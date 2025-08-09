import * as fs from "node:fs";
import * as path from "node:path";

import tailwindcss from "@tailwindcss/vite";
import { getTransformedRoutes } from "@vercel/routing-utils";
import react from "@vitejs/plugin-react";
import rsc from "@vitejs/plugin-rsc/plugin";
import { $ } from "execa";
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

declare global {
  var ADDED_ASSETS: boolean | undefined;
  var DID_CLEAN_UP: boolean | undefined;
}

export default defineConfig(({ command }) => ({
  environments: {
    client: {
      build: {
        outDir: ".vercel/output/static",
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
        rsc: command === "build" ? "server.ts" : "src/entry.rsc.tsx",
        ssr: "src/entry.ssr.tsx",
      },
    }),
    devtoolsJson(),
    {
      name: "vercel",
      buildStart() {
        if (!global.DID_CLEAN_UP) {
          global.DID_CLEAN_UP = true;
          fs.rmSync(".vercel/output", { recursive: true, force: true });
        }
      },
      configEnvironment(environment, config) {
        if (environment === "client") {
          config.build ??= {};
          config.build.outDir = ".vercel/output/static";
        }

        if (environment === "rsc") {
          config.build ??= {};
          config.build.outDir = ".vercel/output/functions/rsc.func";
          config.build.emptyOutDir = false;
        }
        if (environment === "ssr") {
          config.build ??= {};
          config.build.outDir = ".vercel/output/functions/rsc.func/ssr";
          config.build.emptyOutDir = false;
        }

        return config;
      },
      async buildEnd() {
        if (global.ADDED_ASSETS) return;
        global.ADDED_ASSETS = true;

        fs.mkdirSync(".vercel/output", { recursive: true });

        const { routes } = getTransformedRoutes({
          headers: [
            {
              source: "/assets/(.*)",
              headers: [
                {
                  key: "Cache-Control",
                  value: "public, max-age=31536000, immutable",
                },
              ],
            },
          ],
          rewrites: [
            {
              source: "/(.*)",
              destination: "/rsc",
            },
          ],
        });

        fs.writeFileSync(
          ".vercel/output/config.json",
          JSON.stringify(
            {
              version: 3,
              routes,
            },
            null,
            2
          )
        );

        fs.mkdirSync(".vercel/output/functions/rsc.func", {
          recursive: true,
        });
        fs.writeFileSync(
          `.vercel/output/functions/rsc.func/.vc-config.json`,
          JSON.stringify(
            {
              runtime: "nodejs22.x",
              handler: "index.js",
              launcherType: "Nodejs",
            },
            null,
            2
          )
        );
        fs.cpSync(
          "pnpm-lock.yaml",
          ".vercel/output/functions/rsc.func/pnpm-lock.yaml"
        );
        fs.writeFileSync(
          ".vercel/output/functions/rsc.func/pnpm-workspace.yaml",
          "symlink: false\nnodeLinker: hoisted\n"
        );

        const { dependencies, devDependencies } = JSON.parse(
          fs.readFileSync("package.json", "utf-8")
        );
        fs.writeFileSync(
          ".vercel/output/functions/rsc.func/package.json",
          JSON.stringify(
            {
              private: true,
              type: "module",
              dependencies,
              devDependencies,
            },
            null,
            2
          )
        );

        // Run pnpm install --prod --prefer-offline inside the rsc.func directory
        await $({
          cwd: path.resolve(".vercel/output/functions/rsc.func"),
          stderr: "inherit",
          stdout: "inherit",
        })`pnpm install --prod --prefer-offline`;
      },
    },
  ],
}));
