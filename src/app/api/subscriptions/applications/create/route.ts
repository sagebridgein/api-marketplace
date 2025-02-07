import { NextResponse } from "next/server";
import axios from "axios";
import { createClient } from "@/utils/supabase/server";

export const POST = async (request: Request) => {
  const supabase = await createClient();
  const { userId } = await request.json();
  if (!userId) {
    return NextResponse.json({ error: "User ID is required" }, { status: 400 });
  }
  try {
    const { data, error } = await supabase
      .from("gateway_tokens")
      .select("access_token")
      .eq("user_id", userId)
      .single();
    console.log(data);
    if (error) {
      console.error("Supabase Error:", error);
      return NextResponse.json(
        { error: "Gateway access_token not found" },
        { status: 404 }
      );
    }

    const response = await axios.post(
      "https://app.sagebridge.in/api/am/devportal/v3/applications",
      {
        attributes: {},
        description: `Application for - ${userId}`,
        groups: null,
        name: userId,
        throttlingPolicy: "100PerMin",
        tokenType: "JWT",
      },
      {
        headers: {
          Authorization: `Bearer ${data.access_token}`,
          "Content-Type": "application/json",
        },
      }
    );

    return NextResponse.json({ applicationId: response.data.applicationId });
  } catch (error: any) {
    console.error("Axios Error:", error.response?.data || error.message);
    return NextResponse.json(
      { error: error.response?.data.description },
      { status: error.response?.data.code }
    );
  }
};
