-- One table for "report wrong info" / "report message" style flags.

create table public.reports (
  id uuid primary key default gen_random_uuid(),
  reporter_id uuid not null default auth.uid() references public.profiles(id) on delete cascade,
  target_type text not null check (target_type in ('court', 'chat_room', 'chat_message', 'listing')),
  target_id uuid not null,
  note text check (char_length(note) <= 500),
  status text not null default 'open' check (status in ('open', 'resolved')),
  created_at timestamptz not null default now(),
  unique (reporter_id, target_type, target_id)
);

create index reports_target_idx on public.reports (target_type, target_id);

alter table public.reports enable row level security;

create policy "players file reports"
  on public.reports for insert to authenticated
  with check (reporter_id = auth.uid() and status = 'open');

create policy "reporters and staff read reports"
  on public.reports for select to authenticated
  using (reporter_id = auth.uid() or public.is_staff());

create policy "staff resolve reports"
  on public.reports for update to authenticated
  using (public.is_staff()) with check (public.is_staff());
