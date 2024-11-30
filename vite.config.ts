// vite.config.ts

import * as path from "path";
import * as url from "url";

import { defineConfig } from "vite";
import { viteStaticCopy } from "vite-plugin-static-copy";

import dts from "vite-plugin-dts";

const PYODIDE_INCLUDE = [
  "package.json",
  "pyodide.asm.js",
  "pyodide.asm.wasm",
  "pyodide.js",
  "pyodide.js.map",
  "pyodide.mjs",
  "pyodide.mjs.map",
  "pyodide-lock.json",
  "python_stdlib.zip",
];

export function viteStaticCopyPyodide() {
  const pyodideDir = path.dirname(url.fileURLToPath(import.meta.resolve("pyodide")));

  return viteStaticCopy({
    targets: [
      ...PYODIDE_INCLUDE.map((item) => {
        return {
          src: path.join(pyodideDir, item).replace(/\\/g, '/'),
          dest: "assets",
        }
      }),

    ],
  });
}

export default defineConfig({
  build: {
    lib: {
      entry: path.resolve(__dirname, "src/index.tsx"),
      name: "index",
      fileName: "index",
    },
    rollupOptions: {
      external: ["react", "react-dom"],
      output: {
        globals: {
          react: "React",
        },
      },
    },
    commonjsOptions: {
      esmExternals: ["react"],
    },
  },
  plugins: [
    dts({
      rollupTypes: true,
      tsconfigPath: "./tsconfig.app.json",
    }),
    // viteStaticCopyPyodide(),
  ],
  resolve: {
    dedupe: ['react', 'react-dom'],
    alias: [
      {
        find: "@components",
        replacement: path.resolve(__dirname, "src/components"),
      },
      {
        find: "@contexts",
        replacement: path.resolve(__dirname, "src/contexts"),
      },
      {
        find: "@metadata",
        replacement: path.resolve(__dirname, "src/metadata"),
      },
      {
        find: "@utils",
        replacement: path.resolve(__dirname, "src/utils"),
      },
    ],
  },
  // optimizeDeps: {
  //   exclude: ["pyodide"],
  // }
});