# Changelog

Semua perubahan penting di project ini dicatat di file ini.

## [Unreleased] - 2026-03-08

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
