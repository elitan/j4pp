<div align="center">
  <h1>j4pp</h1>
  <h3>Starter kit to build web apps</h3>
</div>

<br />

> Pronounced "japp" (like "yap"), which means "yes" in Swedish.

### Features

- 🐳 **Docker:** Virtualization
- 🐘 **Postgres:** Database
- 🌍 **Atlas:** Declerative database migrations
- 🧙‍♂️ **TypeScript:** JavaScript with syntax for types
- ⚛️ **Next.js:** React web framework (App router)
- 📡 **tRPC:** End-to-end typesafe APIs
- 💾 **Kysely:** Type-safe SQL Query Builder
- 💅 **TailwindCSS:** Utility-first CSS framework
- 🔒 **Clerk:** User management and authentication
- 💰 **Stripe:** Payments

## Getting Started

1. **Setup the project** (creates database and applies schema):

   ```bash
   bun run setup
   ```

2. **Start development**:
   ```bash
   bun run dev
   ```

The setup command will:

- 🎯 Create a new [Neon](https://neon.new/) PostgreSQL database
- 🏗️ Apply the database schema from `db/schema.sql`
- 📝 Generate TypeScript types with Kysely
- ✅ Set up your `.env` file

## Database Setup

The database uses Kysely with PostgreSQL and Atlas for schema management.

### Quick Start

```bash
# Apply schema and generate types
bun run db:setup
```

### Available Commands

```bash
bun run setup             # One-time setup: create database + apply schema
bun run db:generate       # Generate TypeScript types from database
bun run db:push           # Apply schema to local database
bun run db:push:stage     # Apply schema to staging database
bun run db:push:prod      # Apply schema to production database
bun run db:setup          # Apply schema + generate types (local)
```

### Environment Variables

- `DATABASE_URL` - Local/production database URL
- `STAGING_DATABASE_URL` - Staging database URL
- `PRODUCTION_DATABASE_URL` - Production database URL

### Schema Management

- Edit `db/schema.sql` to modify the database schema
- Run `bun run db:setup` to apply changes and regenerate types
- The camelCase plugin automatically converts `snake_case` columns to `camelCase` in TypeScript
