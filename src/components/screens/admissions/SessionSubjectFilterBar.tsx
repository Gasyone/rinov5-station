'use client'

import React from 'react'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import type { UnifiedSubject } from './unifiedSessionTypes'

interface SessionSubjectFilterBarProps {
  activeSubject: UnifiedSubject
  onSubjectChange: (subj: UnifiedSubject) => void
  counts: {
    english: number
    math: number
  }
}

export function SessionSubjectFilterBar({
  activeSubject,
  onSubjectChange,
  counts,
}: SessionSubjectFilterBarProps) {
  return (
    <div className="flex items-center gap-2 text-xs shrink-0 select-none">
      {/* Nút môn Tiếng Anh */}
      <button
        type="button"
        onClick={() => onSubjectChange('english')}
        className={cn(
          'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all cursor-pointer shadow-3xs',
          activeSubject === 'english'
            ? 'bg-primary text-primary-foreground border-primary font-semibold ring-2 ring-primary/20 shadow-xs'
            : 'bg-background text-muted-foreground border-border/80 hover:bg-muted/50 hover:text-foreground'
        )}
      >
        <span>Tiếng Anh</span>
        <span
          className={cn(
            'h-4.5 min-w-4.5 px-1.5 text-[10px] leading-none rounded-full flex items-center justify-center font-mono transition-colors',
            activeSubject === 'english'
              ? 'bg-primary-foreground/20 text-primary-foreground font-bold'
              : 'bg-muted text-muted-foreground'
          )}
        >
          {counts.english}
        </span>
      </button>

      {/* Nút môn Toán */}
      <button
        type="button"
        onClick={() => onSubjectChange('math')}
        className={cn(
          'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all cursor-pointer shadow-3xs',
          activeSubject === 'math'
            ? 'bg-primary text-primary-foreground border-primary font-semibold ring-2 ring-primary/20 shadow-xs'
            : 'bg-background text-muted-foreground border-border/80 hover:bg-muted/50 hover:text-foreground'
        )}
      >
        <span>Toán tư duy</span>
        <span
          className={cn(
            'h-4.5 min-w-4.5 px-1.5 text-[10px] leading-none rounded-full flex items-center justify-center font-mono transition-colors',
            activeSubject === 'math'
              ? 'bg-primary-foreground/20 text-primary-foreground font-bold'
              : 'bg-muted text-muted-foreground'
          )}
        >
          {counts.math}
        </span>
      </button>
    </div>
  )
}
