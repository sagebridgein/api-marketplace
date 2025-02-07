"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { signInAction } from "@/app/actions";
import { FormMessage, Message } from "@/components/form-message";
import { SubmitButton } from "@/components/submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { Checkbox } from "@/components/ui/checkbox";
import Google from '@/components/icons/google';
import Github from '@/components/icons/github';
const Login = async({ searchParams }: { searchParams: Promise<Message> }) => {
  const [isLoading, setIsLoading] = React.useState(false);
  const handleSocialLogin = (provider: string) => {
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 1000);
  };
  
  return (
    <div className="min-h-screen flex bg-gradient-to-br from-blue-50 to-indigo-50">
      {/* Left Panel */}
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-600 to-indigo-700 p-12 text-white flex-col justify-between"
      >
        <div>
          <h2 className="text-4xl font-bold mb-6">Welcome to Nlpbay</h2>
          <p className="text-xl mb-8">The Leading NLP API Marketplace</p>
          
          <div className="space-y-6">
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                🚀
              </div>
              <div>
                <h3 className="font-semibold text-lg">Powerful APIs</h3>
                <p className="text-white/80">Access cutting-edge NLP models and APIs</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                💼
              </div>
              <div>
                <h3 className="font-semibold text-lg">Enterprise Ready</h3>
                <p className="text-white/80">Scale your NLP solutions with confidence</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                🛡️
              </div>
              <div>
                <h3 className="font-semibold text-lg">Secure & Reliable</h3>
                <p className="text-white/80">Enterprise-grade security and support</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="text-sm text-white/70">
          Trusted by leading companies worldwide
        </div>
      </motion.div>

      {/* Right Panel - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Sign In to Nlpbay
              </h1>
              <p className="text-sm text-gray-500 mt-2">
                Access your NLP API dashboard
              </p>
            </div>

            {/* Social Login Buttons */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <button
                onClick={() => handleSocialLogin('github')}
                disabled={isLoading}
                className="flex items-center justify-center space-x-2 p-2 border rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Github width={20} height={20} />
                <span>GitHub</span>
              </button>
              <button
                onClick={() => handleSocialLogin('twitter')}
                disabled={isLoading}
                className="flex items-center justify-center space-x-2 p-2 border rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Google width={20} height={20} />
                <span>Google</span>
              </button>
            </div>

            <div className="relative mb-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Or continue with</span>
              </div>
            </div>

            <form className="space-y-6">
              <motion.div
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.1 }}
                className="space-y-6"
              >
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium">
                    Email Address
                  </Label>
                  <Input 
                    name="email"
                    type="email"
                    placeholder="you@example.com"
                    className="h-11 px-4 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password" className="text-sm font-medium">
                      Password
                    </Label>
                    <Link
                      href="/forgot-password"
                      className="text-xs text-blue-600 hover:text-blue-700 hover:underline transition-colors"
                    >
                      Forgot Password?
                    </Link>
                  </div>
                  <Input
                    type="password"
                    name="password"
                    placeholder="Enter your password"
                    className="h-11 px-4 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox id="remember" />
                  <label
                    htmlFor="remember"
                    className="text-sm text-gray-600 cursor-pointer"
                  >
                    Remember me for 30 days
                  </label>
                </div>
              </motion.div>

              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <SubmitButton
                  pendingText="Signing In..."
                  formAction={signInAction}
                  className="w-full h-11 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-medium hover:opacity-90 transition-opacity"
                >
                  Sign in
                </SubmitButton>
              </motion.div>

              <FormMessage message={(await searchParams)} />

              <div className="space-y-4">
                <p className="text-center text-sm text-gray-500">
                  Don't have an account?{" "}
                  <Link
                    href="/sign-up"
                    className="text-blue-600 hover:text-blue-700 font-medium hover:underline transition-colors"
                  >
                    Sign up for free
                  </Link>
                </p>
                <p className="text-center text-xs text-gray-500">
                  By signing in, you agree to our{" "}
                  <Link href="/terms" className="underline">Terms of Service</Link>
                  {" "}and{" "}
                  <Link href="/privacy" className="underline">Privacy Policy</Link>
                </p>
              </div>
            </form>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;