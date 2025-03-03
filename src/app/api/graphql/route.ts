import { NextRequest, NextResponse } from 'next/server';
import { headers as getHeaders } from 'next/headers';

// Add CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': process.env.NEXT_PUBLIC_APP_URL || '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

// Handle preflight requests
export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

export async function POST(req: NextRequest) {
  try {
    // Get the origin of the request
    const headersList =await getHeaders();
    const origin = headersList.get('origin');
    const {query,operationName}=await req.json();
    // Validate origin if needed
    if (process.env.NODE_ENV === 'production' && origin !== process.env.NEXT_PUBLIC_APP_URL) {
      return NextResponse.json(
        { errors: [{ message: 'Unauthorized origin' }] },
        { status: 403 }
      );
    }
    const authHeader = req.headers.get('authorization');
    console.log("yes getting",authHeader)
    const https_endpoint=req.headers.get('https_endpoint');
    if (!https_endpoint) {
      return NextResponse.json(
        { errors: [{ message: 'GraphQL endpoint URL is required' }] },
        { status: 400, headers: corsHeaders }
      );
    }

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { 
          errors: [{ 
            message: 'Authentication required. Please provide a Bearer token in the headers.',
            extensions: {
              code: 'UNAUTHENTICATED',
              documentation: 'Add { "Authorization": "Bearer YOUR_TOKEN" } to the Headers tab'
            }
          }] 
        },
        { status: 401, headers: corsHeaders }
      );
    }

    // Add token length validation
    const token = authHeader.split(' ')[1];
    if (token.length < 40) {
      return NextResponse.json(
        { 
          errors: [{ 
            message: 'Invalid Authorization Headers',
            extensions: {
              code: 'INVALID_TOKEN',
              documentation: 'Ensure you are using a valid token in the Headers tab'
            }
          }]   
        },
        { status: 401, headers: corsHeaders }
      );
    }

    const headers = new Headers({
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': authHeader,
    });

    const response = await fetch(https_endpoint, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        query,
        operationName: operationName || null,
      }),
    });
    const result = await response.json();

    // If the API returns an authentication error, provide a helpful message
    if (result.errors?.some((error: { message?: string }) => 
      error.message?.toLowerCase().includes('unauthorized') || 
      error.message?.toLowerCase().includes('unauthenticated')
    )) {
      result.errors = result.errors.map((error: { message: string, extensions?: any }) => ({
        ...error,
        message: `Authentication failed: ${error.message}. Please check your Bearer token.`,
        extensions: {
          ...error.extensions,
          documentation: 'Ensure you have provided a valid Bearer token in the Headers tab'
        }
      }));
    }
    console.log(result,"result")

    return NextResponse.json(result, { 
      headers: corsHeaders 
    });
  } catch (error) {
    console.error('GraphQL proxy error:', error);
    return NextResponse.json(
      { 
        errors: [{ 
          message: error instanceof Error ? error.message : 'Internal server error',
          extensions: {
            code: 'INTERNAL_SERVER_ERROR',
            documentation: 'If this persists, check your authentication token and API endpoint'
          }
        }] 
      },
      { status: 500, headers: corsHeaders }
    );
  }
} 