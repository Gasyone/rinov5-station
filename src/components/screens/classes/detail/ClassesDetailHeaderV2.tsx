'use client'

import { ArrowLeftRight, Award, BookOpen, Heart, LayoutDashboard, Layers, Play, Star, Undo, UserCheck, Users } from 'lucide-react'
import { DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { StatusActionButton, StatusBadge } from '@/components/shared'
import { CLASS_STATUS_LABELS, type ClassRecord } from '@/mocks/classRecords'
import { cn } from '@/lib/utils'
import type { ClassesStatusChangeRequest } from './ClassesDetailHeader'

interface ClassesDetailHeaderV2Props {
  cls: ClassRecord
  isEditing: boolean
  rosterCount: number
  specialCareCount?: number
  onStartEdit: () => void
  onCancelEdit: () => void
  onSave: () => void
  onStatusChange: (newStatus: ClassRecord['status'], actionText: string) => void
  onRequestStatusChange: (request: ClassesStatusChangeRequest) => void
  onSwitchToV1?: () => void
  viewMode?: 'v1' | 'v2'
  onToggleViewMode?: () => void
}

export function ClassesDetailHeaderV2({
  cls,
  isEditing,
  rosterCount,
  specialCareCount,
  onStatusChange,
  onRequestStatusChange,
  viewMode = 'v1',
  onToggleViewMode,
}: ClassesDetailHeaderV2Props) {
  return (
    <DialogHeader className="shrink-0 text-left p-0 pb-1 border-none bg-transparent shadow-none">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between min-w-0">
        {/* Left Side: Title & Sub-info metadata */}
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 mb-0.5">
            <span className="text-[11px] font-normal text-muted-foreground">
              Chi tiết lớp
            </span>
            {onToggleViewMode && (
              <button
                type="button"
                onClick={onToggleViewMode}
                className={cn(
                  "inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[10px] font-medium border transition-colors cursor-pointer",
                  viewMode === 'v2'
                    ? "bg-primary/10 text-primary border-primary/30 hover:bg-primary/20"
                    : "bg-muted/80 text-muted-foreground border-border/60 hover:text-foreground hover:bg-muted"
                )}
                title={
                  viewMode === 'v2'
                    ? "Đang ở V2 (Tổng quan 1 màn). Bấm để chuyển sang V1 (Dạng Tabs)"
                    : "Đang ở V1 (Dạng Tabs). Bấm để chuyển sang V2 (Tổng quan 1 màn)"
                }
              >
                {viewMode === 'v2' ? (
                  <>
                    <LayoutDashboard className="h-2.5 w-2.5 text-primary" />
                    <span className="font-semibold">V2: Tổng quan</span>
                    <ArrowLeftRight className="h-2 w-2 opacity-60" />
                  </>
                ) : (
                  <>
                    <Layers className="h-2.5 w-2.5 text-muted-foreground" />
                    <span>V1: Tabs</span>
                    <ArrowLeftRight className="h-2 w-2 opacity-60" />
                  </>
                )}
              </button>
            )}
          </div>
          <DialogTitle className="flex min-w-0 flex-wrap items-center gap-2 text-base font-bold tracking-tight text-foreground">
            <span className="truncate">
              {cls.classType === 'Workshop' && (
                <span className="font-normal text-muted-foreground me-1.5">Workshop:</span>
              )}
              {cls.name}
            </span>
            <StatusBadge
              status={cls.status}
              label={CLASS_STATUS_LABELS[cls.status]}
              className="h-5 px-1.5 text-xs font-semibold uppercase"
            />
            {/* Sĩ số sau trạng thái lớp */}
            <div className="inline-flex items-center gap-1 text-xs font-normal" title="Sĩ số lớp">
              <Users className="h-3.5 w-3.5 text-muted-foreground/70 shrink-0" />
              <span className="font-bold text-[#0088cc] font-mono leading-none">
                {rosterCount}/{cls.maxStudents || 20}
              </span>
              <span className="rounded bg-amber-500/15 text-amber-700 dark:text-amber-400 px-1 py-0.5 text-[10px] font-semibold whitespace-nowrap">
                +2 học thử
              </span>
            </div>
          </DialogTitle>
        </div>

        {/* Right Side of Left Section: Actions Toolbar & Summary Metrics Grid (Shifted left with pr-8 to prevent X overlap) */}
        <div className="flex shrink-0 flex-col items-end gap-1.5 sm:justify-end pr-8 sm:pr-9">
          {/* Row 1: Actions Toolbar (nếu có) */}
          {!isEditing && (cls.status === 'nhap' || cls.status === 'cho_khai_giang') && (
            <div className="flex shrink-0 flex-wrap items-center gap-1.5 justify-end">
              {cls.status === 'nhap' ? (
                <StatusActionButton
                  icon={Play}
                  label="Kích hoạt"
                  tone="primary"
                  onClick={() => onStatusChange('cho_khai_giang', 'Đã kích hoạt lớp học sang trạng thái Chờ khai giảng.')}
                />
              ) : null}

              {cls.status === 'cho_khai_giang' ? (
                <StatusActionButton
                  icon={Undo}
                  label="Quay về nháp"
                  onClick={() => onRequestStatusChange({
                    newStatus: 'nhap',
                    actionText: 'Đã chuyển lớp học trở lại trạng thái Nháp.',
                    title: 'Quay về lớp Nháp',
                    description: 'Bạn có chắc chắn muốn chuyển lớp học này quay trở lại trạng thái Nháp để điều chỉnh thông tin?',
                  })}
                />
              ) : null}
            </div>
          )}

          {/* Section Thống kê: Chuyên cần, BTVN, Cần CS, Điểm KT, Đánh giá */}
          <div className="flex flex-wrap items-center gap-1.5 justify-end">
            {/* Khối 1: Chuyên cần */}
            <div
              className="flex flex-col items-center justify-center rounded-lg border border-border/60 bg-muted/20 px-2 py-1 min-w-[54px] text-center"
              title="Tỷ lệ chuyên cần"
            >
              <div className="flex items-center gap-1 leading-none">
                <UserCheck className="h-3 w-3 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span className="font-bold text-emerald-600 dark:text-emerald-400 font-mono text-xs leading-none">
                  92%
                </span>
              </div>
              <span className="text-[10px] text-muted-foreground font-normal tracking-tight mt-0.5 leading-tight">
                Chuyên cần
              </span>
            </div>

            {/* Khối 2: BTVN */}
            <div
              className="flex flex-col items-center justify-center rounded-lg border border-border/60 bg-muted/20 px-2 py-1 min-w-[52px] text-center"
              title="Tỷ lệ hoàn thành BTVN"
            >
              <div className="flex items-center gap-1 leading-none">
                <BookOpen className="h-3 w-3 text-indigo-600 dark:text-indigo-400 shrink-0" />
                <span className="font-bold text-indigo-600 dark:text-indigo-400 font-mono text-xs leading-none">
                  92%
                </span>
              </div>
              <span className="text-[10px] text-muted-foreground font-normal tracking-tight mt-0.5 leading-tight">
                BTVN
              </span>
            </div>

            {/* Khối 3: Cần CS (Đưa lên từ section học viên) */}
            <div
              className="flex flex-col items-center justify-center rounded-lg border border-rose-200/80 bg-rose-50/40 dark:border-rose-900/50 dark:bg-rose-950/20 px-2 py-1 min-w-[52px] text-center"
              title="Số lượng học viên cần chăm sóc"
            >
              <div className="flex items-center gap-1 leading-none">
                <Heart className="h-3 w-3 fill-rose-500 text-rose-500 shrink-0" />
                <span className="font-bold text-rose-600 dark:text-rose-400 font-mono text-xs leading-none">
                  {specialCareCount ?? 19}
                </span>
              </div>
              <span className="text-[10px] text-rose-600/90 dark:text-rose-400/90 font-normal tracking-tight mt-0.5 leading-tight">
                Cần CS
              </span>
            </div>

            {/* Khối 4: Điểm KT */}
            <div
              className="flex flex-col items-center justify-center rounded-lg border border-border/60 bg-muted/20 px-2 py-1 min-w-[52px] text-center"
              title="Điểm kiểm tra trung bình"
            >
              <div className="flex items-center gap-1 leading-none">
                <Award className="h-3 w-3 text-purple-600 dark:text-purple-400 shrink-0" />
                <span className="font-bold text-purple-600 dark:text-purple-400 font-mono text-xs leading-none">
                  7.4
                </span>
              </div>
              <span className="text-[10px] text-muted-foreground font-normal tracking-tight mt-0.5 leading-tight">
                Điểm KT
              </span>
            </div>

            {/* Khối 5: Đánh giá */}
            <div
              className="flex flex-col items-center justify-center rounded-lg border border-border/60 bg-muted/20 px-2 py-1 min-w-[52px] text-center"
              title="Đánh giá chất lượng"
            >
              <div className="flex items-center gap-0.5 leading-none">
                <Star className="h-3 w-3 fill-amber-400 text-amber-400 shrink-0" />
                <span className="font-bold text-amber-600 dark:text-amber-400 font-mono text-xs leading-none">
                  4.8
                </span>
              </div>
              <span className="text-[10px] text-muted-foreground font-normal tracking-tight mt-0.5 leading-tight">
                Đánh giá
              </span>
            </div>
          </div>
        </div>
      </div>
    </DialogHeader>
  )
}
