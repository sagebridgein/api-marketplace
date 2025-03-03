import { cn } from "@/lib/utils";

const EndpointSkeleton = ({ count = 5 }) => {
  return (
    <div className="space-y-1">
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className={cn(
            "group px-4 py-3",
            "border-l-2 border-l-transparent",
            "animate-pulse"
          )}
        >
          <div className="flex items-center gap-3">
            {/* Method Badge Skeleton */}
            <div className="h-5 w-16 rounded bg-gray-200 dark:bg-gray-700" />
            
            {/* Path Text Skeleton */}
            <div className="flex-1 min-w-0">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
            </div>

            {/* Chevron Skeleton */}
            <div className="w-4 h-4 rounded bg-gray-200 dark:bg-gray-700" />
          </div>
        </div>
      ))}
    </div>
  );
};

export default EndpointSkeleton;