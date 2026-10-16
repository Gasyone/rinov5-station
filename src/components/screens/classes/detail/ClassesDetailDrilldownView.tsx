'use client'

import { ArrowLeft, Clock, FolderOpen, GraduationCap, Plus, Users } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import type { ClassRecord } from '@/mocks/classRecords'
import type { RoadmapSession, RosterStudent, ClassAuditLog, ClassNote } from './classesDetailTypes'

// Components for subjects
import { ClassesDetailRoster } from './ClassesDetailRoster'
import { ClassesDetailSessionsV2 } from './ClassesDetailSessionsV2'
import { ClassesSessionMediaTab } from './ClassesSessionMediaTab'

export interface ClassesDetailDrilldownViewProps {
  cls: ClassRecord
  subject: 'students' | 'sessions' | 'media' | 'logs'
  sessions: RoadmapSession[]
  roster: RosterStudent[]
  logs: ClassAuditLog[]
  classNotes?: ClassNote[]
  onBack: () => void
  onAddStudent: () => void
  onStudentClick: (id: string) => void
  onCareClick: (student: RosterStudent) => void
  onMonthlyReportClick: (student: RosterStudent) => void
  onRemoveStudent: (id: string) => void
  onUpdateSession: (id: string, updates: Partial<RoadmapSession>) => void
  onAddClassNote?: (text: string) => void
  onEditRoadmap?: () => void
  validationErrors?: Record<string, string>
}

export function ClassesDetailDrilldownView({
  cls,
  subject,
  sessions,
  roster,
  logs,
  classNotes,
  onBack,
  onAddStudent,
  onStudentClick,
  onCareClick,
  onMonthlyReportClick,
  onRemoveStudent,
  onUpdateSession,
  onAddClassNote,
  onEditRoadmap,
  validationErrors,
}: ClassesDetailDrilldownViewProps) {
  // Title and metadata by subject
  const subjectConfig = {
    students: {
      title: 'Danh sách học viên',
      icon: Users,
      iconColor: 'text-emerald-600 dark:text-emerald-400 bg-emerald-500/10',
      countText: `${roster.length} học viên`,
    },
    sessions: {
      title: 'Lộ trình & Danh sách buổi học',
      icon: GraduationCap,
      iconColor: 'text-sky-600 dark:text-sky-400 bg-sky-500/10',
      countText: `${sessions.length} buổi học`,
    },
    media: {
      title: 'Kho tài liệu & Đa phương tiện',
      icon: FolderOpen,
      iconColor: 'text-amber-600 dark:text-amber-400 bg-amber-500/10',
      countText: '18 tệp',
    },
    logs: {
      title: 'Nhật ký & Lịch sử cập nhật',
      icon: Clock,
      iconColor: 'text-purple-600 dark:text-purple-400 bg-purple-500/10',
      countText: `${logs.length} bản ghi`,
    },
  }[subject]

  const Icon = subjectConfig.icon

  return (
    <div className="flex flex-col flex-1 min-h-0 w-full overflow-hidden bg-background">
      {/* 1. Drilldown Navigation Bar */}
      <div className="flex shrink-0 items-center justify-between border-b border-border/60 px-4 py-2.5 bg-muted/20">
        <div className="flex items-center gap-3 min-w-0">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onBack}
            className="h-7 px-2.5 text-xs font-semibold gap-1.5 shadow-2xs hover:bg-background cursor-pointer"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Quay lại Chi tiết lớp</span>
          </Button>

          <div className="h-4 w-[1px] bg-border/60" />

          <div className="flex items-center gap-2 min-w-0">
            <div className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-md ${subjectConfig.iconColor}`}>
              <Icon className="h-3.5 w-3.5" />
            </div>
            <div className="flex items-baseline gap-2 min-w-0 truncate">
              <h2 className="text-sm font-bold text-foreground truncate">
                {subjectConfig.title}
              </h2>
              <span className="text-xs text-muted-foreground hidden sm:inline">•</span>
              <span className="text-xs font-medium text-muted-foreground truncate hidden sm:inline">
                {cls.name}
              </span>
              <Badge variant="secondary" className="text-[10.5px] px-1.5 py-0 h-4.5 font-bold">
                {subjectConfig.countText}
              </Badge>
            </div>
          </div>
        </div>

        {/* Action button if student/media */}
        <div className="flex items-center gap-2 shrink-0">
          {subject === 'students' && (
            <Button
              type="button"
              size="xs"
              onClick={onAddStudent}
              className="h-7 px-2.5 text-xs font-semibold gap-1 bg-primary text-primary-foreground"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Thêm học viên</span>
            </Button>
          )}

          {subject === 'sessions' && onEditRoadmap && (
            <Button
              type="button"
              variant="outline"
              size="xs"
              onClick={onEditRoadmap}
              className="h-7 px-2.5 text-xs font-medium"
            >
              Đổi lộ trình giảng dạy
            </Button>
          )}
        </div>
      </div>

      {/* 2. Full-Width Subject Content */}
      <div className="flex-1 min-h-0 overflow-y-auto p-4">
        {subject === 'students' && (
          <ClassesDetailRoster
            students={roster}
            subject={cls.level}
            onAddStudent={onAddStudent}
            onStudentClick={onStudentClick}
            onCareClick={onCareClick}
            onMonthlyReportOverlayClick={onMonthlyReportClick}
            rosterError={validationErrors?.roster}
            onRemoveStudent={onRemoveStudent}
          />
        )}

        {subject === 'sessions' && (
          <ClassesDetailSessionsV2
            cls={cls}
            sessions={sessions}
            roster={roster}
            onUpdateSession={onUpdateSession}
            classNotes={classNotes}
            classLogs={logs}
            onAddClassNote={onAddClassNote}
            onEditRoadmap={onEditRoadmap}
          />
        )}

        {subject === 'media' && (
          <ClassesSessionMediaTab
            className={cls?.name || 'Lớp học'}
            rosterStudents={roster.map((s) => ({
              id: s.id,
              name: s.name,
              code: s.code,
              initials: s.name ? s.name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase() : 'HV',
            }))}
          />
        )}

        {subject === 'logs' && (
          <div className="space-y-2 max-w-3xl mx-auto">
            <div className="rounded-lg border border-border/60 bg-card p-3 shadow-2xs">
              <h3 className="text-xs font-bold text-foreground mb-2">Nhật ký thay đổi lớp học</h3>
              <div className="divide-y divide-border/40 text-xs">
                {logs.map((lg) => (
                  <div key={lg.id} className="py-2.5 flex items-start justify-between gap-3">
                    <div className="space-y-0.5 min-w-0">
                      <div className="text-foreground font-medium">{lg.action}</div>
                      <div className="text-[11px] text-muted-foreground">Thực hiện bởi: <strong className="text-foreground">{lg.operator}</strong></div>
                    </div>
                    <span className="text-[11px] font-mono text-muted-foreground shrink-0">{lg.timestamp}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
