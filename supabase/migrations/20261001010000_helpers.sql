-- Role helpers used by the row-level security policies in the following migrations.
-- They are security definer so they can read profiles regardless of the caller's own access.

create function public.current_user_role()
returns public."userRole"
language sql stable security definer set search_path = public as $$
  select role from public.profiles where id = auth.uid()
$$;

create function public.is_platform_admin()
returns boolean
language sql stable security definer set search_path = public as $$
  select coalesce(public.current_user_role() = 'admin', false)
$$;

create function public.is_staff()
returns boolean
language sql stable security definer set search_path = public as $$
  select coalesce(public.current_user_role() in ('admin', 'moderator'), false)
$$;

revoke all on function public.current_user_role() from public, anon;
revoke all on function public.is_platform_admin() from public, anon;
revoke all on function public.is_staff() from public, anon;
grant execute on function public.current_user_role() to authenticated;
grant execute on function public.is_platform_admin() to authenticated;
grant execute on function public.is_staff() to authenticated;
