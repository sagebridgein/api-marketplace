"use client";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Loader2, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { ApiResponse } from "@/types";
import EndpointsSidebar from "@/components/playground/endpoints-sidebar";
import ResponseArea from "@/components/playground/response-area";
import RequestArea from "@/components/playground/request-tabs";
import { usePlaygroundStore } from "@/store/playground.store";
import { useParams } from "next/navigation";
import { transformPaths } from "@/helpers";

const Playground = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const { id } = useParams<{ id: string }>();
  const [response, setResponse] = useState<ApiResponse | null>(null);
  const { api, getApi, isLoading } = usePlaygroundStore();

  const [responseTime, setResponseTime] = useState<number | null>(null);
  useEffect(() => {
    getApi(id);
  }, [id]);
  // if (!api) {
  //   return <LoadingPlayground />;
  // }
  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      <Sheet>
        <SheetTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden text-gray-600 dark:text-gray-400"
          >
            <Menu className="h-6 w-6" />
          </Button>
        </SheetTrigger>
        <SheetContent
          side="left"
          className="w-80 p-0 bg-white dark:bg-gray-800"
        >
          <EndpointsSidebar

          // setEndpoint={setEndpoint}
          // setSelectedMethod={setSelectedMethod}
          />
        </SheetContent>
      </Sheet>

      {/* Desktop Sidebar */}
      <motion.div
        initial={{ width: 320 }}
        animate={{ width: isSidebarOpen ? 320 : 0 }}
        className="hidden lg:block border-r dark:border-gray-700 bg-white dark:bg-gray-800"
      >
        {isSidebarOpen && (
          <EndpointsSidebar

          // setEndpoint={setEndpoint}
          // setSelectedMethod={setSelectedMethod}
          />
        )}
      </motion.div>

      <div className="flex-1 flex flex-col lg:flex-row">
        <RequestArea />

        <ResponseArea responseTime={responseTime} response={response} />
      </div>
    </div>
  );
};

export default Playground;
