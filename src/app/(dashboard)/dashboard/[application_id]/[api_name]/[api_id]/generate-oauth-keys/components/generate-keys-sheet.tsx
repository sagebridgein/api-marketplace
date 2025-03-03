import {
  Clock,
  Shield,
  Lock,
  Key,
  ChevronRight,
  AlertCircle,
  RefreshCw,
} from "lucide-react";
import React, { Dispatch, SetStateAction, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from "@/components/ui/sheet";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useBuyerKeysStore } from "@/store/buyer-keys";
import { useUser } from "@/hooks/useUser";

export interface TokenConfig {
  accessTokenExpiry: string;
  refreshTokenExpiry: string;
  Type:"PRODUCTION" | "SANDBOX"
  grantTypes: {
    refreshToken: boolean;
    password: boolean;
    clientCredentials: boolean;
    jwt: boolean;
  };
  tokenFormat: "JWT" | "Reference";
  securityLevel: "Basic" | "Medium" | "High";
}

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
};

export default function GenerateKeys({
  isDrawerOpen,
  setIsDrawerOpen,
  application_id,
}: {
  isDrawerOpen: boolean;
  setIsDrawerOpen: Dispatch<SetStateAction<boolean>>;
  application_id: string;
}) {
  const [isGeneratingKeys, setIsGeneratingKeys] = useState(false);
  const { toast } = useToast();
  const { id } = useUser();
  const { generateOAuthKeys } = useBuyerKeysStore();
  const [tokenConfig, setTokenConfig] = useState<TokenConfig>({
    accessTokenExpiry: "3600",
    refreshTokenExpiry: "86400",
    Type:"PRODUCTION",
    grantTypes: {
      refreshToken: true,
      password: true,
      clientCredentials: false,
      jwt: false,
    },
    tokenFormat: "JWT",
    securityLevel: "Medium",
  });
  const handleConfigSubmit = async () => {
    try {
      setIsGeneratingKeys(true);
      await new Promise((resolve) => setTimeout(resolve, 1500));
      if (id) generateOAuthKeys(application_id,tokenConfig);
      toast({
        title: "Keys Generated Successfully",
        description: "Your API keys have been created and are ready to use",
        variant: "default",
      });
      setIsDrawerOpen(false);
    } catch (error) {
      toast({
        title: "Generation Failed",
        description: "Unable to generate API keys. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGeneratingKeys(false);
    }
  };

  return (
    <Sheet open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
      <SheetContent className="w-[500px] overflow-y-auto">
        <motion.div
          initial="initial"
          animate="animate"
          exit="exit"
          variants={fadeInUp}
        >
          <SheetHeader className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-primary/10">
                <Key className="h-5 w-5 text-primary" />
              </div>
              <SheetTitle className="text-2xl">Configure Keys</SheetTitle>
            </div>
            <SheetDescription className="text-muted-foreground">
              Customize your API key configuration and security settings
            </SheetDescription>
          </SheetHeader>

          <div className="mt-8 space-y-8">
            {/* Token Expiration Section */}
            <motion.div
              variants={fadeInUp}
              className="space-y-4 rounded-lg bg-muted/30 p-4 border border-border"
            >
              <div className="flex items-center gap-2 mb-4">
                <Clock className="h-4 w-4 text-primary" />
                <h4 className="text-sm font-medium">Token Expiration</h4>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label
                    htmlFor="accessTokenExpiry"
                    className="text-sm text-muted-foreground"
                  >
                    Access Token Expiry
                  </Label>
                  <Select
                    value={tokenConfig.accessTokenExpiry}
                    onValueChange={(value) =>
                      setTokenConfig({
                        ...tokenConfig,
                        accessTokenExpiry: value,
                      })
                    }
                  >
                    <SelectTrigger className="w-full bg-background">
                      <SelectValue placeholder="Select expiry" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="3600">1 hour</SelectItem>
                      <SelectItem value="7200">2 hours</SelectItem>
                      <SelectItem value="86400">24 hours</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="refreshTokenExpiry"
                    className="text-sm text-muted-foreground"
                  >
                    Refresh Token Expiry
                  </Label>
                  <Select
                    value={tokenConfig.refreshTokenExpiry}
                    onValueChange={(value) =>
                      setTokenConfig({
                        ...tokenConfig,
                        refreshTokenExpiry: value,
                      })
                    }
                  >
                    <SelectTrigger className="w-full bg-background">
                      <SelectValue placeholder="Select expiry" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="86400">24 hours</SelectItem>
                      <SelectItem value="604800">7 days</SelectItem>
                      <SelectItem value="2592000">30 days</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </motion.div>

            {/* Grant Types Section */}
            <motion.div
              variants={fadeInUp}
              className="space-y-4 rounded-lg bg-muted/30 p-4 border border-border"
            >
              <div className="flex items-center gap-2 mb-4">
                <Shield className="h-4 w-4 text-primary" />
                <h4 className="text-sm font-medium">Grant Types</h4>
              </div>

              <div className="grid gap-4">
                {Object.entries(tokenConfig.grantTypes).map(([key, value]) => (
                  <motion.div
                    key={key}
                    whileHover={{ x: 2 }}
                    className="flex items-center space-x-3 p-2 rounded-md hover:bg-muted/50 transition-colors"
                  >
                    <Checkbox
                      id={key}
                      checked={value}
                      onCheckedChange={(checked) =>
                        setTokenConfig({
                          ...tokenConfig,
                          grantTypes: {
                            ...tokenConfig.grantTypes,
                            [key]: checked as boolean,
                          },
                        })
                      }
                      className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                    />
                    <Label
                      htmlFor={key}
                      className="text-sm font-medium cursor-pointer flex-1"
                    >
                      {key.replace(/([A-Z])/g, " $1").trim()}
                    </Label>
                    <ChevronRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>

          <SheetFooter className="mt-8 gap-3">
            <Button
              variant="outline"
              onClick={() => setIsDrawerOpen(false)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              variant="default"
              onClick={handleConfigSubmit}
              disabled={isGeneratingKeys}
              className="flex-1 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary"
            >
              {isGeneratingKeys ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                >
                  <RefreshCw className="h-4 w-4" />
                </motion.div>
              ) : (
                "Generate Keys"
              )}
            </Button>
          </SheetFooter>
        </motion.div>
      </SheetContent>
    </Sheet>
  );
}
