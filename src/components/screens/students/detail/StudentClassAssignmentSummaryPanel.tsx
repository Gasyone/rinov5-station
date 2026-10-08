'use client'

import React, { useState, useMemo } from 'react'
import {
  Calendar,
  BookOpen,
  MapPin,
  Package,
  GraduationCap,
  Copy,
  Check,
  Pencil,
  FileText,
  ExternalLink,
} from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { cn } from '@/lib/utils'
import type { ClassRecord } from '@/mocks/classRecords'
import type { StudentAssessmentDetails } from './studentClassAssignmentHelpers'
import {
  generatePlacementZaloMessage,
  parseSessionDateParts,
} from './studentClassAssignmentHelpers'
import type { Student, StudentAvailableSlot } from './studentDetailTypes'
import { getStudentAvailableSlots } from './studentDetailHelpers'

export interface StudentClassAssignmentSummaryPanelProps {
  assessment: StudentAssessmentDetails
  selectedClass: ClassRecord | null
  startSessionDate: string
  packageName: string
  pkgRemainingSessions: number
  studentBranch: string
  isTransfer: boolean
  currentClassName?: string
  currentClassCode?: string
  internalNotes?: string
  studentLevel?: string
  studentSubLevel?: string
  availableSlots?: StudentAvailableSlot[]
  student?: Student | null
  onConfirm: () => void
  onCancel?: () => void
}

export function StudentClassAssignmentSummaryPanel({
  assessment,
  selectedClass,
  startSessionDate,
  packageName,
  pkgRemainingSessions,
  studentBranch,
  isTransfer,
  currentClassName,
  internalNotes,
  studentLevel,
  studentSubLevel,
  availableSlots: availableSlotsProp,
  student,
  onConfirm,
}: StudentClassAssignmentSummaryPanelProps) {
  const [isCopiedSummary, setIsCopiedSummary] = useState(false)
  const [sendNotification, setSendNotification] = useState(true)
  const [isNoteExpanded, setIsNoteExpanded] = useState(false)

  // Resolve available slots for scheduling
  const resolvedSlots = useMemo(() => {
    if (availableSlotsProp && availableSlotsProp.length > 0) return availableSlotsProp
    return getStudentAvailableSlots(student)
  }, [availableSlotsProp, student])

  // Resolve academic level and filter out package types masquerading as sub-level
  const displayLevel = useMemo(() => {
    if (studentLevel) return studentLevel
    const raw = assessment.currentLevel || 'IELTS Junior'
    return raw.replace(/\s*\([^)]*\)/g, '').trim()
  }, [studentLevel, assessment.currentLevel])

  const displaySubLevel = useMemo(() => {
    const isInvalid = (val?: string | null) => {
      if (!val) return true
      const c = val.toLowerCase().trim()
      return (
        c.includes('1 kèm 1') ||
        c.includes('1:1') ||
        c.includes('cấp tốc') ||
        c.includes('gia sư') ||
        c.includes('tiêu chuẩn') ||
        c.includes('bổ trợ')
      )
    }

    let candidate = studentSubLevel || student?.subLevel
    if (isInvalid(candidate)) {
      candidate = undefined
    }
    if (!candidate) {
      const match = assessment.currentLevel.match(/\(([^)]+)\)/)
      if (match && !isInvalid(match[1])) {
        candidate = match[1]
      }
    }
    return candidate || null
  }, [studentSubLevel, student, assessment.currentLevel])

  // Nhãn Test Textlink để mở nhận xét tab mới nếu là ghép lớp mới (hoặc có kết quả test)
  const showTestLink = useMemo(() => {
    return Boolean(
      assessment.isTestLevel ||
      assessment.testScoreSummary ||
      assessment.testResultLink ||
      !isTransfer
    )
  }, [assessment.isTestLevel, assessment.testScoreSummary, assessment.testResultLink, isTransfer])

  const testReportUrl = assessment.testResultLink || `/app/booking-test?testId=TEST-001`

  const teacherDisplay = selectedClass
    ? selectedClass.assistant
      ? `${selectedClass.teacher} & ${selectedClass.assistant}`
      : selectedClass.teacher
    : 'Nguyễn Mạnh Hùng & Hoàng Thị Mai'

  // Phân tách ngày buổi học và tên/nội dung buổi để xuống dòng
  const sessionDateParts = parseSessionDateParts(startSessionDate)

  // Copy Zalo summary message for parents
  const handleCopyZaloSummary = async () => {
    const text = generatePlacementZaloMessage({
      studentName: assessment.studentName,
      studentCode: assessment.studentCode,
      parentName: assessment.parentName,
      packageName,
      pkgRemainingSessions,
      className: selectedClass?.name || selectedClass?.code || 'IELTS Junior 1B',
      classRoom: selectedClass?.room || 'B201',
      branch: studentBranch || 'RinoEdu Nguyễn Tuân',
      startSessionDate,
      teacherName: teacherDisplay,
      isTransfer,
      oldClassName: currentClassName,
    })

    try {
      await navigator.clipboard.writeText(text)
      setIsCopiedSummary(true)
      setTimeout(() => setIsCopiedSummary(false), 2000)
      if (isTransfer) {
        toast.success('Đã sao chép tin nhắn chuyển đổi lớp học gửi phụ huynh!')
      } else {
        toast.success('Đã sao chép tin nhắn xếp lớp chính thức gửi phụ huynh!')
      }
    } catch {
      toast.error('Không thể tự động sao chép.')
    }
  }

  const canConfirm = Boolean(selectedClass && startSessionDate)

  return (
    <div className="w-full space-y-2 select-none">
      {/* ==================== THẺ 1: TIÊU CHÍ XẾP LỚP (TRÌNH ĐỘ & GIỜ RẢNH) ==================== */}
      <div className="rounded-xl border border-border/70 bg-card p-2.5 space-y-2 shadow-2xs">
        {/* Tên học viên ở trên đầu section trình độ */}
        <div className="flex items-center justify-between pb-1.5 border-b border-border/50">
          <span
            className="text-xs font-medium text-foreground truncate"
            title={assessment.studentName || student?.name}
          >
            {assessment.studentName || student?.name || 'Học viên'}
          </span>
          {assessment.studentCode && (
            <span className="text-[10.5px] font-mono text-muted-foreground font-normal shrink-0">
              {assessment.studentCode}
            </span>
          )}
        </div>

        <div className="space-y-2 text-xs">
          {/* Trình độ học viên + Nhãn Test (Textlink mở tab mới) */}
          <div className="flex items-center justify-between gap-2 text-[11px]">
            <div className="flex items-center gap-1.5 shrink-0">
              <span className="text-muted-foreground">Trình độ:</span>
              {showTestLink && (
                <a
                  href={testReportUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline font-normal text-[11px] inline-flex items-center gap-0.5 cursor-pointer bg-primary/10 hover:bg-primary/20 px-1 py-0.2 rounded transition-colors"
                  title="Mở tab mới xem nhận xét và đánh giá bài test của học viên"
                >
                  <span>Test</span>
                  <ExternalLink className="h-2.5 w-2.5 opacity-80" />
                </a>
              )}
            </div>
            <div className="flex items-center gap-1.5 min-w-0 justify-end">
              <span className="font-normal text-foreground truncate">
                {displayLevel}
              </span>
              {displaySubLevel && (
                <span className="text-[10.5px] text-muted-foreground font-normal shrink-0">
                  ({displaySubLevel})
                </span>
              )}
            </div>
          </div>

          {/* Khung giờ học viên rảnh: Hoàn toàn không chấm màu, không viền, không nền */}
          <div className="space-y-1">
            <div className="text-muted-foreground text-[11px] font-normal">
              Khung giờ học viên rảnh:
            </div>
            <div className="space-y-0.5">
              {resolvedSlots.length > 0 ? (
                resolvedSlots.map((slot: StudentAvailableSlot) => (
                  <div
                    key={slot.id}
                    className="flex items-center justify-between gap-2 text-[11px] py-0.5"
                  >
                    <span className="text-foreground font-normal">
                      {slot.dayOfWeek}
                    </span>
                    <span className="text-muted-foreground tabular-nums">
                      {slot.timeRange}
                    </span>
                  </div>
                ))
              ) : (
                <div className="text-[11px] text-muted-foreground italic">
                  Chưa cài đặt khung giờ rảnh
                </div>
              )}
            </div>
          </div>

          {/* Ghi chú nguyện vọng phụ huynh (rút gọn 1 dòng tinh tế) */}
          {assessment.initialNotes && (
            <div className="pt-0.5 text-[11px]">
              <div
                role="button"
                tabIndex={0}
                onClick={() => setIsNoteExpanded(!isNoteExpanded)}
                className="flex items-start gap-1.5 cursor-pointer text-amber-800/90 dark:text-amber-300/90 hover:text-amber-900 transition-colors select-none leading-snug group"
                title={isNoteExpanded ? 'Click để thu gọn ghi chú' : 'Click để xem ghi chú đầy đủ'}
              >
                <Pencil className="h-3 w-3 text-amber-600 shrink-0 mt-0.5 group-hover:scale-110 transition-transform" />
                <div className="flex-1 min-w-0">
                  <span className={cn('italic font-normal', !isNoteExpanded && 'line-clamp-1')}>
                    {assessment.initialNotes}
                  </span>
                  {assessment.initialNotes.length > 30 && (
                    <span className="text-muted-foreground text-[10px] not-italic ml-1 inline-block">
                      {isNoteExpanded ? 'thu gọn' : 'xem thêm'}
                    </span>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ==================== THẺ 2: TÓM TẮT GHÉP LỚP ==================== */}
      <div className="rounded-xl border border-border/70 bg-card p-2.5 space-y-2 shadow-2xs">
        {/* Header với nút Sao chép */}
        <div className="flex items-center justify-between pb-1.5 border-b border-border/50">
          <span className="text-xs font-medium text-foreground">
            Tóm tắt ghép lớp
          </span>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleCopyZaloSummary}
            className="h-auto p-0 text-xs gap-1 cursor-pointer font-normal text-muted-foreground hover:text-foreground hover:bg-transparent shadow-none border-0 transition-colors"
            title="Sao chép nội dung tin nhắn gửi Zalo cho phụ huynh"
          >
            {isCopiedSummary ? (
              <>
                <Check className="h-3 w-3 text-emerald-600" />
                <span className="text-emerald-600 text-[11px] font-normal">Đã chép</span>
              </>
            ) : (
              <>
                <Copy className="h-3 w-3 text-muted-foreground" />
                <span className="text-[11px]">Sao chép</span>
              </>
            )}
          </Button>
        </div>

        {/* Chi tiết ghép lớp (icon trung tính, khoảng cách gọn gàng) */}
        <div className="space-y-1.5 text-xs">
          {/* 1. Buổi bắt đầu */}
          <div className="flex items-start gap-2 min-w-0">
            <Calendar className="h-3.5 w-3.5 text-muted-foreground mt-0.5 shrink-0" />
            <div className="min-w-0 flex-1 leading-snug">
              {startSessionDate ? (
                <>
                  <div className="font-medium text-foreground truncate" title={sessionDateParts.dateStr}>
                    {sessionDateParts.dateStr}
                  </div>
                  {sessionDateParts.sessionContent && (
                    <div
                      className="text-[11px] text-muted-foreground truncate mt-0.5 font-normal"
                      title={sessionDateParts.sessionContent}
                    >
                      {sessionDateParts.sessionContent}
                    </div>
                  )}
                </>
              ) : (
                <span className="text-muted-foreground font-normal">Chưa chọn ca học cụ thể</span>
              )}
            </div>
          </div>

          {/* 2. Mã lớp & Trình độ */}
          <div className="flex items-center justify-between gap-2 min-w-0">
            <div className="flex items-center gap-2 min-w-0 truncate">
              <BookOpen className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
              <span className="font-medium text-foreground truncate">
                {selectedClass ? selectedClass.code : 'Chưa chọn lớp'}
              </span>
            </div>
            {selectedClass?.level && (
              <span
                className="text-[11px] font-normal text-muted-foreground shrink-0 truncate max-w-[130px]"
                title={`${selectedClass.level}${selectedClass.subLevel ? ` (${selectedClass.subLevel.replace(/^Sub-level\s*/i, '')})` : ''}`}
              >
                {selectedClass.level}
                {selectedClass.subLevel ? ` (${selectedClass.subLevel.replace(/^Sub-level\s*/i, '')})` : ''}
              </span>
            )}
          </div>

          {/* 3. Cơ sở & Phòng học */}
          <div className="flex items-start gap-2 min-w-0">
            <MapPin className="h-3.5 w-3.5 text-muted-foreground mt-0.5 shrink-0" />
            <div
              className="min-w-0 flex-1 truncate text-xs"
              title={`${studentBranch}${selectedClass?.room ? ` (Phòng ${selectedClass.room})` : ''}`}
            >
              <span className="font-normal text-foreground">{studentBranch}</span>
              {selectedClass?.room && (
                <span className="text-muted-foreground font-normal"> (P.{selectedClass.room})</span>
              )}
            </div>
          </div>

          {/* 4. Gói học & Số buổi */}
          <div className="flex items-start gap-2 min-w-0">
            <Package className="h-3.5 w-3.5 text-muted-foreground mt-0.5 shrink-0" />
            <div className="min-w-0 flex-1 truncate text-xs" title={packageName}>
              <span className="font-normal text-foreground">
                {packageName} (Còn {pkgRemainingSessions} buổi)
              </span>
            </div>
          </div>

          {/* 5. Giáo viên phụ trách */}
          <div className="flex items-start gap-2 min-w-0">
            <GraduationCap className="h-3.5 w-3.5 text-muted-foreground mt-0.5 shrink-0" />
            <div className="min-w-0 flex-1 truncate text-xs">
              <span className="font-normal text-foreground">
                {teacherDisplay || 'Bộ phận chuyên môn phân công'}
              </span>
            </div>
          </div>

          {/* 6. Ghi chú xếp lớp (nếu có) */}
          {internalNotes?.trim() && (
            <div className="flex items-start gap-2 min-w-0 pt-0.5">
              <FileText className="h-3.5 w-3.5 text-muted-foreground mt-0.5 shrink-0" />
              <div className="min-w-0 flex-1 text-xs">
                <span className="text-[10.5px] text-muted-foreground block font-normal">Ghi chú nội bộ:</span>
                <span className="text-foreground italic break-words line-clamp-2 font-normal" title={internalNotes}>
                  {internalNotes}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* CHECKBOX GỬI THÔNG BÁO TỰ ĐỘNG */}
        <div className="flex items-center gap-2 pt-1 border-t border-border/40">
          <Checkbox
            id="send-placement-notification"
            checked={sendNotification}
            onCheckedChange={(checked) => setSendNotification(Boolean(checked))}
          />
          <label
            htmlFor="send-placement-notification"
            className="text-[11px] text-muted-foreground leading-tight cursor-pointer truncate select-none font-normal"
          >
            Gửi thông báo Zalo/Email cho phụ huynh
          </label>
        </div>

        {/* NÚT THAO TÁC XÁC NHẬN */}
        <div className="pt-0.5">
          <Button
            type="button"
            onClick={onConfirm}
            disabled={!canConfirm}
            className="w-full h-8 rounded-lg text-xs font-medium bg-primary text-primary-foreground shadow-xs hover:bg-primary/90 cursor-pointer disabled:opacity-50"
          >
            {isTransfer ? 'Xác nhận chuyển lớp ngay' : 'Xác nhận ghép lớp ngay'}
          </Button>
        </div>
      </div>
    </div>
  )
}
