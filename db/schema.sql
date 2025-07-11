create table users (id serial primary key, clerk_user_id text);

create table files (
  id uuid primary key default gen_random_uuid (),
  filename text not null,
  mime_type text not null,
  size bigint not null,
  status text not null default 'uploading',
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  etag text,
  updated_by_user_id integer references users (id) on delete set null,
  metadata jsonb
);

create table todos (
  id serial primary key,
  user_id integer not null references users (id) on delete cascade,
  title text not null,
  completed boolean not null default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
