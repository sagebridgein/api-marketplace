import { create } from "zustand";
import axios from "axios";
import { API } from "@/types/Api";
import { Subscription } from "@/types/subscriptions";

interface ApiPlaygroundStore {
  api: API | null;
  isLoading: boolean;
  error: string | null;
  isSubscribed: boolean;
  getIsSubscribed: (userId: string,apiId:string) => Promise<void>;
  getApi: (id: string) => Promise<void>;
}

export const usePlaygroundStore = create<ApiPlaygroundStore>((set) => ({
  api: null,
  isLoading: false,
  error: null,
  isSubscribed: false,
  getIsSubscribed: async (userId: string,apiId:string) => {
    set({ isLoading: true, error: null });
    console.log("calling");
    try {
      const { data } = await axios.get(
        `/api/subscriptions/get/${userId}`
      );
      const subscriptions=data.subscriptions
      if (!Array.isArray(subscriptions)) {
        throw new Error('Invalid response format');
      }
      console.log(subscriptions)
      const isSubscribed = subscriptions.some(
        (subscription) => subscription.apiId === apiId
      );

      console.log("isSubscribed",isSubscribed)
      
      set({ 
        isSubscribed, 
        isLoading: false 
      });
    } catch (error) {
      let errorMessage = "Failed to check subscription status";
      if (axios.isAxiosError(error)) {
        errorMessage = error.response?.data?.message || error.message;
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }
      set({ 
        error: errorMessage, 
        isLoading: false,
        isSubscribed: false 
      });
    }
  },
  getApi: async (app_id: string) => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await axios.get<API>(`/api/market/${app_id}`);
      
      if (!data) {
        throw new Error('API data not found');
      }

      set({ api: data, isLoading: false });
    } catch (error) {
      let errorMessage = "Failed to fetch API details";
      if (axios.isAxiosError(error)) {
        errorMessage = error.response?.data?.message || error.message;
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }
      set({ 
        error: errorMessage, 
        isLoading: false,
        api: null 
      });
    }
  },
}));
