import { NextResponse } from "next/server";
import axios from "axios";
import { createClient } from "@/utils/supabase/server";

export const GET = async (
  request: Request,
  context: { params: Promise<{ id: string }> }
) => {
  const supabase = await createClient();
  const resolvedParams = await context.params;
  const id = resolvedParams.id;

  if (!id) {
    return NextResponse.json(
      { error: "ID parameter is required" },
      { status: 400 }
    );
  }

  try {
    const { data, error } = await supabase
      .from("gateway_tokens")
      .select("access_token")
      .eq("user_id", id)
      .single();

    if (error) {
      console.error("Supabase Error:", error);
      return NextResponse.json(
        { error: "Gateway access_token not found" },
        { status: 404 }
      );
    }

    const { data: applications } = await axios.get(
      `https://app.sagebridge.in/api/am/devportal/v3/applications?query=${id}`,
      {
        headers: {
          Authorization: `Bearer ${data.access_token}`,
          "Content-Type": "application/json",
        },
      }
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
