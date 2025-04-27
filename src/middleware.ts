import { NextRequest, NextResponse } from 'next/server';

// Define pages that should be preloaded
const PRELOAD_PATHS = [
  '/protected',
  '/protected/rooms',
  '/protected/alerts',
  '/protected/staffing',
  '/protected/map',
  '/protected/settings',
  '/protected/user-guide',
];

export function middleware(request: NextRequest) {
  const url = request.nextUrl.clone();
  const response = NextResponse.next();

  // Add optimization headers
  if (PRELOAD_PATHS.some(path => url.pathname.startsWith(path))) {
    // Add cache control for static assets
    response.headers.set('Cache-Control', 'public, max-age=31536000, immutable');
    // Add preload header for improved loading performance
    response.headers.set('X-DNS-Prefetch-Control', 'on');
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}; 