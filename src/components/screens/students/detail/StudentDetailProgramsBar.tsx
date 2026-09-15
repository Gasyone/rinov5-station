'use client'

import { cn } from '@/lib/utils'
import type { StudentProgram } from './studentDetailTypes'

interface StudentDetailProgramsBarProps {
  programs: StudentProgram[]
  selectedProgramId: string
  onSelectProgram: (id: string) => void
  onOpenAssignClass?: () => void
}

export function StudentDetailProgramsBar({
  programs,
  selectedProgramId,
  onSelectProgram,
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

  return (
    <div className="flex flex-wrap items-center justify-between gap-2.5 pb-1 select-none border-b border-border/40">
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
              {getStatusPill(prog.programStatus)}
            </button>
          )
        })}
      </div>
    </div>
  )
}
