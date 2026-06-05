'use client'

import { Edit, ExternalLink, ChevronDown, ChevronRight, Share2 } from 'lucide-react'
import { toast } from 'sonner'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { TableRow, TableCell } from '@/components/ui/table'
import { getStatusBadgeClass, getRateColorClass } from '@/lib/statusColors'
import { ContactCell } from '@/components/shared'
import { cn } from '@/lib/utils'
import { StudentCareAlert, getFamilyContacts } from '@/mocks/careAlerts'
import { parseAttendanceRate } from './operationsAlertHelpers'

interface GroupedStudentAlert {
  studentId: string
  studentName: string
  customerCode?: string
  studentFolderLink: string
  csStaff: string
  classes: StudentCareAlert[]
}

interface OperationsAlertTableRowProps {
  student: GroupedStudentAlert
  isExpanded: boolean
  onToggleExpand: (studentId: string) => void
  isSelected: boolean
  onSelectChange: (student: GroupedStudentAlert, checked: boolean) => void
  onTagnhep: (student: StudentCareAlert) => void
}

export function OperationsAlertTableRow({
  student,
  isExpanded,
  onToggleExpand,
  isSelected,
  onSelectChange,
  onTagnhep,
}: OperationsAlertTableRowProps) {
  const totalClasses = student.classes.length

  // Calculate averages & states across all classes for this student
  let totalAttRate = 0
  let totalHwRate = 0
  let highestTestScore = 0
  let totalAvgScore = 0
  let hasC90BAlert = false
  let anyConfirmC90B: StudentCareAlert['confirmC90B'] = undefined
  let combinedNotes = ''

  student.classes.forEach((c) => {
    totalAttRate += parseAttendanceRate(c.attendanceRatio)
    totalHwRate += c.homeworkCompletion
    highestTestScore = Math.max(highestTestScore, c.lastTestScore)
    totalAvgScore += (c.lastTestScore + c.priorTestScore) / 2
    if (c.careAlert === 'C90B') {
      hasC90BAlert = true
      if (c.confirmC90B) anyConfirmC90B = c.confirmC90B
    }
    if (c.interactionNotes) {
      combinedNotes += (combinedNotes ? ' | ' : '') + c.interactionNotes
    }
  })

  const avgAttRate = Math.round(totalAttRate / totalClasses)
  const avgHwRate = Math.round(totalHwRate / totalClasses)
  const avgTotalScore = (totalAvgScore / totalClasses).toFixed(1)

  const parentAttColor = getRateColorClass(avgAttRate)
  const parentHwColor = getRateColorClass(avgHwRate)

  // Contacts
  const contacts = getFamilyContacts(student.studentId, student.studentName)
  const primaryContact = contacts.find((c) => c.isPrimary) || contacts[0]

  return (
    <TableRow
      className={cn(
        'text-xs hover:bg-muted/30 font-medium transition-colors cursor-pointer select-none border-b border-border',
        hasC90BAlert && !anyConfirmC90B ? 'bg-red-50/20 dark:bg-red-950/5' : '',
        isSelected ? 'bg-primary/5 hover:bg-primary/10' : ''
      )}
      onClick={() => onToggleExpand(student.studentId)}
    >
      {/* 1. Checkbox */}
      <TableCell className="text-center py-2.5 px-3.5" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-center">
          <Checkbox
            checked={isSelected}
            onCheckedChange={(val) => onSelectChange(student, !!val)}
            aria-label={`Chọn học viên ${student.studentName}`}
          />
        </div>
      </TableCell>

      {/* 2. Student Info */}
      <TableCell className="py-2.5 px-3.5">
        <div className="flex items-center gap-1.5 min-w-0">
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            onClick={(e) => {
              e.stopPropagation()
              onToggleExpand(student.studentId)
            }}
            className="h-6 w-6 p-0 hover:bg-muted shrink-0 shadow-none"
            title={isExpanded ? 'Thu gọn' : 'Mở rộng chi tiết lớp'}
          >
            {isExpanded ? (
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
            ) : (
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            )}
          </Button>

          <div className="flex flex-col gap-0.5 min-w-0">
            <div className="font-bold text-foreground flex items-center gap-1.5 truncate">
              <span className="truncate">{student.studentName}</span>
              {student.studentFolderLink && (
                <a
                  href={student.studentFolderLink}
                  target="_blank"
                  rel="noreferrer"
                  title="Thư mục học viên (ảnh/video)"
                  className="text-muted-foreground hover:text-primary shrink-0 transition-colors"
                  onClick={(e) => e.stopPropagation()}
                >
                  <ExternalLink className="h-3 w-3" />
                </a>
              )}
            </div>
            <div className="text-[10px] text-muted-foreground font-mono flex items-center gap-1.5">
              <span>ID: {student.studentId}</span>
              {student.customerCode && <span>• {student.customerCode}</span>}
            </div>
          </div>
        </div>
      </TableCell>

      <TableCell className="py-2.5 px-3.5" onClick={(e) => e.stopPropagation()}>
        <ContactCell
          name={primaryContact ? `GIA ĐÌNH ${student.studentName.toUpperCase()}` : '-'}
          phone={primaryContact?.phone}
          studentId={student.studentId}
          studentName={student.studentName}
          masked={true}
          additionalContacts={
            contacts && contacts.length > 1
              ? contacts.map((c) => ({ name: `${c.name} (${c.relationship})`, phone: c.phone }))
              : undefined
          }
        />
      </TableCell>

      {/* 4. Môn học (Parent) */}
      <TableCell className="text-muted-foreground italic text-center font-normal py-2.5 px-3.5">
        —
      </TableCell>

      {/* 5. Lớp học */}
      <TableCell className="text-muted-foreground italic text-center font-normal py-2.5 px-3.5">
        —
      </TableCell>

      {/* 6. Cấp độ */}
      <TableCell className="text-muted-foreground italic text-center font-normal py-2.5 px-3.5">
        —
      </TableCell>

      {/* 7. Sub-level */}
      <TableCell className="text-muted-foreground italic text-center font-normal py-2.5 px-3.5">
        —
      </TableCell>

      {/* 8. Ngày bắt đầu */}
      <TableCell className="text-muted-foreground italic text-center font-normal py-2.5 px-3.5">
        —
      </TableCell>

      {/* 9. Trạng thái học */}
      <TableCell className="py-2.5 px-3.5">
        <Badge
          variant="outline"
          className={cn('text-[9px] px-1.5 py-0 h-4 font-bold shrink-0 tracking-wide uppercase', getStatusBadgeClass('in_progress'))}
        >
          {totalClasses} lớp học
        </Badge>
      </TableCell>

      {/* 10. Trạng thái lớp */}
      <TableCell className="text-muted-foreground italic text-center font-normal py-2.5 px-3.5">
        —
      </TableCell>

      {/* 11. Giáo viên */}
      <TableCell className="text-muted-foreground italic text-center font-normal py-2.5 px-3.5">
        —
      </TableCell>

      {/* 12. Lịch học */}
      <TableCell className="text-muted-foreground italic text-center font-normal py-2.5 px-3.5">
        —
      </TableCell>

      {/* 13. Tổng buổi */}
      <TableCell className="text-muted-foreground italic text-center font-normal py-2.5 px-3.5">
        —
      </TableCell>

      {/* 14. Còn lại */}
      <TableCell className="text-center font-bold text-primary py-2.5 px-3.5">
        Còn {student.classes.reduce((sum, c) => sum + c.remainingSessions, 0)}b
      </TableCell>

      {/* 15. Chuyên cần (Average) */}
      <TableCell className="py-2.5 px-3.5">
        <div className="flex flex-col gap-1 w-20">
          <div className="flex justify-between items-center text-[10px] leading-none text-muted-foreground">
            <span className="font-bold text-foreground font-mono">{avgAttRate}%</span>
          </div>
          <div className="bg-primary/10 relative h-1.5 w-full overflow-hidden rounded-full">
            <div className={cn('h-full rounded-full transition-all', parentAttColor)} style={{ width: `${avgAttRate}%` }} />
          </div>
        </div>
      </TableCell>

      {/* 16. BTVN (Average) */}
      <TableCell className="py-2.5 px-3.5">
        <div className="flex flex-col gap-1 w-16">
          <div className="flex justify-between items-center text-[10px] leading-none text-muted-foreground">
            <span className="font-bold text-foreground font-mono">{avgHwRate}%</span>
          </div>
          <div className="bg-primary/10 relative h-1.5 w-full overflow-hidden rounded-full">
            <div className={cn('h-full rounded-full transition-all', parentHwColor)} style={{ width: `${avgHwRate}%` }} />
          </div>
        </div>
      </TableCell>

      {/* 17. Test gần nhất */}
      <TableCell className="text-center font-bold text-foreground py-2.5 px-3.5">
        {highestTestScore}
      </TableCell>

      {/* 18. Điểm TB */}
      <TableCell className="text-center font-bold text-primary py-2.5 px-3.5">
        {avgTotalScore}
      </TableCell>

      {/* 19. Cảnh báo CS */}
      <TableCell className="text-center py-2.5 px-3.5">
        {hasC90BAlert ? (
          <Badge
            variant="outline"
            className={cn(
              'text-[8px] px-1.5 h-4 font-bold animate-pulse font-mono py-0 tracking-wide uppercase',
              getStatusBadgeClass('high')
            )}
          >
            C90B
          </Badge>
        ) : (
          <span className="text-muted-foreground text-[10px]">—</span>
        )}
      </TableCell>

      {/* 20. CSKH Tác nghiệp */}
      <TableCell className="py-2.5 px-3.5">
        <div className="flex flex-col gap-0.5 max-w-[200px]">
          <div className="flex items-center gap-1 flex-wrap leading-none">
            <span className="font-bold text-muted-foreground text-[10px]">{student.csStaff}</span>
            {anyConfirmC90B && (
              <Badge variant="outline" className="text-[8px] px-1 h-3.5 font-bold border-zinc-200 text-zinc-700 dark:border-zinc-800 dark:text-zinc-300 py-0 uppercase">
                {anyConfirmC90B}
              </Badge>
            )}
          </div>
          <p className="text-[10px] text-muted-foreground truncate leading-tight mt-0.5" title={combinedNotes}>
            {combinedNotes || <span className="italic text-zinc-350 dark:text-zinc-700">Chưa tương tác...</span>}
          </p>
        </div>
      </TableCell>

      {/* 21. Thao tác */}
      <TableCell className="text-right sticky right-0 bg-background/95 backdrop-blur-xs z-10 py-2.5 px-3.5" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-end gap-1">
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => {
              const firstClass = student.classes[0]
              const link = firstClass?.learningResultsLink || `https://rinov5.com/report/${student.studentId}`
              navigator.clipboard.writeText(link)
              toast.success(`Đã sao chép link báo cáo học tập tổng hợp của học viên ${student.studentName}!`)
            }}
            title="Sao chép link báo cáo học tập tổng hợp"
            className="h-7 w-7 hover:bg-primary/10 hover:text-primary rounded-md shrink-0 shadow-none"
          >
            <Share2 className="h-4 w-4 text-muted-foreground" />
          </Button>
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => onTagnhep(student.classes[0])}
            title="Tác nghiệp chăm sóc học viên"
            className="h-7 w-7 hover:bg-primary/10 hover:text-primary rounded-md shrink-0 shadow-none"
          >
            <Edit className="h-4 w-4" />
          </Button>
        </div>
      </TableCell>
    </TableRow>
  )
}
