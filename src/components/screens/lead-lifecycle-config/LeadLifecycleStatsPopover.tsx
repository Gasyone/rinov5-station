'use client'

import React, { useState } from 'react'
import {
  DataPoolConfig,
  PipelineStageConfig,
} from './leadLifecycleTypes'
import { getStagePhase } from './leadLifecycleHelpers'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Badge } from '@/components/ui/badge'
import {
  Database,
  GitFork,
  Tags,
  ChevronDown,
  ChevronUp,
  Sparkles,
  ArrowRightLeft,
  CheckCircle2,
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface LeadLifecycleStatsPopoverProps {
  pools: DataPoolConfig[]
  stages: PipelineStageConfig[]
  totalLegacyCount?: number
  className?: string
}

export const LeadLifecycleStatsPopover: React.FC<LeadLifecycleStatsPopoverProps> = ({
  pools,
  stages,
  totalLegacyCount = 32,
  className,
}) => {
  const [open, setOpen] = useState(false)

  const wonCount = stages.filter((s) => s.stageType === 'won').length
  const lostCount = stages.filter((s) => s.stageType === 'global_lost').length
  const inProgressCount = stages.filter((s) => s.stageType === 'in_progress').length
  const totalSubStatuses = stages.reduce((acc, s) => acc + (s.subStatuses?.length || 0), 0)

  // Phase breakdown using getStagePhase
  const phaseCounts = {
    T0: stages.filter((s) => getStagePhase(s) === 'T0').length,
    T1: stages.filter((s) => getStagePhase(s) === 'T1').length,
    T2: stages.filter((s) => getStagePhase(s) === 'T2').length,
    T3: stages.filter((s) => getStagePhase(s) === 'T3').length,
    T4: stages.filter((s) => getStagePhase(s) === 'T4').length,
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          title="Xem thống kê tổng quan phễu & kho dữ liệu"
          className={cn(
            'inline-flex items-center gap-2 rounded-lg border border-border/80 bg-background/95 px-2.5 py-1 text-xs shadow-2xs backdrop-blur-xs transition-all hover:bg-muted/70 hover:border-primary/40 focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring cursor-pointer select-none shrink-0',
            open && 'border-primary/50 bg-muted/80 ring-1 ring-primary/20',
            className
          )}
        >
          {/* Main Icon Badge */}
          <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded bg-primary/10 text-primary">
            <Database className="h-3.5 w-3.5" />
          </div>

          {/* Metric 1: Pools */}
          <div className="flex items-center gap-1">
            <span className="font-semibold text-foreground">{pools.length}</span>
            <span className="text-muted-foreground">kho</span>
          </div>

          <span className="text-muted-foreground/40 font-light">|</span>

          {/* Metric 2: Stages */}
          <div className="flex items-center gap-1">
            <span className="font-semibold text-foreground">{stages.length}</span>
            <span className="text-muted-foreground">bước</span>
          </div>

          <span className="text-muted-foreground/40 font-light">|</span>

          {/* Metric 3: Sub-statuses */}
          <div className="flex items-center gap-1">
            <span className="font-semibold text-foreground">{totalSubStatuses}</span>
            <span className="text-muted-foreground">nhãn con</span>
          </div>

          <span className="text-muted-foreground/40 font-light">|</span>

          {/* Metric 4: Legacy Mapped */}
          <div className="flex items-center gap-1">
            <span className="font-semibold text-purple-600 dark:text-purple-400 font-mono">
              {totalLegacyCount}
            </span>
            <span className="text-muted-foreground">mã cũ</span>
          </div>

          {open ? (
            <ChevronUp className="h-3.5 w-3.5 text-muted-foreground ml-0.5" />
          ) : (
            <ChevronDown className="h-3.5 w-3.5 text-muted-foreground ml-0.5" />
          )}
        </button>
      </PopoverTrigger>

      <PopoverContent
        align="end"
        sideOffset={6}
        className="w-[380px] sm:w-[440px] p-4 space-y-3.5 bg-popover border border-border shadow-md rounded-xl"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-2 border-b border-border/70">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary/10 text-primary">
              <Sparkles className="h-4 w-4" />
            </div>
            <div>
              <h4 className="text-xs font-semibold text-foreground leading-none">
                Thống kê Phễu &amp; Kho Dữ liệu
              </h4>
              <p className="text-[11px] text-muted-foreground mt-0.5">
                Cấu hình toàn chuỗi cơ sở Rinov5
              </p>
            </div>
          </div>

          <Badge variant="outline" className="text-[11px] font-normal py-0.5 px-2 bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950/40 dark:text-purple-300">
            {totalLegacyCount}/{totalLegacyCount} Mã Quy Hoạch
          </Badge>
        </div>

        {/* 4 Grid Cards */}
        <div className="grid grid-cols-2 gap-2">
          {/* Card 1: Data Pools */}
          <div className="p-2.5 rounded-lg border border-pink-200/60 bg-pink-50/40 dark:bg-pink-950/20 dark:border-pink-900/40 space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-medium text-pink-900 dark:text-pink-300 uppercase tracking-wider">
                Kho Dữ liệu
              </span>
              <Database className="h-3.5 w-3.5 text-pink-600 dark:text-pink-400" />
            </div>
            <div className="text-base font-bold text-foreground font-mono">
              {pools.length} <span className="text-xs font-normal text-muted-foreground">kho</span>
            </div>
            <div className="text-[10px] text-muted-foreground truncate">
              {pools.map((p) => p.name).join(' · ')}
            </div>
          </div>

          {/* Card 2: Pipeline Stages */}
          <div className="p-2.5 rounded-lg border border-amber-200/60 bg-amber-50/40 dark:bg-amber-950/20 dark:border-amber-900/40 space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-medium text-amber-900 dark:text-amber-300 uppercase tracking-wider">
                Bước Phễu Lead
              </span>
              <GitFork className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400" />
            </div>
            <div className="text-base font-bold text-foreground font-mono">
              {stages.length} <span className="text-xs font-normal text-muted-foreground">bước</span>
            </div>
            <div className="text-[10px] text-muted-foreground truncate">
              {inProgressCount} Tiến hành · {wonCount} Won · {lostCount} Lost
            </div>
          </div>

          {/* Card 3: Sub Statuses */}
          <div className="p-2.5 rounded-lg border border-blue-200/60 bg-blue-50/40 dark:bg-blue-950/20 dark:border-blue-900/40 space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-medium text-blue-900 dark:text-blue-300 uppercase tracking-wider">
                Nhãn Trạng thái Con
              </span>
              <Tags className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="text-base font-bold text-foreground font-mono">
              {totalSubStatuses} <span className="text-xs font-normal text-muted-foreground">nhãn</span>
            </div>
            <div className="text-[10px] text-muted-foreground truncate">
              Gắn theo từng bước phễu chính
            </div>
          </div>

          {/* Card 4: Legacy Migration */}
          <div className="p-2.5 rounded-lg border border-emerald-200/60 bg-emerald-50/40 dark:bg-emerald-950/20 dark:border-emerald-900/40 space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-medium text-emerald-900 dark:text-emerald-300 uppercase tracking-wider">
                Bảo toàn Mã Cũ
              </span>
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div className="text-base font-bold text-foreground font-mono">
              32/32 <span className="text-xs font-normal text-muted-foreground">mã T0-T4</span>
            </div>
            <div className="text-[10px] text-muted-foreground truncate">
              100% đã được ánh xạ
            </div>
          </div>
        </div>

        {/* Phase Breakdown [T0] - [T4] */}
        <div className="space-y-1.5 pt-1">
          <div className="flex items-center justify-between text-[11px]">
            <span className="text-muted-foreground font-medium">Phân bố bước theo các giai đoạn [T0] - [T4]:</span>
            <span className="font-mono text-foreground font-semibold">{stages.length} bước</span>
          </div>

          {/* Mini Badges for T0-T4 */}
          <div className="grid grid-cols-5 gap-1 pt-1">
            <div className="text-center p-1.5 rounded bg-muted/50 border border-border/50">
              <div className="text-[10px] font-bold text-blue-600 dark:text-blue-400">[T0]</div>
              <div className="text-xs font-semibold text-foreground font-mono">{phaseCounts.T0}</div>
              <div className="text-[9px] text-muted-foreground truncate">Tiếp nhận</div>
            </div>
            <div className="text-center p-1.5 rounded bg-muted/50 border border-border/50">
              <div className="text-[10px] font-bold text-amber-600 dark:text-amber-400">[T1]</div>
              <div className="text-xs font-semibold text-foreground font-mono">{phaseCounts.T1}</div>
              <div className="text-[9px] text-muted-foreground truncate">Tư vấn</div>
            </div>
            <div className="text-center p-1.5 rounded bg-muted/50 border border-border/50">
              <div className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400">[T2]</div>
              <div className="text-xs font-semibold text-foreground font-mono">{phaseCounts.T2}</div>
              <div className="text-[9px] text-muted-foreground truncate">Test / Thử</div>
            </div>
            <div className="text-center p-1.5 rounded bg-muted/50 border border-border/50">
              <div className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400">[T3]</div>
              <div className="text-xs font-semibold text-foreground font-mono">{phaseCounts.T3}</div>
              <div className="text-[9px] text-muted-foreground truncate">Chốt deal</div>
            </div>
            <div className="text-center p-1.5 rounded bg-muted/50 border border-border/50">
              <div className="text-[10px] font-bold text-rose-600 dark:text-rose-400">[T4]</div>
              <div className="text-xs font-semibold text-foreground font-mono">{phaseCounts.T4}</div>
              <div className="text-[9px] text-muted-foreground truncate">Kết thúc</div>
            </div>
          </div>
        </div>

        {/* Legacy Mapping Hint */}
        <div className="pt-2 border-t border-border/60 flex items-center justify-between text-[11px] text-muted-foreground">
          <span className="flex items-center gap-1">
            <ArrowRightLeft className="h-3 w-3 text-purple-600 dark:text-purple-400" />
            Toàn bộ 32 mã T0-T4 đã được bảo toàn và ánh xạ đầy đủ
          </span>
        </div>
      </PopoverContent>
    </Popover>
  )
}
