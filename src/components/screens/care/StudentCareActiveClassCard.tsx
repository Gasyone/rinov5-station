'use client'

import React, { useState, useMemo } from 'react'
import {
  History,
  ChevronDown,
  ChevronUp,
  ArrowRightLeft,
  ArrowLeftRight,
  Snowflake,
  UserX,
  FileText,
  Search,
  Check,
  BookOpen,
  Calendar,
  GraduationCap,
  Building2,
  Clock,
  Award,
  Headphones,
  Users,
  RotateCcw,
  MoreVertical,
  CalendarOff,
  UserPlus,
  ExternalLink,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { toast } from 'sonner'
import { PersonnelHoverCard, AppAvatar, StatusBadge, type PersonnelItem } from '@/components/shared'
import { ClassTeacherHistoryPopover } from './ClassTeacherHistoryPopover'
import { ClassCodeHoverCell } from './ClassCodeHoverCell'
import { SyllabusProfileHoverCard } from '@/components/screens/classes/SyllabusProfileHoverCard'
import { StudentCareEarlyReturnDialog } from './StudentCareEarlyReturnDialog'
import type { ClassRecord } from '@/mocks/classRecords'
import { type SimulatedPackage, type CSStaffMember, defaultCSStaffList } from './studentCareDetailTypes'
import { type StudentCareAlert } from '@/mocks/careAlerts'
import { cn } from '@/lib/utils'

interface StudentCareActiveClassCardProps {
  pkg: SimulatedPackage
  visiblePackages: SimulatedPackage[]
  selectedPackageId: string
  setSelectedPackageId: (id: string) => void
  currentBranchName: string
  pkgIsEnglish: boolean
  student?: StudentCareAlert | null
  onOpenLeaveReserveDialog?: () => void
  onOpenEarlyReturnDialog?: () => void
  onCreateLeaveReserve?: (type: 'off' | 'reservation') => void
  assignedCS?: string
  onAssignedCSChange?: (csName: string) => void
  staffInfo?: {
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
}

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
}: StudentCareActiveClassCardProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [selectedCSName, setSelectedCSName] = useState<string | null>(null)
  const [isCsPopoverOpen, setIsCsPopoverOpen] = useState(false)
  const [csSearchQuery, setCsSearchQuery] = useState('')
  const [isEarlyReturnOpen, setIsEarlyReturnOpen] = useState(false)

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
    return (
      defaultCSStaffList.find((c) => c.name.toLowerCase() === effectiveCSName.toLowerCase()) ||
      defaultCSStaffList[0]
    )
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
    toast.success(`Đã đổi nhân viên phụ trách CS sang: ${staff.name}`)
  }

  // Danh sách giáo viên của lớp (lấy từ GV của lớp: staffInfo.teachers)
  const classTeachers = useMemo(() => {
    if (staffInfo?.teachers && staffInfo.teachers.length > 0) {
      return staffInfo.teachers
    }
    return [
      {
        id: 't-1',
        name: pkgIsEnglish ? 'Sarah Smith' : 'Hoàng Thị Mai',
        role: pkgIsEnglish ? 'Giáo viên Bản ngữ' : 'Giáo viên Toán tư duy',
        phone: '0912 345 678',
        email: 'giaovien@rinoedu.vn',
        avatar: `https://api.dicebear.com/7.x/adventurer/svg?seed=${pkgIsEnglish ? 'Sarah' : 'ThiMai'}`,
      },
      {
        id: 't-2',
        name: 'Hoàng Anh',
        role: 'Trợ giảng (TA)',
        phone: '0934 567 890',
        email: 'trogiang@rinoedu.vn',
        avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=HoangAnh',
      },
    ]
  }, [staffInfo, pkgIsEnglish])



  const startDateDisplay = pkg.startDate
    ? (pkg.startDate.includes('-') ? pkg.startDate.split('-').reverse().join('/') : pkg.startDate)
    : '14/08/2024'
  const endDateDisplay = pkg.endDate || '14/08/2027'
  const totalSessions = pkg.totalSessions || 48
  const remainingSessions = pkg.remainingSessions ?? 30
  const attendedSessions = Math.max(0, totalSessions - remainingSessions)

  // Xác định trạng thái tự động dựa trên dữ liệu mẫu học viên
  const classStatus: 'da_ghep' | 'chua_ghep' | 'bao_luu' | 'chuyen_lop' = (() => {
    if (student) {
      if (
        student.status === 'Chờ chuyển lớp' ||
        (student.status as string) === 'pending_transfer' ||
        student.realtimeStatus === 'Chờ chuyển lớp'
      ) {
        return 'chuyen_lop'
      }
      if (
        (student.status === 'Hết buổi' && student.careAlert?.toLowerCase().includes('bảo lưu')) ||
        (student.status as string) === 'reserve' ||
        (student.status as string) === 'Bảo lưu' ||
        (student.realtimeStatus as string) === 'Bảo lưu' ||
        Boolean(student.careAlert?.toLowerCase().includes('bảo lưu'))
      ) {
        return 'bao_luu'
      }
      if (
        (student.status as string) === 'Chưa ghép lớp' ||
        (student.status as string) === 'wait_for_assignment' ||
        (student.status as string) === 'pending_assignment' ||
        (student.realtimeStatus as string) === 'Chưa ghép lớp' ||
        !student.classCode ||
        student.classCode === '-'
      ) {
        return 'chua_ghep'
      }
    }
    if (pkg.status === 'pending' || !pkg.classCode) {
      return 'chua_ghep'
    }
    return 'da_ghep'
  })()

  // Xác định trường hợp bảo lưu nhưng không thoát lớp (giữ lớp)
  const isHoldingClass = (() => {
    if (classStatus !== 'bao_luu') return false
    // Hoàng Bảo Nam (s-baonam / bao-nam) bảo lưu nhưng không thoát lớp (giữ lớp LD_TOAN_00010)
    if (student?.studentId === 's-baonam' || student?.id === 'bao-nam') return true
    if (student?.studentNote?.toLowerCase().includes('thoát lớp')) return false
    return Boolean(student?.classCode && student?.classCode !== '-')
  })()

  // Phần thông tin lớp chỉ hiển thị khi đang ghép lớp, còn lại là thông tin của badge.
  // 2 cái không đồng thời xuất hiện, trừ khi bảo lưu nhưng không thoát lớp.
  const showClassInfo = classStatus === 'da_ghep' || isHoldingClass

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

  // Lọc chỉ hiển thị các chương trình khác nhau, không lặp lại cùng môn (Tiếng Anh / Toán tư duy)
  const displayPackages = useMemo(() => {
    const seenSubjects = new Set<string>()
    const list: SimulatedPackage[] = []

    for (const pItem of visiblePackages) {
      const text = `${pItem.packageName} ${pItem.className} ${pItem.classCode}`
      const shortSubject = /tiếng\s*anh|english|LD_TA/i.test(text)
        ? 'Tiếng Anh'
        : /toán|math|LD_TOAN/i.test(text)
          ? 'Toán tư duy'
          : pItem.packageName.replace(/^Gói\s*/i, '').replace(/\s*Level.*$/i, '').trim() || 'Chương trình'

      if (!seenSubjects.has(shortSubject)) {
        seenSubjects.add(shortSubject)
        list.push(pItem)
      }
    }

    return list
  }, [visiblePackages])

  return (
    <div className="bg-card dark:bg-zinc-900 border border-border/70 rounded-2xl p-3.5 sm:p-4 shadow-2xs space-y-3 select-none text-left overflow-hidden">
      {/* Header bar: Chương trình selector + Nút Thu gọn/Mở rộng */}
      <div className="-mx-3.5 -mt-3.5 sm:-mx-4 sm:-mt-4 p-2.5 px-3.5 sm:px-4 bg-muted/40 dark:bg-zinc-800/50 border-b border-border/50 flex items-center justify-between gap-2 flex-wrap mb-2.5">
        <div className="flex items-center gap-1.5 min-w-0 flex-wrap">
          {displayPackages.map((pItem) => {
            const isSelected = pItem.id === selectedPackageId
            const text = `${pItem.packageName} ${pItem.className} ${pItem.classCode}`
            const shortSubject = /tiếng\s*anh|english|LD_TA/i.test(text)
              ? 'Tiếng Anh'
              : /toán|math|LD_TOAN/i.test(text)
                ? 'Toán tư duy'
                : pItem.packageName.replace(/^Gói\s*/i, '').replace(/\s*Level.*$/i, '').trim() || 'Chương trình'
            const isPkgActive = pItem.status === 'active'

            return (
              <button
                key={pItem.id}
                type="button"
                onClick={() => setSelectedPackageId(pItem.id)}
                className={cn(
                  'h-8 px-3.5 py-1 text-xs font-semibold rounded-lg transition-all inline-flex justify-center items-center text-center cursor-pointer select-none border shrink-0',
                  isSelected
                    ? 'bg-sky-600 text-white shadow-2xs border-sky-600'
                    : isPkgActive
                      ? 'bg-background dark:bg-zinc-800 text-foreground border-border/70 hover:bg-muted/60'
                      : 'bg-transparent text-muted-foreground border-border/40 hover:bg-muted/30'
                )}
                title={pItem.packageName}
              >
                <span>{shortSubject}</span>
              </button>
            )
          })}
        </div>

        <div className="flex items-center gap-1 shrink-0">
          {/* Nút Thu gọn / Mở rộng (bỏ viền, bỏ nền) */}
          <button
            type="button"
            onClick={() => setIsExpanded((prev) => !prev)}
            className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground font-medium py-1 px-1.5 rounded-md hover:bg-muted/50 transition-colors cursor-pointer shrink-0"
            title={isExpanded ? 'Thu gọn thông tin' : 'Mở rộng xem thêm thông tin'}
          >
            <span>{isExpanded ? 'Thu gọn' : 'Mở rộng'}</span>
            {isExpanded ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
          </button>

          {/* Menu Action Lớp học - Thay đổi động theo trạng thái lớp học */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="h-7 px-2 text-xs font-medium gap-1 text-muted-foreground hover:text-foreground rounded-md bg-background hover:bg-muted/60 border-border/70 cursor-pointer shadow-3xs"
                title="Danh sách thao tác học vụ"
              >
                <MoreVertical className="h-3.5 w-3.5" />
                <span>Thao tác</span>
                <ChevronDown className="h-3 w-3 opacity-60" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-52">
              {/* 1. Trạng thái CHỜ XẾP LỚP / CHƯA GHÉP LỚP */}
              {classStatus === 'chua_ghep' && (
                <>
                  <DropdownMenuItem
                    onClick={handleOpenPlacementTab}
                    className="cursor-pointer gap-2 font-medium text-indigo-600 dark:text-indigo-400 focus:text-indigo-700"
                  >
                    <UserPlus className="h-4 w-4 text-indigo-500 shrink-0" />
                    <div className="flex flex-col min-w-0">
                      <span>Ghép lớp</span>
                      <span className="text-[10px] text-muted-foreground font-normal">Mở tab Xếp lớp học viên</span>
                    </div>
                    <ExternalLink className="h-3 w-3 ml-auto opacity-60 shrink-0" />
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => onCreateLeaveReserve?.('reservation')}
                    className="cursor-pointer gap-2"
                  >
                    <Snowflake className="h-4 w-4 text-sky-500 shrink-0" />
                    <span>Bảo lưu</span>
                  </DropdownMenuItem>
                </>
              )}

              {/* 2. Trạng thái ĐANG CHUYỂN LỚP */}
              {classStatus === 'chuyen_lop' && (
                <>
                  <DropdownMenuItem
                    onClick={handleOpenPlacementTab}
                    className="cursor-pointer gap-2 font-medium text-sky-600 dark:text-sky-400 focus:text-sky-700"
                  >
                    <ArrowRightLeft className="h-4 w-4 text-sky-500 shrink-0" />
                    <div className="flex flex-col min-w-0">
                      <span>Ghép lớp đích</span>
                      <span className="text-[10px] text-muted-foreground font-normal">Mở tab Xếp lớp học viên</span>
                    </div>
                    <ExternalLink className="h-3 w-3 ml-auto opacity-60 shrink-0" />
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => onCreateLeaveReserve?.('reservation')}
                    className="cursor-pointer gap-2"
                  >
                    <Snowflake className="h-4 w-4 text-sky-500 shrink-0" />
                    <span>Bảo lưu</span>
                  </DropdownMenuItem>
                </>
              )}

              {/* 3. Trạng thái ĐANG BẢO LƯU */}
              {classStatus === 'bao_luu' && (
                <>
                  <DropdownMenuItem
                    onClick={() => {
                      if (onOpenEarlyReturnDialog) {
                        onOpenEarlyReturnDialog()
                      } else {
                        setIsEarlyReturnOpen(true)
                      }
                    }}
                    className="cursor-pointer gap-2 font-medium text-emerald-600 dark:text-emerald-400 focus:text-emerald-700"
                  >
                    <RotateCcw className="h-4 w-4 text-emerald-500 shrink-0" />
                    <span>Đi học lại</span>
                  </DropdownMenuItem>
                  {onOpenLeaveReserveDialog && (
                    <DropdownMenuItem
                      onClick={onOpenLeaveReserveDialog}
                      className="cursor-pointer gap-2"
                    >
                      <FileText className="h-4 w-4 text-amber-500 shrink-0" />
                      <span>Xem đơn bảo lưu</span>
                    </DropdownMenuItem>
                  )}
                </>
              )}

              {/* 4. Trạng thái ĐANG HỌC BÌNH THƯỜNG */}
              {classStatus === 'da_ghep' && (
                <>
                  <DropdownMenuItem
                    onClick={() => onCreateLeaveReserve?.('off')}
                    className="cursor-pointer gap-2"
                  >
                    <CalendarOff className="h-4 w-4 text-amber-500 shrink-0" />
                    <span>Nghỉ phép</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => onCreateLeaveReserve?.('reservation')}
                    className="cursor-pointer gap-2"
                  >
                    <Snowflake className="h-4 w-4 text-sky-500 shrink-0" />
                    <span>Bảo lưu</span>
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* THÔNG TIN LỚP DẠNG THÔNG TIN PHẲNG (Khi không ở trạng thái đang ghép lớp bình thường) */}
      {classStatus === 'chuyen_lop' && (
        <div className="pt-0.5 space-y-1 select-none animate-in fade-in-50 duration-200 flex flex-col items-center justify-center text-center">
          <div className="flex items-center justify-center gap-2 flex-wrap">
            <span className="p-1 rounded-md bg-sky-500/10 text-sky-600 dark:text-sky-400">
              <ArrowRightLeft className="h-3.5 w-3.5" />
            </span>
            <span className="font-bold text-sky-700 dark:text-sky-400 uppercase tracking-wide text-xs">
              Tiến trình chuyển lớp đang diễn ra
            </span>
            <StatusBadge
              status={assignedTargetClass ? 'dang_hoc' : 'wait_for_assignment'}
              label={assignedTargetClass ? 'Đã xếp lớp đích' : 'Chờ xếp lớp'}
              className="text-xs py-0 px-1.5"
            />
          </div>
          <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground flex-wrap pt-0.5 text-center">
            <div>
              <span>Lớp nguồn: </span>
              <strong className="font-semibold text-foreground">{student?.classCode || classCode}</strong>
              <span className="mx-1.5 text-sky-500">➔</span>
              <span>Lớp đích: </span>
              <strong className={assignedTargetClass ? 'font-semibold text-emerald-600 dark:text-emerald-400' : 'font-semibold text-foreground'}>
                {assignedTargetClass || student?.targetClass || student?.destinationClass || 'Chưa ghép lớp'}
              </strong>
            </div>
          </div>
        </div>
      )}

      {classStatus === 'bao_luu' && (
        <div className="pt-0.5 space-y-1 select-none animate-in fade-in-50 duration-200 text-left">
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <div className="flex items-center gap-2">
              <span className="p-1 rounded-md bg-amber-500/10 text-amber-600 dark:text-amber-400">
                <Snowflake className="h-3.5 w-3.5" />
              </span>
              <span className="font-bold text-amber-700 dark:text-amber-400 uppercase tracking-wide text-xs">
                Khóa học đang bảo lưu
              </span>
              {isHoldingClass && (
                <StatusBadge
                  status="reserve"
                  label="Bảo lưu giữ lớp"
                  className="text-xs py-0 px-1.5"
                />
              )}
            </div>
            <span className="text-xs text-muted-foreground">
              Ngày học lại dự kiến: <strong className="font-semibold text-foreground">{isHoldingClass ? '16/09/2026' : '01/08/2026'}</strong>
            </span>
          </div>
          <div className="flex items-center justify-between gap-2 text-xs text-muted-foreground flex-wrap pt-0.5">
            <span>
              Thời gian: <strong className="font-semibold text-foreground">{isHoldingClass ? '15/06/2026 ➔ 15/09/2026' : '01/06/2026 ➔ 31/07/2026'}</strong> ({isHoldingClass ? '3 tháng' : '2 tháng'})
            </span>
            <div className="flex items-center gap-2 ml-auto">
              {onOpenLeaveReserveDialog && (
                <button
                  type="button"
                  onClick={onOpenLeaveReserveDialog}
                  className="inline-flex items-center gap-1 text-xs font-medium text-amber-600 dark:text-amber-400 hover:underline cursor-pointer"
                >
                  <FileText className="h-3.5 w-3.5" />
                  <span>Xem đơn bảo lưu</span>
                </button>
              )}
              {onOpenLeaveReserveDialog && <span className="text-muted-foreground/30">•</span>}
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={() => {
                  if (onOpenEarlyReturnDialog) {
                    onOpenEarlyReturnDialog()
                  } else {
                    setIsEarlyReturnOpen(true)
                  }
                }}
                className="h-6 px-2 text-xs font-semibold text-sky-700 dark:text-sky-300 border-sky-300 dark:border-sky-800 bg-sky-50/70 hover:bg-sky-100 dark:bg-sky-950/40 dark:hover:bg-sky-900/60 cursor-pointer shadow-3xs"
              >
                <RotateCcw className="h-3 w-3 mr-1 text-sky-600 dark:text-sky-400" />
                <span>Đi học lại</span>
              </Button>
            </div>
          </div>
        </div>
      )}

      {classStatus === 'chua_ghep' && (
        <div className="pt-0.5 space-y-1 select-none animate-in fade-in-50 duration-200 flex flex-col items-center justify-center text-center">
          <div className="flex items-center justify-center gap-2 flex-wrap">
            <span className="p-1 rounded-md bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
              <UserX className="h-3.5 w-3.5" />
            </span>
            <span className="font-bold text-indigo-700 dark:text-indigo-400 uppercase tracking-wide text-xs">
              {assignedTargetClass ? 'Học viên đã được ghép lớp' : 'Học viên chưa ghép lớp'}
            </span>
            <StatusBadge
              status={assignedTargetClass ? 'dang_hoc' : 'wait_for_assignment'}
              label={assignedTargetClass ? 'Đã xếp lớp' : 'Chờ xếp lớp'}
              className="text-xs py-0 px-1.5"
            />
          </div>
          <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground pt-0.5 text-center flex-wrap">
            <div>
              <span>{assignedTargetClass ? 'Lớp tiếp nhận: ' : 'Gói đăng ký: '}</span>
              <strong className={assignedTargetClass ? 'font-semibold text-emerald-600 dark:text-emerald-400' : 'font-semibold text-foreground'}>
                {assignedTargetClass || pkg.packageName || 'Gói Tiếng Anh Standard 48 buổi'}
              </strong>
            </div>
          </div>
        </div>
      )}

      {/* THÔNG TIN HIỂN THỊ CHÍNH (3 Cột: Mã lớp, Lịch, Giáo viên - Chỉ hiển thị khi đang ghép lớp hoặc bảo lưu giữ lớp) */}
      {showClassInfo && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-left">
          {/* Cột 1: Mã lớp (hover popover) */}
          <div className="space-y-0.5 min-w-0">
            <span className="text-xs text-muted-foreground/70 dark:text-zinc-400/80 font-medium flex items-center gap-1.5">
              <BookOpen className="h-3.5 w-3.5 text-muted-foreground/80 shrink-0" />
              <span>Mã lớp</span>
            </span>
            <div className="flex items-center gap-1.5 text-xs font-medium text-foreground flex-wrap">
              <ClassCodeHoverCell
                classCode={classCode}
                subject={pkgIsEnglish ? 'Tiếng Anh' : 'Toán tư duy'}
                level={pkg.level || 'Level 4'}
                teacherCode={pkg.teacherCode || 'GV'}
                schedule={pkg.schedule || 'Thứ 2, 6 (17:30 - 19:00)'}
              />
              {classStatus === 'da_ghep' && (
                <StatusBadge status="dang_hoc" label="Đang học" className="text-[9.5px] py-0 px-1.5" />
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

          {/* Cột 3: Giáo viên (hover popover) */}
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
            </div>
          </div>
        </div>
      )}

      {/* PHẦN THÔNG TIN MỞ RỘNG BÊN DƯỚI (Khi bấm Mở rộng: Cơ sở, Thời hạn, Trình độ & Phụ trách CS, Phụ trách GV) */}
      {isExpanded && (
        <div className="pt-2 mt-1 space-y-2.5 text-left animate-in fade-in-50 duration-200">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Cột 1: Cơ sở */}
            <div className="space-y-0.5 min-w-0">
              <span className="text-xs text-muted-foreground/70 dark:text-zinc-400/80 font-medium flex items-center gap-1.5">
                <Building2 className="h-3.5 w-3.5 text-muted-foreground/80 shrink-0" />
                <span>Cơ sở</span>
              </span>
              <p className="text-xs font-medium text-foreground truncate">
                {currentBranchName}
              </p>
            </div>

            {/* Cột 2: Thời hạn */}
            <div className="space-y-0.5 min-w-0">
              <div className="flex items-center justify-between gap-1">
                <span className="text-xs text-muted-foreground/70 dark:text-zinc-400/80 font-medium flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5 text-muted-foreground/80 shrink-0" />
                  <span>Thời hạn</span>
                </span>
                <span className="text-xs text-muted-foreground font-normal">
                  {attendedSessions}/{totalSessions} buổi
                </span>
              </div>
              <p className="text-xs font-medium text-foreground truncate">
                <span>{startDateDisplay} - {endDateDisplay}</span>
              </p>
            </div>

            {/* Cột 3: Trình độ */}
            <div className="space-y-0.5 min-w-0">
              <span className="text-xs text-muted-foreground/70 dark:text-zinc-400/80 font-medium flex items-center gap-1.5">
                <Award className="h-3.5 w-3.5 text-muted-foreground/80 shrink-0" />
                <span>Trình độ</span>
              </span>
              <div className="flex items-center gap-1.5 text-xs text-foreground flex-wrap font-normal">
                <SyllabusProfileHoverCard cls={classRecordForHover}>
                  <span className="hover:underline cursor-pointer font-medium text-foreground">
                    {pkgIsEnglish ? 'IELTS Junior v2.1' : 'Toán Tư Duy STEM Rino'}
                  </span>
                </SyllabusProfileHoverCard>
                <span className="text-border/80 font-normal">•</span>
                <span className="font-medium text-foreground">
                  {pkg.level && pkg.subLevel
                    ? (pkg.subLevel.includes(pkg.level) ? pkg.subLevel : `${pkg.level} - ${pkg.subLevel}`)
                    : (pkg.subLevel || pkg.level || 'Level 4 - A')}
                </span>
              </div>
            </div>
          </div>

          {/* Dòng Phụ trách CS và Phụ trách GV ở dưới cùng */}
          <div className="pt-2.5 border-t border-border/40 grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Cột 1: Phụ trách CS */}
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

                {/* Popover đổi người phụ trách CS */}
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

            {/* Cột 2: Phụ trách GV (Tất cả giáo viên của lớp cùng 1 dòng, không cần icon đổi) */}
            <div className="space-y-0.5 min-w-0 sm:col-span-2">
              <span className="text-xs text-muted-foreground/70 dark:text-zinc-400/80 font-medium flex items-center gap-1.5">
                <Users className="h-3.5 w-3.5 text-muted-foreground/80 shrink-0" />
                <span>Phụ trách GV</span>
              </span>
              <div className="flex items-center gap-1 text-xs font-medium text-foreground flex-wrap">
                {classTeachers.length > 0 ? (
                  classTeachers.map((teacher, idx) => {
                    const cleanedName = teacher.name.replace(/^GV\.?\s*/i, '').trim()
                    const teacherPersonnel: PersonnelItem = {
                      id: teacher.id,
                      name: cleanedName,
                      role: teacher.role || 'Giáo viên phụ trách',
                      phone: teacher.phone || '0912 345 678',
                      email: teacher.email || 'giaovien@rinoedu.vn',
                      avatar: teacher.avatar || `https://api.dicebear.com/7.x/adventurer/svg?seed=${cleanedName}`,
                    }
                    return (
                      <React.Fragment key={teacher.id}>
                        <PersonnelHoverCard person={teacherPersonnel}>
                          <span className="hover:underline cursor-pointer font-semibold text-foreground">
                            {cleanedName}
                          </span>
                        </PersonnelHoverCard>
                        {idx < classTeachers.length - 1 && <span className="text-muted-foreground mr-1">,</span>}
                      </React.Fragment>
                    )
                  })
                ) : (
                  <span className="text-muted-foreground font-normal">Chưa phân công</span>
                )}
              </div>
            </div>
          </div>
        </div>
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
