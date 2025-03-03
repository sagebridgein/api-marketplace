import { create } from "zustand";
import axios from "axios";
import { OAuthKeyData } from "@/types/oauth-keys";
import { TokenConfig } from "@/app/(dashboard)/dashboard/[application_id]/[api_name]/[api_id]/generate-oauth-keys/components/generate-keys-sheet";

interface OAuthState {
  consumerKey: string;
  consumerSecret: string;
  loading: boolean;
  accessToken: string;
  generateLoad: boolean;
  error: string | null;
  setAccessToken: (accessToken: string) => void;
  generateOAuthKeys: (application_id: string, body: TokenConfig) => void;
  fetchOAuthKeys: (applicationId: string) => Promise<void>;
  generateAccessToken: (
    applicationId: string,
    userId: string
  ) => Promise<boolean>;
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
  generateOAuthKeys: async (application_id: string, body: TokenConfig) => {
    try {
      const response = await axios.post<{ keys: OAuthKeyData[] }>(
        `/api/keys/oauth/${application_id}/generate`,
        body
      );
      const keys = response.data?.keys?.[0];
      console.log("keys", keys);
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
  fetchOAuthKeys: async (application_id: string) => {
    set({ loading: true, error: null });

    try {
      const response = await axios.get<{ keys: OAuthKeyData[] }>(
        `/api/keys/oauth/${application_id}/get`
      );
      const keys = response.data?.keys?.[0];
      console.log("keys", keys);
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
