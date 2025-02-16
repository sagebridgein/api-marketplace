import React from "react";
import { EnvVarWarning } from "./env-var-warning";
import { hasEnvVars } from "@/utils/supabase/check-env-vars";
import { ThemeSwitcher } from "./theme-switcher";
import { Button } from "./ui/button";
import AuthButton from "./header-auth";
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
                {!hasEnvVars ? <EnvVarWarning /> : <AuthButton />}
                <ThemeSwitcher />
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}