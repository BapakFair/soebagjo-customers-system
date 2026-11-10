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
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    // Reset latar belakang canvas
    ctx.fillStyle = "#f8fafc"; // slate-50
    ctx.fillRect(0, 0, width, height);

    // Garis distorsi acak (noise lines)
    for (let i = 0; i < 4; i++) {
      ctx.strokeStyle = `hsl(${(i * 90 + Math.random() * 45) % 360}, 50%, 75%)`;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(Math.random() * width, Math.random() * height);
      ctx.bezierCurveTo(
        Math.random() * width,
        Math.random() * height,
        Math.random() * width,
        Math.random() * height,
        Math.random() * width,
        Math.random() * height
      );
      ctx.stroke();
    }

    // Gambar karakter dengan rotasi dan pergeseran acak
    const charSpacing = (width - 24) / (code.length || 1);
    ctx.textBaseline = "middle";

    for (let i = 0; i < code.length; i++) {
      ctx.save();
      const x = 14 + i * charSpacing + (Math.random() * 4 - 2);
      const y = height / 2 + (Math.random() * 4 - 2);
      const angle = (Math.random() * 26 - 13) * (Math.PI / 180);

      ctx.translate(x, y);
      ctx.rotate(angle);
      ctx.font = "bold 20px monospace";
      ctx.fillStyle = `hsl(${(i * 70 + 190) % 360}, 75%, 25%)`;
      ctx.fillText(code[i] ?? "", 0, 0);
      ctx.restore();
    }

    // Titik-titik noise acak
    for (let i = 0; i < 25; i++) {
      ctx.fillStyle = `rgba(15, 23, 42, ${0.15 + Math.random() * 0.2})`;
      ctx.beginPath();
      ctx.arc(Math.random() * width, Math.random() * height, 1, 0, Math.PI * 2);
      ctx.fill();
    }
  }, [code]);

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-slate-700" htmlFor="captcha-input">
          Kode Keamanan (Captcha)
        </label>
        <span className="text-xs text-slate-400">Tidak sensitif huruf besar/kecil</span>
      </div>

      <div className="flex items-center gap-2">
        <div
          className="overflow-hidden rounded-md border border-slate-200 bg-slate-50 shadow-xs"
          title="Klik gambar untuk mengganti kode"
        >
          <canvas
            ref={canvasRef}
            width={130}
            height={38}
            className="block cursor-pointer select-none"
            onClick={onRefresh}
            role="img"
            aria-label="Gambar kode captcha"
          />
        </div>

        <Button
          type="button"
          variant="outline"
          size="icon"
          className="size-9.5 shrink-0 rounded-md border-slate-300 text-slate-600 hover:text-slate-900"
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
          placeholder="Ketik kode"
          maxLength={6}
          value={value}
          onChange={(event) => onChange(event.target.value.toUpperCase())}
          autoComplete="off"
          disabled={disabled}
          className="font-mono tracking-widest uppercase"
          required
        />
      </div>
    </div>
  );
}
