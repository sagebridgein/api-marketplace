import { NextResponse } from "next/server";
import ServerAPI from "@/lib/axios-server-instance";
export const POST = async (request: Request) => {
  const { applicationId, apiId, plan } = await request.json();
  if (!applicationId || !apiId || !plan) {
    return NextResponse.json(
      { error: "provide all the details" },
      { status: 400 }
    );
  }
  try {
    ServerAPI.post("/api/am/devportal/v3/subscriptions", {
      apiId,
      applicationId: applicationId,
      throttlingPolicy: plan,
    });
    return NextResponse.json({
      message: "subscription created successfully",
      status: 200,
    });
  } catch (error: any) {
    console.error("Axios Error:", error.response?.data || error.message);
    return NextResponse.json(
      { error: "An error occurred while creating the application." },
      { status: 500 }
    );
  }
};
