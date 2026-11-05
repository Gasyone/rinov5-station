'use client'

import React, { useState, useSyncExternalStore } from 'react'
import { Lightbulb, Copy, Check, FileText } from 'lucide-react'
import { toast } from 'sonner'
import { useUIStore } from '@/stores/useUIStore'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { usePoExplainStore } from './usePoExplainStore'
import { exportPoSpecToMarkdown } from './bookingTrialPoConstants'
import { BookingTrialPoAllInOneModal } from './BookingTrialPoAllInOneModal'

const emptySubscribe = () => () => {}

interface BookingTrialPoOverlayProps {
  className?: string
}

export function BookingTrialPoOverlay({ className }: BookingTrialPoOverlayProps) {
  const isExplainMode = useUIStore((s) => s.isExplainMode)
  const toggleExplainMode = useUIStore((s) => s.toggleExplainMode)
  const sections = usePoExplainStore((s) => s.sections)

  const [isAllInOneOpen, setIsAllInOneOpen] = useState(false)
  const [copied, setCopied] = useState(false)

  const isClient = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  )

  if (!isClient) return null

  const handleCopyAll = async () => {
    const md = exportPoSpecToMarkdown(sections)
    try {
      await navigator.clipboard.writeText(md)
      setCopied(true)
      toast.success('Đã sao chép toàn bộ đặc tả PO của màn hình sang Markdown!')
      setTimeout(() => setCopied(false), 2000)
    } catch {
      toast.error('Không thể sao chép vào bộ nhớ tạm')
    }
  }

  return (
    <>
      {/* Nút bấm kích hoạt Thuyết minh PO & Thanh trạng thái nhỏ gọn */}
      <div className={cn('fixed bottom-5 right-5 z-40 flex items-center gap-2 select-none', className)}>
        {isExplainMode && (
          <div className="flex items-center gap-2 rounded-full border border-amber-500/50 bg-background/95 px-3 py-1.5 shadow-xl backdrop-blur-md text-xs">
            <span className="flex h-2 w-2 rounded-full bg-amber-500 animate-pulse" />
            <span className="text-foreground font-medium hidden md:inline text-[11.5px]">
              Rê chuột (hover) vào từng khối để xem & sửa thuyết minh PO
            </span>
            <div className="flex items-center gap-1 pl-1 border-l border-border/80">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setIsAllInOneOpen(true)}
                title="Mở bảng tổng hợp tất cả các mục"
                className="h-6 px-2 text-[11px] text-amber-700 dark:text-amber-300 hover:bg-amber-500/15"
              >
                <FileText className="h-3 w-3 mr-1" />
                Xem tất cả
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleCopyAll}
                title="Sao chép toàn bộ đặc tả PO sang Markdown"
                className="h-6 px-2 text-[11px] text-muted-foreground hover:text-foreground"
              >
                {copied ? <Check className="h-3 w-3 mr-1 text-emerald-500" /> : <Copy className="h-3 w-3 mr-1" />}
                Copy MD
              </Button>
            </div>
          </div>
        )}

        {/* Nút bật/tắt chính */}
        <button
          type="button"
          onClick={toggleExplainMode}
          className={cn(
            'group flex items-center gap-2 rounded-full px-4 py-2.5 text-xs font-bold transition-all shadow-xl cursor-pointer',
            isExplainMode
              ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-white ring-4 ring-amber-500/25 scale-105'
              : 'bg-background/90 text-foreground border border-amber-500/50 hover:bg-amber-500/10 hover:border-amber-500 hover:text-amber-700 dark:hover:text-amber-300'
          )}
          title="Bật/Tắt Chế độ Thuyết minh PO (Hover để xem Popover)"
        >
          <Lightbulb
            className={cn(
              'h-4 w-4 transition-transform shrink-0',
              isExplainMode ? 'fill-white text-white animate-pulse' : 'text-amber-500'
            )}
          />
          <span>Thuyết minh PO</span>
          <Badge
            variant="secondary"
            className={cn(
              'px-1.5 py-0 text-[10px] font-bold uppercase',
              isExplainMode ? 'bg-black/20 text-white' : 'bg-amber-500/15 text-amber-700 dark:text-amber-300'
            )}
          >
            {isExplainMode ? 'BẬT' : 'TẮT'}
          </Badge>
        </button>
      </div>

      {/* Modal xem toàn bộ bảng nếu cần */}
      <BookingTrialPoAllInOneModal
        open={isAllInOneOpen}
        onOpenChange={setIsAllInOneOpen}
      />
    </>
  )
}
