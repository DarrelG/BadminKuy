create table public.courts (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null default auth.uid() references public.profiles(id),
  name text not null,
  city text not null,
  address text not null,
  price_per_hour integer not null check (price_per_hour >= 0),
  court_count integer not null default 1 check (court_count > 0),
  floor_type text not null check (floor_type in ('wood', 'vinyl', 'cement', 'rubber')),
  facilities text[] not null default '{}',
  created_at timestamptz not null default now()
);

alter table public.courts enable row level security;

create policy "courts are readable"
    on public.courts for select using (true);

create policy "court admins can add courts"
    on public.courts for insert to authenticated
    with check (
        owner_id = auth.uid()
        and exists (
        select 1 from public.profiles
        where id = auth.uid() and role = 'court_admin'
        )
    );

create policy "owners can update their courts"
    on public.courts for update
    using (owner_id = auth.uid())
    with check (owner_id = auth.uid());

create policy "owners can delete their courts"
    on public.courts for delete
    using (owner_id = auth.uid());