#!/usr/bin/env bun

import { $ } from 'bun';
import { randomBytes } from 'crypto';
import { existsSync, writeFileSync } from 'fs';
import { instantPostgres } from 'get-db';

async function setup() {
  console.log('Setting up j4pp...\n');

  if (existsSync('.env')) {
    console.log('.env file already exists');
    console.log('Run `bun run db:setup` to reapply the schema');
    return;
  }

  try {
    console.log('Creating database...');
    const { databaseUrl, claimUrl } = await instantPostgres();

    console.log('Writing environment variables...');
    const betterAuthSecret = randomBytes(32).toString('hex');
    const envContent = `DATABASE_URL=${databaseUrl}

# Better Auth
BETTER_AUTH_SECRET=${betterAuthSecret}
BETTER_AUTH_URL=http://localhost:3000
NEXT_PUBLIC_BETTER_AUTH_URL=http://localhost:3000
`;
    writeFileSync('.env', envContent);

    console.log('Applying schema...');
    await $`DATABASE_URL=${databaseUrl} bun run db:migrate`;

    console.log('Generating types...');
    await $`bun run db:generate`;

    console.log('\nSetup complete. Run:\n');
    console.log('  bun run dev\n');
    console.log('Claim your database (optional):');
    console.log(`  ${claimUrl}`);
  } catch (error) {
    console.error('Setup failed:', error);
    process.exit(1);
  }
}

setup().catch(console.error);
