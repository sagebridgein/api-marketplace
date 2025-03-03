import { NextResponse } from "next/server";
import axios from "axios";
import { API_GATEWAY } from "@/constants";

export const GET = async (request: Request) => {
  try {
    const { data } = await axios.get(`${API_GATEWAY}/api/am/devportal/v3/tags`);
    return NextResponse.json({ ...data });
  } catch (error) {
    console.error("Error fetching tags:", error);
    return NextResponse.json(
      { error: "Failed to fetch tags" },
      { status: 500 }
    );
  }
};
