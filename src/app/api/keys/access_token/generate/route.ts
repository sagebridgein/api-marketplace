import { NextResponse } from "next/server";
import axios from "axios";
import { createClient } from "@/utils/supabase/server";
import { OAuthKeyData } from "@/types/oauth-keys";
export const POST = async (request: Request) => {
  const supabase = await createClient();
  const { userId, applicationId } = await request.json();
  try {
    const { data, error } = await supabase
      .from("gateway_tokens")
      .select("access_token")
      .eq("user_id", userId)
      .single();

    if (error || !data) {
      console.error("Supabase Error:", error);
      return NextResponse.json(
        { error: "Gateway access_token not found" },
        { status: 404 }
      );
    }
    const oauthkey = await axios.get(
      `https://app.sagebridge.in/api/am/devportal/v3/applications/${applicationId}/oauth-keys`,
      {
        headers: {
          Authorization: `Bearer ${data.access_token}`,
          "Content-Type": "application/json",
        },
      }
    );

    const oauthkeydata: OAuthKeyData = oauthkey.data.list[0];
    console.log(oauthkeydata);
    const response = await axios.post(
      `https://app.sagebridge.in/api/am/devportal/v3/applications/${applicationId}/oauth-keys/${oauthkeydata.keyMappingId}/generate-token`,
      {
        additionalProperties: oauthkeydata.additionalProperties,
        consumerSecret: oauthkeydata.consumerSecret,
        revokeToken: null,
        scopes: [],
        validityPeriod:
          oauthkeydata.additionalProperties
            .application_access_token_expiry_time,
      },
      {
        headers: {
          Authorization: `Bearer ${data.access_token}`,
          "Content-Type": "application/json",
        },
      }
    );
    return NextResponse.json(response.data);
  } catch (error: any) {
    console.error("Axios Error:", error.response?.data || error.message);
    return NextResponse.json(
      { error: "An error occurred while creating the application." },
      { status: 500 }
    );
  }
};
