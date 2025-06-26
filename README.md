# j4pp

**Fast starter template optimized for rapid development and AI workflows.**

## Features

- **Type-safe from DB to frontend** - Database → tRPC → React with auto-generated types
- **Declarative schema** - Atlas manages migrations from `db/schema.sql`
- **Zero-config setup** - One command creates DB, applies schema, generates types
- **Modern stack** - Next.js 15, tRPC, Kysely, TypeScript, Tailwind

## Quick Start

```bash
# One command setup (creates Neon DB + applies schema + generates types)
bun run setup

# Start development
bun run dev
```

## Stack

- **Database**: PostgreSQL (Neon)
- **Schema**: Atlas (declarative migrations)
- **Backend**: Next.js API routes + tRPC
- **Frontend**: React 19 + Next.js 15
- **Types**: Auto-generated with Kysely
- **Auth**: Clerk

## Type Flow

```
Database Schema (schema.sql)
    ↓ Atlas applies
PostgreSQL
    ↓ Kysely generates
TypeScript types
    ↓ tRPC uses
Type-safe API
    ↓ React consumes
Frontend components
```

## Development Commands

```bash
bun run setup        # Full setup (DB + schema + types)
bun run dev          # Start development server
bun run db:setup     # Apply schema + generate types
bun run db:push      # Apply schema to database
bun run db:generate  # Generate types from database
```

## Database Changes

1. Edit `db/schema.sql`
2. Run `bun run db:setup`
3. Types are automatically updated across your app

The setup is optimized for AI tools - types flow automatically and the declarative schema makes database changes predictable and safe.
