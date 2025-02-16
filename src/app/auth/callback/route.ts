import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/home"; 

  if (code) {
    const supabase = await createClient();
    const { data: tokenData, error: tokenError } = await supabase.auth.exchangeCodeForSession(code);

    if (tokenError) {
      console.error("Error exchanging code for session:", tokenError); 
      return NextResponse.redirect(`${origin}/auth/auth-code-error`);
    }

    const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError) {
      console.error("Error fetching session:", sessionError);
      return NextResponse.redirect(`${origin}/auth/auth-code-error`);
    }

    if (sessionData?.session?.user) {
      const { user } = sessionData.session;
      const { data: existingUser, error: checkError } = await supabase
        .from('users')
        .select('id')
        .eq('id', user.id)
        .single();

      if (checkError) {
        console.error("Error checking user existence:", checkError);
        return NextResponse.redirect(`${origin}/auth/auth-code-error`);
      }

      if (!existingUser) {
        const { error: dbError } = await supabase
          .from('users')
          .insert([{
            id: user.id
          }]);

        if (dbError) {
          return NextResponse.redirect(`${origin}/auth/auth-code-error`);
        }

        const { error: db2Error } = await supabase.from('consumers').insert([
          {
            id: user.id,
            email: user.email
          },
        ]);

        if (db2Error) {
          throw new Error(db2Error.message);
        }
      } 
    } else {
      console.error("No user data found in session"); // Log missing user data
      return NextResponse.redirect(`${origin}/auth/auth-code-error`);
    }

    const forwardedHost = request.headers.get("x-forwarded-host"); // original origin before load balancer
    const isLocalEnv = process.env.NODE_ENV === "development";
    if (isLocalEnv) {
      return NextResponse.redirect(`${origin}${next}`);
    } else if (forwardedHost) {
      return NextResponse.redirect(`https://${forwardedHost}${next}`);
    } else {
      return NextResponse.redirect(`${origin}${next}`);
    }
  }
  return NextResponse.redirect(`${origin}/auth/auth-code-error`);
}