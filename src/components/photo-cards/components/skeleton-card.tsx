import { Skeleton } from "@/ui/skeleton";
import cn from "@/utils/tailwindMerge";

function SkeletonCard({ height = "h-[600px]" }: { height?: string }) {
  return (
    <div className="flex flex-col space-y-3 w-full">
      <Skeleton
        className={cn("w-full rounded-xl animate-pulse bg-neutral-500 dark:bg-neutral-700", height)}
      />
    </div>
  );
}

export default SkeletonCard;
