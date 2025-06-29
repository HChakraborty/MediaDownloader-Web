import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import tailwindcss from "@tailwindcss/vite";

const ReactCompilerConfig = {
  /* ... */
};

export default defineConfig(({ mode }) => {

  const isProd = mode === "production";

  return {
    plugins: [
      react({
        babel: {
          plugins: [["babel-plugin-react-compiler", ReactCompilerConfig]],
        },
      }),
      tailwindcss(),
    ],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    server: {
      proxy: !isProd
        ? {
            "/api/openverse": {
              target: "https://api.openverse.org/v1/images/",
              changeOrigin: true,
              rewrite: (path) => path.replace(/^\/api\/openverse/, ""),
            },
          }
        : undefined, // No proxy in production — use actual API
    },
  };
});
