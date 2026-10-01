-- Coach directory. Only platform admins add coaches for now.

create table public.coaches (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete set null,
  name text not null check (char_length(name) between 2 and 60),
  area text not null check (char_length(area) between 2 and 60),
  focus text not null check (char_length(focus) between 2 and 120),
  price_per_hour integer not null check (price_per_hour >= 0),
  verified boolean not null default false,
  image_url text,
  image_alt text,
  created_at timestamptz not null default now()
);

alter table public.coaches enable row level security;

create policy "coaches are readable"
  on public.coaches for select to authenticated using (true);

create policy "admins manage coaches"
  on public.coaches for all to authenticated
  using (public.is_platform_admin()) with check (public.is_platform_admin());
