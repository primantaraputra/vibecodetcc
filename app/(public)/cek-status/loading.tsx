import React from 'react';
import { Skeleton } from '@/components/ui';

export default function CekStatusLoading() {
  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Search Box Card Skeleton */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex items-center gap-3">
          <Skeleton className="w-10 h-10 rounded-xl" />
          <div className="space-y-1.5">
            <Skeleton className="h-6 w-64" />
            <Skeleton className="h-3.5 w-80" />
          </div>
        </div>

        {/* Privacy Notice Skeleton */}
        <Skeleton className="h-16 w-full rounded-xl" />

        {/* Input & Button Skeleton */}
        <div className="space-y-4">
          <div className="space-y-1.5">
            <Skeleton className="h-4 w-44" />
            <Skeleton className="h-12 w-full rounded-xl" />
          </div>
          <Skeleton className="h-12 w-full rounded-xl" />
        </div>

        {/* Quick Demo Pills Skeleton */}
        <div className="pt-2 border-t border-slate-100 space-y-2">
          <Skeleton className="h-3 w-56" />
          <div className="flex flex-wrap gap-2">
            <Skeleton className="h-7 w-36 rounded-lg" />
            <Skeleton className="h-7 w-40 rounded-lg" />
            <Skeleton className="h-7 w-32 rounded-lg" />
          </div>
        </div>
      </div>
    </div>
  );
}
