'use client'

import React from 'react'
import {
  BookOpen,
  CheckCircle2,
  Clock,
  FileText,
  Headphones,
  Video,
  HelpCircle,
  X,
  Target,
  Sparkles,
  Layers,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import type { RoadmapSession } from '../classesDetailTypes'
import type { ClassRecord } from '@/mocks/classRecords'
import {
  getLessonsForRoadmapSession,
  getSessionSyllabusContent,
} from '../classesSessionDetailHelpers'

interface LiveLessonGuideDrawerProps {
  isOpen: boolean
  onClose: () => void
  session: RoadmapSession
  cls: ClassRecord
  isMath: boolean
}

export function LiveLessonGuideDrawer({
  isOpen,
  onClose,
  session,
  cls,
  isMath,
}: LiveLessonGuideDrawerProps) {
  if (!isOpen) return null

  const syllabusContent = getSessionSyllabusContent(session)
  const lessons = getLessonsForRoadmapSession(session)
  const syllabusTitle = cls.syllabus || cls.learningPath || cls.level || 'Khung chương trình chuẩn'

  return (
    <div className="fixed inset-0 z-[100000] flex select-none">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity animate-in fade-in"
        onClick={onClose}
      />

      {/* Drawer content sliding from left */}
      <div className="relative w-full max-w-md bg-background border-r shadow-2xl flex flex-col min-h-0 z-10 animate-in slide-in-from-left duration-200">
        {/* Drawer Header */}
        <div className="p-4 border-b bg-zinc-50 dark:bg-zinc-900/60 flex items-start justify-between gap-3 shrink-0">
          <div className="min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <Badge
                className={cn(
                  'text-[10px] font-bold px-2 py-0.5 rounded-md border-none',
                  isMath ? 'bg-blue-600 text-white' : 'bg-purple-600 text-white'
                )}
              >
                KCT: {syllabusTitle}
              </Badge>
              <span className="flex items-center gap-1 text-[11px] font-medium text-muted-foreground">
                <Clock className="h-3 w-3 text-amber-500" />
                {session.startTime ? `${session.startTime} - ${session.endTime}` : '17:45 - 19:15'}
              </span>
            </div>
            <h3 className="font-bold text-sm text-foreground leading-snug truncate">
              Buổi {session.sessionNumber}: {session.topic || 'Nội dung buổi học'}
            </h3>
          </div>

          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="h-7 w-7 rounded-lg text-muted-foreground hover:text-foreground shrink-0 cursor-pointer"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Drawer Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar text-xs leading-relaxed">
          {/* ── SECTION 1: NỘI DUNG BUỔI HỌC THEO KCT ── */}
          <div className="p-3.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950/40 space-y-3 shadow-2xs">
            <div className="flex items-center justify-between pb-1 border-b border-border/40">
              <span className="font-bold text-foreground text-xs flex items-center gap-1.5 uppercase tracking-wide">
                <BookOpen className="h-4 w-4 text-primary shrink-0" />
                <span>Nội dung KCT Buổi {session.sessionNumber}</span>
              </span>
              <span className="text-[11px] text-muted-foreground font-mono">
                {isMath ? 'Toán tư duy' : 'Tiếng Anh'}
              </span>
            </div>

            {/* Render actual syllabus fields from getSessionSyllabusContent */}
            <div className="space-y-2 pl-1">
              {syllabusContent.words && syllabusContent.words.length > 0 && (
                <div className="space-y-0.5">
                  <span className="font-bold text-foreground text-xs block text-primary">
                    • Từ vựng trọng tâm (Words):
                  </span>
                  <p className="text-muted-foreground font-medium pl-3 leading-relaxed">
                    {syllabusContent.words.join(', ')}
                  </p>
                </div>
              )}

              {syllabusContent.sentences && syllabusContent.sentences.length > 0 && (
                <div className="space-y-0.5">
                  <span className="font-bold text-foreground text-xs block text-primary">
                    • Mẫu câu giao tiếp (Sentences):
                  </span>
                  <p className="text-muted-foreground font-medium pl-3 leading-relaxed">
                    {syllabusContent.sentences.join(', ')}
                  </p>
                </div>
              )}

              {syllabusContent.phonics && syllabusContent.phonics.length > 0 && (
                <div className="space-y-0.5">
                  <span className="font-bold text-foreground text-xs block text-primary">
                    • Ngữ âm & Phát âm (Phonics):
                  </span>
                  <p className="text-muted-foreground font-medium pl-3 leading-relaxed">
                    {syllabusContent.phonics.join(', ')}
                  </p>
                </div>
              )}

              {syllabusContent.grammar && syllabusContent.grammar.length > 0 && (
                <div className="space-y-0.5">
                  <span className="font-bold text-foreground text-xs block text-primary">
                    • Ngữ pháp & Cấu trúc (Grammar):
                  </span>
                  <p className="text-muted-foreground font-medium pl-3 leading-relaxed">
                    {syllabusContent.grammar.join(', ')}
                  </p>
                </div>
              )}

              {isMath && (
                <div className="space-y-1">
                  <span className="font-bold text-foreground text-xs block text-primary">
                    • Yêu cầu năng lực Toán học:
                  </span>
                  <ul className="space-y-1 pl-3 text-muted-foreground font-medium">
                    <li>- Xác định vị trí số theo hàng và cột trên bảng 100.</li>
                    <li>- Phân tách số có 2 chữ số thành chục và đơn vị.</li>
                    <li>- Suy luận quy luật tăng giảm của các dãy số.</li>
                  </ul>
                </div>
              )}
            </div>
          </div>

          {/* ── SECTION 2: TÀI LIỆU & NHIỆM VỤ HỌC TẬP THEO KCT ── */}
          <div className="p-3.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950/40 space-y-3 shadow-2xs">
            <div className="flex items-center gap-1.5 text-xs font-bold text-foreground uppercase tracking-wide pb-1 border-b border-border/40">
              <Layers className="h-4 w-4 text-sky-500 shrink-0" />
              <span>Tài liệu & Nhiệm vụ học tập theo KCT</span>
            </div>

            <div className="space-y-2.5">
              {lessons.map((lesson) => (
                <div key={lesson.id} className="space-y-2">
                  <p className="font-bold text-xs text-foreground">{lesson.title}</p>
                  <div className="space-y-2 pl-1">
                    {lesson.components.map((c, cIdx) => {
                      let IconComponent = FileText
                      let iconColor = 'text-primary'
                      let iconBg = 'bg-primary/10'

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
                        iconColor = 'text-purple-600 dark:text-purple-400'
                        iconBg = 'bg-purple-50 dark:bg-purple-950/20'
                        IconComponent = Video
                      }

                      return (
                        <div key={cIdx} className="flex items-center justify-between gap-2 p-2 rounded-lg bg-zinc-50 dark:bg-zinc-900 border border-zinc-200/60 dark:border-zinc-800">
                          <div className="flex items-center gap-2 min-w-0">
                            <div className={cn('h-6 w-6 rounded-md flex items-center justify-center shrink-0', iconBg, iconColor)}>
                              <IconComponent className="h-3.5 w-3.5" />
                            </div>
                            <span className="font-semibold text-xs text-foreground truncate">{c.name}</span>
                          </div>
                          <Badge variant="outline" className="text-[10px] px-1.5 py-0 uppercase shrink-0 font-mono">
                            {c.type}
                          </Badge>
                        </div>
                      )
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ── SECTION 3: MÔ TẢ & GHI CHÚ BUỔI HỌC ── */}
          {session.description && (
            <div className="p-3 rounded-xl bg-amber-50/70 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/40 space-y-1">
              <div className="flex items-center gap-1.5 text-xs font-bold text-amber-800 dark:text-amber-300">
                <Sparkles className="h-3.5 w-3.5 text-amber-600" />
                <span>Ghi chú từ Khung chương trình</span>
              </div>
              <p className="text-[11px] text-amber-900/90 dark:text-amber-200 leading-relaxed font-medium">
                {session.description}
              </p>
            </div>
          )}
        </div>

        {/* Drawer Footer */}
        <div className="p-3 border-t bg-zinc-50 dark:bg-zinc-900/60 flex items-center justify-end">
          <Button
            type="button"
            size="sm"
            onClick={onClose}
            className="h-7 text-xs font-bold px-3 rounded-lg cursor-pointer"
          >
            Đóng giáo án
          </Button>
        </div>
      </div>
    </div>
  )
}

