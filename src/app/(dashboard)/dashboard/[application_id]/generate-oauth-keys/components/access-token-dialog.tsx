"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Copy, CheckCircle2, AlertTriangle } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface AccessTokenDialogProps {
  isOpen: boolean;
  onClose: () => void;
  accessToken?: string;
}

const AccessTokenDialog = ({ isOpen, onClose, accessToken }: AccessTokenDialogProps) => {
  const [isCopied, setIsCopied] = useState(false);

  const copyToClipboard = () => {
    if (accessToken) {
      navigator.clipboard.writeText(accessToken);
      setIsCopied(true);
      toast({
        title: "Copied Successfully",
        description: "Access token has been copied to your clipboard",
        variant: "default",
      });
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
        >
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-green-500" />
              Access Token Generated
            </DialogTitle>
            <DialogDescription>
              This access token will only be shown once. Please copy it now and store it securely.
            </DialogDescription>
          </DialogHeader>

          <div className="mt-6 space-y-4">
            <div className="p-4 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
              <div className="flex items-center gap-2 text-yellow-500">
                <AlertTriangle className="h-4 w-4" />
                <p className="text-sm font-medium">Security Notice</p>
              </div>
              <p className="mt-1 text-sm text-yellow-500/90">
                This token grants access to your API. Keep it confidential and never share it publicly.
              </p>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">
                Access Token
              </label>
              <div className="flex gap-2">
                <Input
                  value={accessToken}
                  readOnly
                  className="font-mono text-xs bg-muted/30 border-muted-foreground/20"
                />
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    onClick={copyToClipboard}
                    variant="outline"
                    size="icon"
                    className={`transition-all duration-300 ${
                      isCopied
                        ? "bg-green-500/10 text-green-500 hover:bg-green-500/20"
                        : "hover:bg-primary hover:text-primary-foreground"
                    }`}
                  >
                    {isCopied ? (
                      <CheckCircle2 className="h-4 w-4" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                </motion.div>
              </div>
            </div>

            <div className="flex justify-end mt-6">
              <Button
                onClick={onClose}
                className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary"
              >
                Done
              </Button>
            </div>
          </div>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
};

export default AccessTokenDialog; 