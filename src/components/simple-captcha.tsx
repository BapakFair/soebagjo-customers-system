import React from "react";
import { RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  CAPTCHA_CHARS,
  generateCaptchaCode,
  validateCaptcha,
} from "@/lib/captcha-utils";

export { CAPTCHA_CHARS, generateCaptchaCode, validateCaptcha };

interface SimpleCaptchaProps {
  code: string;
  onRefresh: () => void;
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

export function SimpleCaptcha({
  code,
  onRefresh,
  value,
  onChange,
  disabled = false,
}: SimpleCaptchaProps) {
  const canvasRef = React.useRef<HTMLCanvasElement | null>(null);

  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !code) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Retina display resolution scaling
    const dpr = typeof window !== "undefined" ? window.devicePixelRatio || 1 : 1;
    const displayWidth = 140;
    const displayHeight = 42;

    canvas.width = Math.round(displayWidth * dpr);
    canvas.height = Math.round(displayHeight * dpr);
    canvas.style.width = `${displayWidth}px`;
    canvas.style.height = `${displayHeight}px`;

    ctx.save();
    ctx.scale(dpr, dpr);

    // Latar belakang bersih dan terang
    ctx.fillStyle = "#f8fafc"; // slate-50
    ctx.fillRect(0, 0, displayWidth, displayHeight);

    // Garis grid halus
    ctx.strokeStyle = "#e2e8f0"; // slate-200
    ctx.lineWidth = 1;
    for (let x = 20; x < displayWidth; x += 20) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, displayHeight);
      ctx.stroke();
    }

    // 2 garis gelombang halus (ringan, tidak menutupi huruf)
    ctx.strokeStyle = "#cbd5e1"; // slate-300
    ctx.lineWidth = 1.5;
    for (let i = 0; i < 2; i++) {
      ctx.beginPath();
      ctx.moveTo(0, 14 + i * 14);
      ctx.bezierCurveTo(
        displayWidth * 0.35,
        6 + i * 16,
        displayWidth * 0.65,
        24 - i * 8,
        displayWidth,
        16 + i * 10
      );
      ctx.stroke();
    }

    // Karakter tajam, tebal, dan jelas
    ctx.font = "bold 24px 'Courier New', monospace, sans-serif";
    ctx.textBaseline = "middle";
    ctx.textAlign = "center";

    const charSpacing = displayWidth / (code.length + 1);

    for (let i = 0; i < code.length; i++) {
      ctx.save();
      const x = (i + 1) * charSpacing;
      const y = displayHeight / 2;
      const angle = Math.sin(i * 1.5) * 6 * (Math.PI / 180); // kemiringan kecil ±6 derajat

      ctx.translate(x, y);
      ctx.rotate(angle);
      ctx.fillStyle = "#0f766e"; // Teal-700 kontras tinggi
      ctx.fillText(code[i] ?? "", 0, 0);
      ctx.restore();
    }

    ctx.restore();
  }, [code]);

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-slate-700" htmlFor="captcha-input">
          Kode Keamanan (Captcha)
        </label>
        <span className="text-xs text-slate-400">4 karakter (bebas spasi & besar/kecil)</span>
      </div>

      <div className="flex items-center gap-2">
        <div
          className="overflow-hidden rounded-md border border-slate-200 bg-slate-50 shadow-xs cursor-pointer"
          onClick={onRefresh}
          title="Klik gambar untuk mengganti kode captcha"
        >
          <canvas
            ref={canvasRef}
            className="block select-none"
            role="img"
            aria-label={`Kode keamanan captcha: ${code}`}
          />
        </div>

        <Button
          type="button"
          variant="outline"
          size="icon"
          className="size-10.5 shrink-0 rounded-md border-slate-300 text-slate-600 hover:text-slate-900"
          onClick={onRefresh}
          disabled={disabled}
          title="Ganti kode captcha"
        >
          <RefreshCw className="size-4" />
          <span className="sr-only">Ganti kode captcha</span>
        </Button>

        <Input
          id="captcha-input"
          type="text"
          placeholder="Ketik 4 karakter"
          maxLength={6}
          value={value}
          onChange={(event) =>
            onChange(event.target.value.replace(/\s+/g, "").toUpperCase())
          }
          autoComplete="off"
          disabled={disabled}
          className="font-mono tracking-widest uppercase text-base"
          required
        />
      </div>
    </div>
  );
}
