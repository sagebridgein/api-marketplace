import { ApiEndpoint } from "@/types";
export const API_GATEWAY=process.env.NEXT_PUBLIC_API_GATEWAY
export const apiEndpoints: ApiEndpoint[] = [
    {
      method: "GET",
      path: "/api/users",
      description: "Get all users",
      version: "v2",
      category: "users",
    },
    {
      method: "POST",
      path: "/api/users",
      description: "Create new user",
      version: "v2",
      category: "users",
    },
    {
      method: "GET",
      path: "/api/products",
      description: "Get all products",
      version: "v2",
      category: "products",
    },
  ];
export const methodColors = {
    GET: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
    POST: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
    PUT: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
    DELETE: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
  };

export  const apiVersions = ["v1", "v2", "v3-beta"];
export  const categories = ["all", "users", "products", "orders", "auth"];


export const DEFAULT_TIMEOUT = 30000;
export const DEFAULT_ENVIRONMENTS = {
  development: {
    baseUrl: 'https://api.sagebridge.in/test',
    variables: {},
  },
  production: {
    baseUrl: 'https://api.sagebridge.in',
    variables: {},
  },
};
