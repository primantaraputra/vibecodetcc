import { openDB, DBSchema, IDBPDatabase } from 'idb';
import { OfflineSurveiRecord, SurveiFormData, PMTScoreResult } from '@/lib/types/survei';
import { submitSurveiLapang } from '@/lib/actions/survei';

interface BansosDB extends DBSchema {
  survei_queue: {
    key: string;
    value: OfflineSurveiRecord;
    indexes: { 'by-status': string; 'by-date': string };
  };
}

const DB_NAME = 'bansos_offline_db_v1';
const DB_VERSION = 1;

let dbPromise: Promise<IDBPDatabase<BansosDB>> | null = null;

function getDB() {
  if (typeof window === 'undefined') return null;
  if (!dbPromise) {
    dbPromise = openDB<BansosDB>(DB_NAME, DB_VERSION, {
      upgrade(db) {
        if (!db.objectStoreNames.contains('survei_queue')) {
          const store = db.createObjectStore('survei_queue', { keyPath: 'id' });
          store.createIndex('by-status', 'status');
          store.createIndex('by-date', 'createdAt');
        }
      },
    });
  }
  return dbPromise;
}

/**
 * Menyimpan formulir survei ke IndexedDB lokal (baik mode offline maupun antrean)
 */
export async function saveSurveiOffline(
  formData: SurveiFormData,
  scoreResult: PMTScoreResult
): Promise<OfflineSurveiRecord> {
  const db = await getDB();
  const recordId = `offline-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
  const record: OfflineSurveiRecord = {
    id: recordId,
    formData,
    scoreResult,
    createdAt: new Date().toISOString(),
    status: 'pending_sync',
  };

  if (db) {
    await db.put('survei_queue', record);
  }

  return record;
}

/**
 * Mengambil seluruh daftar survei yang belum tersinkronisasi
 */
export async function getPendingSurveys(): Promise<OfflineSurveiRecord[]> {
  const db = await getDB();
  if (!db) return [];

  const all = await db.getAll('survei_queue');
  return all.filter((item) => item.status === 'pending_sync');
}

/**
 * Menghapus atau menandai survei yang telah berhasil tersinkron
 */
export async function markSurveySynced(id: string): Promise<void> {
  const db = await getDB();
  if (!db) return;

  const item = await db.get('survei_queue', id);
  if (item) {
    item.status = 'synced';
    await db.put('survei_queue', item);
  }
}

/**
 * Sinkronisasi otomatis seluruh antrean survei lokal ke Supabase
 */
export async function syncAllPendingSurveys(): Promise<{
  successCount: number;
  failedCount: number;
  errors: string[];
}> {
  const pending = await getPendingSurveys();
  let successCount = 0;
  let failedCount = 0;
  const errors: string[] = [];

  for (const item of pending) {
    try {
      const res = await submitSurveiLapang(item.formData, item.scoreResult);
      if (res.success) {
        await markSurveySynced(item.id);
        successCount++;
      } else {
        failedCount++;
        errors.push(res.message);
      }
    } catch (err: any) {
      failedCount++;
      errors.push(err?.message || 'Gagal sinkronisasi data');
    }
  }

  return { successCount, failedCount, errors };
}
