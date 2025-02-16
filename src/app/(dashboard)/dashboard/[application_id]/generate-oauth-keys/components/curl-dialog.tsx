"use client";
import React from "react";
import { motion } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Copy, Terminal } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface CurlDialogProps {
  isOpen: boolean;
  onClose: () => void;
  consumerKey: string;
  consumerSecret: string;
}

const CurlDialog = ({ isOpen, onClose, consumerKey, consumerSecret }: CurlDialogProps) => {
  const getBase64Credentials = () => {
    return btoa(`${consumerKey}:${consumerSecret}`);
  };

  const passwordGrantCurl = `curl -k -X POST https://app.sagebridge.in/api/am/devportal/v3/oauth2/token \\
-d "grant_type=password&username=Username&password=Password" \\
-H "Authorization: Basic ${getBase64Credentials()}"`;

  const clientCredentialsCurl = `curl -k -X POST https://app.sagebridge.in/api/am/devportal/v3/oauth2/token \\
-d "grant_type=client_credentials" \\
-H "Authorization: Basic ${getBase64Credentials()}"`;

  const copyToClipboard = (text: string, description: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied Successfully",
      description: `${description} has been copied to your clipboard`,
      variant: "default",
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-3xl w-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Terminal className="h-5 w-5 text-primary" />
            Get CURL to Generate Access Token
          </DialogTitle>
          <DialogDescription>
            Use these cURL commands to generate access tokens programmatically
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 overflow-x-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-3"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium">Password Grant Type</h3>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 px-2 hover:bg-primary/10"
                onClick={() => copyToClipboard(passwordGrantCurl, "Password grant cURL command")}
              >
                <Copy className="h-4 w-4" />
              </Button>
            </div>
            <div className="relative group">
              <pre className="overflow-hidden p-4 rounded-lg bg-muted/50 border border-muted text-sm font-mono">
                {passwordGrantCurl}
              </pre>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="space-y-3"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium">Client Credentials Grant Type</h3>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 px-2 hover:bg-primary/10"
                onClick={() => copyToClipboard(clientCredentialsCurl, "Client credentials cURL command")}
              >
                <Copy className="h-4 w-4" />
              </Button>
            </div>
            <div className="relative group">
              <pre className="overflow-hidden p-4 rounded-lg bg-muted/50 border border-muted text-sm font-mono">
                {clientCredentialsCurl}
              </pre>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-sm text-muted-foreground"
          >
            <p>
              Replace <code className="text-primary">Username</code> and{" "}
              <code className="text-primary">Password</code> with your actual credentials when using
              the password grant type.
            </p>
          </motion.div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CurlDialog; 