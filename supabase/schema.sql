-- Mythreal MVP — schema migration
-- Run in Supabase SQL editor. Tables are intentionally simple; jsonb is used where
-- structure may evolve. RLS is OFF for MVP — every request is server-side with the
-- service role. Add RLS in V2 when client-side reads happen.

create extension if not exists "uuid-ossp";

create table clients (
  id           uuid primary key default uuid_generate_v4(),
  slug         text unique not null,
  name         text not null,
  passcode     text not null,
  brand_bio    text,
  created_at   timestamptz not null default now()
);

create or replace function reject_slug_update()
returns trigger as $$
begin
  if old.slug is distinct from new.slug then
    raise exception 'clients.slug is immutable';
  end if;
  return new;
end;
$$ language plpgsql;

create trigger lock_client_slug
before update on clients
for each row execute function reject_slug_update();

create table portal_config (
  id                    uuid primary key default uuid_generate_v4(),
  client_id             uuid not null references clients(id) on delete cascade,
  modules_enabled       jsonb not null default '{}'::jsonb,
  theme_overrides       jsonb not null default '{}'::jsonb,
  analytics_enabled     boolean not null default true,
  ai_assistant_enabled  boolean not null default false,
  feature_flags         jsonb not null default '{}'::jsonb
);

create table brand_colors (
  id         uuid primary key default uuid_generate_v4(),
  client_id  uuid not null references clients(id) on delete cascade,
  name       text not null,
  hex        text not null,
  rgb        text not null,
  hsl        text not null,
  role       text not null check (role in ('primary','secondary','accent','neutral')),
  sort_order int not null default 0
);

create table brand_fonts (
  id              uuid primary key default uuid_generate_v4(),
  client_id       uuid not null references clients(id) on delete cascade,
  role            text not null check (role in ('headline','body','mono')),
  family          text not null,
  weights         int[] not null default '{}',
  css_import_url  text,
  storage_url     text
);

create table logos (
  id          uuid primary key default uuid_generate_v4(),
  client_id   uuid not null references clients(id) on delete cascade,
  variant     text not null check (variant in ('primary','reversed','mono','icon','favicon')),
  format      text not null check (format in ('svg','png')),
  storage_url text not null
);

create table verbal_examples (
  id            uuid primary key default uuid_generate_v4(),
  client_id     uuid not null references clients(id) on delete cascade,
  say_this      text not null,
  dont_say_this text not null,
  context       text not null check (context in ('email','headline','cta','linkedin','error'))
);

create table vibe_coordinates (
  id                uuid primary key default uuid_generate_v4(),
  client_id         uuid not null references clients(id) on delete cascade,
  code              text not null,
  label             text not null,
  surface_pct       int not null,
  weight_pct        int not null,
  accent_pct        int not null,
  surface_name      text not null,
  weight_name       text not null,
  accent_name       text not null,
  description       text,
  applied_examples  jsonb not null default '[]'::jsonb
);

create table developer_tokens (
  id          uuid primary key default uuid_generate_v4(),
  client_id   uuid not null references clients(id) on delete cascade,
  token_block text not null
);

create table users (
  id         uuid primary key default uuid_generate_v4(),
  email      text unique not null,
  client_id  uuid references clients(id) on delete set null,
  role       text not null check (role in ('admin','client'))
);

create table analytics_events (
  id          uuid primary key default uuid_generate_v4(),
  client_id   uuid not null references clients(id) on delete cascade,
  user_label  text,
  event_type  text not null,
  metadata    jsonb not null default '{}'::jsonb,
  created_at  timestamptz not null default now()
);

create index analytics_events_client_created_idx
  on analytics_events (client_id, created_at desc);

create index analytics_events_event_type_idx
  on analytics_events (event_type);

-- Weekly usage rollup for monthly client reports
create or replace view client_usage_summary as
select
  client_id,
  date_trunc('week', created_at) as week,
  event_type,
  count(*)                       as event_count,
  count(distinct user_label)     as unique_users
from analytics_events
group by client_id, week, event_type;
