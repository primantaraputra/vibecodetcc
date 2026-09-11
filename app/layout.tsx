import type { Metadata, Viewport } from 'next';
import './globals.css';
import { ChatbotBansosModal } from '@/components/masyarakat';
import PwaInstallPrompt from '@/components/pwa/PwaInstallPrompt';
import LocalStorageManagerModal from '@/components/storage/LocalStorageManagerModal';

export const metadata: Metadata = {
  title: 'SI-BANSOS | Sistem Cek Kelayakan & Pendataan Terpadu Bansos',
  description:
    'Platform transparan verifikasi, pendataan, dan cek kelayakan bantuan sosial terintegrasi tingkat kecamatan.',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'SI-BANSOS',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#16a34a',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <body className="flex flex-col min-h-screen bg-slate-50 text-slate-900">
        {children}
        <ChatbotBansosModal />
        <PwaInstallPrompt />
        <LocalStorageManagerModal />
      </body>
    </html>
  );
}
