-- Courts, reviews (rating + quality scores) and booking requests.

-- An earlier "add_courts" migration already created a smaller courts table.
-- Replace it with the full version below, but refuse to run if it already holds data.
do $$
declare
  existing integer;
begin
  if to_regclass('public.courts') is not null then
    execute 'select count(*) from public.courts' into existing;
    if existing > 0 then
      raise exception 'public.courts already has % row(s); move the data by hand before replacing the table', existing;
    end if;
    drop table public.courts cascade;
  end if;
end $$;

create table public.courts (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null default auth.uid() references public.profiles(id) on delete cascade,
  name text not null check (char_length(name) between 2 and 80),
  address text not null check (char_length(address) between 3 and 200),
  city text not null check (char_length(city) between 2 and 60),
  court_count integer not null default 1 check (court_count > 0),
  floor_type text not null check (floor_type in ('wood', 'vinyl', 'cement', 'rubber')),
  price_per_hour integer not null check (price_per_hour >= 0),
  opens_at time not null default '08:00',
  closes_at time not null default '23:00',
  facilities text[] not null default '{}',
  image_url text,
  image_alt text,
  status text not null default 'open' check (status in ('open', 'busy')),
  status_updated_at timestamptz not null default now(),
  verified boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index courts_city_idx on public.courts (city);
create index courts_owner_idx on public.courts (owner_id);

-- Only platform admins may mark a court verified; status changes stamp their time.
create function public.guard_court_columns() returns trigger
language plpgsql as $$
begin
  if tg_op = 'INSERT' then
    if new.verified and not public.is_platform_admin() then
      new.verified := false;
    end if;
  else
    if new.verified is distinct from old.verified and not public.is_platform_admin() then
      new.verified := old.verified;
    end if;
    if new.status is distinct from old.status then
      new.status_updated_at := now();
    end if;
  end if;
  return new;
end; $$;

create trigger courts_guard_columns
  before insert or update on public.courts
  for each row execute function public.guard_court_columns();

create trigger courts_set_updated_at
  before update on public.courts
  for each row execute function public.set_updated_at();

alter table public.courts enable row level security;

create policy "courts are readable"
  on public.courts for select to authenticated using (true);

create policy "court admins add courts"
  on public.courts for insert to authenticated
  with check (
    owner_id = auth.uid()
    and public.current_user_role() in ('court_admin', 'admin')
  );

create policy "owners and admins update courts"
  on public.courts for update to authenticated
  using (owner_id = auth.uid() or public.is_platform_admin())
  with check (owner_id = auth.uid() or public.is_platform_admin());

create policy "owners and admins delete courts"
  on public.courts for delete to authenticated
  using (owner_id = auth.uid() or public.is_platform_admin());

-- Reviews
create table public.court_reviews (
  id uuid primary key default gen_random_uuid(),
  court_id uuid not null references public.courts(id) on delete cascade,
  user_id uuid not null default auth.uid() references public.profiles(id) on delete cascade,
  rating smallint not null check (rating between 1 and 5),
  floor_rating smallint check (floor_rating between 1 and 5),
  lighting_rating smallint check (lighting_rating between 1 and 5),
  cleanliness_rating smallint check (cleanliness_rating between 1 and 5),
  comment text check (char_length(comment) <= 500),
  created_at timestamptz not null default now(),
  unique (court_id, user_id)
);

create index court_reviews_court_idx on public.court_reviews (court_id);

alter table public.court_reviews enable row level security;

create policy "reviews are readable"
  on public.court_reviews for select to authenticated using (true);

create policy "players review courts they do not own"
  on public.court_reviews for insert to authenticated
  with check (
    user_id = auth.uid()
    and not exists (
      select 1 from public.courts c where c.id = court_id and c.owner_id = auth.uid()
    )
  );

create policy "players edit their own reviews"
  on public.court_reviews for update to authenticated
  using (user_id = auth.uid()) with check (user_id = auth.uid());

create policy "players and staff delete reviews"
  on public.court_reviews for delete to authenticated
  using (user_id = auth.uid() or public.is_staff());

-- Rating summary shown on court cards (runs with the caller's permissions)
create view public.court_stats with (security_invoker = true) as
select
  court_id,
  count(*)::int as review_count,
  round(avg(rating)::numeric, 1) as avg_rating,
  round(avg(floor_rating)::numeric, 1) as avg_floor,
  round(avg(lighting_rating)::numeric, 1) as avg_lighting,
  round(avg(cleanliness_rating)::numeric, 1) as avg_cleanliness
from public.court_reviews
group by court_id;

-- Booking requests
create table public.court_bookings (
  id uuid primary key default gen_random_uuid(),
  court_id uuid not null references public.courts(id) on delete cascade,
  user_id uuid not null default auth.uid() references public.profiles(id) on delete cascade,
  booking_date date not null,
  booking_time time not null,
  status text not null default 'pending'
    check (status in ('pending', 'confirmed', 'declined', 'cancelled')),
  created_at timestamptz not null default now(),
  unique (court_id, user_id, booking_date, booking_time)
);

create index court_bookings_court_idx on public.court_bookings (court_id);
create index court_bookings_user_idx on public.court_bookings (user_id);

alter table public.court_bookings enable row level security;

create policy "bookings visible to player, court owner and admin"
  on public.court_bookings for select to authenticated
  using (
    user_id = auth.uid()
    or public.is_platform_admin()
    or exists (select 1 from public.courts c where c.id = court_id and c.owner_id = auth.uid())
  );

create policy "players request bookings"
  on public.court_bookings for insert to authenticated
  with check (user_id = auth.uid() and status = 'pending');

create policy "court owners and admins answer bookings"
  on public.court_bookings for update to authenticated
  using (
    public.is_platform_admin()
    or exists (select 1 from public.courts c where c.id = court_id and c.owner_id = auth.uid())
  )
  with check (
    public.is_platform_admin()
    or exists (select 1 from public.courts c where c.id = court_id and c.owner_id = auth.uid())
  );

create policy "players can only cancel their own bookings"
  on public.court_bookings for update to authenticated
  using (user_id = auth.uid())
  with check (user_id = auth.uid() and status = 'cancelled');