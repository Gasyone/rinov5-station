'use client'

import { BookOpen, CheckCircle2, FileText } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { RoadmapSession } from '../classesDetailTypes'
import { getLessonsForRoadmapSession, getSessionSyllabusContent } from '../classesSessionDetailHelpers'

export interface SessionCardLessonsExpandProps {
  session: RoadmapSession
}

export function SessionCardLessonsExpand({ session }: SessionCardLessonsExpandProps) {
  const lessons = getLessonsForRoadmapSession(session)
  const syllabusContent = getSessionSyllabusContent(session)

  return (
    <div
      className="mt-1 space-y-3 pt-2.5 border-t border-border/40"
      onClick={(e) => e.stopPropagation()}
    >
      {/* ── Nội dung buổi học (Summary Content Block) ── */}
      <div className="rounded-lg bg-muted/40 border border-border/50 p-2.5 space-y-1.5 text-xs">
        <div className="flex items-center gap-1.5 font-bold text-foreground text-xs">
          <BookOpen className="h-3.5 w-3.5 text-primary shrink-0" />
          <span>Nội dung buổi học</span>
        </div>

        <ul className="space-y-1 text-muted-foreground text-[11px] font-normal leading-relaxed pl-1">
          {syllabusContent.words && (
            <li className="flex items-start gap-1">
              <span className="font-semibold text-foreground shrink-0">- Words:</span>
              <span>{syllabusContent.words.join(', ')}</span>
            </li>
          )}
          {syllabusContent.sentences && (
            <li className="flex items-start gap-1">
              <span className="font-semibold text-foreground shrink-0">- Sentences:</span>
              <span>{syllabusContent.sentences.join(', ')}</span>
            </li>
          )}
          {syllabusContent.phonics && (
            <li className="flex items-start gap-1">
              <span className="font-semibold text-foreground shrink-0">- Phonics:</span>
              <span>{syllabusContent.phonics.join(', ')}</span>
            </li>
          )}
          {syllabusContent.grammar && (
            <li className="flex items-start gap-1">
              <span className="font-semibold text-foreground shrink-0">- Grammar:</span>
              <span>{syllabusContent.grammar.join(', ')}</span>
            </li>
          )}
        </ul>
      </div>

      {/* ── LMS Roadmap Tasks & Homework List ── */}
      <div className="space-y-2 pt-0.5">
        {lessons.flatMap((l) => l.components).map((c, cIdx) => {
          let iconColor = 'text-rose-600 dark:text-rose-400'
          let iconBg = 'bg-rose-50 dark:bg-rose-950/20'

          if (c.type === 'homework') {
            iconColor = 'text-emerald-600 dark:text-emerald-400'
            iconBg = 'bg-emerald-50 dark:bg-emerald-950/20'
          } else if (c.type === 'quiz') {
            iconColor = 'text-amber-600 dark:text-amber-400'
            iconBg = 'bg-amber-50 dark:bg-amber-950/20'
          }

          const isHomework = c.type === 'homework' || c.type === 'quiz'
          const line2 = isHomework ? 'Bài luyện tập' : 'File tài liệu tham khảo cho học sinh'
          const line3 = isHomework ? 'Nhiệm vụ phải làm' : 'Tài liệu tham khảo'

          return (
            <div key={cIdx} className="flex items-start gap-3 text-xs py-1 px-1.5 hover:bg-muted/30 rounded-md transition-colors">
              <div className={cn('h-6 w-6 rounded-full flex items-center justify-center shrink-0 mt-0.5', iconBg, iconColor)}>
                {isHomework ? (
                  <CheckCircle2 className="h-3.5 w-3.5" />
                ) : (
                  <FileText className="h-3.5 w-3.5" />
                )}
              </div>

              <div className="space-y-0.5 min-w-0 flex-1">
                <p className="font-bold text-foreground text-xs leading-snug">{c.name}</p>
                <p className="text-[11px] text-muted-foreground leading-normal">{line2}</p>
                <p className={cn(
                  'text-[10px] flex items-center gap-1.5 leading-normal font-medium',
                  isHomework ? 'text-amber-600 dark:text-amber-400' : 'text-muted-foreground'
                )}>
                  {isHomework ? (
                    <CheckCircle2 className="h-3 w-3 shrink-0 text-amber-500" />
                  ) : (
                    <FileText className="h-3 w-3 shrink-0 text-muted-foreground/60" />
                  )}
                  <span>{line3}</span>
                  {c.url && (
                    <>
                      <span>•</span>
                      <a
                        href={c.url !== '#' ? c.url : undefined}
                        target="_blank"
                        rel="noreferrer"
                        className="text-rose-600 dark:text-rose-400 hover:underline font-semibold"
                        onClick={(e) => e.stopPropagation()}
                      >
                        Link bài tập
                      </a>
                    </>
                  )}
                </p>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
