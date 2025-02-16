import { create } from "zustand";
import axios from "axios";
import { OAuthKeyData } from "@/types/oauth-keys";

interface OAuthState {
  consumerKey: string;
  consumerSecret: string;
  loading: boolean;
  accessToken: string;
  generateLoad: boolean;
  error: string | null;
  setAccessToken: (accessToken: string) => void;
  fetchOAuthKeys: (applicationId: string, userId: string) => Promise<void>;
  generateAccessToken: (applicationId: string, userId: string) => Promise<boolean>;
}

export const useBuyerKeysStore = create<OAuthState>((set) => ({
  consumerKey: "",
  consumerSecret: "",
  accessToken: "",
  generateLoad: false,
  loading: false,
  error: null,
  setAccessToken: (accessToken: string) => set({ accessToken }),
  generateAccessToken: async (
    applicationId: string,
    userId: string
  ): Promise<boolean> => {
    set({
      accessToken: "",
      generateLoad: true,
    });
    try {
      const response = await axios.post("/api/keys/access_token/generate", {
        applicationId,
        userId,
      });
      set({
        accessToken: response.data.accessToken,
        generateLoad: false,
      });
      return true;
    } catch (error: any) {
      set({
        error:
          error.response?.data?.message || "Failed to generate access token",
        generateLoad: false,
      });
      return false;
    }
  },
  fetchOAuthKeys: async (userId: string, application_id: string) => {
    set({ loading: true, error: null });

    try {
      const response = await axios.get<{ keys: OAuthKeyData[] }>(
        `/api/keys/oauth/${userId}/${application_id}`
      );
      const keys = response.data?.keys?.[0];
      set({
        consumerKey: keys?.consumerKey,

        consumerSecret: keys?.consumerSecret,
        loading: false,
      });
    } catch (error: any) {
      set({
        error: error.response?.data?.message || "Failed to fetch OAuth keys",
        loading: false,
      });
    }
  },
}));
