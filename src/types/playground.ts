export type Method = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

export type AuthType = 'none' | 'bearer' | 'basic' | 'apiKey';

export interface RequestHeaders {
  [key: string]: string;
}

export interface Environment {
  baseUrl: string;
  variables: RequestHeaders;
}

export interface ApiResponse {
  data: any;
  status: number;
  headers: any;
  time: number;
  size: string;
  config?: any;
}

export interface ApiError {
  message: string;
  status?: number;
  details?: any;
  code?: string;
  config?: any;
}

export interface Auth {
  type: AuthType;
  token?: string;
  username?: string;
  password?: string;
  keyName?: string;
  keyValue?: string;
}

export interface HistoryEntry {
  timestamp: number;
  method: string;
  url: string;
  response: ApiResponse;
}

export type ActiveTab = 'params' | 'headers' | 'body' | 'authorizations';