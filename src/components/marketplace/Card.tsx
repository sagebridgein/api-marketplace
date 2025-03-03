import React from "react";
import { Star, ArrowRight, ExternalLink } from "lucide-react";
import { motion } from "framer-motion";
import { ApiList } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

const cardVariants = {
  initial: { 
    y: 20, 
    opacity: 0 
  },
  animate: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.4,
      ease: [0.24, 0.25, 0.25, 1]
    }
  },
  hover: {
    y: -4,
    transition: {
      duration: 0.3,
      ease: [0.24, 0.25, 0.25, 1]
    }
  }
};

const contentVariants = {
  hover: {
    transition: {
      staggerChildren: 0.05
    }
  }
};

const highlightVariants = {
  initial: { opacity: 0 },
  hover: { 
    opacity: 1,
    transition: {
      duration: 0.3
    }
  }
};

interface ApiCardProps {
  api: ApiList;
}

const ApiCard = ({ api }: ApiCardProps) => {
  const {
    id,
    name,
    version,
    description,
    avgRating,
    businessInformation,
    monetizationLabel
  } = api;

  const getStatusColor = (label?: string) => {
    const colors = {
      free: "bg-gradient-to-r from-emerald-50 to-emerald-100 dark:from-emerald-900/20 dark:to-emerald-800/20 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800",
      premium: "bg-gradient-to-r from-violet-50 to-violet-100 dark:from-violet-900/20 dark:to-violet-800/20 text-violet-700 dark:text-violet-300 border-violet-200 dark:border-violet-800",
      enterprise: "bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800"
    };
    return colors[label?.toLowerCase() as keyof typeof colors] || 
           "bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800/50 dark:to-gray-700/50 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700";
  };

  return (
    <TooltipProvider>
      <motion.div
        variants={cardVariants}
        initial="initial"
        animate="animate"
        whileHover="hover"
        className="h-full"
      >
        <motion.a
          href={`/playground/${id}`}
          className="block h-full bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden"
        >
          <motion.div
            variants={contentVariants}
            className="relative p-6 h-full flex flex-col"
          >
            {/* Gradient Highlight Effect */}
            <motion.div
              variants={highlightVariants}
              className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-violet-50/50 dark:from-blue-900/10 dark:to-violet-900/10"
            />

            {/* Content Container */}
            <div className="relative space-y-4 flex-1">
              {/* Header */}
              <div className="flex justify-between items-start gap-4">
                <div className="space-y-2 min-w-0 flex-1">
                  <div className="flex items-start gap-2 flex-wrap">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 truncate max-w-[200px]">
                          {name}
                        </h2>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{name}</p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                  
                  {businessInformation?.businessOwner && (
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 rounded-full bg-gradient-to-br from-gray-100 to-gray-50 dark:from-gray-700 dark:to-gray-600 flex items-center justify-center ring-2 ring-white dark:ring-gray-800">
                        <span className="text-xs font-medium text-gray-600 dark:text-gray-300">
                          {businessInformation.businessOwner.charAt(0)}
                        </span>
                      </div>
                      <span className="text-sm text-gray-600 dark:text-gray-400 truncate">
                        {businessInformation.businessOwner}
                      </span>
                    </div>
                  )}
                </div>

                {monetizationLabel && (
                  <Badge 
                    className={`${getStatusColor(monetizationLabel)} px-2.5 py-0.5 border shadow-sm shrink-0`}
                  >
                    {monetizationLabel}
                  </Badge>
                )}
              </div>

              {/* Description */}
              {description && (
                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed line-clamp-2">
                  {description}
                </p>
              )}
            </div>

            {/* Footer */}
            <div className="relative flex justify-between items-center pt-4 mt-2 border-t border-gray-100 dark:border-gray-700">
              {avgRating && (
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-50 dark:bg-amber-900/20">
                  <Star 
                    className="h-3.5 w-3.5 text-amber-500" 
                    fill="currentColor" 
                  />
                  <span className="text-sm font-medium text-amber-700 dark:text-amber-300">
                    {avgRating}
                  </span>
                </div>
              )}

              <motion.div
                className="flex items-center gap-1.5 text-sm font-medium text-blue-600 dark:text-blue-400"
                whileHover={{ x: 2 }}
                transition={{ duration: 0.2 }}
              >
                Try it out
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </motion.div>
            </div>
          </motion.div>
        </motion.a>
      </motion.div>
    </TooltipProvider>
  );
};

export default ApiCard;