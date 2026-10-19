'use client'

import React, { useState, useMemo } from 'react'
import {
  Phone,
  Mail,
  MapPin,
  ShieldCheck,
  Copy,
  Check,
  BarChart3,
  AlertCircle,
  Plus,
  BookOpen,
} from 'lucide-react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import { AppAvatar } from '@/components/shared'
import { Badge } from '@/components/ui/badge'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import type { QcIncident } from '@/mocks/qcChecks'
import { QC_CRITERIA_LABELS, QC_ERROR_STATUS_LABELS } from '@/mocks/qcChecks'
import type { QcPersonnelGroup } from './qcPersonnelTypes'
import {
  formatStaffName,
  getPersonnelProfile,
} from './qcPersonnelHelpers'
import { formatDateTime } from './qcCheckHelpers'
import { getStatusBadgeClass } from '@/lib/statusColors'
import { QcTagHoverCard } from './QcTagHoverCard'

export interface QcDetailProfilePanelProps {
  personnelGroup?: QcPersonnelGroup | null
  activeIncident: QcIncident
  incidents: QcIncident[]
  onSelectIncident: (id: string) => void
  onCreateNewIssue?: () => void
}

export function QcDetailProfilePanel({
  personnelGroup,
  activeIncident,
  incidents,
  onSelectIncident,
  onCreateNewIssue,
}: QcDetailProfilePanelProps) {
  const [copiedKey, setCopiedKey] = useState<string | null>(null)

  // Determine personnel identification
  const personnelName =
    personnelGroup?.personnelName ||
    activeIncident.teacherName ||
    activeIncident.assignee ||
    'Nhân sự trung tâm'
  const cleanName = formatStaffName(personnelName)

  const role =
    personnelGroup?.role ||
    (activeIncident.targetGroup === 'teacher'
      ? activeIncident.subject
        ? `Giáo viên ${activeIncident.subject}`
        : 'Giáo viên'
      : activeIncident.targetGroup === 'facility'
        ? 'Kỹ thuật cơ sở'
        : 'Chuyên viên CSM')

  const branch = personnelGroup?.branch || activeIncident.branch || 'RinoEdu Nguyễn Tuân'

  // Profile data (code, phone, email, directManager, department)
  const profile = useMemo(() => {
    if (personnelGroup?.profile) return personnelGroup.profile
    return getPersonnelProfile(cleanName, activeIncident.targetGroup)
  }, [personnelGroup, cleanName, activeIncident.targetGroup])

  // Assigned classes
  const assignedClasses = useMemo(() => {
    if (
      personnelGroup?.locationContext?.assignedClasses &&
      personnelGroup.locationContext.assignedClasses.length > 0
    ) {
      return personnelGroup.locationContext.assignedClasses
    }
    const set = new Set<string>()
    incidents.forEach((inc) => {
      if (inc.className) set.add(inc.className)
    })
    if (activeIncident.className) set.add(activeIncident.className)
    return Array.from(set)
  }, [personnelGroup, incidents, activeIncident])

  // Error statistics
  const errorStats = useMemo(() => {
    if (personnelGroup?.errorStats) return personnelGroup.errorStats
    const current30DaysCount = incidents.length
    const currentOpenCount = incidents.filter(
      (i) => i.status !== 'closed' && i.status !== 'cancelled'
    ).length
    return {
      current30DaysCount,
      currentOpenCount,
      previousMonthCount: 1,
      previousMonthOpenCount: 0,
    }
  }, [personnelGroup, incidents])

  const closedCount = errorStats.current30DaysCount - errorStats.currentOpenCount
  const resolutionRate =
    errorStats.current30DaysCount > 0
      ? Math.round((closedCount / errorStats.current30DaysCount) * 100)
      : 100

  // Các lỗi hiện tại cần xử lý / giải trình (ưu tiên lỗi mở, đang sửa hoặc chưa đạt)
  const currentIncidents = useMemo(() => {
    const activeList = incidents.filter(
      (i) => i.status !== 'closed' && i.status !== 'cancelled'
    )
    return activeList.length > 0 ? activeList : incidents
  }, [incidents])

  const handleCopy = async (text: string, key: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedKey(key)
      toast.success(`Đã sao chép ${label}!`)
      setTimeout(() => setCopiedKey(null), 2000)
    } catch {
      toast.error(`Không thể sao chép ${label}!`)
    }
  }

  return (
    <div className="space-y-2.5 flex flex-col min-h-0 text-left">
      {/* ─── SECTION 1: THÔNG TIN ĐỐI TƯỢNG (Đóng khung chuẩn) ─── */}
      <div className="rounded-xl border border-border/80 bg-card p-3 shadow-2xs space-y-2">
        <div className="flex items-start gap-3 min-w-0">
          {/* Avatar + Badge Mã ID */}
          <div className="flex flex-col items-center gap-1.5 shrink-0">
            <AppAvatar
              src={profile.avatar}
              name={cleanName}
              className="h-12 w-12 rounded-full border-2 border-background shadow-xs ring-1 ring-border/50"
            />
            <span
              className="inline-flex items-center gap-1 text-[11px] px-1.5 py-0.5 rounded-md font-mono font-bold bg-primary/10 text-primary border border-primary/20 shrink-0"
              title="Mã nhân sự hệ thống"
            >
              <ShieldCheck className="h-3 w-3" />
              {profile.code}
            </span>
          </div>

          {/* Cột thông tin chi tiết */}
          <div className="min-w-0 flex-1 space-y-1">
            {/* Dòng 1: Họ tên + Badge vai trò */}
            <div className="flex items-center justify-between gap-1 flex-wrap">
              <span className="text-[15px] font-bold text-foreground truncate">
                {cleanName}
              </span>
              <Badge
                variant="outline"
                className="text-[11px] font-normal border-primary/30 bg-primary/5 text-primary shrink-0"
              >
                {role}
              </Badge>
            </div>

            {/* Dòng 2: Cơ sở + Tổ / Bộ phận */}
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground flex-wrap">
              <span className="inline-flex items-center gap-1 text-foreground/90 font-normal">
                <MapPin className="h-3 w-3 text-muted-foreground shrink-0" />
                {branch}
              </span>
              <span className="text-border/80">•</span>
              <span className="truncate">{profile.department || 'Cơ sở chi nhánh'}</span>
            </div>

            {/* Dòng 3: SĐT + Email (kèm nút copy) */}
            <div className="flex items-center gap-2 text-xs text-muted-foreground flex-wrap pt-0.5">
              <div className="inline-flex items-center gap-1">
                <Phone className="h-3 w-3 text-muted-foreground shrink-0" />
                <span className="font-mono text-foreground/90 font-normal">{profile.phone}</span>
                <button
                  type="button"
                  onClick={() => handleCopy(profile.phone, 'phone', 'SĐT')}
                  className="p-0.5 hover:bg-muted rounded text-muted-foreground hover:text-foreground cursor-pointer transition-colors"
                  title="Sao chép SĐT"
                >
                  {copiedKey === 'phone' ? (
                    <Check className="h-3 w-3 text-emerald-600" />
                  ) : (
                    <Copy className="h-3 w-3" />
                  )}
                </button>
              </div>

              <span className="text-border/80">•</span>

              <div className="inline-flex items-center gap-1">
                <Mail className="h-3 w-3 text-muted-foreground shrink-0" />
                <span className="font-mono text-foreground/90 font-normal truncate max-w-[130px]">
                  {profile.email}
                </span>
                <button
                  type="button"
                  onClick={() => handleCopy(profile.email, 'email', 'Email')}
                  className="p-0.5 hover:bg-muted rounded text-muted-foreground hover:text-foreground cursor-pointer transition-colors"
                  title="Sao chép Email"
                >
                  {copiedKey === 'email' ? (
                    <Check className="h-3 w-3 text-emerald-600" />
                  ) : (
                    <Copy className="h-3 w-3" />
                  )}
                </button>
              </div>
            </div>

            {/* Dòng 4: Lớp phụ trách hoặc Quản lý trực tiếp */}
            <div className="pt-0.5 text-xs text-muted-foreground flex items-center gap-1.5 flex-wrap">
              {assignedClasses.length > 0 ? (
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-muted-foreground inline-flex items-center gap-1">
                    <BookOpen className="h-3 w-3" />
                    Lớp:
                  </span>
                  <span className="font-medium text-foreground">{assignedClasses[0]}</span>
                  {assignedClasses.length > 1 && (
                    <Popover>
                      <PopoverTrigger asChild>
                        <button
                          type="button"
                          className="text-primary hover:underline text-[11px] font-medium cursor-pointer"
                        >
                          (+{assignedClasses.length - 1} lớp khác)
                        </button>
                      </PopoverTrigger>
                      <PopoverContent className="w-56 p-2 text-xs space-y-1" align="start">
                        <p className="font-bold text-foreground pb-1 border-b">
                          Danh sách lớp phụ trách ({assignedClasses.length})
                        </p>
                        <div className="space-y-1">
                          {assignedClasses.map((cls) => (
                            <div key={cls} className="py-0.5 text-muted-foreground">
                              • {cls}
                            </div>
                          ))}
                        </div>
                      </PopoverContent>
                    </Popover>
                  )}
                </div>
              ) : (
                <div className="flex items-center gap-1.5">
                  <span className="text-muted-foreground">Quản lý trực tiếp:</span>
                  <span className="font-medium text-foreground">
                    {profile.directManager || 'Ban Giám đốc'}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ─── SECTION 2: THỐNG KÊ VI PHẠM (Đóng khung các thông số thống kê) ─── */}
      <div className="rounded-xl border border-border/80 bg-card p-3 shadow-2xs space-y-2">
        <div className="flex items-center justify-between border-b border-border/40 pb-1.5">
          <div className="flex items-center gap-1.5">
            <BarChart3 className="h-3.5 w-3.5 text-primary shrink-0" />
            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Thống kê vi phạm
            </span>
          </div>
          <span className="text-[11px] text-muted-foreground font-normal">
            Chu kỳ 30 ngày
          </span>
        </div>

        {/* 3 Ô ĐÓNG KHUNG GỌN GÀNG */}
        <div className="grid grid-cols-3 gap-2">
          {/* Ô 1: 30 ngày qua */}
          <div className="rounded-lg border border-border/70 bg-background/80 p-2 space-y-0.5 text-left">
            <span className="text-[11px] text-muted-foreground block">30 ngày qua</span>
            <div className="flex items-baseline gap-1">
              <span className="text-base font-bold text-foreground">
                {errorStats.current30DaysCount}
              </span>
              <span className="text-[10px] text-muted-foreground">lỗi</span>
            </div>
            <div className="text-[10px] text-muted-foreground flex items-center gap-1 pt-0.5">
              <span
                className={cn(
                  'font-semibold',
                  errorStats.currentOpenCount > 0 ? 'text-destructive' : 'text-muted-foreground'
                )}
              >
                {errorStats.currentOpenCount} mở
              </span>
              <span>•</span>
              <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
                {closedCount} đóng
              </span>
            </div>
          </div>

          {/* Ô 2: Tháng trước */}
          <div className="rounded-lg border border-border/70 bg-background/80 p-2 space-y-0.5 text-left">
            <span className="text-[11px] text-muted-foreground block">Tháng trước</span>
            <div className="flex items-baseline gap-1">
              <span className="text-base font-bold text-foreground">
                {errorStats.previousMonthOpenCount ?? 0}/{errorStats.previousMonthCount}
              </span>
              <span className="text-[10px] text-muted-foreground">lỗi</span>
            </div>
            <span className="text-[10px] text-muted-foreground block pt-0.5 truncate">
              {errorStats.previousMonthCount > 0 ? 'Đã hoàn tất' : 'Không có'}
            </span>
          </div>

          {/* Ô 3: Tỷ lệ đóng */}
          <div className="rounded-lg border border-border/70 bg-background/80 p-2 space-y-0.5 text-left">
            <span className="text-[11px] text-muted-foreground block">Tỷ lệ đóng</span>
            <div className="flex items-baseline gap-1">
              <span className="text-base font-bold text-emerald-600 dark:text-emerald-400">
                {resolutionRate}%
              </span>
            </div>
            <span className="text-[10px] text-muted-foreground block pt-0.5 truncate">
              {resolutionRate >= 80 ? 'Chuẩn đạt' : 'Cần chú ý'}
            </span>
          </div>
        </div>
      </div>

      {/* ─── SECTION 3: CÁC LỖI HIỆN TẠI (Chọn từng lỗi để giải trình, hover mở modal lỗi) ─── */}
      <div className="rounded-xl border border-border/80 bg-card p-3 shadow-2xs space-y-2 flex-1 flex flex-col min-h-0">
        <div className="flex items-center justify-between border-b border-border/40 pb-1.5 shrink-0">
          <div className="flex items-center gap-1.5">
            <AlertCircle className="h-3.5 w-3.5 text-amber-500 shrink-0" />
            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Các lỗi hiện tại
            </span>
            <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-full bg-muted text-muted-foreground border">
              {currentIncidents.length} lỗi
            </span>
          </div>

          {onCreateNewIssue && (
            <button
              type="button"
              onClick={onCreateNewIssue}
              className="inline-flex items-center gap-1 text-[11px] text-primary hover:underline font-medium cursor-pointer"
              title="Ghi nhận lỗi vi phạm mới cho đối tượng này"
            >
              <Plus className="h-3 w-3" />
              <span>Ghi nhận lỗi</span>
            </button>
          )}
        </div>

        {/* Danh sách các lỗi hiện tại (tự co giãn, KHÔNG thanh cuộn lồng) */}
        <div className="space-y-1.5 pt-0.5">
          {currentIncidents.map((inc) => {
            const isSelected = inc.id === activeIncident.id
            const displayTitle = inc.title || QC_CRITERIA_LABELS[inc.criteria]

            return (
              <div
                key={inc.id}
                onClick={() => onSelectIncident(inc.id)}
                className={cn(
                  'group rounded-lg border p-2.5 text-xs transition-all cursor-pointer space-y-1.5',
                  isSelected
                    ? 'border-primary bg-primary/10 ring-1 ring-primary/30 shadow-2xs font-medium'
                    : 'border-border/70 bg-background/80 hover:bg-muted/60 text-muted-foreground'
                )}
              >
                {/* Dòng 1: Thẻ lỗi (HoverCard mở modal thông tin lỗi từ màn danh sách!) + Mã + Trạng thái */}
                <div className="flex items-center justify-between gap-1.5">
                  <div className="flex items-center gap-1.5 min-w-0">
                    {/* Thẻ lỗi: khi hover vào, mở hovercard xem đầy đủ thông tin sự cố */}
                    <div onClick={(e) => e.stopPropagation()}>
                      <QcTagHoverCard incident={inc} onViewDetail={onSelectIncident} />
                    </div>
                    <span className="font-mono text-[10px] text-muted-foreground font-semibold">
                      {inc.code}
                    </span>
                  </div>

                  <span
                    className={cn(
                      'text-[10px] px-1.5 py-0.2 rounded font-normal shrink-0',
                      getStatusBadgeClass(inc.status)
                    )}
                  >
                    {QC_ERROR_STATUS_LABELS[inc.status]}
                  </span>
                </div>

                {/* Dòng 2: Tiêu đề lỗi vi phạm */}
                <p
                  className={cn(
                    'text-xs leading-snug line-clamp-2',
                    isSelected ? 'text-foreground font-semibold' : 'text-foreground/90 font-normal'
                  )}
                  title={displayTitle}
                >
                  {displayTitle}
                </p>

                {/* Dòng 3: Thời gian tạo & Người phát hiện */}
                <div className="flex items-center justify-between text-[10px] text-muted-foreground pt-0.5">
                  <span>{formatDateTime(inc.createdAt)}</span>
                  <span>Bởi: {formatStaffName(inc.issuedBy)}</span>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
