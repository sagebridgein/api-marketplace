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




export interface Subscription {
  subscriptionId: string;
  applicationId: string;
  apiId: string;
  apiInfo: ApiInfo;
  applicationInfo: ApplicationInfo;
  throttlingPolicy: string;
  requestedThrottlingPolicy: string;
  status: string;
  redirectionParams: any | null;
}

interface ApiInfo {
  id: string;
  name: string;
  description: string | null;
  context: string;
  version: string;
  type: string;
  createdTime: string;
  provider: string;
  lifeCycleStatus: string;
  thumbnailUri: string | null;
  avgRating: string;
  throttlingPolicies: string[];
  advertiseInfo: AdvertiseInfo;
  businessInformation: BusinessInformation;
  isSubscriptionAvailable: boolean;
  monetizationLabel: string;
  gatewayVendor: string;
  additionalProperties: any[];
  monetizedInfo: boolean;
  egress: boolean;
  subtype: string;
}

interface AdvertiseInfo {
  advertised: boolean;
  apiExternalProductionEndpoint: string | null;
  apiExternalSandboxEndpoint: string | null;
  originalDevPortalUrl: string | null;
  apiOwner: string;
  vendor: string;
}

interface BusinessInformation {
  businessOwner: string | null;
  businessOwnerEmail: string | null;
  technicalOwner: string | null;
  technicalOwnerEmail: string | null;
}

interface ApplicationInfo {
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
