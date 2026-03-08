import { formatCurrency, formatDateTime, formatLensValue } from "@/lib/formatters";
import { getTransactionTotal } from "@/lib/transaction-utils";
import type { ITransactionListItem } from "@/types/transactions";

interface TransactionMobileListProps {
  transactions: ITransactionListItem[];
  emptyMessage: string;
}

export function TransactionMobileList({
  transactions,
  emptyMessage,
}: TransactionMobileListProps) {
  if (transactions.length === 0) {
    return (
      <div className="rounded-[24px] border border-dashed border-slate-200 bg-slate-50 px-4 py-10 text-center text-sm text-slate-500">
        {emptyMessage}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {transactions.map((transaction) => (
        <article
          key={transaction.id}
          className="rounded-[24px] border border-slate-200 bg-white p-4 shadow-[0_12px_36px_rgba(15,23,42,0.05)]"
        >
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-1">
              <p className="text-base font-semibold text-slate-950">{transaction.customer_name}</p>
              <p className="text-sm text-slate-500">{transaction.phone_number}</p>
              <p className="text-xs font-medium text-slate-500">
                {formatDateTime(transaction.created_at)}
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl bg-slate-50 p-3">
                <p className="text-[11px] font-semibold tracking-[0.18em] text-slate-500 uppercase">
                  Lensa kiri
                </p>
                <div className="mt-2 space-y-1 text-sm text-slate-700">
                  <p>Speris: {formatLensValue(transaction.lens_kiri_speris)}</p>
                  <p>Addition: {formatLensValue(transaction.lens_kiri_addition)}</p>
                  <p>Cylinder: {formatLensValue(transaction.lens_kiri_cylinder)}</p>
                  <p>Axis: {formatLensValue(transaction.lens_kiri_axis)}</p>
                </div>
              </div>

              <div className="rounded-2xl bg-slate-50 p-3">
                <p className="text-[11px] font-semibold tracking-[0.18em] text-slate-500 uppercase">
                  Lensa kanan
                </p>
                <div className="mt-2 space-y-1 text-sm text-slate-700">
                  <p>Speris: {formatLensValue(transaction.lens_kanan_speris)}</p>
                  <p>Addition: {formatLensValue(transaction.lens_kanan_addition)}</p>
                  <p>Cylinder: {formatLensValue(transaction.lens_kanan_cylinder)}</p>
                  <p>Axis: {formatLensValue(transaction.lens_kanan_axis)}</p>
                </div>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl bg-slate-50 p-3">
                <p className="text-[11px] font-semibold tracking-[0.18em] text-slate-500 uppercase">
                  Detail transaksi
                </p>
                <div className="mt-2 space-y-1 text-sm text-slate-700">
                  <p>PD: {formatLensValue(transaction.pupil_distance)} mm</p>
                  <p>Frame: {transaction.frame || "-"}</p>
                  <p>Harga lensa: {formatCurrency(transaction.lens_price)}</p>
                  <p>Harga frame: {formatCurrency(transaction.frame_price)}</p>
                  <p className="font-semibold text-slate-950">
                    Total: {formatCurrency(getTransactionTotal(transaction))}
                  </p>
                </div>
              </div>

              <div className="rounded-2xl bg-slate-50 p-3">
                <p className="text-[11px] font-semibold tracking-[0.18em] text-slate-500 uppercase">
                  Catatan
                </p>
                <p className="mt-2 text-sm leading-6 text-slate-700">
                  {transaction.notes_transaction || "-"}
                </p>
              </div>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}
