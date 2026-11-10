// Kumpulan karakter yang 100% jelas dan tidak memiliki kemiripan satu sama lain:
// Dihilangkan: 0/O/D/Q (mirip), 1/I/l (mirip), 8/B (mirip), 5/S (mirip), 2/Z (mirip), 6/G (mirip), U/V (mirip)
export const CAPTCHA_CHARS = "3479ACEFHKMNPRTWXY";

export function generateCaptchaCode(length = 4): string {
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
  // Hapus semua spasi (baik di awal, tengah, maupun akhir) dan bandingkan dalam uppercase
  const cleanInput = input.replace(/\s+/g, "").toUpperCase();
  const cleanExpected = expectedCode.replace(/\s+/g, "").toUpperCase();
  return cleanInput === cleanExpected;
}
