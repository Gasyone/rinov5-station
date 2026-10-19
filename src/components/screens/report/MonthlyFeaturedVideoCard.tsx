'use client'

import React, { useState, useRef, useEffect, useCallback } from 'react'
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize2,
  Minimize2,
  RotateCcw,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import type { MonthlyFeaturedVideo } from '@/mocks/monthlyReports'

interface MonthlyFeaturedVideoCardProps {
  video?: MonthlyFeaturedVideo
  className?: string
}

export function MonthlyFeaturedVideoCard({
  video,
  className = '',
}: MonthlyFeaturedVideoCardProps) {
  const [isPlaying, setIsPlaying] = useState<boolean>(true)
  const [isMuted, setIsMuted] = useState<boolean>(true)
  const [currentTime, setCurrentTime] = useState<number>(0)
  const [duration, setDuration] = useState<number>(0)
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false)
  const [showControls, setShowControls] = useState<boolean>(false)
  const [hasError, setHasError] = useState<boolean>(false)

  const videoRef = useRef<HTMLVideoElement | null>(null)
  const containerRef = useRef<HTMLDivElement | null>(null)
  const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Khởi động video tự động (autoplay) tuân thủ chính sách trình duyệt (Muted lúc đầu)
  useEffect(() => {
    if (!videoRef.current) return
    const el = videoRef.current

    // Cố gắng phát autoplay muted
    el.muted = true
    setIsMuted(true)
    const playPromise = el.play()
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          setIsPlaying(true)
        })
        .catch(() => {
          // Trình duyệt chặn autoplay -> giữ trạng thái pause
          setIsPlaying(false)
        })
    }
  }, [video?.url])

  // Lắng nghe sự kiện fullscreen
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement))
    }
    document.addEventListener('fullscreenchange', handleFullscreenChange)
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange)
  }, [])

  const handlePlayPause = useCallback(() => {
    if (!videoRef.current) return
    if (videoRef.current.paused) {
      videoRef.current.play().catch(() => {})
      setIsPlaying(true)
    } else {
      videoRef.current.pause()
      setIsPlaying(false)
    }
  }, [])

  const handleToggleMute = useCallback((e?: React.MouseEvent) => {
    e?.stopPropagation()
    if (!videoRef.current) return
    const newMuted = !videoRef.current.muted
    videoRef.current.muted = newMuted
    setIsMuted(newMuted)
  }, [])

  const handleTimeUpdate = () => {
    if (!videoRef.current) return
    setCurrentTime(videoRef.current.currentTime)
    if (videoRef.current.duration && !isNaN(videoRef.current.duration)) {
      setDuration(videoRef.current.duration)
    }
  }

  const handleLoadedMetadata = () => {
    if (!videoRef.current) return
    if (videoRef.current.duration && !isNaN(videoRef.current.duration)) {
      setDuration(videoRef.current.duration)
    }
  }

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!videoRef.current) return
    const target = Number(e.target.value)
    videoRef.current.currentTime = target
    setCurrentTime(target)
  }

  const handleToggleFullscreen = () => {
    if (!containerRef.current) return
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch(() => {})
    } else {
      document.exitFullscreen().catch(() => {})
    }
  }

  const handleUserActivity = () => {
    setShowControls(true)
    if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current)
    controlsTimeoutRef.current = setTimeout(() => {
      if (isPlaying) {
        setShowControls(false)
      }
    }, 2800)
  }

  const formatSeconds = (sec: number): string => {
    if (isNaN(sec) || sec < 0) return '00:00'
    const m = Math.floor(sec / 60)
    const s = Math.floor(sec % 60)
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
  }

  if (!video) return null

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0

  return (
    <div
      ref={containerRef}
      onMouseMove={handleUserActivity}
      onMouseEnter={() => setShowControls(true)}
      onMouseLeave={() => isPlaying && setShowControls(false)}
      className={cn(
        'relative aspect-video w-full max-h-[440px] rounded-xl bg-black group select-none overflow-hidden flex items-center justify-center cursor-pointer border border-border/70 shadow-2xs',
        className
      )}
      onClick={handlePlayPause}
    >
      <video
        ref={videoRef}
        src={video.url}
        poster={video.thumbnailUrl}
        autoPlay
        muted={isMuted}
        playsInline
        loop
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={() => setIsPlaying(false)}
        onError={() => setHasError(true)}
        className="w-full h-full object-contain bg-black"
      />

      {/* Thông báo lỗi nếu video không tải được */}
      {hasError && (
        <div className="absolute inset-0 bg-black/85 flex flex-col items-center justify-center p-4 text-center text-white space-y-2 z-20">
          <p className="text-xs text-white/80">Video đang được trung tâm xử lý và tối ưu hóa...</p>
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={(e) => {
              e.stopPropagation()
              setHasError(false)
              if (videoRef.current) videoRef.current.load()
            }}
            className="h-7 text-xs text-white border-white/20 hover:bg-white/10"
          >
            <RotateCcw className="h-3 w-3 mr-1" /> Tải lại
          </Button>
        </div>
      )}

      {/* ── FLOATING UNMUTE CTA PILL: Nổi bật giúp phụ huynh bật âm thanh 1 chạm ── */}
      {isMuted && !hasError && (
        <button
          type="button"
          onClick={handleToggleMute}
          className="absolute top-3 right-3 z-30 px-3 py-1.5 rounded-full bg-black/75 hover:bg-black/90 backdrop-blur-md border border-amber-400/50 text-amber-300 text-xs font-semibold flex items-center gap-1.5 shadow-lg animate-pulse transition-all cursor-pointer hover:scale-105"
          title="Bấm để bật âm thanh video"
        >
          <VolumeX className="h-4 w-4 text-amber-400" />
          <span>Chạm để bật tiếng</span>
        </button>
      )}

      {/* ── CENTER BIG PLAY/PAUSE BUTTON: Khi tạm dừng ── */}
      {!isPlaying && !hasError && (
        <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/35 backdrop-blur-[1px] transition-all">
          <div className="h-14 w-14 rounded-full bg-amber-500/90 hover:bg-amber-500 text-white flex items-center justify-center shadow-2xl transition-transform hover:scale-110 active:scale-95">
            <Play className="h-7 w-7 fill-white ml-0.5" />
          </div>
        </div>
      )}

      {/* ── BOTTOM VIDEO CONTROLS BAR: Hiển thị khi hover hoặc khi pause ── */}
      <div
        onClick={(e) => e.stopPropagation()}
        className={cn(
          'absolute inset-x-0 bottom-0 z-30 p-2.5 sm:p-3 bg-gradient-to-t from-black/90 via-black/60 to-transparent transition-opacity duration-300 flex flex-col gap-1.5',
          showControls || !isPlaying ? 'opacity-100' : 'opacity-0 pointer-events-none'
        )}
      >
        {/* Progress Bar (Scrub bar) */}
        <div className="relative w-full h-1 group/bar cursor-pointer flex items-center">
          <div className="w-full h-1 bg-white/30 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-amber-400 to-orange-500 transition-all duration-100"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <input
            type="range"
            min={0}
            max={duration || 100}
            value={currentTime}
            onChange={handleSeek}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
        </div>

        {/* Control Buttons Row */}
        <div className="flex items-center justify-between gap-2 text-white pt-1">
          <div className="flex items-center gap-2">
            {/* Play / Pause */}
            <button
              type="button"
              onClick={handlePlayPause}
              className="h-7 w-7 rounded-md bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors cursor-pointer"
              title={isPlaying ? 'Tạm dừng' : 'Phát tiếp'}
            >
              {isPlaying ? <Pause className="h-3.5 w-3.5 fill-white" /> : <Play className="h-3.5 w-3.5 fill-white" />}
            </button>

            {/* Mute / Unmute */}
            <button
              type="button"
              onClick={handleToggleMute}
              className="h-7 w-7 rounded-md bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors cursor-pointer"
              title={isMuted ? 'Bật tiếng' : 'Tắt tiếng'}
            >
              {isMuted ? <VolumeX className="h-3.5 w-3.5 text-amber-400" /> : <Volume2 className="h-3.5 w-3.5 text-white" />}
            </button>

            {/* Time display */}
            <span className="text-[11px] font-mono text-white/80">
              {formatSeconds(currentTime)} / {formatSeconds(duration)}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* Fullscreen */}
            <button
              type="button"
              onClick={handleToggleFullscreen}
              className="h-7 w-7 rounded-md bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors cursor-pointer"
              title={isFullscreen ? 'Thu nhỏ' : 'Toàn màn hình'}
            >
              {isFullscreen ? <Minimize2 className="h-3.5 w-3.5" /> : <Maximize2 className="h-3.5 w-3.5" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
