import React, { useState, useMemo, useEffect } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { LayoutDashboard, Search, Tag, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { PathEntry, transformPaths } from "@/helpers";
import { usePlaygroundStore } from "@/store/playground.store";
import EndpointSkeleton from "../skelton/endpointitem";
import { useApiTestingStore } from "@/store/apitest.store";
import { Method } from "axios";

const methodColors = {
  GET: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300",
  POST: "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300",
  PUT: "bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300",
  DELETE: "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300",
  PATCH:
    "bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300",
};

const EndpointsSidebar = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const { api, isLoading } = usePlaygroundStore();
  const { endpoint, method, setEndPoint, setMethod } = useApiTestingStore();
  const [paths, setPaths] = useState<PathEntry[]>([]);

  useEffect(() => {
    if (api) {
      setPaths(transformPaths(JSON.parse(api?.apiDefinition || "{}").paths));
    }
  }, [api]);

  const filteredPaths = useMemo(() => {
    if (!searchQuery.trim()) return paths;
    return paths.filter(
      (path) =>
        path.path.toLowerCase().includes(searchQuery.toLowerCase()) ||
        path.method.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [paths, searchQuery]);

  const EndpointItem = ({ api, index }: { api: PathEntry; index: number }) => (
    <div
      key={index}
      onClick={() => {
        setEndPoint(api.path);
        setMethod(api.method as Method);
      }}
      className={cn(
        "group px-4 py-3 cursor-pointer transition-all duration-200",
        "hover:bg-gray-50 dark:hover:bg-gray-800",
        "border-l-2",
        endpoint === api.path && method === api.method
          ? "border-l-blue-500 bg-gray-50 dark:bg-gray-800"
          : "border-l-transparent"
      )}
    >
      <div className="flex items-center gap-3">
        <Badge
          className={cn(
            "px-2 py-0.5 text-xs font-semibold",
            methodColors[api.method as keyof typeof methodColors]
          )}
        >
          {api.method}
        </Badge>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-700 dark:text-gray-200 truncate group-hover:text-blue-600 dark:group-hover:text-blue-400">
            {api.path}
          </p>
        </div>
        <ChevronRight className="w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>
    </div>
  );

  return (
    <div className="flex flex-col h-full bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800">
      <div className="p-4 space-y-4">
        {/* Version Badge */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Tag className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">
              API Version {!isLoading && api?.version}
            </span>
          </div>
        </div>

        {/* Overview Link */}
        <button className="w-full flex items-center gap-2 px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
          <LayoutDashboard className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
            Overview
          </span>
        </button>

        {/* Search Input */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search endpoints..."
            className="pl-9 bg-transparent"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Endpoints List */}
      <ScrollArea className="flex-1 border-t border-gray-200 dark:border-gray-700">
        {isLoading ? (
          <EndpointSkeleton />
        ) : filteredPaths.length > 0 ? (
          filteredPaths.map((path, i) => (
            <EndpointItem key={i} api={path} index={i} />
          ))
        ) : (
          <div className="p-4 text-center text-gray-500 dark:text-gray-400">
            No endpoints found matching your search.
          </div>
        )}
      </ScrollArea>
    </div>
  );
};

export default EndpointsSidebar;
