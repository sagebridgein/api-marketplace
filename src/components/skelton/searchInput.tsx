export const SearchInputSkeleton = () => {
    return (
      <div className="relative flex flex-col sm:flex-row gap-3 w-full animate-pulse">
        {/* Main search input skeleton */}
        <div className="relative flex-1">
          <div className="w-full h-12 bg-gray-200 dark:bg-gray-700 rounded-xl" />
          
          {/* Desktop "Enter" badge skeleton */}
          <div className="hidden md:block absolute right-3 top-1/2 -translate-y-1/2">
            <div className="w-16 h-7 bg-gray-300 dark:bg-gray-600 rounded-lg" />
          </div>
          
          {/* Mobile search button skeleton */}
          <div className="md:hidden absolute right-3 top-1/2 -translate-y-1/2">
            <div className="w-8 h-8 bg-gray-300 dark:bg-gray-600 rounded-lg" />
          </div>
        </div>
  
        {/* Filters button skeleton */}
        <div className="h-12 px-4 md:w-24 w-full bg-gray-200 dark:bg-gray-700 rounded-xl" />
      </div>
    );
  };
  
  