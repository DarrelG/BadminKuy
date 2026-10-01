-- Second-hand gear listings.

create table public.listings (
  id uuid primary key default gen_random_uuid(),
  seller_id uuid not null default auth.uid() references public.profiles(id) on delete cascade,
  title text not null check (char_length(title) between 3 and 80),
  listing_type text not null default 'item' check (listing_type in ('item', 'bundle')),
  condition text not null check (char_length(condition) between 2 and 60),
  location text not null check (char_length(location) between 2 and 60),
  price_idr integer not null check (price_idr >= 0),
  image_url text,
  image_alt text,
  status text not null default 'active' check (status in ('active', 'sold', 'removed')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index listings_status_created_idx on public.listings (status, created_at desc);
create index listings_seller_idx on public.listings (seller_id);

create trigger listings_set_updated_at
  before update on public.listings
  for each row execute function public.set_updated_at();

alter table public.listings enable row level security;

create policy "active listings are readable"
  on public.listings for select to authenticated
  using (status = 'active' or seller_id = auth.uid() or public.is_staff());

create policy "players list their own gear"
  on public.listings for insert to authenticated
  with check (seller_id = auth.uid() and status = 'active');

create policy "sellers and staff update listings"
  on public.listings for update to authenticated
  using (seller_id = auth.uid() or public.is_staff())
  with check (seller_id = auth.uid() or public.is_staff());

create policy "sellers and staff delete listings"
  on public.listings for delete to authenticated
  using (seller_id = auth.uid() or public.is_staff());
