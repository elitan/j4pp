# j4pp

**Fast starter template optimized for rapid development and AI workflows.**

## Features

- **Type-safe from DB to frontend** - Database → tRPC → React with auto-generated types
- **Declarative schema** - Atlas manages migrations from `db/schema.sql`
- **Zero-config setup** - One command creates DB, applies schema, generates types
- **Modern stack** - Next.js 15, tRPC, Kysely, TypeScript, Tailwind

## Philosophy

This template is built on a core belief: **modern development should be fast, type-safe, and AI-native.** Every tool in this stack was chosen to reduce boilerplate, eliminate entire classes of bugs, and create a seamless feedback loop from the database to the UI.

-   **Kysely over Prisma/Drizzle:** We chose Kysely for its unparalleled type-safety and its lightweight, SQL-first approach. It doesn't try to abstract away SQL; it embraces it, giving you full control while ensuring your queries are 100% type-safe. This makes database interactions predictable and easy to debug.

-   **tRPC over REST/GraphQL:** tRPC provides end-to-end type-safety without the need for code generation or schemas. Your API becomes as easy to consume as calling a function, with full autocompletion and type-checking from the backend to the frontend. This dramatically speeds up feature development.

-   **Atlas for Declarative Migrations:** Managing database schemas should be simple. With Atlas, you define your desired schema in a single `schema.sql` file. Atlas intelligently figures out the migration plan, making schema changes trivial and predictable. This is especially powerful for AI-driven development, where an agent can safely propose and apply schema changes.

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
