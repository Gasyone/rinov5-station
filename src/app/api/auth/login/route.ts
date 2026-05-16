import { NextResponse } from 'next/server'

/**
 * MOCK AUTH — DEMO ONLY.
 *
 * No credentials are validated. This endpoint exists purely to set the
 * `auth_session` cookie that the Next middleware reads for route gating.
 * The cookie value is a literal `"true"`, NOT a signed session token — a
 * determined client could set it manually from DevTools and bypass auth.
 *
 * Do NOT ship this pattern. For production, replace with a real auth
 * provider (NextAuth, Clerk, Supabase Auth, etc.) and a signed JWT or
 * server-side session.
 */
export async function POST() {
  const response = NextResponse.json({ success: true })
  response.cookies.set('auth_session', 'true', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24,
  })
  return response
}
