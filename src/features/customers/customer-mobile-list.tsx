import { formatDateTime } from "@/lib/formatters";
import type { ICustomer } from "@/types/customers";

interface CustomerMobileListProps {
  customers: ICustomer[];
}

export function CustomerMobileList({ customers }: CustomerMobileListProps) {
  if (customers.length === 0) {
    return (
      <div className="rounded-[24px] border border-dashed border-slate-200 bg-slate-50 px-4 py-10 text-center text-sm text-slate-500">
        Belum ada data customer yang tersimpan.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {customers.map((customer) => (
        <article
          key={customer.id}
          className="rounded-[24px] border border-slate-200 bg-white p-4 shadow-[0_12px_36px_rgba(15,23,42,0.05)]"
        >
          <div className="flex flex-col gap-3">
            <div>
              <p className="text-base font-semibold text-slate-950">{customer.name}</p>
              <p className="mt-1 text-sm text-slate-500">{customer.phone_number}</p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl bg-slate-50 px-3 py-3">
                <p className="text-[11px] font-semibold tracking-[0.18em] text-slate-500 uppercase">
                  Dibuat
                </p>
                <p className="mt-2 text-sm font-medium text-slate-700">
                  {formatDateTime(customer.created_at)}
                </p>
              </div>
              <div className="rounded-2xl bg-slate-50 px-3 py-3">
                <p className="text-[11px] font-semibold tracking-[0.18em] text-slate-500 uppercase">
                  Catatan
                </p>
                <p className="mt-2 text-sm leading-6 text-slate-700">
                  {customer.notes_customer || "-"}
                </p>
              </div>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}
