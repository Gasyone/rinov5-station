'use client'

import React, { useState } from 'react'
import { Trash2, BookOpen, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { toast } from 'sonner'
import { renderRichText } from '@/lib/renderRichText'
import type { LessonReviewContent } from './monthlyReportHelpers'

export interface LessonPlanSection {
  id: string
  title: string
  content: string
}

/**
 * Phân tích chuỗi text thô thành danh sách các section bài học riêng biệt.
 * Dòng đầu tiên của mỗi khối là tiêu đề bài học (e.g., "Buổi 1: Chủ đề Zoo Animals - Từ vựng & Phát âm").
 * Các dòng còn lại là nội dung chi tiết dạng soạn thảo thường.
 */
export function deserializeLessonSections(raw?: string): LessonPlanSection[] {
  if (!raw || !raw.trim()) return []

  const blocks = raw.trim().split(/\n\s*\n/)
  const results: LessonPlanSection[] = []

  for (let i = 0; i < blocks.length; i++) {
    const block = blocks[i].trim()
    if (!block) continue

    const lines = block
      .split('\n')
      .map((l) => l.trim())
      .filter(Boolean)
    if (lines.length === 0) continue

    const firstLine = lines[0]
    const isTitle =
      firstLine.toLowerCase().startsWith('buổi') ||
      firstLine.toLowerCase().startsWith('bài') ||
      firstLine.toLowerCase().startsWith('lesson') ||
      (!firstLine.startsWith('-') && !firstLine.startsWith('•') && !firstLine.startsWith('*'))

    if (isTitle && lines.length > 1) {
      results.push({
        id: `sec-${i}-${Date.now()}`,
        title: firstLine.replace(/^[-•*]\s*/, ''),
        content: lines.slice(1).join('\n'),
      })
    } else if (isTitle && lines.length === 1) {
      results.push({
        id: `sec-${i}-${Date.now()}`,
        title: firstLine.replace(/^[-•*]\s*/, ''),
        content: '',
      })
    } else {
      results.push({
        id: `sec-${i}-${Date.now()}`,
        title: `Buổi ${i + 1}`,
        content: lines.join('\n'),
      })
    }
  }

  // Fallback: nếu các buổi không cách nhau bằng 2 dòng trống nhưng có từ khóa "Buổi" / "Bài"
  if (results.length <= 1 && (raw.includes('Buổi ') || raw.includes('Bài '))) {
    const regex = /(?:^|\n)((?:Buổi|Bài|Lesson)\s+\d+[^:\n]*:?[^\n]*)/gi
    const matches = Array.from(raw.matchAll(regex))
    if (matches.length > 1) {
      const fallbackResults: LessonPlanSection[] = []
      for (let m = 0; m < matches.length; m++) {
        const titleMatch = matches[m][1].trim().replace(/^[-•*]\s*/, '')
        const startIdx = matches[m].index! + matches[m][0].length
        const endIdx = m < matches.length - 1 ? matches[m + 1].index! : raw.length
        const contentStr = raw.slice(startIdx, endIdx).trim()
        fallbackResults.push({
          id: `sec-fb-${m}-${Date.now()}`,
          title: titleMatch,
          content: contentStr,
        })
      }
      if (fallbackResults.length > 0) return fallbackResults
    }
  }

  return results
}

/**
 * Gom danh sách các section bài học thành chuỗi text được phân cách bằng 2 dòng trống.
 * Dòng 1 là Tiêu đề, các dòng sau là Nội dung.
 */
export function serializeLessonSections(sections: LessonPlanSection[]): string {
  return sections
    .map((s) => {
      const title = s.title.trim()
      const content = s.content.trim()
      if (!title && !content) return ''
      if (!content) return title
      if (!title) return content
      return `${title}\n${content}`
    })
    .filter(Boolean)
    .join('\n\n')
}

/**
 * Tạo danh sách các section từ khung chương trình trong khoảng bài đã chọn.
 */
export function generateSectionsForRange(
  startNum: number,
  endNum: number,
  lessons: LessonReviewContent[],
  isMath?: boolean
): LessonPlanSection[] {
  const min = Math.min(startNum, endNum)
  const max = Math.max(startNum, endNum)
  const filtered = lessons.filter(
    (l) => l.lessonNumber >= min && l.lessonNumber <= max
  )

  return filtered.map((l, idx) => {
    const cleanTitle = l.title
      ? l.title.replace(/^Level:\s*[^:]*:\s*/i, '').replace(/^Kindie\s*[A-Z]\s*-\s*/i, '').trim()
      : `Bài học ${l.lessonNumber}`

    const title = `Buổi ${l.lessonNumber}: ${cleanTitle}`

    let content = ''
    if (isMath) {
      const parts: string[] = []
      if (l.words) parts.push(`- Trọng tâm: ${l.words}`)
      if (l.sentences) parts.push(`- Kỹ năng tư duy: ${l.sentences}`)
      if (l.phonics) parts.push(`- Phương pháp rèn luyện: ${l.phonics}`)
      content = parts.join('\n')
    } else {
      const parts: string[] = []
      if (l.words) parts.push(`- Học từ vựng: ${l.words}`)
      if (l.sentences) parts.push(`- Luyện mẫu câu: ${l.sentences}`)
      if (l.phonics) parts.push(`- Học phát âm: ${l.phonics}`)
      content = parts.join('\n')
    }

    return {
      id: `sec-gen-${l.lessonNumber}-${Date.now()}-${idx}`,
      title,
      content,
    }
  })
}

interface MonthlyReportLessonPlanSectionEditorProps {
  value: string
  onChange: (newValue: string) => void
  isEditing: boolean
  activeLessons?: LessonReviewContent[]
  startLesson?: number
  endLesson?: number
  onStartLessonChange?: (val: number) => void
  onEndLessonChange?: (val: number) => void
  isMath?: boolean
}

export function MonthlyReportLessonPlanSectionEditor({
  value,
  onChange,
  isEditing,
  activeLessons = [],
  startLesson,
  endLesson,
  onStartLessonChange,
  onEndLessonChange,
  isMath = false,
}: MonthlyReportLessonPlanSectionEditorProps) {
  // Sync state with prop during render without useEffect (React 19 standard)
  const [prevValue, setPrevValue] = useState(value)
  const [sections, setSections] = useState<LessonPlanSection[]>(() =>
    deserializeLessonSections(value)
  )

  if (value !== prevValue) {
    setPrevValue(value)
    setSections(deserializeLessonSections(value))
  }

  const [isSynthesizing, setIsSynthesizing] = useState(false)

  const notifyChange = (newSections: LessonPlanSection[]) => {
    setSections(newSections)
    const serialized = serializeLessonSections(newSections)
    setPrevValue(serialized)
    onChange(serialized)
  }

  // Cập nhật từng section
  const handleUpdateSection = (
    idx: number,
    field: 'title' | 'content',
    val: string
  ) => {
    const updated = sections.map((s, i) => {
      if (i === idx) {
        return { ...s, [field]: val }
      }
      return s
    })
    notifyChange(updated)
  }

  // Xóa một section
  const handleRemoveSection = (idxToRemove: number) => {
    const updated = sections.filter((_, i) => i !== idxToRemove)
    notifyChange(updated)
    toast.success('Đã xóa buổi học khỏi kế hoạch.')
  }

  // Nạp bài theo khoảng bài đã chọn (Start Lesson -> End Lesson)
  const handleLoadRangeLessons = () => {
    if (!startLesson || !endLesson) {
      toast.info('Vui lòng chọn bài bắt đầu và bài kết thúc trước!')
      return
    }

    setIsSynthesizing(true)
    setTimeout(() => {
      setIsSynthesizing(false)
      const generated = generateSectionsForRange(startLesson, endLesson, activeLessons, isMath)
      if (generated.length === 0) {
        toast.info('Không tìm thấy dữ liệu bài học trong khoảng đã chọn.')
        return
      }

      notifyChange(generated)
      toast.success(
        `Đã nạp ${generated.length} bài học (Buổi ${startLesson} đến Buổi ${endLesson}) thành các mục riêng biệt!`
      )
    }, 200)
  }

  const startLessonObj = activeLessons.find((l) => l.lessonNumber === startLesson)
  const endLessonObj = activeLessons.find((l) => l.lessonNumber === endLesson)

  return (
    <div className="space-y-2">
      {/* Header bar: Tiêu đề mục & Bộ chọn khoảng bài khi ở chế độ edit */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 min-w-0">
        <label className="text-xs font-medium text-foreground/80 flex items-center gap-1.5 shrink-0">
          1. Nội dung bài học trọng tâm tháng tới
        </label>

        {isEditing && (
          <div className="flex items-center gap-1 shrink-0 ml-auto">
            {/* Start Lesson Select */}
            <Select
              value={startLesson ? String(startLesson) : undefined}
              onValueChange={(val) => onStartLessonChange?.(Number(val))}
            >
              <SelectTrigger
                className="h-6.5 text-[11px] font-normal w-[88px] sm:w-[98px] bg-background border-border/80 shadow-2xs overflow-hidden [&>span]:truncate [&>span]:block text-left px-1.5 rounded-md text-foreground"
                title={startLessonObj ? `Buổi ${startLessonObj.lessonNumber}: ${startLessonObj.title}` : undefined}
              >
                <SelectValue placeholder="Chọn bài" />
              </SelectTrigger>
              <SelectContent className="max-w-[360px] w-[320px]">
                {activeLessons.map((l) => (
                  <SelectItem
                    key={l.lessonNumber}
                    value={String(l.lessonNumber)}
                    className="text-xs font-normal py-1.5 cursor-pointer"
                  >
                    <span className="truncate block font-normal text-xs" title={`Buổi ${l.lessonNumber}: ${l.title}`}>
                      Buổi {l.lessonNumber}: {l.title}
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <span className="text-[11px] text-muted-foreground shrink-0 select-none">→</span>

            {/* End Lesson Select */}
            <Select
              value={endLesson ? String(endLesson) : undefined}
              onValueChange={(val) => onEndLessonChange?.(Number(val))}
            >
              <SelectTrigger
                className="h-6.5 text-[11px] font-normal w-[88px] sm:w-[98px] bg-background border-border/80 shadow-2xs overflow-hidden [&>span]:truncate [&>span]:block text-left px-1.5 rounded-md text-foreground"
                title={endLessonObj ? `Buổi ${endLessonObj.lessonNumber}: ${endLessonObj.title}` : undefined}
              >
                <SelectValue placeholder="Chọn bài" />
              </SelectTrigger>
              <SelectContent className="max-w-[360px] w-[320px]">
                {activeLessons.map((l) => (
                  <SelectItem
                    key={l.lessonNumber}
                    value={String(l.lessonNumber)}
                    className="text-xs font-normal py-1.5 cursor-pointer"
                  >
                    <span className="truncate block font-normal text-xs" title={`Buổi ${l.lessonNumber}: ${l.title}`}>
                      Buổi {l.lessonNumber}: {l.title}
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Load sample lessons button */}
            <Button
              type="button"
              size="sm"
              onClick={handleLoadRangeLessons}
              disabled={isSynthesizing}
              className="h-6.5 text-[11px] font-normal bg-primary hover:bg-primary/90 text-primary-foreground rounded-md px-2 shadow-2xs cursor-pointer gap-1 shrink-0"
              title="Nạp nội dung khung chương trình cho các buổi học đã chọn thành các section riêng"
            >
              {isSynthesizing ? (
                <Loader2 className="h-3 w-3 animate-spin" />
              ) : (
                <BookOpen className="h-3 w-3" />
              )}
              <span>Thêm bài</span>
            </Button>
          </div>
        )}
      </div>

      {/* Danh sách các Section bài học riêng biệt dạng tài liệu phẳng (Borderless / Notion-style) */}
      {isEditing ? (
        <div className="space-y-1">
          {sections.length === 0 ? (
            <div className="p-3 text-center rounded-lg border border-dashed border-border/70 bg-muted/5 space-y-1">
              <p className="text-xs text-muted-foreground">
                Chưa có bài học nào trong kế hoạch tháng tới.
              </p>
              <p className="text-[11px] text-muted-foreground/70">
                Chọn khoảng bài học ở trên rồi bấm &quot;Thêm bài&quot; để nạp kế hoạch bài học.
              </p>
            </div>
          ) : (
            <div className="rounded-xl border border-border/80 bg-muted/15 p-2.5 sm:p-3 divide-y divide-border/60 shadow-3xs">
              {sections.map((sec, idx) => (
                <div
                  key={sec.id || idx}
                  className="py-2.5 first:pt-0.5 last:pb-0 space-y-1 group"
                >
                  {/* Dòng tiêu đề buổi học & Nút xóa */}
                  <div className="flex items-center gap-1.5 justify-between">
                    <input
                      type="text"
                      value={sec.title}
                      onChange={(e) => handleUpdateSection(idx, 'title', e.target.value)}
                      placeholder="Tiêu đề buổi học (VD: Buổi 1: Chủ đề Zoo Animals - Từ vựng & Phát âm)"
                      className="text-xs sm:text-[13px] font-semibold text-amber-800 dark:text-amber-500 bg-transparent border-0 focus:outline-none focus:ring-0 p-0 flex-1 min-w-0 placeholder:text-muted-foreground/40 placeholder:font-normal"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => handleRemoveSection(idx)}
                      className="h-6 w-6 text-muted-foreground/50 hover:text-destructive hover:bg-destructive/10 shrink-0 cursor-pointer transition-colors"
                      title="Xóa buổi này khỏi kế hoạch"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>

                  {/* Nội dung dạng soạn thảo thường, borderless */}
                  <textarea
                    rows={3}
                    value={sec.content}
                    onChange={(e) => handleUpdateSection(idx, 'content', e.target.value)}
                    placeholder="Nhập nội dung bài học chi tiết (dạng soạn thảo thường, gạch đầu dòng)..."
                    className="w-full text-xs p-0 bg-transparent border-0 focus:outline-none focus:ring-0 leading-relaxed font-sans resize-y min-h-[50px] text-foreground/85 placeholder:text-muted-foreground/40"
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        /* Chế độ xem (readOnly) - hiển thị từng section phẳng với viền ngoài cùng và đường line */
        <div className="rounded-xl border border-border/70 bg-muted/15 p-2.5 sm:p-3 divide-y divide-border/50 shadow-3xs">
          {sections.length > 0 ? (
            sections.map((sec, idx) => (
              <div
                key={sec.id || idx}
                className="py-2 first:pt-0.5 last:pb-0 space-y-0.5"
              >
                <h5 className="font-semibold text-xs sm:text-[13px] text-amber-800 dark:text-amber-500 leading-snug">
                  {sec.title}
                </h5>
                <div className="text-xs text-foreground/85 leading-relaxed font-sans">
                  {renderRichText(sec.content)}
                </div>
              </div>
            ))
          ) : (
            <div className="text-xs text-muted-foreground/60 italic font-sans py-1">
              Chưa có nội dung bài học tháng tới.
            </div>
          )}
        </div>
      )}
    </div>
  )
}
