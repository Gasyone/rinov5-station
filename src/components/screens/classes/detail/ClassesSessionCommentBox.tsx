'use client'

import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react'
import { Textarea } from '@/components/ui/textarea'
import { toast } from 'sonner'
import { User, Check, Pencil } from 'lucide-react'
import type { RosterStudent } from './classesDetailTypes'

interface ClassesSessionCommentBoxProps {
  value: string
  onChange: (val: string) => void
  placeholder?: string
  students: RosterStudent[]
  rows?: number
  minHeight?: string
}

export function ClassesSessionCommentBox({
  value,
  onChange,
  placeholder,
  students,
  rows = 3,
  minHeight = 'min-h-[56px]',
}: ClassesSessionCommentBoxProps) {
  const [showMentions, setShowMentions] = useState(false)
  const [mentionQuery, setMentionQuery] = useState('')
  const [mentionStartIndex, setMentionStartIndex] = useState<number | null>(null)
  const [selectedIndex, setSelectedIndex] = useState(0)

  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const popoverRef = useRef<HTMLDivElement>(null)

  // Filter students based on query after @ or search input
  const filteredStudents = useMemo(() => {
    if (!mentionQuery) return students
    const q = mentionQuery.toLowerCase()
    return students.filter(
      (s) =>
        s.name.toLowerCase().includes(q) ||
        (s.code && s.code.toLowerCase().includes(q))
    )
  }, [students, mentionQuery])

  const [prevQuery, setPrevQuery] = useState(mentionQuery)
  if (prevQuery !== mentionQuery) {
    setPrevQuery(mentionQuery)
    setSelectedIndex(0)
  }

  // Auto adjust height
  const adjustHeight = useCallback(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      const baseMin = rows === 1 ? 28 : 56
      textareaRef.current.style.height = `${Math.max(baseMin, textareaRef.current.scrollHeight)}px`
    }
  }, [rows])

  useEffect(() => {
    adjustHeight()
  }, [value, adjustHeight])

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value
    const cursor = e.target.selectionStart
    onChange(text)

    // Check if cursor is right after '@' or inside a mention query
    const textBeforeCursor = text.slice(0, cursor)
    const lastAtIndex = textBeforeCursor.lastIndexOf('@')

    if (lastAtIndex !== -1) {
      const queryCandidate = textBeforeCursor.slice(lastAtIndex + 1)
      // Only treat as mention if there are no spaces or newlines in the query candidate
      if (!/\s/.test(queryCandidate)) {
        setShowMentions(true)
        setMentionQuery(queryCandidate)
        setMentionStartIndex(lastAtIndex)
        return
      }
    }

    setShowMentions(false)
    setMentionQuery('')
    setMentionStartIndex(null)
  }

  const insertMention = (student: RosterStudent) => {
    if (mentionStartIndex === null || !textareaRef.current) return

    const mentionText = `@${student.name} `
    const before = value.slice(0, mentionStartIndex)
    const cursor = textareaRef.current.selectionStart
    const after = value.slice(cursor)

    const newValue = before + mentionText + after
    onChange(newValue)

    setShowMentions(false)
    setMentionQuery('')
    setMentionStartIndex(null)

    // Set cursor position after the inserted mention
    setTimeout(() => {
      if (textareaRef.current) {
        const newCursor = mentionStartIndex + mentionText.length
        textareaRef.current.focus()
        textareaRef.current.setSelectionRange(newCursor, newCursor)
      }
    }, 0)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (!showMentions || filteredStudents.length === 0) return

    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setSelectedIndex((prev) => (prev + 1) % filteredStudents.length)
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setSelectedIndex((prev) => (prev - 1 + filteredStudents.length) % filteredStudents.length)
    } else if (e.key === 'Enter' || e.key === 'Tab') {
      e.preventDefault()
      if (filteredStudents[selectedIndex]) {
        insertMention(filteredStudents[selectedIndex])
      }
    } else if (e.key === 'Escape') {
      setShowMentions(false)
    }
  }

  return (
    <div className="relative flex items-start gap-1.5 w-full">
      <Pencil className="h-3.5 w-3.5 text-amber-500 shrink-0 select-none mt-1.5 ml-1" />
      <div className="relative flex-1 min-w-0">
        <Textarea
          ref={textareaRef}
          value={value}
          onChange={handleTextareaChange}
          onKeyDown={handleKeyDown}
          onBlur={() => {
            // Delay closing popover so click event on popover item can fire
            setTimeout(() => setShowMentions(false), 200)
            if (value.trim()) {
              toast.success('Đã lưu nhận xét buổi học!')
            }
          }}
          placeholder={placeholder || 'Nhật ký buổi học: Giáo viên nhập nhận xét chung về buổi học tại đây... (Gõ @ để tag học viên)'}
          className={`text-xs ${minHeight} resize-y border-transparent shadow-none hover:border-zinc-200/80 focus:border-zinc-300 dark:focus:border-zinc-700 focus-visible:ring-1 bg-transparent px-1 py-1 transition-colors placeholder:italic placeholder:text-muted-foreground/70`}
          rows={rows}
        />

      {/* Mentions Dropdown Popover (Positioned below textarea to prevent clipping) */}
      {showMentions && (
        <div
          ref={popoverRef}
          className="absolute left-0 top-full mt-1.5 z-50 w-full min-w-[260px] max-h-64 overflow-y-auto rounded-xl border border-zinc-200 bg-white p-1.5 shadow-xl dark:border-zinc-800 dark:bg-zinc-900 animate-in fade-in-50 zoom-in-95"
        >
          {/* Popover Header */}
          <div className="px-2.5 py-1.5 border-b border-zinc-100 dark:border-zinc-800 bg-zinc-50/60 dark:bg-zinc-950/40 rounded-t-lg mb-1">
            <p className="text-xs font-bold text-zinc-800 dark:text-zinc-200">Tag học viên</p>
          </div>

          {/* Student List */}
          <div className="space-y-0.5 max-h-40 overflow-y-auto pr-0.5">
            {filteredStudents.length === 0 ? (
              <div className="px-3 py-2 text-xs text-muted-foreground italic text-center">
                Không tìm thấy học viên
              </div>
            ) : (
              filteredStudents.map((s, idx) => (
                <button
                  key={s.id}
                  type="button"
                  onMouseDown={(e) => {
                    e.preventDefault()
                    insertMention(s)
                  }}
                  className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs flex items-center gap-2.5 transition-colors cursor-pointer ${
                    idx === selectedIndex
                      ? 'bg-zinc-100 text-zinc-900 dark:bg-zinc-800 dark:text-zinc-100 font-medium'
                      : 'hover:bg-zinc-50 dark:hover:bg-zinc-850 text-zinc-700 dark:text-zinc-300'
                  }`}
                >
                  <div className="w-6 h-6 rounded-full bg-sky-100 text-sky-700 dark:bg-sky-950 dark:text-sky-300 flex items-center justify-center text-[10px] font-bold shrink-0 border border-sky-200/60 dark:border-sky-800/60">
                    {s.avatar ? (
                      <img src={s.avatar} alt="" className="w-full h-full rounded-full object-cover" />
                    ) : (
                      <User className="h-3.5 w-3.5" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1 leading-tight">
                    <p className="truncate font-bold text-xs text-foreground">{s.name}</p>
                    {s.code && (
                      <p className="text-[10px] text-muted-foreground font-mono truncate">{s.code}</p>
                    )}
                  </div>
                  {idx === selectedIndex && (
                    <Check className="h-4 w-4 text-zinc-700 dark:text-zinc-300 shrink-0 ml-auto" />
                  )}
                </button>
              ))
            )}
          </div>
        </div>
      )}
      </div>
    </div>
  )
}
