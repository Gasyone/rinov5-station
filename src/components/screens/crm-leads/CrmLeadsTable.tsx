'use client'

import { Eye, Copy, Check, FileText, Calendar, UserPlus, Plus, User, ArrowLeftRight, ExternalLink, School, GraduationCap, RotateCcw, Sparkles } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'
import { Lead } from '@/mocks/crmLeads'
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
import { maskPhoneNumber, getLeadCareInfo, getStaffAssignmentInfo, getProductGroup, getCleanStaffName, formatDateTimeWithDayOfWeek, formatOrderDate, getLeadAssessmentDisplay, getLeadNearestEvent } from './crmLeadsHelpers'
import { STATUS_LABEL_MAP } from './crmLeadsTypes'
import { CrmLeadsCareHistoryPopover } from './CrmLeadsCareHistoryPopover'
import { BookingEventHoverCard } from '@/components/screens/calendar/BookingEventHoverCard'
import { StaffSelect } from './CrmCustomerCreateSearchSelect'
import { STAFF_LIST, StaffOption } from './crmCustomerCreateTypes'

const ORDER_STATUS_LABELS: Record<string, string> = {
  draft: 'Chưa thanh toán',
  pending_payment: 'Chờ TT',
  paid: 'Đã thanh toán',
}

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
  onReactivateCycle?: (lead: Lead) => void
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
  onReactivateCycle,
}: CrmLeadsTableProps) {
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [assignments, setAssignments] = useState<Record<string, string>>({})


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
        <Table containerClassName="w-full overflow-x-auto min-h-full" className="min-w-[1360px] border-collapse">
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
              <TableHead className="min-w-[280px]">Lead</TableHead>
              <TableHead className="min-w-[210px]">Khóa học & Nhóm SP</TableHead>
              <TableHead className="min-w-[240px]">Đánh giá & Trải nghiệm</TableHead>
              <TableHead className="min-w-[290px] text-left">Lịch sử chăm sóc</TableHead>
              <TableHead className="min-w-[150px]">Trạng thái</TableHead>
              {viewScope === 'all' && (
                <TableHead className="min-w-[180px]">Người phụ trách</TableHead>
              )}
              <TableHead className="min-w-[160px]">Đơn hàng</TableHead>
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

              const assessment = getLeadAssessmentDisplay(lead)
              const nearestEvent = getLeadNearestEvent(lead)

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

                  {/* Cột 1: Lead - Dòng 1: Tên học viên, Tuổi & Năm sinh; Dòng 2: Tên Phụ huynh, Sđt, có copy */}
                  <TableCell className="relative cursor-pointer" onClick={() => onViewDetail(lead)}>
                    <div className="flex flex-col gap-1 pr-14">
                      {/* Dòng 1: Tên học viên, Tuổi & Năm sinh */}
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="font-semibold text-foreground text-sm">
                          {lead.studentName}
                        </span>
                        <span className="text-xs text-muted-foreground font-normal">
                          ({lead.studentAge} tuổi - {birthYear})
                        </span>
                        {lead.isReturningLead && (
                          <span
                            className="inline-flex items-center justify-center h-4 w-4 rounded-full bg-amber-100/90 dark:bg-amber-950/70 text-amber-700 dark:text-amber-300 shrink-0 cursor-help"
                            title={lead.returningReason || 'Lead quay lại'}
                          >
                            <RotateCcw className="h-2.5 w-2.5" />
                          </span>
                        )}
                      </div>

                      {/* Dòng 2: Tên Phụ huynh, Sđt */}
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground flex-wrap">
                        <span className="font-normal text-foreground/85">
                          {lead.parentName}
                        </span>
                        {lead.parentRole && (
                          <span className="text-[11px] text-muted-foreground/70">
                            ({lead.parentRole})
                          </span>
                        )}
                        <span className="text-muted-foreground/40">•</span>
                        <span className="font-mono">
                          {maskPhoneNumber(lead.phone)}
                        </span>
                      </div>
                    </div>

                    {/* Icons thao tác sao chép SĐT, xem hồ sơ contact & xem chi tiết - Hiển thị khi hover */}
                    <div
                      className="absolute right-2 top-1/2 -translate-y-1/2 hidden group-hover:flex items-center gap-1 bg-background/90 backdrop-blur-xs p-0.5 rounded-lg border border-border/60 shadow-xs"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-7 w-7 text-muted-foreground hover:text-foreground hover:bg-muted rounded-md cursor-pointer"
                        onClick={(e) => handleCopyPhone(e, lead.phone, lead.id)}
                        title="Sao chép số điện thoại đầy đủ"
                      >
                        {copiedId === lead.id ? (
                          <Check className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                        ) : (
                          <Copy className="h-3.5 w-3.5" />
                        )}
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-7 w-7 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 rounded-md cursor-pointer"
                        onClick={() => onOpenContactProfile?.(lead)}
                        title="Xem / Sửa thông tin hồ sơ liên hệ (Contact Info Modal)"
                      >
                        <User className="h-4 w-4" />
                      </Button>
                      {(lead.status === 'that_bai' || lead.status === 'chuyen_doi' || lead.status === 'tam_dung') && onReactivateCycle && (
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-7 w-7 text-amber-600 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/40 rounded-md cursor-pointer"
                          onClick={() => onReactivateCycle(lead)}
                          title="Kích hoạt Chu kỳ Bán mới (Win-back / Tái tiếp cận)"
                        >
                          <Sparkles className="h-3.5 w-3.5" />
                        </Button>
                      )}
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

                  {/* Cột 2: Khóa học đăng ký & Nhóm sản phẩm */}
                  <TableCell>
                    <div className="flex flex-col gap-0.5 max-w-[200px]">
                      <div className="font-normal text-foreground text-xs truncate" title={lead.targetSubject}>
                        {lead.targetSubject}
                      </div>
                      <div className="text-xs text-muted-foreground truncate" title={getProductGroup(lead)}>
                        {getProductGroup(lead)}
                      </div>
                    </div>
                  </TableCell>

                  {/* Cột 3: Đánh giá & Trải nghiệm */}
                  <TableCell>
                    <div className="flex flex-col gap-0.5 max-w-[240px]">
                      {/* Dòng 1: Trình độ (hoặc 'Chưa đánh giá' in nghiêng) + Icon +N nếu có nhiều sự kiện */}
                      <div className="flex items-center gap-1.5 text-xs text-foreground font-normal">
                        {assessment.isAssessed ? (
                          <span className="font-normal text-foreground truncate max-w-[170px]" title={assessment.levelText}>
                            {assessment.levelText}
                          </span>
                        ) : (
                          <span className="italic text-muted-foreground/60 select-none">
                            Chưa đánh giá
                          </span>
                        )}

                        {nearestEvent.hasMultiple && (
                          <Popover>
                            <PopoverTrigger asChild>
                              <button
                                type="button"
                                className="inline-flex items-center gap-0.5 px-1 py-0.2 rounded text-[10px] font-normal text-primary bg-primary/10 hover:bg-primary/20 border border-primary/20 cursor-pointer shrink-0 transition-colors"
                                title={`Có thêm ${nearestEvent.eventCount - 1} sự kiện - Bấm để xem chi tiết`}
                                onClick={(e) => e.stopPropagation()}
                              >
                                <FileText className="h-3 w-3" />
                                <span>+{nearestEvent.eventCount - 1}</span>
                              </button>
                            </PopoverTrigger>
                            <PopoverContent align="start" className="w-80 p-3 shadow-lg z-50 text-xs">
                              <div className="font-semibold text-foreground border-b pb-1.5 mb-2 flex items-center justify-between">
                                <span>Sự kiện Đánh giá & Học thử</span>
                                <span className="font-normal text-muted-foreground">({lead.studentName})</span>
                              </div>
                              <div className="space-y-2">
                                {/* Mục TN */}
                                {lead.testStatus && (
                                  <div className="p-2 rounded bg-purple-50/70 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800 flex flex-col gap-1">
                                    <div className="flex items-center justify-between font-normal text-purple-900 dark:text-purple-300">
                                      <span className="flex items-center gap-1 font-medium">
                                        <GraduationCap className="h-3.5 w-3.5 text-purple-600" />
                                        TN: {lead.testerTeacherName || 'Thầy Alex'}
                                      </span>
                                      <Badge variant="outline" className="text-xs py-0 px-1 font-normal">
                                        {lead.testStatus === 'completed' ? 'Đã test' : lead.testStatus === 'scheduled' ? 'Hẹn test' : 'Vắng test'}
                                      </Badge>
                                    </div>
                                    <div className="text-xs text-muted-foreground">
                                      {lead.testDate && formatDateTimeWithDayOfWeek(lead.testDate, lead.testTime)}
                                      {lead.testScore && ` • Điểm: ${lead.testScore}`}
                                    </div>
                                    <a
                                      href={`/app/booking_test?leadId=${lead.id}`}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="inline-flex items-center gap-1 text-xs text-primary font-normal hover:underline mt-0.5"
                                      onClick={(e) => e.stopPropagation()}
                                    >
                                      <ExternalLink className="h-3 w-3" />
                                      <span>Mở phiếu kết quả đánh giá</span>
                                    </a>
                                  </div>
                                )}

                                {/* Mục HT */}
                                {lead.trialStatus && (
                                  <div className="p-2 rounded bg-sky-50/70 dark:bg-sky-950/40 border border-sky-200 dark:border-sky-800 flex flex-col gap-1">
                                    <div className="flex items-center justify-between font-normal text-sky-900 dark:text-sky-300">
                                      <span className="flex items-center gap-1 font-medium">
                                        <School className="h-3.5 w-3.5 text-sky-600" />
                                        HT: {lead.trialClassName || 'SK-02'}
                                      </span>
                                      <Badge variant="outline" className="text-xs py-0 px-1 font-normal">
                                        {lead.trialStatus === 'completed' ? 'Đã học' : lead.trialStatus === 'scheduled' ? 'Hẹn thử' : 'Vắng thử'}
                                      </Badge>
                                    </div>
                                    <div className="text-xs text-muted-foreground">
                                      {lead.trialDate && formatDateTimeWithDayOfWeek(lead.trialDate, lead.trialTime)}
                                      {lead.trialFeedback && ` • ${lead.trialFeedback}`}
                                    </div>
                                    <a
                                      href={`/app/trial_class?leadId=${lead.id}`}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="inline-flex items-center gap-1 text-xs text-sky-600 dark:text-sky-400 font-normal hover:underline mt-0.5"
                                      onClick={(e) => e.stopPropagation()}
                                    >
                                      <ExternalLink className="h-3 w-3" />
                                      <span>Mở phiếu nhận xét học thử</span>
                                    </a>
                                  </div>
                                )}
                              </div>
                            </PopoverContent>
                          </Popover>
                        )}
                      </div>

                      {/* Dòng 2: Lịch gần nhất (hover ra Popover từ calendar_event_schedule) hoặc nút đặt lịch nhanh */}
                      {nearestEvent.hasEvent && nearestEvent.session ? (
                        <div onClick={(e) => e.stopPropagation()}>
                          <BookingEventHoverCard session={nearestEvent.session} side="right">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation()
                                window.open(`/app/calendar_event_schedule?search=${encodeURIComponent(lead.studentName)}`, '_blank')
                              }}
                              className="text-xs text-muted-foreground hover:text-primary hover:underline font-mono text-left cursor-pointer transition-colors inline-flex items-center gap-1 group/evt truncate max-w-[220px]"
                            >
                              <span className="truncate">{nearestEvent.displayLabel}</span>
                              <ExternalLink className="h-2.5 w-2.5 opacity-0 group-hover/evt:opacity-100 text-primary shrink-0 transition-opacity" />
                            </button>
                          </BookingEventHoverCard>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                          <span className="text-xs text-muted-foreground/40 font-mono">-</span>
                          <div className="hidden group-hover:inline-flex items-center gap-1">
                            <Button
                              type="button"
                              size="sm"
                              variant="outline"
                              className="h-5 px-1.5 text-[11px] font-normal border-purple-200 text-purple-700 bg-purple-50/60 hover:bg-purple-100 hover:text-purple-900 dark:border-purple-800 dark:text-purple-300 dark:bg-purple-950/40 cursor-pointer shrink-0"
                              onClick={() => onOpenBookingTest?.(lead)}
                              title="Đặt lịch đánh giá năng lực"
                            >
                              + TN
                            </Button>
                            <Button
                              type="button"
                              size="sm"
                              variant="outline"
                              className="h-5 px-1.5 text-[11px] font-normal border-sky-200 text-sky-700 bg-sky-50/60 hover:bg-sky-100 hover:text-sky-900 dark:border-sky-800 dark:text-sky-300 dark:bg-sky-950/40 cursor-pointer shrink-0"
                              onClick={() => onOpenTrialClass?.(lead)}
                              title="Đăng ký ghép lớp học thử"
                            >
                              + HT
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  </TableCell>

                  {/* Cột 6: Lịch sử chăm sóc */}
                  <TableCell className="min-w-[290px]" onClick={(e) => e.stopPropagation()}>
                    {(() => {
                      const { isUncared, inProgress, attemptCount, isRescheduled, rescheduleDate, rescheduleTime, latestLog } = careInfo

                      const cellContent = (
                        <div className="flex flex-col gap-1 py-0.5 text-left max-w-[280px] cursor-pointer group/care">
                          {/* Dòng 1: (n) trước Ngày + nội dung ghi chú chăm sóc gần nhất */}
                          {isUncared ? (
                            <div className="text-xs italic text-amber-600 dark:text-amber-400 font-normal truncate">
                              <span>(0) </span>
                              <span>Cần liên hệ trao đổi với phụ huynh ngay</span>
                            </div>
                          ) : latestLog ? (
                            <div
                              className="text-xs text-muted-foreground truncate group-hover/care:text-foreground transition-colors font-normal"
                              title={`(${attemptCount}) Ghi chú (${latestLog.date}): ${latestLog.note}`}
                            >
                              <span
                                className={cn(
                                  'font-normal mr-1 transition-colors',
                                  inProgress
                                    ? 'text-sky-600 dark:text-sky-400 group-hover/care:underline'
                                    : 'text-emerald-600 dark:text-emerald-400 group-hover/care:underline'
                                )}
                              >
                                ({attemptCount})
                              </span>
                              <span className="font-mono text-foreground/70">{latestLog.date}:</span>{' '}
                              <span>{latestLog.note}</span>
                            </div>
                          ) : (
                            <div className="text-xs text-muted-foreground italic font-normal">
                              <span>(0) Chưa có lịch sử chăm sóc</span>
                            </div>
                          )}

                          {/* Dòng 2: Hẹn: - nếu null, hoặc hiện ngày nếu có */}
                          <div className="flex items-center gap-1 text-xs">
                            {isRescheduled && rescheduleDate ? (
                              <span
                                className="font-normal text-violet-600 dark:text-violet-400 flex items-center gap-1 whitespace-nowrap"
                                title="Lịch hẹn gọi lại / chăm sóc"
                              >
                                <Calendar className="h-3.5 w-3.5 shrink-0 text-violet-500 dark:text-violet-400" />
                                <span>Hẹn: {rescheduleDate}{rescheduleTime ? ` (${rescheduleTime})` : ''}</span>
                              </span>
                            ) : (
                              <span className="font-normal text-muted-foreground whitespace-nowrap">
                                Hẹn: -
                              </span>
                            )}
                          </div>
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

                  {/* Cột: Trạng thái */}
                  <TableCell className="min-w-[150px]">
                    <Badge className={cn("font-normal text-xs py-0.5 px-2", getStatusBadgeClass(lead.status))}>
                      {STATUS_LABEL_MAP[lead.status] ?? lead.status}
                    </Badge>
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
                              <div className="flex items-center gap-1.5">
                                <span className="text-xs font-normal text-foreground group-hover:text-primary group-hover:underline truncate">
                                  {getCleanStaffName(assignedStaff)}
                                </span>
                                <ArrowLeftRight className="h-3 w-3 text-muted-foreground/60 group-hover:text-primary shrink-0 transition-colors" />
                              </div>
                              <span
                                className="text-[11px] text-muted-foreground font-mono truncate"
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
                  <TableCell className="min-w-[160px]">
                    <div className="flex flex-col gap-1 max-w-[160px]">
                      {lead.orderCode ? (
                        <>
                          {/* Dòng 1: Mã Đơn hàng */}
                          <div className="flex items-center text-xs font-normal text-foreground">
                            <button
                              type="button"
                              onClick={() => onOpenCreateOrder?.(lead)}
                              className="font-mono text-xs font-normal text-primary hover:underline cursor-pointer bg-transparent border-0 p-0 text-left truncate"
                              title={`Xem chi tiết đơn hàng (${lead.orderCode})`}
                            >
                              {lead.orderCode}
                            </button>
                          </div>

                          {/* Dòng 2: Trạng thái đơn hàng + Ngày cập nhật phía sau */}
                          <div className="flex items-center gap-1.5 text-xs text-muted-foreground flex-wrap">
                            {lead.orderStatus && (
                              <Badge className={cn("font-normal text-[11px] py-0.5 px-1.5 leading-none shrink-0", getStatusBadgeClass(lead.orderStatus))}>
                                {ORDER_STATUS_LABELS[lead.orderStatus] || lead.orderStatus}
                              </Badge>
                            )}
                            <span className="font-mono text-[11px] text-muted-foreground font-normal shrink-0">
                              {formatOrderDate(lead.orderDate || lead.createdAt)}
                            </span>
                          </div>
                        </>
                      ) : (
                        /* Trường hợp chưa có đơn: Chỉ để mỗi button Tạo đơn */
                        <div className="flex items-center gap-1 text-xs">
                          <button
                            type="button"
                            onClick={() => onOpenCreateOrder?.(lead)}
                            className="inline-flex items-center gap-1 text-xs font-normal text-primary bg-primary/10 hover:bg-primary/20 border border-primary/20 px-2 py-0.5 rounded cursor-pointer transition-colors"
                            title="Mở Modal Lên đơn mới cho Lead"
                          >
                            <Plus className="h-3.5 w-3.5 text-primary" />
                            <span>Tạo đơn</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </DataTableFrame>
    </>
  )
}
