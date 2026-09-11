'use server';

import { createServerSupabaseClient } from '@/lib/supabase/server';

export interface InAppNotification {
  id: string;
  judul: string;
  pesan: string;
  tipe: 'status_pengajuan' | 'sanggahan' | 'info_bansos' | 'survei';
  isRead: boolean;
  linkUrl?: string;
  waktu: string;
}

// In-memory demo notifications
let DEMO_NOTIFICATIONS: InAppNotification[] = [
  {
    id: 'notif-1',
    judul: 'Status Usulan Bansos PKH Diperbarui',
    pesan: 'Berkas pengajuan PKH atas nama Budi Santoso telah disetujui dalam Musyawarah RW 01 dan diteruskan ke Kelurahan.',
    tipe: 'status_pengajuan',
    isRead: false,
    linkUrl: '/cek-status',
    waktu: '10 menit yang lalu',
  },
  {
    id: 'notif-2',
    judul: 'Jadwal Verifikasi Lapang Sanggahan',
    pesan: 'Sanggahan tiket #SGH-202609-8812 telah dijadwalkan untuk kunjungan survei ulang oleh Petugas Kelurahan.',
    tipe: 'sanggahan',
    isRead: false,
    linkUrl: '/sanggahan',
    waktu: '2 jam yang lalu',
  },
  {
    id: 'notif-3',
    judul: 'Penyaluran Bantuan Sembako BPNT',
    pesan: 'Jadwal penyaluran BPNT Triwulan III Kecamatan Sukamaju akan dimulai tanggal 10 September 2026.',
    tipe: 'info_bansos',
    isRead: true,
    linkUrl: '/cek-status',
    waktu: '1 hari yang lalu',
  },
  {
    id: 'notif-4',
    judul: 'Survei Kesejahteraan Terverifikasi',
    pesan: 'Petugas RT 01 telah memvalidasi data indikator fisik rumah dan skor PMT pada sistem.',
    tipe: 'survei',
    isRead: true,
    linkUrl: '/profil',
    waktu: '2 hari yang lalu',
  },
];

export async function getInAppNotifications(): Promise<InAppNotification[]> {
  try {
    const supabase = createServerSupabaseClient();
    const { data: notifs, error } = await supabase
      .from('notifikasi')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(10);

    if (!error && notifs && notifs.length > 0) {
      return notifs.map((n: any) => ({
        id: n.id,
        judul: n.judul,
        pesan: n.pesan,
        tipe: (n.tipe as any) || 'info_bansos',
        isRead: n.is_read || false,
        linkUrl: n.link_url || '/cek-status',
        waktu: new Date(n.created_at).toLocaleDateString('id-ID'),
      }));
    }
  } catch {
    // Fallback to demo notifications
  }

  return DEMO_NOTIFICATIONS;
}

export async function markNotificationAsRead(id: string): Promise<boolean> {
  DEMO_NOTIFICATIONS = DEMO_NOTIFICATIONS.map((n) =>
    n.id === id ? { ...n, isRead: true } : n
  );

  try {
    const supabase = createServerSupabaseClient();
    await (supabase.from('notifikasi') as any).update({ is_read: true }).eq('id', id);
  } catch {
    // Graceful fallback
  }

  return true;
}

export async function markAllNotificationsAsRead(): Promise<boolean> {
  DEMO_NOTIFICATIONS = DEMO_NOTIFICATIONS.map((n) => ({ ...n, isRead: true }));
  return true;
}
