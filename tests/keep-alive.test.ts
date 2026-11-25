import assert from "node:assert/strict";
import test from "node:test";

import {
  isCronAuthorized,
  isMissingKeepAliveSchemaError,
} from "../src/lib/keep-alive-utils";

test("isCronAuthorized mengizinkan akses saat CRON_SECRET tidak disetel", () => {
  assert.equal(isCronAuthorized(undefined, undefined), true);
  assert.equal(isCronAuthorized("", undefined), true);
});

test("isCronAuthorized memvalidasi Bearer token saat CRON_SECRET aktif", () => {
  assert.equal(isCronAuthorized("rahasia-123", "Bearer rahasia-123"), true);
  assert.equal(isCronAuthorized("rahasia-123", "Bearer salah"), false);
  assert.equal(isCronAuthorized("rahasia-123", undefined), false);
});

test("isMissingKeepAliveSchemaError mendeteksi kode dan pesan error schema belum dipasang", () => {
  assert.equal(
    isMissingKeepAliveSchemaError({
      code: "PGRST202",
      message: "Could not find the function public.ping_keep_alive without parameters",
    }),
    true
  );
  assert.equal(
    isMissingKeepAliveSchemaError({
      code: "42P01",
      message: 'relation "public.keep_alive" does not exist',
    }),
    true
  );
  assert.equal(
    isMissingKeepAliveSchemaError({
      code: "08006",
      message: "connection failure",
    }),
    false
  );
  assert.equal(isMissingKeepAliveSchemaError(null), false);
});
