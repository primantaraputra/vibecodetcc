'use client';

import React, { useState, useEffect } from 'react';
import {
  localStorageManager,
  STORAGE_KEYS,
} from '@/lib/storage/localStorageManager';
import {
  Database,
  Download,
  Copy,
  Check,
  RefreshCw,
  Trash2,
  X,
  FileCode,
  ShieldCheck,
  Users,
  ClipboardList,
  CheckSquare,
  MessageSquareWarning,
  FileText,
  History,
  Sparkles,
  Layers,
  HelpCircle,
  ExternalLink,
} from 'lucide-react';

export default function LocalStorageManagerModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'ringkasan' | 'sql' | 'json' | 'kelola'>('ringkasan');
  const [stats, setStats] = useState({
    totalWarga: 0,
    totalSurvei: 0,
    totalPengajuan: 0,
    totalSanggahan: 0,
    totalPengaduan: 0,
    totalUsers: 0,
    totalAuditLogs: 0,
  });
  const [sqlText, setSqlText] = useState('');
  const [jsonText, setJsonText] = useState('');
  const [copiedSql, setCopiedSql] = useState(false);
  const [copiedJson, setCopiedJson] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [actionNotice, setActionNotice] = useState<string | null>(null);

  const refreshData = () => {
    localStorageManager.init();
    const st = localStorageManager.getStats();
    setStats(st);
    setSqlText(localStorageManager.exportAllAsSql());
    setJsonText(localStorageManager.exportAllAsJson());
  };

  useEffect(() => {
    setMounted(true);
    refreshData();
    const unsubscribe = localStorageManager.subscribe(() => {
      refreshData();
    });
    return () => unsubscribe();
  }, []);

  if (!mounted) return null;

  const handleCopySql = () => {
    navigator.clipboard.writeText(sqlText);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 2500);
  };

  const handleCopyJson = () => {
    navigator.clipboard.writeText(jsonText);
    setCopiedJson(true);
    setTimeout(() => setCopiedJson(false), 2500);
  };

  const handleDownloadJson = () => {
    const blob = new Blob([jsonText], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `bansos_localstorage_backup_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    setActionNotice('File JSON backup berhasil diunduh!');
    setTimeout(() => setActionNotice(null), 3000);
  };

  const handleDownloadSql = () => {
    const blob = new Blob([sqlText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `bansos_supabase_migration_${new Date().toISOString().slice(0, 10)}.sql`;
    a.click();
    URL.revokeObjectURL(url);
    setActionNotice('Script SQL Supabase berhasil diunduh!');
    setTimeout(() => setActionNotice(null), 3000);
  };

  const handleReset = () => {
    if (confirm('Kembalikan seluruh data LocalStorage ke data seed awal bawaan sistem?')) {
      localStorageManager.resetToDefaultSeeds();
      refreshData();
      setActionNotice('Data LocalStorage berhasil dikembalikan ke default seeds.');
      setTimeout(() => setActionNotice(null), 3000);
    }
  };

  const handleClear = () => {
    if (confirm('Yakin ingin mengosongkan seluruh data di LocalStorage?')) {
      localStorageManager.clearAll();
      refreshData();
      setActionNotice('Seluruh data LocalStorage telah dikosongkan.');
      setTimeout(() => setActionNotice(null), 3000);
    }
  };

  const totalAllRecords =
    stats.totalWarga +
    stats.totalSurvei +
    stats.totalPengajuan +
    stats.totalSanggahan +
    stats.totalPengaduan;

  return (
    <>
      {/* Floating Bottom-Right Pill Badge */}
      <div className="fixed bottom-4 right-4 z-50 flex items-center">
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="group flex items-center gap-2.5 px-3.5 py-2 rounded-full bg-slate-900/90 hover:bg-slate-950 text-white text-xs font-semibold shadow-xl border border-slate-700/60 backdrop-blur transition transform hover:scale-105 active:scale-95"
          title="Klik untuk membuka Manajer & Ekspor LocalStorage"
        >
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
          </span>
          <span className="text-slate-200">LocalStorage:</span>
          <span className="bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full text-[11px] font-mono font-bold">
            {totalAllRecords} Rekaman
          </span>
          <Database className="w-3.5 h-3.5 text-slate-400 group-hover:text-white transition" />
        </button>
      </div>

      {/* Main Inspector & Exporter Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden animate-scaleUp">
            {/* Modal Header */}
            <div className="p-5 border-b border-slate-100 bg-gradient-to-r from-slate-900 to-slate-800 text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center text-emerald-400 shadow-xs">
                  <Database className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base font-bold flex items-center gap-2">
                    <span>LocalStorage Data & Supabase Bridge</span>
                    <span className="text-[10px] bg-emerald-500 text-slate-950 font-extrabold px-2 py-0.5 rounded-full uppercase">
                      Aktif
                    </span>
                  </h2>
                  <p className="text-xs text-slate-400">
                    Penyimpanan lokal browser sebelum migrasi penuh ke Supabase DB
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="w-8 h-8 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Action Notice Alert */}
            {actionNotice && (
              <div className="bg-emerald-50 border-b border-emerald-200 px-4 py-2 text-xs font-semibold text-emerald-800 flex items-center gap-2 animate-fadeIn">
                <Check className="w-4 h-4 text-emerald-600" />
                <span>{actionNotice}</span>
              </div>
            )}

            {/* Tabs Header */}
            <div className="flex items-center border-b border-slate-200 bg-slate-50/80 px-4 pt-2 gap-2 text-xs font-semibold overflow-x-auto no-scrollbar">
              <button
                type="button"
                onClick={() => setActiveTab('ringkasan')}
                className={`pb-2.5 px-3 border-b-2 transition flex items-center gap-1.5 whitespace-nowrap ${
                  activeTab === 'ringkasan'
                    ? 'border-brand-600 text-brand-700 font-bold'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>Ringkasan Data ({totalAllRecords})</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('sql')}
                className={`pb-2.5 px-3 border-b-2 transition flex items-center gap-1.5 whitespace-nowrap ${
                  activeTab === 'sql'
                    ? 'border-brand-600 text-brand-700 font-bold'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                <FileCode className="w-3.5 h-3.5" />
                <span>Ekspor SQL Supabase</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('json')}
                className={`pb-2.5 px-3 border-b-2 transition flex items-center gap-1.5 whitespace-nowrap ${
                  activeTab === 'json'
                    ? 'border-brand-600 text-brand-700 font-bold'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                <Download className="w-3.5 h-3.5" />
                <span>Backup JSON</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('kelola')}
                className={`pb-2.5 px-3 border-b-2 transition flex items-center gap-1.5 whitespace-nowrap ${
                  activeTab === 'kelola'
                    ? 'border-brand-600 text-brand-700 font-bold'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Reset & Kelola</span>
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-5 overflow-y-auto flex-1 space-y-4 text-xs">
              {/* TAB 1: RINGKASAN DATA */}
              {activeTab === 'ringkasan' && (
                <div className="space-y-4">
                  <div className="p-3.5 rounded-2xl bg-blue-50/70 border border-blue-200 text-blue-900 leading-relaxed space-y-1">
                    <div className="font-bold flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-blue-600" />
                      <span>Status Data: LocalStorage-First Aktif</span>
                    </div>
                    <p className="text-[11px] text-blue-800">
                      Seluruh formulir survei, pendaftaran, sanggahan, pengaduan, dan keputusan approval saat ini disimpan secara aman dan instan di memori browser Anda. Data tidak akan hilang saat halaman ditutup/di-refresh.
                    </p>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                    <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200">
                      <div className="flex items-center justify-between text-slate-500 mb-1">
                        <span className="font-medium text-[11px]">Warga Master</span>
                        <Users className="w-4 h-4 text-teal-600" />
                      </div>
                      <div className="text-xl font-black text-slate-900 font-mono">
                        {stats.totalWarga}
                      </div>
                    </div>

                    <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200">
                      <div className="flex items-center justify-between text-slate-500 mb-1">
                        <span className="font-medium text-[11px]">Survei Baru</span>
                        <ClipboardList className="w-4 h-4 text-brand-600" />
                      </div>
                      <div className="text-xl font-black text-slate-900 font-mono">
                        {stats.totalSurvei}
                      </div>
                    </div>

                    <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200">
                      <div className="flex items-center justify-between text-slate-500 mb-1">
                        <span className="font-medium text-[11px]">Usulan Bansos</span>
                        <CheckSquare className="w-4 h-4 text-blue-600" />
                      </div>
                      <div className="text-xl font-black text-slate-900 font-mono">
                        {stats.totalPengajuan}
                      </div>
                    </div>

                    <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200">
                      <div className="flex items-center justify-between text-slate-500 mb-1">
                        <span className="font-medium text-[11px]">Sanggahan Warga</span>
                        <FileText className="w-4 h-4 text-amber-600" />
                      </div>
                      <div className="text-xl font-black text-slate-900 font-mono">
                        {stats.totalSanggahan}
                      </div>
                    </div>

                    <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200">
                      <div className="flex items-center justify-between text-slate-500 mb-1">
                        <span className="font-medium text-[11px]">Pengaduan Publik</span>
                        <MessageSquareWarning className="w-4 h-4 text-rose-600" />
                      </div>
                      <div className="text-xl font-black text-slate-900 font-mono">
                        {stats.totalPengaduan}
                      </div>
                    </div>

                    <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200">
                      <div className="flex items-center justify-between text-slate-500 mb-1">
                        <span className="font-medium text-[11px]">Audit Trails</span>
                        <History className="w-4 h-4 text-purple-600" />
                      </div>
                      <div className="text-xl font-black text-slate-900 font-mono">
                        {stats.totalAuditLogs}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: EKSPOR SQL UNTUK SUPABASE */}
              {activeTab === 'sql' && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-bold text-slate-900">SQL Script Migrasi Supabase</div>
                      <p className="text-[11px] text-slate-500">
                        Jalankan script ini di <strong>Supabase SQL Editor</strong> untuk memindahkan seluruh data inputan lokal ke database Supabase nyata.
                      </p>
                    </div>
                    <div className="flex gap-1.5">
                      <button
                        type="button"
                        onClick={handleCopySql}
                        className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold flex items-center gap-1 transition"
                      >
                        {copiedSql ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copiedSql ? 'Tersalin!' : 'Salin SQL'}</span>
                      </button>
                      <button
                        type="button"
                        onClick={handleDownloadSql}
                        className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold flex items-center gap-1 transition"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Unduh .sql</span>
                      </button>
                    </div>
                  </div>

                  <pre className="p-3.5 rounded-2xl bg-slate-900 text-slate-200 font-mono text-[11px] h-64 overflow-y-auto leading-relaxed border border-slate-800">
                    {sqlText}
                  </pre>
                </div>
              )}

              {/* TAB 3: BACKUP JSON */}
              {activeTab === 'json' && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-bold text-slate-900">Backup Data Mentah JSON</div>
                      <p className="text-[11px] text-slate-500">
                        Salin atau unduh file arsip data lengkap yang tersimpan di LocalStorage.
                      </p>
                    </div>
                    <div className="flex gap-1.5">
                      <button
                        type="button"
                        onClick={handleCopyJson}
                        className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold flex items-center gap-1 transition"
                      >
                        {copiedJson ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copiedJson ? 'Tersalin!' : 'Salin JSON'}</span>
                      </button>
                      <button
                        type="button"
                        onClick={handleDownloadJson}
                        className="px-3 py-1.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-semibold flex items-center gap-1 transition"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Unduh Backup</span>
                      </button>
                    </div>
                  </div>

                  <pre className="p-3.5 rounded-2xl bg-slate-900 text-emerald-400 font-mono text-[11px] h-64 overflow-y-auto leading-relaxed border border-slate-800">
                    {jsonText}
                  </pre>
                </div>
              )}

              {/* TAB 4: KELOLA & RESET */}
              {activeTab === 'kelola' && (
                <div className="space-y-4">
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                    <div className="font-bold text-slate-900 flex items-center gap-2">
                      <RefreshCw className="w-4 h-4 text-brand-600" />
                      <span>Kembalikan ke Seed Awal Demo</span>
                    </div>
                    <p className="text-slate-600 text-[11px] leading-relaxed">
                      Mereset seluruh data lokal kembali ke data default simulasi (Budi Santoso, Siti Aminah, alur persetujuan RT/RW, dan aduan demo).
                    </p>
                    <button
                      type="button"
                      onClick={handleReset}
                      className="px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-semibold shadow-xs transition"
                    >
                      Reset ke Default Seeds
                    </button>
                  </div>

                  <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 space-y-3">
                    <div className="font-bold text-rose-900 flex items-center gap-2">
                      <Trash2 className="w-4 h-4 text-rose-600" />
                      <span>Kosongkan Seluruh LocalStorage</span>
                    </div>
                    <p className="text-rose-700 text-[11px] leading-relaxed">
                      Menghapus seluruh rekaman bansos lokal dari browser ini secara permanen.
                    </p>
                    <button
                      type="button"
                      onClick={handleClear}
                      className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-semibold shadow-xs transition"
                    >
                      Bersihkan LocalStorage
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between text-xs text-slate-500">
              <span className="font-mono text-[11px]">
                Engine: <strong className="text-slate-700">localStorageManager v1.0</strong>
              </span>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="px-4 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 font-semibold transition"
              >
                Tutup Panel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
