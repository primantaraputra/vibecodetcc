import React from 'react';
import { Skeleton, FormSkeleton } from '@/components/ui';

export default function PengaduanLoading() {
  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header Skeleton */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-3">
        <div className="flex items-center gap-3">
          <Skeleton className="w-10 h-10 rounded-xl" />
          <div className="space-y-1.5">
            <Skeleton className="h-6 w-64" />
            <Skeleton className="h-3.5 w-80" />
          </div>
        </div>
      </div>

      {/* Form & Feed */}
      <FormSkeleton fields={5} />
    </div>
  );
}
