-- Better Auth tables
create table "user" (
  id text primary key,
  name text,
  email text,
  "emailVerified" boolean default false,
  image text,
  "createdAt" timestamptz default now(),
  "updatedAt" timestamptz default now()
);

create table session (
  id text primary key,
  "userId" text not null references "user" (id) on delete cascade,
  token text unique not null,
  "expiresAt" timestamptz not null,
  "ipAddress" text,
  "userAgent" text,
  "createdAt" timestamptz default now(),
  "updatedAt" timestamptz default now()
);

create table account (
  id text primary key,
  "userId" text not null references "user" (id) on delete cascade,
  "accountId" text not null,
  "providerId" text not null,
  "accessToken" text,
  "refreshToken" text,
  "accessTokenExpiresAt" timestamptz,
  "refreshTokenExpiresAt" timestamptz,
  scope text,
  "idToken" text,
  password text,
  "createdAt" timestamptz default now(),
  "updatedAt" timestamptz default now()
);

create table verification (
  id text primary key,
  identifier text not null,
  value text not null,
  "expiresAt" timestamptz not null,
  "createdAt" timestamptz default now(),
  "updatedAt" timestamptz default now()
);

-- File storage
create table files (
  id uuid primary key default gen_random_uuid (),
  filename text not null,
  mime_type text not null,
  size bigint not null,
  status text not null default 'uploading',
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  etag text,
  updated_by_user_id text references "user" (id) on delete set null,
  metadata jsonb
);

-- Demo Todo List
create table todos (
  id serial primary key,
  user_id text not null references "user" (id) on delete cascade,
  title text not null,
  completed boolean not null default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
