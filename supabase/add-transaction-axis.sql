alter table public.transactions
    add column if not exists lens_kiri_axis numeric(6,2) not null default 0,
    add column if not exists lens_kanan_axis numeric(6,2) not null default 0;
