'use client'

import React, { useState, useMemo } from 'react'
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
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-3xl md:max-w-4xl w-[90vw] max-w-4xl h-[82vh] max-h-[82vh] p-0 flex flex-col overflow-hidden rounded-3xl border bg-background shadow-2xl">
        {/* ── HEADER MODAL ── */}
        <DialogHeader className="px-5 py-3 border-b bg-muted/20 flex flex-row items-center justify-between shrink-0">
          <div className="space-y-0.5">
            <DialogTitle className="text-sm sm:text-base font-bold text-foreground flex items-center gap-2">
              <Images className="h-4 w-4 text-primary" />
              <span>Thư viện ảnh & video học viên</span>
              {studentName && (
                <span className="text-xs sm:text-sm font-medium text-muted-foreground">
                  • {studentName}
                </span>
              )}
            </DialogTitle>
            <p className="text-xs text-muted-foreground font-normal">
              Hiển thị <strong className="text-foreground font-medium">{filteredMedia.length}</strong> tệp media {monthName ? `trong ${monthName}` : ''}
            </p>
          </div>

          <div className="flex items-center gap-2 me-6">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleSelectAllCurrentFilter}
              className="h-7 text-xs font-normal gap-1.5 cursor-pointer text-muted-foreground hover:text-foreground"
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
          </div>
        </DialogHeader>

        {/* ── DANH SÁCH LIỆT KÊ TỪNG BUỔI ── */}
        <div className="flex-1 min-h-0 overflow-y-auto px-5 py-3.5 space-y-4 custom-scrollbar">
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
                <div key={group.sessionNumber} className="space-y-2.5">
                  {/* Header của từng buổi học: Text thường, cùng 1 dòng, không có Buổi xx, thứ ngày ra trước, không giờ, không GV, bỏ năm */}
                  <div className="flex items-center justify-between gap-3 pb-1 border-b border-border/60">
                    <div className="text-xs sm:text-sm font-normal text-foreground truncate">
                      {cleanDate ? `${cleanDate}: ` : ''}{group.sessionTitle}
                    </div>

                    <button
                      type="button"
                      onClick={() => handleToggleSession(group.items)}
                      className="text-xs font-normal text-primary hover:underline cursor-pointer shrink-0"
                    >
                      {isSessionAllSelected ? 'Bỏ chọn buổi' : 'Chọn cả buổi'}
                    </button>
                  </div>

                  {/* Lưới các thẻ Media nhỏ gọn, Tên đè lên cạnh checkbox */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2.5">
                    {group.items.map((item) => {
                      const isSelected = selectedIds.includes(item.id)
                      const isVideo = item.type === 'video'

                      return (
                        <div
                          key={item.id}
                          onClick={() => handleTogglePhoto(item.id)}
                          className={cn(
                            'group/card relative aspect-[16/10] rounded-xl border overflow-hidden transition-all bg-zinc-900 cursor-pointer shadow-2xs select-none',
                            isSelected
                              ? 'border-sky-500 ring-2 ring-sky-500/40'
                              : 'border-border/70 hover:border-border hover:shadow-xs'
                          )}
                        >
                          {/* Image / Video Poster */}
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={item.thumbnailUrl || item.url}
                            alt={item.title}
                            className="h-full w-full object-cover transition-transform duration-300 group-hover/card:scale-105"
                          />

                          {/* Top Bar Overlay: Checkbox Tick + Tên ảnh (Trái) & Type Badge (Phải) */}
                          <div className="absolute inset-x-0 top-0 p-2 bg-gradient-to-b from-black/85 via-black/50 to-transparent flex items-center justify-between gap-1.5 z-20 pointer-events-none">
                            {/* Checkbox Tick + Tên ảnh */}
                            <div className="flex items-center gap-1.5 min-w-0 pointer-events-auto">
                              <div
                                className={cn(
                                  'h-4 w-4 sm:h-4.5 sm:w-4.5 rounded flex items-center justify-center transition-all shadow-md shrink-0',
                                  isSelected
                                    ? 'bg-sky-500 text-white'
                                    : 'bg-black/50 text-white/70 border border-white/30 backdrop-blur-xs group-hover/card:border-white'
                                )}
                              >
                                <Check
                                  className={cn(
                                    'h-3 w-3 stroke-[3] transition-opacity',
                                    isSelected ? 'opacity-100' : 'opacity-0 group-hover/card:opacity-40'
                                  )}
                                />
                              </div>
                              <span
                                className="text-[11px] font-semibold text-white truncate drop-shadow-sm"
                                title={item.name || item.title}
                              >
                                {item.name || item.title}
                              </span>
                            </div>

                            {/* Type Badge (ẢNH / VIDEO) */}
                            <div className="pointer-events-auto shrink-0">
                              <span className="px-1 py-0.5 rounded bg-black/70 backdrop-blur-xs text-[8.5px] font-bold text-white border border-white/10 uppercase tracking-wider">
                                {isVideo ? 'VIDEO' : 'ẢNH'}
                              </span>
                            </div>
                          </div>

                          {/* Center Play Icon nếu là Video */}
                          {isVideo && (
                            <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
                              <div className="h-7 w-7 rounded-full bg-black/60 backdrop-blur-xs flex items-center justify-center text-white border border-white/20 shadow-md group-hover/card:scale-110 transition-transform">
                                <Play className="h-3.5 w-3.5 fill-white ml-0.5" />
                              </div>
                            </div>
                          )}

                          {/* Bottom Overlay: Ẩn tên học viên nếu là ảnh của Minh Vy, chỉ hiển thị nếu là Dành cho cả lớp hoặc Thời lượng Video */}
                          {(item.isClassWide || (isVideo && item.duration)) && (
                            <div className="absolute inset-x-0 bottom-0 p-1.5 bg-gradient-to-t from-black/75 to-transparent flex items-center justify-between text-[9.5px] text-zinc-300 z-20 pointer-events-none">
                              {item.isClassWide ? (
                                <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-black/60 backdrop-blur-xs text-[9px] font-medium text-emerald-300 border border-emerald-500/20">
                                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 inline-block shrink-0" />
                                  Dành cho cả lớp
                                </span>
                              ) : (
                                <span />
                              )}
                              {isVideo && item.duration && (
                                <span className="px-1.5 py-0.5 rounded bg-black/60 backdrop-blur-xs text-[9px] text-zinc-300 font-mono">
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

        {/* ── FOOTER: ĐÃ CHỌN X MỤC & NÚT XÁC NHẬN ── */}
        <div className="px-5 py-3 border-t bg-muted/10 flex items-center justify-between shrink-0">
          <span className="text-xs font-medium text-muted-foreground">
            Đã chọn <strong className="text-primary font-bold">{selectedIds.length}</strong> ảnh & video để gắn vào báo cáo
          </span>

          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => onOpenChange(false)}
              className="text-xs font-semibold px-3.5 h-8 rounded-xl cursor-pointer"
            >
              Hủy
            </Button>
            <Button
              type="button"
              size="sm"
              onClick={handleConfirm}
              className="text-xs font-bold px-4 h-8 bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl shadow-xs cursor-pointer gap-1.5"
            >
              <Check className="h-3.5 w-3.5" />
              <span>Xác nhận ({selectedIds.length})</span>
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
