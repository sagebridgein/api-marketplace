import { NextResponse } from "next/server";
import axios from "axios";
import { ApiResponse } from "@/types";

export const GET = async (
  request: Request,
  context: { params: Promise<{ id: string }> }
) => {
  try {
    const resolvedParams = await context.params;
    const id = resolvedParams.id;

    const response = await axios.get<ApiResponse>(
      `https://app.sagebridge.in/api/am/devportal/v3/apis/${id}`
    );

    return NextResponse.json(response.data);
  } catch (error) {
    console.error("Error fetching data:", error);
    return NextResponse.json(
      { error: "An error occurred while fetching data." },
      { status: 500 }
    );
  }
};
