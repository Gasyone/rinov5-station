'use client'

import { Ban, BookOpen, MapPin, Pause, Play, RotateCcw, Star, Undo } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
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
    <DialogHeader className="shrink-0 text-left p-1 border-none bg-transparent shadow-none">
      <div className="flex flex-col gap-2.5 sm:flex-row sm:items-center sm:justify-between min-w-0">
        {/* Left Side: Title & Sub-info metadata */}
        <div className="min-w-0 flex-1">
          <div className="text-xs font-normal text-muted-foreground mb-0.5">
            Chi tiết lớp
          </div>
          <DialogTitle className="flex min-w-0 flex-wrap items-center gap-2 text-lg md:text-xl font-extrabold tracking-tight text-foreground">
            <span className="truncate">
              {cls.classType === 'Workshop' && (
                <span className="font-normal text-muted-foreground me-1.5">Workshop:</span>
              )}
              {cls.name}
            </span>
            <StatusBadge
              status={cls.status}
              label={CLASS_STATUS_LABELS[cls.status]}
              className="h-5 px-2.5 text-[10px] font-bold tracking-wider uppercase"
            />
          </DialogTitle>
        </div>

        {/* Right Side of Left Section: Actions Toolbar & Summary Metrics Grid */}
        <div className="flex shrink-0 flex-col items-end gap-2 sm:justify-end">
          {/* Row 1: Actions Toolbar */}
          <div className="flex shrink-0 flex-wrap items-center gap-2 justify-end">
            {!isEditing && (
              <>
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
              </>
            )}
          </div>

          {/* Row 2: Minimalist Compact Smart Cards */}
          <div className="flex flex-wrap items-center gap-1.5 justify-end">
            {/* Metric 1: Sĩ số */}
            <div className="flex flex-col items-center justify-center rounded-lg border border-border/60 bg-muted/20 px-2.5 py-1 min-w-[90px] min-h-[38px] text-center">
              <span className="text-[9px] font-semibold uppercase tracking-tight text-muted-foreground mb-0.5">
                Sĩ số
              </span>
              <span className="text-xs font-extrabold text-[#0088cc] font-mono leading-none flex items-center gap-1">
                <span>{rosterCount}/{cls.maxStudents || 20}</span>
                <span className="rounded bg-amber-500/15 text-amber-700 dark:text-amber-400 px-1 py-0.2 text-[8px] font-bold whitespace-nowrap">
                  +2 học thử
                </span>
              </span>
            </div>

            {/* Metric 2: Chuyên cần */}
            <div className="flex flex-col items-center justify-center rounded-lg border border-border/60 bg-muted/20 px-2.5 py-1 min-w-[70px] min-h-[38px] text-center">
              <span className="text-[9px] font-semibold uppercase tracking-tight text-muted-foreground mb-0.5">
                Chuyên cần
              </span>
              <span className="text-xs font-extrabold text-emerald-600 dark:text-emerald-400 font-mono leading-none">
                92%
              </span>
            </div>

            {/* Metric 3: Nộp BTVN */}
            <div className="flex flex-col items-center justify-center rounded-lg border border-border/60 bg-muted/20 px-2.5 py-1 min-w-[70px] min-h-[38px] text-center">
              <span className="text-[9px] font-semibold uppercase tracking-tight text-muted-foreground mb-0.5">
                Nộp BTVN
              </span>
              <span className="text-xs font-extrabold text-indigo-600 dark:text-indigo-400 font-mono leading-none">
                92%
              </span>
            </div>

            {/* Metric 4: Điểm KT */}
            <div className="flex flex-col items-center justify-center rounded-lg border border-border/60 bg-muted/20 px-2.5 py-1 min-w-[70px] min-h-[38px] text-center">
              <span className="text-[9px] font-semibold uppercase tracking-tight text-muted-foreground mb-0.5 whitespace-nowrap">
                Điểm KT
              </span>
              <span className="text-xs font-extrabold text-purple-600 dark:text-purple-400 font-mono leading-none">
                7.4
              </span>
            </div>

            {/* Metric 5: Đánh giá */}
            <div className="flex flex-col items-center justify-center rounded-lg border border-border/60 bg-muted/20 px-2.5 py-1 min-w-[70px] min-h-[38px] text-center">
              <span className="text-[9px] font-semibold uppercase tracking-tight text-muted-foreground mb-0.5">
                Đánh giá
              </span>
              <span className="text-xs font-extrabold text-amber-600 dark:text-amber-400 flex items-center gap-0.5 leading-none">
                4.8 <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
              </span>
            </div>
          </div>
        </div>
      </div>
    </DialogHeader>
  )
}
