import { NextResponse } from "next/server";
import ServerAPI from "@/lib/axios-server-instance";
export const GET = async (
  request: Request,
  context: { params: Promise<{ application_id: string }> }
) => {
  const resolvedParams = await context.params;
  const application_id = resolvedParams.application_id;

  try {
    const { data: keys } = await ServerAPI.get(
      `/api/am/devportal/v3/applications/${application_id}/oauth-keys`
    );
    if (!keys.list) {
      return NextResponse.json({ keys: [] });
    }
    console.log(keys)

    return NextResponse.json({ keys: keys.list });
  } catch (error: any) {
    console.error("Axios Error:", error.response?.data || error.message);
    return NextResponse.json(
      { error: error.response?.data?.description || "Internal Server Error" },
      { status: error.response?.data?.code || 500 }
    );
  }
};
