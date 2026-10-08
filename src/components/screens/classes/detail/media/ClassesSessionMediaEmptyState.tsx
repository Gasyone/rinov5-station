'use client'

import React, { useState } from 'react'
import { UploadCloud, Upload, SearchX } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export interface ClassesSessionMediaEmptyStateProps {
  isFilterActive?: boolean
  filterLabel?: string
  totalSessionItemsCount?: number
  onClearFilter?: () => void
  onUploadClick: () => void
  onDropFiles?: (files: FileList) => void
  singleSessionMode?: boolean
}

export function ClassesSessionMediaEmptyState({
  isFilterActive = false,
  filterLabel = '',
  totalSessionItemsCount = 0,
  onClearFilter,
  onUploadClick,
  onDropFiles,
  singleSessionMode = true,
}: ClassesSessionMediaEmptyStateProps) {
  const [isDragging, setIsDragging] = useState(false)

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      onDropFiles?.(e.dataTransfer.files)
    }
  }

  // Case 1: Empty due to active student filter
  if (isFilterActive && totalSessionItemsCount > 0) {
    return (
      <div className="py-6 px-4 text-center rounded-xl border border-dashed border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/20">
        <div className="mx-auto w-9 h-9 rounded-xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-400 dark:text-zinc-500 mb-2 shadow-2xs">
          <SearchX className="h-4.5 w-4.5" />
        </div>
        <h4 className="text-xs font-bold text-foreground">Không tìm thấy media phù hợp</h4>
        <p className="text-xs text-muted-foreground mt-0.5 max-w-md mx-auto">
          Chưa có hình ảnh, video hoặc tài liệu nào được gắn cho học viên <strong className="text-foreground">{filterLabel}</strong> trong buổi học này.
        </p>
        {onClearFilter && (
          <div className="mt-2.5">
            <Button
              type="button"
              variant="outline"
              size="xs"
              onClick={onClearFilter}
              className="h-7 px-3 text-xs font-semibold rounded-lg border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 shadow-2xs hover:bg-zinc-50 dark:hover:bg-zinc-800 cursor-pointer"
            >
              Xem tất cả ({totalSessionItemsCount} tệp)
            </Button>
          </div>
        )}
      </div>
    )
  }

  // Case 2: Session has no media uploaded yet
  return (
    <div
      onDragOver={handleDragOver}
      onDragEnter={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={onUploadClick}
      className={cn(
        'group relative py-6 px-4 text-center rounded-xl border-2 border-dashed transition-all duration-200 cursor-pointer select-none',
        isDragging
          ? 'border-sky-500 bg-sky-50/50 dark:bg-sky-950/30 ring-4 ring-sky-500/10'
          : 'border-zinc-200 dark:border-zinc-800 bg-zinc-50/40 dark:bg-zinc-900/20 hover:border-sky-400/80 dark:hover:border-sky-600/80 hover:bg-zinc-50/80 dark:hover:bg-zinc-900/40'
      )}
    >
      <div
        className={cn(
          'mx-auto w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-200 mb-2 shadow-2xs',
          isDragging
            ? 'bg-sky-500 text-white scale-110 shadow-md'
            : 'bg-sky-50 dark:bg-sky-950/50 border border-sky-100 dark:border-sky-900/60 text-sky-600 dark:text-sky-400 group-hover:scale-105'
        )}
      >
        <UploadCloud className="h-5 w-5" />
      </div>

      <h4 className="text-xs font-bold text-foreground tracking-tight">
        {singleSessionMode
          ? 'Chưa có media tải lên trong buổi học này'
          : 'Chưa có media nào trong lớp học'}
      </h4>

      <p className="text-xs text-muted-foreground mt-0.5 max-w-md mx-auto leading-normal">
        {singleSessionMode
          ? 'Tải lên hình ảnh hoạt động, bài tập, video bài giảng hoặc tài liệu cho buổi học này để lưu trữ và chia sẻ cho phụ huynh & học viên.'
          : 'Tải lên hình ảnh hoạt động, bài giảng hoặc tài liệu theo từng buổi học.'}
      </p>

      <div className="flex flex-wrap items-center justify-center gap-2 mt-3">
        <Button
          type="button"
          onClick={(e) => {
            e.stopPropagation()
            onUploadClick()
          }}
          className="h-7 px-3 text-xs font-semibold bg-sky-600 hover:bg-sky-700 text-white rounded-lg shadow-xs cursor-pointer gap-1.5 transition-all hover:shadow-md"
        >
          <Upload className="h-3.5 w-3.5" />
          <span>Tải lên tệp ngay</span>
        </Button>
      </div>

      <div className="flex items-center justify-center gap-1.5 text-[10.5px] text-muted-foreground/80 mt-2">
        <span>Kéo & thả tệp vào đây hoặc nhấp để chọn tệp</span>
        <span>•</span>
        <span>JPG, PNG, MP4, PDF (Tối đa 100MB)</span>
      </div>
    </div>
  )
}
