'use client'

import React from 'react'
import {
  ChevronDown,
  ChevronUp,
  History,
} from 'lucide-react'
import { SyllabusProfileHoverCard } from '@/components/screens/classes/SyllabusProfileHoverCard'
import { ClassTeacherHistoryPopover } from './ClassTeacherHistoryPopover'
import { PersonnelHoverCard } from '@/components/shared'
import type { ClassRecord } from '@/mocks/classRecords'
import { type SimulatedPackage } from './studentCareDetailTypes'
import { cn } from '@/lib/utils'

interface StudentCareActiveClassCardProps {
  pkg: SimulatedPackage
  visiblePackages: SimulatedPackage[]
  selectedPackageId: string
  setSelectedPackageId: (id: string) => void
  otherPackages: SimulatedPackage[]
  showAllPrograms: boolean
  setShowAllPrograms: (show: boolean) => void
  isClassInfoExpanded: boolean
  setIsClassInfoExpanded: React.Dispatch<React.SetStateAction<boolean>>
  pkgIsEnglish: boolean
  staffInfo: {
    cs: {
      id: string
      name: string
      role: string
      phone?: string
      email?: string
      avatar: string
    }
    teachers: Array<{
      id: string
      name: string
      role: string
      phone?: string
      email?: string
      avatar: string
    }>
  }
  currentBranchName: string
}

export function StudentCareActiveClassCard({
  pkg,
  visiblePackages,
  selectedPackageId,
  setSelectedPackageId,
  otherPackages,
  showAllPrograms,
  setShowAllPrograms,
  isClassInfoExpanded,
  setIsClassInfoExpanded,
  pkgIsEnglish,
  staffInfo,
  currentBranchName,
}: StudentCareActiveClassCardProps) {
  const classRecordForHover: ClassRecord = {
    id: pkg.id,
    code: pkg.classCode || 'CLS-IELTS-001',
    name: pkg.className,
    level: pkgIsEnglish ? 'IELTS' : 'Toán tư duy',
    syllabus: pkgIsEnglish ? 'IELTS Junior v2.1' : 'Toán Tư Duy STEM Rino',
    learningPath: pkgIsEnglish ? 'IELTS Foundation ➔ Academic' : 'Rino Math Standard ➔ Advanced',
    subLevel: pkg.subLevel || (pkgIsEnglish ? '5.0–5.5' : 'Archimedes 5 - A'),
    branch: 'RinoEdu Linh Đàm',
    teacher: staffInfo?.teachers.map((t) => t.name.replace(/^GV\.?\s*/i, '')).join(', ') || 'Giáo viên',
    teacherPhone: '0901234567',
    room: 'P.102 (Tầng 1)',
    schedule: pkg.schedule || 'Thứ 2, 6 (17:30 - 19:00)',
    scheduleSlots: [
      { dayOfWeek: 'Thứ 2', date: '27/07', startTime: '17:30', endTime: '19:00' },
      { dayOfWeek: 'Thứ 6', date: '31/07', startTime: '17:30', endTime: '19:00' },
    ],
    startDate: '2026-05-01',
    endDate: pkg.endDate || '2027-05-13',
    maxStudents: 15,
    enrolledStudents: 12,
    status: 'dang_hoc',
    tuitionFee: 3000000,
  }

  return (
    <div className="bg-card dark:bg-zinc-900 border border-border/70 rounded-2xl p-3.5 sm:p-4 shadow-2xs space-y-3 select-none text-left overflow-hidden">
      {/* Row 1: Program Selector (Header bar with soft background tint) */}
      <div className="-mx-3.5 -mt-3.5 sm:-mx-4 sm:-mt-4 p-3 px-3.5 sm:px-4 bg-muted/40 dark:bg-zinc-800/50 border-b border-border/50 flex items-center justify-between gap-2 flex-wrap mb-3">
        <div className="flex items-center gap-1.5 min-w-0 flex-wrap">
          <span className="text-xs text-muted-foreground/70 dark:text-zinc-400/80 font-medium shrink-0">Lớp:</span>
          {visiblePackages.map((pItem) => {
            const isSelected = pItem.id === selectedPackageId
            const text = `${pItem.packageName} ${pItem.className} ${pItem.classCode}`
            const shortSubject = /tiếng\s*anh|english|LD_TA/i.test(text)
              ? 'Tiếng Anh'
              : /toán|math|LD_TOAN/i.test(text)
                ? 'Toán tư duy'
                : pItem.packageName.replace(/^Gói\s*/i, '').replace(/\s*Level.*$/i, '').trim() || 'Lớp học'
            const isPkgActive = pItem.status === 'active'
            return (
              <button
                key={pItem.id}
                type="button"
                onClick={() => setSelectedPackageId(pItem.id)}
                className={cn(
                  'h-[40px] px-3 py-1 text-xs rounded-lg transition-all flex flex-col justify-center items-center text-center cursor-pointer select-none border',
                  isSelected
                    ? 'bg-sky-600 text-white font-medium shadow-2xs border-sky-600'
                    : isPkgActive
                      ? 'bg-background dark:bg-zinc-800 text-foreground border-border/70 hover:bg-muted/60'
                      : 'bg-transparent text-muted-foreground border-border/40 hover:bg-muted/30'
                )}
              >
                <span className="font-semibold text-xs leading-none">
                  {shortSubject}
                </span>
                {pItem.classCode && (
                  <span
                    className={cn(
                      'text-[9.5px] font-mono tracking-tight leading-none mt-1',
                      isSelected
                        ? 'text-sky-100 opacity-90 font-normal'
                        : 'text-muted-foreground/80 font-normal'
                    )}
                  >
                    ({pItem.classCode})
                    {!isPkgActive && (
                      <span className="ml-0.5 opacity-70">
                        ({pItem.status === 'pending' ? 'Chờ' : 'Cũ'})
                      </span>
                    )}
                  </span>
                )}
              </button>
            )
          })}
          {otherPackages.length > 0 && (
            <button
              type="button"
              onClick={() => setShowAllPrograms(!showAllPrograms)}
              className="h-[40px] px-2.5 text-xs text-muted-foreground hover:text-foreground transition-all flex items-center gap-1 cursor-pointer rounded-lg border border-border/40 hover:bg-muted/40"
            >
              <span>{showAllPrograms ? 'Thu gọn' : `Khác (${otherPackages.length})`}</span>
              {showAllPrograms ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
            </button>
          )}
        </div>

        {/* Nút Thu gọn / Mở rộng đưa lên trên thanh tiêu đề */}
        <button
          type="button"
          onClick={() => setIsClassInfoExpanded((prev) => !prev)}
          className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground font-medium py-1.5 px-2.5 rounded-lg hover:bg-background/80 transition-colors cursor-pointer shrink-0 border border-border/50 bg-background/50 shadow-3xs"
          title={isClassInfoExpanded ? 'Thu gọn thông tin lớp' : 'Mở rộng xem thêm thông tin'}
        >
          <span>{isClassInfoExpanded ? 'Thu gọn' : 'Mở rộng'}</span>
          {isClassInfoExpanded ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
        </button>
      </div>

      {/* Row 1 thông tin chính (Title nhãn 1 dòng, Data xuống dòng dưới) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-left">
        {/* Cột 1: KCT & Trình độ */}
        <div className="space-y-0.5 min-w-0">
          <span className="text-xs text-muted-foreground/70 dark:text-zinc-400/80 font-medium block">
            KCT & Trình độ
          </span>
          <div className="flex items-center gap-1.5 text-xs text-foreground flex-wrap font-normal">
            <SyllabusProfileHoverCard cls={classRecordForHover}>
              <span className="hover:underline cursor-pointer font-medium text-foreground">
                {pkgIsEnglish ? 'IELTS Junior v2.1' : 'Toán Tư Duy STEM Rino'}
              </span>
            </SyllabusProfileHoverCard>
            <span className="text-border/80 font-normal">•</span>
            <span className="text-foreground font-medium">
              {pkg.level && pkg.subLevel ? (pkg.subLevel.includes(pkg.level) ? pkg.subLevel : `${pkg.level} - ${pkg.subLevel}`) : (pkg.subLevel || pkg.level || 'Level 4 - A')}
            </span>
          </div>
        </div>

        {/* Cột 2: Lịch học */}
        <div className="space-y-0.5 min-w-0">
          <span className="text-xs text-muted-foreground/70 dark:text-zinc-400/80 font-medium block">
            Lịch học
          </span>
          <p className="text-xs font-normal text-foreground truncate">
            {pkg.schedule || 'Thứ 2, 6 (17:30 - 19:00)'}
          </p>
        </div>

        {/* Cột 3: Giáo viên phụ trách */}
        <div className="space-y-0.5 min-w-0">
          <span className="text-xs text-muted-foreground/70 dark:text-zinc-400/80 font-medium block">
            Giáo viên phụ trách
          </span>
          <div className="flex items-center gap-1.5 text-xs font-normal text-foreground flex-wrap">
            {staffInfo && staffInfo.teachers.length > 0 ? (
              staffInfo.teachers.map((teacher, idx) => {
                const cleanedTeacherName = teacher.name.replace(/^GV\.?\s*/i, '')
                return (
                  <React.Fragment key={teacher.id}>
                    <PersonnelHoverCard person={{ ...teacher, name: cleanedTeacherName }}>
                      <span className="text-foreground font-medium hover:underline cursor-pointer">
                        {cleanedTeacherName}
                      </span>
                    </PersonnelHoverCard>
                    {idx < staffInfo.teachers.length - 1 && <span className="text-muted-foreground">,</span>}
                  </React.Fragment>
                )
              })
            ) : (
              <span className="text-muted-foreground font-normal">Chưa phân công</span>
            )}

            {/* Icon đổi GV màu cam nhạt & số (3) ngay sau tên giáo viên */}
            <ClassTeacherHistoryPopover
              trigger={
                <button
                  type="button"
                  className="inline-flex items-center gap-0.5 text-xs text-amber-500/90 dark:text-amber-400/90 hover:text-amber-600 font-medium cursor-pointer transition-colors ml-0.5"
                  title="Lịch sử đổi giáo viên (3)"
                >
                  <History className="h-3.5 w-3.5 text-amber-500/80" />
                  <span className="text-xs font-semibold text-amber-600/90 dark:text-amber-400/90">(3)</span>
                </button>
              }
            />
          </div>
        </div>
      </div>

      {/* Phần mở rộng: Cơ sở, Gói học, Ngày bắt đầu - Hạn học (Thiết kế giản lược, tối ưu) */}
      {isClassInfoExpanded && (
        <div className="pt-2.5 mt-2 border-t border-border/50 grid grid-cols-1 sm:grid-cols-3 gap-3 text-left animate-in fade-in-50 duration-200">
          {/* Group 1: Cơ sở */}
          <div className="space-y-0.5">
            <span className="text-xs text-muted-foreground/70 dark:text-zinc-400/80 font-medium block">Cơ sở</span>
            <span className="text-xs font-normal text-foreground block">{currentBranchName}</span>
          </div>

          {/* Group 2: Gói học */}
          <div className="space-y-0.5">
            <span className="text-xs text-muted-foreground/70 dark:text-zinc-400/80 font-medium block">Gói học</span>
            <span className="text-xs font-normal text-foreground block">{pkg.packageName}</span>
          </div>

          {/* Group 3: Ngày bắt đầu - Hạn học */}
          <div className="space-y-0.5">
            <span className="text-xs text-muted-foreground/70 dark:text-zinc-400/80 font-medium block">Ngày bắt đầu - Hạn học</span>
            <span className="text-xs font-normal text-foreground block">
              {pkg.startDate ? (pkg.startDate.includes('-') ? pkg.startDate.split('-').reverse().join('/') : pkg.startDate) : '01/05/2026'} - {pkg.endDate || '25/10/2026'}
            </span>
          </div>
        </div>
      )}
    </div>
  )
}
