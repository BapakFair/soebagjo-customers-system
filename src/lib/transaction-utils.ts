import type { ITransaction, ITransactionListItem } from "../types/transactions";

export const TRANSACTION_PAGE_SIZE = 25;

export function parseNumericInput(value: string) {
  const parsed = Number.parseFloat(value);
  return Number.isNaN(parsed) ? 0 : parsed;
}

export function normalizePriceInput(value: string) {
  return value.replace(/[^\d]/g, "");
}

export function getTransactionTotal(transaction: Pick<ITransaction, "lens_price" | "frame_price">) {
  return transaction.lens_price + transaction.frame_price;
}

export function toDateFilterValue(timestamp: string) {
  const date = new Date(timestamp);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

export function filterTransactions(
  data: ITransactionListItem[],
  customerFilter: string,
  transactionDateFilter: string
) {
  const normalizedCustomerFilter = customerFilter.trim().toLowerCase();

  return data.filter((item) => {
    const matchesCustomer =
      normalizedCustomerFilter.length === 0 ||
      item.customer_name.toLowerCase().includes(normalizedCustomerFilter);
    const matchesDate =
      transactionDateFilter.length === 0 ||
      toDateFilterValue(item.created_at) === transactionDateFilter;

    return matchesCustomer && matchesDate;
  });
}

export function paginateItems<T>(data: T[], pageIndex: number, pageSize: number) {
  const safePageSize = pageSize > 0 ? pageSize : 1;
  const totalPages = Math.max(1, Math.ceil(data.length / safePageSize));
  const safePageIndex = Math.min(Math.max(pageIndex, 0), totalPages - 1);
  const pageStart = safePageIndex * safePageSize;

  return {
    totalPages,
    safePageIndex,
    pageStart,
    pageRows: data.slice(pageStart, pageStart + safePageSize),
  };
}
