'use client'

import React from 'react'
import { Check } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { RosterStudent } from './classesDetailTypes'

interface MonthlyReportRosterSidebarProps {
  students: RosterStudent[]
  selectedStudentId: string
  reportStatusMap: Record<string, boolean>
  onSelectStudent: (studentId: string) => void
}

export function MonthlyReportRosterSidebar({
  students,
  selectedStudentId,
  reportStatusMap,
  onSelectStudent,
}: MonthlyReportRosterSidebarProps) {
  return (
    <div className="w-64 border-r bg-muted/10 flex flex-col shrink-0 overflow-y-auto custom-scrollbar">
      <div className="p-3 border-b text-xs font-extrabold text-muted-foreground uppercase tracking-wider flex items-center justify-between bg-muted/20">
        <span>HỌC VIÊN IN ROSTER</span>
        <span>TRẠNG THÁI</span>
      </div>

      <div className="divide-y divide-border/40">
        {students.map((student) => {
          const isSelected = student.id === selectedStudentId
          const isDone = !!reportStatusMap[student.id]
          const sInitials = student.name
            .trim()
            .split(' ')
            .map((p) => p[0])
            .slice(-2)
            .join('')
            .toUpperCase()

          return (
            <button
              key={student.id}
              type="button"
              onClick={() => onSelectStudent(student.id)}
              className={cn(
                'w-full p-3 flex items-center justify-between text-left transition-colors cursor-pointer',
                isSelected
                  ? 'bg-primary/10 border-s-4 border-s-primary text-foreground font-bold'
                  : 'hover:bg-muted/30 text-muted-foreground font-medium'
              )}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <div
                  className={cn(
                    'h-7 w-7 rounded-full flex items-center justify-center font-extrabold text-xs shrink-0',
                    isSelected
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-muted-foreground'
                  )}
                >
                  {sInitials}
                </div>
                <div className="min-w-0">
                  <div className={cn('text-sm truncate', isSelected ? 'font-bold text-primary' : 'font-medium')}>
                    {student.name}
                  </div>
                  <div className="text-xs font-mono text-muted-foreground/80 truncate">
                    {student.code}
                  </div>
                </div>
              </div>

              {/* Status indicator */}
              <div className="shrink-0 ms-1">
                {isDone ? (
                  <div className="h-5 w-5 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                    <Check className="h-3 w-3 stroke-[3]" />
                  </div>
                ) : (
                  <span className="text-xs text-muted-foreground/50 italic">—</span>
                )}
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
