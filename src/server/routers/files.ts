import { z } from 'zod';
import { db } from '@/lib/db';
import { createDownloadUrl, deleteFile, uploadFile } from '@/lib/files';
import { protectedProcedure, router } from '../trpc';

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
        userId: ctx.userId,
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

    // Get user's files
    const files = await db
      .selectFrom('files')
      .where('updatedByUserId', '=', ctx.userId)
      .where('status', '=', 'uploaded')
      .selectAll()
      .orderBy('createdAt', 'desc')
      .execute();

    return { files };
  }),
});
