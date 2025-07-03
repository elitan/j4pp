import { z } from 'zod';
import { router, protectedProcedure } from '../trpc';
import { db } from '@/lib/db';

export const todosRouter = router({
  // Get all todos for the current user
  list: protectedProcedure.query(async ({ ctx }) => {
    // First, get or create the user in our database
    let user = await db
      .selectFrom('users')
      .selectAll()
      .where('clerkUserId', '=', ctx.userId)
      .executeTakeFirst();

    if (!user) {
      // Create user if they don't exist
      user = await db
        .insertInto('users')
        .values({
          clerkUserId: ctx.userId,
        })
        .returning(['id', 'clerkUserId'])
        .executeTakeFirstOrThrow();

      return [];
    }

    // Get todos for the user
    const todos = await db
      .selectFrom('todos')
      .selectAll()
      .where('userId', '=', user.id)
      .orderBy('createdAt', 'desc')
      .execute();

    return todos;
  }),

  // Add a new todo
  add: protectedProcedure
    .input(
      z.object({
        title: z.string().min(1, 'Title is required'),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      // Get or create the user in our database
      let user = await db
        .selectFrom('users')
        .selectAll()
        .where('clerkUserId', '=', ctx.userId)
        .executeTakeFirst();

      if (!user) {
        // Create user if they don't exist
        user = await db
          .insertInto('users')
          .values({
            clerkUserId: ctx.userId,
          })
          .returning(['id', 'clerkUserId'])
          .executeTakeFirstOrThrow();
      }

      // Create the todo
      const todo = await db
        .insertInto('todos')
        .values({
          userId: user.id,
          title: input.title,
        })
        .returning(['id', 'title', 'completed', 'createdAt'])
        .executeTakeFirstOrThrow();

      return todo;
    }),

  // Delete a todo
  delete: protectedProcedure
    .input(
      z.object({
        id: z.number(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      // Get the user in our database
      const user = await db
        .selectFrom('users')
        .selectAll()
        .where('clerkUserId', '=', ctx.userId)
        .executeTakeFirst();

      if (!user) {
        throw new Error('User not found');
      }

      // Delete the todo (only if it belongs to the user)
      const result = await db
        .deleteFrom('todos')
        .where('id', '=', input.id)
        .where('userId', '=', user.id)
        .executeTakeFirst();

      if (result.numDeletedRows === BigInt(0)) {
        throw new Error('Todo not found or not authorized');
      }

      return { success: true };
    }),

  // Toggle todo completion
  toggle: protectedProcedure
    .input(
      z.object({
        id: z.number(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      // Get the user in our database
      const user = await db
        .selectFrom('users')
        .selectAll()
        .where('clerkUserId', '=', ctx.userId)
        .executeTakeFirst();

      if (!user) {
        throw new Error('User not found');
      }

      // Get the current todo
      const todo = await db
        .selectFrom('todos')
        .selectAll()
        .where('id', '=', input.id)
        .where('userId', '=', user.id)
        .executeTakeFirst();

      if (!todo) {
        throw new Error('Todo not found or not authorized');
      }

      // Toggle the completion status
      const updatedTodo = await db
        .updateTable('todos')
        .set({
          completed: !todo.completed,
          updatedAt: new Date(),
        })
        .where('id', '=', input.id)
        .where('userId', '=', user.id)
        .returning(['id', 'title', 'completed', 'createdAt'])
        .executeTakeFirstOrThrow();

      return updatedTodo;
    }),
});
