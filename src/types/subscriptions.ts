export interface ApplicationCreationResponse {
    applicationId: string;
    name: string;
    throttlingPolicy: string;
    description: string;
    tokenType: string;
    status: string;
    groups: string[];
    subscriptionCount: number;
    keys: any[]; // Adjust type if specific key structure is known
    attributes: Record<string, any>;
    subscriptionScopes: string[];
    owner: string;
    hashEnabled: boolean | null;
    createdTime: string;
    updatedTime: string;
  }
  
export interface ApplicationGetResponse{
  applicationId: string;
  name: string;
  throttlingPolicy: string;
  description: string;
  status: string;
  groups: string[];
  subscriptionCount: number;
  attributes: Record<string, unknown>;
  owner: string;
  tokenType: string;
  createdTime: string;
  updatedTime: string;
}
