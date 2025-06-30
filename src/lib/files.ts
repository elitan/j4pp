import { env } from '@/env';
import { db } from '@/lib/db';
import type { Files } from '@/lib/db-types';
import type { Selectable } from 'kysely';
import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

// S3 Client configuration
const s3Client = new S3Client({
  region: env.S3_REGION,
  credentials: {
    accessKeyId: env.S3_ACCESS_KEY_ID,
    secretAccessKey: env.S3_SECRET_ACCESS_KEY,
  },
});

const BUCKET_NAME = env.S3_BUCKET_NAME;

export interface FileUpload {
  filename: string;
  mimeType: string;
  size: number;
  buffer: Buffer;
  userId: number;
}

// Use the generated Files type for selected records
export type FileRecord = Selectable<Files>;

/**
 * Upload a file to S3 and create database record
 * This is the main upload method - all files go through the backend
 */
export async function uploadFile(upload: FileUpload) {
  // First create the database record to get the UUID
  const fileRecord = await db
    .insertInto('files')
    .values({
      filename: upload.filename,
      mimeType: upload.mimeType,
      size: upload.size,
      status: 'uploading',
    })
    .returningAll()
    .executeTakeFirst();

  if (!fileRecord) {
    throw new Error('Failed to create file record');
  }

  // Upload to S3 using the file ID as the key
  const uploadCommand = new PutObjectCommand({
    Bucket: BUCKET_NAME,
    Key: fileRecord.id,
    Body: upload.buffer,
    ContentType: upload.mimeType,
    Metadata: {
      originalFilename: upload.filename,
      userId: upload.userId.toString(),
    },
  });

  const result = await s3Client.send(uploadCommand);

  // Update the file record with success status and etag
  const updatedRecord = await db
    .updateTable('files')
    .set({
      status: 'uploaded',
      etag: result.ETag?.replace(/"/g, ''), // Remove quotes from etag
      updatedAt: new Date(),
    })
    .where('id', '=', fileRecord.id)
    .returningAll()
    .executeTakeFirst();

  if (!updatedRecord) {
    throw new Error('Failed to update file record');
  }

  return updatedRecord;
}

/**
 * Create a presigned download URL for secure file access
 */
export async function createDownloadUrl(
  fileId: string,
  expiresIn: number = 3600,
): Promise<string> {
  // Verify user has access to the file
  const fileRecord = await db
    .selectFrom('files')
    .where('id', '=', fileId)
    .where('status', '=', 'uploaded')
    .selectAll()
    .executeTakeFirst();

  if (!fileRecord) {
    throw new Error('File not found or access denied');
  }

  const command = new GetObjectCommand({
    Bucket: BUCKET_NAME,
    Key: fileId,
    ResponseContentDisposition: `attachment; filename="${fileRecord.filename}"`,
  });

  return await getSignedUrl(s3Client, command, { expiresIn });
}

/**
 * Delete a file from both S3 and database
 */
export async function deleteFile(fileId: string): Promise<void> {
  // Verify user owns the file
  const fileRecord = await db
    .selectFrom('files')
    .where('id', '=', fileId)
    .selectAll()
    .executeTakeFirst();

  if (!fileRecord) {
    throw new Error('File not found or access denied');
  }

  // Delete from S3
  const deleteCommand = new DeleteObjectCommand({
    Bucket: BUCKET_NAME,
    Key: fileId,
  });

  await s3Client.send(deleteCommand);

  // Delete from database
  await db.deleteFrom('files').where('id', '=', fileId).execute();
}
