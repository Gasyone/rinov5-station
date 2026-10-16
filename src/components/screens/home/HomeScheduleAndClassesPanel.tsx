'use client'

import React, { useState } from 'react'
import {
  CalendarDays,
  GraduationCap,
  ArrowUpRight,
  ChevronDown,
  Rows2,
  Users,
} from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu'
import { EmptyState } from '@/components/shared'
import { SessionCard } from '@/components/screens/calendar/SessionCardV2'
import type { ClassRecord } from '@/mocks/classRecords'
import type { ClassSession } from '@/mocks/calendarSchedule'
import type { TodayScheduleItem } from './homeTypes'

interface HomeScheduleAndClassesPanelProps {
  classes: ClassRecord[]
  sessions: TodayScheduleItem[]
  onOpenClassDetail: (cls: ClassRecord) => void
  onOpenSessionDetail: (session: TodayScheduleItem) => void
  onNavigateClasses: () => void
  onNavigateCalendar: () => void
}

export type LeftPanelViewMode = 'schedule' | 'classes' | 'split'

function resolveClassSession(item: TodayScheduleItem): ClassSession {
  if (item.rawSession) return item.rawSession

  return {
    id: item.id,
    classCode: item.classCode,
    className: item.className,
    title: item.lessonTitle || item.className,
    lessonSubtitle: '',
    subject: item.subject,
    teacher: item.teacher,
    substituteTeacher: item.substituteTeacher,
    assistantTeacher: item.assistantTeacher,
    branch: item.branch,
    schoolRoom: item.room,
    level: item.level,
    date: new Date().toISOString().split('T')[0],
    dateDisplay: 'Hôm nay',
    dateBucket: item.status === 'completed' ? 'past' : 'today',
    timeLabel: item.startTime,
    endTimeLabel: item.endTime,
    statusLabel: item.statusLabel,
    type:
      item.type === 'digi_session'
        ? 'digi_session'
        : item.type === 'test_session' || item.type === 'placement_test'
        ? 'test_session'
        : 'class_session',
    typeLabel: item.typeLabel,
    totalStudents: item.totalStudents,
    officialStudents: item.officialStudents,
    trialStudents: item.trialStudents,
    makeUpStudents: item.makeUpStudents,
    attendedStudents: item.status === 'completed' ? item.officialStudents : undefined,
    status:
      item.status === 'completed'
        ? 'completed'
        : item.status === 'cancelled'
        ? 'cancelled'
        : 'confirmed',
  }
}

export function HomeScheduleAndClassesPanel({
  classes,
  sessions,
  onOpenClassDetail,
  onOpenSessionDetail,
  onNavigateClasses,
  onNavigateCalendar,
}: HomeScheduleAndClassesPanelProps) {
  // Mode: schedule (chỉ xem lịch), classes (chỉ xem lớp), split (xem cả hai)
  const [viewMode, setViewMode] = useState<LeftPanelViewMode>('split')

  // Filter cho Lịch
  const [scheduleFilter, setScheduleFilter] = useState<'all' | 'morning' | 'afternoon' | 'evening' | 'test'>('all')

  // Filter cho Lớp
  const [classFilter, setClassFilter] = useState<'running' | 'upcoming' | 'all'>('running')

  const runningClasses = classes.filter((c) => c.status === 'dang_hoc')
  const upcomingClasses = classes.filter((c) => c.status === 'cho_khai_giang' || c.status === 'mo_chieu_sinh')

  const displayedClasses =
    classFilter === 'all'
      ? classes
      : classFilter === 'upcoming'
      ? upcomingClasses
      : runningClasses

  const filteredSessions = sessions.filter((s) => {
    if (scheduleFilter === 'test') {
      return s.type === 'placement_test' || s.type === 'trial_class' || s.trialStudents > 0
    }
    if (scheduleFilter === 'morning') {
      const startH = parseInt(s.startTime.split(':')[0], 10)
      return startH < 12
    }
    if (scheduleFilter === 'afternoon') {
      const startH = parseInt(s.startTime.split(':')[0], 10)
      return startH >= 12 && startH < 18
    }
    if (scheduleFilter === 'evening') {
      const startH = parseInt(s.startTime.split(':')[0], 10)
      return startH >= 18
    }
    return true
  })

  // Schedule sub-view
  const renderScheduleContent = (isCompact: boolean = false) => (
    <div className="flex flex-col flex-1 min-h-0 space-y-1.5">
      {/* Thanh lọc khung giờ */}
      <div className="flex items-center justify-between gap-1 shrink-0 px-0.5">
        <div className="flex items-center gap-1 flex-wrap text-xs">
          <button
            type="button"
            onClick={() => setScheduleFilter('all')}
            className={`px-1.5 py-0.5 rounded text-xs leading-none transition-all cursor-pointer ${
              scheduleFilter === 'all'
                ? 'bg-primary/10 text-primary font-medium border border-primary/20'
                : 'text-muted-foreground hover:text-foreground hover:bg-muted/60'
            }`}
          >
            Tất cả ({sessions.length})
          </button>
          <button
            type="button"
            onClick={() => setScheduleFilter('morning')}
            className={`px-1.5 py-0.5 rounded text-xs leading-none transition-all cursor-pointer ${
              scheduleFilter === 'morning'
                ? 'bg-primary/10 text-primary font-medium border border-primary/20'
                : 'text-muted-foreground hover:text-foreground hover:bg-muted/60'
            }`}
          >
            Sáng
          </button>
          <button
            type="button"
            onClick={() => setScheduleFilter('afternoon')}
            className={`px-1.5 py-0.5 rounded text-xs leading-none transition-all cursor-pointer ${
              scheduleFilter === 'afternoon'
                ? 'bg-primary/10 text-primary font-medium border border-primary/20'
                : 'text-muted-foreground hover:text-foreground hover:bg-muted/60'
            }`}
          >
            Chiều
          </button>
          <button
            type="button"
            onClick={() => setScheduleFilter('evening')}
            className={`px-1.5 py-0.5 rounded text-xs leading-none transition-all cursor-pointer ${
              scheduleFilter === 'evening'
                ? 'bg-primary/10 text-primary font-medium border border-primary/20'
                : 'text-muted-foreground hover:text-foreground hover:bg-muted/60'
            }`}
          >
            Tối
          </button>
          <button
            type="button"
            onClick={() => setScheduleFilter('test')}
            className={`px-1.5 py-0.5 rounded text-xs leading-none transition-all cursor-pointer flex items-center gap-0.5 ${
              scheduleFilter === 'test'
                ? 'bg-amber-500/10 text-amber-700 dark:text-amber-400 font-medium border border-amber-500/20'
                : 'text-muted-foreground hover:text-foreground hover:bg-muted/60'
            }`}
          >
            <span>Test/Trải nghiệm</span>
          </button>
        </div>

        {isCompact && (
          <button
            type="button"
            onClick={onNavigateCalendar}
            className="text-xs text-primary hover:underline flex items-center gap-0.5 shrink-0 cursor-pointer"
            title="Mở toàn bộ thời khóa biểu"
          >
            <span>Lịch chi tiết</span>
            <ArrowUpRight className="w-3 h-3" />
          </button>
        )}
      </div>

      {/* Danh sách ca học */}
      {filteredSessions.length === 0 ? (
        <EmptyState
          title="Không có ca học nào trong khung giờ này"
          className="py-4 text-xs flex-1"
        />
      ) : (
        <div className="space-y-1.5 flex-1 min-h-0 overflow-y-auto pr-1 custom-scrollbar">
          {filteredSessions.map((item) => {
            const classSession = resolveClassSession(item)
            return (
              <div
                key={item.id}
                className="cursor-pointer transition-transform duration-150 active:scale-[0.99] rounded-lg border border-border/70 hover:border-primary/50 shadow-3xs"
              >
                <SessionCard
                  session={classSession}
                  onClick={() => onOpenSessionDetail(item)}
                />
              </div>
            )
          })}
        </div>
      )}
    </div>
  )

  // Classes sub-view
  const renderClassesContent = (isCompact: boolean = false) => (
    <div className="flex flex-col flex-1 min-h-0 space-y-1.5">
      {/* Bộ lọc trạng thái lớp */}
      <div className="flex items-center justify-between gap-1 shrink-0 px-0.5">
        <div className="flex items-center gap-1 text-xs">
          <button
            type="button"
            onClick={() => setClassFilter('running')}
            className={`px-1.5 py-0.5 rounded text-xs leading-none transition-all cursor-pointer ${
              classFilter === 'running'
                ? 'bg-indigo-500/10 text-indigo-700 dark:text-indigo-400 font-medium border border-indigo-500/20'
                : 'text-muted-foreground hover:text-foreground hover:bg-muted/60'
            }`}
          >
            Đang học ({runningClasses.length})
          </button>
          <button
            type="button"
            onClick={() => setClassFilter('upcoming')}
            className={`px-1.5 py-0.5 rounded text-xs leading-none transition-all cursor-pointer ${
              classFilter === 'upcoming'
                ? 'bg-amber-500/10 text-amber-700 dark:text-amber-400 font-medium border border-amber-500/20'
                : 'text-muted-foreground hover:text-foreground hover:bg-muted/60'
            }`}
          >
            Chờ mở ({upcomingClasses.length})
          </button>
          <button
            type="button"
            onClick={() => setClassFilter('all')}
            className={`px-1.5 py-0.5 rounded text-xs leading-none transition-all cursor-pointer ${
              classFilter === 'all'
                ? 'bg-primary/10 text-primary font-medium border border-primary/20'
                : 'text-muted-foreground hover:text-foreground hover:bg-muted/60'
            }`}
          >
            Tất cả ({classes.length})
          </button>
        </div>

        {isCompact && (
          <button
            type="button"
            onClick={onNavigateClasses}
            className="text-xs text-primary hover:underline flex items-center gap-0.5 shrink-0 cursor-pointer"
            title="Mở toàn bộ danh sách lớp học"
          >
            <span>Tất cả lớp</span>
            <ArrowUpRight className="w-3 h-3" />
          </button>
        )}
      </div>

      {/* Danh sách lớp học */}
      {displayedClasses.length === 0 ? (
        <EmptyState
          title="Không có lớp học nào trong mục này"
          className="py-4 text-xs flex-1"
        />
      ) : (
        <div className="space-y-1.5 flex-1 min-h-0 overflow-y-auto pr-1 custom-scrollbar">
          {displayedClasses.map((cls) => {
            const isSpecialCare = (cls.specialCareCount && cls.specialCareCount > 0) || cls.status === 'tam_dung'
            const max = cls.maxStudents || 15
            const enrolled = cls.enrolledStudents || 0
            const fillPct = Math.round((enrolled / max) * 100)

            return (
              <div
                key={cls.id}
                onClick={() => onOpenClassDetail(cls)}
                className={`group rounded-lg border px-2.5 py-1.5 transition-all space-y-1 shadow-3xs cursor-pointer ${
                  isSpecialCare
                    ? 'border-l-4 border-l-amber-500 border-border/70 bg-amber-500/5 hover:bg-amber-500/10'
                    : 'border-border/70 bg-card/80 hover:border-primary/50 hover:bg-muted/40'
                }`}
              >
                {/* DÒNG 1: Tên lớp + Sĩ số & Phòng */}
                <div className="flex items-center justify-between gap-1.5 min-w-0">
                  <div className="flex items-center gap-1.5 min-w-0 flex-1">
                    <span className="font-mono text-xs text-muted-foreground/80 shrink-0">
                      {cls.code}
                    </span>
                    <h4 className="text-sm font-medium text-foreground tracking-tight truncate group-hover:text-primary transition-colors">
                      {cls.name}
                    </h4>
                  </div>

                  <div className="flex items-center gap-1 shrink-0 text-xs">
                    <span className="inline-flex items-center gap-0.5 text-muted-foreground">
                      <Users className="w-3 h-3 text-muted-foreground/70" />
                      <span className="tabular-nums font-medium">{enrolled}</span>
                      <span className="opacity-60">/{max}</span>
                    </span>
                  </div>
                </div>

                {/* DÒNG 2: GV + Lịch + Phòng */}
                <div className="flex items-center justify-between gap-1 text-xs text-muted-foreground">
                  <span className="truncate max-w-[130px]">
                    GV: {cls.teacher || 'Chưa gán'}
                  </span>
                  <div className="flex items-center gap-1 text-xs shrink-0">
                    <span className="truncate max-w-[110px]">{cls.schedule || 'T2-T4'}</span>
                    <span>•</span>
                    <span className="truncate max-w-[70px]">{cls.room || 'P101'}</span>
                  </div>
                </div>

                {/* DÒNG 3: Sĩ số lấp đầy lớp */}
                <div className="space-y-0.5 pt-0.5">
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>Lấp đầy chỗ học</span>
                    <span className="tabular-nums font-mono">{fillPct}%</span>
                  </div>
                  <div className="w-full h-1 bg-muted/80 rounded-full overflow-hidden">
                    <div
                      className={`h-1 rounded-full transition-all duration-300 ${
                        fillPct >= 90
                          ? 'bg-rose-500'
                          : fillPct >= 70
                          ? 'bg-emerald-500'
                          : 'bg-primary'
                      }`}
                      style={{ width: `${Math.min(fillPct, 100)}%` }}
                    />
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )

  return (
    <div className="bg-card border border-border/70 rounded-xl p-2 sm:p-2.5 shadow-xs flex flex-col h-full space-y-1.5 min-h-0 overflow-hidden">
      {/* 1. HEADER CHÍNH: BỘ CHUYỂN TAB CỘT TRÁI (LỊCH | LỚP | XEM CẢ 2) */}
      <div className="flex items-center justify-between gap-1.5 pb-1 border-b border-border/50 shrink-0">
        <div className="flex items-center gap-1.5 min-w-0">
          <div className="flex h-5 w-5 items-center justify-center rounded-md bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 shrink-0">
            {viewMode === 'schedule' ? (
              <CalendarDays className="w-3.5 h-3.5" />
            ) : viewMode === 'classes' ? (
              <GraduationCap className="w-3.5 h-3.5" />
            ) : (
              <Rows2 className="w-3.5 h-3.5" />
            )}
          </div>

          {/* Segmented Control Chuyển Tab: Lịch hôm nay | Lớp học | Xem cả 2 */}
          <div className="inline-flex items-center rounded-md bg-muted/60 p-0.5 text-xs shrink-0">
            <button
              type="button"
              onClick={() => setViewMode('schedule')}
              className={`px-2 py-0.5 rounded text-xs leading-none transition-all cursor-pointer flex items-center gap-1 ${
                viewMode === 'schedule'
                  ? 'bg-background text-foreground shadow-2xs font-medium'
                  : 'text-muted-foreground hover:text-foreground font-normal'
              }`}
            >
              <CalendarDays className="w-3 h-3 shrink-0" />
              <span>Lịch ({sessions.length})</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode('classes')}
              className={`px-2 py-0.5 rounded text-xs leading-none transition-all cursor-pointer flex items-center gap-1 ${
                viewMode === 'classes'
                  ? 'bg-background text-foreground shadow-2xs font-medium'
                  : 'text-muted-foreground hover:text-foreground font-normal'
              }`}
            >
              <GraduationCap className="w-3 h-3 shrink-0" />
              <span>Lớp ({runningClasses.length})</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode('split')}
              className={`px-2 py-0.5 rounded text-xs leading-none transition-all cursor-pointer flex items-center gap-1 ${
                viewMode === 'split'
                  ? 'bg-background text-primary shadow-2xs font-medium'
                  : 'text-muted-foreground hover:text-foreground font-normal'
              }`}
              title="Xem cả Lịch và Lớp học trên cùng 1 cột"
            >
              <Rows2 className="w-3 h-3 shrink-0" />
              <span>Xem cả 2</span>
            </button>
          </div>
        </div>

        {/* Nút link chuyển nhanh sang trang quản lý tương ứng */}
        <div className="flex items-center gap-1 shrink-0">
          {viewMode === 'schedule' && (
            <button
              type="button"
              onClick={onNavigateCalendar}
              className="text-xs text-muted-foreground hover:text-primary flex items-center gap-0.5 transition-colors cursor-pointer"
              title="Mở toàn bộ thời khóa biểu"
            >
              <span className="hidden sm:inline">Lịch chi tiết</span>
              <ArrowUpRight className="w-3 h-3" />
            </button>
          )}

          {viewMode === 'classes' && (
            <button
              type="button"
              onClick={onNavigateClasses}
              className="text-xs text-muted-foreground hover:text-primary flex items-center gap-0.5 transition-colors cursor-pointer"
              title="Mở danh sách lớp học"
            >
              <span className="hidden sm:inline">Trang lớp</span>
              <ArrowUpRight className="w-3 h-3" />
            </button>
          )}

          {viewMode === 'split' && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  type="button"
                  className="h-6 px-1.5 text-xs text-muted-foreground hover:text-foreground bg-muted/40 hover:bg-muted/70 rounded flex items-center gap-0.5 transition-colors cursor-pointer select-none"
                  title="Mở trang quản lý"
                >
                  <span>Mở rộng</span>
                  <ChevronDown className="w-3 h-3 opacity-60" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="min-w-[130px] p-1 rounded-lg text-xs">
                <DropdownMenuItem
                  onClick={onNavigateCalendar}
                  className="py-1.5 px-2 flex items-center justify-between cursor-pointer"
                >
                  <span>Thời khóa biểu</span>
                  <ArrowUpRight className="w-3 h-3 text-muted-foreground ml-1" />
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={onNavigateClasses}
                  className="py-1.5 px-2 flex items-center justify-between cursor-pointer"
                >
                  <span>Quản lý lớp học</span>
                  <ArrowUpRight className="w-3 h-3 text-muted-foreground ml-1" />
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>

      {/* 2. NỘI DUNG CHÍNH CỦA CỘT TRÁI */}
      {viewMode === 'schedule' && renderScheduleContent(false)}

      {viewMode === 'classes' && renderClassesContent(false)}

      {viewMode === 'split' && (
        <div className="flex-1 min-h-0 flex flex-col gap-2">
          {/* Nửa trên: Lịch hôm nay (50% flex-1) */}
          <div className="flex-1 min-h-0 flex flex-col space-y-1">
            <div className="flex items-center justify-between gap-1 shrink-0 pb-0.5">
              <span className="text-xs font-semibold text-foreground/90 flex items-center gap-1">
                <CalendarDays className="w-3.5 h-3.5 text-primary" />
                <span>Lịch hôm nay ({filteredSessions.length})</span>
              </span>
              <button
                type="button"
                onClick={onNavigateCalendar}
                className="text-xs text-muted-foreground hover:text-primary flex items-center gap-0.5 transition-colors cursor-pointer"
              >
                <span>Xem lịch</span>
                <ArrowUpRight className="w-3 h-3" />
              </button>
            </div>
            {renderScheduleContent(true)}
          </div>

          {/* Đường phân cách tinh tế giữa 2 phần */}
          <div className="border-t border-border/60 shrink-0" />

          {/* Nửa dưới: Lớp học quản lý (50% flex-1) */}
          <div className="flex-1 min-h-0 flex flex-col space-y-1">
            <div className="flex items-center justify-between gap-1 shrink-0 pb-0.5">
              <span className="text-xs font-semibold text-foreground/90 flex items-center gap-1">
                <GraduationCap className="w-3.5 h-3.5 text-indigo-500" />
                <span>Lớp học quản lý ({displayedClasses.length})</span>
              </span>
              <button
                type="button"
                onClick={onNavigateClasses}
                className="text-xs text-muted-foreground hover:text-primary flex items-center gap-0.5 transition-colors cursor-pointer"
              >
                <span>Xem lớp</span>
                <ArrowUpRight className="w-3 h-3" />
              </button>
            </div>
            {renderClassesContent(true)}
          </div>
        </div>
      )}
    </div>
  )
}
