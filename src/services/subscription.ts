import {
  ApplicationCreationResponse,
  ApplicationGetResponse,
} from "@/types/subscriptions";
import axios, { AxiosError, AxiosInstance } from "axios";

interface SubscriptionResponse {
  id: string;
  status: string;
}

interface SubscriptionError extends Error {
  code: string;
  details?: unknown;
}

class SubscriptionServiceError extends Error implements SubscriptionError {
  constructor(
    message: string,
    public code: string,
    public details?: unknown
  ) {
    super(message);
    this.name = "SubscriptionServiceError";
  }
}

export class SubscriptionService {
  private readonly api: AxiosInstance;
  private readonly baseURL = "/api/subscriptions/";
  constructor(
    private readonly userId: string,
    private readonly apiId: string,
    private readonly logger: Console = console
  ) {
    this.api = axios.create({
      baseURL: this.baseURL,
      timeout: 10000, // 10 second timeout
      headers: {
        "Content-Type": "application/json",
      },
    });
    this.api.interceptors.request.use((config) => {
      config.headers["X-Request-ID"] = crypto.randomUUID();
      return config;
    });
  }

  /**
   * Subscribe a user to a plan
   * @param tierName - The subscription tier identifier
   * @param paymentMethodId - The payment method identifier
   * @returns Promise resolving to the subscription details
   * @throws {SubscriptionServiceError} If subscription process fails
   */
  async subscribe(tierName: string, paymentMethodId?: string): Promise<SubscriptionResponse> {
    if (!this.userId) {
      throw new Error("User ID is required");
    }

    this.logger.info(
      `Starting subscription process for user ${this.userId} with tier ${tierName}`
    );

    try {
      const response = await fetch('/api/subscriptions/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: this.userId,
          apiId: this.apiId,
          tierName,
          paymentMethodId,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to create subscription');
      }

      const subscription = await response.json();
      this.logger.info(
        `Successfully subscribed user ${this.userId} to tier ${tierName}`
      );
      return subscription;
    } catch (error) {
      const errorMessage = `Subscription process failed for user ${this.userId}`;
      this.logger.error(errorMessage, { error });
      if (error instanceof SubscriptionServiceError) {
        throw error;
      }

      throw new SubscriptionServiceError(errorMessage, "UNKNOWN_ERROR", error);
    }
  }

  /**
   * Create or retrieve an application for the user
   * @returns Promise resolving to the created/existing Application
   * @throws {SubscriptionServiceError} If application creation fails
   */
  private async createApplication(): Promise<{ applicationId: string }> {
    try {
      const { data } = await this.api.post<{ applicationId: string }>(
        "/applications/create",
        {
          userId: this.userId,
        }
      );

      this.logger.info(`Application created/retrieved for user ${this.userId}`);
      return data;
    } catch (error) {
      if (error instanceof AxiosError && error.response?.status === 409) {
        this.logger.info(`Application already exists for user ${this.userId}`);
        const { data } = await this.api.get<{ applicationId: string }>(
          `/applications/get/${this.userId}`
        );
        return data;
      }

      const errorMessage = `Failed to create application for user ${this.userId}`;
      this.logger.error(errorMessage, { error });

      throw new SubscriptionServiceError(
        errorMessage,
        "APPLICATION_CREATION_ERROR",
        error
      );
    }
  }

  /**
   * Subscribe an application to a specific API plan
   * @param applicationId - The application identifier
   * @param apiId - The API identifier
   * @param plan - The subscription plan
   * @returns Promise resolving to the subscription details
   * @throws {SubscriptionServiceError} If subscription creation fails
   */
  private async subscribeToApplication(
    applicationId: string,
    apiId: string,
    plan: string
  ): Promise<SubscriptionResponse> {
    try {
      const { data } = await this.api.post<SubscriptionResponse>(
        "/subscribe",
        {
          applicationId,
          apiId,
          plan,
          userId: this.userId,
        }
      );

      this.logger.info(
        `Successfully created subscription for application ${applicationId}`
      );
      return data;
    } catch (error) {
      const errorMessage = `Failed to subscribe application ${applicationId} to API ${apiId}`;
      this.logger.error(errorMessage, { error });

      throw new SubscriptionServiceError(
        errorMessage,
        "SUBSCRIPTION_CREATION_ERROR",
        error
      );
    }
  }
}
