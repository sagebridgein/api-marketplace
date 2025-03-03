"use client";

import React, { useEffect, useState } from "react";
import { usePlaygroundStore } from "@/store/playground.store";
import { useParams } from "next/navigation";
import { useApiTestingStore } from "@/store/apitest.store";
import { useTheme } from "next-themes";
import { Loader2 } from "lucide-react";
import "graphiql/graphiql.css";
import { RESTPlayground } from "./components/RestAPIPlayground";
import { GraphQLPlayground } from "./components/GraphQLPlayground";
import { useToast } from "@/hooks/use-toast";
import { createGraphiQLFetcher } from "@graphiql/toolkit";
import { getIntrospectionQuery } from "graphql";
import { TooltipProvider } from "@radix-ui/react-tooltip";
import { ApiService } from "@/services/ApiTestService";
import { useUser } from "@/hooks/useUser";

interface PlaygroundProps {
  className?: string;
}

const LoadingSpinner = () => (
  <div className="flex items-center justify-center h-screen">
    <Loader2 className="h-8 w-8 animate-spin" />
  </div>
);

const Playground: React.FC<PlaygroundProps> = () => {
  const [isLoading, setIsLoading] = useState(true);
  const { id } = useParams<{ id: string }>();
  const { getApi, api } = usePlaygroundStore();
  const { setUrl } = useApiTestingStore();
  const { theme } = useTheme();
  const { toast } = useToast();
  const { id: userId } = useUser();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const { setSandboxKey, sandboxkey } = useApiTestingStore();
  useEffect(() => {
    const generateSandboxToken = async () => {
      if (userId) {
        const accessToken = await ApiService.generateTestKeys(userId as string);
        setSandboxKey(accessToken);
      }
    };
    generateSandboxToken()
  }, [userId]);
  const fetcher = createGraphiQLFetcher({
    url: "/api/graphql",
    fetch: async () => {
      const response = await fetch("/api/graphql", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          HTTPS_ENDPOINT: api?.endpointURLs[0].URLs.https || "",
          Authorization: `Bearer ${sandboxkey}`,
        },
        body: JSON.stringify({
          query: getIntrospectionQuery(), // ✅ Auto-generates the correct query
        }),
      });
      return response
    },
  });
  useEffect(() => {
    const initializeApi = async () => {
      if (id) {
        try {
          setIsLoading(true);
          await getApi(id);
        } catch (error) {
          console.error("Failed to initialize API:", error);
          toast({
            title: "Error",
            description: "Failed to initialize API",
            variant: "destructive",
          });
        } finally {
          setIsLoading(false);
        }
      }
    };

    initializeApi();
  }, [id, getApi, toast]);

  useEffect(() => {
    if (api?.context) {
      setUrl(api.context);
    }
  }, [api, setUrl]);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (api?.type === "GRAPHQL") {
    return (
      <GraphQLPlayground
        graphQLFetcher={fetcher}
        sandboxkey={sandboxkey}
        theme={theme as "light" | "dark"}
      />
    );
  }

  if (api?.type === "HTTP") {
    return (
      <TooltipProvider>
        <RESTPlayground
          isSidebarOpen={isSidebarOpen}
          setIsSidebarOpen={setIsSidebarOpen}
        />
      </TooltipProvider>
    );
  }

  return null;
};

export default Playground;
