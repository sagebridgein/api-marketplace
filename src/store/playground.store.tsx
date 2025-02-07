import { create } from "zustand";
import axios from "axios";
import { API } from "@/types/Api";

interface ApiPlaygroundStore {
  api: API | null;
  isLoading: boolean;
  error: string | null;
  getApi: (id: string) => Promise<void>;
}

export const usePlaygroundStore = create<ApiPlaygroundStore>((set) => ({
  api: null,
  isLoading: false,
  error: null,
  getApi: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.get<API>(`/api/market/${id}`);

      set({ api: response.data, isLoading: false });
    } catch (error) {
      let errorMessage = "An unknown error occurred";
      if (axios.isAxiosError(error)) {
        errorMessage = error.response?.data?.message || error.message;
      }
      set({ error: errorMessage, isLoading: false });
    }
  },
}));
