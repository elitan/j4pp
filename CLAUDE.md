# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**j4pp** is a modern, type-safe full-stack web application template optimized for rapid development and AI workflows. The stack provides end-to-end type safety from database to frontend with declarative schema management.

## Key Commands

```bash
# Development
bun run dev                    # Start development server with Turbopack
bun run build                  # Build for production
bun run start                  # Start production server
bun run lint                   # Run ESLint

# Database
bun run db:migrate             # Apply schema to database (pgterra apply)
bun run db:generate            # Generate TypeScript types from database

# Setup
bun run setup                  # Full project setup (creates DB + applies schema + generates types)
```

## Architecture & Type Safety Flow

```
Database Schema (db/schema.sql)
    ↓ pgterra applies
PostgreSQL Database
    ↓ kysely-gen introspects
TypeScript Database Types (src/lib/db-types.ts)
    ↓ tRPC uses for API
Type-safe API Routes
    ↓ React components consume
Frontend with full type safety
```

## Core Technologies

- **Database**: PostgreSQL with Kysely ORM for type-safe queries
- **Schema Management**: pgterra (declarative migrations from `db/schema.sql`)
- **API**: tRPC for end-to-end type safety
- **Frontend**: Next.js 15, React 19, TypeScript
- **Authentication**: Better Auth
- **Styling**: Tailwind CSS, Shadcn/UI components

## Database Development Workflow

1. **Edit Schema**: Modify `db/schema.sql` (declarative schema)
2. **Apply Changes**: Run `bun run db:migrate` to apply schema to database
3. **Generate Types**: Run `bun run db:generate` to update TypeScript types

**Important**: `src/lib/db-types.ts` is auto-generated - never edit manually. This file contains all database table definitions as TypeScript interfaces.

## Database Operations with Kysely

Import `db` from `src/lib/db.ts` and use with generated types:

```typescript
import { db } from '@/lib/db';

// Select operations
const users = await db.selectFrom('user').selectAll().execute();
const user = await db
  .selectFrom('user')
  .where('id', '=', userId)
  .selectAll()
  .executeTakeFirst();
```

## API Development with tRPC

Create procedures in `src/server/routers/` and export from `src/server/routers/_app.ts`:

```typescript
export const appRouter = router({
  getUsers: publicProcedure.query(async () => {
    return await db.selectFrom('user').selectAll().execute();
  }),

  getMe: protectedProcedure.query(async ({ ctx }) => {
    return await db
      .selectFrom('user')
      .where('id', '=', ctx.userId)
      .selectAll()
      .executeTakeFirst();
  }),
});
```

## Frontend Patterns

- Use tRPC hooks: `api.procedureName.useQuery()` or `api.procedureName.useMutation()`
- Functional components (not arrow functions)
- Better Auth hooks for authentication (`useSession`, `signIn`, `signOut`)
- Tailwind CSS for styling

## Current Database Schema

The database includes tables for:
- `user` - User management (Better Auth)
- `session` - Session management (Better Auth)
- `account` - OAuth accounts (Better Auth)
- `verification` - Email verification (Better Auth)
- `files` - File upload system with S3 integration
- `todos` - Todo list functionality

## Environment Configuration

Required environment variables:
- `DATABASE_URL`
- `BETTER_AUTH_SECRET`
- `BETTER_AUTH_URL`
- `NEXT_PUBLIC_BETTER_AUTH_URL`

## Development Guidelines

1. **Type Safety**: Reference `src/lib/db-types.ts` for current database types
2. **Authentication**: Use `protectedProcedure` for auth-required endpoints
3. **Components**: Follow existing patterns in `src/components/ui/`
4. **File Structure**: Pages in `src/app/`, reusable components in `src/components/`

## Package Management

This project uses **Bun** as the package manager and runtime. All commands should be run with `bun run` rather than `npm run`.