import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  Method,
  RequestHeaders,
  ApiResponse,
  ApiError,
  Auth,
  HistoryEntry,
  ActiveTab,
  Environment,
} from "@/types/playground";
import { DEFAULT_TIMEOUT, DEFAULT_ENVIRONMENTS } from "@/constants";
import { getAuthHeaders, parseRequestBody } from "@/utils/utils";
import { ApiService } from "@/services/ApiTestService";

interface ApiTestingState {
  // Request configuration
  method: Method;
  url: string;
  auth: Auth;
  headers: RequestHeaders;
  queryParams: RequestHeaders;
  body: string;
  selectedEnvironment: string;
  environments: Record<string, Environment>;
  endpoint: string;

  // Response data
  response: ApiResponse | null;
  error: ApiError | null;
  isLoading: boolean;
  responseHistory: HistoryEntry[];

  // UI State
  activeTab: ActiveTab;
  isSidebarOpen: boolean;
  sandboxkey: string;
  requestTimeout: number;
  abortController: AbortController | null;

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
  addEnvironment: (
    name: string,
    baseUrl: string,
    variables?: RequestHeaders
  ) => void;
  removeEnvironment: (name: string) => void;
  setActiveTab: (tab: ActiveTab) => void;
  setSidebarOpen: (isOpen: boolean) => void;
  clearResponse: () => void;
  clearHistory: () => void;
  sendRequest: (isSubscribed: boolean, userId: string) => Promise<void>;
  setSandboxKey: (sandboxkey: string) => void;
  setAuth: (auth: Auth) => void;
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
      headers: { "content-type": "application/json" },
      sandboxkey: "",
      queryParams: {},
      body: "",
      selectedEnvironment: "production",
      environments: DEFAULT_ENVIRONMENTS,
      response: null,
      error: null,
      isLoading: false,
      responseHistory: [],
      activeTab: "headers",
      isSidebarOpen: true,
      auth: { type: "none" },
      requestTimeout: DEFAULT_TIMEOUT,
      abortController: null,

      // Actions
      setSandboxKey: (sandboxkey: string) => set({ sandboxkey }),
      setMethod: (method: Method) => set({ method }),
      setUrl: (url: string) => set({ url }),
      setHeaders: (headers: RequestHeaders) => set({ headers }),
      addHeader: (key: string, value: string) =>
        set((state) => ({ headers: { ...state.headers, [key]: value } })),
      removeHeader: (key: string) =>
        set((state) => {
          const headers = { ...state.headers };
          delete headers[key];
          return { headers };
        }),
      setQueryParams: (queryParams: RequestHeaders) => set({ queryParams }),
      addQueryParam: (key: string, value: string) =>
        set((state) => ({
          queryParams: { ...state.queryParams, [key]: value },
        })),
      removeQueryParam: (key: string) =>
        set((state) => {
          const queryParams = { ...state.queryParams };
          delete queryParams[key];
          return { queryParams };
        }),
      setBody: (body: string) => set({ body }),
      setEnvironment: (selectedEnvironment: string) =>
        set({ selectedEnvironment }),
      addEnvironment: (
        name: string,
        baseUrl: string,
        variables: RequestHeaders = {}
      ) =>
        set((state) => ({
          environments: {
            ...state.environments,
            [name]: { baseUrl, variables },
          },
        })),
      removeEnvironment: (name: string) =>
        set((state) => {
          const environments = { ...state.environments };
          delete environments[name];
          return { environments };
        }),
      setActiveTab: (activeTab: ActiveTab) => set({ activeTab }),
      setSidebarOpen: (isSidebarOpen: boolean) => set({ isSidebarOpen }),
      clearResponse: () => set({ response: null, error: null }),
      clearHistory: () => set({ responseHistory: [] }),
      setEndPoint: (endpoint: string) => set({ endpoint }),
      setRequestTimeout: (timeout: number) => set({ requestTimeout: timeout }),
      setAuth: (auth: Auth) => set({ auth }),

      cancelRequest: () => {
        const { abortController } = get();
        if (abortController) {
          abortController.abort();
          set({ abortController: null, isLoading: false });
        }
      },

      sendRequest: async (isSubscribed: boolean, userId: string) => {
        const state = get();
        const environment = state.environments[state.selectedEnvironment];
        const abortController = new AbortController();

        set({ abortController, isLoading: true, error: null, response: null });

        try {
          if (isSubscribed) {
            if (!get().headers["Authorization"]) {
              const accessToken = await ApiService.generateTestKeys(userId);
              get().setAuth({ type: "bearer", token: accessToken });
              get().setHeaders({
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`,
              });
            }
          }

          const fullUrl = `${environment.baseUrl}${state.url}/${state.endpoint}`;
          const processedHeaders = Object.entries(state.headers).reduce(
            (acc, [key, value]) => ({
              ...acc,
              [key]: Object.entries(environment.variables).reduce(
                (val, [varKey, varValue]) =>
                  val.replace(new RegExp(`{{${varKey}}}`, "g"), varValue),
                value
              ),
            }),
            {}
          );

          const authHeaders = getAuthHeaders(state.auth);
          const finalHeaders = { ...processedHeaders, ...authHeaders };

          const response = await ApiService.sendRequest({
            method: state.method,
            url: fullUrl,
            headers: get().headers,
            data:
              state.method !== "GET" ? parseRequestBody(state.body) : undefined,
            timeout: state.requestTimeout,
            signal: abortController.signal,
          });

          set((state) => ({
            response,
            isLoading: false,
            abortController: null,
            responseHistory: [
              {
                timestamp: Date.now(),
                method: state.method,
                url: fullUrl,
                response,
              },
              ...state.responseHistory.slice(0, 9),
            ],
          }));
        } catch (error: any) {
          set({
            error: {
              message: error.message || "Request failed",
              status: error.status,
              details: error.data,
              code: error.code,
            },
            isLoading: false,
            abortController: null,
          });
        }
      },
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
