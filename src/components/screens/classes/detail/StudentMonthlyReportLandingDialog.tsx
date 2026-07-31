'use client'

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Star, Copy, BookOpen, Target, ExternalLink, FileText, Heart } from 'lucide-react'
import { toast } from 'sonner'
import { HeaderBrand } from '@/components/layout/HeaderBrand'
import type { RosterStudent } from './classesDetailTypes'
import { WeekReviewItem, DEFAULT_SECTION_B2_WEEKS, FIXED_PARENT_NOTICE } from './monthlyReportHelpers'

interface StudentMonthlyReportLandingDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  student?: RosterStudent
  monthTitle?: string
  dateStr?: string
  awardBadge?: string
  teacherName?: string
  sectionAContent?: string
  sectionA1Content?: string
  sectionA2Content?: string
  sectionBContent?: string
  sectionB1Content?: string
  sectionB2Content?: string
  sectionB2Weeks?: WeekReviewItem[]
}

function renderHighlightedParagraphs(text: string) {
  if (!text) return null
  const paragraphs = text.split('\n\n').filter(Boolean)

  return (
    <div className="space-y-3">
      {paragraphs.map((p, idx) => {
        const colonIndex = p.indexOf(':')
        if (colonIndex > 0 && colonIndex < 35) {
          const title = p.substring(0, colonIndex + 1)
          const body = p.substring(colonIndex + 1)
          return (
            <p key={idx} className="text-xs md:text-sm text-foreground/90 leading-relaxed font-sans">
              <strong className="text-primary font-extrabold me-1.5">{title}</strong>
              {body}
            </p>
          )
        }
        return (
          <p key={idx} className="text-xs md:text-sm text-foreground/90 leading-relaxed font-sans">
            {p}
          </p>
        )
      })}
    </div>
  )
}

export function StudentMonthlyReportLandingDialog({
  open,
  onOpenChange,
  student,
  monthTitle = 'BÁO CÁO HỌC TẬP CHUYÊN SÂU THÁNG 4 VÀ KẾ HOẠCH HỌC TẬP THÁNG 5',
  dateStr = '01/04/2026 đến 30/04/2026',
  awardBadge = 'CHIẾN BINH BỨT PHÁ',
  teacherName = 'Ms.Chloe',
  sectionAContent,
  sectionA1Content,
  sectionA2Content,
  sectionB1Content,
  sectionB2Weeks = DEFAULT_SECTION_B2_WEEKS,
}: StudentMonthlyReportLandingDialogProps) {
  const studentName = student?.name || 'Phạm Bình Nguyên (Lemon)'
  const initials = studentName
    .trim()
    .split(' ')
    .map((p) => p[0])
    .slice(-2)
    .join('')
    .toUpperCase()

  const handleCopyLink = () => {
    const fakeUrl = `https://rinoedu.vn/reports/monthly/${student?.id || 'demo'}?period=2026-04`
    navigator.clipboard.writeText(fakeUrl)
    toast.success('Đã sao chép đường dẫn Landing Page gửi phụ huynh!')
  }

  const activeWeeks = sectionB2Weeks && sectionB2Weeks.length > 0 ? sectionB2Weeks : DEFAULT_SECTION_B2_WEEKS

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[95vw] xl:max-w-[880px] max-h-[92vh] flex flex-col p-0 gap-0 overflow-hidden rounded-3xl border bg-background shadow-2xl">
        {/* Accessibility Dialog Header Title */}
        <DialogHeader className="sr-only">
          <DialogTitle>Báo cáo học tập chuyên sâu dành cho Phụ huynh</DialogTitle>
        </DialogHeader>

        {/* Top Control Bar */}
        <div className="px-6 py-2.5 bg-muted/40 border-b flex items-center justify-between shrink-0 flex-wrap gap-2">
          <div className="flex items-center gap-2.5">
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-bold text-foreground">Xem Trước Landing Page Phụ Huynh</span>
          </div>

          <div className="flex items-center gap-2 me-8">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleCopyLink}
              className="h-7 text-xs font-bold gap-1.5 rounded-lg border-border"
            >
              <Copy className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Sao chép Link Gửi Phụ Huynh</span>
            </Button>
          </div>
        </div>

        {/* MAIN LANDING PAGE CONTENT (V2 MODERN DESIGN ONLY) */}
        <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6 custom-scrollbar bg-background">
          {/* Header Brand + 5 sao nằm dưới tên Rinoedu */}
          <div className="flex flex-col sm:flex-row items-center justify-between pb-4 border-b gap-4">
            <div>
              <HeaderBrand />
              <div className="flex items-center gap-1 text-amber-500 mt-1.5 ms-1">
                <Star className="h-3.5 w-3.5 fill-amber-400" />
                <Star className="h-3.5 w-3.5 fill-amber-400" />
                <Star className="h-3.5 w-3.5 fill-amber-400" />
                <Star className="h-3.5 w-3.5 fill-amber-400" />
                <Star className="h-3.5 w-3.5 fill-amber-400" />
              </div>
            </div>

            <div className="flex items-center gap-3 bg-muted/30 px-3.5 py-1.5 rounded-xl border border-border/60">
              <div className="h-9 w-9 rounded-full bg-gradient-to-tr from-amber-400 to-primary p-0.5 shadow-2xs">
                <div className="h-full w-full rounded-full bg-background flex items-center justify-center font-black text-primary text-xs">
                  {initials}
                </div>
              </div>
              <div>
                <div className="text-xs font-extrabold text-foreground">{studentName}</div>
                <div className="text-[10px] font-mono text-muted-foreground">{student?.code || 'HV-S18-8'} • Kỳ Tháng 4/2026</div>
              </div>
            </div>
          </div>

          {/* Hero Profile Showcase Card */}
          <div className="p-6 md:p-8 rounded-3xl bg-amber-500/5 border border-amber-400/20 space-y-4 relative overflow-hidden">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-4 text-center md:text-left">
                <div className="h-16 w-16 rounded-full bg-gradient-to-tr from-amber-400 via-amber-500 to-primary p-1 shadow-md shrink-0">
                  <div className="h-full w-full rounded-full bg-background flex items-center justify-center font-black text-primary text-xl border-2 border-background">
                    {initials}
                  </div>
                </div>
                <div>
                  <h2 className="text-lg font-black text-foreground tracking-tight">{studentName}</h2>
                  <p className="text-xs text-muted-foreground font-semibold mt-0.5">
                    Báo cáo Học tập Chuyên sâu Tháng 4 & Kế hoạch Tháng 5 ({dateStr})
                  </p>
                </div>
              </div>

              {/* Award Badge Pill */}
              <div className="shrink-0 text-center">
                <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1">Danh hiệu tuyên dương:</div>
                <div className="px-5 py-2 bg-amber-400 text-amber-950 font-black text-sm md:text-base rounded-full shadow-2xs uppercase tracking-wide">
                  🏆 {awardBadge}
                </div>
              </div>
            </div>

            {/* Teacher Quote Text */}
            <div className="text-xs text-muted-foreground leading-relaxed italic pt-1">
              "Rino Edu xin chúc mừng con <strong className="text-primary font-bold not-italic">{studentName}</strong> đã hoàn thành xuất sắc kỳ học vừa qua! Dưới đây là phần đánh giá năng lực chi tiết và định hướng bứt phá từ giáo viên phụ trách <strong className="text-primary font-bold not-italic">{teacherName}</strong>."
            </div>
          </div>

          {/* Section A Card */}
          <div className="p-6 rounded-3xl bg-background border border-border/80 shadow-2xs space-y-4">
            <div className="flex items-center gap-2.5 border-b pb-3">
              <div className="h-8 w-8 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center font-bold text-xs">
                <BookOpen className="h-4 w-4" />
              </div>
              <div>
                <h3 className="text-sm font-extrabold text-foreground uppercase tracking-wide">
                  A - BÁO CÁO HỌC TẬP CHUYÊN SÂU THÁNG 4
                </h3>
                <p className="text-[11px] text-muted-foreground font-medium">Tổng hợp đánh giá năng lực, điểm nổi bật & kết quả học tập</p>
              </div>
            </div>

            <div className="space-y-4 pt-1">
              {sectionA1Content || sectionA2Content ? (
                <>
                  {sectionA1Content && (
                    <div className="space-y-1.5 p-4 rounded-2xl bg-blue-500/5 border border-blue-400/30">
                      <h4 className="text-xs font-bold text-blue-700 dark:text-blue-400 uppercase tracking-wide flex items-center gap-2">
                        <span className="h-2 w-2 rounded-full bg-blue-500" />
                        1. Nhận xét chung
                      </h4>
                      <div className="pt-1">
                        {renderHighlightedParagraphs(sectionA1Content)}
                      </div>
                    </div>
                  )}

                  {sectionA2Content && (
                    <div className="space-y-1.5 p-4 rounded-2xl bg-emerald-500/5 border border-emerald-400/30">
                      <h4 className="text-xs font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wide flex items-center gap-2">
                        <span className="h-2 w-2 rounded-full bg-emerald-500" />
                        2. Nhận xét về kết quả học tập
                      </h4>
                      <div className="pt-1">
                        {renderHighlightedParagraphs(sectionA2Content)}
                      </div>
                    </div>
                  )}
                </>
              ) : (
                renderHighlightedParagraphs(sectionAContent || '')
              )}
            </div>
          </div>

          {/* Section B Card */}
          <div className="p-6 rounded-3xl bg-background border border-border/80 shadow-2xs space-y-4">
            <div className="flex items-center gap-2.5 border-b pb-3">
              <div className="h-8 w-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold text-xs">
                <Target className="h-4 w-4" />
              </div>
              <div>
                <h3 className="text-sm font-extrabold text-foreground uppercase tracking-wide">
                  B - KẾ HOẠCH HỌC TẬP CẢI THIỆN THÁNG 5
                </h3>
                <p className="text-[11px] text-muted-foreground font-medium">Lộ trình rèn luyện trên lớp, bài tập & thói quen học tại nhà</p>
              </div>
            </div>

            <div className="space-y-4 pt-1">
              {sectionB1Content && (
                <div className="space-y-1.5 p-4 rounded-2xl bg-muted/20 border border-border/60">
                  <h4 className="text-xs font-bold text-primary uppercase tracking-wide flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-primary" />
                    1. Nội dung bài học tháng tới
                  </h4>
                  <div className="whitespace-pre-wrap text-xs md:text-sm text-foreground/90 leading-relaxed font-sans pt-1">
                    {sectionB1Content}
                  </div>
                </div>
              )}

              {/* Sub-section 2: Nội dung ôn tập riêng 4 tuần */}
              <div className="space-y-3 p-4 rounded-2xl bg-amber-500/5 border border-amber-400/30">
                <h4 className="text-xs font-bold text-amber-700 dark:text-amber-400 uppercase tracking-wide flex items-center gap-2 border-b border-amber-400/20 pb-2">
                  <span className="h-2 w-2 rounded-full bg-amber-500" />
                  2. Nội dung ôn tập riêng (4 tuần)
                </h4>

                <div className="grid grid-cols-1 gap-3.5 pt-1">
                  {activeWeeks.map((week) => (
                    <div key={week.weekNum} className="p-3.5 rounded-2xl bg-background border border-amber-400/20 flex flex-col sm:flex-row items-start gap-4 shadow-2xs">
                      {/* Thumbnail image displayed BEFORE content description */}
                      <div className="relative h-20 w-32 rounded-xl overflow-hidden border border-amber-400/30 shadow-2xs shrink-0 group bg-muted/30">
                        {week.thumbnailUrl ? (
                          <img src={week.thumbnailUrl} alt={`Tranh Tuần ${week.weekNum}`} className="h-full w-full object-cover" />
                        ) : (
                          <div className="h-full w-full flex flex-col items-center justify-center text-amber-600">
                            <FileText className="h-6 w-6" />
                            <span className="text-[10px] font-bold mt-1">Tranh / Bài tập</span>
                          </div>
                        )}
                        {week.docLink && (
                          <a
                            href={week.docLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white font-bold text-xs gap-1"
                          >
                            <ExternalLink className="h-4 w-4" />
                            <span>Xem Tranh</span>
                          </a>
                        )}
                      </div>

                      {/* Description Text */}
                      <div className="space-y-1.5 min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-xs font-black text-amber-800 dark:text-amber-300 uppercase tracking-wide">
                            Tuần {week.weekNum}:
                          </span>
                          {week.docLink && (
                            <a
                              href={week.docLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-[11px] text-primary hover:underline font-bold inline-flex items-center gap-1 bg-primary/10 px-2 py-0.5 rounded-md border border-primary/20"
                            >
                              <span>Link Tranh Ảnh</span>
                              <ExternalLink className="h-3 w-3" />
                            </a>
                          )}
                        </div>
                        <p className="text-xs md:text-sm text-foreground/90 leading-relaxed font-sans">
                          {week.content}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Fixed Parent Notice Box */}
                <div className="mt-3 p-3.5 rounded-xl bg-amber-400/10 border border-amber-400/30 text-xs text-foreground/90 leading-relaxed font-sans space-y-1">
                  <div className="font-extrabold text-amber-800 dark:text-amber-300 flex items-center gap-1.5">
                    <span>📌 THÔNG BÁO TỪ GIÁO VIÊN:</span>
                  </div>
                  <div className="whitespace-pre-wrap italic pt-0.5">
                    {FIXED_PARENT_NOTICE}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer Hotline Note */}
          <div className="p-4 rounded-2xl bg-muted/30 border text-center space-y-1.5">
            <p className="text-xs text-foreground font-semibold flex items-center justify-center gap-1.5">
              <Heart className="h-3.5 w-3.5 text-red-500 fill-red-500" />
              <span>Cảm ơn Quý phụ huynh đã luôn đồng hành cùng RinoEdu trong hành trình phát triển tri thức của con!</span>
            </p>
            <p className="text-xs text-foreground font-semibold">
              Mọi thắc mắc hoặc cần hỗ trợ tư vấn học tập, Quý phụ huynh vui lòng liên hệ Hotline: <strong className="text-primary font-mono text-sm font-extrabold">1900 6868</strong>.
            </p>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-2.5 border-t bg-muted/20 flex items-center justify-end shrink-0">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => onOpenChange(false)}
            className="text-xs font-semibold px-6 rounded-lg me-6"
          >
            Đóng Xem Xem Trước
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
