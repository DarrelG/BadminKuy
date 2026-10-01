-- Mabar (play together) sessions and who joined them.

create table public.mabar_sessions (
  id uuid primary key default gen_random_uuid(),
  host_id uuid not null default auth.uid() references public.profiles(id) on delete cascade,
  court_id uuid not null references public.courts(id) on delete cascade,
  title text not null check (char_length(title) between 3 and 60),
  skill public."skillLevel" not null,
  starts_at timestamptz not null,
  format text not null default 'casual' check (format in ('doubles', 'singles', 'casual')),
  price_per_person integer not null default 0 check (price_per_person between 0 and 1000000),
  capacity integer not null check (capacity between 2 and 11),
  created_at timestamptz not null default now()
);

create index mabar_sessions_starts_idx on public.mabar_sessions (starts_at);
create index mabar_sessions_court_idx on public.mabar_sessions (court_id);

create table public.mabar_participants (
  session_id uuid not null references public.mabar_sessions(id) on delete cascade,
  user_id uuid not null default auth.uid() references public.profiles(id) on delete cascade,
  joined_at timestamptz not null default now(),
  primary key (session_id, user_id)
);

create index mabar_participants_user_idx on public.mabar_participants (user_id);

-- The host always takes the first spot
create function public.add_host_as_participant() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  insert into public.mabar_participants (session_id, user_id) values (new.id, new.host_id);
  return new;
end; $$;

create trigger mabar_sessions_add_host
  after insert on public.mabar_sessions
  for each row execute function public.add_host_as_participant();

-- A full session cannot be joined, even by two people clicking at the same moment
create function public.enforce_mabar_capacity() returns trigger
language plpgsql security definer set search_path = public as $$
declare
  cap integer;
  taken integer;
begin
  select capacity into cap from public.mabar_sessions where id = new.session_id for update;
  if cap is null then
    raise exception 'SESSION_NOT_FOUND';
  end if;
  select count(*) into taken from public.mabar_participants where session_id = new.session_id;
  if taken >= cap then
    raise exception 'SESSION_FULL';
  end if;
  return new;
end; $$;

create trigger mabar_participants_capacity
  before insert on public.mabar_participants
  for each row execute function public.enforce_mabar_capacity();

alter table public.mabar_sessions enable row level security;
alter table public.mabar_participants enable row level security;

create policy "sessions are readable"
  on public.mabar_sessions for select to authenticated using (true);

create policy "players host sessions"
  on public.mabar_sessions for insert to authenticated
  with check (host_id = auth.uid());

create policy "hosts and admins edit sessions"
  on public.mabar_sessions for update to authenticated
  using (host_id = auth.uid() or public.is_platform_admin())
  with check (host_id = auth.uid() or public.is_platform_admin());

create policy "hosts and admins delete sessions"
  on public.mabar_sessions for delete to authenticated
  using (host_id = auth.uid() or public.is_platform_admin());

create policy "participants are readable"
  on public.mabar_participants for select to authenticated using (true);

create policy "players join sessions"
  on public.mabar_participants for insert to authenticated
  with check (user_id = auth.uid());

create policy "players leave sessions"
  on public.mabar_participants for delete to authenticated
  using (user_id = auth.uid());
