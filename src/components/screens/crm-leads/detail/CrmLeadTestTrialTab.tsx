'use client'

import React, { useMemo } from 'react'
import {
  Calendar,
  Clock,
  User,
  Award,
  Check,
  ExternalLink,
  Users,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Lead } from '@/mocks/crmLeads'
import { getMockClassSessions, ClassSession } from '@/mocks/calendarSchedule'
import { cn } from '@/lib/utils'

interface CrmLeadTestTrialTabProps {
  lead: Lead
  activeCycleId?: string
  onOpenBookingTest?: () => void
  onOpenTrialClass?: () => void
  onSelectTrialSession?: (session: ClassSession) => void
}

/**
 * Lọc gợi ý thông minh các buổi học phù hợp từ Lịch lớp học (calendar_class_schedule)
 */
function getRecommendedTrialSessions(lead: Lead, limit = 4): ClassSession[] {
  const allSessions = getMockClassSessions()

  // 1. Không lấy ca đã hủy
  let list = allSessions.filter((s) => s.status !== 'cancelled')

  // 2. Ưu tiên các buổi sắp tới hoặc hôm nay
  const upcoming = list.filter((s) => s.dateBucket === 'upcoming' || s.dateBucket === 'today')
  if (upcoming.length >= limit) {
    list = upcoming
  }

  // 3. Khớp cơ sở của học viên nếu có
  if (lead.branch) {
    const branchMatched = list.filter((s) => s.branch === lead.branch)
    if (branchMatched.length >= 2) {
      list = branchMatched
    }
  }

  // 4. Khớp môn học quan tâm nếu có
  if (lead.targetSubject) {
    const subjLower = lead.targetSubject.toLowerCase()
    const subjectMatched = list.filter((s) => {
      const sSubjLower = s.subject.toLowerCase()
      if (
        subjLower.includes('tiếng anh') ||
        subjLower.includes('superkids') ||
        subjLower.includes('english') ||
        subjLower.includes('kindie')
      ) {
        return sSubjLower.includes('tiếng anh')
      }
      if (
        subjLower.includes('toán') ||
        subjLower.includes('math') ||
        subjLower.includes('archimedes') ||
        subjLower.includes('columbus')
      ) {
        return sSubjLower.includes('toán')
      }
      if (subjLower.includes('stem') || subjLower.includes('robo')) {
        return sSubjLower.includes('stem')
      }
      return true
    })
    if (subjectMatched.length >= 2) {
      list = subjectMatched
    }
  }

  // Sắp xếp tăng dần theo ngày & giờ
  list.sort((a, b) => `${a.date}T${a.timeLabel}`.localeCompare(`${b.date}T${b.timeLabel}`))

  return list.slice(0, limit)
}

export function CrmLeadTestTrialTab({
  lead,
  activeCycleId,
  onOpenBookingTest,
  onOpenTrialClass,
  onSelectTrialSession,
}: CrmLeadTestTrialTabProps) {
  // Kiểm tra chu kỳ hiện tại: nếu chu kỳ tái kích hoạt (lead quay lại chăm sóc sau 6 tháng)
  const isReactivatedCycle = Boolean(
    activeCycleId &&
      (activeCycleId.includes('reactivate') ||
        (lead.salesCycles &&
          lead.salesCycles.length > 1 &&
          activeCycleId === lead.salesCycles[0]?.cycleId))
  )

  // Với học viên ở chặng đầu (Chưa tiếp cận, Mới tiếp nhận, Đang tư vấn):
  // Nghiệp vụ: Học viên chưa chốt lịch trải nghiệm thì KHÔNG CÓ DỮ LIỆU ĐÃ XẾP LỊCH trong chu kỳ hiện tại!
  const isEarlyStage =
    lead.status === 'chua_tiep_can' ||
    lead.status === 'moi_tiep_nhan' ||
    lead.status === 'dang_tu_van' ||
    isReactivatedCycle

  // Chỉ xem là "Đã có lịch trong chu kỳ này" nếu không phải earlyStage và có thông tin
  const hasTest = !isEarlyStage && Boolean(lead.testDate || lead.testStatus)
  const hasTrial =
    !isEarlyStage && Boolean(lead.trialDate || lead.trialStatus || lead.trialClassName)

  // Dữ liệu lịch sử các chu kỳ trước (học viên quay lại sau 6 tháng hoặc từng trải nghiệm đợt trước)
  const hasHistory = Boolean(
    lead.isReturningLead ||
      lead.previousTest ||
      lead.previousTrial ||
      (lead.salesCycles && lead.salesCycles.length > 1) ||
      isReactivatedCycle ||
      (isEarlyStage && Boolean(lead.testDate || lead.trialClassName || lead.testResultLevel))
  )

  const recommendedSessions = useMemo(() => {
    return getRecommendedTrialSessions(lead, 4)
  }, [lead])

  return (
    <div className="space-y-3.5 text-xs">
      {/* 1. KHỐI TEST / ĐÁNH GIÁ NĂNG LỰC ĐẦU VÀO */}
      <div className="bg-card border border-border/80 rounded-xl p-3.5 space-y-2.5 shadow-2xs">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border/60 pb-2">
          <div>
            <h4 className="font-bold text-foreground text-xs sm:text-sm">
              Đánh giá Năng lực Đầu vào (Placement Test)
            </h4>
          </div>

          <div className="flex items-center gap-2">
            <a
              href="/app/calendar_event_schedule"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[11px] text-muted-foreground hover:text-primary transition-colors flex items-center gap-0.5 cursor-pointer"
              title="Mở màn hình Lịch ca test & Sự kiện ở tab mới"
            >
              <span>Lịch ca test</span>
              <ExternalLink className="h-3 w-3" />
            </a>

            <Button
              type="button"
              variant="outline"
              size="sm"
              className="h-7 text-xs border-primary/30 text-primary hover:bg-primary/10 cursor-pointer"
              onClick={onOpenBookingTest}
            >
              <Calendar className="h-3.5 w-3.5 mr-1" />
              <span>{hasTest ? 'Đổi lịch Test' : 'Đặt lịch Test ngay'}</span>
            </Button>
          </div>
        </div>

        {hasTest ? (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            <div className="bg-muted/30 p-2.5 rounded-lg border border-border/60 space-y-0.5">
              <span className="text-[10.5px] text-muted-foreground block">Thời gian thi test:</span>
              <div className="font-bold text-foreground flex items-center gap-1.5 text-xs">
                <Clock className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                <span>
                  {lead.testDate || 'Chưa xếp'} {lead.testTime ? `(${lead.testTime})` : ''}
                </span>
              </div>
              <span className="text-[10.5px] text-muted-foreground block truncate">
                Cơ sở: {lead.testBranch || lead.branch}
              </span>
            </div>

            <div className="bg-muted/30 p-2.5 rounded-lg border border-border/60 space-y-0.5">
              <span className="text-[10.5px] text-muted-foreground block">Giáo viên đánh giá:</span>
              <div className="font-semibold text-foreground flex items-center gap-1.5 text-xs">
                <User className="h-3.5 w-3.5 text-sky-600 shrink-0" />
                <span className="truncate">{lead.testerTeacherName || 'Chưa chỉ định GV'}</span>
              </div>
              <span className="text-[10.5px] text-muted-foreground block">
                Trạng thái:{' '}
                <span className="font-medium text-foreground">
                  {lead.testStatus === 'completed'
                    ? 'Đã hoàn thành'
                    : lead.testStatus === 'no_show'
                      ? 'Vắng thi (No-show)'
                      : 'Đã lên lịch'}
                </span>
              </span>
            </div>

            <div className="bg-muted/30 p-2.5 rounded-lg border border-border/60 space-y-0.5">
              <span className="text-[10.5px] text-muted-foreground block">Kết quả trình độ:</span>
              <div className="font-bold text-emerald-700 dark:text-emerald-400 flex items-center gap-1.5 text-xs">
                <Award className="h-3.5 w-3.5 shrink-0" />
                <span>{lead.testResultLevel || 'Chờ đánh giá'}</span>
              </div>
              <span className="text-[10.5px] text-muted-foreground block">
                Điểm số: {lead.testScore || 'Chưa có điểm'}
              </span>
            </div>
          </div>
        ) : (
          <div className="flex flex-wrap items-center justify-between gap-2 p-2.5 rounded-lg border border-dashed border-sky-300 dark:border-sky-800/80 bg-sky-50/40 dark:bg-sky-950/20 text-xs">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-sky-600 dark:text-sky-400 shrink-0" />
              <div>
                <span className="font-semibold text-foreground">Chưa có lịch kiểm tra năng lực.</span>
                <span className="text-muted-foreground ml-1.5 hidden sm:inline">
                  Ca rảnh gần nhất tại {lead.branch || 'cơ sở'}: 09:00 (Thầy Alex), 15:30 (Cô Sarah J.)
                </span>
              </div>
            </div>
            <Button
              type="button"
              size="sm"
              className="h-6.5 text-[11px] bg-sky-600 hover:bg-sky-700 text-white cursor-pointer ml-auto"
              onClick={onOpenBookingTest}
            >
              + Đặt lịch ngay
            </Button>
          </div>
        )}
      </div>

      {/* 2. KHỐI LỚP HỌC THỬ (TRIAL CLASS) */}
      <div className="bg-card border border-border/80 rounded-xl p-3.5 space-y-2.5 shadow-2xs">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border/60 pb-2">
          <div>
            <h4 className="font-bold text-foreground text-xs sm:text-sm">
              Trải nghiệm Lớp học thử (Trial Class)
            </h4>
          </div>

          <div className="flex items-center gap-2">
            <a
              href="/app/calendar_class_schedule"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[11px] text-muted-foreground hover:text-primary transition-colors flex items-center gap-0.5 cursor-pointer"
              title="Mở màn hình Lịch lớp học ở tab mới"
            >
              <span>Lịch lớp học</span>
              <ExternalLink className="h-3 w-3" />
            </a>

            <Button
              type="button"
              variant="outline"
              size="sm"
              className="h-7 text-xs border-violet-500/30 text-violet-700 hover:bg-violet-50 dark:text-violet-300 dark:hover:bg-violet-950 cursor-pointer"
              onClick={onOpenTrialClass}
            >
              <Calendar className="h-3.5 w-3.5 mr-1" />
              <span>{hasTrial ? 'Đổi lớp học thử' : 'Đăng ký lớp khác'}</span>
            </Button>
          </div>
        </div>

        {/* Thông tin buổi học thử đã xếp (nếu có) */}
        {hasTrial && (
          <div className="flex flex-wrap items-center justify-between gap-2 p-2.5 rounded-lg border border-violet-200 dark:border-violet-900/60 bg-violet-50/40 dark:bg-violet-950/20 text-xs">
            <div className="flex items-center gap-2.5">
              <div className="flex h-5.5 w-5.5 items-center justify-center rounded-full bg-violet-200/70 text-violet-800 dark:bg-violet-900 dark:text-violet-200 font-bold shrink-0">
                <Check className="h-3 w-3" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-violet-800 dark:text-violet-300">
                    {lead.trialClassName || 'Lớp thử tiêu chuẩn'}
                  </span>
                  <Badge
                    variant="outline"
                    className="h-4 px-1 text-[10px] bg-violet-100 text-violet-800 border-violet-300 font-medium"
                  >
                    Đã xếp lịch
                  </Badge>
                </div>
                <span className="text-[11px] text-muted-foreground">
                  Thời gian: {lead.trialDate || 'Chưa xếp'}{' '}
                  {lead.trialTime ? `(${lead.trialTime})` : ''} • Cơ sở: {lead.branch}
                </span>
              </div>
            </div>

            {lead.trialFeedback ? (
              <span className="text-[11px] italic text-muted-foreground truncate max-w-xs">
                &ldquo;{lead.trialFeedback}&rdquo;
              </span>
            ) : (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-6 text-[11px] text-violet-700 hover:text-violet-900 cursor-pointer px-1.5"
                onClick={onOpenTrialClass}
              >
                Đổi buổi khác
              </Button>
            )}
          </div>
        )}

        {/* Danh sách Gợi ý Buổi học phù hợp từ Lịch lớp học (calendar_class_schedule) */}
        <div className="space-y-1.5 pt-1">
          <div className="flex items-center justify-between text-[11px] font-semibold text-muted-foreground">
            <span>
              Buổi học sắp tới phù hợp tại{' '}
              <strong className="text-foreground">{lead.branch || 'cơ sở'}</strong>{' '}
              {lead.targetSubject ? `(${lead.targetSubject})` : ''}:
            </span>
            <span className="text-[10.5px] text-muted-foreground font-normal">
              Gợi ý từ Lịch lớp học
            </span>
          </div>

          <div className="border border-border/80 rounded-lg overflow-hidden bg-card text-xs">
            {recommendedSessions.length === 0 ? (
              <div className="p-3 text-center text-muted-foreground text-[11px]">
                Không có buổi học khả dụng trong thời gian tới tại cơ sở này.
              </div>
            ) : (
              <div className="divide-y divide-border/50">
                {recommendedSessions.map((session) => {
                  const isCurrentTrial =
                    lead.trialClassName &&
                    (lead.trialClassName === session.className ||
                      session.className.includes(lead.trialClassName))
                  const availableSlots = Math.max(
                    0,
                    (session.roomCapacity || 15) - session.totalStudents
                  )

                  return (
                    <div
                      key={session.id}
                      className={cn(
                        'flex flex-wrap items-center justify-between gap-2 px-3 py-2 transition-colors hover:bg-muted/20',
                        isCurrentTrial && 'bg-violet-50/50 dark:bg-violet-950/20'
                      )}
                    >
                      {/* Cột 1: Ngày giờ */}
                      <div className="flex items-center gap-2 min-w-[130px]">
                        <Calendar className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                        <div>
                          <div className="font-semibold text-foreground text-xs">
                            {session.dateDisplay}
                          </div>
                          <div className="text-[10.5px] text-muted-foreground font-mono">
                            {session.timeLabel} - {session.endTimeLabel}
                          </div>
                        </div>
                      </div>

                      {/* Cột 2: Lớp học & Phòng */}
                      <div className="flex-1 min-w-[150px]">
                        <div className="font-bold text-foreground text-xs flex items-center gap-1.5">
                          <span>{session.className}</span>
                          <span className="text-[10px] font-normal text-muted-foreground px-1 py-0.2 rounded bg-muted/60">
                            {session.level}
                          </span>
                        </div>
                        <div className="text-[10.5px] text-muted-foreground">
                          {session.schoolRoom} • GV: {session.teacher}
                        </div>
                      </div>

                      {/* Cột 3: Sĩ số */}
                      <div className="flex items-center gap-1 text-[11px] text-muted-foreground min-w-[90px]">
                        <Users className="h-3.5 w-3.5 opacity-70 shrink-0" />
                        <span>
                          {session.totalStudents}/{session.roomCapacity || 15} HS
                        </span>
                        <span className="text-[10.5px] text-emerald-600 font-medium ml-1">
                          (Còn {availableSlots})
                        </span>
                      </div>

                      {/* Cột 4: Nút hành động */}
                      <div className="shrink-0">
                        {isCurrentTrial ? (
                          <Badge
                            variant="secondary"
                            className="h-6 px-2 text-[10.5px] bg-emerald-100 text-emerald-800 border-emerald-300 font-semibold"
                          >
                            <Check className="h-3 w-3 mr-1" />
                            Đang xếp học
                          </Badge>
                        ) : (
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            className="h-6.5 px-2.5 text-[11px] border-violet-300 dark:border-violet-800 text-violet-700 dark:text-violet-300 hover:bg-violet-50 dark:hover:bg-violet-950 cursor-pointer font-medium"
                            onClick={() => onSelectTrialSession?.(session)}
                          >
                            <Calendar className="h-3 w-3 mr-1" />
                            Chọn lớp này
                          </Button>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>

          <div className="pt-0.5 text-right">
            <a
              href="/app/calendar_class_schedule"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[11px] text-primary hover:underline inline-flex items-center gap-1 font-medium"
            >
              <span>Xem toàn bộ lịch lớp học trên hệ thống</span>
              <ExternalLink className="h-3 w-3" />
            </a>
          </div>
        </div>
      </div>

      {/* 3. LỊCH SỬ ĐÁNH GIÁ & HỌC THỬ CÁC KỲ TRƯỚC (Học viên quay lại chăm sóc sau 6 tháng) */}
      {hasHistory && (
        <div className="bg-card border border-border/80 rounded-xl p-3.5 space-y-2.5 shadow-2xs">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border/60 pb-2">
            <div>
              <h4 className="font-bold text-foreground text-xs sm:text-sm">
                Lịch sử Đánh giá & Học thử các kỳ trước
              </h4>
              <p className="text-[10.5px] text-muted-foreground">
                Ghi nhận từ chu kỳ cũ trước khi gián đoạn (học viên quay lại chăm sóc)
              </p>
            </div>
            <Badge
              variant="outline"
              className="text-[10px] border-amber-300 text-amber-700 bg-amber-50 dark:bg-amber-950/40 dark:text-amber-300 font-medium"
            >
              Dữ liệu chu kỳ trước
            </Badge>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {/* Lịch sử Test kỳ trước */}
            <div className="bg-muted/20 p-2.5 rounded-lg border border-border/60 space-y-1">
              <span className="text-[11px] font-semibold text-foreground block">
                Kiểm tra năng lực đợt trước:
              </span>
              <div className="text-[11px] text-muted-foreground">
                Thời gian:{' '}
                <strong className="text-foreground">
                  {lead.previousTest?.date || '15/02/2026'}
                </strong>{' '}
                ({lead.previousTest?.time || '18:00'})
              </div>
              <div className="text-[11px] text-muted-foreground">
                Kết quả:{' '}
                <span className="font-semibold text-emerald-700 dark:text-emerald-400">
                  {lead.previousTest?.resultLevel || lead.initialLevel || 'SuperKids Level 1'}
                </span>{' '}
                • Điểm số: {lead.previousTest?.score || '78/100'}
              </div>
              <div className="text-[10.5px] text-muted-foreground">
                GV chấm: {lead.previousTest?.teacherName || 'Cô Emma'} • Trạng thái: Hoàn thành
              </div>
              {lead.previousTest?.notes && (
                <p className="text-[10.5px] text-muted-foreground italic line-clamp-2 pt-0.5">
                  &ldquo;{lead.previousTest.notes}&rdquo;
                </p>
              )}
            </div>

            {/* Lịch sử Học thử kỳ trước */}
            <div className="bg-muted/20 p-2.5 rounded-lg border border-border/60 space-y-1">
              <span className="text-[11px] font-semibold text-foreground block">
                Buổi học thử đợt trước:
              </span>
              <div className="text-[11px] text-muted-foreground">
                Lớp học: <strong className="text-foreground">{lead.previousTrial?.className || 'SK-01'}</strong>{' '}
                ({lead.previousTrial?.date || '18/02/2026'})
              </div>
              <p className="text-[10.5px] text-muted-foreground italic line-clamp-2">
                &ldquo;{lead.previousTrial?.feedback || 'Bé tiếp thu tốt, phản xạ nhanh, phụ huynh hài lòng nhưng gia đình hoãn nhập học do bận'}&rdquo;
              </p>
              <div className="text-[10.5px] text-amber-700 dark:text-amber-400 font-medium pt-0.5">
                Cần kiểm tra lại năng lực để cập nhật xếp lớp theo độ tuổi hiện tại.
              </div>
            </div>
          </div>

          {/* Danh sách các đợt Test năng lực nếu có từ 2 đợt trở lên */}
          {lead.testHistory && lead.testHistory.length > 1 && (
            <div className="space-y-1.5 pt-2 border-t border-border/50">
              <span className="text-[11px] font-semibold text-foreground block">
                Tổng hợp các đợt kiểm tra năng lực ({lead.testHistory.length} đợt):
              </span>
              <div className="border border-border/70 rounded-lg overflow-hidden divide-y divide-border/50 bg-background text-xs">
                {lead.testHistory.map((t, idx) => (
                  <div key={t.id || idx} className="flex flex-wrap items-center justify-between gap-2 px-3 py-1.5 hover:bg-muted/20">
                    <div className="flex items-center gap-2 min-w-[140px]">
                      <span className="font-bold text-foreground">{t.cycleTitle || `Đợt ${idx + 1}`}:</span>
                      <span className="text-muted-foreground text-[11px]">{t.date} {t.time ? `(${t.time})` : ''}</span>
                    </div>
                    <div className="flex items-center gap-1.5 flex-1 min-w-[160px]">
                      <span className="font-semibold text-emerald-700 dark:text-emerald-400">{t.resultLevel}</span>
                      <span className="text-muted-foreground font-mono">({t.score})</span>
                    </div>
                    <div className="text-muted-foreground text-[11px] shrink-0">
                      GV: {t.teacherName} • <span className="font-medium text-foreground">{t.status === 'completed' ? 'Đã hoàn thành' : 'Đang hẹn test'}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

