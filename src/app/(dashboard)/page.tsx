import { redirect } from 'next/navigation'

export default function DashboardRedirect() {
  redirect('/app/calendar_class_schedule')
}
