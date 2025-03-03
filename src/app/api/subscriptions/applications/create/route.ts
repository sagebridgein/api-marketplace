import { NextResponse } from "next/server";
import ServerAPI from "@/lib/axios-server-instance";
export const POST = async (request: Request) => {
  const { userId } = await request.json();
  if (!userId) {
    return NextResponse.json({ error: "User ID is required" }, { status: 400 });
  }
  try {
    const response = await ServerAPI.post("/api/am/devportal/v3/applications", {
      attributes: {},
      description: `Application for - ${userId}`,
      groups: null,
      name: userId,
      throttlingPolicy: "100PerMin",
      tokenType: "JWT",
    });

    return NextResponse.json({ applicationId: response.data.applicationId });
  } catch (error: any) {
    console.error("Axios Error:", error.response?.data || error.message);
    return NextResponse.json(
      { error: error.response?.data.description },
      { status: error.response?.data.code }
    );
  }
};
