import { z } from 'zod';
import { db } from '@/lib/db';
import { protectedProcedure, router } from '../trpc';

export const todosRouter = router({
  // Get all todos for the current user
  list: protectedProcedure.query(async ({ ctx }) => {
    // With Better Auth, ctx.userId is the actual user ID from the user table
    const todos = await db
      .selectFrom('todos')
      .selectAll()
      .where('userId', '=', ctx.userId!)
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
      // Create the todo
      const todo = await db
        .insertInto('todos')
        .values({
          userId: ctx.userId!,
          title: input.title,
          completed: false,
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
      // Delete the todo (only if it belongs to the user)
      const result = await db
        .deleteFrom('todos')
        .where('id', '=', input.id)
        .where('userId', '=', ctx.userId!)
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
      // Get the current todo
      const todo = await db
        .selectFrom('todos')
        .selectAll()
        .where('id', '=', input.id)
        .where('userId', '=', ctx.userId!)
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
        .where('userId', '=', ctx.userId!)
        .returning(['id', 'title', 'completed', 'createdAt'])
        .executeTakeFirstOrThrow();

      return updatedTodo;
    }),
});
