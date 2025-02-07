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
   * @param plan - The subscription plan identifier
   * @throws {SubscriptionServiceError} If subscription process fails
   */
  async subscribe(plan: string): Promise<void> {
    this.logger.info(
      `Starting subscription process for user ${this.userId} with plan ${plan}`
    );

    try {
      const application = await this.createApplication();

      if (!application) {
        throw new SubscriptionServiceError(
          "Failed to create or retrieve application",
          "APPLICATION_ERROR"
        );
      }

      const subscription = await this.subscribeToApplication(
        application.applicationId,
        this.apiId,
        plan
      );

      if (!subscription) {
        throw new SubscriptionServiceError(
          "Failed to create subscription",
          "SUBSCRIPTION_ERROR"
        );
      }
      console.log("subscription", subscription);
      this.logger.info(
        `Successfully subscribed user ${this.userId} to plan ${plan}`
      );
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
        "/subscribetoapp",
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
