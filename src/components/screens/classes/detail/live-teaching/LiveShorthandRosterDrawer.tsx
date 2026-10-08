'use client'

import React, { useState, useMemo } from 'react'
import {
  Search,
  Sparkles,
  Check,
  PanelRightClose,
  X,
  Mic,
  MicOff,
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

  const availableTags: LiveQuickTag[] = isMath ? MATH_LIVE_TAGS : ENGLISH_LIVE_TAGS

  const filteredStudents = useMemo(() => {
    if (!searchQuery.trim()) return students
    const q = searchQuery.toLowerCase().trim()
    return students.filter(
      (s) =>
        s.name.toLowerCase().includes(q) ||
        (s.englishName && s.englishName.toLowerCase().includes(q))
    )
  }, [students, searchQuery])

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
        duration: 1200,
      })
    }
  }

  // Bật/tắt thu âm nhận xét nhanh 3 giây (Speech-to-Text / Voice Memo)
  const handleToggleVoiceMemo = (student: RosterStudent) => {
    if (recordingStudentId === student.id) {
      // Dừng thu âm
      setRecordingStudentId(null)
      const currentLog: StudentLiveLog = studentLogs[student.id] || {
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
        quickNote: demoVoiceNote,
        lastUpdated: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
      })
      toast.success(`Đã thu âm nhận xét cho ${student.name}!`, {
        duration: 1800,
      })
    } else {
      // Bắt đầu thu âm
      setRecordingStudentId(student.id)
      toast.info(`🎙️ Đang thu âm nhận xét cho ${student.name}... Chạm mic lần nữa để dừng`, {
        duration: 2500,
      })
    }
  }

  // Xóa đoạn thu âm nhận xét
  const handleRemoveVoiceMemo = (student: RosterStudent) => {
    const currentLog = studentLogs[student.id]
    if (!currentLog) return
    onUpdateStudentLog(student.id, {
      ...currentLog,
      hasVoiceMemo: false,
      voiceMemoText: '',
      quickNote: '',
    })
    toast.info(`Đã xóa đoạn thu âm của ${student.name}`)
  }

  if (!isOpen) return null

  return (
    <aside className="w-[280px] sm:w-[300px] border-l bg-white dark:bg-zinc-900 flex flex-col min-h-0 shrink-0 z-10 shadow-lg animate-in slide-in-from-right duration-200">
      {/* ── Drawer Header ── */}
      <div className="px-3 py-2 border-b bg-zinc-50/80 dark:bg-zinc-850/80 shrink-0 space-y-1.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 min-w-0">
            <span className="font-extrabold text-xs uppercase tracking-wider text-foreground flex items-center gap-1 truncate">
              <Sparkles className="h-3 w-3 text-primary shrink-0" />
              Tốc ký học viên ({students.length})
            </span>
          </div>

          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="h-6.5 w-6.5 rounded-md text-zinc-400 hover:text-foreground cursor-pointer shrink-0"
            title="Thu gọn bảng tốc ký"
          >
            <PanelRightClose className="h-3.5 w-3.5" />
          </Button>
        </div>

        {/* Search input (Gọn gàng) */}
        <div className="relative">
          <Search className="h-3.5 w-3.5 absolute left-2 top-2 text-muted-foreground" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tìm theo tên học viên..."
            className="h-7.5 pl-7 pr-6 text-xs bg-background rounded-md border-zinc-200 dark:border-zinc-700"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2 top-1.5 text-muted-foreground hover:text-foreground cursor-pointer"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* ── Student List Body (Bỏ mã, bỏ ô nhập text, có nút thu âm/mic trực quan) ── */}
      <div className="flex-1 overflow-y-auto p-2 space-y-1.5 custom-scrollbar">
        {filteredStudents.length === 0 ? (
          <div className="p-6 text-center text-xs text-muted-foreground italic">
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
                  'rounded-lg border p-2 transition-all space-y-1.5',
                  hasTags || log.hasVoiceMemo
                    ? 'border-emerald-300 dark:border-emerald-800/80 bg-emerald-50/25 dark:bg-emerald-950/15'
                    : 'border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950/50 hover:border-zinc-300 dark:hover:border-zinc-700'
                )}
              >
                {/* Dòng 1: Avatar + Tên học viên + Nút Thu âm/Mic + Badge */}
                <div className="flex items-center justify-between gap-1.5 min-w-0">
                  <div className="flex items-center gap-1.5 min-w-0">
                    <div
                      className={cn(
                        'h-5.5 w-5.5 rounded-full flex items-center justify-center text-xs font-bold shrink-0 shadow-2xs',
                        getAvatarColor(student.id)
                      )}
                    >
                      {getInitials(nameParts.hasEnglishName ? nameParts.englishName! : student.name)}
                    </div>

                    <div className="flex items-center gap-1 min-w-0 truncate">
                      <span className="font-semibold text-xs text-foreground truncate">
                        {nameParts.hasEnglishName ? nameParts.englishName : nameParts.vietnameseName}
                      </span>
                      {nameParts.hasEnglishName && (
                        <span className="text-[10.5px] text-muted-foreground truncate">
                          ({nameParts.vietnameseName})
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    {student.status === 'trial' && (
                      <Badge className="bg-purple-100 text-purple-700 dark:bg-purple-950/50 dark:text-purple-300 border-none text-[8.5px] px-1 py-0 font-bold">
                        Trial
                      </Badge>
                    )}

                    {/* Nút Thu âm / Ghi âm nhận xét nhanh 3s (Voice Memo) */}
                    <button
                      type="button"
                      onClick={() => handleToggleVoiceMemo(student)}
                      className={cn(
                        'h-6 w-6 rounded-md flex items-center justify-center transition-all cursor-pointer',
                        isRecording
                          ? 'bg-rose-500 text-white animate-pulse shadow-xs ring-2 ring-rose-300 dark:ring-rose-900'
                          : log.hasVoiceMemo
                            ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700'
                            : 'text-zinc-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30'
                      )}
                      title={
                        isRecording
                          ? 'Đang thu âm... Chạm để kết thúc'
                          : log.hasVoiceMemo
                            ? `Đã thu âm: "${log.voiceMemoText}". Chạm để ghi âm lại`
                            : 'Thu âm nhận xét nhanh (Speech-to-Text)'
                      }
                    >
                      {isRecording ? (
                        <MicOff className="h-3.5 w-3.5" />
                      ) : (
                        <Mic className="h-3.5 w-3.5" />
                      )}
                    </button>

                    {/* Huy hiệu số lượng tag đã chọn */}
                    {hasTags && (
                      <span className="inline-flex items-center gap-0.5 text-[9.5px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 px-1 py-0 rounded">
                        <Check className="h-2.5 w-2.5 stroke-[3px]" />
                        {log.tags.length}
                      </span>
                    )}
                  </div>
                </div>

                {/* Banner trạng thái đang thu âm */}
                {isRecording && (
                  <div className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-600 dark:text-rose-400 text-xs font-medium animate-pulse">
                    <span className="h-1.5 w-1.5 rounded-full bg-rose-500 animate-ping shrink-0" />
                    <span className="truncate">Đang thu âm... Chạm mic để dừng</span>
                  </div>
                )}

                {/* Hiển thị đoạn text thu âm nhận xét ngắn */}
                {!isRecording && log.hasVoiceMemo && (
                  <div className="flex items-center justify-between gap-1.5 px-2 py-0.5 rounded-md bg-emerald-50/80 dark:bg-emerald-950/40 border border-emerald-200/80 dark:border-emerald-800/60 text-emerald-800 dark:text-emerald-300 text-xs">
                    <div className="flex items-center gap-1 min-w-0 truncate">
                      <span className="text-xs shrink-0">🎙️</span>
                      <span className="truncate italic font-medium">&quot;{log.voiceMemoText}&quot;</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveVoiceMemo(student)}
                      className="text-zinc-400 hover:text-rose-600 shrink-0 cursor-pointer p-0.5"
                      title="Xóa đoạn thu âm này"
                    >
                      <X className="h-2.5 w-2.5" />
                    </button>
                  </div>
                )}

                {/* Dòng 2: Tag tốc ký 1 chạm */}
                <div className="flex flex-wrap gap-1">
                  {availableTags.map((tag) => {
                    const isSelected = log.tags.includes(tag.id)
                    return (
                      <button
                        key={tag.id}
                        type="button"
                        onClick={() => handleToggleTag(student, tag)}
                        className={cn(
                          'inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-xs font-medium border transition-all cursor-pointer select-none active:scale-95 leading-tight',
                          isSelected
                            ? 'bg-primary text-primary-foreground border-primary font-bold shadow-2xs'
                            : `${tag.colorClass} hover:opacity-85`
                        )}
                        title={tag.label}
                      >
                        <span className="text-xs leading-none">{tag.icon}</span>
                        <span>{tag.shortLabel}</span>
                        {isSelected && <Check className="h-2 w-2 stroke-[3px] ml-0.5" />}
                      </button>
                    )
                  })}
                </div>
              </div>
            )
          })
        )}
      </div>
    </aside>
  )
}
