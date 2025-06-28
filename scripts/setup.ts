#!/usr/bin/env bun

import { existsSync } from 'fs';
import { $ } from 'bun';

async function setup() {
  console.log('🚀 Setting up j4pp...');

  // Check if .env file already exists
  if (existsSync('.env')) {
    console.log('✅ .env file already exists');
    console.log('💡 Run `bun run db:setup` if you want to reapply the schema');
    return;
  }

  try {
    // Create new Neon database
    console.log('🎯 Creating new Neon database...');
    await $`bunx neondb -y`;
    console.log('✅ Database created successfully!');

    // Set up the database schema and generate types
    console.log('🏗️  Applying database schema and generating types...');
    await $`bun run db:setup`;
    console.log('✅ Database schema applied and types generated!');

    console.log('');
    console.log('🎉 Setup complete! You can now run:');
    console.log('   bun run dev');
  } catch (error) {
    console.error('❌ Setup failed:', error);
    process.exit(1);
  }
}

setup().catch(console.error);
