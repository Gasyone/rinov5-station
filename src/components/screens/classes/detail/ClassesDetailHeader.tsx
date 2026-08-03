'use client'

import { Ban, BookOpen, History, MapPin, Pause, Pencil, Play, Sparkles, Undo } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { StatusActionButton, StatusBadge, AppAvatar } from '@/components/shared'
import { CLASS_STATUS_LABELS, type ClassRecord } from '@/mocks/classRecords'
import { ScheduleSummary } from '../ScheduleSummary'
import { cn } from '@/lib/utils'

export interface ClassesStatusChangeRequest {
  newStatus: ClassRecord['status']
  actionText: string
  title: string
  description: string
}

interface ClassesDetailHeaderProps {
  cls: ClassRecord
  isEditing: boolean
  rosterCount: number
  enrollmentPercentage: number
  isCapacityWarning: boolean
  onStartEdit: () => void
  onCancelEdit: () => void
  onSave: () => void
  onStatusChange: (newStatus: ClassRecord['status'], actionText: string) => void
  onRequestStatusChange: (request: ClassesStatusChangeRequest) => void
  onSwitchToV2?: () => void
}

function formatDateRange(cls: ClassRecord) {
  const start = cls.startDate && cls.startDate !== '---'
    ? new Date(cls.startDate).toLocaleDateString('vi-VN')
    : '—'
  const end = cls.endDate && cls.endDate !== '---'
    ? new Date(cls.endDate).toLocaleDateString('vi-VN')
    : ''

  return end ? `${start} – ${end}` : start
}

export function ClassesDetailHeader({
  cls,
  isEditing,
  rosterCount,
  enrollmentPercentage,
  isCapacityWarning,
  onStartEdit,
  onCancelEdit,
  onSave,
  onStatusChange,
  onRequestStatusChange,
}: ClassesDetailHeaderProps) {
  const closeDisabled = rosterCount > 0
  const closeTitle = closeDisabled ? 'Chỉ có thể đóng lớp khi không còn học viên' : 'Đóng lớp'
  const closeClassRequest = (actionText: string, description: string): ClassesStatusChangeRequest => ({
    newStatus: 'huy',
    actionText,
    title: 'Xác nhận Đóng lớp?',
    description,
  })

  return (
    <DialogHeader className="shrink-0 border-b border-border/60 bg-background px-6 py-5 text-left">
      <div className="grid min-h-[96px] grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_480px]">
        <section className="min-w-0 flex flex-col justify-between">
          <div>
            <div className="text-xs font-normal text-muted-foreground mb-1">
              Chi tiết lớp
            </div>
            <DialogTitle className="flex min-w-0 flex-wrap items-center gap-2 text-xl md:text-2xl leading-none font-bold text-foreground">
              <span className="truncate tracking-tight">
                {cls.classType === 'Workshop' && (
                  <span className="font-normal text-muted-foreground me-1.5">Workshop:</span>
                )}
                {cls.name}
              </span>
              <StatusBadge
                status={cls.status}
                label={CLASS_STATUS_LABELS[cls.status]}
                className="h-5 px-2.5 text-[10px] font-bold tracking-wide uppercase"
              />
            </DialogTitle>

            <div className="mt-2.5 flex min-w-0 flex-wrap items-center gap-x-3 gap-y-1.5 text-xs text-muted-foreground">
              <span className="flex min-w-0 items-center gap-1.5 font-medium">
                <MapPin className="h-3.5 w-3.5 shrink-0 text-primary/70" />
                <span className="truncate text-foreground/80">
                  {cls.branch} <span className="text-muted-foreground/60 mx-0.5">•</span> Phòng: <span className="font-semibold text-foreground">{cls.room || 'Chưa gán'}</span>
                </span>
              </span>
              <span aria-hidden className="text-muted-foreground/30">•</span>
              <span className="flex min-w-0 items-center gap-1.5 font-medium">
                <BookOpen className="h-3.5 w-3.5 shrink-0 text-primary/70" />
                <span className="truncate text-foreground/80">
                  Chương trình: <span className="font-semibold text-foreground">{cls.level || 'Chưa gán'}</span> <span className="text-muted-foreground/60 mx-0.5">•</span> Trình độ: <span className="font-semibold text-foreground">{cls.subLevel || 'Chưa gán'}</span>
                </span>
              </span>
            </div>
          </div>

          <div className="mt-5 flex min-w-0 flex-col sm:flex-row sm:items-center gap-3 overflow-hidden">
            <div className="flex shrink-0 items-center gap-2">
              {isEditing ? (
                <>
                  <StatusActionButton icon={Undo} label="Hủy" onClick={onCancelEdit} />
                  <StatusActionButton icon={Play} label="Lưu thay đổi" tone="primary" onClick={onSave} />
                </>
              ) : (
                <>
                  <StatusActionButton icon={Pencil} label="Chỉnh sửa" onClick={onStartEdit} />

                  {cls.status === 'nhap' ? (
                    <>
                      <StatusActionButton
                        icon={Play}
                        label="Kích hoạt"
                        tone="primary"
                        onClick={() => onStatusChange('cho_khai_giang', 'Đã kích hoạt lớp học sang trạng thái Chờ khai giảng.')}
                      />
                      <StatusActionButton
                        icon={Ban}
                        label="Đóng"
                        tone="destructive"
                        disabled={closeDisabled}
                        title={closeTitle}
                        onClick={() => onRequestStatusChange(closeClassRequest(
                          'Đã đóng lớp học nháp.',
                          'Bạn có chắc chắn muốn đóng lớp học nháp này? Trạng thái lớp sẽ chuyển sang Đã kết thúc.'
                        ))}
                      />
                    </>
                  ) : null}

                  {cls.status === 'cho_khai_giang' ? (
                    <>
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
                      <StatusActionButton
                        icon={Ban}
                        label="Đóng"
                        tone="destructive"
                        disabled={closeDisabled}
                        title={closeTitle}
                        onClick={() => onRequestStatusChange(closeClassRequest(
                          'Đã hủy lịch chờ khai giảng và đóng lớp học.',
                          'Bạn có chắc chắn muốn đóng lớp học này không? Trạng thái lớp sẽ được chuyển sang Đã kết thúc.'
                        ))}
                      />
                    </>
                  ) : null}

                  {cls.status === 'dang_hoc' ? (
                    <>
                      <StatusActionButton
                        icon={Pause}
                        label="Tạm nghỉ"
                        tone="warning"
                        onClick={() => onRequestStatusChange({
                          newStatus: 'tam_dung',
                          actionText: 'Đã chuyển lớp học sang trạng thái Tạm nghỉ.',
                          title: 'Tạm nghỉ lớp học',
                          description: 'Bạn có chắc chắn muốn tạm ngưng vận hành lớp học này và chuyển sang trạng thái Tạm nghỉ?',
                        })}
                      />
                      <StatusActionButton
                        icon={Ban}
                        label="Đóng"
                        tone="destructive"
                        disabled={closeDisabled}
                        title={closeTitle}
                        onClick={() => onRequestStatusChange(closeClassRequest(
                          'Đã đóng lớp học thành công.',
                          'Bạn có chắc chắn muốn đóng lớp học này không? Trạng thái lớp sẽ chuyển sang Đã kết thúc.'
                        ))}
                      />
                    </>
                  ) : null}

                  {cls.status === 'tam_dung' ? (
                    <>
                      <StatusActionButton
                        icon={Play}
                        label="Mở lại"
                        tone="primary"
                        onClick={() => onStatusChange('dang_hoc', 'Đã kích hoạt lớp học đang tạm nghỉ quay trở lại Đang học.')}
                      />
                      <StatusActionButton
                        icon={Ban}
                        label="Đóng"
                        tone="destructive"
                        disabled={closeDisabled}
                        title={closeTitle}
                        onClick={() => onRequestStatusChange(closeClassRequest(
                          'Đã đóng lớp học đang tạm nghỉ.',
                          'Bạn có chắc chắn muốn đóng lớp học đang tạm nghỉ này không? Trạng thái lớp sẽ chuyển sang Đã kết thúc.'
                        ))}
                      />
                    </>
                  ) : null}
                </>
              )}
            </div>

            {cls.nextSession ? (
              <div className="inline-flex h-6 min-w-0 max-w-[280px] items-center gap-1.5 rounded-full border border-primary/10 bg-primary/5 px-3 text-[10px] font-bold text-primary tracking-wide">
                <Play className="h-2.5 w-2.5 shrink-0 fill-primary/20" />
                <span className="truncate">
                  Buổi kế tiếp: {cls.nextSession.date} ({cls.nextSession.time} • {cls.nextSession.room})
                </span>
              </div>
            ) : null}
          </div>
        </section>

        <section className="grid min-w-0 grid-cols-2 gap-6 border-t pt-4 lg:border-t-0 lg:border-l lg:pt-0 lg:pl-6 border-border/60">
          <div className="flex min-w-0 flex-col justify-between gap-3">
            <div>
              <p className="text-[10px] leading-none font-bold tracking-wider text-muted-foreground uppercase">
                Phụ trách
              </p>
              {cls.teacher ? (
                <div className="mt-2.5 flex items-center gap-2">
                  <AppAvatar name={cls.teacher} size="xs" className="ring-1 ring-border/50" />
                  <span className="text-xs md:text-sm font-semibold text-foreground whitespace-nowrap">
                    {cls.teacher}
                  </span>
                </div>
              ) : (
                <p className="mt-2.5 text-xs md:text-sm font-semibold text-muted-foreground whitespace-nowrap">
                  —
                </p>
              )}
            </div>
            <div>
              <p className="text-[10px] leading-none font-bold tracking-wider text-muted-foreground uppercase">
                Lịch học cố định
              </p>
              <div className="mt-2">
                <ScheduleSummary
                  scheduleSlots={cls.scheduleSlots}
                  className={cls.name}
                  displayMode="dayOfWeek"
                />
              </div>
            </div>
          </div>

          <div className="flex min-w-0 flex-col justify-between gap-3">
            <div>
              <p className="text-[10px] leading-none font-bold tracking-wider text-muted-foreground uppercase">
                Sĩ số roster
              </p>
              <div className="mt-2.5 flex items-center gap-1.5">
                <span className={isCapacityWarning ? 'text-xs md:text-sm font-bold text-destructive' : 'text-xs md:text-sm font-bold text-foreground'}>
                  {cls.enrolledStudents}/{cls.maxStudents}
                  {typeof cls.trialStudents === 'number' && cls.trialStudents > 0 ? ` [+${cls.trialStudents}]` : ''}
                </span>
                <span className="text-[10px] text-muted-foreground font-semibold">({enrollmentPercentage}%)</span>
              </div>
              <div className="mt-2 h-1.5 w-full max-w-[180px] overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-800 border border-zinc-200/20 dark:border-zinc-700/20">
                <div
                  className={cn(
                    "h-full rounded-full transition-all duration-500 ease-out",
                    isCapacityWarning ? "bg-destructive" : enrollmentPercentage >= 75 ? "bg-amber-500" : "bg-primary"
                  )}
                  style={{ width: `${Math.min(100, enrollmentPercentage)}%` }}
                />
              </div>
            </div>
            <div>
              <p className="text-[10px] leading-none font-bold tracking-wider text-muted-foreground uppercase">
                Giáo viên
              </p>
              <div className="mt-2 flex items-center gap-1.5">
                {cls.teacher ? (
                  <>
                    <AppAvatar name={cls.teacher} size="xs" className="ring-1 ring-border/50" />
                    <span className="text-xs md:text-sm font-semibold text-foreground whitespace-nowrap">
                      {cls.teacher}
                    </span>
                  </>
                ) : (
                  <span className="text-xs md:text-sm font-semibold text-muted-foreground">—</span>
                )}
                {cls.substituteTeachers && cls.substituteTeachers.length > 0 && (
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon-xs"
                        className="h-7 w-7 shrink-0 rounded-md text-muted-foreground hover:bg-muted hover:text-foreground"
                        title="Lịch sử thay đổi giáo viên"
                      >
                        <History className="h-4 w-4" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-72 p-3" align="start">
                      <div className="space-y-2">
                        <p className="text-[10px] font-bold tracking-wider text-muted-foreground uppercase">
                          Lịch sử thay đổi giáo viên
                        </p>
                        <div className="space-y-1.5">
                          {cls.substituteTeachers.map((sub, i) => (
                            <div key={`sub-${i}`} className="flex items-start gap-2 rounded-lg border border-border/50 bg-muted/20 p-2">
                              <AppAvatar name={sub.name} size="xs" className="mt-0.5 ring-1 ring-border/50" />
                              <div className="min-w-0 flex-1">
                                <p className="text-xs font-semibold text-foreground">{sub.name}</p>
                                <p className="text-[10px] text-muted-foreground font-mono">{sub.date}</p>
                                {sub.reason && (
                                  <p className="mt-0.5 text-[10px] text-muted-foreground italic leading-snug">{sub.reason}</p>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </PopoverContent>
                  </Popover>
                )}
              </div>
            </div>
          </div>
        </section>
      </div>
    </DialogHeader>
  )
}
