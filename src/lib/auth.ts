import { betterAuth } from 'better-auth';
import { Pool } from 'pg';
import { env } from '@/env';

export const auth = betterAuth({
  database: new Pool({
    connectionString: env.DATABASE_URL,
  }),
  secret: env.BETTER_AUTH_SECRET,
  baseURL: env.BETTER_AUTH_URL,
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false,
  },
  // socialProviders: {
  //   github: {
  //     clientId: process.env.GITHUB_CLIENT_ID || "",
  //     clientSecret: process.env.GITHUB_CLIENT_SECRET || "",
  //   },
  //   google: {
  //     clientId: process.env.GOOGLE_CLIENT_ID || "",
  //     clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
  //   },
  // },
});

export type Session = typeof auth.$Infer.Session;
