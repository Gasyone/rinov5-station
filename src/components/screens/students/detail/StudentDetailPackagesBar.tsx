'use client'

import { useState, useMemo, useRef, useEffect } from 'react'
import {
  Pencil,
  ArrowLeftRight,
  CheckCircle2,
  HelpCircle,
  XCircle,
} from 'lucide-react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import { getStatusColors } from '@/lib/statusColors'
import type { StudentPackage } from './studentDetailTypes'
import type { EnrolledClass, Student } from '@/mocks/students'
import { StudentDetailPackagesMoreMenu } from './StudentDetailPackagesMoreMenu'

interface StudentDetailPackagesBarProps {
  packagesList: StudentPackage[]
  selectedPackageId: string
  setSelectedPackageId: (id: string) => void
  student: Student
  activeClass: EnrolledClass | null
  onEditLevel: () => void
  onEditSessions: () => void
  hideMetadata?: boolean
}

export function StudentDetailPackagesBar({
  packagesList,
  selectedPackageId,
  setSelectedPackageId,
  student,
  activeClass,
  onEditLevel,
  onEditSessions,
  hideMetadata = false,
}: StudentDetailPackagesBarProps) {
  // ResizeObserver to dynamically compute package buttons fit count
  const containerRef = useRef<HTMLDivElement>(null)
  const [containerWidth, setContainerWidth] = useState(1000)

  useEffect(() => {
    if (!containerRef.current) return
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setContainerWidth(entry.contentRect.width)
      }
    })
    observer.observe(containerRef.current)
    return () => observer.disconnect()
  }, [])

  const getPackageIcon = (pkg: StudentPackage) => {
    if (pkg.remainingSessions === 0) {
      return <XCircle className={cn('h-4 w-4 shrink-0', getStatusColors('neutral').text)} />
    }
    if (pkg.linkedClassCode) {
      return <CheckCircle2 className={cn('h-4 w-4 shrink-0', getStatusColors('success').text)} />
    }
    return <HelpCircle className={cn('h-4 w-4 shrink-0', getStatusColors('warning').text)} />
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

  // Active packages are candidates to be displayed inline
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

  const { shownPackages, hiddenPackages } = useMemo(() => {
    const itemWidth = 180
    const dropdownButtonWidth = 120

    // Find the optimal number of inline active packages to show
    let bestL = 0
    for (let L = activePackages.length; L >= 0; L--) {
      // We need "Xem thêm" if there are any expired packages OR if active packages don't all fit
      const hasHidden = expiredPackages.length > 0 || activePackages.length > L
      const requiredWidth = L * itemWidth + (hasHidden ? dropdownButtonWidth : 0)
      if (requiredWidth <= containerWidth) {
        bestL = L
        break
      }
    }

    // Ensure we show at least 1 package if there is at least one active package
    if (bestL === 0 && activePackages.length > 0) {
      bestL = 1
    }

    const shown = activePackages.slice(0, bestL)
    const hidden = [
      ...activePackages.slice(bestL),
      ...expiredPackages,
    ]

    return { shownPackages: shown, hiddenPackages: hidden }
  }, [activePackages, expiredPackages, containerWidth])

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

  const renderPackageButtons = () => (
    <div ref={containerRef} className="flex flex-nowrap items-center gap-2 select-none overflow-hidden">
      {shownPackages.map((pkg) => (
        <button
          key={pkg.id}
          type="button"
          onClick={() => handleSelectPackage(pkg.id)}
          className={cn(
            "flex h-9 max-w-[260px] shrink-0 cursor-pointer items-center gap-2 rounded-[10px] border-[1.5px] px-3.5 text-[13px] font-bold shadow-xs transition-colors",
            selectedPackageId === pkg.id
              ? "border-[#1ea7c9] bg-[#1ea7c9] text-white hover:bg-[#198cad]"
              : "border-[#d8e2e5] bg-background text-muted-foreground hover:border-[#b8c9ce] hover:bg-muted/40 hover:text-foreground"
          )}
          title={pkg.packageName}
        >
          {getPackageIcon(pkg)}
          <span className="min-w-0 truncate">{pkg.packageName}</span>
          {pkg.remainingSessions === 0 && <span className="text-[9px] opacity-75 font-normal">(Hết)</span>}
        </button>
      ))}

      {hiddenPackages.length > 0 && (
        <StudentDetailPackagesMoreMenu
          packages={hiddenPackages}
          selectedPackageId={selectedPackageId}
          onSelectPackage={handleSelectPackage}
          renderPackageIcon={getPackageIcon}
        />
      )}
    </div>
  )

  if (hideMetadata) {
    return (
      <div className="w-full pt-1">
        {renderPackageButtons()}
      </div>
    )
  }

  return (
    <div className="mt-0.5 flex w-full flex-col gap-3">
      {/* Row 1: Gói hiển thị */}
      {renderPackageButtons()}

      {/* 3 Columns Grid for Metadata: Trình độ & Lớp, Số buổi, Thời gian */}
      <div className="grid grid-cols-1 gap-y-2 text-[13px] md:grid-cols-3 md:divide-x md:divide-border/50">
        {/* Column 1: Trình độ & Lớp */}
        <div className="flex flex-col gap-1 md:pr-5">
          <span className="text-[10px] font-bold uppercase text-muted-foreground tracking-wider">Trình độ & Lớp</span>
          <div className="space-y-0.5">
            <div className="flex justify-between md:justify-start md:gap-2 text-muted-foreground items-center">
              <span>Trình độ:</span>
              <strong className="text-foreground font-semibold">
                {activeClass?.level || student.level || '-'} ({activeClass?.subLevel || student.subLevel || 'Chưa test'})
              </strong>
              <button
                type="button"
                onClick={onEditLevel}
                className="ml-1 text-muted-foreground hover:text-foreground cursor-pointer transition-colors p-0.5 rounded hover:bg-muted"
                title="Sửa nhanh trình độ"
              >
                <Pencil className="h-3 w-3" />
              </button>
            </div>
            <div className="flex justify-between md:justify-start md:gap-2 text-muted-foreground">
              <span>Lớp học:</span>
              <strong className="text-foreground font-semibold">{activeClass?.className || student.schoolClass || '—'}</strong>
            </div>
          </div>
        </div>

        {/* Column 2: Số buổi */}
        <div className="flex flex-col gap-1 md:px-5">
          <span className="text-[10px] font-bold uppercase text-muted-foreground tracking-wider">Số buổi</span>
          <div className="space-y-0.5">
            <div className="flex justify-between md:justify-start md:gap-2 text-muted-foreground items-center">
              <span>Đã học/Tổng:</span>
              <strong className="text-foreground font-semibold">{sessionsSummary.studied}/{sessionsSummary.total} buổi</strong>
              {selectedPackageId !== 'all' && (
                <button
                  type="button"
                  onClick={onEditSessions}
                  className="ml-1 text-muted-foreground hover:text-foreground cursor-pointer transition-colors p-0.5 rounded hover:bg-muted"
                  title="Sửa nhanh số buổi gói"
                >
                  <Pencil className="h-3 w-3" />
                </button>
              )}
            </div>
            <div className="flex justify-between md:justify-start md:gap-2 text-muted-foreground items-center">
              <span>Còn lại:</span>
              <strong className="text-foreground font-semibold">{sessionsSummary.remaining} buổi</strong>
              {selectedPackageId !== 'all' && sessionsSummary.remaining > 0 && (
                <button
                  type="button"
                  onClick={() => toast.info('Tính năng đang được phát triển!')}
                  className="ml-1 text-primary hover:text-primary-foreground hover:bg-primary/10 cursor-pointer transition-colors p-0.5 rounded"
                  title="Chuyển phí học viên"
                >
                  <ArrowLeftRight className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Column 3: Thời gian */}
        <div className="flex flex-col gap-1 md:pl-5">
          <span className="text-[10px] font-bold uppercase text-muted-foreground tracking-wider">Thời gian</span>
          <div className="space-y-0.5">
            <div className="flex justify-between md:justify-start md:gap-2 text-muted-foreground">
              <span>Ngày bắt đầu:</span>
              <strong className="text-foreground font-semibold">{startAndEndDates.start}</strong>
            </div>
            <div className="flex justify-between md:justify-start md:gap-2 text-muted-foreground">
              <span>Ngày kết thúc:</span>
              <strong className="text-foreground font-semibold">{startAndEndDates.end}</strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
