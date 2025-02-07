import { NextResponse } from "next/server";
import axios from "axios";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export const POST = async (request: Request) => {
  const supabase = await createClient();
  const { applicationId, apiId, plan,userId } = await request.json();
  if (!applicationId || !apiId || !plan) {
    return NextResponse.json({ error: "provide all the details" }, { status: 400 });
  }
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

    const response = await axios.post(
      "https://app.sagebridge.in/api/am/devportal/v3/subscriptions",
      {
        apiId,
        applicationId: applicationId,
        throttlingPolicy: plan,
      },
      {
        headers: {
          Authorization: `Bearer ${data.access_token}`,
          "Content-Type": "application/json",
        },
      }
    );
    console.log(response.data)
    return NextResponse.json({message:"subscription created successfully",status:200})
  } catch (error: any) {
    console.error("Axios Error:", error.response?.data || error.message);
    return NextResponse.json(

      { error: "An error occurred while creating the application." },
      { status: 500 }
    );
  }
};
