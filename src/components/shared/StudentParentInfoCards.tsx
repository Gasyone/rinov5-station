'use client'

import { useState } from 'react'
import { Copy, ChevronDown, Pencil, History, X } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'

export interface ParentNoteHistoryEntry {
  id: string
  author: string
  date: string
  content: string
}

export interface ParentMemberInfo {
  name: string
  relationship: string
  isPrimary?: boolean
  phone: string
  note?: string
  noteHistory?: ParentNoteHistoryEntry[]
}

export interface StudentParentInfoCardsProps {
  parents?: ParentMemberInfo[]
  className?: string
}

const defaultNoteHistory: ParentNoteHistoryEntry[] = [
  {
    id: '1',
    author: 'CSM Quỳnh Anh',
    date: '15/06/2025 09:30',
    content: 'Người liên hệ chính. Rất quan tâm lộ trình của con, thích nhận tin nhắn Zalo hơn gọi trực tiếp.',
  },
  {
    id: '2',
    author: 'CS Lan Anh',
    date: '20/03/2025 14:15',
    content: 'Phụ huynh quan tâm đến kết quả thi IELTS. Thường hỏi thăm con vào chiều thứ 7.',
  },
  {
    id: '3',
    author: 'CSM Thu Hà',
    date: '10/01/2025 10:00',
    content: 'Liên hệ qua Zalo, không nhận cuộc gọi trong giờ hành chính.',
  },
]

export const defaultMockParents: ParentMemberInfo[] = [
  {
    name: 'Nguyễn Thị Mai',
    relationship: 'Mẹ',
    isPrimary: true,
    phone: '090912294',
    note: 'Người liên hệ chính. Rất quan tâm lộ trình của con, thích nhận tin nhắn Zalo hơn gọi trực tiếp.',
    noteHistory: defaultNoteHistory,
  },
  {
    name: 'Trần Văn Sơn',
    relationship: 'Bố',
    isPrimary: false,
    phone: '091912999',
    note: 'Chỉ liên hệ khi khẩn cấp hoặc không gọi được cho mẹ.',
    noteHistory: [
      {
        id: '1',
        author: 'CSM Quỳnh Anh',
        date: '15/06/2025 09:35',
        content: 'Chỉ liên hệ khi khẩn cấp hoặc không gọi được cho mẹ.',
      },
    ],
  },
]

export function StudentParentInfoCards({
  parents = defaultMockParents,
  className,
}: StudentParentInfoCardsProps) {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null)
  const [editingIndex, setEditingIndex] = useState<number | null>(null)
  const [editNoteValue, setEditNoteValue] = useState('')
  const [historyParent, setHistoryParent] = useState<ParentMemberInfo | null>(null)

  const handleCopyPhone = async (phone: string, name: string) => {
    try {
      await navigator.clipboard.writeText(phone)
      toast.success(`Đã sao chép SĐT của ${name}: ${phone}`)
    } catch {
      toast.error('Không thể sao chép SĐT')
    }
  }

  const handleEditNote = (idx: number, currentNote: string) => {
    setEditingIndex(idx)
    setEditNoteValue(currentNote || '')
  }

  const handleSaveNote = () => {
    if (editingIndex !== null) {
      toast.success('Đã lưu ghi chú phụ huynh.')
      setEditingIndex(null)
      setEditNoteValue('')
    }
  }

  const handleCancelEdit = () => {
    setEditingIndex(null)
    setEditNoteValue('')
  }

  if (!parents || parents.length === 0) return null

  const isSingle = parents.length === 1

  return (
    <>
      <div className={cn('grid gap-2.5 pt-1', isSingle ? 'grid-cols-1' : 'grid-cols-1 sm:grid-cols-2', className)}>
        {parents.map((parent, idx) => {
          const isExpanded = expandedIndex === idx
          const isEditing = editingIndex === idx

          return (
            <div
              key={`${parent.phone}-${idx}`}
              className="group/parent rounded-xl border border-border/70 bg-background/80 dark:bg-zinc-900/60 p-2.5 space-y-1.5 shadow-2xs transition-all hover:border-primary/40 hover:shadow-xs"
            >
              {/* Top Row: Name + Relationship + (Chính) Badge [Left] | Phone + Copy [Right] */}
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-1.5 flex-wrap min-w-0">
                  <span className="font-extrabold text-xs text-foreground tracking-tight">{parent.name}</span>
                  <span className="text-[11px] text-muted-foreground font-medium">({parent.relationship})</span>
                  {parent.isPrimary && (
                    <Badge variant="outline" className="bg-sky-50 text-sky-700 border-sky-200 dark:bg-sky-950 dark:text-sky-300 dark:border-sky-800 text-[9.5px] py-0 px-1.5 rounded-full font-bold shadow-none">
                      Chính
                    </Badge>
                  )}
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  <span className="font-extrabold text-xs text-foreground font-mono tracking-tight">
                    {parent.phone}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleCopyPhone(parent.phone, parent.name)}
                    className="p-0.5 text-muted-foreground hover:text-foreground transition-all cursor-pointer rounded hover:bg-muted/80 opacity-0 group-hover/parent:opacity-100"
                    title={`Sao chép SĐT ${parent.name}`}
                  >
                    <Copy className="h-3 w-3" />
                  </button>
                </div>
              </div>

              {/* Bottom Row: Note text + action icons */}
              {isEditing ? (
                <div className="space-y-1.5 pt-0.5">
                  <Textarea
                    value={editNoteValue}
                    onChange={(e) => setEditNoteValue(e.target.value)}
                    className="text-[11px] min-h-[56px] resize-none"
                    placeholder="Nhập ghi chú..."
                  />
                  <div className="flex items-center justify-end gap-1.5">
                    <Button type="button" variant="ghost" size="sm" className="h-6 text-[10.5px] px-2 cursor-pointer" onClick={handleCancelEdit}>
                      Hủy
                    </Button>
                    <Button type="button" size="sm" className="h-6 text-[10.5px] px-2.5 cursor-pointer" onClick={handleSaveNote}>
                      Lưu
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-between gap-2 pt-0.5">
                  <p
                    className={cn(
                      'text-[11px] text-muted-foreground/90 italic font-normal flex-1 transition-all',
                      isExpanded ? 'whitespace-pre-wrap' : 'truncate max-w-[230px]'
                    )}
                    title={parent.note}
                  >
                    <strong className="not-italic font-semibold text-foreground/80">Ghi chú:</strong>{' '}
                    {parent.note || 'Không có ghi chú thêm'}
                  </p>

                  <div className="flex items-center gap-0.5 shrink-0">
                    {parent.note && parent.note.length > 30 && (
                      <button
                        type="button"
                        onClick={() => setExpandedIndex(isExpanded ? null : idx)}
                        className="text-[10.5px] text-muted-foreground hover:text-foreground font-medium hover:underline flex items-center gap-0.5 cursor-pointer transition-colors"
                      >
                        <span>{isExpanded ? 'Thu gọn' : 'Xem thêm'}</span>
                        <ChevronDown className={cn('h-3 w-3 transition-transform duration-200', isExpanded && 'rotate-180')} />
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => handleEditNote(idx, parent.note || '')}
                      className="p-0.5 text-muted-foreground hover:text-foreground transition-all cursor-pointer rounded hover:bg-muted/80 opacity-0 group-hover/parent:opacity-100"
                      title="Sửa ghi chú"
                    >
                      <Pencil className="h-3 w-3" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setHistoryParent(parent)}
                      className="p-0.5 text-muted-foreground hover:text-foreground transition-all cursor-pointer rounded hover:bg-muted/80 opacity-0 group-hover/parent:opacity-100"
                      title="Lịch sử ghi chú"
                    >
                      <History className="h-3 w-3" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Modal: Lịch sử ghi chú phụ huynh */}
      <Dialog open={!!historyParent} onOpenChange={(v) => !v && setHistoryParent(null)}>
        <DialogContent className="sm:max-w-[480px] max-h-[70vh] flex flex-col">
          <DialogHeader>
            <DialogTitle className="text-sm font-bold">
              Lịch sử ghi chú — {historyParent?.name} ({historyParent?.relationship})
            </DialogTitle>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto space-y-3 py-2">
            {(historyParent?.noteHistory && historyParent.noteHistory.length > 0) ? (
              historyParent.noteHistory.map((entry) => (
                <div key={entry.id} className="border border-border/60 rounded-lg p-3 space-y-1.5 bg-muted/20">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-semibold text-foreground">{entry.author}</span>
                    <span className="text-[10.5px] text-muted-foreground font-mono">{entry.date}</span>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed whitespace-pre-wrap">
                    {entry.content}
                  </p>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-xs text-muted-foreground">
                Chưa có lịch sử ghi chú nào.
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
