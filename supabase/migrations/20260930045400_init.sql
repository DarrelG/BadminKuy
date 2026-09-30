-- Types
create type public."userRole" as enum ('user', 'court_admin', 'moderator');
create type public."skillLevel" as enum ('beginner', 'intermediate', 'advanced');
create type public."playStyle" as enum ('singles', 'doubles', 'both');

-- Table
create table public.profiles (
    id uuid primary key references auth.users on delete cascade,
    display_name text not null check (char_length(display_name) between 2 and 40),
    role public."userRole" not null default 'user',
    city text,
    avatar_url text,
    skill_level public."skillLevel",
    play_style public."playStyle",
    bio text check (char_length(bio) <= 200),
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

-- Security
alter table public.profiles enable row level security;

create policy "profiles are readable"
    on public.profiles for select using (true);

create policy "users update own profile, but not their role"
    on public.profiles for update
    using (auth.uid() = id)
    with check (
        auth.uid() = id
        and role = (select role from public.profiles where id = auth.uid())
    );

-- Create a profile automatically when someone signs up
create function public.handle_new_user() returns trigger
language plpgsql security definer set search_path = public as $$
declare
    name text := coalesce(new.raw_user_meta_data->>'display_name',
                        split_part(new.email, '@', 1));
begin
    if char_length(name) < 2 then
        name := 'player_' || left(new.id::text, 6);
    end if;
    insert into public.profiles (id, display_name) values (new.id, left(name, 40));
    return new;
end; $$;

create trigger on_auth_user_created
    after insert on auth.users
    for each row execute function public.handle_new_user();

-- Keep updated_at current
create function public.set_updated_at() returns trigger
language plpgsql as $$
begin
    new.updated_at = now();
    return new;
end; $$;

create trigger profiles_set_updated_at
    before update on public.profiles
    for each row execute function public.set_updated_at();