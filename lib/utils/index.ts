import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format angka ke mata uang Rupiah (IDR)
 */
export function formatRupiah(amount: number | string | null | undefined): string {
  if (amount === null || amount === undefined) return 'Rp 0';
  const num = typeof amount === 'string' ? parseFloat(amount) : amount;
  if (isNaN(num)) return 'Rp 0';
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(num);
}

/**
 * Format tanggal ke format Indonesia (e.g., 4 September 2026)
 */
export function formatTanggal(dateStr: string | Date | null | undefined): string {
  if (!dateStr) return '-';
  const date = typeof dateStr === 'string' ? new Date(dateStr) : dateStr;
  if (isNaN(date.getTime())) return '-';

  return new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(date);
}

/**
 * Format tanggal dan waktu ke format Indonesia (e.g., 4 Sep 2026, 14:30 WIB)
 */
export function formatTanggalWaktu(dateStr: string | Date | null | undefined): string {
  if (!dateStr) return '-';
  const date = typeof dateStr === 'string' ? new Date(dateStr) : dateStr;
  if (isNaN(date.getTime())) return '-';

  return (
    new Intl.DateTimeFormat('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date) + ' WIB'
  );
}

/**
 * Masking NIK untuk privasi (e.g. 327301******0001)
 */
export function maskNIK(nik: string | null | undefined): string {
  if (!nik || nik.length < 8) return '327301******0001';
  return nik.substring(0, 6) + '******' + nik.substring(nik.length - 4);
}

/**
 * Masking Nama untuk privasi (e.g. B*** S******)
 */
export function maskName(name: string | null | undefined): string {
  if (!name) return 'W***';
  return name
    .split(' ')
    .map((word) => {
      if (word.length <= 2) return word;
      return `${word[0]}${'*'.repeat(Math.max(1, word.length - 2))}${word[word.length - 1]}`;
    })
    .join(' ');
}

/**
 * Masking No KK untuk privasi
 */
export function maskKK(kk: string | null | undefined): string {
  if (!kk || kk.length < 8) return '**************';
  return kk.substring(0, 4) + '********' + kk.substring(kk.length - 4);
}
