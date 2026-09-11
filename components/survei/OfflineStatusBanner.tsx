'use client';

import { useState, useEffect } from 'react';
import { Wifi, WifiOff, RefreshCw, CheckCircle2, AlertCircle } from 'lucide-react';
import { getPendingSurveys, syncAllPendingSurveys } from '@/lib/offline/surveiStore';

export function OfflineStatusBanner() {
  const [isOnline, setIsOnline] = useState(true);
  const [pendingCount, setPendingCount] = useState(0);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncMessage, setSyncMessage] = useState<string | null>(null);

  const refreshPendingCount = async () => {
    try {
      const items = await getPendingSurveys();
      setPendingCount(items.length);
    } catch {
      // Ignore in SSR
    }
  };

  const handleSyncNow = async () => {
    if (isSyncing || !isOnline) return;
    setIsSyncing(true);
    setSyncMessage(null);

    const res = await syncAllPendingSurveys();
    setIsSyncing(false);
    await refreshPendingCount();

    if (res.successCount > 0) {
      setSyncMessage(`Sukses sinkronisasi ${res.successCount} survei ke database!`);
      setTimeout(() => setSyncMessage(null), 4000);
    } else if (res.failedCount > 0) {
      setSyncMessage(`Gagal sinkronisasi ${res.failedCount} data.`);
    }
  };

  useEffect(() => {
    if (typeof window === 'undefined') return;

    setIsOnline(navigator.onLine);
    refreshPendingCount();

    const handleOnline = () => {
      setIsOnline(true);
      handleSyncNow();
    };

    const handleOffline = () => {
      setIsOnline(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    const interval = setInterval(refreshPendingCount, 5000);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      clearInterval(interval);
    };
  }, []);

  return (
    <div className="space-y-2">
      <div
        className={`px-3.5 py-2.5 rounded-2xl border text-xs flex flex-wrap items-center justify-between gap-2 shadow-2xs transition ${
          isOnline
            ? 'bg-white border-slate-200 text-slate-700'
            : 'bg-amber-50 border-amber-300 text-amber-900'
        }`}
      >
        <div className="flex items-center gap-2">
          {isOnline ? (
            <span className="flex items-center gap-1.5 font-semibold text-emerald-700">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <Wifi className="w-4 h-4" />
              <span>Online Terhubung</span>
            </span>
          ) : (
            <span className="flex items-center gap-1.5 font-bold text-amber-800">
              <WifiOff className="w-4 h-4" />
              <span>Mode Semi-Offline (Tanpa Internet)</span>
            </span>
          )}
          <span className="text-slate-400 hidden sm:inline">•</span>
          <span className="text-[11px] text-slate-500">
            {pendingCount > 0
              ? `${pendingCount} formulir dalam antrean simpan lokal (IndexedDB)`
              : 'Seluruh data tersinkronisasi'}
          </span>
        </div>

        {pendingCount > 0 && isOnline && (
          <button
            type="button"
            onClick={handleSyncNow}
            disabled={isSyncing}
            className="flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold text-white bg-brand-600 hover:bg-brand-700 transition shadow-xs disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
            <span>{isSyncing ? 'Menyinkronkan...' : `Sinkronkan (${pendingCount})`}</span>
          </button>
        )}
      </div>

      {syncMessage && (
        <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center justify-between animate-in fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>{syncMessage}</span>
          </div>
          <button
            onClick={() => setSyncMessage(null)}
            className="text-xs text-slate-400 hover:text-slate-700"
          >
            ✕
          </button>
        </div>
      )}
    </div>
  );
}
