'use client'

import React, { useState } from 'react'
import { usePathname } from 'next/navigation'
import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'
import { useUIStore } from '@/stores/useUIStore'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { formatDateVietnamese, toDateKeyString } from '@/components/screens/home/homeHelpers'

export function HeaderWorkdayDatePicker() {
  const pathname = usePathname()
  const currentMenuId = useUIStore((s) => s.currentMenuId)
  const workdayDateStr = useUIStore((s) => s.workdayDate)
  const setWorkdayDate = useUIStore((s) => s.setWorkdayDate)
  const [popoverOpen, setPopoverOpen] = useState(false)

  // Only display on Dashboard / Home workday page
  const isHomeWorkday = pathname === '/app/dashboard' || currentMenuId === 'dashboard'
  if (!isHomeWorkday) {
    return null
  }

  const currentDate = workdayDateStr ? new Date(`${workdayDateStr}T00:00:00`) : new Date()
  const todayStr = toDateKeyString(new Date())
  const isToday = workdayDateStr === todayStr

  const handleSelectDate = (date: Date | undefined) => {
    if (date) {
      setWorkdayDate(toDateKeyString(date))
      setPopoverOpen(false)
    }
  }

  const handlePrevDay = () => {
    const prev = new Date(currentDate)
    prev.setDate(prev.getDate() - 1)
    setWorkdayDate(toDateKeyString(prev))
  }

  const handleNextDay = () => {
    const next = new Date(currentDate)
    next.setDate(next.getDate() + 1)
    setWorkdayDate(toDateKeyString(next))
  }

  const handleTodayClick = () => {
    setWorkdayDate(todayStr)
    setPopoverOpen(false)
  }

  return (
    <div className="flex items-center justify-center">
      <div className="inline-flex items-center rounded-lg border border-border/80 bg-background/90 p-0.5 shadow-2xs">
        {/* Nút Hôm nay */}
        <Button
          type="button"
          variant={isToday ? 'default' : 'ghost'}
          size="sm"
          onClick={handleTodayClick}
          className={`h-7 px-2.5 text-2xs font-normal rounded-md transition-all ${
            isToday ? 'shadow-2xs' : 'text-muted-foreground hover:text-foreground'
          }`}
          title="Về ngày hôm nay"
        >
          Hôm nay
        </Button>

        <div className="h-3.5 w-px bg-border mx-0.5" />

        {/* Nút ngày trước */}
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={handlePrevDay}
          className="h-7 w-7 text-muted-foreground hover:text-foreground rounded-md"
          title="Ngày trước"
        >
          <ChevronLeft className="w-3.5 h-3.5" />
        </Button>

        {/* Nút mở lịch chọn ngày (Popover Calendar) */}
        <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
          <PopoverTrigger asChild>
            <button
              type="button"
              className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-normal text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-md transition-colors cursor-pointer select-none"
              title="Nhấp để mở lịch chọn ngày"
            >
              <CalendarDays className="w-3.5 h-3.5 text-primary" />
              <span className="whitespace-nowrap">{formatDateVietnamese(currentDate)}</span>
            </button>
          </PopoverTrigger>

          <PopoverContent align="center" sideOffset={6} className="w-auto p-2 rounded-xl shadow-lg border-border/80">
            <div className="space-y-2">
              <div className="flex items-center justify-between px-2 pt-1 pb-1 border-b text-xs">
                <span className="font-normal text-muted-foreground">Chọn ngày làm việc</span>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={handleTodayClick}
                  className="h-6 text-2xs text-primary px-2 font-normal"
                >
                  Hôm nay
                </Button>
              </div>

              <Calendar
                mode="single"
                selected={currentDate}
                onSelect={handleSelectDate}
                className="p-1"
              />
            </div>
          </PopoverContent>
        </Popover>

        {/* Nút ngày sau */}
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={handleNextDay}
          className="h-7 w-7 text-muted-foreground hover:text-foreground rounded-md"
          title="Ngày sau"
        >
          <ChevronRight className="w-3.5 h-3.5" />
        </Button>
      </div>
    </div>
  )
}
