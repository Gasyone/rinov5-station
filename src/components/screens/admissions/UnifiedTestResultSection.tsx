'use client'

import React from 'react'
import {
  BookOpen,
  Check,
  Clock,
  ExternalLink,
  FileText,
  MapPin,
  Pencil,
  Upload,
  User,
  UserCheck,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { InlineSelect } from '@/components/controls'
import { StatusBadge } from '@/components/shared'
import { cn } from '@/lib/utils'
import { getStatusColors } from '@/lib/statusColors'
import { MATH_LEVELS, PROGRAM_LEVELS, SUB_LEVELS } from '@/mocks/bookingTests'
import type { BookingTest } from '@/mocks/bookingTests'
import type { UnifiedSessionItem } from './unifiedSessionTypes'
import { formatTestTimeWithDay } from '../booking-test/bookingTestHelpers'

interface UnifiedTestResultSectionProps {
  session: UnifiedSessionItem
  booking?: BookingTest
  hasTestScore: boolean
  isCheckedIn: boolean
  terminalStatus: { status: string; label: string } | null
  canEditPlacement?: boolean
  creatorName: string
  canComplete?: boolean
  canCancel?: boolean
  onComplete?: () => void
  onCancel?: () => void
  onCheckIn: (e?: React.MouseEvent) => void
  onDirectAssessment: (e?: React.MouseEvent) => void
  onOpenAssessment?: (bookingId: string) => void
  onOpenTeacherPicker?: () => void
  onUpdateBookingLevel?: (level: string, subLevel?: string) => void
  onOpenManualUpload?: (bookingId: string) => void
}

export function UnifiedTestResultSection({
  session,
  booking,
  hasTestScore,
  isCheckedIn,
  terminalStatus,
  canEditPlacement = false,
  creatorName,
  canComplete = false,
  canCancel = false,
  onComplete,
  onCancel,
  onCheckIn,
  onDirectAssessment,
  onOpenAssessment,
  onOpenTeacherPicker,
  onUpdateBookingLevel,
  onOpenManualUpload,
}: UnifiedTestResultSectionProps) {
  const hasTeacher = Boolean(
    session.teacherName &&
    session.teacherName !== 'Chưa gán GV' &&
    session.teacherName !== 'Chưa gán' &&
    session.teacherName.trim() !== ''
  )

  const warningText = getStatusColors('warning').text
  const infoText = getStatusColors('info').text
  const successText = getStatusColors('success').text
  const scoreValue = booking?.testResult?.speakingScore || '0'
  const isPositiveScore = Number(scoreValue) > 0

  const hasLwrScore = Boolean(
    (booking?.testResult?.lwrLevel && booking.testResult.lwrLevel !== '-' && booking.testResult.lwrLevel !== '') ||
    (booking?.testResult?.lwr && booking.testResult.lwr !== '-' && booking.testResult.lwr !== '') ||
    (booking?.testResult?.lwrScore && booking.testResult.lwrScore !== '0' && booking.testResult.lwrScore !== '')
  )

  const lwrDisplay = hasLwrScore
    ? `${booking?.testResult?.lwrLevel && booking.testResult.lwrLevel !== '-' ? booking.testResult.lwrLevel : 'LWR'} - ${booking?.testResult?.lwr || '-'} - ${booking?.testResult?.lwrScore || '0'}`
    : (booking?.status === 'ipad_test_started' ? 'Đang làm bài...' : 'Chưa có')

  const isMath = session.subject === 'math' || booking?.subject === 'math'
  const isManualMath =
    isMath &&
    (booking?.testSource === 'manual' ||
      Boolean(booking?.testResult?.uploadedFileName) ||
      Boolean(booking?.testResult?.uploadedFileUrl) ||
      !booking?.testLink?.includes('lms'))
  const rawMathGrade =
    booking?.testResult?.lwrLevel &&
    booking.testResult.lwrLevel !== '-' &&
    booking.testResult.lwrLevel !== 'LWR' &&
    booking.testResult.lwrLevel.trim() !== ''
      ? booking.testResult.lwrLevel.trim()
      : (booking?.expectedLevel?.trim() || 'Lớp 1')
  const mathGrade = rawMathGrade.startsWith('Lớp')
    ? rawMathGrade
    : /^\d+$/.test(rawMathGrade)
      ? `Lớp ${rawMathGrade}`
      : rawMathGrade

  const mathLwrDisplay = hasLwrScore
    ? `${mathGrade} - ${booking?.testResult?.lwr || '-'}`
    : booking?.status === 'ipad_test_started'
      ? 'Đang làm bài...'
      : `${mathGrade} - -`
  const mathResultUrl =
    booking?.testResult?.uploadedFileUrl ||
    (booking?.resultLink && booking.resultLink.startsWith('http')
      ? booking.resultLink
      : 'https://rinoedu.ai/ket-qua-danh-gia-nang-luc-va-toan-tu-duy-618600')

  const programDisplay = booking?.program || (isMath ? 'Chương trình Toán tư duy' : 'Station Program')
  const expectedLevelVal = booking?.expectedLevel || session.testScoreSummary?.level
  const displayTime = booking?.testTime ? formatTestTimeWithDay(booking.testTime) : session.dateLabel

  return (
    <>
      {/* 2. BODY BÊN TRONG: KẾT QUẢ ĐÁNH GIÁ TRÌNH ĐỘ */}
      <div className="p-3.5 space-y-3">
        <div className="space-y-2">
          {/* TRƯỜNG HỢP 1: CHƯA ĐIỂM DANH (CHƯA CHECK-IN) & CHƯA CÓ ĐIỂM (PHẲNG - KHÔNG VIỀN, KHÔNG NỀN) */}
          {!hasTestScore && !isCheckedIn && terminalStatus?.status !== 'cancelled' && (
            <div className="flex flex-col items-center justify-center py-2.5 text-center gap-2">
              <div className="space-y-0.5">
                <p className="text-xs font-normal text-muted-foreground">
                  Học viên chưa điểm danh ca kiểm tra này
                </p>
                <p className="text-[11px] text-muted-foreground/75 font-normal">
                  Điểm danh khi học viên đến cơ sở, hoặc bấm nhận xét để đánh giá trực tiếp
                </p>
              </div>

              <div className="flex items-center justify-center gap-2 pt-0.5">
                <Button
                  type="button"
                  size="sm"
                  onClick={onCheckIn}
                  className="h-7 px-3 text-xs font-normal bg-primary text-primary-foreground hover:bg-primary/90 cursor-pointer shadow-2xs gap-1.5"
                  title="Điểm danh (Check-in) cho học viên vào ca test"
                >
                  <Check className="h-3.5 w-3.5" />
                  <span>Check in</span>
                </Button>

                {!isMath && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={onDirectAssessment}
                    className="h-7 px-3 text-xs font-normal text-foreground hover:bg-muted cursor-pointer shadow-2xs gap-1.5"
                    title="Tự động Check-in và mở ngay hộp thoại đánh giá nhận xét"
                  >
                    <FileText className="h-3.5 w-3.5 text-primary" />
                    <span>Nhận xét</span>
                  </Button>
                )}

                {isMath && isManualMath && booking && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => onOpenManualUpload?.(booking.id)}
                    className="h-7 px-3 text-xs font-normal text-foreground hover:bg-muted cursor-pointer shadow-2xs gap-1.5"
                    title="Mở hộp thoại upload kết quả bài chấm tay"
                  >
                    <Upload className="h-3.5 w-3.5 text-primary" />
                    <span>Upload kết quả</span>
                  </Button>
                )}

                {canCancel && onCancel && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={onCancel}
                    className="h-7 px-2 text-xs font-normal text-rose-600 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/40 cursor-pointer"
                    title="Hủy ca kiểm tra này"
                  >
                    Hủy lịch
                  </Button>
                )}
              </div>
            </div>
          )}

          {/* TRƯỜNG HỢP 2: ĐÃ ĐIỂM DANH (CHECK-IN) NHƯNG CHƯA CÓ ĐIỂM (PHẲNG - KHÔNG VIỀN, KHÔNG NỀN) */}
          {!hasTestScore && isCheckedIn && terminalStatus?.status !== 'cancelled' && (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 py-1">
              <div className="flex items-center gap-2.5 min-w-0">
                <span className="inline-flex items-center justify-center h-5 w-5 rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400 shrink-0">
                  <Check className="h-3 w-3 stroke-[2.5]" />
                </span>
                <div className="space-y-0.5 min-w-0">
                  <p className="text-xs font-normal text-foreground">
                    Đã điểm danh (Check-in) • Sẵn sàng đánh giá
                  </p>
                  <p className="text-[11px] text-muted-foreground font-normal truncate">
                    {isMath
                      ? 'Học viên đã có mặt tại cơ sở và sẵn sàng làm bài kiểm tra.'
                      : 'Học viên đã có mặt tại cơ sở. Bấm Nhận xét để tiến hành kiểm tra & ghi điểm.'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1.5 shrink-0">
                {!isMath && (
                  <Button
                    type="button"
                    size="sm"
                    onClick={() => booking && onOpenAssessment?.(booking.id)}
                    className="h-7 px-3 text-xs font-normal bg-primary text-primary-foreground hover:bg-primary/90 cursor-pointer shadow-2xs gap-1.5 shrink-0"
                    title="Mở form đánh giá và ghi nhận xét"
                  >
                    <FileText className="h-3.5 w-3.5" />
                    <span>Nhận xét</span>
                  </Button>
                )}

                {isMath && isManualMath && booking && (
                  <Button
                    type="button"
                    size="sm"
                    onClick={() => onOpenManualUpload?.(booking.id)}
                    className="h-7 px-3 text-xs font-normal bg-primary text-primary-foreground hover:bg-primary/90 cursor-pointer shadow-2xs gap-1.5 shrink-0"
                    title="Mở form upload kết quả bài chấm tay"
                  >
                    <Upload className="h-3.5 w-3.5" />
                    <span>Upload kết quả</span>
                  </Button>
                )}

                {canCancel && onCancel && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={onCancel}
                    className="h-7 px-2 text-xs font-normal text-rose-600 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/40 cursor-pointer"
                    title="Hủy ca kiểm tra này"
                  >
                    Hủy lịch
                  </Button>
                )}
              </div>
            </div>
          )}

          {/* TRƯỜNG HỢP CA BỊ HỦY CHƯA CÓ ĐIỂM (PHẲNG - KHÔNG VIỀN, KHÔNG NỀN) */}
          {!hasTestScore && terminalStatus?.status === 'cancelled' && (
            <div className="py-2 text-xs text-muted-foreground font-normal">
              Ca kiểm tra này đã bị hủy.
            </div>
          )}

          {/* TRƯỜNG HỢP 3: CÓ ĐIỂM (CỘT TRÁI: ĐIỂM SỐ & LINK, CỘT PHẢI: KẾT QUẢ ĐÁNH GIÁ & BUTTON ACTION BÊN DƯỚI) */}
          {hasTestScore && (
            <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
              {/* CỘT TRÁI: ĐIỂM SPEAKING VÀ ĐIỂM LWR (KÈM NHẬN XÉT VÀ KẾT QUẢ SÁT ĐIỂM, CÓ PHÂN CÁCH) */}
              <div className="flex-1 min-w-0 space-y-2">
                {/* Điểm speaking (Chỉ hiển thị cho Tiếng Anh) */}
                {!isMath && (
                  <div className="min-w-0 space-y-0.5">
                    <span className="text-[11px] font-normal text-muted-foreground block">
                      Điểm speaking
                    </span>
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <div className="flex items-baseline gap-1.5 min-w-0">
                        <span className={cn('text-xs font-normal', warningText)}>
                          GV: {booking?.testResult?.speaking || 'chưa có'}
                        </span>
                        <span className={cn('text-xs font-normal', infoText)}>
                          AI: {booking?.testResult?.speakingAi || '0/0'}
                        </span>
                        <span className={cn('text-sm font-semibold', isPositiveScore ? successText : 'text-muted-foreground')}>
                          {scoreValue}
                        </span>
                      </div>

                      {booking && (
                        <>
                          <span className="text-muted-foreground/30 text-xs select-none">•</span>
                          <button
                            type="button"
                            onClick={() => onOpenAssessment?.(booking.id)}
                            className="inline-flex items-center gap-1 text-[11px] text-primary hover:underline font-normal cursor-pointer shrink-0"
                            title="Mở modal nhận xét & đánh giá"
                          >
                            <FileText className="h-3 w-3" />
                            <span>Nhận xét</span>
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                )}

                {/* Điểm LWR */}
                <div className="min-w-0 space-y-1">
                  <span className="text-[11px] font-normal text-muted-foreground block">
                    {isMath ? 'Điểm bài làm' : 'Điểm LWR'}
                  </span>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <p
                      className="text-xs sm:text-[13px] font-normal text-foreground truncate min-w-0"
                      title={isMath ? mathLwrDisplay : lwrDisplay}
                    >
                      {isMath ? mathLwrDisplay : lwrDisplay}
                    </p>

                    {(booking?.testLink || booking?.resultLink || isMath) && (
                      <>
                        <span className="text-muted-foreground/30 text-xs select-none">•</span>
                        <a
                          href={isMath ? mathResultUrl : (booking?.testLink || booking?.resultLink)}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 text-[11px] text-primary hover:underline font-normal shrink-0"
                          title={isMath ? "Xem kết quả bài test môn Toán" : "Xem kết quả bài làm từ iPad"}
                        >
                          <ExternalLink className="h-3 w-3" />
                          <span>Kết quả</span>
                        </a>
                      </>
                    )}

                    {/* NÚT EDIT (SỬA) BÊN CẠNH ĐIỂM CHO TRƯỜNG HỢP CHẤM TAY */}
                    {isMath && isManualMath && booking && (
                      <>
                        <span className="text-muted-foreground/30 text-xs select-none">•</span>
                        <button
                          type="button"
                          onClick={() => onOpenManualUpload?.(booking.id)}
                          className="inline-flex items-center gap-1 text-[11px] text-primary hover:underline font-normal cursor-pointer shrink-0"
                          title="Cập nhật kết quả bài chấm tay"
                        >
                          <Pencil className="h-3 w-3" />
                          <span>Sửa</span>
                        </button>
                      </>
                    )}
                  </div>

                  {/* BUTTON UPLOAD Ở PHÍA DƯỚI ĐIỂM CHO TRƯỜNG HỢP CHẤM TAY */}
                  {isMath && isManualMath && booking && (
                    <div className="pt-0.5 flex items-center gap-2 flex-wrap">
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        onClick={() => onOpenManualUpload?.(booking.id)}
                        className="h-6 px-2 text-xs font-normal text-primary border-primary/30 hover:bg-primary/10 cursor-pointer shadow-2xs gap-1"
                        title={booking.testResult?.uploadedFileName ? "Upload lại hoặc thay đổi file bài chấm tay" : "Upload phiếu chấm bài thi"}
                      >
                        <Upload className="h-3 w-3" />
                        <span>{booking.testResult?.uploadedFileName ? 'Upload lại' : 'Upload kết quả'}</span>
                      </Button>

                      {booking.testResult?.uploadedFileName && (
                        <div
                          className="inline-flex items-center gap-1 text-[11px] text-muted-foreground bg-muted/50 px-1.5 py-0.5 rounded border border-border/40 font-mono truncate max-w-[170px]"
                          title={booking.testResult.uploadedFileName}
                        >
                          <FileText className="h-3 w-3 text-primary shrink-0" />
                          <span className="truncate">{booking.testResult.uploadedFileName}</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* CỘT PHẢI: KẾT QUẢ SAU ĐÁNH GIÁ & CÁC NÚT ACTION NGAY BÊN DƯỚI */}
              <div className="flex flex-col gap-2 shrink-0 sm:min-w-[240px] md:min-w-[260px] w-full sm:w-auto">
                {/* Hàng chọn kết quả sau đánh giá & nhánh */}
                <div className={cn("grid gap-2", isMath ? "grid-cols-1" : "grid-cols-2")}>
                  <div className="space-y-1">
                    <span className="text-muted-foreground text-[11px] font-normal block truncate">
                      Kết quả sau đánh giá:
                    </span>
                    <InlineSelect
                      value={booking?.testResult?.level ?? (booking?.expectedLevel || '')}
                      disabled={!canEditPlacement || terminalStatus?.status === 'cancelled'}
                      ariaLabel="Kết quả sau đánh giá"
                      options={[
                        { value: '', label: 'Chưa đặt' },
                        ...(isMath ? MATH_LEVELS : PROGRAM_LEVELS).map((level) => ({ value: level, label: level })),
                      ]}
                      onValueChange={(val) => onUpdateBookingLevel?.(val, booking?.testResult?.subLevel)}
                      className="h-7 text-xs border-solid shadow-2xs font-medium text-sky-700 dark:text-sky-300"
                    />
                  </div>

                  {!isMath && (
                    <div className="space-y-1">
                      <span className="text-muted-foreground text-[11px] font-normal block truncate">
                        Nhánh trình độ:
                      </span>
                      <InlineSelect
                        value={booking?.testResult?.subLevel ?? ''}
                        disabled={!canEditPlacement || terminalStatus?.status === 'cancelled'}
                        ariaLabel="Nhánh trình độ"
                        options={[
                          { value: '', label: '-' },
                          ...SUB_LEVELS.map((sub) => ({ value: sub, label: sub })),
                        ]}
                        onValueChange={(sub) => onUpdateBookingLevel?.(booking?.testResult?.level || '', sub)}
                        className="h-7 text-xs border-solid shadow-2xs font-normal"
                      />
                    </div>
                  )}
                </div>

                {/* Hàng button actions hoặc trạng thái ở ngay dưới trình độ */}
                {(canComplete || canCancel || terminalStatus) && (
                  <div className="flex items-center justify-end gap-2 pt-0.5">
                    {terminalStatus && (
                      <StatusBadge
                        status={terminalStatus.status}
                        label={terminalStatus.label}
                        className="text-[10px] py-0 px-2 h-6 font-normal"
                      />
                    )}

                    {canComplete && onComplete && (
                      <Button
                        type="button"
                        size="sm"
                        onClick={onComplete}
                        className="h-7 px-3 text-xs font-normal bg-primary text-primary-foreground hover:bg-primary/90 cursor-pointer shadow-2xs gap-1"
                        title="Xác nhận hoàn tất ca kiểm tra"
                      >
                        <Check className="h-3.5 w-3.5" />
                        <span>Hoàn tất</span>
                      </Button>
                    )}

                    {canCancel && onCancel && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={onCancel}
                        className="h-7 px-2 text-xs font-normal text-rose-600 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/40 cursor-pointer"
                        title="Hủy ca kiểm tra này"
                      >
                        Hủy lịch
                      </Button>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 3. KHỐI THÔNG TIN CA ĐẶT LỊCH TEST (LƯỚI 2 CỘT GỌN GÀNG, CHẶT CHẼ) */}
      <div className="border-t border-border/60 bg-muted/40 dark:bg-muted/25 px-3.5 py-2.5 text-xs space-y-2">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1.5">
          {/* CỘT 1: LỊCH HẸN & ĐỊA ĐIỂM */}
          <div className="space-y-1.5 min-w-0">
            {/* Dòng 1: Thời gian */}
            <div className="flex items-center gap-1.5 text-xs min-w-0">
              <Clock className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
              <span className="text-muted-foreground shrink-0">Thời gian:</span>
              <span className="font-medium text-foreground truncate" title={displayTime}>
                {displayTime}
              </span>
            </div>

            {/* Dòng 2: Địa điểm (không hiển thị phòng) */}
            <div className="flex items-center gap-1.5 text-xs min-w-0">
              <MapPin className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
              <span className="text-muted-foreground shrink-0">Địa điểm:</span>
              <span className="font-normal text-foreground truncate" title={session.school}>
                {session.school}
              </span>
            </div>

            {/* Dòng 3: Chương trình & Level dự kiến trong ngoặc (bỏ chữ dự kiến) */}
            <div className="flex items-center gap-1.5 text-xs min-w-0">
              <BookOpen className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
              <span className="text-muted-foreground shrink-0">Chương trình:</span>
              <span
                className="font-normal text-foreground truncate"
                title={expectedLevelVal ? `${programDisplay} (${expectedLevelVal})` : programDisplay}
              >
                {programDisplay}
                {expectedLevelVal && (
                  <span className="text-muted-foreground ml-1">
                    ({expectedLevelVal})
                  </span>
                )}
              </span>
            </div>
          </div>

          {/* CỘT 2: ĐIỀU PHỐI & NHÂN SỰ */}
          <div className="space-y-1.5 min-w-0">
            {/* Dòng 1: Khảo thí */}
            <div className="flex items-center gap-1.5 text-xs min-w-0">
              <UserCheck className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
              <span className="text-muted-foreground shrink-0">Khảo thí:</span>
              {hasTeacher ? (
                <div className="flex items-center gap-1 min-w-0">
                  <span className="font-medium text-foreground truncate">{session.teacherName}</span>
                  {onOpenTeacherPicker && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation()
                        onOpenTeacherPicker()
                      }}
                      className="text-primary hover:underline text-[11px] font-normal cursor-pointer shrink-0"
                      title="Đổi giáo viên phụ trách"
                    >
                      [Đổi]
                    </button>
                  )}
                </div>
              ) : (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation()
                    onOpenTeacherPicker?.()
                  }}
                  className="h-5 px-1.5 text-[10.5px] font-normal text-primary border-primary/40 hover:bg-primary/10 cursor-pointer shadow-none bg-background"
                >
                  + Gán phụ trách
                </Button>
              )}
            </div>

            {/* Dòng 2: Người tạo / Tư vấn */}
            <div className="flex items-center gap-1.5 text-xs min-w-0">
              <User className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
              <span className="text-muted-foreground shrink-0">Tư vấn / Tạo bởi:</span>
              <span className="font-normal text-foreground truncate" title={creatorName}>
                {creatorName}
              </span>
            </div>

            {/* Dòng 3: Mã phiếu & Ngày tạo */}
            <div className="flex items-center gap-1.5 text-xs min-w-0">
              <FileText className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
              <span className="text-muted-foreground shrink-0">Mã phiếu:</span>
              <span className="font-mono text-foreground font-medium">#{session.id}</span>
              <span className="text-muted-foreground text-[11px]">
                ({booking?.testTime?.split(' ')[0] || session.rawDate?.split(' ')[0] || '2026-11-13'})
              </span>
            </div>
          </div>
        </div>

        {/* DÒNG GHI CHÚ CA TEST: NẰM DƯỚI, PHẲNG, LIỀN MẠCH */}
        {booking?.msg && (
          <div className="pt-1.5 border-t border-border/40 flex items-start gap-1.5 text-xs">
            <span className="text-muted-foreground shrink-0 font-medium">Ghi chú ca:</span>
            <span className="text-foreground/90 italic truncate" title={booking.msg}>
              {booking.msg}
            </span>
          </div>
        )}
      </div>
    </>
  )
}
