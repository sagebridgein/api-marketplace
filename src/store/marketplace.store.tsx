import { ApiList, Pagination } from "@/types";
import { Tag } from "@/types/tags";
import axios, { AxiosError } from "axios";
import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

// Enhanced interface definitions
interface ApiResponse {
  count: number;
  list: ApiList[];
  pagination: Pagination;
}

interface TagResponse {
  count: number;
  list: Tag[];
  pagination: Pagination;
}

// State interface with separated loading states
interface MarketPlaceState {
  apis: ApiResponse | null;
  tags: TagResponse | null;
  loading: {
    apis: boolean;
    tags: boolean;
  };
  errors: {
    apis: string | null;
    tags: string | null;
  };
  fetchApis: (params?: { limit?: number; offset?: number }) => Promise<void>;
  fetchTags: (params?: { limit?: number; offset?: number }) => Promise<void>;
  loadMoreApis: () => Promise<void>;
  loadMoreTags: () => Promise<void>;
  resetErrors: () => void;
}

export const useMarketPlaceStore = create<MarketPlaceState>()(
  immer((set, get) => ({
    apis: null,
    tags: null,
    loading: {
      apis: false,
      tags: false,
    },
    errors: {
      apis: null,
      tags: null,
    },

    fetchApis: async (params = { limit: 10, offset: 0 }) => {
      set((state) => {
        state.loading.apis = true;
        state.errors.apis = null;
      });

      try {
        const response = await axios.get<ApiResponse>(`/api/market`, {
          params,
          timeout: 10000,
        });

        set((state) => {
          state.apis = response.data;
          state.loading.apis = false;
        });
      } catch (error) {
        const err = error as AxiosError<{ message?: string }>;
        set((state) => {
          state.errors.apis =
            err.response?.data?.message ||
            err.message ||
            "Failed to fetch APIs";
          state.loading.apis = false;
        });
      }
    },

    fetchTags: async (params = { limit: 25, offset: 0 }) => {
      set((state) => {
        state.loading.tags = true;
        state.errors.tags = null;
      });

      try {
        const response = await axios.get<TagResponse>(`/api/tags`, {
          params,
          timeout: 10000,
        });

        set((state) => {
          state.tags = response.data;
          state.loading.tags = false;
        });
      } catch (error) {
        const err = error as AxiosError<{ message?: string }>;
        set((state) => {
          state.errors.tags =
            err.response?.data?.message ||
            err.message ||
            "Failed to fetch tags";
          state.loading.tags = false;
        });
      }
    },

    loadMoreApis: async () => {
      const currentApis = get().apis;
      if (!currentApis) return;

      const nextOffset = currentApis.pagination.offset + currentApis.pagination.limit;

      try {
        const response = await axios.get<ApiResponse>(`/api/market`, {
          params: {
            limit: currentApis.pagination.limit,
            offset: nextOffset,
          },
          timeout: 10000,
        });

        set((state) => {
          if (state.apis) {
            state.apis = {
              ...response.data,
              list: [...state.apis.list, ...response.data.list],
              pagination: response.data.pagination,
            };
          }
        });
      } catch (error) {
        const err = error as AxiosError<{ message?: string }>;
        set((state) => {
          state.errors.apis =
            err.response?.data?.message ||
            err.message ||
            "Failed to load more APIs";
        });
      }
    },

    loadMoreTags: async () => {
      const currentTags = get().tags;
      if (!currentTags) return;

      const nextOffset = currentTags.pagination.offset + currentTags.pagination.limit;

      try {
        const response = await axios.get<TagResponse>(`/api/tags`, {
          params: {
            limit: currentTags.pagination.limit,
            offset: nextOffset,
          },
          timeout: 10000,
        });

        set((state) => {
          if (state.tags) {
            state.tags = {
              ...response.data,
              list: [...state.tags.list, ...response.data.list],
              pagination: response.data.pagination,
            };
          }
        });
      } catch (error) {
        const err = error as AxiosError<{ message?: string }>;
        set((state) => {
          state.errors.tags =
            err.response?.data?.message ||
            err.message ||
            "Failed to load more tags";
        });
      }
    },

    resetErrors: () => {
      set((state) => {
        state.errors.apis = null;
        state.errors.tags = null;
      });
    },
  }))
);


// stores/api-store.ts
// import { create } from 'zustand';
// import { immer } from 'zustand/middleware/immer';
// import { persist } from 'zustand/middleware';
// import { ApiList } from '@/types';

// type ApiState = {
//   apis: ApiList[];
//   searchQuery: string;
//   isLoading: boolean;
//   // setLoading:(isLoading:boolean)=>void;
//   error: string | null;
//   lastFetched: number | null;
//   fetchApis: () => Promise<void>;
//   setSearchQuery: (query: string) => void;
//   filteredApis: () => ApiList[];
//   reset: () => void;
// };

// const API_ENDPOINT = '/api/market';
// const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

// export const useMarketPlaceStore = create<ApiState>()(
//   persist(
//     immer((set, get) => ({
//       apis: [],
//       searchQuery: '',
//       isLoading: false,
//       error: null,
//       lastFetched: null,

//       fetchApis: async () => {
//         const { lastFetched } = get();
//         if (lastFetched && Date.now() - lastFetched < CACHE_TTL) return;

//         set({ isLoading: true, error: null });
        
//         try {
//           const controller = new AbortController();
//           const timeoutId = setTimeout(() => controller.abort(), 10000);

//           const response = await fetch(API_ENDPOINT, {
//             signal: controller.signal,
//           });
//           clearTimeout(timeoutId);

//           if (!response.ok) throw new Error(`HTTP ${response.status}`);
          
//           const data = await response.json();
//           set({ 
//             apis: data.list,
//             lastFetched: Date.now(),
//             isLoading: false 
//           });
//         } catch (err) {
//           set({ 
//             error: err instanceof Error ? err.message : 'Request failed',
//             isLoading: false 
//           });
//         }
//       },

//       setSearchQuery: (query) => {
//         set({ searchQuery: query.trim() });
//       },

//       filteredApis: () => {
//         const { apis, searchQuery } = get();
//         if (!searchQuery) return apis;

//         const query = searchQuery.toLowerCase();
//         return apis.filter(api =>
//           api.name.toLowerCase().includes(query) ||
//           api.id.toLowerCase().includes(query) ||
//           api.context.toLowerCase().includes(query) ||
//           api.version.toLowerCase().includes(query)
//         );
//       },

//       reset: () => {
//         set({ 
//           apis: [],
//           searchQuery: '',
//           lastFetched: null 
//         });
//       }
//     })),
//     {
//       name: 'api-storage',
//       partialize: (state) => ({ 
//         apis: state.apis,
//         lastFetched: state.lastFetched 
//       }),
//     }
//   )
// );