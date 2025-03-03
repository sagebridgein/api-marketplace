import { NextResponse } from "next/server";
import ServerAPI from "@/lib/axios-server-instance";
export const GET = async (
  request: Request,
  context: { params: Promise<{ id: string }> }
) => {
  const resolvedParams = await context.params;
  const id = resolvedParams.id;

  if (!id) {
    return NextResponse.json(
      { error: "ID parameter is required" },
      { status: 400 }
    );
  }

  try {
    const { data: applications } = await ServerAPI.get(
      `/api/am/devportal/v3/applications?query=${id}`
    );

    const application = applications.list[0];

    if (!application) {
      return NextResponse.json(
        { error: "Application not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ applicationId: application.applicationId });
  } catch (error: any) {
    console.error("Axios Error:", error.response?.data || error.message);
    return NextResponse.json(
      { error: error.response?.data?.description || "Internal Server Error" },
      { status: error.response?.data?.code || 500 }
    );
  }
};
