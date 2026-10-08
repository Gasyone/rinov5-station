import { NextResponse, type NextRequest } from 'next/server'

/**
 * Demo auth gating.
 *
 * Pairs with `src/app/api/auth/login/route.ts`, which sets a plain
 * `auth_session=true` cookie on successful (mock) login. This proxy:
 *
 *  - Redirects unauthenticated requests for `/app/*` to `/login`.
 *  - Bounces authenticated users away from `/login` to `/app/dashboard`.
 *
 * The cookie value is NOT a real session token — see the comment in
 * `login/route.ts` for the security caveat. Replace with a signed JWT or
 * a real session provider before this codebase goes near production.
 */
const PROTECTED_PREFIX = '/app'
const LOGIN_PATH = '/login'
const DEFAULT_AUTHED_PATH = '/app/dashboard'


export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl
  const isAuthenticated = request.cookies.get('auth_session')?.value === 'true'

  if (pathname.startsWith(PROTECTED_PREFIX) && !isAuthenticated) {
    const url = request.nextUrl.clone()
    url.pathname = LOGIN_PATH
    url.searchParams.set('redirect', pathname)
    return NextResponse.redirect(url)
  }

  if (pathname === LOGIN_PATH && isAuthenticated) {
    const url = request.nextUrl.clone()
    url.pathname = DEFAULT_AUTHED_PATH
    url.search = ''
    return NextResponse.redirect(url)
  }

  return NextResponse.next()
}

export const config = {
  // Match `/login` and any `/app/*` route. Excludes static files, API routes,
  // and Next internals so the proxy stays cheap.
  matcher: ['/login', '/app/:path*'],
}
