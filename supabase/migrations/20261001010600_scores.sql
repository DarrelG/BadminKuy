-- Match log, ratings and the leaderboard.

create table public.matches (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references public.profiles(id) on delete cascade,
  player_a_name text not null check (char_length(player_a_name) between 2 and 40),
  player_b_name text not null check (char_length(player_b_name) between 2 and 40),
  score_a smallint not null check (score_a between 0 and 99),
  score_b smallint not null check (score_b between 0 and 99),
  played_at timestamptz not null default now(),
  check (score_a <> score_b)
);

create index matches_user_played_idx on public.matches (user_id, played_at desc);

create table public.player_ratings (
  user_id uuid primary key references public.profiles(id) on delete cascade,
  rating integer not null default 1200,
  last_delta integer not null default 0,
  updated_at timestamptz not null default now()
);

-- Ratings are written only by this trigger, never directly by players.
-- PLACEHOLDER RULE: +12 for a win, -8 for a loss. Replace with real Elo later.
create function public.apply_match_rating() returns trigger
language plpgsql security definer set search_path = public as $$
declare
  delta integer := case when new.score_a > new.score_b then 12 else -8 end;
begin
  insert into public.player_ratings (user_id, rating, last_delta)
  values (new.user_id, 1200 + delta, delta)
  on conflict (user_id) do update
    set rating = public.player_ratings.rating + delta,
        last_delta = delta,
        updated_at = now();
  return new;
end; $$;

create trigger matches_apply_rating
  after insert on public.matches
  for each row execute function public.apply_match_rating();

alter table public.matches enable row level security;
alter table public.player_ratings enable row level security;

create policy "players read their own matches"
  on public.matches for select to authenticated
  using (user_id = auth.uid() or public.is_platform_admin());

create policy "players log their own matches"
  on public.matches for insert to authenticated
  with check (user_id = auth.uid());

create policy "ratings are readable"
  on public.player_ratings for select to authenticated using (true);

create view public.leaderboard with (security_invoker = true) as
select
  r.user_id,
  p.display_name,
  p.city,
  r.rating,
  r.last_delta,
  rank() over (order by r.rating desc)::int as rank
from public.player_ratings r
join public.profiles p on p.id = r.user_id;
