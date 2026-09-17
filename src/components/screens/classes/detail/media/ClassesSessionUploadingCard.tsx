'use client'

import React from 'react'
import {
  Film,
  FileText,
  Image as ImageIcon,
  X,
  Loader2,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { UploadingMediaItem } from './classesSessionMediaTypes'

interface ClassesSessionUploadingCardProps {
  item: UploadingMediaItem
  onCancel: (id: string) => void
}

export function ClassesSessionUploadingCard({
  item,
  onCancel,
}: ClassesSessionUploadingCardProps) {
  const isVid = item.type === 'video'
  const isImg = item.type === 'image'

  const loadedMb = (item.loadedBytes / (1024 * 1024)).toFixed(1)

  return (
    <div className="relative aspect-16/10 rounded-2xl border-2 border-dashed border-sky-300 dark:border-sky-700 bg-sky-50/50 dark:bg-sky-950/30 overflow-hidden shadow-xs flex flex-col justify-between p-3.5 select-none transition-all">
      {/* Top Header: Badge + Cancel Button */}
      <div className="flex items-center justify-between gap-2 z-10">
        <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-md bg-white/90 dark:bg-zinc-900/90 text-sky-700 dark:text-sky-300 border border-sky-200 dark:border-sky-800 shadow-2xs">
          {isVid ? 'VIDEO' : isImg ? 'ẢNH' : 'TỆP'}
        </span>

        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={() => onCancel(item.id)}
          title="Hủy tải lên"
          className="h-6 w-6 rounded-full bg-white/80 dark:bg-zinc-900/80 hover:bg-rose-50 dark:hover:bg-rose-950/60 text-zinc-500 hover:text-rose-600 border border-zinc-200/60 dark:border-zinc-800 cursor-pointer shadow-2xs transition-colors"
        >
          <X className="h-3.5 w-3.5" />
        </Button>
      </div>

      {/* Center: Animated Icon + Name + Size */}
      <div className="flex flex-col items-center justify-center text-center px-2 z-10 -mt-1">
        <div className="relative mb-2">
          <div className="h-10 w-10 rounded-xl bg-white dark:bg-zinc-900 border border-sky-200 dark:border-sky-800 flex items-center justify-center shadow-xs">
            {isVid ? (
              <Film className="h-5 w-5 text-sky-600 dark:text-sky-400" />
            ) : isImg ? (
              <ImageIcon className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
            ) : (
              <FileText className="h-5 w-5 text-amber-600 dark:text-amber-400" />
            )}
          </div>
          <div className="absolute -top-1 -right-1">
            <Loader2 className="h-4 w-4 animate-spin text-sky-600 dark:text-sky-400" />
          </div>
        </div>

        <p className="text-xs font-bold text-foreground truncate max-w-full" title={item.name}>
          {item.name}
        </p>
        <p className="text-[11px] font-medium text-muted-foreground mt-0.5">
          {loadedMb} MB / {item.size}
        </p>
      </div>

      {/* Bottom: Progress Bar & Status Text */}
      <div className="space-y-1.5 z-10">
        <div className="w-full h-1.5 bg-zinc-200/80 dark:bg-zinc-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-sky-600 dark:bg-sky-500 rounded-full transition-all duration-300 ease-out"
            style={{ width: `${Math.min(100, Math.max(0, item.progress))}%` }}
          />
        </div>

        <div className="flex items-center justify-between text-[10px] font-semibold text-sky-700 dark:text-sky-400">
          <span>Đang tải lên...</span>
          <span>{Math.round(item.progress)}%</span>
        </div>
      </div>
    </div>
  )
}
