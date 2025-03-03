"use server";

import { encodedRedirect } from "@/utils/utils";
import { createClient } from "@/utils/supabase/server";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import axios from "axios";
import qs from "qs";
import { ClientConfig, GatewayToken } from "@/types/gateway";
const GATEWAY_URL = process.env.NEXT_PUBLIC_API_GATEWAY;
const ADMIN_USERNAME = process.env.NEXT_PUBLIC_ADMIN_USERNAME;
const ADMIN_PASSWORD = process.env.NEXT_PUBLIC_ADMIN_PASSWORD;
const GATEWAY_TOKEN_TABLE = "gateway_tokens";

if (!ADMIN_PASSWORD || !ADMIN_USERNAME) {
  throw new Error("username and password of platform is not find");
}

export const signUpAction = async (formData: FormData) => {
  const email = formData.get("email")?.toString();
  const password = formData.get("password")?.toString();
  const supabase = await createClient();
  const origin = (await headers()).get("origin");

  if (!email || !password) {
    return encodedRedirect(
      "error",
      "/sign-up",
      "Email and password are required"
    );
  }

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${origin}/auth/callback`,
    },
  });

  if (error) {
    console.error(error.code + " " + error.message);
    return encodedRedirect("error", "/sign-up", error.message);
  } else {
    return encodedRedirect(
      "success",
      "/sign-up",
      "Thanks for signing up! Please check your email for a verification link."
    );
  }
};

export const signInAction = async (formData: FormData) => {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const supabase = await createClient();

  const { error, data } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return encodedRedirect("error", "/sign-in", error.message);
  }
  const register_client = await client_registration();
  if (!register_client) {
    return encodedRedirect(
      "error",
      "/sign-in",
      "something went wrong please trying again later"
    );
  }
  const gateway_tokens = await authForToken(
    register_client.clientId,
    register_client.clientSecret
  );
  console.log(gateway_tokens);
  if (!gateway_tokens) {
    return encodedRedirect(
      "error",
      "/sign-in",
      "something went wrong please trying again later"
    );
  }

  const { error: token_error } = await supabase
    .from("gateway_tokens")
    .update([
      {
        access_token: gateway_tokens.access_token,
        refresh_token: gateway_tokens.refresh_token,
        scope: gateway_tokens.scope,
        token_type: gateway_tokens.scope,
        expires_in: gateway_tokens.expires_in,
      },
    ])
    .eq("user_id", data.user.id);
  if (token_error) {
    return encodedRedirect("error", "/sign-in", "Please create a new account");
  }
  return redirect("/marketplace");
};

export const forgotPasswordAction = async (formData: FormData) => {
  const email = formData.get("email")?.toString();
  const supabase = await createClient();
  const origin = (await headers()).get("origin");
  const callbackUrl = formData.get("callbackUrl")?.toString();

  if (!email) {
    return encodedRedirect("error", "/forgot-password", "Email is required");
  }

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${origin}/auth/callback?redirect_to=/protected/reset-password`,
  });

  if (error) {
    console.error(error.message);
    return encodedRedirect(
      "error",
      "/forgot-password",
      "Could not reset password"
    );
  }

  if (callbackUrl) {
    return redirect(callbackUrl);
  }

  return encodedRedirect(
    "success",
    "/forgot-password",
    "Check your email for a link to reset your password."
  );
};

export const resetPasswordAction = async (formData: FormData) => {
  const supabase = await createClient();

  const password = formData.get("password") as string;
  const confirmPassword = formData.get("confirmPassword") as string;

  if (!password || !confirmPassword) {
    encodedRedirect(
      "error",
      "/protected/reset-password",
      "Password and confirm password are required"
    );
  }

  if (password !== confirmPassword) {
    encodedRedirect(
      "error",
      "/protected/reset-password",
      "Passwords do not match"
    );
  }

  const { error } = await supabase.auth.updateUser({
    password: password,
  });

  if (error) {
    encodedRedirect(
      "error",
      "/protected/reset-password",
      "Password update failed"
    );
  }

  encodedRedirect("success", "/protected/reset-password", "Password updated");
};

export const signOutAction = async () => {
  const supabase = await createClient();
  await supabase.auth.signOut();
  return redirect("/sign-in");
};

export const client_registration = async (): Promise<ClientConfig | null> => {
  try {
    const payload = {
      callbackUrl: "www.google.lk",
      clientName: "rest_api_devportal",
      owner: "admin",
      grantType: "client_credentials password refresh_token",
      saasApp: true,
    };

    const { data } = await axios.post(
      `${GATEWAY_URL}/client-registration/v0.17/register`,

      JSON.stringify(payload),

      {
        headers: {
          Authorization: basicAuth(ADMIN_USERNAME, ADMIN_PASSWORD),
          "Content-Type": "application/json",
        },
      }
    );
    return data;
  } catch (error) {
    return null;
  }
};

export const authForToken = async (
  client: string,
  secret: string
): Promise<GatewayToken | null> => {
  try {
    const payload = qs.stringify({
      grant_type: "password",
      username: ADMIN_USERNAME,
      password: ADMIN_PASSWORD,
      scope: "apim:subscribe apim:api_key",
    });
    const { data } = await axios.post(`${GATEWAY_URL}/oauth2/token`, payload, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: basicAuth(client, secret),
      },
    });
    return data;
  } catch (error) {
    return null;
  }
};

export const refresh_gateway_tokens = async (
  user_id: string
): Promise<boolean> => {
  const supabase = await createClient();

  try {
    const { data, error } = await supabase
      .from(GATEWAY_TOKEN_TABLE)
      .select("expires_in")
      .eq("user_id", user_id)
      .single();

    if (error || !data) {
      console.error("Token fetch error:", error);
      redirect("/sign-in");
    }

    const currentTime = Math.floor(Date.now() / 1000);

    if (currentTime > data.expires_in) {
      console.log("Token expired, refreshing...");

      const register_client = await client_registration();
      if (!register_client) {
        return encodedRedirect(
          "error",
          "/sign-in",
          "Something went wrong, please try again later"
        );
      }

      const gateway_tokens = await authForToken(
        register_client.clientId,
        register_client.clientSecret
      );

      if (!gateway_tokens) {
        return false;
      }

      const newExpiry = currentTime + gateway_tokens.expires_in;

      const { error: token_error } = await supabase
        .from(GATEWAY_TOKEN_TABLE)
        .update([
          {
            user_id,
            access_token: gateway_tokens.access_token,
            refresh_token: gateway_tokens.refresh_token,
            scope: gateway_tokens.scope,
            token_type: gateway_tokens.token_type,
            expires_in: newExpiry,
          },
        ])
        .eq("user_id", user_id);

      if (token_error) {
        console.error("Token update error:", token_error);
        return false;
      }
      return true;
    }

    return true;
  } catch (error) {
    console.error("Unexpected error:", error);
    redirect("/sign-in");
  }
};

function basicAuth(client: string, secret: string) {
  return `Basic ${Buffer.from(`${client}:${secret}`).toString("base64")}`;
}
