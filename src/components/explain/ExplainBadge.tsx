'use client'

import { Lightbulb } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useUIStore } from '@/stores/useUIStore'
import { CARE_OPERATIONS_EXPLAIN_TOPICS } from './careOperationsExplainData'

interface ExplainBadgeProps {
  topicId: string
  className?: string
  position?: 'relative' | 'absolute'
  label?: string
  pulse?: boolean
}

export function ExplainBadge({
  topicId,
  className,
  label,
  pulse = true,
}: ExplainBadgeProps) {
  const isExplainMode = useUIStore((s) => s.isExplainMode)
  const activeExplainTopic = useUIStore((s) => s.activeExplainTopic)
  const setActiveExplainTopic = useUIStore((s) => s.setActiveExplainTopic)

  if (!isExplainMode) return null

  const topic = CARE_OPERATIONS_EXPLAIN_TOPICS[topicId]
  const isActive = activeExplainTopic === topicId
  const displayLabel = label || topic?.badgeLabel

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    e.preventDefault()
    setActiveExplainTopic(isActive ? null : topicId)
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      title={topic ? `Xem thuyết minh PO: ${topic.title}` : 'Xem thuyết minh PO'}
      className={cn(
        'group/explain inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium transition-all cursor-pointer select-none shadow-xs z-20',
        isActive
          ? 'bg-amber-500 text-amber-950 font-semibold ring-2 ring-amber-400 scale-105'
          : 'bg-amber-500/15 text-amber-800 dark:text-amber-300 border border-amber-500/30 hover:bg-amber-500/25 hover:border-amber-500/50',
        pulse && !isActive && 'animate-pulse',
        className
      )}
    >
      <Lightbulb
        className={cn(
          'h-3 w-3 shrink-0',
          isActive
            ? 'fill-amber-950 text-amber-950'
            : 'fill-amber-500/40 text-amber-600 dark:text-amber-400'
        )}
      />
      {displayLabel && <span>{displayLabel}</span>}
    </button>
  )
}
