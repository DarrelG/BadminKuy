-- Chat rooms and messages.

create table public.chat_rooms (
  id uuid primary key default gen_random_uuid(),
  name text not null unique check (char_length(name) between 2 and 30),
  created_at timestamptz not null default now()
);

insert into public.chat_rooms (name) values ('Global'), ('Jakarta'), ('Bandung'), ('Surabaya');

create table public.chat_messages (
  id uuid primary key default gen_random_uuid(),
  room_id uuid not null references public.chat_rooms(id) on delete cascade,
  author_id uuid not null default auth.uid() references public.profiles(id) on delete cascade,
  body text not null check (char_length(body) between 1 and 500),
  created_at timestamptz not null default now()
);

create index chat_messages_room_created_idx on public.chat_messages (room_id, created_at);

-- Basic rate limit: at most 10 messages per 30 seconds per player
create function public.limit_chat_rate() returns trigger
language plpgsql as $$
begin
  if (
    select count(*) from public.chat_messages
    where author_id = new.author_id and created_at > now() - interval '30 seconds'
  ) >= 10 then
    raise exception 'RATE_LIMITED';
  end if;
  return new;
end; $$;

create trigger chat_messages_rate_limit
  before insert on public.chat_messages
  for each row execute function public.limit_chat_rate();

alter table public.chat_rooms enable row level security;
alter table public.chat_messages enable row level security;

create policy "rooms are readable"
  on public.chat_rooms for select to authenticated using (true);

create policy "admins manage rooms"
  on public.chat_rooms for all to authenticated
  using (public.is_platform_admin()) with check (public.is_platform_admin());

create policy "messages are readable"
  on public.chat_messages for select to authenticated using (true);

create policy "players send messages as themselves"
  on public.chat_messages for insert to authenticated
  with check (author_id = auth.uid());

create policy "authors and staff delete messages"
  on public.chat_messages for delete to authenticated
  using (author_id = auth.uid() or public.is_staff());

-- Let Supabase Realtime stream new messages (skipped where the publication does not exist)
do $$
begin
  if exists (select 1 from pg_publication where pubname = 'supabase_realtime') then
    alter publication supabase_realtime add table public.chat_messages;
  end if;
end $$;
