export function CalendarClassScheduleFooter() {
  return (
    <div className="border-t border-border/40 bg-muted/20 px-3 py-2 lg:px-4">
      <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-muted-foreground">
        <span className="font-semibold text-foreground/80">Chú giải màu sắc:</span>
        <div className="flex items-center gap-1.5">
          <span className="h-3 w-3 rounded-full bg-emerald-500 border border-emerald-600 dark:bg-emerald-400" />
          <span className="font-medium text-emerald-600 dark:text-emerald-400">Buổi học hôm nay</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="h-3 w-3 rounded-full bg-white border border-border dark:bg-zinc-800" />
          <span>Buổi học sắp diễn ra</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="h-3 w-3 rounded-full bg-zinc-400 border border-zinc-500 dark:bg-zinc-500" />
          <span className="font-medium text-zinc-600 dark:text-zinc-400">Buổi học đã diễn ra</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="h-3 w-3 rounded-full bg-sky-500 border border-sky-600 dark:bg-sky-400" />
          <span className="font-semibold text-sky-700 dark:text-sky-400">Buổi dạy thay</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="h-3 w-3 rounded-full bg-red-500 border border-red-600 dark:bg-red-400 shadow-2xs" />
          <span className="font-semibold text-red-700 dark:text-red-400 flex items-center gap-1">
            Ngày khai giảng (Lớp mới)
            <span className="inline-flex rounded bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-800 px-1.5 py-0.5 text-[8px] font-bold uppercase">
              KHAI GIẢNG
            </span>
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="h-3 w-3 rounded-full bg-zinc-300 border border-zinc-400 dark:bg-zinc-700 opacity-50" />
          <span className="line-through font-medium text-zinc-400 dark:text-zinc-500">Buổi học đã hủy</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="flex items-center">
            <span className="h-2 w-2 rounded-full bg-red-600 ring-2 ring-red-300 dark:ring-red-900 animate-pulse" />
            <span className="h-[2px] w-3 bg-red-500" />
          </div>
          <span className="font-semibold text-red-600 dark:text-red-400">Giờ hiện tại</span>
        </div>
      </div>
    </div>
  )
}
