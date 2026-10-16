'use client'

import React, { useRef } from 'react'
import { UserCheck, BookOpen, Award, ExternalLink, Upload } from 'lucide-react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

export interface MonthlyReportStatsCardsProps {
  currentMonth?: string
  attendanceRatio?: string
  lateCount?: number
  homeworkRatio?: string
  homeworkAvg?: string
  testScore?: number | string | null
  priorTestScore?: number | string | null
  isMath?: boolean
  isEditing?: boolean
  onChangeTestScore?: (score: number | string | null) => void
  testDocUrl?: string
  testDocName?: string
  onChangeTestDoc?: (url: string, name: string) => void
  onOpenTestRemark?: () => void
  onDownloadTestDoc?: () => void
  onScrollToEvaluation?: () => void
  onOpenEvaluation?: () => void
  testRemarkUrl?: string
  showEvaluationLink?: boolean
  className?: string
}

function formatScoreDisplay(val?: number | string | null): string {
  if (val === null || val === undefined || val === '') return '00'
  if (val === 0 || val === '0' || val === '00') return '00'
  if (typeof val === 'number') {
    return Number.isInteger(val) ? `${val}.0` : val.toFixed(1)
  }
  return String(val)
}

export function MonthlyReportStatsCards({
  currentMonth = 'Tháng 4',
  attendanceRatio = '6/7',
  lateCount = 0,
  homeworkRatio = '6/7',
  homeworkAvg = '7.5',
  testScore = '00',
  priorTestScore = '00',
  isMath = false,
  isEditing = false,
  onChangeTestScore,
  testDocUrl,
  testDocName,
  onChangeTestDoc,
  onOpenTestRemark,
  onScrollToEvaluation,
  onOpenEvaluation,
  testRemarkUrl,
  showEvaluationLink = true,
  className,
}: MonthlyReportStatsCardsProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleTestRemarkClick = () => {
    if (onOpenTestRemark) {
      onOpenTestRemark()
    } else if (testRemarkUrl) {
      window.open(testRemarkUrl, '_blank')
    } else if (onScrollToEvaluation) {
      onScrollToEvaluation()
    } else if (onOpenEvaluation) {
      onOpenEvaluation()
    } else {
      const el =
        document.getElementById('landing-section-a') ||
        document.getElementById('monthly-report-evaluation-section')
      el?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  const handleOpenTestDoc = () => {
    if (onOpenTestRemark) {
      onOpenTestRemark()
      return
    }
    const docUrl = testDocUrl || testRemarkUrl
    if (docUrl && docUrl !== '#') {
      window.open(docUrl, '_blank')
      toast.success(`Đang mở link tài liệu bài kiểm tra môn Toán: ${testDocName || 'Tài liệu bài kiểm tra'}!`)
    } else {
      toast.info('Chưa có liên kết tài liệu để xem.')
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const fileUrl = URL.createObjectURL(file)
      onChangeTestDoc?.(fileUrl, file.name)
      toast.success(`Đã tải lên tài liệu bài kiểm tra: ${file.name}. Nút đã chuyển thành 'Nhận xét' để xem link!`)
    }
  }

  // 1. Kiểm tra điểm kiểm tra hợp lệ (> 0, khác 00, khác rỗng)
  const hasValidTestScore = Boolean(
    testScore !== null &&
    testScore !== undefined &&
    testScore !== '' &&
    testScore !== 0 &&
    testScore !== '0' &&
    testScore !== '00'
  )

  // 2. Kiểm tra có tài liệu đính kèm hoặc bài kiểm tra
  const hasDocument = Boolean(testDocUrl && testDocUrl.trim() !== '')

  // 3. Có điểm kiểm tra hoặc bài kiểm tra / tài liệu
  const hasTestOrScore = hasValidTestScore || hasDocument

  // 4. Điều kiện hiển thị thẻ "Điểm kiểm tra":
  // - Với mode edit môn toán: Luôn hiện để người dùng nhập điểm / upload bài kiểm tra
  // - Nếu tháng không có điểm kiểm tra, bài kiểm tra (báo cáo mới tạo hoặc tháng không kiểm tra): Ẩn đi
  const shouldShowTestCard = (isEditing && isMath) || hasTestOrScore

  return (
    <div className={cn('select-none', className)}>
      {/* Smart Cards: 3 thẻ (khi có điểm kiểm tra hoặc edit môn toán) hoặc 2 thẻ (khi tháng không có bài kiểm tra) */}
      <div
        className={cn(
          'grid gap-1.5 sm:gap-2',
          shouldShowTestCard ? 'grid-cols-3' : 'grid-cols-2'
        )}
      >
        {/* 1. Chuyên cần */}
        <div
          className="rounded-lg px-2.5 py-1.5 border border-border/60 bg-muted/25 dark:bg-muted/10 flex flex-col justify-between gap-0.5 min-w-0 text-left select-none shadow-3xs"
          title={`Thông tin chuyên cần ${currentMonth}`}
        >
          <div className="flex items-center justify-between gap-1 min-w-0">
            <div className="flex items-center gap-1.5 min-w-0">
              <UserCheck className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <span className="text-xs sm:text-sm font-normal text-emerald-700 dark:text-emerald-400 leading-none">
                {attendanceRatio}
              </span>
            </div>
            <span className="text-xs text-muted-foreground font-normal truncate leading-tight ml-auto text-right">
              Muộn: {lateCount}
            </span>
          </div>
          <span className="text-xs text-muted-foreground font-normal truncate">Chuyên cần</span>
        </div>

        {/* 2. BTVN */}
        <div
          className="rounded-lg px-2.5 py-1.5 border border-border/60 bg-muted/25 dark:bg-muted/10 flex flex-col justify-between gap-0.5 min-w-0 text-left select-none shadow-3xs"
          title="Thông tin bài tập về nhà"
        >
          <div className="flex items-center justify-between gap-1 min-w-0">
            <div className="flex items-center gap-1.5 min-w-0">
              <BookOpen className="h-3.5 w-3.5 text-sky-600 dark:text-sky-400 shrink-0" />
              <span className="text-xs sm:text-sm font-normal text-sky-700 dark:text-sky-400 leading-none">
                {homeworkRatio}
              </span>
            </div>
            <span className="text-xs text-muted-foreground font-normal truncate leading-tight ml-auto text-right">
              Trung bình: {homeworkAvg}
            </span>
          </div>
          <span className="text-xs text-muted-foreground font-normal truncate">BTVN</span>
        </div>

        {/* 3. Điểm kiểm tra (Ẩn khi tháng không có điểm/bài kiểm tra; luôn hiện ở mode edit môn toán) */}
        {shouldShowTestCard && (
          <div
            className={cn(
              'rounded-lg px-2.5 py-1.5 border border-border/60 bg-muted/25 dark:bg-muted/10 flex flex-col justify-between gap-0.5 min-w-0 text-left select-none shadow-3xs transition-all',
              isEditing && isMath && 'border-violet-300/80 dark:border-violet-700/80 bg-violet-50/40 dark:bg-violet-950/20'
            )}
            title="Điểm kiểm tra"
          >
          {isMath ? (
            // MÔN TOÁN:
            // 1. Chỉ nhập điểm kiểm tra hiện tại (không cần nhập điểm trước đó)
            // 2. Tải tài liệu là upload tài liệu lên
            // 3. Sau khi có tài liệu, hiển thị "Nhận xét" để xem link tài liệu
            <>
              <div className="flex items-center justify-between gap-1 min-w-0">
                <div className="flex items-center gap-1.5 min-w-0">
                  <Award className="h-3.5 w-3.5 text-violet-600 dark:text-violet-400 shrink-0" />
                  {isEditing ? (
                    <input
                      type="text"
                      inputMode="decimal"
                      value={testScore !== null && testScore !== undefined ? String(testScore) : '00'}
                      onChange={(e) => {
                        onChangeTestScore?.(e.target.value)
                      }}
                      onBlur={() => {
                        if (!testScore || String(testScore).trim() === '') {
                          onChangeTestScore?.('00')
                        }
                      }}
                      placeholder="00"
                      className="w-12 h-6 text-xs sm:text-sm font-semibold text-center rounded border border-violet-300 dark:border-violet-700 bg-background text-violet-700 dark:text-violet-300 focus:outline-none focus:ring-1 focus:ring-violet-500 shadow-3xs"
                      title="Nhập điểm kiểm tra hiện tại"
                    />
                  ) : (
                    <span className="text-xs sm:text-sm font-semibold text-violet-700 dark:text-violet-400 leading-none">
                      {formatScoreDisplay(testScore)}
                    </span>
                  )}
                </div>
                <span className="text-xs text-muted-foreground font-normal truncate leading-tight ml-auto text-right">
                  Trước: {formatScoreDisplay(priorTestScore)}
                </span>
              </div>

              <div className="flex items-center justify-between gap-1 min-w-0">
                <span className="text-xs text-muted-foreground font-normal truncate shrink-0">
                  Điểm kiểm tra
                </span>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,.png,.jpg,.jpeg,.doc,.docx"
                  className="hidden"
                  onChange={handleFileChange}
                />

                {hasDocument ? (
                  // ĐÃ CÓ TÀI LIỆU -> HIỂN THỊ "Nhận xét" ĐỂ XEM LINK TÀI LIỆU
                  <div className="flex items-center gap-1 ml-auto shrink-0">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleOpenTestDoc()
                      }}
                      className="inline-flex items-center gap-0.5 text-xs text-sky-600 dark:text-sky-400 hover:underline cursor-pointer transition-colors font-normal"
                      title={`Xem link tài liệu bài kiểm tra (${testDocName || 'Tài liệu'})`}
                    >
                      <span>Nhận xét</span>
                      <ExternalLink className="h-3 w-3" />
                    </button>
                    {isEditing && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation()
                          fileInputRef.current?.click()
                        }}
                        className="inline-flex items-center p-0.5 text-muted-foreground hover:text-violet-600 dark:hover:text-violet-400 cursor-pointer rounded hover:bg-violet-100/50 dark:hover:bg-violet-900/30 transition-colors"
                        title={testDocName ? `Tệp: ${testDocName}. Nhấp để tải lên tệp khác` : 'Tải lên tệp tài liệu khác'}
                      >
                        <Upload className="h-3 w-3" />
                      </button>
                    )}
                  </div>
                ) : (
                  // CHƯA CÓ TÀI LIỆU -> HIỂN THỊ "Tải tài liệu" ĐỂ UPLOAD
                  isEditing ? (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation()
                        fileInputRef.current?.click()
                      }}
                      className="inline-flex items-center gap-1 text-xs text-violet-700 dark:text-violet-400 hover:underline cursor-pointer transition-colors font-medium ml-auto shrink-0"
                      title="Tải tài liệu bài kiểm tra lên (Upload)"
                    >
                      <Upload className="h-3 w-3 text-violet-600 dark:text-violet-400" />
                      <span>Tải tài liệu</span>
                    </button>
                  ) : (
                    <span className="text-[11px] text-muted-foreground ml-auto shrink-0 font-normal">
                      Chưa có tài liệu
                    </span>
                  )
                )}
              </div>
            </>
          ) : (
            // MÔN TIẾNG ANH (hoặc các môn khác)
            <>
              <div className="flex items-center justify-between gap-1 min-w-0">
                <div className="flex items-center gap-1.5 min-w-0">
                  <Award className="h-3.5 w-3.5 text-violet-600 dark:text-violet-400 shrink-0" />
                  <span className="text-xs sm:text-sm font-normal text-violet-700 dark:text-violet-400 leading-none">
                    {formatScoreDisplay(testScore)}
                  </span>
                </div>
                <span className="text-xs text-muted-foreground font-normal truncate leading-tight ml-auto text-right">
                  Trước: {formatScoreDisplay(priorTestScore)}
                </span>
              </div>
              <div className="flex items-center justify-between gap-1 min-w-0">
                <span className="text-xs text-muted-foreground font-normal truncate">
                  Điểm kiểm tra
                </span>
                {showEvaluationLink && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleTestRemarkClick()
                    }}
                    className="inline-flex items-center gap-0.5 text-xs text-sky-600 dark:text-sky-400 hover:underline cursor-pointer transition-colors ml-auto shrink-0 font-normal"
                    title="Mở nhận xét bài kiểm tra gần nhất trong tab mới"
                  >
                    <span>Nhận xét</span>
                    <ExternalLink className="h-3 w-3" />
                  </button>
                )}
              </div>
            </>
          )}
        </div>
        )}
      </div>
    </div>
  )
}
