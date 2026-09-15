import { redirect } from 'next/navigation'

export default async function StudentDetailRoutePage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  redirect(`/app/students?studentId=${id}`)
}
