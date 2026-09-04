'use client'

import { Check, UserX, UserCheck } from 'lucide-react'
import { PersonnelHoverCard, type PersonnelItem } from '@/components/shared'
import { mockEmployees } from '@/mocks/employees'
import { cn } from '@/lib/utils'

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
}: BookingTestCreateStaffSectionProps) {
  const isTeacherFirst = mode === 'teacher_first'
  const availableStaffCount = currentSlotStaffList.filter((s) => s.isAvailable).length

  // Danh sách hiển thị theo chế độ
  const displayList = isTeacherFirst ? dayStaffList : currentSlotStaffList

  return (
    <div className="rounded-xl border bg-card p-3.5 shadow-2xs space-y-2.5">
      {/* Tiêu đề Section */}
      <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center justify-between pb-1 border-b">
        <div className="flex items-center gap-1.5">
          <UserCheck className="h-3.5 w-3.5 text-primary" />
          <span>
            {isTeacherFirst
              ? 'Chọn Giáo viên / Nhân sự phụ trách (Cả ngày)'
              : `Phụ trách ca ${selectedSlot}`}
          </span>
        </div>

        <span className="text-xs text-muted-foreground font-normal">
          {isTeacherFirst ? (
            <span>
              Đang chọn:{' '}
              <span className="font-semibold text-primary">
                {teacher ? teacher : 'Chưa gán (Lịch chung)'}
              </span>
            </span>
          ) : (
            <span>
              <span className="font-semibold text-foreground">{availableStaffCount}</span>/
              {currentSlotStaffList.length} nhân sự rảnh
            </span>
          )}
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
        {/* Lựa chọn 0: Chưa gán Phụ trách / Bất kỳ giáo viên nào */}
        <div
          onClick={() => onTeacherChange('')}
          className={cn(
            'flex items-center justify-between rounded-xl border p-2.5 h-[58px] cursor-pointer transition-all',
            teacher === ''
              ? 'border-amber-500 bg-amber-50/60 text-amber-900 dark:bg-amber-950/30 dark:text-amber-200 font-semibold ring-1 ring-amber-500/40 shadow-2xs'
              : 'border-border bg-muted/20 hover:bg-muted/50 text-muted-foreground'
          )}
        >
          <div className="flex items-center gap-2.5 min-w-0 flex-1">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-muted-foreground shrink-0">
              <UserX className="h-4 w-4" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold truncate">
                {isTeacherFirst ? 'Chưa gán / Bất kỳ GV nào' : 'Chưa gán Phụ trách'}
              </p>
              <p className="text-xs text-muted-foreground opacity-75 truncate">
                {isTeacherFirst ? 'Hiển thị tất cả khung giờ chung' : 'Phân công nhân sự sau'}
              </p>
            </div>
          </div>
          <div className="shrink-0 ml-1.5">
            {teacher === '' && <Check className="h-4 w-4 text-amber-600 shrink-0" />}
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
                  'flex items-center justify-between rounded-xl border p-2.5 h-[58px] transition-all',
                  !isAvailable && !isTeacherFirst
                    ? 'opacity-65 cursor-not-allowed bg-muted/10 border-dashed'
                    : 'cursor-pointer',
                  isSelectedTeacher
                    ? 'border-primary bg-primary/10 text-primary font-semibold ring-1 ring-primary/30 shadow-2xs'
                    : isAvailable
                    ? 'border-border bg-muted/20 hover:bg-muted/50 text-foreground'
                    : 'border-border/60 bg-muted/10 text-muted-foreground'
                )}
              >
                <div className="flex items-center gap-2.5 min-w-0 flex-1">
                  <div
                    className={cn(
                      'flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white',
                      t.colorClass || 'bg-primary'
                    )}
                  >
                    {t.shortName}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5 min-w-0">
                      <p className="truncate text-xs font-bold">{t.name}</p>
                      <span
                        className={cn(
                          'inline-block text-xs px-1.5 py-0.2 rounded font-semibold border shrink-0',
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
                      <p className="text-xs text-muted-foreground truncate">
                        {item.availableSlotsCount !== undefined
                          ? `${item.availableSlotsCount} ca rảnh trong ngày`
                          : 'Khả dụng trực ca'}
                      </p>
                    ) : isAvailable ? (
                      <p className="text-xs text-muted-foreground truncate">Khả dụng trực ca</p>
                    ) : (
                      <p
                        className="text-xs text-rose-600 dark:text-rose-400 font-medium truncate"
                        title={item.conflictDetail}
                      >
                        ⚠️ {item.conflictDetail || 'Đang bận lịch khác'}
                      </p>
                    )}
                  </div>
                </div>

                <div className="shrink-0 ml-1.5">
                  {isSelectedTeacher ? (
                    <span className="flex h-4 w-4 items-center justify-center rounded-full bg-primary text-primary-foreground shrink-0">
                      <Check className="h-2.5 w-2.5" />
                    </span>
                  ) : isTeacherFirst ? (
                    <span className="text-xs font-semibold text-primary shrink-0">
                      {item.availableSlotsCount ?? 0} ca
                    </span>
                  ) : isAvailable ? (
                    <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 shrink-0">
                      Rảnh
                    </span>
                  ) : (
                    <span className="text-xs font-semibold text-rose-600 dark:text-rose-400 shrink-0">
                      Bận
                    </span>
                  )}
                </div>
              </div>
            </PersonnelHoverCard>
          )
        })}

        {displayList.length === 0 && (
          <div className="col-span-full py-4 text-center text-xs text-muted-foreground">
            Chưa có nhân sự nào được phân bổ trực ca này tại cơ sở.
          </div>
        )}
      </div>
    </div>
  )
}
