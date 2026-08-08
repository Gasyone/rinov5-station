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
              className="inline-flex items-center rounded-md bg-primary/10 px-1.5 py-0.5 text-xs font-semibold text-primary mr-1"
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

export function SessionCardRemark({ session, onUpdateSession }: SessionCardRemarkProps) {
  const [isEditing, setIsEditing] = useState(false)
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
      <div className="mt-2 space-y-2 rounded-lg border border-primary/30 bg-primary/5 p-2.5" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between text-xs font-semibold text-primary">
          <span className="flex items-center gap-1.5">
            <Pencil className="h-3.5 w-3.5" />
            <span>Ghi chú buổi học</span>
          </span>
          <span className="text-[10px] text-muted-foreground font-normal">Hỗ trợ tag @tên học viên</span>
        </div>
        <Textarea
          value={remarkInput}
          onChange={(e) => setRemarkInput(e.target.value)}
          placeholder="Nhập ghi chú nhận xét buổi học (VD: @Nguyễn Hoàng Vũ tiếp thu tốt...)"
          className="min-h-[60px] text-xs bg-background resize-y"
          autoFocus
        />
        <div className="flex items-center justify-end gap-1.5">
          <Button
            type="button"
            variant="ghost"
            size="xs"
            onClick={handleCancel}
            className="h-6 px-2 text-xs"
          >
            <X className="h-3 w-3 me-1" />
            Hủy
          </Button>
          <Button
            type="button"
            size="xs"
            onClick={handleSave}
            className="h-6 px-2 text-xs bg-primary text-primary-foreground"
          >
            <Check className="h-3 w-3 me-1" />
            Lưu ghi chú
          </Button>
        </div>
      </div>
    )
  }

  if (!session.description) {
    return (
      <div className="mt-1 flex items-center" onClick={(e) => e.stopPropagation()}>
        <button
          type="button"
          onClick={() => setIsEditing(true)}
          className="inline-flex items-center gap-1 text-[11px] font-medium text-muted-foreground/70 hover:text-primary transition-colors group/add-remark cursor-pointer"
        >
          <Pencil className="h-3 w-3 text-muted-foreground/50 group-hover/add-remark:text-primary" />
          <span>+ Thêm ghi chú nhận xét buổi học</span>
        </button>
      </div>
    )
  }

  return (
    <div
      className="mt-1.5 flex items-start gap-2 rounded-lg bg-amber-500/10 border border-amber-500/20 px-2.5 py-1.5 text-xs text-foreground group/remark"
      onClick={(e) => e.stopPropagation()}
    >
      <FileText className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
      <div className="flex-1 min-w-0 leading-relaxed font-normal">
        <span className="font-semibold me-1 text-amber-700 dark:text-amber-300">Ghi chú:</span>
        {renderFormattedNote(session.description)}
      </div>
      <button
        type="button"
        onClick={() => setIsEditing(true)}
        className="p-1 rounded hover:bg-amber-500/20 text-muted-foreground/70 hover:text-primary transition-colors cursor-pointer shrink-0"
        title="Chỉnh sửa ghi chú"
      >
        <Pencil className="h-3 w-3" />
      </button>
    </div>
  )
}
