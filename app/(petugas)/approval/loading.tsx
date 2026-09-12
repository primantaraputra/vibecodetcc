import React from 'react';
import { Skeleton, ListSkeleton } from '@/components/ui';

export default function ApprovalLoading() {
  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header & Role Switcher Banner */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <Skeleton className="h-6 w-56" />
            <Skeleton className="h-3.5 w-80" />
          </div>
          <div className="flex gap-2">
            <Skeleton className="h-9 w-28 rounded-xl" />
            <Skeleton className="h-9 w-28 rounded-xl" />
          </div>
        </div>

        {/* Filter Pills & Search */}
        <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row gap-3">
          <Skeleton className="h-10 flex-1 rounded-xl" />
          <Skeleton className="h-10 w-44 rounded-xl" />
        </div>

        {/* Status Tab Pills */}
        <div className="flex gap-2 overflow-x-auto pt-1">
          <Skeleton className="h-8 w-28 rounded-lg" />
          <Skeleton className="h-8 w-28 rounded-lg" />
          <Skeleton className="h-8 w-24 rounded-lg" />
          <Skeleton className="h-8 w-24 rounded-lg" />
        </div>
      </div>

      {/* Approval Cards List */}
      <ListSkeleton count={4} />
    </div>
  );
}
