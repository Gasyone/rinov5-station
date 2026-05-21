'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { getInitials } from './bookingTestHelpers'
import { BOOKING_SLOT_TIMES } from './bookingTestConstants'
import type { BookingTest } from '@/mocks/bookingTests'
import { UserSearch } from 'lucide-react'

interface BookingTestSchedulePanelProps {
  scheduleDate: string
  scheduleTime: string
  teacher: string
  teacherOptions: string[]
  bookings: BookingTest[]
  onScheduleChange: (date: string, time: string, teacher: string) => void
  onOpenEmployeePicker?: () => void
  program: string
  school: string
  testDuration: string
}

export function BookingTestSchedulePanel({
  scheduleDate,
  scheduleTime,
  teacher,
  teacherOptions,
  bookings,
  onScheduleChange,
  onOpenEmployeePicker,
  program,
  school,
  testDuration,
}: BookingTestSchedulePanelProps) {
  const [activeTab, setActiveTab] = useState<'date' | 'teacher'>('date')
  const [expandedTeacher, setExpandedTeacher] = useState<string | null>('')
  const [selectedDateFilter, setSelectedDateFilter] = useState<string>(scheduleDate)
  const [expandedTeacherDate, setExpandedTeacherDate] = useState<string | null>(null)

  const today = new Date()
  const dates = Array.from({ length: 3 }).map((_, i) => {
    const d = new Date(today)
    d.setDate(d.getDate() + i)
    return d.toISOString().slice(0, 10)
  })

  // Ensure default selected date is in our 3 days array
  const activeDateFilter = dates.includes(selectedDateFilter) ? selectedDateFilter : dates[0]

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr)
    const days = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7']
    return `${days[d.getDay()]} ${d.getDate().toString().padStart(2, '0')}/${(
      d.getMonth() + 1
    ).toString().padStart(2, '0')}`
  }

  const generateSlots = (duration: string) => {
    const minutesInterval = duration === '20 phút' ? 20 : 30
    const slots = []
    let currentMinutes = 9 * 60 // 09:00
    const endMinutes = 22 * 60 // 22:00
    while (currentMinutes <= endMinutes) {
      const h = Math.floor(currentMinutes / 60)
      const m = currentMinutes % 60
      slots.push(`${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`)
      currentMinutes += minutesInterval
    }
    return slots
  }
  const activeSlots = generateSlots(testDuration)

  const isSlotBooked = (date: string, time: string, t: string) => {
    if (!t) return false
    return bookings.some(
      (b) =>
        b.teacher === t &&
        b.status !== 'cancelled' &&
        b.testTime === `${date} ${time}`
    )
  }

  const handleSlotClick = (date: string, time: string, t: string) => {
    onScheduleChange(date, time, t)
  }

  const renderSlotGrid = (date: string, t: string) => (
    <div className="mt-2 grid grid-cols-4 gap-2">
      {activeSlots.map((time) => {
        const disabled = isSlotBooked(date, time, t)
        const isSelected = scheduleDate === date && scheduleTime === time && teacher === t
        if (disabled) return null // Hide booked slots as per RULE-FORM-05 updated
        return (
          <Button
            key={time}
            type="button"
            variant={isSelected ? 'default' : 'outline'}
            size="sm"
            className="h-8 text-xs"
            onClick={() => handleSlotClick(date, time, t)}
          >
            {time}
          </Button>
        )
      })}
    </div>
  )

  const teachersWithDefault = ['', ...teacherOptions]

  if (!program || !school) {
    return (
      <div className="flex h-full flex-col">
        <h3 className="mb-4 text-sm font-semibold">Lịch hẹn</h3>
        <div className="flex flex-1 flex-col items-center justify-center rounded-md border border-dashed p-8 text-center text-muted-foreground">
          Vui lòng chọn Chương trình và Cơ sở ở bên trái<br/>
          Lịch hẹn trống sẽ tự động hiển thị tại đây.
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-full flex-col">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-sm font-semibold">Lịch hẹn</h3>
      </div>

      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'date' | 'teacher')}>
        <TabsList className="mb-4 grid w-full grid-cols-2">
          <TabsTrigger value="date">Chọn Ngày</TabsTrigger>
          <TabsTrigger value="teacher">Chọn Giáo viên</TabsTrigger>
        </TabsList>

        <TabsContent value="date" className="mt-0 flex flex-col space-y-4">
          <div className="flex gap-2">
            {dates.map((d) => (
              <Button
                key={d}
                variant={activeDateFilter === d ? 'default' : 'outline'}
                size="sm"
                className="flex-1"
                onClick={() => {
                  setSelectedDateFilter(d)
                  setExpandedTeacher('')
                }}
              >
                {formatDate(d)}
              </Button>
            ))}
          </div>
          <ScrollArea className="h-[320px] pr-3">
            <div className="space-y-3">
              {teachersWithDefault.map((t) => {
                const isDefault = t === ''
                const isExpanded = expandedTeacher === t
                return (
                  <div key={t} className="rounded-md border p-3">
                    <div
                      className="flex cursor-pointer items-center justify-between"
                      onClick={() => setExpandedTeacher(isExpanded ? null : t)}
                    >
                      <div className="flex items-center gap-2">
                        {!isDefault && (
                          <Avatar className="h-6 w-6">
                            <AvatarFallback className="text-[10px]">
                              {getInitials(t)}
                            </AvatarFallback>
                          </Avatar>
                        )}
                        <span className="text-sm font-medium">
                          {isDefault ? 'Không chọn giáo viên' : t}
                        </span>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {isExpanded ? 'Thu gọn' : 'Mở rộng'}
                      </span>
                    </div>
                    {isExpanded && renderSlotGrid(activeDateFilter, t)}
                  </div>
                )
              })}
            </div>
          </ScrollArea>
        </TabsContent>

        <TabsContent value="teacher" className="mt-0 flex flex-col space-y-4">
          <ScrollArea className="h-[380px]">
            <div className="mb-4 flex flex-wrap gap-2">
              {teacherOptions.map((t) => (
                <HoverCard key={t}>
                  <HoverCardTrigger asChild>
                    <div
                      className={`cursor-pointer rounded-full p-0.5 transition-colors ${
                        expandedTeacher === t
                          ? 'bg-primary ring-2 ring-primary ring-offset-1'
                          : 'hover:bg-accent'
                      }`}
                      onClick={() => {
                        setExpandedTeacher(t)
                        setExpandedTeacherDate(null)
                      }}
                    >
                      <Avatar className="h-10 w-10 border">
                        <AvatarFallback>{getInitials(t)}</AvatarFallback>
                      </Avatar>
                    </div>
                  </HoverCardTrigger>
                  <HoverCardContent className="w-64 p-3" align="start">
                    <div className="flex justify-between space-x-4">
                      <Avatar className="h-12 w-12">
                        <AvatarFallback>{getInitials(t)}</AvatarFallback>
                      </Avatar>
                      <div className="space-y-1 text-sm">
                        <h4 className="font-semibold">{t}</h4>
                        <p className="text-xs text-muted-foreground">Giáo viên Tiếng Anh</p>
                      </div>
                    </div>
                    {onOpenEmployeePicker && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="mt-3 w-full gap-2 text-xs"
                        onClick={onOpenEmployeePicker}
                      >
                        <UserSearch className="h-3.5 w-3.5" /> Xem danh sách
                      </Button>
                    )}
                  </HoverCardContent>
                </HoverCard>
              ))}
            </div>

            {expandedTeacher ? (
              <div className="space-y-3">
                <h4 className="text-sm font-semibold border-b pb-2 mb-2">
                  Lịch khả dụng của {expandedTeacher}
                </h4>
                {dates.map((d) => {
                  const isDateExpanded = expandedTeacherDate === d
                  return (
                    <div key={d} className="rounded-md border p-3">
                      <div 
                        className="flex cursor-pointer items-center justify-between"
                        onClick={() => setExpandedTeacherDate(isDateExpanded ? null : d)}
                      >
                        <span className="text-sm font-medium">{formatDate(d)}</span>
                        <span className="text-xs text-muted-foreground">
                          {isDateExpanded ? 'Thu gọn' : 'Mở rộng'}
                        </span>
                      </div>
                      {isDateExpanded && renderSlotGrid(d, expandedTeacher)}
                    </div>
                  )
                })}
              </div>
            ) : null}
            {!expandedTeacher && (
              <div className="flex h-32 items-center justify-center rounded-md border border-dashed">
                <p className="text-sm text-muted-foreground">Chọn 1 giáo viên để xem lịch</p>
              </div>
            )}
          </ScrollArea>
        </TabsContent>
      </Tabs>
    </div>
  )
}
