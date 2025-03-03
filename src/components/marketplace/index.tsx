"use client";
import React, { useCallback, useEffect, useState } from "react";
import { Star, TrendingUp, Zap, Clock, ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import APICard from "./Card";
import { CategorySidebar } from "./sidebar";
import SearchInput from "./searchInput";
import { useMarketPlaceStore } from "@/store/marketplace.store";
import ApiCardSkeleton from "../skelton/apiCard";
import { SearchInputSkeleton } from "../skelton/searchInput";
import { ApiList } from "@/types";
import { useSearchParams, useRouter } from "next/navigation";
import debounce from "lodash/debounce";

const ITEMS_PER_PAGE = 9;

const Marketplace = () => {
  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "");
  const router = useRouter();
  const [selectedFilter, setSelectedFilter] = useState("Popular");
  const [showFilters, setShowFilters] = useState(false);
  const [isLoading, setLoading] = useState<boolean>(false);
  const { apis, loading, fetchApis } = useMarketPlaceStore();
  const [currentPage, setCurrentPage] = useState(1);
  const [filteredApis, setFilteredApis] = useState<ApiList[]>([]);

  const totalPages = Math.ceil((filteredApis?.length || 0) / ITEMS_PER_PAGE);
  const pageStartIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const pageEndIndex = pageStartIndex + ITEMS_PER_PAGE;
  const currentApis = filteredApis?.slice(pageStartIndex, pageEndIndex);

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
      setCurrentPage(1);
    }
  }, [apis]);

  const handleSearch = (query: string) => {
    const normalizedQuery = query.trim().toLowerCase();
    updateSearchParams(query);
    setCurrentPage(1);
    
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

  const filterOptions = [
    { id: "Popular", icon: TrendingUp, label: "Most Popular" },
    { id: "New", icon: Zap, label: "New & Notable" },
    { id: "TopRated", icon: Star, label: "Top Rated" },
    { id: "Recent", icon: Clock, label: "Recently Added" },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8 space-y-6"
        >
          <div className="flex flex-col gap-2">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white tracking-tight">
              Discover APIs
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Explore our collection of powerful APIs to enhance your applications
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

        <div className="flex flex-col lg:flex-row gap-8">
          <CategorySidebar count={apis?.count as number} />

          <div className="flex-1 space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm"
            >
              <div className="flex flex-wrap gap-3">
                {filterOptions.map((option) => (
                  <Button
                    key={option.id}
                    variant={selectedFilter === option.id ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedFilter(option.id)}
                    className="flex items-center gap-2 transition-all"
                  >
                    <option.icon className="h-4 w-4" />
                    {option.label}
                  </Button>
                ))}
              </div>
            </motion.div>

            <AnimatePresence mode="wait">
              <motion.div
                key={currentPage}
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                exit="hidden"
                className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
              >
                {loading.apis || isLoading ? (
                  <>
                    {Array.from({ length: ITEMS_PER_PAGE }).map((_, index) => (
                      <ApiCardSkeleton key={index} />
                    ))}
                  </>
                ) : (
                  <>
                    {currentApis?.map((api) => (
                      <motion.div
                        key={api.id}
                        variants={itemVariants}
                        className="h-full"
                      >
                        <APICard api={api} />
                      </motion.div>
                    ))}
                  </>
                )}
              </motion.div>
            </AnimatePresence>

            {filteredApis.length > 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="flex justify-center pt-8"
              >
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious
                        onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                        disabled={currentPage === 1}
                      />
                    </PaginationItem>
                    
                    {Array.from({ length: totalPages }).map((_, index) => {
                      const page = index + 1;
                      if (
                        page === 1 ||
                        page === totalPages ||
                        (page >= currentPage - 1 && page <= currentPage + 1)
                      ) {
                        return (
                          <PaginationItem key={page}>
                            <PaginationLink
                              onClick={() => setCurrentPage(page)}
                              isActive={currentPage === page}
                            >
                              {page}
                            </PaginationLink>
                          </PaginationItem>
                        );
                      } else if (
                        page === currentPage - 2 ||
                        page === currentPage + 2
                      ) {
                        return (
                          <PaginationItem key={page}>
                            <PaginationEllipsis />
                          </PaginationItem>
                        );
                      }
                      return null;
                    })}
                    
                    <PaginationItem>
                      <PaginationNext
                        onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                        disabled={currentPage === totalPages}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Marketplace;