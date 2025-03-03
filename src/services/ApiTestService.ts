import { ApiResponse, Method } from "@/types/playground";

export class ApiService {
    private static async generateAccessToken(applicationId: string): Promise<string> {
      const response = await fetch('/api/keys/access_token/generate', {
        method: 'POST',
        body: JSON.stringify({ applicationId }),
      });
      const data = await response.json();
      return data.accessToken;
    }
  
    private static async createTestKeys(applicationId: string): Promise<void> {
      await fetch(`/api/keys/oauth/${applicationId}/generate`, {
        method: 'POST',
        body: JSON.stringify({
          accessTokenExpiry: '3600',
          refreshTokenExpiry: '86400',
          Type: 'SANDBOX',
          grantTypes: {
            refreshToken: true,
            password: true,
            clientCredentials: false,
            jwt: false,
          },
          tokenFormat: 'JWT',
          securityLevel: 'Medium',
        }),
      });
    }
  
    static async generateTestKeys(userId: string): Promise<string> {
      try {
        const appResponse = await fetch(`/api/subscriptions/applications/get/${userId}`);
        const appData = await appResponse.json();
        
        const keysResponse = await fetch(`/api/keys/oauth/${appData.applicationId}/get`);
        const keysData = await keysResponse.json();
        
        if (!keysData.keys) {
          await this.createTestKeys(appData.applicationId);
        }
        
        return await this.generateAccessToken(appData.applicationId);
      } catch (error) {
        console.error('Error generating test keys:', error);
        throw error;
      }
    }
  
    static async sendRequest(config: {
      method: Method;
      url: string;
      headers: Record<string, string>;
      data?: any;
      timeout: number;
      signal?: AbortSignal;
    }): Promise<ApiResponse> {
      const response = await fetch('/api/test', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(config),
        signal: config.signal,
      });
  
      const data = await response.json();
      if (!data.success) {
        throw data.error;
      }
  
      return data.response;
    }
  }