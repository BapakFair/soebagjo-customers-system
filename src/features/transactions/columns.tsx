import type { ColumnDef } from "@tanstack/react-table";

import { formatCurrency, formatDateTime, formatLensValue } from "@/lib/formatters";
import { getTransactionTotal } from "@/lib/transaction-utils";
import type { ITransactionListItem } from "@/types/transactions";

export const columns: ColumnDef<ITransactionListItem>[] = [
  {
    accessorKey: "customer_name",
    header: "Customer",
    cell: ({ row }) => (
      <div className="min-w-44">
        <p className="font-medium text-slate-950">{row.original.customer_name}</p>
        <p className="mt-1 text-sm text-slate-500">{row.original.phone_number}</p>
      </div>
    ),
  },
  {
    id: "left_lens",
    header: "Lensa Kiri",
    cell: ({ row }) => (
      <div className="min-w-40 whitespace-normal text-sm leading-6 text-slate-600">
        <p>Speris: {formatLensValue(row.original.lens_kiri_speris)}</p>
        <p>Addition: {formatLensValue(row.original.lens_kiri_addition)}</p>
        <p>Cylinder: {formatLensValue(row.original.lens_kiri_cylinder)}</p>
        <p>Axis: {formatLensValue(row.original.lens_kiri_axis)}</p>
      </div>
    ),
  },
  {
    id: "right_lens",
    header: "Lensa Kanan",
    cell: ({ row }) => (
      <div className="min-w-40 whitespace-normal text-sm leading-6 text-slate-600">
        <p>Speris: {formatLensValue(row.original.lens_kanan_speris)}</p>
        <p>Addition: {formatLensValue(row.original.lens_kanan_addition)}</p>
        <p>Cylinder: {formatLensValue(row.original.lens_kanan_cylinder)}</p>
        <p>Axis: {formatLensValue(row.original.lens_kanan_axis)}</p>
      </div>
    ),
  },
  {
    accessorKey: "pupil_distance",
    header: "PD (Pupil Distance)",
    cell: ({ row }) => (
      <span className="text-sm font-medium text-slate-700">
        {formatLensValue(row.original.pupil_distance)} mm
      </span>
    ),
  },
  {
    id: "frame_price",
    header: "Frame & Harga",
    cell: ({ row }) => (
      <div className="min-w-48 whitespace-normal">
        <p className="font-medium text-slate-950">{row.original.frame || "-"}</p>
        <p className="mt-1 text-sm text-slate-500">
          Harga lensa: {formatCurrency(row.original.lens_price)}
        </p>
        <p className="text-sm text-slate-500">
          Harga frame: {formatCurrency(row.original.frame_price)}
        </p>
        <p className="text-sm font-medium text-slate-700">
          Total: {formatCurrency(getTransactionTotal(row.original))}
        </p>
      </div>
    ),
  },
  {
    accessorKey: "notes_transaction",
    header: "Catatan",
    cell: ({ row }) => (
      <div className="max-w-md whitespace-normal text-sm leading-6 text-slate-600">
        {row.original.notes_transaction || "-"}
      </div>
    ),
  },
  {
    accessorKey: "created_at",
    header: "Dibuat",
    cell: ({ row }) => (
      <span className="text-sm text-slate-500">{formatDateTime(row.original.created_at)}</span>
    ),
  },
];
