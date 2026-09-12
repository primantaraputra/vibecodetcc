import React from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
}

/**
 * Base Skeleton block with shimmering wave effect
 */
export function Skeleton({ className, ...props }: SkeletonProps) {
  return (
    <div
      className={cn(
        'animate-shimmer rounded-lg bg-slate-200/80',
        className
      )}
      {...props}
    />
  );
}

/**
 * Skeleton for standard Stat/Metric cards (e.g. Total Warga, Pengajuan, SK Disetujui)
 */
export function StatCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-3">
      <div className="flex items-center justify-between">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="w-10 h-10 rounded-xl" />
      </div>
      <Skeleton className="h-8 w-20" />
      <Skeleton className="h-3 w-36" />
    </div>
  );
}

/**
 * Skeleton for standard content cards
 */
export function SkeletonCard({ className }: { className?: string }) {
  return (
    <div className={cn('bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4', className)}>
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div className="flex items-center gap-3">
          <Skeleton className="w-9 h-9 rounded-xl" />
          <div className="space-y-1.5">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-3 w-20" />
          </div>
        </div>
        <Skeleton className="h-6 w-16 rounded-full" />
      </div>
      <div className="space-y-2">
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-5/6" />
        <Skeleton className="h-3 w-3/4" />
      </div>
    </div>
  );
}

/**
 * Skeleton for data tables (e.g. Audit Log, Rekapitulasi)
 */
export function TableSkeleton({ rows = 5, cols = 5 }: { rows?: number; cols?: number }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="p-4 border-b border-slate-100 flex items-center justify-between gap-4">
        <Skeleton className="h-8 w-48 rounded-lg" />
        <div className="flex gap-2">
          <Skeleton className="h-8 w-20 rounded-lg" />
          <Skeleton className="h-8 w-20 rounded-lg" />
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-slate-50 border-b border-slate-100">
            <tr>
              {Array.from({ length: cols }).map((_, i) => (
                <th key={i} className="py-3 px-4 text-left">
                  <Skeleton className="h-4 w-20" />
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {Array.from({ length: rows }).map((_, r) => (
              <tr key={r}>
                {Array.from({ length: cols }).map((_, c) => (
                  <td key={c} className="py-3.5 px-4">
                    <Skeleton
                      className={cn(
                        'h-3.5',
                        c === 0 ? 'w-24' : c === 1 ? 'w-32' : c === cols - 1 ? 'w-16 ml-auto' : 'w-20'
                      )}
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/**
 * Skeleton for form inputs (Survei, Sanggahan, Auth)
 */
export function FormSkeleton({ fields = 4 }: { fields?: number }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-5">
      <div className="space-y-1.5 border-b border-slate-100 pb-3">
        <Skeleton className="h-5 w-40" />
        <Skeleton className="h-3 w-64" />
      </div>
      <div className="space-y-4">
        {Array.from({ length: fields }).map((_, i) => (
          <div key={i} className="space-y-1.5">
            <Skeleton className="h-3.5 w-28" />
            <Skeleton className="h-10 w-full rounded-lg" />
          </div>
        ))}
      </div>
      <Skeleton className="h-11 w-full rounded-xl" />
    </div>
  );
}

/**
 * Skeleton for Leaflet / GIS Maps
 */
export function MapSkeleton({ height = '450px' }: { height?: string }) {
  return (
    <div
      style={{ height }}
      className="w-full rounded-2xl border border-slate-200 bg-slate-100 overflow-hidden relative shadow-sm flex flex-col justify-between p-6"
    >
      {/* Background Grid Pattern */}
      <div className="absolute inset-0 opacity-25 bg-[radial-gradient(#94a3b8_1px,transparent_1px)] [background-size:16px_16px]" />

      {/* Pulsing Radar Circle */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center">
        <div className="w-32 h-32 rounded-full border border-emerald-400/40 animate-ping absolute" />
        <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center">
          <div className="w-3 h-3 rounded-full bg-emerald-600 animate-pulse" />
        </div>
      </div>

      {/* Top Map Controls */}
      <div className="relative z-10 flex justify-between items-start">
        <div className="space-y-1 bg-white/90 backdrop-blur-md p-3 rounded-xl border border-slate-200 shadow-sm">
          <Skeleton className="h-4 w-36" />
          <Skeleton className="h-3 w-48" />
        </div>
        <div className="flex flex-col gap-1.5 bg-white/90 backdrop-blur-md p-1.5 rounded-xl border border-slate-200 shadow-sm">
          <Skeleton className="w-7 h-7 rounded-lg" />
          <Skeleton className="w-7 h-7 rounded-lg" />
        </div>
      </div>

      {/* Bottom Map Legend */}
      <div className="relative z-10 bg-white/90 backdrop-blur-md p-3 rounded-xl border border-slate-200 shadow-sm max-w-sm">
        <Skeleton className="h-3.5 w-32 mb-2" />
        <div className="flex gap-2">
          <Skeleton className="h-3 w-16" />
          <Skeleton className="h-3 w-16" />
          <Skeleton className="h-3 w-16" />
        </div>
      </div>
    </div>
  );
}

/**
 * Skeleton for lists (Approval inbox, notifications, audits)
 */
export function ListSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4"
        >
          <div className="flex items-center gap-3.5 flex-1">
            <Skeleton className="w-11 h-11 rounded-xl flex-shrink-0" />
            <div className="space-y-2 flex-1">
              <div className="flex items-center gap-2">
                <Skeleton className="h-4 w-36" />
                <Skeleton className="h-4 w-16 rounded-full" />
              </div>
              <Skeleton className="h-3 w-48" />
            </div>
          </div>
          <div className="flex items-center gap-2 self-end sm:self-center">
            <Skeleton className="h-9 w-24 rounded-lg" />
            <Skeleton className="h-9 w-20 rounded-lg" />
          </div>
        </div>
      ))}
    </div>
  );
}
