export function WorkflowHierarchySection() {
  const stages = [
    {
      stage: 'Tahap 1',
      title: 'Petugas RT',
      badgeClass: 'bg-orange-100 text-orange-800',
      description: 'Pengecekan & pendataan lapangan langsung warga',
    },
    {
      stage: 'Tahap 2',
      title: 'Petugas RW',
      badgeClass: 'bg-amber-100 text-amber-800',
      description: 'Pengecekan & musyawarah kelayakan tingkat RW',
    },
    {
      stage: 'Tahap 3',
      title: 'Petugas Kelurahan',
      badgeClass: 'bg-blue-100 text-blue-800',
      description: 'Pengecekan data administratif & kroscek DTKS',
    },
    {
      stage: 'Tahap 4',
      title: 'Petugas Kecamatan',
      badgeClass: 'bg-indigo-100 text-indigo-800',
      description: 'Pengecekan akhir & rekapitulasi se-kecamatan',
    },
    {
      stage: 'Penetapan',
      title: 'Petugas Pusat / Admin',
      badgeClass: 'bg-emerald-600 text-white font-bold shadow-xs',
      description: 'Penetapan resmi penerima bansos & alokasi bantuan',
    },
  ];

  return (
    <section className="max-w-6xl mx-auto px-4 py-12">
      <div className="text-center mb-8">
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
          Alur Pengecekan Berjenjang & Penetapan Bansos
        </h2>
        <p className="text-sm text-slate-500 mt-1 max-w-2xl mx-auto">
          Pengecekan data berjenjang oleh RT, RW, Kelurahan, hingga Kecamatan, dengan penetapan akhir penerima bantuan oleh Petugas Pusat/Admin.
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3.5">
        {stages.map((st) => (
          <div
            key={st.stage}
            className="bg-white p-4 rounded-xl border border-slate-200 text-center space-y-2 shadow-xs hover:border-slate-300 transition flex flex-col justify-between"
          >
            <div className="space-y-2">
              <span
                className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold ${st.badgeClass}`}
              >
                {st.stage}
              </span>
              <div className="font-bold text-slate-800 text-sm">{st.title}</div>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">{st.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
