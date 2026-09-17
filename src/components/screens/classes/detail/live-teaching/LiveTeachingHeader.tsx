'use client'

import React, { useEffect, useState } from 'react'
import {
  ChevronLeft,
  Clock,
  Maximize2,
  Minimize2,
  FileText,
  Video,
  Music,
  ChevronDown,
  Sparkles,
  BookOpen,
  PanelRightClose,
  PanelRightOpen,
  X,
  Check,
  FolderOpen,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { cn } from '@/lib/utils'
import type { TeachingMaterial } from './liveTeachingTypes'

interface LiveTeachingHeaderProps {
  classNameTitle: string
  sessionTopic: string
  sessionNumber: number
  materials: TeachingMaterial[]
  activeMaterial: TeachingMaterial
  onSelectMaterial: (material: TeachingMaterial) => void
  onOpenLessonGuide: () => void
  isRosterOpen: boolean
  onToggleRoster: () => void
  isFullScreen: boolean
  onToggleFullScreen: () => void
  onEndSession: () => void
  onClose: () => void
}

export function LiveTeachingHeader({
  classNameTitle,
  sessionTopic,
  sessionNumber,
  materials,
  activeMaterial,
  onSelectMaterial,
  onOpenLessonGuide,
  isRosterOpen,
  onToggleRoster,
  isFullScreen,
  onToggleFullScreen,
  onEndSession,
  onClose,
}: LiveTeachingHeaderProps) {
  // Live session timer in seconds
  const [elapsedSeconds, setElapsedSeconds] = useState(2745) // ~45 mins in for demo

  useEffect(() => {
    const timer = setInterval(() => {
      setElapsedSeconds((prev) => prev + 1)
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  // Dropdown state for materials
  const [isMaterialOpen, setIsMaterialOpen] = useState(false)

  const formatTimer = (totalSeconds: number) => {
    const hours = Math.floor(totalSeconds / 3600)
    const minutes = Math.floor((totalSeconds % 3600) / 60)
    const seconds = totalSeconds % 60
    const pad = (n: number) => n.toString().padStart(2, '0')
    if (hours > 0) {
      return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`
    }
    return `${pad(minutes)}:${pad(seconds)}`
  }

  const getMaterialIcon = (type: TeachingMaterial['type']) => {
    switch (type) {
      case 'pdf':
        return <FileText className="h-3.5 w-3.5 text-rose-500 shrink-0" />
      case 'video':
        return <Video className="h-3.5 w-3.5 text-sky-500 shrink-0" />
      case 'audio':
        return <Music className="h-3.5 w-3.5 text-purple-500 shrink-0" />
      default:
        return <FileText className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
    }
  }

  return (
    <header className="h-12 border-b bg-white dark:bg-zinc-900 px-3 flex items-center justify-between gap-3 shrink-0 select-none z-20">
      {/* ── Left: Breadcrumb + Session info ── */}
      <div className="flex items-center gap-2 min-w-0">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="h-8 w-8 rounded-lg text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800 shrink-0 cursor-pointer"
          title="Thoát chế độ giảng dạy"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>

        <div className="flex items-center gap-2 min-w-0">
          <Badge className="bg-emerald-600 hover:bg-emerald-600 text-white font-bold text-xs px-2 py-0.5 rounded-md gap-1 shrink-0">
            <span className="h-1.5 w-1.5 rounded-full bg-white animate-pulse" />
            Đang dạy
          </Badge>
          <div className="flex items-baseline gap-1.5 truncate text-xs">
            <span className="font-bold text-foreground truncate">{classNameTitle}</span>
            <span className="text-muted-foreground font-normal">/</span>
            <span className="text-muted-foreground font-medium truncate">
              Buổi {sessionNumber}: {sessionTopic}
            </span>
          </div>
        </div>
      </div>

      {/* ── Center: Lesson Guide & Robust Dynamic Material Selector ── */}
      <div className="hidden md:flex items-center gap-2">
        {/* Button: Xem giáo án & Mục tiêu bài học */}
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={onOpenLessonGuide}
          className="h-8 gap-1.5 text-xs font-semibold rounded-lg bg-zinc-50 dark:bg-zinc-800/80 border-zinc-200 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-700 text-foreground cursor-pointer shadow-2xs"
          title="Mở bảng giáo án, mục tiêu kiến thức và tiến trình tiết dạy"
        >
          <BookOpen className="h-3.5 w-3.5 text-amber-500" />
          <span>Giáo án & Mục tiêu</span>
        </Button>

        {/* Robust Inline Material Dropdown (Guaranteed to click & display without portal z-index bug) */}
        <div className="relative">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setIsMaterialOpen((prev) => !prev)}
            className="h-8 gap-2 text-xs font-semibold rounded-lg bg-zinc-50 dark:bg-zinc-800/80 border-zinc-200 dark:border-zinc-700 text-foreground hover:bg-zinc-100 dark:hover:bg-zinc-700 cursor-pointer shadow-2xs max-w-[280px]"
            title="Danh mục học liệu của buổi học"
          >
            <FolderOpen className="h-3.5 w-3.5 text-primary shrink-0" />
            <div className="flex items-center gap-1.5 truncate">
              {getMaterialIcon(activeMaterial.type)}
              <span className="truncate max-w-[170px] text-left">{activeMaterial.title}</span>
            </div>
            <ChevronDown className={cn('h-3 w-3 text-muted-foreground shrink-0 transition-transform', isMaterialOpen && 'rotate-180')} />
          </Button>

          {isMaterialOpen && (
            <>
              {/* Click-away backdrop */}
              <div
                className="fixed inset-0 z-40"
                onClick={() => setIsMaterialOpen(false)}
              />

              {/* Dropdown panel */}
              <div className="absolute top-full left-1/2 -translate-x-1/2 mt-1.5 w-[320px] p-1.5 rounded-xl border bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 shadow-2xl z-50 animate-in fade-in zoom-in-95">
                <div className="px-2 py-1.5 text-[11px] font-bold text-muted-foreground uppercase tracking-wider border-b mb-1">
                  Học liệu buổi học ({materials.length})
                </div>
                {materials.map((mat) => {
                  const isSelected = mat.id === activeMaterial.id
                  return (
                    <button
                      key={mat.id}
                      type="button"
                      onClick={() => {
                        onSelectMaterial(mat)
                        setIsMaterialOpen(false)
                      }}
                      className={cn(
                        'w-full flex items-start justify-between gap-2 p-2 rounded-lg cursor-pointer text-xs mb-0.5 text-left transition-colors',
                        isSelected
                          ? 'bg-primary/10 text-primary font-bold'
                          : 'hover:bg-zinc-100 dark:hover:bg-zinc-800 text-foreground'
                      )}
                    >
                      <div className="flex items-start gap-2 min-w-0">
                        <span className="mt-0.5">{getMaterialIcon(mat.type)}</span>
                        <div className="min-w-0">
                          <p className="truncate leading-tight">{mat.title}</p>
                          {mat.description && (
                            <p className="text-[10px] text-muted-foreground font-normal line-clamp-1 mt-0.5">
                              {mat.description}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-1 shrink-0 ml-1">
                        {mat.badgeLabel && (
                          <Badge variant="outline" className="text-[9px] px-1 py-0 uppercase">
                            {mat.badgeLabel}
                          </Badge>
                        )}
                        {isSelected && <Check className="h-3.5 w-3.5 text-primary stroke-[3px]" />}
                      </div>
                    </button>
                  )
                })}
              </div>
            </>
          )}
        </div>
      </div>

      {/* ── Right: Timer, Roster Drawer Toggle, Fullscreen & End Session ── */}
      <div className="flex items-center gap-2 shrink-0">
        {/* Stopwatch */}
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-zinc-100 dark:bg-zinc-800/80 border border-zinc-200/80 dark:border-zinc-700/50 text-xs font-mono font-bold text-foreground">
          <Clock className="h-3.5 w-3.5 text-amber-500 shrink-0" />
          <span>{formatTimer(elapsedSeconds)}</span>
        </div>

        {/* Toggle Roster Drawer */}
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={onToggleRoster}
          className={cn(
            'h-8 gap-1.5 text-xs font-semibold rounded-lg px-2.5 transition-all cursor-pointer',
            isRosterOpen
              ? 'bg-primary/10 border-primary/30 text-primary hover:bg-primary/15'
              : 'text-zinc-700 dark:text-zinc-300'
          )}
          title={isRosterOpen ? 'Thu gọn danh sách học viên' : 'Mở rộng danh sách học viên để tốc ký'}
        >
          {isRosterOpen ? (
            <>
              <PanelRightClose className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Ẩn tốc ký</span>
            </>
          ) : (
            <>
              <PanelRightOpen className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Mở tốc ký</span>
            </>
          )}
        </Button>

        {/* Fullscreen Button */}
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={onToggleFullScreen}
          className="h-8 w-8 rounded-lg text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 cursor-pointer"
          title={isFullScreen ? 'Thoát toàn màn hình' : 'Phóng to toàn màn hình'}
        >
          {isFullScreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
        </Button>

        {/* End Session Button */}
        <Button
          type="button"
          onClick={onEndSession}
          className="h-8 px-3 rounded-lg bg-[#e11d48] hover:bg-[#be123c] text-white font-bold text-xs gap-1.5 shadow-sm cursor-pointer"
        >
          <Sparkles className="h-3.5 w-3.5" />
          <span>Kết thúc ca dạy</span>
        </Button>

        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="h-8 w-8 rounded-lg text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 ml-0.5 cursor-pointer"
          title="Đóng"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    </header>
  )
}

