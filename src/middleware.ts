import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // ---------------------------------------------------------------------------
  // TOGGLE MAINTENANCE MODE:
  // - To DISABLE maintenance and restore normal behavior, UNCOMMENT the line below:
  // return NextResponse.next();
  // ---------------------------------------------------------------------------

  const { pathname } = request.nextUrl;

  // Bypass public assets, API routes, and standard favicon/image/pdf requests
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/favicon.ico') ||
    pathname.startsWith('/MOHAK_KAPOOR_ML.pdf') ||
    pathname.includes('.') ||
    pathname === '/maintenance'
  ) {
    return NextResponse.next();
  }

  // Rewrite all requests internally to the /maintenance page
  const url = request.nextUrl.clone();
  url.pathname = '/maintenance';
  return NextResponse.rewrite(url);
}

export const config = {
  matcher: [
    // Intercept all routes except public files and static content
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
