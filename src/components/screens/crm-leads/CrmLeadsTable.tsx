'use client'

import { Eye, Copy, Check, UserPlus, MapPin, Mail, ExternalLink, FileText, School, GraduationCap, Plus } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'
import { Lead } from '@/mocks/crmLeads'
import { mockClassRecords, ClassRecord } from '@/mocks/classRecords'
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
import { getStatusBadgeClass } from '@/lib/statusColors'
import { AppAvatar } from '@/components/shared/AppAvatar'
import { ClassSessionHoverCard } from '@/components/screens/calendar/ClassSessionHoverCard'
import type { GenericSessionData } from '@/components/screens/calendar/SessionHoverCard'
import { ClassesDetailDialog } from '@/components/screens/classes/detail/ClassesDetailDialog'
import { maskPhoneNumber } from './crmLeadsHelpers'
import { SOURCE_LABEL_MAP, STATUS_LABEL_MAP } from './crmLeadsTypes'

interface CrmLeadsTableProps {
  viewScope?: 'my' | 'all'
  leads: Lead[]
  totalItems: number
  currentPage: number
  pageSize: number
  onPageChange: (page: number) => void
  onPageSizeChange: (size: number) => void
  onViewDetail: (lead: Lead) => void
}

const SALES_STAFF_OPTIONS = [
  'Trần Thị Mai (Sales)',
  'Lê Hoàng Nam (Sales)',
  'Nguyễn Văn Hùng (Sales Manager)',
]

function getProductGroup(subject: string): string {
  if (!subject) return 'Nhóm Tiếng Anh Tổng Quát'
  if (subject.includes('Kindy') || subject.includes('Mẫu giáo')) return 'Nhóm Mẫu Giáo (Kindy)'
  if (subject.includes('SuperKids') || subject.includes('Nhi đồng') || subject.includes('Movers') || subject.includes('Starters')) return 'Nhóm Thiếu Nhi (Kids)'
  if (subject.includes('IELTS') || subject.includes('Flyers') || subject.includes('Thiếu niên')) return 'Nhóm Luyện Thi & Chứng Chỉ'
  return 'Nhóm Tiếng Anh Giao Tiếp'
}

function getStaffTeam(staffName: string): string {
  if (!staffName || staffName === 'Chưa phân bổ') return ''
  if (staffName.includes('Manager')) return 'Team Sales Manager'
  if (staffName.includes('Mai')) return 'Team Sale 01'
  if (staffName.includes('Nam')) return 'Team Sale 02'
  return 'Team Sales'
}

function getCleanStaffName(staffName: string): string {
  return staffName.replace(/\s*\([^)]*\)/g, '').trim()
}

// Định dạng Thứ và Ngày (BỎ năm & BỎ giờ để tối ưu 1 dòng)
function formatDateShort(dateStr?: string): string {
  if (!dateStr) return '---'
  let dateWithoutYear = dateStr
  if (dateStr.includes('/')) {
    const parts = dateStr.split('/')
    if (parts.length >= 2) {
      dateWithoutYear = `${parts[0]}/${parts[1]}`
    }
  }

  let dayOfWeek = ''
  if (dateStr.includes('/')) {
    const parts = dateStr.split('/')
    if (parts.length === 3) {
      const d = new Date(Number(parts[2]), Number(parts[1]) - 1, Number(parts[0]))
      const days = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7']
      if (!isNaN(d.getTime())) {
        dayOfWeek = `${days[d.getDay()]}, `
      }
    }
  }

  return `${dayOfWeek}${dateWithoutYear}`
}

// Lấy hoặc khởi tạo ClassRecord để gọi Modal Lớp học sẵn có
function getClassRecord(classCode: string, subjectName?: string): ClassRecord {
  const found = mockClassRecords.find((c) => c.code === classCode)
  if (found) return found

  return {
    id: `class-${classCode}`,
    code: classCode,
    name: `${subjectName || 'SuperKids'} S1`,
    level: 'Level 2',
    branch: 'RinoEdu Quận 1',
    teacher: 'Mỹ Linh',
    teacherPhone: '0901234567',
    room: 'Phòng 2 • RinoEdu Quận 1',
    schedule: 'Chủ Nhật (15:30 - 17:30)',
    scheduleSlots: [
      { dayOfWeek: 'Chủ Nhật', date: '16/08', startTime: '15:30', endTime: '17:30' }
    ],
    startDate: '2026-08-01',
    endDate: '2026-11-01',
    maxStudents: 16,
    enrolledStudents: 15,
    status: 'dang_hoc',
    tuitionFee: 3500000,
    assistant: 'Đức Anh'
  }
}

// Khởi tạo Dữ liệu Hover Card Hồ sơ Buổi học
function getSessionHoverData(lead: Lead, type: 'trial' | 'test'): GenericSessionData {
  if (type === 'trial') {
    const code = lead.trialClassName || 'SK-02'
    const fullDate = `${formatDateShort(lead.trialDate)} (${lead.trialTime || '15:30 - 17:30'})`
    return {
      id: `trial-${lead.id}`,
      title: `${code} - ${lead.targetSubject || 'Lớp Học thử'}`,
      classCode: code,
      className: lead.targetSubject || 'SuperKids S1',
      subject: lead.targetSubject || 'SuperKids',
      level: lead.testResultLevel || 'Level 2',
      teacher: lead.testerTeacherName || 'Mỹ Linh',
      assistantTeacher: 'Đức Anh',
      branch: lead.branch || 'RinoEdu Quận 1',
      schoolRoom: 'Phòng 2 • RinoEdu Quận 1',
      timeSlot: lead.trialTime ? `${lead.trialTime}` : '15:30 - 17:30',
      timeLabel: '15:30',
      endTimeLabel: '17:30',
      date: fullDate,
      dateBucket: 'today',
      status: 'active',
      type: 'trial',
      totalStudents: 16,
      officialStudents: 15,
      trialStudents: 1,
      lessonSubtitle: 'Thực hành giao tiếp & Cân chỉnh cảm biến',
      note: lead.trialFeedback || 'Học viên tham gia học thử',
    }
  } else {
    const fullDate = `${formatDateShort(lead.testDate)} (${lead.testTime || '18:00 - 19:00'})`
    return {
      id: `test-${lead.id}`,
      title: `Đánh giá: ${lead.testerTeacherName || 'Thầy Alex'}`,
      classCode: 'TEST-01',
      className: 'Đánh giá năng lực & Phỏng vấn đầu vào',
      subject: lead.targetSubject || 'Anh văn',
      level: lead.testResultLevel || 'Đầu vào',
      teacher: lead.testerTeacherName || 'Thầy Alex',
      assistantTeacher: 'Trần Thị Mai (Sales)',
      branch: lead.branch || 'RinoEdu Quận 1',
      schoolRoom: 'Phòng Test 01 • RinoEdu Quận 1',
      timeSlot: lead.testTime ? `${lead.testTime}` : '18:00 - 19:00',
      timeLabel: '18:00',
      endTimeLabel: '19:00',
      date: fullDate,
      dateBucket: 'today',
      status: 'active',
      type: 'test',
      totalStudents: 1,
      trialStudents: 1,
      lessonSubtitle: 'Đánh giá kỹ năng Listening & Speaking',
      note: lead.testScore ? `Đạt score: ${lead.testScore}` : 'Chờ kiểm tra',
    }
  }
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
}: CrmLeadsTableProps) {
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [assignments, setAssignments] = useState<Record<string, string>>({})
  const [openAssignPopoverId, setOpenAssignPopoverId] = useState<string | null>(null)

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

  const handleAssignStaff = (lead: Lead, staffName: string) => {
    setAssignments((prev) => ({ ...prev, [lead.id]: staffName }))
    setOpenAssignPopoverId(null)
    toast.success(`Đã phân bổ lead ${lead.code} (${lead.studentName}) cho ${staffName}`)
  }

  // Render Nút Icon Lịch sử (N) đưa lên Dòng 1
  const renderHistoryPopoverButton = (lead: Lead, eventCount: number) => (
    <Popover>
      <PopoverTrigger asChild>
        <button
          type="button"
          className="inline-flex items-center gap-0.5 text-[11px] text-primary hover:opacity-80 p-0 bg-transparent border-0 font-mono font-bold cursor-pointer shrink-0 ml-0.5"
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
                <Badge variant="outline" className="text-[10px] py-0 px-1">
                  {lead.testStatus === 'completed' ? 'Đã test' : lead.testStatus === 'scheduled' ? 'Hẹn test' : 'Vắng test'}
                </Badge>
              </div>
              <div className="text-[11px] text-muted-foreground">
                {lead.testResultLevel ? `${lead.testResultLevel} (${lead.testScore})` : `Lịch: ${formatDateShort(lead.testDate)}`}
              </div>
              <a
                href={`/app/booking_test?leadId=${lead.id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-[11px] text-primary font-medium hover:underline mt-0.5"
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
                <Badge variant="outline" className="text-[10px] py-0 px-1">
                  {lead.trialStatus === 'completed' ? 'Đã học thử' : lead.trialStatus === 'scheduled' ? 'Hẹn thử' : 'Vắng thử'}
                </Badge>
              </div>
              <div className="text-[11px] text-muted-foreground italic line-clamp-1">
                {lead.trialFeedback || `Ngày học: ${formatDateShort(lead.trialDate)}`}
              </div>
              <a
                href={`/app/trial_class?leadId=${lead.id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-[11px] text-sky-600 dark:text-sky-400 font-medium hover:underline mt-0.5"
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
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              {/* Checkbox */}
              <TableHead className="w-[40px] px-3">
                <Checkbox
                  checked={isAllSelected}
                  onCheckedChange={handleSelectAll}
                  aria-label="Chọn tất cả Lead"
                />
              </TableHead>
              <TableHead className="w-[200px]">Lead</TableHead>
              <TableHead className="w-[170px]">Phụ huynh / Liên hệ</TableHead>
              <TableHead className="min-w-[190px]">Địa chỉ & Email</TableHead>
              <TableHead className="min-w-[210px]">Khóa học & Nhóm SP</TableHead>
              <TableHead className="min-w-[270px]">Đánh giá & Trải nghiệm</TableHead>
              <TableHead className="w-[110px]">Nguồn Lead</TableHead>
              <TableHead className="w-[130px]">Trạng thái</TableHead>

              {/* Cột theo góc nhìn (Role View Scope) */}
              {viewScope === 'all' ? (
                <TableHead className="w-[170px]">Người phụ trách</TableHead>
              ) : (
                <TableHead className="min-w-[240px]">Đơn hàng</TableHead>
              )}
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedLeads.map((lead) => {
              const isSelected = selectedIds.includes(lead.id)
              const birthYear = lead.birthYear ?? 2026 - lead.studentAge
              const assignedStaff = assignments[lead.id] ?? lead.assignedTo
              const isUnassigned = !assignedStaff || assignedStaff.trim() === '' || assignedStaff === 'Chưa phân bổ'

              // Kiểm tra sự kiện
              const hasTest = Boolean(lead.testStatus)
              const hasTrial = Boolean(lead.trialStatus)
              const eventCount = (hasTest ? 1 : 0) + (hasTrial ? 1 : 0)

              return (
                <TableRow
                  key={lead.id}
                  className={isSelected ? 'bg-muted/50 group' : 'hover:bg-muted/30 group'}
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

                  {/* Cột 1: Lead - Tên + Mã */}
                  <TableCell className="relative cursor-pointer" onClick={() => onViewDetail(lead)}>
                    <div className="flex flex-col gap-0.5 pr-8">
                      <div className="font-bold text-foreground text-sm flex items-center gap-1.5">
                        <span>{lead.studentName}</span>
                        <span className="text-xs font-normal text-muted-foreground">
                          ({lead.studentAge}t - {birthYear})
                        </span>
                      </div>
                      <div className="text-xs font-mono text-muted-foreground">{lead.code}</div>
                    </div>

                    {/* Icon thao tác xem chi tiết Modal - Chỉ hiển thị khi hover */}
                    <div
                      className="absolute right-2 top-1/2 -translate-y-1/2 hidden group-hover:flex items-center gap-0.5"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-7 w-7 text-primary hover:bg-primary/10 rounded-full"
                        onClick={() => onViewDetail(lead)}
                        title="Xem chi tiết Lead trong Modal"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>

                  {/* Cột 2: Phụ huynh / Liên hệ */}
                  <TableCell>
                    <div className="flex flex-col gap-0.5">
                      <div className="font-semibold text-foreground text-sm flex items-center gap-1.5">
                        <span>{lead.parentName}</span>
                        {lead.parentRole && (
                          <Badge variant="outline" className="text-[10px] py-0 px-1 font-normal">
                            {lead.parentRole}
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-1.5 font-mono text-xs text-muted-foreground">
                        <span className="text-foreground font-medium">
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

                  {/* Cột 3: Địa chỉ & Email */}
                  <TableCell>
                    <div className="flex flex-col gap-1 max-w-[200px]">
                      <div
                        className="flex items-center gap-1.5 text-xs text-foreground font-medium line-clamp-1"
                        title={lead.address}
                      >
                        <MapPin className="h-3.5 w-3.5 shrink-0 text-muted-foreground/80" />
                        <span className="truncate">{lead.address || 'Chưa cập nhật địa chỉ'}</span>
                      </div>
                      <div
                        className="flex items-center gap-1.5 text-xs text-muted-foreground line-clamp-1 font-mono"
                        title={lead.email}
                      >
                        <Mail className="h-3.5 w-3.5 shrink-0 text-muted-foreground/70" />
                        <span className="truncate">{lead.email || 'Chưa có email'}</span>
                      </div>
                    </div>
                  </TableCell>

                  {/* Cột 4: Khóa học đăng ký & Nhóm sản phẩm (Đã lược bớt icon theo yêu cầu) */}
                  <TableCell>
                    <div className="flex flex-col gap-0.5 max-w-[220px]">
                      <div className="font-semibold text-emerald-800 dark:text-emerald-300 text-xs truncate">
                        {lead.targetSubject}
                      </div>
                      <div className="text-[11px] text-muted-foreground truncate">
                        {getProductGroup(lead.targetSubject)}
                      </div>
                    </div>
                  </TableCell>

                  {/* Cột 5: Đánh giá & Trải nghiệm (Bỏ giờ, Dòng 2 chỉ Thứ & Ngày, không tách dòng) */}
                  <TableCell>
                    {eventCount === 0 ? (
                      <span className="text-xs text-muted-foreground font-mono">---</span>
                    ) : (
                      <div className="flex flex-col gap-0.5 max-w-[280px]">
                        {hasTrial ? (
                          <>
                            {/* Dòng 1 Học thử: "Học thử:" + Mã lớp (KHÔNG in đậm) + Icon (N) */}
                            <div className="flex items-center gap-1.5 text-xs text-sky-800 dark:text-sky-300 font-normal">
                              <span>Học thử:</span>
                              <ClassSessionHoverCard session={getSessionHoverData(lead, 'trial')}>
                                <button
                                  type="button"
                                  className="font-normal text-sky-600 dark:text-sky-400 hover:underline cursor-pointer bg-transparent p-0 border-0"
                                  onClick={(e) => handleOpenClassDetail(e, lead.trialClassName, lead.targetSubject)}
                                  title="Rê chuột xem lịch học • Bấm để mở chi tiết Lớp học"
                                >
                                  {lead.trialClassName || 'SK-02'}
                                </button>
                              </ClassSessionHoverCard>
                              {eventCount > 1 && renderHistoryPopoverButton(lead, eventCount)}
                            </div>

                            {/* Dòng 2 Học thử (Không tách dòng): Trình độ (Gắn Link mở Phiếu nhận xét tab mới) • Thứ, Ngày (Không có Giờ) */}
                            <div className="flex items-center gap-1 text-[11px] text-muted-foreground whitespace-nowrap">
                              <ClassSessionHoverCard session={getSessionHoverData(lead, 'trial')}>
                                <a
                                  href={`/app/trial_class?leadId=${lead.id}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="font-medium text-sky-700 dark:text-sky-300 hover:underline inline-flex items-center gap-1 shrink-0"
                                  title="Mở phiếu nhận xét học thử (Tab mới)"
                                >
                                  <ExternalLink className="h-3 w-3 text-sky-600 shrink-0" />
                                  <span>{lead.testResultLevel || 'SuperKids Level 2'}</span>
                                </a>
                              </ClassSessionHoverCard>
                              <span>•</span>
                              <ClassSessionHoverCard session={getSessionHoverData(lead, 'trial')}>
                                <span className="font-mono text-muted-foreground cursor-pointer hover:text-foreground shrink-0">
                                  {formatDateShort(lead.trialDate)}
                                </span>
                              </ClassSessionHoverCard>
                            </div>
                          </>
                        ) : (
                          <>
                            {/* Dòng 1 Đánh giá: "Đánh giá: Tên GV" (KHÔNG in đậm) + Icon (N) */}
                            <div className="flex items-center gap-1.5 text-xs text-purple-900 dark:text-purple-300 font-normal">
                              <span>Đánh giá:</span>
                              <span className="text-foreground font-normal">{lead.testerTeacherName || 'Thầy Alex'}</span>
                              {eventCount > 1 && renderHistoryPopoverButton(lead, eventCount)}
                            </div>

                            {/* Dòng 2 Đánh giá (Không tách dòng): Trình độ & Điểm số (Gắn Link mở Phiếu kết quả tab mới) • Thứ, Ngày (Không có Giờ) */}
                            <div className="flex items-center gap-1 text-[11px] text-muted-foreground whitespace-nowrap">
                              <ClassSessionHoverCard session={getSessionHoverData(lead, 'test')}>
                                <a
                                  href={`/app/booking_test?leadId=${lead.id}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="font-medium text-amber-800 dark:text-amber-300 hover:underline inline-flex items-center gap-1 shrink-0"
                                  title="Mở phiếu kết quả đánh giá năng lực (Tab mới)"
                                >
                                  <ExternalLink className="h-3 w-3 text-amber-600 shrink-0" />
                                  <span>{lead.testResultLevel || 'Flyers Level B2'} {lead.testScore ? `(${lead.testScore})` : ''}</span>
                                </a>
                              </ClassSessionHoverCard>
                              <span>•</span>
                              <ClassSessionHoverCard session={getSessionHoverData(lead, 'test')}>
                                <span className="font-mono text-muted-foreground cursor-pointer hover:text-foreground shrink-0">
                                  {formatDateShort(lead.testDate)}
                                </span>
                              </ClassSessionHoverCard>
                            </div>
                          </>
                        )}
                      </div>
                    )}
                  </TableCell>

                  {/* Cột 7: Nguồn Lead */}
                  <TableCell className="text-sm">
                    {SOURCE_LABEL_MAP[lead.source] ?? lead.source}
                  </TableCell>

                  {/* Cột 8: Trạng thái phễu gộp */}
                  <TableCell>
                    <Badge className={getStatusBadgeClass(lead.status)}>
                      {STATUS_LABEL_MAP[lead.status] ?? lead.status}
                    </Badge>
                  </TableCell>

                  {/* Cột 9: Đổi động theo Role/ViewScope (Mới: Điều hướng chính xác tới Landing Page /quote/${lead.orderCode}) */}
                  {viewScope === 'all' ? (
                    <TableCell>
                      {isUnassigned ? (
                        <Popover
                          open={openAssignPopoverId === lead.id}
                          onOpenChange={(open) => setOpenAssignPopoverId(open ? lead.id : null)}
                        >
                          <PopoverTrigger asChild>
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              className="h-7 gap-1 bg-amber-50 border-amber-300 text-amber-800 hover:bg-amber-100 dark:bg-amber-950 dark:border-amber-800 dark:text-amber-300 text-xs px-2 cursor-pointer"
                            >
                              <UserPlus className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400" />
                              <span>Chưa phân bổ</span>
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent align="start" className="w-56 p-2 z-50">
                            <div className="text-xs font-bold text-muted-foreground uppercase px-2 py-1 mb-1 border-b">
                              Gán người phụ trách
                            </div>
                            <div className="space-y-0.5">
                              {SALES_STAFF_OPTIONS.map((staff) => (
                                <Button
                                  key={staff}
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  className="w-full justify-start text-xs font-medium h-8 px-2"
                                  onClick={() => handleAssignStaff(lead, staff)}
                                >
                                  <AppAvatar name={getCleanStaffName(staff)} size="xs" className="mr-1.5" />
                                  <span>{staff}</span>
                                </Button>
                              ))}
                            </div>
                          </PopoverContent>
                        </Popover>
                      ) : (
                        <div className="flex items-center gap-2">
                          <AppAvatar name={getCleanStaffName(assignedStaff)} size="sm" className="shrink-0" />
                          <div className="flex flex-col gap-0.5 min-w-0">
                            <span className="text-xs font-medium text-foreground truncate">
                              {getCleanStaffName(assignedStaff)}
                            </span>
                            <span className="text-[10px] text-muted-foreground font-mono truncate">
                              {getStaffTeam(assignedStaff)}
                            </span>
                          </div>
                        </div>
                      )}
                    </TableCell>
                  ) : (
                    <TableCell>
                      <div className="flex flex-col gap-0.5 max-w-[250px]">
                        {lead.orderCode ? (
                          <>
                            {/* Dòng 1: Gói học & Số tiền (Điều hướng chuẩn tới Landing Page Báo Giá /quote/${lead.orderCode}) */}
                            <div className="flex items-center gap-1 text-xs font-semibold text-emerald-800 dark:text-emerald-300 truncate">
                              <a
                                href={`/quote/${lead.orderCode}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="hover:underline flex items-center gap-1 font-semibold text-emerald-800 dark:text-emerald-300 truncate"
                                title={`Mở Landing Page Báo Giá & Chi tiết Đơn hàng (${lead.orderCode})`}
                              >
                                <ExternalLink className="h-3 w-3 text-emerald-600 shrink-0" />
                                <span className="truncate">{lead.expectedPackage || 'Gói tư vấn'}</span>
                                {lead.expectedAmount && (
                                  <span className="font-mono text-[11px] font-normal text-muted-foreground shrink-0">
                                    ({lead.expectedAmount})
                                  </span>
                                )}
                              </a>
                            </div>

                            {/* Dòng 2: Mã đơn nháp • Lần thanh toán (Ví dụ: Cọc 50%) */}
                            <div className="flex items-center gap-1 text-[11px] text-muted-foreground flex-wrap">
                              <a
                                href={`/quote/${lead.orderCode}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="font-mono font-bold text-foreground hover:text-primary hover:underline cursor-pointer"
                                title="Xem Landing Page Báo giá & Chi tiết Đơn hàng nháp"
                              >
                                {lead.orderCode}
                              </a>
                              {lead.paymentTerm && (
                                <>
                                  <span>•</span>
                                  <span className="font-medium text-amber-700 dark:text-amber-400">
                                    {lead.paymentTerm}
                                  </span>
                                </>
                              )}
                            </div>
                          </>
                        ) : (
                          <>
                            {/* Trường hợp chưa có đơn nháp: Nút Tạo đơn nháp */}
                            <div className="flex items-center gap-1 text-xs">
                              <a
                                href={`/quote/OD-DRAFT-9230`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 text-xs font-medium text-amber-700 bg-amber-50 hover:bg-amber-100 border border-amber-300 dark:bg-amber-950 dark:border-amber-800 dark:text-amber-300 px-2 py-0.5 rounded cursor-pointer transition-colors"
                                title="Mở Landing Page Báo giá & Tạo Đơn nháp mới"
                              >
                                <Plus className="h-3.5 w-3.5 text-amber-600" />
                                <span>Tạo đơn nháp</span>
                              </a>
                            </div>

                            {/* Dòng 2: Gói dự kiến & Lần thanh toán */}
                            <div className="flex items-center gap-1 text-[11px] text-muted-foreground truncate">
                              <span className="truncate">{lead.expectedPackage || 'Chưa chọn gói'}</span>
                              {lead.paymentTerm && (
                                <>
                                  <span>•</span>
                                  <span className="text-amber-700 dark:text-amber-400 font-medium">
                                    {lead.paymentTerm}
                                  </span>
                                </>
                              )}
                            </div>
                          </>
                        )}
                      </div>
                    </TableCell>
                  )}
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
