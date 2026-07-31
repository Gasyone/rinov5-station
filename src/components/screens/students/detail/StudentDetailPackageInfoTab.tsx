'use client'

import { useMemo } from 'react'
import {
  Pencil,
  ArrowLeftRight,
  CheckCircle2,
  HelpCircle,
  XCircle,
  BookOpen,
  Clock,
  Calendar,
  Package,
  Building,
  UserCheck,
  FileText,
} from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import { getStatusColors } from '@/lib/statusColors'
import type { StudentPackage } from './studentDetailTypes'
import type { EnrolledClass, Student } from '@/mocks/students'
import { StudentDetailPackagesMoreMenu } from './StudentDetailPackagesMoreMenu'
import { ChangeCSStaffPopover, AppAvatar } from '@/components/shared'

const CSM_OPTIONS_BY_BRANCH: Record<string, string[]> = {
  'RinoEdu Nguyễn Tuân': ['CSM Quỳnh Anh', 'CSM Minh Phương', 'CSM Khánh Linh'],
  'RinoEdu Linh Đàm': ['CSM Hoàng Nam', 'CSM Thu Hà', 'CSM Đức Anh'],
  'RinoEdu Cầu Giấy': ['CSM Hải Yến', 'CSM Thùy Trang'],
}

interface StudentDetailPackageInfoTabProps {
  packagesList: StudentPackage[]
  selectedPackageId: string
  setSelectedPackageId: (id: string) => void
  student: Student
  activeClass: EnrolledClass | null
  onEditLevel: () => void
  onEditSessions: () => void
}

export function StudentDetailPackageInfoTab({
  packagesList,
  selectedPackageId,
  setSelectedPackageId,
  student,
  activeClass,
  onEditLevel,
  onEditSessions,
}: StudentDetailPackageInfoTabProps) {
  const currentBranch = student.branch || 'RinoEdu Nguyễn Tuân'
  const csmOptions = useMemo(() => {
    return CSM_OPTIONS_BY_BRANCH[currentBranch] || ['CSM Quỳnh Anh', 'CSM Minh Phương', 'CSM Hoàng Nam', 'CSM Thu Hà']
  }, [currentBranch])

  const [selectedCsm, setSelectedCsm] = useState<string>(() => csmOptions[0] || 'CSM Quỳnh Anh')
  const getPackageIcon = (pkg: StudentPackage) => {
    if (pkg.remainingSessions === 0) {
      return <XCircle className={cn('h-3.5 w-3.5 shrink-0', getStatusColors('neutral').text)} />
    }
    if (pkg.linkedClassCode) {
      return <CheckCircle2 className={cn('h-3.5 w-3.5 shrink-0', getStatusColors('success').text)} />
    }
    return <HelpCircle className={cn('h-3.5 w-3.5 shrink-0', getStatusColors('warning').text)} />
  }

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return '—'
    if (/^\d{2}\/\d{2}\/\d{4}$/.test(dateStr)) return dateStr
    if (dateStr.includes('(')) return dateStr.split(' ')[0]
    try {
      const d = new Date(dateStr)
      if (isNaN(d.getTime())) return dateStr
      return `${d.getDate().toString().padStart(2, '0')}/${(d.getMonth() + 1).toString().padStart(2, '0')}/${d.getFullYear()}`
    } catch {
      return dateStr
    }
  }

  const { activePackages, expiredPackages } = useMemo(() => {
    const active = packagesList.filter(
      (p) =>
        p.remainingSessions > 0 &&
        p.status !== 'transferred' &&
        p.status !== 'cancelled' &&
        p.status !== 'suspended' &&
        p.status !== 'reserved' &&
        p.status !== 'expired'
    )
    const expired = packagesList.filter(
      (p) =>
        p.remainingSessions === 0 ||
        p.status === 'transferred' ||
        p.status === 'cancelled' ||
        p.status === 'suspended' ||
        p.status === 'reserved' ||
        p.status === 'expired'
    )
    return { activePackages: active, expiredPackages: expired }
  }, [packagesList])

  const handleSelectPackage = (packageId: string) => {
    setSelectedPackageId(selectedPackageId === packageId ? 'all' : packageId)
  }

  const startAndEndDates = useMemo(() => {
    if (selectedPackageId !== 'all') {
      const pkg = packagesList.find((p) => p.id === selectedPackageId)
      return {
        start: pkg?.purchaseDate ? formatDate(pkg.purchaseDate) : '—',
        end: pkg?.endDate ? formatDate(pkg.endDate) : '—',
      }
    }
    const activePkgs = packagesList.filter((p) => p.remainingSessions > 0)
    if (activePkgs.length === 0) return { start: '—', end: '—' }

    let earliestStart = new Date(activePkgs[0].purchaseDate)
    let latestEnd = activePkgs[0].endDate ? new Date(activePkgs[0].endDate) : null

    activePkgs.forEach((p) => {
      const s = new Date(p.purchaseDate)
      if (s < earliestStart) earliestStart = s
      if (p.endDate) {
        const e = new Date(p.endDate)
        if (!latestEnd || e > latestEnd) latestEnd = e
      }
    })

    return {
      start: formatDate(earliestStart.toISOString().split('T')[0]),
      end: latestEnd ? formatDate(latestEnd.toISOString().split('T')[0]) : '—',
    }
  }, [packagesList, selectedPackageId])

  const sessionsSummary = useMemo(() => {
    if (selectedPackageId !== 'all') {
      const pkg = packagesList.find((p) => p.id === selectedPackageId)
      if (!pkg) return { total: 0, remaining: 0, studied: 0 }
      return {
        total: pkg.totalSessions,
        remaining: pkg.remainingSessions,
        studied: pkg.totalSessions - pkg.remainingSessions,
      }
    }
    const activePkgs = packagesList.filter((p) => p.remainingSessions > 0)
    return activePkgs.reduce(
      (acc, p) => {
        acc.total += p.totalSessions
        acc.remaining += p.remainingSessions
        acc.studied += p.totalSessions - p.remainingSessions
        return acc
      },
      { total: 0, remaining: 0, studied: 0 }
    )
  }, [packagesList, selectedPackageId])

  const progressPercent = useMemo(() => {
    if (sessionsSummary.total === 0) return 0
    return Math.min(100, Math.round((sessionsSummary.studied / sessionsSummary.total) * 100))
  }, [sessionsSummary])

  const selectedPkg = useMemo(() => {
    if (selectedPackageId === 'all') return null
    return packagesList.find((p) => p.id === selectedPackageId) || null
  }, [packagesList, selectedPackageId])

  const isMathSubject = useMemo(() => {
    if (student.subject === 'math') return true
    const pkgName = selectedPkg?.packageName?.toLowerCase() || ''
    const lvl = (activeClass?.level || student.level || '').toLowerCase()
    return pkgName.includes('toán') || pkgName.includes('math') || lvl.includes('math') || lvl.includes('toán')
  }, [student, selectedPkg, activeClass])

  return (
    <div className="flex flex-col gap-3 text-xs">
      {/* 1. Trình độ */}
      <div className="rounded-xl border border-border/70 bg-card p-3 space-y-2 shadow-2xs">
        <div className="flex items-center justify-between pb-0.5">
          <span className="font-bold text-foreground flex items-center gap-1.5 text-xs">
            <BookOpen className="h-3.5 w-3.5 text-primary" /> Trình độ học viên
          </span>
          <button
            type="button"
            onClick={onEditLevel}
            className="text-muted-foreground hover:text-foreground cursor-pointer transition-colors p-1 rounded hover:bg-muted"
            title="Chỉnh sửa trình độ"
          >
            <Pencil className="h-3.5 w-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-2 gap-2 text-xs">
          <div>
            <div className="text-[11px] text-muted-foreground font-medium mb-0.5">Trình độ</div>
            <span className="font-extrabold text-primary bg-primary/10 px-2 py-0.5 rounded-md inline-block">
              {activeClass?.level || student.level || 'IELTS (5.0–5.5)'}
            </span>
          </div>
          <div>
            <div className="text-[11px] text-muted-foreground font-medium mb-0.5">Trình độ phụ</div>
            <strong className="text-foreground font-semibold">
              {activeClass?.subLevel || student.subLevel || 'IELTS (A1)'}
            </strong>
          </div>
          {isMathSubject && (
            <div>
              <div className="text-[11px] text-muted-foreground font-medium mb-0.5">Lớp</div>
              <strong className="text-foreground font-semibold">
                {student.schoolClass || 'Lớp 6'}
              </strong>
            </div>
          )}
        </div>
      </div>

      {/* 2. Thông tin gói (Gộp thời gian & Số buổi học tiến độ) */}
      <div className="rounded-xl border border-border/70 bg-card p-3 space-y-2 shadow-2xs">
        <div className="flex items-center justify-between pb-0.5">
          <span className="font-bold text-foreground flex items-center gap-1.5 text-xs">
            <Package className="h-3.5 w-3.5 text-primary" /> Thông tin gói
          </span>
          {selectedPackageId !== 'all' && (
            <button
              type="button"
              onClick={onEditSessions}
              className="text-muted-foreground hover:text-foreground cursor-pointer transition-colors p-1 rounded hover:bg-muted"
              title="Sửa số buổi gói"
            >
              <Pencil className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        <div className="space-y-2 text-xs">
          {/* Thời gian (Tách cột) */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <div className="text-[11px] text-muted-foreground font-medium mb-0.5">Ngày bắt đầu</div>
              <strong className="text-foreground font-semibold font-mono">{startAndEndDates.start}</strong>
            </div>
            <div>
              <div className="text-[11px] text-muted-foreground font-medium mb-0.5">Ngày kết thúc</div>
              <strong className="text-foreground font-semibold font-mono">{startAndEndDates.end}</strong>
            </div>
          </div>

          {/* Số buổi học & Tiến độ (Riêng phần đã học để nguyên) */}
          <div className="space-y-2 pt-1">
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground font-medium">Đã học / Tổng:</span>
              <strong className="text-foreground font-bold">
                {sessionsSummary.studied} / {sessionsSummary.total} buổi
              </strong>
            </div>

            {/* Progress bar */}
            <div className="space-y-1">
              <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full bg-primary transition-all duration-300 rounded-full"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
              <div className="flex justify-between text-[10px] text-muted-foreground font-medium">
                <span>Đã hoàn thành {progressPercent}%</span>
                <span>Còn lại {sessionsSummary.remaining} buổi</span>
              </div>
            </div>

            <div className="flex justify-between items-center pt-0.5">
              <span className="text-muted-foreground font-medium">Còn lại:</span>
              <div className="flex items-center gap-1.5">
                <strong className="text-emerald-600 dark:text-emerald-400 font-bold">
                  {sessionsSummary.remaining} buổi
                </strong>
                {selectedPackageId !== 'all' && sessionsSummary.remaining > 0 && (
                  <button
                    type="button"
                    onClick={() => toast.info('Tính năng chuyển phí đang được phát triển!')}
                    className="text-primary hover:bg-primary/10 p-1 rounded transition-colors"
                    title="Chuyển phí học viên"
                  >
                    <ArrowLeftRight className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Cơ sở & Phụ trách */}
      <div className="rounded-xl border border-border/70 bg-card p-3 space-y-2 shadow-2xs">
        <div className="flex items-center justify-between pb-0.5">
          <span className="font-bold text-foreground flex items-center gap-1.5 text-xs">
            <Building className="h-3.5 w-3.5 text-primary" /> Cơ sở & Phụ trách
          </span>
          <ChangeCSStaffPopover
            currentCSName={selectedCsm}
            branchName={currentBranch}
            onCSChange={(newName) => setSelectedCsm(newName)}
            iconOnly
          />
        </div>

        <div className="grid grid-cols-2 gap-2 text-xs">
          <div>
            <div className="text-[11px] text-muted-foreground font-medium mb-0.5">Cơ sở</div>
            <strong className="text-foreground font-bold">
              {currentBranch}
            </strong>
          </div>

          <div>
            <div className="text-[11px] text-muted-foreground font-medium mb-0.5">Phụ trách</div>
            <div className="flex items-center gap-1.5 font-bold text-xs text-foreground">
              <AppAvatar
                name={selectedCsm}
                size="xs"
                className="h-5 w-5 border border-primary/10 shrink-0"
              />
              <span>{selectedCsm}</span>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Ghi chú (Ở dưới cùng) */}
      <div className="rounded-xl border border-border/70 bg-card p-3 space-y-2 shadow-2xs">
        <div className="flex items-center justify-between pb-0.5">
          <span className="font-bold text-foreground flex items-center gap-1.5 text-xs">
            <FileText className="h-3.5 w-3.5 text-primary" /> Ghi chú
          </span>
        </div>

        <div className="text-xs text-foreground/90 leading-relaxed font-medium bg-muted/30 p-2 rounded-lg">
          {student.notes || 'Học lực khá, hơi nhút nhát, cần giáo viên chú ý gọi phát biểu bài thường xuyên.'}
        </div>
      </div>
    </div>
  )
}
