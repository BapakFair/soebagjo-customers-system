import React from "react";
import { ChevronLeft, ChevronRight, Search } from "lucide-react";

import { DataTable } from "@/components/data-table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { columns } from "@/pages/transactions/columns";
import type { ITransactionListItem } from "@/types/transactions";

const PAGE_SIZE = 25;

function toDateFilterValue(timestamp: string) {
  const date = new Date(timestamp);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

interface TransactionsTableProps {
  data: ITransactionListItem[];
  isLoading: boolean;
}

export function TransactionsTable({ data, isLoading }: TransactionsTableProps) {
  const [customerFilter, setCustomerFilter] = React.useState("");
  const [transactionDateFilter, setTransactionDateFilter] = React.useState("");
  const [pageIndex, setPageIndex] = React.useState(0);

  const normalizedCustomerFilter = customerFilter.trim().toLowerCase();
  const filteredData = data.filter((item) => {
    const matchesCustomer =
      normalizedCustomerFilter.length === 0 ||
      item.customer_name.toLowerCase().includes(normalizedCustomerFilter);
    const matchesDate =
      transactionDateFilter.length === 0 ||
      toDateFilterValue(item.created_at) === transactionDateFilter;

    return matchesCustomer && matchesDate;
  });

  const totalPages = Math.max(1, Math.ceil(filteredData.length / PAGE_SIZE));
  const safePageIndex = Math.min(pageIndex, totalPages - 1);
  const pageStart = safePageIndex * PAGE_SIZE;
  const currentPageRows = filteredData.slice(pageStart, pageStart + PAGE_SIZE);

  return (
    <div className="space-y-4">
      <div className="grid gap-3 md:grid-cols-[1fr_220px]">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
          <Input
            value={customerFilter}
            onChange={(event) => {
              setCustomerFilter(event.target.value);
              setPageIndex(0);
            }}
            className="pl-9"
            placeholder="Filter nama customer"
          />
        </div>

        <Input
          type="date"
          value={transactionDateFilter}
          onChange={(event) => {
            setTransactionDateFilter(event.target.value);
            setPageIndex(0);
          }}
        />
      </div>

      <div className="flex flex-col gap-2 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between">
        <p>
          Menampilkan {currentPageRows.length} dari {filteredData.length} transaksi.
        </p>
        <p>
          Halaman {safePageIndex + 1} / {totalPages}
        </p>
      </div>

      <DataTable
        columns={columns}
        data={currentPageRows}
        emptyMessage={isLoading ? "Memuat transaksi..." : "Belum ada transaksi yang cocok."}
      />

      <div className="flex items-center justify-end gap-3">
        <Button
          type="button"
          variant="outline"
          onClick={() => setPageIndex((current) => Math.max(0, current - 1))}
          disabled={safePageIndex === 0}
        >
          <ChevronLeft className="size-4" />
          Sebelumnya
        </Button>

        <Button
          type="button"
          variant="outline"
          onClick={() => setPageIndex((current) => Math.min(totalPages - 1, current + 1))}
          disabled={safePageIndex >= totalPages - 1}
        >
          Berikutnya
          <ChevronRight className="size-4" />
        </Button>
      </div>
    </div>
  );
}
