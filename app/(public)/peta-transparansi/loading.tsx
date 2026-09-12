import React from 'react';
import { Skeleton, MapSkeleton } from '@/components/ui';

export default function PetaTransparansiLoading() {
  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8 animate-fadeIn">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header Skeleton */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-3">
          <div className="flex items-center gap-3">
            <Skeleton className="w-10 h-10 rounded-xl" />
            <div className="space-y-1.5">
              <Skeleton className="h-6 w-72" />
              <Skeleton className="h-3.5 w-96" />
            </div>
          </div>
        </div>

        {/* Map Skeleton */}
        <MapSkeleton height="540px" />
      </div>
    </div>
  );
}
