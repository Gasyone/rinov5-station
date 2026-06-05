'use client'

import { useMemo, useState, Fragment } from 'react'
import { ExternalLink, ChevronDown, ChevronRight, Share2 } from 'lucide-react'
import { toast } from 'sonner'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { getStatusBadgeClass, getRateColorClass } from '@/lib/statusColors'
import { ContactCell } from '@/components/shared'
import { cn } from '@/lib/utils'
import { RenewalCareRecord } from '@/mocks/renewalCare'
import { getFamilyContacts } from '@/mocks/careAlerts'
import { parseAttendanceRate } from './renewalHelpers'
import { RenewalChildRow } from './RenewalChildRow'

interface RenewalTableProps {
  records: RenewalCareRecord[]
  onTagnhep: (record: RenewalCareRecord) => void
  selectedIds: string[]
  onSelectChange: (id: string, checked: boolean) => void
  onSelectAll: (checked: boolean) => void
}

interface GroupedRenewalRecord {
  studentId: string
  studentName: string
  customerCode?: string
  studentFolderLink: string
  csStaff: string
  classes: RenewalCareRecord[]
}

export function RenewalTable({
  records,
  onTagnhep,
  selectedIds,
  onSelectChange,
  onSelectAll
}: RenewalTableProps) {
  // 1. Group records by studentId on the fly
  const groupedRecords = useMemo(() => {
    const groups: Record<string, RenewalCareRecord[]> = {}
    for (const record of records) {
      if (!groups[record.studentId]) {
        groups[record.studentId] = []
      }
      groups[record.studentId].push(record)
    }

    return Object.entries(groups).map(([studentId, list]) => {
      const first = list[0]
      return {
        studentId,
        studentName: first.studentName,
        customerCode: first.customerCode,
        studentFolderLink: first.studentFolderLink,
        csStaff: first.csStaff,
        classes: list
      } as GroupedRenewalRecord
    })
  }, [records])

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
  const handleStudentSelectChange = (student: GroupedRenewalRecord, checked: boolean) => {
    student.classes.forEach((c) => {
      onSelectChange(c.id, checked)
    })
  }

  const allSelected = records.length > 0 && records.every((item) => selectedIds.includes(item.id))

  // Custom status colors matching HSL standards
  const getRenewalStatusBadge = (status: RenewalCareRecord['renewalStatus'], subStatus?: string) => {
    if (status === 'Thành công') {
      return (
        <Badge variant="outline" className={`text-[8px] px-1.5 h-4 font-semibold ${getStatusBadgeClass('success')}`}>
          {subStatus || 'Thành công'}
        </Badge>
      )
    }
    if (status === 'Thất bại') {
      return (
        <Badge variant="outline" className={`text-[8px] px-1.5 h-4 font-semibold ${getStatusBadgeClass('error')}`}>
          {subStatus === 'Thất bại tự động' ? 'Quá hạn' : subStatus || 'Thất bại'}
        </Badge>
      )
    }
    return (
      <Badge variant="outline" className={`text-[8px] px-1.5 h-4 font-semibold ${getStatusBadgeClass('info')}`}>
        Đang tư vấn
      </Badge>
    )
  }

  return (
    <div className="w-full relative">
      <Table containerClassName="overflow-visible">
        <TableHeader className="sticky top-0 bg-background z-20">
          <TableRow className="hover:bg-transparent border-b border-border">
            {/* 1. Checkbox */}
            <TableHead className="w-8 text-center text-[10px] font-bold uppercase py-1 px-1 sticky top-0 bg-background z-20">
              <Checkbox 
                checked={allSelected} 
                onCheckedChange={(val) => onSelectAll(!!val)} 
                aria-label="Chọn tất cả"
              />
            </TableHead>
            
            {/* 2. Học viên / Môn */}
            <TableHead className="min-w-36 text-[10px] font-bold uppercase py-1 px-1.5 sticky top-0 bg-background z-20">Học viên / Môn</TableHead>
            
            {/* 3. Điện thoại */}
            <TableHead className="min-w-32 text-[10px] font-bold uppercase py-1 px-1.5 sticky top-0 bg-background z-20">Liên hệ</TableHead>

            {/* 4. Lớp học */}
            <TableHead className="min-w-28 text-[10px] font-bold uppercase py-1 px-1.5 sticky top-0 bg-background z-20">Lớp học</TableHead>
            
            {/* 5. Cấp độ */}
            <TableHead className="min-w-20 text-[10px] font-bold uppercase py-1 px-1.5 sticky top-0 bg-background z-20">Cấp độ</TableHead>
            
            {/* 6. Sub-level */}
            <TableHead className="min-w-16 text-[10px] font-bold uppercase text-center py-1 px-1.5 sticky top-0 bg-background z-20">Sub-level</TableHead>

            {/* 7. Ngày bắt đầu */}
            <TableHead className="min-w-20 text-[10px] font-bold uppercase py-1 px-1.5 sticky top-0 bg-background z-20">Ngày bắt đầu</TableHead>

            {/* 8. Hạn hết phí */}
            <TableHead className="min-w-20 text-[10px] font-bold uppercase text-center py-1 px-1.5 sticky top-0 bg-background z-20">Hạn hết phí</TableHead>
            
            {/* 9. Trạng thái học */}
            <TableHead className="min-w-20 text-[10px] font-bold uppercase py-1 px-1.5 sticky top-0 bg-background z-20">Trạng thái học</TableHead>

            {/* 10. Trạng thái lớp */}
            <TableHead className="min-w-20 text-[10px] font-bold uppercase py-1 px-1.5 sticky top-0 bg-background z-20">Trạng thái lớp</TableHead>

            {/* 11. Trạng thái Tái phí */}
            <TableHead className="min-w-20 text-[10px] font-bold uppercase text-center py-1 px-1.5 sticky top-0 bg-background z-20">Trạng thái Tái phí</TableHead>
            
            {/* 12. Kết quả hành động */}
            <TableHead className="min-w-24 text-[10px] font-bold uppercase text-center py-1 px-1.5 sticky top-0 bg-background z-20">Kết quả</TableHead>
            
            {/* 13. Giáo viên */}
            <TableHead className="min-w-24 text-[10px] font-bold uppercase py-1 px-1.5 sticky top-0 bg-background z-20">Giáo viên</TableHead>
            
            {/* 14. Lịch học */}
            <TableHead className="min-w-36 text-[10px] font-bold uppercase py-1 px-1.5 sticky top-0 bg-background z-20">Lịch học</TableHead>

            {/* 15. Tổng buổi */}
            <TableHead className="min-w-14 text-[10px] font-bold uppercase text-center py-1 px-1.5 sticky top-0 bg-background z-20">Tổng buổi</TableHead>

            {/* 16. Còn lại */}
            <TableHead className="min-w-14 text-[10px] font-bold uppercase text-center py-1 px-1.5 sticky top-0 bg-background z-20">Còn lại</TableHead>
            
            {/* 17. Chuyên cần */}
            <TableHead className="min-w-20 text-[10px] font-bold uppercase py-1 px-1.5 sticky top-0 bg-background z-20">Chuyên cần</TableHead>
            
            {/* 18. BTVN */}
            <TableHead className="min-w-16 text-[10px] font-bold uppercase py-1 px-1.5 sticky top-0 bg-background z-20">BTVN</TableHead>
            
            {/* 19. Lần cuối */}
            <TableHead className="min-w-14 text-[10px] font-bold uppercase text-center py-1 px-1.5 sticky top-0 bg-background z-20">Lần cuối</TableHead>
            
            {/* 20. Điểm TB */}
            <TableHead className="min-w-14 text-[10px] font-bold uppercase text-center py-1 px-1.5 sticky top-0 bg-background z-20">Điểm TB</TableHead>
            
            {/* 21. Cảnh báo CS */}
            <TableHead className="min-w-20 text-[10px] font-bold uppercase text-center py-1 px-1.5 sticky top-0 bg-background z-20">Cảnh báo CS</TableHead>

            {/* 22. CSKH Tác nghiệp */}
            <TableHead className="min-w-36 text-[10px] font-bold uppercase py-1 px-1.5 sticky top-0 bg-background z-20">CSKH Tác nghiệp</TableHead>
            
            {/* 23. Thao tác */}
            <TableHead className="w-14 text-right text-[10px] font-bold uppercase py-1 px-1.5 sticky right-0 top-0 bg-background z-30">Thao tác</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {groupedRecords.length === 0 ? (
            <TableRow>
              <TableCell colSpan={23} className="h-32 text-center text-xs text-muted-foreground">
                Không tìm thấy danh sách học viên cần tái phí phù hợp.
              </TableCell>
            </TableRow>
          ) : (
            groupedRecords.map((student) => {
              const isExpanded = expandedStudentIds.includes(student.studentId)
              const totalClasses = student.classes.length

              // Parent values: Calculate average metrics
              let totalAttRate = 0
              let totalHwRate = 0
              let highestTestScore = 0
              let totalAvgScore = 0
              let combinedNotes = ''
              let totalRemaining = 0
              let totalSessionsCount = 0
              let hasC90BAlert = false

              // Determine overall renewal status
              let hasInCare = false
              let hasSuccess = false
              let anySubStatus = 'Chờ xử lý'

              student.classes.forEach((c) => {
                totalAttRate += parseAttendanceRate(c.attendanceRatio)
                totalHwRate += c.homeworkCompletion
                highestTestScore = Math.max(highestTestScore, c.lastTestScore)
                totalAvgScore += (c.lastTestScore + c.priorTestScore) / 2
                totalRemaining += c.remainingSessions
                totalSessionsCount += c.totalSessions

                if (c.careAlert === 'C90B') {
                  hasC90BAlert = true
                }
                
                if (c.renewalStatus === 'Đang chăm sóc') hasInCare = true
                else if (c.renewalStatus === 'Thành công') hasSuccess = true

                if (c.subStatus !== 'Chờ xử lý') anySubStatus = c.subStatus

                if (c.interactionNotes) {
                  combinedNotes += (combinedNotes ? ' | ' : '') + c.interactionNotes
                }
              })

              const avgAttRate = Math.round(totalAttRate / totalClasses)
              const avgHwRate = Math.round(totalHwRate / totalClasses)
              const avgTotalScore = (totalAvgScore / totalClasses).toFixed(1)

              const overallStatus: RenewalCareRecord['renewalStatus'] = hasInCare 
                ? 'Đang chăm sóc' 
                : hasSuccess 
                  ? 'Thành công' 
                  : 'Thất bại'

              const parentAttColor = getRateColorClass(avgAttRate)
              const parentHwColor = getRateColorClass(avgHwRate)

              const allStudentClassIds = student.classes.map((c) => c.id)
              const isStudentSelected = allStudentClassIds.every((id) => selectedIds.includes(id))

              // Get family contacts for parent student row
              const contacts = getFamilyContacts(student.studentId, student.studentName)
              const primaryContact = contacts.find(c => c.isPrimary) || contacts[0]

              return (
                <Fragment key={student.studentId}>
                  {/* PARENT ROW (STUDENT ROW) */}
                  <TableRow 
                    className={`text-[11px] hover:bg-muted/30 font-medium transition-colors border-b border-border cursor-pointer select-none ${
                      isStudentSelected ? 'bg-primary/5 hover:bg-primary/10' : ''
                    }`}
                    onClick={() => toggleExpand(student.studentId)}
                  >
                    {/* 1. Checkbox */}
                    <TableCell className="text-center w-8 py-1 px-1" onClick={(e) => e.stopPropagation()}>
                      <Checkbox 
                        checked={isStudentSelected} 
                        onCheckedChange={(val) => handleStudentSelectChange(student, !!val)} 
                        aria-label={`Chọn học viên ${student.studentName}`}
                      />
                    </TableCell>

                    {/* 2. Student Info */}
                    <TableCell className="py-1 px-1.5 min-w-36">
                      <div className="flex items-center gap-1.5">
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon-sm"
                          onClick={(e) => { e.stopPropagation(); toggleExpand(student.studentId); }}
                          className="h-5 w-5 p-0 hover:bg-muted shrink-0"
                          title={isExpanded ? 'Thu gọn' : 'Mở rộng chi tiết lớp'}
                        >
                          {isExpanded ? (
                            <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
                          ) : (
                            <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />
                          )}
                        </Button>

                        <div className="flex flex-col gap-0 min-w-0">
                          <div className="font-bold text-foreground flex items-center gap-1 truncate">
                            <span className="truncate text-[11px]">{student.studentName}</span>
                            {student.studentFolderLink && (
                              <a 
                                href={student.studentFolderLink} 
                                target="_blank" 
                                rel="noreferrer"
                                title="Thư mục học viên (ảnh/video)"
                                className="text-muted-foreground hover:text-primary shrink-0"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <ExternalLink className="h-2.5 w-2.5" />
                              </a>
                            )}
                          </div>
                          <div className="text-[9px] text-muted-foreground font-mono flex items-center gap-1">
                            <span>ID: {student.studentId}</span>
                            {student.customerCode && <span>• {student.customerCode}</span>}
                          </div>
                        </div>
                      </div>
                    </TableCell>

                    <TableCell className="py-1 px-1.5 min-w-32" onClick={(e) => e.stopPropagation()}>
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

                    {/* 4. Lớp học */}
                    <TableCell className="text-muted-foreground italic text-center font-medium py-1 px-1.5 min-w-28">
                      -
                    </TableCell>

                    {/* 5. Cấp độ */}
                    <TableCell className="text-muted-foreground italic text-center py-1 px-1.5 min-w-20">
                      -
                    </TableCell>

                    {/* 6. Sub-level */}
                    <TableCell className="text-muted-foreground italic text-center py-1 px-1.5 min-w-16">
                      -
                    </TableCell>

                    {/* 7. Ngày bắt đầu */}
                    <TableCell className="text-muted-foreground italic text-center py-1 px-1.5 min-w-20">
                      -
                    </TableCell>

                    {/* 8. Hạn hết phí */}
                    <TableCell className="text-muted-foreground italic font-mono text-center py-1 px-1.5 min-w-20">
                      -
                    </TableCell>

                    {/* 9. Trạng thái học */}
                    <TableCell className="py-1 px-1.5 min-w-20">
                      <Badge variant="outline" className="text-[7px] px-1 h-3.5 bg-sky-50 text-sky-700 border-sky-200 py-0 font-bold">
                        {totalClasses} lớp học
                      </Badge>
                    </TableCell>

                    {/* 10. Trạng thái lớp */}
                    <TableCell className="text-muted-foreground italic text-center py-1 px-1.5 min-w-20">
                      -
                    </TableCell>

                    {/* 11. Trạng thái Tái phí */}
                    <TableCell className="text-center py-1 px-1.5 min-w-20">
                      {getRenewalStatusBadge(overallStatus, anySubStatus === 'Chờ xử lý' ? undefined : anySubStatus)}
                    </TableCell>

                    {/* 12. Kết quả hành động */}
                    <TableCell className="text-center py-1 px-1.5 min-w-24">
                      {overallStatus === 'Thành công' ? (
                        <Badge variant="outline" className={cn("text-[7px] border-emerald-300 bg-emerald-50 text-emerald-700 font-bold px-1 py-0 h-3.5", getStatusBadgeClass('approved'))}>
                          {student.classes.map(c => c.resultType).filter(r => r !== 'Đang chăm sóc' && r !== 'Thất bại')[0] || 'Hoàn tất'}
                        </Badge>
                      ) : overallStatus === 'Thất bại' ? (
                        <span className="text-red-500 font-semibold text-[9px]">Thất bại</span>
                      ) : (
                        <span className="text-muted-foreground text-[9px]">-</span>
                      )}
                    </TableCell>

                    {/* 13. Giáo viên */}
                    <TableCell className="text-muted-foreground italic text-center py-1 px-1.5 min-w-24">
                      -
                    </TableCell>

                    {/* 14. Lịch học */}
                    <TableCell className="text-muted-foreground italic text-center py-1 px-1.5 min-w-36">
                      -
                    </TableCell>

                    {/* 15. Tổng buổi */}
                    <TableCell className="text-center font-bold text-muted-foreground whitespace-nowrap text-[10px] py-1 px-1.5 min-w-14">
                      {totalSessionsCount}b
                    </TableCell>

                    {/* 16. Còn lại */}
                    <TableCell className="text-center font-bold text-primary whitespace-nowrap text-[10px] py-1 px-1.5 min-w-14">
                      Còn {totalRemaining}b
                    </TableCell>

                    {/* 17. Chuyên cần (Average) */}
                    <TableCell className="py-1 px-1.5 min-w-20">
                      <div className="flex flex-col gap-0.5 w-16">
                        <div className="flex justify-between items-center text-[9px]">
                          <span className="font-mono font-bold text-foreground">{avgAttRate}%</span>
                        </div>
                        <div className="bg-primary/10 relative h-1 w-full overflow-hidden rounded-full">
                          <div className={`h-full rounded-full transition-all ${parentAttColor}`} style={{ width: `${avgAttRate}%` }} />
                        </div>
                      </div>
                    </TableCell>

                    {/* 18. BTVN (Average) */}
                    <TableCell className="py-1 px-1.5 min-w-16">
                      <div className="flex flex-col gap-0.5 w-16">
                        <div className="flex justify-between items-center text-[9px]">
                          <span className="font-mono font-bold text-foreground">{avgHwRate}%</span>
                        </div>
                        <div className="bg-primary/10 relative h-1 w-full overflow-hidden rounded-full">
                          <div className={`h-full rounded-full transition-all ${parentHwColor}`} style={{ width: `${avgHwRate}%` }} />
                        </div>
                      </div>
                    </TableCell>

                    {/* 19. Test gần nhất */}
                    <TableCell className="text-center font-bold text-xs text-foreground py-1 px-1.5 min-w-14">
                      {highestTestScore}
                    </TableCell>

                    {/* 20. Điểm T.Bình */}
                    <TableCell className="text-center font-bold text-xs text-primary py-1 px-1.5 min-w-14">
                      {avgTotalScore}
                    </TableCell>

                    {/* 21. Cảnh báo CS */}
                    <TableCell className="text-center py-1 px-1.5 min-w-20">
                      {hasC90BAlert ? (
                        <Badge 
                          variant="outline" 
                          className={cn("text-[7px] px-1 h-3.5 font-bold animate-pulse font-mono py-0", getStatusBadgeClass('high'))}
                        >
                          C90B
                        </Badge>
                      ) : (
                        <span className="text-muted-foreground text-[9px]">-</span>
                      )}
                    </TableCell>

                    {/* 22. CSKH Tác nghiệp */}
                    <TableCell className="py-1 px-1.5 min-w-36">
                      <div className="flex flex-col gap-0 max-w-[140px]">
                        <div className="flex items-center gap-1">
                          <span className="font-semibold text-muted-foreground text-[10px]">{student.csStaff}</span>
                        </div>
                        <p className="text-[9px] text-muted-foreground truncate leading-tight" title={combinedNotes}>
                          {combinedNotes || <span className="italic text-zinc-350 dark:text-zinc-700">Chưa tương tác...</span>}
                        </p>
                      </div>
                    </TableCell>

                    {/* 23. Action */}
                    <TableCell className="text-right sticky right-0 bg-background/95 backdrop-blur-xs z-10 py-1 px-1.5 w-14" onClick={(e) => e.stopPropagation()}>
                      <div className="flex justify-end gap-0.5">
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          onClick={() => {
                            const firstClass = student.classes[0];
                            const link = firstClass?.learningResultsLink || `https://rinov5.com/report/${student.studentId}`;
                            navigator.clipboard.writeText(link);
                            toast.success(`Đã sao chép link báo cáo học tập tổng hợp của học viên ${student.studentName}!`);
                          }}
                          title="Sao chép link báo cáo học tập tổng hợp"
                          className="h-5 w-5 p-0 hover:bg-primary/10 hover:text-primary rounded-sm shrink-0"
                        >
                          <Share2 className="h-3 w-3 text-muted-foreground" />
                        </Button>
                        {/* Nút tác nghiệp ở dòng cha nếu cần */}
                      </div>
                    </TableCell>
                  </TableRow>

                  {/* CHILD ROWS (EXPANDED CLASS DETAILS) */}
                  {isExpanded && student.classes.map((c) => (
                    <RenewalChildRow
                      key={c.id}
                      c={c}
                      studentName={student.studentName}
                      isChildSelected={selectedIds.includes(c.id)}
                      onSelectChange={onSelectChange}
                      onTagnhep={onTagnhep}
                      getRenewalStatusBadge={getRenewalStatusBadge}
                    />
                  ))}
                </Fragment>
              )
            })
          )}
        </TableBody>
      </Table>
    </div>
  )
}
