import { NextResponse } from "next/server";
import { OAuthKeyData } from "@/types/oauth-keys";
import ServerAPI from "@/lib/axios-server-instance";
export const POST = async (request: Request) => {
  const { applicationId } = await request.json();
  try {
    const oauthkey = await ServerAPI.get(
      `/api/am/devportal/v3/applications/${applicationId}/oauth-keys`
    );

    const oauthkeydata: OAuthKeyData = oauthkey.data.list[0];
    const response = await ServerAPI.post(
      `/api/am/devportal/v3/applications/${applicationId}/oauth-keys/${oauthkeydata.keyMappingId}/generate-token`,
      {
        additionalProperties: oauthkeydata.additionalProperties,
        consumerSecret: oauthkeydata.consumerSecret,
        revokeToken: null,
        scopes: [],
        validityPeriod:
          oauthkeydata.additionalProperties
            .application_access_token_expiry_time,
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
