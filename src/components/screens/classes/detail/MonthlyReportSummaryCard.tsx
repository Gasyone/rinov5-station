import React from 'react'
import { Copy, Check, RotateCcw, ExternalLink, Download } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { RosterStudent } from './classesDetailTypes'

interface MonthlyReportSummaryCardProps {
  selectedStudent: RosterStudent
  monthTitle: string
  awardBadge?: string
  summaryPreview: string
  onCopySummary: () => void
  isEditing: boolean
  onSaveReport: () => void
  onCancelEdit?: () => void
  onResetForm?: () => void
  onOpenLandingPage?: () => void
  onDownloadImage?: () => void
}

export function MonthlyReportSummaryCard({
  selectedStudent,
  monthTitle,
  awardBadge,
  summaryPreview,
  onCopySummary,
  isEditing,
  onSaveReport,
  onCancelEdit,
  onResetForm,
  onOpenLandingPage,
  onDownloadImage,
}: MonthlyReportSummaryCardProps) {
  return (
    <div className="rounded-xl border border-border/80 bg-card p-2.5 space-y-2 shadow-2xs">
      {/* Header bar with custom blue copy button */}
      <div className="flex items-center justify-between gap-2">
        <span className="text-xs font-medium text-muted-foreground">
          Tóm tắt báo cáo
        </span>
        <Button
          type="button"
          size="sm"
          variant="ghost"
          onClick={onCopySummary}
          className="h-6 text-xs font-normal gap-1 px-1.5 text-muted-foreground hover:text-foreground cursor-pointer transition-colors"
          title="Sao chép toàn bộ tóm tắt báo cáo để gửi nhanh phụ huynh"
        >
          <Copy className="h-3 w-3" />
          <span>Sao chép</span>
        </Button>
      </div>

      {/* Summary preview block */}
      <div className="rounded-lg bg-muted/30 p-2 text-xs text-foreground/90 space-y-1 font-sans leading-relaxed border border-border/40">
        <div className="font-medium text-foreground flex items-center justify-between text-xs">
          <span>
            {selectedStudent.name} ({selectedStudent.code || 'HV'})
          </span>
          <span className="text-muted-foreground text-xs font-normal">{monthTitle}</span>
        </div>
        {awardBadge && (
          <div className="text-xs font-medium text-amber-800 dark:text-amber-300 flex items-center gap-1">
            <span>🏆 Danh hiệu:</span>
            <span>{awardBadge}</span>
          </div>
        )}
        <div className="text-xs text-muted-foreground line-clamp-3 leading-relaxed">
          {summaryPreview || 'Chưa có nội dung nhận xét chi tiết.'}
        </div>
      </div>

      {/* Nhóm button hành động gộp vào trong tóm tắt báo cáo */}
      {isEditing ? (
        <div className="pt-1.5 border-t border-border/60 flex items-center justify-between gap-1.5">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onResetForm}
            className="text-xs text-muted-foreground hover:text-foreground h-7 px-2 gap-1 rounded-md cursor-pointer shrink-0 font-normal"
            title="Xóa trắng toàn bộ nội dung để tự điền báo cáo mới từ đầu"
          >
            <RotateCcw className="h-3 w-3" />
            <span>Xóa trắng</span>
          </Button>

          <div className="flex items-center gap-1.5 shrink-0">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onCancelEdit}
              className="text-xs font-normal h-7 px-2.5 rounded-md cursor-pointer"
            >
              Hủy
            </Button>
            <Button
              type="button"
              size="sm"
              onClick={onSaveReport}
              className="text-xs font-medium h-7 px-3 bg-primary hover:bg-primary/90 text-primary-foreground rounded-md shadow-xs cursor-pointer transition-all active:scale-95 gap-1"
            >
              <Check className="h-3.5 w-3.5" />
              <span>Lưu thay đổi</span>
            </Button>
          </div>
        </div>
      ) : (
        <div className="pt-1.5 border-t border-border/60 space-y-1.5">
          <div className="grid grid-cols-2 gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onOpenLandingPage}
              className="text-xs font-normal h-7.5 px-2 rounded-md border-border text-foreground hover:bg-muted cursor-pointer gap-1.5 shadow-3xs justify-center"
              title="Mở toàn màn hình dạng Landing Page trên tab mới"
            >
              <ExternalLink className="h-3 w-3 shrink-0 text-muted-foreground" />
              <span className="truncate">Landing Page</span>
            </Button>

            <Button
              type="button"
              size="sm"
              onClick={onDownloadImage}
              className="text-xs font-medium h-7.5 px-2 rounded-md bg-primary hover:bg-primary/90 text-primary-foreground cursor-pointer gap-1.5 justify-center shadow-3xs"
              title="Xem trước và tải ảnh infographic báo cáo tháng học viên dạng poster"
            >
              <Download className="h-3 w-3 shrink-0" />
              <span className="truncate">Lưu ảnh</span>
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
