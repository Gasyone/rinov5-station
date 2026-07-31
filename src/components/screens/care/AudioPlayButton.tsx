'use client'

import { useState, useEffect } from 'react'
import { Play, Pause } from 'lucide-react'
import { cn } from '@/lib/utils'

interface AudioPlayButtonProps {
  duration?: string
  className?: string
}

export function AudioPlayButton({ duration = '0:00', className }: AudioPlayButtonProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    if (!isPlaying) return

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          setIsPlaying(false)
          return 0
        }
        return prev + 4
      })
    }, 250)

    return () => clearInterval(interval)
  }, [isPlaying])

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (isPlaying) {
      setIsPlaying(false)
      setProgress(0)
    } else {
      setIsPlaying(true)
    }
  }

  return (
    <div className={cn("flex items-center gap-1.5 shrink-0", className)} onClick={(e) => e.stopPropagation()}>
      <button
        type="button"
        onClick={handleToggle}
        className="flex items-center gap-1 p-0.5 px-1.5 hover:bg-emerald-100/80 dark:hover:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400 rounded cursor-pointer transition-colors text-[10px] font-bold h-5 shrink-0"
        title={isPlaying ? "Tạm dừng" : "Phát ghi âm"}
      >
        {isPlaying ? (
          <Pause className="h-3 w-3 text-emerald-600 fill-emerald-600 shrink-0" />
        ) : (
          <Play className="h-3 w-3 text-emerald-600 fill-emerald-600 shrink-0" />
        )}
        {duration && duration !== '0:00' && (
          <span className="font-mono text-[10.5px] font-bold text-emerald-700 dark:text-emerald-400">
            {duration}
          </span>
        )}
      </button>

      {isPlaying && (
        <div className="w-16 h-1 bg-emerald-200 dark:bg-emerald-900 rounded-full overflow-hidden shrink-0">
          <div
            className="h-full bg-emerald-600 transition-all duration-300 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}
    </div>
  )
}
