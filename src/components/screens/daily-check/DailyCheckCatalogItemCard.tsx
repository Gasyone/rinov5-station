'use client'
/* eslint-disable @next/next/no-img-element */

import React from 'react'
import { Trash2, Play, Video } from 'lucide-react'
import { cn } from '@/lib/utils'
import { getItemAvatarInfo } from './dailyCheckStandards'

export interface DailyCheckCatalogItemCardProps {
  name: string
  requirement: string
  group: string
  isSelected?: boolean
  isClosingShift?: boolean
  onSelect: () => void
  onDelete: () => void
}

export function DailyCheckCatalogItemCard({
  name,
  requirement,
  group,
  isSelected = false,
  isClosingShift = false,
  onSelect,
  onDelete,
}: DailyCheckCatalogItemCardProps) {
  const avatarInfo = getItemAvatarInfo(name, group)

  return (
    <div
      onClick={onSelect}
      className={cn(
        'group flex items-center justify-between gap-2.5 py-2 px-3 border-b border-border/40 last:border-b-0 transition-colors cursor-pointer text-xs text-left select-none',
        isSelected
          ? 'bg-primary/10 text-primary border-l-2 border-l-primary pl-2.5'
          : 'bg-transparent hover:bg-muted/40 text-foreground/90'
      )}
    >
      <div className="flex items-center gap-2.5 min-w-0 flex-1">
        {/* Avatar thumbnail gọn gàng dạng bảng */}
        <div
          className={cn(
            'relative shrink-0 w-7 h-7 sm:w-8 sm:h-8 rounded-md overflow-hidden border transition-all bg-muted',
            isSelected ? 'border-primary ring-1 ring-primary/30' : 'border-border/60'
          )}
        >
          <img
            src={avatarInfo.avatar}
            alt={name}
            className="w-full h-full object-cover"
          />
          {avatarInfo.hasVideo && (
            <span className="absolute inset-0 bg-black/35 flex items-center justify-center">
              <Play className="h-2.5 w-2.5 text-white fill-white" />
            </span>
          )}
        </div>

        {/* Thông tin tên & yêu cầu dạng dòng bảng phẳng */}
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <p
              className={cn(
                'truncate text-xs leading-snug font-normal',
                isSelected
                  ? 'text-primary font-medium'
                  : 'text-foreground/90 group-hover:text-primary transition-colors'
              )}
            >
              {name}
            </p>
            {avatarInfo.hasVideo && (
              <Video className="h-2.5 w-2.5 text-indigo-500 shrink-0 opacity-80" />
            )}
          </div>
          <p className="truncate text-[11px] text-muted-foreground leading-tight mt-0.5 font-normal">
            {requirement || 'Theo quy chuẩn vận hành 5 sao.'}
          </p>
        </div>
      </div>

      {/* Nút xóa hiển thị khi hover */}
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation()
          onDelete()
        }}
        className="opacity-0 group-hover:opacity-100 p-1 rounded text-muted-foreground hover:text-destructive hover:bg-muted cursor-pointer transition-all shrink-0"
        title={isClosingShift ? 'Xóa nhiệm vụ' : 'Xóa tiêu chí'}
      >
        <Trash2 className="h-3 w-3" />
      </button>
    </div>
  )
}
