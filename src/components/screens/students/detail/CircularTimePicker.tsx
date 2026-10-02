'use client'

import React, { useState, useRef } from 'react'
import { Clock, Check } from 'lucide-react'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface CircularTimePickerProps {
  value: string
  onChange: (value: string) => void
  className?: string
  disabled?: boolean
}

function parseTimeString(val: string): { h: number; m: number } {
  const match = val?.match(/^(\d{1,2}):(\d{2})$/)
  if (match) {
    return {
      h: Math.min(23, Math.max(0, parseInt(match[1], 10))),
      m: Math.min(59, Math.max(0, parseInt(match[2], 10))),
    }
  }
  return { h: 17, m: 30 }
}

export function CircularTimePicker({
  value,
  onChange,
  className,
  disabled = false,
}: CircularTimePickerProps) {
  const parsed = parseTimeString(value)
  const [prevValue, setPrevValue] = useState(value)
  const [open, setOpen] = useState(false)
  const [period, setPeriod] = useState<'morning' | 'afternoon'>(
    parsed.h >= 12 ? 'afternoon' : 'morning'
  )

  // Internal hour (0-23) and minute (0-59)
  const [hour, setHour] = useState(parsed.h)
  const [minute, setMinute] = useState(parsed.m)

  // Direct text input states
  const [inputHour, setInputHour] = useState(parsed.h.toString().padStart(2, '0'))
  const [inputMinute, setInputMinute] = useState(parsed.m.toString().padStart(2, '0'))

  if (value !== prevValue) {
    setPrevValue(value)
    setHour(parsed.h)
    setMinute(parsed.m)
    setInputHour(parsed.h.toString().padStart(2, '0'))
    setInputMinute(parsed.m.toString().padStart(2, '0'))
    setPeriod(parsed.h >= 12 ? 'afternoon' : 'morning')
  }

  const hourInputRef = useRef<HTMLInputElement>(null)
  const minuteInputRef = useRef<HTMLInputElement>(null)

  // Commit time change to parent
  const commitTime = (newH: number, newM: number) => {
    const formatted = `${newH.toString().padStart(2, '0')}:${newM.toString().padStart(2, '0')}`
    onChange(formatted)
  }

  // Handle Hour Selection on Outer Ring
  const handleSelectHour = (selectedHour: number) => {
    setHour(selectedHour)
    setInputHour(selectedHour.toString().padStart(2, '0'))
    commitTime(selectedHour, minute)
  }

  // Handle Minute Selection on Inner Ring
  const handleSelectMinute = (selectedMinute: number) => {
    setMinute(selectedMinute)
    setInputMinute(selectedMinute.toString().padStart(2, '0'))
    commitTime(hour, selectedMinute)
  }

  // Toggle Sáng (00-11) vs Chiều/Tối (12-23) tinh gọn
  const handleTogglePeriod = () => {
    const newPeriod = period === 'morning' ? 'afternoon' : 'morning'
    setPeriod(newPeriod)
    let newH = hour
    if (newPeriod === 'morning' && hour >= 12) {
      newH = hour - 12
    } else if (newPeriod === 'afternoon' && hour < 12) {
      newH = hour + 12
    }
    setHour(newH)
    setInputHour(newH.toString().padStart(2, '0'))
    commitTime(newH, minute)
  }

  // Handle Direct Text Typing for Hour
  const handleHourInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, '').slice(0, 2)
    setInputHour(raw)
    if (raw.length > 0) {
      const parsedH = parseInt(raw, 10)
      if (!isNaN(parsedH) && parsedH >= 0 && parsedH <= 23) {
        setHour(parsedH)
        setPeriod(parsedH >= 12 ? 'afternoon' : 'morning')
        commitTime(parsedH, minute)
      }
    }
  }

  // Handle Direct Text Typing for Minute
  const handleMinuteInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, '').slice(0, 2)
    setInputMinute(raw)
    if (raw.length > 0) {
      const parsedM = parseInt(raw, 10)
      if (!isNaN(parsedM) && parsedM >= 0 && parsedM <= 59) {
        setMinute(parsedM)
        commitTime(hour, parsedM)
      }
    }
  }

  // Center coordinates & Radii for 2 Concentric Rings
  const CENTER = 105
  const RADIUS_HOUR = 78 // Vòng ngoài: GIỜ
  const RADIUS_MINUTE = 44 // Vòng trong: PHÚT

  // 12 positions for Hour on outer ring
  const hourNumbers = Array.from({ length: 12 }, (_, i) => {
    return period === 'morning' ? i : i + 12
  })

  // 12 positions for Minute on inner ring (00, 05, 10, ..., 55)
  const minuteNumbers = Array.from({ length: 12 }, (_, i) => i * 5)

  // Kim Giờ (Outer Ring)
  const hourIdx = hour % 12
  const hourAngleRad = (hourIdx * 30 - 90) * (Math.PI / 180)
  const handHourX = CENTER + RADIUS_HOUR * Math.cos(hourAngleRad)
  const handHourY = CENTER + RADIUS_HOUR * Math.sin(hourAngleRad)

  // Kim Phút (Inner Ring)
  const minAngleRad = (minute * 6 - 90) * (Math.PI / 180)
  const handMinX = CENTER + RADIUS_MINUTE * Math.cos(minAngleRad)
  const handMinY = CENTER + RADIUS_MINUTE * Math.sin(minAngleRad)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          disabled={disabled}
          className={cn(
            'h-7 px-2 text-xs font-mono font-bold rounded-lg border border-border/70 hover:border-primary/60 hover:bg-primary/5 text-foreground flex items-center gap-1.5 transition-colors focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer shadow-3xs',
            className
          )}
          title="Bấm để chọn hoặc nhập giờ"
        >
          <Clock className="h-3.5 w-3.5 text-primary/80 shrink-0" />
          <span>{value || '17:30'}</span>
        </button>
      </PopoverTrigger>

      <PopoverContent
        align="start"
        sideOffset={6}
        className="z-[70] w-[268px] p-3 rounded-2xl bg-popover border border-border/80 shadow-2xl space-y-2.5"
      >
        {/* Hàng trên cùng: Nhập phím trực tiếp + Nút đổi ca Sáng/Chiều siêu gọn */}
        <div className="flex items-center justify-between gap-1.5 bg-muted/25 p-1 rounded-xl border border-border/50">
          <div className="flex items-center gap-1">
            {/* Box Giờ */}
            <div
              onClick={() => hourInputRef.current?.focus()}
              className="flex items-center rounded-lg border border-primary/30 bg-background px-1.5 py-0.5 cursor-pointer shadow-3xs"
            >
              <input
                ref={hourInputRef}
                type="text"
                inputMode="numeric"
                maxLength={2}
                value={inputHour}
                onChange={handleHourInputChange}
                className="w-7 text-center font-mono text-sm font-bold bg-transparent outline-none text-foreground"
              />
              <span className="text-[10px] text-muted-foreground font-semibold">
                h
              </span>
            </div>

            <span className="text-sm font-bold text-muted-foreground">:</span>

            {/* Box Phút */}
            <div
              onClick={() => minuteInputRef.current?.focus()}
              className="flex items-center rounded-lg border border-primary/30 bg-background px-1.5 py-0.5 cursor-pointer shadow-3xs"
            >
              <input
                ref={minuteInputRef}
                type="text"
                inputMode="numeric"
                maxLength={2}
                value={inputMinute}
                onChange={handleMinuteInputChange}
                className="w-7 text-center font-mono text-sm font-bold bg-transparent outline-none text-foreground"
              />
              <span className="text-[10px] text-muted-foreground font-semibold">
                p
              </span>
            </div>
          </div>

          {/* Toggle Sáng / Chiều tinh gọn trên cùng 1 hàng */}
          <button
            type="button"
            onClick={handleTogglePeriod}
            className="h-6 px-2 text-[10.5px] font-bold rounded-lg border border-border/60 bg-background hover:bg-muted text-foreground transition-all cursor-pointer shrink-0"
            title="Bấm để đổi ca Sáng / Chiều-Tối"
          >
            {period === 'morning' ? '☀️ Sáng' : '🌙 Chiều-Tối'}
          </button>
        </div>

        {/* Chú thích tối giản 2 vòng */}
        <div className="flex items-center justify-between text-[10px] text-muted-foreground px-1 font-medium select-none">
          <span className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-primary inline-block" />
            Vòng ngoài: <strong>Giờ</strong>
          </span>
          <span className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-primary/60 inline-block" />
            Vòng trong: <strong>Phút</strong>
          </span>
        </div>

        {/* Mặt đồng hồ 2 VÒNG ĐỒNG TÂM (Concentric Rings: Outer Hour, Inner Minute) */}
        <div className="relative w-[210px] h-[210px] mx-auto rounded-full bg-muted/20 border border-border/50 shadow-inner select-none flex items-center justify-center">
          {/* Kim đồng hồ SVG */}
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none z-10"
            viewBox="0 0 210 210"
          >
            {/* Tâm đồng hồ */}
            <circle cx={CENTER} cy={CENTER} r="3.5" className="fill-primary" />

            {/* Vòng phân cách mờ giữa 2 vòng */}
            <circle
              cx={CENTER}
              cy={CENTER}
              r="61"
              className="stroke-border/40 stroke-[1] fill-none stroke-dasharray-[2,3]"
            />

            {/* Kim Giờ (Trỏ ra vòng ngoài) */}
            <line
              x1={CENTER}
              y1={CENTER}
              x2={handHourX}
              y2={handHourY}
              className="stroke-primary stroke-[2.5]"
              strokeLinecap="round"
            />
            {/* Vòng tròn bao số giờ đang chọn */}
            <circle
              cx={handHourX}
              cy={handHourY}
              r="13"
              className="fill-primary stroke-primary stroke-[1]"
            />

            {/* Kim Phút (Trỏ vào vòng trong) */}
            <line
              x1={CENTER}
              y1={CENTER}
              x2={handMinX}
              y2={handMinY}
              className="stroke-primary/70 stroke-[2]"
              strokeLinecap="round"
            />
            {/* Vòng tròn bao số phút đang chọn */}
            <circle
              cx={handMinX}
              cy={handMinY}
              r="11"
              className="fill-primary/80 stroke-primary stroke-[1]"
            />
          </svg>

          {/* 1. VÒNG NGOÀI: 12 SỐ GIỜ */}
          {hourNumbers.map((hVal, idx) => {
            const angleRad = (idx * 30 - 90) * (Math.PI / 180)
            const x = CENTER + RADIUS_HOUR * Math.cos(angleRad)
            const y = CENTER + RADIUS_HOUR * Math.sin(angleRad)
            const isSelected = hour === hVal

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
                  'w-6 h-6 rounded-full text-[11px] font-mono font-bold flex items-center justify-center transition-transform z-20 cursor-pointer',
                  isSelected
                    ? 'text-primary-foreground scale-105'
                    : 'text-foreground/80 hover:bg-muted/70 hover:scale-110'
                )}
                title={`Chọn ${hVal} giờ`}
              >
                {hVal.toString().padStart(2, '0')}
              </button>
            )
          })}

          {/* 2. VÒNG TRONG: 12 MỐC PHÚT (00, 05, 10, ..., 55) */}
          {minuteNumbers.map((mVal, idx) => {
            const angleRad = (idx * 30 - 90) * (Math.PI / 180)
            const x = CENTER + RADIUS_MINUTE * Math.cos(angleRad)
            const y = CENTER + RADIUS_MINUTE * Math.sin(angleRad)
            const isSelected = minute === mVal
            const isMajor = mVal % 15 === 0 // 00, 15, 30, 45 là các mốc chính

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
                  'rounded-full flex items-center justify-center transition-transform z-20 cursor-pointer font-mono font-bold',
                  isMajor ? 'w-5 h-5 text-[10px]' : 'w-4 h-4 text-[8px]',
                  isSelected
                    ? 'text-primary-foreground scale-110'
                    : isMajor
                      ? 'text-foreground/70 hover:bg-muted/60'
                      : 'text-muted-foreground/60 hover:text-foreground hover:bg-muted/40'
                )}
                title={`Chọn ${mVal} phút`}
              >
                {isMajor ? mVal.toString().padStart(2, '0') : mVal}
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
