'use client'

import React, { useState, useMemo } from 'react'
import {
  ChevronDown,
  ChevronUp,
  BookOpen,
  GraduationCap,
  History,
  Headphones,
} from 'lucide-react'
import { toast } from 'sonner'
import {
  PersonnelHoverCard,
  StatusBadge,
  HistoricalPackagesPopover,
  type PersonnelItem,
  type HistoricalPackageItem,
} from '@/components/shared'
import { mockStudents } from '@/mocks/students'
import { ClassTeacherHistoryPopover } from './ClassTeacherHistoryPopover'
import { ClassCodeHoverCell } from './ClassCodeHoverCell'
import { StudentCareEarlyReturnDialog } from './StudentCareEarlyReturnDialog'
import { defaultCSStaffList } from './studentCareDetailTypes'
import { cn } from '@/lib/utils'

import {
  resolveStudentPlacementStatus,
  shouldShowClass3Columns,
  getPackageProgramName,
  getTabLine2Display,
  formatCompactSchedule,
} from './class-card/studentCareClassCardHelpers'
import { StudentCareClassStatusBanner } from './class-card/StudentCareClassStatusBanner'
import { StudentCareClassActionMenu } from './class-card/StudentCareClassActionMenu'
import { StudentCareClassExpandedInfo } from './class-card/StudentCareClassExpandedInfo'
import type { StudentCareActiveClassCardProps } from './class-card/studentCareClassCardTypes'

export type { StudentCareActiveClassCardProps }

export function StudentCareActiveClassCard({
  pkg,
  visiblePackages,
  selectedPackageId,
  setSelectedPackageId,
  currentBranchName,
  pkgIsEnglish,
  student,
  staffInfo,
  assignedCS,
  onOpenLeaveReserveDialog,
  onOpenEarlyReturnDialog,
  onCreateLeaveReserve,
}: StudentCareActiveClassCardProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [selectedCSName, setSelectedCSName] = useState<string | null>(null)
  const [isEarlyReturnOpen, setIsEarlyReturnOpen] = useState(false)

  // Reset selectedCSName khi chuyển học viên
  const [prevStudentId, setPrevStudentId] = useState<string | null>(student?.studentId || null)
  if (student && student.studentId !== prevStudentId) {
    setPrevStudentId(student.studentId)
    setSelectedCSName(null)
  }

  // Tra cứu dữ liệu gốc từ mockStudents để đồng bộ 100% với màn /app/class_placement
  const matchedMockStudent = useMemo(() => {
    if (!student) return null
    return (
      mockStudents.find(
        (s) =>
          s.id === student.studentId ||
          s.id === student.id ||
          s.name.toLowerCase() === student.studentName.toLowerCase()
      ) || null
    )
  }, [student])

  // Xác định chuẩn xác 1 trong 11 trạng thái học viên
  const placementStatus = useMemo(() => {
    return resolveStudentPlacementStatus(student, matchedMockStudent, pkg)
  }, [student, matchedMockStudent, pkg])

  const assignedTargetClass = student?.targetClass || student?.destinationClass || null

  const handleOpenPlacementTab = () => {
    toast.info(`Đang chuyển sang phân hệ Xếp lớp học viên cho ${student?.studentName || 'học viên'}...`)
    const targetUrl = student?.studentName
      ? `/app/class_placement?search=${encodeURIComponent(student.studentName)}`
      : '/app/class_placement'
    window.open(targetUrl, '_blank')
  }

  const effectiveCSName = selectedCSName || assignedCS || student?.csStaff || 'Trần Thị Mai'

  const currentCSObj = useMemo(() => {
    const matched = defaultCSStaffList.find((c) => c.name.toLowerCase() === effectiveCSName.toLowerCase())
    if (matched) return matched
    return {
      id: `cs-${effectiveCSName.replace(/\s+/g, '-').toLowerCase()}`,
      name: effectiveCSName,
      code: `EMP-CS-${String(Math.abs(effectiveCSName.split('').reduce((acc, ch) => acc + ch.charCodeAt(0), 0)) % 900 + 100)}`,
      role: 'Chuyên viên CSKH',
      phone: '0901 112 233',
      email: `${effectiveCSName.toLowerCase().replace(/[^a-z0-9]/g, '')}@rinoedu.vn`,
      avatar: `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(effectiveCSName)}`,
    }
  }, [effectiveCSName])

  const csPersonnelItem: PersonnelItem = useMemo(
    () => ({
      id: currentCSObj.code,
      name: currentCSObj.name,
      role: currentCSObj.role || 'Chuyên viên CSKH',
      phone: currentCSObj.phone || '0901 112 233',
      email: currentCSObj.email || 'mai.tt@rinoedu.vn',
      avatar: currentCSObj.avatar,
    }),
    [currentCSObj]
  )

  // Danh sách giáo viên của lớp - Đồng bộ 100% với cột Phụ trách GV ở danh sách ngoài
  const classTeachers = useMemo(() => {
    if (staffInfo?.teachers && staffInfo.teachers.length > 0) {
      return staffInfo.teachers
    }
    const rawTeacherCodes = [
      ...new Set([
        ...(student?.teacherCode ? student.teacherCode.split(/[,;\s/]+/).map((t) => t.trim()) : []),
        ...(student?.substituteTeacher ? student.substituteTeacher.split(/[,;\s/]+/).map((t) => t.trim()) : []),
      ]),
    ].filter((t) => t && t !== '-')

    if (rawTeacherCodes.length > 0) {
      return rawTeacherCodes.map((code, idx) => ({
        id: `t-${idx}-${code}`,
        name: code,
        role: code.toLowerCase().includes('sub') ? 'Trợ giảng (TA)' : 'Giáo viên Chủ nhiệm',
        phone: '0912 345 678',
        email: `${code.toLowerCase().replace(/[^a-z0-9]/g, '')}@rinoedu.vn`,
        avatar: `https://api.dicebear.com/7.x/adventurer/svg?seed=${code}`,
      }))
    }

    return []
  }, [staffInfo, student])

  const startDateDisplay = pkg.startDate
    ? (pkg.startDate.includes('-') ? pkg.startDate.split('-').reverse().join('/') : pkg.startDate)
    : '14/08/2024'
  const endDateDisplay = pkg.endDate || '14/08/2027'
  const totalSessions = pkg.totalSessions || 48
  const remainingSessions = pkg.remainingSessions ?? 30
  const attendedSessions = Math.max(0, totalSessions - remainingSessions)

  // Xác định trường hợp bảo lưu nhưng không thoát lớp (giữ lớp)
  const isHoldingClass = useMemo(() => {
    if (placementStatus !== 'reserve') return false
    if (student?.studentId === 's-baonam' || student?.id === 'bao-nam') return true
    if (student?.studentNote?.toLowerCase().includes('thoát lớp')) return false
    return Boolean(student?.classCode && student?.classCode !== '-')
  }, [placementStatus, student])

  // Kiểm tra hiển thị thông tin lớp (Mã lớp, Lịch học, Phụ trách, GV)
  const showClassInfo = shouldShowClass3Columns(placementStatus, isHoldingClass)

  const classCode = pkg.classCode || (pkgIsEnglish ? 'LD_TA_00019' : 'LD_TOAN_00010')

  // Phân loại gói: Gói còn hạn / đang học vs. Gói cũ / hết hạn
  const activePackages = useMemo(() => {
    const list = visiblePackages.filter(
      (p) => p.status === 'active' || (p.status !== 'expired' && (p.remainingSessions ?? 0) > 0)
    )
    return list.length > 0 ? list : visiblePackages.slice(0, 1)
  }, [visiblePackages])

  const expiredPackages = useMemo(() => {
    return visiblePackages.filter(
      (p) => p.status === 'expired' || (p.remainingSessions ?? 0) <= 0
    )
  }, [visiblePackages])

  const historicalCareItems: HistoricalPackageItem[] = useMemo(() => {
    return expiredPackages.map((pkgItem) => ({
      id: pkgItem.id,
      programName: getPackageProgramName(pkgItem),
      packageName: pkgItem.packageName,
      statusLabel: pkgItem.remainingSessions === 0 ? 'Hết buổi' : 'Hết hạn',
    }))
  }, [expiredPackages])

  return (
    <div className="bg-card dark:bg-zinc-900 border border-border/70 rounded-xl p-2 sm:p-2.5 pb-2.5 sm:pb-3 shadow-2xs space-y-1.5 select-none text-left relative mb-3">
      {/* Header bar: Tab Gói học theo Chương trình + Tab Khác (Gói cũ) + Menu Thao tác */}
      <div className="-mx-2 -mt-2 sm:-mx-2.5 sm:-mt-2.5 rounded-t-xl p-1 px-2 sm:px-2.5 bg-muted/30 dark:bg-zinc-800/40 border-b border-border/50 flex items-center justify-between gap-1.5 flex-nowrap mb-1">
        <div className="flex-1 min-w-0 flex items-center gap-1.5 overflow-x-auto no-scrollbar scroll-smooth py-0.5">
          {/* 1. Các gói còn hạn / đang xem: Dòng 1 là Tên gói, Dòng 2: Chờ ghép lớp -> Trạng thái gói, Đã kết thúc -> Mã lớp cũ, Đang học -> Mã lớp */}
          {activePackages.map((pItem) => {
            const isSelected = pItem.id === selectedPackageId
            const displayPackageName = pItem.packageName
            const line2Info = getTabLine2Display(pItem, student, matchedMockStudent)

            return (
              <button
                key={pItem.id}
                type="button"
                onClick={() => {
                  setSelectedPackageId(pItem.id)
                  toast.success(`Đang xem gói: ${displayPackageName}`)
                }}
                className={cn(
                  'shrink-0 relative flex flex-col items-start justify-center rounded-lg px-2 py-0.5 text-left transition-all cursor-pointer shadow-3xs h-[34px] min-w-[92px] max-w-[128px]',
                  isSelected
                    ? 'border border-sky-300 dark:border-sky-700 bg-sky-50/80 dark:bg-sky-950/40 text-foreground'
                    : 'border border-border/80 bg-background text-muted-foreground hover:bg-muted/40 hover:text-foreground'
                )}
                title={`${displayPackageName} - ${line2Info.isStatus ? `Trạng thái: ${line2Info.text}` : `Mã lớp: ${line2Info.text}`}`}
              >
                <span className="text-[10.5px] font-semibold text-foreground truncate w-full leading-tight">
                  {displayPackageName}
                </span>
                <span
                  className={cn(
                    'font-mono text-[9px] leading-tight pt-0.5 truncate w-full',
                    isSelected
                      ? 'text-sky-600 dark:text-sky-400 font-medium'
                      : line2Info.isStatus
                        ? 'text-amber-600 dark:text-amber-400 font-normal'
                        : 'text-muted-foreground font-normal'
                  )}
                  title={line2Info.text}
                >
                  {line2Info.text}
                </span>
              </button>
            )
          })}

          {/* 2. Tab Khác: Chứa các gói cũ, hết hạn (đồng bộ với màn xếp lớp dùng chung HistoricalPackagesPopover) */}
          {historicalCareItems.length > 0 && (
            <HistoricalPackagesPopover
              items={historicalCareItems}
              selectedId={selectedPackageId}
              onSelect={(item) => {
                setSelectedPackageId(item.id)
                toast.success(`Đã chọn xem gói cũ: ${item.packageName}`)
              }}
            />
          )}
        </div>

          <div className="shrink-0 flex items-center ml-1.5">
            {/* Menu Action Lớp học theo 11 trạng thái học viên */}
            <StudentCareClassActionMenu
              placementStatus={placementStatus}
              onOpenPlacementTab={handleOpenPlacementTab}
              onCreateLeaveReserve={onCreateLeaveReserve}
              onOpenEarlyReturnDialog={() => {
                if (onOpenEarlyReturnDialog) {
                  onOpenEarlyReturnDialog()
                } else {
                  setIsEarlyReturnOpen(true)
                }
              }}
              onOpenLeaveReserveDialog={onOpenLeaveReserveDialog}
            />
          </div>
      </div>

      {/* Cụm Banner / Thông tin trạng thái đặc thù */}
      <StudentCareClassStatusBanner
        placementStatus={placementStatus}
        student={student}
        mockStudent={matchedMockStudent}
        pkg={pkg}
        pkgIsEnglish={pkgIsEnglish}
        classCode={classCode}
        assignedTargetClass={assignedTargetClass}
        isHoldingClass={isHoldingClass}
        onOpenLeaveReserveDialog={onOpenLeaveReserveDialog}
        onOpenEarlyReturnDialog={() => {
          if (onOpenEarlyReturnDialog) {
            onOpenEarlyReturnDialog()
          } else {
            setIsEarlyReturnOpen(true)
          }
        }}
        onOpenPlacementTab={handleOpenPlacementTab}
      />

      {/* THÔNG TIN HIỂN THỊ CHÍNH (2 Cột: Cột 1 gồm Mã lớp & Lịch học, Cột 2 gồm Giáo viên) */}
      {showClassInfo && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4 text-left items-start pt-0.5">
          {/* Cột 1: Mã lớp (ở trên, bỏ nhãn 'Mã lớp', bỏ nhãn 'Đang học') & Lịch học (ở dưới, bỏ nhãn 'Lịch học') */}
          <div className="space-y-0.5 min-w-0">
            {/* Dòng 1: Mã lớp */}
            <div className="flex items-center gap-1.5 text-xs font-medium text-foreground flex-wrap">
              <BookOpen className="h-3.5 w-3.5 text-muted-foreground/80 shrink-0" />
              <ClassCodeHoverCell
                classCode={classCode}
                subject={pkgIsEnglish ? 'Tiếng Anh' : 'Toán tư duy'}
                level={pkg.level || student?.level || 'Level 4'}
                subLevel={pkg.subLevel || student?.subLevel}
                teacherCode={pkg.teacherCode || 'GV'}
                schedule={pkg.schedule || 'Thứ 2, 6 (17:30 - 19:00)'}
              />
              {placementStatus === 'draft_class' && (
                <StatusBadge status="draft_class" label="Lớp nháp" className="text-[9.5px] py-0 px-1.5" />
              )}
              {placementStatus === 'awaiting_opening' && (
                <StatusBadge status="awaiting_opening" label="Chờ khai giảng" className="text-[9.5px] py-0 px-1.5" />
              )}
              {placementStatus === 'trial' && (
                <StatusBadge status="trial" label="Học thử" className="text-[9.5px] py-0 px-1.5" />
              )}
              {placementStatus === 'session_ended' && (
                <StatusBadge status="expired" label="Hết buổi (Lớp cũ)" className="text-[9.5px] py-0 px-1.5" />
              )}
              {isHoldingClass && (
                <StatusBadge status="reserve" label="Bảo lưu (Giữ lớp)" className="text-[9.5px] py-0 px-1.5" />
              )}
            </div>

            {/* Dòng 2: Lịch học (dòng phụ thu gọn, bỏ icon, bỏ in đậm, giảm cỡ chữ, thẳng hàng với mã lớp) */}
            <div
              className="pl-5 text-[10.5px] font-normal text-muted-foreground truncate leading-tight"
              title={pkg.schedule || 'Thứ 2, 6 (17:30 - 19:00)'}
            >
              {formatCompactSchedule(pkg.schedule || 'Thứ 2, 6 (17:30 - 19:00)')}
            </div>
          </div>

          {/* Cột 2: Phụ trách CS (Dòng 1, bỏ icon đổi) & Giáo viên (Dòng 2) */}
          <div className="space-y-0.5 min-w-0">
            {/* Dòng 1: Phụ trách CS (đưa lên trên GV, bỏ icon đổi, text thường không in đậm) */}
            <div className="flex items-center gap-1.5 text-xs font-normal text-foreground flex-wrap">
              <Headphones className="h-3.5 w-3.5 text-muted-foreground/80 shrink-0" />
              <PersonnelHoverCard person={csPersonnelItem}>
                <span className="hover:underline cursor-pointer font-normal text-foreground truncate">
                  {currentCSObj.name}
                </span>
              </PersonnelHoverCard>
            </div>

            {/* Dòng 2: Giáo viên (text thường không in đậm) */}
            <div className="flex items-center gap-1.5 min-w-0 text-xs font-normal text-foreground flex-wrap">
              <GraduationCap className="h-3.5 w-3.5 text-muted-foreground/80 shrink-0" />
              <div className="flex items-center gap-1.5 flex-wrap min-w-0 flex-1">
                {classTeachers.length > 0 ? (
                  classTeachers.map((teacher, idx) => {
                    const displayTeacherName = teacher.name.startsWith('GV_') ? teacher.name : teacher.name.replace(/^GV\s+/i, '')
                    return (
                      <React.Fragment key={teacher.id}>
                        <PersonnelHoverCard person={{ ...teacher, name: displayTeacherName }}>
                          <span className="text-foreground font-normal hover:underline cursor-pointer">
                            {displayTeacherName}
                          </span>
                        </PersonnelHoverCard>
                        {idx < classTeachers.length - 1 && <span className="text-muted-foreground">,</span>}
                      </React.Fragment>
                    )
                  })
                ) : (
                  <span className="text-muted-foreground font-normal">Chưa phân công</span>
                )}
                <ClassTeacherHistoryPopover
                  trigger={
                    <button
                      type="button"
                      className="inline-flex items-center gap-0.5 text-xs text-amber-600 dark:text-amber-400 hover:text-amber-700 dark:hover:text-amber-300 font-medium cursor-pointer transition-colors ml-0.5"
                      title="Lịch sử đổi giáo viên (3)"
                    >
                      <History className="h-3 w-3 text-amber-500" />
                      <span className="text-xs font-semibold">(3)</span>
                    </button>
                  }
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Phần thông tin mở rộng bên dưới (Thông tin gói học & Cơ sở) */}
      {isExpanded && (
        <StudentCareClassExpandedInfo
          currentBranchName={currentBranchName}
          attendedSessions={attendedSessions}
          totalSessions={totalSessions}
          startDateDisplay={startDateDisplay}
          endDateDisplay={endDateDisplay}
          pkg={pkg}
          pkgIsEnglish={pkgIsEnglish}
        />
      )}

      {/* Nút Mở rộng / Thu gọn ở cạnh cuối (Giữa) của đường line section gói học */}
      <div className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 z-10">
        <button
          type="button"
          onClick={() => setIsExpanded((prev) => !prev)}
          className="inline-flex items-center gap-1 px-2.5 py-0.5 text-[10.5px] font-normal text-muted-foreground hover:text-foreground bg-card dark:bg-zinc-900 hover:bg-muted/80 border border-border/80 hover:border-border rounded-full shadow-3xs transition-all cursor-pointer select-none active:scale-95"
          title={isExpanded ? 'Thu gọn chi tiết gói học' : 'Mở rộng chi tiết gói học'}
        >
          <span className="font-normal">{isExpanded ? 'Thu gọn' : 'Mở rộng'}</span>
          {isExpanded ? (
            <ChevronUp className="h-3 w-3 shrink-0 text-muted-foreground stroke-[1.5]" />
          ) : (
            <ChevronDown className="h-3 w-3 shrink-0 text-muted-foreground stroke-[1.5]" />
          )}
        </button>
      </div>

      {/* Modal Đi học lại trước hạn */}
      <StudentCareEarlyReturnDialog
        open={isEarlyReturnOpen}
        onOpenChange={setIsEarlyReturnOpen}
        studentName={student?.studentName || 'Hoàng Bảo Nam'}
        studentCode={student?.customerCode || student?.studentId || 'HV-2024-0012'}
        studentId={student?.studentId}
        packageName={pkg.packageName || (pkgIsEnglish ? 'Gói Tiếng Anh IELTS Standard' : 'Toán Tư Duy STEM Rino')}
        className={pkg.className || (pkgIsEnglish ? 'IELTS Junior v2.1' : 'Toán tư duy Archimedes 5')}
        classCode={classCode}
        isHoldingClass={isHoldingClass}
        expectedReturnDate={isHoldingClass ? '16/09/2026' : '01/08/2026'}
        reserveDuration={isHoldingClass ? '15/06/2026 ➔ 15/09/2026' : '01/06/2026 ➔ 31/07/2026'}
        remainingSessions={pkg.remainingSessions || 14}
        branchName={currentBranchName}
      />
    </div>
  )
}
