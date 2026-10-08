'use client'

import { Check, UserX, UserCheck } from 'lucide-react'
import { PersonnelHoverCard, type PersonnelItem } from '@/components/shared'
import { mockEmployees } from '@/mocks/employees'
import { cn } from '@/lib/utils'
import { getSlotTimeRange } from './bookingTestCreateTypes'

export interface DutyStaffItem {
  employee: {
    id: string
    name: string
    shortName: string
    role?: 'Giáo viên' | 'CS' | 'Khác' | string
    colorClass?: string
  }
  isAvailable: boolean
  conflictDetail?: string
  availableSlotsCount?: number
  totalSlotsCount?: number
  substituteInfo?: {
    isSubstitute: boolean
    date?: string
    reason?: string
  }
}

interface BookingTestCreateStaffSectionProps {
  mode?: 'slot_first' | 'teacher_first'
  selectedSlot: string
  teacher: string
  onTeacherChange: (teacherName: string) => void
  currentSlotStaffList: DutyStaffItem[]
  dayStaffList?: DutyStaffItem[]
  school?: string
  testDate?: string
}

function getPersonnelItem(item: DutyStaffItem): PersonnelItem {
  const t = item.employee
  const emp = mockEmployees.find((e) => e.name.toLowerCase() === t.name.toLowerCase())
  const nameInitials = t.name.split(' ').map((n) => n[0]).join('').toUpperCase()

  return {
    id: emp?.id ? `EMP-${emp.id.toUpperCase()}` : `EMP-${nameInitials}`,
    name: t.name,
    avatar: emp?.avatar || `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(t.name)}`,
    role: emp?.position || t.role || 'Giáo viên',
    phone: emp?.phone || '0901 223 344',
    email: emp?.email || `${t.name.toLowerCase().replace(/[^a-z0-9]/g, '')}@rinoedu.com`,
    isSubstitute: item.substituteInfo?.isSubstitute,
    date: item.substituteInfo?.date,
    reason: item.substituteInfo?.reason,
  }
}

export function BookingTestCreateStaffSection({
  mode = 'slot_first',
  selectedSlot,
  teacher,
  onTeacherChange,
  currentSlotStaffList,
  dayStaffList = [],
  school,
  testDate,
}: BookingTestCreateStaffSectionProps) {
  const isTeacherFirst = mode === 'teacher_first'
  const isReady = Boolean(school && testDate && selectedSlot)
  const availableStaffCount = currentSlotStaffList.filter((s) => s.isAvailable).length

  // Danh sách hiển thị theo chế độ
  const displayList = isTeacherFirst ? dayStaffList : currentSlotStaffList

  // Thông báo hướng dẫn khi chưa đủ điều kiện
  const getPromptMessage = () => {
    if (!school && !testDate) {
      return selectedSlot
        ? `Vui lòng chọn cơ sở và ngày test để hiển thị danh sách nhân sự trực ca ${getSlotTimeRange(selectedSlot, 30)}`
        : 'Vui lòng chọn cơ sở và ngày test để phân bổ nhân sự phụ trách'
    }
    if (!school) {
      return selectedSlot
        ? `Vui lòng chọn cơ sở / trung tâm để hiển thị nhân sự trực ca ${getSlotTimeRange(selectedSlot, 30)}`
        : 'Vui lòng chọn trung tâm / cơ sở test để tải danh sách nhân sự phụ trách'
    }
    if (!testDate) {
      return selectedSlot
        ? `Vui lòng chọn ngày test để hiển thị nhân sự trực ca ${getSlotTimeRange(selectedSlot, 30)}`
        : 'Vui lòng chọn ngày test để tải danh sách nhân sự trực ca'
    }
    if (!selectedSlot) {
      return 'Vui lòng chọn khung giờ test ở trên để phân bổ nhân sự phụ trách'
    }
    return null
  }

  const promptMessage = getPromptMessage()

  return (
    <div className="rounded-lg border border-border/70 bg-background p-2.5 space-y-2">
      {/* Tiêu đề Section & Badge Cơ sở */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-1.5 border-b">
        <div className="flex items-center gap-2 min-w-0">
          <div className="flex items-center gap-1.5 shrink-0">
            <UserCheck className="h-3.5 w-3.5 text-primary" />
            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              {isTeacherFirst
                ? 'Chọn Giáo viên / Phụ trách'
                : selectedSlot
                ? `Phụ trách ca ${getSlotTimeRange(selectedSlot, 30)}`
                : 'Nhân sự phụ trách ca test'}
            </span>
          </div>

          {isReady && currentSlotStaffList.length > 0 && (
            <span className="text-xs text-muted-foreground font-normal shrink-0">
              {isTeacherFirst ? (
                <span>
                  (Đang chọn:{' '}
                  <span className="font-semibold text-primary">
                    {teacher ? teacher : 'Chưa gán'}
                  </span>)
                </span>
              ) : availableStaffCount === 0 ? (
                <span className="text-rose-600 dark:text-rose-400 font-semibold bg-rose-50 dark:bg-rose-950/40 px-1.5 py-0.2 rounded border border-rose-200 dark:border-rose-900/40">
                  0/{currentSlotStaffList.length} rảnh · Hết chỗ
                </span>
              ) : (
                <span>
                  (<span className="font-semibold text-foreground">{availableStaffCount}</span>/
                  {currentSlotStaffList.length} rảnh)
                </span>
              )}
            </span>
          )}
        </div>

        {/* Badge Cơ sở đã chọn (được quản lý ở Section chọn cơ sở phía trên) */}
        {school && (
          <div className="flex items-center gap-1.5 shrink-0 text-xs">
            <span className="text-muted-foreground text-xs font-normal hidden sm:inline">Cơ sở:</span>
            <span className="font-semibold text-foreground bg-muted/60 px-2 py-0.5 rounded border border-border/60 text-xs">
              {school}
            </span>
          </div>
        )}
      </div>

      {!isReady || promptMessage ? (
        <div className="py-4 px-3 text-center rounded-md border border-dashed border-border/80 bg-muted/20 text-xs text-muted-foreground">
          {promptMessage}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {/* Lựa chọn 0: Chưa gán Phụ trách / Bất kỳ giáo viên nào */}
          <div
            onClick={() => onTeacherChange('')}
            className={cn(
              'flex items-center justify-between rounded-lg border p-2 h-[50px] cursor-pointer transition-all',
              teacher === ''
                ? 'border-amber-500 bg-amber-50/60 text-amber-900 dark:bg-amber-950/30 dark:text-amber-200 font-semibold ring-1 ring-amber-500/40'
                : 'border-border/70 bg-background hover:bg-muted/40 text-muted-foreground'
            )}
          >
          <div className="flex items-center gap-2 min-w-0 flex-1">
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-muted text-muted-foreground shrink-0">
              <UserX className="h-3.5 w-3.5" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold truncate leading-tight">
                {isTeacherFirst ? 'Chưa gán / Bất kỳ GV' : 'Chưa gán Phụ trách'}
              </p>
              <p className="text-xs text-muted-foreground opacity-75 truncate leading-tight mt-0.5">
                {isTeacherFirst ? 'Khung giờ chung' : 'Phân công sau'}
              </p>
            </div>
          </div>
          <div className="shrink-0 ml-1">
            {teacher === '' && <Check className="h-3.5 w-3.5 text-amber-600 shrink-0" />}
          </div>
        </div>

        {/* Danh sách các nhân sự phụ trách */}
        {displayList.map((item) => {
          const t = item.employee
          const isSelectedTeacher = teacher === t.name
          const isAvailable = isTeacherFirst ? (item.availableSlotsCount ?? 0) > 0 : item.isAvailable
          const personItem = getPersonnelItem(item)

          return (
            <PersonnelHoverCard key={t.id} person={personItem} align="start">
              <div
                onClick={() => {
                  if (isAvailable || isTeacherFirst) {
                    onTeacherChange(t.name)
                  }
                }}
                className={cn(
                  'flex items-center justify-between rounded-lg border p-2 h-[50px] transition-all',
                  !isAvailable && !isTeacherFirst
                    ? 'opacity-65 cursor-not-allowed bg-background/50 border-dashed'
                    : 'cursor-pointer',
                  isSelectedTeacher
                    ? 'border-primary bg-primary/10 text-primary font-semibold ring-1 ring-primary/30'
                    : isAvailable
                    ? 'border-border/70 bg-background hover:bg-muted/40 text-foreground'
                    : 'border-border/50 bg-background/50 text-muted-foreground'
                )}
              >
                <div className="flex items-center gap-2 min-w-0 flex-1">
                  <div
                    className={cn(
                      'flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white',
                      t.colorClass || 'bg-primary'
                    )}
                  >
                    {t.shortName}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1 min-w-0">
                      <p className="truncate text-xs font-semibold leading-tight">{t.name}</p>
                      <span
                        className={cn(
                          'inline-block text-xs px-1 py-0 rounded font-medium border shrink-0 leading-none',
                          t.role === 'CS'
                            ? 'bg-amber-50 text-amber-800 border-amber-200 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800'
                            : t.role === 'Khác'
                            ? 'bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700'
                            : 'bg-blue-50 text-blue-800 border-blue-200 dark:bg-blue-950/60 dark:text-blue-300 dark:border-blue-800'
                        )}
                      >
                        {t.role || 'Giáo viên'}
                      </span>
                    </div>

                    {isTeacherFirst ? (
                      <p
                        className={cn(
                          'text-xs font-medium truncate leading-tight mt-0.5',
                          (item.availableSlotsCount ?? 0) > 0
                            ? 'text-emerald-600 dark:text-emerald-400'
                            : 'text-rose-600 dark:text-rose-400'
                        )}
                      >
                        {item.availableSlotsCount !== undefined
                          ? `${item.availableSlotsCount} ca rảnh`
                          : 'Rảnh'}
                      </p>
                    ) : isAvailable ? (
                      <p className="text-xs font-medium text-emerald-600 dark:text-emerald-400 truncate leading-tight mt-0.5">
                        Rảnh
                      </p>
                    ) : (
                      <p
                        className="text-xs font-medium text-rose-600 dark:text-rose-400 truncate leading-tight mt-0.5"
                        title={item.conflictDetail}
                      >
                        Bận{item.conflictDetail ? ` · ${item.conflictDetail}` : ''}
                      </p>
                    )}
                  </div>
                </div>

                <div className="shrink-0 ml-1">
                  {isSelectedTeacher && (
                    <span className="flex h-4 w-4 items-center justify-center rounded-full bg-primary text-primary-foreground shrink-0">
                      <Check className="h-2.5 w-2.5" />
                    </span>
                  )}
                </div>
              </div>
            </PersonnelHoverCard>
          )
        })}

        {displayList.length === 0 && (
          <div className="col-span-full py-3 text-center text-xs text-muted-foreground">
            Chưa có nhân sự nào được phân bổ trực ca này tại cơ sở.
          </div>
        )}
      </div>
    )}
  </div>
)
}
