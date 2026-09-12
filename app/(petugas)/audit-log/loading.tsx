import React from 'react';
import { Skeleton, TableSkeleton } from '@/components/ui';

export default function AuditLogLoading() {
  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header Banner */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <Skeleton className="w-12 h-12 rounded-2xl flex-shrink-0" />
          <div className="space-y-1.5">
            <Skeleton className="h-6 w-56" />
            <Skeleton className="h-3.5 w-72" />
          </div>
        </div>
        <div className="flex gap-2">
          <Skeleton className="h-10 w-44 rounded-xl" />
          <Skeleton className="h-10 w-24 rounded-xl" />
        </div>
      </div>

      {/* Filter Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-3">
        <div className="flex flex-col sm:flex-row gap-3">
          <Skeleton className="h-10 flex-1 rounded-xl" />
          <Skeleton className="h-10 w-44 rounded-xl" />
        </div>
        <div className="flex gap-2 overflow-x-auto pt-2 border-t border-slate-100">
          <Skeleton className="h-7 w-28 rounded-lg" />
          <Skeleton className="h-7 w-28 rounded-lg" />
          <Skeleton className="h-7 w-24 rounded-lg" />
          <Skeleton className="h-7 w-28 rounded-lg" />
        </div>
      </div>

      {/* Audit Log Table */}
      <TableSkeleton rows={6} cols={6} />
    </div>
  );
}
