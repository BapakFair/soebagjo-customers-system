do $$
begin
    if exists (
        select 1
        from information_schema.columns
        where table_schema = 'public'
          and table_name = 'transactions'
          and column_name = 'price'
    ) and not exists (
        select 1
        from information_schema.columns
        where table_schema = 'public'
          and table_name = 'transactions'
          and column_name = 'lens_price'
    ) then
        alter table public.transactions
            rename column price to lens_price;
    end if;

    if not exists (
        select 1
        from information_schema.columns
        where table_schema = 'public'
          and table_name = 'transactions'
          and column_name = 'frame_price'
    ) then
        alter table public.transactions
            add column frame_price numeric(12,2) not null default 0;
    end if;
end $$;
