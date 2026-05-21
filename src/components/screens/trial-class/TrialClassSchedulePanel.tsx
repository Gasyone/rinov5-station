'use client'

import * as React from 'react'
import { CheckCircle, Clock, Users, ChevronDown, ChevronRight } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { StatusBadge } from '@/components/shared'
import { MOCK_CLASS_OPTIONS } from './trialClassConstants'
import { getMockSessionsForClass } from '@/mocks/trialClasses'
import { formatTrialDate } from './trialClassHelpers'
import type { TrialSessionSelection } from './trialClassTypes'
import { cn } from '@/lib/utils'

interface TrialClassSchedulePanelProps {
  program: string
  selectedSessions: TrialSessionSelection[]
  onSelectSession: (session: TrialSessionSelection) => void
}

export function TrialClassSchedulePanel({
  program,
  selectedSessions,
  onSelectSession,
}: TrialClassSchedulePanelProps) {
  const matchingClasses = program ? MOCK_CLASS_OPTIONS.filter((c) => c.program === program) : []
  
  // Track which class is currently expanded in the accordion
  const [expandedClassId, setExpandedClassId] = React.useState<string | null>(null)

  // Auto-expand the first class if none is expanded, or when program changes
  React.useEffect(() => {
    if (matchingClasses.length > 0 && (!expandedClassId || !matchingClasses.some(c => c.classId === expandedClassId))) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setExpandedClassId(matchingClasses[0].classId)
    }
  }, [matchingClasses, expandedClassId])

  return (
    <div className="flex h-full flex-col">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-sm font-semibold">Lịch khả dụng</h3>
        {program && (
          <Badge variant="outline" className="text-xs font-normal">
            Lọc theo: {program}
          </Badge>
        )}
      </div>

      <ScrollArea className="h-[400px] pr-3">
        {!program ? (
          <div className="flex h-full flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center text-muted-foreground">
            <Clock className="mb-2 h-8 w-8 opacity-20" />
            <p className="text-sm">Vui lòng chọn Chương trình ở bên trái</p>
            <p className="mt-1 text-xs opacity-70">Lịch học trống sẽ tự động hiển thị tại đây.</p>
          </div>
        ) : matchingClasses.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center text-muted-foreground">
            <p className="text-sm">Không tìm thấy lớp nào phù hợp.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {matchingClasses.map((cls) => {
              const isClassFull = cls.enrolledStudents >= cls.maxStudents
              const isExpanded = expandedClassId === cls.classId
              
              // Only fetch sessions if expanded to save performance, though it's mock data here
              const classSessions = isExpanded ? getMockSessionsForClass(cls.classId).slice(0, 5) : []

              // Count how many sessions from this class are currently selected
              const selectedCount = selectedSessions.filter(s => s.classId === cls.classId).length

              return (
                <section
                  key={cls.classId}
                  className={cn(
                    "overflow-hidden rounded-lg border transition-all",
                    isClassFull ? "border-border/50 bg-muted/10 opacity-70" : "border-border bg-card",
                    isExpanded ? "ring-1 ring-border/50 shadow-sm" : ""
                  )}
                >
                  <button
                    type="button"
                    onClick={() => setExpandedClassId(isExpanded ? null : cls.classId)}
                    className={cn(
                      "flex w-full items-center justify-between px-4 py-3 text-left transition-colors",
                      isExpanded ? "bg-muted/30 border-b" : "hover:bg-muted/30"
                    )}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="text-muted-foreground shrink-0">
                        {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                      </div>
                      <div className="min-w-0">
                        <h4 className="font-semibold text-sm truncate flex items-center gap-2">
                          {cls.className}
                          {cls.classType === 'Lớp Workshop' ? (
                            <StatusBadge status="class_workshop" label="Workshop" className="h-5 px-1.5 text-[10px]" />
                          ) : (
                            <StatusBadge status="class_official" label="Chính thức" className="h-5 px-1.5 text-[10px]" />
                          )}
                          {selectedCount > 0 && (
                            <Badge variant="secondary" className="h-5 px-1.5 text-[10px] bg-primary/10 text-primary hover:bg-primary/20">
                              Đã chọn {selectedCount}
                            </Badge>
                          )}
                        </h4>
                        <p className="text-xs text-muted-foreground truncate">
                          {cls.teacher} &middot; {cls.schedule}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <div className="flex items-center gap-1 text-xs">
                        <Users className="h-3.5 w-3.5 text-muted-foreground" />
                        {cls.enrolledStudents}/{cls.maxStudents}
                      </div>
                    </div>
                  </button>

                  {isExpanded && (
                    <div className="p-3 bg-muted/5 animate-in slide-in-from-top-2">
                      {classSessions.length === 0 ? (
                        <p className="text-xs text-muted-foreground text-center py-2">
                          Lớp không có lịch học trống trong thời gian tới.
                        </p>
                      ) : (
                        <div className="grid gap-2">
                          {classSessions.map((session) => {
                            const isSessionFull = session.attendees >= session.capacity
                            const isSelected = selectedSessions.some(
                              (s) => s.classId === cls.classId && s.sessionId === session.id
                            )

                            return (
                              <Button
                                key={session.id}
                                type="button"
                                variant="ghost"
                                disabled={isSessionFull}
                                onClick={() => {
                                  onSelectSession({
                                    classId: cls.classId,
                                    className: `${cls.className} (${cls.teacher})`,
                                    sessionId: session.id,
                                    sessionName: session.name,
                                    trialDate: `${session.date} ${session.time}`,
                                  })
                                }}
                                className={cn(
                                  "flex h-auto w-full items-center justify-between rounded-md p-2.5 text-left transition-colors",
                                  isSelected
                                    ? "bg-primary/10 text-primary"
                                    : isSessionFull
                                      ? "cursor-not-allowed bg-muted/30 opacity-60"
                                      : "hover:bg-muted/50"
                                )}
                              >
                                <div className="flex items-center gap-2.5">
                                  <div className={cn(
                                    "flex h-4 w-4 shrink-0 items-center justify-center rounded border",
                                    isSelected ? "border-primary bg-primary text-primary-foreground" : "border-primary/20 bg-background",
                                    isSessionFull && "border-muted-foreground/30"
                                  )}>
                                    {isSelected && <CheckCircle className="h-3 w-3" />}
                                  </div>
                                  <div>
                                    <p className={cn("text-xs font-semibold", isSelected ? "text-primary" : "text-foreground")}>
                                      {session.name}
                                    </p>
                                    <p className="text-[11px] text-muted-foreground">
                                      {formatTrialDate(session.date)} &middot; {session.time}
                                    </p>
                                  </div>
                                </div>
                                <div className="flex items-center gap-2">
                                  <div className="flex items-center gap-1 text-[11px] text-muted-foreground">
                                    <Users className="h-3 w-3" />
                                    {session.attendees}/{session.capacity}
                                  </div>
                                </div>
                              </Button>
                            )
                          })}
                        </div>
                      )}
                    </div>
                  )}
                </section>
              )
            })}
          </div>
        )}
      </ScrollArea>
    </div>
  )
}
