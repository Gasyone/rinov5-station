'use client'

import { Check, UserX } from 'lucide-react'
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
}

interface BookingTestCreateStaffSectionProps {
  selectedSlot: string
  teacher: string
  onTeacherChange: (teacherName: string) => void
  currentSlotStaffList: DutyStaffItem[]
}

export function BookingTestCreateStaffSection({
  selectedSlot,
  teacher,
  onTeacherChange,
  currentSlotStaffList,
}: BookingTestCreateStaffSectionProps) {
  const availableStaffCount = currentSlotStaffList.filter((s) => s.isAvailable).length

  return (
    <div className="rounded-xl border bg-card p-3.5 shadow-2xs space-y-2.5">
      <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center justify-between pb-1 border-b">
        <span>Phụ trách ca {selectedSlot}</span>
        <span className="text-xs text-muted-foreground font-normal">
          <span className="font-semibold text-foreground">{availableStaffCount}</span>/
          {currentSlotStaffList.length} nhân sự rảnh
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
        {/* Lựa chọn 0: Chưa gán Phụ trách */}
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
              <p className="text-xs font-semibold truncate">Chưa gán Phụ trách</p>
              <p className="text-[10px] text-muted-foreground opacity-75 truncate">Phân công nhân sự sau</p>
            </div>
          </div>
          <div className="shrink-0 ml-1.5">
            {teacher === '' && <Check className="h-4 w-4 text-amber-600 shrink-0" />}
          </div>
        </div>

        {/* Danh sách các nhân sự phụ trách */}
        {currentSlotStaffList.map((item) => {
          const t = item.employee
          const isSelectedTeacher = teacher === t.name
          const isAvailable = item.isAvailable

          return (
            <div
              key={t.id}
              onClick={() => {
                if (isAvailable) {
                  onTeacherChange(t.name)
                }
              }}
              className={cn(
                'flex items-center justify-between rounded-xl border p-2.5 h-[58px] transition-all',
                !isAvailable
                  ? 'opacity-65 cursor-not-allowed bg-muted/10 border-dashed'
                  : 'cursor-pointer',
                isSelectedTeacher && isAvailable
                  ? 'border-primary bg-primary/10 text-primary font-semibold ring-1 ring-primary/30 shadow-2xs'
                  : isAvailable
                  ? 'border-border bg-muted/20 hover:bg-muted/50 text-foreground'
                  : ''
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
                        'inline-block text-[9px] px-1.5 py-0.2 rounded font-semibold border shrink-0',
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
                  {isAvailable ? (
                    <p className="text-[10px] text-muted-foreground truncate">Khả dụng trực ca</p>
                  ) : (
                    <p
                      className="text-[10px] text-rose-600 dark:text-rose-400 font-medium truncate"
                      title={item.conflictDetail}
                    >
                      ⚠️ {item.conflictDetail || 'Đang bận lịch khác'}
                    </p>
                  )}
                </div>
              </div>

              <div className="shrink-0 ml-1.5">
                {isSelectedTeacher && isAvailable ? (
                  <span className="flex h-4 w-4 items-center justify-center rounded-full bg-primary text-primary-foreground shrink-0">
                    <Check className="h-2.5 w-2.5" />
                  </span>
                ) : isAvailable ? (
                  <span className="text-[10px] font-medium text-emerald-600 bg-emerald-50 dark:bg-emerald-950 px-1.5 py-0.5 rounded border border-emerald-200 shrink-0">
                    Rảnh
                  </span>
                ) : (
                  <span className="text-[10px] font-medium text-rose-600 bg-rose-50 dark:bg-rose-950 px-1.5 py-0.5 rounded border border-rose-200 shrink-0">
                    Bận
                  </span>
                )}
              </div>
            </div>
          )
        })}

        {currentSlotStaffList.length === 0 && (
          <div className="col-span-full py-4 text-center text-xs text-muted-foreground">
            Chưa có nhân sự nào được phân bổ trực ca này tại cơ sở.
          </div>
        )}
      </div>
    </div>
  )
}
