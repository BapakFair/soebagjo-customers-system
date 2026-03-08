import React from "react";
import { ChevronLeft, ChevronRight, Search } from "lucide-react";

import { DataTable } from "@/components/data-table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { columns } from "@/features/transactions/columns";
import {
  filterTransactions,
  paginateItems,
  TRANSACTION_PAGE_SIZE,
} from "@/lib/transaction-utils";
import type { ITransactionListItem } from "@/types/transactions";

interface TransactionsTableProps {
  data: ITransactionListItem[];
  isLoading: boolean;
}

export function TransactionsTable({ data, isLoading }: TransactionsTableProps) {
  const [customerFilter, setCustomerFilter] = React.useState("");
  const [transactionDateFilter, setTransactionDateFilter] = React.useState("");
  const [pageIndex, setPageIndex] = React.useState(0);

  const filteredData = filterTransactions(data, customerFilter, transactionDateFilter);
  const { pageRows: currentPageRows, safePageIndex, totalPages } = paginateItems(
    filteredData,
    pageIndex,
    TRANSACTION_PAGE_SIZE
  );

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
