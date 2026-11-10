import Head from "next/head";
import Link from "next/link";
import React from "react";
import type { Session } from "@supabase/supabase-js";
import {
  AlertCircle,
  ArrowRight,
  Clock,
  Eye,
  FileText,
  LoaderCircle,
  LogOut,
  RefreshCw,
  Search,
  Users,
} from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { TransactionsTable } from "@/features/transactions/transactions-table";
import supabase from "@/lib/db";
import { formatCurrency, formatDateTime } from "@/lib/formatters";
import {
  getTransactionTotal,
  normalizePriceInput,
  parseNumericInput,
  resolveTransactionTimestamp,
} from "@/lib/transaction-utils";
import type { ICustomer } from "@/types/customers";
import type { ITransaction, ITransactionListItem } from "@/types/transactions";

type CustomerOption = Pick<ICustomer, "id" | "name" | "phone_number">;

type TransactionFormState = {
  customer_id: string;
  phone_number: string;
  use_manual_date: boolean;
  manual_date: string;
  manual_time: string;
  lens_kiri_speris: string;
  lens_kanan_speris: string;
  lens_kiri_addition: string;
  lens_kanan_addition: string;
  lens_kiri_cylinder: string;
  lens_kanan_cylinder: string;
  lens_kiri_axis: string;
  lens_kanan_axis: string;
  pupil_distance: string;
  lens_price: string;
  frame_price: string;
  notes_transaction: string;
  frame: string;
};

type TransactionJoinRow = ITransaction & {
  customers?: { name?: string } | Array<{ name?: string }> | null;
};

const initialTransactionForm: TransactionFormState = {
  customer_id: "",
  phone_number: "",
  use_manual_date: false,
  manual_date: "",
  manual_time: "",
  lens_kiri_speris: "0",
  lens_kanan_speris: "0",
  lens_kiri_addition: "0",
  lens_kanan_addition: "0",
  lens_kiri_cylinder: "0",
  lens_kanan_cylinder: "0",
  lens_kiri_axis: "0",
  lens_kanan_axis: "0",
  pupil_distance: "0",
  lens_price: "0",
  frame_price: "0",
  notes_transaction: "",
  frame: "",
};

export default function TransactionsPage() {
  const [session, setSession] = React.useState<Session | null>(null);
  const [customerOptions, setCustomerOptions] = React.useState<CustomerOption[]>([]);
  const [transactions, setTransactions] = React.useState<ITransactionListItem[]>([]);
  const [isAuthLoading, setIsAuthLoading] = React.useState(true);
  const [isLoadingCustomers, setIsLoadingCustomers] = React.useState(false);
  const [isLoadingTransactions, setIsLoadingTransactions] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [isSigningOut, setIsSigningOut] = React.useState(false);
  const [customerSearch, setCustomerSearch] = React.useState("");
  const [transactionForm, setTransactionForm] =
    React.useState<TransactionFormState>(initialTransactionForm);
  const [dataError, setDataError] = React.useState<string | null>(null);
  const [successMessage, setSuccessMessage] = React.useState<string | null>(null);

  const isSupabaseConfigured = Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
  const normalizedCustomerSearch = customerSearch.trim().toLowerCase();
  const visibleCustomerOptions = customerOptions.filter((customer) =>
    customer.name.toLowerCase().includes(normalizedCustomerSearch)
  );
  const selectableCustomerOptions =
    visibleCustomerOptions.length > 0 ? visibleCustomerOptions : customerOptions;

  const loadCustomerOptions = React.useCallback(async () => {
    setIsLoadingCustomers(true);
    setDataError(null);

    const { data, error } = await supabase
      .from("customers")
      .select("id, name, phone_number")
      .order("name", { ascending: true });

    if (error) {
      setDataError(error.message);
      setIsLoadingCustomers(false);
      return;
    }

    setCustomerOptions((data ?? []) as CustomerOption[]);
    setIsLoadingCustomers(false);
  }, []);

  const loadTransactions = React.useCallback(async () => {
    setIsLoadingTransactions(true);
    setDataError(null);

    const { data, error } = await supabase
      .from("transactions")
      .select(
        "id, created_at, customer_id, phone_number, lens_kiri_speris, lens_kanan_speris, lens_kiri_addition, lens_kanan_addition, lens_kiri_cylinder, lens_kanan_cylinder, lens_kiri_axis, lens_kanan_axis, pupil_distance, lens_price, frame_price, notes_transaction, frame, customers(name)"
      )
      .order("created_at", { ascending: false });

    if (error) {
      setDataError(error.message);
      setIsLoadingTransactions(false);
      return;
    }

    const mappedRows = ((data ?? []) as TransactionJoinRow[]).map((row) => {
      const customer = Array.isArray(row.customers) ? row.customers[0] : row.customers;

      return {
        ...row,
        customer_name: customer?.name ?? `Customer #${row.customer_id}`,
      };
    });

    setTransactions(mappedRows);
    setIsLoadingTransactions(false);
  }, []);

  React.useEffect(() => {
    let isMounted = true;

    if (!isSupabaseConfigured) {
      setIsAuthLoading(false);
      return;
    }

    async function bootstrapSession() {
      const { data, error } = await supabase.auth.getSession();

      if (!isMounted) {
        return;
      }

      if (error) {
        setDataError(error.message);
      }

      setSession(data.session);
      setIsAuthLoading(false);

      if (data.session) {
        await Promise.all([loadCustomerOptions(), loadTransactions()]);
      }
    }

    void bootstrapSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      if (!isMounted) {
        return;
      }

      setSession(nextSession);

      if (!nextSession) {
        setCustomerOptions([]);
        setTransactions([]);
        return;
      }

      void Promise.all([loadCustomerOptions(), loadTransactions()]);
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, [isSupabaseConfigured, loadCustomerOptions, loadTransactions]);

  React.useEffect(() => {
    if (selectableCustomerOptions.length === 0) {
      return;
    }

    setTransactionForm((current) => {
      const selected =
        selectableCustomerOptions.find((customer) => String(customer.id) === current.customer_id) ??
        selectableCustomerOptions[0];

      if (
        current.customer_id === String(selected.id) &&
        current.phone_number === selected.phone_number
      ) {
        return current;
      }

      return {
        ...current,
        customer_id: String(selected.id),
        phone_number: selected.phone_number,
      };
    });
  }, [selectableCustomerOptions]);

  async function handleLogout() {
    setIsSigningOut(true);
    setDataError(null);
    setSuccessMessage(null);

    const { error } = await supabase.auth.signOut();

    if (error) {
      setDataError(error.message);
      setIsSigningOut(false);
      return;
    }

    setSuccessMessage("Sesi login sudah ditutup.");
    setIsSigningOut(false);
  }

  async function handleCreateTransaction(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setDataError(null);
    setSuccessMessage(null);

    let manualTimestamp: string | undefined;

    if (transactionForm.use_manual_date) {
      if (!transactionForm.manual_date.trim()) {
        setDataError("Tanggal transaksi manual wajib diisi jika mode manual aktif.");
        setIsSubmitting(false);
        return;
      }

      manualTimestamp = resolveTransactionTimestamp(
        true,
        transactionForm.manual_date,
        transactionForm.manual_time
      );

      if (!manualTimestamp) {
        setDataError("Format tanggal transaksi manual tidak valid. Silakan periksa kembali.");
        setIsSubmitting(false);
        return;
      }
    }

    const payload: Record<string, unknown> = {
      customer_id: Number.parseInt(transactionForm.customer_id, 10),
      phone_number: transactionForm.phone_number,
      lens_kiri_speris: parseNumericInput(transactionForm.lens_kiri_speris),
      lens_kanan_speris: parseNumericInput(transactionForm.lens_kanan_speris),
      lens_kiri_addition: parseNumericInput(transactionForm.lens_kiri_addition),
      lens_kanan_addition: parseNumericInput(transactionForm.lens_kanan_addition),
      lens_kiri_cylinder: parseNumericInput(transactionForm.lens_kiri_cylinder),
      lens_kanan_cylinder: parseNumericInput(transactionForm.lens_kanan_cylinder),
      lens_kiri_axis: parseNumericInput(transactionForm.lens_kiri_axis),
      lens_kanan_axis: parseNumericInput(transactionForm.lens_kanan_axis),
      pupil_distance: parseNumericInput(transactionForm.pupil_distance),
      lens_price: parseNumericInput(normalizePriceInput(transactionForm.lens_price)),
      frame_price: parseNumericInput(normalizePriceInput(transactionForm.frame_price)),
      notes_transaction: transactionForm.notes_transaction.trim(),
      frame: transactionForm.frame.trim(),
      ...(manualTimestamp ? { created_at: manualTimestamp } : {}),
    };

    const { error } = await supabase.from("transactions").insert(payload);

    if (error) {
      setDataError(error.message);
      setIsSubmitting(false);
      return;
    }

    setTransactionForm((current) => ({
      ...initialTransactionForm,
      customer_id: current.customer_id,
      phone_number: current.phone_number,
      // Pertahankan status opsi manual dan tanggalnya agar staf bisa memasukkan data buku berturut-turut
      use_manual_date: current.use_manual_date,
      manual_date: current.manual_date,
      manual_time: current.manual_time,
    }));

    setSuccessMessage(
      manualTimestamp
        ? `Transaksi baru berhasil disimpan dengan tanggal manual (${formatDateTime(manualTimestamp)}).`
        : "Transaksi baru berhasil disimpan dengan waktu realtime saat ini."
    );
    setIsSubmitting(false);
    void loadTransactions();
  }

  function handleCustomerChange(event: React.ChangeEvent<HTMLSelectElement>) {
    const customer = customerOptions.find(
      (item) => String(item.id) === event.target.value
    );

    setTransactionForm((current) => ({
      ...current,
      customer_id: event.target.value,
      phone_number: customer?.phone_number ?? "",
    }));
  }

  const latestTransaction = transactions[0];

  return (
    <>
      <Head>
        <title>SOEBAGJO Transactions</title>
      </Head>
      <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(15,118,110,0.16),_transparent_32%),radial-gradient(circle_at_bottom_right,_rgba(217,119,6,0.18),_transparent_28%),linear-gradient(180deg,#f8faf7_0%,#fffdf8_44%,#eef5f1_100%)] text-slate-950">
        <div className="mx-auto max-w-7xl px-4 py-5 sm:px-8 sm:py-8 lg:px-10">
          <div className="flex flex-col gap-4 rounded-[28px] border border-white/60 bg-white/72 p-4 shadow-[0_18px_60px_rgba(15,23,42,0.08)] backdrop-blur sm:p-5 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-xs font-semibold tracking-[0.3em] text-teal-900/70 uppercase">
                SOEBAGJO Transactions
              </p>
              <h1 className="mt-2 text-2xl font-semibold tracking-[-0.05em] text-slate-950 sm:text-4xl">
                Input transaksi lensa dan histori customer.
              </h1>
            </div>
            <div className="grid gap-3 sm:flex sm:flex-wrap">
              <Button
                asChild
                variant="outline"
                className="w-full rounded-full border-slate-300 bg-white/80 text-slate-900 hover:bg-white sm:w-auto"
              >
                <Link href="/">
                  Kembali ke Homepage
                  <ArrowRight className="size-4" />
                </Link>
              </Button>

              <Button
                asChild
                className="w-full rounded-full bg-teal-900 text-white hover:bg-teal-800 sm:w-auto"
              >
                <Link href="/customers">
                  Manajemen Customer
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
            </div>
          </div>
          {!isSupabaseConfigured ? (
            <div className="mt-8">
              <Alert className="border-amber-300 bg-amber-50 text-amber-950">
                <AlertCircle className="size-4" />
                <AlertTitle>Supabase belum dikonfigurasi</AlertTitle>
                <AlertDescription>
                  Isi `NEXT_PUBLIC_SUPABASE_URL` dan `NEXT_PUBLIC_SUPABASE_ANON_KEY` di `.env.local`.
                </AlertDescription>
              </Alert>
            </div>
          ) : null}

          {dataError ? (
            <div className="mt-4">
              <Alert variant="destructive" className="border-red-200 bg-red-50">
                <AlertCircle className="size-4" />
                <AlertTitle>Operasi transaksi gagal</AlertTitle>
                <AlertDescription>{dataError}</AlertDescription>
              </Alert>
            </div>
          ) : null}

          {successMessage ? (
            <div className="mt-4">
              <Alert className="border-teal-200 bg-teal-50 text-teal-950">
                <FileText className="size-4" />
                <AlertTitle>Status</AlertTitle>
                <AlertDescription>{successMessage}</AlertDescription>
              </Alert>
            </div>
          ) : null}

          {isAuthLoading ? (
            <div className="mt-10 flex min-h-[320px] items-center justify-center rounded-[32px] border border-slate-200/70 bg-white/75 shadow-[0_18px_60px_rgba(15,23,42,0.06)] backdrop-blur">
              <div className="flex items-center gap-3 text-sm font-medium text-slate-600">
                <LoaderCircle className="size-5 animate-spin" />
                Mengecek sesi login Supabase...
              </div>
            </div>
          ) : !session ? (
            <section className="mt-10 grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
              <Card className="rounded-[34px] border-slate-200/80 bg-slate-950 text-white shadow-[0_24px_90px_rgba(15,23,42,0.22)]">
                <CardHeader>
                  <CardDescription className="text-xs font-semibold tracking-[0.24em] text-teal-200 uppercase">
                    Protected route
                  </CardDescription>
                  <CardTitle className="text-3xl leading-tight tracking-[-0.05em] text-white sm:text-4xl">
                    Login di halaman customer dulu sebelum input transaksi.
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm leading-7 text-white/75">
                    Session login Supabase yang sama akan dipakai di halaman transaksi ini, jadi staf
                    cukup login satu kali di `/customers`.
                  </p>
                </CardContent>
              </Card>

              <Card className="rounded-[34px] border-slate-200/80 bg-white/88 shadow-[0_24px_90px_rgba(15,23,42,0.1)] backdrop-blur">
                <CardHeader>
                  <CardDescription className="text-xs font-semibold tracking-[0.24em] text-slate-500 uppercase">
                    Langkah berikutnya
                  </CardDescription>
                  <CardTitle className="text-3xl tracking-[-0.05em] text-slate-950">
                    Buka halaman customer
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Button className="h-11 w-full rounded-full bg-teal-900 text-white hover:bg-teal-800" asChild>
                    <Link href="/customers">
                      Login di Customer
                      <ArrowRight className="size-4" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </section>
          ) : (
            <section className="mt-8 space-y-6">
              {/* Header Ringkas: Sesi Aktif, Resep Lensa, Opsi Customer, Counter & Actions */}
              <div className="flex flex-col gap-4 rounded-[24px] border border-slate-200/80 bg-white/80 p-4 shadow-xs backdrop-blur sm:p-5 lg:flex-row lg:items-center lg:justify-between">
                <div className="flex flex-wrap items-center gap-3">
                  <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-teal-900 text-white shadow-xs">
                    <FileText className="size-5" />
                  </div>
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="text-lg font-semibold tracking-tight text-slate-950">
                        Transaksi & Histori Optik
                      </h2>
                      <span className="inline-flex items-center gap-1 rounded-full border border-teal-200 bg-teal-50 px-2.5 py-0.5 text-xs font-medium text-teal-800">
                        <Eye className="size-3.5" />
                        Resep Lensa
                      </span>
                      <span className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-slate-50 px-2.5 py-0.5 text-xs font-medium text-slate-600">
                        <Users className="size-3.5" />
                        {customerOptions.length} Opsi Customer
                      </span>
                    </div>
                    <p className="mt-0.5 text-xs text-slate-500">
                      Sesi aktif: <span className="font-medium text-slate-800">{session.user.email}</span>
                      {latestTransaction
                        ? ` • Transaksi terakhir ${formatCurrency(getTransactionTotal(latestTransaction))} (${latestTransaction.customer_name})`
                        : ""}
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2.5">
                  <div className="flex items-center rounded-xl border border-slate-200 bg-slate-50/80 px-3.5 py-1.5 text-xs text-slate-600">
                    <span className="mr-1.5 text-sm font-semibold text-slate-950">{transactions.length}</span> transaksi tersimpan
                  </div>

                  <Button
                    type="button"
                    onClick={() => void Promise.all([loadCustomerOptions(), loadTransactions()])}
                    variant="outline"
                    size="sm"
                    className="h-9 rounded-xl border-slate-300 bg-white text-slate-700 hover:bg-slate-50"
                    disabled={isLoadingCustomers || isLoadingTransactions}
                    title="Refresh data transaksi dari Supabase"
                  >
                    {isLoadingCustomers || isLoadingTransactions ? (
                      <LoaderCircle className="size-3.5 animate-spin" />
                    ) : (
                      <RefreshCw className="size-3.5" />
                    )}
                    Refresh Data
                  </Button>

                  <Button
                    type="button"
                    onClick={() => void handleLogout()}
                    variant="outline"
                    size="sm"
                    className="h-9 rounded-xl border-red-200 bg-red-50 text-red-700 hover:bg-red-100"
                    disabled={isSigningOut}
                  >
                    {isSigningOut ? (
                      <LoaderCircle className="size-3.5 animate-spin" />
                    ) : (
                      <LogOut className="size-3.5" />
                    )}
                    Logout
                  </Button>
                </div>
              </div>

              {customerOptions.length === 0 ? (
                <Alert className="border-amber-300 bg-amber-50 text-amber-950">
                  <AlertCircle className="size-4" />
                  <AlertTitle>Belum ada customer</AlertTitle>
                  <AlertDescription>
                    Tambahkan customer terlebih dahulu di halaman `/customers` sebelum memasukkan transaksi.
                  </AlertDescription>
                </Alert>
              ) : null}

              <div className="space-y-6">
                <Card className="rounded-[30px] border-slate-200/80 bg-white/80 shadow-[0_18px_60px_rgba(15,23,42,0.06)] backdrop-blur">
                  <CardHeader>
                    <CardDescription className="text-xs font-semibold tracking-[0.24em] text-teal-800 uppercase">
                      Form transaksi
                    </CardDescription>
                    <CardTitle className="text-2xl tracking-[-0.05em] text-slate-950 sm:text-3xl">
                      Tambah transaksi baru
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <form className="space-y-6" onSubmit={handleCreateTransaction}>
                      <div className="grid gap-4 lg:grid-cols-3">
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-slate-700" htmlFor="customer_search">
                            Search customer
                          </label>
                          <div className="relative">
                            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
                            <Input
                              id="customer_search"
                              value={customerSearch}
                              onChange={(event) => setCustomerSearch(event.target.value)}
                              className="pl-9"
                              placeholder="Cari nama customer"
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <label className="text-sm font-medium text-slate-700" htmlFor="customer_id">
                            Customer
                          </label>
                          <select
                            id="customer_id"
                            className="border-input focus-visible:border-ring focus-visible:ring-ring/50 flex h-11 w-full rounded-2xl border bg-transparent px-4 py-2 text-sm shadow-xs outline-none transition-[color,box-shadow] focus-visible:ring-[3px]"
                            value={transactionForm.customer_id}
                            onChange={handleCustomerChange}
                            disabled={selectableCustomerOptions.length === 0}
                            required
                          >
                            {selectableCustomerOptions.map((customer) => (
                              <option key={customer.id} value={customer.id}>
                                {customer.name}
                              </option>
                            ))}
                          </select>
                          {visibleCustomerOptions.length === 0 && customerSearch.trim().length > 0 ? (
                            <p className="text-xs text-amber-700">
                              Customer dengan nama itu tidak ditemukan. Menampilkan daftar default.
                            </p>
                          ) : null}
                        </div>

                        <div className="space-y-2">
                          <label className="text-sm font-medium text-slate-700" htmlFor="transaction_phone_number">
                            Phone number
                          </label>
                          <Input id="transaction_phone_number" value={transactionForm.phone_number} readOnly />
                        </div>
                      </div>

                      {/* Opsi Tanggal Transaksi: Default Waktu Saat Ini, Opsi Manual untuk Data Mundur dari Buku */}
                      <div className="rounded-[22px] border border-slate-200/90 bg-slate-50/70 p-4 transition-all">
                        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                          <label className="flex items-center gap-2.5 cursor-pointer select-none">
                            <input
                              type="checkbox"
                              checked={transactionForm.use_manual_date}
                              onChange={(event) =>
                                setTransactionForm((current) => ({
                                  ...current,
                                  use_manual_date: event.target.checked,
                                  manual_date:
                                    event.target.checked && !current.manual_date
                                      ? new Date().toISOString().slice(0, 10)
                                      : current.manual_date,
                                }))
                              }
                              className="size-4 rounded border-slate-300 text-teal-800 accent-teal-800 focus:ring-teal-700"
                            />
                            <span className="text-sm font-semibold text-slate-900">
                              Input tanggal transaksi manual (data buku fisik / mundur)
                            </span>
                          </label>

                          <span className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500">
                            <Clock className="size-3.5 text-slate-400" />
                            {transactionForm.use_manual_date
                              ? "Mode tanggal mundur aktif"
                              : "Default: Waktu otomatis realtime saat ini"}
                          </span>
                        </div>

                        {transactionForm.use_manual_date ? (
                          <div className="mt-4 pt-3.5 border-t border-slate-200/80">
                            <div className="grid gap-4 sm:grid-cols-2">
                              <div className="space-y-1.5">
                                <label
                                  className="text-xs font-semibold tracking-wider text-slate-600 uppercase"
                                  htmlFor="manual_date_input"
                                >
                                  Tanggal Transaksi (Buku) <span className="text-red-500">*</span>
                                </label>
                                <Input
                                  id="manual_date_input"
                                  type="date"
                                  value={transactionForm.manual_date}
                                  onChange={(event) =>
                                    setTransactionForm((current) => ({
                                      ...current,
                                      manual_date: event.target.value,
                                    }))
                                  }
                                  required={transactionForm.use_manual_date}
                                  className="bg-white"
                                />
                                <p className="text-[11px] text-slate-500">
                                  Pilih tanggal transaksi yang tercatat di buku fisik optik.
                                </p>
                              </div>

                              <div className="space-y-1.5">
                                <label
                                  className="text-xs font-semibold tracking-wider text-slate-600 uppercase"
                                  htmlFor="manual_time_input"
                                >
                                  Waktu / Jam (Opsional)
                                </label>
                                <Input
                                  id="manual_time_input"
                                  type="time"
                                  value={transactionForm.manual_time}
                                  onChange={(event) =>
                                    setTransactionForm((current) => ({
                                      ...current,
                                      manual_time: event.target.value,
                                    }))
                                  }
                                  placeholder="12:00"
                                  className="bg-white"
                                />
                                <p className="text-[11px] text-slate-500">
                                  Default pukul 12:00 jika di buku tidak tertera jam.
                                </p>
                              </div>
                            </div>

                            {transactionForm.manual_date ? (
                              <div className="mt-3 rounded-xl bg-teal-50/80 px-3.5 py-2 text-xs text-teal-900 border border-teal-200/60">
                                <strong>Preview waktu simpan:</strong> Transaksi ini akan tersimpan bertanggal{" "}
                                <span className="font-semibold underline">
                                  {formatDateTime(
                                    resolveTransactionTimestamp(
                                      true,
                                      transactionForm.manual_date,
                                      transactionForm.manual_time
                                    )
                                  )}
                                </span>
                              </div>
                            ) : null}
                          </div>
                        ) : null}
                      </div>

                      <div className="grid gap-4 xl:grid-cols-2">
                        <div className="rounded-[24px] border border-slate-200 bg-slate-50 p-4">
                          <p className="text-sm font-semibold text-slate-950">Lensa Kiri</p>
                          <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-4">
                            <div className="space-y-2">
                              <label className="text-xs font-semibold tracking-[0.16em] text-slate-500 uppercase">
                                Speris
                              </label>
                              <Input
                                type="number"
                                step="0.25"
                                value={transactionForm.lens_kiri_speris}
                                onChange={(event) =>
                                  setTransactionForm((current) => ({
                                    ...current,
                                    lens_kiri_speris: event.target.value,
                                  }))
                                }
                                required
                              />
                            </div>
                            <div className="space-y-2">
                              <label className="text-xs font-semibold tracking-[0.16em] text-slate-500 uppercase">
                                Addition
                              </label>
                              <Input
                                type="number"
                                step="0.25"
                                value={transactionForm.lens_kiri_addition}
                                onChange={(event) =>
                                  setTransactionForm((current) => ({
                                    ...current,
                                    lens_kiri_addition: event.target.value,
                                  }))
                                }
                                required
                              />
                            </div>
                            <div className="space-y-2">
                              <label className="text-xs font-semibold tracking-[0.16em] text-slate-500 uppercase">
                                Cylinder
                              </label>
                              <Input
                                type="number"
                                step="0.25"
                                value={transactionForm.lens_kiri_cylinder}
                                onChange={(event) =>
                                  setTransactionForm((current) => ({
                                    ...current,
                                    lens_kiri_cylinder: event.target.value,
                                  }))
                                }
                                required
                              />
                            </div>
                            <div className="space-y-2">
                              <label className="text-xs font-semibold tracking-[0.16em] text-slate-500 uppercase">
                                Axis
                              </label>
                              <Input
                                type="number"
                                step="1"
                                value={transactionForm.lens_kiri_axis}
                                onChange={(event) =>
                                  setTransactionForm((current) => ({
                                    ...current,
                                    lens_kiri_axis: event.target.value,
                                  }))
                                }
                                required
                              />
                            </div>
                          </div>
                        </div>

                        <div className="rounded-[24px] border border-slate-200 bg-slate-50 p-4">
                          <p className="text-sm font-semibold text-slate-950">Lensa Kanan</p>
                          <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-4">
                            <div className="space-y-2">
                              <label className="text-xs font-semibold tracking-[0.16em] text-slate-500 uppercase">
                                Speris
                              </label>
                              <Input
                                type="number"
                                step="0.25"
                                value={transactionForm.lens_kanan_speris}
                                onChange={(event) =>
                                  setTransactionForm((current) => ({
                                    ...current,
                                    lens_kanan_speris: event.target.value,
                                  }))
                                }
                                required
                              />
                            </div>
                            <div className="space-y-2">
                              <label className="text-xs font-semibold tracking-[0.16em] text-slate-500 uppercase">
                                Addition
                              </label>
                              <Input
                                type="number"
                                step="0.25"
                                value={transactionForm.lens_kanan_addition}
                                onChange={(event) =>
                                  setTransactionForm((current) => ({
                                    ...current,
                                    lens_kanan_addition: event.target.value,
                                  }))
                                }
                                required
                              />
                            </div>
                            <div className="space-y-2">
                              <label className="text-xs font-semibold tracking-[0.16em] text-slate-500 uppercase">
                                Cylinder
                              </label>
                              <Input
                                type="number"
                                step="0.25"
                                value={transactionForm.lens_kanan_cylinder}
                                onChange={(event) =>
                                  setTransactionForm((current) => ({
                                    ...current,
                                    lens_kanan_cylinder: event.target.value,
                                  }))
                                }
                                required
                              />
                            </div>
                            <div className="space-y-2">
                              <label className="text-xs font-semibold tracking-[0.16em] text-slate-500 uppercase">
                                Axis
                              </label>
                              <Input
                                type="number"
                                step="1"
                                value={transactionForm.lens_kanan_axis}
                                onChange={(event) =>
                                  setTransactionForm((current) => ({
                                    ...current,
                                    lens_kanan_axis: event.target.value,
                                  }))
                                }
                                required
                              />
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-4">
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-slate-700" htmlFor="pupil_distance">
                            PD (Pupil Distance)
                          </label>
                          <Input
                            id="pupil_distance"
                            type="number"
                            step="0.5"
                            placeholder="Contoh: 62"
                            value={transactionForm.pupil_distance}
                            onChange={(event) =>
                              setTransactionForm((current) => ({
                                ...current,
                                pupil_distance: event.target.value,
                              }))
                            }
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-slate-700" htmlFor="lens_price">
                            Harga lensa
                          </label>
                          <Input
                            id="lens_price"
                            type="text"
                            inputMode="numeric"
                            placeholder="Contoh: 850000"
                            value={transactionForm.lens_price}
                            onChange={(event) =>
                              setTransactionForm((current) => ({
                                ...current,
                                lens_price: normalizePriceInput(event.target.value),
                              }))
                            }
                            required
                          />
                          <p className="text-xs text-slate-500">
                            Preview:{" "}
                            {formatCurrency(
                              parseNumericInput(normalizePriceInput(transactionForm.lens_price))
                            )}
                          </p>
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-slate-700" htmlFor="frame_price">
                            Harga frame
                          </label>
                          <Input
                            id="frame_price"
                            type="text"
                            inputMode="numeric"
                            placeholder="Contoh: 1000000"
                            value={transactionForm.frame_price}
                            onChange={(event) =>
                              setTransactionForm((current) => ({
                                ...current,
                                frame_price: normalizePriceInput(event.target.value),
                              }))
                            }
                            required
                          />
                          <p className="text-xs text-slate-500">
                            Preview:{" "}
                            {formatCurrency(
                              parseNumericInput(normalizePriceInput(transactionForm.frame_price))
                            )}
                          </p>
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-slate-700" htmlFor="frame">
                            Frame
                          </label>
                          <Input
                            id="frame"
                            placeholder="Isi manual jenis frame"
                            value={transactionForm.frame}
                            onChange={(event) =>
                              setTransactionForm((current) => ({
                                ...current,
                                frame: event.target.value,
                              }))
                            }
                            required
                          />
                        </div>
                      </div>

                      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_220px] lg:items-end">
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-slate-700" htmlFor="notes_transaction">
                            Catatan transaksi
                          </label>
                          <textarea
                            id="notes_transaction"
                            className="border-input focus-visible:border-ring focus-visible:ring-ring/50 flex min-h-32 w-full rounded-2xl border bg-transparent px-4 py-3 text-sm shadow-xs outline-none transition-[color,box-shadow] focus-visible:ring-[3px]"
                            placeholder="Catatan transaksi"
                            value={transactionForm.notes_transaction}
                            onChange={(event) =>
                              setTransactionForm((current) => ({
                                ...current,
                                notes_transaction: event.target.value,
                              }))
                            }
                          />
                        </div>

                        <Button
                          type="submit"
                          className="h-11 w-full rounded-full bg-teal-900 text-white hover:bg-teal-800 lg:self-end"
                          disabled={isSubmitting || customerOptions.length === 0}
                        >
                          {isSubmitting ? (
                            <LoaderCircle className="size-4 animate-spin" />
                          ) : (
                            <FileText className="size-4" />
                          )}
                          Simpan Transaksi
                        </Button>
                      </div>
                    </form>
                  </CardContent>
                </Card>

                <Card className="rounded-[30px] border-slate-200/80 bg-white/80 shadow-[0_18px_60px_rgba(15,23,42,0.06)] backdrop-blur">
                  <CardHeader>
                    <CardDescription className="text-xs font-semibold tracking-[0.24em] text-teal-800 uppercase">
                      Histori transaksi
                    </CardDescription>
                    <CardTitle className="text-2xl tracking-[-0.05em] text-slate-950 sm:text-3xl">
                      Transaksi customer terbaru
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <TransactionsTable data={transactions} isLoading={isLoadingTransactions} />
                  </CardContent>
                </Card>
              </div>
            </section>
          )}
        </div>
      </main>
    </>
  );
}
