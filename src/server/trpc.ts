import { initTRPC, TRPCError } from '@trpc/server';
import { getAuth } from '@clerk/nextjs/server';
import type { NextRequest } from 'next/server';

// Define the context type
interface CreateContextOptions {
  req: NextRequest;
}

// Create context function that includes Clerk auth
export async function createTRPCContext(opts: CreateContextOptions) {
  const auth = getAuth(opts.req);

  return {
    auth,
    userId: auth.userId,
  };
}

export type Context = Awaited<ReturnType<typeof createTRPCContext>>;

// Initialize tRPC with context
const t = initTRPC.context<Context>().create();

// Base router and procedure helpers
export const router = t.router;
export const publicProcedure = t.procedure;

// Protected procedure that requires authentication
export const protectedProcedure = t.procedure.use(async ({ ctx, next }) => {
  if (!ctx.auth.userId) {
    throw new TRPCError({ code: 'UNAUTHORIZED' });
  }

  return next({
    ctx: {
      ...ctx,
      auth: ctx.auth,
      userId: ctx.auth.userId, // Now we know userId is not null
    },
  });
});
