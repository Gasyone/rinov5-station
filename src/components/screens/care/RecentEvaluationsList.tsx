'use client'

import React, { useMemo } from 'react'
import { Star } from 'lucide-react'
import { type SessionHistory } from './StudentCareReportTab'

interface RecentEvaluationsListProps {
  regularSessions: SessionHistory[]
  testSessions: SessionHistory[]
}

export function RecentEvaluationsList({ regularSessions, testSessions }: RecentEvaluationsListProps) {
  const recentSessions = useMemo(() => {
    // Combine all sessions, sort by sessionNumber desc (most recent first), take top 5
    const combined = [...regularSessions, ...testSessions]
      .filter((s) => s.rating > 0 || s.comment) // only sessions with ratings or comments
      .sort((a, b) => b.sessionNumber - a.sessionNumber)
    return combined.slice(0, 5)
  }, [regularSessions, testSessions])

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-1.5 px-1">
        <Star className="h-3.5 w-3.5 text-amber-400 fill-amber-400 shrink-0" />
        <h3 className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
          Đánh giá & nhận xét 5 buổi gần nhất
        </h3>
      </div>

      {recentSessions.length === 0 ? (
        <div className="py-8 text-center text-xs text-muted-foreground italic border border-dashed rounded-xl bg-muted/5">
          Chưa có đánh giá nhận xét nào gần đây.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
          {recentSessions.map((s) => (
            <div
              key={s.id}
              className="flex flex-col rounded-xl border border-border/70 bg-background dark:bg-zinc-900/30 p-3 shadow-3xs hover:border-border transition-all text-left"
            >
              {/* Header row with Buổi number and Date */}
              <div className="flex items-center justify-between gap-1.5 border-b border-border/40 pb-2">
                <span className="inline-flex items-center rounded bg-muted/60 px-1.5 py-0.5 text-[9px] font-semibold text-foreground select-none shrink-0">
                  Buổi {s.sessionNumber}
                </span>
                <span className="text-[9px] font-medium text-muted-foreground shrink-0">
                  {s.date}
                </span>
              </div>

              {/* Body with Rating count + Star icon, Lesson Title and Flat Comment */}
              <div className="mt-2 min-w-0 flex-1 flex flex-col justify-between">
                <div className="flex items-center gap-1.5 min-w-0 mb-2">
                  {s.rating > 0 && (
                    <span className="inline-flex items-center gap-0.5 text-[9.5px] font-bold text-amber-600 dark:text-amber-400 leading-none shrink-0" title={`Đánh giá: ${s.rating}/5 sao`}>
                      <span>{s.rating}/5</span>
                      <Star className="h-3 w-3 text-amber-400 fill-amber-400 shrink-0" />
                    </span>
                  )}
                  <span className="text-[10.5px] font-bold text-foreground leading-snug truncate" title={s.topic}>
                    {s.topic}
                  </span>
                </div>

                {/* Direct Flat Comment Text (No title header) */}
                <div className="mt-auto pt-1 text-left">
                  {s.comment ? (
                    <p className="text-[10px] text-muted-foreground leading-relaxed italic line-clamp-3" title={s.comment}>
                      &ldquo;{s.comment}&rdquo;
                    </p>
                  ) : (
                    <p className="text-[10px] text-zinc-400 dark:text-zinc-600 italic">Chưa nhận xét</p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
