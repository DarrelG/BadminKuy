-- Clubs and their members. Only platform admins create clubs for now.

create table public.clubs (
  id uuid primary key default gen_random_uuid(),
  name text not null unique check (char_length(name) between 2 and 60),
  area text not null check (char_length(area) between 2 and 60),
  schedule text check (char_length(schedule) <= 120),
  image_url text,
  image_alt text,
  created_by uuid default auth.uid() references public.profiles(id) on delete set null,
  created_at timestamptz not null default now()
);

create table public.club_members (
  club_id uuid not null references public.clubs(id) on delete cascade,
  user_id uuid not null default auth.uid() references public.profiles(id) on delete cascade,
  joined_at timestamptz not null default now(),
  primary key (club_id, user_id)
);

create index club_members_user_idx on public.club_members (user_id);

alter table public.clubs enable row level security;
alter table public.club_members enable row level security;

create policy "clubs are readable"
  on public.clubs for select to authenticated using (true);

create policy "admins manage clubs"
  on public.clubs for all to authenticated
  using (public.is_platform_admin()) with check (public.is_platform_admin());

create policy "members are readable"
  on public.club_members for select to authenticated using (true);

create policy "players join clubs"
  on public.club_members for insert to authenticated
  with check (user_id = auth.uid());

create policy "players leave clubs"
  on public.club_members for delete to authenticated
  using (user_id = auth.uid());
