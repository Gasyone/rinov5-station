'use client'

import { Edit, Share2, CornerDownRight } from 'lucide-react'
import { toast } from 'sonner'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { TableRow, TableCell } from '@/components/ui/table'
import { getStatusBadgeClass, getRateColorClass } from '@/lib/statusColors'
import { cn } from '@/lib/utils'
import { RenewalCareRecord } from '@/mocks/renewalCare'
import { parseAttendanceRate, getInitial } from './renewalHelpers'

interface RenewalChildRowProps {
  c: RenewalCareRecord
  studentName: string
  isChildSelected: boolean
  onSelectChange: (id: string, checked: boolean) => void
  onTagnhep: (record: RenewalCareRecord) => void
  getRenewalStatusBadge: (status: RenewalCareRecord['renewalStatus'], subStatus?: string) => React.ReactNode
}

export function RenewalChildRow({
  c,
  studentName,
  isChildSelected,
  onSelectChange,
  onTagnhep,
  getRenewalStatusBadge,
}: RenewalChildRowProps) {
  const childAttRate = parseAttendanceRate(c.attendanceRatio)
  const childAttColor = getRateColorClass(childAttRate)
  const childHwColor = getRateColorClass(c.homeworkCompletion)
  const avgScore = ((c.lastTestScore + c.priorTestScore) / 2).toFixed(1)
  const isTutor = c.classCode.startsWith('TUTOR')

  return (
    <TableRow
      className={cn(
        'text-[10px] bg-zinc-50/40 dark:bg-zinc-950/10 hover:bg-zinc-100/60 dark:hover:bg-zinc-900/40 transition-colors border-b border-border/40 border-l border-l-border/80 cursor-pointer select-none',
        isChildSelected ? 'bg-primary/5' : ''
      )}
      onClick={() => onTagnhep(c)}
    >
      {/* 1. Sub Checkbox (Indented) */}
      <TableCell className="text-center w-8 pl-4 py-1 px-1" onClick={(e) => e.stopPropagation()}>
        <Checkbox
          checked={isChildSelected}
          onCheckedChange={(val) => onSelectChange(c.id, !!val)}
          aria-label={`Chọn lớp ${c.classCode}`}
        />
      </TableCell>

      {/* 2. Indent branching & Subject */}
      <TableCell className="pl-4 py-1 px-1.5 min-w-36">
        <div className="flex items-center gap-1">
          <CornerDownRight className="h-3 w-3 text-muted-foreground/45 shrink-0" />
          <div className="flex flex-col gap-0 min-w-0">
            <span className="font-semibold text-foreground text-[10px] truncate">{c.subject}</span>
            {isTutor && (
              <Badge variant="outline" className="text-[6px] h-3 px-0.5 bg-purple-50 text-purple-600 border-purple-200 w-fit shrink-0 py-0 font-bold">
                Tutor
              </Badge>
            )}
          </div>
        </div>
      </TableCell>

      {/* 3. Điện thoại */}
      <TableCell className="py-1 px-1.5 min-w-32 text-muted-foreground italic text-center">
        -
      </TableCell>

      {/* 4. Lớp học */}
      <TableCell className="py-1 px-1.5 min-w-28">
        <div className="flex flex-col gap-0">
          <span className="font-semibold text-foreground text-[10px]">Lớp {c.subject} {c.level}</span>
          <span className="text-[9px] text-primary font-mono font-semibold">{c.classCode}</span>
        </div>
      </TableCell>

      {/* 5. Cấp độ */}
      <TableCell className="text-muted-foreground truncate max-w-28 py-1 px-1.5 min-w-20 font-medium">
        {c.level}
      </TableCell>

      {/* 6. Sublevel */}
      <TableCell className="font-semibold text-center text-muted-foreground font-mono py-1 px-1.5 min-w-16">
        {c.subLevel}
      </TableCell>

      {/* 7. Ngày bắt đầu */}
      <TableCell className="font-mono text-muted-foreground py-1 px-1.5 min-w-20">
        {c.startDate}
      </TableCell>

      {/* 8. Hạn hết phí */}
      <TableCell className="text-center font-mono font-bold text-foreground py-1 px-1.5 min-w-20">
        {c.expirationDate.split('-').reverse().join('/')}
      </TableCell>

      {/* 9. Trạng thái học */}
      <TableCell className="py-1 px-1.5 min-w-20">
        <Badge
          variant="outline"
          className={cn(
            'text-[7px] px-1 h-3.5 font-semibold py-0',
            c.realtimeStatus === 'Đang học'
              ? getStatusBadgeClass('dang_hoc')
              : c.realtimeStatus === 'Chờ chuyển lớp'
                ? getStatusBadgeClass('pending_transfer')
                : getStatusBadgeClass('session_ended')
          )}
        >
          {c.realtimeStatus}
        </Badge>
      </TableCell>

      {/* 10. Trạng thái lớp */}
      <TableCell className="py-1 px-1.5 min-w-20">
        <Badge
          variant="outline"
          className={cn(
            'text-[7px] px-1 h-3.5 font-semibold py-0',
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

      {/* 11. Trạng thái Tái phí */}
      <TableCell className="text-center py-1 px-1.5 min-w-20">
        {getRenewalStatusBadge(c.renewalStatus, c.subStatus === 'Chờ xử lý' ? undefined : c.subStatus)}
      </TableCell>

      {/* 12. Kết quả hành động */}
      <TableCell className="text-center py-1 px-1.5 min-w-24">
        {c.resultType !== 'Đang chăm sóc' ? (
          <Badge variant="outline" className={cn("text-[7px] font-bold px-1 py-0 h-3.5",
            c.renewalStatus === 'Thành công'
              ? getStatusBadgeClass('success')
              : getStatusBadgeClass('error')
          )}>
            {c.resultType}
          </Badge>
        ) : (
          <span className="text-muted-foreground text-[9px]">-</span>
        )}
      </TableCell>

      {/* 13. Giáo viên */}
      <TableCell className="py-1 px-1.5 min-w-24">
        <div className="flex items-center gap-1">
          {c.substituteTeacher ? (
            <div className="flex -space-x-1 items-center shrink-0" title={`Dạy thay: ${c.substituteTeacher} (Chính: ${c.teacherCode})`}>
              <div className="flex h-4 w-4 items-center justify-center rounded-full border border-border bg-zinc-100 text-[7px] font-bold text-zinc-500 opacity-60">
                {getInitial(c.teacherCode)}
              </div>
              <div className="flex h-4 w-4 items-center justify-center rounded-full border border-amber-200 bg-amber-100 text-[7px] font-bold text-amber-700">
                {getInitial(c.substituteTeacher)}
              </div>
            </div>
          ) : (
            <div className="flex h-4 w-4 items-center justify-center rounded-full border border-border bg-zinc-100 text-[7px] font-bold text-zinc-500 shrink-0" title={c.teacherCode}>
              {getInitial(c.teacherCode)}
            </div>
          )}
          <span className="font-mono text-[9px] text-muted-foreground truncate max-w-16" title={c.substituteTeacher ? `${c.substituteTeacher} (thay)` : c.teacherCode}>
            {c.substituteTeacher ? `${c.substituteTeacher}*` : c.teacherCode}
          </span>
        </div>
      </TableCell>

      {/* 14. Lịch học */}
      <TableCell className="font-mono text-[9px] max-w-36 truncate text-muted-foreground py-1 px-1.5 min-w-36" title={c.schedule}>
        {c.schedule}
      </TableCell>

      {/* 15. Tổng buổi */}
      <TableCell className="text-center font-medium text-muted-foreground py-1 px-1.5 min-w-14 font-mono text-[10px]">
        {c.totalSessions}
      </TableCell>

      {/* 16. Còn lại */}
      <TableCell className="text-center font-semibold text-primary py-1 px-1.5 min-w-14 font-mono text-[10px]">
        {c.remainingSessions}
      </TableCell>

      {/* 17. Chuyên cần */}
      <TableCell className="py-1 px-1.5 min-w-20">
        <div className="flex flex-col gap-0.5 w-16">
          <div className="flex justify-between items-center text-[9px] text-muted-foreground">
            <span className="font-semibold text-foreground">{c.attendanceRatio}</span>
            <span>{childAttRate}%</span>
          </div>
          <div className="bg-primary/10 relative h-1 w-full overflow-hidden rounded-full">
            <div className={cn("h-full rounded-full transition-all", childAttColor)} style={{ width: `${childAttRate}%` }} />
          </div>
        </div>
      </TableCell>

      {/* 18. BTVN */}
      <TableCell className="py-1 px-1.5 min-w-16">
        <div className="flex flex-col gap-0.5 w-16">
          <div className="flex justify-between items-center text-[9px] text-muted-foreground">
            <span>{c.homeworkCompletion}%</span>
          </div>
          <div className="bg-primary/10 relative h-1 w-full overflow-hidden rounded-full">
            <div className={cn("h-full rounded-full transition-all", childHwColor)} style={{ width: `${c.homeworkCompletion}%` }} />
          </div>
        </div>
      </TableCell>

      {/* 19. Test gần nhất */}
      <TableCell className="text-center font-medium text-[10px] py-1 px-1.5 min-w-14 font-mono">
        {c.lastTestScore}
      </TableCell>

      {/* 20. Điểm T.Bình */}
      <TableCell className="text-center font-semibold text-[10px] text-primary py-1 px-1.5 min-w-14 font-mono">
        {avgScore}
      </TableCell>

      {/* 21. Cảnh báo CS */}
      <TableCell className="text-center py-1 px-1.5 min-w-20">
        {c.careAlert ? (
          <Badge
            variant="outline"
            className={cn("text-[7px] px-1 h-3.5 font-bold py-0",
              c.careAlert === 'C90B'
                ? getStatusBadgeClass('high')
                : getStatusBadgeClass('needs_attention')
            )}
          >
            {c.careAlert}
          </Badge>
        ) : (
          <span className="text-muted-foreground text-[9px]">-</span>
        )}
      </TableCell>

      {/* 22. CSKH Tác nghiệp */}
      <TableCell className="py-1 px-1.5 min-w-36">
        <div className="flex flex-col gap-0 max-w-[140px]">
          <p className="text-[9px] text-muted-foreground truncate font-normal" title={c.interactionNotes}>
            {c.interactionNotes || <span className="italic text-zinc-300 dark:text-zinc-700">Chưa tương tác...</span>}
          </p>
        </div>
      </TableCell>

      {/* 23. Thao tác */}
      <TableCell className="text-right sticky right-0 bg-background/95 backdrop-blur-xs z-10 py-1 px-1.5 w-14" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-end gap-0.5">
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => {
              const link = c.learningResultsLink || `https://rinov5.com/report/${c.studentId}/${c.classCode}`;
              navigator.clipboard.writeText(link);
              toast.success(`Đã sao chép link báo cáo học tập lớp {c.classCode} của học viên ${studentName}!`);
            }}
            title="Sao chép link báo cáo học tập lớp này"
            className="h-5 w-5 p-0 hover:bg-primary/10 hover:text-primary rounded-sm shrink-0"
          >
            <Share2 className="h-3 w-3 text-muted-foreground" />
          </Button>
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => onTagnhep(c)}
            title="Tác nghiệp tái phí lớp này"
            className="h-5 w-5 p-0 hover:bg-primary/10 hover:text-primary rounded-sm shrink-0"
          >
            <Edit className="h-3 w-3" />
          </Button>
        </div>
      </TableCell>
    </TableRow>
  )
}
