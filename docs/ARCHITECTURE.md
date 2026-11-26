# Architecture

## Ringkasan

Project ini menggunakan Next.js Pages Router dengan Supabase client-side untuk auth dan akses data.

## Folder penting

- `src/pages`
  Route aplikasi.
- `src/pages/customers`
  Login internal Supabase, daftar customer, form tambah customer.
- `src/pages/transactions`
  Form transaksi (mendukung waktu otomatis maupun input tanggal mundur manual) dan tabel histori transaksi.
- `src/pages/api/keep-alive.ts`
  Endpoint cron keep-alive yang mengeksekusi RPC tulis `ping_keep_alive()` dan query baca `GET` ke tabel `keep_alive`.
- `src/components`
  Komponen reusable seperti tabel, card, alert, input, dan `simple-captcha`.
- `src/lib`
  Utility dan konfigurasi client seperti `db.ts`, formatter, helper transaksi, helper CAPTCHA, dan helper keep-alive.
- `src/types`
  Definisi interface data customer dan transaksi.
- `supabase`
  Schema awal dan migration SQL.
- `tests`
  Unit test untuk utility murni.

## Alur auth

1. Browser membuat client Supabase dari `src/lib/db.ts`
2. User login di `/customers`
3. Session disimpan di browser oleh Supabase client
4. Halaman `/transactions` membaca session yang sama
5. Jika tidak ada session, user diarahkan untuk login lebih dulu

## Alur data customer

1. User login
2. Halaman `/customers` mengambil data dari tabel `customers`
3. User dapat menambah customer baru
4. Tabel customer di-refresh setelah insert berhasil

## Alur data transaksi

1. Halaman `/transactions` mengambil daftar customer untuk pilihan form
2. User memilih customer dan mengisi resep lensa
3. User mengisi `lens_price`, `frame_price`, `frame`, dan catatan
4. Data di-insert ke tabel `transactions`
5. Histori transaksi dimuat ulang dan langsung tampil di tabel

## Utility layer

Beberapa logic murni dipisahkan dari komponen:

- `src/lib/formatters.ts`
  Formatter Rupiah, tanggal, dan nilai lensa.
- `src/lib/transaction-utils.ts`
  Parsing numeric input, normalisasi harga, total transaksi, resolusi timestamp transaksi manual, filter, dan pagination.
- `src/lib/captcha-utils.ts`
  Generator kode karakter non-ambigu dan validator CAPTCHA bebas masalah spasi/huruf besar-kecil.
- `src/lib/keep-alive-utils.ts`
  Validasi header `CRON_SECRET` dan deteksi status ketersediaan schema `keep_alive` di Supabase.

Pemisahan ini sengaja dibuat agar logic tersebut bisa diunit-test tanpa harus merender komponen React.
