'use client'

import React from 'react'
import {
  Film,
  Download,
  Play,
  FileText,
  X,
  Share2,
} from 'lucide-react'
import { Checkbox } from '@/components/ui/checkbox'
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover'
import { cn } from '@/lib/utils'
import type { RosterStudentOption, SessionMediaItem } from './classesSessionMediaTypes'
import { StudentSelectorPopoverContent } from './StudentSelectorPopoverContent'

export interface ClassesSessionMediaCardProps {
  item: SessionMediaItem
  isSelected: boolean
  className: string
  rosterStudents: RosterStudentOption[]
  activePopoverItemId: string | null
  setActivePopoverItemId: (id: string | null) => void
  toggleSelectItem: (id: string) => void
  handleShareLink: (item: SessionMediaItem) => void
  handleDownloadFile: (item: SessionMediaItem) => void
  handleRemoveStudentTag: (itemId: string, studentId: string, studentName: string) => void
  handleToggleStudentTagInPopover: (itemId: string, studentId: string | 'all' | 'class_wide') => void
}

export function ClassesSessionMediaCard({
  item,
  isSelected,
  className,
  rosterStudents,
  activePopoverItemId,
  setActivePopoverItemId,
  toggleSelectItem,
  handleShareLink,
  handleDownloadFile,
  handleRemoveStudentTag,
  handleToggleStudentTagInPopover,
}: ClassesSessionMediaCardProps) {
  const taggedNames = rosterStudents.filter((st) => item.taggedStudentIds.includes(st.id))

  return (
    <div
      className={cn(
        'group/card relative rounded-2xl border overflow-hidden transition-all bg-zinc-100 dark:bg-zinc-900 text-white shadow-2xs hover:shadow-xs',
        isSelected
          ? 'border-sky-500 ring-2 ring-sky-500/30'
          : 'border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700'
      )}
    >
      {/* Image/Video Media Box */}
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-zinc-100 dark:bg-zinc-900 flex items-center justify-center">
        {item.type === 'image' || item.thumbnailUrl ? (
          <img
            src={item.thumbnailUrl || item.url}
            alt={item.name}
            className="h-full w-full object-cover transition-transform duration-300 group-hover/card:scale-105"
          />
        ) : item.type === 'video' ? (
          <div className="relative h-full w-full bg-zinc-900 flex items-center justify-center">
            {item.thumbnailUrl ? (
              <img src={item.thumbnailUrl} alt={item.name} className="h-full w-full object-cover opacity-80" />
            ) : (
              <Film className="h-12 w-12 text-zinc-600" />
            )}
            <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
              <div className="h-10 w-10 rounded-full bg-black/60 backdrop-blur-xs flex items-center justify-center text-white border border-white/20">
                <Play className="h-5 w-5 fill-white ml-0.5" />
              </div>
            </div>
          </div>
        ) : (
          <div className="p-4 text-center">
            <FileText className="h-10 w-10 mx-auto text-sky-400 mb-1" />
            <span className="text-xs font-semibold text-zinc-300 block truncate">{item.name}</span>
          </div>
        )}

        {/* Top Overlay: Checkbox + File Name (Left) & Type Badge (Right) */}
        <div className="absolute inset-x-0 top-0 p-2.5 bg-gradient-to-b from-black/80 via-black/40 to-transparent flex items-center justify-between gap-2 z-30 pointer-events-none">
          {/* Left: Checkbox + File Name (Only shows on hover or when selected) */}
          <div
            className={cn(
              'flex items-center gap-2 min-w-0 pointer-events-auto transition-opacity duration-200',
              isSelected ? 'opacity-100' : 'opacity-0 group-hover/card:opacity-100'
            )}
            onClick={(e) => e.stopPropagation()}
          >
            <Checkbox
              checked={isSelected}
              onCheckedChange={() => toggleSelectItem(item.id)}
              className="h-5 w-5 rounded-md bg-white border-white text-zinc-900 shadow-md hover:bg-zinc-100 data-[state=checked]:bg-sky-500 data-[state=checked]:border-sky-500 data-[state=checked]:text-white cursor-pointer transition-transform hover:scale-110 shrink-0"
            />
            <span
              className="font-bold text-xs text-white truncate drop-shadow-sm pointer-events-auto"
              title={item.name}
            >
              {item.name}
            </span>
          </div>

          {/* Right: Type Badge */}
          <div className="shrink-0 pointer-events-auto">
            <span className="px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-xs text-[10px] font-bold text-zinc-200 border border-white/10 uppercase tracking-wider">
              {item.type === 'image' ? 'Ảnh' : item.type === 'video' ? 'Video' : 'Tệp'}
            </span>
          </div>
        </div>

        {/* Hover Overlay with Action Buttons */}
        <div className="absolute inset-0 bg-black/50 backdrop-blur-[2px] opacity-0 group-hover/card:opacity-100 transition-opacity duration-200 flex flex-col items-center justify-center gap-2 p-2 z-20">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                handleShareLink(item)
              }}
              className="h-9 w-9 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center transition-transform hover:scale-110 cursor-pointer"
              title="Chia sẻ (Copy link)"
            >
              <Share2 className="h-4.5 w-4.5" />
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                handleDownloadFile(item)
              }}
              className="h-9 w-9 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center transition-transform hover:scale-110 cursor-pointer"
              title="Tải về"
            >
              <Download className="h-4.5 w-4.5" />
            </button>
          </div>

          {/* INDIVIDUAL CARD TAGGING POPOVER */}
          <Popover
            open={activePopoverItemId === item.id}
            onOpenChange={(open) => {
              if (open) {
                setActivePopoverItemId(item.id)
              } else {
                setActivePopoverItemId(null)
              }
            }}
          >
            <PopoverTrigger asChild>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  setActivePopoverItemId(item.id)
                }}
                className="px-4 py-1.5 rounded-full bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold shadow-md cursor-pointer transition-transform hover:scale-105 flex items-center gap-1"
              >
                <span>Thêm</span>
              </button>
            </PopoverTrigger>

            <PopoverContent
              align="center"
              side="bottom"
              sideOffset={5}
              className="p-0 border-0 bg-transparent shadow-none z-[9999]"
              onClick={(e) => e.stopPropagation()}
            >
              <StudentSelectorPopoverContent
                title="Gắn học viên"
                subtitle={`Danh sách thuộc lớp ${className}`}
                rosterStudents={rosterStudents}
                selectedStudentIds={item.taggedStudentIds}
                showClassWideOption={true}
                onSelectOption={(id) => handleToggleStudentTagInPopover(item.id, id)}
              />
            </PopoverContent>
          </Popover>
        </div>

        {/* Bottom Overlay: Tagged Avatars Only */}
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-2.5 pt-6 flex flex-col gap-1 z-10 pointer-events-none">
          {/* Tagged Student Avatar Circles */}
          {item.taggedStudentIds.length === 0 ? (
            <div className="flex items-center gap-1 text-[10px] text-zinc-300 font-medium">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>Dành cho cả lớp</span>
            </div>
          ) : (
            <div className="flex items-center gap-1 flex-wrap pointer-events-auto">
              {taggedNames.map((st) => {
                const bg = st.colorBg || 'bg-amber-100 dark:bg-amber-950/60'
                const text = st.colorText || 'text-amber-800 dark:text-amber-300'
                return (
                  <div
                    key={st.id}
                    onClick={(e) => {
                      e.stopPropagation()
                      handleRemoveStudentTag(item.id, st.id, st.name)
                    }}
                    className={`group/avatar relative flex items-center justify-center h-6 w-6 rounded-full ${bg} ${text} text-[10px] font-bold border shadow-xs transition-transform hover:scale-110 cursor-pointer`}
                    title={`${st.name} (Nhấp để xóa học viên)`}
                  >
                    <span>{st.initials || st.name.slice(0, 1).toUpperCase()}</span>
                    <span className="absolute inset-0 rounded-full bg-rose-600 text-white opacity-0 group-hover/avatar:opacity-100 flex items-center justify-center transition-opacity">
                      <X className="h-3 w-3 stroke-[3]" />
                    </span>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
