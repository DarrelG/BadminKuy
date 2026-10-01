-- Per-player notifications. Created by the system (triggers or service role), read by the player.

create table public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  title text not null check (char_length(title) between 1 and 80),
  body text not null check (char_length(body) between 1 and 300),
  read_at timestamptz,
  created_at timestamptz not null default now()
);

create index notifications_user_created_idx on public.notifications (user_id, created_at desc);

alter table public.notifications enable row level security;

create policy "players read their notifications"
  on public.notifications for select to authenticated
  using (user_id = auth.uid());

create policy "players mark their notifications read"
  on public.notifications for update to authenticated
  using (user_id = auth.uid()) with check (user_id = auth.uid());

-- Players may change only read_at, never the text
revoke update on public.notifications from anon, authenticated;
grant update (read_at) on public.notifications to authenticated;
