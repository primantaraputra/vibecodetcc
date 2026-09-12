import React from 'react';
import { Skeleton, FormSkeleton } from '@/components/ui';

export default function SanggahanLoading() {
  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header Banner */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-2">
        <Skeleton className="h-6 w-64" />
        <Skeleton className="h-3.5 w-full max-w-lg" />
      </div>

      {/* Sanggahan Form Fields */}
      <FormSkeleton fields={4} />
    </div>
  );
}
