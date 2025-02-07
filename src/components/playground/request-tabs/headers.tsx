import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { TabsContent } from "@/components/ui/tabs";
import { Plus, Trash, Tag, AlertCircle } from "lucide-react";
import { useApiTestingStore } from "@/store/apitest.store";
import { cn } from "@/lib/utils";

interface KeyValuePair {
  key: string;
  value: string;
}

export default function Headers() {
  const [headers, setHeaders] = useState<KeyValuePair[]>([
    { key: "", value: "" }
  ]);

  const handleAddHeader = () => {
    setHeaders([...headers, { key: "", value: "" }]);
  };

  const handleRemoveHeader = (index: number) => {
    if (headers.length === 1) {
      setHeaders([{ key: "", value: "" }]);
    } else {
      setHeaders(headers.filter((_, i) => i !== index));
    }
  };

  const handleHeaderChange = (index: number, field: 'key' | 'value', value: string) => {
    const newHeaders = [...headers];
    newHeaders[index][field] = value;
    setHeaders(newHeaders);
  };

  const isEmptyHeaders = headers.length === 1 && !headers[0].key && !headers[0].value;

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
          </div>
          {isEmptyHeaders && (
            <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
              <AlertCircle className="h-4 w-4" />
              <span className="text-xs">No headers added</span>
            </div>
          )}
        </div>

        {/* Headers List */}
        <div className="space-y-3">
          {headers.map((header, index) => (
            <div
              key={index}
              className={cn(
                "group flex items-center gap-3",
                "p-2 rounded-lg",
                "bg-gray-50 dark:bg-gray-800/50",
                "border border-transparent",
                "hover:border-gray-200 dark:hover:border-gray-700",
                "transition-all duration-200"
              )}
            >
              <Input
                placeholder="Header name"
                value={header.key}
                onChange={(e) => handleHeaderChange(index, 'key', e.target.value)}
                className={cn(
                  "flex-1",
                  "bg-white dark:bg-gray-800",
                  "border-gray-200 dark:border-gray-700",
                  "focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500",
                  "transition-all duration-200"
                )}
              />
              <Input
                placeholder="Value"
                value={header.value}
                onChange={(e) => handleHeaderChange(index, 'value', e.target.value)}
                className={cn(
                  "flex-1",
                  "bg-white dark:bg-gray-800",
                  "border-gray-200 dark:border-gray-700",
                  "focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500",
                  "transition-all duration-200"
                )}
              />
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleRemoveHeader(index)}
                className={cn(
                  "opacity-0 group-hover:opacity-100",
                  "text-gray-400 hover:text-red-500",
                  "dark:text-gray-500 dark:hover:text-red-400",
                  "transition-all duration-200"
                )}
              >
                <Trash className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>

        {/* Add Header Button */}
        <Button
          variant="outline"
          size="sm"
          onClick={handleAddHeader}
          className={cn(
            "w-full",
            "border-dashed border-gray-200 dark:border-gray-700",
            "text-gray-600 dark:text-gray-400",
            "hover:border-blue-500 hover:text-blue-500",
            "dark:hover:border-blue-400 dark:hover:text-blue-400",
            "transition-all duration-200"
          )}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Header
        </Button>

        {/* Headers Summary */}
        {!isEmptyHeaders && (
          <div className="text-xs text-gray-500 dark:text-gray-400">
            {headers.filter(h => h.key && h.value).length} active headers
          </div>
        )}
      </div>
    </TabsContent>
  );
}