'use client'

import React, { useRef, useState } from 'react'
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
  ListTodo,
  Outdent,
  Indent,
  Link2,
  Image as ImageIcon,
  Video,
  RemoveFormatting,
  ChevronDown,
  Check,
  RotateCcw,
  Sparkles,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

export interface RichTextEditorProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  maxLength?: number
  minHeight?: string
  rows?: number
  toolbarMode?: 'full' | 'compact'
  className?: string
  id?: string
}

/** Dải màu chuẩn mực sư phạm (Chuẩn hóa thương hiệu, chống màu mè, loạn phong cách) */
export const TEXT_COLOR_PALETTE = [
  { name: 'Chữ mặc định (Xám đen)', hex: '#0F172A' },
  { name: 'Ưu điểm & Nổi bật (Xanh trầm)', hex: '#059669' },
  { name: 'Cần lưu ý & Rèn luyện (Hổ phách trầm)', hex: '#D97706' },
  { name: 'Năng lực cốt lõi (Xanh chàm)', hex: '#2563EB' },
]

export function RichTextEditor({
  value,
  onChange,
  placeholder,
  maxLength,
  minHeight = 'min-h-[72px]',
  rows = 3,
  toolbarMode = 'full',
  className,
  id,
}: RichTextEditorProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const [activeColor, setActiveColor] = useState<string | null>('#F97316')
  const [colorMenuOpen, setColorMenuOpen] = useState(false)

  // Character and word count
  const charCount = value ? value.length : 0
  const wordCount = value && value.trim() ? value.trim().split(/\s+/).filter(Boolean).length : 0

  /** Helper: Wrap selection with before/after tags or insert at cursor */
  const applyWrap = (before: string, after: string = '') => {
    const textarea = textareaRef.current
    if (!textarea) return

    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const selectedText = value.substring(start, end)

    let replacement = `${before}${selectedText}${after}`
    if (!selectedText) {
      replacement = `${before}${after}`
    }

    let newValue = value.substring(0, start) + replacement + value.substring(end)
    if (maxLength && newValue.length > maxLength) {
      newValue = newValue.slice(0, maxLength)
    }

    onChange(newValue)

    // Restore cursor / selection
    setTimeout(() => {
      textarea.focus()
      const newCursorPos = selectedText ? start + replacement.length : start + before.length
      textarea.setSelectionRange(newCursorPos, newCursorPos)
    }, 0)
  }

  /** Helper: Prepend prefix to each selected line or current line */
  const applyLinePrefix = (prefix: string) => {
    const textarea = textareaRef.current
    if (!textarea) return

    const start = textarea.selectionStart
    const end = textarea.selectionEnd

    const lineStart = value.lastIndexOf('\n', start - 1) + 1
    let lineEnd = value.indexOf('\n', end)
    if (lineEnd === -1) lineEnd = value.length

    const selectedBlock = value.substring(lineStart, lineEnd)
    const lines = selectedBlock.split('\n')

    const newBlock = lines
      .map((l) => (l.startsWith(prefix) ? l.slice(prefix.length) : `${prefix}${l}`))
      .join('\n')

    let newValue = value.substring(0, lineStart) + newBlock + value.substring(lineEnd)
    if (maxLength && newValue.length > maxLength) {
      newValue = newValue.slice(0, maxLength)
    }

    onChange(newValue)

    setTimeout(() => {
      textarea.focus()
      textarea.setSelectionRange(lineStart + newBlock.length, lineStart + newBlock.length)
    }, 0)
  }

  /** Helper: Apply Heading Level (#, ##, ###) */
  const applyHeading = (level: number) => {
    const textarea = textareaRef.current
    if (!textarea) return

    const start = textarea.selectionStart
    const lineStart = value.lastIndexOf('\n', start - 1) + 1
    let lineEnd = value.indexOf('\n', start)
    if (lineEnd === -1) lineEnd = value.length

    let line = value.substring(lineStart, lineEnd)
    // Strip existing markdown heading hashes
    line = line.replace(/^#{1,6}\s*/, '')

    const prefix = level > 0 ? `${'#'.repeat(level)} ` : ''
    const newLine = `${prefix}${line}`

    let newValue = value.substring(0, lineStart) + newLine + value.substring(lineEnd)
    if (maxLength && newValue.length > maxLength) {
      newValue = newValue.slice(0, maxLength)
    }

    onChange(newValue)

    setTimeout(() => {
      textarea.focus()
      textarea.setSelectionRange(lineStart + newLine.length, lineStart + newLine.length)
    }, 0)
  }

  /** Helper: Clear format */
  const applyClearFormatting = () => {
    const textarea = textareaRef.current
    if (!textarea) return

    const start = textarea.selectionStart
    const end = textarea.selectionEnd

    if (start === end) {
      // Clear all markdown in text
      const clean = value
        .replace(/(\*\*|__|\*|_|~~|`)/g, '')
        .replace(/^#{1,6}\s*/gm, '')
        .replace(/^>\s*/gm, '')
        .replace(/<\/?(span|mark|u)[^>]*>/gi, '')
      onChange(clean)
    } else {
      const selected = value.substring(start, end)
      const clean = selected
        .replace(/(\*\*|__|\*|_|~~|`)/g, '')
        .replace(/^#{1,6}\s*/gm, '')
        .replace(/^>\s*/gm, '')
        .replace(/<\/?(span|mark|u)[^>]*>/gi, '')
      const newValue = value.substring(0, start) + clean + value.substring(end)
      onChange(newValue)
    }
    setTimeout(() => textarea.focus(), 0)
  }

  /** Helper: Chuẩn hóa AI - Dọn sạch toàn bộ mã màu HTML rườm rà, giữ văn bản tinh gọn với in đậm chuẩn */
  const applyAiCleanFormat = () => {
    const clean = value
      .replace(/<span\s+style=["'][^"']*["']>([\s\S]*?)<\/span>/gi, '$1')
      .replace(/<mark\s+style=["'][^"']*["']>([\s\S]*?)<\/mark>/gi, '$1')
      .replace(/<\/?(span|mark|font|div|p)[^>]*>/gi, '')
      .replace(/\n{3,}/g, '\n\n')
      .trim()
    onChange(clean)
    setTimeout(() => textareaRef.current?.focus(), 0)
  }

  /** Helper: Apply Text Color from Palette */
  const applyTextColor = (hex: string) => {
    setActiveColor(hex)
    applyWrap(`<span style="color:${hex}">`, '</span>')
    setColorMenuOpen(false)
  }

  /** Helper: Reset color formatting */
  const applyResetColor = () => {
    setActiveColor(null)
    const textarea = textareaRef.current
    if (!textarea) return
    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    if (start !== end) {
      const selected = value.substring(start, end)
      const clean = selected.replace(/<\/?(span|mark)[^>]*>/gi, '')
      const newValue = value.substring(0, start) + clean + value.substring(end)
      onChange(newValue)
    }
    setColorMenuOpen(false)
  }

  /** Handle keyboard shortcuts */
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.ctrlKey || e.metaKey) {
      if (e.key === 'b' || e.key === 'B') {
        e.preventDefault()
        applyWrap('**', '**')
      } else if (e.key === 'i' || e.key === 'I') {
        e.preventDefault()
        applyWrap('*', '*')
      } else if (e.key === 'u' || e.key === 'U') {
        e.preventDefault()
        applyWrap('<u>', '</u>')
      }
    }
  }

  return (
    <div
      className={cn(
        'rounded-lg border border-border/80 bg-background overflow-hidden focus-within:border-primary/80 focus-within:ring-1 focus-within:ring-primary/20 transition-all shadow-3xs flex flex-col',
        className
      )}
    >
      {/* ── TOP TOOLBAR (CHUẨN THEO ẢNH MẪU CỦA USER) ── */}
      <div className="bg-muted/30 border-b border-border/60 px-2 py-1 flex flex-wrap items-center gap-0.5 sm:gap-1 text-muted-foreground select-none">
        {/* Nhóm 1: Kiểu chữ */}
        {toolbarMode === 'full' && (
          <>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  type="button"
                  className="h-6.5 px-2 text-xs font-normal rounded flex items-center gap-1 hover:text-foreground hover:bg-muted/60 cursor-pointer transition-colors"
                  title="Chọn kiểu định dạng đoạn văn"
                >
                  <span>Kiểu chữ</span>
                  <ChevronDown className="h-3 w-3 opacity-60" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-36 text-xs font-normal">
                <DropdownMenuItem onClick={() => applyHeading(0)} className="cursor-pointer">
                  Văn bản thường
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => applyHeading(1)} className="cursor-pointer font-bold">
                  Tiêu đề 1
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => applyHeading(2)} className="cursor-pointer font-semibold">
                  Tiêu đề 2
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => applyHeading(3)} className="cursor-pointer font-medium">
                  Tiêu đề 3
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <div className="h-3.5 w-px bg-border/70 shrink-0 my-auto mx-0.5" />
          </>
        )}

        {/* Nhóm 2: Format chữ B, I, U, S */}
        <button
          type="button"
          onClick={() => applyWrap('**', '**')}
          className="h-6 w-6 flex items-center justify-center rounded hover:text-foreground hover:bg-muted/60 cursor-pointer transition-colors font-bold text-xs"
          title="In đậm (Ctrl+B)"
        >
          <Bold className="h-3.5 w-3.5" />
        </button>

        <button
          type="button"
          onClick={() => applyWrap('*', '*')}
          className="h-6 w-6 flex items-center justify-center rounded hover:text-foreground hover:bg-muted/60 cursor-pointer transition-colors italic text-xs"
          title="In nghiêng (Ctrl+I)"
        >
          <Italic className="h-3.5 w-3.5" />
        </button>

        <button
          type="button"
          onClick={() => applyWrap('<u>', '</u>')}
          className="h-6 w-6 flex items-center justify-center rounded hover:text-foreground hover:bg-muted/60 cursor-pointer transition-colors underline text-xs"
          title="Gạch chân (Ctrl+U)"
        >
          <Underline className="h-3.5 w-3.5" />
        </button>

        {toolbarMode === 'full' && (
          <button
            type="button"
            onClick={() => applyWrap('~~', '~~')}
            className="h-6 w-6 flex items-center justify-center rounded hover:text-foreground hover:bg-muted/60 cursor-pointer transition-colors text-xs"
            title="Gạch ngang chữ"
          >
            <Strikethrough className="h-3.5 w-3.5" />
          </button>
        )}

        <div className="h-3.5 w-px bg-border/70 shrink-0 my-auto mx-0.5" />

        {/* Nhóm 3: Canh lề */}
        {toolbarMode === 'full' && (
          <>
            <button
              type="button"
              onClick={() => {}}
              className="h-6 w-6 flex items-center justify-center rounded hover:text-foreground hover:bg-muted/60 cursor-pointer transition-colors"
              title="Canh trái"
            >
              <AlignLeft className="h-3.5 w-3.5" />
            </button>
            <button
              type="button"
              onClick={() => {}}
              className="h-6 w-6 flex items-center justify-center rounded hover:text-foreground hover:bg-muted/60 cursor-pointer transition-colors"
              title="Canh giữa"
            >
              <AlignCenter className="h-3.5 w-3.5" />
            </button>
            <button
              type="button"
              onClick={() => {}}
              className="h-6 w-6 flex items-center justify-center rounded hover:text-foreground hover:bg-muted/60 cursor-pointer transition-colors"
              title="Canh phải"
            >
              <AlignRight className="h-3.5 w-3.5" />
            </button>
            <button
              type="button"
              onClick={() => {}}
              className="h-6 w-6 flex items-center justify-center rounded hover:text-foreground hover:bg-muted/60 cursor-pointer transition-colors"
              title="Canh đều"
            >
              <AlignJustify className="h-3.5 w-3.5" />
            </button>

            <div className="h-3.5 w-px bg-border/70 shrink-0 my-auto mx-0.5" />

            {/* Nhóm 4: Trích dẫn & Code */}
            <button
              type="button"
              onClick={() => applyLinePrefix('> ')}
              className="h-6 w-6 flex items-center justify-center rounded hover:text-foreground hover:bg-muted/60 cursor-pointer transition-colors"
              title="Trích dẫn"
            >
              <Quote className="h-3.5 w-3.5" />
            </button>
            <button
              type="button"
              onClick={() => applyWrap('`', '`')}
              className="h-6 w-6 flex items-center justify-center rounded hover:text-foreground hover:bg-muted/60 cursor-pointer transition-colors"
              title="Đoạn mã"
            >
              <Code className="h-3.5 w-3.5" />
            </button>

            <div className="h-3.5 w-px bg-border/70 shrink-0 my-auto mx-0.5" />
          </>
        )}

        {/* Nhóm 5: Danh sách & Thụt lề */}
        <button
          type="button"
          onClick={() => applyLinePrefix('- ')}
          className="h-6 w-6 flex items-center justify-center rounded hover:text-foreground hover:bg-muted/60 cursor-pointer transition-colors"
          title="Danh sách gạch đầu dòng"
        >
          <List className="h-3.5 w-3.5" />
        </button>

        <button
          type="button"
          onClick={() => applyLinePrefix('1. ')}
          className="h-6 w-6 flex items-center justify-center rounded hover:text-foreground hover:bg-muted/60 cursor-pointer transition-colors"
          title="Danh sách đánh số"
        >
          <ListOrdered className="h-3.5 w-3.5" />
        </button>

        {toolbarMode === 'full' && (
          <>
            <button
              type="button"
              onClick={() => applyLinePrefix('- [ ] ')}
              className="h-6 w-6 flex items-center justify-center rounded hover:text-foreground hover:bg-muted/60 cursor-pointer transition-colors"
              title="Danh sách kiểm tra (Checklist)"
            >
              <ListTodo className="h-3.5 w-3.5" />
            </button>
            <button
              type="button"
              onClick={() => applyLinePrefix('  ')}
              className="h-6 w-6 flex items-center justify-center rounded hover:text-foreground hover:bg-muted/60 cursor-pointer transition-colors"
              title="Tăng thụt lề"
            >
              <Indent className="h-3.5 w-3.5" />
            </button>
            <button
              type="button"
              onClick={() => {
                const textarea = textareaRef.current
                if (!textarea) return
                const start = textarea.selectionStart
                const lineStart = value.lastIndexOf('\n', start - 1) + 1
                let lineEnd = value.indexOf('\n', start)
                if (lineEnd === -1) lineEnd = value.length
                const line = value.substring(lineStart, lineEnd)
                const dedented = line.replace(/^\s{1,2}/, '')
                const newValue = value.substring(0, lineStart) + dedented + value.substring(lineEnd)
                onChange(newValue)
              }}
              className="h-6 w-6 flex items-center justify-center rounded hover:text-foreground hover:bg-muted/60 cursor-pointer transition-colors"
              title="Giảm thụt lề"
            >
              <Outdent className="h-3.5 w-3.5" />
            </button>

            {/* Bộ màu văn bản sư phạm chuẩn mực RinoEdu */}
            <DropdownMenu open={colorMenuOpen} onOpenChange={setColorMenuOpen}>
              <DropdownMenuTrigger asChild>
                <button
                  type="button"
                  className="h-6 px-1.5 rounded flex items-center gap-0.5 hover:text-foreground hover:bg-muted/60 cursor-pointer transition-colors"
                  title="Màu chữ chuẩn mực sư phạm"
                >
                  <span className="font-bold text-xs relative inline-block">
                    A
                    <span
                      className="absolute -bottom-0.5 left-0 right-0 h-0.5 rounded-full transition-colors"
                      style={{ backgroundColor: activeColor || '#0F172A' }}
                    />
                  </span>
                  <ChevronDown className="h-2.5 w-2.5 opacity-60" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="start"
                className="w-56 p-1.5 text-xs bg-popover rounded-xl shadow-lg border border-border/80 space-y-1 select-none"
              >
                {/* Nút reset màu về mặc định */}
                <button
                  type="button"
                  onClick={applyResetColor}
                  className="w-full flex items-center gap-2 px-2 py-1.5 text-xs text-muted-foreground hover:text-foreground hover:bg-muted/70 rounded-md cursor-pointer transition-colors"
                  title="Gỡ màu chữ về mặc định"
                >
                  <RotateCcw className="h-3 w-3 shrink-0" />
                  <span>Mặc định (Chữ đen chuẩn)</span>
                </button>

                <div className="h-px bg-border/50 my-1" />

                {TEXT_COLOR_PALETTE.map((c) => {
                  const isSelected = activeColor === c.hex
                  return (
                    <button
                      key={c.hex}
                      type="button"
                      onClick={() => applyTextColor(c.hex)}
                      className={cn(
                        'w-full flex items-center justify-between px-2 py-1.5 rounded-md text-xs font-medium transition-colors cursor-pointer hover:bg-muted/70',
                        isSelected && 'bg-muted/90'
                      )}
                    >
                      <div className="flex items-center gap-2">
                        <span
                          className="h-3 w-3 rounded-full border border-black/10 shrink-0"
                          style={{ backgroundColor: c.hex }}
                        />
                        <span style={{ color: c.hex }}>{c.name}</span>
                      </div>
                      {isSelected && <Check className="h-3 w-3 text-foreground" />}
                    </button>
                  )
                })}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Nút Chuẩn hóa định dạng AI: Gỡ bỏ mã màu thừa, đưa về chuẩn mực sư phạm RinoEdu */}
            <button
              type="button"
              onClick={applyAiCleanFormat}
              className="h-6 px-1.5 rounded flex items-center gap-1 text-slate-600 hover:text-foreground hover:bg-muted/60 cursor-pointer transition-colors text-[11px] font-medium"
              title="Chuẩn hóa định dạng AI: Dọn sạch mọi mã màu rườm rà, giữ in đậm và bố cục chuẩn mực"
            >
              <Sparkles className="h-3 w-3 text-amber-500" />
              <span className="hidden sm:inline">Chuẩn hóa AI</span>
            </button>

            <div className="h-3.5 w-px bg-border/70 shrink-0 my-auto mx-0.5" />

            {/* Nhóm 6: Link, Ảnh, Video */}
            <button
              type="button"
              onClick={() => applyWrap('[', '](https://)')}
              className="h-6 w-6 flex items-center justify-center rounded hover:text-foreground hover:bg-muted/60 cursor-pointer transition-colors"
              title="Chèn liên kết (Link)"
            >
              <Link2 className="h-3.5 w-3.5" />
            </button>
            <button
              type="button"
              onClick={() => applyWrap('![Mô tả ảnh](', ')')}
              className="h-6 w-6 flex items-center justify-center rounded hover:text-foreground hover:bg-muted/60 cursor-pointer transition-colors"
              title="Chèn hình ảnh"
            >
              <ImageIcon className="h-3.5 w-3.5" />
            </button>
            <button
              type="button"
              onClick={() => applyWrap('[Video: ', '](https://)')}
              className="h-6 w-6 flex items-center justify-center rounded hover:text-foreground hover:bg-muted/60 cursor-pointer transition-colors"
              title="Chèn video"
            >
              <Video className="h-3.5 w-3.5" />
            </button>

            <div className="h-3.5 w-px bg-border/70 shrink-0 my-auto mx-0.5" />
          </>
        )}

        {/* Xóa định dạng */}
        <button
          type="button"
          onClick={applyClearFormatting}
          className="h-6 w-6 flex items-center justify-center rounded hover:text-foreground hover:bg-muted/60 cursor-pointer transition-colors"
          title="Xóa định dạng"
        >
          <RemoveFormatting className="h-3.5 w-3.5" />
        </button>
      </div>

      {/* ── EDITOR TEXTAREA ── */}
      <textarea
        ref={textareaRef}
        id={id}
        rows={rows}
        maxLength={maxLength}
        value={value}
        onChange={(e) => {
          let text = e.target.value
          if (maxLength && text.length > maxLength) {
            text = text.slice(0, maxLength)
          }
          onChange(text)
        }}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className={cn(
          'w-full p-2.5 text-xs bg-background text-foreground focus:outline-none leading-relaxed font-sans resize-y transition-colors',
          minHeight
        )}
      />

      {/* ── FOOTER: ĐẾM KÝ TỰ VÀ TỪ (CHUẨN THEO ẢNH: 21 ký tự • 5 từ) ── */}
      <div className="flex items-center justify-between px-3 py-1 bg-muted/20 border-t border-border/50 text-[11px] text-muted-foreground select-none">
        <div className="flex items-center gap-1.5 font-sans">
          <span
            className={cn(
              maxLength && charCount >= maxLength
                ? 'text-destructive font-semibold'
                : maxLength && charCount >= maxLength - 30
                ? 'text-amber-600 font-medium'
                : 'text-muted-foreground'
            )}
            title={maxLength ? `Tối đa ${maxLength} ký tự` : undefined}
          >
            {maxLength ? `${charCount}/${maxLength}` : charCount} ký tự
          </span>
          <span>•</span>
          <span>{wordCount} từ</span>
        </div>

        {maxLength && charCount >= maxLength && (
          <span className="text-[10.5px] text-destructive font-medium">Đã đạt giới hạn</span>
        )}
      </div>
    </div>
  )
}
