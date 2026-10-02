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
import { toast } from 'sonner'
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
  const [isClassRecording, setIsClassRecording] = useState(true)

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
    <header className="h-11 border-b bg-white dark:bg-zinc-900 px-3 flex items-center justify-between gap-2.5 shrink-0 select-none z-20">
      {/* ── Left: Breadcrumb + Session info ── */}
      <div className="flex items-center gap-2 min-w-0">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="h-7.5 w-7.5 rounded-lg text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800 shrink-0 cursor-pointer"
          title="Thoát chế độ giảng dạy"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>

        <div className="flex items-center gap-2 min-w-0">
          <Badge className="bg-emerald-600 hover:bg-emerald-600 text-white font-bold text-[11px] px-1.5 py-0.5 rounded-md gap-1 shrink-0">
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
          className="h-7.5 gap-1.5 text-xs font-semibold rounded-lg bg-zinc-50 dark:bg-zinc-800/80 border-zinc-200 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-700 text-foreground cursor-pointer shadow-2xs px-2.5"
          title="Mở bảng giáo án, mục tiêu kiến thức và tiến trình tiết dạy"
        >
          <BookOpen className="h-3.5 w-3.5 text-amber-500" />
          <span>Giáo án & Mục tiêu</span>
        </Button>

        {/* Robust Inline Material Dropdown */}
        <div className="relative">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setIsMaterialOpen((prev) => !prev)}
            className="h-7.5 gap-1.5 text-xs font-semibold rounded-lg bg-zinc-50 dark:bg-zinc-800/80 border-zinc-200 dark:border-zinc-700 text-foreground hover:bg-zinc-100 dark:hover:bg-zinc-700 cursor-pointer shadow-2xs max-w-[260px] px-2.5"
            title="Danh mục học liệu của buổi học"
          >
            <FolderOpen className="h-3.5 w-3.5 text-primary shrink-0" />
            <div className="flex items-center gap-1.5 truncate">
              {getMaterialIcon(activeMaterial.type)}
              <span className="truncate max-w-[160px] text-left">{activeMaterial.title}</span>
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

      {/* ── Right: Timer, Recording, Roster Drawer Toggle, Fullscreen & End Session ── */}
      <div className="flex items-center gap-2 shrink-0">
        {/* Stopwatch */}
        <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-zinc-100 dark:bg-zinc-800/80 border border-zinc-200/80 dark:border-zinc-700/50 text-xs font-mono font-bold text-foreground h-7.5">
          <Clock className="h-3.5 w-3.5 text-amber-500 shrink-0" />
          <span>{formatTimer(elapsedSeconds)}</span>
        </div>

        {/* Nút Thu âm / Ghi âm toàn ca dạy */}
        <button
          type="button"
          onClick={() => {
            setIsClassRecording((prev) => !prev)
            if (isClassRecording) {
              toast.info('Đã tạm dừng thu âm ca dạy')
            } else {
              toast.success('Đang tiếp tục thu âm ca dạy!')
            }
          }}
          className={cn(
            'hidden sm:flex items-center gap-1.5 px-2 py-0.5 rounded-md text-xs font-semibold border transition-all cursor-pointer h-7.5 select-none',
            isClassRecording
              ? 'bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300 border-rose-200 dark:border-rose-800'
              : 'bg-zinc-100 text-zinc-500 border-zinc-200 dark:bg-zinc-800 dark:text-zinc-400'
          )}
          title="Trạng thái thu âm / ghi hình toàn bộ ca dạy (Bấm để bật/tắt)"
        >
          <span className={cn('h-2 w-2 rounded-full', isClassRecording ? 'bg-rose-500 animate-pulse' : 'bg-zinc-400')} />
          <span className="text-[11px]">{isClassRecording ? 'Đang thu âm' : 'Tạm dừng thu'}</span>
        </button>

        {/* Toggle Roster Drawer */}
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={onToggleRoster}
          className={cn(
            'h-7.5 gap-1.5 text-xs font-semibold rounded-lg px-2.5 transition-all cursor-pointer',
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
          className="h-7.5 w-7.5 rounded-lg text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 cursor-pointer"
          title={isFullScreen ? 'Thoát toàn màn hình' : 'Phóng to toàn màn hình'}
        >
          {isFullScreen ? <Minimize2 className="h-3.5 w-3.5" /> : <Maximize2 className="h-3.5 w-3.5" />}
        </Button>

        {/* End Session Button */}
        <Button
          type="button"
          onClick={onEndSession}
          className="h-7.5 px-3 rounded-lg bg-[#e11d48] hover:bg-[#be123c] text-white font-bold text-xs gap-1.5 shadow-sm cursor-pointer"
        >
          <Sparkles className="h-3.5 w-3.5" />
          <span>Kết thúc ca dạy</span>
        </Button>

        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="h-7.5 w-7.5 rounded-lg text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 ml-0.5 cursor-pointer"
          title="Đóng"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    </header>
  )
}

