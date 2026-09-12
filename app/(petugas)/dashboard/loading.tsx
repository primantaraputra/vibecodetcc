import React from 'react';
import { Skeleton, StatCardSkeleton } from '@/components/ui';

export default function DashboardLoading() {
  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Welcome Banner Skeleton */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 sm:p-8 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-2 max-w-xl">
          <div className="flex items-center gap-2">
            <Skeleton className="h-5 w-44 rounded-full bg-slate-800" />
            <Skeleton className="h-4 w-32 bg-slate-800" />
          </div>
          <Skeleton className="h-8 w-80 bg-slate-800" />
          <Skeleton className="h-4 w-full bg-slate-800" />
        </div>
        <div className="flex gap-2">
          <Skeleton className="h-10 w-32 rounded-xl bg-slate-800" />
          <Skeleton className="h-10 w-28 rounded-xl bg-slate-800" />
        </div>
      </div>

      {/* 4 Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCardSkeleton />
        <StatCardSkeleton />
        <StatCardSkeleton />
        <StatCardSkeleton />
      </div>

      {/* Main Grid: 2 Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2 cols): Summary Table / Chart Placeholder */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <Skeleton className="h-5 w-48" />
            <Skeleton className="h-4 w-24" />
          </div>
          <div className="space-y-3">
            <Skeleton className="h-12 w-full rounded-xl" />
            <Skeleton className="h-12 w-full rounded-xl" />
            <Skeleton className="h-12 w-full rounded-xl" />
            <Skeleton className="h-12 w-full rounded-xl" />
          </div>
        </div>

        {/* Right Column: Quick Action & Notification Feed */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <Skeleton className="h-5 w-36" />
            <Skeleton className="h-4 w-16" />
          </div>
          <div className="space-y-3">
            <Skeleton className="h-16 w-full rounded-xl" />
            <Skeleton className="h-16 w-full rounded-xl" />
            <Skeleton className="h-16 w-full rounded-xl" />
          </div>
        </div>
      </div>
    </div>
  );
}
