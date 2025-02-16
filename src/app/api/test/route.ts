import { NextRequest, NextResponse } from "next/server";
import axios, { AxiosError, Method } from "axios";

export const dynamic = 'force-dynamic';

interface RequestBody {
  method: Method;
  url: string;
  headers?: Record<string, string>;
  data?: any;
  timeout?: number;
}

export async function POST(req: NextRequest) {
  try {
    const body: RequestBody = await req.json();
    const { method, url, headers = {}, data, timeout = 30000 } = body;

    // Validate required fields
    if (!method || !url) {
      return NextResponse.json(
        { error: "Method and URL are required" },
        { status: 400 }
      );
    }

    const startTime = performance.now();

    try {
      // Make the request using axios
      const response = await axios({
        method,
        url,
        headers: {
          ...headers,
          // Add any default headers here
          'Accept': 'application/json',
        },
        data: method !== "GET" ? data : undefined,
        timeout,
        validateStatus: () => true, // Handle all status codes
      });

      const endTime = performance.now();
      const responseTime = Math.round(endTime - startTime);

      // Calculate response size
      const responseSize = new Blob([JSON.stringify(response.data)]).size;
      const formattedSize = formatSize(responseSize);

      // Return formatted response
      return NextResponse.json({
        success: true,
        response: {
          data: response.data,
          status: response.status,
          headers: response.headers,
          time: responseTime,
          size: formattedSize,
          config: {
            method,
            url,
            headers: response.config.headers,
          },
        },
      });
    } catch (error) {
      const axiosError = error as AxiosError;
      
      return NextResponse.json({
        success: false,
        error: {
          message: axiosError.message,
          status: axiosError.response?.status,
          data: axiosError.response?.data,
          code: axiosError.code,
        },
      }, {
        status: axiosError.response?.status || 500,
      });
    }
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: {
        message: "Invalid request format",
        details: error instanceof Error ? error.message : "Unknown error",
      },
    }, { status: 400 });
  }
}

// Helper function to format size
function formatSize(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
}
