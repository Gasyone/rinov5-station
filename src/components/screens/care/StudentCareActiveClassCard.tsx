'use client'

import React, { useState, useMemo } from 'react'
import {
  ChevronDown,
  ChevronUp,
  BookOpen,
  Calendar,
  GraduationCap,
  History,
  Headphones,
  ArrowLeftRight,
  Search,
  Check,
  Package,
} from 'lucide-react'
import { toast } from 'sonner'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { PersonnelHoverCard, StatusBadge, AppAvatar, type PersonnelItem } from '@/components/shared'
import { mockStudents } from '@/mocks/students'
import { ClassTeacherHistoryPopover } from './ClassTeacherHistoryPopover'
import { ClassCodeHoverCell } from './ClassCodeHoverCell'
import { StudentCareEarlyReturnDialog } from './StudentCareEarlyReturnDialog'
import { defaultCSStaffList, type CSStaffMember } from './studentCareDetailTypes'
import type { ClassRecord } from '@/mocks/classRecords'
import { cn } from '@/lib/utils'

import {
  resolveStudentPlacementStatus,
  shouldShowClass3Columns,
  getPackageProgramName,
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
  onAssignedCSChange,
  onOpenLeaveReserveDialog,
  onOpenEarlyReturnDialog,
  onCreateLeaveReserve,
  isRenewal = false,
}: StudentCareActiveClassCardProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [selectedCSName, setSelectedCSName] = useState<string | null>(null)
  const [isCsPopoverOpen, setIsCsPopoverOpen] = useState(false)
  const [csSearchQuery, setCsSearchQuery] = useState('')
  const [isEarlyReturnOpen, setIsEarlyReturnOpen] = useState(false)
  const [isOldPackagesPopoverOpen, setIsOldPackagesPopoverOpen] = useState(false)

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

  const filteredCsList = useMemo(() => {
    if (!csSearchQuery.trim()) return defaultCSStaffList
    const q = csSearchQuery.toLowerCase()
    return defaultCSStaffList.filter(
      (item) =>
        item.name.toLowerCase().includes(q) ||
        item.code.toLowerCase().includes(q) ||
        (item.role && item.role.toLowerCase().includes(q))
    )
  }, [csSearchQuery])

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

  const handleSelectCS = (staff: CSStaffMember) => {
    setSelectedCSName(staff.name)
    onAssignedCSChange?.(staff.name)
    setIsCsPopoverOpen(false)
    setCsSearchQuery('')
    toast.success(`Đã gán học viên cho nhân sự CS: ${staff.name}`)
  }

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

  // Kiểm tra hiển thị 3 cột thông tin lớp (Mã lớp, Lịch học, GV)
  const showClassInfo = shouldShowClass3Columns(placementStatus, isHoldingClass)

  const classRecordForHover: ClassRecord = {
    id: pkg.id,
    code: pkg.classCode || (pkgIsEnglish ? 'LD_TA_00019' : 'LD_TOAN_00010'),
    name: pkg.className,
    level: pkgIsEnglish ? 'IELTS' : 'Toán tư duy',
    syllabus: pkgIsEnglish ? 'IELTS Junior v2.1' : 'Toán Tư Duy STEM Rino',
    learningPath: pkgIsEnglish ? 'IELTS Foundation ➔ Academic' : 'Rino Math Standard ➔ Advanced',
    subLevel: pkg.subLevel || (pkgIsEnglish ? '5.0–5.5' : 'Archimedes 5 - A'),
    branch: currentBranchName || 'RinoEdu Nguyễn Tuân',
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

  const isOldPackageSelected = useMemo(() => {
    return expiredPackages.some((p) => p.id === selectedPackageId)
  }, [expiredPackages, selectedPackageId])

  const selectedOldPackage = useMemo(() => {
    return expiredPackages.find((p) => p.id === selectedPackageId) || null
  }, [expiredPackages, selectedPackageId])

  return (
    <div className="bg-card dark:bg-zinc-900 border border-border/70 rounded-2xl p-3.5 sm:p-4 shadow-2xs space-y-3 select-none text-left overflow-hidden">
      {/* Header bar: Tab Gói học theo Chương trình + Tab Khác (Gói cũ) + Menu Thao tác */}
      <div className="-mx-3.5 -mt-3.5 sm:-mx-4 sm:-mt-4 p-2.5 px-3.5 sm:px-4 bg-muted/40 dark:bg-zinc-800/50 border-b border-border/50 flex items-center justify-between gap-2 flex-wrap mb-2.5">
        <div className="flex items-center gap-1.5 min-w-0 flex-wrap">
          {/* 1. Các gói còn hạn: hiển thị Tên Chương trình và Tên Gói ở dưới (thu nhỏ, để ...) */}
          {activePackages.map((pItem) => {
            const isSelected = pItem.id === selectedPackageId
            const programName = getPackageProgramName(pItem)

            return (
              <button
                key={pItem.id}
                type="button"
                onClick={() => {
                  setSelectedPackageId(pItem.id)
                  toast.success(`Đang xem gói: ${pItem.packageName}`)
                }}
                className={cn(
                  'px-2.5 py-1.5 rounded-xl transition-all inline-flex flex-col justify-center items-start text-left cursor-pointer select-none border shrink-0 w-[125px] sm:w-[135px]',
                  isSelected
                    ? 'bg-sky-600 text-white shadow-2xs border-sky-600'
                    : 'bg-background dark:bg-zinc-800 text-foreground border-border/70 hover:bg-muted/60'
                )}
                title={`${programName} - ${pItem.packageName}`}
              >
                <div className="flex items-center justify-between gap-1 w-full">
                  <span className={cn('text-xs font-bold leading-tight truncate', isSelected ? 'text-white' : 'text-foreground')}>
                    {programName}
                  </span>
                  {isSelected && (
                    <span className="inline-block w-1.5 h-1.5 rounded-full bg-white ml-auto shrink-0" />
                  )}
                </div>
                <span
                  className={cn(
                    'text-[10px] leading-tight truncate w-full mt-0.5',
                    isSelected ? 'text-sky-100 font-medium' : 'text-muted-foreground'
                  )}
                  title={pItem.packageName}
                >
                  {pItem.packageName}
                </span>
              </button>
            )
          })}

          {/* 2. Tab Khác: Chứa các gói cũ, hết hạn (bấm mở ngay menu popover) */}
          {expiredPackages.length > 0 && (
            <Popover open={isOldPackagesPopoverOpen} onOpenChange={setIsOldPackagesPopoverOpen}>
              <PopoverTrigger asChild>
                <button
                  type="button"
                  className={cn(
                    'px-2.5 py-1.5 rounded-xl transition-all inline-flex flex-col justify-center items-start text-left cursor-pointer select-none border shrink-0 w-[125px] sm:w-[135px]',
                    isOldPackageSelected
                      ? 'bg-sky-600 text-white shadow-2xs border-sky-600'
                      : 'bg-background dark:bg-zinc-800 text-foreground border-border/70 hover:bg-muted/60'
                  )}
                  title="Bấm để xem danh sách các gói học cũ, hết hạn"
                >
                  <div className="flex items-center gap-1 w-full">
                    <span className={cn('text-xs font-bold leading-tight', isOldPackageSelected ? 'text-white' : 'text-foreground')}>
                      Khác
                    </span>
                    <span
                      className={cn(
                        'text-[9.5px] px-1.5 py-0.2 rounded-full font-semibold',
                        isOldPackageSelected
                          ? 'bg-white/20 text-white'
                          : 'bg-muted dark:bg-zinc-700 text-muted-foreground'
                      )}
                    >
                      {expiredPackages.length}
                    </span>
                    <ChevronDown
                      className={cn(
                        'h-3.5 w-3.5 ml-auto opacity-70 transition-transform duration-200',
                        isOldPackagesPopoverOpen && 'rotate-180',
                        isOldPackageSelected ? 'text-white' : 'text-muted-foreground'
                      )}
                    />
                  </div>
                  <span
                    className={cn(
                      'text-[10px] leading-tight truncate w-full mt-0.5',
                      isOldPackageSelected ? 'text-sky-100 font-medium' : 'text-muted-foreground'
                    )}
                    title={isOldPackageSelected && selectedOldPackage ? selectedOldPackage.packageName : 'Gói cũ, hết hạn'}
                  >
                    {isOldPackageSelected && selectedOldPackage
                      ? selectedOldPackage.packageName
                      : 'Gói cũ, hết hạn'}
                  </span>
                </button>
              </PopoverTrigger>

              <PopoverContent
                align="start"
                className="w-80 sm:w-96 p-2 space-y-1.5 z-50 shadow-lg bg-popover text-popover-foreground rounded-xl border border-border"
              >
                <div className="px-2 py-1.5 border-b border-border/50 flex items-center justify-between text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                  <span className="flex items-center gap-1.5">
                    <Package className="h-3.5 w-3.5 text-sky-600 dark:text-sky-400" />
                    <span>Gói cũ / Hết hạn ({expiredPackages.length})</span>
                  </span>
                  <span className="text-[10px] text-muted-foreground/80 normal-case font-normal">
                    Chọn để xem dữ liệu
                  </span>
                </div>

                <div className="max-h-64 overflow-y-auto space-y-1 pr-0.5">
                  {expiredPackages.map((pkgItem) => {
                    const isCurrentPkg = pkgItem.id === selectedPackageId
                    const programName = getPackageProgramName(pkgItem)
                    const attendedSessions = Math.max(0, (pkgItem.totalSessions || 0) - (pkgItem.remainingSessions || 0))

                    return (
                      <div
                        key={pkgItem.id}
                        onClick={() => {
                          setSelectedPackageId(pkgItem.id)
                          setIsOldPackagesPopoverOpen(false)
                          toast.success(`Đã chọn xem gói cũ: ${pkgItem.packageName}`)
                        }}
                        className={cn(
                          'flex items-center justify-between gap-2.5 p-2 rounded-lg text-xs cursor-pointer transition-colors',
                          isCurrentPkg
                            ? 'bg-sky-50 dark:bg-sky-950/50 text-sky-900 dark:text-sky-100 font-medium border border-sky-200 dark:border-sky-800/60'
                            : 'hover:bg-muted/60 text-foreground border border-transparent'
                        )}
                      >
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-1.5">
                            <span className="text-[10px] px-1.5 py-0.2 rounded bg-muted dark:bg-zinc-700 text-foreground font-semibold shrink-0">
                              {programName}
                            </span>
                            <span className="font-semibold truncate block text-xs" title={pkgItem.packageName}>
                              {pkgItem.packageName}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-[11px] text-muted-foreground mt-0.5 flex-wrap">
                            <span>
                              {attendedSessions}/{pkgItem.totalSessions || 0} buổi
                            </span>
                            <span>•</span>
                            <span>Còn {pkgItem.remainingSessions || 0} buổi</span>
                            <span>•</span>
                            <span>Hạn: {pkgItem.endDate || '—'}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-1.5 shrink-0">
                          <StatusBadge
                            status="expired"
                            label={pkgItem.remainingSessions === 0 ? 'Hết buổi' : 'Hết hạn'}
                            className="text-[9px] py-0 px-1.5 h-4"
                          />
                          {isCurrentPkg && <Check className="h-4 w-4 text-sky-600 dark:text-sky-400 shrink-0 ml-0.5" />}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </PopoverContent>
            </Popover>
          )}
        </div>

          <div className="flex items-center gap-1 shrink-0">
            {/* Nút Thu gọn / Mở rộng */}
            <button
              type="button"
              onClick={() => setIsExpanded((prev) => !prev)}
              className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors cursor-pointer shrink-0"
              title={isExpanded ? 'Thu gọn thông tin' : 'Mở rộng xem thêm thông tin'}
            >
              <span>{isExpanded ? 'Thu gọn' : 'Mở rộng'}</span>
              {isExpanded ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
            </button>

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

      {/* THÔNG TIN HIỂN THỊ CHÍNH (3 Cột: Mã lớp, Lịch, Giáo viên) */}
      {showClassInfo && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-left">
          {/* Cột 1: Mã lớp */}
          <div className="space-y-0.5 min-w-0">
            <span className="text-xs text-muted-foreground/70 dark:text-zinc-400/80 font-medium flex items-center gap-1.5">
              <BookOpen className="h-3.5 w-3.5 text-muted-foreground/80 shrink-0" />
              <span>Mã lớp</span>
            </span>
            <div className="flex items-center gap-1.5 text-xs font-medium text-foreground flex-wrap">
              <ClassCodeHoverCell
                classCode={classCode}
                subject={pkgIsEnglish ? 'Tiếng Anh' : 'Toán tư duy'}
                level={pkg.level || student?.level || 'Level 4'}
                subLevel={pkg.subLevel || student?.subLevel}
                teacherCode={pkg.teacherCode || 'GV'}
                schedule={pkg.schedule || 'Thứ 2, 6 (17:30 - 19:00)'}
              />
              {placementStatus === 'active' && (
                <StatusBadge status="active" label="Đang học" className="text-[9.5px] py-0 px-1.5" />
              )}
              {placementStatus === 'draft_class' && (
                <StatusBadge status="draft_class" label="Lớp nháp" className="text-[9.5px] py-0 px-1.5" />
              )}
              {placementStatus === 'awaiting_opening' && (
                <StatusBadge status="awaiting_opening" label="Chờ khai giảng" className="text-[9.5px] py-0 px-1.5" />
              )}
              {placementStatus === 'trial' && (
                <StatusBadge status="trial" label="Học thử" className="text-[9.5px] py-0 px-1.5" />
              )}
              {isHoldingClass && (
                <StatusBadge status="reserve" label="Bảo lưu (Giữ lớp)" className="text-[9.5px] py-0 px-1.5" />
              )}
            </div>
          </div>

          {/* Cột 2: Lịch */}
          <div className="space-y-0.5 min-w-0">
            <span className="text-xs text-muted-foreground/70 dark:text-zinc-400/80 font-medium flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5 text-muted-foreground/80 shrink-0" />
              <span>Lịch học</span>
            </span>
            <p className="text-xs font-medium text-foreground truncate">
              {pkg.schedule || 'Thứ 2, 6 (17:30 - 19:00)'}
            </p>
          </div>

          {/* Cột 3: Phụ trách CS (nếu là Tái phí) HOẶC Giáo viên (nếu là màn khác) */}
          {isRenewal ? (
            <div className="space-y-0.5 min-w-0">
              <span className="text-xs text-muted-foreground/70 dark:text-zinc-400/80 font-medium flex items-center gap-1.5">
                <Headphones className="h-3.5 w-3.5 text-muted-foreground/80 shrink-0" />
                <span>Phụ trách CS</span>
              </span>
              <div className="flex items-center gap-1.5 text-xs font-medium text-foreground flex-wrap">
                <PersonnelHoverCard person={csPersonnelItem}>
                  <span className="hover:underline cursor-pointer font-semibold text-foreground truncate">
                    {currentCSObj.name}
                  </span>
                </PersonnelHoverCard>

                {/* Popover đổi nhân sự CS */}
                <Popover open={isCsPopoverOpen} onOpenChange={setIsCsPopoverOpen}>
                  <PopoverTrigger asChild>
                    <button
                      type="button"
                      className="p-1 text-muted-foreground hover:text-foreground hover:bg-muted/80 rounded transition-colors cursor-pointer shrink-0"
                      title="Đổi nhân viên phụ trách CS"
                      aria-label="Đổi nhân viên phụ trách CS"
                    >
                      <ArrowLeftRight className="h-3 w-3" />
                    </button>
                  </PopoverTrigger>
                  <PopoverContent
                    align="start"
                    className="w-72 p-2 space-y-2 max-h-80 flex flex-col z-50 shadow-md bg-popover text-popover-foreground"
                  >
                    <div className="flex items-center gap-1.5 px-2 py-1.5 bg-muted/50 rounded-md border border-border/60">
                      <Search className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                      <input
                        value={csSearchQuery}
                        onChange={(e) => setCsSearchQuery(e.target.value)}
                        placeholder="Tìm nhân sự CS..."
                        className="w-full bg-transparent text-xs outline-none p-0 placeholder:text-muted-foreground"
                        autoFocus
                      />
                    </div>
                    <div className="text-[10.5px] font-semibold text-muted-foreground uppercase px-1 pb-0.5 border-b border-border/40">
                      Chọn nhân sự phụ trách CS
                    </div>
                    <div className="flex-1 overflow-y-auto space-y-1 max-h-52 pr-0.5">
                      {filteredCsList.length === 0 ? (
                        <div className="py-3 text-center text-xs text-muted-foreground">
                          Không tìm thấy nhân sự phù hợp
                        </div>
                      ) : (
                        filteredCsList.map((staff) => {
                          const isSelected = staff.name.toLowerCase() === effectiveCSName.toLowerCase()
                          return (
                            <div
                              key={staff.id}
                              onClick={() => handleSelectCS(staff)}
                              className={cn(
                                'flex items-center justify-between px-2 py-1.5 rounded-md text-xs cursor-pointer transition-colors min-h-[34px]',
                                isSelected
                                  ? 'bg-sky-50 dark:bg-sky-950/40 text-sky-900 dark:text-sky-200 font-medium'
                                  : 'hover:bg-muted/70 text-foreground'
                              )}
                            >
                              <div className="flex items-center gap-2 min-w-0">
                                <AppAvatar
                                  src={staff.avatar}
                                  name={staff.name}
                                  size="xs"
                                  className="h-6 w-6 border border-border/50 shrink-0"
                                />
                                <div className="min-w-0">
                                  <span className="text-xs font-semibold block truncate">
                                    {staff.name}
                                  </span>
                                  <span className="text-[10px] text-muted-foreground block truncate">
                                    {staff.code} {staff.role ? `• ${staff.role}` : ''}
                                  </span>
                                </div>
                              </div>
                              {isSelected && (
                                <Check className="h-3.5 w-3.5 text-sky-600 dark:text-sky-400 shrink-0 ml-1" />
                              )}
                            </div>
                          )
                        })
                      )}
                    </div>
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          ) : (
            <div className="space-y-0.5 min-w-0">
              <div className="flex items-center justify-between gap-1">
                <span className="text-xs text-muted-foreground/70 dark:text-zinc-400/80 font-medium flex items-center gap-1.5">
                  <GraduationCap className="h-3.5 w-3.5 text-muted-foreground/80 shrink-0" />
                  <span>Giáo viên</span>
                </span>
                <ClassTeacherHistoryPopover
                  trigger={
                    <button
                      type="button"
                      className="inline-flex items-center gap-1 text-xs text-amber-600 dark:text-amber-400 hover:text-amber-700 dark:hover:text-amber-300 font-medium cursor-pointer transition-colors"
                      title="Lịch sử đổi giáo viên (3)"
                    >
                      <History className="h-3 w-3 text-amber-500" />
                      <span className="text-xs font-semibold">(3)</span>
                    </button>
                  }
                />
              </div>
              <div className="flex items-center gap-1.5 text-xs font-medium text-foreground flex-wrap">
                {classTeachers.length > 0 ? (
                  classTeachers.map((teacher, idx) => {
                    const displayTeacherName = teacher.name.startsWith('GV_') ? teacher.name : teacher.name.replace(/^GV\s+/i, '')
                    return (
                      <React.Fragment key={teacher.id}>
                        <PersonnelHoverCard person={{ ...teacher, name: displayTeacherName }}>
                          <span className="text-foreground font-semibold hover:underline cursor-pointer">
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
              </div>
            </div>
          )}
        </div>
      )}

      {/* Phần thông tin mở rộng bên dưới (Cơ sở, Thời hạn, Trình độ, CS & GV) */}
      {isExpanded && (
        <StudentCareClassExpandedInfo
          currentBranchName={currentBranchName}
          attendedSessions={attendedSessions}
          totalSessions={totalSessions}
          startDateDisplay={startDateDisplay}
          endDateDisplay={endDateDisplay}
          pkg={pkg}
          pkgIsEnglish={pkgIsEnglish}
          classRecordForHover={classRecordForHover}
          csPersonnelItem={csPersonnelItem}
          currentCSObj={currentCSObj}
          effectiveCSName={effectiveCSName}
          filteredCsList={filteredCsList}
          csSearchQuery={csSearchQuery}
          setCsSearchQuery={setCsSearchQuery}
          isCsPopoverOpen={isCsPopoverOpen}
          setIsCsPopoverOpen={setIsCsPopoverOpen}
          handleSelectCS={handleSelectCS}
          classTeachers={classTeachers}
          isRenewal={isRenewal}
        />
      )}

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
