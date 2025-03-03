import React from "react";
import { motion } from "framer-motion";

const shimmerAnimation = {
  hidden: {
    backgroundPosition: "-200% 0",
  },
  animate: {
    backgroundPosition: "200% 0",
    transition: {
      repeat: Infinity,
      duration: 1.5,
      ease: "linear",
    },
  },
};

const ApiCardSkeleton = () => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden shadow-sm">
      <div className="p-6">
        {/* Header Skeleton */}
        <div className="flex justify-between items-start mb-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              {/* Title Skeleton */}
              <motion.div
                variants={shimmerAnimation}
                initial="hidden"
                animate="animate"
                className="h-7 w-48 rounded-md bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700 bg-[length:200%_100%]"
              />
              {/* Version Badge Skeleton */}
              <motion.div
                variants={shimmerAnimation}
                initial="hidden"
                animate="animate"
                className="h-5 w-14 rounded-full bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700 bg-[length:200%_100%]"
              />
            </div>
          </div>

          {/* Monetization Label Skeleton */}
          <motion.div
            variants={shimmerAnimation}
            initial="hidden"
            animate="animate"
            className="h-5 w-16 rounded-full bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700 bg-[length:200%_100%]"
          />
        </div>

        {/* Description Skeleton */}
        <div className="space-y-2 mb-6">
          <motion.div
            variants={shimmerAnimation}
            initial="hidden"
            animate="animate"
            className="h-4 w-full rounded bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700 bg-[length:200%_100%]"
          />
          <motion.div
            variants={shimmerAnimation}
            initial="hidden"
            animate="animate"
            className="h-4 w-3/4 rounded bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700 bg-[length:200%_100%]"
          />
        </div>

        {/* Footer Skeleton */}
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            {/* Business Owner Skeleton */}
            <div className="flex items-center gap-2">
              <motion.div
                variants={shimmerAnimation}
                initial="hidden"
                animate="animate"
                className="w-6 h-6 rounded-full bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700 bg-[length:200%_100%]"
              />
              <motion.div
                variants={shimmerAnimation}
                initial="hidden"
                animate="animate"
                className="h-4 w-24 rounded bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700 bg-[length:200%_100%]"
              />
            </div>

            {/* Rating Skeleton */}
            <div className="flex items-center gap-1">
              <motion.div
                variants={shimmerAnimation}
                initial="hidden"
                animate="animate"
                className="h-4 w-12 rounded bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700 bg-[length:200%_100%]"
              />
            </div>
          </div>

          {/* Try it out button Skeleton */}
          <motion.div
            variants={shimmerAnimation}
            initial="hidden"
            animate="animate"
            className="h-4 w-20 rounded bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700 bg-[length:200%_100%]"
          />
        </div>
      </div>
    </div>
  );
};

// For rendering multiple skeletons
export const ApiCardSkeletonGrid = ({ count = 6 }) => {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }).map((_, index) => (
        <ApiCardSkeleton key={index} />
      ))}
    </div>
  );
};

export default ApiCardSkeleton;