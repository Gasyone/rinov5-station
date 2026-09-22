'use client'

import { useMemo } from 'react'
import { Layers } from 'lucide-react'
import type { StudentProgram, StudentPackage } from './studentDetailTypes'
import { StudentDetailAcademicColumn } from './StudentDetailAcademicColumn'
import { StudentDetailPackageWalletColumn } from './StudentDetailPackageWalletColumn'

export interface StudentProgramPackagesViewProps {
  program: StudentProgram
  studentName: string
  studentCode: string
  studentBranch: string
  studentLevel?: string
  onOpenAssignClass: (packageId?: string) => void
  onLeaveClass?: () => void
  onReservePackage?: (packageId: string) => void
  onDropClass?: (classCode: string) => void
}

export function StudentProgramPackagesView({
  program,
  studentName,
  studentCode,
  studentBranch,
  studentLevel,
  onOpenAssignClass,
  onLeaveClass,
  onReservePackage,
  onDropClass,
}: StudentProgramPackagesViewProps) {
  // Active / current packages (remaining sessions > 0 or active status)
  const activePackages = useMemo(() => {
    return program.packages.filter(
      (p) => p.status !== 'transferred' && p.status !== 'cancelled' && (p.remainingSessions > 0 || p.status === 'active')
    )
  }, [program.packages])

  // Ended / historical packages
  const historicalPackages = useMemo(() => {
    return program.packages.filter(
      (p) => p.status === 'transferred' || p.status === 'cancelled' || p.remainingSessions === 0
    )
  }, [program.packages])

  // Determine Deducting Package (Active in-use) vs Queued (Next in line)
  const { activeDeductingPackage, nextQueuedPackage, otherActivePackages } = useMemo(() => {
    if (activePackages.length === 0) {
      return { activeDeductingPackage: null, nextQueuedPackage: null, otherActivePackages: [] }
    }

    // Prioritize package linked to current class or first package with remaining sessions
    const activePkg: StudentPackage | null =
      activePackages.find((p) => p.linkedClassCode && p.linkedClassCode === program.currentClass?.classCode && p.remainingSessions > 0) ||
      activePackages.find((p) => p.remainingSessions > 0) ||
      activePackages[0]

    const remaining = activePackages.filter((p) => p.id !== activePkg.id)
    const nextPkg: StudentPackage | null = remaining.find((p) => p.remainingSessions > 0) || null
    const others = remaining.filter((p) => p.id !== nextPkg?.id)

    return {
      activeDeductingPackage: activePkg,
      nextQueuedPackage: nextPkg,
      otherActivePackages: others,
    }
  }, [activePackages, program.currentClass])

  const totalSessions = program.totalSessions || activePackages.reduce((acc, p) => acc + p.totalSessions, 0)
  const remainingSessions = program.remainingSessions ?? activePackages.reduce((acc, p) => acc + p.remainingSessions, 0)
  const studiedSessions = Math.max(0, totalSessions - remainingSessions)
  const overallPercent = totalSessions > 0 ? Math.round((studiedSessions / totalSessions) * 100) : 0

  return (
    <div className="w-full space-y-3.5 pt-0.5">
      {/* ── 1. THANH TÓM TẮT CHƯƠNG TRÌNH & TRÌNH ĐỘ ── */}
      <div className="rounded-xl border border-primary/20 bg-gradient-to-r from-primary/5 via-primary/2 to-transparent p-3 space-y-2 shadow-3xs">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-primary/10 text-primary">
              <Layers className="h-4 w-4" />
            </span>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-bold text-foreground uppercase tracking-wide">
                  Chương trình {program.name}
                </span>
                <span className="text-xs text-muted-foreground">
                  • {activePackages.length} gói học đang áp dụng
                </span>
              </div>
              <div className="text-[11px] text-muted-foreground">
                Trình độ: <strong className="text-foreground font-semibold">{program.level || studentLevel || 'Tiêu chuẩn'}</strong>
                {program.subLevel && ` (${program.subLevel})`}
              </div>
            </div>
          </div>

          {/* Quota tổng chương trình */}
          <div className="flex items-center gap-4 text-xs font-semibold shrink-0">
            <div>
              <span className="text-muted-foreground font-normal">Tổng buổi: </span>
              <strong className="text-foreground font-bold">{totalSessions}</strong>
            </div>
            <div>
              <span className="text-muted-foreground font-normal">Đã học: </span>
              <strong className="text-primary font-bold">{studiedSessions}</strong>
            </div>
            <div>
              <span className="text-muted-foreground font-normal">Còn lại: </span>
              <strong className="text-emerald-600 dark:text-emerald-400 font-bold">{remainingSessions}</strong>
            </div>
            <div className="pl-1 font-mono text-muted-foreground">
              {overallPercent}%
            </div>
          </div>
        </div>
      </div>

      {/* ── 2. KHÔNG GIAN TÁC VỤ 2 CỘT SONG SONG (SIDE-BY-SIDE) ── */}
      <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] xl:grid-cols-[1.15fr_0.85fr] gap-3.5 items-start">
        {/* CỘT TRÁI: THÔNG TIN HỌC TẬP (Lớp hiện tại, Quota sourcing, Thao tác, Timeline lớp cũ) */}
        <StudentDetailAcademicColumn
          program={program}
          studentName={studentName}
          studentCode={studentCode}
          studentBranch={studentBranch}
          studentLevel={program.level || studentLevel}
          activeDeductingPackage={activeDeductingPackage}
          nextQueuedPackage={nextQueuedPackage}
          onOpenAssignClass={onOpenAssignClass}
          onLeaveClass={onLeaveClass}
          onReserveClass={() => onReservePackage?.(activeDeductingPackage?.id || program.packages[0]?.id || '')}
          onDropClass={onDropClass}
        />

        {/* CỘT PHẢI: VÍ GÓI HỌC & QUOTA SỐ BUỔI (KHÔNG CÓ GIÁ TIỀN VNĐ) */}
        <StudentDetailPackageWalletColumn
          program={program}
          activeDeductingPackage={activeDeductingPackage}
          nextQueuedPackage={nextQueuedPackage}
          otherActivePackages={otherActivePackages}
          historicalPackages={historicalPackages}
          onReservePackage={onReservePackage}
          onOpenAssignClass={onOpenAssignClass}
        />
      </div>
    </div>
  )
}
