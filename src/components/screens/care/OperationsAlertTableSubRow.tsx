'use client'

import { CornerDownRight, Edit } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { TableRow, TableCell } from '@/components/ui/table'
import { getStatusBadgeClass, getRateColorClass } from '@/lib/statusColors'
import { cn } from '@/lib/utils'
import type { StudentCareAlert } from '@/mocks/careAlerts'
import { parseAttendanceRate } from './operationsAlertHelpers'
import { ScheduleSummaryBadge } from './ScheduleSummaryBadge'

interface OperationsAlertTableSubRowProps {
  c: StudentCareAlert
  isSelected: boolean
  onSelectChange: (id: string, checked: boolean) => void
  onTagnhep: (student: StudentCareAlert) => void
}

export function OperationsAlertTableSubRow({
  c,
  isSelected,
  onSelectChange,
  onTagnhep,
}: OperationsAlertTableSubRowProps) {
  const childAttRate = parseAttendanceRate(c.attendanceRatio)
  const childAttColor = getRateColorClass(childAttRate)
  const childHwColor = getRateColorClass(c.homeworkCompletion)
  const avgScore = ((c.lastTestScore + c.priorTestScore) / 2).toFixed(1)

  // Helper for teacher initials
  const getInitial = (name: string) => {
    if (!name) return ''
    return name
      .split(' ')
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0])
      .join('')
      .toUpperCase()
  }

  return (
    <TableRow
      className={cn(
        'text-xs bg-zinc-50/40 dark:bg-zinc-950/10 hover:bg-zinc-100/60 dark:hover:bg-zinc-900/40 transition-colors border-b border-border/40 border-l border-l-border/80 cursor-pointer select-none',
        c.careAlert === 'C90B' && c.confirmC90B === 'CHƯA XÁC NHẬN' ? 'bg-red-50/10 dark:bg-red-950/5' : '',
        isSelected ? 'bg-primary/5' : ''
      )}
      onClick={() => onTagnhep(c)}
    >
      {/* 1. Sub Checkbox (Indented) */}
      <TableCell className="text-center py-2.5 px-3.5" onClick={(e) => e.stopPropagation()}>
        <div className="pl-4 flex justify-center">
          <Checkbox
            checked={isSelected}
            onCheckedChange={(val) => onSelectChange(c.id, !!val)}
            aria-label={`Chọn lớp ${c.classCode}`}
          />
        </div>
      </TableCell>

      {/* 2. Indent branching & Subject */}
      <TableCell className="py-2.5 px-3.5 pl-5">
        <div className="flex items-center gap-1.5">
          <CornerDownRight className="h-3 w-3 text-muted-foreground/60 shrink-0" />
          <span className="font-bold text-foreground">{c.subject}</span>
        </div>
      </TableCell>

      {/* 3. Điện thoại */}
      <TableCell className="py-2.5 px-3.5 text-muted-foreground italic text-center font-normal">
        —
      </TableCell>

      {/* 4. Lớp học (Gộp Tên lớp + Mã lớp) */}
      <TableCell className="py-2.5 px-3.5">
        <div className="flex flex-col gap-0.5">
          <span className="font-semibold text-foreground">Lớp {c.subject} {c.level}</span>
          <span className="text-[10px] text-primary font-mono font-semibold">{c.classCode}</span>
        </div>
      </TableCell>

      {/* 5. Cấp độ (Level) */}
      <TableCell className="text-muted-foreground font-medium py-2.5 px-3.5">
        {c.level}
      </TableCell>

      {/* 6. Sub-level */}
      <TableCell className="font-bold text-center text-muted-foreground font-mono py-2.5 px-3.5">
        {c.subLevel}
      </TableCell>

      {/* 7. Ngày bắt đầu */}
      <TableCell className="font-mono text-muted-foreground py-2.5 px-3.5">
        {c.startDate}
      </TableCell>

      {/* 8. Hạn học dự kiến */}
      <TableCell className="font-mono text-muted-foreground py-2.5 px-3.5">
        {c.expectedEndDate}
      </TableCell>

      {/* 9. Trạng thái học */}
      <TableCell className="py-2.5 px-3.5">
        <Badge
          variant="outline"
          className={cn(
            'text-[9px] px-1.5 py-0 h-4 font-semibold shrink-0 uppercase tracking-wide',
            c.status === 'Đang học'
              ? getStatusBadgeClass('dang_hoc')
              : c.status === 'Chờ chuyển lớp'
                ? getStatusBadgeClass('pending_transfer')
                : getStatusBadgeClass('session_ended')
          )}
        >
          {c.status}
        </Badge>
      </TableCell>

      {/* 10. Trạng thái lớp */}
      <TableCell className="py-2.5 px-3.5">
        <Badge
          variant="outline"
          className={cn(
            'text-[9px] px-1.5 py-0 h-4 font-semibold shrink-0 uppercase tracking-wide',
            c.realtimeStatus === 'Đang học'
              ? getStatusBadgeClass('dang_hoc')
              : c.realtimeStatus === 'Chờ chuyển lớp'
                ? getStatusBadgeClass('pending_transfer')
                : getStatusBadgeClass('session_ended')
          )}
        >
          {c.realtimeStatus === 'Đang học' ? 'Hoạt động' : c.realtimeStatus === 'Chờ chuyển lớp' ? 'Chờ chuyển' : 'Bế mạc'}
        </Badge>
      </TableCell>

      {/* 11. Giáo viên */}
      <TableCell className="py-2.5 px-3.5">
        <div className="flex items-center gap-1.5 select-none">
          {c.substituteTeacher ? (
            <div className="flex -space-x-1 items-center shrink-0" title={`Dạy thay: ${c.substituteTeacher} (Chính: ${c.teacherCode})`}>
              <div className="flex h-5.5 w-5.5 items-center justify-center rounded-full border border-border bg-zinc-150 text-[8px] font-bold text-zinc-500 opacity-60">
                {getInitial(c.teacherCode)}
              </div>
              <div className="flex h-5.5 w-5.5 items-center justify-center rounded-full border border-amber-250 bg-amber-100 text-[8px] font-bold text-amber-700">
                {getInitial(c.substituteTeacher)}
              </div>
            </div>
          ) : (
            <div className="flex h-5.5 w-5.5 items-center justify-center rounded-full border border-border bg-zinc-150 text-[8px] font-bold text-zinc-500 shrink-0" title={c.teacherCode}>
              {getInitial(c.teacherCode)}
            </div>
          )}
          <span className="font-mono text-[10px] text-muted-foreground truncate max-w-[70px]" title={c.substituteTeacher ? `${c.substituteTeacher} (thay)` : c.teacherCode}>
            {c.substituteTeacher ? `${c.substituteTeacher}*` : c.teacherCode}
          </span>
        </div>
      </TableCell>

      {/* 12. Lịch học (Beautiful dynamically parsed schedule badge list!) */}
      <TableCell className="py-2.5 px-3.5">
        <ScheduleSummaryBadge scheduleStr={c.schedule} />
      </TableCell>

      {/* 13. Tổng buổi */}
      <TableCell className="text-center font-semibold text-muted-foreground py-2.5 px-3.5">
        {c.totalSessions}
      </TableCell>

      {/* 14. Còn lại */}
      <TableCell className="text-center font-bold text-primary py-2.5 px-3.5">
        {c.remainingSessions}
      </TableCell>

      {/* 15. Chuyên cần */}
      <TableCell className="py-2.5 px-3.5">
        <div className="flex flex-col gap-1 w-20">
          <div className="flex justify-between items-center text-[10px] text-muted-foreground leading-none">
            <span className="font-bold text-foreground">{c.attendanceRatio}</span>
            <span>{childAttRate}%</span>
          </div>
          <div className="bg-primary/10 relative h-1.5 w-full overflow-hidden rounded-full">
            <div className={cn('h-full rounded-full transition-all', childAttColor)} style={{ width: `${childAttRate}%` }} />
          </div>
        </div>
      </TableCell>

      {/* 16. BTVN */}
      <TableCell className="py-2.5 px-3.5">
        <div className="flex flex-col gap-1 w-16">
          <div className="flex justify-between items-center text-[10px] text-muted-foreground leading-none">
            <span className="font-bold text-foreground">{c.homeworkCompletion}%</span>
          </div>
          <div className="bg-primary/10 relative h-1.5 w-full overflow-hidden rounded-full">
            <div className={cn('h-full rounded-full transition-all', childHwColor)} style={{ width: `${c.homeworkCompletion}%` }} />
          </div>
        </div>
      </TableCell>

      {/* 17. Test gần nhất */}
      <TableCell className="text-center font-bold text-foreground py-2.5 px-3.5">
        {c.lastTestScore}
      </TableCell>

      {/* 18. Điểm TB */}
      <TableCell className="text-center font-bold text-primary py-2.5 px-3.5">
        {avgScore}
      </TableCell>

      {/* 19. Cảnh báo CS */}
      <TableCell className="text-center py-2.5 px-3.5">
        {c.careAlert ? (
          <Badge
            variant="outline"
            className={cn(
              'text-[8px] px-1.5 h-4 font-bold uppercase tracking-wide font-mono',
              c.careAlert === 'C90B' ? getStatusBadgeClass('high') : getStatusBadgeClass('needs_attention')
            )}
          >
            {c.careAlert}
          </Badge>
        ) : (
          <span className="text-muted-foreground text-[10px]">—</span>
        )}
      </TableCell>

      {/* 20. CSKH Tác nghiệp */}
      <TableCell className="py-2.5 px-3.5">
        <div className="flex flex-col gap-1 max-w-[200px]">
          <div className="flex items-center gap-1 flex-wrap">
            {c.confirmC90B && (
              <Badge variant="outline" className="text-[8px] px-1 h-3.5 font-semibold border-zinc-200 text-zinc-700 dark:border-zinc-800 dark:text-zinc-300 py-0 leading-tight uppercase">
                {c.confirmC90B}
              </Badge>
            )}
            {c.callConfirmation !== 'Chưa gọi' && (
              <Badge variant="outline" className="text-[8px] px-1 h-3.5 font-semibold border-zinc-200 text-zinc-700 dark:border-zinc-800 dark:text-zinc-300 py-0 leading-tight uppercase">
                {c.callConfirmation}
              </Badge>
            )}
          </div>
          <p className="text-[10px] text-muted-foreground truncate leading-tight mt-0.5 font-normal" title={c.interactionNotes}>
            {c.interactionNotes || <span className="italic text-zinc-300 dark:text-zinc-700">Chưa tương tác...</span>}
          </p>
        </div>
      </TableCell>

      {/* 21. Action for this class */}
      <TableCell className="text-right sticky right-0 bg-zinc-50/95 dark:bg-zinc-950/95 backdrop-blur-xs z-10 py-2.5 px-3.5" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-end">
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => onTagnhep(c)}
            title="Tác nghiệp lớp học này"
            className="h-7 w-7 hover:bg-primary/10 hover:text-primary rounded-md shrink-0 shadow-none"
          >
            <Edit className="h-4 w-4" />
          </Button>
        </div>
      </TableCell>
    </TableRow>
  )
}
