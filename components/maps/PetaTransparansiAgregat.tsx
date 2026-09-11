'use client';

import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import {
  ShieldAlert,
  Building2,
  Users,
  CheckCircle2,
  Info,
} from 'lucide-react';
import { formatRupiah } from '@/lib/utils';

// Aggregate Data per Kelurahan (STRICTLY AGGREGATED - ZERO INDIVIDUAL CITIZEN GPS)
const AGGREGATE_KELURAHAN_DATA = [
  {
    id: 'kel-1',
    nama: 'Kelurahan Mekarjaya',
    center: [-6.9175, 107.6191] as [number, number],
    radius: 950,
    color: '#059669', // Emerald
    fillColor: '#10b981',
    totalWarga: 540,
    totalPenerimaKK: 380,
    totalAnggaranTersalurkan: 785000000,
    desil1_2: 165,
    serapanPersen: 91,
    programBreakdown: [
      { nama: 'PKH (Program Keluarga Harapan)', penerima: 145, anggaran: 362500000 },
      { nama: 'BPNT / Sembako', penerima: 210, anggaran: 315000000 },
      { nama: 'BLT Dana Desa / Kelurahan', penerima: 25, anggaran: 107500000 },
    ],
  },
  {
    id: 'kel-2',
    nama: 'Kelurahan Sariwangi',
    center: [-6.9030, 107.6080] as [number, number],
    radius: 850,
    color: '#2563eb', // Blue
    fillColor: '#3b82f6',
    totalWarga: 410,
    totalPenerimaKK: 275,
    totalAnggaranTersalurkan: 580000000,
    desil1_2: 98,
    serapanPersen: 84,
    programBreakdown: [
      { nama: 'PKH (Program Keluarga Harapan)', penerima: 95, anggaran: 237500000 },
      { nama: 'BPNT / Sembako', penerima: 155, anggaran: 232500000 },
      { nama: 'Bansos Khusus Lansia', penerima: 25, anggaran: 110000000 },
    ],
  },
  {
    id: 'kel-3',
    nama: 'Kelurahan Cibaduyut Asri',
    center: [-6.9350, 107.6100] as [number, number],
    radius: 800,
    color: '#d97706', // Amber
    fillColor: '#f59e0b',
    totalWarga: 298,
    totalPenerimaKK: 195,
    totalAnggaranTersalurkan: 475000000,
    desil1_2: 77,
    serapanPersen: 78,
    programBreakdown: [
      { nama: 'PKH (Program Keluarga Harapan)', penerima: 60, anggaran: 150000000 },
      { nama: 'BPNT / Sembako', penerima: 110, anggaran: 165000000 },
      { nama: 'ATENSI Disabilitas', penerima: 25, anggaran: 160000000 },
    ],
  },
];

export default function PetaTransparansiAgregat() {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);

  const [selectedKel, setSelectedKel] = useState<typeof AGGREGATE_KELURAHAN_DATA[0] | null>(
    AGGREGATE_KELURAHAN_DATA[0]
  );

  useEffect(() => {
    if (typeof window === 'undefined' || !mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current).setView([-6.918, 107.612], 13);
      mapInstanceRef.current = map;

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors',
      }).addTo(map);

      AGGREGATE_KELURAHAN_DATA.forEach((kel) => {
        // Circle Zone
        const circle = L.circle(kel.center, {
          radius: kel.radius,
          color: kel.color,
          fillColor: kel.fillColor,
          fillOpacity: 0.25,
          weight: 3,
        }).addTo(map);

        circle.on('click', () => {
          setSelectedKel(kel);
        });

        // Badge centroid marker
        const centroidIcon = L.divIcon({
          className: 'custom-centroid-marker',
          html: `
            <div style="
              background: #0f172a;
              color: white;
              padding: 4px 8px;
              border-radius: 8px;
              border: 2px solid ${kel.fillColor};
              font-size: 11px;
              font-weight: bold;
              white-space: nowrap;
              box-shadow: 0 4px 6px -1px rgba(0,0,0,0.3);
              transform: translate(-50%, -50%);
              text-align: center;
              cursor: pointer;
            ">
              <div style="font-size: 9px; color: #94a3b8;">${kel.nama.replace('Kelurahan ', '')}</div>
              <div style="color: #4ade80;">${formatRupiah(kel.totalAnggaranTersalurkan)}</div>
            </div>
          `,
          iconSize: [120, 40],
          iconAnchor: [60, 20],
        });

        const marker = L.marker(kel.center, { icon: centroidIcon }).addTo(map);
        marker.on('click', () => {
          setSelectedKel(kel);
        });
      });
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  const totalAnggaranKecamatan = AGGREGATE_KELURAHAN_DATA.reduce(
    (acc, curr) => acc + curr.totalAnggaranTersalurkan,
    0
  );
  const totalPenerimaKecamatan = AGGREGATE_KELURAHAN_DATA.reduce(
    (acc, curr) => acc + curr.totalPenerimaKK,
    0
  );

  return (
    <div className="space-y-6">
      {/* Privacy Guarantee Banner */}
      <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-start gap-3 shadow-sm">
        <ShieldAlert className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
        <div>
          <span className="font-bold block text-sm mb-0.5">
            Prinsip Transparansi Publik & Kepatuhan Privasi (UU No. 27/2022 UU PDP):
          </span>
          <p className="text-amber-800 leading-relaxed">
            Peta ini <strong>HANYA</strong> menyajikan data agregasi tingkat Kelurahan / Wilayah (total penerima, pagu anggaran, dan serapan bansos).
            Sesuai regulasi perlindungan data pribadi, titik koordinat GPS presisi dan lokasi spesifik rumah warga <strong>100% dilindungi dan tidak ditampilkan</strong> pada portal publik.
          </p>
        </div>
      </div>

      {/* Aggregate Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <span className="text-xs font-semibold text-slate-500">Total Anggaran APBD/APBN Tersalurkan</span>
          <div className="text-2xl font-black text-slate-900 font-mono text-emerald-700">
            {formatRupiah(totalAnggaranKecamatan)}
          </div>
          <span className="text-[11px] text-slate-500">Tahun Anggaran Berjalan 2026</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <span className="text-xs font-semibold text-slate-500">Total Penerima Manfaat</span>
          <div className="text-2xl font-black text-slate-900 font-mono">
            {totalPenerimaKecamatan.toLocaleString('id-ID')}{' '}
            <span className="text-xs font-normal text-slate-500">Kepala Keluarga</span>
          </div>
          <span className="text-[11px] text-slate-500">Di 3 Kelurahan Se-Kecamatan</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <span className="text-xs font-semibold text-slate-500">Rata-Rata Serapan Kuota Bansos</span>
          <div className="text-2xl font-black text-brand-600 font-mono">85.4%</div>
          <span className="text-[11px] text-emerald-600 font-medium">Tepat Sasaran Desil 1–3</span>
        </div>
      </div>

      {/* Interactive Map */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="p-4 bg-slate-900 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Building2 className="w-5 h-5 text-brand-400" />
            <div>
              <h2 className="text-sm font-bold">Peta Sebaran Agregat Kelurahan Kecamatan Sukamaju</h2>
              <p className="text-[11px] text-slate-400">
                Klik lingkaran zona kelurahan untuk melihat rincian alokasi program
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-slate-300">Pilih Zona:</span>
            <select
              value={selectedKel?.id || ''}
              onChange={(e) => {
                const found = AGGREGATE_KELURAHAN_DATA.find((k) => k.id === e.target.value);
                if (found) {
                  setSelectedKel(found);
                  if (mapInstanceRef.current) {
                    mapInstanceRef.current.flyTo(found.center, 14);
                  }
                }
              }}
              className="px-2.5 py-1 rounded-lg bg-slate-800 text-white text-xs border border-slate-700 font-medium"
            >
              {AGGREGATE_KELURAHAN_DATA.map((k) => (
                <option key={k.id} value={k.id}>
                  {k.nama}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Map Container Element */}
        <div ref={mapContainerRef} className="h-[480px] w-full relative z-0" />

        {/* Selected Kelurahan Detailed Breakdown Panel */}
        {selectedKel && (
          <div className="p-6 bg-slate-50 border-t border-slate-200 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-3">
              <div>
                <span className="text-xs font-semibold text-brand-700 bg-brand-50 px-2.5 py-0.5 rounded-full border border-brand-200">
                  Rincian Detail Wilayah
                </span>
                <h3 className="text-base font-bold text-slate-900 mt-1">{selectedKel.nama}</h3>
              </div>
              <div className="text-right">
                <span className="text-xs text-slate-500 block">Total Realisasi Bansos:</span>
                <span className="text-base font-black text-emerald-700 font-mono">
                  {formatRupiah(selectedKel.totalAnggaranTersalurkan)}
                </span>
              </div>
            </div>

            {/* Breakdown Table */}
            <div>
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
                Rincian Distribusi Program Bantuan Sosial:
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {selectedKel.programBreakdown.map((prog, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-xl bg-white border border-slate-200 shadow-xs space-y-1 text-xs"
                  >
                    <span className="font-semibold text-slate-900 block">{prog.nama}</span>
                    <div className="text-slate-600">
                      <strong>{prog.penerima}</strong> Penerima KK
                    </div>
                    <div className="font-mono font-bold text-emerald-700">
                      {formatRupiah(prog.anggaran)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
