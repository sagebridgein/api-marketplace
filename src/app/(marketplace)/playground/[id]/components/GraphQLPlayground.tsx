import React, { useEffect } from "react";
import { GraphiQL } from "graphiql";
import { ErrorBoundary } from "react-error-boundary";
import { ErrorFallback } from "./Fallback";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { usePlaygroundStore } from "@/store/playground.store";
import { cn } from "@/lib/utils";
import { useUser } from "@/hooks/useUser";
import { Key } from "lucide-react";
import { useApiTestingStore } from "@/store/apitest.store";

interface GraphQLPlaygroundProps {
  graphQLFetcher: any;
  theme: string;
  sandboxkey: string;
  defaultQuery?: string;
  defaultVariables?: string;
}

const DEFAULT_QUERY = `# Welcome to GraphiQL
#
# IMPORTANT: This API requires authentication!
# This is a valid introspection query:
query IntrospectionQuery {
  __schema {
    types {
      name
      fields {
        name
        type {
          name
        }
      }
    }
  }
}`;

export const GraphQLPlayground: React.FC<GraphQLPlaygroundProps> = ({
  graphQLFetcher,
  theme,
  sandboxkey,
  defaultQuery = DEFAULT_QUERY,
}) => {
  const router = useRouter();
  const { api, isSubscribed, getIsSubscribed } = usePlaygroundStore();
  const { id } = useUser();
  useEffect(() => {
    if (id && api) {
      getIsSubscribed(id, api.id);
    }
  }, [id, api, getIsSubscribed]);

  const handleSubscribe = () => {
    if (!id) {
      window.location.reload();
    } else if (api?.id) {
      router.push(`/pricing/${api.name}/${api.id}`);
    }
  };

  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <div className="h-[90vh] relative">
        {!isSubscribed && (
          <div className="absolute top-4 right-4 z-10">
            <Button
              onClick={handleSubscribe}
              className={cn(
                "flex items-center gap-2",
                "bg-blue-500 hover:bg-blue-600 text-white",
                "dark:bg-blue-600 dark:hover:bg-blue-700"
              )}
            >
              {id ? (
                <>
                  <Key className="w-4 h-4" />
                  Subscribe
                </>
              ) : (
                "Login to Subscribe"
              )}
            </Button>
          </div>
        )}
        <GraphiQL
          fetcher={graphQLFetcher}
          defaultQuery={defaultQuery}
          forcedTheme={theme as "light" | "dark"}
          defaultTheme={theme as "light" | "dark"}
        />
      </div>
    </ErrorBoundary>
  );
};
