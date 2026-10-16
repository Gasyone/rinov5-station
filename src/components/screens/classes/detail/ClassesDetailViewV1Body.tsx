'use client'

import { Clock, FolderOpen, GraduationCap, Users } from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { cn } from '@/lib/utils'
import type { ClassRecord } from '@/mocks/classRecords'
import type { RoadmapSession, RosterStudent, ClassAuditLog, ClassNote } from './classesDetailTypes'
import { formatNoteTimestamp } from './classesDetailHelpers'

// Subcomponents
import { ClassesDetailHeaderV2 } from './ClassesDetailHeaderV2'
import type { ClassesStatusChangeRequest } from './ClassesDetailHeader'
import { ClassesDetailRoster } from './ClassesDetailRoster'
import { ClassesDetailSessionsV2 } from './ClassesDetailSessionsV2'
import { ClassesSessionMediaTab } from './ClassesSessionMediaTab'
import { ClassesDetailInteractionPanelV2 } from './ClassesDetailInteractionPanelV2'
import { ClassesStudentCareOverlayPanel } from './ClassesStudentCareOverlayPanel'
import { ClassesStudentMonthlyReportOverlayPanel } from './ClassesStudentMonthlyReportOverlayPanel'

export interface ClassesDetailViewV1BodyProps {
  cls: ClassRecord
  isEditing: boolean
  editFormState: ClassRecord | null
  rosterState: RosterStudent[]
  sessionsState: RoadmapSession[]
  logs: ClassAuditLog[]
  notes: ClassNote[]
  activeTab: string
  setActiveTab: (tab: string) => void
  hasRosterError?: boolean
  validationErrors?: Record<string, string>
  activeCareStudent: RosterStudent | null
  setActiveCareStudent: (st: RosterStudent | null) => void
  activeMonthlyReportStudent: RosterStudent | null
  setActiveMonthlyReportStudent: (st: RosterStudent | null) => void
  onStartEdit: () => void
  onCancelEdit: () => void
  onSave: () => void
  onStatusChange: (newStatus: ClassRecord['status'], actionText: string) => void
  onRequestStatusChange: (request: ClassesStatusChangeRequest) => void
  onToggleViewMode: () => void
  onAddStudent: () => void
  onStudentClick: (id: string) => void
  onRemoveStudent: (id: string) => void
  onUpdateSession: (id: string, updates: Partial<RoadmapSession>) => void
  onAddNote: (text: string) => void
  onRescheduleClick: () => void
  onEditStateChange: (val: ClassRecord) => void
  onEditRoadmap: () => void
}

export function ClassesDetailViewV1Body({
  cls,
  isEditing,
  editFormState,
  rosterState,
  sessionsState,
  logs,
  notes,
  activeTab,
  setActiveTab,
  hasRosterError,
  validationErrors,
  activeCareStudent,
  setActiveCareStudent,
  activeMonthlyReportStudent,
  setActiveMonthlyReportStudent,
  onStartEdit,
  onCancelEdit,
  onSave,
  onStatusChange,
  onRequestStatusChange,
  onToggleViewMode,
  onAddStudent,
  onStudentClick,
  onRemoveStudent,
  onUpdateSession,
  onAddNote,
  onRescheduleClick,
  onEditStateChange,
  onEditRoadmap,
}: ClassesDetailViewV1BodyProps) {
  return (
    <div className="grid min-h-0 flex-1 gap-3 p-3 lg:p-3.5 lg:grid-cols-[1fr_275px] h-full overflow-hidden bg-background">
      {/* Left Panel Container */}
      <main className="flex min-h-0 flex-col overflow-hidden h-full space-y-2">
        {/* Section Thông tin lớp học (Header trái) */}
        <ClassesDetailHeaderV2
          cls={cls}
          isEditing={isEditing}
          rosterCount={rosterState.length}
          onStartEdit={onStartEdit}
          onCancelEdit={onCancelEdit}
          onSave={onSave}
          onStatusChange={onStatusChange}
          onRequestStatusChange={onRequestStatusChange}
          viewMode="v1"
          onToggleViewMode={onToggleViewMode}
        />

        {/* Body Section underneath Left Section Header */}
        <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="flex min-h-0 flex-1 flex-col h-full">
            {/* Segmented Control Filter Tabs (4 Tabs: Học viên, Buổi học, Tài liệu & media, Lịch sử cập nhật) */}
            <TabsList className="shrink-0 inline-flex w-auto max-w-full items-center gap-1 bg-muted/60 p-0.5 h-7.5 rounded-lg border border-border/40 mb-1">
              <TabsTrigger
                value="roster"
                className={cn(
                  "h-6.5 px-2.5 rounded-md bg-transparent text-muted-foreground font-semibold text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer",
                  "data-[state=active]:!bg-background data-[state=active]:!text-foreground data-[state=active]:!font-bold data-[state=active]:shadow-2xs",
                  "hover:text-foreground",
                  hasRosterError && "text-destructive data-[state=active]:!text-destructive"
                )}
              >
                <Users className="h-3.5 w-3.5 shrink-0 text-[#0088cc]" />
                <span>Học viên</span>
                <span className="ml-1 rounded-full bg-muted-foreground/15 px-1.5 py-0 text-[10.5px] font-bold text-muted-foreground data-[state=active]:!bg-muted data-[state=active]:!text-foreground">
                  {rosterState.length}
                </span>
              </TabsTrigger>

              <TabsTrigger
                value="sessions"
                className={cn(
                  "h-6.5 px-2.5 rounded-md bg-transparent text-muted-foreground font-semibold text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer",
                  "data-[state=active]:!bg-background data-[state=active]:!text-foreground data-[state=active]:!font-bold data-[state=active]:shadow-2xs",
                  "hover:text-foreground"
                )}
              >
                <GraduationCap className="h-3.5 w-3.5 shrink-0 text-[#0088cc]" />
                <span>Buổi học</span>
              </TabsTrigger>

              <TabsTrigger
                value="media"
                className={cn(
                  "h-6.5 px-2.5 rounded-md bg-transparent text-muted-foreground font-semibold text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer",
                  "data-[state=active]:!bg-background data-[state=active]:!text-foreground data-[state=active]:!font-bold data-[state=active]:shadow-2xs",
                  "hover:text-foreground"
                )}
              >
                <FolderOpen className="h-3.5 w-3.5 shrink-0 text-[#0088cc]" />
                <span>Tài liệu & media</span>
              </TabsTrigger>

              <TabsTrigger
                value="logs"
                className={cn(
                  "h-6.5 px-2.5 rounded-md bg-transparent text-muted-foreground font-semibold text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer",
                  "data-[state=active]:!bg-background data-[state=active]:!text-foreground data-[state=active]:!font-bold data-[state=active]:shadow-2xs",
                  "hover:text-foreground"
                )}
              >
                <Clock className="h-3.5 w-3.5 shrink-0 text-[#0088cc]" />
                <span>Lịch sử cập nhật</span>
                <span className="ml-1 rounded-full bg-muted-foreground/15 px-1.5 py-0 text-[10.5px] font-bold text-muted-foreground data-[state=active]:!bg-muted data-[state=active]:!text-foreground">
                  {logs.length}
                </span>
              </TabsTrigger>
            </TabsList>

            {/* Scrollable Container */}
            <div className="flex-1 min-h-0 overflow-y-auto pr-1 flex flex-col h-full pt-1">
              {/* Tab 1: Roster */}
              <TabsContent value="roster" className="m-0 focus-visible:outline-none">
                <ClassesDetailRoster
                  students={rosterState}
                  subject={cls.level}
                  onAddStudent={onAddStudent}
                  onStudentClick={onStudentClick}
                  onCareClick={(student) => {
                    setActiveCareStudent(student)
                    setActiveMonthlyReportStudent(null)
                  }}
                  onMonthlyReportOverlayClick={(student) => {
                    setActiveMonthlyReportStudent(student)
                    setActiveCareStudent(null)
                  }}
                  rosterError={validationErrors?.roster}
                  onRemoveStudent={onRemoveStudent}
                />
              </TabsContent>

              {/* Tab 2: Sessions */}
              <TabsContent value="sessions" className="m-0 focus-visible:outline-none">
                <ClassesDetailSessionsV2
                  cls={cls}
                  sessions={sessionsState}
                  roster={rosterState}
                  onUpdateSession={onUpdateSession}
                  classNotes={notes}
                  classLogs={logs}
                  onAddClassNote={onAddNote}
                  onEditRoadmap={onEditRoadmap}
                />
              </TabsContent>

              {/* Tab 3: Media & Documents */}
              <TabsContent value="media" className="m-0 focus-visible:outline-none flex-1">
                <ClassesSessionMediaTab
                  className={cls?.name || 'Lớp học'}
                  rosterStudents={rosterState.map((s) => ({
                    id: s.id,
                    name: s.name,
                    code: s.code,
                    initials: s.name ? s.name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase() : 'HV',
                  }))}
                />
              </TabsContent>

              {/* Tab 4: Audit Logs */}
              <TabsContent value="logs" className="m-0 focus-visible:outline-none">
                <div className="rounded-lg border border-border/60 bg-card p-0 overflow-hidden shadow-2xs">
                  <div className="bg-muted/40 px-3.5 py-2 border-b border-border/50 flex items-center justify-between">
                    <span className="text-xs font-semibold text-foreground">
                      Lịch sử cập nhật thông tin lớp ({logs.length} hoạt động)
                    </span>
                  </div>

                  {logs.length === 0 ? (
                    <div className="p-6 text-center text-xs text-muted-foreground">
                      Chưa ghi nhận thao tác cập nhật nào.
                    </div>
                  ) : (
                    <div className="divide-y divide-border/40">
                      {logs.map((log) => (
                        <div key={log.id} className="px-3.5 py-2 text-xs space-y-0.5 hover:bg-muted/20 transition-colors">
                          <div className="flex items-center justify-between text-xs text-muted-foreground">
                            <span className="font-semibold text-foreground">
                              {log.operator}
                            </span>
                            <span className="font-mono text-xs">{formatNoteTimestamp(log.timestamp)}</span>
                          </div>
                          <p className="font-normal text-foreground/90 leading-relaxed text-[11.5px]">
                            {log.action}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </main>

      {/* Right Side Panel: Class Info, Interactions OR Overlay Student Care Panel OR Overlay Monthly Report Panel */}
      {activeCareStudent ? (
        <ClassesStudentCareOverlayPanel
          student={activeCareStudent}
          onClose={() => setActiveCareStudent(null)}
        />
      ) : activeMonthlyReportStudent ? (
        <ClassesStudentMonthlyReportOverlayPanel
          key={activeMonthlyReportStudent.id}
          student={activeMonthlyReportStudent}
          subject={cls.level || cls.name}
          onClose={() => setActiveMonthlyReportStudent(null)}
        />
      ) : (
        <ClassesDetailInteractionPanelV2
          cls={cls}
          notes={notes}
          logs={logs}
          roster={rosterState}
          onAddNote={onAddNote}
          isEditing={isEditing}
          editFormState={editFormState}
          onEditStateChange={onEditStateChange}
          validationErrors={validationErrors}
          onStartEdit={onStartEdit}
          onRescheduleClick={onRescheduleClick}
          onCancelEdit={onCancelEdit}
          onSave={onSave}
          onRequestStatusChange={onRequestStatusChange}
          onAddStudent={onAddStudent}
          onEditRoadmap={onEditRoadmap}
        />
      )}
    </div>
  )
}
