import { type NextRequest } from 'next/server';
import { updateSession } from '@/lib/supabase/middleware';

export async function middleware(request: NextRequest) {
  return await updateSession(request);
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - icons (PWA icon files)
     * - sw.js (service worker)
     * - manifest.json (web app manifest)
     * - offline (offline fallback route)
     */
    '/((?!_next/static|_next/image|favicon.ico|icons|sw.js|manifest.json|offline|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
