'use client'

import { Checkbox } from '@/components/ui/checkbox'
import { Badge } from '@/components/ui/badge'
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
import { Eye, Users, BookOpen, Star, GraduationCap, Phone } from 'lucide-react'
import type { TeacherRecord } from '@/mocks/teacherRecords'
import { TEACHER_STATUS_LABELS } from './teacherTypes'

interface TeachersTableProps {
  teachers: TeacherRecord[]
  selectedIds: Set<string>
  onToggleAll: (checked: boolean, ids: string[]) => void
  onToggleOne: (id: string, checked: boolean) => void
  onView: (teacherId: string) => void
}

export function TeachersTable({
  teachers,
  selectedIds,
  onToggleAll,
  onToggleOne,
  onView,
}: TeachersTableProps) {
  const pageIds = teachers.map((t) => t.id)
  const isPageSelected = pageIds.length > 0 && pageIds.every((id) => selectedIds.has(id))

  return (
    <Table containerClassName="min-w-full overflow-visible" className="min-w-[900px] align-top">
      <TableHeader>
        <TableRow className="border-b bg-muted/50 hover:bg-muted/50">
          <TableHead className="sticky left-0 z-30 w-12 min-w-12 max-w-12 bg-muted/50 text-center">
            <Checkbox
              checked={isPageSelected}
              onCheckedChange={(checked) => onToggleAll(Boolean(checked), pageIds)}
            />
          </TableHead>
          <TableHead className="sticky left-12 z-20 w-64 min-w-64 max-w-64 bg-muted/50">Giáo viên</TableHead>
          <TableHead className="min-w-80">Chuyên môn</TableHead>
          <TableHead className="min-w-80">Chi nhánh</TableHead>
          <TableHead className="min-w-80">Lớp / HV</TableHead>
          <TableHead className="min-w-60">Đánh giá</TableHead>
          <TableHead className="min-w-100">Trạng thái</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {teachers.length === 0 ? (
          <TableRow className="border-b-0">
            <TableCell colSpan={7} className="h-48 text-center">
              <EmptyState
                icon={<GraduationCap className="h-7 w-7 text-muted-foreground" />}
                title="Không có giáo viên nào"
                description="Điều chỉnh tìm kiếm hoặc bộ lọc, hoặc thêm giáo viên mới."
                className="py-10"
              />
            </TableCell>
          </TableRow>
        ) : (
          teachers.map((teacher) => (
            <TableRow key={teacher.id} className="group cursor-pointer border-b-0">
              <TableCell className="sticky left-0 z-30 w-12 min-w-12 max-w-12 bg-background text-center group-hover:bg-muted">
                <Checkbox
                  checked={selectedIds.has(teacher.id)}
                  onCheckedChange={(checked) => onToggleOne(teacher.id, Boolean(checked))}
                />
              </TableCell>
              <TableCell className="sticky left-12 z-20 w-64 min-w-64 max-w-64 bg-background group-hover:bg-muted" onClick={() => onView(teacher.id)}>
                <div className="relative z-10 max-w-full overflow-hidden pr-12">
                  <EntityCell name={teacher.name} supporting={teacher.code} />
                  {teacher.phone && (
                    <div className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                      <Phone className="h-3 w-3" />
                      {teacher.phone}
                    </div>
                  )}
                  <div
                    className="absolute right-2 top-1/2 hidden -translate-y-1/2 items-center gap-1 group-hover:flex"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      title="Xem hồ sơ"
                      onClick={() => onView(teacher.id)}
                      className="bg-transparent shadow-none hover:bg-transparent"
                    >
                      <Eye className="h-4 w-4 text-primary" />
                    </Button>
                  </div>
                </div>
              </TableCell>
              <TableCell className="min-w-80" onClick={() => onView(teacher.id)}>
                <div className="flex flex-wrap gap-1">
                  {teacher.subjects.map((s) => (
                    <Badge key={s} variant="outline" className="text-xs px-1.5 py-0">
                      <BookOpen className="h-3 w-3 mr-0.5" />
                      {s}
                    </Badge>
                  ))}
                </div>
              </TableCell>
              <TableCell className="min-w-80" onClick={() => onView(teacher.id)}>
                <span className="text-sm">{teacher.branch}</span>
              </TableCell>
              <TableCell className="min-w-80" onClick={() => onView(teacher.id)}>
                <div className="flex items-center gap-1.5 text-sm">
                  <Users className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                  <span>{teacher.totalClasses} lớp · {teacher.totalStudents} HV</span>
                </div>
              </TableCell>
              <TableCell className="min-w-60" onClick={() => onView(teacher.id)}>
                <div className="flex items-center gap-1 text-sm">
                  <Star className="h-3.5 w-3.5 text-amber-500 shrink-0" />
                  <span className="font-medium">{teacher.rating.toFixed(1)}</span>
                  <span className="text-xs text-muted-foreground">/ 5.0</span>
                </div>
              </TableCell>
              <TableCell className="min-w-100" onClick={() => onView(teacher.id)}>
                <StatusBadge status={teacher.status} label={TEACHER_STATUS_LABELS[teacher.status] ?? teacher.status} />
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  )
}
