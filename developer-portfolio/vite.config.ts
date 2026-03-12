/// <reference types="vite/client" />
import path from "path";
import { fileURLToPath } from "url";
import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/** Load GROQ_API_KEY from multiple places — many users put .env in repo root instead of developer-portfolio/.env */
function resolveGroqApiKey(mode: string): string {
  const dirs = [
    process.cwd(),
    __dirname,
    path.resolve(process.cwd(), ".."),
    path.resolve(__dirname, ".."),
  ];
  const seen = new Set<string>();
  for (const dir of dirs) {
    if (seen.has(dir)) continue;
    seen.add(dir);
    const env = loadEnv(mode, dir, "");
    if (env.GROQ_API_KEY && env.GROQ_API_KEY !== "your_groq_api_key_here") {
      return env.GROQ_API_KEY.trim();
    }
  }
  const fromProcess = process.env.GROQ_API_KEY?.trim();
  return fromProcess || "";
}

/**
 * Dev-only: Vite doesn't run Vercel api/*.js.
 * This middleware MUST run first and MUST NOT call next() for POST /api/chat,
 * otherwise the request falls through to Vite's SPA fallback (HTML) and fetch().json() throws.
 */
function apiChatDevPlugin() {
  return {
    name: "api-chat-dev",
    configureServer(server: import("vite").ViteDevServer) {
      const apiChatHandler = (
        req: import("http").IncomingMessage,
        res: import("http").ServerResponse,
        next: (err?: unknown) => void
      ) => {
        const url = req.url?.split("?")[0] || "";
        if (req.method !== "POST" || url !== "/api/chat") {
          return next();
        }

        const apiKey = resolveGroqApiKey(server.config.mode);

        const sendJson = (status: number, obj: object) => {
          if (res.writableEnded) return;
          res.statusCode = status;
          res.setHeader("Content-Type", "application/json; charset=utf-8");
          res.end(JSON.stringify(obj));
        };

        if (!apiKey) {
          return sendJson(503, {
            error:
              "Missing GROQ_API_KEY. Add to .env in developer-portfolio OR repo root: GROQ_API_KEY=gsk_... then restart npm run dev. https://console.groq.com",
          });
        }

        const chunks: Buffer[] = [];
        req.on("data", (chunk: Buffer) => chunks.push(chunk));
        req.on("end", async () => {
          try {
            const body = Buffer.concat(chunks).toString("utf8");
            const parsed = JSON.parse(body || "{}");
            const messages = parsed.messages;
            if (!messages || !Array.isArray(messages)) {
              return sendJson(400, { error: "Missing messages array in body" });
            }

            const groqRes = await fetch(
              "https://api.groq.com/openai/v1/chat/completions",
              {
                method: "POST",
                headers: {
                  Authorization: `Bearer ${apiKey}`,
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  messages,
                  model: "llama-3.3-70b-versatile",
                }),
              }
            );

            const text = await groqRes.text();
            let data: Record<string, unknown>;
            try {
              data = JSON.parse(text) as Record<string, unknown>;
            } catch {
              return sendJson(502, {
                error: "Groq returned non-JSON",
                details: text.slice(0, 200),
              });
            }

            if (!groqRes.ok) {
              const errMsg =
                (data.error as { message?: string })?.message ||
                (data.error as string) ||
                `Groq HTTP ${groqRes.status}`;
              return sendJson(502, { error: errMsg, details: data });
            }

            return sendJson(200, data);
          } catch (e) {
            const message = e instanceof Error ? e.message : String(e);
            return sendJson(500, { error: message });
          }
        });

        req.on("error", (err: Error) => {
          sendJson(500, { error: err.message || "Request error" });
        });

        // Do not call next() — we own the response when body ends
      };

      // Run first: prepend if stack exists, else use() (plugin order also matters — keep this plugin first)
      const stack = (server.middlewares as { stack?: unknown[] }).stack;
      if (Array.isArray(stack)) {
        stack.unshift({ route: "", handle: apiChatHandler });
      } else {
        server.middlewares.use(apiChatHandler);
      }
    },
  };
}

export default defineConfig({
  // apiChatDevPlugin first so POST /api/chat is handled before SPA fallback
  plugins: [apiChatDevPlugin(), react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          three: ["three", "three-stdlib"],
          "react-three": ["@react-three/fiber", "@react-three/drei"],
          gsap: ["gsap"],
          vendor: ["react", "react-dom", "react-router-dom"],
        },
      },
    },
    chunkSizeWarningLimit: 1000,
    minify: "terser",
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    },
  },
  optimizeDeps: {
    include: ["three", "gsap", "lenis"],
  },
});
