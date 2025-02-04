import { initTRPC } from "@trpc/server";
import { z } from "zod";

export const t = initTRPC.create();

export const router = t.router;
export const publicProcedure = t.procedure;

export const appRouter = router({
  hello: publicProcedure
    .input(z.object({ name: z.string() }))
    .query(({ input }) => {
      return {
        name: input.name,
        message: "Hello World",
      };
    }),
});

export type AppRouter = typeof appRouter;
