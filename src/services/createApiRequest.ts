import axios, { AxiosInstance, AxiosRequestConfig, Method } from "axios";

export class createApiRequest {
  private axiosInstance: AxiosInstance;
  private method: Method;
  private headers: Record<string, string>;
  private params: Record<string, any>;

  constructor(
    url: string,
    method: Method = "GET", // Default to GET if not specified
    headers: Record<string, string> = {},
    params: Record<string, any> = {}
  ) {
    this.method = method;
    this.headers = headers;
    this.params = params;

    this.axiosInstance = axios.create({
      baseURL: url,
      headers: this.headers,
      params: this.params,
    });
  }

  // Generic request method to handle all HTTP methods dynamically
  async request<T>(endpoint: string, data?: any, config: AxiosRequestConfig = {}): Promise<T> {
    try {
      const response = await this.axiosInstance.request<T>({
        url: endpoint,
        method: this.method, // Use the method defined in the constructor
        data,
        ...config,
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Error handling
  private handleError(error: any) {
    if (axios.isAxiosError(error)) {
      return error.response?.data || { error: "Unknown error occurred" };
    }
    return { error: "Something went wrong" };
  }
}
