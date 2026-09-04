'use client'

import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Calendar } from 'lucide-react'

export interface RenewalDateRangeFilterProps {
  startDate: string
  endDate: string
  onStartDateChange: (date: string) => void
  onEndDateChange: (date: string) => void
  onClearDates: () => void
}

export function RenewalDateRangeFilter({
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
  onClearDates,
}: RenewalDateRangeFilterProps) {
  const hasCustomDates = Boolean(startDate || endDate)

  return (
    <div className="space-y-2.5 pt-1">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-xs font-bold text-foreground">
          <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
          <span>Khoảng ngày hết hạn cụ thể</span>
        </div>
        {hasCustomDates && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onClearDates}
            className="h-6 text-xs px-1.5 text-muted-foreground hover:text-foreground shadow-none"
          >
            Xóa ngày
          </Button>
        )}
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div className="space-y-1">
          <Label className="text-xs text-muted-foreground font-semibold">Từ ngày</Label>
          <Input
            type="date"
            value={startDate}
            onChange={(e) => onStartDateChange(e.target.value)}
            className="h-8 text-xs px-2 cursor-pointer bg-background"
          />
        </div>
        <div className="space-y-1">
          <Label className="text-xs text-muted-foreground font-semibold">Đến ngày</Label>
          <Input
            type="date"
            value={endDate}
            onChange={(e) => onEndDateChange(e.target.value)}
            className="h-8 text-xs px-2 cursor-pointer bg-background"
          />
        </div>
      </div>
      {hasCustomDates && (
        <p className="text-[10.5px] text-primary font-medium">
          Đang lọc hạn học phí từ {startDate ? startDate.split('-').reverse().join('/') : '...'} đến {endDate ? endDate.split('-').reverse().join('/') : '...'}
        </p>
      )}
    </div>
  )
}
