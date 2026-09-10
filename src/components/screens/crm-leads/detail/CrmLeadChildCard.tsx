'use client'

import {
  Phone,
  ExternalLink,
  FileText,
  Sparkles,
  GraduationCap,
  Baby,
  Target,
  Heart,
  Brain,
  Lightbulb,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { getStatusBadgeClass } from '@/lib/statusColors'

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
}

interface CrmLeadChildCardProps {
  child: ChildPersonaItem
  onSwitchLead?: (leadId: string) => void
  onOpenInNewTab: (childId: string, childName: string, childCode: string) => void
}

export function CrmLeadChildCard({
  child,
  onSwitchLead,
  onOpenInNewTab,
}: CrmLeadChildCardProps) {
  return (
    <div
      className={cn(
        'p-3.5 lg:p-4 rounded-xl border transition-all space-y-3',
        child.isCurrent
          ? 'border-primary/50 bg-primary/[0.015] dark:bg-primary/[0.03] shadow-xs ring-1 ring-primary/20'
          : 'border-border/70 bg-card hover:border-border shadow-2xs'
      )}
    >
      {/* TẦNG 1: IDENTITY (CHỦ THỂ HỌC SINH & TÊN TIẾNG ANH) */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2.5">
          <div
            className={cn(
              'flex h-9 w-9 items-center justify-center rounded-full font-bold text-xs shrink-0 shadow-3xs',
              child.isCurrent
                ? 'bg-primary/10 text-primary border border-primary/30'
                : 'bg-muted text-muted-foreground border border-border/60'
            )}
          >
            {child.isCurrent ? (
              <Baby className="h-4.5 w-4.5 text-primary" />
            ) : (
              <GraduationCap className="h-4.5 w-4.5 text-muted-foreground" />
            )}
          </div>

          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-bold text-foreground text-sm leading-tight">
                {child.name}
              </span>
              {child.englishName && (
                <Badge variant="secondary" className="text-[11px] font-semibold py-0.5 px-2 bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                  English: {child.englishName}
                </Badge>
              )}
              <span className="font-mono text-xs font-bold text-sky-700 dark:text-sky-400 bg-sky-50 dark:bg-sky-950/60 px-2 py-0.5 rounded border border-sky-200 dark:border-sky-800">
                {child.code}
              </span>
              {child.isCurrent ? (
                <Badge className="text-[10px] font-bold bg-primary text-primary-foreground">
                  Học viên đang xem
                </Badge>
              ) : (
                <Badge variant="outline" className="text-[10px] font-medium text-muted-foreground">
                  Anh/Chị/Em
                </Badge>
              )}
            </div>
            <p className="text-xs text-muted-foreground font-medium pt-0.5">
              {child.birthDate} ({child.age} tuổi) • {child.gender} • {child.school} ({child.grade})
            </p>
          </div>
        </div>

        {/* Cụm Action Buttons */}
        <div className="flex items-center gap-2 ml-auto">
          {!child.isCurrent && onSwitchLead && (
            <Button
              size="sm"
              variant="outline"
              onClick={() => onSwitchLead(child.id)}
              className="h-7.5 px-3 text-xs font-semibold border-primary/30 text-primary hover:bg-primary/10 rounded-lg cursor-pointer shadow-3xs"
              title={`Xem chi tiết Lead của ${child.name}`}
            >
              <span>Chuyển xem Lead này</span>
            </Button>
          )}
          {!child.isCurrent && (
            <Button
              size="sm"
              variant="ghost"
              onClick={() => onOpenInNewTab(child.id, child.name, child.code)}
              className="h-7.5 px-2.5 text-xs font-medium text-muted-foreground hover:text-foreground rounded-lg cursor-pointer flex items-center gap-1"
              title={`Mở chi tiết Lead của ${child.name} trong tab trình duyệt mới`}
            >
              <ExternalLink className="h-3.5 w-3.5" />
              <span>Mở tab mới</span>
            </Button>
          )}
        </div>
      </div>

      {/* TẦNG 2: FOCAL ACADEMIC ZONE (KHÓA HỌC MỤC TIÊU & TIẾN TRÌNH TƯ VẤN) */}
      <div className="bg-slate-50 dark:bg-zinc-800/60 border border-slate-200/80 dark:border-zinc-700/80 rounded-xl p-2.5 space-y-2">
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <div className="flex items-center gap-2 min-w-0">
            <span className="text-xs text-muted-foreground font-medium shrink-0">
              Chương trình mục tiêu:
            </span>
            <span className="font-bold text-sm text-foreground flex items-center gap-1.5 truncate">
              <Sparkles className="h-3.5 w-3.5 text-amber-500 shrink-0" />
              <span>{child.targetSubject}</span>
            </span>
          </div>

          <Badge
            className={cn(
              'text-xs font-semibold py-0.5 px-2.5 rounded-full shadow-none',
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

        <div className="flex items-center justify-between text-xs pt-1.5 border-t border-border/40 gap-2 flex-wrap">
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground font-medium">Đánh giá / Test:</span>
            <span className="font-semibold text-foreground bg-background px-2.5 py-0.5 rounded-md border border-border/60 shadow-3xs">
              {child.testResultText}
            </span>
          </div>

          <div className="flex items-center gap-1.5 font-mono text-xs text-muted-foreground">
            <Phone className="h-3.5 w-3.5 text-sky-600" />
            <span>{child.studentPhone}</span>
          </div>
        </div>
      </div>

      {/* TẦNG 3: MỤC TIÊU HỌC TẬP CỦA BÉ */}
      {child.learningGoal && (
        <div className="p-2.5 rounded-lg bg-emerald-50/50 dark:bg-emerald-950/30 border border-emerald-200/50 dark:border-emerald-900/50 text-xs text-foreground flex items-start gap-2 leading-relaxed">
          <Target className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400 mt-0.5 shrink-0" />
          <div>
            <strong className="text-emerald-900 dark:text-emerald-300 font-semibold">
              Mục tiêu học tập của con:
            </strong>{' '}
            <span>{child.learningGoal}</span>
          </div>
        </div>
      )}

      {/* TẦNG 4: TÍNH CÁCH, SỞ THÍCH, PHONG CÁCH TIẾP THU (VARK) & ĐIỂM MẠNH/HẠN CHẾ */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs pt-0.5">
        {child.personality && (
          <div className="p-2.5 rounded-lg bg-card border border-border/70 flex items-start gap-2">
            <Heart className="h-3.5 w-3.5 text-rose-500 mt-0.5 shrink-0" />
            <div>
              <strong className="text-foreground font-semibold">Tính cách của con:</strong>{' '}
              <span className="text-muted-foreground">{child.personality}</span>
            </div>
          </div>
        )}

        {child.interests && (
          <div className="p-2.5 rounded-lg bg-card border border-border/70 flex items-start gap-2">
            <Sparkles className="h-3.5 w-3.5 text-amber-500 mt-0.5 shrink-0" />
            <div>
              <strong className="text-foreground font-semibold">Sở thích &amp; Đam mê:</strong>{' '}
              <span className="text-muted-foreground">{child.interests}</span>
            </div>
          </div>
        )}

        {child.learningStyle && (
          <div className="p-2.5 rounded-lg bg-card border border-border/70 flex items-start gap-2">
            <Brain className="h-3.5 w-3.5 text-purple-600 mt-0.5 shrink-0" />
            <div>
              <strong className="text-foreground font-semibold">Phong cách tiếp thu (VARK):</strong>{' '}
              <span className="text-muted-foreground">{child.learningStyle}</span>
            </div>
          </div>
        )}

        {child.strengths && (
          <div className="p-2.5 rounded-lg bg-card border border-border/70 flex items-start gap-2">
            <Lightbulb className="h-3.5 w-3.5 text-sky-600 mt-0.5 shrink-0" />
            <div>
              <strong className="text-foreground font-semibold">Điểm mạnh / Hạn chế:</strong>{' '}
              <span className="text-muted-foreground">
                {child.strengths}
                {child.weaknesses ? ` • Cần rèn: ${child.weaknesses}` : ''}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* TẦNG 5: GHI CHÚ SƯ PHẠM */}
      {child.notes && (
        <div className="p-2.5 rounded-lg bg-muted/30 border border-border/50 text-xs text-muted-foreground flex items-start gap-2 leading-relaxed">
          <FileText className="h-3.5 w-3.5 text-muted-foreground/80 mt-0.5 shrink-0" />
          <span>
            <strong className="text-foreground font-semibold">Ghi chú sư phạm &amp; tư vấn:</strong>{' '}
            {child.notes}
          </span>
        </div>
      )}
    </div>
  )
}
