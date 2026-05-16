import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'
import { MainLayout } from '@/components/layout/MainLayout'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const cookieStore = await cookies()
  const isAuthenticated = cookieStore.get('auth_session')?.value === 'true'

  if (!isAuthenticated) {
    redirect('/login')
  }

  return <MainLayout>{children}</MainLayout>
}
