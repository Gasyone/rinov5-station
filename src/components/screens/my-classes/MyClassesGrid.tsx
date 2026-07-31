'use client'

import { CalendarDays } from 'lucide-react'
import { EmptyState } from '@/components/shared'
import type { ClassRecord } from '@/mocks/classRecords'
import { MyClassCard } from './MyClassCard'

interface MyClassesGridProps {
  classes: ClassRecord[]
  onOpenDetail: (cls: ClassRecord, tab?: string) => void
}

export function MyClassesGrid({ classes, onOpenDetail }: MyClassesGridProps) {
  if (classes.length === 0) {
    return (
      <div className="rounded-xl border bg-card p-12 text-center">
        <EmptyState
          icon={<CalendarDays className="h-8 w-8 text-muted-foreground" />}
          title="Không tìm thấy lớp học nào phù hợp"
          description="Thử điều chỉnh từ khóa tìm kiếm, môn học, chi nhánh hoặc bộ lọc trạng thái."
        />
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
      {classes.map((cls) => (
        <MyClassCard key={cls.id} cls={cls} onOpenDetail={onOpenDetail} />
      ))}
    </div>
  )
}
