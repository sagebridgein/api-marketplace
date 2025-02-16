"use client";
import React, { useCallback, useEffect, useState } from "react";
import { Star, TrendingUp, Zap, Clock, ChevronDown } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import APICard from "./Card";
import { CategorySidebar } from "./sidebar";
import SearchInput from "./searchInput";
import { useMarketPlaceStore } from "@/store/marketplace.store";
import ApiCardSkeleton from "../skelton/apiCard";
import { SearchInputSkeleton } from "../skelton/searchInput";
import { ApiList } from "@/types";
import { useSearchParams, useRouter } from "next/navigation";
import debounce from "lodash/debounce";

const Marketplace = () => {
  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "");
  const router = useRouter();
  const [selectedFilter, setSelectedFilter] = useState("Popular");
  const [showFilters, setShowFilters] = useState(false);
  const [isLoading, setLoading] = useState<boolean>(false);
  const { apis, loading, fetchApis } = useMarketPlaceStore();

  const [filteredApis, setFilteredApis] = useState<ApiList[]>([]);

  const updateSearchParams = useCallback(
    debounce((query: string) => {
      const params = new URLSearchParams(searchParams.toString());

      if (query) {
        params.set("q", query);
      } else {
        params.delete("q");
      }

      router.push(`?${params.toString()}`);
    }, 300),
    [router, searchParams]
  );

  useEffect(() => {
    fetchApis();
  }, []);

  useEffect(() => {
    if (apis) {
      setFilteredApis(apis.list);
    }
  }, [apis]);

  const handleSearch = (query: string) => {
    const normalizedQuery = query.trim().toLowerCase();
    updateSearchParams(query);
    if (!normalizedQuery) {
      if (apis?.list) {
        setFilteredApis(apis?.list);
      }
      return;
    }
    setLoading(true);
    const results = apis?.list.filter(
      (api) =>
        api.name.toLowerCase().includes(normalizedQuery) ||
        api.id.toLowerCase().includes(normalizedQuery)
    );
    setLoading(false);
    results && setFilteredApis(results);
  };

  useEffect(() => {
    return () => {
      updateSearchParams.cancel();
    };
  }, [updateSearchParams]);

  const filterOptions = [
    { id: "Popular", icon: TrendingUp, label: "Most Popular" },
    { id: "New", icon: Zap, label: "New & Notable" },
    { id: "TopRated", icon: Star, label: "Top Rated" },
    { id: "Recent", icon: Clock, label: "Recently Added" },
  ];
  useEffect(() => {
    if (!searchQuery) {
      if (apis) {
        setFilteredApis(apis.list);
      }
    }
  }, [searchQuery]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 space-y-6"
        >
          <div className="flex flex-col gap-2">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Discover APIs
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Explore our collection of powerful APIs to enhance your
              applications
            </p>
          </div>
          <React.Suspense fallback={<SearchInputSkeleton />}>
            <SearchInput
              searchQuery={searchQuery}
              handleSearch={handleSearch}
              setSearchQuery={setSearchQuery}
              setShowFilters={setShowFilters}
              showFilters={showFilters}
            />
          </React.Suspense>
        </motion.div>

        {/* Main Content */}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <CategorySidebar count={apis?.count as number} />

          {/* Content Area */}
          <div className="flex-1 space-y-8">
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
              <div className="flex flex-wrap gap-3">
                {filterOptions.map((option) => (
                  <Button
                    key={option.id}
                    variant={
                      selectedFilter === option.id ? "default" : "outline"
                    }
                    size="sm"
                    onClick={() => setSelectedFilter(option.id)}
                    className="flex items-center gap-2"
                  >
                    <option.icon className="h-4 w-4" />
                    {option.label}
                  </Button>
                ))}
              </div>
            </div>

            {/* API Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {loading.apis || isLoading ? (
                <>
                  {Array.from({ length: 9 }).map((_, index) => (
                    <ApiCardSkeleton key={index} />
                  ))}
                </>
              ) : (
                <>
                  {filteredApis?.map((api, i) => (
                    <APICard key={api.id} api={api} />
                  ))}
                </>
              )}
            </div>

            <motion.div
              className="flex justify-center py-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <Button
                variant="outline"
                size="lg"
                className="w-full md:w-auto font-medium"
              >
                Load More APIs
                <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Marketplace;
