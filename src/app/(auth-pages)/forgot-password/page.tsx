"use client";

import React from "react";
import { motion } from "framer-motion";
import { forgotPasswordAction } from "@/app/actions";
import { FormMessage, Message } from "@/components/form-message";
import { SubmitButton } from "@/components/submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { Mail } from "lucide-react";

const ForgotPassword = async ({ params }: { params: Promise<Message> }) => {
  const searchParams = await params;
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
          <h2 className="text-4xl font-bold mb-6">Password Recovery</h2>
          <p className="text-xl mb-8">
            We'll help you get back to your account
          </p>

          <div className="space-y-6">
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                📧
              </div>
              <div>
                <h3 className="font-semibold text-lg">Check Your Email</h3>
                <p className="text-white/80">
                  We'll send you a secure reset link
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                🔒
              </div>
              <div>
                <h3 className="font-semibold text-lg">Create New Password</h3>
                <p className="text-white/80">
                  Choose a strong password for your account
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                ✨
              </div>
              <div>
                <h3 className="font-semibold text-lg">Quick Recovery</h3>
                <p className="text-white/80">
                  Get back to using Nlpbay APIs in minutes
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="text-sm text-white/70">
          Need help? Contact our support team
        </div>
      </motion.div>

      {/* Right Panel - Password Reset Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="text-center mb-8">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                  <Mail className="w-8 h-8 text-blue-600" />
                </div>
              </div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Reset Your Password
              </h1>
              <p className="text-sm text-gray-500 mt-2">
                Enter your email and we'll send you instructions
              </p>
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
                  <p className="text-xs text-gray-500">
                    We'll send a password reset link to this email
                  </p>
                </div>
              </motion.div>

              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <SubmitButton
                  pendingText="Sending Reset Link..."
                  formAction={forgotPasswordAction}
                  className="w-full h-11 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-medium hover:opacity-90 transition-opacity"
                >
                  Reset Password
                </SubmitButton>
              </motion.div>

              <FormMessage message={searchParams} />

              <div className="space-y-4">
                <p className="text-center text-sm text-gray-500">
                  Remember your password?{" "}
                  <Link
                    href="/sign-in"
                    className="text-blue-600 hover:text-blue-700 font-medium hover:underline transition-colors"
                  >
                    Sign in
                  </Link>
                </p>
                <p className="text-center text-xs text-gray-500">
                  Need help?{" "}
                  <Link
                    href="/contact"
                    className="text-blue-600 hover:underline"
                  >
                    Contact Support
                  </Link>
                </p>
              </div>
            </form>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ForgotPassword;
