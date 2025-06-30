import { z } from 'zod';
import { protectedProcedure, router } from '../trpc';
import { uploadFile, createDownloadUrl, deleteFile } from '@/lib/files';
import { db } from '@/lib/db';

export const filesRouter = router({
  upload: protectedProcedure
    .input(
      z.object({
        filename: z.string().min(1, 'Filename is required'),
        mimeType: z.string().min(1, 'MIME type is required'),
        size: z.number().positive('File size must be positive'),
        data: z.string().min(1, 'File data is required'), // base64 encoded file data
      }),
    )
    .mutation(async ({ input, ctx }) => {
      if (!ctx.userId) {
        throw new Error('User not authenticated');
      }

      // First, ensure the user exists in our database
      let user = await db
        .selectFrom('users')
        .where('clerkUserId', '=', ctx.userId)
        .select('id')
        .executeTakeFirst();

      if (!user) {
        // Create user if they don't exist
        user = await db
          .insertInto('users')
          .values({ clerkUserId: ctx.userId })
          .returning('id')
          .executeTakeFirst();
      }

      if (!user) {
        throw new Error('Failed to create or find user');
      }

      // Decode base64 data to buffer
      const buffer = Buffer.from(input.data, 'base64');

      // Validate that the decoded size matches the expected size
      if (buffer.length !== input.size) {
        throw new Error('File size mismatch');
      }

      // Upload the file using the files lib
      const fileRecord = await uploadFile({
        filename: input.filename,
        mimeType: input.mimeType,
        size: input.size,
        buffer,
        userId: user.id,
      });

      return {
        success: true,
        file: fileRecord,
        message: 'File uploaded successfully',
      };
    }),

  getDownloadUrl: protectedProcedure
    .input(
      z.object({
        fileId: z.string().uuid('Invalid file ID'),
        expiresIn: z.number().positive().default(3600), // 1 hour default
      }),
    )
    .mutation(async ({ input }) => {
      const downloadUrl = await createDownloadUrl(
        input.fileId,
        input.expiresIn,
      );

      return {
        downloadUrl,
        expiresIn: input.expiresIn,
      };
    }),

  delete: protectedProcedure
    .input(
      z.object({
        fileId: z.string().uuid('Invalid file ID'),
      }),
    )
    .mutation(async ({ input }) => {
      await deleteFile(input.fileId);

      return {
        success: true,
        message: 'File deleted successfully',
      };
    }),

  getUserFiles: protectedProcedure.query(async ({ ctx }) => {
    if (!ctx.userId) {
      throw new Error('User not authenticated');
    }

    // Get user from database
    const user = await db
      .selectFrom('users')
      .where('clerkUserId', '=', ctx.userId)
      .select('id')
      .executeTakeFirst();

    if (!user) {
      return { files: [] };
    }

    // Get user's files
    const files = await db
      .selectFrom('files')
      .where('updatedByUserId', '=', user.id)
      .where('status', '=', 'uploaded')
      .selectAll()
      .orderBy('createdAt', 'desc')
      .execute();

    return { files };
  }),
});
