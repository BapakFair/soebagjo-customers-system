# Setup

## Prasyarat

- Node.js 22 atau lebih baru
- npm
- Project Supabase

## 1. Install dependency

```bash
npm install
```

## 2. Siapkan environment

Copy contoh env:

```bash
cp .env.example .env.local
```

Isi nilai berikut di `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

## 3. Siapkan database Supabase

Untuk project baru, jalankan file berikut di SQL Editor Supabase:

```sql
-- isi file:
supabase/setup.sql
```

Untuk project existing, baca urutan migration di [`DATABASE.md`](./DATABASE.md).

## 4. Siapkan autentikasi

1. Buka `Auth > Users` di Supabase.
2. Tambahkan user internal yang diizinkan login.
3. Jika aplikasi hanya untuk staf internal, nonaktifkan public sign-up di `Auth > Providers > Email`.

## 5. Jalankan aplikasi

```bash
npm run dev
```

Jika PowerShell bermasalah dengan `npm.ps1`, gunakan:

```bash
npm.cmd run dev
```

## 6. URL penting

- Homepage: `http://127.0.0.1:3000/`
- Customers: `http://127.0.0.1:3000/customers`
- Transactions: `http://127.0.0.1:3000/transactions`

## 7. Verifikasi minimum

```bash
npm run typecheck
npm run lint
npm run test
```
