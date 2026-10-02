'use client'

import { cn } from '@/lib/utils'
import type { StudentProgram, HistoricalTrack } from './studentDetailTypes'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  MoreVertical,
  ChevronDown,
  CalendarOff,
  Snowflake,
  PlayCircle,
  ArrowRightLeft,
  LogOut,
  Plus,
  History,
} from 'lucide-react'
import { defaultHistoricalTracks } from './studentDetailTypes'

export interface StudentDetailProgramsBarProps {
  programs: StudentProgram[]
  selectedProgramId: string
  onSelectProgram: (id: string) => void
  historicalTracks?: HistoricalTrack[]
  studentName?: string
  onOpenClassDetail?: (classCode: string) => void
  onOpenAssignClass?: () => void
  onLeave?: () => void
  onReserve?: () => void
  onResume?: () => void
  onTransfer?: () => void
  onDrop?: () => void
  onAssignClass?: () => void
  isReserved?: boolean
  isWaitingForAssignment?: boolean
}

export function StudentDetailProgramsBar({
  programs,
  selectedProgramId,
  onSelectProgram,
  historicalTracks,
  studentName,
  onOpenClassDetail,
  onOpenAssignClass,
  onLeave,
  onReserve,
  onResume,
  onTransfer,
  onDrop,
  onAssignClass,
  isReserved = false,
  isWaitingForAssignment = false,
}: StudentDetailProgramsBarProps) {
  const tracksToDisplay = historicalTracks || defaultHistoricalTracks
  const hasActions = Boolean(onLeave || onReserve || onResume || onTransfer || onDrop || onAssignClass || onOpenAssignClass)

  return (
    <div className="flex flex-wrap items-center justify-between gap-2.5 pb-1.5 select-none border-b border-border/40">
      {/* Program Tabs: chỉ có tên lộ trình, không có icon, không có số gói, không có trạng thái */}
      <div className="flex flex-wrap items-center gap-2">
        {programs.map((prog) => {
          const isSelected = selectedProgramId === prog.id
          return (
            <button
              key={prog.id}
              type="button"
              onClick={() => onSelectProgram(prog.id)}
              className={cn(
                'flex h-9 items-center rounded-lg px-3.5 text-xs font-bold transition-all cursor-pointer shadow-2xs',
                isSelected
                  ? 'bg-primary text-primary-foreground shadow-xs'
                  : 'bg-background border border-border/80 text-muted-foreground hover:text-foreground hover:bg-muted/50'
              )}
            >
              <span>{prog.name}</span>
            </button>
          )
        })}

        {/* Nút Khác: hiển thị menu các lộ trình đào tạo cũ / khác, không mở modal */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="h-9 px-3 text-xs font-semibold gap-1 text-muted-foreground hover:text-foreground border border-border/80 hover:bg-muted/50 rounded-lg cursor-pointer shadow-3xs"
              title="Danh sách các lộ trình khác / lộ trình cũ"
            >
              <span>Khác</span>
              <ChevronDown className="h-3 w-3 opacity-60 shrink-0" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-80 p-2 space-y-1">
            <div className="px-2 py-1 text-[11px] font-bold uppercase tracking-wider text-muted-foreground flex items-center justify-between gap-1.5">
              <span className="flex items-center gap-1.5">
                <History className="h-3.5 w-3.5 text-primary shrink-0" />
                <span>Lộ trình đào tạo trước đó</span>
              </span>
              {studentName && (
                <span className="text-[10px] lowercase font-normal opacity-70 truncate max-w-[100px]">
                  {studentName}
                </span>
              )}
            </div>
            <DropdownMenuSeparator />
            {tracksToDisplay.map((track) => (
              <div
                key={track.id}
                className="p-2 rounded-lg hover:bg-muted/60 transition-colors cursor-default text-left space-y-1"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="font-bold text-xs text-foreground truncate">{track.name}</span>
                  <span className="text-[10.5px] font-semibold text-emerald-600 dark:text-emerald-400 shrink-0">
                    {track.completedSessions}/{track.totalSessions}b
                  </span>
                </div>
                <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                  <span className="truncate">{track.level}</span>
                  <span className="shrink-0 text-[10px] text-muted-foreground/80">{track.startDate} – {track.endDate}</span>
                </div>
                {track.finalOutcome && (
                  <div className="text-[10px] text-emerald-700 dark:text-emerald-400 font-medium leading-tight">
                    ✓ {track.finalOutcome}
                  </div>
                )}
                {track.classes && track.classes.length > 0 && (
                  <div className="text-[10px] text-muted-foreground pt-0.5 border-t border-border/30 flex items-center gap-1 flex-wrap">
                    <span>Lớp:</span>
                    {track.classes.map((c, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => onOpenClassDetail?.(c.classCode)}
                        className="font-mono bg-muted hover:bg-primary/10 hover:text-primary px-1 py-0.2 rounded text-[9.5px] cursor-pointer transition-colors"
                        title="Xem chi tiết lớp học"
                      >
                        {c.classCode}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Nút Thao tác dạng dropdown ở cạnh phải dòng Chương trình/môn học */}
      {hasActions && (
        <div className="flex items-center gap-1.5 shrink-0">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="h-8 px-2.5 text-xs font-medium gap-1 text-muted-foreground hover:text-foreground rounded-lg bg-background hover:bg-muted/60 border-border/80 cursor-pointer shadow-3xs"
                title="Danh sách thao tác học vụ"
              >
                <MoreVertical className="h-3.5 w-3.5" />
                <span>Thao tác</span>
                <ChevronDown className="h-3 w-3 opacity-60" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-44">
              {isReserved ? (
                onResume && (
                  <DropdownMenuItem
                    onClick={onResume}
                    className="cursor-pointer gap-2 font-medium text-emerald-700 dark:text-emerald-400 focus:text-emerald-800"
                  >
                    <PlayCircle className="h-4 w-4 text-emerald-600 shrink-0" />
                    <span>Đi học lại</span>
                  </DropdownMenuItem>
                )
              ) : isWaitingForAssignment ? (
                <>
                  {(onAssignClass || onOpenAssignClass) && (
                    <DropdownMenuItem
                      onClick={onAssignClass || onOpenAssignClass}
                      className="cursor-pointer gap-2 font-medium text-indigo-700 dark:text-indigo-400 focus:text-indigo-800"
                    >
                      <Plus className="h-4 w-4 text-indigo-600 shrink-0" />
                      <span>Ghép lớp</span>
                    </DropdownMenuItem>
                  )}
                  {onReserve && (
                    <DropdownMenuItem
                      onClick={onReserve}
                      className="cursor-pointer gap-2 font-medium text-sky-700 dark:text-sky-400 focus:text-sky-800"
                    >
                      <Snowflake className="h-4 w-4 text-sky-600 shrink-0" />
                      <span>Bảo lưu</span>
                    </DropdownMenuItem>
                  )}
                </>
              ) : (
                <>
                  {onLeave && (
                    <DropdownMenuItem
                      onClick={onLeave}
                      className="cursor-pointer gap-2 font-medium text-amber-700 dark:text-amber-400 focus:text-amber-800"
                    >
                      <CalendarOff className="h-4 w-4 text-amber-600 shrink-0" />
                      <span>Nghỉ phép</span>
                    </DropdownMenuItem>
                  )}

                  {onReserve && (
                    <DropdownMenuItem
                      onClick={onReserve}
                      className="cursor-pointer gap-2 font-medium text-sky-700 dark:text-sky-400 focus:text-sky-800"
                    >
                      <Snowflake className="h-4 w-4 text-sky-600 shrink-0" />
                      <span>Bảo lưu</span>
                    </DropdownMenuItem>
                  )}

                  {onTransfer && (
                    <DropdownMenuItem
                      onClick={onTransfer}
                      className="cursor-pointer gap-2 font-medium text-indigo-700 dark:text-indigo-400 focus:text-indigo-800"
                    >
                      <ArrowRightLeft className="h-4 w-4 text-indigo-600 shrink-0" />
                      <span>Chuyển lớp</span>
                    </DropdownMenuItem>
                  )}

                  {onDrop && (
                    <>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={onDrop}
                        className="cursor-pointer gap-2 font-medium text-rose-600 dark:text-rose-400 focus:text-rose-700"
                      >
                        <LogOut className="h-4 w-4 text-rose-500 shrink-0" />
                        <span>Thoát lớp</span>
                      </DropdownMenuItem>
                    </>
                  )}
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )}
    </div>
  )
}
