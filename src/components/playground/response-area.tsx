import React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Clock, Copy, FileJson, Key, Check, ChevronDown } from "lucide-react";
import { useRouter } from "next/navigation";
import { usePlaygroundStore } from "@/store/playground.store";
import { cn } from "@/lib/utils";

export default function ResponseArea({ responseTime, response }:{responseTime:number,response:any}) {
  const router = useRouter();
  const { api } = usePlaygroundStore();
  const [copied, setCopied] = React.useState(false);
  const [isHeadersExpanded, setIsHeadersExpanded] = React.useState(true);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(JSON.stringify(response?.data, null, 2));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  return (
    <div className="w-full lg:w-1/2 flex flex-col bg-white dark:bg-gray-900 border-l border-gray-200 dark:border-gray-800">
      {/* Header */}
      <div className={cn(
        "p-4 border-b border-gray-200 dark:border-gray-800",
        "bg-gray-50 dark:bg-gray-800/50"
      )}>
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            Response
          </h2>
          
          <div className="flex items-center gap-3">
            {responseTime && (
              <Badge variant="secondary" className={cn(
                "flex items-center gap-2",
                "bg-blue-50 text-blue-700",
                "dark:bg-blue-900/30 dark:text-blue-400"
              )}>
                <Clock className="h-3 w-3" />
                {responseTime}ms
              </Badge>
            )}
            
            <Button
              onClick={() => router.push(`/pricing/${api?.name}/${api?.id}`)}
              className={cn(
                "flex items-center gap-2",
                "bg-blue-500 hover:bg-blue-600 text-white",
                "dark:bg-blue-600 dark:hover:bg-blue-700"
              )}
            >
              <Key className="h-4 w-4" />
              Subscribe to test
            </Button>
          </div>
        </div>
      </div>

      {/* Response Content */}
      <ScrollArea className="flex-1">
        <div className="p-4 space-y-6">
          {response ? (
            <>
              {/* Status and Actions */}
              <div className="flex items-center justify-between">
                <Badge
                  variant={response.status < 300 ? "success" : "destructive"}
                  className={cn(
                    "px-3 py-1",
                    response.status < 300
                      ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
                      : "bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                  )}
                >
                  Status: {response.status}
                </Badge>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={copyToClipboard}
                  className={cn(
                    "text-gray-500 hover:text-gray-700",
                    "dark:text-gray-400 dark:hover:text-gray-200"
                  )}
                >
                  {copied ? (
                    <Check className="h-4 w-4 text-green-500" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </div>

              {/* Response Body */}
              <div className={cn(
                "rounded-lg overflow-hidden",
                "border border-gray-200 dark:border-gray-800",
                "bg-gray-50 dark:bg-gray-800"
              )}>
                <pre className={cn(
                  "p-4 overflow-x-auto",
                  "font-mono text-sm",
                  "text-gray-800 dark:text-gray-200"
                )}>
                  {JSON.stringify(response.data, null, 2)}
                </pre>
              </div>

              {/* Response Headers */}
              <div className="space-y-2">
                <button
                  onClick={() => setIsHeadersExpanded(!isHeadersExpanded)}
                  className={cn(
                    "flex items-center gap-2 w-full",
                    "text-sm font-medium",
                    "text-gray-900 dark:text-gray-100"
                  )}
                >
                  <ChevronDown className={cn(
                    "h-4 w-4 transition-transform",
                    isHeadersExpanded && "rotate-180"
                  )} />
                  Response Headers
                </button>
                
                {isHeadersExpanded && (
                  <div className={cn(
                    "rounded-lg",
                    "border border-gray-200 dark:border-gray-800",
                    "divide-y divide-gray-200 dark:divide-gray-800"
                  )}>
                    {Object.entries(response.headers).map(([key, value]) => (
                      <div
                        key={key}
                        className={cn(
                          "flex justify-between items-center",
                          "px-4 py-2 text-sm",
                          "bg-white dark:bg-gray-900"
                        )}
                      >
                        <span className="font-medium text-gray-700 dark:text-gray-300">
                          {key}
                        </span>
                        <span className="text-gray-600 dark:text-gray-400">
                          {value}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className={cn(
              "flex flex-col items-center justify-center",
              "h-64 text-center",
              "text-gray-400 dark:text-gray-600"
            )}>
              <FileJson className="h-12 w-12 mb-4" />
              <p className="text-sm">Send a request to see the response</p>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}