"use client";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import EndpointsSidebar from "@/components/playground/endpoints-sidebar";
import ResponseArea from "@/components/playground/response-area";
import RequestArea from "@/components/playground/request-tabs";
import { usePlaygroundStore } from "@/store/playground.store";
import { useParams } from "next/navigation";
import { useApiTestingStore } from "@/store/apitest.store";

const Playground = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const { id } = useParams<{ id: string }>();
  const { getApi, api } = usePlaygroundStore();
  const { setUrl } = useApiTestingStore();
  useEffect(() => {
    if (id) {
      getApi(id);
      setUrl(`${api?.context}`);
    }
  }, [id]);

  useEffect(() => {
    setUrl(`${api?.context}`);
  }, [api]);

  return (
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
        className="hidden lg:block border-r dark:border-gray-700 bg-white dark:bg-gray-800"
      >
        {isSidebarOpen && <EndpointsSidebar />}
      </motion.div>

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
      >
        <Menu className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default Playground;
