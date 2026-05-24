import { cn } from "@/lib/utils/cn";

interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      className={cn("rounded-xl bg-white/5 animate-pulse", className)}
      aria-hidden="true"
    />
  );
}

export function CardSkeleton({ lines = 2 }: { lines?: number }) {
  return (
    <div className="glass rounded-2xl border border-white/8 p-4 flex flex-col gap-3">
      <Skeleton className="h-4 w-2/5" />
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton key={i} className={`h-3 ${i === lines - 1 ? "w-3/5" : "w-full"}`} />
      ))}
    </div>
  );
}

export function ListSkeleton({ rows = 4 }: { rows?: number }) {
  return (
    <div className="flex flex-col gap-2">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="glass rounded-2xl border border-white/8 p-3 flex items-center gap-3">
          <Skeleton className="h-11 w-11 shrink-0" />
          <div className="flex-1 flex flex-col gap-2">
            <Skeleton className="h-3 w-2/5" />
            <Skeleton className="h-2.5 w-3/5" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function PageSkeleton() {
  return (
    <div className="flex flex-col gap-4 animate-fade-in">
      <div className="flex flex-col gap-1.5">
        <Skeleton className="h-6 w-40" />
        <Skeleton className="h-3 w-56" />
      </div>
      <CardSkeleton lines={3} />
      <ListSkeleton rows={3} />
    </div>
  );
}
