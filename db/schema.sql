-- Better Auth tables
create table users (
  id text primary key,
  name text,
  email text,
  email_verified boolean default false,
  image text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table auth_sessions (
  id text primary key,
  user_id text not null references users (id) on delete cascade,
  token text not null unique,
  expires_at timestamptz not null,
  ip_address text,
  user_agent text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table auth_accounts (
  id text primary key,
  user_id text not null references users (id) on delete cascade,
  account_id text not null,
  provider_id text not null,
  access_token text,
  refresh_token text,
  access_token_expires_at timestamptz,
  refresh_token_expires_at timestamptz,
  scope text,
  id_token text,
  password text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table auth_verifications (
  id text primary key,
  identifier text not null,
  value text not null,
  expires_at timestamptz not null,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Application tables
create table files (
  id uuid primary key default gen_random_uuid (),
  filename text not null,
  mime_type text not null,
  size bigint not null,
  status text not null default 'uploading',
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  etag text,
  updated_by_user_id text references users (id) on delete set null,
  metadata_hej jsonb
);

create table todos (
  id serial primary key,
  user_id text not null references users (id) on delete cascade,
  title text not null,
  completed boolean not null default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
