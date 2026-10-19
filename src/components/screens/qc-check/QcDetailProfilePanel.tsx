'use client'

import React, { useState, useMemo } from 'react'
import {
  Phone,
  Mail,
  ShieldCheck,
  Copy,
  Check,
  Plus,
  MapPin,
  History,
  Pencil,
  UserCog,
  XCircle,
  ChevronDown,
} from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import { AppAvatar } from '@/components/shared'
import { Badge } from '@/components/ui/badge'
import type { QcIncident } from '@/mocks/qcChecks'
import {
  QC_CRITERIA_LABELS,
  QC_ERROR_STATUS_LABELS,
  QC_TARGET_GROUP_LABELS,
} from '@/mocks/qcChecks'
import type { QcPersonnelGroup } from './qcPersonnelTypes'
import {
  formatStaffName,
  getPersonnelProfile,
} from './qcPersonnelHelpers'
import { getStatusBadgeClass } from '@/lib/statusColors'
import { SEVERITY_CONFIG } from './qcCheckTypes'
import { QcTagHoverCard } from './QcTagHoverCard'

export interface QcDetailProfilePanelProps {
  personnelGroup?: QcPersonnelGroup | null
  activeIncident: QcIncident
  incidents: QcIncident[]
  onSelectIncident: (id: string) => void
  onCreateNewIssue?: () => void
  onZoomImage?: (url: string) => void
  onOpenHistory?: () => void
  onOpenChangeAssignee?: (incident: QcIncident) => void
  onCancelIncident?: (incidentId: string) => void
}

export function QcDetailProfilePanel({
  personnelGroup,
  activeIncident,
  incidents,
  onSelectIncident,
  onCreateNewIssue,
  onOpenHistory,
  onOpenChangeAssignee,
  onCancelIncident,
}: QcDetailProfilePanelProps) {
  const [copiedKey, setCopiedKey] = useState<string | null>(null)

  // Determine personnel identification
  const personnelName =
    personnelGroup?.personnelName ||
    activeIncident.teacherName ||
    activeIncident.assignee ||
    'Nhân sự trung tâm'
  const cleanName = formatStaffName(personnelName)

  // Profile data (code, phone, email, directManager, department, position, subject, branches)
  const profile = useMemo(() => {
    if (personnelGroup?.profile) return personnelGroup.profile
    return getPersonnelProfile(cleanName, activeIncident.targetGroup)
  }, [personnelGroup, cleanName, activeIncident.targetGroup])

  const displayPosition = useMemo(() => {
    if (profile.position) return profile.position
    if (personnelGroup?.role) return personnelGroup.role
    if (activeIncident.targetGroup === 'teacher') return 'Giáo viên'
    if (activeIncident.targetGroup === 'facility') return 'Kỹ thuật cơ sở'
    if (activeIncident.targetGroup === 'operations') return 'Chuyên viên CSM'
    return 'Nhân sự'
  }, [profile.position, personnelGroup, activeIncident.targetGroup])

  const displaySubject = useMemo(() => {
    if (profile.subject) return profile.subject
    if (activeIncident.subject) return activeIncident.subject
    if (personnelGroup?.locationContext?.subject) return personnelGroup.locationContext.subject
    return undefined
  }, [profile.subject, activeIncident.subject, personnelGroup])

  const assignedBranches = useMemo(() => {
    const list = new Set<string>()
    if (profile.branches && profile.branches.length > 0) {
      profile.branches.forEach((b) => list.add(b))
    }
    if (personnelGroup?.branch) list.add(personnelGroup.branch)
    if (activeIncident.branch) list.add(activeIncident.branch)
    incidents.forEach((inc) => {
      if (inc.branch) list.add(inc.branch)
    })
    return Array.from(list)
  }, [profile.branches, personnelGroup, activeIncident.branch, incidents])

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

  // Danh sách sự cố đang xử lý (hiển thị mặc định ở trên)
  const activeIncidents = useMemo(() => {
    return incidents
      .filter((i) => i.status !== 'closed' && i.status !== 'cancelled')
      .sort((a, b) => {
        const timeDiff = new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        if (timeDiff !== 0) return timeDiff
        return a.id.localeCompare(b.id)
      })
  }, [incidents])

  // Danh sách sự cố đã đóng (mở rộng ở dưới cùng)
  const closedIncidents = useMemo(() => {
    return incidents
      .filter((i) => i.status === 'closed')
      .sort((a, b) => {
        const timeDiff =
          new Date(b.closedAt || b.createdAt).getTime() -
          new Date(a.closedAt || a.createdAt).getTime()
        if (timeDiff !== 0) return timeDiff
        return a.id.localeCompare(b.id)
      })
  }, [incidents])

  // Trạng thái mở rộng lịch sử đã đóng ở dưới cùng (mặc định mở nếu sự cố đang chọn đã đóng)
  const [userClosedExpanded, setUserClosedExpanded] = useState<boolean | null>(null)
  const isClosedExpanded =
    userClosedExpanded !== null ? userClosedExpanded : activeIncident?.status === 'closed'

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
    <div className="space-y-3 flex flex-col min-h-0 text-left">
      {/* ─── SECTION 1: THÔNG TIN ĐỐI TƯỢNG (Đóng khung chuẩn) ─── */}
      <div className="rounded-xl border border-border/80 bg-card p-3 shadow-2xs space-y-2.5">
        <div className="flex items-start gap-3 min-w-0">
          {/* Avatar */}
          <div className="shrink-0 pt-0.5">
            <AppAvatar
              src={profile.avatar}
              name={cleanName}
              className="h-11 w-11 rounded-full border-2 border-background shadow-xs ring-1 ring-border/50"
            />
          </div>

          {/* Cột thông tin chi tiết */}
          <div className="min-w-0 flex-1 space-y-1">
            {/* Dòng 1: Họ tên */}
            <div className="flex items-center justify-between gap-1 flex-wrap">
              <span className="text-[15px] font-bold text-foreground truncate">
                {cleanName}
              </span>
            </div>

            {/* Dòng 2: Mã dưới tên, Chức vụ, Môn nếu có */}
            <div className="flex items-center gap-1.5 flex-wrap text-xs">
              <span
                className="inline-flex items-center gap-1 text-[11px] px-1.5 py-0.2 rounded-md font-mono font-bold bg-primary/10 text-primary border border-primary/20 shrink-0"
                title="Mã nhân sự hệ thống"
              >
                <ShieldCheck className="h-3 w-3" />
                {profile.code}
              </span>

              <span className="text-border/80">•</span>

              <span className="text-xs font-medium text-foreground/90">
                {displayPosition}
              </span>

              {displaySubject && (
                <>
                  <span className="text-border/80">•</span>
                  <Badge
                    variant="outline"
                    className="text-[10px] px-1.5 py-0 h-4.5 font-normal border-primary/30 bg-primary/5 text-primary shrink-0"
                  >
                    Môn: {displaySubject}
                  </Badge>
                </>
              )}
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
          </div>
        </div>

        {/* Dòng bên dưới: Các cơ sở phụ trách */}
        {assignedBranches.length > 0 && (
          <div className="pt-2 border-t border-border/50 flex items-start gap-1.5 text-xs text-muted-foreground">
            <MapPin className="h-3.5 w-3.5 text-muted-foreground shrink-0 mt-0.5" />
            <div className="flex items-center gap-1.5 flex-wrap flex-1 min-w-0">
              <span className="text-[11px] text-muted-foreground font-normal shrink-0">
                Cơ sở phụ trách:
              </span>
              <div className="flex items-center gap-1 flex-wrap">
                {assignedBranches.map((br) => (
                  <Badge
                    key={br}
                    variant="secondary"
                    className="text-[10px] font-normal px-1.5 py-0 h-4.5 bg-muted/80 text-foreground border border-border/40"
                  >
                    {br}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ─── SECTION 2: THỐNG KÊ VI PHẠM ─── */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between pb-0.5">
          <span className="text-xs font-semibold text-foreground">
            Thống kê vi phạm
          </span>
          <span className="text-[11px] text-muted-foreground font-normal">
            Chu kỳ 30 ngày
          </span>
        </div>

        {/* 3 Ô ĐÓNG KHUNG GỌN GÀNG - CHỈ 2 DÒNG */}
        <div className="grid grid-cols-3 gap-2">
          {/* Ô 1: 30 ngày qua */}
          <div className="rounded-lg border border-border/70 bg-background/80 p-2 space-y-0.5 text-left">
            <span className="text-[11px] text-muted-foreground block truncate">30 ngày qua</span>
            <div className="flex items-baseline gap-1">
              <span className="text-base font-bold text-foreground">
                {errorStats.current30DaysCount}
              </span>
              <span className="text-[10px] text-muted-foreground">lỗi</span>
              {errorStats.currentOpenCount > 0 && (
                <span className="text-[10px] font-semibold text-destructive ml-0.5">
                  ({errorStats.currentOpenCount} mở)
                </span>
              )}
            </div>
          </div>

          {/* Ô 2: Tháng trước */}
          <div className="rounded-lg border border-border/70 bg-background/80 p-2 space-y-0.5 text-left">
            <span className="text-[11px] text-muted-foreground block truncate">Tháng trước</span>
            <div className="flex items-baseline gap-1">
              <span className="text-base font-bold text-foreground">
                {errorStats.previousMonthOpenCount ?? 0}/{errorStats.previousMonthCount}
              </span>
              <span className="text-[10px] text-muted-foreground">lỗi</span>
            </div>
          </div>

          {/* Ô 3: Tỷ lệ đóng */}
          <div className="rounded-lg border border-border/70 bg-background/80 p-2 space-y-0.5 text-left">
            <span className="text-[11px] text-muted-foreground block truncate">Tỷ lệ đóng</span>
            <div className="flex items-baseline gap-1">
              <span className="text-base font-bold text-emerald-600 dark:text-emerald-400">
                {resolutionRate}%
              </span>
            </div>
          </div>
        </div>

      </div>

      {/* ─── SECTION 3: THẺ VI PHẠM (QC TAGS) - 2 DÒNG GỌN GÀNG, ĐỒNG BỘ 100% ─── */}
      <div className="space-y-1.5 flex-1 flex flex-col min-h-0">
        {/* Header Section 3: Bỏ hoàn toàn các tab lọc, chỉ hiển thị số lượng và nút Thêm mới */}
        <div className="flex items-center justify-between pb-0.5 shrink-0 flex-wrap gap-1.5">
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-semibold text-foreground">
              Thẻ vi phạm (QC Tags)
            </span>
            <span className="text-[10px] font-semibold px-1.5 py-0.2 rounded-full bg-primary/10 text-primary border border-primary/20">
              {activeIncidents.length} đang xử lý
            </span>
          </div>

          {onCreateNewIssue && (
            <button
              type="button"
              onClick={onCreateNewIssue}
              className="h-6 w-6 rounded border border-dashed border-primary/40 bg-primary/5 hover:bg-primary/20 text-primary flex items-center justify-center cursor-pointer transition-colors shrink-0"
              title="Ghi nhận lỗi vi phạm mới cho đối tượng này"
              aria-label="Thêm lỗi mới"
            >
              <Plus className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        {/* Danh sách các thẻ vi phạm đang xử lý: CHỈ 2 DÒNG MỖI THẺ */}
        <div className="space-y-1.5 pt-0.5">
          {activeIncidents.length === 0 ? (
            <div className="rounded-lg border border-dashed border-border/70 p-3 text-center text-xs text-muted-foreground">
              Không có sự cố nào đang xử lý.
            </div>
          ) : (
            activeIncidents.map((inc) => {
              const isSelected = inc.id === activeIncident.id
              const displayTitle = inc.title || QC_CRITERIA_LABELS[inc.criteria]
              const sev = SEVERITY_CONFIG[inc.severity] || SEVERITY_CONFIG.medium
              const SevIcon = sev.icon

              return (
                <div
                  key={inc.id}
                  onClick={() => onSelectIncident(inc.id)}
                  className={cn(
                    'group rounded-lg border px-2.5 py-2 text-xs transition-all cursor-pointer space-y-1 text-left',
                    isSelected
                      ? 'border-primary bg-primary/10 ring-1 ring-primary/30 shadow-2xs font-medium'
                      : 'border-border/70 bg-background/80 hover:bg-muted/60 text-muted-foreground'
                  )}
                >
                  {/* Dòng 1: Tag vi phạm + Nhóm đối tượng + Mức độ + Trạng thái + Icon Chỉnh sửa */}
                  <div className="flex items-center justify-between gap-1.5">
                    <div className="flex items-center gap-1.5 min-w-0 flex-wrap">
                      <div onClick={(e) => e.stopPropagation()}>
                        <QcTagHoverCard incident={inc} onViewDetail={onSelectIncident} />
                      </div>
                      {inc.targetGroup && (
                        <Badge variant="outline" className="text-[10px] px-1 py-0 h-4 font-normal">
                          {QC_TARGET_GROUP_LABELS[inc.targetGroup]}
                        </Badge>
                      )}
                      <span className="inline-flex items-center shrink-0" title={`Mức độ: ${sev.label}`}>
                        <SevIcon className={cn('h-3.5 w-3.5', sev.color)} />
                      </span>
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      <span
                        className={cn(
                          'text-[10px] px-1.5 py-0.2 rounded font-normal shrink-0',
                          getStatusBadgeClass(inc.status)
                        )}
                      >
                        {QC_ERROR_STATUS_LABELS[inc.status]}
                      </span>

                      {inc.status !== 'closed' && inc.status !== 'cancelled' && (
                        <div onClick={(e) => e.stopPropagation()}>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <button
                                type="button"
                                className="h-5 w-5 rounded flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted/80 cursor-pointer transition-colors"
                                title="Chỉnh sửa sự cố"
                                aria-label="Chỉnh sửa sự cố"
                              >
                                <Pencil className="h-3 w-3" />
                              </button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-44 text-xs">
                              <DropdownMenuItem
                                className="cursor-pointer text-xs flex items-center gap-2"
                                onClick={() => onOpenChangeAssignee?.(inc)}
                              >
                                <UserCog className="h-3.5 w-3.5 text-primary" />
                                <span>Đổi người phụ trách</span>
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                className="cursor-pointer text-xs flex items-center gap-2 text-destructive focus:text-destructive"
                                onClick={() => onCancelIncident?.(inc.id)}
                              >
                                <XCircle className="h-3.5 w-3.5 text-destructive" />
                                <span>Hủy sự cố</span>
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Dòng 2: Tiêu đề sự cố vi phạm (truncate 1 dòng) */}
                  <p
                    className={cn(
                      'text-xs leading-snug truncate',
                      isSelected
                        ? 'text-foreground font-semibold'
                        : 'text-foreground/90 font-normal group-hover:text-foreground'
                    )}
                    title={displayTitle}
                  >
                    {displayTitle}
                  </p>
                </div>
              )
            })
          )}
        </div>

        {/* ─── LỊCH SỬ SỰ CỐ ĐÃ ĐÓNG (Mở rộng ở dưới cùng) ─── */}
        {closedIncidents.length > 0 && (
          <div className="pt-2 border-t border-border/50 space-y-1.5">
            <button
              type="button"
              onClick={() => setUserClosedExpanded(!isClosedExpanded)}
              className="w-full flex items-center justify-between py-1.5 px-2.5 rounded-lg border border-border/70 bg-muted/40 hover:bg-muted/80 text-xs font-medium text-foreground cursor-pointer transition-colors"
            >
              <span className="flex items-center gap-1.5">
                <History className="h-3.5 w-3.5 text-primary shrink-0" />
                <span className="font-semibold text-foreground">Sự cố đã đóng</span>
                <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20 font-bold">
                  {closedIncidents.length}
                </span>
              </span>
              <div className="flex items-center gap-1 text-[11px] text-muted-foreground">
                <span>{isClosedExpanded ? 'Thu gọn' : 'Mở rộng'}</span>
                <ChevronDown
                  className={cn(
                    'h-3.5 w-3.5 transition-transform duration-200',
                    isClosedExpanded && 'rotate-180'
                  )}
                />
              </div>
            </button>

            {isClosedExpanded && (
              <div className="space-y-1.5 pt-0.5 animate-in fade-in-50 duration-150">
                {closedIncidents.map((inc) => {
                  const isSelected = inc.id === activeIncident.id
                  const displayTitle = inc.title || QC_CRITERIA_LABELS[inc.criteria]
                  const sev = SEVERITY_CONFIG[inc.severity] || SEVERITY_CONFIG.medium
                  const SevIcon = sev.icon

                  return (
                    <div
                      key={inc.id}
                      onClick={() => onSelectIncident(inc.id)}
                      className={cn(
                        'group rounded-lg border px-2.5 py-2 text-xs transition-all cursor-pointer space-y-1 text-left opacity-90 hover:opacity-100',
                        isSelected
                          ? 'border-primary bg-primary/10 ring-1 ring-primary/30 shadow-2xs font-medium opacity-100'
                          : 'border-border/70 bg-background/80 hover:bg-muted/60 text-muted-foreground'
                      )}
                    >
                      {/* Dòng 1: Tag vi phạm + Nhóm đối tượng + Mức độ + Trạng thái Đã đóng */}
                      <div className="flex items-center justify-between gap-1.5">
                        <div className="flex items-center gap-1.5 min-w-0 flex-wrap">
                          <div onClick={(e) => e.stopPropagation()}>
                            <QcTagHoverCard incident={inc} onViewDetail={onSelectIncident} />
                          </div>
                          {inc.targetGroup && (
                            <Badge variant="outline" className="text-[10px] px-1 py-0 h-4 font-normal">
                              {QC_TARGET_GROUP_LABELS[inc.targetGroup]}
                            </Badge>
                          )}
                          <span className="inline-flex items-center shrink-0" title={`Mức độ: ${sev.label}`}>
                            <SevIcon className={cn('h-3.5 w-3.5', sev.color)} />
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

                      {/* Dòng 2: Tiêu đề sự cố vi phạm (truncate 1 dòng) */}
                      <p
                        className={cn(
                          'text-xs leading-snug truncate',
                          isSelected
                            ? 'text-foreground font-semibold'
                            : 'text-foreground/90 font-normal group-hover:text-foreground'
                        )}
                        title={displayTitle}
                      >
                        {displayTitle}
                      </p>
                    </div>
                  )
                })}

                {onOpenHistory && (
                  <button
                    type="button"
                    onClick={onOpenHistory}
                    className="w-full text-center text-[11px] text-primary hover:underline font-medium py-1 cursor-pointer flex items-center justify-center gap-1"
                  >
                    <span>Mở toàn bộ hồ sơ lưu trữ theo tháng ↗</span>
                  </button>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
