# Testing

## Tujuan

Unit test di project ini difokuskan pada logic murni yang paling penting:

- parsing angka dari input form
- normalisasi input harga
- perhitungan total transaksi
- filter histori transaksi
- pagination histori transaksi
- formatter dasar untuk tampilan tabel

## Cara kerja

Project ini belum memakai framework test eksternal seperti Vitest atau Jest.

Sebagai gantinya:

1. File test TypeScript di-compile ke folder sementara `.test-dist`
2. Test dijalankan dengan Node built-in test runner (`node --test`)

Keuntungan pendekatan ini:

- tidak menambah dependency test tambahan
- cocok untuk logic unit yang murni
- tetap bisa jalan di environment lokal yang sederhana

## Menjalankan test

```bash
npm run test
```

Script yang dipakai:

- `scripts/run-unit-tests.mjs`
- `tsconfig.test.json`

## Lokasi test

- `tests/transaction-utils.test.ts`
- `tests/formatters.test.ts`

## Area yang belum di-cover

Yang belum diuji otomatis saat ini:

- interaksi UI React
- login flow Supabase secara end-to-end
- insert/query database secara integration test

Kalau coverage ingin diperluas, langkah berikutnya yang masuk akal adalah menambah:

- integration test untuk util + payload Supabase
- component test untuk form customer dan transaksi
- e2e test untuk login dan alur input data
