'use client'

import React, { useState } from 'react'
import { Plus, X, Play, Download, ChevronLeft, ChevronRight, Share2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog'
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
    <div className={`space-y-4 pt-4 border-t border-border/70 ${className}`}>
      {/* ── HEADER BAR ── */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div>
          <h4 className="text-sm font-extrabold text-foreground uppercase tracking-wide flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-amber-500 inline-block" />
            <span>
              HÌNH ẢNH & VIDEO HOẠT ĐỘNG TRONG THÁNG {monthName ? monthName.toUpperCase() : ''}
            </span>
          </h4>
        </div>

        {!readOnly && (
          <Button
            type="button"
            size="sm"
            onClick={() => setPickerOpen(true)}
            className="h-8 text-xs font-bold gap-1.5 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground shadow-2xs cursor-pointer transition-all active:scale-95"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Chọn từ thư viện ({photos.length})</span>
          </Button>
        )}
      </div>

      {/* ── BODY: DANH SÁCH MEDIA NHỎ GỌN, TÊN ĐÈ LÊN ẢNH (IMAGE 3 REFERENCE) ── */}
      {photos.length === 0 ? (
        <div className="p-7 text-center rounded-2xl border-2 border-dashed border-border/80 bg-muted/10 space-y-2.5">
          <p className="text-xs font-bold text-foreground">Chưa có hình ảnh hoặc video hoạt động nào</p>
          <p className="text-[11px] text-muted-foreground">
            Đính kèm các khoảnh khắc con tích cực tham gia hoạt động lớp để phụ huynh cùng theo dõi.
          </p>
          {!readOnly && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setPickerOpen(true)}
              className="text-xs font-bold gap-1.5 rounded-xl cursor-pointer border-primary/40 text-primary hover:bg-primary/5 mt-1"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Mở thư viện ảnh & video của con</span>
            </Button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {photos.map((item, idx) => {
            const isVideo = item.type === 'video'

            return (
              <div
                key={item.id}
                onClick={() => setPreviewIndex(idx)}
                className="group/card relative aspect-[16/10] rounded-2xl border border-border/70 overflow-hidden bg-zinc-900 hover:border-primary/70 transition-all shadow-2xs cursor-pointer select-none"
              >
                {/* Image / Video Thumbnail */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={item.thumbnailUrl || item.url}
                  alt={item.title}
                  className="h-full w-full object-cover transition-transform duration-300 group-hover/card:scale-105"
                />

                {/* Top Overlay: Nút gỡ (Trái) & Badge Type (Phải) */}
                <div className="absolute inset-x-0 top-0 p-2 bg-gradient-to-b from-black/80 via-black/40 to-transparent flex items-center justify-between gap-2 z-20">
                  {/* Nếu đang sửa: Cho phép bấm gỡ */}
                  {!readOnly ? (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleRemovePhoto(item.id)
                      }}
                      className="h-6 w-6 rounded-full bg-black/60 hover:bg-destructive text-white flex items-center justify-center shadow-md transition-colors cursor-pointer"
                      title="Gỡ khỏi báo cáo"
                    >
                      <X className="h-3.5 w-3.5 stroke-[2.5]" />
                    </button>
                  ) : (
                    <span />
                  )}

                  {/* Badge Type */}
                  <span className="px-1.5 py-0.5 rounded-md bg-black/70 backdrop-blur-xs text-[9.5px] font-black text-white border border-white/10 uppercase tracking-wider">
                    {isVideo ? 'VIDEO' : 'ẢNH'}
                  </span>
                </div>

                {/* Center Play Icon nếu là Video */}
                {isVideo && (
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
                    <div className="h-8 w-8 rounded-full bg-black/60 backdrop-blur-xs flex items-center justify-center text-white border border-white/20 shadow-md group-hover/card:scale-110 transition-transform">
                      <Play className="h-4 w-4 fill-white ml-0.5" />
                    </div>
                  </div>
                )}

                {/* Bottom Overlay: Tên đè lên ảnh */}
                <div className="absolute inset-x-0 bottom-0 p-2.5 bg-gradient-to-t from-black/90 via-black/50 to-transparent flex flex-col justify-end text-left z-20 pointer-events-none">
                  <p className="text-xs font-bold text-white truncate drop-shadow-sm" title={item.name || item.title}>
                    {item.name || item.title}
                  </p>
                  <div className="flex items-center gap-1 text-[10.5px] text-zinc-300 font-medium mt-0.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 inline-block shrink-0" />
                    <span className="truncate">
                      {item.isClassWide ? 'Dành cho cả lớp' : studentName || 'Học viên'}
                    </span>
                    {isVideo && item.duration && (
                      <>
                        <span>•</span>
                        <span className="text-[10px] text-zinc-400">{item.duration}</span>
                      </>
                    )}
                  </div>
                </div>
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
            className="sm:max-w-5xl md:max-w-6xl lg:max-w-7xl w-[96vw] max-w-[96vw] h-[90vh] max-h-[90vh] p-0 bg-zinc-950/95 border border-white/15 text-white rounded-3xl overflow-hidden z-[9999] shadow-2xl flex flex-col [&>button]:hidden select-none"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Top Bar chuẩn Image 2 */}
            <div className="px-6 py-3.5 border-b border-white/10 bg-black/40 flex items-center justify-between gap-4 shrink-0">
              <div className="min-w-0 flex items-center gap-3">
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-primary/25 text-primary border border-primary/40 shrink-0">
                  {currentPreview.type === 'video' ? 'Video' : 'Ảnh'} {(previewIndex ?? 0) + 1} / {photos.length}
                </span>
                <DialogTitle className="text-sm sm:text-base font-bold text-white truncate drop-shadow-xs flex items-center gap-2">
                  {(() => {
                    const cleanDate = formatLightboxDate(currentPreview.sessionDate || currentPreview.date)
                    return (
                      <>
                        {cleanDate && <span className="text-white/80 font-normal">{cleanDate} •</span>}
                        <span>{currentPreview.title || currentPreview.name}</span>
                      </>
                    )
                  })()}
                </DialogTitle>
              </div>

              <div className="flex items-center gap-2.5 shrink-0">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    navigator.clipboard.writeText(currentPreview.url)
                    toast.success('Đã sao chép liên kết tệp!')
                  }}
                  className="h-8.5 px-3 text-xs font-medium text-white/85 hover:text-white hover:bg-white/10 rounded-xl gap-1.5 cursor-pointer hidden sm:inline-flex border border-white/15"
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
                  className="h-8.5 px-3.5 text-xs font-semibold bg-sky-600 hover:bg-sky-500 text-white rounded-xl gap-1.5 cursor-pointer shadow-xs"
                  title="Tải tệp này về máy"
                >
                  <Download className="h-3.5 w-3.5" />
                  <span>Tải về tệp</span>
                </Button>

                <button
                  type="button"
                  onClick={() => setPreviewIndex(null)}
                  className="h-8.5 w-8.5 rounded-full bg-white/15 hover:bg-white/30 text-white flex items-center justify-center transition-colors cursor-pointer"
                  title="Đóng (Escape)"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Vùng hiển thị Media chính full kích thước */}
            <div className="relative flex-1 min-h-0 flex items-center justify-center p-3 sm:p-5 bg-black/80 overflow-hidden">
              {/* Nút lùi ảnh (Prev) */}
              <button
                type="button"
                onClick={() =>
                  setPreviewIndex((prev) => (prev !== null && prev > 0 ? prev - 1 : photos.length - 1))
                }
                className="absolute left-4 top-1/2 -translate-y-1/2 h-11 w-11 rounded-full bg-black/60 hover:bg-black/80 text-white flex items-center justify-center border border-white/20 backdrop-blur-md transition-all cursor-pointer z-30 shadow-lg hover:scale-105 active:scale-95"
                title="Ảnh trước"
              >
                <ChevronLeft className="h-6 w-6 stroke-[2.5]" />
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
                    className="max-h-full max-w-full h-full w-auto aspect-video rounded-2xl object-contain shadow-2xl border border-white/10 bg-black"
                  />
                ) : (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img
                    key={currentPreview.url}
                    src={currentPreview.url}
                    alt={currentPreview.title}
                    className="max-h-full max-w-full rounded-2xl object-contain shadow-2xl transition-all duration-200"
                  />
                )}
              </div>

              {/* Nút tiến ảnh (Next) */}
              <button
                type="button"
                onClick={() =>
                  setPreviewIndex((prev) => (prev !== null && prev < photos.length - 1 ? prev + 1 : 0))
                }
                className="absolute right-4 top-1/2 -translate-y-1/2 h-11 w-11 rounded-full bg-black/60 hover:bg-black/80 text-white flex items-center justify-center border border-white/20 backdrop-blur-md transition-all cursor-pointer z-30 shadow-lg hover:scale-105 active:scale-95"
                title="Ảnh sau"
              >
                <ChevronRight className="h-6 w-6 stroke-[2.5]" />
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
