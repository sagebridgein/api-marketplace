import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Send, Settings2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useApiTestingStore } from "@/store/apitest.store";
import Headers from "./headers";
import Body from "./body";
import { ApiDefinition } from "@/types/apiDefinition";
import { createApiRequest } from "@/services/createApiRequest";
import { usePlaygroundStore } from "@/store/playground.store";
const methodColors = {
  GET: "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100",
  POST: "bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100",
  PUT: "bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100",
  DELETE: "bg-red-50 text-red-700 border-red-200 hover:bg-red-100",
  PATCH: "bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-100",
};

const darkMethodColors = {
  GET: "dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800",
  POST: "dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800",
  PUT: "dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-800",
  DELETE: "dark:bg-red-900/30 dark:text-red-400 dark:border-red-800",
  PATCH: "dark:bg-purple-900/30 dark:text-purple-400 dark:border-purple-800",
};

export default function RequestArea() {
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("headers");
  const { method, setMethod, endpoint, setEndPoint, url, headers } =
    useApiTestingStore();
  const createRequest = new createApiRequest(url, method, headers);
  const { api, isLoading } = usePlaygroundStore();
  const [definition, setDefinition] = useState<ApiDefinition>();

  useEffect(()=>{
    if(api){
      setDefinition(JSON.parse(api.apiDefinition))
    }
  },[api])

  const handleSubmit = async () => {
    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    const result = createRequest.request(endpoint);

    setLoading(false);
  };

  const tabs = [
    { id: "app", icon: Settings2 },
    { id: "headers", icon: Settings2 },
    { id: "params", icon: Settings2 },
    { id: "body", icon: Settings2 },
    { id: "authorizations", icon: Settings2 },
  ];

  return (
    <div className="w-full lg:w-1/2 flex flex-col bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800">
      {/* Request Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-800">
        <div className="flex items-center gap-3">
          <Select value={method} onValueChange={setMethod}>
            <SelectTrigger
              className={cn(
                "w-32 font-medium transition-colors",
                methodColors[method],
                darkMethodColors[method]
              )}
            >
              <SelectValue>{method}</SelectValue>
            </SelectTrigger>
            <SelectContent className="dark:bg-gray-800 border-gray-200 dark:border-gray-700">
              {["GET", "POST", "PUT", "DELETE", "PATCH"].map((m) => (
                <SelectItem
                  key={m}
                  value={m}
                  className={cn(
                    "font-medium cursor-pointer",
                    "hover:bg-gray-100 dark:hover:bg-gray-700",
                    methodColors[m],
                    darkMethodColors[m]
                  )}
                >
                  {m}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="flex-1 relative group">
            <Input
              value={endpoint}
              onChange={(e) => setEndPoint(e.target.value)}
              placeholder="Enter API endpoint"
              className={cn(
                "w-full transition-all duration-200",
                "border-gray-200 dark:border-gray-700",
                "bg-transparent dark:bg-gray-800",
                "focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500",
                "placeholder:text-gray-400 dark:placeholder:text-gray-500"
              )}
            />
            <Button
              onClick={handleSubmit}
              disabled={loading}
              className={cn(
                "absolute right-0 top-0 bottom-0",
                "bg-blue-500 hover:bg-blue-600 text-white",
                "dark:bg-blue-600 dark:hover:bg-blue-700",
                "transition-all duration-200",
                "px-4 rounded-md"
              )}
            >
              <Send className={cn("h-4 w-4", loading && "animate-pulse")} />
            </Button>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="flex-1 flex flex-col"
      >
        <TabsList className="justify-start px-2 py-1 border-b border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50">
          {tabs.map(({ id, icon: Icon }) => (
            <TabsTrigger
              key={id}
              value={id}
              className={cn(
                "px-4 py-2 font-medium capitalize",
                "text-gray-600 dark:text-gray-400",
                "rounded-md transition-all duration-200",
                "data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800",
                "data-[state=active]:text-blue-600 dark:data-[state=active]:text-blue-400",
                "data-[state=active]:shadow-sm"
              )}
            >
              <div className="flex items-center gap-2">
                <Icon className="h-4 w-4" />
                {id}
              </div>
            </TabsTrigger>
          ))}
        </TabsList>

        <ScrollArea className="flex-1 p-4">
          {activeTab === "headers" && <Headers />}
          {activeTab === "body" && <Body />}
        </ScrollArea>
      </Tabs>
    </div>
  );
}
