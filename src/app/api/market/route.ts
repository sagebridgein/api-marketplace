import { NextResponse } from "next/server";
import axios from "axios";
import { ApiResponse } from "@/types";

export const GET = async (request: Request) => {
  try {
    const { searchParams } = new URL(request.url);
    const limit = searchParams.get("limit") || "10"; // Default value: 10
    const offset = searchParams.get("offset") || "0"; // Default value: 0

    const response = await axios.get<ApiResponse>(
      `https://app.sagebridge.in/api/am/devportal/v3/apis`,
      {
        params: {
          limit,
          offset,
        },
      }
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
