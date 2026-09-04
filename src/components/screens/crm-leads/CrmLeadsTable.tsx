'use client'

import { Eye, Copy, Check, ExternalLink, FileText, School, GraduationCap, Calendar, UserPlus, Plus, User } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'
import { Lead } from '@/mocks/crmLeads'
import { ClassRecord } from '@/mocks/classRecords'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { DataTableFrame, DataTablePagination } from '@/components/data-table'
import { cn } from '@/lib/utils'
import { getStatusBadgeClass } from '@/lib/statusColors'
import { ClassesDetailDialog } from '@/components/screens/classes/detail/ClassesDetailDialog'
import { maskPhoneNumber, formatAgeAndBirthYear, getInitialLevel, getLeadSubStatusLabel, getLeadCareInfo, getStaffAssignmentInfo, getProductGroup, getCleanStaffName, formatDateShort, formatDateTimeWithDayOfWeek, getClassRecord } from './crmLeadsHelpers'
import { SOURCE_LABEL_MAP, STATUS_LABEL_MAP } from './crmLeadsTypes'
import { CrmLeadsCareHistoryPopover } from './CrmLeadsCareHistoryPopover'
import { StaffSelect } from './CrmCustomerCreateSearchSelect'
import { STAFF_LIST, StaffOption } from './crmCustomerCreateTypes'

interface CrmLeadsTableProps {
  viewScope?: 'my' | 'all'
  leads: Lead[]
  totalItems: number
  currentPage: number
  pageSize: number
  onPageChange: (page: number) => void
  onPageSizeChange: (size: number) => void
  onViewDetail: (lead: Lead) => void
  onOpenContactProfile?: (lead: Lead) => void
  onOpenBookingTest?: (lead: Lead) => void
  onOpenTrialClass?: (lead: Lead) => void
  onOpenCreateOrder?: (lead: Lead) => void
}

export function CrmLeadsTable({
  viewScope = 'all',
  leads,
  totalItems,
  currentPage,
  pageSize,
  onPageChange,
  onPageSizeChange,
  onViewDetail,
  onOpenContactProfile,
  onOpenBookingTest,
  onOpenTrialClass,
  onOpenCreateOrder,
}: CrmLeadsTableProps) {
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [assignments, setAssignments] = useState<Record<string, string>>({})

  // State quản lý Modal Chi tiết Lớp học có sẵn
  const [selectedClassRecord, setSelectedClassRecord] = useState<ClassRecord | null>(null)
  const [isClassDetailOpen, setIsClassDetailOpen] = useState<boolean>(false)

  const handleOpenClassDetail = (e: React.MouseEvent, classCode?: string, subject?: string) => {
    e.preventDefault()
    e.stopPropagation()
    const code = classCode || 'SK-02'
    const record = getClassRecord(code, subject)
    setSelectedClassRecord(record)
    setIsClassDetailOpen(true)
  }

  const startIdx = (currentPage - 1) * pageSize
  const paginatedLeads = leads.slice(startIdx, startIdx + pageSize)

  const isAllSelected =
    paginatedLeads.length > 0 &&
    paginatedLeads.every((lead) => selectedIds.includes(lead.id))

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      const pageIds = paginatedLeads.map((l) => l.id)
      setSelectedIds((prev) => Array.from(new Set([...prev, ...pageIds])))
    } else {
      const pageIds = paginatedLeads.map((l) => l.id)
      setSelectedIds((prev) => prev.filter((id) => !pageIds.includes(id)))
    }
  }

  const handleSelectRow = (leadId: string, checked: boolean) => {
    if (checked) {
      setSelectedIds((prev) => [...prev, leadId])
    } else {
      setSelectedIds((prev) => prev.filter((id) => id !== leadId))
    }
  }

  const handleCopyPhone = (e: React.MouseEvent, phone: string, leadId: string) => {
    e.stopPropagation()
    navigator.clipboard.writeText(phone)
    setCopiedId(leadId)
    toast.success(`Đã sao chép số điện thoại: ${phone}`)
    setTimeout(() => setCopiedId(null), 2000)
  }

  const handleAssignStaff = (lead: Lead, staff: StaffOption | string) => {
    const staffName = typeof staff === 'string' ? staff : `${staff.name} (${staff.role})`
    setAssignments((prev) => ({ ...prev, [lead.id]: staffName }))
    toast.success(`Đã phân bổ lead ${lead.code} (${lead.studentName}) cho ${staffName}`)
  }

  // Render Nút Icon Lịch sử (N) đưa lên Dòng 1
  const renderHistoryPopoverButton = (lead: Lead, eventCount: number) => (
    <Popover>
      <PopoverTrigger asChild>
        <button
          type="button"
          className="inline-flex items-center gap-0.5 text-xs text-primary hover:opacity-80 p-0 bg-transparent border-0 font-mono font-bold cursor-pointer shrink-0 ml-0.5"
          title="Xem lịch sử đánh giá & học thử"
        >
          <FileText className="h-3.5 w-3.5 text-primary" />
          <span>({eventCount})</span>
        </button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-80 p-3 shadow-lg z-50">
        <div className="text-xs font-bold text-foreground border-b pb-1.5 mb-2 flex items-center justify-between">
          <span>Lịch sử Đánh giá & Trải nghiệm</span>
          <span className="font-normal text-muted-foreground">({lead.studentName})</span>
        </div>
        <div className="space-y-2 text-xs">
          {/* Mục 1: Đánh giá / Phỏng vấn */}
          {lead.testStatus && (
            <div className="p-2 rounded bg-purple-50/70 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800 flex flex-col gap-1">
              <div className="flex items-center justify-between font-semibold text-purple-900 dark:text-purple-300">
                <span className="flex items-center gap-1">
                  <GraduationCap className="h-3.5 w-3.5 text-purple-600" />
                  Đánh giá: {lead.testerTeacherName || 'Thầy Alex'}
                </span>
                <Badge variant="outline" className="text-xs py-0 px-1">
                  {lead.testStatus === 'completed' ? 'Đã test' : lead.testStatus === 'scheduled' ? 'Hẹn test' : 'Vắng test'}
                </Badge>
              </div>
              <div className="text-xs text-muted-foreground">
                {lead.testResultLevel ? `${lead.testResultLevel} (${lead.testScore})` : `Lịch: ${formatDateShort(lead.testDate)}`}
              </div>
              <a
                href={`/app/booking_test?leadId=${lead.id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-xs text-primary font-medium hover:underline mt-0.5"
              >
                <ExternalLink className="h-3 w-3" />
                <span>Phiếu kết quả</span>
              </a>
            </div>
          )}

          {/* Mục 2: Học thử */}
          {lead.trialStatus && (
            <div className="p-2 rounded bg-sky-50/70 dark:bg-sky-950/40 border border-sky-200 dark:border-sky-800 flex flex-col gap-1">
              <div className="flex items-center justify-between font-semibold text-sky-900 dark:text-sky-300">
                <span className="flex items-center gap-1">
                  <School className="h-3.5 w-3.5 text-sky-600" />
                  Học thử: {lead.trialClassName || 'SK-02'}
                </span>
                <Badge variant="outline" className="text-xs py-0 px-1">
                  {lead.trialStatus === 'completed' ? 'Đã học thử' : lead.trialStatus === 'scheduled' ? 'Hẹn thử' : 'Vắng thử'}
                </Badge>
              </div>
              <div className="text-xs text-muted-foreground italic line-clamp-1">
                {lead.trialFeedback || `Ngày học: ${formatDateShort(lead.trialDate)}`}
              </div>
              <a
                href={`/app/trial_class?leadId=${lead.id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-xs text-sky-600 dark:text-sky-400 font-medium hover:underline mt-0.5"
              >
                <ExternalLink className="h-3 w-3" />
                <span>Phiếu nhận xét</span>
              </a>
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  )

  return (
    <>
      <DataTableFrame
        footer={
          <DataTablePagination
            page={currentPage}
            pageSize={pageSize}
            total={totalItems}
            onPageChange={onPageChange}
            onPageSizeChange={onPageSizeChange}
          />
        }
      >
        <Table containerClassName="w-full overflow-x-auto min-h-full" className="min-w-[1750px] border-collapse">
          <TableHeader className="sticky top-0 z-20 bg-muted/95 backdrop-blur-xs shadow-xs [&_th]:bg-muted/95 [&_th]:backdrop-blur-xs">
            <TableRow className="border-b border-border hover:bg-transparent">
              {/* Checkbox */}
              <TableHead className="w-[48px] min-w-[48px] px-3">
                <Checkbox
                  checked={isAllSelected}
                  onCheckedChange={handleSelectAll}
                  aria-label="Chọn tất cả Lead"
                />
              </TableHead>
              <TableHead className="min-w-[260px]">Lead & Nguồn</TableHead>
              <TableHead className="min-w-[190px]">Phụ huynh / Liên hệ</TableHead>
              <TableHead className="min-w-[160px]">Tuổi & Trình độ</TableHead>
              <TableHead className="min-w-[210px]">Khóa học & Nhóm SP</TableHead>
              <TableHead className="min-w-[240px]">Đánh giá & Trải nghiệm</TableHead>
              <TableHead className="min-w-[290px] text-left">Lịch sử chăm sóc</TableHead>
              <TableHead className="min-w-[150px]">Trạng thái</TableHead>
              {viewScope === 'all' && (
                <TableHead className="min-w-[180px]">Người phụ trách</TableHead>
              )}
              <TableHead className="min-w-[250px]">Đơn hàng</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedLeads.map((lead, index) => {
              const isSelected = selectedIds.includes(lead.id)
              const isEven = index % 2 === 0
              const birthYear = lead.birthYear ?? 2026 - lead.studentAge
              const assignedStaff = assignments[lead.id] ?? lead.assignedTo
              const isUnassigned = !assignedStaff || assignedStaff.trim() === '' || assignedStaff === 'Chưa phân bổ'
              const careInfo = getLeadCareInfo(lead)
              const staffAssignInfo = getStaffAssignmentInfo(lead)

              // Kiểm tra sự kiện
              const hasTest = Boolean(lead.testStatus)
              const hasTrial = Boolean(lead.trialStatus)
              const eventCount = (hasTest ? 1 : 0) + (hasTrial ? 1 : 0)

              return (
                <TableRow
                  key={lead.id}
                  className={cn(
                    'border-b border-border/60 transition-colors group',
                    isSelected
                      ? 'bg-accent/40 data-[state=selected]:bg-accent/40'
                      : isEven
                      ? 'bg-background hover:bg-muted/50'
                      : 'bg-muted/25 dark:bg-muted/15 hover:bg-muted/50'
                  )}
                >
                  {/* Checkbox dòng */}
                  <TableCell className="px-3">
                    <Checkbox
                      checked={isSelected}
                      onCheckedChange={(checked) =>
                        handleSelectRow(lead.id, Boolean(checked))
                      }
                      aria-label={`Chọn lead học viên ${lead.studentName}`}
                    />
                  </TableCell>

                  {/* Cột 1: Lead & Nguồn - Tên học viên (Focus chính) + Mã Lead & Nguồn */}
                  <TableCell className="relative cursor-pointer" onClick={() => onViewDetail(lead)}>
                    <div className="flex flex-col gap-0.5 pr-14">
                      <div className="font-semibold text-foreground text-sm flex items-center gap-1.5">
                        <span>{lead.studentName}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <span className="font-mono font-medium text-foreground/80">{lead.code}</span>
                        <span className="text-muted-foreground/40">•</span>
                        <span>{SOURCE_LABEL_MAP[lead.source] ?? lead.source}</span>
                      </div>
                    </div>

                    {/* Icons thao tác xem chi tiết & xem hồ sơ contact - Hiển thị khi hover */}
                    <div
                      className="absolute right-2 top-1/2 -translate-y-1/2 hidden group-hover:flex items-center gap-1 bg-background/90 backdrop-blur-xs p-0.5 rounded-lg border border-border/60 shadow-xs"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-7 w-7 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 rounded-md cursor-pointer"
                        onClick={() => onOpenContactProfile?.(lead)}
                        title="Xem / Sửa thông tin hồ sơ liên hệ (Contact Info Modal)"
                      >
                        <User className="h-4 w-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-7 w-7 text-primary hover:bg-primary/10 rounded-md cursor-pointer"
                        onClick={() => onViewDetail(lead)}
                        title="Xem chi tiết tác nghiệp Lead"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>

                  {/* Cột 2: Phụ huynh / Liên hệ (Đưa lên trước Tuổi & Trình độ) */}
                  <TableCell>
                    <div className="flex flex-col gap-0.5">
                      <div className="text-xs font-medium text-foreground flex items-center gap-1.5">
                        <span>{lead.parentName}</span>
                        {lead.parentRole && (
                          <Badge variant="outline" className="text-xs py-0 px-1 font-normal text-muted-foreground border-muted-foreground/30">
                            {lead.parentRole}
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-1.5 font-mono text-xs text-muted-foreground">
                        <span>
                          {maskPhoneNumber(lead.phone)}
                        </span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="h-5 w-5 text-muted-foreground hover:text-foreground shrink-0 cursor-pointer"
                          title="Sao chép số điện thoại đầy đủ"
                          onClick={(e) => handleCopyPhone(e, lead.phone, lead.id)}
                        >
                          {copiedId === lead.id ? (
                            <Check className="h-3 w-3 text-emerald-600 dark:text-emerald-400" />
                          ) : (
                            <Copy className="h-3 w-3" />
                          )}
                        </Button>
                      </div>
                    </div>
                  </TableCell>

                  {/* Cột 3: Tuổi & Trình độ ban đầu khi tạo test */}
                  <TableCell>
                    <div className="flex flex-col gap-0.5">
                      <div className="text-xs font-medium text-foreground">
                        {formatAgeAndBirthYear(lead.studentAge, birthYear)}
                      </div>
                      <div className="text-xs text-muted-foreground font-mono">
                        {getInitialLevel(lead)}
                      </div>
                    </div>
                  </TableCell>

                  {/* Cột 4: Khóa học đăng ký & Nhóm sản phẩm */}
                  <TableCell>
                    <div className="flex flex-col gap-0.5 max-w-[200px]">
                      <div className="font-medium text-foreground text-xs truncate">
                        {lead.targetSubject}
                      </div>
                      <div className="text-xs text-muted-foreground truncate">
                        {getProductGroup(lead.targetSubject)}
                      </div>
                    </div>
                  </TableCell>

                  {/* Cột 5: Đánh giá & Trải nghiệm (Sự kiện mới nhất hiển thị chung dòng 1-2 + Icon lịch sử riêng) */}
                  <TableCell>
                    {eventCount === 0 ? (
                      <div className="flex items-center gap-1.5 flex-nowrap" onClick={(e) => e.stopPropagation()}>
                        <Button
                          type="button"
                          size="sm"
                          variant="outline"
                          className="h-6 px-2 text-xs font-medium border-purple-200 text-purple-700 bg-purple-50/60 hover:bg-purple-100 hover:text-purple-900 dark:border-purple-800 dark:text-purple-300 dark:bg-purple-950/40 dark:hover:bg-purple-900/60 cursor-pointer shadow-2xs shrink-0"
                          onClick={() => onOpenBookingTest?.(lead)}
                          title="Đặt lịch đánh giá năng lực (ĐK trải nghiệm)"
                        >
                          <span>ĐK trải nghiệm</span>
                        </Button>
                        <Button
                          type="button"
                          size="sm"
                          variant="outline"
                          className="h-6 px-2 text-xs font-medium border-sky-200 text-sky-700 bg-sky-50/60 hover:bg-sky-100 hover:text-sky-900 dark:border-sky-800 dark:text-sky-300 dark:bg-sky-950/40 dark:hover:bg-sky-900/60 cursor-pointer shadow-2xs shrink-0"
                          onClick={() => onOpenTrialClass?.(lead)}
                          title="Đăng ký ghép lớp học thử (ĐK học thử)"
                        >
                          <span>ĐK học thử</span>
                        </Button>
                      </div>
                    ) : (
                      <div className="flex flex-col gap-0.5 max-w-[240px]">
                        {hasTrial ? (
                          <>
                            {/* Dòng 1 Học thử: "Học thử:" + Mã lớp + Icon Lịch sử */}
                            <div className="flex items-center gap-1.5 text-xs text-foreground font-medium flex-nowrap">
                              <span className="text-muted-foreground font-normal shrink-0">Học thử:</span>
                              <button
                                type="button"
                                className="font-medium text-primary hover:underline cursor-pointer bg-transparent p-0 border-0 truncate"
                                onClick={(e) => handleOpenClassDetail(e, lead.trialClassName, lead.targetSubject)}
                                title="Bấm để mở chi tiết Lớp học"
                              >
                                {lead.trialClassName || 'SK-02'}
                              </button>
                              {eventCount > 1 && renderHistoryPopoverButton(lead, eventCount)}
                            </div>

                            {/* Dòng 2 Học thử: Click vào link mở ra tab kết quả (Thứ, Ngày, Giờ) */}
                            <div className="flex items-center gap-1 text-xs text-muted-foreground whitespace-nowrap">
                              <a
                                href={`/app/trial_class?leadId=${lead.id}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-muted-foreground hover:text-primary hover:underline inline-flex items-center gap-1 font-mono truncate max-w-[200px]"
                                title="Bấm để mở phiếu nhận xét / kết quả học thử"
                              >
                                <ExternalLink className="h-3 w-3 shrink-0" />
                                <span>{formatDateTimeWithDayOfWeek(lead.trialDate, lead.trialTime)}</span>
                              </a>
                            </div>
                          </>
                        ) : (
                          <>
                            {/* Dòng 1 Đánh giá: "Đánh giá:" + Tên Người phụ trách + Icon Lịch sử */}
                            <div className="flex items-center gap-1.5 text-xs text-foreground font-medium flex-nowrap">
                              <span className="text-muted-foreground font-normal shrink-0">Đánh giá:</span>
                              <span className="text-foreground truncate font-medium">{lead.testerTeacherName || 'Thầy Alex'}</span>
                              {eventCount > 1 && renderHistoryPopoverButton(lead, eventCount)}
                            </div>

                            {/* Dòng 2 Đánh giá: Click vào link mở ra kết quả (Thứ, Ngày, Giờ) */}
                            <div className="flex items-center gap-1 text-xs text-muted-foreground whitespace-nowrap">
                              <a
                                href={`/app/booking_test?leadId=${lead.id}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-muted-foreground hover:text-primary hover:underline inline-flex items-center gap-1 font-mono truncate max-w-[200px]"
                                title="Bấm để mở phiếu kết quả đánh giá năng lực"
                              >
                                <ExternalLink className="h-3 w-3 shrink-0" />
                                <span>{formatDateTimeWithDayOfWeek(lead.testDate, lead.testTime)}</span>
                              </a>
                            </div>
                          </>
                        )}
                      </div>
                    )}
                  </TableCell>

                  {/* Cột 6: Lịch sử chăm sóc (Mới - Thiết kế giống màn Tái phí) */}
                  <TableCell className="min-w-[290px]" onClick={(e) => e.stopPropagation()}>
                    {(() => {
                      const { isUncared, inProgress, attemptCount, isRescheduled, rescheduleDate, rescheduleTime, latestLog } = careInfo

                      const cellContent = (
                        <div className="flex flex-col gap-1 py-0.5 text-left max-w-[280px] cursor-pointer group/care">
                          {/* Hàng 1: Text Chăm sóc (XX) / Chưa chăm sóc + Lịch hẹn gọi lại */}
                          <div className="flex items-center gap-2 flex-wrap">
                            <span
                              className={cn(
                                'text-xs font-normal transition-colors',
                                isUncared
                                  ? 'text-muted-foreground select-none'
                                  : inProgress
                                  ? 'text-sky-600 dark:text-sky-400 group-hover/care:underline'
                                  : 'text-emerald-600 dark:text-emerald-400 group-hover/care:underline'
                              )}
                              title={isUncared ? undefined : 'Rê chuột hoặc bấm để xem chi tiết Lịch sử chăm sóc'}
                            >
                              {isUncared ? 'Chưa chăm sóc' : `Chăm sóc (${attemptCount})`}
                            </span>

                            {/* Lịch hẹn gọi lại / chăm sóc */}
                            {isRescheduled && rescheduleDate && (
                              <span
                                className="text-xs font-normal text-violet-600 dark:text-violet-400 flex items-center gap-1 whitespace-nowrap"
                                title="Lịch hẹn gọi lại / chăm sóc"
                              >
                                <Calendar className="h-3.5 w-3.5 shrink-0 text-violet-500 dark:text-violet-400" />
                                <span>Hẹn: {rescheduleDate} {rescheduleTime ? `(${rescheduleTime})` : ''}</span>
                              </span>
                            )}
                          </div>

                          {/* Hàng 2: Nội dung ghi chú chăm sóc gần nhất (1 dòng rút gọn) */}
                          {isUncared ? (
                            <div className="text-xs italic text-amber-600 dark:text-amber-400 font-medium">
                              Cần liên hệ trao đổi với phụ huynh ngay
                            </div>
                          ) : (
                            latestLog && (
                              <div
                                className="text-xs text-muted-foreground truncate group-hover/care:text-foreground transition-colors"
                                title={`Ghi chú (${latestLog.date}): ${latestLog.note}`}
                              >
                                <span className="font-mono text-foreground/70">{latestLog.date}:</span> {latestLog.note}
                              </div>
                            )
                          )}
                        </div>
                      )

                      if (isUncared) {
                        return cellContent
                      }

                      return (
                        <CrmLeadsCareHistoryPopover
                          lead={lead}
                          careInfo={careInfo}
                          trigger={cellContent}
                        />
                      )
                    })()}
                  </TableCell>

                  {/* Cột 7: Trạng thái phễu gộp & Trạng thái phụ */}
                  <TableCell className="min-w-[150px]">
                    <div className="flex flex-col gap-1 items-start">
                      <Badge className={cn("font-normal text-xs py-0.5 px-2", getStatusBadgeClass(lead.status))}>
                        {STATUS_LABEL_MAP[lead.status] ?? lead.status}
                      </Badge>
                      <span className="text-xs font-normal text-muted-foreground/80 truncate max-w-[140px]">
                        {getLeadSubStatusLabel(lead)}
                      </span>
                    </div>
                  </TableCell>

                  {/* Cột 8: Người phụ trách (Chỉ hiển thị trên viewScope 'all', ẩn trên viewScope 'my' vì là Lead của chính họ) */}
                  {viewScope === 'all' && (
                    <TableCell className="min-w-[180px]" onClick={(e) => e.stopPropagation()}>
                      {isUnassigned ? (
                        <StaffSelect
                          mode="single"
                          selectedStaff={assignedStaff}
                          onSelectStaff={(staff) => handleAssignStaff(lead, staff)}
                          staffList={STAFF_LIST}
                          trigger={
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              className="h-7 gap-1 bg-amber-50 border-amber-300 text-amber-800 hover:bg-amber-100 dark:bg-amber-950 dark:border-amber-800 dark:text-amber-300 text-xs px-2 cursor-pointer"
                            >
                              <UserPlus className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400" />
                              <span>Chưa phân bổ</span>
                            </Button>
                          }
                        />
                      ) : (
                        <StaffSelect
                          mode="single"
                          selectedStaff={assignedStaff}
                          onSelectStaff={(staff) => handleAssignStaff(lead, staff)}
                          staffList={STAFF_LIST}
                          trigger={
                            <button
                              type="button"
                              className="flex flex-col gap-0.5 text-left bg-transparent border-0 p-0 hover:opacity-80 cursor-pointer group"
                              title="Bấm để chuyển đổi người phụ trách"
                            >
                              <span className="text-xs font-normal text-foreground group-hover:text-primary group-hover:underline truncate">
                                {getCleanStaffName(assignedStaff)}
                              </span>
                              <span
                                className="text-xs text-muted-foreground font-mono truncate"
                                title={`Bắt đầu phụ trách: ${staffAssignInfo.label}`}
                              >
                                {staffAssignInfo.label}
                              </span>
                            </button>
                          }
                        />
                      )}
                    </TableCell>
                  )}

                  {/* Cột 9: Đơn hàng (Luôn hiển thị ở cuối cùng) */}
                  <TableCell className="min-w-[250px]">
                    <div className="flex flex-col gap-1 max-w-[250px]">
                      {lead.orderCode ? (
                        <>
                          {/* Dòng 1: Gói học & Số tiền (Text thường, không in đậm) */}
                          <div className="flex items-center gap-1 text-xs font-normal text-foreground truncate">
                            <button
                              type="button"
                              onClick={() => onOpenCreateOrder?.(lead)}
                              className="hover:text-primary hover:underline flex items-center gap-1 font-normal text-foreground truncate text-left cursor-pointer bg-transparent border-0 p-0"
                              title={`Mở chi tiết & Chỉnh sửa Đơn hàng (${lead.orderCode})`}
                            >
                              <FileText className="h-3 w-3 text-primary shrink-0" />
                              <span className="truncate">{lead.expectedPackage || 'Gói tư vấn'}</span>
                              {lead.expectedAmount && (
                                <span className="font-mono text-xs font-normal text-emerald-600 dark:text-emerald-400 shrink-0 ml-1">
                                  ({lead.expectedAmount})
                                </span>
                              )}
                            </button>
                          </div>

                          {/* Dòng 2: Mã đơn nháp • Lần thanh toán */}
                          <div className="flex items-center gap-1.5 text-xs text-muted-foreground flex-wrap">
                            <button
                              type="button"
                              onClick={() => onOpenCreateOrder?.(lead)}
                              className="font-mono font-medium text-muted-foreground hover:text-primary hover:underline cursor-pointer bg-transparent border-0 p-0"
                              title={`Xem chi tiết đơn hàng nháp (${lead.orderCode})`}
                            >
                              {lead.orderCode}
                            </button>
                            {lead.paymentTerm && (
                              <>
                                <span className="text-muted-foreground/40">•</span>
                                <span className="font-medium text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-1.5 py-0.2 rounded border border-emerald-200/60 dark:border-emerald-800/60 text-xs">
                                  {lead.paymentTerm}
                                </span>
                              </>
                            )}
                          </div>
                        </>
                      ) : (
                        <>
                          {/* Trường hợp chưa có đơn: Nút Tạo đơn */}
                          <div className="flex items-center gap-1 text-xs">
                            <button
                              type="button"
                              onClick={() => onOpenCreateOrder?.(lead)}
                              className="inline-flex items-center gap-1 text-xs font-medium text-primary bg-primary/10 hover:bg-primary/20 border border-primary/20 px-2 py-0.5 rounded cursor-pointer transition-colors"
                              title="Mở Modal Lên đơn mới cho Lead"
                            >
                              <Plus className="h-3.5 w-3.5 text-primary" />
                              <span>Tạo đơn</span>
                            </button>
                          </div>

                          {/* Dòng 2: Gói dự kiến & Lần thanh toán */}
                          <div className="flex items-center gap-1 text-xs text-muted-foreground truncate">
                            <span className="truncate">{lead.expectedPackage || 'Chưa chọn gói'}</span>
                            {lead.paymentTerm && (
                              <>
                                <span className="text-muted-foreground/40">•</span>
                                <span className="text-muted-foreground font-medium">
                                  {lead.paymentTerm}
                                </span>
                              </>
                            )}
                          </div>
                        </>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </DataTableFrame>

      {/* Gọi Modal Chi tiết Lớp học sẵn có (ClassesDetailDialog) */}
      <ClassesDetailDialog
        cls={selectedClassRecord}
        open={isClassDetailOpen}
        onOpenChange={setIsClassDetailOpen}
      />
    </>
  )
}
