import { Hono } from "hono";
import { serve } from "@hono/node-server";
import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { appRouter } from "./trpc";
import { cors } from "hono/cors";

const app = new Hono();
app.use("/*", cors());

app.use("/trpc/*", async (c) => {
  const res = await fetchRequestHandler({
    endpoint: "/trpc",
    req: c.req.raw,
    router: appRouter,
    createContext: () => ({}),
  });
  return res;
});

const port = 3001;
console.log(`Server running at http://localhost:${port}`);
serve({ fetch: app.fetch, port });
