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
}

interface ApiError {
  message: string;
  status?: number;
  details?: any;
}

interface ApiTestingState {
  // Request configuration
  method: Method;
  url: string;
  headers: RequestHeaders;
  queryParams: RequestHeaders;
  body: string;
  selectedEnvironment: string;
  environments: { [key: string]: { baseUrl: string; variables: RequestHeaders } };
  endpoint:string,
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
  activeTab: "params" | "headers" | "body" | "tests";
  isSidebarOpen: boolean;

  // Actions
  setMethod: (method: string) => void;
  setUrl: (url: string) => void;
  setEndPoint:(endpoint:string)=>void;
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
}

export const useApiTestingStore = create<ApiTestingState>()(
  persist(
    (set, get) => ({
      // Initial state
      method: "GET",
      endpoint:"/",
      url: "",
      headers: {},
      queryParams: {},
      body: '',
      selectedEnvironment: "development",
      environments: {
        development: {
          baseUrl: "http://localhost:3000",
          variables: {},
        },
        production: {
          baseUrl: "https://api.production.com",
          variables: {},
        },
      },
      response: null,
      error: null,
      isLoading: false,
      responseHistory: [],
      activeTab: "params",
      isSidebarOpen: true,

      // Actions
      setMethod: (method) => set({ method }),
      
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
      setEndPoint:(endpoint)=>set({endpoint}),
      sendRequest: async () => {
        const state = get();
        const environment = state.environments[state.selectedEnvironment];
        
        // Build full URL with query parameters
        const baseUrl = environment.baseUrl;
        const fullUrl = new URL(state.url, baseUrl);
        Object.entries(state.queryParams).forEach(([key, value]) => {
          fullUrl.searchParams.append(key, value);
        });

        // Replace environment variables in headers
        const processedHeaders = Object.entries(state.headers).reduce(
          (acc, [key, value]) => {
            const processedValue = Object.entries(environment.variables).reduce(
              (val, [varKey, varValue]) => 
                val.replace(`{{${varKey}}}`, varValue),
              value
            );
            return { ...acc, [key]: processedValue };
          },
          {}
        );

        set({ isLoading: true, error: null });
        
        try {
          const startTime = performance.now();
          
          const response: AxiosResponse = await axios({
            method: state.method.toLowerCase(),
            url: fullUrl.toString(),
            headers: processedHeaders,
            data: state.method !== "GET" ? state.body : undefined,
          });
          
          const endTime = performance.now();
          const responseTime = endTime - startTime;
          
          // Calculate response size
          const responseSize = JSON.stringify(response.data).length;
          const formattedSize = responseSize > 1024 
            ? `${(responseSize / 1024).toFixed(2)} KB` 
            : `${responseSize} B`;

          const apiResponse: ApiResponse = {
            data: response.data,
            status: response.status,
            headers: response.headers,
            time: Math.round(responseTime),
            size: formattedSize,
          };

          // Update state with new response
          set((state) => ({
            response: apiResponse,
            isLoading: false,
            responseHistory: [
              {
                timestamp: Date.now(),
                method: state.method,
                url: fullUrl.toString(),
                response: apiResponse,
              },
              ...state.responseHistory.slice(0, 9), // Keep last 10 responses
            ],
          }));
        } catch (error) {
          const axiosError = error as AxiosError;
          set({
            error: {
              message: axiosError.message,
              status: axiosError.response?.status,
              details: axiosError.response?.data,
            },
            isLoading: false,
          });
        }
      },
    }),
    {
      name: "api-testing-store",
      partialize: (state) => ({
        environments: state.environments,
        responseHistory: state.responseHistory,
      }),
    }
  )
);