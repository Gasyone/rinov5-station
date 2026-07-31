'use client'

import React, { useState, useMemo } from 'react'
import {
  Calendar,
  Building2,
  User,
  ArrowRight,
  BookOpen,
  Users,
  AlertTriangle,
  Info,
  FolderOpen,
  CheckCircle2,
  XCircle,
  AlertCircle,
  HeartHandshake,
} from 'lucide-react'
import { toast } from 'sonner'
import type { ClassRecord } from '@/mocks/classRecords'
import type { RoadmapSession, RosterStudent } from './classesDetailTypes'
import { cleanTeacherName } from './classesDetailHelpers'
import { ClassesSessionSyllabusTab } from './ClassesSessionSyllabusTab'
import { ClassesSessionMediaTab } from './ClassesSessionMediaTab'
import { ClassCodeHoverCell } from '@/components/screens/care/ClassCodeHoverCell'
import { ClassesSessionQualityEvaluation } from './ClassesSessionQualityEvaluation'

interface ClassesSessionDetailSidebarProps {
  session: RoadmapSession
  sessions: RoadmapSession[]
  cls: ClassRecord
  roster?: RosterStudent[]
  isOpenedFromClassScreen?: boolean
  onOpenClassDetail: () => void
  activeRosterCount: number
  presentCount: number
  excusedCount: number
  absentCount: number
  lateCount: number
  sessionTrialCount: number
  careStudentsCount: number
  isCareOnlyFilter: boolean
  onToggleCareOnlyFilter: () => void
}

function getDayOfWeek(dateStr?: string): string {
  if (!dateStr) return 'Thứ 3'
  const parts = dateStr.split('/')
  if (parts.length === 3) {
    const day = parseInt(parts[0], 10)
    const month = parseInt(parts[1], 10) - 1
    const year = parseInt(parts[2], 10)
    const d = new Date(year, month, day)
    if (!isNaN(d.getTime())) {
      const days = ['Chủ nhật', 'Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7']
      return days[d.getDay()]
    }
  }
  return 'Thứ 3'
}

export function ClassesSessionDetailSidebar({
  session,
  sessions,
  cls,
  isOpenedFromClassScreen,
  activeRosterCount,
  presentCount,
  excusedCount,
  absentCount,
  lateCount,
  sessionTrialCount,
  careStudentsCount,
  isCareOnlyFilter,
  onToggleCareOnlyFilter,
}: ClassesSessionDetailSidebarProps) {
  const dayOfWeek = useMemo(() => getDayOfWeek(session.date), [session.date])
  const assistantInfo = session.assistantName || cls.assistant || ''
  const syllabusTitle = cls.syllabus || cls.learningPath || 'IELTS Junior v2.1'

  return (
    <div className="flex-[3] flex flex-col min-h-0 overflow-y-auto gap-3 pt-0.5 px-1 pr-1.5">
      {/* ── SMART CARDS THỐNG KÊ (NẰM TRÊN KHUNG THÔNG TIN BUỔI HỌC) ── */}
      <div className="shrink-0 grid grid-cols-3 gap-1.5">
        <div className="flex items-center gap-1.5 rounded-lg border border-zinc-200 bg-white dark:bg-zinc-900 dark:border-zinc-800 p-2 shadow-2xs">
          <Users className="h-4 w-4 text-zinc-400 shrink-0" />
          <div className="min-w-0">
            <p className="text-[9px] text-muted-foreground font-medium leading-none">Sĩ số</p>
            <p className="text-xs font-bold font-mono text-foreground leading-tight mt-0.5">{activeRosterCount}</p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 rounded-lg border border-emerald-200 bg-emerald-50/60 dark:border-emerald-900/50 dark:bg-emerald-950/20 p-2 shadow-2xs">
          <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
          <div className="min-w-0">
            <p className="text-[9px] text-emerald-600 dark:text-emerald-400 font-medium leading-none">Có mặt</p>
            <p className="text-xs font-bold font-mono text-emerald-700 dark:text-emerald-300 leading-tight mt-0.5">{presentCount}/{activeRosterCount}</p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 rounded-lg border border-red-200 bg-red-50/60 dark:border-red-900/50 dark:bg-red-950/20 p-2 shadow-2xs">
          <XCircle className="h-4 w-4 text-red-500 shrink-0" />
          <div className="min-w-0">
            <p className="text-[9px] text-red-600 dark:text-red-400 font-medium leading-none">Phép/Vắng</p>
            <p className="text-xs font-bold font-mono text-red-700 dark:text-red-300 leading-tight mt-0.5">{excusedCount}·{absentCount}</p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 rounded-lg border border-amber-200 bg-amber-50/60 dark:border-amber-900/50 dark:bg-amber-950/20 p-2 shadow-2xs">
          <AlertCircle className="h-4 w-4 text-amber-500 shrink-0" />
          <div className="min-w-0">
            <p className="text-[9px] text-amber-600 dark:text-amber-400 font-medium leading-none">Trễ</p>
            <p className="text-xs font-bold font-mono text-amber-700 dark:text-amber-300 leading-tight mt-0.5">{lateCount}</p>
          </div>
        </div>

        {(cls.trialStudents ?? 0) > 0 && (
          <div className="flex items-center gap-1.5 rounded-lg border border-violet-200 bg-violet-50/60 dark:border-violet-900/50 dark:bg-violet-950/20 p-2 shadow-2xs">
            <BookOpen className="h-4 w-4 text-violet-500 shrink-0" />
            <div className="min-w-0">
              <p className="text-[9px] text-violet-600 dark:text-violet-400 font-medium leading-none">Trial</p>
              <p className="text-xs font-bold font-mono text-violet-700 dark:text-violet-300 leading-tight mt-0.5">{sessionTrialCount}</p>
            </div>
          </div>
        )}

        <button
          type="button"
          onClick={onToggleCareOnlyFilter}
          className={`flex items-center gap-1.5 rounded-lg border p-2 shadow-2xs transition-colors cursor-pointer text-left ${
            isCareOnlyFilter
              ? 'border-rose-500 bg-rose-500 text-white font-bold'
              : 'border-rose-200 bg-rose-50/60 text-rose-700 hover:bg-rose-100 dark:border-rose-800 dark:bg-rose-950/40 dark:text-rose-300'
          }`}
          title="Nhấp để lọc danh sách học viên cần chăm sóc"
        >
          <HeartHandshake className={`h-4 w-4 shrink-0 ${isCareOnlyFilter ? 'text-white' : 'text-rose-500'}`} />
          <div className="min-w-0">
            <p className={`text-[9px] font-medium leading-none ${isCareOnlyFilter ? 'text-white/80' : 'text-rose-600 dark:text-rose-400'}`}>Cần CS</p>
            <p className="text-xs font-bold font-mono leading-tight mt-0.5">{careStudentsCount}</p>
          </div>
        </button>
      </div>

      {/* ── KHUNG THÔNG TIN BUỔI HỌC ── */}
          <div className="shrink-0 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-2xs p-3.5 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wide text-zinc-500">
              Thông tin buổi học
            </h3>
            <div className="space-y-3 text-xs pt-0.5">
              {/* 1. Lịch học & Giờ học */}
              <div className="grid grid-cols-2 gap-3">
                <div className="flex items-start gap-2.5">
                  <Calendar className="h-4 w-4 text-zinc-400 shrink-0 mt-0.5" />
                  <div className="leading-tight">
                    <p className="text-[10px] text-muted-foreground font-medium mb-0.5">Lịch học</p>
                    <span className="font-semibold text-foreground font-mono block">
                      {session.date}
                    </span>
                    <span className="text-[11px] font-medium text-muted-foreground">
                      {dayOfWeek}
                    </span>
                  </div>
                </div>

                <div className="leading-tight">
                  <p className="text-[10px] text-muted-foreground font-medium mb-0.5">Giờ học</p>
                  <span className="font-semibold text-foreground font-mono block">
                    {session.startTime}–{session.endTime}
                  </span>
                </div>
              </div>

              {/* 2. Cơ sở & Phòng học */}
              <div className="grid grid-cols-2 gap-3">
                <div className="flex items-start gap-2.5">
                  <Building2 className="h-4 w-4 text-zinc-400 shrink-0 mt-0.5" />
                  <div className="leading-tight min-w-0">
                    <p className="text-[10px] text-muted-foreground font-medium mb-0.5">Cơ sở</p>
                    <span className="font-semibold text-foreground truncate block">
                      {cls.branch || 'RinoEdu Linh Đàm'}
                    </span>
                  </div>
                </div>

                <div className="leading-tight">
                  <p className="text-[10px] text-muted-foreground font-medium mb-0.5">Phòng học</p>
                  <span className="font-semibold text-foreground flex items-center gap-1">
                    {session.room}
                    <button
                      onClick={() => toast.info('Tính năng báo cáo sự cố phòng học đang được phát triển!')}
                      className="inline-flex h-4 w-4 items-center justify-center rounded-full hover:bg-rose-50 text-rose-500 cursor-pointer border-none p-0 shrink-0"
                      title="Báo cáo sự cố phòng học"
                    >
                      <AlertTriangle className="h-3 w-3 fill-rose-100/50" />
                    </button>
                  </span>
                </div>
              </div>

              {/* 3. Tên lớp & Mã lớp */}
              <div className="grid grid-cols-2 gap-3">
                <div className="flex items-start gap-2.5">
                  <BookOpen className="h-4 w-4 text-zinc-400 shrink-0 mt-0.5" />
                  <div className="leading-tight min-w-0">
                    <p className="text-[10px] text-muted-foreground font-medium mb-0.5">Tên lớp</p>
                    <span className="font-semibold text-foreground truncate block" title={cls.name}>
                      {cls.name || 'Lớp học'}
                    </span>
                  </div>
                </div>

                <div className="leading-tight">
                  <p className="text-[10px] text-muted-foreground font-medium mb-0.5">Mã lớp</p>
                  {isOpenedFromClassScreen ? (
                    <span className="font-semibold text-foreground font-mono">{cls.code}</span>
                  ) : (
                    <ClassCodeHoverCell
                      classCode={cls.code}
                      subject={cls.level}
                      level={cls.subLevel || ''}
                      teacherCode={cls.teacher}
                      schedule={cls.schedule}
                    />
                  )}
                </div>
              </div>

              {/* 4. Giáo viên & Trợ giảng */}
              <div className="grid grid-cols-2 gap-3">
                <div className="flex items-start gap-2.5">
                  <User className="h-4 w-4 text-zinc-400 shrink-0 mt-0.5" />
                  <div className="leading-tight min-w-0">
                    <p className="text-[10px] text-muted-foreground font-medium mb-0.5">Giáo viên</p>
                    {session.substituteTeacherName ? (
                      <span className="inline-flex items-center gap-0.5 font-semibold text-xs truncate max-w-full">
                        <span className="line-through text-muted-foreground/50">{cleanTeacherName(session.teacherName)}</span>
                        <ArrowRight className="h-2.5 w-2.5 mx-0.5 text-muted-foreground/40 shrink-0" />
                        <span className="text-amber-600 font-bold">{cleanTeacherName(session.substituteTeacherName)}</span>
                      </span>
                    ) : (
                      <span className="font-semibold text-foreground truncate block">{cleanTeacherName(session.teacherName)}</span>
                    )}
                  </div>
                </div>

                <div className="leading-tight min-w-0">
                  <p className="text-[10px] text-muted-foreground font-medium mb-0.5">Trợ giảng</p>
                  <span className="font-semibold text-foreground truncate block">
                    {assistantInfo ? cleanTeacherName(assistantInfo) : '—'}
                  </span>
                </div>
              </div>

              {/* 5. Quy mô & Trình độ */}
              <div className="grid grid-cols-2 gap-3">
                <div className="flex items-start gap-2.5">
                  <Users className="h-4 w-4 text-zinc-400 shrink-0 mt-0.5" />
                  <div className="leading-tight">
                    <p className="text-[10px] text-muted-foreground font-medium mb-0.5">Quy mô</p>
                    <span className="font-semibold text-foreground">
                      {cls.classRatio || '1:10'}
                    </span>
                  </div>
                </div>

                <div className="leading-tight">
                  <p className="text-[10px] text-muted-foreground font-medium mb-0.5">Trình độ</p>
                  <span className="font-semibold text-foreground">
                    {cls.level || 'TOEIC'}
                  </span>
                </div>
              </div>
            </div>
          </div>



          {/* ── KHUNG CHƯƠNG TRÌNH ── */}
          <div className="shrink-0 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-2xs p-3.5 space-y-2.5">
            <h3 className="font-bold text-zinc-500 text-xs uppercase tracking-wide truncate" title={`KHUNG CHƯƠNG TRÌNH: ${syllabusTitle}`}>
              KHUNG CHƯƠNG TRÌNH: {syllabusTitle}
            </h3>
            <div>
              <ClassesSessionSyllabusTab session={session} sessions={sessions} />
            </div>
          </div>

          {/* ── KHUNG CHẤT LƯỢNG ── */}
          <ClassesSessionQualityEvaluation
            sessionId={session.id}
            sessionTopic={session.topic}
            sessionStatus={session.status}
          />
    </div>
  )
}
