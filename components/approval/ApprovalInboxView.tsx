'use client';

import { useState, useEffect } from 'react';
import { ApprovalItem, ApprovalDetailData } from '@/lib/types/approval';
import { UserRole } from '@/lib/types/database.types';
import { getApprovalDetail } from '@/lib/actions/approval';
import { localStorageManager } from '@/lib/storage/localStorageManager';
import { ApprovalCard } from './ApprovalCard';
import { ApprovalActionModal } from './ApprovalActionModal';
import { ApprovalDetailModal } from './ApprovalDetailModal';
import { getRoleLabel, getRoleBadgeStyle } from '@/lib/auth/roles';
import {
  Search,
  Filter,
  CheckCircle2,
  Clock,
  XCircle,
  AlertTriangle,
  RefreshCw,
  Sparkles,
  ShieldCheck,
  UserCheck,
} from 'lucide-react';

interface Props {
  initialData: ApprovalItem[];
  userRole: UserRole;
  userNama: string;
}

export function ApprovalInboxView({ initialData, userRole, userNama }: Props) {
  // Demo Role Switcher for instant multi-role testing
  const [activeRole, setActiveRole] = useState<UserRole>(userRole || 'petugas_rw');
  const [data, setData] = useState<ApprovalItem[]>(initialData);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'actionable' | 'all' | 'approved' | 'rejected' | 'revision'>('actionable');
  const [programFilter, setProgramFilter] = useState<string>('all');

  // Modals state
  const [selectedDetail, setSelectedDetail] = useState<ApprovalDetailData | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [actionItem, setActionItem] = useState<ApprovalItem | null>(null);
  const [actionType, setActionType] = useState<'setujui' | 'tolak' | 'minta_revisi'>('setujui');
  const [isActionModalOpen, setIsActionModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [loadingDetailId, setLoadingDetailId] = useState<string | null>(null);

  // Sync with localStorage
  const loadLocalData = () => {
    localStorageManager.init();
    const localList = localStorageManager.getPengajuanList();
    if (localList && localList.length > 0) {
      setData(localList);
    }
  };

  useEffect(() => {
    loadLocalData();
    const unsubscribe = localStorageManager.subscribe(() => {
      loadLocalData();
    });
    return () => unsubscribe();
  }, []);

  // Helper filter by active role actionable status
  const isItemActionable = (item: ApprovalItem) => {
    if (activeRole === 'petugas_rw' && item.status === 'diusulkan_rt') return true;
    if (activeRole === 'petugas_kelurahan' && item.status === 'disetujui_rw') return true;
    if (activeRole === 'petugas_kecamatan' && item.status === 'diverifikasi_kelurahan') return true;
    if (
      activeRole === 'super_admin' &&
      ['diusulkan_rt', 'disetujui_rw', 'diverifikasi_kelurahan'].includes(item.status)
    )
      return true;
    return false;
  };

  // Filter items
  const filteredItems = data.filter((item) => {
    // 1. Search Query
    const q = searchQuery.toLowerCase();
    const matchSearch =
      item.nomor_pengajuan.toLowerCase().includes(q) ||
      item.warga.nama_lengkap.toLowerCase().includes(q) ||
      item.warga.nik.includes(q) ||
      item.wilayah.nama.toLowerCase().includes(q);

    if (!matchSearch) return false;

    // 2. Program Filter
    if (programFilter !== 'all' && item.program.kode_program !== programFilter) {
      return false;
    }

    // 3. Status Tab Filter
    if (statusFilter === 'actionable') {
      return isItemActionable(item);
    }
    if (statusFilter === 'approved') {
      return ['disetujui_rw', 'diverifikasi_kelurahan', 'disetujui_kecamatan', 'tersalurkan'].includes(
        item.status
      );
    }
    if (statusFilter === 'rejected') {
      return ['ditolak_rw', 'ditolak_kelurahan', 'ditolak_kecamatan'].includes(item.status);
    }
    if (statusFilter === 'revision') {
      return ['perlu_revisi_rw', 'perlu_revisi_kelurahan'].includes(item.status);
    }

    return true; // 'all'
  });

  // Calculate Metrics
  const actionableCount = data.filter(isItemActionable).length;
  const approvedCount = data.filter((i) =>
    ['disetujui_rw', 'diverifikasi_kelurahan', 'disetujui_kecamatan', 'tersalurkan'].includes(i.status)
  ).length;
  const rejectedCount = data.filter((i) =>
    ['ditolak_rw', 'ditolak_kelurahan', 'ditolak_kecamatan'].includes(i.status)
  ).length;
  const revisionCount = data.filter((i) =>
    ['perlu_revisi_rw', 'perlu_revisi_kelurahan'].includes(i.status)
  ).length;

  // Open Detail
  const handleOpenDetail = async (item: ApprovalItem) => {
    setLoadingDetailId(item.id);
    try {
      const localDetail = localStorageManager.getPengajuanDetail(item.id);
      if (localDetail) {
        setSelectedDetail(localDetail);
        setIsDetailOpen(true);
        return;
      }

      const detail = await getApprovalDetail(item.id);
      if (detail) {
        setSelectedDetail(detail);
        setIsDetailOpen(true);
      }
    } finally {
      setLoadingDetailId(null);
    }
  };

  // Open Action Modal
  const handleActionClick = (
    item: ApprovalItem,
    action: 'setujui' | 'tolak' | 'minta_revisi'
  ) => {
    setActionItem(item);
    setActionType(action);
    setIsActionModalOpen(true);
  };

  // On Action Success
  const handleActionSuccess = (nextStatus: string, message: string) => {
    loadLocalData();
    if (selectedDetail && actionItem && selectedDetail.id === actionItem.id) {
      setSelectedDetail((prev) =>
        prev ? { ...prev, status: nextStatus as any } : null
      );
    }

    setToastMessage(message);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="p-4 rounded-xl bg-emerald-600 text-white text-xs font-semibold shadow-lg flex items-center justify-between animate-in slide-in-from-top duration-300">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
            <span>{toastMessage}</span>
          </div>
          <button
            onClick={() => setToastMessage(null)}
            className="text-white/80 hover:text-white text-xs font-bold"
          >
            ✕
          </button>
        </div>
      )}

      {/* Role Simulator Switcher (For Interactive Multi-Role Testing) */}
      <div className="bg-white p-3.5 sm:p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-slate-900 text-white flex items-center justify-center">
            <UserCheck className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
              <span>Simulasi Role Petugas</span>
              <span className="text-[10px] bg-brand-100 text-brand-800 px-2 py-0.2 rounded-full font-semibold">
                Demo Switcher
              </span>
            </div>
            <p className="text-[11px] text-slate-500">
              Ganti peran petugas untuk menguji alur approval berjenjang
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-1.5">
          {(
            [
              { role: 'petugas_rt', label: '1. Petugas RT' },
              { role: 'petugas_rw', label: '2. Petugas RW' },
              { role: 'petugas_kelurahan', label: '3. Kelurahan' },
              { role: 'petugas_kecamatan', label: '4. Kecamatan' },
              { role: 'super_admin', label: 'Super Admin' },
            ] as const
          ).map((r) => (
            <button
              key={r.role}
              onClick={() => setActiveRole(r.role)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                activeRole === r.role
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {r.label}
            </button>
          ))}
        </div>
      </div>

      {/* Header Info & Role Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 flex items-center gap-2">
            <span>Inbox Approval Berjenjang</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Login sebagai: <strong className="text-slate-800">{userNama}</strong> (Role aktif:{' '}
            <span className={`px-2 py-0.5 rounded text-[11px] font-semibold ${getRoleBadgeStyle(activeRole)}`}>
              {getRoleLabel(activeRole)}
            </span>
            )
          </p>
        </div>
      </div>

      {/* Metrics Counter */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div
          onClick={() => setStatusFilter('actionable')}
          className={`p-4 rounded-2xl border transition cursor-pointer ${
            statusFilter === 'actionable'
              ? 'bg-blue-50 border-blue-400 ring-2 ring-blue-100 shadow-sm'
              : 'bg-white border-slate-200 hover:border-slate-300 shadow-xs'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-600 font-medium">Perlu Aksi Saya</span>
            <Clock className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl font-black text-blue-700 mt-2">{actionableCount}</div>
          <div className="text-[10px] text-blue-600 mt-0.5 font-medium">Menunggu tindakan role Anda</div>
        </div>

        <div
          onClick={() => setStatusFilter('all')}
          className={`p-4 rounded-2xl border transition cursor-pointer ${
            statusFilter === 'all'
              ? 'bg-slate-100 border-slate-400 ring-2 ring-slate-200 shadow-sm'
              : 'bg-white border-slate-200 hover:border-slate-300 shadow-xs'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-600 font-medium">Total Pengajuan</span>
            <ShieldCheck className="w-4 h-4 text-slate-600" />
          </div>
          <div className="text-2xl font-black text-slate-900 mt-2">{data.length}</div>
          <div className="text-[10px] text-slate-500 mt-0.5 font-medium">Seluruh usulan di wilayah</div>
        </div>

        <div
          onClick={() => setStatusFilter('approved')}
          className={`p-4 rounded-2xl border transition cursor-pointer ${
            statusFilter === 'approved'
              ? 'bg-emerald-50 border-emerald-400 ring-2 ring-emerald-100 shadow-sm'
              : 'bg-white border-slate-200 hover:border-slate-300 shadow-xs'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-600 font-medium">Telah Disetujui</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-black text-emerald-700 mt-2">{approvedCount}</div>
          <div className="text-[10px] text-emerald-600 mt-0.5 font-medium">Lolos verifikasi bertahap</div>
        </div>

        <div
          onClick={() => setStatusFilter('rejected')}
          className={`p-4 rounded-2xl border transition cursor-pointer ${
            statusFilter === 'rejected'
              ? 'bg-rose-50 border-rose-400 ring-2 ring-rose-100 shadow-sm'
              : 'bg-white border-slate-200 hover:border-slate-300 shadow-xs'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-600 font-medium">Ditolak / Revisi</span>
            <XCircle className="w-4 h-4 text-rose-600" />
          </div>
          <div className="text-2xl font-black text-rose-700 mt-2">{rejectedCount + revisionCount}</div>
          <div className="text-[10px] text-rose-600 mt-0.5 font-medium">
            {rejectedCount} Ditolak • {revisionCount} Revisi
          </div>
        </div>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          {/* Tabs */}
          <div className="flex flex-wrap gap-1">
            <button
              onClick={() => setStatusFilter('actionable')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
                statusFilter === 'actionable'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <span>Perlu Aksi Saya</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                  statusFilter === 'actionable' ? 'bg-blue-800 text-white' : 'bg-blue-100 text-blue-800'
                }`}
              >
                {actionableCount}
              </span>
            </button>

            <button
              onClick={() => setStatusFilter('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                statusFilter === 'all'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              Semua Pengajuan ({data.length})
            </button>

            <button
              onClick={() => setStatusFilter('approved')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                statusFilter === 'approved'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              Disetujui ({approvedCount})
            </button>

            <button
              onClick={() => setStatusFilter('rejected')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                statusFilter === 'rejected'
                  ? 'bg-rose-600 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              Ditolak ({rejectedCount})
            </button>

            <button
              onClick={() => setStatusFilter('revision')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                statusFilter === 'revision'
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              Perlu Revisi ({revisionCount})
            </button>
          </div>

          {/* Program Select Filter */}
          <div className="flex items-center gap-2">
            <select
              value={programFilter}
              onChange={(e) => setProgramFilter(e.target.value)}
              className="px-3 py-1.5 rounded-lg border border-slate-300 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-brand-500 bg-white"
            >
              <option value="all">Semua Program Bansos</option>
              <option value="PKH">PKH</option>
              <option value="BPNT">BPNT</option>
              <option value="BLT_DESA">BLT Dana Desa</option>
              <option value="ATENSI_DISABILITAS">ATENSI Disabilitas</option>
              <option value="BANSOS_LANSIA">Bansos Lansia</option>
            </select>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari berdasarkan Nama Warga, 16 Digit NIK, Nomor Pengajuan, atau Wilayah..."
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500 text-xs"
          />
        </div>
      </div>

      {/* Application Cards Grid */}
      {filteredItems.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-3">
          <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
            <Filter className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-bold text-slate-800">Tidak ada pengajuan ditemukan</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            {statusFilter === 'actionable'
              ? `Tidak ada pengajuan yang membutuhkan tindakan approval untuk level ${getRoleLabel(
                  activeRole
                )} saat ini.`
              : 'Tidak ada pengajuan yang sesuai dengan kata kunci pencarian atau filter yang dipilih.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredItems.map((item) => (
            <ApprovalCard
              key={item.id}
              item={item}
              currentRole={activeRole}
              isLoadingDetail={loadingDetailId === item.id}
              onOpenDetail={handleOpenDetail}
              onActionClick={handleActionClick}
            />
          ))}
        </div>
      )}

      {/* Action Modal */}
      {actionItem && (
        <ApprovalActionModal
          item={actionItem}
          aksi={actionType}
          simulatedRole={activeRole}
          isOpen={isActionModalOpen}
          onClose={() => {
            setIsActionModalOpen(false);
            setActionItem(null);
          }}
          onSuccess={handleActionSuccess}
        />
      )}

      {/* Detail Modal */}
      {selectedDetail && (
        <ApprovalDetailModal
          detail={selectedDetail}
          currentRole={activeRole}
          isOpen={isDetailOpen}
          onClose={() => {
            setIsDetailOpen(false);
            setSelectedDetail(null);
          }}
          onActionClick={(it, action) => {
            handleActionClick(it, action);
          }}
        />
      )}
    </div>
  );
}
