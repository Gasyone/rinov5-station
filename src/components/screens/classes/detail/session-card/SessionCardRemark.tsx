'use client'

import { useState } from 'react'
import { Pencil, Check, X, FileText } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import type { RoadmapSession } from '../classesDetailTypes'

export interface SessionCardRemarkProps {
  session: RoadmapSession
  onUpdateSession?: (id: string, updates: Partial<RoadmapSession>) => void
  isEditing?: boolean
  onEditChange?: (editing: boolean) => void
}

function renderFormattedNote(text: string) {
  if (!text) return null
  const parts = text.split(/(@[A-ZÀ-Ỹa-zà-ỹ0-9_\s]+?(?=\s[a-z0-9]|\s[A-ZÀ-Ỹ][a-z0-9]|$|[\.,!\?]))/g)

  return (
    <span>
      {parts.map((part, i) => {
        if (part.startsWith('@')) {
          return (
            <span
              key={i}
              className="inline-flex items-center rounded-md bg-primary/10 px-1 py-0.2 text-xs font-semibold text-primary mr-1"
            >
              {part}
            </span>
          )
        }
        return part
      })}
    </span>
  )
}

export function SessionCardRemark({
  session,
  onUpdateSession,
  isEditing: externalIsEditing,
  onEditChange,
}: SessionCardRemarkProps) {
  const [internalIsEditing, setInternalIsEditing] = useState(false)
  const isEditing = externalIsEditing !== undefined ? externalIsEditing : internalIsEditing
  const setIsEditing = (val: boolean) => {
    setInternalIsEditing(val)
    onEditChange?.(val)
  }
  const [remarkInput, setRemarkInput] = useState(session.description || '')

  const handleSave = () => {
    onUpdateSession?.(session.id, { description: remarkInput.trim() })
    setIsEditing(false)
    toast.success('Đã lưu ghi chú buổi học!')
  }

  const handleCancel = () => {
    setRemarkInput(session.description || '')
    setIsEditing(false)
  }

  if (isEditing) {
    return (
      <div className="mt-1.5 space-y-1.5 rounded-lg border border-primary/30 bg-primary/5 p-2" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between text-xs font-semibold text-primary">
          <span className="flex items-center gap-1.5">
            <Pencil className="h-3 w-3" />
            <span>Ghi chú buổi học</span>
          </span>
          <span className="text-xs text-muted-foreground font-normal">Tag @tên học viên</span>
        </div>
        <Textarea
          value={remarkInput}
          onChange={(e) => setRemarkInput(e.target.value)}
          placeholder="Nhập ghi chú nhận xét buổi học (VD: @Nguyễn Hoàng Vũ tiếp thu tốt...)"
          className="min-h-[50px] text-xs bg-background resize-y"
          autoFocus
        />
        <div className="flex items-center justify-end gap-1.5">
          <Button
            type="button"
            variant="ghost"
            size="xs"
            onClick={handleCancel}
            className="h-5 px-1.5 text-xs"
          >
            <X className="h-3 w-3 me-1" />
            Hủy
          </Button>
          <Button
            type="button"
            size="xs"
            onClick={handleSave}
            className="h-5 px-2 text-xs bg-primary text-primary-foreground font-semibold"
          >
            <Check className="h-3 w-3 me-1" />
            Lưu
          </Button>
        </div>
      </div>
    )
  }

  if (!session.description) {
    return null
  }

  return (
    <div
      className="mt-1 flex items-start gap-1.5 rounded-md bg-amber-500/10 border border-amber-500/20 px-2 py-1 text-xs text-foreground group/remark"
      onClick={(e) => e.stopPropagation()}
    >
      <FileText className="h-3 w-3 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
      <div className="flex-1 min-w-0 leading-snug font-normal text-[11.5px]">
        <span className="font-semibold me-1 text-amber-700 dark:text-amber-300">Ghi chú:</span>
        {renderFormattedNote(session.description)}
      </div>
      <button
        type="button"
        onClick={() => setIsEditing(true)}
        className="p-0.5 rounded hover:bg-amber-500/20 text-muted-foreground/70 hover:text-primary transition-colors cursor-pointer shrink-0"
        title="Chỉnh sửa ghi chú"
      >
        <Pencil className="h-3 w-3" />
      </button>
    </div>
  )
}
