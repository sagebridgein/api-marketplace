import { NextResponse } from "next/server";
import ServerAPI from "@/lib/axios-server-instance";
export const GET = async (
  request: Request,
  context: { params: Promise<{ id: string }> }
) => {
  const resolvedParams = await context.params;
  const userId = resolvedParams.id;

  if (!userId) {
    return NextResponse.json(
      { error: "ID parameter is required" },
      { status: 400 }
    );
  }

  try {
    const { data: applications } = await ServerAPI.get(
      `/api/am/devportal/v3/applications?query=${userId}`
    );
    const { data: subscriptions } = await ServerAPI.get(
      `/api/am/devportal/v3/subscriptions?applicationId=${applications.list[0].applicationId}`
    );

    const subscription = subscriptions.list;
    if (!subscription) {
      return NextResponse.json({ subscriptions: [] });
    }

    return NextResponse.json({ subscriptions: subscription });
  } catch (error: any) {
    console.error("Axios Error:", error.response?.data || error.message);
    return NextResponse.json(
      { error: error.response?.data?.description || "Internal Server Error" },
      { status: error.response?.data?.code || 500 }
    );
  }
};
