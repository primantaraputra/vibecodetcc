import React from 'react';
import { Skeleton, StatCardSkeleton, TableSkeleton } from '@/components/ui';

export default function AnalitikLoading() {
  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header with action buttons */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1.5">
          <Skeleton className="h-6 w-60" />
          <Skeleton className="h-3.5 w-80" />
        </div>
        <div className="flex gap-2">
          <Skeleton className="h-9 w-28 rounded-xl" />
          <Skeleton className="h-9 w-28 rounded-xl" />
        </div>
      </div>

      {/* 4 Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCardSkeleton />
        <StatCardSkeleton />
        <StatCardSkeleton />
        <StatCardSkeleton />
      </div>

      {/* AI Executive Report Banner */}
      <div className="rounded-2xl p-6 bg-slate-900 text-white shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <Skeleton className="h-5 w-44 bg-slate-800" />
          <Skeleton className="h-8 w-32 rounded-xl bg-slate-800" />
        </div>
        <Skeleton className="h-4 w-full bg-slate-800" />
        <Skeleton className="h-4 w-5/6 bg-slate-800" />
      </div>

      {/* Table Rekapitulasi */}
      <TableSkeleton rows={5} cols={6} />
    </div>
  );
}
