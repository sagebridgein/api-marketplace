import { NextResponse } from "next/server";
import ServerAPI from "@/lib/axios-server-instance";
import { TokenConfig } from "@/app/(dashboard)/dashboard/[application_id]/[api_name]/[api_id]/generate-oauth-keys/components/generate-keys-sheet";

export const POST = async (
  request: Request,
  context: { params: Promise<{application_id: string }> }
) => {
  const req: TokenConfig = await request.json();

  const resolvedParams = await context.params;
  const application_id = resolvedParams.application_id;
  const requestBody = {
    keyType: req.Type,
    grantTypesToBeSupported: ["password", "client_credentials"],
    callbackUrl: "",
    additionalProperties: {
      application_access_token_expiry_time: "N/A",
      user_access_token_expiry_time: "N/A",
      bypassClientCredentials: "false",
      id_token_expiry_time: "N/A",
      pkceMandatory: "false",
      pkceSupportPlain: "false",
      refresh_token_expiry_time: req.refreshTokenExpiry
    },
    scopes: ["default"],
    validityTime: req.accessTokenExpiry
  };

  try {
    const { data: keys } = await ServerAPI.post(
      `/api/am/devportal/v3/applications/${application_id}/generate-keys`,
      requestBody
    );
    if (!keys.list) {
      return NextResponse.json({ keys: [] });
    }
    return NextResponse.json({ keys: keys.list });
  } catch (error: any) {
    console.error("Axios Error:", error.response?.data || error.message);
    return NextResponse.json(
      { error: error.response?.data?.description || "Internal Server Error" },
      { status: error.response?.data?.code || 500 }
    );
  }
};
