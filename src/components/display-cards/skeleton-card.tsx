import { Skeleton } from "../../ui/skeleton";


export function SkeletonCard() {
  const randomHeight = Math.floor(Math.random() * 300) + 300; // 300–600px

  return (
    <div className="flex flex-col space-y-3">
      <Skeleton
        className="w-full rounded-xl animate-pulse bg-accent"
        style={{ height: `${randomHeight}px` }}
      />
    </div>
  );
}
