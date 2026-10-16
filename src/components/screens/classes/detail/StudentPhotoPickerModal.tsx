'use client'

import React, { useState, useMemo, useEffect } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import {
  Images,
  Check,
  CheckSquare,
  Square,
  Play,
  Eye,
  X,
  ChevronLeft,
  ChevronRight,
  Plus,
} from 'lucide-react'
import { getStudentPhotos, type StudentGalleryPhoto } from '@/mocks/studentPhotos'
import { cn } from '@/lib/utils'

interface StudentPhotoPickerModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  studentId?: string
  studentName?: string
  monthName?: string
  selectedPhotos?: StudentGalleryPhoto[]
  onConfirmPhotos: (photos: StudentGalleryPhoto[]) => void
}

function formatSessionDate(rawDate: string = ''): string {
  if (!rawDate) return ''
  // Bỏ thời gian trong ngoặc đơn (18:00 - 19:30)
  let clean = rawDate.replace(/\s*\([^)]*\)/g, '').trim()
  // Bỏ thông tin giáo viên nếu có dính
  clean = clean.replace(/•\s*GV:.*$/i, '').trim()
  // Bỏ năm dạng /2026 hoặc /2025
  clean = clean.replace(/\/\d{4}/g, '').trim()
  clean = clean.replace(/,\s*$/, '').trim()
  return clean
}

export function StudentPhotoPickerModal({
  open,
  onOpenChange,
  studentId,
  studentName,
  monthName,
  selectedPhotos = [],
  onConfirmPhotos,
}: StudentPhotoPickerModalProps) {
  const allMedia = useMemo(() => getStudentPhotos(studentId), [studentId])
  const [selectedIds, setSelectedIds] = useState<string[]>(() =>
    selectedPhotos.map((p) => p.id)
  )
  const [prevOpen, setPrevOpen] = useState(open)
  const [previewPhoto, setPreviewPhoto] = useState<StudentGalleryPhoto | null>(null)

  // Đồng bộ selectedIds khi mở modal
  if (open !== prevOpen) {
    setPrevOpen(open)
    if (open) {
      setSelectedIds(selectedPhotos.map((p) => p.id))
    }
  }

  // Mặc định lấy theo tháng báo cáo
  const filteredMedia = useMemo(() => {
    if (!monthName) return allMedia
    const norm = monthName.toLowerCase().trim()
    const monthNumMatch = norm.match(/\d+/)
    const monthNum = monthNumMatch ? monthNumMatch[0] : ''
    const matches = allMedia.filter((item) => {
      const itemMonth = (item.month || '').toLowerCase()
      if (monthNum && itemMonth.includes(`tháng ${monthNum}`)) {
        return true
      }
      return itemMonth.includes(norm)
    })
    return matches.length > 0 ? matches : allMedia
  }, [allMedia, monthName])

  // Nhóm theo từng buổi học (Sessions)
  const sessionGroups = useMemo(() => {
    const map = new Map<number, {
      sessionNumber: number
      sessionTitle: string
      sessionDate: string
      items: StudentGalleryPhoto[]
    }>()

    filteredMedia.forEach((item) => {
      const sNum = item.sessionNumber || 1
      if (!map.has(sNum)) {
        map.set(sNum, {
          sessionNumber: sNum,
          sessionTitle: item.sessionTitle || `Buổi học ${sNum}`,
          sessionDate: item.sessionDate || item.date,
          items: [],
        })
      }
      map.get(sNum)!.items.push(item)
    })

    // Sắp xếp buổi học giảm dần (buổi mới nhất lên trên)
    return Array.from(map.values()).sort((a, b) => b.sessionNumber - a.sessionNumber)
  }, [filteredMedia])

  const handleTogglePhoto = (photoId: string) => {
    setSelectedIds((prev) =>
      prev.includes(photoId) ? prev.filter((id) => id !== photoId) : [...prev, photoId]
    )
  }

  const previewIndex = useMemo(() => {
    if (!previewPhoto) return -1
    return filteredMedia.findIndex((p) => p.id === previewPhoto.id)
  }, [previewPhoto, filteredMedia])

  // Điều hướng bằng phím mũi tên khi đang mở modal preview
  useEffect(() => {
    if (!previewPhoto) return
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        const prevIdx = previewIndex > 0 ? previewIndex - 1 : filteredMedia.length - 1
        setPreviewPhoto(filteredMedia[prevIdx])
      } else if (e.key === 'ArrowRight') {
        const nextIdx = previewIndex < filteredMedia.length - 1 ? previewIndex + 1 : 0
        setPreviewPhoto(filteredMedia[nextIdx])
      } else if (e.key === 'Escape') {
        setPreviewPhoto(null)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [previewPhoto, previewIndex, filteredMedia])

  const handleToggleSession = (sessionItems: StudentGalleryPhoto[]) => {
    const sessionIds = sessionItems.map((i) => i.id)
    const isAllSessionSelected = sessionIds.every((id) => selectedIds.includes(id))

    if (isAllSessionSelected) {
      setSelectedIds((prev) => prev.filter((id) => !sessionIds.includes(id)))
    } else {
      setSelectedIds((prev) => Array.from(new Set([...prev, ...sessionIds])))
    }
  }

  const handleSelectAllCurrentFilter = () => {
    const currentIds = filteredMedia.map((p) => p.id)
    const isAllSelected = currentIds.every((id) => selectedIds.includes(id))

    if (isAllSelected) {
      setSelectedIds((prev) => prev.filter((id) => !currentIds.includes(id)))
    } else {
      setSelectedIds((prev) => Array.from(new Set([...prev, ...currentIds])))
    }
  }

  const handleConfirm = () => {
    const chosenPhotos = allMedia.filter((p) => selectedIds.includes(p.id))
    onConfirmPhotos(chosenPhotos)
    onOpenChange(false)
  }

  const isAllCurrentSelected =
    filteredMedia.length > 0 && filteredMedia.every((p) => selectedIds.includes(p.id))

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="sm:max-w-2xl md:max-w-2xl w-[92vw] max-w-2xl h-[88vh] max-h-[88vh] p-0 gap-0 flex flex-col overflow-hidden rounded-2xl border bg-background shadow-2xl"
      >
        {/* ── HEADER MODAL THU HẸP: BUTTONS & SELECT ALL ĐƯỢC ĐƯA LÊN HEADER ── */}
        <DialogHeader className="px-4 py-2 sm:py-2.5 border-b bg-muted/20 flex flex-row items-center justify-between shrink-0 space-y-0 gap-2">
          <div className="flex items-center gap-2 min-w-0 pr-2">
            <Images className="h-4 w-4 text-primary shrink-0" />
            <DialogTitle className="text-xs sm:text-sm font-semibold text-foreground truncate flex items-center gap-1.5">
              <span>Thư viện ảnh & video học viên</span>
              {studentName && (
                <span className="font-normal text-muted-foreground truncate">
                  • {studentName}
                </span>
              )}
            </DialogTitle>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            {/* Chọn tất cả */}
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleSelectAllCurrentFilter}
              className="h-7 px-2 text-xs font-normal text-muted-foreground hover:text-foreground cursor-pointer flex items-center gap-1.5"
            >
              {isAllCurrentSelected ? (
                <>
                  <CheckSquare className="h-3.5 w-3.5 text-primary" />
                  <span>Bỏ chọn tất cả ({filteredMedia.length})</span>
                </>
              ) : (
                <>
                  <Square className="h-3.5 w-3.5" />
                  <span>Chọn tất cả ({filteredMedia.length})</span>
                </>
              )}
            </Button>

            {/* Nút Xác nhận đặt ngay sau Chọn tất cả */}
            <Button
              type="button"
              size="sm"
              onClick={handleConfirm}
              className="h-7 px-3 text-xs font-semibold bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg shadow-xs cursor-pointer flex items-center gap-1.5"
            >
              <Check className="h-3.5 w-3.5" />
              <span>Xác nhận ({selectedIds.length})</span>
            </Button>

            {/* Nút Đóng X */}
            <button
              type="button"
              onClick={() => onOpenChange(false)}
              className="h-7 w-7 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted/80 flex items-center justify-center transition-colors cursor-pointer ml-0.5"
              title="Đóng"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </DialogHeader>

        {/* ── DANH SÁCH LIỆT KÊ TỪNG BUỔI (GỌN GÀNG, PADDING & GAP NHỎ) ── */}
        <div className="flex-1 min-h-0 overflow-y-auto px-4 py-3 space-y-3.5 custom-scrollbar">
          {sessionGroups.length === 0 ? (
            <div className="py-20 text-center text-muted-foreground text-xs italic">
              Không có hình ảnh hoặc video nào trong kỳ học này.
            </div>
          ) : (
            sessionGroups.map((group) => {
              const cleanDate = formatSessionDate(group.sessionDate)
              const sessionIds = group.items.map((i) => i.id)
              const isSessionAllSelected = sessionIds.every((id) => selectedIds.includes(id))

              return (
                <div key={group.sessionNumber} className="space-y-1.5">
                  {/* Header của từng buổi học: KHÔNG in đậm, BỎ đường line ở dưới */}
                  <div className="flex items-center justify-between gap-2">
                    <div className="text-xs font-normal text-muted-foreground truncate">
                      <span className="text-foreground/85">{cleanDate ? `${cleanDate}: ` : ''}</span>
                      <span>{group.sessionTitle}</span>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleToggleSession(group.items)}
                      className="text-xs font-normal text-primary hover:underline cursor-pointer shrink-0"
                    >
                      {isSessionAllSelected ? 'Bỏ chọn buổi' : 'Chọn cả buổi'}
                    </button>
                  </div>

                  {/* Lưới các thẻ Media nhỏ gọn hơn ~20% */}
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                    {group.items.map((item) => {
                      const isSelected = selectedIds.includes(item.id)
                      const isVideo = item.type === 'video'

                      return (
                        <div
                          key={item.id}
                          onClick={() => handleTogglePhoto(item.id)}
                          className={cn(
                            'group/card relative aspect-[16/10] rounded-lg border overflow-hidden transition-all bg-zinc-900 cursor-pointer shadow-2xs select-none',
                            isSelected
                              ? 'border-sky-500 ring-2 ring-sky-500/40'
                              : 'border-border/60 hover:border-border hover:shadow-xs'
                          )}
                        >
                          {/* Image / Video Poster */}
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={item.thumbnailUrl || item.url}
                            alt={item.title}
                            className="h-full w-full object-cover transition-transform duration-300 group-hover/card:scale-105"
                          />

                          {/* Top Bar Overlay */}
                          <div className="absolute inset-x-0 top-0 p-1.5 bg-gradient-to-b from-black/80 via-black/40 to-transparent flex items-center justify-between gap-1 z-20 pointer-events-none">
                            {/* Checkbox Tick + Tên ảnh */}
                            <div className="flex items-center gap-1 min-w-0 pointer-events-auto">
                              <div
                                className={cn(
                                  'h-3.5 w-3.5 rounded flex items-center justify-center transition-all shadow-xs shrink-0',
                                  isSelected
                                    ? 'bg-sky-500 text-white'
                                    : 'bg-black/50 text-white/70 border border-white/30 backdrop-blur-xs group-hover/card:border-white'
                                )}
                              >
                                <Check
                                  className={cn(
                                    'h-2.5 w-2.5 stroke-[3] transition-opacity',
                                    isSelected ? 'opacity-100' : 'opacity-0 group-hover/card:opacity-40'
                                  )}
                                />
                              </div>
                              <span
                                className="text-[10px] font-normal text-white truncate drop-shadow-xs max-w-[75px] sm:max-w-[90px]"
                                title={item.name || item.title}
                              >
                                {item.name || item.title}
                              </span>
                            </div>

                            {/* Type Badge (ẢNH / VIDEO) */}
                            <div className="pointer-events-auto shrink-0 flex items-center">
                              <span className="px-1 py-0.25 rounded bg-black/70 backdrop-blur-xs text-[7.5px] font-bold text-white border border-white/10 uppercase tracking-wider">
                                {isVideo ? 'VIDEO' : 'ẢNH'}
                              </span>
                            </div>
                          </div>

                          {/* Center Play Icon nếu là Video */}
                          {isVideo && (
                            <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  setPreviewPhoto(item)
                                }}
                                className="h-6 w-6 rounded-full bg-black/70 hover:bg-primary backdrop-blur-xs flex items-center justify-center text-white border border-white/25 shadow-md group-hover/card:scale-110 transition-all cursor-pointer pointer-events-auto"
                                title="Xem video to để quyết định chọn"
                              >
                                <Play className="h-3 w-3 fill-white ml-0.5" />
                              </button>
                            </div>
                          )}

                          {/* Center 'Xem to' Button khi hover dành cho Ảnh */}
                          {!isVideo && (
                            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/card:opacity-100 transition-opacity z-10 pointer-events-none">
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  setPreviewPhoto(item)
                                }}
                                className="px-2 py-0.5 rounded-full bg-black/75 hover:bg-black text-white text-[9.5px] font-medium backdrop-blur-md border border-white/30 shadow-md flex items-center gap-1 pointer-events-auto cursor-pointer transition-transform active:scale-95"
                                title="Xem ảnh to để quyết định chọn"
                              >
                                <Eye className="h-2.5 w-2.5" />
                                <span>Xem to</span>
                              </button>
                            </div>
                          )}

                          {/* Bottom Overlay: Dành cho cả lớp hoặc Thời lượng Video */}
                          {(item.isClassWide || (isVideo && item.duration)) && (
                            <div className="absolute inset-x-0 bottom-0 p-1 bg-gradient-to-t from-black/75 to-transparent flex items-center justify-between text-[8.5px] text-zinc-300 z-20 pointer-events-none">
                              {item.isClassWide ? (
                                <span className="inline-flex items-center gap-0.5 px-1 py-0.25 rounded bg-black/60 backdrop-blur-xs text-[8.5px] font-normal text-emerald-300 border border-emerald-500/20">
                                  Dành cho cả lớp
                                </span>
                              ) : (
                                <span />
                              )}
                              {isVideo && item.duration && (
                                <span className="px-1 py-0.25 rounded bg-black/60 backdrop-blur-xs text-[8.5px] text-zinc-300 font-mono">
                                  {item.duration}
                                </span>
                              )}
                            </div>
                          )}
                        </div>
                      )
                    })}
                  </div>
                </div>
              )
            })
          )}
        </div>
      </DialogContent>
    </Dialog>

      {/* ── PREVIEW MODAL: XEM ẢNH/VIDEO TO ĐỂ QUYẾT ĐỊNH CHỌN ── */}
      {previewPhoto && (
        <Dialog open={Boolean(previewPhoto)} onOpenChange={(open) => !open && setPreviewPhoto(null)}>
          <DialogContent
            className="w-full sm:max-w-3xl lg:max-w-4xl max-w-[90vw] aspect-video max-h-[80vh] p-0 bg-transparent border-none text-white rounded-xl overflow-hidden z-[10000] shadow-2xl [&>button]:hidden flex items-center justify-center select-none"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Standard 16:9 Media Preview Frame */}
            <div className="relative w-full h-full aspect-video rounded-xl overflow-hidden shadow-2xl bg-zinc-950 flex items-center justify-center border border-white/15 group">
              {/* Header Bar Overlay with Semi-Transparent Backdrop */}
              <div className="absolute top-0 inset-x-0 bg-gradient-to-b from-black/90 via-black/60 to-transparent p-3 sm:p-4 pb-8 z-20 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2 min-w-0 pr-2">
                  <span className="shrink-0 px-2 py-0.5 rounded-md bg-white/20 text-xs font-bold tracking-wider uppercase text-white backdrop-blur-xs border border-white/10">
                    {previewPhoto.type === 'video' ? 'Video' : 'Ảnh'} {previewIndex >= 0 ? `${previewIndex + 1}/${filteredMedia.length}` : ''}
                  </span>
                  <DialogTitle className="font-bold text-sm sm:text-base truncate text-white drop-shadow-xs flex items-center gap-1.5">
                    {(() => {
                      const cleanDate = formatSessionDate(previewPhoto.sessionDate || previewPhoto.date)
                      return (
                        <>
                          {cleanDate && <span className="text-white/80 font-normal">{cleanDate} •</span>}
                          <span className="truncate">{previewPhoto.title || previewPhoto.name}</span>
                        </>
                      )
                    })()}
                  </DialogTitle>
                </div>

                {/* Actions: Nút chọn/bỏ chọn ảnh & Nút đóng X */}
                <div className="flex items-center gap-2 shrink-0">
                  <Button
                    type="button"
                    size="sm"
                    onClick={() => handleTogglePhoto(previewPhoto.id)}
                    className={cn(
                      'h-8 px-3 text-xs font-bold rounded-lg cursor-pointer transition-all gap-1.5 shadow-sm',
                      selectedIds.includes(previewPhoto.id)
                        ? 'bg-emerald-600 hover:bg-emerald-700 text-white border border-emerald-500/40'
                        : 'bg-primary hover:bg-primary/90 text-primary-foreground'
                    )}
                  >
                    {selectedIds.includes(previewPhoto.id) ? (
                      <>
                        <Check className="h-3.5 w-3.5 stroke-[3]" />
                        <span>Đã chọn</span>
                      </>
                    ) : (
                      <>
                        <Plus className="h-3.5 w-3.5 stroke-[2.5]" />
                        <span>{previewPhoto.type === 'video' ? 'Chọn video' : 'Chọn ảnh'}</span>
                      </>
                    )}
                  </Button>

                  <button
                    type="button"
                    onClick={() => setPreviewPhoto(null)}
                    className="h-8 w-8 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-md text-white flex items-center justify-center transition-colors border border-white/20 shrink-0 cursor-pointer"
                    title="Đóng preview"
                  >
                    <X className="h-4 w-4 stroke-[2.5]" />
                  </button>
                </div>
              </div>

              {/* Navigation Arrows: Nút chuyển ảnh trước/sau nổi nhẹ bên trong khung media */}
              {filteredMedia.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation()
                      const prevIdx = previewIndex > 0 ? previewIndex - 1 : filteredMedia.length - 1
                      setPreviewPhoto(filteredMedia[prevIdx])
                    }}
                    className="absolute left-3 z-30 h-9 w-9 rounded-full bg-black/40 hover:bg-black/70 text-white/80 hover:text-white backdrop-blur-md flex items-center justify-center border border-white/15 shadow-md cursor-pointer transition-all active:scale-95"
                    title="Tệp trước đó (←)"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation()
                      const nextIdx = previewIndex < filteredMedia.length - 1 ? previewIndex + 1 : 0
                      setPreviewPhoto(filteredMedia[nextIdx])
                    }}
                    className="absolute right-3 z-30 h-9 w-9 rounded-full bg-black/40 hover:bg-black/70 text-white/80 hover:text-white backdrop-blur-md flex items-center justify-center border border-white/15 shadow-md cursor-pointer transition-all active:scale-95"
                    title="Tệp tiếp theo (→)"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </>
              )}

              {/* Main Media Content */}
              {previewPhoto.type === 'video' ? (
                <div className="relative w-full h-full bg-black flex items-center justify-center overflow-hidden">
                  <video
                    key={previewPhoto.url}
                    src={previewPhoto.url}
                    poster={previewPhoto.thumbnailUrl || previewPhoto.url}
                    controls
                    autoPlay
                    playsInline
                    className="w-full h-full object-contain"
                  />
                </div>
              ) : (
                <div className="relative w-full h-full bg-zinc-950 flex items-center justify-center overflow-hidden">
                  {/* Subtle ambient blurred background glow */}
                  <div
                    className="absolute inset-0 bg-cover bg-center filter blur-2xl opacity-25 scale-110 pointer-events-none"
                    style={{ backgroundImage: `url(${previewPhoto.thumbnailUrl || previewPhoto.url})` }}
                    aria-hidden="true"
                  />
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={previewPhoto.url || previewPhoto.thumbnailUrl}
                    alt={previewPhoto.title || previewPhoto.name}
                    className="relative z-10 max-w-full max-h-full object-contain block transition-transform duration-300"
                  />
                </div>
              )}

              {/* Bottom Caption Overlay: Gọn gàng, tinh tế, không chiếm diện tích màn hình */}
              {previewPhoto.sessionTitle && (
                <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-3 pt-6 z-20 flex items-center justify-between text-xs text-white/70 pointer-events-none">
                  <span className="truncate">{previewPhoto.sessionTitle}</span>
                  {previewPhoto.duration && <span className="shrink-0">{previewPhoto.duration}</span>}
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      )}
    </>
  )
}
