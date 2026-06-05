import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export default async function RootPage() {
  const cookieStore = await cookies()
  const isAuthenticated = cookieStore.get('auth_session')?.value === 'true'

  if (isAuthenticated) {
    redirect('/app/calendar_class_schedule')
  }
  redirect('/login')
}
