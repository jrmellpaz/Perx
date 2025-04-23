import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

import type { Database } from '@/lib/database.types';

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient<Database>(
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
    auth: ['/login', '/register', '/recover-password'],
    public: ['explore', 'search', '/change-password', '/'],
    private: [
      '/my-coupons',
      '/profile/missions',
      'profile/achievements',
      '/settings',
    ],
  };

  const merchantPages = {
    auth: [
      '/merchant/login',
      '/merchant/register',
      '/merchant/recover-password',
    ],
    private: [
      '/merchant/dashboard',
      '/merchant/profile/coupons',
      '/merchant/profile/collections',
      '/merchant/profile/archive',
      '/merchant/settings',
      '/merchant/scan-qr',
      '/merchant/add-coupon',
      '/merchant/edit-profile',
      '/merchant/monthly-records',
      '/merchant/trans-details',
      '/merchant/view',
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
        url.pathname = '/login';
      }
      return NextResponse.redirect(url);
    } else if (request.nextUrl.pathname === '/merchant') {
      const url = request.nextUrl.clone();
      url.pathname = '/merchant/login';
      return NextResponse.redirect(url);
    }
  } else {
    // Fetch user role from database
    const userRole: UserRole = user.user_metadata.role as UserRole;
    console.log('role:', userRole);

    // Redirect authenticated users to dashboard / home page
    if (authPages.includes(request.nextUrl.pathname)) {
      const url = request.nextUrl.clone();
      if (userRole === 'merchant') {
        url.pathname = '/merchant/dashboard';
      } else if (userRole === 'consumer') {
        url.pathname = '/explore';
      } else {
        if (request.nextUrl.pathname.startsWith('/merchant')) {
          url.pathname = '/merchant/login';
        } else {
          url.pathname = '/explore';
        }
        // throw new Error('MIDDLEWARE: Invalid user role');
      }
      return NextResponse.redirect(url);
    }

    // Restrict access to private merchant pages for non-merchants
    if (
      userRole !== 'merchant' &&
      merchantPages.private.includes(request.nextUrl.pathname)
    ) {
      const url = request.nextUrl.clone();
      url.pathname = '/explore';
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

    // Redirect merchant/profile to merchant/profile/coupons
    if (request.nextUrl.pathname === '/merchant/profile') {
      const url = request.nextUrl.clone();
      url.pathname = '/merchant/profile/coupons';
      return NextResponse.redirect(url);
    }

    // Redirect consumer/profile to profile/missions
    if (request.nextUrl.pathname === '/profile') {
      const url = request.nextUrl.clone();
      url.pathname = '/profile/missions';
      return NextResponse.redirect(url);
    }

    if (request.nextUrl.pathname === '/merchant') {
      const url = request.nextUrl.clone();
      url.pathname = '/merchant/explore';
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
