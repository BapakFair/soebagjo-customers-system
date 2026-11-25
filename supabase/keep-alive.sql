-- Jalankan script ini di Supabase SQL Editor (cukup 1 kali).
-- Script ini membuat tabel khusus 1-baris (public.keep_alive) dan fungsi RPC
-- public.ping_keep_alive() yang melakukan operasi WRITE (UPDATE) + READ (SELECT)
-- nyata ke PostgreSQL tanpa pernah mengekspos data customers/transactions
-- dan tanpa menambah jumlah baris di database (selalu terkunci pada id = 1).

create table if not exists public.keep_alive (
    id smallint primary key default 1 check (id = 1),
    ping_count bigint not null default 0,
    last_pinged_at timestamptz not null default timezone('utc', now())
);

insert into public.keep_alive (id, ping_count, last_pinged_at)
values (1, 1, timezone('utc', now()))
on conflict (id) do nothing;

alter table public.keep_alive enable row level security;

drop policy if exists "keep_alive_select_public" on public.keep_alive;
create policy "keep_alive_select_public"
    on public.keep_alive
    for select
    to anon, authenticated
    using (true);

create or replace function public.ping_keep_alive()
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
    result_row public.keep_alive;
begin
    insert into public.keep_alive (id, ping_count, last_pinged_at)
    values (1, 1, timezone('utc', now()))
    on conflict (id) do update
        set ping_count = public.keep_alive.ping_count + 1,
            last_pinged_at = timezone('utc', now())
    returning * into result_row;

    return jsonb_build_object(
        'id', result_row.id,
        'ping_count', result_row.ping_count,
        'last_pinged_at', result_row.last_pinged_at
    );
end;
$$;

grant usage on schema public to anon, authenticated;
grant select on public.keep_alive to anon, authenticated;
revoke all on function public.ping_keep_alive() from public;
grant execute on function public.ping_keep_alive() to anon, authenticated;
