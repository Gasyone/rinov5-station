'use client'

import type { ReactNode } from 'react'
import { BookOpen, Compass, Layers, GraduationCap, Award, Sparkles } from 'lucide-react'
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card'
import { Badge } from '@/components/ui/badge'
import type { ClassRecord } from '@/mocks/classRecords'

interface SyllabusProfileHoverCardProps {
  cls: ClassRecord
  children: ReactNode
  align?: 'start' | 'center' | 'end'
}

export function SyllabusProfileHoverCard({
  cls,
  children,
  align = 'start',
}: SyllabusProfileHoverCardProps) {
  const syllabusTitle = cls.syllabus && cls.syllabus !== '—' ? cls.syllabus : 'Chưa gán khung chương trình'

  return (
    <HoverCard openDelay={150} closeDelay={150}>
      <HoverCardTrigger asChild onClick={(e) => e.stopPropagation()}>
        {children}
      </HoverCardTrigger>
      <HoverCardContent
        className="w-80 p-4 rounded-xl shadow-lg border bg-popover text-popover-foreground z-50 space-y-3.5"
        align={align}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header section */}
        <div className="flex items-start gap-3 pb-3 border-b border-border/60">
          <div className="h-10 w-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
            <BookOpen className="h-5 w-5" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                Khung Chương Trình
              </span>
              {cls.code && (
                <Badge variant="outline" className="text-[9px] font-mono px-1 py-0 h-4">
                  {cls.code}
                </Badge>
              )}
            </div>
            <h4 className="text-sm font-bold text-foreground truncate mt-0.5" title={syllabusTitle}>
              {syllabusTitle}
            </h4>
          </div>
        </div>

        {/* Profile Details List */}
        <div className="space-y-2.5 text-xs">
          {/* Môn học */}
          <div className="flex items-center gap-2.5">
            <BookOpen className="h-3.5 w-3.5 text-primary shrink-0" />
            <div className="min-w-0 flex-1 flex justify-between items-center gap-2">
              <span className="text-muted-foreground">Môn học:</span>
              <span className="font-semibold text-foreground truncate">{cls.level || '—'}</span>
            </div>
          </div>

          {/* Khung chương trình / Chương trình */}
          <div className="flex items-center gap-2.5">
            <Layers className="h-3.5 w-3.5 text-indigo-500 shrink-0" />
            <div className="min-w-0 flex-1 flex justify-between items-center gap-2">
              <span className="text-muted-foreground">Chương trình:</span>
              <span className="font-semibold text-foreground truncate">{cls.syllabus && cls.syllabus !== '—' ? cls.syllabus : 'Chưa gán'}</span>
            </div>
          </div>

          {/* Lộ trình */}
          <div className="flex items-start gap-2.5">
            <Compass className="h-3.5 w-3.5 text-amber-500 shrink-0 mt-0.5" />
            <div className="min-w-0 flex-1 flex justify-between items-start gap-2">
              <span className="text-muted-foreground shrink-0">Lộ trình:</span>
              <span className="font-medium text-foreground text-right text-[11px] leading-tight">
                {cls.learningPath || 'Chưa gán'}
              </span>
            </div>
          </div>

          {/* Trình độ */}
          <div className="flex items-center gap-2.5">
            <GraduationCap className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
            <div className="min-w-0 flex-1 flex justify-between items-center gap-2">
              <span className="text-muted-foreground">Trình độ:</span>
              <Badge variant="secondary" className="text-[10px] font-semibold">
                {cls.level || '—'}
              </Badge>
            </div>
          </div>

          {/* Trình độ phụ */}
          <div className="flex items-center gap-2.5">
            <Award className="h-3.5 w-3.5 text-sky-500 shrink-0" />
            <div className="min-w-0 flex-1 flex justify-between items-center gap-2">
              <span className="text-muted-foreground">Trình độ phụ:</span>
              <span className="font-semibold text-foreground truncate">{cls.subLevel || 'Không có'}</span>
            </div>
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  )
}
