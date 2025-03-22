import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
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
          cookiesToSet.forEach(({ name, value, options }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // IMPORTANT: Avoid writing any logic between createServerClient and
  // supabase.auth.getUser(). A simple mistake could make it very hard to debug
  // issues with users being randomly logged out.

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const consumerPages = {
    auth: ['/login', '/register', '/change-password'],
    public: ['home', '/recover-password'],
    private: ['/explore', '/my-coupon', '/profile', '/search', '/settings'],
  };

  const merchantPages = {
    auth: [
      '/merchant/login',
      '/merchant/register',
      '/merchant/recover-password',
      // '/merchant/change-password',
    ],
    private: [
      '/merchant/dashboard',
      '/merchant/profile',
      '/merchant/settings',
      '/merchant/scan-qr',
    ],
    public: ['/merchant/change-password'],
  };

  const authPages = [...consumerPages.auth, ...merchantPages.auth];
  const privatePages = [...consumerPages.private, ...merchantPages.private];

  type UserRole = 'merchant' | 'consumer';

  if (!user) {
    // Redirect unauthenticated users to login page
    if (privatePages.includes(request.nextUrl.pathname)) {
      const url = request.nextUrl.clone();
      if (request.nextUrl.pathname.startsWith('/merchant')) {
        url.pathname = '/merchant/login';
      } else {
        url.pathname = '/home';
      }
      return NextResponse.redirect(url);
    }
  } else {
    // Fetch user role from database
    const { data, error } = await supabase
      .from('users')
      .select('role')
      .eq('id', user.id)
      .single();

    if (error) {
      throw new Error(error.message);
    }

    const userRole: UserRole = data.role;
    console.log('role:', userRole);

    // Redirect authenticated users to dashboard / home page
    if (authPages.includes(request.nextUrl.pathname)) {
      const url = request.nextUrl.clone();
      if (userRole === 'merchant') {
        url.pathname = '/merchant/dashboard';
      } else if (userRole === 'consumer') {
        url.pathname = '/explore';
      } else {
        throw new Error('MIDDLEWARE: Invalid user role');
      }
      return NextResponse.redirect(url);
    }

    // Restrict access to private merchant pages for non-merchants
    if (
      userRole !== 'merchant' &&
      merchantPages.private.includes(request.nextUrl.pathname)
    ) {
      const url = request.nextUrl.clone();
      url.pathname = '/home';
      return NextResponse.redirect(url);
    }

    // Restrict access to private consumer pages for non-consumers
    if (
      userRole !== 'consumer' &&
      consumerPages.private.includes(request.nextUrl.pathname)
    ) {
      const url = request.nextUrl.clone();
      url.pathname = '/merchant/login';
      return NextResponse.redirect(url);
    }
  }

  // IMPORTANT: You *must* return the supabaseResponse object as it is. If you're
  // creating a new response object with NextResponse.next() make sure to:
  // 1. Pass the request in it, like so:
  //    const myNewResponse = NextResponse.next({ request })
  // 2. Copy over the cookies, like so:
  //    myNewResponse.cookies.setAll(supabaseResponse.cookies.getAll())
  // 3. Change the myNewResponse object to fit your needs, but avoid changing
  //    the cookies!
  // 4. Finally:
  //    return myNewResponse
  // If this is not done, you may be causing the browser and server to go out
  // of sync and terminate the user's session prematurely!

  return supabaseResponse;
}
