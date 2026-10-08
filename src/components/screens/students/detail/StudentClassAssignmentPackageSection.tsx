'use client'

import React, { useMemo } from 'react'
import { MapPin, CalendarClock } from 'lucide-react'
import { derivePackageTypeInfo } from './studentClassAssignmentHelpers'

interface StudentClassAssignmentPackageSectionProps {
  packageName: string
  pkgRemainingSessions: number
  pkgTotalSessions?: number
  pkgStudiedSessions?: number
  studentBranch: string
  packageType?: string
  studentSubject?: string
  studentLevel?: string
}

export function StudentClassAssignmentPackageSection({
  packageName,
  pkgRemainingSessions,
  pkgTotalSessions,
  pkgStudiedSessions,
  studentBranch,
  packageType,
  studentSubject,
  studentLevel,
}: StudentClassAssignmentPackageSectionProps) {
  // Derive package type string: Môn • Loại lớp • Loại giáo viên
  const resolvedPackageType = useMemo(() => {
    if (packageType) return packageType
    return derivePackageTypeInfo(packageName, studentSubject, studentLevel)
  }, [packageName, packageType, studentSubject, studentLevel])

  const total = pkgTotalSessions ?? (pkgRemainingSessions > 0 ? pkgRemainingSessions + 32 : 48)
  const studied = pkgStudiedSessions ?? Math.max(0, total - pkgRemainingSessions)

  return (
    <div className="rounded-lg border border-border/60 bg-muted/20 px-3 py-2 shadow-2xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 sm:gap-3">
        {/* Bên trái: Tên gói học + Data Loại gói học */}
        <div className="min-w-0 flex-1">
          <div className="truncate text-xs font-medium text-foreground" title={packageName}>
            {packageName}
          </div>
          <div className="text-[11px] text-muted-foreground truncate font-normal">
            {resolvedPackageType}
          </div>
        </div>

        {/* Bên phải: Số buổi & Cơ sở gọn nhẹ cùng hàng */}
        <div className="flex items-center gap-2.5 shrink-0 text-xs sm:self-center">
          {/* Số buổi */}
          <div className="flex items-center gap-1">
            <CalendarClock className="h-3 w-3 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span className="font-normal text-emerald-600 dark:text-emerald-400 tabular-nums text-xs">
              {studied}/{total} buổi
            </span>
            <span className="text-[11px] text-muted-foreground font-normal">
              (còn {pkgRemainingSessions})
            </span>
          </div>

          <span className="text-border hidden sm:inline">•</span>

          {/* Cơ sở */}
          <div className="flex items-center gap-1 text-[11px] text-muted-foreground">
            <MapPin className="h-3 w-3 text-muted-foreground shrink-0" />
            <span className="text-foreground/80 font-normal truncate max-w-[170px]" title={studentBranch}>
              {studentBranch}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
