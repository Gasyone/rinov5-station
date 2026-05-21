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
import { Eye, ClipboardCheck, Calendar, AlertTriangle, Users, Clock } from 'lucide-react'
import type { AttendanceRecord } from '@/mocks/attendanceRecords'
import { ATTENDANCE_STATUS_LABELS } from './attendanceTypes'

interface AttendanceTableProps {
  records: AttendanceRecord[]
  selectedIds: Set<string>
  onToggleAll: (checked: boolean, ids: string[]) => void
  onToggleOne: (id: string, checked: boolean) => void
  onView: (recordId: string) => void
  onApprove: (recordId: string) => void
  onReject: (recordId: string) => void
}

function formatDate(dateStr: string): string {
  const [y, m, d] = dateStr.split('-')
  return `${d}/${m}/${y}`
}

export function AttendanceTable({
  records,
  selectedIds,
  onToggleAll,
  onToggleOne,
  onView,
  onApprove,
  onReject,
}: AttendanceTableProps) {
  const pageIds = records.map((r) => r.id)
  const isPageSelected = pageIds.length > 0 && pageIds.every((id) => selectedIds.has(id))

  return (
    <Table containerClassName="min-w-full overflow-visible" className="min-w-[1100px] align-top">
      <TableHeader>
        <TableRow className="border-b bg-muted/50 hover:bg-muted/50">
          <TableHead className="sticky left-0 z-30 w-12 min-w-12 max-w-12 bg-muted/50 text-center">
            <Checkbox
              checked={isPageSelected}
              onCheckedChange={(checked) => onToggleAll(Boolean(checked), pageIds)}
            />
          </TableHead>
          <TableHead className="sticky left-12 z-20 w-64 min-w-64 max-w-64 bg-muted/50">Lớp / Session</TableHead>
          <TableHead className="min-w-120">Giáo viên</TableHead>
          <TableHead className="min-w-100">Ngày giờ</TableHead>
          <TableHead className="min-w-80">Sĩ số điểm danh</TableHead>
          <TableHead className="min-w-100">Người nộp</TableHead>
          <TableHead className="min-w-100">Trạng thái</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {records.length === 0 ? (
          <TableRow className="border-b-0">
            <TableCell colSpan={7} className="h-48 text-center">
              <EmptyState
                icon={<ClipboardCheck className="h-7 w-7 text-muted-foreground" />}
                title="Không có bản ghi điểm danh"
                description="Điều chỉnh tìm kiếm hoặc bộ lọc."
                className="py-10"
              />
            </TableCell>
          </TableRow>
        ) : (
          records.map((record) => (
            <TableRow key={record.id} className="group cursor-pointer border-b-0">
              <TableCell className="sticky left-0 z-30 w-12 min-w-12 max-w-12 bg-background text-center group-hover:bg-muted">
                <Checkbox
                  checked={selectedIds.has(record.id)}
                  onCheckedChange={(checked) => onToggleOne(record.id, Boolean(checked))}
                />
              </TableCell>
              <TableCell className="sticky left-12 z-20 w-64 min-w-64 max-w-64 bg-background group-hover:bg-muted" onClick={() => onView(record.id)}>
                <div className="relative z-10 max-w-full overflow-hidden pr-24">
                  <EntityCell name={record.className} supporting={record.sessionCode} />
                  <div className="mt-1 text-xs text-muted-foreground truncate" title={record.topic}>
                    {record.topic}
                  </div>
                  <div
                    className="absolute right-2 top-1/2 hidden -translate-y-1/2 items-center gap-1 group-hover:flex"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {record.status === 'pending_review' ? (
                      <>
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          title="Duyệt"
                          onClick={() => onApprove(record.id)}
                          className="bg-transparent shadow-none hover:bg-transparent"
                        >
                          <span className="text-emerald-600 font-bold text-sm">✓</span>
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          title="Từ chối"
                          onClick={() => onReject(record.id)}
                          className="bg-transparent shadow-none hover:bg-transparent"
                        >
                          <span className="text-red-600 font-bold text-sm">✕</span>
                        </Button>
                      </>
                    ) : (
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        title="Xem chi tiết"
                        onClick={() => onView(record.id)}
                        className="bg-transparent shadow-none hover:bg-transparent"
                      >
                        <Eye className="h-4 w-4 text-primary" />
                      </Button>
                    )}
                  </div>
                </div>
              </TableCell>
              <TableCell className="min-w-120" onClick={() => onView(record.id)}>
                <EntityCell name={record.teacher} supporting={record.branch} />
              </TableCell>
              <TableCell className="min-w-100" onClick={() => onView(record.id)}>
                <div className="flex items-center gap-1.5 text-sm">
                  <Calendar className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                  {formatDate(record.date)}
                </div>
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Clock className="h-3 w-3 shrink-0" />
                  {record.sessionTime}
                </div>
              </TableCell>
              <TableCell className="min-w-80" onClick={() => onView(record.id)}>
                <div className="flex items-center gap-1.5 text-sm">
                  <Users className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                  <span className="font-medium">{record.present}</span>
                  <span className="text-muted-foreground">/ {record.totalStudents}</span>
                  <Badge variant="secondary" className="text-[10px] px-1 py-0 ml-1">
                    {record.totalStudents > 0 ? Math.round((record.present / record.totalStudents) * 100) : 0}%
                  </Badge>
                </div>
                <div className="text-xs text-muted-foreground">
                  Vắng {record.absent} · Đến muộn {record.late} · Có phép {record.excused}
                </div>
              </TableCell>
              <TableCell className="min-w-100" onClick={() => onView(record.id)}>
                {record.submittedBy ? (
                  <>
                    <div className="text-sm">{record.submittedBy}</div>
                    <div className="text-xs text-muted-foreground">
                      {formatDate(record.submittedAt.split(' ')[0])}
                    </div>
                  </>
                ) : (
                  <span className="text-sm text-muted-foreground italic">Chưa nộp</span>
                )}
              </TableCell>
              <TableCell className="min-w-100" onClick={() => onView(record.id)}>
                <StatusBadge
                  status={record.status}
                  label={ATTENDANCE_STATUS_LABELS[record.status] ?? record.status}
                />
                {record.hasConflict && (
                  <div className="mt-1 flex items-center gap-0.5 text-[10px] text-amber-600">
                    <AlertTriangle className="h-3 w-3" />
                    Có xung đột
                  </div>
                )}
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  )
}
