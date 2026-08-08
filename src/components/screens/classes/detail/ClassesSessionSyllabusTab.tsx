'use client'

import {
  CheckCircle2,
  FileText,
  Headphones,
  Video,
  HelpCircle,
  BookOpen,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import type { RoadmapSession } from './classesDetailTypes'
import {
  getLessonsForRoadmapSession,
  getSessionSyllabusContent,
} from './classesSessionDetailHelpers'

interface ClassesSessionSyllabusTabProps {
  session: RoadmapSession
  sessions?: RoadmapSession[]
}

export function ClassesSessionSyllabusTab({
  session,
}: ClassesSessionSyllabusTabProps) {
  const lessons = getLessonsForRoadmapSession(session)
  const syllabusContent = getSessionSyllabusContent(session)

  return (
    <div className="space-y-4 text-xs">
      {/* ── 1. Nội dung buổi học ── */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between pb-0.5">
          <span className="font-normal text-foreground text-xs flex items-center gap-1.5">
            <BookOpen className="h-4 w-4 text-primary shrink-0 opacity-80" />
            <span>Nội dung buổi học</span>
          </span>
          <span className="text-[10px] text-muted-foreground font-normal">Buổi {session.sessionNumber}</span>
        </div>

        {/* Data list aligned flush left under 'Nội dung buổi học' text title (pl-[22px]), wrapped text flush to left without flex indent */}
        <div className="space-y-1 text-xs pl-[22px]">
          {syllabusContent.words && (
            <p className="text-xs leading-relaxed text-muted-foreground">
              <span className="font-normal text-foreground me-1 font-medium">- Words:</span>
              <span>{syllabusContent.words.join(', ')}</span>
            </p>
          )}
          {syllabusContent.sentences && (
            <p className="text-xs leading-relaxed text-muted-foreground">
              <span className="font-normal text-foreground me-1 font-medium">- Sentences:</span>
              <span>{syllabusContent.sentences.join(', ')}</span>
            </p>
          )}
          {syllabusContent.phonics && (
            <p className="text-xs leading-relaxed text-muted-foreground">
              <span className="font-normal text-foreground me-1 font-medium">- Phonics:</span>
              <span>{syllabusContent.phonics.join(', ')}</span>
            </p>
          )}
          {syllabusContent.grammar && (
            <p className="text-xs leading-relaxed text-muted-foreground">
              <span className="font-normal text-foreground me-1 font-medium">- Grammar:</span>
              <span>{syllabusContent.grammar.join(', ')}</span>
            </p>
          )}
        </div>
      </div>

      {/* ── 2. Tài liệu & nhiệm vụ học tập ── */}
      <div className="space-y-3 pt-2 border-t border-border/30">
        <h4 className="text-xs font-normal text-muted-foreground">
          Tài liệu & nhiệm vụ học tập
        </h4>

        {lessons.length > 0 ? (
          lessons.map((lesson) => (
            <div key={lesson.id} className="space-y-2">
              {/* Lesson Header Title */}
              <div className="py-0.5">
                <span className="text-xs font-bold text-foreground">
                  {lesson.title}
                </span>
              </div>

              {/* Lesson Components List (Always Visible) */}
              <div className="space-y-2.5 pl-1 py-1">
                {lesson.components.map((c, cIdx) => {
                  let iconColor = 'text-primary'
                  let iconBg = 'bg-primary/10'
                  let IconComponent = FileText

                  if (c.type === 'slide') {
                    iconColor = 'text-rose-600 dark:text-rose-400'
                    iconBg = 'bg-rose-50 dark:bg-rose-950/20'
                    IconComponent = FileText
                  } else if (c.type === 'homework') {
                    iconColor = 'text-emerald-600 dark:text-emerald-400'
                    iconBg = 'bg-emerald-50 dark:bg-emerald-950/20'
                    IconComponent = CheckCircle2
                  } else if (c.type === 'quiz') {
                    iconColor = 'text-amber-600 dark:text-amber-400'
                    iconBg = 'bg-amber-50 dark:bg-amber-950/20'
                    IconComponent = HelpCircle
                  } else if (c.type === 'audio') {
                    iconColor = 'text-sky-600 dark:text-sky-400'
                    iconBg = 'bg-sky-50 dark:bg-sky-950/20'
                    IconComponent = Headphones
                  } else if (c.type === 'video') {
                    iconColor = 'text-violet-600 dark:text-violet-400'
                    iconBg = 'bg-violet-50 dark:bg-violet-950/20'
                    IconComponent = Video
                  }

                  let line2 = 'File tài liệu tham khảo cho học sinh'
                  let line3 = 'Tài liệu tham khảo'

                  if (c.type === 'homework') {
                    line2 = 'Bài luyện tập tự học ở nhà'
                    line3 = 'Nhiệm vụ phải làm'
                  } else if (c.type === 'quiz') {
                    line2 = 'Bài kiểm tra nhanh đánh giá năng lực'
                    line3 = 'Nhiệm vụ phải làm'
                  } else if (c.type === 'audio') {
                    line2 = 'File nghe audio luyện kỹ năng nghe'
                    line3 = 'Tài liệu nghe bổ trợ'
                  } else if (c.type === 'video') {
                    line2 = 'Video bài học bổ sung kiến thức'
                    line3 = 'Tài liệu xem bổ trợ'
                  }

                  const isTask = c.type === 'homework' || c.type === 'quiz'
                  const bottomTextColor = isTask ? 'text-amber-600' : 'text-muted-foreground'
                  const BottomIcon = isTask ? CheckCircle2 : FileText

                  return (
                    <div key={cIdx} className="flex items-start gap-3 text-xs">
                      <div className={cn('h-6 w-6 rounded-full flex items-center justify-center shrink-0 mt-0.5', iconBg, iconColor)}>
                        <IconComponent className="h-3.5 w-3.5" />
                      </div>
                      <div className="space-y-0.5 min-w-0 flex-1">
                        <p className="font-bold text-foreground text-xs leading-snug">{c.name}</p>
                        <p className="text-[11px] text-muted-foreground leading-normal">{line2}</p>
                        <p className={cn(
                          'text-[10px] flex items-center gap-1 leading-normal font-medium',
                          bottomTextColor
                        )}>
                          <BottomIcon className="h-3 w-3 shrink-0" />
                          <span>{line3}</span>
                          {c.url && c.url !== '#' && (
                            <>
                              <span>•</span>
                              <a href={c.url} target="_blank" rel="noreferrer" className="text-rose-600 hover:underline font-semibold" onClick={(e) => e.preventDefault()}>
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
          ))
        ) : (
          <div className="py-4 text-center text-muted-foreground italic text-xs">
            Không có chương trình học nào được gán cho buổi này.
          </div>
        )}
      </div>
    </div>
  )
}
