'use client'

import { cn } from '@/lib/utils'
import type { StudentProgram } from './studentDetailTypes'
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
} from 'lucide-react'

export interface StudentDetailProgramsBarProps {
  programs: StudentProgram[]
  selectedProgramId: string
  onSelectProgram: (id: string) => void
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
  const getStatusPill = (status: StudentProgram['programStatus']) => {
    switch (status) {
      case 'active':
        return (
          <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-[10.5px] font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300">
            Đang học
          </span>
        )
      case 'wait_for_assignment':
        return (
          <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-[10.5px] font-semibold bg-amber-100 text-amber-800 dark:bg-amber-950/80 dark:text-amber-300">
            Chờ ghép
          </span>
        )
      case 'reserved':
        return (
          <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-[10.5px] font-semibold bg-blue-100 text-blue-800 dark:bg-blue-950/80 dark:text-blue-300">
            Bảo lưu
          </span>
        )
      case 'dropped':
        return (
          <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-[10.5px] font-semibold bg-rose-100 text-rose-800 dark:bg-rose-950/80 dark:text-rose-300">
            Đã thoát
          </span>
        )
      default:
        return null
    }
  }

  const hasActions = Boolean(onLeave || onReserve || onResume || onTransfer || onDrop || onAssignClass || onOpenAssignClass)

  return (
    <div className="flex flex-wrap items-center justify-between gap-2.5 pb-1.5 select-none border-b border-border/40">
      {/* Program Tabs: không có icon */}
      <div className="flex flex-wrap items-center gap-2">
        {programs.map((prog) => {
          const isSelected = selectedProgramId === prog.id
          return (
            <button
              key={prog.id}
              type="button"
              onClick={() => onSelectProgram(prog.id)}
              className={cn(
                'flex h-9 items-center gap-2 rounded-lg px-3.5 text-xs font-bold transition-all cursor-pointer shadow-2xs',
                isSelected
                  ? 'bg-primary text-primary-foreground shadow-xs'
                  : 'bg-background border border-border/80 text-muted-foreground hover:text-foreground hover:bg-muted/50'
              )}
            >
              <span>{prog.name}</span>
              {prog.packages && prog.packages.length > 0 && (
                <span
                  className={cn(
                    'text-[10.5px] font-medium px-1.5 py-0.2 rounded-full',
                    isSelected
                      ? 'bg-primary-foreground/20 text-primary-foreground'
                      : 'bg-muted text-muted-foreground'
                  )}
                >
                  {prog.packages.length} gói
                </span>
              )}
              {getStatusPill(prog.programStatus)}
            </button>
          )
        })}
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
