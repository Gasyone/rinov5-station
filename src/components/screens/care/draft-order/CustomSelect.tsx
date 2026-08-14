'use client'

import React, { useState, useRef, useEffect } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'

export interface CustomSelectOption {
  value: string
  label: string
  subtext1?: string
  subtext2?: string
}

interface CustomSelectProps {
  value: string
  onChange: (val: string) => void
  options: CustomSelectOption[]
  placeholder?: string
  className?: string
  is3Line?: boolean
  disabled?: boolean
}

export function CustomSelect({
  value,
  onChange,
  options,
  placeholder = 'Chọn...',
  className = '',
  is3Line = false,
  disabled = false,
}: CustomSelectProps) {
  const [isOpen, setIsOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  const selectedOption = options.find((opt) => opt.value === value)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div ref={containerRef} className={`relative w-full ${isOpen ? 'z-40' : 'z-1'} ${className}`}>
      {/* Trigger Button */}
      <button
        type="button"
        disabled={disabled}
        onClick={() => !disabled && setIsOpen(!isOpen)}
        className={`w-full h-9 px-2.5 py-1 flex items-center justify-between text-xs transition-all border-b ${
          disabled
            ? 'border-zinc-200/40 dark:border-zinc-800/40 bg-transparent text-zinc-400 dark:text-zinc-500 cursor-not-allowed opacity-70'
            : isOpen
            ? 'border-indigo-400/80 dark:border-indigo-500/80 text-zinc-900 dark:text-zinc-100 bg-indigo-50/40 dark:bg-indigo-950/30 cursor-pointer'
            : 'border-zinc-200/60 dark:border-zinc-800/60 hover:border-zinc-300 dark:hover:border-zinc-700 hover:bg-zinc-50/80 dark:hover:bg-zinc-800/40 text-zinc-800 dark:text-zinc-200 bg-transparent cursor-pointer'
        } focus:outline-none`}
      >
        <span className={`truncate pr-2 font-normal text-xs ${disabled || !selectedOption ? 'text-zinc-400 dark:text-zinc-500' : 'text-zinc-800 dark:text-zinc-200'}`}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <span className={`${disabled ? 'text-zinc-300 dark:text-zinc-600' : 'text-zinc-400 dark:text-zinc-500'} shrink-0`}>
          {isOpen ? (
            <ChevronUp className="h-3.5 w-3.5" />
          ) : (
            <ChevronDown className="h-3.5 w-3.5" />
          )}
        </span>
      </button>

      {/* Popover Dropdown Panel (Increased max height & high z-index to prevent clipping) */}
      {isOpen && (
        <div className="absolute left-0 top-full mt-1 w-full min-w-[280px] max-h-[380px] overflow-y-auto bg-white dark:bg-zinc-900 border border-border rounded-lg shadow-2xl z-[100] py-1 divide-y divide-border/20">
          {options.map((opt) => {
            const isSelected = opt.value === value

            if (is3Line) {
              // 3-Line Layout: Normal case, font-normal title, soft gray subtext
              return (
                <div
                  key={opt.value}
                  onClick={() => {
                    onChange(opt.value)
                    setIsOpen(false)
                  }}
                  className={`group p-2.5 px-3 cursor-pointer transition-colors ${
                    isSelected
                      ? 'bg-indigo-50/80 dark:bg-indigo-950/60'
                      : 'hover:bg-indigo-50/50 dark:hover:bg-indigo-950/30'
                  }`}
                >
                  {/* Line 1: Normal font-semibold text */}
                  <p
                    className={`font-semibold text-xs sm:text-sm leading-snug ${
                      isSelected
                        ? 'text-indigo-700 dark:text-indigo-300'
                        : 'text-zinc-800 dark:text-zinc-200 group-hover:text-indigo-600'
                    }`}
                  >
                    {opt.label}
                  </p>

                  {/* Line 2: Subtext 1 (Soft gray italic) */}
                  {opt.subtext1 && (
                    <p className="text-[11px] italic pt-0.5 text-zinc-500 dark:text-zinc-400">
                      • {opt.subtext1}
                    </p>
                  )}

                  {/* Line 3: Subtext 2 (Soft gray italic) */}
                  {opt.subtext2 && (
                    <p className="text-[11px] italic text-zinc-500 dark:text-zinc-400">
                      • {opt.subtext2}
                    </p>
                  )}
                </div>
              )
            }

            // Standard 1-Line Dropdown Layout: Normal font weight, normal case
            return (
              <div
                key={opt.value}
                onClick={() => {
                  onChange(opt.value)
                  setIsOpen(false)
                }}
                className={`px-3.5 py-2.5 text-xs sm:text-sm font-normal cursor-pointer transition-colors ${
                  isSelected
                    ? 'bg-indigo-50/80 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 font-semibold'
                    : 'text-zinc-700 dark:text-zinc-200 hover:bg-indigo-50/50 dark:hover:bg-indigo-950/30 hover:text-indigo-600'
                }`}
              >
                {opt.label}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
