import assert from "node:assert/strict";
import test from "node:test";

import {
  CAPTCHA_CHARS,
  generateCaptchaCode,
  validateCaptcha,
} from "../src/lib/captcha-utils";

test("generateCaptchaCode menghasilkan kode acak dengan panjang 4 karakter yang aman", () => {
  const codeDefault = generateCaptchaCode();
  assert.equal(codeDefault.length, 4);

  const codeCustom = generateCaptchaCode(5);
  assert.equal(codeCustom.length, 5);

  // Pastikan hanya menggunakan karakter aman
  for (const char of codeDefault) {
    assert.ok(CAPTCHA_CHARS.includes(char), `Karakter ${char} harus ada di CAPTCHA_CHARS`);
  }
});

test("validateCaptcha validasi input tidak sensitif huruf besar/kecil dan mengabaikan spasi", () => {
  assert.equal(validateCaptcha("ACEF", "ACEF"), true);
  assert.equal(validateCaptcha("acef", "ACEF"), true);
  assert.equal(validateCaptcha("  AcEf  ", "acef"), true);
  // Test dengan spasi internal seperti "A C E F"
  assert.equal(validateCaptcha("A C E F", "ACEF"), true);
  assert.equal(validateCaptcha(" a  c  e  f ", "ACEF"), true);
  assert.equal(validateCaptcha("WRONG", "ACEF"), false);
  assert.equal(validateCaptcha("", "ACEF"), false);
  assert.equal(validateCaptcha(null, "ACEF"), false);
  assert.equal(validateCaptcha(undefined, "ACEF"), false);
});
