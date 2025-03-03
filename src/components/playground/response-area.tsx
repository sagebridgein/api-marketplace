import React, { useState, useCallback, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Clock,
  Copy,
  FileJson,
  ChevronDown,
  Check,
  Download,
  Maximize2,
  Minimize2,
  Key,
  AlertCircle,
  FileOutput
} from "lucide-react";
import SyntaxHighlighter from "react-syntax-highlighter";
import {
  atomOneDark,
  atomOneLight,
} from "react-syntax-highlighter/dist/esm/styles/hljs";
import { useTheme } from "next-themes";
import { useApiTestingStore } from "@/store/apitest.store";
import { cn } from "@/lib/utils";
import { usePlaygroundStore } from "@/store/playground.store";
import { useUser } from "@/hooks/useUser";
import { useRouter } from "next/navigation";

const ResponseViewer = () => {
  const [copied, setCopied] = useState(false);
  const [isHeadersExpanded, setIsHeadersExpanded] = useState(true);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const { theme } = useTheme();
  const { id } = useUser();
  const { response, isLoading, error } = useApiTestingStore();
  const { isSubscribed, api, getIsSubscribed } = usePlaygroundStore();
  const router = useRouter();

  useEffect(() => {
    if (id && api) getIsSubscribed(id, api?.id);
  }, [id, api, getIsSubscribed]);

  const copyToClipboard = useCallback(async (content) => {
    try {
      await navigator.clipboard.writeText(content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  }, []);

  const downloadResponse = useCallback(() => {
    try {
      const blob = new Blob([JSON.stringify(response?.data, null, 2)], {
        type: "application/json",
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `response-${new Date().toISOString()}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Failed to download:", err);
    }
  }, [response]);

  const getStatusColor = useCallback((status) => {
    if (!status) return "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300";
    if (status < 300) return "bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400";
    if (status < 400) return "bg-yellow-50 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400";
    return "bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-400";
  }, []);

  const MainHeader = () => (
    <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
      <div className="px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FileOutput className="h-5 w-5 text-gray-500 dark:text-gray-400" />
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            Response
          </h2>
        </div>
        {!isSubscribed && (
          <Button
            onClick={() => router.push(`/pricing/${api?.name}/${api?.id}`)}
            size="sm"
            className="bg-blue-500 hover:bg-blue-600 text-white dark:bg-blue-600 dark:hover:bg-blue-700"
          >
            {id ? (
              <div className="flex items-center gap-2">
                <Key className="h-4 w-4" />
                Subscribe Now
              </div>
            ) : (
              "Login"
            )}
          </Button>
        )}
      </div>
      {!isSubscribed && (
        <div className="px-4 py-2 bg-blue-50 dark:bg-blue-900/20 border-t border-blue-100 dark:border-blue-800 flex items-center gap-2">
          <AlertCircle className="h-4 w-4 text-blue-700 dark:text-blue-400" />
          <span className="text-sm font-medium text-blue-700 dark:text-blue-400">
            {id ? "Subscribe to access full features" : "Login to access full features"}
          </span>
        </div>
      )}
    </div>
  );

  const ResponseContent = () => {
    if (isLoading) {
      return (
        <div className="p-6 flex items-center justify-center">
          <div className="animate-pulse space-y-4 w-full">
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/4" />
            <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded" />
          </div>
        </div>
      );
    }

    if (error) {
      return (
        <Alert variant="destructive" className="m-6">
          <AlertDescription>
            {error.message || "An error occurred while fetching the response"}
          </AlertDescription>
        </Alert>
      );
    }

    if (!response) {
      return (
        <div className="flex flex-col items-center justify-center h-[calc(100vh-200px)] text-gray-500 dark:text-gray-400">
          <FileJson className="h-16 w-16 mb-4 opacity-50" />
          <h3 className="text-lg font-medium mb-2">Waiting for Response</h3>
          <p className="text-sm text-center max-w-sm">
            Send a request to see the response here
          </p>
        </div>
      );
    }

    return (
      <>
        <div className="p-4 border-b border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-3">
              <Badge className={cn("whitespace-nowrap", getStatusColor(response.status))}>
                Status: {response.status}
              </Badge>
              {response.time && (
                <Badge variant="outline" className="flex items-center gap-1 whitespace-nowrap">
                  <Clock className="h-3 w-3" />
                  {response.time}ms
                </Badge>
              )}
            </div>

            <div className="flex items-center gap-2">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyToClipboard(JSON.stringify(response.data, null, 2))}
                    disabled={!isSubscribed}
                  >
                    {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>{copied ? "Copied!" : "Copy Response"}</TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={downloadResponse}
                    disabled={!isSubscribed}
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Download Response</TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsFullScreen(!isFullScreen)}
                  >
                    {isFullScreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  {isFullScreen ? "Exit Fullscreen" : "Fullscreen"}
                </TooltipContent>
              </Tooltip>
            </div>
          </div>
        </div>

        <ScrollArea className={isFullScreen ? "h-[calc(100vh-180px)]" : "h-[600px]"}>
          <div className="p-4 space-y-4">
            <div className="relative rounded-lg overflow-hidden border border-gray-200 dark:border-gray-800">
              {!isSubscribed && (
                <div className="absolute inset-0 bg-gray-50/90 dark:bg-gray-900/90 backdrop-blur-[2px] flex items-center justify-center">
                  <div className="text-center p-4">
                    <Key className="h-8 w-8 mx-auto mb-2 text-blue-500" />
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Subscribe to view full response
                    </p>
                  </div>
                </div>
              )}
              <SyntaxHighlighter
                language="json"
                style={theme === "dark" ? atomOneDark : atomOneLight}
                customStyle={{
                  backgroundColor: "transparent",
                  margin: 0,
                  padding: "1rem",
                  opacity: isSubscribed ? 1 : 0.5,
                }}
                wrapLongLines
              >
                {JSON.stringify(response.data, null, 2)}
              </SyntaxHighlighter>
            </div>

            <div className="space-y-2">
              <button
                onClick={() => setIsHeadersExpanded(!isHeadersExpanded)}
                className="flex items-center gap-2 text-sm font-medium p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md w-full transition-colors"
                disabled={!isSubscribed}
              >
                <ChevronDown
                  className={cn(
                    "h-4 w-4 transition-transform",
                    isHeadersExpanded && "rotate-180"
                  )}
                />
                Headers ({Object.keys(response.headers || {}).length})
              </button>

              {isHeadersExpanded && (
                <div className="border border-gray-200 dark:border-gray-800 rounded-lg divide-y divide-gray-200 dark:divide-gray-800">
                  {Object.entries(response.headers || {}).map(([key, value]) => (
                    <div
                      key={key}
                      className="flex flex-col sm:flex-row sm:items-center justify-between p-3 hover:bg-gray-50 dark:hover:bg-gray-800/50 gap-2"
                    >
                      <span className="font-medium text-sm text-gray-700 dark:text-gray-300">
                        {key}
                      </span>
                      <span className="text-sm text-gray-600 dark:text-gray-400 break-all sm:max-w-[50%] sm:truncate">
                        {value}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </ScrollArea>
      </>
    );
  };

  return (
    <div
      className={cn(
        "bg-white dark:bg-gray-900 transition-all",
        isFullScreen ? "fixed inset-0 z-50" : "relative"
      )}
    >
      <MainHeader />
      <ResponseContent />
    </div>
  );
};

export default ResponseViewer;