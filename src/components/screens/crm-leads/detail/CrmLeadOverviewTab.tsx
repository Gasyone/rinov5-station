'use client'

import { RotateCcw } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { Lead } from '@/mocks/crmLeads'

interface CrmLeadOverviewTabProps {
  lead: Lead
  activeCycleId?: string
  onCycleChange?: (cycleId: string) => void
  onOpenDetailModal?: () => void
}

export function CrmLeadOverviewTab({
  lead,
}: CrmLeadOverviewTabProps) {
  return (
    <div className="space-y-2.5 text-xs text-left select-none">
      {/* BANNER THÔNG TIN LEAD QUAY LẠI */}
      {lead.isReturningLead && (
        <div className="p-3 rounded-xl bg-amber-50/80 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 text-xs flex items-start gap-2.5 shadow-2xs">
          <RotateCcw className="h-4 w-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
          <div className="space-y-1 flex-1">
            <div className="font-semibold text-amber-900 dark:text-amber-300 flex items-center gap-2 flex-wrap">
              <span>Hồ sơ Lead quay lại (Chu kỳ {lead.salesCycles?.length || 2})</span>
              {lead.returningReason && (
                <span className="text-[11px] font-medium text-amber-700 dark:text-amber-400">
                  • {lead.returningReason}
                </span>
              )}
            </div>
            <p className="text-[11px] text-amber-800/90 dark:text-amber-400/90 leading-relaxed">
              Học viên đã có lịch sử khảo sát &amp; đánh giá ở chu kỳ trước. Vui lòng kiểm tra tab <strong>Test &amp; Thử</strong> để xem lại kết quả bài test cũ và tab <strong>Vận hành / Đơn hàng</strong> để nắm trọn vẹn thông tin.
            </p>
          </div>
        </div>
      )}

      {/* 1. HÀNG 1: CHÂN DUNG HỌC VIÊN & CHÂN DUNG PHỤ HUYNH (CHIA 2 CỘT) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
        {/* Cột 1: Chân dung Học viên (Learner Profile) */}
        <div className="border border-border/80 rounded-xl p-2.5 lg:p-3 bg-card flex flex-col justify-between">
          <div>
            <div className="pb-2 mb-2.5 border-b border-border/50 flex items-center justify-between">
              <h4 className="font-bold text-xs text-foreground tracking-tight">Chân dung Học viên (Learner Profile)</h4>
              <span className="text-[10.5px] font-semibold text-primary">
                {lead.studentEnglishName ? `English: ${lead.studentEnglishName}` : `${lead.studentAge} tuổi`}
              </span>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between gap-2">
                <span className="text-muted-foreground shrink-0">Học viên &amp; Trường lớp:</span>
                <span className="font-semibold text-foreground text-right truncate">
                  {lead.studentName} • {lead.schoolName || 'Tiểu học Thực Nghiệm'} ({lead.studentCurrentGrade || 'Lớp 3'})
                </span>
              </div>

              <div className="flex items-center justify-between gap-2">
                <span className="text-muted-foreground shrink-0">Khóa học quan tâm:</span>
                <span className="font-semibold text-foreground text-right truncate">
                  {lead.targetSubject}
                </span>
              </div>

              <div className="flex items-center justify-between gap-2">
                <span className="text-muted-foreground shrink-0">Học lực &amp; Trình độ ban đầu:</span>
                <span className="font-semibold text-foreground text-right truncate">
                  {lead.academicAbility || 'Khá'} • {lead.initialLevel || 'Đang tư vấn'}
                </span>
              </div>

              <div className="flex items-center justify-between gap-2">
                <span className="text-muted-foreground shrink-0">Tính cách &amp; Sở thích:</span>
                <span className="font-medium text-foreground text-right truncate" title={`${lead.studentPersonality || 'Ngoan, thích khen'} • ${lead.studentInterests || 'Lego, vẽ tranh'}`}>
                  {lead.studentPersonality || 'Ngoan ngoãn, thích khen'} • {lead.studentInterests || 'Lego, vẽ tranh'}
                </span>
              </div>

              <div className="flex items-center justify-between gap-2">
                <span className="text-muted-foreground shrink-0">Điểm mạnh / Hạn chế:</span>
                <span className="font-medium text-foreground text-right truncate" title={lead.studentStrengths ? `${lead.studentStrengths} | Cần cải thiện: ${lead.studentWeaknesses || 'Ngại nói câu dài'}` : 'Tiếp thu nhanh'}>
                  {lead.studentStrengths || 'Tiếp thu nhanh, phát âm chuẩn'}
                </span>
              </div>

              <div className="flex items-center justify-between gap-2">
                <span className="text-muted-foreground shrink-0">Mục tiêu của con:</span>
                <span className="font-semibold text-emerald-700 dark:text-emerald-400 text-right truncate" title={lead.studentLearningGoal || 'Tự tin thuyết trình, thi Cambridge'}>
                  {lead.studentLearningGoal || 'Tự tin giao tiếp, thi Cambridge'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Cột 2: Chân dung Phụ huynh & Chăm sóc (Buyer Persona) */}
        <div className="border border-border/80 rounded-xl p-2.5 lg:p-3 bg-card flex flex-col justify-between">
          <div>
            <div className="pb-2 mb-2.5 border-b border-border/50 flex items-center justify-between">
              <h4 className="font-bold text-xs text-foreground tracking-tight">Chân dung Phụ huynh (Buyer Persona)</h4>
              <span className="text-[10.5px] font-semibold text-sky-600 dark:text-sky-400">
                {lead.decisionMakerRole || 'Mẹ quyết định'}
              </span>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between gap-2">
                <span className="text-muted-foreground shrink-0">Người đại diện &amp; Nghề nghiệp:</span>
                <span className="font-semibold text-foreground text-right truncate">
                  {lead.parentName} ({lead.parentRole || 'Mẹ'}) • {lead.parentOccupation || 'Kế toán trưởng - FPT'}
                </span>
              </div>

              <div className="flex items-center justify-between gap-2">
                <span className="text-muted-foreground shrink-0">Tài chính &amp; Ngân sách học phí:</span>
                <span className="font-semibold text-foreground text-right truncate">
                  {lead.financialSegment || 'Khá giả'} ({lead.budgetPerMonth || '3 - 5tr/tháng'})
                </span>
              </div>

              <div className="flex items-center justify-between gap-2">
                <span className="text-muted-foreground shrink-0">Kênh &amp; Giờ vàng liên hệ:</span>
                <span className="font-semibold text-primary text-right truncate">
                  {lead.preferredContactMethod || 'Ưu tiên Zalo'} • {lead.bestTimeToCall || 'Sau 18h30'}
                </span>
              </div>

              <div className="flex items-center justify-between gap-2">
                <span className="text-muted-foreground shrink-0">Kỳ vọng số 1 với Rino:</span>
                <span className="font-medium text-foreground text-right truncate" title={lead.parentExpectation || 'Con tự tin phản xạ giao tiếp tự nhiên, phát âm chuẩn'}>
                  {lead.parentExpectation || 'Con tự tin phản xạ, phát âm chuẩn'}
                </span>
              </div>

              <div className="flex items-center justify-between gap-2">
                <span className="text-muted-foreground shrink-0">Rào cản / Nỗi lo lớn nhất:</span>
                <span className="font-medium text-amber-700 dark:text-amber-400 text-right truncate" title={lead.parentPainPoint || 'Lớp cũ đông con bị nhút nhát và sợ nói'}>
                  {lead.parentPainPoint || 'Lớp cũ đông con bị nhút nhát và sợ nói'}
                </span>
              </div>

              <div className="flex items-center justify-between gap-2">
                <span className="text-muted-foreground shrink-0">Tâm lý &amp; Lưu ý tư vấn:</span>
                <span className="font-medium text-muted-foreground text-right truncate" title={lead.parentPersonalityNote || 'Kỹ tính, thích số liệu minh bạch và hình ảnh lớp'}>
                  {lead.parentPersonalityNote || 'Kỹ tính, thích số liệu & hình ảnh lớp'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. HÀNG 2: ĐÁNH GIÁ & HỌC THỬ VÀ ĐƠN HÀNG & GIAO DỊCH (CHIA 2 CỘT) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
        {/* Cột 1: Đánh giá & Học thử */}
        <div className="border border-border/80 rounded-xl p-2.5 lg:p-3 bg-card flex flex-col justify-between">
          <div>
            <div className="pb-2 mb-2.5 border-b border-border/50">
              <h4 className="font-bold text-xs text-foreground tracking-tight">Đánh giá & Học thử</h4>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between gap-2">
                <span className="text-muted-foreground shrink-0">Lịch test đầu vào:</span>
                <div className="flex items-center gap-1.5 justify-end truncate">
                  <span className="font-semibold text-foreground truncate">
                    {lead.testDate ? `${lead.testDate} ${lead.testTime ? `(${lead.testTime})` : ''}` : 'Chưa có lịch'}
                  </span>
                  {lead.testStatus && (
                    <span className="text-[10px] px-1.5 py-0.2 rounded bg-muted text-muted-foreground border border-border shrink-0 font-medium">
                      {lead.testStatus === 'completed' ? 'Đã test' : lead.testStatus === 'scheduled' ? 'Đã hẹn' : 'Vắng test'}
                    </span>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between gap-2">
                <span className="text-muted-foreground shrink-0">Kết quả đánh giá:</span>
                <span className="font-semibold text-foreground text-right truncate">
                  {lead.testScore ? `${lead.testScore} • ${lead.testResultLevel || 'Đạt chuẩn'}` : (lead.initialLevel || 'Đang chờ đánh giá')}
                </span>
              </div>

              <div className="flex items-center justify-between gap-2">
                <span className="text-muted-foreground shrink-0">Lớp học thử:</span>
                <div className="flex items-center gap-1.5 justify-end truncate">
                  <span className="font-semibold text-foreground truncate">
                    {lead.trialClassName || 'Chưa đăng ký'}
                  </span>
                  {lead.trialStatus && (
                    <span className="text-[10px] px-1.5 py-0.2 rounded bg-muted text-muted-foreground border border-border shrink-0 font-medium">
                      {lead.trialStatus === 'completed' ? 'Đã học thử' : lead.trialStatus === 'scheduled' ? 'Chờ học' : 'Chưa học'}
                    </span>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between gap-2">
                <span className="text-muted-foreground shrink-0">Giáo viên test/dự thính:</span>
                <span className="font-semibold text-foreground text-right truncate">
                  {lead.testerTeacherName || '--'}
                </span>
              </div>

              {lead.previousTest && (
                <div className="flex items-center justify-between gap-2 pt-1.5 border-t border-border/50 text-[11px]">
                  <span className="text-amber-700 dark:text-amber-400 font-medium shrink-0 flex items-center gap-1">
                    <RotateCcw className="h-3 w-3" />
                    <span>Test kỳ trước:</span>
                  </span>
                  <span className="font-semibold text-foreground text-right truncate" title={`${lead.previousTest.date} • ${lead.previousTest.resultLevel} (${lead.previousTest.score})`}>
                    {lead.previousTest.date}: {lead.previousTest.score} ({lead.previousTest.resultLevel})
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Cột 2: Đơn hàng & Giao dịch */}
        <div className="border border-border/80 rounded-xl p-2.5 lg:p-3 bg-card flex flex-col justify-between">
          <div>
            <div className="pb-2 mb-2.5 border-b border-border/50">
              <h4 className="font-bold text-xs text-foreground tracking-tight">Đơn hàng & Giao dịch</h4>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between gap-2">
                <span className="text-muted-foreground shrink-0">Số đơn đã mua:</span>
                <strong className="text-foreground font-bold">{lead.ordersCount ?? 0} đơn</strong>
              </div>

              <div className="flex items-center justify-between gap-2">
                <span className="text-muted-foreground shrink-0">Tổng giá trị chi tiêu:</span>
                <strong className="text-emerald-700 dark:text-emerald-400 font-bold">
                  {lead.totalSpend || '0đ'}
                </strong>
              </div>

              <div className="flex items-center justify-between gap-2">
                <span className="text-muted-foreground shrink-0">Đơn hàng gần nhất:</span>
                {lead.orderCode ? (
                  <div className="flex items-center gap-1.5 justify-end truncate">
                    <span className="font-mono font-bold text-foreground">{lead.orderCode}</span>
                    <span className="font-mono font-bold text-emerald-700 dark:text-emerald-400">
                      ({lead.expectedAmount || '15.800.000đ'})
                    </span>
                  </div>
                ) : (
                  <span className="text-muted-foreground italic">Chưa có đơn</span>
                )}
              </div>

              <div className="flex items-center justify-between gap-2">
                <span className="text-muted-foreground shrink-0">Trạng thái thanh toán:</span>
                {lead.orderCode ? (
                  <span
                    className={cn(
                      'text-[10px] px-1.5 py-0.5 rounded border font-semibold',
                      lead.orderStatus === 'paid'
                        ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-200/60'
                        : lead.orderStatus === 'partial'
                          ? 'bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 border-amber-200/60'
                          : 'bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 border-zinc-200'
                    )}
                  >
                    {lead.orderStatus === 'paid'
                      ? 'Đã thu 100%'
                      : lead.orderStatus === 'partial'
                        ? lead.paymentTerm || 'Đã cọc'
                        : 'Chờ thanh toán'}
                  </span>
                ) : (
                  <span className="text-muted-foreground">--</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
