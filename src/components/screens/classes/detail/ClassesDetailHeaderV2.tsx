'use client'

import { Award, BookOpen, Play, Star, Undo, UserCheck, Users } from 'lucide-react'
import { DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { StatusActionButton, StatusBadge } from '@/components/shared'
import { CLASS_STATUS_LABELS, type ClassRecord } from '@/mocks/classRecords'
import type { ClassesStatusChangeRequest } from './ClassesDetailHeader'

interface ClassesDetailHeaderV2Props {
  cls: ClassRecord
  isEditing: boolean
  rosterCount: number
  onStartEdit: () => void
  onCancelEdit: () => void
  onSave: () => void
  onStatusChange: (newStatus: ClassRecord['status'], actionText: string) => void
  onRequestStatusChange: (request: ClassesStatusChangeRequest) => void
  onSwitchToV1?: () => void
}

export function ClassesDetailHeaderV2({
  cls,
  isEditing,
  rosterCount,
  onStartEdit,
  onCancelEdit,
  onSave,
  onStatusChange,
  onRequestStatusChange,
}: ClassesDetailHeaderV2Props) {
  const closeDisabled = rosterCount > 0
  const closeTitle = closeDisabled ? 'Chỉ có thể đóng lớp khi không còn học viên' : 'Đóng lớp'
  const closeClassRequest = (actionText: string, description: string): ClassesStatusChangeRequest => ({
    newStatus: 'huy',
    actionText,
    title: 'Xác nhận Đóng lớp?',
    description,
  })

  return (
    <DialogHeader className="shrink-0 text-left p-0 pb-1 border-none bg-transparent shadow-none">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between min-w-0">
        {/* Left Side: Title & Sub-info metadata */}
        <div className="min-w-0 flex-1">
          <div className="text-[11px] font-normal text-muted-foreground mb-0.5">
            Chi tiết lớp
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

        {/* Right Side of Left Section: Actions Toolbar & Summary Metrics Grid */}
        <div className="flex shrink-0 flex-col items-end gap-1.5 sm:justify-end">
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

          {/* Section Thống kê: Tách thành từng khối riêng, 2 dòng: Dòng 1 Icon & Chỉ số, Dòng 2 là text */}
          <div className="flex flex-wrap items-center gap-1.5 justify-end">
            {/* Khối 1: Chuyên cần */}
            <div
              className="flex flex-col items-center justify-center rounded-lg border border-border/60 bg-muted/20 px-2 py-1 min-w-[58px] text-center"
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
              className="flex flex-col items-center justify-center rounded-lg border border-border/60 bg-muted/20 px-2 py-1 min-w-[54px] text-center"
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

            {/* Khối 3: Điểm KT */}
            <div
              className="flex flex-col items-center justify-center rounded-lg border border-border/60 bg-muted/20 px-2 py-1 min-w-[54px] text-center"
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

            {/* Khối 4: Đánh giá */}
            <div
              className="flex flex-col items-center justify-center rounded-lg border border-border/60 bg-muted/20 px-2 py-1 min-w-[54px] text-center"
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
