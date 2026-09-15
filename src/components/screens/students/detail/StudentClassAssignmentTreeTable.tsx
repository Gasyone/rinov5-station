'use client'

import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { EmptyState } from '@/components/shared'
import { StudentClassAssignmentClassRow } from './StudentClassAssignmentClassRow'
import type { ClassRecord } from '@/mocks/classRecords'

interface StudentClassAssignmentTreeTableProps {
  classes: ClassRecord[]
  selectedClassId: string | null
  onSelectClass: (id: string) => void
  selectedSessionDate: string
  onSelectSession: (clsId: string, val: string) => void
  expandedClassIds: Set<string>
  onToggleExpandClass: (id: string) => void
  studentBranch: string
  studentLevel?: string
}

export function StudentClassAssignmentTreeTable({
  classes,
  selectedClassId,
  onSelectClass,
  selectedSessionDate,
  onSelectSession,
  expandedClassIds,
  onToggleExpandClass,
}: StudentClassAssignmentTreeTableProps) {
  if (classes.length === 0) {
    return (
      <EmptyState
        title="Không tìm thấy lớp học"
        description="Không có lớp học nào phù hợp với các tiêu chí bộ lọc hiện tại."
        className="py-12"
      />
    )
  }

  return (
    <div className="w-full">
      <Table className="w-full">
        <TableHeader className="sticky top-0 z-10 bg-background shadow-2xs">
          <TableRow className="hover:bg-transparent border-b">
            <TableHead className="w-[60px] text-center px-2 sticky top-0 bg-background z-10 border-b text-xs">
              Mở / Chọn
            </TableHead>
            <TableHead className="px-2 sticky top-0 bg-background z-10 border-b text-xs">
              Lớp học & Trạng thái
            </TableHead>
            <TableHead className="w-[45%] text-right px-2 pr-4 sticky top-0 bg-background z-10 border-b text-xs">
              Sĩ số, Phòng & Lịch học
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {classes.map((cls) => {
            const isSelected = selectedClassId === cls.id
            const isExpanded = expandedClassIds.has(cls.id)

            return (
              <StudentClassAssignmentClassRow
                key={cls.id}
                cls={cls}
                isSelected={isSelected}
                isExpanded={isExpanded}
                onToggleExpand={() => onToggleExpandClass(cls.id)}
                onSelectClass={() => onSelectClass(cls.id)}
                selectedSessionDate={selectedSessionDate}
                onSelectSession={(val) => onSelectSession(cls.id, val)}
              />
            )
          })}
        </TableBody>
      </Table>
    </div>
  )
}
