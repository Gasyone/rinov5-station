'use client'

import { useRef, useState } from 'react'
import { Search } from 'lucide-react'
import { cn } from '@/lib/utils'

interface HoverExpandableSearchProps {
  value: string
  onValueChange: (val: string) => void
  placeholder?: string
  className?: string
}

export function HoverExpandableSearch({
  value,
  onValueChange,
  placeholder = 'Tìm kiếm...',
  className,
}: HoverExpandableSearchProps) {
  const [isFocused, setIsFocused] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const showInput = isFocused || isHovered || !!value

  return (
    <div
      className={cn(
        "relative flex items-center h-9 border rounded-lg transition-all duration-300 bg-background",
        showInput ? "w-64 px-2.5" : "w-9 justify-center cursor-pointer hover:bg-muted/30",
        isFocused ? "ring-2 ring-ring border-transparent" : "",
        className
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => {
        if (!showInput) {
          inputRef.current?.focus()
        }
      }}
    >
      <Search className="h-4 w-4 text-muted-foreground shrink-0" />
      <input
        ref={inputRef}
        value={value}
        onChange={(e) => onValueChange(e.target.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        placeholder={placeholder}
        className={cn(
          "h-full text-xs bg-transparent outline-none border-none transition-all duration-300 w-0 opacity-0 font-medium text-foreground",
          showInput ? "w-full ml-2 opacity-100" : ""
        )}
      />
    </div>
  )
}
