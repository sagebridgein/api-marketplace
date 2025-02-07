interface GrantTypes {
  grant_types: string;
}

export interface ClientConfig {
  clientId: string;
  clientName: string;
  callBackURL: string;
  clientSecret: string;
  isSaasApplication: boolean;
  appOwner: string;
  jsonString: string | GrantTypes; // Can be string or parsed object
  jsonAppAttribute: string | Record<string, unknown>; // Can be string or parsed object
  applicationUUID: string | null;
  tokenType: string;
}

export interface GatewayToken {
  access_token: string;
  refresh_token: string;
  scope: string;
  token_type: string;
  expires_in: number;
}
