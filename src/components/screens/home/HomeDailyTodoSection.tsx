'use client'

import React, { useState } from 'react'
import {
  CheckSquare,
  ArrowRight,
  Sparkles,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import type { DailyTodoItem } from './homeTypes'

interface HomeDailyTodoSectionProps {
  todos: DailyTodoItem[]
  onNavigate: (url: string) => void
}

export function HomeDailyTodoSection({
  todos,
  onNavigate,
}: HomeDailyTodoSectionProps) {
  const [completedIds, setCompletedIds] = useState<Set<string>>(new Set())

  const toggleTodo = (id: string) => {
    setCompletedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
  }

  const totalCount = todos.length
  const completedCount = completedIds.size
  const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 100

  return (
    <div className="bg-card border border-border/70 rounded-xl p-3 shadow-xs space-y-2.5 transition-all">
      {/* Header */}
      <div className="flex items-center justify-between gap-2 pb-1.5 border-b border-border/40">
        <div className="flex items-center gap-2">
          <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-primary/10 text-primary shrink-0">
            <CheckSquare className="w-3.5 h-3.5" />
          </div>
          <div className="flex items-center gap-1.5">
            <h3 className="text-xs sm:text-sm font-semibold text-foreground tracking-tight">
              Việc cần xử lý hôm nay
            </h3>
            <Badge
              variant="secondary"
              className={`text-xs h-4.5 px-1.5 font-semibold rounded-full ${
                completedCount === totalCount && totalCount > 0
                  ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-400'
                  : 'bg-muted/80 text-muted-foreground'
              }`}
            >
              {completedCount}/{totalCount} xong
            </Badge>
          </div>
        </div>

        {completedCount === totalCount && totalCount > 0 ? (
          <span className="flex items-center gap-1 text-xs font-medium text-emerald-600 dark:text-emerald-400">
            <Sparkles className="w-3 h-3" />
            <span>Hoàn tất!</span>
          </span>
        ) : (
          <span className="text-xs text-muted-foreground font-mono tabular-nums">
            {progressPercent}%
          </span>
        )}
      </div>

      {/* Subtle Progress Bar */}
      <div className="w-full h-1 bg-muted/60 rounded-full overflow-hidden">
        <div
          className={`h-full transition-all duration-300 rounded-full ${
            completedCount === totalCount && totalCount > 0
              ? 'bg-emerald-500'
              : 'bg-primary'
          }`}
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* Todo Items */}
      <div className="space-y-1 divide-y divide-border/20">
        {todos.map((todo) => {
          const isDone = completedIds.has(todo.id)

          return (
            <div
              key={todo.id}
              className={`flex items-center justify-between gap-2.5 px-2 py-1.5 rounded-lg transition-all ${
                isDone
                  ? 'opacity-50 bg-muted/20'
                  : 'hover:bg-muted/50'
              }`}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <Checkbox
                  checked={isDone}
                  onCheckedChange={() => toggleTodo(todo.id)}
                  aria-label={`Hoàn thành việc ${todo.title}`}
                  className="h-4 w-4 rounded"
                />
                <span
                  className={`text-xs font-medium truncate ${
                    isDone
                      ? 'line-through text-muted-foreground'
                      : 'text-foreground'
                  }`}
                  title={todo.title}
                >
                  {todo.title}
                </span>

                {todo.count > 0 && !isDone && (
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full font-semibold shrink-0 tabular-nums ${
                      todo.urgency === 'high'
                        ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400'
                        : todo.urgency === 'medium'
                        ? 'bg-amber-500/10 text-amber-700 dark:text-amber-400'
                        : 'bg-muted text-muted-foreground'
                    }`}
                  >
                    {todo.count}
                  </span>
                )}
              </div>

              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => onNavigate(todo.actionUrl)}
                className="h-6 text-xs font-medium text-muted-foreground hover:text-foreground gap-1 shrink-0 px-2 rounded-md hover:bg-muted/60"
              >
                <span>{todo.actionLabel}</span>
                <ArrowRight className="w-2.5 h-2.5" />
              </Button>
            </div>
          )
        })}
      </div>
    </div>
  )
}
