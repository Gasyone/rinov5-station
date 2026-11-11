'use client'

import React, { useState, useRef } from 'react'
import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Quote,
  Code,
  List,
  ListOrdered,
  CheckSquare,
  Indent,
  Outdent,
  Link2,
  Image as ImageIcon,
  Video,
  RemoveFormatting,
  Maximize2,
  Minimize2,
  ChevronDown,
} from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

const TEXT_COLORS = [
  { label: 'Mặc định', class: 'bg-zinc-800 dark:bg-zinc-200', value: '#09090b' },
  { label: 'Xanh dương', class: 'bg-sky-600', value: '#0284c7' },
  { label: 'Xanh lá', class: 'bg-emerald-600', value: '#059669' },
  { label: 'Màu cam', class: 'bg-amber-600', value: '#d97706' },
  { label: 'Màu đỏ', class: 'bg-rose-600', value: '#e11d48' },
  { label: 'Màu tím', class: 'bg-purple-600', value: '#7c3aed' },
  { label: 'Xám', class: 'bg-zinc-500', value: '#71717a' },
]

const HIGHLIGHT_COLORS = [
  { label: 'Vàng', class: 'bg-amber-200 text-amber-900', value: '#fef08a' },
  { label: 'Xanh lá nhạt', class: 'bg-emerald-200 text-emerald-900', value: '#bbf7d0' },
  { label: 'Xanh dương nhạt', class: 'bg-sky-200 text-sky-900', value: '#bae6fd' },
  { label: 'Hồng nhạt', class: 'bg-pink-200 text-pink-900', value: '#fbcfe8' },
]

interface BookingTestRichTextEditorProps {
  label: string
  value: string
  onChange: (val: string) => void
  placeholder?: string
  minHeight?: string
  sampleTemplates?: Array<{ label: string; text: string }>
  required?: boolean
  className?: string
}

export function BookingTestRichTextEditor({
  label,
  value,
  onChange,
  placeholder,
  minHeight = '110px',
  required = false,
  className,
}: BookingTestRichTextEditorProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const insertFormatting = (prefix: string, suffix: string = '') => {
    const textarea = textareaRef.current
    if (!textarea) return

    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const selectedText = value.substring(start, end)
    const replacement = prefix + selectedText + suffix
    const nextVal = value.substring(0, start) + replacement + value.substring(end)

    onChange(nextVal)

    // Restore cursor position
    setTimeout(() => {
      textarea.focus()
      const newPos = selectedText.length > 0 ? start + replacement.length : start + prefix.length
      textarea.setSelectionRange(newPos, newPos)
    }, 10)
  }

  const insertLinePrefix = (prefix: string) => {
    const textarea = textareaRef.current
    if (!textarea) return

    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const before = value.substring(0, start)
    const lineStart = before.lastIndexOf('\n') + 1
    const nextVal = value.substring(0, lineStart) + prefix + value.substring(lineStart)

    onChange(nextVal)

    setTimeout(() => {
      textarea.focus()
      textarea.setSelectionRange(end + prefix.length, end + prefix.length)
    }, 10)
  }

  const handleLink = () => {
    const url = prompt('Nhập đường dẫn liên kết (URL):', 'https://')
    if (url) {
      insertFormatting('[', `](${url})`)
    }
  }

  const handleImage = () => {
    const url = prompt('Nhập link hình ảnh hoặc phiếu bài làm:', 'https://')
    if (url) {
      insertFormatting('![Hình ảnh](', `${url})`)
    }
  }

  const handleClearFormat = () => {
    // Xóa các ký tự markdown thông dụng
    const cleaned = value.replace(/[*_~`#>]/g, '')
    onChange(cleaned)
  }

  return (
    <div
      className={cn(
        'rounded-lg border border-border/70 bg-card overflow-hidden transition-all flex flex-col',
        isExpanded ? 'fixed inset-4 z-50 shadow-2xl p-4 bg-background border-primary/50' : '',
        className
      )}
    >
      {/* Editor Header: Title + Expand */}
      <div className="flex items-center justify-between px-2.5 py-1 bg-muted/30 border-b border-border/50 min-w-0">
        <span className="text-xs font-semibold text-foreground truncate">
          {label}
          {required && <span className="text-destructive ml-0.5">*</span>}
        </span>

        <Button
          type="button"
          variant="ghost"
          size="icon-xs"
          onClick={() => setIsExpanded(!isExpanded)}
          className="size-6 text-muted-foreground hover:text-foreground cursor-pointer"
          title={isExpanded ? 'Thu nhỏ lại' : 'Mở rộng ô to'}
        >
          {isExpanded ? <Minimize2 className="size-3.5" /> : <Maximize2 className="size-3.5" />}
        </Button>
      </div>

      {/* Editor Toolbar - Gọn trên 1 hàng duy nhất */}
      <div className="px-2 py-1 bg-muted/15 border-b border-border/50 flex items-center gap-0.5 overflow-x-auto text-xs">
        {/* 1. Kiểu chữ dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              className="h-6 px-1.5 text-xs font-normal rounded border border-input bg-background hover:bg-muted text-foreground flex items-center gap-1 cursor-pointer transition-colors shrink-0"
              title="Định dạng đoạn văn"
            >
              <span>Kiểu chữ</span>
              <ChevronDown className="size-2.5 text-muted-foreground" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-36 text-xs">
            <DropdownMenuItem onClick={() => {}} className="cursor-pointer text-xs">
              Văn bản thường
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => insertLinePrefix('# ')} className="cursor-pointer text-sm font-bold">
              Tiêu đề 1 (H1)
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => insertLinePrefix('## ')} className="cursor-pointer text-xs font-bold">
              Tiêu đề 2 (H2)
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => insertLinePrefix('### ')} className="cursor-pointer text-xs font-semibold">
              Tiêu đề 3 (H3)
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <div className="h-4 w-px bg-border/80 mx-0.5 shrink-0" />

        {/* 2. Format: B, I, U, S */}
        <button
          type="button"
          onClick={() => insertFormatting('**', '**')}
          className="size-6 inline-flex items-center justify-center rounded hover:bg-muted text-foreground cursor-pointer font-bold shrink-0"
          title="In đậm (Bold)"
        >
          <Bold className="size-3.5" />
        </button>
        <button
          type="button"
          onClick={() => insertFormatting('*', '*')}
          className="size-6 inline-flex items-center justify-center rounded hover:bg-muted text-foreground cursor-pointer italic shrink-0"
          title="In nghiêng (Italic)"
        >
          <Italic className="size-3.5" />
        </button>
        <button
          type="button"
          onClick={() => insertFormatting('<u>', '</u>')}
          className="size-6 inline-flex items-center justify-center rounded hover:bg-muted text-foreground cursor-pointer underline shrink-0"
          title="Gạch chân (Underline)"
        >
          <Underline className="size-3.5" />
        </button>
        <button
          type="button"
          onClick={() => insertFormatting('~~', '~~')}
          className="size-6 inline-flex items-center justify-center rounded hover:bg-muted text-foreground cursor-pointer shrink-0"
          title="Gạch ngang (Strikethrough)"
        >
          <Strikethrough className="size-3.5" />
        </button>

        <div className="h-4 w-px bg-border/80 mx-0.5 shrink-0" />

        {/* 3. Căn chỉnh lề */}
        <button
          type="button"
          onClick={() => insertLinePrefix('')}
          className="size-6 inline-flex items-center justify-center rounded hover:bg-muted text-muted-foreground hover:text-foreground cursor-pointer shrink-0"
          title="Căn trái"
        >
          <AlignLeft className="size-3.5" />
        </button>
        <button
          type="button"
          onClick={() => insertFormatting('<center>', '</center>')}
          className="size-6 inline-flex items-center justify-center rounded hover:bg-muted text-muted-foreground hover:text-foreground cursor-pointer shrink-0"
          title="Căn giữa"
        >
          <AlignCenter className="size-3.5" />
        </button>
        <button
          type="button"
          onClick={() => insertFormatting('<div style="text-align:right">', '</div>')}
          className="size-6 inline-flex items-center justify-center rounded hover:bg-muted text-muted-foreground hover:text-foreground cursor-pointer shrink-0"
          title="Căn phải"
        >
          <AlignRight className="size-3.5" />
        </button>
        <button
          type="button"
          onClick={() => insertFormatting('<div style="text-align:justify">', '</div>')}
          className="size-6 inline-flex items-center justify-center rounded hover:bg-muted text-muted-foreground hover:text-foreground cursor-pointer shrink-0"
          title="Căn đều 2 bên"
        >
          <AlignJustify className="size-3.5" />
        </button>

        <div className="h-4 w-px bg-border/80 mx-0.5 shrink-0" />

        {/* 4. Quote & Code */}
        <button
          type="button"
          onClick={() => insertLinePrefix('> ')}
          className="size-6 inline-flex items-center justify-center rounded hover:bg-muted text-muted-foreground hover:text-foreground cursor-pointer shrink-0"
          title="Trích dẫn"
        >
          <Quote className="size-3.5" />
        </button>
        <button
          type="button"
          onClick={() => insertFormatting('`', '`')}
          className="size-6 inline-flex items-center justify-center rounded hover:bg-muted text-muted-foreground hover:text-foreground cursor-pointer font-mono shrink-0"
          title="Mã code"
        >
          <Code className="size-3.5" />
        </button>

        <div className="h-4 w-px bg-border/80 mx-0.5 shrink-0" />

        {/* 5. Lists */}
        <button
          type="button"
          onClick={() => insertLinePrefix('1. ')}
          className="size-6 inline-flex items-center justify-center rounded hover:bg-muted text-muted-foreground hover:text-foreground cursor-pointer shrink-0"
          title="Danh sách số"
        >
          <ListOrdered className="size-3.5" />
        </button>
        <button
          type="button"
          onClick={() => insertLinePrefix('- ')}
          className="size-6 inline-flex items-center justify-center rounded hover:bg-muted text-muted-foreground hover:text-foreground cursor-pointer shrink-0"
          title="Danh sách gạch đầu dòng"
        >
          <List className="size-3.5" />
        </button>
        <button
          type="button"
          onClick={() => insertLinePrefix('- [ ] ')}
          className="size-6 inline-flex items-center justify-center rounded hover:bg-muted text-muted-foreground hover:text-foreground cursor-pointer shrink-0"
          title="Danh sách việc cần làm (Checklist)"
        >
          <CheckSquare className="size-3.5" />
        </button>
        <button
          type="button"
          onClick={() => insertLinePrefix('  ')}
          className="size-6 inline-flex items-center justify-center rounded hover:bg-muted text-muted-foreground hover:text-foreground cursor-pointer shrink-0"
          title="Thụt dòng"
        >
          <Indent className="size-3.5" />
        </button>
        <button
          type="button"
          onClick={() => insertLinePrefix('')}
          className="size-6 inline-flex items-center justify-center rounded hover:bg-muted text-muted-foreground hover:text-foreground cursor-pointer shrink-0"
          title="Lùi dòng"
        >
          <Outdent className="size-3.5" />
        </button>

        <div className="h-4 w-px bg-border/80 mx-0.5 shrink-0" />

        {/* 6. Bảng màu (Popover gom gọn) */}
        <Popover>
          <PopoverTrigger asChild>
            <button
              type="button"
              className="h-6 px-1.5 inline-flex items-center justify-center rounded hover:bg-muted text-foreground cursor-pointer gap-0.5 transition-colors shrink-0"
              title="Bảng màu chữ & Màu đánh dấu"
            >
              <span className="text-[11px] font-bold underline decoration-primary decoration-2 leading-none">A</span>
              <ChevronDown className="size-2.5 text-muted-foreground" />
            </button>
          </PopoverTrigger>
          <PopoverContent align="start" className="w-56 p-2.5 space-y-2.5 text-xs shadow-md">
            <div>
              <div className="text-[11px] font-medium text-muted-foreground mb-1.5">Màu chữ</div>
              <div className="grid grid-cols-7 gap-1">
                {TEXT_COLORS.map((c) => (
                  <button
                    key={c.label}
                    type="button"
                    onClick={() => {
                      if (c.value) {
                        insertFormatting(`<span style="color:${c.value}">`, '</span>')
                      }
                    }}
                    className={cn(
                      "size-5.5 rounded-full cursor-pointer hover:scale-115 transition-transform flex items-center justify-center shadow-2xs",
                      c.class
                    )}
                    title={c.label}
                  />
                ))}
              </div>
            </div>
            <div className="border-t border-border/60 pt-2">
              <div className="text-[11px] font-medium text-muted-foreground mb-1.5">Màu đánh dấu (Highlight)</div>
              <div className="grid grid-cols-4 gap-1.5">
                {HIGHLIGHT_COLORS.map((h) => (
                  <button
                    key={h.label}
                    type="button"
                    onClick={() => {
                      if (h.value) {
                        insertFormatting(`<mark style="background:${h.value}">`, '</mark>')
                      }
                    }}
                    className={cn(
                      "h-5 rounded text-[10px] font-semibold cursor-pointer hover:scale-105 transition-transform flex items-center justify-center shadow-2xs border border-border/50",
                      h.class
                    )}
                    title={h.label}
                  >
                    A
                  </button>
                ))}
              </div>
            </div>
          </PopoverContent>
        </Popover>

        <div className="h-4 w-px bg-border/80 mx-0.5 shrink-0" />

        {/* 7. Link, Image, Video */}
        <button
          type="button"
          onClick={handleLink}
          className="size-6 inline-flex items-center justify-center rounded hover:bg-muted text-muted-foreground hover:text-foreground cursor-pointer shrink-0"
          title="Chèn liên kết (Link)"
        >
          <Link2 className="size-3.5" />
        </button>
        <button
          type="button"
          onClick={handleImage}
          className="size-6 inline-flex items-center justify-center rounded hover:bg-muted text-muted-foreground hover:text-foreground cursor-pointer shrink-0"
          title="Chèn ảnh / phiếu bài làm"
        >
          <ImageIcon className="size-3.5" />
        </button>
        <button
          type="button"
          onClick={() => insertFormatting('[Video giải thích](', ')') }
          className="size-6 inline-flex items-center justify-center rounded hover:bg-muted text-muted-foreground hover:text-foreground cursor-pointer shrink-0"
          title="Chèn video"
        >
          <Video className="size-3.5" />
        </button>

        <div className="h-4 w-px bg-border/80 mx-0.5 shrink-0" />

        {/* 8. Clear format */}
        <button
          type="button"
          onClick={handleClearFormat}
          className="size-6 inline-flex items-center justify-center rounded hover:bg-muted text-muted-foreground hover:text-rose-600 cursor-pointer shrink-0"
          title="Xóa định dạng (Clear Format)"
        >
          <RemoveFormatting className="size-3.5" />
        </button>
      </div>

      {/* Editor Body */}
      <div className="flex-1 min-h-0 flex flex-col p-1.5 bg-background">
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          style={{ minHeight: isExpanded ? '350px' : minHeight }}
          className="w-full flex-1 min-h-[85px] text-xs font-normal leading-relaxed text-foreground placeholder:text-muted-foreground focus:outline-none resize-y bg-transparent p-1"
        />
      </div>

      {/* Editor Footer: Character / Word Count */}
      <div className="flex items-center justify-between px-3 py-1 bg-muted/30 border-t border-border/50 text-[10.5px] text-muted-foreground">
        <span>
          {value.trim().length} ký tự · {value.trim() ? value.trim().split(/\s+/).length : 0} từ
        </span>
        {isExpanded && (
          <button
            type="button"
            onClick={() => setIsExpanded(false)}
            className="text-primary font-medium hover:underline cursor-pointer"
          >
            Đóng chế độ mở rộng
          </button>
        )}
      </div>
    </div>
  )
}
