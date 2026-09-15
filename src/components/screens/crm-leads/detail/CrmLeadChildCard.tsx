'use client'

import React from 'react'
import {
  Phone,
  ExternalLink,
  Sparkles,
  GraduationCap,
  Baby,
  Target,
  Brain,
  Lightbulb,
  Award,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { getStatusBadgeClass } from '@/lib/statusColors'

export interface StudentSubjectItem {
  id: string
  subjectName: string
  courseLevel?: string
  grade?: string // Khối lớp (VD: Lớp 1, Lớp 2... Lớp 12 cho môn Toán)
  branch?: string
  trainingType?: string
  status?: string
  statusLabel?: string
  // Cờ kiểm soát trạng thái có lịch booking test / học thử hay chưa (để ẩn/hiện section tương ứng)
  hasTestBooking?: boolean
  hasTestResult?: boolean
  hasTrialBooking?: boolean

  // Placement Test chuẩn theo /app/booking_test (media_1789031000711.png & media_1789031010639.png)
  testLevel?: string // e.g. "Level 2B"
  testSubLevel?: string // e.g. "B"
  testPath?: string // e.g. "SuperKids Starter -> Level 2B"
  testProgram?: string // e.g. "Anh văn Nhi đồng (SuperKids)"
  testTargetLevel?: string // e.g. "Flyers Intensive Cấp độ 3"
  testTime?: string // e.g. "18:00"
  testBranch?: string // e.g. "RinoEdu Linh Đàm"
  testTeacher?: string // e.g. "Cô Emma"
  speakingGv?: string // e.g. "6.5/8"
  speakingAi?: string // e.g. "6/8"
  speakingAttempt?: string // e.g. "1"
  lwrScoreText?: string // e.g. "Starters - 27/40 - 1.5"
  testScore?: string // e.g. "8.5/10" hoặc "88/100"
  testDate?: string
  testRadarSkills?: {
    reflex?: number
    pronunciation?: number
    vocabGrammar?: number
    readingWriting?: number
    listening?: number
  }
  testSkills?: {
    listen?: string
    speak?: string
    read?: string
    write?: string
  }
  testStrengths?: string
  testImprovements?: string
  ipadTestLink?: string
  detailReportLink?: string

  // Trial Class chuẩn theo /app/trial_class
  trialTicketId?: string // e.g. "TR-2605-001"
  trialStatus?: string
  trialStatusLabel?: string
  trialClassName?: string // e.g. "Cambridge Starter A1"
  trialClassId?: string // e.g. "CLS-001"
  trialSessionName?: string // e.g. "Starter S1"
  trialProgram?: string // e.g. "Cambridge Starter"
  trialSubject?: string // e.g. "Tiếng Anh"
  trialDate?: string
  trialTime?: string // e.g. "18:00 - 19:30"
  trialBranch?: string // e.g. "RinoEdu Nguyễn Tuân"
  trialTeacher?: string // e.g. "Bùi Phương Anh"
  trialOwner?: string // e.g. "Ms. Sarah"
  trialAttendanceStatus?: string // e.g. "Chưa ghép lớp" | "Có mặt"
  trialAttempt?: string // e.g. "Lần 1"
  trialCreator?: string // e.g. "Lan Anh (Sale)"
  trialRating?: number // 5
  trialRatingLabel?: string // "Excellent"
  trialResult?: string
  trialReportLink?: string
  recommendedClass?: string
  teacherFeedback?: string
  trialFeedbackSections?: {
    whatLearned?: string[]
    highlights?: string[]
    improvements?: string[]
    reminders?: string[]
  }
}

export interface ChildPersonaItem {
  id: string
  code: string
  name: string
  englishName?: string
  age: number
  birthYear: number
  birthDate: string
  gender: string
  school: string
  grade: string
  academicPerformance?: string
  currentLevel?: string
  targetSubject: string
  status: string
  statusLabel: string
  testResultText: string
  studentPhone: string
  personality?: string
  interests?: string
  learningStyle?: string
  strengths?: string
  weaknesses?: string
  learningGoal?: string
  notes?: string
  isMain?: boolean
  isCurrent?: boolean
  productGroup?: string
  branch?: string
  trainingType?: string
  industryGroup?: string
  subjects?: StudentSubjectItem[]
}

interface CrmLeadChildCardProps {
  child: ChildPersonaItem
  onSwitchLead?: (leadId: string) => void
  onOpenInNewTab: (childId: string, childName: string, childCode: string) => void
  onClickProfile?: (child: ChildPersonaItem) => void
}

export function CrmLeadChildCard({
  child,
  onSwitchLead,
  onOpenInNewTab,
  onClickProfile,
}: CrmLeadChildCardProps) {
  const handleCardClick = () => {
    onClickProfile?.(child)
  }

  return (
    <div
      onClick={handleCardClick}
      className={cn(
        'group relative rounded-xl border bg-card p-3 sm:p-3.5 transition-all flex flex-col justify-between cursor-pointer select-none text-left shadow-2xs hover:shadow-sm',
        child.isCurrent
          ? 'border-indigo-400 dark:border-indigo-700 bg-indigo-50/10 dark:bg-indigo-950/10 hover:border-indigo-500 ring-1 ring-indigo-200/50 dark:ring-indigo-900/40'
          : 'border-border/80 hover:border-indigo-300'
      )}
    >
      {/* HEADER & THÔNG TIN ĐỊNH DANH HỌC VIÊN (THU GỌN) */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between gap-2 border-b border-border/40 pb-1.5">
          <div className="flex items-center gap-1.5 flex-wrap">
            {child.isCurrent ? (
              <Badge className="text-[10px] font-bold bg-primary text-primary-foreground h-5 px-1.5">
                Học viên đang xem
              </Badge>
            ) : (
              <Badge variant="outline" className="text-[10px] font-medium text-muted-foreground h-5 px-1.5">
                Học viên trong gia đình
              </Badge>
            )}

            <span className="font-mono text-[10px] font-bold text-sky-700 dark:text-sky-400 bg-sky-50 dark:bg-sky-950/60 px-1.5 py-0.5 rounded border border-sky-200 dark:border-sky-800">
              {child.code}
            </span>
          </div>

          <span className="text-[11px] font-semibold text-primary opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-0.5">
            <span>Chi tiết</span>
            <ExternalLink className="h-3 w-3" />
          </span>
        </div>

        {/* Tên & Avatar thu gọn */}
        <div className="flex items-center gap-2.5">
          <div
            className={cn(
              'flex h-9 w-9 items-center justify-center rounded-xl font-bold text-xs shrink-0 shadow-2xs',
              child.isCurrent
                ? 'bg-indigo-600 text-white'
                : 'bg-muted text-muted-foreground border border-border/80'
            )}
          >
            {child.isCurrent ? (
              <GraduationCap className="h-4.5 w-4.5" />
            ) : (
              <Baby className="h-4.5 w-4.5" />
            )}
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5 flex-wrap">
              <h4 className="font-bold text-foreground text-sm truncate group-hover:text-primary transition-colors">
                {child.name}
              </h4>
              {child.englishName && (
                <Badge
                  variant="secondary"
                  className="text-[10px] font-bold py-0 h-4.5 px-1 bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800"
                >
                  {child.englishName}
                </Badge>
              )}
            </div>

            <p className="text-[11px] text-muted-foreground font-medium truncate pt-0.5">
              {child.age} tuổi ({child.birthDate}) • {child.gender} • {child.school} ({child.grade})
            </p>
          </div>
        </div>

        {/* Khóa học & Kết quả Test (Thu gọn) */}
        <div className="rounded-lg border border-border/60 bg-muted/30 px-2.5 py-2 space-y-1.5">
          <div className="flex items-center justify-between gap-1.5 flex-wrap">
            <div className="flex items-center gap-1 min-w-0">
              <Sparkles className="h-3 w-3 text-amber-500 shrink-0" />
              <span className="font-bold text-xs text-foreground truncate">
                {child.targetSubject}
              </span>
            </div>

            <Badge
              className={cn(
                'text-[10px] font-semibold py-0 h-4.5 px-1.5 rounded-md shadow-none',
                getStatusBadgeClass(
                  child.status === 'moi_tiep_nhan'
                    ? 'pending'
                    : child.status === 'chuyen_doi'
                      ? 'active'
                      : child.status === 'that_bai'
                        ? 'inactive'
                        : 'warning'
                )
              )}
            >
              {child.statusLabel}
            </Badge>
          </div>

          <div className="flex items-center justify-between text-[11px] pt-1 border-t border-border/40 gap-1.5 flex-wrap">
            <div className="flex items-center gap-1 truncate min-w-0">
              <Award className="h-3 w-3 text-sky-600 shrink-0" />
              <span className="font-medium text-foreground truncate">
                {child.testResultText}
              </span>
            </div>

            <div className="flex items-center gap-1 font-mono text-[10px] text-muted-foreground shrink-0">
              <Phone className="h-2.5 w-2.5 text-sky-600" />
              <span>{child.studentPhone}</span>
            </div>
          </div>
        </div>

        {/* Mục tiêu học tập / Điểm mạnh (Gọn gàng) */}
        <div className="space-y-1 text-xs">
          {child.learningGoal && (
            <div className="p-1.5 rounded-lg bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200/50 dark:border-emerald-900/40 text-[11px] text-foreground flex items-start gap-1.5">
              <Target className="h-3 w-3 text-emerald-600 mt-0.5 shrink-0" />
              <span className="line-clamp-1">
                <strong className="text-emerald-900 dark:text-emerald-300 font-semibold">Mục tiêu:</strong>{' '}
                {child.learningGoal}
              </span>
            </div>
          )}

          <div className="grid grid-cols-2 gap-1 pt-0.5 text-[10px] text-muted-foreground">
            {child.learningStyle && (
              <div className="p-1 rounded bg-muted/30 border border-border/50 truncate flex items-center gap-1">
                <Brain className="h-2.5 w-2.5 text-purple-600 shrink-0" />
                <span className="truncate">{child.learningStyle}</span>
              </div>
            )}
            {child.strengths && (
              <div className="p-1 rounded bg-muted/30 border border-border/50 truncate flex items-center gap-1">
                <Lightbulb className="h-2.5 w-2.5 text-sky-600 shrink-0" />
                <span className="truncate">{child.strengths}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* FOOTER: ACTIONS & XEM CHÂN DUNG */}
      <div
        onClick={(e) => e.stopPropagation()}
        className="pt-2 mt-2.5 border-t border-border/50 flex items-center justify-between gap-1.5 flex-wrap text-xs"
      >
        <div className="flex items-center gap-1">
          {!child.isCurrent && onSwitchLead && (
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={() => onSwitchLead(child.id)}
              className="h-6 px-2 text-[11px] font-semibold border-primary/40 text-primary hover:bg-primary/10 rounded cursor-pointer"
            >
              <span>Xem Lead</span>
            </Button>
          )}

          {!child.isCurrent && (
            <Button
              type="button"
              size="sm"
              variant="ghost"
              onClick={() => onOpenInNewTab(child.id, child.name, child.code)}
              className="h-6 px-1.5 text-[11px] text-muted-foreground hover:text-foreground rounded cursor-pointer"
              title="Mở tab mới"
            >
              <ExternalLink className="h-3 w-3" />
            </Button>
          )}
        </div>

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation()
            onClickProfile?.(child)
          }}
          className="text-primary hover:text-primary/80 font-bold text-xs flex items-center gap-1 cursor-pointer ml-auto"
        >
          <span>Xem chân dung 360°</span>
          <ExternalLink className="h-2.5 w-2.5" />
        </button>
      </div>
    </div>
  )
}
