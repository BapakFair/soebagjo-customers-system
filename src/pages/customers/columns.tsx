import type { ColumnDef } from "@tanstack/react-table";

import type { ICustomer } from "@/types/customers";

function formatDate(value: string) {
  return new Intl.DateTimeFormat("id-ID", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

export const columns: ColumnDef<ICustomer>[] = [
  {
    accessorKey: "name",
    header: "Nama",
    cell: ({ row }) => (
      <div className="min-w-40">
        <p className="font-medium text-slate-950">{row.original.name}</p>
      </div>
    ),
  },
  {
    accessorKey: "phone_number",
    header: "Phone Number",
    cell: ({ row }) => (
      <span className="font-medium text-slate-700">{row.original.phone_number}</span>
    ),
  },
  {
    accessorKey: "notes_customer",
    header: "Catatan",
    cell: ({ row }) => (
      <div className="max-w-md whitespace-normal text-sm leading-6 text-slate-600">
        {row.original.notes_customer || "-"}
      </div>
    ),
  },
  {
    accessorKey: "created_at",
    header: "Dibuat",
    cell: ({ row }) => (
      <span className="text-sm text-slate-500">{formatDate(row.original.created_at)}</span>
    ),
  },
];
