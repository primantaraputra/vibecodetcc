import { Skeleton, SkeletonCard } from '@/components/ui';

export default function StatusBansosLoading() {
  return (
    <div className="space-y-6">
      {/* Top Welcome Bar Skeleton */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-2">
          <Skeleton className="h-5 w-48 rounded-md" />
          <Skeleton className="h-4 w-72 rounded-md" />
        </div>
        <Skeleton className="h-9 w-64 rounded-xl" />
      </div>

      {/* Hero Banner Skeleton */}
      <div className="rounded-2xl bg-gradient-to-br from-slate-200 to-slate-300 p-6 space-y-4 animate-pulse h-64" />

      {/* 4-Tier Stepper Skeleton */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
        <div className="space-y-2 pb-2">
          <Skeleton className="h-5 w-64 rounded-md" />
          <Skeleton className="h-4 w-96 rounded-md" />
        </div>
        <div className="space-y-3">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="p-4 rounded-xl border border-slate-100 bg-slate-50 space-y-2">
              <div className="flex justify-between items-center">
                <Skeleton className="h-4 w-40 rounded-md" />
                <Skeleton className="h-4 w-24 rounded-md" />
              </div>
              <Skeleton className="h-4 w-3/4 rounded-md" />
              <Skeleton className="h-3 w-1/2 rounded-md" />
            </div>
          ))}
        </div>
      </div>

      {/* Details Grid Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <SkeletonCard />
        <div className="md:col-span-2">
          <SkeletonCard />
        </div>
      </div>
    </div>
  );
}
