import { Bell } from 'lucide-react';

export interface NotificationItem {
  id: string;
  title: string;
  description: string;
  date: string;
}

const DEFAULT_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif-1',
    title: 'Survei Lapangan Telah Selesai Dilakukan',
    description:
      'Petugas RT 01 telah menyelesaikan input kuesioner kesejahteraan dan foto geolokasi rumah Anda.',
    date: '04 Sep 2026',
  },
  {
    id: 'notif-2',
    title: 'Penyaluran BPNT Triwulan II Berhasil',
    description:
      'Dana bantuan sembako telah disalurkan melalui rekening e-Warong terdaftar.',
    date: '15 Jun 2026',
  },
];

interface NotificationListCardProps {
  notifications?: NotificationItem[];
}

export function NotificationListCard({
  notifications = DEFAULT_NOTIFICATIONS,
}: NotificationListCardProps) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-3">
      <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
        <Bell className="w-4 h-4 text-amber-600" />
        <span>Pemberitahuan Terkini</span>
      </h2>

      <div className="space-y-2 text-xs">
        {notifications.map((notif) => (
          <div
            key={notif.id}
            className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-start justify-between gap-3"
          >
            <div>
              <span className="font-semibold text-slate-800 block">{notif.title}</span>
              <p className="text-slate-500 mt-0.5">{notif.description}</p>
            </div>
            <span className="text-[10px] text-slate-400 font-mono flex-shrink-0">
              {notif.date}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
