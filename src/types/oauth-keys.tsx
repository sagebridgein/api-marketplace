interface OAuthToken {
    accessToken: string | null;
    tokenScopes: string[];
    validityTime: number;
  }
  
  interface AdditionalProperties {
    id_token_expiry_time: number;
    application_access_token_expiry_time: number;
    user_access_token_expiry_time: number;
    bypassClientCredentials: boolean;
    pkceMandatory: boolean;
    pkceSupportPlain: boolean;
    refresh_token_expiry_time: number;
  }
  
export interface OAuthKeyData {
    keyMappingId: string;
    keyManager: string;
    consumerKey: string;
    consumerSecret: string;
    supportedGrantTypes: string[];
    callbackUrl: string;
    keyState: string;
    keyType: string;
    mode: string;
    groupId: string | null;
    token: OAuthToken;
    additionalProperties: AdditionalProperties;
  }
  