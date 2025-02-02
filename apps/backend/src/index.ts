import { Hono } from "hono";
import { serve } from "@hono/node-server";
import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { appRouter } from "./trpc";
import { serveStatic } from "@hono/node-server/serve-static";
import { logger } from "hono/logger";

const app = new Hono();

app.use("*", logger());

app.use("/api/trpc/*", async (c) => {
  const res = await fetchRequestHandler({
    endpoint: "/api/trpc",
    req: c.req.raw,
    router: appRouter,
    createContext: () => ({}),
  });
  return res;
});

app.use("/static/*", serveStatic({ root: "./static" }));
app.get("*", serveStatic({ path: "./dist/index.html" }));

const port = 3001;
console.log(`Server running at http://localhost:${port}`);
serve({ fetch: app.fetch, port });
