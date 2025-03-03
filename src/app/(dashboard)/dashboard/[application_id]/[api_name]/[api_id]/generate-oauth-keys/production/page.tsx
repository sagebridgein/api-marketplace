"use client";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Copy,
  RefreshCw,
  AlertCircle,
  KeyRound,
  Terminal,
  ChevronRight,
  Loader2,
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { useBuyerKeysStore } from "@/store/buyer-keys";
import { useParams } from "next/navigation";
import { useUser } from "@/hooks/useUser";
import GenerateKeys from "../components/generate-keys-sheet";
import AccessTokenDialog from "../components/access-token-dialog";
import CurlDialog from "../components/curl-dialog";
import TryOut from "../components/TryOut";

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: 20 },
};

const TokenGenerationPage = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const { application_id,api_name,api_id } = useParams();
  const { id } = useUser();
  const {
    consumerKey,
    consumerSecret,
    fetchOAuthKeys,
    generateAccessToken,
    accessToken,
    setAccessToken,
    generateLoad,
  } = useBuyerKeysStore();
  const [isAccessTokenDialogOpen, setIsAccessTokenDialogOpen] = useState(false);
  const [isCurlDialogOpen, setIsCurlDialogOpen] = useState(false);

  useEffect(() => {
    if (id) {
      fetchOAuthKeys(application_id as string);
    }
  }, [id]);

  const handleGenerateKeys = async () => {
    setIsDrawerOpen(true);
  };

  const copyToClipboard = (text: string, description: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied Successfully",
      description: `${description} has been copied to your clipboard`,
      variant: "default",
    });
  };
  const handleAccessTokenGeneration = async () => {
    const response = await generateAccessToken(
      application_id as string,
      id as string
    );
    if (response) {
      setIsAccessTokenDialogOpen(true);
    }
  };
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30">
      <div className="container mx-auto py-8 px-4 max-w-5xl">
        <motion.div
          initial="initial"
          animate="animate"
          variants={fadeIn}
          className="mb-8"
        >
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink
                  href="/dashboard"
                  className="hover:text-primary transition-colors"
                >
                  Dashboard
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator>
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              </BreadcrumbSeparator>
              <BreadcrumbItem>
                <BreadcrumbPage>{(api_name as string).replace(/%20/g, "")}</BreadcrumbPage>
              </BreadcrumbItem>
              <BreadcrumbSeparator>
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              </BreadcrumbSeparator>
              <BreadcrumbItem>
                <BreadcrumbPage>Production Key</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </motion.div>

        <motion.div
          initial="initial"
          animate="animate"
          variants={fadeIn}
          className="space-y-8"
        >
          {/* Header Section */}
          <div className="rounded-xl bg-gradient-to-r from-primary/10 via-primary/5 to-background p-8 backdrop-blur-sm border border-primary/10">
            <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-6">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                 Production API Authentication
                </h1>
                <p className="text-muted-foreground">
                  Securely manage your API authentication credentials
                </p>
              </div>
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button
                  onClick={handleGenerateKeys}
                  variant="default"
                  className="flex items-center gap-2 w-full md:w-auto relative overflow-hidden group"
                >
                  <RefreshCw className="h-4 w-4 group-hover:rotate-180 transition-transform duration-500" />
                  {consumerKey ? "Regenerate Keys" : "Generate New Keys"}
                </Button>
              </motion.div>
            </div>
          </div>

          {/* Alert Section */}
          {!consumerKey && !consumerSecret && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="rounded-lg bg-blue-500/10 border border-blue-500/20 p-4 flex items-center gap-3"
            >
              <AlertCircle className="h-5 w-5 text-blue-500" />
              <p className="text-blue-500">
                Generate your API keys to get started with authentication
              </p>
            </motion.div>
          )}

          {/* Credentials Section */}
          <motion.div
            variants={fadeIn}
            className="rounded-xl bg-background/50 backdrop-blur-sm border border-muted p-8 space-y-8"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-primary/10">
                <KeyRound className="h-5 w-5 text-primary" />
              </div>
              <h2 className="text-xl font-semibold">API Credentials</h2>
            </div>

            <div className="grid gap-6">
              <div className="space-y-3">
                <label className="text-sm font-medium text-muted-foreground">
                  Consumer Key
                </label>
                <div className="flex gap-2">
                  <Input
                    value={consumerKey}
                    readOnly
                    className="font-mono bg-muted/30 border-muted-foreground/20"
                    placeholder="Your consumer key will appear here"
                  />
                  {consumerKey && (
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() =>
                          copyToClipboard(consumerKey, "Consumer key")
                        }
                        className="hover:bg-primary hover:text-primary-foreground transition-all duration-300"
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </motion.div>
                  )}
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-sm font-medium text-muted-foreground">
                  Consumer Secret
                </label>
                <div className="flex gap-2">
                  <Input
                    value={consumerSecret}
                    readOnly
                    type="password"
                    className="font-mono bg-muted/30 border-muted-foreground/20"
                    placeholder="Your consumer secret will appear here"
                  />
                  {consumerSecret && (
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() =>
                          copyToClipboard(consumerSecret, "Consumer secret")
                        }
                        className="hover:bg-primary hover:text-primary-foreground transition-all duration-300"
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </motion.div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Token Generation Section */}
          <motion.div
            variants={fadeIn}
            className="rounded-xl bg-background/50 backdrop-blur-sm border border-muted p-8 space-y-6"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-primary/10">
                <Terminal className="h-5 w-5 text-primary" />
              </div>
              <h2 className="text-xl font-semibold">Access Token Generation</h2>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <motion.div
                className="flex-1"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button
                  disabled={!consumerKey || !consumerSecret}
                  variant="default"
                  className="w-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary"
                  onClick={handleAccessTokenGeneration}
                >
                  {generateLoad ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    "Generate Access Token"
                  )}
                </Button>
              </motion.div>
              <motion.div
                className="flex-1"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button
                  disabled={!consumerKey || !consumerSecret}
                  variant="outline"
                  className="w-full border-primary/20 hover:bg-primary/10"
                  onClick={() => setIsCurlDialogOpen(true)}
                >
                  Generate via cURL
                </Button>
              </motion.div>
            </div>

            <p className="text-sm text-muted-foreground text-center">
              Generate access tokens to authenticate your API requests
            </p>
            <TryOut apiId={api_id as string}/>

          </motion.div>

        </motion.div>
      </div>

      <GenerateKeys
        isDrawerOpen={isDrawerOpen}
        setIsDrawerOpen={setIsDrawerOpen}
        application_id={application_id as string}
      />


      <AccessTokenDialog
        isOpen={isAccessTokenDialogOpen}
        onClose={() => {
          setIsAccessTokenDialogOpen(false);
          setAccessToken("");
        }}
        accessToken={accessToken}
      />

      <CurlDialog
        isOpen={isCurlDialogOpen}
        onClose={() => setIsCurlDialogOpen(false)}
        consumerKey={consumerKey}
        consumerSecret={consumerSecret}
      />
    </div>
  );
};

export default TokenGenerationPage;
