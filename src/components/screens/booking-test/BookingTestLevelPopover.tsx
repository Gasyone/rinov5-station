'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import Link from 'next/link'
import { Check, ExternalLink, Pencil, Upload } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { InlineSelect } from '@/components/controls'
import { cn } from '@/lib/utils'
import {
  MATH_LEVELS,
  PROGRAM_LEVELS,
  SUB_LEVELS,
  type BookingTest,
} from '@/mocks/bookingTests'
import {
  getBookingResultHref,
  hasBookingAssessmentResult,
} from './bookingTestAssessmentStorage'

interface BookingTestLevelPopoverProps {
  booking: BookingTest
  onUpdateBooking: (id: string, updater: (booking: BookingTest) => BookingTest) => void
  onOpenManualUpload?: (id: string) => void
}

export function BookingTestLevelPopover({
  booking,
  onUpdateBooking,
  onOpenManualUpload,
}: BookingTestLevelPopoverProps) {
  const [isEditing, setIsEditing] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  const isMath = booking.subject === 'math'
  const rawLevel = booking.testResult?.level ?? ''
  const rawSubLevel = booking.testResult?.subLevel ?? ''
  const level = rawLevel === 'Chưa đặt' ? '' : rawLevel
  const subLevel = rawSubLevel === '-' ? '' : rawSubLevel

  const hasResult = hasBookingAssessmentResult(booking)
  const hasLink = hasResult || Boolean(level) || Boolean(booking.resultLink)

  const isManualMath =
    isMath && (booking.testSource === 'manual' || Boolean(booking.testResult?.uploadedFileName))
  const hasManualMathScore = Boolean(
    booking.testResult?.lwr &&
      booking.testResult.lwr !== '-' &&
      booking.testResult.lwr.trim() !== ''
  ) || Boolean(booking.testResult?.uploadedFileName)

  const lmsResultUrl =
    booking.resultLink && booking.resultLink.startsWith('http')
      ? booking.resultLink
      : 'https://rinoedu.ai/ket-qua-danh-gia-nang-luc-va-toan-tu-duy-618600'

  const hasLmsResult = Boolean(
    booking.status === 'completed' ||
      (booking.testResult?.lwr && booking.testResult.lwr !== '-') ||
      Boolean(booking.resultLink)
  )

  const levelDisplay = useMemo(() => {
    if (isMath) {
      return level || 'Chưa đặt'
    }
    if (level && subLevel && subLevel !== '-') {
      return `${level} - ${subLevel}`
    }
    if (level) {
      return level
    }
    if (subLevel && subLevel !== '-') {
      return subLevel
    }
    return 'Chưa đặt'
  }, [isMath, level, subLevel])

  const resultHref =
    booking.resultLink?.startsWith('http://') ||
    booking.resultLink?.startsWith('https://') ||
    booking.resultLink?.startsWith('/app/')
      ? booking.resultLink
      : getBookingResultHref(booking.id)

  // Đóng chế độ sửa inline khi click ra ngoài (ngoại trừ click vào dropdown menu)
  useEffect(() => {
    if (!isEditing) return

    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      if (
        containerRef.current &&
        !containerRef.current.contains(target) &&
        !target.closest('[role="listbox"]') &&
        !target.closest('[data-radix-select-content]') &&
        !target.closest('[data-radix-popper-content-wrapper]')
      ) {
        setIsEditing(false)
      }
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsEditing(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isEditing])

  // 1. CHẾ ĐỘ SỬA TRỰC TIẾP TRÊN DÒNG (INLINE EDITING) - THU GỌN KÍCH THƯỚC
  if (isEditing) {
    if (isMath) {
      return (
        <div
          ref={containerRef}
          className="flex items-center gap-0.5 w-full py-0 min-w-0"
          onClick={(e) => e.stopPropagation()}
        >
          <InlineSelect
            value={level}
            ariaLabel={`Trình độ môn Toán của ${booking.childName}`}
            className="!h-5 !min-h-0 !py-0 !px-1.5 flex-1 text-[11px] font-normal border-primary/50 bg-background shadow-none [&_svg]:!size-3 rounded leading-none"
            options={[
              { value: '', label: 'Chưa đặt' },
              ...MATH_LEVELS.map((lvl) => ({ value: lvl, label: lvl })),
            ]}
            onValueChange={(val) => {
              onUpdateBooking(booking.id, (current) => ({
                ...current,
                testResult: { ...current.testResult, level: val },
              }))
            }}
          />
          <Button
            type="button"
            variant="ghost"
            size="icon-xs"
            onClick={(e) => {
              e.stopPropagation()
              setIsEditing(false)
              toast.success(`Đã cập nhật: ${levelDisplay}`)
            }}
            className="!h-5 !w-5 text-emerald-600 hover:bg-emerald-50 hover:text-emerald-700 dark:hover:bg-emerald-950/40 rounded shrink-0 cursor-pointer p-0"
            title="Xong (Hoàn tất chỉnh sửa)"
          >
            <Check className="h-3 w-3 stroke-[2.5]" />
          </Button>
        </div>
      )
    }

    return (
      <div
        ref={containerRef}
        className="flex flex-col gap-0.5 w-full py-0 min-w-0"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Dòng 1: Hộp chọn Trình độ chính (siêu gọn) */}
        <InlineSelect
          value={level}
          ariaLabel={`Trình độ của ${booking.childName}`}
          className="!h-5 !min-h-0 !py-0 !px-1.5 text-[11px] font-normal w-full border-primary/50 bg-background shadow-none [&_svg]:!size-3 rounded leading-none"
          options={[
            { value: '', label: 'Chưa đặt' },
            ...PROGRAM_LEVELS.map((lvl) => ({ value: lvl, label: lvl })),
          ]}
          onValueChange={(val) => {
            onUpdateBooking(booking.id, (current) => ({
              ...current,
              testResult: { ...current.testResult, level: val },
            }))
          }}
        />

        {/* Dòng 2: Hộp chọn Nhánh phụ + Nút Xong (Check) (siêu gọn) */}
        <div className="flex items-center gap-0.5 min-w-0">
          <InlineSelect
            value={subLevel}
            ariaLabel={`Nhánh của ${booking.childName}`}
            className="!h-5 !min-h-0 !py-0 !px-1.5 flex-1 text-[11px] font-normal border-primary/40 bg-background min-w-0 shadow-none [&_svg]:!size-3 rounded leading-none"
            options={[
              { value: '', label: '-' },
              ...SUB_LEVELS.map((sub) => ({ value: sub, label: sub })),
            ]}
            onValueChange={(val) => {
              onUpdateBooking(booking.id, (current) => ({
                ...current,
                testResult: { ...current.testResult, subLevel: val },
              }))
            }}
          />

          <Button
            type="button"
            variant="ghost"
            size="icon-xs"
            onClick={(e) => {
              e.stopPropagation()
              setIsEditing(false)
              toast.success(`Đã cập nhật: ${levelDisplay}`)
            }}
            className="!h-5 !w-5 text-emerald-600 hover:bg-emerald-50 hover:text-emerald-700 dark:hover:bg-emerald-950/40 rounded shrink-0 cursor-pointer p-0"
            title="Xong (Hoàn tất chỉnh sửa)"
          >
            <Check className="h-3 w-3 stroke-[2.5]" />
          </Button>
        </div>
      </div>
    )
  }

  // 2. CHẾ ĐỘ HIỂN THỊ THƯỜNG: ICON SỬA ĐẶT SÁT CẠNH KẾT QUẢ
  return (
    <div
      className="flex flex-col gap-0.5 w-full rounded-md p-1 -m-1 transition-colors hover:bg-muted/40 group/level"
      onClick={(e) => {
        e.stopPropagation()
        setIsEditing(true)
      }}
    >
      {/* Dòng 1: Trình độ + Icon sửa đặt sát cạnh */}
      <div className="flex items-center gap-1 min-w-0">
        <p
          className={cn(
            "truncate text-xs leading-tight cursor-pointer",
            level ? "font-normal text-foreground" : "font-normal italic text-muted-foreground"
          )}
          title={`Bấm để sửa trực tiếp: ${levelDisplay}`}
        >
          {levelDisplay}
        </p>

        <Button
          type="button"
          variant="ghost"
          size="icon-xs"
          className="h-4 w-4 text-muted-foreground/60 hover:text-primary transition-colors shrink-0 cursor-pointer p-0"
          title="Sửa trình độ trực tiếp trên dòng"
          aria-label={`Sửa trình độ cho ${booking.childName}`}
          onClick={(e) => {
            e.stopPropagation()
            setIsEditing(true)
          }}
        >
          <Pencil className="h-3 w-3" />
        </Button>
      </div>

      {/* Dòng 2: Kết quả / Nhận xét / Upload */}
      {isMath ? (
        isManualMath ? (
          hasManualMathScore ? (
            <div
              className="flex items-center gap-1.5 min-w-0"
              onClick={(e) => e.stopPropagation()}
            >
              <a
                href={booking.resultLink || booking.testResult?.uploadedFileUrl || '#'}
                target="_blank"
                rel="noreferrer"
                title="Mở xem kết quả bài chấm tay"
                className="inline-flex max-w-full items-center gap-0.5 text-xs font-normal text-primary hover:underline leading-tight"
                onClick={(e) => {
                  const url = booking.resultLink || booking.testResult?.uploadedFileUrl
                  if (!url || (!url.startsWith('http') && !url.startsWith('blob:'))) {
                    e.preventDefault()
                    onOpenManualUpload?.(booking.id)
                  }
                }}
              >
                <span className="truncate">Kết quả</span>
                <ExternalLink className="h-3 w-3 shrink-0" />
              </a>
              <span className="text-muted-foreground/35 text-[10px] shrink-0 select-none">•</span>
              <button
                type="button"
                className="inline-flex items-center gap-0.5 text-[11px] text-muted-foreground hover:text-primary transition-colors cursor-pointer shrink-0"
                title="Cập nhật kết quả bài chấm tay"
                onClick={() => onOpenManualUpload?.(booking.id)}
              >
                <Upload className="h-3 w-3 shrink-0" />
                <span>Upload</span>
              </button>
            </div>
          ) : (
            <div onClick={(e) => e.stopPropagation()}>
              <button
                type="button"
                onClick={() => onOpenManualUpload?.(booking.id)}
                className="inline-flex items-center gap-1 text-xs text-primary hover:underline transition-colors cursor-pointer shrink-0 font-normal leading-tight"
                title="Upload kết quả bài chấm tay"
              >
                <Upload className="h-3 w-3 shrink-0" />
                <span>Upload kết quả</span>
              </button>
            </div>
          )
        ) : hasLmsResult ? (
          <a
            href={lmsResultUrl}
            target="_blank"
            rel="noreferrer"
            title="Mở trang kết quả đánh giá năng lực Toán tư duy"
            aria-label={`Mở kết quả đánh giá của ${booking.childName}`}
            className="inline-flex max-w-full items-center gap-1 text-xs font-normal text-primary hover:underline leading-tight"
            onClick={(e) => e.stopPropagation()}
          >
            <span className="truncate">Kết quả</span>
            <ExternalLink className="h-3 w-3 shrink-0" />
          </a>
        ) : (
          <p className="font-mono text-xs text-muted-foreground leading-tight">-</p>
        )
      ) : hasLink ? (
        <Link
          href={resultHref}
          target="_blank"
          rel="noreferrer"
          title="Mở nhận xét"
          aria-label={`Mở nhận xét của ${booking.childName}`}
          className="inline-flex max-w-full items-center gap-1 text-xs font-normal text-primary hover:underline leading-tight"
          onClick={(e) => e.stopPropagation()}
        >
          <span className="truncate">Nhận xét</span>
          <ExternalLink className="h-3 w-3 shrink-0" />
        </Link>
      ) : (
        <p className="font-mono text-xs text-muted-foreground leading-tight">-</p>
      )}
    </div>
  )
}
