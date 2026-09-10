'use client'

import { use } from 'react'
import { useRouter } from 'next/navigation'
import { StudentDetailPage } from '@/components/screens/students/detail/StudentDetailPage'

export default function StudentDetailRoutePage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)
  const router = useRouter()

  return (
    <div className="h-full min-h-0">
      <StudentDetailPage
        studentId={id}
        onBack={() => router.push('/app/students')}
      />
    </div>
  )
}
