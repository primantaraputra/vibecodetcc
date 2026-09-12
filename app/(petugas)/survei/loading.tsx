import React from 'react';
import { Skeleton, FormSkeleton } from '@/components/ui';

export default function SurveiLoading() {
  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header Banner */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-2">
        <Skeleton className="h-6 w-64" />
        <Skeleton className="h-3.5 w-96" />
      </div>

      {/* Stepper Progress Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm flex items-center justify-between gap-2 overflow-x-auto">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex items-center gap-2 flex-1 min-w-[120px]">
            <Skeleton className="w-8 h-8 rounded-full flex-shrink-0" />
            <div className="space-y-1 flex-1">
              <Skeleton className="h-3 w-16" />
              <Skeleton className="h-2.5 w-12" />
            </div>
          </div>
        ))}
      </div>

      {/* Form Fields Card */}
      <FormSkeleton fields={5} />
    </div>
  );
}
