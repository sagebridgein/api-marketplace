export interface API {
    id: string;
    name: string;
    description: string | null;
    context: string;
    version: string;
    provider: string;
    apiDefinition: string;
    wsdlUri: string | null;
    lifeCycleStatus: string;
    isDefaultVersion: boolean;
    type: string;
    transport: string[];
    operations: any[]; // Can be replaced with a specific type if operations structure is known
    authorizationHeader: string;
    apiKeyHeader: string;
    securityScheme: string[];
    tags: string[];
    tiers: Tier[];
    hasThumbnail: boolean;
    additionalProperties: AdditionalProperty[];
    monetization: Monetization;
    endpointURLs: EndpointURL[];
    businessInformation: BusinessInformation;
    environmentList: string[];
    scopes: string[];
    avgRating: string;
    subscriptions: number;
    advertiseInfo: AdvertiseInfo;
    isSubscriptionAvailable: boolean;
    categories: string[];
    keyManagers: string[];
    createdTime: string;
    lastUpdatedTime: string | null;
    gatewayVendor: string;
    asyncTransportProtocols: string[];
    egress: boolean;
    subtype: string;
    updatedAt: string;
    totalUsers: number;
    category?: string;
    logoUrl?: string;
    documentation?: string;
  }
  
  export interface Tier {
    tierName: string;
    tierPlan: string;
    monetizationAttributes: MonetizationAttributes;
  }
  
  export interface MonetizationAttributes {
    fixedPrice: string;
    pricePerRequest: string | null;
    currencyType: string;
    billingCycle: string;
  }
  
  export interface AdditionalProperty {
    name: string;
    value: string;
    display: boolean;
  }
  
  export interface Monetization {
    enabled: boolean;
  }
  
  export interface EndpointURL {
    environmentName: string;
    environmentDisplayName: string;
    environmentType: string;
    URLs: URLSet;
    defaultVersionURLs: URLSet;
  }
  
  export interface URLSet {
    http: string | null;
    https: string | null;
    ws: string | null;
    wss: string | null;
  }
  
  export interface BusinessInformation {
    businessOwner: string;
    businessOwnerEmail: string;
    technicalOwner: string;
    technicalOwnerEmail: string;
  }
  
  export interface AdvertiseInfo {
    advertised: boolean;
    apiExternalProductionEndpoint: string | null;
    apiExternalSandboxEndpoint: string | null;
    originalDevPortalUrl: string | null;
    apiOwner: string;
    vendor: string;
  }
  