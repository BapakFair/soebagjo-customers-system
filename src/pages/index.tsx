import Link from "next/link";
import {
  ArrowRight,
  Clock3,
  Database,
  Eye,
  Search,
  ShieldCheck,
  Users,
} from "lucide-react";

import { Button } from "@/components/ui/button";

const metrics = [
  { value: "1 pusat data", label: "Semua customer dan transaksi tersimpan rapi di satu tempat" },
  {
    value: "17 field transaksi",
    label: "Resep lensa, axis, frame, harga lensa, harga frame, catatan, dan nomor telepon",
  },
  { value: "Realtime", label: "Tim toko bisa melihat histori pelanggan tanpa bongkar buku" },
];

const features = [
  {
    title: "Data customer terpusat",
    description:
      "Nama, phone number, dan catatan customer tersimpan konsisten untuk ribuan pelanggan.",
    icon: Users,
  },
  {
    title: "Transaksi optik lengkap",
    description:
      "Speris, Addition, cylinder, axis kiri dan kanan, pupil distance, frame, harga lensa, harga frame, dan catatan transaksi tercatat detail.",
    icon: Eye,
  },
  {
    title: "Cari histori dalam detik",
    description:
      "Pencarian customer lebih cepat dibanding arsip buku manual, termasuk saat butuh repeat order.",
    icon: Search,
  },
  {
    title: "Next.js + Supabase",
    description:
      "Fondasi modern untuk dashboard internal, autentikasi, backup data, dan pengembangan fitur berikutnya.",
    icon: Database,
  },
  {
    title: "Siap untuk operasional toko",
    description:
      "Tampilan dibuat sederhana untuk staf, tetapi cukup kuat untuk menampung data bertahun-tahun.",
    icon: ShieldCheck,
  },
  {
    title: "Lebih cepat melayani customer lama",
    description:
      "Riwayat ukuran lensa dan transaksi sebelumnya bisa dibuka kembali tanpa menulis ulang dari awal.",
    icon: Clock3,
  },
];

const customerFields = ["id", "created_at", "name", "phone_number", "notes_customer"];

const transactionFields = [
  "id",
  "created_at",
  "customer_id",
  "phone_number",
  "lens_kiri_speris",
  "lens_kanan_speris",
  "lens_kiri_addition",
  "lens_kanan_addition",
  "lens_kiri_cylinder",
  "lens_kanan_cylinder",
  "lens_kiri_axis",
  "lens_kanan_axis",
  "pupil_distance",
  "lens_price",
  "frame_price",
  "notes_transaction",
  "frame",
];

const workflow = [
  {
    step: "01",
    title: "Input customer baru",
    description: "Simpan identitas dasar, nomor telepon, dan catatan penting customer.",
  },
  {
    step: "02",
    title: "Catat transaksi optik",
    description:
      "Masukkan Speris, Addition, axis, frame, harga lensa, harga frame, dan catatan transaksi di form yang sama.",
  },
  {
    step: "03",
    title: "Buka kembali kapan saja",
    description: "Cari histori pelanggan lama untuk repeat order, revisi, atau pengecekan data.",
  },
];

export default function Home() {
  return (
    <main className="min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top_left,_rgba(15,118,110,0.22),_transparent_30%),radial-gradient(circle_at_85%_10%,_rgba(217,119,6,0.18),_transparent_24%),linear-gradient(180deg,#fcfaf4_0%,#fffdfa_42%,#eef6f3_100%)] text-slate-900">
      <section className="mx-auto max-w-7xl px-6 pb-24 pt-8 sm:px-8 lg:px-10">
        <div className="rounded-full border border-white/70 bg-white/60 px-4 py-2 text-xs font-semibold tracking-[0.28em] text-teal-900/80 uppercase shadow-sm backdrop-blur">
          SOEBAGJO • Optical Customer Database
        </div>

        <div className="mt-10 grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold tracking-[0.24em] text-amber-700 uppercase">
              Dari buku manual ke web app modern
            </p>
            <h1 className="mt-4 max-w-4xl text-5xl leading-[0.95] font-semibold tracking-[-0.05em] text-slate-950 sm:text-6xl lg:text-7xl">
              Sistem customer optik yang lebih rapi, lebih cepat, dan siap dipakai setiap hari.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-700">
              SOEBAGJO adalah aplikasi sederhana untuk membantu toko optik menyimpan ribuan data
              customer dan histori transaksi lensa dalam satu database yang mudah dicari, bukan lagi
              tersebar di buku catatan.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button
                asChild
                size="lg"
                className="h-12 rounded-full bg-teal-900 px-6 text-sm font-semibold text-white hover:bg-teal-800"
              >
                <Link href="/customers">
                  Lihat Data Customer
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="h-12 rounded-full border-slate-300 bg-white/70 px-6 text-sm font-semibold text-slate-900 backdrop-blur hover:bg-white"
              >
                <a href="#schema">Lihat Struktur Data</a>
              </Button>
            </div>

            <div className="mt-10 grid gap-4 sm:grid-cols-3">
              {metrics.map((metric) => (
                <div
                  key={metric.label}
                  className="rounded-3xl border border-white/70 bg-white/75 p-5 shadow-[0_16px_50px_rgba(15,23,42,0.08)] backdrop-blur"
                >
                  <p className="text-2xl font-semibold tracking-[-0.04em] text-slate-950">
                    {metric.value}
                  </p>
                  <p className="mt-2 text-sm leading-6 text-slate-600">{metric.label}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="absolute inset-x-10 top-8 h-56 rounded-full bg-teal-400/20 blur-3xl" />
            <div className="relative overflow-hidden rounded-[32px] border border-slate-200/80 bg-slate-950 p-5 text-white shadow-[0_24px_80px_rgba(15,23,42,0.25)]">
              <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                <div>
                  <p className="text-xs tracking-[0.24em] text-teal-200 uppercase">Dashboard Preview</p>
                  <p className="mt-1 text-sm font-medium text-white/80">
                    Customer record untuk repeat order dan histori lensa
                  </p>
                </div>
                <div className="rounded-full bg-teal-400/20 px-3 py-1 text-xs font-semibold text-teal-200">
                  Supabase Sync
                </div>
              </div>

              <div className="mt-5 grid gap-4 md:grid-cols-[0.95fr_1.05fr]">
                <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
                  <p className="text-xs tracking-[0.22em] text-white/45 uppercase">Customer Snapshot</p>
                  <div className="mt-4 rounded-2xl bg-white p-4 text-slate-900">
                    <p className="text-sm font-semibold">Ibu Ratna Kusuma</p>
                    <p className="mt-1 text-sm text-slate-500">Customer sejak 2021</p>
                    <div className="mt-4 space-y-3 text-sm">
                      <div className="flex items-center justify-between rounded-xl bg-slate-100 px-3 py-2">
                        <span className="text-slate-500">Phone</span>
                        <span className="font-medium">0812-8899-2211</span>
                      </div>
                      <div className="flex items-center justify-between rounded-xl bg-slate-100 px-3 py-2">
                        <span className="text-slate-500">Frame</span>
                        <span className="font-medium">Titanium Slim</span>
                      </div>
                      <div className="flex items-center justify-between rounded-xl bg-slate-100 px-3 py-2">
                        <span className="text-slate-500">Harga Lensa</span>
                        <span className="font-medium">Rp850.000</span>
                      </div>
                      <div className="flex items-center justify-between rounded-xl bg-slate-100 px-3 py-2">
                        <span className="text-slate-500">Harga Frame</span>
                        <span className="font-medium">Rp1.000.000</span>
                      </div>
                      <div className="flex items-center justify-between rounded-xl bg-slate-100 px-3 py-2">
                        <span className="text-slate-500">Total</span>
                        <span className="font-medium">Rp1.850.000</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="rounded-3xl border border-teal-400/30 bg-teal-400/10 p-4">
                    <p className="text-xs tracking-[0.22em] text-teal-200 uppercase">Prescription Record</p>
                    <div className="mt-4 grid grid-cols-2 gap-3">
                      {[
                        ["L. Kiri Speris", "-1.25"],
                        ["L. Kanan Speris", "-1.00"],
                        ["L. Kiri Addition", "1.50"],
                        ["L. Kanan Addition", "1.25"],
                        ["L. Kiri Cylinder", "-0.50"],
                        ["L. Kanan Cylinder", "-0.25"],
                        ["L. Kiri Axis", "180"],
                        ["L. Kanan Axis", "175"],
                        ["Pupil Distance", "61 mm"],
                        ["Catatan", "Anti radiasi"],
                      ].map(([label, value]) => (
                        <div key={label} className="rounded-2xl border border-white/10 bg-black/20 p-3">
                          <p className="text-xs text-white/45">{label}</p>
                          <p className="mt-1 text-sm font-semibold text-white">{value}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
                    <p className="text-xs tracking-[0.22em] text-white/45 uppercase">Kenapa penting</p>
                    <p className="mt-3 text-sm leading-7 text-white/80">
                      Saat customer lama kembali, staf toko cukup cari nama atau phone number untuk membuka
                      histori ukuran lensa dan transaksi sebelumnya.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-24 sm:px-8 lg:px-10">
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <article
                key={feature.title}
                className="rounded-[28px] border border-slate-200/80 bg-white/80 p-6 shadow-[0_18px_60px_rgba(15,23,42,0.06)] backdrop-blur"
              >
                <div className="flex size-12 items-center justify-center rounded-2xl bg-amber-100 text-amber-700">
                  <Icon className="size-5" />
                </div>
                <h2 className="mt-5 text-2xl font-semibold tracking-[-0.04em] text-slate-950">
                  {feature.title}
                </h2>
                <p className="mt-3 text-sm leading-7 text-slate-600">{feature.description}</p>
              </article>
            );
          })}
        </div>
      </section>

      <section
        id="schema"
        className="border-y border-slate-200/70 bg-[linear-gradient(180deg,rgba(255,255,255,0.72)_0%,rgba(244,248,247,0.94)_100%)]"
      >
        <div className="mx-auto grid max-w-7xl gap-10 px-6 py-24 sm:px-8 lg:grid-cols-[0.85fr_1.15fr] lg:px-10">
          <div>
            <p className="text-sm font-semibold tracking-[0.22em] text-teal-800 uppercase">Struktur data</p>
            <h2 className="mt-4 text-4xl font-semibold tracking-[-0.05em] text-slate-950 sm:text-5xl">
              Dirancang dari kebutuhan toko yang nyata.
            </h2>
            <p className="mt-5 max-w-xl text-base leading-8 text-slate-600">
              Homepage ini memvisualisasikan dua inti data aplikasi: data customer dan data transaksi optik.
              Fokusnya bukan sekadar cantik, tapi jelas memperlihatkan informasi apa saja yang akan tersimpan.
            </p>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-[0_18px_60px_rgba(15,23,42,0.06)]">
              <p className="text-xs font-semibold tracking-[0.24em] text-slate-500 uppercase">Customers</p>
              <h3 className="mt-3 text-2xl font-semibold tracking-[-0.04em] text-slate-950">
                Tabel customer
              </h3>
              <div className="mt-5 flex flex-wrap gap-2">
                {customerFields.map((field) => (
                  <span
                    key={field}
                    className="rounded-full border border-slate-200 bg-slate-100 px-3 py-2 text-xs font-semibold text-slate-700"
                  >
                    {field}
                  </span>
                ))}
              </div>
            </div>

            <div className="rounded-[28px] border border-teal-900/10 bg-slate-950 p-6 text-white shadow-[0_18px_60px_rgba(15,23,42,0.16)]">
              <p className="text-xs font-semibold tracking-[0.24em] text-teal-200 uppercase">Transactions</p>
              <h3 className="mt-3 text-2xl font-semibold tracking-[-0.04em] text-white">
                Tabel transaksi optik
              </h3>
              <div className="mt-5 flex flex-wrap gap-2">
                {transactionFields.map((field) => (
                  <span
                    key={field}
                    className="rounded-full border border-white/10 bg-white/8 px-3 py-2 text-xs font-semibold text-white/88"
                  >
                    {field}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-24 sm:px-8 lg:px-10">
        <div className="grid gap-5 lg:grid-cols-3">
          {workflow.map((item) => (
            <article
              key={item.step}
              className="rounded-[28px] border border-slate-200/80 bg-white/80 p-6 shadow-[0_18px_60px_rgba(15,23,42,0.06)] backdrop-blur"
            >
              <p className="text-sm font-semibold tracking-[0.24em] text-amber-700 uppercase">{item.step}</p>
              <h3 className="mt-4 text-2xl font-semibold tracking-[-0.04em] text-slate-950">
                {item.title}
              </h3>
              <p className="mt-3 text-sm leading-7 text-slate-600">{item.description}</p>
            </article>
          ))}
        </div>

        <div className="mt-10 rounded-[32px] border border-slate-200/80 bg-slate-950 px-6 py-8 text-white shadow-[0_24px_80px_rgba(15,23,42,0.2)] sm:px-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-2xl">
              <p className="text-sm font-semibold tracking-[0.24em] text-teal-200 uppercase">
                Homepage concept
              </p>
              <h2 className="mt-3 text-3xl font-semibold tracking-[-0.05em] text-white sm:text-4xl">
                Visual ini siap dikirim ke Figma sebagai dasar diskusi UI.
              </h2>
              <p className="mt-4 text-sm leading-7 text-white/75">
                Fokus desainnya adalah rasa modern, terpercaya, dan operasional. Cocok untuk aplikasi internal
                yang nantinya berkembang ke dashboard customer dan transaksi.
              </p>
            </div>

            <Button
              asChild
              size="lg"
              className="h-12 rounded-full bg-white px-6 text-sm font-semibold text-slate-950 hover:bg-slate-100"
            >
              <Link href="/customers">
                Buka Halaman Customer
                <ArrowRight className="size-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
}
