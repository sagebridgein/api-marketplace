"use client";
import React, { useEffect, useState } from "react";
import { Check, Zap, X, Loader2, AlertCircle, ChevronRight, Home } from "lucide-react";
import { usePlaygroundStore } from "@/store/playground.store";
import { useParams, useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import PricingSkeleton from "@/components/skelton/pricing";
import { Tier } from "@/types/Api";
import { SubscriptionService } from "@/services/subscription";
import { useUser } from "@/hooks/useUser";
import { toast } from "@/hooks/use-toast";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js";
import CheckoutForm from "./components/checkoutform";
import Link from "next/link";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);
const APIPricing = () => {
  const { api, getApi, isLoading } = usePlaygroundStore();
  const { id } = useParams<{ id: string }>();
  const [tiers, setTiers] = useState<Tier[]>([]);
  const [loadingTiers, setLoadingTiers] = useState<{ [key: string]: boolean }>(
    {}
  );
  const [selectedPlan, setSelectedPlan] = useState<Tier | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { id: user_id } = useUser();
  const subscription = new SubscriptionService(user_id as string, id);
  const stripe = useStripe();
  const elements = useElements();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!stripe || !elements) {
      return;
    }
    const card = elements.getElement(CardElement);
    const result = await stripe.createToken(card);
  };
  const router = useRouter();
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
  }, [id]);

  useEffect(() => {
    if (api) {
      setTiers(
        api.tiers?.sort((a, b) => {
          // Sort Free tier first, then by price
          if (a.tierName === "Free") return -1;
          if (b.tierName === "Free") return 1;
          return (
            parseFloat(a.monetizationAttributes.fixedPrice) -
            parseFloat(b.monetizationAttributes.fixedPrice)
          );
        }) || []
      );
    }
  }, [api]);

  const handleSubscribe = async (tierName: string) => {
    try {
      setLoadingTiers((prev) => ({ ...prev, [tierName]: true }));
      await subscription.subscribe(tierName);
      toast({
        title: "Success",
        description: `Successfully subscribed to ${tierName} tier`,
      });
      router.push("/dashboard");
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Subscription Failed",
        description:
          error instanceof Error
            ? error.message
            : "Failed to subscribe to tier",
      });
    } finally {
      setLoadingTiers((prev) => ({ ...prev, [tierName]: false }));
    }
  };

  const formatPrice = (price: string) => {
    const numPrice = parseFloat(price);
    return numPrice.toLocaleString("en-US", {
      style: "currency",
      currency: "USD",
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
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <nav className="flex items-center space-x-1 text-sm text-muted-foreground mb-8">
          <Link 
            href="/marketplace" 
            className="flex items-center hover:text-foreground transition-colors"
          >
            <Home className="h-4 w-4 mr-1" />
            <span>Marketplace</span>
          </Link>
          <ChevronRight className="h-4 w-4" />
          <Link 
            href={`/playground/${id}`}
            className="hover:text-foreground transition-colors"
          >
            Playground
          </Link>
          <ChevronRight className="h-4 w-4" />
          <span className="text-foreground font-medium">
            {api?.name || 'API'} Pricing
          </span>
        </nav>

        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-foreground mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-500">
            {selectedPlan ? 'Complete Your Purchase' : 'Choose Your Plan'}
          </h1>
          {!selectedPlan && (
            <p className="text-lg text-muted-foreground mb-8">
              Select the perfect plan for your API needs
            </p>
          )}

          {/* Main Content */}
          <div className={`${selectedPlan ? 'max-w-4xl mx-auto' : ''}`}>
            {/* {selectedPlan ? (
              <div className="grid lg:grid-cols-2 gap-8 text-left">
                <Card className="p-6">
                  <h2 className="text-2xl font-semibold mb-6">Order Summary</h2>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center pb-4 border-b">
                      <span className="font-medium">Plan</span>
                      <span className="text-lg font-semibold">{selectedPlan.tierName}</span>
                    </div>
                    <div className="flex justify-between items-center pb-4 border-b">
                      <span className="font-medium">Billing Cycle</span>
                      <span>{selectedPlan.monetizationAttributes?.billingCycle}</span>
                    </div>
                    <div className="flex justify-between items-center pb-4 border-b">
                      <span className="font-medium">Price</span>
                      <span className="text-xl font-bold">
                        {formatPrice(selectedPlan.monetizationAttributes?.fixedPrice || '0')}
                      </span>
                    </div>
                    {selectedPlan.monetizationAttributes?.pricePerRequest && (
                      <div className="flex justify-between items-center pb-4 border-b">
                        <span className="font-medium">Price per Request</span>
                        <span>{formatPrice(selectedPlan.monetizationAttributes.pricePerRequest)}</span>
                      </div>
                    )}
                  </div>
                  <button
                    onClick={() => setSelectedPlan(null)}
                    className="mt-6 text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 flex items-center"
                  >
                    <X className="h-4 w-4 mr-1" /> Change Plan
                  </button>
                </Card>

                <Card className="p-6">
                  <h2 className="text-2xl font-semibold mb-6">Payment Details</h2>
                  <Elements stripe={stripePromise}>
                    <CheckoutForm />
                  </Elements>
                </Card>
              </div>
            ) : ( */}
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {tiers.map((tier, index) => {
                  const isPopular =
                    tier.tierName.toLowerCase().includes("pro") || index === 1;
                  const price =
                    tier.monetizationAttributes &&
                    formatPrice(tier.monetizationAttributes.fixedPrice);

                  return (
                    <Card
                      key={tier.tierName}
                      className={`relative overflow-hidden transition-all duration-300 hover:shadow-xl backdrop-blur-sm 
                        ${isPopular 
                          ? "border-blue-500/50 border-2 dark:bg-blue-950/20" 
                          : "border-border dark:bg-gray-900/50"
                        } hover:scale-[1.02]`}
                    >
                      {isPopular && (
                        <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 transform">
                          <span className="inline-flex items-center rounded-full bg-gradient-to-r from-blue-600 to-purple-600 px-4 py-1 text-sm font-medium text-white shadow-lg">
                            Popular
                          </span>
                        </div>
                      )}
                      <CardContent className="p-8">
                        <div className="mb-6">
                          <h3 className="text-2xl font-bold text-foreground mb-2">
                            {tier.tierName}
                          </h3>
                          <p className="text-muted-foreground">
                            {tier.tierPlan}
                          </p>
                        </div>

                        <div className="mb-6">
                          <div className="flex items-baseline">
                            <span className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-500">
                              {price}
                            </span>
                            {tier.monetizationAttributes && (
                              <span className="ml-2 text-muted-foreground">
                                /{tier.monetizationAttributes.billingCycle}
                              </span>
                            )}
                          </div>
                          {tier.monetizationAttributes?.pricePerRequest && (
                            <div className="mt-2 flex items-center text-muted-foreground">
                              <Zap className="mr-1 h-4 w-4 text-yellow-500" />
                              <span className="text-sm">
                                {formatPrice(tier.monetizationAttributes.pricePerRequest)}{" "}
                                per request
                              </span>
                            </div>
                          )}
                        </div>

                        <button
                          onClick={() => handleSubscribe(tier.tierName)}
                          disabled={loadingTiers[tier.tierName]}
                          className={`w-full rounded-lg py-3 px-6 font-medium transition-all duration-300 
                            ${isPopular
                              ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 disabled:opacity-50"
                              : "bg-gray-100 text-gray-900 hover:bg-gray-200 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700 disabled:opacity-50"
                            } flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl`}
                        >
                          {loadingTiers[tier.tierName] ? (
                            <>
                              <Loader2 className="animate-spin h-5 w-5" />
                              <span>Processing...</span>
                            </>
                          ) : (
                            <span>Subscribe</span>
                          )}
                        </button>

                        <div className="mt-8">
                          <p className="text-sm font-medium text-foreground mb-4">
                            Plan Features:
                          </p>
                          <ul className="space-y-3">
                            {tier.monetizationAttributes && (
                              <>
                                <li className="flex items-center text-sm text-muted-foreground">
                                  <Check className="mr-3 h-5 w-5 text-green-500 flex-shrink-0" />
                                  {tier.monetizationAttributes.billingCycle}
                                  {" "}billing cycle
                                </li>
                                <li className="flex items-center text-sm text-muted-foreground">
                                  <Check className="mr-3 h-5 w-5 text-green-500 flex-shrink-0" />
                                  {tier.monetizationAttributes.currencyType}{" "}
                                  payments
                                </li>
                              </>
                            )}
                          </ul>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            {/* )} */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default APIPricing;
