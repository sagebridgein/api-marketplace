"use client";
import React from "react";
import { Card, CardContent } from "@/components/ui/card";

const PricingSkeleton = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Skeleton */}
        <div className="text-center mb-16">
          <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded-lg w-64 mx-auto mb-4"></div>
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded-lg w-96 mx-auto mb-8"></div>
          
          {/* Billing Toggle Skeleton */}
          <div className="flex items-center justify-center gap-4 mb-12">
            <div className="h-5 w-16 bg-gray-200 dark:bg-gray-700 rounded"></div>
            <div className="h-6 w-12 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
            <div className="flex items-center gap-2">
              <div className="h-5 w-16 bg-gray-200 dark:bg-gray-700 rounded"></div>
              <div className="h-5 w-20 bg-green-200 dark:bg-green-900 rounded"></div>
            </div>
          </div>

          {/* Pricing Cards Skeleton */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[1, 2, 3].map((i) => (
              <Card
                key={i}
                className={`relative overflow-hidden animate-pulse ${
                  i === 2 ? "border-blue-500 border-2" : "border-gray-200"
                }`}
              >
                {i === 2 && (
                  <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 transform">
                    <div className="h-6 w-24 bg-gradient-to-r from-blue-400 to-blue-500 rounded-full"></div>
                  </div>
                )}
                
                <CardContent className="p-8">
                  {/* Title and Description */}
                  <div className="mb-6">
                    <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded-lg w-40 mb-3"></div>
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-56"></div>
                  </div>

                  {/* Price */}
                  <div className="mb-6">
                    <div className="flex items-baseline gap-2">
                      <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-32"></div>
                      <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-20"></div>
                    </div>
                    <div className="mt-2 flex items-center gap-2">
                      <div className="h-4 w-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-36"></div>
                    </div>
                  </div>

                  {/* CTA Button */}
                  <div className={`h-12 rounded-lg w-full ${
                    i === 2 
                      ? "bg-blue-400 dark:bg-blue-600" 
                      : "bg-gray-200 dark:bg-gray-700"
                  }`}></div>

                  {/* Features List */}
                  <div className="mt-8">
                    <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-28 mb-4"></div>
                    <ul className="space-y-3">
                      {[1, 2].map((feature) => (
                        <li key={feature} className="flex items-center gap-3">
                          <div className="h-5 w-5 bg-green-200 dark:bg-green-900 rounded-full"></div>
                          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PricingSkeleton;