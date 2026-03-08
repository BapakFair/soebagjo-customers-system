import Head from "next/head";
import Link from "next/link";
import React from "react";
import type { Session } from "@supabase/supabase-js";
import {
  AlertCircle,
  ArrowRight,
  Database,
  LoaderCircle,
  LockKeyhole,
  LogOut,
  RefreshCw,
  ShieldCheck,
  UserRoundPlus,
  Users,
} from "lucide-react";

import { DataTable } from "@/components/data-table";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { columns } from "@/features/customers/columns";
import supabase from "@/lib/db";
import { formatDateTime } from "@/lib/formatters";
import type { ICustomer } from "@/types/customers";

type LoginFormState = {
  email: string;
  password: string;
};

type CustomerFormState = {
  name: string;
  phone_number: string;
  notes_customer: string;
};

const initialLoginForm: LoginFormState = {
  email: "",
  password: "",
};

const initialCustomerForm: CustomerFormState = {
  name: "",
  phone_number: "",
  notes_customer: "",
};

const loginBenefits = [
  "Hanya user Supabase yang sudah terdaftar yang bisa masuk.",
  "Data customer bisa ditambah dan langsung tampil tanpa refresh manual.",
  "RLS policy membatasi akses tabel untuk user yang sudah login.",
];

const setupChecklist = [
  "Isi NEXT_PUBLIC_SUPABASE_URL dan NEXT_PUBLIC_SUPABASE_ANON_KEY di .env.local.",
  "Jalankan SQL schema di file supabase/setup.sql pada SQL Editor Supabase.",
  "Jika hanya admin internal yang boleh masuk, nonaktifkan public sign-up di Auth > Providers > Email.",
];

export default function CustomersPage() {
  const [session, setSession] = React.useState<Session | null>(null);
  const [customers, setCustomers] = React.useState<ICustomer[]>([]);
  const [isAuthLoading, setIsAuthLoading] = React.useState(true);
  const [isCustomersLoading, setIsCustomersLoading] = React.useState(false);
  const [isSigningIn, setIsSigningIn] = React.useState(false);
  const [isSigningOut, setIsSigningOut] = React.useState(false);
  const [isSubmittingCustomer, setIsSubmittingCustomer] = React.useState(false);
  const [loginForm, setLoginForm] = React.useState<LoginFormState>(initialLoginForm);
  const [customerForm, setCustomerForm] = React.useState<CustomerFormState>(initialCustomerForm);
  const [authError, setAuthError] = React.useState<string | null>(null);
  const [dataError, setDataError] = React.useState<string | null>(null);
  const [successMessage, setSuccessMessage] = React.useState<string | null>(null);

  const isSupabaseConfigured = Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );

  const loadCustomers = React.useCallback(async () => {
    setIsCustomersLoading(true);
    setDataError(null);

    const { data, error } = await supabase
      .from("customers")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      setDataError(error.message);
      setIsCustomersLoading(false);
      return;
    }

    React.startTransition(() => {
      setCustomers(data ?? []);
    });
    setIsCustomersLoading(false);
  }, []);

  React.useEffect(() => {
    let isMounted = true;

    async function bootstrapSession() {
      const { data, error } = await supabase.auth.getSession();

      if (!isMounted) {
        return;
      }

      if (error) {
        setAuthError(error.message);
      }

      setSession(data.session);
      setIsAuthLoading(false);

      if (data.session) {
        void loadCustomers();
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
      setAuthError(null);

      if (!nextSession) {
        setCustomers([]);
        setIsCustomersLoading(false);
        return;
      }

      void loadCustomers();
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, [loadCustomers]);

  async function handleLogin(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSigningIn(true);
    setAuthError(null);
    setSuccessMessage(null);

    const { error } = await supabase.auth.signInWithPassword({
      email: loginForm.email.trim(),
      password: loginForm.password,
    });

    if (error) {
      setAuthError(error.message);
      setIsSigningIn(false);
      return;
    }

    setLoginForm(initialLoginForm);
    setSuccessMessage("Login berhasil. Data customer siap diakses.");
    setIsSigningIn(false);
  }

  async function handleLogout() {
    setIsSigningOut(true);
    setAuthError(null);
    setSuccessMessage(null);

    const { error } = await supabase.auth.signOut();

    if (error) {
      setAuthError(error.message);
      setIsSigningOut(false);
      return;
    }

    setSuccessMessage("Sesi login sudah ditutup.");
    setIsSigningOut(false);
  }

  async function handleCreateCustomer(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmittingCustomer(true);
    setDataError(null);
    setSuccessMessage(null);

    const payload = {
      name: customerForm.name.trim(),
      phone_number: customerForm.phone_number.trim(),
      notes_customer: customerForm.notes_customer.trim(),
    };

    const { error } = await supabase.from("customers").insert(payload);

    if (error) {
      setDataError(error.message);
      setIsSubmittingCustomer(false);
      return;
    }

    setCustomerForm(initialCustomerForm);
    setSuccessMessage("Customer baru berhasil ditambahkan.");
    setIsSubmittingCustomer(false);
    void loadCustomers();
  }

  const latestCustomer = customers[0];

  return (
    <>
      <Head>
        <title>SOEBAGJO Customers</title>
      </Head>

      <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(15,118,110,0.16),_transparent_32%),radial-gradient(circle_at_bottom_right,_rgba(217,119,6,0.18),_transparent_28%),linear-gradient(180deg,#f8faf7_0%,#fffdf8_44%,#eef5f1_100%)] text-slate-950">
        <div className="mx-auto max-w-7xl px-6 py-8 sm:px-8 lg:px-10">
          <div className="flex flex-col gap-4 rounded-[28px] border border-white/60 bg-white/72 p-5 shadow-[0_18px_60px_rgba(15,23,42,0.08)] backdrop-blur sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs font-semibold tracking-[0.3em] text-teal-900/70 uppercase">
                SOEBAGJO Customers
              </p>
              <h1 className="mt-2 text-3xl font-semibold tracking-[-0.05em] text-slate-950 sm:text-4xl">
                Login internal dan manajemen customer dalam satu halaman.
              </h1>
            </div>

            <Button
              asChild
              variant="outline"
              className="rounded-full border-slate-300 bg-white/80 text-slate-900 hover:bg-white"
            >
              <Link href="/">
                Kembali ke Homepage
                <ArrowRight className="size-4" />
              </Link>
            </Button>

            <Button
              asChild
              className="rounded-full bg-teal-900 text-white hover:bg-teal-800"
            >
              <Link href="/transactions">
                Input Transaksi
                <ArrowRight className="size-4" />
              </Link>
            </Button>
          </div>

          {!isSupabaseConfigured ? (
            <div className="mt-8">
              <Alert className="border-amber-300 bg-amber-50 text-amber-950">
                <AlertCircle className="size-4" />
                <AlertTitle>Supabase belum dikonfigurasi</AlertTitle>
                <AlertDescription>
                  <p>Isi environment variable berikut sebelum mencoba login:</p>
                  <p>`NEXT_PUBLIC_SUPABASE_URL` dan `NEXT_PUBLIC_SUPABASE_ANON_KEY`</p>
                </AlertDescription>
              </Alert>
            </div>
          ) : null}

          {authError ? (
            <div className="mt-8">
              <Alert variant="destructive" className="border-red-200 bg-red-50">
                <AlertCircle className="size-4" />
                <AlertTitle>Autentikasi gagal</AlertTitle>
                <AlertDescription>{authError}</AlertDescription>
              </Alert>
            </div>
          ) : null}

          {dataError ? (
            <div className="mt-4">
              <Alert variant="destructive" className="border-red-200 bg-red-50">
                <AlertCircle className="size-4" />
                <AlertTitle>Operasi database gagal</AlertTitle>
                <AlertDescription>{dataError}</AlertDescription>
              </Alert>
            </div>
          ) : null}

          {successMessage ? (
            <div className="mt-4">
              <Alert className="border-teal-200 bg-teal-50 text-teal-950">
                <ShieldCheck className="size-4" />
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
          ) : session ? (
            <section className="mt-10 space-y-8">
              <div className="grid gap-5 xl:grid-cols-[0.8fr_1.2fr]">
                <Card className="rounded-[30px] border-slate-200/80 bg-white/80 shadow-[0_18px_60px_rgba(15,23,42,0.06)] backdrop-blur">
                  <CardHeader>
                    <CardDescription className="text-xs font-semibold tracking-[0.24em] text-teal-800 uppercase">
                      Sesi aktif
                    </CardDescription>
                    <CardTitle className="text-3xl tracking-[-0.05em] text-slate-950">
                      Akses customer database SOEBAGJO
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-5">
                    <div className="rounded-[24px] bg-slate-950 p-5 text-white">
                      <p className="text-xs tracking-[0.24em] text-teal-200 uppercase">Logged in as</p>
                      <p className="mt-2 text-lg font-semibold">{session.user.email}</p>
                      <p className="mt-2 text-sm leading-7 text-white/70">
                        User ini dapat membaca dan menambah data customer sesuai policy Supabase.
                      </p>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-3">
                      <div className="rounded-[24px] border border-slate-200 bg-slate-50 p-4">
                        <p className="text-xs font-semibold tracking-[0.22em] text-slate-500 uppercase">
                          Total
                        </p>
                        <p className="mt-3 text-3xl font-semibold tracking-[-0.05em] text-slate-950">
                          {customers.length}
                        </p>
                        <p className="mt-2 text-sm text-slate-600">customer tersimpan</p>
                      </div>

                      <div className="rounded-[24px] border border-slate-200 bg-slate-50 p-4">
                        <p className="text-xs font-semibold tracking-[0.22em] text-slate-500 uppercase">
                          Terakhir
                        </p>
                        <p className="mt-3 text-lg font-semibold tracking-[-0.03em] text-slate-950">
                          {latestCustomer ? latestCustomer.name : "-"}
                        </p>
                        <p className="mt-2 text-sm text-slate-600">
                          {latestCustomer ? latestCustomer.phone_number : "Belum ada data"}
                        </p>
                      </div>

                      <div className="rounded-[24px] border border-slate-200 bg-slate-50 p-4">
                        <p className="text-xs font-semibold tracking-[0.22em] text-slate-500 uppercase">
                          Sync
                        </p>
                        <p className="mt-3 text-lg font-semibold tracking-[-0.03em] text-slate-950">
                          {latestCustomer ? formatDateTime(latestCustomer.created_at) : "-"}
                        </p>
                        <p className="mt-2 text-sm text-slate-600">data terbaru dari Supabase</p>
                      </div>
                    </div>

                    <div className="flex flex-col gap-3 sm:flex-row">
                      <Button
                        type="button"
                        onClick={() => void loadCustomers()}
                        variant="outline"
                        className="rounded-full border-slate-300 bg-white hover:bg-slate-50"
                        disabled={isCustomersLoading}
                      >
                        {isCustomersLoading ? (
                          <LoaderCircle className="size-4 animate-spin" />
                        ) : (
                          <RefreshCw className="size-4" />
                        )}
                        Refresh Data
                      </Button>

                      <Button
                        type="button"
                        onClick={() => void handleLogout()}
                        variant="outline"
                        className="rounded-full border-red-200 bg-red-50 text-red-700 hover:bg-red-100"
                        disabled={isSigningOut}
                      >
                        {isSigningOut ? (
                          <LoaderCircle className="size-4 animate-spin" />
                        ) : (
                          <LogOut className="size-4" />
                        )}
                        Logout
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <div className="grid gap-5 md:grid-cols-3">
                  <Card className="rounded-[30px] border-slate-200/80 bg-white/80 shadow-[0_18px_60px_rgba(15,23,42,0.06)] backdrop-blur">
                    <CardHeader>
                      <div className="flex size-12 items-center justify-center rounded-2xl bg-teal-100 text-teal-800">
                        <Users className="size-5" />
                      </div>
                      <CardTitle className="text-2xl tracking-[-0.04em] text-slate-950">
                        Input customer
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm leading-7 text-slate-600">
                        Tambah data customer tanpa keluar dari halaman ini.
                      </p>
                    </CardContent>
                  </Card>

                  <Card className="rounded-[30px] border-slate-200/80 bg-white/80 shadow-[0_18px_60px_rgba(15,23,42,0.06)] backdrop-blur">
                    <CardHeader>
                      <div className="flex size-12 items-center justify-center rounded-2xl bg-amber-100 text-amber-700">
                        <Database className="size-5" />
                      </div>
                      <CardTitle className="text-2xl tracking-[-0.04em] text-slate-950">
                        Supabase RLS
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm leading-7 text-slate-600">
                        Query hanya berhasil untuk user yang punya sesi login valid.
                      </p>
                    </CardContent>
                  </Card>

                  <Card className="rounded-[30px] border-slate-200/80 bg-white/80 shadow-[0_18px_60px_rgba(15,23,42,0.06)] backdrop-blur">
                    <CardHeader>
                      <div className="flex size-12 items-center justify-center rounded-2xl bg-slate-200 text-slate-800">
                        <LockKeyhole className="size-5" />
                      </div>
                      <CardTitle className="text-2xl tracking-[-0.04em] text-slate-950">
                        Auth internal
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm leading-7 text-slate-600">
                        Login memakai email dan password dari Supabase Auth.
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </div>

              <div className="grid gap-6 xl:grid-cols-[0.72fr_1.28fr]">
                <Card className="rounded-[30px] border-slate-200/80 bg-white/80 shadow-[0_18px_60px_rgba(15,23,42,0.06)] backdrop-blur">
                  <CardHeader>
                    <CardDescription className="text-xs font-semibold tracking-[0.24em] text-teal-800 uppercase">
                      Form customer
                    </CardDescription>
                    <CardTitle className="text-3xl tracking-[-0.05em] text-slate-950">
                      Tambah customer baru
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <form className="space-y-4" onSubmit={handleCreateCustomer}>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-700" htmlFor="name">
                          Nama customer
                        </label>
                        <Input
                          id="name"
                          placeholder="Contoh: Ibu Ratna Kusuma"
                          value={customerForm.name}
                          onChange={(event) =>
                            setCustomerForm((current) => ({
                              ...current,
                              name: event.target.value,
                            }))
                          }
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-700" htmlFor="phone_number">
                          Phone number
                        </label>
                        <Input
                          id="phone_number"
                          placeholder="Contoh: 0812-8899-2211"
                          value={customerForm.phone_number}
                          onChange={(event) =>
                            setCustomerForm((current) => ({
                              ...current,
                              phone_number: event.target.value,
                            }))
                          }
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-700" htmlFor="notes_customer">
                          Catatan
                        </label>
                        <textarea
                          id="notes_customer"
                          className="border-input focus-visible:border-ring focus-visible:ring-ring/50 flex min-h-32 w-full rounded-2xl border bg-transparent px-4 py-3 text-sm shadow-xs outline-none transition-[color,box-shadow] focus-visible:ring-[3px]"
                          placeholder="Contoh: Customer sering reorder lensa anti radiasi."
                          value={customerForm.notes_customer}
                          onChange={(event) =>
                            setCustomerForm((current) => ({
                              ...current,
                              notes_customer: event.target.value,
                            }))
                          }
                        />
                      </div>

                      <Button
                        type="submit"
                        className="h-11 w-full rounded-full bg-teal-900 text-white hover:bg-teal-800"
                        disabled={isSubmittingCustomer}
                      >
                        {isSubmittingCustomer ? (
                          <LoaderCircle className="size-4 animate-spin" />
                        ) : (
                          <UserRoundPlus className="size-4" />
                        )}
                        Simpan Customer
                      </Button>
                    </form>
                  </CardContent>
                </Card>

                <Card className="rounded-[30px] border-slate-200/80 bg-white/80 shadow-[0_18px_60px_rgba(15,23,42,0.06)] backdrop-blur">
                  <CardHeader>
                    <CardDescription className="text-xs font-semibold tracking-[0.24em] text-teal-800 uppercase">
                      Customer table
                    </CardDescription>
                    <CardTitle className="text-3xl tracking-[-0.05em] text-slate-950">
                      Data customer tersimpan
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <DataTable columns={columns} data={customers} />
                  </CardContent>
                </Card>
              </div>
            </section>
          ) : (
            <section className="mt-10 grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
              <Card className="rounded-[34px] border-slate-200/80 bg-slate-950 text-white shadow-[0_24px_90px_rgba(15,23,42,0.22)]">
                <CardHeader>
                  <CardDescription className="text-xs font-semibold tracking-[0.24em] text-teal-200 uppercase">
                    Access gate
                  </CardDescription>
                  <CardTitle className="text-4xl leading-tight tracking-[-0.05em] text-white">
                    Halaman customer dikunci untuk user internal yang sudah terdaftar.
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <p className="max-w-2xl text-sm leading-8 text-white/74">
                    Login di sini memakai Supabase Auth. Tidak ada tombol sign up di aplikasi, sehingga alur
                    akses difokuskan untuk akun staf atau admin yang sudah dibuat sebelumnya.
                  </p>

                  <div className="grid gap-4 md:grid-cols-3">
                    {loginBenefits.map((item) => (
                      <div key={item} className="rounded-[24px] border border-white/10 bg-white/6 p-4">
                        <p className="text-sm leading-7 text-white/80">{item}</p>
                      </div>
                    ))}
                  </div>

                  <div className="rounded-[28px] border border-teal-400/20 bg-teal-400/10 p-5">
                    <p className="text-xs font-semibold tracking-[0.24em] text-teal-200 uppercase">
                      Setup checklist
                    </p>
                    <div className="mt-4 space-y-3">
                      {setupChecklist.map((item) => (
                        <div key={item} className="flex gap-3 rounded-2xl bg-black/20 px-4 py-3">
                          <ShieldCheck className="mt-0.5 size-4 shrink-0 text-teal-300" />
                          <p className="text-sm leading-7 text-white/78">{item}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="rounded-[34px] border-slate-200/80 bg-white/88 shadow-[0_24px_90px_rgba(15,23,42,0.1)] backdrop-blur">
                <CardHeader>
                  <CardDescription className="text-xs font-semibold tracking-[0.24em] text-slate-500 uppercase">
                    Supabase login
                  </CardDescription>
                  <CardTitle className="text-3xl tracking-[-0.05em] text-slate-950">
                    Masuk ke dashboard customer
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <form className="space-y-5" onSubmit={handleLogin}>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-700" htmlFor="email">
                        Email
                      </label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="admin@soebagjo.com"
                        value={loginForm.email}
                        onChange={(event) =>
                          setLoginForm((current) => ({
                            ...current,
                            email: event.target.value,
                          }))
                        }
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-700" htmlFor="password">
                        Password
                      </label>
                      <Input
                        id="password"
                        type="password"
                        placeholder="Masukkan password akun Supabase"
                        value={loginForm.password}
                        onChange={(event) =>
                          setLoginForm((current) => ({
                            ...current,
                            password: event.target.value,
                          }))
                        }
                        required
                      />
                    </div>

                    <Button
                      type="submit"
                      className="h-11 w-full rounded-full bg-teal-900 text-white hover:bg-teal-800"
                      disabled={isSigningIn || !isSupabaseConfigured}
                    >
                      {isSigningIn ? (
                        <LoaderCircle className="size-4 animate-spin" />
                      ) : (
                        <LockKeyhole className="size-4" />
                      )}
                      Login
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </section>
          )}
        </div>
      </main>
    </>
  );
}
