import assert from "node:assert/strict";
import test from "node:test";

import {
  filterTransactions,
  getTransactionTotal,
  normalizePriceInput,
  paginateItems,
  parseNumericInput,
  toDateFilterValue,
  TRANSACTION_PAGE_SIZE,
} from "../src/lib/transaction-utils";
import type { ITransactionListItem } from "../src/types/transactions";

const sampleTransactions: ITransactionListItem[] = [
  {
    id: 1,
    created_at: "2026-03-08T10:00:00+07:00",
    customer_id: 1,
    customer_name: "Fair Sulaiman",
    phone_number: "0811111111",
    lens_kiri_speris: -1.25,
    lens_kanan_speris: -1,
    lens_kiri_addition: 1.5,
    lens_kanan_addition: 1.25,
    lens_kiri_cylinder: -0.5,
    lens_kanan_cylinder: -0.25,
    lens_kiri_axis: 180,
    lens_kanan_axis: 175,
    pupil_distance: 61,
    lens_price: 850000,
    frame_price: 1000000,
    notes_transaction: "Anti radiasi",
    frame: "Titanium Slim",
  },
  {
    id: 2,
    created_at: "2026-03-09T11:00:00+07:00",
    customer_id: 2,
    customer_name: "Ratna Kusuma",
    phone_number: "0822222222",
    lens_kiri_speris: -0.75,
    lens_kanan_speris: -0.5,
    lens_kiri_addition: 1.25,
    lens_kanan_addition: 1,
    lens_kiri_cylinder: -0.25,
    lens_kanan_cylinder: -0.25,
    lens_kiri_axis: 170,
    lens_kanan_axis: 168,
    pupil_distance: 62,
    lens_price: 650000,
    frame_price: 450000,
    notes_transaction: "",
    frame: "Metal Classic",
  },
];

test("normalizePriceInput menyisakan digit saja", () => {
  assert.equal(normalizePriceInput("Rp 1.850.000"), "1850000");
  assert.equal(normalizePriceInput("frame-450k"), "450");
});

test("parseNumericInput mengubah nilai invalid menjadi 0", () => {
  assert.equal(parseNumericInput("12.5"), 12.5);
  assert.equal(parseNumericInput("bukan angka"), 0);
});

test("getTransactionTotal menjumlahkan harga lensa dan frame", () => {
  assert.equal(getTransactionTotal(sampleTransactions[0]), 1850000);
});

test("toDateFilterValue mengubah timestamp menjadi yyyy-mm-dd", () => {
  assert.equal(toDateFilterValue("2026-03-08T10:15:00+07:00"), "2026-03-08");
});

test("filterTransactions memfilter berdasarkan nama customer", () => {
  const filtered = filterTransactions(sampleTransactions, "fair", "");

  assert.equal(filtered.length, 1);
  assert.equal(filtered[0]?.customer_name, "Fair Sulaiman");
});

test("filterTransactions memfilter berdasarkan tanggal transaksi", () => {
  const filtered = filterTransactions(sampleTransactions, "", "2026-03-09");

  assert.equal(filtered.length, 1);
  assert.equal(filtered[0]?.customer_name, "Ratna Kusuma");
});

test("paginateItems memotong data sesuai halaman dan ukuran page", () => {
  const rows = Array.from({ length: 30 }, (_, index) => index + 1);
  const paginated = paginateItems(rows, 1, TRANSACTION_PAGE_SIZE);

  assert.equal(paginated.totalPages, 2);
  assert.equal(paginated.safePageIndex, 1);
  assert.deepEqual(paginated.pageRows, [26, 27, 28, 29, 30]);
});

test("paginateItems menjaga index halaman tetap aman", () => {
  const rows = Array.from({ length: 5 }, (_, index) => index + 1);
  const paginated = paginateItems(rows, 99, TRANSACTION_PAGE_SIZE);

  assert.equal(paginated.totalPages, 1);
  assert.equal(paginated.safePageIndex, 0);
  assert.deepEqual(paginated.pageRows, [1, 2, 3, 4, 5]);
});
