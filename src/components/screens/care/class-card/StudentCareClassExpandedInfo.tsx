'use client'

import React from 'react'
import {
  Building2,
  Clock,
  Award,
  Headphones,
  Users,
  ArrowLeftRight,
  Search,
  Check,
  Package,
} from 'lucide-react'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { PersonnelHoverCard, AppAvatar, type PersonnelItem } from '@/components/shared'
import { SyllabusProfileHoverCard } from '@/components/screens/classes/SyllabusProfileHoverCard'
import { cn } from '@/lib/utils'
import type { StudentCareClassExpandedInfoProps } from './studentCareClassCardTypes'

export function StudentCareClassExpandedInfo({
  currentBranchName,
  attendedSessions,
  totalSessions,
  startDateDisplay,
  endDateDisplay,
  pkg,
  pkgIsEnglish,
  classRecordForHover,
  csPersonnelItem,
  currentCSObj,
  effectiveCSName,
  filteredCsList,
  csSearchQuery,
  setCsSearchQuery,
  isCsPopoverOpen,
  setIsCsPopoverOpen,
  handleSelectCS,
  classTeachers,
  isRenewal = false,
}: StudentCareClassExpandedInfoProps) {
  return (
    <div className="pt-2 mt-1 space-y-2.5 text-left animate-in fade-in-50 duration-200">
      {/* Hàng 1: Sản phẩm & Đào tạo (Gói • Thời hạn • Trình độ) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* Cột 1: Gói hiện tại */}
        <div className="space-y-0.5 min-w-0">
          <span className="text-xs text-muted-foreground/70 dark:text-zinc-400/80 font-medium flex items-center gap-1.5">
            <Package className="h-3.5 w-3.5 text-muted-foreground/80 shrink-0" />
            <span>{isRenewal ? 'Gói đã học' : 'Gói hiện tại'}</span>
          </span>
          <p
            className="text-xs font-semibold text-foreground truncate"
            title={pkg.packageName || (pkgIsEnglish ? 'Tiêu chuẩn Tiếng Anh 48B' : 'Toán Tư Duy STEM Rino')}
          >
            {pkg.packageName || (pkgIsEnglish ? 'Tiêu chuẩn Tiếng Anh 48B' : 'Toán Tư Duy STEM Rino')}
          </p>
        </div>

        {/* Cột 2: Thời hạn */}
        <div className="space-y-0.5 min-w-0">
          <div className="flex items-center justify-between gap-1">
            <span className="text-xs text-muted-foreground/70 dark:text-zinc-400/80 font-medium flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5 text-muted-foreground/80 shrink-0" />
              <span>Thời hạn</span>
            </span>
            <span className="text-xs text-muted-foreground font-normal">
              {attendedSessions}/{totalSessions} buổi
            </span>
          </div>
          <p className="text-xs font-medium text-foreground truncate">
            <span>{startDateDisplay} - {endDateDisplay}</span>
          </p>
        </div>

        {/* Cột 3: Trình độ */}
        <div className="space-y-0.5 min-w-0">
          <span className="text-xs text-muted-foreground/70 dark:text-zinc-400/80 font-medium flex items-center gap-1.5">
            <Award className="h-3.5 w-3.5 text-muted-foreground/80 shrink-0" />
            <span>Trình độ</span>
          </span>
          <div className="flex items-center gap-1.5 text-xs text-foreground flex-wrap font-normal">
            <SyllabusProfileHoverCard cls={classRecordForHover}>
              <span className="hover:underline cursor-pointer font-medium text-foreground">
                {pkgIsEnglish ? 'IELTS Junior v2.1' : 'Toán Tư Duy STEM Rino'}
              </span>
            </SyllabusProfileHoverCard>
            <span className="text-border/80 font-normal">•</span>
            <span className="font-medium text-foreground">
              {pkg.level && pkg.subLevel
                ? (pkg.subLevel.includes(pkg.level) ? pkg.subLevel : `${pkg.level} - ${pkg.subLevel}`)
                : (pkg.subLevel || pkg.level || 'Level 4 - A')}
            </span>
          </div>
        </div>
      </div>

      {/* Hàng 2: Cơ sở & Nhân sự phụ trách */}
      <div className={cn(
        "pt-2.5 border-t border-border/40 grid gap-3",
        isRenewal ? "grid-cols-1 sm:grid-cols-2" : "grid-cols-1 sm:grid-cols-3"
      )}>
        {/* Cột 1: Cơ sở */}
        <div className="space-y-0.5 min-w-0">
          <span className="text-xs text-muted-foreground/70 dark:text-zinc-400/80 font-medium flex items-center gap-1.5">
            <Building2 className="h-3.5 w-3.5 text-muted-foreground/80 shrink-0" />
            <span>{isRenewal ? 'Cơ sở phụ trách' : 'Cơ sở'}</span>
          </span>
          <p className="text-xs font-medium text-foreground truncate">
            {currentBranchName}
          </p>
        </div>

        {/* Cột 2: Phụ trách CS */}
        <div className="space-y-0.5 min-w-0">
          <span className="text-xs text-muted-foreground/70 dark:text-zinc-400/80 font-medium flex items-center gap-1.5">
            <Headphones className="h-3.5 w-3.5 text-muted-foreground/80 shrink-0" />
            <span>Phụ trách CS</span>
          </span>
          <div className="flex items-center gap-1.5 text-xs font-medium text-foreground flex-wrap">
            <PersonnelHoverCard person={csPersonnelItem}>
              <span className="hover:underline cursor-pointer font-semibold text-foreground truncate">
                {currentCSObj.name}
              </span>
            </PersonnelHoverCard>

            {/* Popover đổi nhân sự CS */}
            <Popover open={isCsPopoverOpen} onOpenChange={setIsCsPopoverOpen}>
              <PopoverTrigger asChild>
                <button
                  type="button"
                  className="p-1 text-muted-foreground hover:text-foreground hover:bg-muted/80 rounded transition-colors cursor-pointer shrink-0"
                  title="Đổi nhân viên phụ trách CS"
                  aria-label="Đổi nhân viên phụ trách CS"
                >
                  <ArrowLeftRight className="h-3 w-3" />
                </button>
              </PopoverTrigger>
              <PopoverContent
                align="start"
                className="w-72 p-2 space-y-2 max-h-80 flex flex-col z-50 shadow-md bg-popover text-popover-foreground"
              >
                <div className="flex items-center gap-1.5 px-2 py-1.5 bg-muted/50 rounded-md border border-border/60">
                  <Search className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                  <input
                    value={csSearchQuery}
                    onChange={(e) => setCsSearchQuery(e.target.value)}
                    placeholder="Tìm nhân sự CS..."
                    className="w-full bg-transparent text-xs outline-none p-0 placeholder:text-muted-foreground"
                    autoFocus
                  />
                </div>
                <div className="text-[10.5px] font-semibold text-muted-foreground uppercase px-1 pb-0.5 border-b border-border/40">
                  Chọn nhân sự phụ trách CS
                </div>
                <div className="flex-1 overflow-y-auto space-y-1 max-h-52 pr-0.5">
                  {filteredCsList.length === 0 ? (
                    <div className="py-3 text-center text-xs text-muted-foreground">
                      Không tìm thấy nhân sự phù hợp
                    </div>
                  ) : (
                    filteredCsList.map((staff) => {
                      const isSelected = staff.name.toLowerCase() === effectiveCSName.toLowerCase()
                      return (
                        <div
                          key={staff.id}
                          onClick={() => handleSelectCS(staff)}
                          className={cn(
                            'flex items-center justify-between px-2 py-1.5 rounded-md text-xs cursor-pointer transition-colors min-h-[34px]',
                            isSelected
                              ? 'bg-sky-50 dark:bg-sky-950/40 text-sky-900 dark:text-sky-200 font-medium'
                              : 'hover:bg-muted/70 text-foreground'
                          )}
                        >
                          <div className="flex items-center gap-2 min-w-0">
                            <AppAvatar
                              src={staff.avatar}
                              name={staff.name}
                              size="xs"
                              className="h-6 w-6 border border-border/50 shrink-0"
                            />
                            <div className="min-w-0">
                              <span className="text-xs font-semibold block truncate">
                                {staff.name}
                              </span>
                              <span className="text-[10px] text-muted-foreground block truncate">
                                {staff.code} {staff.role ? `• ${staff.role}` : ''}
                              </span>
                            </div>
                          </div>
                          {isSelected && (
                            <Check className="h-3.5 w-3.5 text-sky-600 dark:text-sky-400 shrink-0 ml-1" />
                          )}
                        </div>
                      )
                    })
                  )}
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </div>

        {/* Cột 3: Phụ trách GV - Ẩn hoàn toàn khi ở màn tái phí */}
        {!isRenewal && (
          <div className="space-y-0.5 min-w-0">
            <span className="text-xs text-muted-foreground/70 dark:text-zinc-400/80 font-medium flex items-center gap-1.5">
              <Users className="h-3.5 w-3.5 text-muted-foreground/80 shrink-0" />
              <span>Phụ trách GV</span>
            </span>
            <div className="flex items-center gap-1 text-xs font-medium text-foreground flex-wrap">
              {classTeachers.length > 0 ? (
                classTeachers.map((teacher, idx) => {
                  const cleanedName = teacher.name.startsWith('GV_') ? teacher.name : teacher.name.replace(/^GV\.?\s*/i, '').trim()
                  const teacherPersonnel: PersonnelItem = {
                    id: teacher.id,
                    name: cleanedName,
                    role: teacher.role || 'Giáo viên phụ trách',
                    phone: teacher.phone || '0912 345 678',
                    email: teacher.email || 'giaovien@rinoedu.vn',
                    avatar: teacher.avatar || `https://api.dicebear.com/7.x/adventurer/svg?seed=${cleanedName}`,
                  }
                  return (
                    <React.Fragment key={teacher.id}>
                      <PersonnelHoverCard person={teacherPersonnel}>
                        <span className="hover:underline cursor-pointer font-semibold text-foreground">
                          {cleanedName}
                        </span>
                      </PersonnelHoverCard>
                      {idx < classTeachers.length - 1 && <span className="text-muted-foreground mr-1">,</span>}
                    </React.Fragment>
                  )
                })
              ) : (
                <span className="text-muted-foreground font-normal">Chưa phân công</span>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
