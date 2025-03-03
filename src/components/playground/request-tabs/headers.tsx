import React, { useState } from "react";
import { TabsContent } from "@/components/ui/tabs";
import { Tag, AlertCircle, Eye, EyeOff } from "lucide-react";
import { useApiTestingStore } from "@/store/apitest.store";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export default function Headers() {
  const { headers } = useApiTestingStore();
  const [expandedValues, setExpandedValues] = useState<Record<string, boolean>>({});

  const headersList = Object.entries(headers);
  const isEmptyHeaders = headersList.length === 0;

  const truncateValue = (value: string, key: string) => {
    const isAuth = key.toLowerCase() === 'authorization';
    const isSensitive = key.toLowerCase().includes('token') || 
                       key.toLowerCase().includes('key') || 
                       key.toLowerCase().includes('secret') ||
                       key.toLowerCase().includes('password') ||
                       isAuth;
    
    // For Authorization header, always show truncated version
    if (isAuth) {
      return (
        <div className="truncate select-none">
          {`${value.slice(0, 15)}...`}
        </div>
      );
    }

    if (value.length <= 50) {
      return <div className="select-none">{value}</div>;
    }

    if (expandedValues[key]) {
      return (
        <div className="flex items-center gap-2 select-none">
          <span className="break-all">{value}</span>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setExpandedValues(prev => ({ ...prev, [key]: false }))}
            className="h-6 px-2 text-gray-500 hover:text-gray-700 shrink-0"
          >
            <EyeOff className="h-3 w-3" />
          </Button>
        </div>
      );
    }

    const displayValue = isSensitive 
      ? `${value.slice(0, 20)}...${value.slice(-4)}`
      : `${value.slice(0, 50)}...`;

    return (
      <TooltipProvider delayDuration={300}>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="flex items-center gap-2 select-none">
              <span className="truncate">{displayValue}</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setExpandedValues(prev => ({ ...prev, [key]: true }))}
                className="h-6 px-2 text-gray-500 hover:text-gray-700 shrink-0"
              >
                <Eye className="h-3 w-3" />
              </Button>
            </div>
          </TooltipTrigger>
          <TooltipContent side="top" className="max-w-sm">
            Click to show full value
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  };

  return (
    <TabsContent value="headers" className="m-0 focus:outline-none">
      <div className="space-y-6">
        {/* Headers Title and Info */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Tag className="h-4 w-4 text-blue-500" />
            <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100">
              Request Headers
            </h3>
            <Badge variant="secondary" className="ml-2">
              {headersList.length} headers
            </Badge>
          </div>
          {isEmptyHeaders && (
            <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
              <AlertCircle className="h-4 w-4" />
              <span className="text-xs">No headers present</span>
            </div>
          )}
        </div>

        {/* Headers List */}
        {!isEmptyHeaders && (
          <div className="rounded-lg border border-gray-200 dark:border-gray-800 overflow-hidden">
            <div className="grid grid-cols-[auto,1fr] divide-y divide-gray-200 dark:divide-gray-800">
              {headersList.map(([key, value]) => (
                <React.Fragment key={key}>
                  <div className="px-4 py-2 bg-gray-50 dark:bg-gray-800/50 font-medium text-sm text-gray-600 dark:text-gray-400 select-none">
                    {key}
                  </div>
                  <div className="px-4 py-2 bg-white dark:bg-gray-800 text-sm font-mono overflow-hidden">
                    {truncateValue(value, key)}
                  </div>
                </React.Fragment>
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {isEmptyHeaders && (
          <div className="text-center py-8 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-dashed border-gray-200 dark:border-gray-700">
            <div className="text-sm text-gray-500 dark:text-gray-400">
              No headers are configured for this request
            </div>
          </div>
        )}
      </div>
    </TabsContent>
  );
}