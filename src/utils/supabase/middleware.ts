import { createServerClient } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";
import { refresh_gateway_tokens } from "@/app/actions";

const PROTECTED_ROUTES = ['/playground', '/dashboard'];
const PUBLIC_ROUTES = ['/sign-in', '/error', '/auth/callback'];

export const updateSession = async (request: NextRequest) => {
  try {
    const currentPath = request.nextUrl.pathname;

    // Skip middleware for public routes
    if (PUBLIC_ROUTES.some(route => currentPath.startsWith(route))) {
      return NextResponse.next();
    }

    // Create an unmodified response
    let response = NextResponse.next({
      request: {
        headers: request.headers,
      },
    });

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll();
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) => {
              response.cookies.set(name, value, options);
            });
          },
        },
      }
    );

    // Get user session
    const { error, data } = await supabase.auth.getUser();
    
    // Handle authentication state
    if (error) {
      // If user is not authenticated and trying to access protected routes
      if (PROTECTED_ROUTES.some(route => currentPath.startsWith(route))) {
        const signInUrl = new URL('/sign-in', request.url);
        signInUrl.searchParams.set('redirectTo', currentPath);
        return NextResponse.redirect(signInUrl);
      }
    } else {
      // User is authenticated
      try {
        // Only refresh tokens for protected routes
        if (PROTECTED_ROUTES.some(route => currentPath.startsWith(route))) {
          const refresh_gateway = await refresh_gateway_tokens(data.user.id);
          if (!refresh_gateway) {
            return NextResponse.redirect(new URL('/sign-in', request.url));
          }
        }

        // Redirect authenticated users from home to marketplace
        if (currentPath === '/') {
          return NextResponse.redirect(new URL('/marketplace', request.url));
        }
      } catch (tokenError) {
        // If token refresh fails, only redirect on protected routes
        if (PROTECTED_ROUTES.some(route => currentPath.startsWith(route))) {
          return NextResponse.redirect(new URL('/sign-in', request.url));
        }
      }
    }

    return response;
  } catch (e) {
    console.error('Middleware error:', e);
    // Don't redirect to error page if we're already on a public route
    if (PUBLIC_ROUTES.some(route => request.nextUrl.pathname.startsWith(route))) {
      return NextResponse.next();
    }
    return NextResponse.redirect(new URL('/error', request.url));
  }
};
