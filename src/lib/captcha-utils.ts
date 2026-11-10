// Karakter aman tanpa 0, O, 1, I, l untuk menghindari kebingungan pengguna
export const CAPTCHA_CHARS = "23456789ABCDEFGHJKLMNPQRSTUVWXYZ";

export function generateCaptchaCode(length = 5): string {
  let result = "";
  for (let i = 0; i < length; i++) {
    result += CAPTCHA_CHARS.charAt(Math.floor(Math.random() * CAPTCHA_CHARS.length));
  }
  return result;
}

export function validateCaptcha(
  input: string | null | undefined,
  expectedCode: string | null | undefined
): boolean {
  if (!input || !expectedCode) {
    return false;
  }
  return input.trim().toUpperCase() === expectedCode.trim().toUpperCase();
}
