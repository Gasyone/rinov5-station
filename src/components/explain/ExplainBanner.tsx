'use client'

import { Lightbulb, Sparkles, X, ChevronRight } from 'lucide-react'
import { useUIStore } from '@/stores/useUIStore'
import { CARE_OPERATIONS_EXPLAIN_TOPICS } from './careOperationsExplainData'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'

export function ExplainBanner() {
  const isExplainMode = useUIStore((s) => s.isExplainMode)
  const setExplainMode = useUIStore((s) => s.setExplainMode)
  const activeExplainTopic = useUIStore((s) => s.activeExplainTopic)
  const setActiveExplainTopic = useUIStore((s) => s.setActiveExplainTopic)

  if (!isExplainMode) return null

  const topicsList = Object.values(CARE_OPERATIONS_EXPLAIN_TOPICS)

  return (
    <div className="shrink-0 border-b border-amber-500/25 bg-amber-500/10 px-3 py-2 text-xs backdrop-blur-xs transition-colors dark:bg-amber-500/15">
      <div className="flex flex-wrap items-center justify-between gap-2">
        {/* Left: Indicator & Description */}
        <div className="flex items-center gap-2">
          <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-amber-500/20 text-amber-700 dark:text-amber-300">
            <Sparkles className="h-3.5 w-3.5" />
          </div>
          <div>
            <span className="font-semibold text-amber-900 dark:text-amber-200">
              Chế độ Thuyết minh PO (Explain Mode):
            </span>{' '}
            <span className="text-amber-800/90 dark:text-amber-300/90 hidden sm:inline">
              Nhấp vào biểu tượng 💡 trên từng khối hoặc chọn nhanh chủ đề bên dưới để khám phá ý đồ sản phẩm & quy tắc nghiệp vụ.
            </span>
          </div>
        </div>

        {/* Right: Exit button */}
        <div className="flex items-center gap-1.5 shrink-0 ml-auto">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => setExplainMode(false)}
            className="h-6 gap-1 rounded-md px-2 text-[11px] font-medium text-amber-900/80 hover:bg-amber-500/20 hover:text-amber-950 dark:text-amber-200 dark:hover:text-amber-100 cursor-pointer"
          >
            <span>Tắt thuyết minh</span>
            <X className="h-3 w-3" />
          </Button>
        </div>
      </div>

      {/* Quick topics chips */}
      <div className="mt-1.5 flex items-center gap-1.5 overflow-x-auto pb-0.5 pt-0.5 scrollbar-none">
        <span className="text-[11px] font-medium text-amber-800/70 dark:text-amber-300/70 shrink-0">
          Chủ đề nổi bật:
        </span>
        {topicsList.map((topic) => {
          const isSelected = activeExplainTopic === topic.id
          return (
            <button
              key={topic.id}
              type="button"
              onClick={() => setActiveExplainTopic(isSelected ? null : topic.id)}
              className={cn(
                'inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] transition-all cursor-pointer shrink-0 select-none border',
                isSelected
                  ? 'bg-amber-500 text-amber-950 font-semibold border-amber-600 shadow-xs'
                  : 'bg-background/80 text-foreground/80 border-border/80 hover:bg-background hover:text-foreground hover:border-amber-500/40'
              )}
            >
              <Lightbulb className={cn('h-2.5 w-2.5', isSelected ? 'fill-amber-950' : 'text-amber-600')} />
              <span>{topic.badgeLabel || topic.title}</span>
              <ChevronRight className="h-2.5 w-2.5 opacity-50" />
            </button>
          )
        })}
      </div>
    </div>
  )
}
