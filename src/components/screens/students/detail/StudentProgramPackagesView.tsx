'use client'

import { useState } from 'react'
import {
  Layers,
  History,
  ChevronDown,
  CheckCircle2,
  User,
  MapPin,
  Clock,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { StatusBadge } from '@/components/shared'
import type { StudentProgram } from './studentDetailTypes'
import { StudentProgramPackageCard } from './StudentProgramPackageCard'

export interface StudentProgramPackagesViewProps {
  program: StudentProgram
  studentName: string
  studentCode: string
  studentBranch: string
  studentLevel?: string
  onOpenAssignClass: (packageId: string) => void
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
  const [isHistoryExpanded, setIsHistoryExpanded] = useState(false)

  // Active / current packages (remaining sessions > 0 or active status)
  const activePackages = program.packages.filter(
    (p) => p.status !== 'transferred' && p.status !== 'cancelled' && (p.remainingSessions > 0 || p.status === 'active')
  )

  // Ended / historical packages
  const historicalPackages = program.packages.filter(
    (p) => p.status === 'transferred' || p.status === 'cancelled' || p.remainingSessions === 0
  )

  const totalSessions = program.totalSessions || activePackages.reduce((acc, p) => acc + p.totalSessions, 0)
  const remainingSessions = program.remainingSessions ?? activePackages.reduce((acc, p) => acc + p.remainingSessions, 0)
  const studiedSessions = Math.max(0, totalSessions - remainingSessions)
  const overallPercent = totalSessions > 0 ? Math.round((studiedSessions / totalSessions) * 100) : 0

  return (
    <div className="w-full space-y-4 pt-1">
      {/* 1. Thanh tóm tắt Chương trình & Quota tổng */}
      <div className="rounded-xl border border-primary/20 bg-gradient-to-r from-primary/5 via-primary/2 to-transparent p-3.5 space-y-2.5 shadow-3xs">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-primary/10 text-primary">
              <Layers className="h-4 w-4" />
            </span>
            <div>
              <div className="flex items-center gap-2">
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

      {/* 2. Danh sách các Gói học của chương trình */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-foreground uppercase tracking-wider">
              Danh sách Gói học ({activePackages.length})
            </span>
          </div>
          <span className="text-[11px] text-muted-foreground">
            Quản lý gói & phân bổ lớp ghép trực tiếp
          </span>
        </div>

        {activePackages.map((pkg) => {
          // Link with program's current class if matching or fallback
          const matchingClass = pkg.linkedClassCode === program.currentClass?.classCode
            ? program.currentClass
            : null

          return (
            <StudentProgramPackageCard
              key={pkg.id}
              packageItem={pkg}
              studentName={studentName}
              studentCode={studentCode}
              studentBranch={studentBranch}
              studentLevel={studentLevel}
              enrolledClass={matchingClass}
              onOpenAssignClass={onOpenAssignClass}
              onLeaveClass={onLeaveClass}
              onReservePackage={onReservePackage}
              onDropClass={onDropClass}
            />
          )
        })}
      </div>

      {/* 3. Khối Lịch sử: Các gói đã hoàn thành & Lớp học trước đó (Collapsible) */}
      {(historicalPackages.length > 0 || program.pastClasses.length > 0) && (
        <div className="rounded-xl border border-border/70 bg-card overflow-hidden">
          <button
            type="button"
            onClick={() => setIsHistoryExpanded((prev) => !prev)}
            className="w-full flex items-center justify-between p-3.5 text-xs font-bold text-muted-foreground hover:text-foreground hover:bg-muted/40 transition-colors cursor-pointer select-none"
          >
            <div className="flex items-center gap-2">
              <History className="h-4 w-4 text-primary" />
              <span>Lịch sử các gói & lớp học trước đó</span>
              <span className="px-1.5 py-0.2 rounded-full text-[10.5px] font-semibold bg-muted text-muted-foreground">
                {historicalPackages.length + program.pastClasses.length}
              </span>
            </div>
            <ChevronDown className={cn("h-4 w-4 transition-transform duration-200", isHistoryExpanded && "rotate-180")} />
          </button>

          {isHistoryExpanded && (
            <div className="p-3.5 pt-0 space-y-3 border-t border-border/40 divide-y divide-border/40 animate-in fade-in duration-200">
              {/* Lớp cũ */}
              {program.pastClasses.map((cls, idx) => (
                <div key={cls.classCode || idx} className="pt-3 first:pt-1 space-y-2 text-xs">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-bold text-foreground text-sm">{cls.className}</span>
                      <span className="font-mono text-muted-foreground text-xs">({cls.classCode})</span>
                      <StatusBadge status="session_ended" label="Đã hoàn thành" className="text-[10px] py-0 px-2" />
                    </div>
                    <span className="text-muted-foreground">
                      Số buổi đã dùng: <strong className="text-foreground">{cls.usedSessions || 24}/{cls.totalSessions || 24} buổi</strong>
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-muted-foreground text-[11.5px]">
                    <div className="flex items-center gap-2">
                      <Clock className="h-3.5 w-3.5 shrink-0" />
                      <span>{cls.scheduleSlots?.map((s) => `${s.dayOfWeek} ${s.startTime}-${s.endTime}`).join(' • ') || 'Thứ 2 & Thứ 5 (17:30 - 19:00)'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <User className="h-3.5 w-3.5 shrink-0" />
                      <span>GV: {cls.teacherName || 'GV_HuiLT20'}</span>
                      <span>•</span>
                      <MapPin className="h-3.5 w-3.5 shrink-0" />
                      <span>{cls.room || 'Phòng B201'}</span>
                    </div>
                  </div>

                  {cls.finalOutcome && (
                    <div className="rounded-md bg-muted/40 p-2 text-[11px] text-muted-foreground space-y-0.5">
                      <div className="flex items-center gap-1.5 text-emerald-700 dark:text-emerald-400 font-semibold">
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        <span>Kết quả: {cls.finalOutcome}</span>
                      </div>
                      {cls.teacherFinalFeedback && (
                        <p className="italic pl-5">&ldquo;{cls.teacherFinalFeedback}&rdquo;</p>
                      )}
                    </div>
                  )}
                </div>
              ))}

              {/* Gói cũ */}
              {historicalPackages.map((hp) => (
                <div key={hp.id} className="pt-3 space-y-1 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-foreground">{hp.packageName}</span>
                    <span className="font-mono text-muted-foreground text-[11px]">{hp.id}</span>
                  </div>
                  <div className="flex items-center justify-between text-muted-foreground text-[11.5px]">
                    <span>Tổng số: {hp.totalSessions} buổi</span>
                    <span>Còn lại: {hp.remainingSessions} buổi</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
