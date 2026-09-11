import { UserRole, TahapApproval } from '@/lib/types/database.types';

export const PETUGAS_ROLES: UserRole[] = [
  'super_admin',
  'petugas_kecamatan',
  'petugas_kelurahan',
  'petugas_rw',
  'petugas_rt',
];

export function isPetugas(role?: UserRole | string | null): boolean {
  if (!role) return false;
  return PETUGAS_ROLES.includes(role as UserRole);
}

export function isMasyarakat(role?: UserRole | string | null): boolean {
  return role === 'masyarakat';
}

export function isSuperAdmin(role?: UserRole | string | null): boolean {
  return role === 'super_admin';
}

/**
 * Validasi apakah role tertentu memiliki wewenang approval pada tahap tertentu
 */
export function canApproveStage(role: UserRole, tahap: TahapApproval): boolean {
  if (role === 'super_admin') return true;

  switch (tahap) {
    case 'rt':
      return role === 'petugas_rt';
    case 'rw':
      return role === 'petugas_rw';
    case 'kelurahan':
      return role === 'petugas_kelurahan';
    case 'kecamatan':
      return role === 'petugas_kecamatan';
    default:
      return false;
  }
}

/**
 * Mendapatkan label Bahasa Indonesia untuk masing-masing role
 */
export function getRoleLabel(role: UserRole | string): string {
  switch (role) {
    case 'super_admin':
      return 'Dinas Sosial (Super Admin)';
    case 'petugas_kecamatan':
      return 'Petugas Kecamatan';
    case 'petugas_kelurahan':
      return 'Petugas Kelurahan / Desa';
    case 'petugas_rw':
      return 'Petugas Rukun Warga (RW)';
    case 'petugas_rt':
      return 'Petugas Rukun Tetangga (RT)';
    case 'masyarakat':
      return 'Warga Masyarakat';
    default:
      return 'Pengguna';
  }
}

/**
 * Style badge warna per role untuk UI
 */
export function getRoleBadgeStyle(role: UserRole | string): string {
  switch (role) {
    case 'super_admin':
      return 'bg-purple-100 text-purple-800 border-purple-300 dark:bg-purple-900/30 dark:text-purple-300';
    case 'petugas_kecamatan':
      return 'bg-blue-100 text-blue-800 border-blue-300 dark:bg-blue-900/30 dark:text-blue-300';
    case 'petugas_kelurahan':
      return 'bg-emerald-100 text-emerald-800 border-emerald-300 dark:bg-emerald-900/30 dark:text-emerald-300';
    case 'petugas_rw':
      return 'bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-900/30 dark:text-amber-300';
    case 'petugas_rt':
      return 'bg-orange-100 text-orange-800 border-orange-300 dark:bg-orange-900/30 dark:text-orange-300';
    case 'masyarakat':
      return 'bg-teal-100 text-teal-800 border-teal-300 dark:bg-teal-900/30 dark:text-teal-300';
    default:
      return 'bg-slate-100 text-slate-800 border-slate-300 dark:bg-slate-800 dark:text-slate-300';
  }
}
