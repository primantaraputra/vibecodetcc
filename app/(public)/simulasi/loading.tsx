import React from 'react';
import { Skeleton, FormSkeleton, SkeletonCard } from '@/components/ui';

export default function SimulasiLoading() {
  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header Skeleton */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-3">
        <div className="flex items-center gap-3">
          <Skeleton className="w-10 h-10 rounded-xl" />
          <div className="space-y-1.5">
            <Skeleton className="h-6 w-60" />
            <Skeleton className="h-3.5 w-80" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form Inputs (2 cols) */}
        <div className="lg:col-span-2">
          <FormSkeleton fields={6} />
        </div>

        {/* Live Calculation Card */}
        <div className="space-y-4">
          <SkeletonCard />
        </div>
      </div>
    </div>
  );
}
