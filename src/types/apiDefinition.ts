export interface ApiDefinition {
    openapi: string;
    info: ApiInfo;
    servers: Server[];
    security: Security[];
    paths: Record<string, PathMethods>;
    components: Components;
    xWSO2ApiKeyHeader: string;
  }
  
  export interface ApiInfo {
    title: string;
    version: string;
  }
  
  export interface Server {
    url: string;
  }
  
  export interface Security {
    [key: string]: string[];
  }
  
  export interface PathMethods {
    get?: HttpMethod;
    post?: HttpMethod;
    put?: HttpMethod;
    delete?: HttpMethod;
    patch?: HttpMethod;
  }
  
  export interface HttpMethod {
    responses: Record<string, ResponseDetail>;
    security: Security[];
    xAuthType?: string;
    xThrottlingTier?: string;
  }
  
  export interface ResponseDetail {
    description: string;
  }
  
  export interface Components {
    securitySchemes: Record<string, SecurityScheme>;
  }
  
  export interface SecurityScheme {
    type: string;
    flows: OAuthFlows;
  }
  
  export interface OAuthFlows {
    implicit?: OAuthFlow;
  }
  
  export interface OAuthFlow {
    authorizationUrl: string;
    scopes: Record<string, string>;
  }
  