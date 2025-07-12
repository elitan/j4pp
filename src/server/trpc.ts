import { initTRPC, TRPCError } from '@trpc/server';
import { auth } from '@/lib/auth';
import type { NextRequest } from 'next/server';

// Define the context type
interface CreateContextOptions {
  req: NextRequest;
}

// Create context function that includes Better Auth
export async function createTRPCContext(opts: CreateContextOptions) {
  const session = await auth.api.getSession({
    headers: opts.req.headers,
  });

  return {
    session,
    userId: session?.user?.id,
    user: session?.user,
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
  if (!ctx.userId) {
    throw new TRPCError({ code: 'UNAUTHORIZED' });
  }

  return next({
    ctx: {
      ...ctx,
      userId: ctx.userId,
      user: ctx.user,
    },
  });
});
