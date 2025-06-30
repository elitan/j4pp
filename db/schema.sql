create table users (id serial primary key, clerk_user_id text);

create table files (
  id uuid primary key default gen_random_uuid (),
  filename text not null,
  mime_type text not null,
  size bigint not null,
  status text not null default 'uploading',
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now(),
  etag text,
  updated_by_user_id integer references users (id) on delete set null,
  metadata jsonb
);
