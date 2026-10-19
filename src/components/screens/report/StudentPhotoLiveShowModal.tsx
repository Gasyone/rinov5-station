'use client'

import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react'
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Settings2,
  ChevronLeft,
  ChevronRight,
  X,
  Share2,
  Sparkles,
  Shuffle,
  Clock,
  Sliders,
  Music,
} from 'lucide-react'
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import type { StudentGalleryPhoto } from '@/mocks/studentPhotos'
import type {
  TransitionEffect,
  PlayOrder,
  PhotoDurationSeconds,
} from './studentPhotoShowTypes'
import { AmbientMusicPlayer } from './studentPhotoMusicHelper'

interface StudentPhotoLiveShowModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  mediaList: StudentGalleryPhoto[]
  studentName?: string
  initialIndex?: number
}

const EFFECT_LABELS: Record<TransitionEffect, string> = {
  'ken-burns': 'Ken Burns',
  fade: 'Mờ dần',
  slide: 'Lướt ngang',
}

const PLAY_ORDER_LABELS: Record<PlayOrder, string> = {
  chronological: 'Cũ → Mới',
  reverse: 'Mới → Cũ',
  shuffle: 'Xáo trộn',
}

export function StudentPhotoLiveShowModal({
  open,
  onOpenChange,
  mediaList,
  studentName = 'Học viên',
  initialIndex = 0,
}: StudentPhotoLiveShowModalProps) {
  // Settings (mặc định Ken Burns để ảnh có hiệu ứng chuyển động điện ảnh)
  const [effect, setEffect] = useState<TransitionEffect>('ken-burns')
  const [photoDuration, setPhotoDuration] = useState<PhotoDurationSeconds>(3)
  const [playOrder, setPlayOrder] = useState<PlayOrder>('chronological')
  const [isMuted, setIsMuted] = useState(false)
  const [musicEnabled, setMusicEnabled] = useState(true)
  const [musicVolume, setMusicVolume] = useState<number>(0.38)

  // Nonce để ép re-render và khởi động lại CSS animation ngay khi đổi cấu hình
  const [slideNonce, setSlideNonce] = useState(0)
  const [orderSeed, setOrderSeed] = useState(0)

  // Playback state
  const [currentIndex, setCurrentIndex] = useState(initialIndex)
  const [isPlaying, setIsPlaying] = useState(true)
  const [progressPercent, setProgressPercent] = useState(0)

  const videoRef = useRef<HTMLVideoElement | null>(null)
  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const musicPlayerRef = useRef<AmbientMusicPlayer | null>(null)

  // Sắp xếp danh sách phát: Đưa toàn bộ ẢNH lên trước, đưa VIDEO xuống cuối danh sách
  const sortedMediaList = useMemo(() => {
    if (!mediaList || mediaList.length === 0) return []
    const images = mediaList.filter((m) => m.type !== 'video')
    const videos = mediaList.filter((m) => m.type === 'video')
    const baseList = [...images, ...videos]

    if (playOrder === 'reverse') {
      return [...baseList].reverse()
    }
    if (playOrder === 'shuffle') {
      return [...baseList].sort(() => 0.5 - Math.random())
    }
    return baseList
  }, [mediaList, playOrder, orderSeed])

  // Khởi tạo Music Player khi modal mở
  useEffect(() => {
    if (open) {
      if (!musicPlayerRef.current) {
        musicPlayerRef.current = new AmbientMusicPlayer()
      }
      musicPlayerRef.current.setVolume(musicVolume)
      if (musicEnabled) {
        musicPlayerRef.current.start()
      }
    } else {
      musicPlayerRef.current?.stop()
      musicPlayerRef.current = null
    }

    return () => {
      musicPlayerRef.current?.stop()
      musicPlayerRef.current = null
    }
  }, [open, musicEnabled, musicVolume])

  // Reset index khi mở modal
  useEffect(() => {
    if (open) {
      setCurrentIndex(Math.min(initialIndex, sortedMediaList.length - 1))
      setProgressPercent(0)
      setIsPlaying(true)
      setSlideNonce((n) => n + 1)
    }
  }, [open, initialIndex, sortedMediaList.length])

  const currentMedia = sortedMediaList[currentIndex] || sortedMediaList[0]
  const isVideo = currentMedia?.type === 'video'

  const goToNext = useCallback(() => {
    setProgressPercent(0)
    setSlideNonce((n) => n + 1)
    setCurrentIndex((prev) => (prev < sortedMediaList.length - 1 ? prev + 1 : 0))
  }, [sortedMediaList.length])

  const goToPrev = useCallback(() => {
    setProgressPercent(0)
    setSlideNonce((n) => n + 1)
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : sortedMediaList.length - 1))
  }, [sortedMediaList.length])

  // Handlers đổi cấu hình - Áp dụng NGAY LẬP TỨC và reset tiến trình từ 0
  const handleDurationChange = (sec: PhotoDurationSeconds) => {
    setPhotoDuration(sec)
    setProgressPercent(0)
    setSlideNonce((n) => n + 1)
    setIsPlaying(true)
    toast.success(`⚡ Đã áp dụng thời lượng: ${sec} giây/ảnh`)
  }

  const handleEffectChange = (newEffect: TransitionEffect) => {
    setEffect(newEffect)
    setProgressPercent(0)
    setSlideNonce((n) => n + 1)
    setIsPlaying(true)
    toast.success(`✨ Hiệu ứng: ${EFFECT_LABELS[newEffect]}`)
  }

  const handlePlayOrderChange = (newOrder: PlayOrder) => {
    setPlayOrder(newOrder)
    setOrderSeed((s) => s + 1)
    setCurrentIndex(0)
    setProgressPercent(0)
    setSlideNonce((n) => n + 1)
    setIsPlaying(true)
    toast.success(`🔄 Thứ tự phát: ${PLAY_ORDER_LABELS[newOrder]}`)
  }

  const handleVolumeChange = (vol: number) => {
    setMusicVolume(vol)
    musicPlayerRef.current?.setVolume(vol)
    if (!musicEnabled) {
      setMusicEnabled(true)
      musicPlayerRef.current?.start()
    }
    toast.success(`🔊 Âm lượng nhạc nền: ${Math.round(vol * 100)}%`)
  }

  // Timer loop cho ảnh (KHÔNG dừng khi hover chuột, chỉ dừng khi isPlaying = false)
  useEffect(() => {
    if (!open || !isPlaying || isVideo) {
      if (timerRef.current) clearInterval(timerRef.current)
      return
    }

    const intervalStepMs = 40
    const totalMs = photoDuration * 1000
    const stepIncrement = (intervalStepMs / totalMs) * 100

    timerRef.current = setInterval(() => {
      setProgressPercent((prev) => {
        const next = prev + stepIncrement
        if (next >= 100) {
          // Trì hoãn sang microtask tiếp theo để tránh gọi state setter bên trong updater
          setTimeout(() => {
            goToNext()
          }, 10)
          return 100
        }
        return next
      })
    }, intervalStepMs)

    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [open, isPlaying, isVideo, photoDuration, currentIndex, slideNonce, goToNext])

  // Tự động tạm dừng nhạc nền khi Video đang phát, tiếp tục nhạc khi xem ảnh
  useEffect(() => {
    if (!musicPlayerRef.current || !musicEnabled) return

    if (isVideo && isPlaying) {
      musicPlayerRef.current.pause()
    } else if (!isVideo && isPlaying) {
      musicPlayerRef.current.resume()
    } else if (!isPlaying) {
      musicPlayerRef.current.pause()
    }
  }, [isVideo, isPlaying, musicEnabled])

  // Xử lý phát Video mượt mà, tự động chạy ngay, xử lý autoplay browser policy
  useEffect(() => {
    if (!videoRef.current || !isVideo) return

    if (isPlaying) {
      const playPromise = videoRef.current.play()
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          // Trình duyệt chặn autoplay có tiếng -> fallback sang muted để video chạy luôn
          if (videoRef.current) {
            videoRef.current.muted = true
            setIsMuted(true)
            videoRef.current.play().catch(() => {})
          }
        })
      }
    } else {
      videoRef.current.pause()
    }
  }, [isPlaying, isVideo, currentIndex])

  // Cập nhật tiến trình video
  const handleVideoTimeUpdate = () => {
    if (!videoRef.current) return
    const { currentTime, duration } = videoRef.current
    if (duration > 0) {
      setProgressPercent((currentTime / duration) * 100)
    }
  }

  // Điều hướng bằng bàn phím
  useEffect(() => {
    if (!open) return
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') goToPrev()
      else if (e.key === 'ArrowRight') goToNext()
      else if (e.key === ' ') {
        e.preventDefault()
        setIsPlaying((p) => !p)
      } else if (e.key === 'Escape') {
        onOpenChange(false)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [open, goToNext, goToPrev, onOpenChange])

  const toggleMusic = () => {
    setMusicEnabled((prev) => {
      const next = !prev
      if (next) {
        musicPlayerRef.current?.start()
        toast.success('Đã bật nhạc nền!')
      } else {
        musicPlayerRef.current?.pause()
        toast.info('Đã tắt nhạc nền.')
      }
      return next
    })
  }

  if (!currentMedia) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="w-[95vw] sm:max-w-4xl md:max-w-5xl lg:max-w-5xl xl:max-w-6xl h-[88vh] max-h-[840px] min-h-[520px] p-0 bg-zinc-950 border border-white/20 text-white rounded-2xl overflow-hidden z-[9999] shadow-2xl flex flex-col [&>button]:hidden select-none outline-none"
        onClick={(e) => e.stopPropagation()}
      >
        {/* ════════ TOP STORY PROGRESS BAR ════════ */}
        <div className="absolute top-0 inset-x-0 z-40 p-3 pt-2.5 bg-gradient-to-b from-black/95 via-black/60 to-transparent space-y-2">
          {/* Segmented Progress Bars */}
          <div className="flex items-center gap-1.5 w-full">
            {sortedMediaList.map((item, idx) => {
              let width = '0%'
              if (idx < currentIndex) width = '100%'
              else if (idx === currentIndex) width = `${Math.min(100, Math.max(0, progressPercent))}%`

              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    setCurrentIndex(idx)
                    setProgressPercent(0)
                  }}
                  className="flex-1 h-1.5 rounded-full bg-white/25 overflow-hidden cursor-pointer transition-all hover:h-2"
                  title={`Xem khoảnh khắc ${idx + 1}: ${item.title}`}
                >
                  <div
                    className="h-full bg-amber-400 rounded-full transition-all duration-75 ease-linear shadow-xs"
                    style={{ width }}
                  />
                </button>
              )
            })}
          </div>

          {/* Top Control Bar */}
          <div className="flex items-center justify-between gap-3 pt-0.5">
            {/* Left: Badge Live Show + Student Name & Session + Active Config Badge */}
            <div className="flex items-center gap-2.5 min-w-0">
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-[11px] font-bold text-white tracking-wide uppercase shadow-xs shrink-0">
                <Sparkles className="h-3 w-3 fill-white" />
                <span>Story Show</span>
              </span>
              <DialogTitle className="text-xs sm:text-sm font-semibold text-white truncate drop-shadow-xs flex items-center gap-1.5">
                <span className="font-bold text-amber-300">{studentName}</span>
                <span className="text-white/60">•</span>
                <span className="text-white/90 font-normal truncate">
                  {currentMedia.sessionTitle || currentMedia.title}
                </span>
              </DialogTitle>

              {/* Cấu hình đang chạy: Hiển thị ngay số giây và hiệu ứng đã chọn để phụ huynh thấy ngay */}
              <div className="hidden md:inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/10 text-white/90 text-[11px] font-mono border border-white/20 shadow-xs shrink-0">
                <span className="flex h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="font-bold text-amber-300">{photoDuration}s</span>
                <span className="text-white/40">•</span>
                <span className="text-white/90">{EFFECT_LABELS[effect]}</span>
              </div>
            </div>

            {/* Right: Actions (Play/Pause, Music, Sound, Settings, Share, Close) */}
            <div className="flex items-center gap-1.5 shrink-0">
              {/* Play / Pause Button */}
              <button
                type="button"
                onClick={() => setIsPlaying((p) => !p)}
                className="h-8 px-2.5 rounded-lg bg-white/10 hover:bg-white/20 text-white flex items-center gap-1.5 text-xs font-medium transition-colors cursor-pointer border border-white/15"
                title={isPlaying ? 'Bấm để tạm dừng (Phím cách)' : 'Bấm để tiếp tục phát'}
              >
                {isPlaying ? (
                  <>
                    <Pause className="h-3.5 w-3.5 fill-white" />
                    <span className="hidden sm:inline">Tạm dừng</span>
                  </>
                ) : (
                  <>
                    <Play className="h-3.5 w-3.5 fill-white" />
                    <span className="hidden sm:inline">Tiếp tục</span>
                  </>
                )}
              </button>

              {/* Music Toggle Button (Nhạc nền) */}
              <button
                type="button"
                onClick={toggleMusic}
                className={cn(
                  'h-8 px-2.5 rounded-lg flex items-center gap-1.5 text-xs font-medium transition-colors cursor-pointer border',
                  musicEnabled
                    ? 'bg-amber-500/25 text-amber-300 border-amber-400/40 hover:bg-amber-500/35'
                    : 'bg-white/10 text-white/50 border-white/15 hover:bg-white/20'
                )}
                title={musicEnabled ? 'Tắt nhạc nền' : 'Bật nhạc nền'}
              >
                <Music className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Nhạc nền</span>
              </button>

              {/* Mute Toggle (chỉ khi slide là Video) */}
              {isVideo && (
                <button
                  type="button"
                  onClick={() => setIsMuted((m) => !m)}
                  className="h-8 w-8 rounded-lg bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer border border-white/15"
                  title={isMuted ? 'Bật âm thanh video' : 'Tắt tiếng video'}
                >
                  {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                </button>
              )}

              {/* Settings Popover (Hiệu ứng, Thứ tự, Tốc độ) */}
              <Popover>
                <PopoverTrigger asChild>
                  <button
                    type="button"
                    className="h-8 w-8 rounded-lg bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer border border-white/15 relative"
                    title="Cài đặt hiệu ứng & tốc độ Show"
                  >
                    <Settings2 className="h-4 w-4" />
                    <span className="absolute -top-0.5 -right-0.5 flex h-2 w-2 rounded-full bg-amber-400" />
                  </button>
                </PopoverTrigger>
                <PopoverContent
                  side="bottom"
                  align="end"
                  className="w-76 p-3.5 bg-zinc-900 border border-white/20 text-white rounded-xl shadow-2xl z-[10000] space-y-3.5"
                >
                  <div className="flex items-center justify-between pb-2 border-b border-white/10 font-semibold text-xs text-amber-300">
                    <div className="flex items-center gap-1.5">
                      <Sliders className="h-3.5 w-3.5" />
                      <span>Cấu hình Live Show</span>
                    </div>
                    <span className="text-[10px] text-emerald-400 font-mono">● Tự động áp dụng</span>
                  </div>

                  {/* 1. Hiệu ứng chuyển cảnh */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <label className="text-[11px] font-medium text-white/70 block">
                        Hiệu ứng chuyển cảnh (Transition)
                      </label>
                      <span className="text-[10px] text-amber-300 font-medium">
                        {EFFECT_LABELS[effect]}
                      </span>
                    </div>
                    <div className="grid grid-cols-3 gap-1">
                      {(
                        [
                          { id: 'ken-burns', label: 'Ken Burns' },
                          { id: 'fade', label: 'Mờ dần' },
                          { id: 'slide', label: 'Lướt ngang' },
                        ] as const
                      ).map((item) => (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => handleEffectChange(item.id)}
                          className={cn(
                            'py-1.5 px-1.5 rounded-md text-[11px] font-medium border text-center transition-all cursor-pointer',
                            effect === item.id
                              ? 'bg-amber-500 text-zinc-950 font-bold border-amber-400 shadow-sm'
                              : 'bg-white/5 text-white/70 border-white/10 hover:bg-white/10'
                          )}
                        >
                          {item.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* 2. Tốc độ mỗi ảnh */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <label className="text-[11px] font-medium text-white/70 flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        <span>Thời lượng mỗi ảnh</span>
                      </label>
                      <span className="text-[10px] text-amber-300 font-mono font-bold">
                        {photoDuration} giây
                      </span>
                    </div>
                    <div className="grid grid-cols-4 gap-1">
                      {([3, 4, 5, 7] as const).map((sec) => (
                        <button
                          key={sec}
                          type="button"
                          onClick={() => handleDurationChange(sec)}
                          className={cn(
                            'py-1.5 px-1.5 rounded-md text-[11px] font-medium border text-center transition-all cursor-pointer',
                            photoDuration === sec
                              ? 'bg-amber-500 text-zinc-950 font-bold border-amber-400 shadow-sm'
                              : 'bg-white/5 text-white/70 border-white/10 hover:bg-white/10'
                          )}
                        >
                          {sec}s
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* 3. Thứ tự phát */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <label className="text-[11px] font-medium text-white/70 flex items-center gap-1">
                        <Shuffle className="h-3 w-3" />
                        <span>Thứ tự phát</span>
                      </label>
                      <span className="text-[10px] text-amber-300 font-medium">
                        {PLAY_ORDER_LABELS[playOrder]}
                      </span>
                    </div>
                    <div className="grid grid-cols-3 gap-1">
                      {(
                        [
                          { id: 'chronological', label: 'Cũ → Mới' },
                          { id: 'reverse', label: 'Mới → Cũ' },
                          { id: 'shuffle', label: 'Xáo trộn' },
                        ] as const
                      ).map((item) => (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => handlePlayOrderChange(item.id)}
                          className={cn(
                            'py-1.5 px-1.5 rounded-md text-[11px] font-medium border text-center transition-all cursor-pointer',
                            playOrder === item.id
                              ? 'bg-amber-500 text-zinc-950 font-bold border-amber-400 shadow-sm'
                              : 'bg-white/5 text-white/70 border-white/10 hover:bg-white/10'
                          )}
                        >
                          {item.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* 4. Âm lượng nhạc nền */}
                  <div className="space-y-1.5 pt-1 border-t border-white/10">
                    <div className="flex items-center justify-between">
                      <label className="text-[11px] font-medium text-white/70 flex items-center gap-1">
                        <Volume2 className="h-3 w-3 text-amber-400" />
                        <span>Âm lượng nhạc nền</span>
                      </label>
                      <span className="text-[10px] text-amber-300 font-mono font-bold">
                        {Math.round(musicVolume * 100)}%
                      </span>
                    </div>
                    <div className="grid grid-cols-3 gap-1">
                      {(
                        [
                          { val: 0.2, label: '20% Nhẹ' },
                          { val: 0.38, label: '38% Dịu êm' },
                          { val: 0.6, label: '60% Rõ' },
                        ] as const
                      ).map((item) => (
                        <button
                          key={item.val}
                          type="button"
                          onClick={() => handleVolumeChange(item.val)}
                          className={cn(
                            'py-1.5 px-1.5 rounded-md text-[11px] font-medium border text-center transition-all cursor-pointer',
                            musicVolume === item.val
                              ? 'bg-amber-500 text-zinc-950 font-bold border-amber-400 shadow-sm'
                              : 'bg-white/5 text-white/70 border-white/10 hover:bg-white/10'
                          )}
                        >
                          {item.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </PopoverContent>
              </Popover>

              {/* Share link */}
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard.writeText(currentMedia.url)
                  toast.success('Đã sao chép liên kết khoảnh khắc!')
                }}
                className="h-8 w-8 rounded-lg bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer border border-white/15 hidden sm:flex"
                title="Chia sẻ link"
              >
                <Share2 className="h-4 w-4" />
              </button>

              {/* Close Button */}
              <button
                type="button"
                onClick={() => onOpenChange(false)}
                className="h-8 w-8 rounded-lg bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer border border-white/15"
                title="Đóng (Escape)"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {/* ════════ MAIN STAGE (MEDIA VIEWPORT) ════════ */}
        <div className="relative flex-1 w-full h-full min-h-0 bg-black flex items-center justify-center overflow-hidden">
          {/* Keyframes style tag: Đảm bảo hiệu ứng Ken Burns, Slide, Fade chạy mượt mà theo đúng số giây */}
          <style>{`
            @keyframes kenburns-scale {
              0% { transform: scale(1); }
              100% { transform: scale(1.10); }
            }
            @keyframes slide-in-smooth {
              0% { transform: translateX(48px); opacity: 0.3; }
              100% { transform: translateX(0); opacity: 1; }
            }
            @keyframes fade-in-smooth {
              0% { opacity: 0.3; }
              100% { opacity: 1; }
            }
          `}</style>

          {/* Click areas for Next / Prev */}
          <div
            onClick={goToPrev}
            className="absolute inset-y-0 left-0 w-1/4 z-30 cursor-pointer group flex items-center justify-start pl-4"
            title="Khoảnh khắc trước (Mũi tên trái)"
          >
            <div className="h-10 w-10 rounded-full bg-black/60 hover:bg-black/90 text-white flex items-center justify-center border border-white/20 backdrop-blur-md transition-all opacity-0 group-hover:opacity-100 shadow-md">
              <ChevronLeft className="h-6 w-6" />
            </div>
          </div>

          <div
            onClick={goToNext}
            className="absolute inset-y-0 right-0 w-1/4 z-30 cursor-pointer group flex items-center justify-end pr-4"
            title="Khoảnh khắc tiếp theo (Mũi tên phải)"
          >
            <div className="h-10 w-10 rounded-full bg-black/60 hover:bg-black/90 text-white flex items-center justify-center border border-white/20 backdrop-blur-md transition-all opacity-0 group-hover:opacity-100 shadow-md">
              <ChevronRight className="h-6 w-6" />
            </div>
          </div>

          {/* Media Content Stage: Khung cố định, ổn định 100%, không bị giật kích thước */}
          <div className="relative w-full h-[58vh] sm:h-[62vh] max-h-[600px] min-h-[380px] flex items-center justify-center overflow-hidden bg-black p-2 sm:p-4">
            {isVideo ? (
              <video
                key={currentMedia.url}
                ref={videoRef}
                src={currentMedia.url}
                poster={currentMedia.thumbnailUrl}
                autoPlay
                playsInline
                muted={isMuted}
                onTimeUpdate={handleVideoTimeUpdate}
                onEnded={goToNext}
                onError={() => {
                  toast.info('Video này đang được xử lý, tự động chuyển tiếp...')
                  setTimeout(goToNext, 2000)
                }}
                className="max-h-full max-w-full w-auto h-auto object-contain bg-black shadow-2xl"
              />
            ) : (
              <div
                key={`${currentMedia.id || currentMedia.url}-${effect}-${photoDuration}-${slideNonce}`}
                className="relative w-full h-full flex items-center justify-center overflow-hidden"
                style={{
                  animation:
                    effect === 'slide'
                      ? 'slide-in-smooth 0.45s cubic-bezier(0.16, 1, 0.3, 1) forwards'
                      : effect === 'fade'
                      ? 'fade-in-smooth 0.4s ease-out forwards'
                      : undefined,
                }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={currentMedia.url}
                  alt={currentMedia.title}
                  className="max-h-full max-w-full w-auto h-auto object-contain shadow-2xl select-none"
                  style={{
                    animation:
                      effect === 'ken-burns'
                        ? `kenburns-scale ${photoDuration}s ease-out forwards, fade-in-smooth 0.4s ease-out forwards`
                        : undefined,
                    animationPlayState: isPlaying ? 'running' : 'paused',
                  }}
                />
              </div>
            )}
          </div>

          {/* Pause Indicator overlay: Chỉ hiển thị khi bấm Tạm dừng, đặt ở giữa khung hình, không che Popover */}
          {!isPlaying && (
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30 px-4 py-2 rounded-full bg-black/80 backdrop-blur-md border border-white/20 text-white text-xs font-medium flex items-center gap-2 pointer-events-none shadow-2xl animate-in zoom-in-95 fade-in">
              <Pause className="h-4 w-4 fill-white text-amber-400" />
              <span>Đang tạm dừng • Bấm [Tiếp tục] hoặc phím cách để xem tiếp</span>
            </div>
          )}

          {/* Bottom Title & Details Overlay */}
          <div className="absolute bottom-14 inset-x-0 z-30 p-4 bg-gradient-to-t from-black/90 via-black/50 to-transparent flex items-end justify-between gap-4 pointer-events-none">
            <div className="space-y-1 max-w-xl">
              <span className="text-[11px] font-semibold text-amber-400 uppercase tracking-wider">
                {currentMedia.sessionDate || currentMedia.date} • {isVideo ? 'Video thực hành' : 'Hình ảnh học tập'}
              </span>
              <h2 className="text-sm sm:text-base font-bold text-white drop-shadow-md leading-tight">
                {currentMedia.title}
              </h2>
              {currentMedia.sessionTitle && (
                <p className="text-xs text-white/80 line-clamp-1">
                  Chủ đề bài học: {currentMedia.sessionTitle}
                </p>
              )}
            </div>

            <div className="pointer-events-auto shrink-0 flex items-center gap-2">
              <span className="text-xs font-mono text-white/80 bg-black/60 px-2 py-0.5 rounded border border-white/15">
                {currentIndex + 1} / {sortedMediaList.length}
              </span>
            </div>
          </div>
        </div>

        {/* ════════ BOTTOM THUMBNAILS STRIP ════════ */}
        <div className="h-14 px-4 bg-black/90 border-t border-white/10 flex items-center justify-center shrink-0 z-40">
          <div className="flex items-center gap-1.5 overflow-x-auto max-w-full py-1 custom-scrollbar">
            {sortedMediaList.map((item, idx) => {
              const active = idx === currentIndex
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    setCurrentIndex(idx)
                    setProgressPercent(0)
                  }}
                  className={cn(
                    'relative h-9 w-13 rounded-md overflow-hidden shrink-0 border transition-all cursor-pointer',
                    active
                      ? 'border-amber-400 ring-2 ring-amber-400/60 scale-105 opacity-100 shadow-sm'
                      : 'border-white/20 opacity-50 hover:opacity-90 hover:border-white/50'
                  )}
                  title={item.title}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={item.thumbnailUrl || item.url}
                    alt={item.title}
                    className="h-full w-full object-cover"
                  />
                  {item.type === 'video' && (
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                      <Play className="h-2.5 w-2.5 fill-white text-white" />
                    </div>
                  )}
                </button>
              )
            })}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
