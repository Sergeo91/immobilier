import createMiddleware from 'next-intl/middleware';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { routing } from '@/i18n/routing';

const SUPER_ADMIN_PATH = process.env.SUPER_ADMIN_SECRET_PATH || 'ss91-admin-global';

const intlMiddleware = createMiddleware(routing);

export function middleware(req: NextRequest) {
  const pathname = req.nextUrl.pathname;
  // Super Admin et API sans préfixe locale
  if (pathname === `/${SUPER_ADMIN_PATH}` || pathname.startsWith('/api')) {
    return NextResponse.next();
  }
  // Mode maintenance
  if (process.env.MAINTENANCE_MODE === 'true') {
    return new NextResponse(
      JSON.stringify({ error: 'Maintenance en cours' }),
      { status: 503, headers: { 'Content-Type': 'application/json' } }
    );
  }
  return intlMiddleware(req);
}

export const config = {
  matcher: ['/((?!api|_next|_vercel|ss91-admin-global|.*\\..*).*)'],
};
