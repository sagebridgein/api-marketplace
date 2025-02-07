"use client";
import React, { useEffect, useState } from "react";
import { Check, Zap, X, Loader2, AlertCircle } from "lucide-react";
import { usePlaygroundStore } from "@/store/playground.store";
import { useParams, useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import PricingSkeleton from "@/components/skelton/pricing";
import { Tier } from "@/types/Api";
import { SubscriptionService } from "@/services/subscription";
import { useUser } from "@/hooks/useUser";
import { toast } from "@/hooks/use-toast";

const APIPricing = () => {
  const { api, getApi, isLoading } = usePlaygroundStore();
  const { id } = useParams<{ id: string }>();
  const [tiers, setTiers] = useState<Tier[]>([]);
  const [loadingTiers, setLoadingTiers] = useState<{ [key: string]: boolean }>({});
  const [error, setError] = useState<string | null>(null);
  const { id: user_id } = useUser();
  const subscription = new SubscriptionService(user_id as string, id);
  const router=useRouter();
  useEffect(() => {
    const fetchApi = async () => {
      try {
        setError(null);
        await getApi(id);
      } catch (err) {
        setError("Failed to load API details. Please try again later.");
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load API details",
        });
      }
    };
    fetchApi();
  }, [id, getApi]);

  useEffect(() => {
    if (api) {
      setTiers(api.tiers?.sort((a, b) => {
        // Sort Free tier first, then by price
        if (a.tierName === "Free") return -1;
        if (b.tierName === "Free") return 1;
        return parseFloat(a.monetizationAttributes.fixedPrice) - parseFloat(b.monetizationAttributes.fixedPrice);
      }) || []);
    }
  }, [api]);

  const handleSubscribe = async (tierName: string) => {
    try {
      setLoadingTiers(prev => ({ ...prev, [tierName]: true }));
      await subscription.subscribe(tierName);
      toast({
        title: "Success",
        description: `Successfully subscribed to ${tierName} tier`,
      });
      router.push("/dashboard/apis")
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Subscription Failed",
        description: error instanceof Error ? error.message : "Failed to subscribe to tier",
      });
    } finally {
      setLoadingTiers(prev => ({ ...prev, [tierName]: false }));
    }
  };

  const formatPrice = (price: string) => {
    const numPrice = parseFloat(price);
    return numPrice.toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    });
  };

  if (isLoading) {
    return <PricingSkeleton />;
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Alert variant="destructive" className="max-w-md">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Choose Your Plan
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
            Select the perfect plan for your API needs
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {tiers.map((tier, index) => {
              const isPopular = tier.tierName.toLowerCase().includes('pro') || index === 1;
              const price = formatPrice(tier.monetizationAttributes.fixedPrice);
              
              return (
                <Card
                  key={tier.tierName}
                  className={`relative overflow-hidden transition-all duration-300 hover:shadow-xl ${
                    isPopular ? "border-blue-500 border-2" : "border-gray-200"
                  }`}
                >
                  {isPopular && (
                    <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 transform">
                      <span className="inline-flex items-center rounded-full bg-gradient-to-r from-blue-600 to-blue-700 px-4 py-1 text-sm font-medium text-white">
                        Popular
                      </span>
                    </div>
                  )}
                  <CardContent className="p-8">
                    <div className="mb-6">
                      <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                        {tier.tierName}
                      </h3>
                      <p className="text-gray-500 dark:text-gray-400">
                        {tier.tierPlan}
                      </p>
                    </div>

                    <div className="mb-6">
                      <div className="flex items-baseline">
                        <span className="text-4xl font-bold text-gray-900 dark:text-white">
                          {price}
                        </span>
                        <span className="ml-2 text-gray-500 dark:text-gray-400">
                          /{tier.monetizationAttributes.billingCycle}
                        </span>
                      </div>
                      {tier.monetizationAttributes.pricePerRequest && (
                        <div className="mt-2 flex items-center text-gray-500 dark:text-gray-400">
                          <Zap className="mr-1 h-4 w-4" />
                          <span className="text-sm">
                            {formatPrice(tier.monetizationAttributes.pricePerRequest)} per request
                          </span>
                        </div>
                      )}
                    </div>

                    <button
                      onClick={() => handleSubscribe(tier.tierName)}
                      disabled={loadingTiers[tier.tierName]}
                      className={`w-full rounded-lg py-3 px-6 font-medium transition-colors ${
                        isPopular
                          ? "bg-blue-600 text-white hover:bg-blue-700 disabled:bg-blue-400"
                          : "bg-gray-100 text-gray-900 hover:bg-gray-200 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700 disabled:bg-gray-300 dark:disabled:bg-gray-600"
                      } flex items-center justify-center space-x-2`}
                    >
                      {loadingTiers[tier.tierName] ? (
                        <>
                          <Loader2 className="animate-spin h-5 w-5" />
                          <span>Processing...</span>
                        </>
                      ) : (
                        <span>{tier.tierName === "Free" ? "Get Started" : "Subscribe"}</span>
                      )}
                    </button>

                    <div className="mt-8">
                      <p className="text-sm font-medium text-gray-900 dark:text-white mb-4">
                        Plan Features:
                      </p>
                      <ul className="space-y-3">
                        <li className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                          <Check className="mr-3 h-5 w-5 text-green-500 flex-shrink-0" />
                          {tier.monetizationAttributes.billingCycle} billing cycle
                        </li>
                        <li className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                          <Check className="mr-3 h-5 w-5 text-green-500 flex-shrink-0" />
                          {tier.monetizationAttributes.currencyType} payments
                        </li>
                        {/* {tier.monetizationAttributes.quota && (
                          <li className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                            <Check className="mr-3 h-5 w-5 text-green-500 flex-shrink-0" />
                            {tier.monetizationAttributes.quota.toLocaleString()} requests per {tier.monetizationAttributes.billingCycle}
                          </li>
                        )} */}
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default APIPricing;