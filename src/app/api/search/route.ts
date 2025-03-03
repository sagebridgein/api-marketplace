import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import { API_GATEWAY } from "@/constants";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get("query");

    if (!query) {
      return NextResponse.json(
        { message: "Search query is required" },
        { status: 400 }
      );
    }

    const response = await axios.get(
      `${API_GATEWAY}/api/am/devportal/v3/search?query=${query}`,
      {
        headers: {
          Accept: "application/json",
        },
      }
    );

    return NextResponse.json(response.data);
  } catch (error: any) {
    console.error("Search API error:", error);
    if (error.response) {
      return NextResponse.json(
        { message: error.response.data?.message || "Search request failed" },
        { status: error.response.status }
      );
    }

    // Handle network or other errors
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
