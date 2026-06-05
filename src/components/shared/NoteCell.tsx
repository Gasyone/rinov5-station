'use client'

import { MessageSquare } from 'lucide-react'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'

interface NoteItem {
  text: string
  author?: string
  timestamp?: string
}

interface NoteCellProps {
  /** Nội dung ghi chú (dạng chuỗi hoặc mảng đối tượng ghi chú lịch sử) */
  value?: string | NoteItem[] | null
  /** Số ký tự giới hạn cắt trước khi ẩn (mặc định 35) */
  maxLength?: number
  /** Chiều rộng tối đa của ô (mặc định max-w-44) */
  maxWidthClass?: string
  className?: string
}

/**
 * Component hiển thị ghi chú / nhận xét / bình luận thu gọn trong bảng.
 * Kèm biểu tượng tin nhắn và tự động hiển thị Tooltip chi tiết (kèm Tác giả & Ngày giờ nếu có) khi hover.
 *
 * @see docs/DESIGN_SYSTEM.md §4.2 List Page Pattern
 */
export function NoteCell({
  value,
  maxLength = 35,
  maxWidthClass = 'max-w-44',
  className,
}: NoteCellProps) {
  if (!value) {
    return <span className="text-sm text-muted-foreground italic">-</span>
  }

  // Chuẩn hóa dữ liệu đầu vào
  let latestNote = ''
  let allNotes: NoteItem[] = []

  if (typeof value === 'string') {
    latestNote = value
    allNotes = [{ text: value }]
  } else if (Array.isArray(value)) {
    if (value.length === 0) {
      return <span className="text-sm text-muted-foreground italic">-</span>
    }
    // Lấy ghi chú cuối cùng làm hiển thị chính
    const sorted = [...value]
    const latest = sorted[sorted.length - 1]
    latestNote = latest.text
    allNotes = sorted.reverse() // Xếp ghi chú mới nhất lên trên đầu trong Tooltip
  }

  if (!latestNote.trim()) {
    return <span className="text-sm text-muted-foreground italic">-</span>
  }

  const isTruncated = latestNote.length > maxLength
  const displayNote = isTruncated ? `${latestNote.slice(0, maxLength)}...` : latestNote

  const content = (
    <div className={cn('flex items-center gap-1.5 min-w-0 text-left cursor-help', maxWidthClass, className)}>
      <MessageSquare className="h-3.5 w-3.5 text-muted-foreground shrink-0 mt-0.5" />
      <p className="truncate text-xs italic text-muted-foreground leading-normal" title={isTruncated ? undefined : latestNote}>
        {displayNote}
      </p>
    </div>
  )

  return (
    <TooltipProvider delayDuration={300}>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="inline-block max-w-full">{content}</div>
        </TooltipTrigger>
        <TooltipContent className="p-3 w-64 rounded-lg shadow-lg border bg-popover text-popover-foreground max-h-60 overflow-y-auto">
          <p className="text-xs font-semibold text-muted-foreground mb-1.5">Chi tiết ghi chú:</p>
          <div className="space-y-2">
            {allNotes.map((note, index) => (
              <div key={index} className={cn('text-xs space-y-0.5 pb-1.5', index < allNotes.length - 1 && 'border-b border-border')}>
                <p className="text-foreground whitespace-pre-wrap">{note.text}</p>
                {(note.author || note.timestamp) && (
                  <p className="text-[10px] text-muted-foreground">
                    {note.author ? `${note.author} · ` : ''}
                    {note.timestamp || ''}
                  </p>
                )}
              </div>
            ))}
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
