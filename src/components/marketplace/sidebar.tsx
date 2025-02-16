import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Search,
  ChevronRight,
  DollarSign,
  Tag,
} from "lucide-react";
import { useMarketPlaceStore } from "@/store/marketplace.store";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

// Enhanced Skeleton components
const CategorySkeleton = () => (
  <div className="px-4 py-2 flex items-center space-x-4">
    <Skeleton className="h-4 w-4" />
    <Skeleton className="h-4 flex-1" />
  </div>
);

const TagSkeleton = () => (
  <Skeleton className="h-6 w-20 rounded-full" />
);

export function CategorySidebar({ count }: { count: number }) {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [priceFilters, setPriceFilters] = useState({
    free: false,
    paid: false,
  });
  const [searchQuery, setSearchQuery] = useState("");
  const { tags, fetchTags, categories, fetchCategories, loading } = useMarketPlaceStore();

  const handleCategoryClick = (category: string) => {
    setSelectedCategory(category);
  };

  // Filter categories based on search query
  const filteredCategories = categories?.filter(category =>
    category.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    fetchTags();
    fetchCategories();
  }, []);

  return (
    <aside className="h-screen w-72 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 flex flex-col">
      {/* Sidebar Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-800">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search categories..."
            className="pl-9 h-9"
          />
        </div>
      </div>

      <ScrollArea className="flex-1">
        {/* Categories Section */}
        <div className="py-4">
          <div className="px-4 mb-2 flex items-center justify-between">
            <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Categories
            </h3>
            {!loading.categories && (
              <span className="text-xs text-gray-400">
                {filteredCategories?.length || 0} categories
              </span>
            )}
          </div>
          
          <div className="space-y-0.5">
            {loading.categories ? (
              Array(5).fill(0).map((_, index) => (
                <CategorySkeleton key={`category-skeleton-${index}`} />
              ))
            ) : (
              <>
                <motion.button
                  onClick={() => handleCategoryClick("All")}
                  className={cn(
                    "w-full flex items-center px-4 py-2 text-sm transition-all",
                    selectedCategory === "All"
                      ? "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20"
                      : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                  )}
                  whileHover={{ x: 4 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <span className="flex-1 text-left font-medium">All APIs</span>
                  {selectedCategory === "All" && (
                    <ChevronRight className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                  )}
                </motion.button>
                
                {filteredCategories?.map((category) => {
                  const isSelected = selectedCategory === category.name;
                  return (
                    <motion.button
                      key={category.name}
                      onClick={() => handleCategoryClick(category.name)}
                      className={cn(
                        "w-full flex items-center px-4 py-2 text-sm transition-all",
                        isSelected
                          ? "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20"
                          : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                      )}
                      whileHover={{ x: 4 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <span className="flex-1 text-left font-medium">
                        {category.name}
                      </span>
                      {isSelected && (
                        <ChevronRight className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                      )}
                    </motion.button>
                  );
                })}
              </>
            )}
          </div>
        </div>

        {/* Filters Section */}
        <div className="px-4 py-4 border-t border-gray-200 dark:border-gray-800">
          <h3 className="mb-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
            Filters
          </h3>

          {/* Price Filter */}
          <div className="space-y-2">
            <h4 className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              <DollarSign className="h-4 w-4 mr-2 text-gray-400" />
              Price Range
            </h4>
            {["Free", "Paid"].map((option) => (
              <motion.label
                key={option}
                className="flex items-center space-x-3 cursor-pointer group"
                whileHover={{ x: 2 }}
              >
                <input
                  type="checkbox"
                  checked={priceFilters[option.toLowerCase() as keyof typeof priceFilters]}
                  onChange={() =>
                    setPriceFilters((prev) => ({
                      ...prev,
                      [option.toLowerCase() as keyof typeof priceFilters]: !prev[option.toLowerCase() as keyof typeof priceFilters],
                    }))
                  }
                  className="w-4 h-4 rounded border-gray-300 dark:border-gray-600 text-blue-500 focus:ring-blue-500 dark:focus:ring-offset-gray-900"
                />
                <span className="text-sm text-gray-600 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-gray-200 transition-colors">
                  {option}
                </span>
              </motion.label>
            ))}
          </div>

          {/* Tags Section */}
          <div className="mt-4">
            <div className="flex items-center justify-between mb-2">
              <h4 className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300">
                <Tag className="h-4 w-4 mr-2 text-gray-400" />
                Popular Tags
              </h4>
              {!loading.tags && (
                <span className="text-xs text-gray-400">
                  {tags?.list?.length || 0} tags
                </span>
              )}
            </div>
            <div className="flex flex-wrap gap-2">
              {loading.tags ? (
                Array(8).fill(0).map((_, index) => (
                  <TagSkeleton key={`tag-skeleton-${index}`} />
                ))
              ) : (
                tags?.list?.map((tag, i) => (
                  <motion.span
                    key={i}
                    className="inline-flex items-center px-3 py-1 text-xs font-medium rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {tag.value}
                  </motion.span>
                ))
              )}
            </div>
          </div>
        </div>
      </ScrollArea>
    </aside>
  );
}

export default CategorySidebar;
