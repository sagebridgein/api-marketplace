import React from "react";
import HeaderAuth from "./header-auth";
import { EnvVarWarning } from "./env-var-warning";
import { hasEnvVars } from "@/utils/supabase/check-env-vars";
import { ThemeSwitcher } from "./theme-switcher";
import { Button } from "./ui/button";
export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg border-b border-gray-200 dark:border-gray-700">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <h1
            className="text-2xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent"
          >
           Nlpbay API Marketplace
          </h1>

          <div className="flex items-center gap-6">
            <div className="hidden md:flex items-center gap-4">
              <Button
                variant="ghost"
                className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
              >
                Documentation
              </Button>
              <Button
                variant="ghost"
                className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
              >
                Pricing
              </Button>
              <div className="flex items-center">
                {!hasEnvVars ? <EnvVarWarning /> : <HeaderAuth />}
                <ThemeSwitcher />
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}

// <nav className="w-full z-[99] bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
//   <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//     <div className="flex justify-between items-center h-16">
//       {/* Logo / Brand */}
//       <div className="flex items-center">
//         <Link
//           href="/"
//           className="text-xl font-bold text-gray-900 dark:text-gray-100 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
//         >
//           Nlpbay
//         </Link>
//       </div>

//       {/* Navigation Links (Optional) */}
//       <div className="hidden md:flex items-center space-x-6">
//         <Link
//           href="/features"
//           className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
//         >
//           Features
//         </Link>
//         <Link
//           href="/pricing"
//           className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
//         >
//           Pricing
//         </Link>
//         <Link
//           href="/docs"
//           className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
//         >
//           Docs
//         </Link>
//       </div>

//       {/* Auth Section */}
//
//     </div>
//   </div>
// </nav>
