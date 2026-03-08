do $$
begin
    if exists (
        select 1
        from information_schema.columns
        where table_schema = 'public'
          and table_name = 'transactions'
          and column_name = 'lens_kiri_minus'
    ) and not exists (
        select 1
        from information_schema.columns
        where table_schema = 'public'
          and table_name = 'transactions'
          and column_name = 'lens_kiri_speris'
    ) then
        alter table public.transactions
            rename column lens_kiri_minus to lens_kiri_speris;
    end if;

    if exists (
        select 1
        from information_schema.columns
        where table_schema = 'public'
          and table_name = 'transactions'
          and column_name = 'lens_kanan_minus'
    ) and not exists (
        select 1
        from information_schema.columns
        where table_schema = 'public'
          and table_name = 'transactions'
          and column_name = 'lens_kanan_speris'
    ) then
        alter table public.transactions
            rename column lens_kanan_minus to lens_kanan_speris;
    end if;

    if exists (
        select 1
        from information_schema.columns
        where table_schema = 'public'
          and table_name = 'transactions'
          and column_name = 'lens_kiri_plus'
    ) and not exists (
        select 1
        from information_schema.columns
        where table_schema = 'public'
          and table_name = 'transactions'
          and column_name = 'lens_kiri_addition'
    ) then
        alter table public.transactions
            rename column lens_kiri_plus to lens_kiri_addition;
    end if;

    if exists (
        select 1
        from information_schema.columns
        where table_schema = 'public'
          and table_name = 'transactions'
          and column_name = 'lens_kanan_plus'
    ) and not exists (
        select 1
        from information_schema.columns
        where table_schema = 'public'
          and table_name = 'transactions'
          and column_name = 'lens_kanan_addition'
    ) then
        alter table public.transactions
            rename column lens_kanan_plus to lens_kanan_addition;
    end if;
end $$;
