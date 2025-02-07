import { authForToken, client_registration } from "@/app/actions";
import { createClient } from "@/utils/supabase/server";
import { encodedRedirect } from "@/utils/utils";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  // The `/auth/callback` route is required for the server-side auth flow implemented
  // by the SSR package. It exchanges an auth code for the user's session.
  // https://supabase.com/docs/guides/auth/server-side/nextjs
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const origin = requestUrl.origin;
  const redirectTo = requestUrl.searchParams.get("redirect_to")?.toString();

  if (code) {
    const supabase = await createClient();
    const { data } = await supabase.auth.exchangeCodeForSession(code);
    const register_client = await client_registration();
    if (!register_client) {
      return NextResponse.redirect("/404");
    }
    const gateway_tokens = await authForToken(
      register_client.clientId,
      register_client?.clientSecret
    );
    console.log(gateway_tokens);
    if (!gateway_tokens) {
      return NextResponse.redirect("/404");
    }
    const currentTime = Math.floor(Date.now() / 1000); // Current time in seconds
    const expiresAt = currentTime + gateway_tokens.expires_in;

    const { error: token_error } = await supabase
      .from("gateway_tokens")
      .insert([
        {
          user_id: data?.user?.id,
          access_token: gateway_tokens.access_token,
          refresh_token: gateway_tokens.refresh_token,
          scope: gateway_tokens.scope,
          token_type: gateway_tokens.scope,
          expires_in: expiresAt,
        },
      ]);
    console.log(token_error);
    console.log(register_client);
    if (token_error) {
      return NextResponse.redirect("/404");
    }
  }

  if (redirectTo) {
    return NextResponse.redirect(`${origin}${redirectTo}`);
  }

  // URL to redirect to after sign up process completes
  return NextResponse.redirect(`${origin}/marketplace`);
}
