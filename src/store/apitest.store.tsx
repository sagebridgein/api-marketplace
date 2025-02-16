import { create } from "zustand";
import axios, { AxiosError, AxiosResponse, Method } from "axios";
import { persist } from "zustand/middleware";

interface RequestHeaders {
  [key: string]: string;
}

interface RequestBody {
  [key: string]: any;
}

interface ApiResponse {
  data: any;
  status: number;
  headers: any;
  time: number;
  size: string;
  config?: any;
}

interface ApiError {
  message: string;
  status?: number;
  details?: any;
  code?: string;
  config?: any;
}

interface Auth {
  type: string;
  token?: string;
  username?: string;
  password?: string;
  keyName?: string;
  keyValue?: string;
}

interface ApiTestingState {
  // Request configuration
  method: Method | undefined;
  url: string;
  headers: RequestHeaders;
  queryParams: RequestHeaders;
  body: string;
  selectedEnvironment: string;
  environments: { [key: string]: { baseUrl: string; variables: RequestHeaders } };
  endpoint: string;
  // Response data
  response: ApiResponse | null;
  error: ApiError | null;
  isLoading: boolean;
  responseHistory: Array<{
    timestamp: number;
    method: string;
    url: string;
    response: ApiResponse;
  }>;

  // UI State
  activeTab: "params" | "headers" | "body" | "authorizations";
  isSidebarOpen: boolean;

  // Actions
  setMethod: (method: Method) => void;
  setUrl: (url: string) => void;
  setEndPoint: (endpoint: string) => void;
  setHeaders: (headers: RequestHeaders) => void;
  addHeader: (key: string, value: string) => void;
  removeHeader: (key: string) => void;
  setQueryParams: (params: RequestHeaders) => void;
  addQueryParam: (key: string, value: string) => void;
  removeQueryParam: (key: string) => void;
  setBody: (body: string) => void;
  setEnvironment: (env: string) => void;
  addEnvironment: (name: string, baseUrl: string, variables?: RequestHeaders) => void;
  removeEnvironment: (name: string) => void;
  setActiveTab: (tab: "params" | "headers" | "body" | "tests") => void;
  setSidebarOpen: (isOpen: boolean) => void;
  clearResponse: () => void;
  clearHistory: () => void;
  sendRequest: () => Promise<void>;
  auth: Auth;
  setAuth: (auth: Auth) => void;

  // Add new properties
  abortController: AbortController | null;
  requestTimeout: number;

  // Add new actions
  setRequestTimeout: (timeout: number) => void;
  cancelRequest: () => void;
}

export const useApiTestingStore = create<ApiTestingState>()(
  persist(
    (set, get) => ({
      // Initial state
      method: "GET",
      endpoint: "/",
      url: "",
      headers: {},
      queryParams: {},
      body: '',
      selectedEnvironment: "production",
      environments: {
        development: {
          baseUrl: "https://api.sagebridge.in/test",
          variables: {},
        },
        production: {
          baseUrl: "https://api.sagebridge.in",
          variables: {},
        },
      },
      response: null,
      error: null,
      isLoading: false,
      responseHistory: [],
      activeTab: "params",
      isSidebarOpen: true,
      auth: {
        type: 'none'
      },

      requestTimeout: 30000, // 30 seconds default
      abortController: null,

      // Actions
      setMethod: (method: Method) => set({ method }),
      
      setUrl: (url) => set({ url }),
      
      setHeaders: (headers) => set({ headers }),
      
      addHeader: (key, value) => {
        const headers = { ...get().headers, [key]: value };
        set({ headers });
      },
      
      removeHeader: (key) => {
        const headers = { ...get().headers };
        delete headers[key];
        set({ headers });
      },
      
      setQueryParams: (queryParams) => set({ queryParams }),
      
      addQueryParam: (key, value) => {
        const queryParams = { ...get().queryParams, [key]: value };
        set({ queryParams });
      },
      
      removeQueryParam: (key) => {
        const queryParams = { ...get().queryParams };
        delete queryParams[key];
        set({ queryParams });
      },
      
      setBody: (body) => set({ body }),
      
      setEnvironment: (selectedEnvironment) => set({ selectedEnvironment }),
      
      addEnvironment: (name, baseUrl, variables = {}) => {
        const environments = {
          ...get().environments,
          [name]: { baseUrl, variables },
        };
        set({ environments });
      },
      
      removeEnvironment: (name) => {
        const environments = { ...get().environments };
        delete environments[name];
        set({ environments });
      },
      
      setActiveTab: (activeTab) => set({ activeTab }),
      
      setSidebarOpen: (isSidebarOpen) => set({ isSidebarOpen }),
      
      clearResponse: () => set({ response: null, error: null }),
      
      clearHistory: () => set({ responseHistory: [] }),
      setEndPoint: (endpoint) => set({ endpoint }),
      setRequestTimeout: (timeout: number) => set({ requestTimeout: timeout }),
      cancelRequest: () => {
        const { abortController } = get();
        if (abortController) {
          abortController.abort();
          set({ abortController: null, isLoading: false });
        }
      },
      sendRequest: async () => {
        const state = get();
        const environment = state.environments[state.selectedEnvironment];
        
        // Create new AbortController for this request
        const abortController = new AbortController();
        set({ abortController });

        try {
          // Build full URL
          const baseUrl = environment.baseUrl;
          const fullUrl = `${"https://api.sagebridge.in"}${state.url}/${state.endpoint}`;
          console.log(fullUrl); 
          // Process headers with environment variables
          const processedHeaders = Object.entries(state.headers).reduce(
            (acc, [key, value]) => {
              const processedValue = Object.entries(environment.variables).reduce(
                (val, [varKey, varValue]) => 
                  val.replace(new RegExp(`{{${varKey}}}`, 'g'), varValue),
                value
              );
              return { ...acc, [key]: processedValue };
            },
            {}
          );

          // Add auth headers
          const authHeaders = getAuthHeaders(state.auth);
          const finalHeaders = { ...processedHeaders, ...authHeaders };

          set({ isLoading: true, error: null, response: null });
          
          const startTime = performance.now();

          // Send request through our API route
          const response = await fetch('/api/test', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              method: state.method,
              url: fullUrl,
              headers: finalHeaders,
              data: state.method !== "GET" ? parseRequestBody(state.body) : undefined,
              timeout: state.requestTimeout,
            }),
            signal: abortController.signal,
          });

          const responseData = await response.json();
          
          if (!responseData.success) {
            throw responseData.error;
          }

          // Update state with new response
          set((state) => ({
            response: responseData.response,
            isLoading: false,
            abortController: null,
            responseHistory: [
              {
                timestamp: Date.now(),
                method: state.method || 'GET',
                url: fullUrl,
                response: responseData.response,
              },
              ...state.responseHistory.slice(0, 9),
            ],
          }));
        } catch (error) {
          set({
            error: {
              message: (error as any).message || "Request failed",
              status: (error as any).status,
              details: (error as any).data,
              code: (error as any).code,
            },
            isLoading: false,
            abortController: null,
          });
        }
      },
      setAuth: (auth) => set({ auth }),
    }),
    {
      name: "api-testing-store",
      partialize: (state) => ({
        environments: state.environments,
        responseHistory: state.responseHistory,
        requestTimeout: state.requestTimeout,
      }),
    }
  )
);

// Helper functions
function getAuthHeaders(auth: Auth): Record<string, string> {
  switch (auth.type) {
    case 'bearer':
      return auth.token ? { 'Authorization': `Bearer ${auth.token}` } : {};
    case 'basic':
      if (auth.username && auth.password) {
        const credentials = btoa(`${auth.username}:${auth.password}`);
        return { 'Authorization': `Basic ${credentials}` };
      }
      return {};
    case 'apiKey':
      return auth.keyName && auth.keyValue ? { [auth.keyName]: auth.keyValue } : {};
    default:
      return {};
  }
}

function parseRequestBody(body: string): any {
  try {
    return JSON.parse(body);
  } catch {
    return body;
  }
}

function formatSize(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
}