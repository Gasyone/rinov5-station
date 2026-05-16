import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'

export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const cookieStore = await cookies()
  const isAuthenticated = cookieStore.get('auth_session')?.value === 'true'

  if (isAuthenticated) {
    redirect('/app/dashboard')
  }

  return <>{children}</>
}
