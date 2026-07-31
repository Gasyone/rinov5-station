'use client'

import React, { useState } from 'react'
import { cn } from '@/lib/utils'
import {
  HoverCard,
  HoverCardTrigger,
  HoverCardContent,
} from '@/components/ui/hover-card'
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from '@/components/ui/popover'
import { Textarea } from '@/components/ui/textarea'
import { toast } from 'sonner'
import type { StudentTag } from '@/components/screens/classes/detail/classesDetailTypes'

// ── Constants for Icons and Colors ──
const EMOJIS = ['🆕', '⭐', '⚠️', '🔄', '🎯', '📌', '🏆', '💬', '💡', '🔥']

const FLAG_COLORS: Record<string, { bg: string; border: string; text: string }> = {
  teal:    { bg: 'bg-teal-500',    border: 'border-teal-600',    text: 'text-teal-700 dark:text-teal-300' },
  amber:   { bg: 'bg-amber-400',   border: 'border-amber-500',   text: 'text-amber-700 dark:text-amber-300' },
  rose:    { bg: 'bg-rose-500',    border: 'border-rose-600',    text: 'text-rose-700 dark:text-rose-300' },
  violet:  { bg: 'bg-violet-500',  border: 'border-violet-600',  text: 'text-violet-700 dark:text-violet-300' },
  sky:     { bg: 'bg-sky-500',     border: 'border-sky-600',     text: 'text-sky-700 dark:text-sky-300' },
  slate:   { bg: 'bg-slate-500',   border: 'border-slate-600',   text: 'text-slate-700 dark:text-slate-300' },
  emerald: { bg: 'bg-emerald-500', border: 'border-emerald-600', text: 'text-emerald-700 dark:text-emerald-300' },
}

const FLAG_POPOVER_COLORS: Record<string, { bg: string; badge: string }> = {
  teal:    { bg: 'bg-teal-50 dark:bg-teal-950/30',    badge: 'bg-teal-100 dark:bg-teal-900/50 text-teal-800 dark:text-teal-200' },
  amber:   { bg: 'bg-amber-50 dark:bg-amber-950/30',   badge: 'bg-amber-100 dark:bg-amber-900/50 text-amber-800 dark:text-amber-200' },
  rose:    { bg: 'bg-rose-50 dark:bg-rose-950/30',    badge: 'bg-rose-100 dark:bg-rose-900/50 text-rose-800 dark:text-rose-200' },
  violet:  { bg: 'bg-violet-50 dark:bg-violet-950/30',  badge: 'bg-violet-100 dark:bg-violet-900/50 text-violet-800 dark:text-violet-200' },
  sky:     { bg: 'bg-sky-50 dark:bg-sky-950/30',     badge: 'bg-sky-100 dark:bg-sky-900/50 text-sky-800 dark:text-sky-200' },
  slate:   { bg: 'bg-slate-50 dark:bg-slate-950/30',   badge: 'bg-slate-100 dark:bg-slate-900/50 text-slate-800 dark:text-slate-200' },
  emerald: { bg: 'bg-emerald-50 dark:bg-emerald-950/30', badge: 'bg-emerald-100 dark:bg-emerald-900/50 text-emerald-800 dark:text-emerald-200' },
}

const COLORS_LIST = [
  { name: 'teal', bg: 'bg-teal-500' },
  { name: 'amber', bg: 'bg-amber-400' },
  { name: 'rose', bg: 'bg-rose-500' },
  { name: 'violet', bg: 'bg-violet-500' },
  { name: 'sky', bg: 'bg-sky-500' },
  { name: 'slate', bg: 'bg-slate-500' },
  { name: 'emerald', bg: 'bg-emerald-500' },
] as const

// ── Tag Recording Form ──
interface TagFormProps {
  initialTag?: StudentTag
  onSave: (tagData: Omit<StudentTag, 'id' | 'tagType' | 'assignedBy' | 'assignedDate' | 'isAutomatic'>) => void
  onDelete?: () => void
  onCancel: () => void
}

function TagForm({ initialTag, onSave, onDelete, onCancel }: TagFormProps) {
  const [emoji, setEmoji] = useState(initialTag?.emoji ?? EMOJIS[0])
  const [label, setLabel] = useState(initialTag?.label ?? '')
  const [color, setColor] = useState<StudentTag['color']>(initialTag?.color ?? 'teal')
  const [description, setDescription] = useState(initialTag?.description ?? '')
  const [note, setNote] = useState(initialTag?.note ?? '')

  return (
    <div className="space-y-3 p-3 w-[260px] text-xs">
      <div className="flex items-center justify-between border-b pb-1.5 dark:border-zinc-800">
        <span className="font-bold text-foreground">
          {initialTag ? 'Sửa nhãn tag' : 'Ghi nhận nhãn tag mới'}
        </span>
        {initialTag && onDelete && !initialTag.isAutomatic && (
          <button
            type="button"
            onClick={onDelete}
            className="text-[10px] text-destructive hover:underline font-semibold cursor-pointer border-none bg-transparent p-0"
          >
            Xóa nhãn
          </button>
        )}
      </div>

      {/* Emoji selector */}
      <div className="space-y-1">
        <label className="text-[9px] font-bold text-muted-foreground uppercase">Biểu tượng (Icon)</label>
        <div className="flex flex-wrap gap-1">
          {EMOJIS.map((em) => (
            <button
              key={em}
              type="button"
              onClick={() => setEmoji(em)}
              className={cn(
                "w-6 h-6 rounded flex items-center justify-center text-xs border hover:bg-zinc-50 dark:hover:bg-zinc-800 cursor-pointer bg-transparent",
                emoji === em ? "border-primary bg-primary/5 font-bold scale-105" : "border-zinc-200 dark:border-zinc-800"
              )}
            >
              {em}
            </button>
          ))}
        </div>
      </div>

      {/* Color selector */}
      <div className="space-y-1">
        <label className="text-[9px] font-bold text-muted-foreground uppercase">Màu sắc</label>
        <div className="flex gap-2 items-center">
          {COLORS_LIST.map((c) => (
            <button
              key={c.name}
              type="button"
              onClick={() => setColor(c.name)}
              className={cn(
                "w-4 h-4 rounded-full cursor-pointer transition-all border-none",
                c.bg,
                color === c.name ? "ring-2 ring-offset-2 ring-primary dark:ring-offset-black scale-110" : "opacity-80 hover:opacity-100"
              )}
            />
          ))}
        </div>
      </div>

      {/* Title / Label */}
      <div className="space-y-1">
        <label className="text-[9px] font-bold text-muted-foreground uppercase">Tiêu đề nhãn</label>
        <input
          type="text"
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          placeholder="Ví dụ: VIP, Cần chú ý..."
          disabled={initialTag?.isAutomatic}
          className="w-full px-2 py-1.5 text-xs border rounded-md dark:bg-zinc-900 dark:border-zinc-800 focus:outline-none focus:ring-1 focus:ring-primary disabled:opacity-60"
        />
      </div>

      {/* Description */}
      <div className="space-y-1">
        <label className="text-[9px] font-bold text-muted-foreground uppercase">Mô tả</label>
        <input
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Mô tả mục đích nhãn..."
          disabled={initialTag?.isAutomatic}
          className="w-full px-2 py-1.5 text-xs border rounded-md dark:bg-zinc-900 dark:border-zinc-800 focus:outline-none focus:ring-1 focus:ring-primary disabled:opacity-60"
        />
      </div>

      {/* Note */}
      <div className="space-y-1">
        <label className="text-[9px] font-bold text-muted-foreground uppercase">Ghi chú riêng</label>
        <Textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Nhập ghi chú chi tiết cho học viên..."
          className="min-h-12 text-[11px] p-2 resize-none rounded-md"
        />
      </div>

      {/* Action buttons */}
      <div className="flex justify-end gap-1.5 pt-2 border-t dark:border-zinc-800">
        <button
          type="button"
          onClick={onCancel}
          className="px-2.5 py-1.5 rounded border text-[10px] font-semibold text-zinc-500 hover:bg-zinc-50 dark:hover:bg-zinc-850 cursor-pointer bg-transparent"
        >
          Hủy
        </button>
        <button
          type="button"
          onClick={() => {
            if (!label.trim()) {
              toast.error('Vui lòng nhập tiêu đề nhãn.')
              return
            }
            onSave({ emoji, label, color, description, note })
          }}
          className="px-2.5 py-1.5 rounded bg-primary text-primary-foreground hover:bg-primary/95 text-[10px] font-semibold cursor-pointer border-none"
        >
          Lưu
        </button>
      </div>
    </div>
  )
}

// ── Single Flag (with HoverCard and Popover Edit) ──
interface StudentTagFlagProps {
  tag: StudentTag
  onUpdate: (updatedTag: StudentTag) => void
  onDelete: () => void
}

function StudentTagFlagSingle({ tag, onUpdate, onDelete }: StudentTagFlagProps) {
  const [isEditOpen, setIsEditOpen] = useState(false)
  const colors = FLAG_COLORS[tag.color] ?? FLAG_COLORS.slate
  const popColors = FLAG_POPOVER_COLORS[tag.color] ?? FLAG_POPOVER_COLORS.slate

  return (
    <Popover open={isEditOpen} onOpenChange={setIsEditOpen}>
      <HoverCard openDelay={200} closeDelay={100}>
        <PopoverTrigger asChild>
          <HoverCardTrigger asChild>
            {/* Pennant ribbon flag shape via CSS clip-path */}
            <span
              className={cn(
                'inline-flex items-center justify-center cursor-pointer select-none transition-transform hover:scale-110',
                'w-[14px] h-[20px] text-[8px] leading-none text-white font-bold',
                colors.bg,
              )}
              style={{
                clipPath: 'polygon(0 0, 100% 0, 100% 75%, 50% 100%, 0 75%)',
              }}
              title={tag.label}
              onClick={(e) => {
                e.stopPropagation()
                setIsEditOpen(true)
              }}
            >
              {tag.emoji}
            </span>
          </HoverCardTrigger>
        </PopoverTrigger>
        <HoverCardContent
          side="top"
          align="start"
          sideOffset={6}
          className="w-56 p-0 rounded-lg shadow-xl border-none overflow-hidden animate-in fade-in-50 duration-200"
        >
          {/* Header */}
          <div className={cn('px-3 py-2.5 flex items-center gap-2', popColors.bg)}>
            <span className="text-base leading-none">{tag.emoji}</span>
            <div className="min-w-0">
              <p className={cn('text-[11px] font-bold leading-tight', popColors.badge.split(' ').filter(c => c.startsWith('text-')).join(' '))}>
                {tag.label}
              </p>
              {tag.isAutomatic && (
                <span className="text-[9px] text-muted-foreground italic">Tự động gán</span>
              )}
            </div>
          </div>
          {/* Body */}
          <div className="px-3 py-2 space-y-1.5">
            <p className="text-[10px] text-muted-foreground leading-snug">
              {tag.description}
            </p>
            {tag.note && (
              <div className="bg-zinc-50 dark:bg-zinc-900 rounded-md px-2 py-1.5 border border-zinc-100 dark:border-zinc-800">
                <p className="text-[9px] font-semibold text-muted-foreground mb-0.5">📝 Ghi chú:</p>
                <p className="text-[10px] text-foreground leading-snug">{tag.note}</p>
              </div>
            )}
            <div className="flex items-center justify-between pt-1 border-t border-zinc-100 dark:border-zinc-800">
              <span className="text-[9px] text-muted-foreground">
                👤 {tag.assignedBy}
              </span>
              <button
                type="button"
                className="text-[9px] text-primary hover:underline font-semibold cursor-pointer border-none bg-transparent p-0"
                onClick={(e) => {
                  e.stopPropagation()
                  setIsEditOpen(true)
                }}
              >
                Sửa nhãn
              </button>
            </div>
          </div>
        </HoverCardContent>
      </HoverCard>
      <PopoverContent className="w-auto p-0" side="top" align="start">
        <TagForm
          initialTag={tag}
          onSave={(updatedData) => {
            onUpdate({
              ...tag,
              ...updatedData,
            })
            setIsEditOpen(false)
          }}
          onDelete={() => {
            onDelete()
            setIsEditOpen(false)
          }}
          onCancel={() => setIsEditOpen(false)}
        />
      </PopoverContent>
    </Popover>
  )
}

// ── Flag Group: renders multiple flags in a row ──
const MAX_VISIBLE_FLAGS = 5

interface StudentTagFlagsProps {
  tags: StudentTag[]
  className?: string
  onUpdateTags?: (tags: StudentTag[]) => void
}

export function StudentTagFlags({ tags, className, onUpdateTags }: StudentTagFlagsProps) {
  const [isAddOpen, setIsAddOpen] = useState(false)

  const visible = tags.slice(0, MAX_VISIBLE_FLAGS)
  const overflow = tags.length - MAX_VISIBLE_FLAGS

  const handleSaveNewTag = (tagData: Omit<StudentTag, 'id' | 'tagType' | 'assignedBy' | 'assignedDate' | 'isAutomatic'>) => {
    const newTag: StudentTag = {
      ...tagData,
      tagType: 'teacher_note',
      id: `tag-${Date.now()}`,
      assignedBy: 'Mỹ Linh',
      assignedDate: '09/07/2026',
      isAutomatic: false,
    }
    if (onUpdateTags) {
      onUpdateTags([...tags, newTag])
    }
    setIsAddOpen(false)
  }

  const handleUpdateTag = (indexToUpdate: number, updatedTag: StudentTag) => {
    const updated = tags.map((t, idx) => idx === indexToUpdate ? updatedTag : t)
    if (onUpdateTags) {
      onUpdateTags(updated)
    }
  }

  const handleDeleteTag = (indexToDelete: number) => {
    const updated = tags.filter((_, idx) => idx !== indexToDelete)
    if (onUpdateTags) {
      onUpdateTags(updated)
    }
  }

  return (
    <div className={cn('flex items-center gap-[3px] mt-1', className)}>
      {visible.map((tag, idx) => (
        <StudentTagFlagSingle
          key={tag.id}
          tag={tag}
          onUpdate={(updated) => handleUpdateTag(idx, updated)}
          onDelete={() => handleDeleteTag(idx)}
        />
      ))}
      {overflow > 0 && (
        <HoverCard openDelay={200} closeDelay={100}>
          <HoverCardTrigger asChild>
            <span
              className="inline-flex items-center justify-center w-[14px] h-[20px] text-[7px] leading-none font-bold text-white bg-zinc-400 dark:bg-zinc-600 cursor-default select-none"
              style={{ clipPath: 'polygon(0 0, 100% 0, 100% 75%, 50% 100%, 0 75%)' }}
              title={`+${overflow} nhãn khác`}
            >
              +{overflow}
            </span>
          </HoverCardTrigger>
          <HoverCardContent side="top" align="start" sideOffset={6} className="w-48 p-2 rounded-lg shadow-xl">
            <p className="text-[10px] font-semibold text-muted-foreground mb-1.5">Nhãn còn lại:</p>
            <div className="flex flex-wrap gap-1">
              {tags.slice(MAX_VISIBLE_FLAGS).map((tag) => {
                return (
                  <span
                    key={tag.id}
                    className={cn(
                      'inline-flex items-center gap-1 text-[9px] font-medium px-1.5 py-0.5 rounded-full cursor-pointer transition-opacity hover:opacity-80',
                      FLAG_POPOVER_COLORS[tag.color]?.badge ?? 'bg-zinc-100 text-zinc-700',
                    )}
                  >
                    {tag.emoji} {tag.label}
                  </span>
                )
              })}
            </div>
          </HoverCardContent>
        </HoverCard>
      )}

      {/* Popover wrapper around the "+" add button */}
      {onUpdateTags && (
        <Popover open={isAddOpen} onOpenChange={setIsAddOpen}>
          <PopoverTrigger asChild>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                setIsAddOpen(true)
              }}
              className="inline-flex items-center justify-center w-[14px] h-[14px] rounded-full bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-400 dark:text-zinc-500 hover:bg-primary/10 hover:text-primary hover:border-primary/30 transition-all cursor-pointer ml-0.5"
              title="Gán nhãn mới"
            >
              <span className="text-[9px] font-bold leading-none">+</span>
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" side="bottom" align="start">
            <TagForm
              onSave={handleSaveNewTag}
              onCancel={() => setIsAddOpen(false)}
            />
          </PopoverContent>
        </Popover>
      )}
    </div>
  )
}