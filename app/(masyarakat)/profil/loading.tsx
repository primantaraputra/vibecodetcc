import React from 'react';
import { Skeleton, SkeletonCard } from '@/components/ui';

export default function ProfilLoading() {
  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Citizen ID Card Skeleton */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-teal-950 text-white rounded-2xl p-6 sm:p-8 shadow-sm space-y-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <Skeleton className="w-16 h-16 rounded-2xl bg-white/10" />
            <div className="space-y-2">
              <Skeleton className="h-6 w-48 bg-white/10" />
              <Skeleton className="h-4 w-36 bg-white/10" />
              <Skeleton className="h-4 w-28 bg-white/10 rounded-full" />
            </div>
          </div>
          <Skeleton className="w-16 h-16 rounded-xl bg-white/10 hidden sm:block" />
        </div>
        <div className="pt-4 border-t border-white/10 grid grid-cols-2 sm:grid-cols-4 gap-4">
          <Skeleton className="h-10 w-full bg-white/10 rounded-xl" />
          <Skeleton className="h-10 w-full bg-white/10 rounded-xl" />
          <Skeleton className="h-10 w-full bg-white/10 rounded-xl" />
          <Skeleton className="h-10 w-full bg-white/10 rounded-xl" />
        </div>
      </div>

      {/* Desil & Kelayakan Card */}
      <SkeletonCard />

      {/* Notification List */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <Skeleton className="h-5 w-40" />
          <Skeleton className="h-4 w-16" />
        </div>
        <div className="space-y-3">
          <Skeleton className="h-14 w-full rounded-xl" />
          <Skeleton className="h-14 w-full rounded-xl" />
        </div>
      </div>
    </div>
  );
}
