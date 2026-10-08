'use client'

import React, { useState } from 'react'
import {
  GraduationCap,
  ArrowUpRight,
  ChevronDown,
  Check,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu'
import { EmptyState } from '@/components/shared'
import type { ClassRecord } from '@/mocks/classRecords'

interface HomeManagedClassesSectionProps {
  classes: ClassRecord[]
  onOpenClassDetail: (cls: ClassRecord) => void
  onNavigateClasses: () => void
}

export function HomeManagedClassesSection({
  classes,
  onOpenClassDetail,
  onNavigateClasses,
}: HomeManagedClassesSectionProps) {
  const [filterMode, setFilterMode] = useState<'running' | 'upcoming' | 'all'>('running')

  const runningClasses = classes.filter((c) => c.status === 'dang_hoc')
  const upcomingClasses = classes.filter((c) => c.status === 'cho_khai_giang' || c.status === 'mo_chieu_sinh')
  const totalStudents = classes.reduce((acc, c) => acc + (c.enrolledStudents || 0), 0)

  const displayList =
    filterMode === 'all'
      ? classes
      : filterMode === 'upcoming'
      ? upcomingClasses
      : runningClasses

  return (
    <div className="bg-card border border-border/70 rounded-xl p-2 sm:p-2.5 shadow-xs flex flex-col h-full space-y-1.5 min-h-0 overflow-hidden">
      {/* Header: Click vào title để mở danh sách, tab lọc dạng selection nhỏ gọn ở bên phải dòng title */}
      <div className="flex items-center justify-between gap-1.5 pb-1 border-b border-border/50 shrink-0">
        <button
          type="button"
          onClick={onNavigateClasses}
          className="flex items-center gap-1.5 group text-left cursor-pointer hover:opacity-85 transition-opacity min-w-0"
          title="Click để mở danh sách lớp học quản lý"
        >
          <div className="flex h-5 w-5 items-center justify-center rounded-md bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 shrink-0">
            <GraduationCap className="w-3.5 h-3.5" />
          </div>
          <h3 className="text-sm font-medium text-foreground/90 group-hover:text-primary transition-colors truncate flex items-center gap-1">
            <span>Lớp học quản lý</span>
            <ArrowUpRight className="w-3 h-3 text-muted-foreground group-hover:text-primary transition-colors shrink-0" />
          </h3>
          <Badge variant="secondary" className="text-xs h-4.5 px-1.5 font-normal text-muted-foreground bg-muted/80 rounded-full shrink-0">
            {displayList.length}
          </Badge>
        </button>

        {/* Lọc dạng micro dropdown menu nhỏ gọn, không dùng native select to đùng */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              className="h-6 px-2 text-xs font-normal text-muted-foreground hover:text-foreground bg-muted/40 hover:bg-muted/70 border border-border/60 rounded-md flex items-center gap-1 transition-colors cursor-pointer select-none shrink-0"
              title="Lọc trạng thái lớp học"
            >
              <span>
                {filterMode === 'running'
                  ? 'Đang học'
                  : filterMode === 'upcoming'
                  ? 'Chờ mở'
                  : 'Tất cả'}
              </span>
              <ChevronDown className="w-3 h-3 opacity-60 shrink-0" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="min-w-[100px] p-1 rounded-lg shadow-md border-border/80">
            <DropdownMenuItem
              onClick={() => setFilterMode('running')}
              className="text-xs py-1.5 px-2 flex items-center justify-between cursor-pointer font-normal rounded text-muted-foreground hover:text-foreground"
            >
              <span>Đang học</span>
              {filterMode === 'running' && <Check className="w-3 h-3 text-primary ml-1 shrink-0" />}
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => setFilterMode('upcoming')}
              className="text-xs py-1.5 px-2 flex items-center justify-between cursor-pointer font-normal rounded text-muted-foreground hover:text-foreground"
            >
              <span>Chờ mở</span>
              {filterMode === 'upcoming' && <Check className="w-3 h-3 text-primary ml-1 shrink-0" />}
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => setFilterMode('all')}
              className="text-xs py-1.5 px-2 flex items-center justify-between cursor-pointer font-normal rounded text-muted-foreground hover:text-foreground"
            >
              <span>Tất cả</span>
              {filterMode === 'all' && <Check className="w-3 h-3 text-primary ml-1 shrink-0" />}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Thống kê giản lược tối đa: 1 dòng text siêu gọn, không đóng khung hộp to */}
      <div className="flex items-center gap-2 text-xs text-muted-foreground px-1 py-0.5 shrink-0">
        <span className="truncate">{runningClasses.length} đang học</span>
        <span className="text-border/80 shrink-0">•</span>
        <span className="truncate">{upcomingClasses.length} chờ mở</span>
        <span className="text-border/80 shrink-0">•</span>
        <span className="truncate">{totalStudents} học viên</span>
      </div>

      {/* Class list: Thêm viền cho từng lớp, thu hẹp padding */}
      {displayList.length === 0 ? (
        <EmptyState
          title="Không có lớp học nào"
          className="py-4 text-xs"
        />
      ) : (
        <div className="space-y-1.5 flex-1 min-h-0 overflow-y-auto pr-1 custom-scrollbar">
          {displayList.map((cls) => {
            const fillPct = Math.round((cls.enrolledStudents / cls.maxStudents) * 100)

            return (
              <div
                key={cls.id}
                onClick={() => onOpenClassDetail(cls)}
                className="group flex items-center justify-between gap-2 px-2.5 py-1.5 rounded-lg border border-border/70 bg-card/70 hover:bg-muted/50 hover:border-primary/50 transition-all cursor-pointer shadow-2xs text-xs"
              >
                {/* Left: Code, Name & Teacher */}
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <span className="font-medium text-sm text-foreground/90 group-hover:text-primary transition-colors truncate">
                      {cls.name}
                    </span>
                    <span className="text-xs font-mono text-muted-foreground px-1.5 py-0.5 bg-muted/70 rounded shrink-0">
                      {cls.code}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 mt-0.5 text-xs text-muted-foreground truncate">
                    <span className="truncate">{cls.teacher}</span>
                    <span>•</span>
                    <span className="shrink-0">P.{cls.room}</span>
                  </div>
                </div>

                {/* Right: Progress / Sĩ số */}
                <div className="shrink-0 text-right space-y-0.5">
                  <div className="text-xs font-medium tabular-nums text-muted-foreground">
                    {cls.enrolledStudents}/{cls.maxStudents} HV
                  </div>
                  <div className="w-14 bg-muted/80 rounded-full h-1.5 overflow-hidden">
                    <div
                      className={`h-1.5 rounded-full ${
                        fillPct >= 90
                          ? 'bg-rose-500'
                          : fillPct >= 70
                          ? 'bg-emerald-500'
                          : 'bg-primary'
                      }`}
                      style={{ width: `${Math.min(fillPct, 100)}%` }}
                    />
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
