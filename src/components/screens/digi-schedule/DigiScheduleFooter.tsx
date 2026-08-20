'use client'

export function DigiScheduleFooter() {
  return (
    <div className="shrink-0 border-t border-border/40 bg-card px-4 py-2 text-xs">
      <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-muted-foreground">
        <span className="font-semibold text-foreground/80">Chú giải màu sắc:</span>
        <div className="flex items-center gap-1.5">
          <span className="h-3 w-3 rounded-full bg-emerald-50 border border-emerald-500 dark:bg-emerald-950/40" />
          <span className="font-medium text-emerald-700 dark:text-emerald-300">Ca hôm nay</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="h-3 w-3 rounded-full bg-white border border-border dark:bg-zinc-900 shadow-2xs" />
          <span className="font-medium text-foreground">Ca sắp diễn ra</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="h-3 w-3 rounded-full bg-zinc-100 border border-zinc-300 dark:bg-zinc-800/60 dark:border-zinc-700" />
          <span className="text-muted-foreground">Ca đã hoàn thành</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
          <span className="font-semibold text-red-600 dark:text-red-400">Giờ hiện tại</span>
        </div>
      </div>
    </div>
  )
}
