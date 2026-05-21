'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Progress } from '@/components/ui/progress'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { EmptyState, StatusBadge, EntityCell } from '@/components/shared'
import { Eye, Users, Calendar, Pencil, GraduationCap } from 'lucide-react'
import type { Class } from '@/mocks/classes'

interface ClassesTableProps {
  classes: Class[]
  selectedIds: Set<string>
  onToggleAll: (checked: boolean, ids: string[]) => void
  onToggleOne: (id: string, checked: boolean) => void
  onRowClick: (classId: string) => void
  onView: (classId: string) => void
  onEdit: (classId: string) => void
  onGraduate: (classId: string) => void
}

const STATUS_LABELS: Record<string, string> = {
  active: 'Đang học',
  completed: 'Đã kết thúc',
  cancelled: 'Đã hủy',
  upcoming: 'Chờ khai giảng',
}

export function ClassesTable({
  classes,
  selectedIds,
  onToggleAll,
  onToggleOne,
  onRowClick,
  onView,
  onEdit,
  onGraduate,
}: ClassesTableProps) {
  const pageIds = classes.map((c) => c.id)
  const isPageSelected = pageIds.length > 0 && pageIds.every((id) => selectedIds.has(id))

  const capacityPct = (c: Class) => (c.maxStudents > 0 ? Math.round((c.enrolledStudents / c.maxStudents) * 100) : 0)

  return (
    <Table containerClassName="min-w-full overflow-visible" className="min-w-[1200px] align-top">
      <TableHeader>
        <TableRow className="border-b bg-muted/50 hover:bg-muted/50">
          <TableHead className="sticky left-0 z-30 w-12 min-w-12 max-w-12 bg-muted/50 text-center">
            <Checkbox
              checked={isPageSelected}
              onCheckedChange={(checked) => onToggleAll(Boolean(checked), pageIds)}
            />
          </TableHead>
          <TableHead className="sticky left-12 z-20 w-64 min-w-64 max-w-64 bg-muted/50">Lớp học</TableHead>
          <TableHead className="min-w-120">Giáo viên</TableHead>
          <TableHead className="min-w-100">Lịch học</TableHead>
          <TableHead className="min-w-100">Phòng</TableHead>
          <TableHead className="min-w-160">Sĩ số</TableHead>
          <TableHead className="min-w-100">Học phí</TableHead>
          <TableHead className="min-w-120">Trạng thái</TableHead>
          <TableHead className="w-10 text-right"></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {classes.length === 0 ? (
          <TableRow className="border-b-0">
            <TableCell colSpan={9} className="h-48 text-center">
              <EmptyState
                icon={<GraduationCap className="h-7 w-7 text-muted-foreground" />}
                title="Không có lớp học nào"
                description="Điều chỉnh tìm kiếm hoặc bộ lọc, hoặc tạo lớp mới."
                className="py-10"
              />
            </TableCell>
          </TableRow>
        ) : (
          classes.map((cls) => (
            <TableRow
              key={cls.id}
              className="group cursor-pointer border-b-0"
              onClick={() => onRowClick(cls.id)}
            >
              <TableCell className="sticky left-0 z-30 w-12 min-w-12 max-w-12 bg-background text-center group-hover:bg-muted">
                <Checkbox
                  checked={selectedIds.has(cls.id)}
                  onCheckedChange={(checked) => onToggleOne(cls.id, Boolean(checked))}
                />
              </TableCell>
              <TableCell className="sticky left-12 z-20 w-64 min-w-64 max-w-64 bg-background group-hover:bg-muted">
                <div className="relative z-10 max-w-full overflow-hidden pr-24">
                  <div className="min-w-0 space-y-1">
                    <p className="truncate font-semibold" title={cls.name}>
                      {cls.name}
                    </p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span className="font-mono">{cls.id}</span>
                      <Badge variant="outline" className="rounded-md text-[10px] font-bold">
                        {cls.level}
                      </Badge>
                    </div>
                  </div>
                  <div
                    className="absolute right-2 top-1/2 hidden -translate-y-1/2 items-center gap-1 group-hover:flex"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      title="Xem chi tiết"
                      onClick={() => onView(cls.id)}
                      className="bg-transparent shadow-none hover:bg-transparent"
                    >
                      <Eye className="h-4 w-4 text-primary" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      title="Chỉnh sửa"
                      onClick={() => onEdit(cls.id)}
                      className="bg-transparent shadow-none hover:bg-transparent"
                    >
                      <Pencil className="h-4 w-4 text-muted-foreground" />
                    </Button>
                  </div>
                </div>
              </TableCell>
              <TableCell className="min-w-120" onClick={(e) => e.stopPropagation()}>
                <EntityCell name={cls.teacher} supporting={cls.room} />
              </TableCell>
              <TableCell className="min-w-100">
                <div className="flex items-center gap-1.5 text-sm">
                  <Calendar className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                  <span className="truncate">{cls.schedule}</span>
                </div>
                <div className="text-xs text-muted-foreground">
                  {new Date(cls.startDate).toLocaleDateString('vi-VN')} → {new Date(cls.endDate).toLocaleDateString('vi-VN')}
                </div>
              </TableCell>
              <TableCell className="min-w-100 text-sm">{cls.room}</TableCell>
              <TableCell className="min-w-160">
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5 text-sm">
                    <Users className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                    <span className="font-medium">{cls.enrolledStudents}</span>
                    <span className="text-muted-foreground">/ {cls.maxStudents}</span>
                    {cls.maxStudents > 0 && (
                      <Badge
                        variant={capacityPct(cls) >= 90 ? 'destructive' : capacityPct(cls) >= 70 ? 'default' : 'secondary'}
                        className="text-[10px] px-1 py-0 ml-1"
                      >
                        {capacityPct(cls)}%
                      </Badge>
                    )}
                  </div>
                  <Progress value={capacityPct(cls)} className="h-1" />
                </div>
              </TableCell>
              <TableCell className="min-w-100" onClick={(e) => e.stopPropagation()}>
                <span className="text-sm font-medium">
                  {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(cls.tuitionFee)}
                </span>
              </TableCell>
              <TableCell className="min-w-120" onClick={(e) => e.stopPropagation()}>
                <StatusBadge status={cls.status} label={STATUS_LABELS[cls.status] ?? cls.status} />
              </TableCell>
              <TableCell className="w-10 text-right" onClick={(e) => e.stopPropagation()}>
                <div className="flex items-center justify-end gap-0.5">
                  {cls.status === 'active' && (
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      title="Tốt nghiệp"
                      onClick={() => onGraduate(cls.id)}
                      className="h-7 w-7"
                    >
                      <GraduationCap className="h-3.5 w-3.5 text-emerald-600" />
                    </Button>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  )
}
