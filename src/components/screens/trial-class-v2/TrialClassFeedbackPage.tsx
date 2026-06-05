'use client'

import { useMemo } from 'react'
import Link from 'next/link'
import {
  AlertCircle,
  Award,
  Calendar,
  CheckCircle2,
  ExternalLink,
  GraduationCap,
  Sparkles,
  Star,
  User,
  Users,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { EmptyState, InfoField, PageHeader, Panel } from '@/components/shared'
import { getTrialClasses } from '@/mocks/trialClasses'
import { formatTrialDate, getTrialStatusLabel } from './trialClassHelpers'

interface TrialClassFeedbackPageProps {
  trialId: string
}

export function TrialClassFeedbackPage({ trialId }: TrialClassFeedbackPageProps) {
  const trial = useMemo(
    () => getTrialClasses().find((t) => t.id === trialId) ?? null,
    [trialId]
  )

  if (!trial) {
    return (
      <div className="flex h-full min-h-0 flex-col bg-background px-4 py-3 lg:px-6">
        <EmptyState
          icon={<AlertCircle className="h-7 w-7 text-muted-foreground" />}
          title="Không tìm thấy thông tin nhận xét"
          description="Booking học thử này không tồn tại hoặc chưa có dữ liệu đánh giá."
          className="h-full"
        />
      </div>
    )
  }

  const { feedback } = trial

  return (
    <div className="flex h-full min-h-0 flex-col bg-background">
      <PageHeader
        title={`Báo cáo nhận xét học thử - ${trial.studentName}`}
        description={`${trial.program} · ${trial.school}`}
        code={trial.id}
        status={trial.status}
        statusLabel={getTrialStatusLabel(trial.status)}
        showBackButton={false}
        actions={
          <Button asChild variant="outline" size="sm" className="gap-2">
            <Link href="/app/trial_class">
              <ExternalLink className="h-4 w-4" />
              Danh sách học thử
            </Link>
          </Button>
        }
      />

      <main className="min-h-0 flex-1 overflow-y-auto px-4 pb-8 lg:px-6">
        <div className="mx-auto max-w-6xl space-y-6">
          {/* Top Summary Cards */}
          <div className="grid gap-6 md:grid-cols-3">
            <div className="flex items-center gap-4 rounded-xl border bg-card p-5 shadow-sm transition-all hover:shadow-md">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <User className="h-6 w-6" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Học viên</p>
                <p className="truncate text-base font-bold text-foreground">{trial.studentName}</p>
                <p className="text-xs text-muted-foreground font-mono">{trial.customerId}</p>
              </div>
            </div>

            <div className="flex items-center gap-4 rounded-xl border bg-card p-5 shadow-sm transition-all hover:shadow-md">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-amber-500/10 text-amber-500">
                <Star className="h-6 w-6 fill-amber-500/20" />
              </div>
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Đánh giá chung</p>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="text-xl font-extrabold text-foreground">
                    {feedback ? `${feedback.rating}.0` : '—'}
                  </span>
                  {feedback && (
                    <div className="flex text-amber-400">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${
                            i < feedback.rating ? 'fill-current' : 'text-muted-foreground/30'
                          }`}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4 rounded-xl border bg-card p-5 shadow-sm transition-all hover:shadow-md">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-500">
                <Award className="h-6 w-6" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Lộ trình đề xuất</p>
                <p className="truncate text-base font-bold text-emerald-600 dark:text-emerald-400">
                  {feedback?.recommendedLevel || 'Đang đánh giá'}
                </p>
              </div>
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
            {/* Left Column: Feedback details */}
            <div className="space-y-6">
              {/* Teacher Comments */}
              <Panel
                title="Nhận xét từ Giáo viên phụ trách"
                icon={<Sparkles className="h-4 w-4 text-primary" />}
              >
                <div className="rounded-xl border bg-card p-6 shadow-sm">
                  {feedback ? (
                    <div className="space-y-5">
                      <div className="relative rounded-lg bg-muted/30 p-4 italic text-foreground/80 before:content-['“'] after:content-['”'] before:text-2xl before:font-serif before:text-muted-foreground/60 after:text-2xl after:font-serif after:text-muted-foreground/60">
                        <span className="mx-1 text-sm leading-relaxed">{feedback.comment}</span>
                      </div>

                      {/* Strengths & Weaknesses */}
                      <div className="grid gap-6 md:grid-cols-2 pt-2">
                        {/* Strengths */}
                        <div className="space-y-3">
                          <h4 className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                            <CheckCircle2 className="h-4 w-4" />
                            Điểm mạnh nổi bật
                          </h4>
                          {feedback.strengths.length > 0 ? (
                            <ul className="space-y-2">
                              {feedback.strengths.map((s, index) => (
                                <li
                                  key={index}
                                  className="flex items-start gap-2 rounded-lg bg-emerald-50/50 dark:bg-emerald-950/20 px-3 py-2 text-xs font-medium text-emerald-800 dark:text-emerald-300 border border-emerald-100/50 dark:border-emerald-900/30"
                                >
                                  <span className="mt-0.5 select-none text-emerald-500">✓</span>
                                  {s}
                                </li>
                              ))}
                            </ul>
                          ) : (
                            <p className="text-xs text-muted-foreground italic">Không có ghi nhận đặc biệt.</p>
                          )}
                        </div>

                        {/* Weaknesses */}
                        <div className="space-y-3">
                          <h4 className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                            <AlertCircle className="h-4 w-4" />
                            Hạn chế cần cải thiện
                          </h4>
                          {feedback.weaknesses.length > 0 ? (
                            <ul className="space-y-2">
                              {feedback.weaknesses.map((w, index) => (
                                <li
                                  key={index}
                                  className="flex items-start gap-2 rounded-lg bg-amber-50/50 dark:bg-amber-950/20 px-3 py-2 text-xs font-medium text-amber-800 dark:text-amber-300 border border-amber-100/50 dark:border-amber-900/30"
                                >
                                  <span className="mt-0.5 select-none text-amber-500">•</span>
                                  {w}
                                </li>
                              ))}
                            </ul>
                          ) : (
                            <p className="text-xs text-muted-foreground italic">Không có ghi nhận đặc biệt.</p>
                          )}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="py-8 text-center text-muted-foreground">
                      <Users className="mx-auto mb-3 h-8 w-8 text-muted-foreground/40" />
                      <p className="text-sm italic">Đang chờ giáo viên nộp nhận xét & đánh giá chi tiết.</p>
                    </div>
                  )}
                </div>
              </Panel>

              {/* Sessions Details */}
              <Panel
                title="Lớp học & Buổi học đã tham gia"
                icon={<Calendar className="h-4 w-4 text-primary" />}
              >
                <div className="rounded-xl border bg-card p-6 shadow-sm space-y-4">
                  {trial.sessions.length > 0 ? (
                    <div className="space-y-3">
                      {trial.sessions.map((s, idx) => (
                        <div
                          key={idx}
                          className="flex flex-col md:flex-row md:items-center justify-between gap-3 rounded-lg border bg-muted/20 p-4 transition-colors hover:bg-muted/40"
                        >
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-semibold text-foreground">
                                {s.className}
                              </span>
                              <Badge variant="secondary" className="font-mono text-[10px]">
                                {s.classId}
                              </Badge>
                            </div>
                            <p className="text-xs text-muted-foreground mt-0.5">
                              {s.sessionName} · Mã buổi: <span className="font-mono">{s.sessionId}</span>
                            </p>
                          </div>
                          <div className="flex items-center gap-1.5 self-start md:self-auto rounded-full bg-background border px-3 py-1 text-xs font-medium">
                            <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                            {formatTrialDate(s.trialDate)}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground italic text-center py-6">
                      Booking này chưa được sắp xếp lớp học thử.
                    </p>
                  )}
                </div>
              </Panel>
            </div>

            {/* Right Column: Customer/Family details */}
            <div className="space-y-6">
              {/* Customer Profile Info */}
              <Panel
                title="Hồ sơ liên hệ"
                icon={<User className="h-4 w-4 text-primary" />}
              >
                <div className="rounded-xl border bg-card p-5 shadow-sm space-y-4">
                  <div className="space-y-3.5">
                    <InfoField label="Tên phụ huynh" value={trial.parentName || trial.familyName} />
                    <InfoField
                      label="Số điện thoại"
                      value={trial.familyPhone}
                      supporting="Dùng để liên hệ tư vấn chốt lộ trình"
                    />
                    <InfoField label="Trường đăng ký" value={trial.school} />
                    <InfoField label="Người phụ trách tư vấn" value={trial.owner} />
                  </div>
                </div>
              </Panel>

              {/* Recommended Action Spotlight */}
              {feedback && (
                <div className="relative overflow-hidden rounded-xl border bg-gradient-to-br from-primary/10 via-primary/5 to-transparent p-5 shadow-sm">
                  <div className="absolute right-0 top-0 translate-x-2 -translate-y-2 opacity-10">
                    <GraduationCap className="h-32 w-32" />
                  </div>
                  <div className="relative space-y-3">
                    <div className="inline-flex items-center gap-1.5 rounded-full bg-primary/20 px-2.5 py-0.5 text-xs font-semibold text-primary">
                      <Sparkles className="h-3.5 w-3.5" />
                      Lộ trình tư vấn đề xuất
                    </div>
                    <p className="text-sm font-medium leading-relaxed">
                      Học viên <strong className="font-semibold">{trial.studentName}</strong> được đề xuất
                      xếp vào lớp trình độ:
                    </p>
                    <div className="rounded-lg bg-background/80 border p-3.5 text-center">
                      <span className="text-2xl font-black tracking-tight text-primary">
                        {feedback.recommendedLevel}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Vui lòng liên hệ phụ huynh theo số <strong className="font-mono">{trial.familyPhone}</strong> để
                      chốt lộ trình nhập học chính thức.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
