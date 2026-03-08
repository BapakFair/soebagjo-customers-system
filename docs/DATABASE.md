# Database

## Tabel utama

### `public.customers`

- `id`
- `created_at`
- `name`
- `phone_number`
- `notes_customer`

### `public.transactions`

- `id`
- `created_at`
- `customer_id`
- `phone_number`
- `lens_kiri_speris`
- `lens_kanan_speris`
- `lens_kiri_addition`
- `lens_kanan_addition`
- `lens_kiri_cylinder`
- `lens_kanan_cylinder`
- `lens_kiri_axis`
- `lens_kanan_axis`
- `pupil_distance`
- `lens_price`
- `frame_price`
- `frame`
- `notes_transaction`

## Project baru

Untuk database baru, cukup jalankan:

- [`../supabase/setup.sql`](../supabase/setup.sql)

Script ini sudah berisi:

- pembuatan tabel `customers`
- pembuatan tabel `transactions`
- index dasar
- RLS
- policy untuk role `authenticated`

## Project existing

Jika project Supabase sudah berjalan dan schema bertahap diperbarui, jalankan migration sesuai kebutuhan.

Urutan aman:

1. [`../supabase/add-transaction-axis.sql`](../supabase/add-transaction-axis.sql)
2. [`../supabase/rename-transaction-speris-addition.sql`](../supabase/rename-transaction-speris-addition.sql)
3. [`../supabase/split-transaction-price.sql`](../supabase/split-transaction-price.sql)

Catatan:

- `add-transaction-axis.sql` menambahkan `lens_kiri_axis` dan `lens_kanan_axis`.
- `rename-transaction-speris-addition.sql` mengubah kolom lama:
  - `lens_kiri_minus` -> `lens_kiri_speris`
  - `lens_kanan_minus` -> `lens_kanan_speris`
  - `lens_kiri_plus` -> `lens_kiri_addition`
  - `lens_kanan_plus` -> `lens_kanan_addition`
- `split-transaction-price.sql` mengubah `price` menjadi `lens_price` lalu menambahkan `frame_price`.

## RLS

Schema default memakai Row Level Security dan policy untuk role `authenticated`.

Implikasi:

- user harus login via Supabase Auth untuk membaca dan menulis data
- public visitor tidak bisa mengakses tabel secara langsung dari app client

## Saran operasional

- Gunakan project Supabase terpisah untuk development dan production.
- Simpan backup sebelum menjalankan migration pada database yang sudah berisi data.
- Jalankan migration satu per satu dan cek hasil schema setelah tiap langkah.
