'use client'

import { use } from 'react'
import { mockTeachers } from '@/mocks/teacherRecords'
import { TeacherDetailScreen } from '@/components/screens/teachers/TeacherDetailScreen'

export default function TeacherDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const teacher = mockTeachers.find((t) => t.id === id) || null

  return (
    <div className="h-full min-h-0">
      <TeacherDetailScreen teacher={teacher} />
    </div>
  )
}
