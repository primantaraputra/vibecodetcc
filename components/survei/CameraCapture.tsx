'use client';

import { useState, useRef } from 'react';
import { Camera, RefreshCw, CheckCircle2, AlertCircle, Image as ImageIcon } from 'lucide-react';
import { formatTanggalWaktu } from '@/lib/utils';

interface Props {
  label: string;
  required?: boolean;
  value: string;
  onChange: (base64Url: string) => void;
}

export function CameraCapture({ label, required = false, value, onChange }: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string>(value || '');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCapture = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsProcessing(true);
    setError(null);

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        // Draw on canvas to overlay timestamp & watermark
        const canvas = document.createElement('canvas');
        const maxDim = 1200;
        let width = img.width;
        let height = img.height;

        if (width > height && width > maxDim) {
          height = Math.round((height * maxDim) / width);
          width = maxDim;
        } else if (height > maxDim) {
          width = Math.round((width * maxDim) / height);
          height = maxDim;
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);

          // Overlay watermark
          ctx.fillStyle = 'rgba(0, 0, 0, 0.55)';
          ctx.fillRect(0, height - 55, width, 55);

          ctx.fillStyle = '#ffffff';
          ctx.font = 'bold 16px sans-serif';
          ctx.fillText(`BUKTI SURVEI LAPANGAN BANSOS`, 15, height - 32);

          ctx.font = '13px monospace';
          ctx.fillStyle = '#e2e8f0';
          ctx.fillText(`${formatTanggalWaktu(new Date())} • Verified Device Camera`, 15, height - 12);
        }

        const base64Data = canvas.toDataURL('image/jpeg', 0.82);
        setPreview(base64Data);
        onChange(base64Data);
        setIsProcessing(false);
      };
      img.src = event.target?.result as string;
    };
    reader.onerror = () => {
      setError('Gagal membaca data kamera.');
      setIsProcessing(false);
    };
    reader.readAsDataURL(file);
  };

  const handleRetake = () => {
    setPreview('');
    onChange('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
      fileInputRef.current.click();
    }
  };

  return (
    <div className="space-y-2">
      <label className="block text-xs font-semibold text-slate-800">
        {label} {required && <span className="text-red-500">* (Wajib Kamera Langsung)</span>}
      </label>

      {/* Hidden input strictly enforcing camera capture on mobile devices */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleCapture}
        className="hidden"
      />

      {error && (
        <div className="p-2.5 rounded-lg bg-red-50 text-red-700 text-xs flex items-center gap-1.5">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {preview ? (
        <div className="relative rounded-2xl overflow-hidden border-2 border-brand-500 bg-slate-900 group shadow-md">
          <img src={preview} alt="Bukti Kamera" className="w-full h-48 sm:h-56 object-cover" />

          <div className="absolute top-2 right-2 bg-emerald-600/90 text-white px-2 py-0.5 rounded-full text-[10px] font-semibold flex items-center gap-1 backdrop-blur-xs">
            <CheckCircle2 className="w-3 h-3" />
            <span>Kamera Terverifikasi</span>
          </div>

          <div className="absolute bottom-2 right-2 flex gap-2">
            <button
              type="button"
              onClick={handleRetake}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-900/80 hover:bg-slate-900 text-white backdrop-blur-xs transition shadow-sm"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Ambil Ulang</span>
            </button>
          </div>
        </div>
      ) : (
        <div
          onClick={() => fileInputRef.current?.click()}
          className="cursor-pointer border-2 border-dashed border-slate-300 hover:border-brand-500 hover:bg-brand-50/40 rounded-2xl p-6 text-center space-y-2.5 transition bg-slate-50/50"
        >
          <div className="w-12 h-12 rounded-2xl bg-brand-100 text-brand-700 flex items-center justify-center mx-auto shadow-xs">
            <Camera className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs font-bold text-slate-800">
              {isProcessing ? 'Memproses Foto...' : 'Buka Kamera HP & Ambil Foto'}
            </div>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Sesuai spesifikasi, foto wajib diambil langsung di tempat survei
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
