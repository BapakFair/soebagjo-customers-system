# SOEBAGJO

Web app internal untuk toko optik SOEBAGJO. Aplikasi ini dipakai untuk menggantikan pencatatan manual di buku dengan database customer dan transaksi optik berbasis Next.js + Supabase.

## Fitur utama

- Homepage modern untuk menjelaskan produk dan struktur data.
- Halaman `/customers` untuk login internal Supabase dan input data customer.
- Halaman `/transactions` untuk input resep lensa, harga lensa, harga frame, dan histori transaksi.
- Filter histori transaksi berdasarkan nama customer dan tanggal transaksi.
- Pagination histori transaksi dengan ukuran awal 25 baris.
- SQL schema dan migration untuk setup baru maupun perubahan schema yang sudah berjalan.

## Tech stack

- Next.js 15 (Pages Router)
- React 19
- TypeScript
- Tailwind CSS 4
- Supabase Auth + Database
- TanStack React Table

## Struktur route

- `/`
  Homepage produk dan preview schema.
- `/customers`
  Login Supabase, daftar customer, dan form tambah customer.
- `/transactions`
  Protected page untuk input transaksi customer dan melihat histori transaksi.

## Struktur data transaksi

Field utama transaksi saat ini:

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

## Quick start

1. Install dependency:

```bash
npm install
```

2. Copy env:

```bash
cp .env.example .env.local
```

3. Isi `NEXT_PUBLIC_SUPABASE_URL` dan `NEXT_PUBLIC_SUPABASE_ANON_KEY` di `.env.local`.

4. Siapkan database:

- Project Supabase baru: jalankan [`supabase/setup.sql`](./supabase/setup.sql)
- Project existing: lihat urutan migration di [`docs/DATABASE.md`](./docs/DATABASE.md)

5. Buat user internal di Supabase `Auth > Users`.

6. Jika hanya user terdaftar yang boleh login, nonaktifkan public sign-up di `Auth > Providers > Email`.

7. Jalankan server:

```bash
npm run dev
```

8. Buka:

- `http://127.0.0.1:3000/`
- `http://127.0.0.1:3000/customers`
- `http://127.0.0.1:3000/transactions`

## Script

- `npm run dev`
  Menjalankan Next.js dev server.
- `npm run build`
  Build production.
- `npm run start`
  Menjalankan hasil build.
- `npm run lint`
  Menjalankan ESLint.
- `npm run typecheck`
  Menjalankan TypeScript type check.
- `npm run test`
  Compile unit test TypeScript ke folder sementara `.test-dist`, lalu menjalankan `node --test`.

## SQL yang tersedia

- [`supabase/setup.sql`](./supabase/setup.sql)
  Schema lengkap untuk project baru.
- [`supabase/add-transaction-axis.sql`](./supabase/add-transaction-axis.sql)
  Menambahkan kolom axis ke schema lama.
- [`supabase/rename-transaction-speris-addition.sql`](./supabase/rename-transaction-speris-addition.sql)
  Rename kolom `minus/plus` menjadi `speris/addition`.
- [`supabase/split-transaction-price.sql`](./supabase/split-transaction-price.sql)
  Memecah `price` menjadi `lens_price` dan `frame_price`.

## Dokumentasi

- [`docs/SETUP.md`](./docs/SETUP.md)
- [`docs/DATABASE.md`](./docs/DATABASE.md)
- [`docs/TESTING.md`](./docs/TESTING.md)
- [`docs/ARCHITECTURE.md`](./docs/ARCHITECTURE.md)
- [`CHANGELOG.md`](./CHANGELOG.md)

## Testing

Unit test saat ini fokus ke logic yang paling penting dan mudah rusak:

- parsing angka dan input harga
- perhitungan total transaksi
- filter histori transaksi
- pagination histori transaksi
- formatter dasar yang dipakai tabel

Jalankan:

```bash
npm run test
```
