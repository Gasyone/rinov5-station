'use client'

import React, { useState } from 'react'
import { Plus, X, Play, Download, ChevronLeft, ChevronRight, Share2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog'
import { cn } from '@/lib/utils'
import { StudentPhotoPickerModal } from './StudentPhotoPickerModal'
import type { StudentGalleryPhoto } from '@/mocks/studentPhotos'

interface MonthlyReportActivityPhotosSectionProps {
  photos: StudentGalleryPhoto[]
  onChange?: (photos: StudentGalleryPhoto[]) => void
  readOnly?: boolean
  studentId?: string
  studentName?: string
  monthName?: string
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

export function MonthlyReportActivityPhotosSection({
  photos = [],
  onChange,
  readOnly = false,
  studentId,
  studentName,
  monthName,
  className = '',
}: MonthlyReportActivityPhotosSectionProps) {
  const [pickerOpen, setPickerOpen] = useState(false)
  const [previewIndex, setPreviewIndex] = useState<number | null>(null)
  const currentPreview = previewIndex !== null && photos[previewIndex] ? photos[previewIndex] : null

  const handleRemovePhoto = (photoId: string) => {
    if (!onChange) return
    const updated = photos.filter((p) => p.id !== photoId)
    onChange(updated)
    toast.success('Đã gỡ tệp khỏi báo cáo.')
  }

  const handleConfirmPhotos = (newPhotos: StudentGalleryPhoto[]) => {
    if (!onChange) return
    onChange(newPhotos)
    toast.success(`Đã cập nhật ${newPhotos.length} ảnh & video cho báo cáo!`)
  }

  // Ở chế độ read-only, nếu không có ảnh thì ẩn khối để tránh chiếm diện tích
  if (readOnly && photos.length === 0) {
    return null
  }

  return (
    <div className={cn('space-y-1.5', className)}>
      {/* ── HEADER BAR ── */}
      <div className="flex items-center justify-between gap-2">
        <span className="text-xs font-medium text-muted-foreground">
          Khoảnh khắc học tập
        </span>

        {!readOnly && (
          <Button
            type="button"
            size="sm"
            onClick={() => setPickerOpen(true)}
            className="h-6 text-[11px] font-semibold gap-1 px-2 text-sky-600 dark:text-sky-400 bg-transparent border border-transparent hover:border-sky-300 dark:hover:border-sky-700 hover:bg-sky-50 dark:hover:bg-sky-950/40 hover:text-sky-700 dark:hover:text-sky-300 rounded-md cursor-pointer transition-all shadow-none"
            title="Mở thư viện ảnh & video của con để chọn"
          >
            <Plus className="h-3 w-3 text-sky-600 dark:text-sky-400" />
            <span>Chọn ảnh</span>
          </Button>
        )}
      </div>

      {/* ── BODY: DANH SÁCH MEDIA NHỎ GỌN, TÊN ĐÈ LÊN ẢNH ── */}
      {photos.length === 0 ? (
        <div className="p-2.5 sm:p-3 text-center rounded-lg border border-dashed border-border/70 bg-muted/5 space-y-1 select-none">
          <p className="text-xs font-medium text-foreground">Chưa có hình ảnh hoặc video hoạt động nào</p>
          <p className="text-[11px] text-muted-foreground leading-normal">
            Đính kèm khoảnh khắc học tập để gửi cùng báo cáo.
          </p>
          {!readOnly && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setPickerOpen(true)}
              className="h-6.5 text-[11px] font-medium gap-1 rounded-md cursor-pointer border-primary/40 text-primary hover:bg-primary/5 mt-0.5 px-2"
            >
              <Plus className="h-3 w-3" />
              <span>Mở thư viện ảnh của con</span>
            </Button>
          )}
        </div>
      ) : (
        <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 custom-scrollbar">
          {photos.map((item, idx) => {
            const isVideo = item.type === 'video'

            return (
              <div
                key={item.id}
                onClick={() => setPreviewIndex(idx)}
                className="group/card relative w-13 h-13 sm:w-14 sm:h-14 shrink-0 rounded-lg border border-border/70 overflow-hidden bg-zinc-900 hover:border-primary/70 transition-all shadow-3xs cursor-pointer select-none"
                title={item.name || item.title || 'Xem media'}
              >
                {/* Image / Video Thumbnail */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={item.thumbnailUrl || item.url}
                  alt={item.title || ''}
                  className="h-full w-full object-cover transition-transform duration-300 group-hover/card:scale-105"
                />

                {/* Center Play Icon nếu là Video */}
                {isVideo && (
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
                    <div className="h-5 w-5 rounded-full bg-black/60 flex items-center justify-center text-white shadow-2xs">
                      <Play className="h-2.5 w-2.5 fill-white ml-0.5" />
                    </div>
                  </div>
                )}

                {/* Nút X: Bỏ nền, chỉ icon X khi đang sửa */}
                {!readOnly && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleRemovePhoto(item.id)
                    }}
                    className="absolute top-0.5 right-0.5 p-0.5 text-white/90 hover:text-red-400 drop-shadow-md transition-colors cursor-pointer z-20"
                    title="Gỡ khỏi báo cáo"
                  >
                    <X className="h-3.5 w-3.5 stroke-[2.5]" />
                  </button>
                )}
              </div>
            )
          })}
        </div>
      )}

      {/* ── MODAL CHỌN ẢNH TỪ THƯ VIỆN HỌC VIÊN ── */}
      {pickerOpen && (
        <StudentPhotoPickerModal
          open={pickerOpen}
          onOpenChange={setPickerOpen}
          studentId={studentId}
          studentName={studentName}
          monthName={monthName}
          selectedPhotos={photos}
          onConfirmPhotos={handleConfirmPhotos}
        />
      )}

      {/* ── PREVIEW MEDIA MODAL (HỖ TRỢ CẢ VIDEO & ẢNH, FULL RỘNG VÀ DẢI ẢNH CHỌN) ── */}
      {currentPreview && (
        <Dialog open={Boolean(currentPreview)} onOpenChange={(open) => !open && setPreviewIndex(null)}>
          <DialogContent
            className="w-[94vw] sm:max-w-2xl md:max-w-3xl lg:max-w-4xl max-h-[90vh] p-0 bg-zinc-950 border border-white/15 text-white rounded-xl overflow-hidden z-[9999] shadow-2xl flex flex-col [&>button]:hidden select-none"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Top Bar chuẩn Image 2 */}
            <div className="px-3.5 sm:px-4 py-2 border-b border-white/10 bg-black/60 flex items-center justify-between gap-3 shrink-0">
              <div className="min-w-0 flex items-center gap-2.5">
                <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-primary/20 text-primary border border-primary/30 shrink-0">
                  {currentPreview.type === 'video' ? 'Video' : 'Ảnh'} {(previewIndex ?? 0) + 1} / {photos.length}
                </span>
                <DialogTitle className="text-xs sm:text-sm font-semibold text-white truncate drop-shadow-xs flex items-center gap-1.5">
                  {(() => {
                    const cleanDate = formatLightboxDate(currentPreview.sessionDate || currentPreview.date)
                    return (
                      <>
                        {cleanDate && <span className="text-white/70 font-normal">{cleanDate} •</span>}
                        <span>{currentPreview.title || currentPreview.name}</span>
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
                    navigator.clipboard.writeText(currentPreview.url)
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
                  onClick={() => {
                    const link = document.createElement('a')
                    link.href = currentPreview.url
                    link.download = currentPreview.name || 'media'
                    link.target = '_blank'
                    document.body.appendChild(link)
                    link.click()
                    document.body.removeChild(link)
                    toast.success('Đang tải xuống...')
                  }}
                  className="h-7.5 px-3 text-xs font-medium bg-sky-600 hover:bg-sky-500 text-white rounded-lg gap-1.5 cursor-pointer shadow-xs"
                  title="Tải tệp này về máy"
                >
                  <Download className="h-3.5 w-3.5" />
                  <span>Tải về tệp</span>
                </Button>

                <button
                  type="button"
                  onClick={() => setPreviewIndex(null)}
                  className="h-7.5 w-7.5 rounded-lg bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
                  title="Đóng (Escape)"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Vùng hiển thị Media chính full kích thước - Bỏ khoảng cách thừa */}
            <div className="relative flex-1 min-h-[280px] max-h-[72vh] flex items-center justify-center p-0 sm:p-1 bg-black overflow-hidden">
              {/* Nút lùi ảnh (Prev) */}
              <button
                type="button"
                onClick={() =>
                  setPreviewIndex((prev) => (prev !== null && prev > 0 ? prev - 1 : photos.length - 1))
                }
                className="absolute left-2.5 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-black/60 hover:bg-black/90 text-white flex items-center justify-center border border-white/20 backdrop-blur-md transition-all cursor-pointer z-30 shadow-md hover:scale-105 active:scale-95"
                title="Ảnh trước (Mũi tên trái)"
              >
                <ChevronLeft className="h-4.5 w-4.5" />
              </button>

            {/* Khung nội dung hiển thị Media (Video hoặc Ảnh) */}
            <div className="relative h-full w-full flex items-center justify-center">
              {currentPreview.type === 'video' ? (
                <video
                  key={currentPreview.url}
                  src={currentPreview.url}
                  poster={currentPreview.thumbnailUrl}
                  controls
                  autoPlay
                  className="w-full max-h-[70vh] aspect-video object-contain shadow-2xl focus:outline-none bg-black"
                />
              ) : (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  key={currentPreview.url}
                  src={currentPreview.url}
                  alt={currentPreview.title}
                  className="max-h-[70vh] max-w-full w-auto h-auto object-contain shadow-2xl transition-all duration-200"
                />
              )}
            </div>

            {/* Nút tiến ảnh (Next) */}
            <button
              type="button"
              onClick={() =>
                setPreviewIndex((prev) => (prev !== null && prev < photos.length - 1 ? prev + 1 : 0))
              }
              className="absolute right-2.5 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-black/60 hover:bg-black/90 text-white flex items-center justify-center border border-white/20 backdrop-blur-md transition-all cursor-pointer z-30 shadow-md hover:scale-105 active:scale-95"
              title="Ảnh sau (Mũi tên phải)"
            >
              <ChevronRight className="h-4.5 w-4.5" />
            </button>
          </div>

            {/* Dải điều hướng thumbnail dưới đáy (Tập trung căn giữa, đã xóa tên học viên và tên buổi trùng lặp) */}
            <div className="px-6 py-3 border-t border-white/10 bg-black/50 flex items-center justify-center shrink-0">
              {/* Danh sách ảnh ở dưới với cơ chế chọn xem & chuyển ảnh */}
              <div className="flex items-center gap-2 overflow-x-auto max-w-full py-1 custom-scrollbar">
                {photos.map((photo, idx) => (
                  <button
                    key={photo.id}
                    type="button"
                    onClick={() => setPreviewIndex(idx)}
                    className={`relative h-11 w-14 rounded-xl overflow-hidden shrink-0 border-2 transition-all cursor-pointer ${
                      idx === previewIndex
                        ? 'border-primary ring-2 ring-primary/60 scale-105 opacity-100 shadow-md'
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
                        <Play className="h-3 w-3 fill-white text-white" />
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
