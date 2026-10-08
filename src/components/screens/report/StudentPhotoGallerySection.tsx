'use client'

import React, { useState, useEffect, useCallback } from 'react'
import {
  ChevronLeft,
  ChevronRight,
  X,
  Download,
  Maximize2,
  Play,
  Images,
  Share2,
} from 'lucide-react'
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { getStudentPhotos, type StudentGalleryPhoto } from '@/mocks/studentPhotos'

interface StudentPhotoGallerySectionProps {
  studentId?: string
  studentName?: string
  initialPhotos?: StudentGalleryPhoto[]
  className?: string
}

function formatLightboxDate(rawDate: string = ''): string {
  if (!rawDate) return ''
  let clean = rawDate.replace(/\s*\([^)]*\)/g, '').trim()
  clean = clean.replace(/•\s*GV:.*$/i, '').trim()
  clean = clean.replace(/GV:.*$/i, '').trim()
  clean = clean.replace(/\/\d{4}/g, '').trim()
  clean = clean.replace(/,\s*$/, '').trim()
  return clean
}

export function StudentPhotoGallerySection({
  studentId,
  initialPhotos,
  className = '',
}: StudentPhotoGallerySectionProps) {
  const mediaList =
    initialPhotos && initialPhotos.length > 0
      ? initialPhotos
      : getStudentPhotos(studentId)
  const [lightboxOpen, setLightboxOpen] = useState<boolean>(false)
  const [currentIndex, setCurrentIndex] = useState<number>(0)

  const openLightboxAt = (index: number) => {
    setCurrentIndex(index)
    setLightboxOpen(true)
  }

  const handlePrev = useCallback(() => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : mediaList.length - 1))
  }, [mediaList.length])

  const handleNext = useCallback(() => {
    setCurrentIndex((prev) => (prev < mediaList.length - 1 ? prev + 1 : 0))
  }, [mediaList.length])

  // Keyboard navigation (Mũi tên Trái / Phải, Escape)
  useEffect(() => {
    if (!lightboxOpen) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') handlePrev()
      else if (e.key === 'ArrowRight') handleNext()
      else if (e.key === 'Escape') setLightboxOpen(false)
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [lightboxOpen, handlePrev, handleNext])

  const handleDownloadAll = () => {
    toast.success(`Đang tải toàn bộ ${mediaList.length} ảnh & video của con...`)
  }

  const handleDownloadCurrent = (item: StudentGalleryPhoto) => {
    const link = document.createElement('a')
    link.href = item.url
    link.download = item.name || `${item.title}.jpg`
    link.target = '_blank'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    toast.success(`Đang tải "${item.title}"...`)
  }

  if (mediaList.length === 0) return null

  const currentMedia = mediaList[currentIndex] || mediaList[0]
  const previewList = mediaList.slice(0, 6)

  return (
    <div className={`rounded-xl bg-card border border-border/80 p-3 sm:p-3.5 shadow-2xs space-y-2.5 ${className}`}>
      {/* ── HEADER: Rút gọn tối đa, bỏ icon, bỏ subtitle, bỏ badge đếm, đưa nút Tải toàn bộ sang phải ── */}
      <div className="flex items-center justify-between gap-2 pb-1 border-b border-border/40">
        <h3 className="text-xs font-semibold text-foreground tracking-tight">
          Khoảnh khắc học tập
        </h3>

        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={handleDownloadAll}
          className="h-6.5 px-2 text-xs font-semibold text-primary hover:text-primary/90 hover:bg-primary/10 rounded-md gap-1.5 cursor-pointer"
          title="Tải toàn bộ hình ảnh và video của con"
        >
          <Download className="h-3.5 w-3.5" />
          <span>Tải toàn bộ</span>
        </Button>
      </div>

      {/* ── GRID THUMBNAIL XEM TRƯỚC (6 Ô: ẢNH VÀ VIDEO) ── */}
      <div className="grid grid-cols-3 gap-1.5">
        {previewList.map((item, idx) => {
          const isLastAndMore = idx === 5 && mediaList.length > 6
          const extraCount = mediaList.length - 6
          const isVideo = item.type === 'video'

          return (
            <div
              key={item.id}
              onClick={() => openLightboxAt(idx)}
              className="group relative aspect-square rounded-lg overflow-hidden bg-muted/40 border border-border/50 hover:border-primary/80 transition-all cursor-pointer shadow-3xs"
              title={item.title}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={item.thumbnailUrl || item.url}
                alt={item.title}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              />

              {/* Badge Video hoặc Ảnh */}
              <div className="absolute top-1 right-1 z-10">
                <span className="px-1 py-0.5 rounded bg-black/70 backdrop-blur-xs text-[9.5px] font-bold text-white uppercase tracking-wider">
                  {isVideo ? 'VIDEO' : 'ẢNH'}
                </span>
              </div>

              {/* Center Play Icon nếu là Video */}
              {isVideo && !isLastAndMore && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="h-6 w-6 rounded-full bg-black/60 backdrop-blur-xs flex items-center justify-center text-white border border-white/20 shadow-sm transition-transform group-hover:scale-110">
                    <Play className="h-3 w-3 fill-white ml-0.5" />
                  </div>
                </div>
              )}

              {/* Nếu là ô thứ 6 và còn ảnh/video nữa */}
              {isLastAndMore ? (
                <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px] flex flex-col items-center justify-center text-white font-black text-xs z-20">
                  <span>+{extraCount}</span>
                  <span className="text-[9px] font-medium text-white/80">khoảnh khắc</span>
                </div>
              ) : (
                <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                  <Maximize2 className="h-3.5 w-3.5 drop-shadow-xs" />
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* ── NÚT XEM TẤT CẢ ── */}
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() => openLightboxAt(0)}
        className="w-full h-7.5 text-xs font-semibold rounded-lg border-border/80 hover:bg-muted text-foreground gap-1.5 cursor-pointer transition-all active:scale-98"
      >
        <Images className="h-3.5 w-3.5 text-primary" />
        <span>Xem toàn bộ {mediaList.length} ảnh & video của con</span>
      </Button>

      {/* ── LIGHTBOX VIEWER DIALOG (HỖ TRỢ CẢ VIDEO VÀ ẢNH) ── */}
      <Dialog open={lightboxOpen} onOpenChange={setLightboxOpen}>
        <DialogContent
          className="w-[94vw] sm:max-w-2xl md:max-w-3xl lg:max-w-4xl max-h-[90vh] p-0 bg-zinc-950 border border-white/15 text-white rounded-xl overflow-hidden z-[9999] shadow-2xl flex flex-col [&>button]:hidden select-none"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Top Bar của Lightbox - Gọn gàng, thanh lịch */}
          <div className="px-3.5 sm:px-4 py-2 border-b border-white/10 bg-black/60 flex items-center justify-between gap-3 shrink-0">
            <div className="min-w-0 flex items-center gap-2.5">
              <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-primary/20 text-primary border border-primary/30 shrink-0">
                {currentMedia.type === 'video' ? 'Video' : 'Ảnh'} {currentIndex + 1} / {mediaList.length}
              </span>
              <DialogTitle className="text-xs sm:text-sm font-semibold text-white truncate drop-shadow-xs flex items-center gap-1.5">
                {(() => {
                  const cleanDate = formatLightboxDate(currentMedia.sessionDate || currentMedia.date)
                  return (
                    <>
                      {cleanDate && <span className="text-white/70 font-normal">{cleanDate} •</span>}
                      <span>{currentMedia.title}</span>
                    </>
                  )
                })()}
              </DialogTitle>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => {
                  navigator.clipboard.writeText(currentMedia.url)
                  toast.success('Đã sao chép liên kết tệp!')
                }}
                className="h-7.5 px-2.5 text-xs font-normal text-white/80 hover:text-white hover:bg-white/10 rounded-lg gap-1.5 cursor-pointer hidden sm:inline-flex border border-white/15"
                title="Chia sẻ liên kết tệp này"
              >
                <Share2 className="h-3.5 w-3.5" />
                <span>Chia sẻ link</span>
              </Button>

              <Button
                type="button"
                size="sm"
                onClick={() => handleDownloadCurrent(currentMedia)}
                className="h-7.5 px-3 text-xs font-medium bg-sky-600 hover:bg-sky-500 text-white rounded-lg gap-1.5 cursor-pointer shadow-xs"
                title="Tải tệp này về máy"
              >
                <Download className="h-3.5 w-3.5" />
                <span>Tải về tệp</span>
              </Button>

              <button
                type="button"
                onClick={() => setLightboxOpen(false)}
                className="h-7.5 w-7.5 rounded-lg bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
                title="Đóng (Escape)"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Vùng hiển thị Media chính (Ảnh hoặc Video) căn chỉnh tỷ lệ chuẩn - Bỏ khoảng cách thừa */}
          <div className="relative flex-1 min-h-[280px] max-h-[72vh] flex items-center justify-center p-0 sm:p-1 bg-black overflow-hidden">
            {/* Nút lùi ảnh (Prev) */}
            <button
              type="button"
              onClick={handlePrev}
              className="absolute left-2.5 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-black/60 hover:bg-black/90 text-white flex items-center justify-center border border-white/20 backdrop-blur-md transition-all cursor-pointer z-30 shadow-md hover:scale-105 active:scale-95"
              title="Ảnh trước (Mũi tên trái)"
            >
              <ChevronLeft className="h-4.5 w-4.5" />
            </button>

            {/* Khung nội dung hiển thị Media (Video hoặc Ảnh) */}
            <div className="relative h-full w-full flex items-center justify-center">
              {currentMedia.type === 'video' ? (
                <video
                  key={currentMedia.url}
                  src={currentMedia.url}
                  poster={currentMedia.thumbnailUrl}
                  controls
                  autoPlay
                  className="w-full max-h-[70vh] aspect-video object-contain shadow-2xl focus:outline-none bg-black"
                />
              ) : (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  key={currentMedia.url}
                  src={currentMedia.url}
                  alt={currentMedia.title}
                  className="max-h-[70vh] max-w-full w-auto h-auto object-contain shadow-2xl transition-all duration-200"
                />
              )}
            </div>

            {/* Nút tiến ảnh (Next) */}
            <button
              type="button"
              onClick={handleNext}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-black/60 hover:bg-black/90 text-white flex items-center justify-center border border-white/20 backdrop-blur-md transition-all cursor-pointer z-30 shadow-md hover:scale-105 active:scale-95"
              title="Ảnh sau (Mũi tên phải)"
            >
              <ChevronRight className="h-4.5 w-4.5" />
            </button>
          </div>

          {/* Dải điều hướng thumbnail dưới đáy */}
          <div className="px-4 py-2 border-t border-white/10 bg-black/70 flex items-center justify-center shrink-0">
            <div className="flex items-center gap-1.5 overflow-x-auto max-w-full py-0.5 custom-scrollbar">
              {mediaList.map((photo, idx) => (
                <button
                  key={photo.id}
                  type="button"
                  onClick={() => setCurrentIndex(idx)}
                  className={`relative h-9 w-12 rounded-md overflow-hidden shrink-0 border transition-all cursor-pointer ${
                    idx === currentIndex
                      ? 'border-primary ring-2 ring-primary/60 scale-105 opacity-100 shadow-sm'
                      : 'border-white/20 opacity-50 hover:opacity-90 hover:border-white/50'
                  }`}
                  title={`${photo.title} (Bấm để xem)`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={photo.thumbnailUrl || photo.url}
                    alt={photo.title}
                    className="h-full w-full object-cover"
                  />
                  {photo.type === 'video' && (
                    <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                      <Play className="h-2.5 w-2.5 fill-white text-white" />
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
