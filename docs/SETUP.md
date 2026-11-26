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
4. Halaman login di `/customers` dilengkapi dengan keamanan visual CAPTCHA untuk mencegah bot brute-force.

## 5. Supabase Free Tier Keep-Alive (Cron Job)

Agar project Supabase Free Tier tidak terkena *auto-pause* akibat *"insufficient database activity"* selama 7 hari:

1. **Pastikan schema `keep_alive` sudah terpasang di Supabase**:
   - Jika memakai `supabase/setup.sql` versi terbaru, tabel dan fungsi RPC sudah otomatis ikut dibuat.
   - Untuk project Supabase lama/existing, jalankan [`../supabase/keep-alive.sql`](../supabase/keep-alive.sql) satu kali di **Supabase SQL Editor**.
2. **Cara kerja endpoint `/api/keep-alive`**:
   - Tidak menggunakan request `HEAD` ke tabel ber-RLS ketat (karena request `HEAD` anonim yang ditolak RLS tidak dihitung sebagai aktivitas memadai oleh Supabase).
   - Mengeksekusi **operasi WRITE nyata** melalui RPC `public.ping_keep_alive()` (`INSERT ... ON CONFLICT DO UPDATE` pada baris tunggal `id = 1`) diikuti **operasi READ nyata (`GET`)** ke `public.keep_alive` dengan header `Cache-Control: no-store`.
   - Data `customers` dan `transactions` tetap 100% tertutup RLS (`authenticated`), dan tabel `keep_alive` dikunci `check (id = 1)` sehingga tidak pernah membengkak.
3. **Penjadwalan otomatis**:
   - **Vercel Cron (`vercel.json`)**: Berjalan otomatis di deployment Production setiap hari pukul 07:00 WIB (`0 0 * * *`) memanggil `/api/keep-alive`. Opsional: set variabel `CRON_SECRET` di Vercel Environment Variables bila ingin mengunci akses endpoint menggunakan header `Bearer <CRON_SECRET>`.
   - **GitHub Actions (`.github/workflows/supabase-keep-alive.yml`)**: Backup cron 2x sehari (`15 3,15 * * *` / 10:15 & 22:15 WIB). Aktif otomatis apabila `NEXT_PUBLIC_SUPABASE_URL` dan `NEXT_PUBLIC_SUPABASE_ANON_KEY` ditambahkan di GitHub Repository Secrets.
4. **Cek manual**:
   - Buka `https://<domain-anda>/api/keep-alive` — pastikan response `"success": true` dan nilai `"ping_count"` bertambah setiap kali halaman di-refresh.

## 6. Jalankan aplikasi

```bash
npm run dev
```

Jika PowerShell bermasalah dengan `npm.ps1`, gunakan:

```bash
npm.cmd run dev
```

## 7. URL penting

- Homepage: `http://127.0.0.1:3000/`
- Customers: `http://127.0.0.1:3000/customers`
- Transactions: `http://127.0.0.1:3000/transactions`
- Keep-Alive Healthcheck: `http://127.0.0.1:3000/api/keep-alive`

## 8. Verifikasi minimum

```bash
npm run typecheck
npm run lint
npm run test
npm run build
```
