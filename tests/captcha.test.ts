import assert from "node:assert/strict";
import test from "node:test";

import {
  CAPTCHA_CHARS,
  generateCaptchaCode,
  validateCaptcha,
} from "../src/lib/captcha-utils";

test("generateCaptchaCode menghasilkan kode acak dengan panjang yang sesuai", () => {
  const codeDefault = generateCaptchaCode();
  assert.equal(codeDefault.length, 5);

  const codeCustom = generateCaptchaCode(6);
  assert.equal(codeCustom.length, 6);

  // Pastikan hanya menggunakan karakter aman
  for (const char of codeDefault) {
    assert.ok(CAPTCHA_CHARS.includes(char), `Karakter ${char} harus ada di CAPTCHA_CHARS`);
  }
});

test("validateCaptcha validasi input tidak sensitif huruf besar/kecil dan aman terhadap spasi", () => {
  assert.equal(validateCaptcha("ABCDE", "ABCDE"), true);
  assert.equal(validateCaptcha("abcde", "ABCDE"), true);
  assert.equal(validateCaptcha("  AbCdE  ", "abcde"), true);
  assert.equal(validateCaptcha("WRONG", "ABCDE"), false);
  assert.equal(validateCaptcha("", "ABCDE"), false);
  assert.equal(validateCaptcha(null, "ABCDE"), false);
  assert.equal(validateCaptcha(undefined, "ABCDE"), false);
});
