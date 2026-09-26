-- ─────────────────────────────────────────────────────────
-- Mafia Metal · Tabla de mensajes de contacto
-- Ejecutar este script en Supabase → SQL Editor
-- ─────────────────────────────────────────────────────────

create extension if not exists "pgcrypto";

create table if not exists public.contact_messages (
  id           uuid primary key default gen_random_uuid(),
  created_at   timestamptz not null default now(),
  name         text not null,
  email        text not null,
  phone        text,
  interest     text,                -- rings | chains | bracelets | custom | wholesale | other
  message      text,
  status       text not null default 'nuevo'
               check (status in ('nuevo', 'leido', 'respondido', 'archivado')),
  admin_notes  text
);

-- índices para que los filtros y el buscador respondan rápido
create index if not exists contact_messages_status_idx on public.contact_messages (status);
create index if not exists contact_messages_created_at_idx on public.contact_messages (created_at desc);
create index if not exists contact_messages_interest_idx on public.contact_messages (interest);

-- búsqueda por texto (nombre / email / mensaje)
create index if not exists contact_messages_search_idx on public.contact_messages
  using gin (
    to_tsvector('spanish', coalesce(name, '') || ' ' || coalesce(email, '') || ' ' || coalesce(message, ''))
  );

alter table public.contact_messages enable row level security;

-- cualquier visitante (rol anon) puede CREAR una consulta desde el formulario público
drop policy if exists "contact_messages_public_insert" on public.contact_messages;
create policy "contact_messages_public_insert"
  on public.contact_messages
  for insert
  to anon
  with check (true);

-- solo usuarios autenticados (el dueño/admin logueado) pueden leer, actualizar y borrar
drop policy if exists "contact_messages_admin_select" on public.contact_messages;
create policy "contact_messages_admin_select"
  on public.contact_messages
  for select
  to authenticated
  using (true);

drop policy if exists "contact_messages_admin_update" on public.contact_messages;
create policy "contact_messages_admin_update"
  on public.contact_messages
  for update
  to authenticated
  using (true)
  with check (true);

drop policy if exists "contact_messages_admin_delete" on public.contact_messages;
create policy "contact_messages_admin_delete"
  on public.contact_messages
  for delete
  to authenticated
  using (true);
