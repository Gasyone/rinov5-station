'use client'

import { useState, useMemo } from 'react'
import { GraduationCap, Calculator, BookOpen, ChevronDown } from 'lucide-react'
import type { Student } from '@/mocks/students'
import type {
  StudentEnrolledClassTree,
  StudentClassSession,
  LeaveReservePackageItem,
} from './leaveReserveTypes'
import { LeaveReserveClassTreeview } from './LeaveReserveClassTreeview'
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu'
import { cn } from '@/lib/utils'

interface LeaveReserveOffFormProps {
  student?: Student
  packageOptions?: LeaveReservePackageItem[]
  activePackageTab: string
  onPackageTabChange: (tabId: string) => void
  classTrees: StudentEnrolledClassTree[]
  selectedSessionIds: Set<string>
  onToggleSession: (session: StudentClassSession) => void
  quotaStats: {
    pendingCount: number
    approvedCount: number
    totalQuota: number
    remainingQuota: number
  }
}

function getSubjectIcon(subject: string) {
  const s = subject.toLowerCase()
  if (s.includes('toán')) {
    return <Calculator className="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400 shrink-0" />
  }
  if (s.includes('anh')) {
    return <BookOpen className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
  }
  return <GraduationCap className="h-3.5 w-3.5 text-sky-600 dark:text-sky-400 shrink-0" />
}

export function LeaveReserveOffForm({
  packageOptions = [],
  activePackageTab,
  onPackageTabChange,
  classTrees,
  selectedSessionIds,
  onToggleSession,
  quotaStats,
}: LeaveReserveOffFormProps) {
  const selectedCount = selectedSessionIds.size

  // Track user-selected package from the dropdown to preserve slot 2
  const [userSelectedSlot2Id, setUserSelectedSlot2Id] = useState<string>('')

  // Visible packages: strictly 1 row, max 2 packages
  const visiblePackages = useMemo(() => {
    if (packageOptions.length <= 2) return packageOptions
    const p1 = packageOptions[0]

    // If activePackageTab is not the first package, show it in Slot 2
    const activePkg = packageOptions.find((p) => p.classCode === activePackageTab)
    if (activePkg && activePkg.id !== p1.id) {
      return [p1, activePkg]
    }

    // If user previously selected a valid package for Slot 2
    const userPkg = packageOptions.find((p) => p.id === userSelectedSlot2Id)
    if (userPkg && userPkg.id !== p1.id) {
      return [p1, userPkg]
    }

    // Default to second package
    return [p1, packageOptions[1]]
  }, [packageOptions, activePackageTab, userSelectedSlot2Id])

  // Remaining packages to be displayed in dropdown
  const otherPackages = useMemo(() => {
    if (packageOptions.length <= 2) return []
    const visibleIds = new Set(visiblePackages.map((p) => p.id))
    return packageOptions.filter((p) => !visibleIds.has(p.id))
  }, [packageOptions, visiblePackages])

  return (
    <div className="space-y-3 w-full">
      {/* 1. SECTION: Chọn gói học hiện tại (Strictly 1 single row, compact 2-line cards + Khác dropdown) */}
      {packageOptions.length > 1 && (
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="text-xs font-normal text-muted-foreground flex items-center gap-1.5">
              <GraduationCap className="h-3.5 w-3.5 text-sky-600" />
              <span>Gói học hiện tại</span>
              <span className="text-destructive">*</span>
            </label>
            <span className="text-[11px] text-muted-foreground font-normal">
              Học viên có {packageOptions.length} gói đang học
            </span>
          </div>

          {/* Strictly 1 single row, fixed width cards, extra space on the right */}
          <div className="flex items-center gap-2 w-full justify-start overflow-x-hidden">
            {visiblePackages.map((pkg) => {
              const isSelected = activePackageTab === pkg.classCode

              return (
                <button
                  key={pkg.id}
                  type="button"
                  onClick={() => onPackageTabChange(pkg.classCode)}
                  title={`${pkg.packageName} (${pkg.classCode})`}
                  className={cn(
                    'w-[205px] shrink-0 h-[46px] px-2.5 py-1 rounded-lg border flex flex-col justify-center gap-0.5 transition-all cursor-pointer select-none text-left',
                    isSelected
                      ? 'bg-sky-50/80 border-sky-400 text-sky-950 dark:bg-sky-950/50 dark:border-sky-700 dark:text-sky-100 shadow-2xs ring-1 ring-sky-400/40'
                      : 'bg-card border-border/70 hover:bg-muted/40 text-muted-foreground hover:text-foreground'
                  )}
                >
                  {/* Line 1: Icon + Tên gói + xx/xxb */}
                  <div className="flex items-center justify-between w-full gap-1 min-w-0">
                    <div className="flex items-center gap-1.5 min-w-0">
                      {getSubjectIcon(pkg.subject)}
                      <span className="text-xs font-semibold truncate text-foreground">
                        Gói {pkg.subject}
                      </span>
                    </div>
                    <span className="font-mono text-[11px] text-emerald-600 dark:text-emerald-400 font-medium shrink-0 whitespace-nowrap">
                      {pkg.remainingSessions}/{pkg.totalSessions}b
                    </span>
                  </div>

                  {/* Line 2: Mã lớp • Tên lớp */}
                  <div className="text-[11px] text-muted-foreground truncate w-full">
                    {pkg.classCode} • {pkg.className}
                  </div>
                </button>
              )
            })}

            {/* Dropdown for other packages if > 2 */}
            {otherPackages.length > 0 && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    type="button"
                    className="shrink-0 h-[46px] px-2.5 rounded-lg border border-border/70 bg-card hover:bg-muted/40 text-muted-foreground hover:text-foreground text-xs flex items-center justify-center gap-1 transition-all cursor-pointer select-none"
                  >
                    <span className="font-medium whitespace-nowrap">
                      Khác (+{otherPackages.length})
                    </span>
                    <ChevronDown className="h-3.5 w-3.5 opacity-70 shrink-0" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-72 p-1.5 space-y-1">
                  <div className="px-2 py-1 text-[11px] font-medium text-muted-foreground border-b border-border/50 pb-1 mb-1">
                    Các gói học khác ({otherPackages.length})
                  </div>
                  {otherPackages.map((pkg) => (
                    <DropdownMenuItem
                      key={pkg.id}
                      onSelect={() => {
                        setUserSelectedSlot2Id(pkg.id)
                        onPackageTabChange(pkg.classCode)
                      }}
                      className="flex flex-col items-start gap-0.5 p-2 rounded-md cursor-pointer text-left"
                    >
                      <div className="flex items-center justify-between w-full gap-1">
                        <div className="flex items-center gap-1.5 min-w-0">
                          {getSubjectIcon(pkg.subject)}
                          <span className="text-xs font-semibold truncate text-foreground">
                            Gói {pkg.subject}
                          </span>
                        </div>
                        <span className="font-mono text-[11px] text-emerald-600 dark:text-emerald-400 font-medium shrink-0 whitespace-nowrap">
                          {pkg.remainingSessions}/{pkg.totalSessions}b
                        </span>
                      </div>
                      <div className="text-[11px] text-muted-foreground truncate w-full pl-5">
                        {pkg.classCode} • {pkg.className}
                      </div>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>
      )}

      {/* 2. SECTION: Hạn mức vắng phép (Quota Stats Row) */}
      <div className="grid grid-cols-3 gap-2 p-2.5 rounded-lg border border-border/80 bg-muted/30 text-center text-xs">
        <div>
          <span className="text-muted-foreground block text-[11px] font-normal">Chờ duyệt:</span>
          <span className="font-normal text-amber-600 dark:text-amber-400 font-mono text-xs">
            {quotaStats.pendingCount} buổi
          </span>
        </div>
        <div className="border-x border-border/60">
          <span className="text-muted-foreground block text-[11px] font-normal">Đã duyệt:</span>
          <span className="font-normal text-emerald-600 dark:text-emerald-400 font-mono text-xs">
            {quotaStats.approvedCount} buổi
          </span>
        </div>
        <div>
          <span className="text-muted-foreground block text-[11px] font-normal">Quota còn lại:</span>
          <span className="font-normal text-sky-600 dark:text-sky-400 font-mono text-xs">
            {quotaStats.remainingQuota} buổi
          </span>
        </div>
      </div>

      {/* 3. SECTION: Cây phân cấp Lớp học & Buổi học sắp tới */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <label className="text-xs font-normal text-muted-foreground">
            Lớp đang học & chọn buổi xin nghỉ <span className="text-destructive">*</span>
          </label>
          {selectedCount > 0 && (
            <span className="text-xs font-normal text-sky-700 dark:text-sky-300">
              Đang chọn: {selectedCount} buổi
            </span>
          )}
        </div>

        <LeaveReserveClassTreeview
          classTrees={classTrees}
          selectedSessionIds={selectedSessionIds}
          onToggleSession={onToggleSession}
        />
      </div>
    </div>
  )
}
