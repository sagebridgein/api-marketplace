import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useApiTestingStore } from "@/store/apitest.store";
import { cn } from "@/lib/utils";
import { AuthType } from "@/types/playground";

const authTypes = [
  { value: "none", label: "No Auth" },
  { value: "bearer", label: "Bearer Token" },
  { value: "basic", label: "Basic Auth" },
  { value: "apiKey", label: "API Key" },
];

export default function Auth() {
  const { auth, setAuth } = useApiTestingStore();

  const handleAuthTypeChange = (value: AuthType) => {
    setAuth({ ...auth, type: value });
  };

  const handleAuthValueChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: string
  ) => {
    setAuth({ ...auth, [field]: e.target.value });
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Authentication Type
        </label>
        <Select value={auth.type} onValueChange={handleAuthTypeChange}>
          <SelectTrigger
            className={cn(
              "w-full mt-1",
              "border-gray-200 dark:border-gray-700",
              "bg-transparent dark:bg-gray-800"
            )}
          >
            <SelectValue placeholder="Select auth type" />
          </SelectTrigger>
          <SelectContent className="dark:bg-gray-800 border-gray-200 dark:border-gray-700">
            {authTypes.map((type) => (
              <SelectItem
                key={type.value}
                value={type.value}
                className="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                {type.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {auth.type === "bearer" && (
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Bearer Token
          </label>
          <Input
            value={auth.token || ""}
            onChange={(e) => handleAuthValueChange(e, "token")}
            placeholder="Enter bearer token"
            className={cn(
              "w-full",
              "border-gray-200 dark:border-gray-700",
              "bg-transparent dark:bg-gray-800"
            )}
          />
        </div>
      )}

      {auth.type === "basic" && (
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Username
            </label>
            <Input
              value={auth.username || ""}
              onChange={(e) => handleAuthValueChange(e, "username")}
              placeholder="Enter username"
              className={cn(
                "w-full",
                "border-gray-200 dark:border-gray-700",
                "bg-transparent dark:bg-gray-800"
              )}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Password
            </label>
            <Input
              type="password"
              value={auth.password || ""}
              onChange={(e) => handleAuthValueChange(e, "password")}
              placeholder="Enter password"
              className={cn(
                "w-full",
                "border-gray-200 dark:border-gray-700",
                "bg-transparent dark:bg-gray-800"
              )}
            />
          </div>
        </div>
      )}

      {auth.type === "apiKey" && (
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Key Name
            </label>
            <Input
              value={auth.keyName || ""}
              onChange={(e) => handleAuthValueChange(e, "keyName")}
              placeholder="Enter key name"
              className={cn(
                "w-full",
                "border-gray-200 dark:border-gray-700",
                "bg-transparent dark:bg-gray-800"
              )}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Key Value
            </label>
            <Input
              value={auth.keyValue || ""}
              onChange={(e) => handleAuthValueChange(e, "keyValue")}
              placeholder="Enter key value"
              className={cn(
                "w-full",
                "border-gray-200 dark:border-gray-700",
                "bg-transparent dark:bg-gray-800"
              )}
            />
          </div>
        </div>
      )}
    </div>
  );
}
