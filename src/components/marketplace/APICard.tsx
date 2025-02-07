import React from "react";
import { Star, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { ApiList } from "@/types";

const cardVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.3,
      ease: "easeOut"
    }
  },
  hover: {
    y: -4,
    scale: 1.02,
    transition: {
      duration: 0.2,
      ease: "easeInOut"
    }
  }
};

const ApiCard = ({ api }:{api:ApiList}) => {
  const {
    id,
    name,
    version,
    description,
    avgRating,
    businessInformation,
    monetizationLabel
  } = api;
  
  return (
    <motion.a
      href={`/playground/${id}`}
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover="hover"
      className="group relative bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden shadow-sm"
    >
      <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/10 dark:to-blue-800/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      <div className="relative p-6">
        {/* Header */}
        <div className="flex justify-between items-start mb-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                {name}
              </h2>
              <span className="px-2.5 py-0.5 text-xs font-medium rounded-full bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-100">
                v{version}
              </span>
            </div>
          </div>

          {monetizationLabel && (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-100">
              {monetizationLabel}
            </span>
          )}
        </div>

        {/* Description */}
        {description && (
          <p className="text-gray-600 dark:text-gray-400 text-sm mb-6 line-clamp-2">
            {description}
          </p>
        )}

        {/* Footer */}
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            {businessInformation?.businessOwner && (
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                  <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
                    {businessInformation.businessOwner.charAt(0)}
                  </span>
                </div>
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  by {businessInformation.businessOwner}
                </span>
              </div>
            )}

            {avgRating && (
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 text-yellow-400" />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {avgRating}
                </span>
              </div>
            )}
          </div>

          <motion.div
            whileHover={{ x: 4 }}
            className="flex items-center gap-1 text-sm font-medium text-blue-600 dark:text-blue-400 group-hover:text-blue-700 dark:group-hover:text-blue-300"
          >
            Try it out
            <ArrowRight className="h-4 w-4" />
          </motion.div>
        </div>
      </div>
    </motion.a>
  );
};

export default ApiCard;