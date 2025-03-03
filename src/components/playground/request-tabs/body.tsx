import React, { useEffect, useState } from "react";
import Editor from "@monaco-editor/react";
import { TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { useApiTestingStore } from "@/store/apitest.store";
import { FileJson, Copy, RotateCcw, Check, AlertCircle, Code2 } from "lucide-react";
import { cn } from "@/lib/utils";

const Body = () => {
  const { body, setBody } = useApiTestingStore();
  const [error, setError] = useState("");
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const htmlElement = document.documentElement;
    const observer = new MutationObserver(() => {
      setIsDarkMode(htmlElement.classList.contains("dark"));
    });

    observer.observe(htmlElement, { attributes: true });
    setIsDarkMode(htmlElement.classList.contains("dark"));

    return () => observer.disconnect();
  }, []);

  const handleEditorDidMount = () => {
    setIsLoading(false);
  };

  const formatJson = () => {
    if (!body.trim()) {
      setBody("");
      return;
    }

    try {
      const formatted = JSON.stringify(JSON.parse(body), null, 2);
      setBody(formatted);
      setError("");
    } catch (e) {
      setError("Invalid JSON format");
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(body);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const clearEditor = () => {
    setBody("");
    setError("");
  };

  return (
    <TabsContent value="body" className="m-0 focus:outline-none">
      <div className="space-y-4">
        {/* Editor Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Code2 className="h-4 w-4 text-blue-500" />
            <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100">
              JSON Body
            </h3>
          </div>
          {error && (
            <div className="flex items-center gap-2 text-red-500">
              <AlertCircle className="h-4 w-4" />
              <span className="text-xs font-medium">{error}</span>
            </div>
          )}
        </div>

        {/* Editor Container */}
        <div className={cn(
          "relative rounded-lg overflow-hidden",
          "border border-gray-200 dark:border-gray-700",
          "transition-all duration-200",
          error && "border-red-300 dark:border-red-700"
        )}>
          {/* Action Buttons */}
          <div className={cn(
            "absolute top-2 right-2 z-10",
            "flex items-center gap-1",
            "p-1 rounded-md",
            "bg-white/80 dark:bg-gray-800/80",
            "backdrop-blur-sm"
          )}>
            <Button
              variant="ghost"
              size="sm"
              onClick={clearEditor}
              className={cn(
                "h-8 w-8 p-2",
                "text-gray-500 hover:text-gray-700",
                "dark:text-gray-400 dark:hover:text-gray-200",
                "hover:bg-gray-100 dark:hover:bg-gray-700",
                "transition-colors duration-200"
              )}
              title="Clear editor"
            >
              <RotateCcw className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={copyToClipboard}
              className={cn(
                "h-8 w-8 p-2",
                "text-gray-500 hover:text-gray-700",
                "dark:text-gray-400 dark:hover:text-gray-200",
                "hover:bg-gray-100 dark:hover:bg-gray-700",
                "transition-colors duration-200"
              )}
              title="Copy to clipboard"
            >
              {copied ? (
                <Check className="h-4 w-4 text-green-500" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={formatJson}
              className={cn(
                "h-8 w-8 p-2",
                "text-gray-500 hover:text-gray-700",
                "dark:text-gray-400 dark:hover:text-gray-200",
                "hover:bg-gray-100 dark:hover:bg-gray-700",
                "transition-colors duration-200"
              )}
              title="Format JSON"
            >
              <FileJson className="h-4 w-4" />
            </Button>
          </div>

          {/* Loading State */}
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-white dark:bg-gray-900">
              <div className="animate-pulse text-gray-400 dark:text-gray-600">
                Loading editor...
              </div>
            </div>
          )}

          {/* Monaco Editor */}
          <Editor
            height="400px"
            defaultLanguage="json"
            theme={isDarkMode ? "vs-dark" : "light"}
            value={body}
            onChange={(value) => {
              setBody(value || "");
              setError("");
            }}
            onMount={handleEditorDidMount}
            options={{
              minimap: { enabled: false },
              lineNumbers: "on",
              scrollBeyondLastLine: false,
              automaticLayout: true,
              tabSize: 2,
              insertSpaces: true,
              formatOnPaste: true,
              formatOnType: true,
              folding: true,
              foldingStrategy: "indentation",
              suggest: {
                showWords: false,
                showSnippets: true,
              },
              glyphMargin: false,
              wordWrap: "on",
              padding: { top: 48 },
              smoothScrolling: true,
              cursorBlinking: "smooth",
              cursorSmoothCaretAnimation: true,
              bracketPairColorization: {
                enabled: true,
              },
            }}
          />
        </div>

        {/* Character Count */}
        <div className="text-xs text-gray-500 dark:text-gray-400">
          {body.length} characters
        </div>
      </div>
    </TabsContent>
  );
};

export default Body;