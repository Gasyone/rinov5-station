'use client'

import { useMemo } from 'react'
import { Star, CheckCircle2, XCircle, FileText, ExternalLink, CalendarRange, AlertCircle } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { InfoField } from '@/components/shared'
import type { Student } from '@/mocks/students'
import { getPlacementTestResultV2, getTrialClassFeedbackV2 } from './studentsV2Helpers'
import { getStatusBadgeClass } from '@/lib/statusColors'

interface StudentDetailBookingTrialTabProps {
  student: Student
}

const SUBJECT_LABELS: Record<string, string> = {
  english: 'Tiếng Anh',
  math: 'Toán học',
  stem: 'STEM',
}

export function StudentDetailBookingTrialTab({ student }: StudentDetailBookingTrialTabProps) {
  const booking = useMemo(() => getPlacementTestResultV2(student), [student])
  const trial = useMemo(() => getTrialClassFeedbackV2(student), [student])

  const getScorePercentage = (scoreStr?: string) => {
    if (!scoreStr) return 0
    const parts = scoreStr.split('/')
    if (parts.length === 2) {
      const score = parseFloat(parts[0])
      const max = parseFloat(parts[1])
      return (score / max) * 100
    }
    return 0
  }

  const getTrialStatusLabel = (status: string) => {
    switch (status) {
      case 'pending_approval': return 'Chờ duyệt'
      case 'rejected': return 'Từ chối'
      case 'confirmed': return 'Đã xác nhận'
      case 'reschedule': return 'Đổi lịch'
      case 'cancelled': return 'Đã hủy'
      case 'no_show': return 'Không đến'
      case 'completed': return 'Hoàn thành'
      default: return status
    }
  }

  return (
    <div className="space-y-6 pt-2">
      
      {/* SECTION 1: PLACEMENT TEST DETAILS */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 px-1">
          <FileText className="h-4.5 w-4.5 text-primary" />
          <h3 className="font-bold text-sm text-foreground uppercase tracking-wide">1. Đánh giá đầu vào (Placement Test)</h3>
        </div>

        {booking ? (
          <div className="space-y-4 bg-muted/10 p-4 rounded-xl border border-muted/50">
            {/* Booking Details */}
            <div className="grid gap-x-6 gap-y-4 sm:grid-cols-2 lg:grid-cols-3">
              <InfoField label="Mã đặt lịch" value={<span className="font-mono font-semibold">{booking.id}</span>} />
              <InfoField label="Thời gian kiểm tra" value={
                <div className="flex items-center gap-1.5">
                  <span className="font-semibold">{booking.testTime}</span>
                  {booking.attendance === 'confirmed' && (
                    <Badge variant="secondary" className="bg-emerald-50 text-emerald-700 border-emerald-100 font-bold text-[9px] px-1.5 py-0">
                      Đã đến
                    </Badge>
                  )}
                </div>
              } />
              <InfoField label="Trạng thái" value={
                <Badge variant="outline" className={getStatusBadgeClass(booking.status)}>
                  {booking.status === 'completed' ? 'Hoàn thành' : 'Đang xử lý'}
                </Badge>
              } />
              <InfoField label="Cơ sở test" value={booking.school} />
              <InfoField label="Phòng test" value={booking.room || 'Sảnh tư vấn'} />
              <InfoField label="Môn thi" value={SUBJECT_LABELS[booking.subject] || booking.subject} />
              <InfoField label="Chương trình" value={booking.program} />
              <InfoField label="Tester / Giáo viên chấm" value={booking.tester || booking.teacher || 'Chưa phân công'} />
              <InfoField label="CSKH / Phỏng vấn" value={booking.interviewer || 'Chưa xếp'} />
            </div>

            {/* Test Results */}
            <div className="border-t pt-4 space-y-4">
              <div className="grid gap-x-6 gap-y-4 sm:grid-cols-2 lg:grid-cols-3">
                <InfoField label="Trình độ quy đổi" value={<span className="font-bold text-indigo-600 text-xs">{booking.testResult?.level || 'Chưa xếp'}</span>} />
                <InfoField label="Sub-level xếp lớp" value={<span className="font-semibold text-foreground text-xs">{booking.testResult?.subLevel || '-'}</span>} />
                <InfoField label="Lộ trình đề xuất" value={booking.testResult?.path || 'Lộ trình cơ bản'} />
              </div>

              {/* Skill Breakdowns */}
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 bg-background p-3.5 rounded-xl border border-muted/50">
                {booking.subject === 'english' && (
                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-semibold text-muted-foreground">Speaking (Nói trực tiếp với GV)</span>
                      <span className="font-mono font-bold text-indigo-600">{booking.testResult?.speaking || '0/8'}</span>
                    </div>
                    <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-indigo-600 rounded-full" style={{ width: `${getScorePercentage(booking.testResult?.speaking)}%` }} />
                    </div>
                    {booking.testResult?.speakingAi && (
                      <span className="text-[10px] text-muted-foreground flex justify-between">
                        <span>Speaking chấm bởi AI:</span>
                        <span className="font-semibold text-foreground">{booking.testResult.speakingAi}</span>
                      </span>
                    )}
                  </div>
                )}

                <div className="space-y-1.5">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-semibold text-muted-foreground">LWR (Nghe - Đọc - Viết tổng hợp)</span>
                    <span className="font-mono font-bold text-emerald-600">{booking.testResult?.lwr || '0/40'}</span>
                  </div>
                  <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-600 rounded-full" style={{ width: `${getScorePercentage(booking.testResult?.lwr)}%` }} />
                  </div>
                  {booking.testResult?.lwrLevel && (
                    <span className="text-[10px] text-muted-foreground flex justify-between">
                      <span>Cấp độ bài LWR:</span>
                      <span className="font-semibold text-foreground">{booking.testResult.lwrLevel}</span>
                    </span>
                  )}
                </div>
              </div>

              {booking.msg && (
                <div className="bg-background border p-3 rounded-lg text-xs leading-relaxed text-foreground">
                  <strong>Nhận xét từ Tester:</strong> &ldquo;{booking.msg}&rdquo;
                </div>
              )}

              {/* Result Links */}
              {(booking.resultLink || booking.testLink) && (
                <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs pt-1">
                  {booking.resultLink && (
                    <a href={booking.resultLink} target="_blank" rel="noreferrer" className="text-primary hover:underline font-semibold flex items-center gap-1.5">
                      <ExternalLink className="h-3.5 w-3.5" /> Kết quả thi iPad
                    </a>
                  )}
                  {booking.testLink && (
                    <a href={booking.testLink} target="_blank" rel="noreferrer" className="text-primary hover:underline font-semibold flex items-center gap-1.5">
                      <ExternalLink className="h-3.5 w-3.5" /> Lịch test gốc
                    </a>
                  )}
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-3 p-4 bg-muted/20 border border-muted/50 rounded-xl text-xs text-muted-foreground italic justify-center">
            <AlertCircle className="h-4 w-4 text-zinc-400 shrink-0" />
            <span>Chưa đăng ký hoặc chưa có lịch sử thực hiện bài kiểm tra đầu vào (Placement Test).</span>
          </div>
        )}
      </div>

      {/* SECTION 2: TRIAL CLASS DETAILS */}
      <div className="space-y-4 pt-2">
        <div className="flex items-center gap-2 px-1">
          <CalendarRange className="h-4.5 w-4.5 text-primary" />
          <h3 className="font-bold text-sm text-foreground uppercase tracking-wide">2. Lịch sử học thử (Trial Class)</h3>
        </div>

        {trial ? (
          <div className="space-y-4 bg-muted/10 p-4 rounded-xl border border-muted/50">
            {/* Trial Registration Info */}
            <div className="grid gap-x-6 gap-y-4 sm:grid-cols-2 lg:grid-cols-3">
              <InfoField label="Mã học thử" value={<span className="font-mono font-semibold">{trial.id}</span>} />
              <InfoField label="Tên buổi học thử" value={trial.trialName} />
              <InfoField label="Số lần thử" value={<span className="font-semibold">{trial.attempt || 'Lần 1'}</span>} />
              <InfoField label="Môn học thử" value={trial.subject} />
              <InfoField label="Chương trình thử" value={trial.program} />
              <InfoField label="Trạng thái" value={
                <Badge variant="outline" className={getStatusBadgeClass(trial.status)}>
                  {getTrialStatusLabel(trial.status)}
                </Badge>
              } />
              <InfoField label="Giáo viên đứng lớp" value={trial.owner || 'Chưa phân công'} />
              <InfoField label="Sale phụ trách" value={trial.creator || 'Sales Admin'} />
              <InfoField label="Cơ sở học thử" value={trial.branch} />
            </div>

            {/* Trial Sessions */}
            {trial.sessions && trial.sessions.length > 0 && (
              <div className="border-t pt-4">
                <span className="text-xs font-bold text-muted-foreground block mb-2">Buổi học thử được ghép</span>
                <div className="space-y-2">
                  {trial.sessions.map((s, idx) => (
                    <div key={idx} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2.5 rounded-lg border bg-background p-3 hover:bg-muted/10 transition-colors">
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="font-semibold text-xs text-foreground">{s.className}</span>
                          <span className="font-mono text-[9px] text-muted-foreground bg-muted px-1.5 rounded">({s.classId})</span>
                        </div>
                        <div className="text-[10px] text-muted-foreground">
                          Buổi: <strong>{s.sessionName}</strong> &middot; ID: {s.sessionId}
                        </div>
                      </div>
                      <span className="text-xs font-semibold text-primary shrink-0">{s.trialDate}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Teacher Feedback */}
            {trial.feedback && (
              <div className="border-t pt-4 space-y-3">
                <span className="text-xs font-bold text-muted-foreground block">Đánh giá từ Giáo viên dạy thử</span>
                <div className="grid gap-x-6 gap-y-4 sm:grid-cols-2 lg:grid-cols-3 bg-background p-3 rounded-lg border">
                  <InfoField label="Đánh giá chung" value={
                    <div className="flex items-center gap-0.5">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} className={`h-4 w-4 ${i < (trial.feedback?.rating || 0) ? 'text-yellow-400 fill-yellow-400' : 'text-zinc-300'}`} />
                      ))}
                      <span className="text-xs text-muted-foreground ml-1">({trial.feedback.rating}/5)</span>
                    </div>
                  } />
                  <InfoField label="Trình độ đề xuất" value={<span className="font-bold text-indigo-600">{trial.feedback.recommendedLevel}</span>} />
                </div>

                {/* Strengths / Weaknesses */}
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-400 flex items-center gap-1">
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" /> Điểm mạnh ghi nhận:
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {trial.feedback.strengths.map((str, idx) => (
                        <Badge key={idx} variant="secondary" className="bg-emerald-50/50 text-emerald-800 border-emerald-100 font-semibold text-[9px] py-0">
                          {str}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <span className="text-xs font-semibold text-rose-700 dark:text-rose-400 flex items-center gap-1">
                      <XCircle className="h-3.5 w-3.5 text-rose-500" /> Điểm cần cải thiện:
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {trial.feedback.weaknesses.map((weak, idx) => (
                        <Badge key={idx} variant="secondary" className="bg-rose-50/50 text-rose-800 border-rose-100 font-semibold text-[9px] py-0">
                          {weak}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>

                {trial.feedback.comment && (
                  <div className="bg-background border p-3 rounded-lg text-xs leading-relaxed text-foreground">
                    <strong>Nhận xét từ giáo viên học thử:</strong> &ldquo;{trial.feedback.comment}&rdquo;
                  </div>
                )}
              </div>
            )}
          </div>
        ) : (
          <div className="flex items-center gap-3 p-4 bg-muted/20 border border-muted/50 rounded-xl text-xs text-muted-foreground italic justify-center">
            <AlertCircle className="h-4 w-4 text-zinc-400 shrink-0" />
            <span>Chưa đăng ký ghép lớp hoặc chưa tham gia các buổi học thử (Trial Class).</span>
          </div>
        )}
      </div>

    </div>
  )
}
