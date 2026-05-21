'use client'

import { Checkbox } from '@/components/ui/checkbox'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { EmptyState, StatusBadge, EntityCell } from '@/components/shared'
import { Eye, GraduationCap, Mail, Phone, Calendar } from 'lucide-react'
import type { Student } from '@/mocks/students'
import { STUDENT_STATUS_LABELS } from './studentTypes'

interface StudentsTableProps {
  students: Student[]
  selectedIds: Set<string>
  onToggleAll: (checked: boolean, ids: string[]) => void
  onToggleOne: (id: string, checked: boolean) => void
  onView: (studentId: string) => void
}

export function StudentsTable({
  students,
  selectedIds,
  onToggleAll,
  onToggleOne,
  onView,
}: StudentsTableProps) {
  const pageIds = students.map((s) => s.id)
  const isPageSelected = pageIds.length > 0 && pageIds.every((id) => selectedIds.has(id))

  return (
    <Table containerClassName="min-w-full overflow-visible" className="min-w-[1000px] align-top">
      <TableHeader>
        <TableRow className="border-b bg-muted/50 hover:bg-muted/50">
          <TableHead className="sticky left-0 z-30 w-12 min-w-12 max-w-12 bg-muted/50 text-center">
            <Checkbox
              checked={isPageSelected}
              onCheckedChange={(checked) => onToggleAll(Boolean(checked), pageIds)}
            />
          </TableHead>
          <TableHead className="sticky left-12 z-20 w-64 min-w-64 max-w-64 bg-muted/50">Học viên</TableHead>
          <TableHead className="min-w-80">Ghi danh</TableHead>
          <TableHead className="min-w-80">Phụ huynh liên hệ</TableHead>
          <TableHead className="min-w-80">Ngày sinh / Ghi danh</TableHead>
          <TableHead className="min-w-100">Trạng thái</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {students.length === 0 ? (
          <TableRow className="border-b-0">
            <TableCell colSpan={6} className="h-48 text-center">
              <EmptyState
                icon={<GraduationCap className="h-7 w-7 text-muted-foreground" />}
                title="Không có học viên nào"
                description="Điều chỉnh tìm kiếm hoặc bộ lọc, hoặc thêm học viên mới."
                className="py-10"
              />
            </TableCell>
          </TableRow>
        ) : (
          students.map((student) => (
            <TableRow key={student.id} className="group cursor-pointer border-b-0">
              <TableCell className="sticky left-0 z-30 w-12 min-w-12 max-w-12 bg-background text-center group-hover:bg-muted">
                <Checkbox
                  checked={selectedIds.has(student.id)}
                  onCheckedChange={(checked) => onToggleOne(student.id, Boolean(checked))}
                />
              </TableCell>
              <TableCell className="sticky left-12 z-20 w-64 min-w-64 max-w-64 bg-background group-hover:bg-muted" onClick={() => onView(student.id)}>
                <div className="relative z-10 max-w-full overflow-hidden pr-12">
                  <EntityCell name={student.name} supporting={`STU-00${student.id.replace('s', '')}`} />
                  <div
                    className="absolute right-2 top-1/2 hidden -translate-y-1/2 items-center gap-1 group-hover:flex"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      title="Xem hồ sơ"
                      onClick={() => onView(student.id)}
                      className="bg-transparent shadow-none hover:bg-transparent"
                    >
                      <Eye className="h-4 w-4 text-primary" />
                    </Button>
                  </div>
                </div>
              </TableCell>
              <TableCell className="min-w-80" onClick={() => onView(student.id)}>
                {student.enrolledClass ? (
                  <>
                    <div className="text-sm font-medium">{student.enrolledClass}</div>
                    <div className="text-xs text-muted-foreground">{student.branch}</div>
                  </>
                ) : (
                  <span className="text-sm text-muted-foreground italic">Chưa có lớp</span>
                )}
              </TableCell>
              <TableCell className="min-w-80" onClick={() => onView(student.id)}>
                {student.parentName ? (
                  <>
                    <div className="text-sm font-medium">{student.parentName}</div>
                    {student.parentPhone && (
                      <div className="text-xs text-muted-foreground flex items-center gap-1">
                        <Phone className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                        {student.parentPhone}
                      </div>
                    )}
                  </>
                ) : (
                  <span className="text-sm text-muted-foreground">-</span>
                )}
              </TableCell>
              <TableCell className="min-w-80" onClick={() => onView(student.id)}>
                <div className="flex items-center gap-1.5 text-sm">
                  <Calendar className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                  {new Date(student.dob).toLocaleDateString('vi-VN')}
                </div>
                <div className="text-xs text-muted-foreground">
                  Ghi danh: {new Date(student.enrollmentDate).toLocaleDateString('vi-VN')}
                </div>
              </TableCell>
              <TableCell className="min-w-100" onClick={() => onView(student.id)}>
                <StatusBadge status={student.status} label={STUDENT_STATUS_LABELS[student.status] ?? student.status} />
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  )
}
