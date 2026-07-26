export function Skeleton({ className = "" }) {
  return <div className={`animate-pulse rounded bg-neutral-800 ${className}`} />;
}

/** Placeholder com a mesma altura do CardProduto, para o grid não "pular". */
export function SkeletonCard() {
  return (
    <div className="card-superficie overflow-hidden">
      <Skeleton className="h-44 rounded-none" />
      <div className="flex flex-col gap-2 p-3.5">
        <Skeleton className="h-3 w-16" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
        <Skeleton className="mt-2 h-7 w-28" />
        <Skeleton className="mt-2 h-10 w-full" />
      </div>
    </div>
  );
}
