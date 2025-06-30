import { env } from "@/env";
import { CamelCasePlugin, Kysely, PostgresDialect } from 'kysely';
import { Pool } from 'pg';
import type { DB } from './db-types';

const globalForDb = globalThis as unknown as {
  db: Kysely<DB> | undefined;
};

const createDatabase = (): Kysely<DB> => {
  const dialect = new PostgresDialect({
    pool: new Pool({
      connectionString: env.DATABASE_URL,
    }),
  });

  return new Kysely<DB>({
    dialect,
    plugins: [new CamelCasePlugin()],
  });
};

export const db = globalForDb.db ?? createDatabase();

if (env.NODE_ENV !== 'production') globalForDb.db = db;
