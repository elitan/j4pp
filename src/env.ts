import { createEnv } from '@t3-oss/env-nextjs';
import { z } from 'zod';

export const env = createEnv({
  server: {
    NODE_ENV: z.string().min(1),
    DATABASE_URL: z.string().url(),
    S3_REGION: z.string().min(1).default('us-east-1'),
    S3_ACCESS_KEY_ID: z.string().min(1).default('tmp'),
    S3_SECRET_ACCESS_KEY: z.string().min(1).default('tmp'),
    S3_BUCKET_NAME: z.string().min(1).default('tmp'),
    VERCEL_URL: z.string().optional(),
    PORT: z.string().optional(),
  },
  client: {
    // Nothing here just yet
  },
  runtimeEnv: {
    NODE_ENV: process.env.NODE_ENV,
    DATABASE_URL: process.env.DATABASE_URL,
    S3_REGION: process.env.S3_REGION,
    S3_ACCESS_KEY_ID: process.env.S3_ACCESS_KEY_ID,
    S3_SECRET_ACCESS_KEY: process.env.S3_SECRET_ACCESS_KEY,
    S3_BUCKET_NAME: process.env.S3_BUCKET_NAME,
    VERCEL_URL: process.env.VERCEL_URL,
    PORT: process.env.PORT,
  },
});
