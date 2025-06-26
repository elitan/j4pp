import { z } from 'zod';
import { publicProcedure, protectedProcedure, router } from '../trpc';

export const appRouter = router({
  // Public procedure - anyone can call this
  hello: publicProcedure
    .input(
      z.object({
        text: z.string(),
      }),
    )
    .query((opts) => {
      return {
        greeting: `hello ${opts.input.text}`,
      };
    }),

  // Protected procedure - requires authentication
  getProfile: protectedProcedure.query(async ({ ctx }) => {
    return {
      userId: ctx.userId,
      message: `This is private data for user: ${ctx.userId}`,
      timestamp: new Date().toISOString(),
    };
  }),

  // Protected mutation example
  updateProfile: protectedProcedure
    .input(
      z.object({
        name: z.string().min(1, 'Name is required'),
        bio: z.string().optional(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      // In a real app, you'd save this to a database
      return {
        success: true,
        userId: ctx.userId,
        updatedData: input,
        message: `Profile updated for user: ${ctx.userId}`,
      };
    }),
});

// export type definition of API
export type AppRouter = typeof appRouter;
