import assert from "node:assert/strict";
import test from "node:test";

import { formatCurrency, formatDateTime, formatLensValue } from "../src/lib/formatters";

test("formatLensValue selalu menampilkan dua digit desimal", () => {
  assert.equal(formatLensValue(-1.5), "-1.50");
  assert.equal(formatLensValue(0), "0.00");
});

test("formatDateTime mengembalikan placeholder untuk nilai kosong", () => {
  assert.equal(formatDateTime(undefined), "-");
  assert.equal(formatDateTime(null), "-");
});

test("formatCurrency menampilkan format rupiah", () => {
  const formatted = formatCurrency(1850000);

  assert.match(formatted, /^Rp/);
  assert.match(formatted, /1\.850\.000/);
});
