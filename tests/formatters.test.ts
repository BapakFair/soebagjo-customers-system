import assert from "node:assert/strict";
import test from "node:test";

import { formatCurrency, formatDateTime, formatLensValue } from "../src/lib/formatters";

test("formatLensValue selalu menampilkan dua digit desimal dan aman untuk null/undefined", () => {
  assert.equal(formatLensValue(-1.5), "-1.50");
  assert.equal(formatLensValue(0), "0.00");
  assert.equal(formatLensValue(null), "0.00");
  assert.equal(formatLensValue(undefined), "0.00");
});

test("formatDateTime mengembalikan placeholder untuk nilai kosong atau invalid", () => {
  assert.equal(formatDateTime(undefined), "-");
  assert.equal(formatDateTime(null), "-");
  assert.equal(formatDateTime("invalid-date-string"), "-");
});

test("formatCurrency menampilkan format rupiah dan aman untuk null/undefined", () => {
  const formatted = formatCurrency(1850000);

  assert.match(formatted, /^Rp/);
  assert.match(formatted, /1\.850\.000/);
  assert.match(formatCurrency(null), /^Rp/);
});
