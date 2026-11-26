# Changelog

Semua perubahan penting di project ini dicatat di file ini.

## [Unreleased] - 2026-11-26

### Added

- Sistem **Supabase Free Tier Keep-Alive** berbasis operasi tulis + baca nyata:
  - Migration [`supabase/keep-alive.sql`](./supabase/keep-alive.sql) (tabel 1-baris `public.keep_alive` + fungsi RPC `public.ping_keep_alive()`).
  - Endpoint `/api/keep-alive` (`src/pages/api/keep-alive.ts` & `src/lib/keep-alive-utils.ts`) dengan dukungan `CRON_SECRET` opsional dan `Cache-Control: no-store`.
  - Jadwal Vercel Cron harian (`vercel.json`) dan workflow backup GitHub Actions 2x sehari (`.github/workflows/supabase-keep-alive.yml`).
- Opsi **input tanggal transaksi manual (mundur)** pada form transaksi di `/transactions` untuk mempermudah digitalisasi catatan buku tulis fisik, dengan fallback otomatis ke waktu realtime saat ini.
- Proteksi visual **CAPTCHA canvas** (`src/components/simple-captcha.tsx`, `src/lib/captcha-utils.ts`) dan tombol **reveal password** (`Eye`/`EyeOff`) pada form login.
- Unit test tambahan untuk CAPTCHA, resolusi tanggal transaksi manual, dan utilitas keep-alive (total 18 unit tests).

### Changed

- Penyeragaman desain header ringkas (*compact header*) pada halaman `/customers` dan `/transactions` agar area utama berfokus penuh pada form input dan tabel data.
- Upgrade Next.js ke `15.5.29` dan migrasi script linting ke ESLint flat config (`eslint .`).

### Fixed

- Perbaikan cron keep-alive yang sebelumnya hanya mengirim request `HEAD` anonim ke tabel ber-RLS (`customers`) sehingga tidak dihitung sebagai *"sufficient database activity"* oleh Supabase.
- Perbaikan konflik manifest `.next/server/pages/_app/build-manifest.json` pada Pages Router dengan menggunakan `next dev` stabil.
- Perbaikan *clipping* karakter ke-4 pada canvas CAPTCHA di container flex dan toleransi spasi saat validasi input CAPTCHA.

## [0.1.0] - 2026-03-08

### Added

- Homepage modern untuk memperkenalkan aplikasi SOEBAGJO dan menampilkan preview struktur data.
- Halaman `/customers` dengan login Supabase, session handling, logout, dan input data customer.
- Halaman `/transactions` dengan input resep lensa lengkap, search customer, filter histori, dan pagination 25 data.
- Tampilan mobile-friendly untuk homepage, halaman customer, dan halaman transaksi.
- Card list mobile untuk histori customer dan transaksi agar lebih nyaman di handphone.
- Dukungan field `axis` untuk lensa kiri dan kanan.
- Dukungan `phone_number` di transaksi.
- SQL schema awal untuk `customers` dan `transactions` beserta RLS policy Supabase.
- Migration tambahan:
  `add-transaction-axis.sql`,
  `rename-transaction-speris-addition.sql`,
  `split-transaction-price.sql`.
- Unit test berbasis Node test runner tanpa dependency tambahan.
- Dokumentasi setup, database, testing, dan arsitektur project.

### Changed

- Istilah `minus` diganti menjadi `Speris`.
- Istilah `plus` diganti menjadi `Addition`.
- Field harga tunggal `price` dipecah menjadi `lens_price` dan `frame_price`.
- Layout halaman transaksi diubah sehingga form berada di atas tabel agar area input lebih lega.
- Dependensi `next` dan `eslint-config-next` diperbarui ke `15.3.8`.
- Komponen non-route dipindahkan dari `src/pages/**` ke `src/features/**` agar sesuai dengan aturan Pages Router.

### Fixed

- Konsistensi penamaan field transaksi antara UI, TypeScript interface, dan schema database.
- Konsistensi tampilan harga Rupiah di tabel histori transaksi.
- Kegagalan build production/Vercel karena file helper di dalam `src/pages` dianggap sebagai page.
- Keterbacaan dan usability halaman pada layar mobile.
