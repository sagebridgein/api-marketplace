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

// Add Category interface if not imported
interface Category {
  id: string;
  name: string;
  description?: string;
  createdAt?: string;
  updatedAt?: string;
}

// Add CategoryResponse interface for consistency with other responses
interface CategoryResponse {
  count: number;
  list: Category[];
  pagination: Pagination;
}

// State interface with separated loading states
interface MarketPlaceState {
  apis: ApiResponse | null;
  tags: TagResponse | null;
  categories: Category[] | null;
  loading: {
    apis: boolean;
    tags: boolean;
    categories: boolean;
  };
  errors: {
    apis: string | null;
    tags: string | null;
    categories: string | null;  // Add categories to errors
  };
  fetchApis: (params?: { limit?: number; offset?: number }) => Promise<void>;
  fetchTags: (params?: { limit?: number; offset?: number }) => Promise<void>;
  loadMoreApis: () => Promise<void>;
  loadMoreTags: () => Promise<void>;
  fetchCategories: (params?: { limit?: number; offset?: number }) => Promise<void>;
  resetErrors: () => void;
}

export const useMarketPlaceStore = create<MarketPlaceState>()(
  immer((set, get) => ({
    apis: null,
    tags: null,
    categories: null, 
    loading: {
      apis: false,
      tags: false,
      categories: false,
    },
    errors: {
      apis: null,
      tags: null,
      categories: null, 
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
    fetchCategories: async (params = { limit: 25, offset: 0 }) => {
      set((state) => {
        state.loading.categories = true;
        state.errors.categories = null;
      });
      
      try {
        const response = await axios.get<CategoryResponse>(`/api/category`, {
          params,
          timeout: 10000,
        });
        
        set((state) => {
          state.categories = response.data.list; // Update to use list property
          state.loading.categories = false;
        });
      } catch (error) {
        const err = error as AxiosError<{ message?: string }>;
        set((state) => {
          state.errors.categories = 
            err.response?.data?.message ||
            err.message ||
            "Failed to fetch categories";
          state.loading.categories = false;
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
        state.errors.categories = null; // Add categories error reset
      });
    },
  }))
);
