import { motion } from "framer-motion";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import EndpointsSidebar from "@/components/playground/endpoints-sidebar";
import ResponseArea from "@/components/playground/response-area";
import RequestArea from "@/components/playground/request-tabs";
import { ErrorBoundary } from "react-error-boundary";
import { ErrorFallback } from "./Fallback";
export const RESTPlayground: React.FC<{ isSidebarOpen: boolean; setIsSidebarOpen: (open: boolean) => void }> = ({
    isSidebarOpen,
    setIsSidebarOpen,
  }) => (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <div className="flex h-screen bg-white dark:bg-gray-900">
        {/* Mobile Sidebar */}
        <Sheet>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden fixed top-4 left-4 z-50 text-gray-600 dark:text-gray-400 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-sm"
            >
              <Menu className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent
            side="left"
            className="w-[280px] sm:w-[320px] p-0 bg-white dark:bg-gray-800"
          >
            <EndpointsSidebar />
          </SheetContent>
        </Sheet>
  
        {/* Desktop Sidebar */}
        <motion.div
          initial={{ width: 320 }}
          animate={{ width: isSidebarOpen ? 320 : 0 }}
          transition={{ duration: 0.2 }}
          className="hidden lg:block border-r dark:border-gray-700 bg-white dark:bg-gray-800"
        >
          {isSidebarOpen && <EndpointsSidebar />}
        </motion.div>
  
        {/* Main Content */}
        <div className="flex-1 flex flex-col lg:flex-row min-w-0">
          <div className="flex-1 min-w-0 border-b lg:border-b-0 lg:border-r dark:border-gray-700">
            <RequestArea />
          </div>
          <div className="flex-1 min-w-0">
            <ResponseArea />
          </div>
        </div>
  
        {/* Sidebar Toggle Button */}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="hidden lg:flex fixed left-2 bottom-4 z-50 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-md hover:bg-gray-100 dark:hover:bg-gray-700"
          aria-label={isSidebarOpen ? "Close sidebar" : "Open sidebar"}
        >
          <Menu className="h-4 w-4" />
        </Button>
      </div>
    </ErrorBoundary>
  );