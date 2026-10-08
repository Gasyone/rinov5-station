export function CalendarClassScheduleFooter() {
  return (
    <div className="border-t border-border/40 bg-muted/20 px-2.5 py-1">
      <div className="flex flex-wrap items-center gap-x-3.5 gap-y-1 text-[11px] text-muted-foreground">
        <span className="font-semibold text-foreground/80">Chú giải màu:</span>
        <div className="flex items-center gap-1">
          <span className="h-2 w-2 rounded-full bg-emerald-500 border border-emerald-600 dark:bg-emerald-400" />
          <span className="font-medium text-emerald-600 dark:text-emerald-400">Buổi hôm nay</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="h-2 w-2 rounded-full bg-white border border-border dark:bg-zinc-800" />
          <span>Sắp diễn ra</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="h-2 w-2 rounded-full bg-zinc-400 border border-zinc-500 dark:bg-zinc-500" />
          <span className="font-medium text-zinc-600 dark:text-zinc-400">Đã diễn ra</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="h-2 w-2 rounded-full bg-sky-500 border border-sky-600 dark:bg-sky-400" />
          <span className="font-semibold text-sky-700 dark:text-sky-400">Dạy thay</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="h-2 w-2 rounded-full bg-red-500 border border-red-600 dark:bg-red-400 shadow-2xs" />
          <span className="font-semibold text-red-700 dark:text-red-400">
            Khai giảng
          </span>
        </div>
        <div className="flex items-center gap-1">
          <span className="h-2 w-2 rounded-full bg-zinc-300 border border-zinc-400 dark:bg-zinc-700 opacity-50" />
          <span className="line-through font-medium text-zinc-400 dark:text-zinc-500">Đã hủy</span>
        </div>
      </div>
    </div>
  )
}
