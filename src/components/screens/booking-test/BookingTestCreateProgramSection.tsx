'use client'

import React, { useMemo } from 'react'
import { CalendarClock, MapPin } from 'lucide-react'
import { InlineSelect } from '@/components/controls'
import { cn } from '@/lib/utils'
import type { BookingTest } from '@/mocks/bookingTests'
import { formatTestTimeWithDay } from './bookingTestHelpers'

export interface CenterInfoItem {
  name: string
  distance?: number
  distanceStr?: string
  address: string
}

interface BookingTestCreateProgramSectionProps {
  program: string
  onProgramChange: (newProgram: string) => void
  level: string
  onLevelChange: (newLevel: string) => void
  school: string
  onSchoolChange: (newSchool: string) => void
  programOptions: Array<{
    value: string
    label: React.ReactNode
    textValue?: string
    selectedLabel?: React.ReactNode
  }>
  levelOptions: Array<{
    value: string
    label: React.ReactNode
    textValue?: string
    selectedLabel?: React.ReactNode
  }>
  schoolSelectOptions: Array<{
    value: string
    textValue: string
    label: React.ReactNode
    selectedLabel?: React.ReactNode
  }>
  centerData: CenterInfoItem[]
  customerAddress?: string
  duplicateBookings?: BookingTest[]
  onOpenDuplicateModal?: (booking: BookingTest) => void
  className?: string
}

export function BookingTestCreateProgramSection({
  program,
  onProgramChange,
  level,
  onLevelChange,
  school,
  onSchoolChange,
  programOptions,
  levelOptions,
  schoolSelectOptions,
  centerData,
  customerAddress,
  duplicateBookings,
  onOpenDuplicateModal,
  className,
}: BookingTestCreateProgramSectionProps) {
  // Tìm các cơ sở phù hợp theo quận/huyện của địa chỉ khách hàng (ẩn số km, chỉ hiển thị tên cơ sở)
  const { labelText, suggestedCenters } = useMemo(() => {
    if (!centerData || centerData.length === 0) {
      return { labelText: 'Đề xuất cơ sở cùng quận:', suggestedCenters: [] }
    }

    if (customerAddress) {
      const districtMatch = customerAddress.match(
        /(Quận\s+\w+|Huyện\s+[\w\s]+|Cầu Giấy|Hoàng Mai|Thanh Xuân|Đống Đa|Hà Đông|Nam Từ Liêm|Bắc Từ Liêm|Hai Bà Trưng|Ba Đình|Hoàn Kiếm|Tây Hồ|Long Biên|Thủ Đức)/i
      )
      const district = districtMatch ? districtMatch[0].trim() : ''

      if (district) {
        const matched = centerData.filter(
          (c) =>
            c.address.toLowerCase().includes(district.toLowerCase()) ||
            c.name.toLowerCase().includes(district.toLowerCase())
        )
        if (matched.length > 0) {
          const remaining = centerData.filter((c) => !matched.some((m) => m.name === c.name))
          return {
            labelText: `Đề xuất cơ sở cùng ${district}:`,
            suggestedCenters: [...matched, ...remaining].slice(0, 3),
          }
        }
      }
    }

    return {
      labelText: 'Đề xuất cơ sở cùng quận:',
      suggestedCenters: centerData.slice(0, 3),
    }
  }, [centerData, customerAddress])

  return (
    <div
      className={cn(
        'rounded-lg border border-border/70 bg-background p-2.5 space-y-2',
        className
      )}
    >
      {/* 3 Dropdown chọn Chương trình, Level, Cơ sở trên 1 hàng với text "Chọn:" ở trước */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
        <span className="text-xs font-medium text-muted-foreground shrink-0">
          Chọn:
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 flex-1">
          <InlineSelect
            value={program}
            onValueChange={onProgramChange}
            options={programOptions}
            placeholder="Chọn chương trình"
            ariaLabel="Chọn chương trình"
          />

          <InlineSelect
            value={level}
            onValueChange={onLevelChange}
            options={levelOptions}
            placeholder={program ? 'Level dự kiến' : 'Chọn chương trình trước'}
            disabled={!program || levelOptions.length === 0}
            ariaLabel="Chọn level"
          />

          <InlineSelect
            value={school}
            onValueChange={onSchoolChange}
            options={schoolSelectOptions}
            placeholder="Chọn trung tâm"
            ariaLabel="Chọn trung tâm"
          />
        </div>
      </div>

      {/* Liệt kê text link các cơ sở đề xuất / cùng quận để người dùng chọn nhanh (ẩn km, chỉ hiển thị tên cơ sở) */}
      {suggestedCenters.length > 0 && (
        <div className="flex flex-wrap items-center gap-1.5 text-xs pt-0.5">
          <span className="text-xs text-muted-foreground font-medium flex items-center gap-1 shrink-0">
            <MapPin className="h-3 w-3 text-primary shrink-0" />
            <span>{labelText}</span>
          </span>
          <div className="flex flex-wrap items-center gap-2">
            {suggestedCenters.map((item, idx) => {
              const isSelected = school === item.name
              return (
                <div key={item.name} className="flex items-center gap-2">
                  {idx > 0 && <span className="text-muted-foreground/30 text-xs">•</span>}
                  <button
                    type="button"
                    onClick={() => onSchoolChange(item.name)}
                    className={cn(
                      'text-[11.5px] transition-colors cursor-pointer text-left',
                      isSelected
                        ? 'text-primary font-bold underline underline-offset-4 decoration-primary decoration-2'
                        : 'text-primary/80 hover:text-primary hover:underline underline-offset-2'
                    )}
                    title={`${item.name} - ${item.address}`}
                  >
                    <span>{item.name}</span>
                  </button>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Thông báo nhanh nếu học viên đã có lịch trải nghiệm môn nào đó */}
      {duplicateBookings && duplicateBookings.length > 0 && (
        <div className="flex items-center justify-between gap-2 p-2 rounded-md bg-amber-500/10 border border-amber-500/25 text-xs text-amber-800 dark:text-amber-300">
          <div className="flex items-center gap-2 min-w-0">
            <CalendarClock className="size-4 text-amber-600 dark:text-amber-400 shrink-0" />
            <span className="truncate">
              Học viên đã có lịch trải nghiệm: <strong>{duplicateBookings[0].program}</strong> ({formatTestTimeWithDay(duplicateBookings[0].testTime)})
            </span>
          </div>
          <button
            type="button"
            onClick={() => onOpenDuplicateModal?.(duplicateBookings[0])}
            className="text-[11.5px] font-semibold text-amber-700 dark:text-amber-300 hover:underline shrink-0 cursor-pointer"
          >
            Xem chi tiết
          </button>
        </div>
      )}
    </div>
  )
}
