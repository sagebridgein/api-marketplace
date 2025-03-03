import { Auth } from "@/types/playground";
import { redirect } from "next/navigation";

/**
 * Redirects to a specified path with an encoded message as a query parameter.
 * @param {('error' | 'success')} type - The type of message, either 'error' or 'success'.
 * @param {string} path - The path to redirect to.
 * @param {string} message - The message to be encoded and added as a query parameter.
 * @returns {never} This function doesn't return as it triggers a redirect.
 */
export function encodedRedirect(
  type: "error" | "success",
  path: string,
  message: string,
) {
  return redirect(`${path}?${type}=${encodeURIComponent(message)}`);
}


export const getAuthHeaders = (auth: Auth): Record<string, string> => {
  const authHandlers = {
    bearer: () => (auth.token ? { Authorization: `Bearer ${auth.token}` } : {}),
    basic: () => {
      if (auth.username && auth.password) {
        const credentials = btoa(`${auth.username}:${auth.password}`);
        return { Authorization: `Basic ${credentials}` };
      }
      return {};
    },
    apiKey: () => (auth.keyName && auth.keyValue ? { [auth.keyName]: auth.keyValue } : {}),
    none: () => ({}),
  };

  return (authHandlers[auth.type] || authHandlers.none)();
};

export const formatSize = (bytes: number): string => {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
};

export const parseRequestBody = (body: string): any => {
  try {
    return JSON.parse(body);
  } catch {
    return body;
  }
};