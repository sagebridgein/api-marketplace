export interface ApiEndpoint {
  method: "GET" | "POST" | "PUT" | "DELETE";
  path: string;
  description: string;
  version: string;
  category: string;
}

export interface ApiResponse {
  status: number;
  headers: Record<string, string>;
  data: any;
}


export interface AdvertiseInfo {
  advertised: boolean;
  apiExternalProductionEndpoint: string | null;
  apiExternalSandboxEndpoint: string | null;
  originalDevPortalUrl: string | null;
  apiOwner: string | null;
  vendor: string;
}

interface BusinessInformation {
  businessOwner: string | null;
  businessOwnerEmail: string | null;
  technicalOwner: string | null;
  technicalOwnerEmail: string | null;
}

export interface ApiList {
  id: string;
  name: string;
  description?: string | null;
  context: string;
  version: string;
  type: string;
  createdTime?: string | null;
  provider: string;
  lifeCycleStatus: string;
  thumbnailUri?: string | null;
  avgRating: string;
  throttlingPolicies: string[];
  advertiseInfo: AdvertiseInfo;
  businessInformation: BusinessInformation;
  isSubscriptionAvailable: boolean;
  monetizationLabel: string | null;
  gatewayVendor: string;
  additionalProperties: any[];
  monetizedInfo: boolean;
  egress: boolean;
  subtype: string;
}

export interface Pagination {
  offset: number;
  limit: number;
  total: number;
  next: string;
  previous: string;
}