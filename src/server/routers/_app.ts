import { z } from 'zod';
import { publicProcedure, protectedProcedure, router } from '../trpc';

export const appRouter = router({
  getPublic: publicProcedure.query(() => {
    return {
      message: 'This is public data - anyone can see this!',
      timestamp: new Date().toISOString(),
    };
  }),

  getProtected: protectedProcedure.query(async ({ ctx }) => {
    return {
      message: `This is private data for user: ${ctx.userId}`,
      timestamp: new Date().toISOString(),
      userData: {
        userId: ctx.userId,
        role: 'premium',
        subscription: 'active',
        lastLogin: new Date().toISOString(),
      },
    };
  }),

  getProfile: protectedProcedure.query(async ({ ctx }) => {
    return {
      userId: ctx.userId,
      message: `This is private data for user: ${ctx.userId}`,
      timestamp: new Date().toISOString(),
    };
  }),

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
