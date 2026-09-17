'use client'

import React, { useState, useMemo } from 'react'
import {
  Search,
  Sparkles,
  Check,
  Plus,
  Mic,
  MicOff,
  ChevronRight,
  PanelRightClose,
  Tag,
  Star,
  MessageSquare,
  AlertCircle,
  X,
} from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'
import type { RosterStudent } from '../classesDetailTypes'
import { getAvatarColor, getInitials } from '../classesSessionDetailHelpers'
import { getStudentNameParts } from '../classesDetailHelpers'
import {
  MATH_LIVE_TAGS,
  ENGLISH_LIVE_TAGS,
  type LiveQuickTag,
  type StudentLiveLog,
} from './liveTeachingTypes'

interface LiveShorthandRosterDrawerProps {
  isOpen: boolean
  onClose: () => void
  students: RosterStudent[]
  isMath?: boolean
  studentLogs: Record<string, StudentLiveLog>
  onUpdateStudentLog: (studentId: string, updatedLog: StudentLiveLog) => void
}

export function LiveShorthandRosterDrawer({
  isOpen,
  onClose,
  students,
  isMath = true,
  studentLogs,
  onUpdateStudentLog,
}: LiveShorthandRosterDrawerProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [recordingStudentId, setRecordingStudentId] = useState<string | null>(null)
  const [selectedTagCategory, setSelectedTagCategory] = useState<'all' | 'math' | 'logic' | 'attitude'>('all')

  const availableTags: LiveQuickTag[] = isMath ? MATH_LIVE_TAGS : ENGLISH_LIVE_TAGS

  const filteredStudents = useMemo(() => {
    if (!searchQuery.trim()) return students
    const q = searchQuery.toLowerCase()
    return students.filter(
      (s) =>
        s.name.toLowerCase().includes(q) ||
        s.code.toLowerCase().includes(q) ||
        (s.englishName && s.englishName.toLowerCase().includes(q))
    )
  }, [students, searchQuery])

  // Count how many students have at least 1 tag
  const taggedCount = useMemo(() => {
    return Object.values(studentLogs).filter((log) => log.tags.length > 0 || log.quickNote.trim() !== '').length
  }, [studentLogs])

  const handleToggleTag = (student: RosterStudent, tag: LiveQuickTag) => {
    const currentLog: StudentLiveLog = studentLogs[student.id] || {
      studentId: student.id,
      tags: [],
      quickNote: '',
      starsEarned: 4,
    }

    const exists = currentLog.tags.includes(tag.id)
    const nextTags = exists
      ? currentLog.tags.filter((t) => t !== tag.id)
      : [...currentLog.tags, tag.id]

    const updated: StudentLiveLog = {
      ...currentLog,
      tags: nextTags,
      lastUpdated: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
    }

    onUpdateStudentLog(student.id, updated)

    if (!exists) {
      toast.success(`Đã ghi nhận [${tag.shortLabel}] cho ${student.name}`, {
        duration: 1500,
      })
    }
  }

  const handleNoteChange = (studentId: string, noteText: string) => {
    const currentLog: StudentLiveLog = studentLogs[studentId] || {
      studentId,
      tags: [],
      quickNote: '',
      starsEarned: 4,
    }
    onUpdateStudentLog(studentId, {
      ...currentLog,
      quickNote: noteText,
    })
  }

  const handleToggleVoiceMemo = (student: RosterStudent) => {
    if (recordingStudentId === student.id) {
      // Stop recording mock
      setRecordingStudentId(null)
      const currentLog = studentLogs[student.id] || {
        studentId: student.id,
        tags: [],
        quickNote: '',
        starsEarned: 4,
      }
      const demoVoiceNote = isMath
        ? 'Học sinh hiểu nhanh quy luật dấu chân, tính nhẩm tốt.'
        : 'Phát âm to rõ ràng, tự tin giao tiếp.'
      onUpdateStudentLog(student.id, {
        ...currentLog,
        hasVoiceMemo: true,
        voiceMemoText: demoVoiceNote,
        quickNote: currentLog.quickNote ? `${currentLog.quickNote} (${demoVoiceNote})` : demoVoiceNote,
      })
      toast.success(`Đã chuyển giọng nói thành text cho ${student.name}!`)
    } else {
      // Start recording mock
      setRecordingStudentId(student.id)
      toast.info(`Đang nghe ghi chú cho học viên ${student.name}... Bấm lần nữa để hoàn tất`, {
        duration: 2500,
      })
    }
  }

  if (!isOpen) return null

  return (
    <aside className="w-[340px] sm:w-[380px] border-l bg-white dark:bg-zinc-900 flex flex-col min-h-0 shrink-0 z-10 shadow-lg animate-in slide-in-from-right duration-200">
      {/* ── Drawer Header ── */}
      <div className="p-3 border-b bg-zinc-50/80 dark:bg-zinc-850/80 shrink-0 space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-xs uppercase tracking-wider text-foreground flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5 text-primary" />
              Tốc ký học viên ({students.length})
            </span>
            <Badge variant="outline" className="bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400 border-emerald-200 text-[10px] font-bold px-1.5 py-0">
              {taggedCount}/{students.length} đã note
            </Badge>
          </div>

          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="h-7 w-7 rounded-lg text-zinc-400 hover:text-foreground cursor-pointer"
            title="Thu gọn bảng tốc ký"
          >
            <PanelRightClose className="h-4 w-4" />
          </Button>
        </div>

        {/* Search input */}
        <div className="relative">
          <Search className="h-3.5 w-3.5 absolute left-2.5 top-2.5 text-muted-foreground" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tìm theo tên học viên..."
            className="h-8 pl-8 text-xs bg-background rounded-lg border-zinc-200 dark:border-zinc-700"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-2 text-muted-foreground hover:text-foreground"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* ── Student List Body ── */}
      <div className="flex-1 overflow-y-auto p-2 space-y-2.5 custom-scrollbar">
        {filteredStudents.length === 0 ? (
          <div className="p-8 text-center text-xs text-muted-foreground italic">
            Không tìm thấy học viên phù hợp.
          </div>
        ) : (
          filteredStudents.map((student) => {
            const nameParts = getStudentNameParts(student)
            const log = studentLogs[student.id] || {
              studentId: student.id,
              tags: [],
              quickNote: '',
              starsEarned: 4,
            }
            const isRecording = recordingStudentId === student.id
            const hasTags = log.tags.length > 0

            return (
              <div
                key={student.id}
                className={cn(
                  'rounded-xl border p-2.5 transition-all space-y-2 bg-white dark:bg-zinc-950/60 shadow-2xs',
                  hasTags
                    ? 'border-primary/30 bg-sky-50/20 dark:bg-sky-950/10'
                    : 'border-zinc-200 dark:border-zinc-800 hover:border-zinc-300'
                )}
              >
                {/* Line 1: Student Profile + Voice Memo Button */}
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <div
                      className={cn(
                        'h-7 w-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 shadow-2xs',
                        getAvatarColor(student.id)
                      )}
                    >
                      {getInitials(nameParts.hasEnglishName ? nameParts.englishName! : student.name)}
                    </div>

                    <div className="min-w-0 leading-tight">
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-xs text-foreground truncate">
                          {nameParts.hasEnglishName ? nameParts.englishName : nameParts.vietnameseName}
                        </span>
                        {nameParts.hasEnglishName && (
                          <span className="text-[11px] text-muted-foreground truncate">
                            ({nameParts.vietnameseName})
                          </span>
                        )}
                        {student.status === 'trial' && (
                          <Badge className="bg-purple-100 text-purple-700 dark:bg-purple-950/50 dark:text-purple-300 border-none text-[9px] px-1 py-0 font-bold">
                            Trial
                          </Badge>
                        )}
                      </div>
                      <span className="text-[10px] font-mono text-muted-foreground">{student.code}</span>
                    </div>
                  </div>

                  {/* Voice memo / Quick action buttons */}
                  <div className="flex items-center gap-1 shrink-0">
                    <Button
                      type="button"
                      size="icon"
                      variant="ghost"
                      onClick={() => handleToggleVoiceMemo(student)}
                      className={cn(
                        'h-6 w-6 rounded-full cursor-pointer transition-all',
                        isRecording
                          ? 'bg-rose-500 text-white animate-bounce'
                          : log.hasVoiceMemo
                            ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400'
                            : 'text-zinc-400 hover:text-primary hover:bg-zinc-100 dark:hover:bg-zinc-800'
                      )}
                      title="Ghi âm nhận xét nhanh 3 giây (Speech-to-Text)"
                    >
                      {isRecording ? <MicOff className="h-3 w-3" /> : <Mic className="h-3 w-3" />}
                    </Button>
                  </div>
                </div>

                {/* Line 2: 1-Tap Quick Action Tags (Bám sát trực tiếp bài học J1 Pooka Wooka / Cambridge) */}
                <div className="flex flex-wrap gap-1.5 pt-0.5">
                  {availableTags.map((tag) => {
                    const isSelected = log.tags.includes(tag.id)
                    return (
                      <button
                        key={tag.id}
                        type="button"
                        onClick={() => handleToggleTag(student, tag)}
                        className={cn(
                          'inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-medium border transition-all cursor-pointer select-none active:scale-95',
                          isSelected
                            ? 'bg-primary text-primary-foreground border-primary font-bold shadow-2xs'
                            : `${tag.colorClass} hover:opacity-80`
                        )}
                        title={tag.label}
                      >
                        <span className="text-xs leading-none">{tag.icon}</span>
                        <span>{tag.shortLabel}</span>
                        {isSelected && <Check className="h-2.5 w-2.5 stroke-[3px] ml-0.5" />}
                      </button>
                    )
                  })}
                </div>

                {/* Line 3: Quick Text Note Input */}
                <div className="pt-0.5">
                  <Input
                    value={log.quickNote}
                    onChange={(e) => handleNoteChange(student.id, e.target.value)}
                    placeholder={
                      isMath
                        ? 'Ghi chú nhanh (ví dụ: cần nhắc nháp cẩn thận)...'
                        : 'Quick note (e.g. practice /s/ sound, speak louder)...'
                    }
                    className="h-6.5 text-[11px] bg-zinc-50/70 dark:bg-zinc-900/60 border-zinc-200/80 dark:border-zinc-800 rounded-md placeholder:text-muted-foreground/45"
                  />
                </div>
              </div>
            )
          })
        )}
      </div>

      {/* ── Drawer Footer ── */}
      <div className="p-3 border-t bg-zinc-50/90 dark:bg-zinc-900/90 text-xs text-muted-foreground shrink-0 space-y-1">
        <div className="flex items-center justify-between text-[11px]">
          <span>Tiến độ tốc ký trong giờ:</span>
          <strong className="font-mono text-foreground font-bold">
            {Math.round((taggedCount / Math.max(1, students.length)) * 100)}%
          </strong>
        </div>
        <div className="w-full bg-zinc-200 dark:bg-zinc-800 h-1.5 rounded-full overflow-hidden">
          <div
            className="bg-emerald-500 h-full transition-all duration-300"
            style={{ width: `${(taggedCount / Math.max(1, students.length)) * 100}%` }}
          />
        </div>
        <p className="text-[10px] text-muted-foreground pt-0.5 italic text-center">
          💡 Các tag tốc ký sẽ tự động được AI điền vào Form đánh giá cuối buổi.
        </p>
      </div>
    </aside>
  )
}
