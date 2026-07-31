'use client'

import { useState } from 'react'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Download, ListTodo, Calendar as CalendarIcon } from 'lucide-react'
import { Calendar } from '@/components/ui/calendar'
import { cn } from '@/lib/utils'

interface CompactExportPopoverProps {
  trigger: React.ReactNode
  title: string
  fields: { id: string; label: string; defaultChecked?: boolean }[]
  onConfirm: (
    selectedFieldIds: string[],
    filters: { month: string; startDate: string; endDate: string }
  ) => void
  recordCount: number
}

export function CompactExportPopover({
  trigger,
  title,
  fields,
  onConfirm,
  recordCount
}: CompactExportPopoverProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedFields, setSelectedFields] = useState<Set<string>>(() => {
    const initial = new Set<string>()
    fields.forEach(f => {
      if (f.defaultChecked !== false) {
        initial.add(f.id)
      }
    })
    return initial
  })

  // Date filters state
  const [selectedMonth, setSelectedMonth] = useState('all')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [calendarOpen, setCalendarOpen] = useState(false)

  // Handle open state change to reset fields to default if needed
  const handleOpenChange = (open: boolean) => {
    setIsOpen(open)
    if (open) {
      const initial = new Set<string>()
      fields.forEach(f => {
        if (f.defaultChecked !== false) {
          initial.add(f.id)
        }
      })
      setSelectedFields(initial)
      setSelectedMonth('all')
      setStartDate('')
      setEndDate('')
      setCalendarOpen(false)
    }
  }

  const handleToggle = (fieldId: string) => {
    setSelectedFields(prev => {
      const next = new Set(prev)
      if (next.has(fieldId)) {
        next.delete(fieldId)
      } else {
        next.add(fieldId)
      }
      return next
    })
  }

  const handleSelectAll = () => {
    setSelectedFields(new Set(fields.map(f => f.id)))
  }

  const handleClearAll = () => {
    setSelectedFields(new Set())
  }

  const handleConfirm = () => {
    onConfirm(Array.from(selectedFields), { month: selectedMonth, startDate, endDate })
    setIsOpen(false)
  }

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '';
    const parts = dateStr.split('-');
    if (parts.length < 3) return dateStr;
    return `${parts[2]}/${parts[1]}/${parts[0]}`;
  };

  return (
    <Popover open={isOpen} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        {trigger}
      </PopoverTrigger>
      
      <PopoverContent 
        align="end" 
        side="bottom"
        sideOffset={6}
        className="w-[460px] p-3 rounded-lg border bg-popover text-popover-foreground shadow-md"
      >
        {/* Header (No Subtitle, minimized padding) */}
        <div className="flex items-center gap-1.5 border-b border-border/40 pb-1.5 mb-2">
          <ListTodo className="h-4 w-4 text-sky-600 shrink-0" />
          <span className="text-xs font-bold text-foreground">{title}</span>
        </div>

        {/* Date Filters Row */}
        <div className="grid grid-cols-2 gap-3 border-b border-border/40 pb-2.5 mb-2">
          <div>
            <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block mb-1">
              Chọn tháng dữ liệu
            </label>
            <select
              value={selectedMonth}
              onChange={(e) => {
                setSelectedMonth(e.target.value)
                if (e.target.value !== 'all') {
                  setStartDate('')
                  setEndDate('')
                }
              }}
              className="w-full h-8 px-2 rounded border border-border bg-background text-xs font-semibold focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring cursor-pointer"
            >
              <option value="all">Tất cả các tháng</option>
              {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
                <option key={m} value={m.toString()}>
                  Tháng {m}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block mb-1">
              Khoảng thời gian
            </label>
            <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className={cn(
                    "w-full h-8 text-xs flex items-center justify-start gap-1.5 px-2 bg-background hover:bg-muted border border-border text-muted-foreground cursor-pointer font-medium",
                    startDate || endDate ? "border-sky-400 bg-sky-50/30 text-sky-700 dark:text-sky-400" : ""
                  )}
                >
                  <CalendarIcon className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                  {startDate || endDate ? (
                    <span className="font-semibold text-ellipsis overflow-hidden whitespace-nowrap">
                      {startDate ? formatDate(startDate) : '...'} - {endDate ? formatDate(endDate) : '...'}
                    </span>
                  ) : (
                    <span>Chọn khoảng thời gian...</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 z-50 text-left bg-popover border shadow-md rounded-lg overflow-hidden" align="start">
                <Calendar
                  mode="range"
                  selected={{
                    from: startDate ? new Date(startDate) : undefined,
                    to: endDate ? new Date(endDate) : undefined
                  }}
                  onSelect={(range) => {
                    if (range?.from) {
                      const year = range.from.getFullYear();
                      const month = String(range.from.getMonth() + 1).padStart(2, '0');
                      const day = String(range.from.getDate()).padStart(2, '0');
                      setStartDate(`${year}-${month}-${day}`);
                    } else {
                      setStartDate('');
                    }

                    if (range?.to) {
                      const year = range.to.getFullYear();
                      const month = String(range.to.getMonth() + 1).padStart(2, '0');
                      const day = String(range.to.getDate()).padStart(2, '0');
                      setEndDate(`${year}-${month}-${day}`);
                    } else {
                      setEndDate('');
                    }

                    // Clear month select so it doesn't conflict
                    setSelectedMonth('all');
                  }}
                  numberOfMonths={1}
                  className="bg-background"
                />
                <div className="flex justify-between items-center p-2 border-t border-border/40 bg-muted/20">
                  <Button
                    size="xs"
                    variant="ghost"
                    className="h-6 text-[10px] text-muted-foreground hover:text-foreground cursor-pointer"
                    onClick={() => {
                      setStartDate('');
                      setEndDate('');
                    }}
                  >
                    Xóa lọc
                  </Button>

                  <Button
                    size="xs"
                    className="h-6 text-[10px] bg-sky-600 hover:bg-sky-700 text-white font-bold cursor-pointer"
                    onClick={() => {
                      setCalendarOpen(false);
                    }}
                  >
                    Áp dụng
                  </Button>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </div>

        {/* Action controls row (Select/Clear on Left, Stats count on Right) */}
        <div className="flex items-center justify-between text-[10px] mb-2">
          <div className="flex items-center gap-2">
            <button
              type="button"
              className="text-sky-600 hover:text-sky-700 font-bold hover:underline cursor-pointer"
              onClick={handleSelectAll}
            >
              Chọn tất cả
            </button>
            <span className="text-border">|</span>
            <button
              type="button"
              className="text-muted-foreground hover:text-foreground font-medium hover:underline cursor-pointer"
              onClick={handleClearAll}
            >
              Bỏ chọn tất cả
            </button>
          </div>
          
          <div className="text-muted-foreground bg-muted/60 px-1.5 py-0.5 rounded font-medium">
            Số lượng: <strong className="text-foreground font-bold">{recordCount}</strong>
          </div>
        </div>

        {/* Scrollable grid of fields checkbox */}
        <div className="grid grid-cols-2 gap-x-2 gap-y-1.5 p-2 rounded border border-border/50 bg-muted/15 max-h-[220px] overflow-y-auto mb-2.5">
          {fields.map(field => {
            const isChecked = selectedFields.has(field.id)
            return (
              <div
                key={field.id}
                onClick={() => handleToggle(field.id)}
                className="flex items-start gap-1.5 p-1 rounded hover:bg-muted/40 cursor-pointer transition-colors select-none"
              >
                <Checkbox
                  id={`popfield-${field.id}`}
                  checked={isChecked}
                  onCheckedChange={() => handleToggle(field.id)}
                  className="h-3.5 w-3.5 mt-0.5"
                  onClick={(e) => e.stopPropagation()}
                />
                <label
                  htmlFor={`popfield-${field.id}`}
                  className="text-[11px] text-foreground/90 font-medium leading-none cursor-pointer overflow-hidden text-ellipsis whitespace-nowrap"
                  onClick={(e) => e.preventDefault()}
                >
                  {field.label}
                </label>
              </div>
            )
          })}
        </div>

        {/* Footer actions */}
        <div className="flex justify-end gap-1.5 pt-1.5 border-t border-border/40">
          <Button
            size="xs"
            variant="ghost"
            type="button"
            className="h-6 px-2 text-[10px] text-muted-foreground cursor-pointer"
            onClick={() => setIsOpen(false)}
          >
            Hủy
          </Button>
          <Button
            size="xs"
            type="button"
            disabled={selectedFields.size === 0}
            className="h-6 px-2.5 text-[10px] font-bold bg-sky-600 hover:bg-sky-700 text-white flex items-center gap-1 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={handleConfirm}
          >
            <Download className="h-3 w-3" />
            Xuất Excel
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  )
}
