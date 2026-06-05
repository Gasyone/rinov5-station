'use client'

import { useMemo, useState, Fragment } from 'react'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import type { StudentCareAlert } from '@/mocks/careAlerts'
import { OperationsAlertTableRow } from './OperationsAlertTableRow'
import { OperationsAlertTableSubRow } from './OperationsAlertTableSubRow'

interface OperationsAlertTableProps {
  alerts: StudentCareAlert[]
  onTagnhep: (student: StudentCareAlert) => void
  selectedIds: string[]
  onSelectChange: (id: string, checked: boolean) => void
  onSelectAll: (checked: boolean) => void
}

interface GroupedStudentAlert {
  studentId: string
  studentName: string
  customerCode?: string
  studentFolderLink: string
  csStaff: string
  classes: StudentCareAlert[]
}

export function OperationsAlertTable({
  alerts,
  onTagnhep,
  selectedIds,
  onSelectChange,
  onSelectAll,
}: OperationsAlertTableProps) {
  // Group the flat alerts by studentId on the fly
  const groupedAlerts = useMemo(() => {
    const groups: Record<string, StudentCareAlert[]> = {}
    for (const alert of alerts) {
      if (!groups[alert.studentId]) {
        groups[alert.studentId] = []
      }
      groups[alert.studentId].push(alert)
    }

    return Object.entries(groups).map(([studentId, list]) => {
      const first = list[0]
      return {
        studentId,
        studentName: first.studentName,
        customerCode: first.customerCode,
        studentFolderLink: first.studentFolderLink,
        csStaff: first.csStaff,
        classes: list,
      } as GroupedStudentAlert
    })
  }, [alerts])

  // Track expanded student IDs
  const [expandedStudentIds, setExpandedStudentIds] = useState<string[]>([])

  const toggleExpand = (studentId: string) => {
    setExpandedStudentIds((prev) =>
      prev.includes(studentId)
        ? prev.filter((id) => id !== studentId)
        : [...prev, studentId]
    )
  }

  // Handle select/deselect all classes of a student
  const handleStudentSelectChange = (student: GroupedStudentAlert, checked: boolean) => {
    student.classes.forEach((c) => {
      onSelectChange(c.id, checked)
    })
  }

  const allSelected = alerts.length > 0 && alerts.every((item) => selectedIds.includes(item.id))

  return (
    <Table containerClassName="min-w-full overflow-visible" className="min-w-[1600px] align-top">
      <TableHeader className="sticky top-0 bg-background z-20 shadow-[0_1px_0_0_rgba(0,0,0,0.05)]">
        <TableRow className="hover:bg-transparent border-b border-border bg-muted/30">
            {/* 1. Checkbox */}
            <TableHead className="w-12 text-center text-xs font-semibold uppercase tracking-wider py-3 px-4 sticky top-0 bg-background z-20">
              <div className="flex justify-center">
                <Checkbox
                  checked={allSelected}
                  onCheckedChange={(val) => onSelectAll(!!val)}
                  aria-label="Chọn tất cả"
                />
              </div>
            </TableHead>
            {/* 2. Student / Subject */}
            <TableHead className="min-w-[200px] text-xs font-bold uppercase tracking-wider py-3 px-4 sticky top-0 bg-background z-20">
              Học viên / Môn
            </TableHead>
            {/* 3. Điện thoại */}
            <TableHead className="min-w-[160px] text-xs font-bold uppercase tracking-wider py-3 px-4 sticky top-0 bg-background z-20">
              Liên hệ
            </TableHead>
            {/* 4. Lớp học */}
            <TableHead className="min-w-[180px] text-xs font-bold uppercase tracking-wider py-3 px-4 sticky top-0 bg-background z-20">
              Lớp học
            </TableHead>
            {/* 5. Cấp độ */}
            <TableHead className="min-w-[120px] text-xs font-bold uppercase tracking-wider py-3 px-4 sticky top-0 bg-background z-20">
              Cấp độ
            </TableHead>
            {/* 6. Sub-level */}
            <TableHead className="min-w-[100px] text-xs font-bold uppercase tracking-wider text-center py-3 px-4 sticky top-0 bg-background z-20">
              Sub-level
            </TableHead>
            {/* 7. Ngày bắt đầu */}
            <TableHead className="min-w-[120px] text-xs font-bold uppercase tracking-wider py-3 px-4 sticky top-0 bg-background z-20">
              Ngày bắt đầu
            </TableHead>
            {/* 8. Hạn học dự kiến */}
            <TableHead className="min-w-[130px] text-xs font-bold uppercase tracking-wider py-3 px-4 sticky top-0 bg-background z-20">
              Hạn học dự kiến
            </TableHead>
            {/* 9. Trạng thái học */}
            <TableHead className="min-w-[130px] text-xs font-bold uppercase tracking-wider py-3 px-4 sticky top-0 bg-background z-20">
              Trạng thái học
            </TableHead>
            {/* 10. Trạng thái lớp */}
            <TableHead className="min-w-[130px] text-xs font-bold uppercase tracking-wider py-3 px-4 sticky top-0 bg-background z-20">
              Trạng thái lớp
            </TableHead>
            {/* 11. Giáo viên */}
            <TableHead className="min-w-[140px] text-xs font-bold uppercase tracking-wider py-3 px-4 sticky top-0 bg-background z-20">
              Giáo viên
            </TableHead>
            {/* 12. Lịch học */}
            <TableHead className="min-w-[220px] text-xs font-bold uppercase tracking-wider py-3 px-4 sticky top-0 bg-background z-20">
              Lịch học
            </TableHead>
            {/* 13. Tổng buổi */}
            <TableHead className="min-w-[100px] text-xs font-bold uppercase tracking-wider text-center py-3 px-4 sticky top-0 bg-background z-20">
              Tổng buổi
            </TableHead>
            {/* 14. Còn lại */}
            <TableHead className="min-w-[100px] text-xs font-bold uppercase tracking-wider text-center py-3 px-4 sticky top-0 bg-background z-20">
              Còn lại
            </TableHead>
            {/* 15. Chuyên cần */}
            <TableHead className="min-w-[150px] text-xs font-bold uppercase tracking-wider py-3 px-4 sticky top-0 bg-background z-20">
              Chuyên cần
            </TableHead>
            {/* 16. BTVN */}
            <TableHead className="min-w-[120px] text-xs font-bold uppercase tracking-wider py-3 px-4 sticky top-0 bg-background z-20">
              BTVN
            </TableHead>
            {/* 17. Test gần nhất */}
            <TableHead className="min-w-[100px] text-xs font-bold uppercase tracking-wider text-center py-3 px-4 sticky top-0 bg-background z-20">
              Lần cuối
            </TableHead>
            {/* 18. Điểm TB */}
            <TableHead className="min-w-[100px] text-xs font-bold uppercase tracking-wider text-center py-3 px-4 sticky top-0 bg-background z-20">
              Điểm TB
            </TableHead>
            {/* 19. Cảnh báo CS */}
            <TableHead className="min-w-[120px] text-xs font-bold uppercase tracking-wider text-center py-3 px-4 sticky top-0 bg-background z-20">
              Cảnh báo CS
            </TableHead>
            {/* 20. CSKH Tác nghiệp */}
            <TableHead className="min-w-[240px] text-xs font-bold uppercase tracking-wider py-3 px-4 sticky top-0 bg-background z-20">
              CSKH Tác nghiệp
            </TableHead>
            {/* 21. Thao tác */}
            <TableHead className="w-20 text-right text-xs font-bold uppercase tracking-wider py-3 px-4 sticky right-0 top-0 bg-background z-30 shadow-[-1px_0_0_0_rgba(0,0,0,0.05)]">
              Thao tác
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {groupedAlerts.length === 0 ? (
            <TableRow>
              <TableCell colSpan={21} className="h-32 text-center text-sm text-muted-foreground">
                Không tìm thấy dữ liệu học viên vận hành phù hợp.
              </TableCell>
            </TableRow>
          ) : (
            groupedAlerts.map((student) => {
              const isExpanded = expandedStudentIds.includes(student.studentId)
              const allStudentClassIds = student.classes.map((c) => c.id)
              const isStudentSelected = allStudentClassIds.every((id) => selectedIds.includes(id))

              return (
                <Fragment key={student.studentId}>
                  {/* PARENT ROW (STUDENT SUMMARY) */}
                  <OperationsAlertTableRow
                    student={student}
                    isExpanded={isExpanded}
                    onToggleExpand={toggleExpand}
                    isSelected={isStudentSelected}
                    onSelectChange={handleStudentSelectChange}
                    onTagnhep={onTagnhep}
                  />

                  {/* CHILD ROWS (EXPANDED CLASSES DETAIL) */}
                  {isExpanded &&
                    student.classes.map((c) => {
                      const isChildSelected = selectedIds.includes(c.id)

                      return (
                        <OperationsAlertTableSubRow
                          key={c.id}
                          c={c}
                          isSelected={isChildSelected}
                          onSelectChange={onSelectChange}
                          onTagnhep={onTagnhep}
                        />
                      )
                    })}
                </Fragment>
              )
            })
          )}
        </TableBody>
      </Table>
  )
}
