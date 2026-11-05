'use client'

import React, { useState, useRef, useCallback } from 'react'
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover'
import { useUIStore } from '@/stores/useUIStore'
import { cn } from '@/lib/utils'
import { usePoExplainStore } from './usePoExplainStore'
import { PoExplainPopoverContent } from './PoExplainPopoverContent'
import type { PoSectionId } from './bookingTrialPoTypes'

interface PoExplainSectionWrapperProps {
  sectionId: PoSectionId
  side?: 'top' | 'right' | 'bottom' | 'left'
  align?: 'start' | 'center' | 'end'
  className?: string
  children: React.ReactNode
}

export function PoExplainSectionWrapper({
  sectionId,
  side = 'right',
  align = 'start',
  className,
  children,
}: PoExplainSectionWrapperProps) {
  const isExplainMode = useUIStore((s) => s.isExplainMode)
  const section = usePoExplainStore((s) => s.sections.find((sec) => sec.id === sectionId))

  const [isOpen, setIsOpen] = useState(false)
  const [isPinned, setIsPinned] = useState(false)
  const enterTimerRef = useRef<NodeJS.Timeout | null>(null)
  const leaveTimerRef = useRef<NodeJS.Timeout | null>(null)

  const handleMouseEnter = useCallback(() => {
    if (!isExplainMode) return
    if (leaveTimerRef.current) clearTimeout(leaveTimerRef.current)
    enterTimerRef.current = setTimeout(() => {
      setIsOpen(true)
    }, 120)
  }, [isExplainMode])

  const handleMouseLeave = useCallback(() => {
    if (isPinned) return // Nếu đã ghim hoặc đang sửa, không đóng khi di chuột ra
    if (enterTimerRef.current) clearTimeout(enterTimerRef.current)
    leaveTimerRef.current = setTimeout(() => {
      setIsOpen(false)
    }, 220)
  }, [isPinned])

  const handleTogglePin = useCallback(() => {
    setIsPinned((prev) => !prev)
  }, [])

  const handleClose = useCallback(() => {
    setIsPinned(false)
    setIsOpen(false)
  }, [])

  // Nếu không bật chế độ thuyết minh PO, render thuần túy không ảnh hưởng giao diện
  if (!isExplainMode || !section) {
    return <>{children}</>
  }

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <div
          data-po-section={sectionId}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          onClick={() => {
            // Click trực tiếp vào thành phần để mở và ghim popover
            setIsOpen(true)
            setIsPinned(true)
          }}
          className={cn(
            'relative transition-all duration-150 rounded-lg',
            isOpen
              ? 'ring-2 ring-amber-500 shadow-sm ring-offset-1 ring-offset-background bg-amber-500/[0.03]'
              : 'hover:ring-2 hover:ring-amber-500/70 hover:ring-offset-1 hover:ring-offset-background hover:bg-amber-500/[0.02]',
            className
          )}
          title={`Thuyết minh PO: [${section.code}] ${section.title} (Hover hoặc click để xem)`}
        >
          {children}
        </div>
      </PopoverTrigger>

      {/* Popover hiển thị nội dung thuyết minh — mặc định ở chế độ View, click icon bút chì để edit */}
      <PopoverContent
        side={side}
        align={align}
        sideOffset={8}
        collisionPadding={12}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className="p-0 border-0 bg-transparent shadow-none w-auto z-50"
      >
        <PoExplainPopoverContent
          sectionId={sectionId}
          isPinned={isPinned}
          onTogglePin={handleTogglePin}
          onClose={handleClose}
        />
      </PopoverContent>
    </Popover>
  )
}
