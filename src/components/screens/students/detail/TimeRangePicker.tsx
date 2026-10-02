'use client'

import React, { useState } from 'react'
import { Clock, Check } from 'lucide-react'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface TimeRangePickerProps {
  startTime: string
  endTime: string
  onChange: (startTime: string, endTime: string) => void
  disabled?: boolean
  className?: string
}

function parseTimeString(val: string, fallbackH = 17, fallbackM = 30): { h: number; m: number } {
  const match = val?.match(/^(\d{1,2}):(\d{2})$/)
  if (match) {
    return {
      h: Math.min(23, Math.max(0, parseInt(match[1], 10))),
      m: Math.min(59, Math.max(0, parseInt(match[2], 10))),
    }
  }
  return { h: fallbackH, m: fallbackM }
}

function formatTime(h: number, m: number): string {
  return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`
}

export function TimeRangePicker({
  startTime,
  endTime,
  onChange,
  disabled = false,
  className,
}: TimeRangePickerProps) {
  const [open, setOpen] = useState(false)
  // Target: Đang chọn giờ bắt đầu hay giờ kết thúc
  const [activeTarget, setActiveTarget] = useState<'start' | 'end'>('start')
  // Unit: 1 vòng duy nhất - Đang hiển thị vòng GIỜ hay vòng PHÚT
  const [activeUnit, setActiveUnit] = useState<'hour' | 'minute'>('hour')

  // Parse start & end times
  const parsedStart = parseTimeString(startTime, 17, 30)
  const parsedEnd = parseTimeString(endTime, 19, 0)

  // Tracking prop changes
  const [prevStart, setPrevStart] = useState(startTime)
  const [prevEnd, setPrevEnd] = useState(endTime)

  // Internal time states
  const [startH, setStartH] = useState(parsedStart.h)
  const [startM, setStartM] = useState(parsedStart.m)
  const [endH, setEndH] = useState(parsedEnd.h)
  const [endM, setEndM] = useState(parsedEnd.m)

  // Text inputs states cho phép gõ trực tiếp từ bàn phím
  const [inputStartH, setInputStartH] = useState(parsedStart.h.toString().padStart(2, '0'))
  const [inputStartM, setInputStartM] = useState(parsedStart.m.toString().padStart(2, '0'))
  const [inputEndH, setInputEndH] = useState(parsedEnd.h.toString().padStart(2, '0'))
  const [inputEndM, setInputEndM] = useState(parsedEnd.m.toString().padStart(2, '0'))

  // Sáng / Chiều cho từng target
  const [startPeriod, setStartPeriod] = useState<'morning' | 'afternoon'>(
    parsedStart.h >= 12 ? 'afternoon' : 'morning'
  )
  const [endPeriod, setEndPeriod] = useState<'morning' | 'afternoon'>(
    parsedEnd.h >= 12 ? 'afternoon' : 'morning'
  )

  if (startTime !== prevStart || endTime !== prevEnd) {
    setPrevStart(startTime)
    setPrevEnd(endTime)
    setStartH(parsedStart.h)
    setStartM(parsedStart.m)
    setEndH(parsedEnd.h)
    setEndM(parsedEnd.m)
    setInputStartH(parsedStart.h.toString().padStart(2, '0'))
    setInputStartM(parsedStart.m.toString().padStart(2, '0'))
    setInputEndH(parsedEnd.h.toString().padStart(2, '0'))
    setInputEndM(parsedEnd.m.toString().padStart(2, '0'))
    setStartPeriod(parsedStart.h >= 12 ? 'afternoon' : 'morning')
    setEndPeriod(parsedEnd.h >= 12 ? 'afternoon' : 'morning')
  }

  // Commit changes to parent
  const commit = (newStartH = startH, newStartM = startM, newEndH = endH, newEndM = endM) => {
    onChange(formatTime(newStartH, newStartM), formatTime(newEndH, newEndM))
  }

  // Active values based on target
  const currentPeriod = activeTarget === 'start' ? startPeriod : endPeriod
  const currentHour = activeTarget === 'start' ? startH : endH
  const currentMinute = activeTarget === 'start' ? startM : endM

  // Xử lý khi gõ phím trực tiếp vào ô GIỜ
  const handleHourInputChange = (target: 'start' | 'end', val: string) => {
    const clean = val.replace(/\D/g, '').slice(0, 2)
    if (target === 'start') {
      setInputStartH(clean)
      if (clean.length > 0) {
        const num = parseInt(clean, 10)
        if (!isNaN(num) && num >= 0 && num <= 23) {
          setStartH(num)
          setStartPeriod(num >= 12 ? 'afternoon' : 'morning')
          commit(num, startM, endH, endM)
        }
      }
    } else {
      setInputEndH(clean)
      if (clean.length > 0) {
        const num = parseInt(clean, 10)
        if (!isNaN(num) && num >= 0 && num <= 23) {
          setEndH(num)
          setEndPeriod(num >= 12 ? 'afternoon' : 'morning')
          commit(startH, startM, num, endM)
        }
      }
    }
  }

  // Xử lý khi gõ phím trực tiếp vào ô PHÚT
  const handleMinuteInputChange = (target: 'start' | 'end', val: string) => {
    const clean = val.replace(/\D/g, '').slice(0, 2)
    if (target === 'start') {
      setInputStartM(clean)
      if (clean.length > 0) {
        const num = parseInt(clean, 10)
        if (!isNaN(num) && num >= 0 && num <= 59) {
          setStartM(num)
          commit(startH, num, endH, endM)
        }
      }
    } else {
      setInputEndM(clean)
      if (clean.length > 0) {
        const num = parseInt(clean, 10)
        if (!isNaN(num) && num >= 0 && num <= 59) {
          setEndM(num)
          commit(startH, startM, endH, num)
        }
      }
    }
  }

  // Xử lý khi click vào 1 số trên VÒNG GIỜ
  const handleSelectHour = (selectedH: number) => {
    if (activeTarget === 'start') {
      setStartH(selectedH)
      setInputStartH(selectedH.toString().padStart(2, '0'))
      commit(selectedH, startM, endH, endM)
    } else {
      setEndH(selectedH)
      setInputEndH(selectedH.toString().padStart(2, '0'))
      commit(startH, startM, selectedH, endM)
    }
    // Tự động chuyển sang chọn PHÚT
    setActiveUnit('minute')
  }

  // Xử lý khi click vào 1 số trên VÒNG PHÚT
  const handleSelectMinute = (selectedM: number) => {
    if (activeTarget === 'start') {
      setStartM(selectedM)
      setInputStartM(selectedM.toString().padStart(2, '0'))
      commit(startH, selectedM, endH, endM)
      // Tự động chuyển sang chọn Giờ kết thúc
      setActiveTarget('end')
      setActiveUnit('hour')
    } else {
      setEndM(selectedM)
      setInputEndM(selectedM.toString().padStart(2, '0'))
      commit(startH, startM, endH, selectedM)
    }
  }

  // Đổi ca Sáng / Chiều cho target đang chọn
  const handleTogglePeriod = () => {
    if (activeTarget === 'start') {
      const nextP = startPeriod === 'morning' ? 'afternoon' : 'morning'
      setStartPeriod(nextP)
      let nextH = startH
      if (nextP === 'morning' && startH >= 12) nextH = startH - 12
      else if (nextP === 'afternoon' && startH < 12) nextH = startH + 12
      setStartH(nextH)
      setInputStartH(nextH.toString().padStart(2, '0'))
      commit(nextH, startM, endH, endM)
    } else {
      const nextP = endPeriod === 'morning' ? 'afternoon' : 'morning'
      setEndPeriod(nextP)
      let nextH = endH
      if (nextP === 'morning' && endH >= 12) nextH = endH - 12
      else if (nextP === 'afternoon' && endH < 12) nextH = endH + 12
      setEndH(nextH)
      setInputEndH(nextH.toString().padStart(2, '0'))
      commit(startH, startM, nextH, endM)
    }
  }

  // Tọa độ mặt đồng hồ đơn (1 vòng duy nhất)
  const CENTER = 100
  const RADIUS = 72

  // 12 vị trí giờ
  const hourNumbers = Array.from({ length: 12 }, (_, i) => {
    return currentPeriod === 'morning' ? i : i + 12
  })

  // 12 vị trí phút (00, 05, 10, ..., 55)
  const minuteNumbers = Array.from({ length: 12 }, (_, i) => i * 5)

  // Tính góc kim đồng hồ cho vòng đang hiển thị
  let handAngleRad = 0
  if (activeUnit === 'hour') {
    const hIdx = currentHour % 12
    handAngleRad = (hIdx * 30 - 90) * (Math.PI / 180)
  } else {
    handAngleRad = (currentMinute * 6 - 90) * (Math.PI / 180)
  }
  const handX = CENTER + RADIUS * Math.cos(handAngleRad)
  const handY = CENTER + RADIUS * Math.sin(handAngleRad)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        {/* Nút trigger HOÀN TOÀN PHẲNG - KHÔNG NỀN, KHÔNG VIỀN */}
        <button
          type="button"
          disabled={disabled}
          className={cn(
            'h-7 px-1.5 text-xs font-mono font-bold text-foreground hover:text-primary hover:bg-primary/10 rounded-md transition-colors cursor-pointer inline-flex items-center gap-1.5 select-none',
            className
          )}
          title="Bấm để chọn khung giờ bắt đầu - kết thúc"
        >
          <Clock className="h-3.5 w-3.5 text-primary shrink-0" />
          <span>{startTime}</span>
          <span className="text-muted-foreground font-semibold px-0.5">-</span>
          <span>{endTime}</span>
        </button>
      </PopoverTrigger>

      <PopoverContent
        align="start"
        sideOffset={6}
        className="z-[70] w-[280px] p-3 rounded-2xl bg-popover border border-border/80 shadow-2xl space-y-2.5"
      >
        {/* Header: Hai thẻ Giờ bắt đầu & Giờ kết thúc - BỎ VIỀN NGOÀI CÙNG, HỖ TRỢ NHẬP TAY TRỰC TIẾP */}
        <div className="grid grid-cols-2 gap-2">
          {/* Thẻ Giờ bắt đầu */}
          <div
            onClick={() => setActiveTarget('start')}
            className={cn(
              'p-1.5 rounded-xl transition-all cursor-pointer flex flex-col items-center gap-1 select-none',
              activeTarget === 'start'
                ? 'bg-primary/8 text-primary ring-1 ring-primary/30'
                : 'hover:bg-muted/30 text-muted-foreground'
            )}
          >
            <span
              className={cn(
                'text-[10px] uppercase font-bold tracking-wider',
                activeTarget === 'start' ? 'text-primary' : 'text-muted-foreground'
              )}
            >
              Giờ bắt đầu
            </span>

            <div className="flex items-center gap-0.5 text-sm font-bold font-mono">
              {/* Ô nhập Giờ bắt đầu */}
              <input
                type="text"
                inputMode="numeric"
                maxLength={2}
                value={inputStartH}
                onChange={(e) => handleHourInputChange('start', e.target.value)}
                onFocus={() => {
                  setActiveTarget('start')
                  setActiveUnit('hour')
                }}
                className={cn(
                  'w-7 h-7 text-center rounded-lg font-mono text-sm font-bold transition-all outline-none cursor-pointer',
                  activeTarget === 'start' && activeUnit === 'hour'
                    ? 'bg-primary text-primary-foreground font-bold shadow-xs'
                    : 'bg-background hover:bg-muted text-foreground border border-border/60'
                )}
                placeholder="17"
              />

              <span className="text-muted-foreground font-bold px-0.5">:</span>

              {/* Ô nhập Phút bắt đầu */}
              <input
                type="text"
                inputMode="numeric"
                maxLength={2}
                value={inputStartM}
                onChange={(e) => handleMinuteInputChange('start', e.target.value)}
                onFocus={() => {
                  setActiveTarget('start')
                  setActiveUnit('minute')
                }}
                className={cn(
                  'w-7 h-7 text-center rounded-lg font-mono text-sm font-bold transition-all outline-none cursor-pointer',
                  activeTarget === 'start' && activeUnit === 'minute'
                    ? 'bg-primary text-primary-foreground font-bold shadow-xs'
                    : 'bg-background hover:bg-muted text-foreground border border-border/60'
                )}
                placeholder="30"
              />
            </div>
          </div>

          {/* Thẻ Giờ kết thúc */}
          <div
            onClick={() => setActiveTarget('end')}
            className={cn(
              'p-1.5 rounded-xl transition-all cursor-pointer flex flex-col items-center gap-1 select-none',
              activeTarget === 'end'
                ? 'bg-primary/8 text-primary ring-1 ring-primary/30'
                : 'hover:bg-muted/30 text-muted-foreground'
            )}
          >
            <span
              className={cn(
                'text-[10px] uppercase font-bold tracking-wider',
                activeTarget === 'end' ? 'text-primary' : 'text-muted-foreground'
              )}
            >
              Giờ kết thúc
            </span>

            <div className="flex items-center gap-0.5 text-sm font-bold font-mono">
              {/* Ô nhập Giờ kết thúc */}
              <input
                type="text"
                inputMode="numeric"
                maxLength={2}
                value={inputEndH}
                onChange={(e) => handleHourInputChange('end', e.target.value)}
                onFocus={() => {
                  setActiveTarget('end')
                  setActiveUnit('hour')
                }}
                className={cn(
                  'w-7 h-7 text-center rounded-lg font-mono text-sm font-bold transition-all outline-none cursor-pointer',
                  activeTarget === 'end' && activeUnit === 'hour'
                    ? 'bg-primary text-primary-foreground font-bold shadow-xs'
                    : 'bg-background hover:bg-muted text-foreground border border-border/60'
                )}
                placeholder="19"
              />

              <span className="text-muted-foreground font-bold px-0.5">:</span>

              {/* Ô nhập Phút kết thúc */}
              <input
                type="text"
                inputMode="numeric"
                maxLength={2}
                value={inputEndM}
                onChange={(e) => handleMinuteInputChange('end', e.target.value)}
                onFocus={() => {
                  setActiveTarget('end')
                  setActiveUnit('minute')
                }}
                className={cn(
                  'w-7 h-7 text-center rounded-lg font-mono text-sm font-bold transition-all outline-none cursor-pointer',
                  activeTarget === 'end' && activeUnit === 'minute'
                    ? 'bg-primary text-primary-foreground font-bold shadow-xs'
                    : 'bg-background hover:bg-muted text-foreground border border-border/60'
                )}
                placeholder="00"
              />
            </div>
          </div>
        </div>

        {/* Thanh trạng thái mỏng: Hiển thị chế độ hiện tại + Nút đổi Sáng/Chiều */}
        <div className="flex items-center justify-between px-1 text-[11px] select-none">
          <span className="text-muted-foreground">
            Đang chọn:{' '}
            <strong className="text-primary font-bold">
              {activeTarget === 'start' ? 'Bắt đầu' : 'Kết thúc'} (
              {activeUnit === 'hour' ? 'Giờ' : 'Phút'})
            </strong>
          </span>

          {activeUnit === 'hour' && (
            <button
              type="button"
              onClick={handleTogglePeriod}
              className="h-5 px-1.5 text-[10px] font-bold rounded-md border border-border/50 hover:bg-muted/50 text-foreground transition-all cursor-pointer"
              title="Đổi ca Sáng (00-11h) hoặc Chiều-Tối (12-23h)"
            >
              {currentPeriod === 'morning' ? '☀️ Sáng' : '🌙 Chiều'}
            </button>
          )}
        </div>

        {/* MẶT ĐỒNG HỒ ĐƠN - HOÀN TOÀN PHẲNG, KHÔNG NỀN XÁM, KHÔNG VIỀN NGOÀI */}
        <div className="relative w-[200px] h-[200px] mx-auto select-none flex items-center justify-center">
          {/* Kim đồng hồ SVG */}
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none z-10"
            viewBox="0 0 200 200"
          >
            {/* Tâm đồng hồ */}
            <circle cx={CENTER} cy={CENTER} r="3.5" className="fill-primary" />
            {/* Đường kim */}
            <line
              x1={CENTER}
              y1={CENTER}
              x2={handX}
              y2={handY}
              className="stroke-primary stroke-[2.5]"
              strokeLinecap="round"
            />
            {/* Vòng bao số đang chọn */}
            <circle
              cx={handX}
              cy={handY}
              r="13"
              className="fill-primary stroke-primary stroke-[1]"
            />
          </svg>

          {/* Nếu đang hiển thị VÒNG GIỜ */}
          {activeUnit === 'hour' &&
            hourNumbers.map((hVal, idx) => {
              const angleRad = (idx * 30 - 90) * (Math.PI / 180)
              const x = CENTER + RADIUS * Math.cos(angleRad)
              const y = CENTER + RADIUS * Math.sin(angleRad)
              const isSelected = currentHour === hVal

              return (
                <button
                  key={`h-${hVal}`}
                  type="button"
                  onClick={() => handleSelectHour(hVal)}
                  style={{
                    position: 'absolute',
                    left: `${x}px`,
                    top: `${y}px`,
                    transform: 'translate(-50%, -50%)',
                  }}
                  className={cn(
                    'w-7 h-7 rounded-full text-xs font-mono font-bold flex items-center justify-center transition-transform z-20 cursor-pointer',
                    isSelected
                      ? 'text-primary-foreground scale-105'
                      : 'text-foreground/85 hover:bg-muted/70 hover:scale-110'
                  )}
                  title={`Chọn ${hVal} giờ`}
                >
                  {hVal.toString().padStart(2, '0')}
                </button>
              )
            })}

          {/* Nếu đang hiển thị VÒNG PHÚT */}
          {activeUnit === 'minute' &&
            minuteNumbers.map((mVal, idx) => {
              const angleRad = (idx * 30 - 90) * (Math.PI / 180)
              const x = CENTER + RADIUS * Math.cos(angleRad)
              const y = CENTER + RADIUS * Math.sin(angleRad)
              const isSelected = currentMinute === mVal
              const isMajor = mVal % 15 === 0

              return (
                <button
                  key={`m-${mVal}`}
                  type="button"
                  onClick={() => handleSelectMinute(mVal)}
                  style={{
                    position: 'absolute',
                    left: `${x}px`,
                    top: `${y}px`,
                    transform: 'translate(-50%, -50%)',
                  }}
                  className={cn(
                    'w-7 h-7 rounded-full text-xs font-mono font-bold flex items-center justify-center transition-transform z-20 cursor-pointer',
                    isSelected
                      ? 'text-primary-foreground scale-105'
                      : isMajor
                        ? 'text-foreground font-bold hover:bg-muted/70 hover:scale-110'
                        : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                  )}
                  title={`Chọn ${mVal} phút`}
                >
                  {mVal.toString().padStart(2, '0')}
                </button>
              )
            })}
        </div>

        {/* Nút Xong đóng popover */}
        <div className="pt-0.5">
          <Button
            type="button"
            size="sm"
            onClick={() => setOpen(false)}
            className="w-full h-7 text-xs bg-primary text-primary-foreground font-semibold rounded-lg gap-1 cursor-pointer"
          >
            <Check className="h-3.5 w-3.5" />
            <span>Xong</span>
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  )
}
