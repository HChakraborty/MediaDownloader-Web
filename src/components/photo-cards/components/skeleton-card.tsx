import { Skeleton } from "@/ui/skeleton";


function SkeletonCard() {

  return (
    <div className="flex flex-col space-y-3 w-full">
      <Skeleton
        className="w-full rounded-xl animate-pulse bg-accent h-[600px] aspect-[3/4]"
      />
    </div>
  );
}

export default SkeletonCard