import React, { useEffect, useRef, useState } from "react";
import { Search, SlidersHorizontal, X } from "lucide-react";
interface SearchInputProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  showFilters: boolean;
  handleSearch: (query: string) => void;
  setShowFilters: (show: boolean) => void;
}

const SearchInput: React.FC<SearchInputProps> = ({
  searchQuery,
  handleSearch,
  setSearchQuery,
  showFilters,
  setShowFilters,
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  useEffect(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [searchQuery]);

  const handleClear = () => {
    setSearchQuery("");
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      handleSearch(searchQuery);
    }
  };

  return (
    <div className="relative flex flex-col sm:flex-row gap-3 w-full">
      <div className="relative flex-1">
        {/* Search input wrapper with hover effect */}
        <div
          className={`
          relative flex-1 group transition-all duration-200
          ${isFocused ? "scale-[1.01]" : "hover:scale-[1.005]"}
        `}
        >
          {/* Animated search icon */}
          <Search
            className={`
            absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5
            transition-colors duration-200
            ${isFocused ? "text-blue-500" : "text-gray-400"}
          `}
          />

          <input
            type="text"
            value={searchQuery}
            onKeyDown={handleKeyPress}
            onChange={(e) => {
              setSearchQuery(e.target.value);
            }}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder="Search APIs by name, category, or tags..."
            className={`
              w-full pl-12 pr-24 h-12 text-base
              bg-white dark:bg-gray-800 
              border-2 transition-all duration-200
              rounded-xl
              ${
                isFocused
                  ? "border-blue-500 dark:border-blue-400 shadow-lg shadow-blue-500/10"
                  : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
              }
              focus:outline-none
            `}
          />

          {/* Clear button - shows only when there's text */}
          {searchQuery && (
            <button
              onClick={handleClear}
              className={`
                absolute right-16 top-1/2 -translate-y-1/2
                p-1 rounded-full
                text-gray-400 hover:text-gray-600 dark:hover:text-gray-200
                hover:bg-gray-100 dark:hover:bg-gray-700
                transition-all duration-200
              `}
            >
              <X className="h-4 w-4" />
            </button>
          )}

          {/* Enter badge with smooth animation */}
          <div
            className={`
            hidden md:flex absolute right-3 top-1/2 -translate-y-1/2
            bg-gray-100 dark:bg-gray-700
            text-gray-600 dark:text-gray-300
            text-sm px-3 py-1.5 rounded-lg
            border border-gray-200 dark:border-gray-600
            transition-all duration-200
            ${isFocused ? "bg-blue-50 dark:bg-blue-900/30 border-blue-200 dark:border-blue-500/30" : ""}
          `}
          >
            <span className="font-medium">⏎</span> Enter
          </div>

          {/* Mobile search button with animation */}
          <button
            className={`
              md:hidden absolute right-3 top-1/2 -translate-y-1/2
              bg-blue-500 hover:bg-blue-600 active:bg-blue-700
              text-white p-2 rounded-lg
              transition-all duration-200 transform active:scale-95
              shadow-md hover:shadow-lg
            `}
            onClick={() => {
              /* Add search handler */
            }}
          >
            <Search className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Enhanced filters button */}
      <button
        onClick={() => setShowFilters(!showFilters)}
        className={`
          h-12 px-4 md:w-auto w-full
          inline-flex items-center justify-center gap-2
          bg-white dark:bg-gray-800
          text-gray-700 dark:text-gray-200
          hover:bg-gray-50 dark:hover:bg-gray-700
          border-2 border-gray-200 dark:border-gray-700
          rounded-xl
          transition-all duration-200
          transform active:scale-95
          ${showFilters ? "bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600" : ""}
          hover:shadow-md
        `}
      >
        <SlidersHorizontal
          className={`
          h-4 w-4 transition-transform duration-200
          ${showFilters ? "rotate-180" : ""}
        `}
        />
        <span className="font-medium">Filters</span>
        {showFilters && (
          <span className="ml-1 text-xs bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 px-2 py-0.5 rounded-full">
            On
          </span>
        )}
      </button>
    </div>
  );
};

export default SearchInput;
