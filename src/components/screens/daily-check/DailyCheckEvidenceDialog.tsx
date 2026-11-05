'use client'

import React, { useState, useRef } from 'react'
import {
  Camera,
  Trash2,
  ExternalLink,
  ImageIcon,
  Upload,
  AlertTriangle,
} from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export interface DailyCheckEvidenceDialogProps {
  target: {
    type: 'item' | 'category'
    name: string
    group: string
    dateStr: string
    isPastDay?: boolean
  } | null
  photos: string[]
  onClose: () => void
  onAddPhoto?: () => void
  onCustomPhotoUploaded?: (url: string) => void
  onDeletePhoto?: (url: string) => void
  branchName: string
}

export function DailyCheckEvidenceDialog({
  target,
  photos,
  onClose,
  onAddPhoto,
  onCustomPhotoUploaded,
  onDeletePhoto,
  branchName,
}: DailyCheckEvidenceDialogProps) {
  const [prevTargetKey, setPrevTargetKey] = useState<string | null>(null)
  const [activePhotoIdx, setActivePhotoIdx] = useState(0)
  const cameraInputRef = useRef<HTMLInputElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  if (!target) return null

  // Reset index when target changes
  const targetKey = `${target.type}-${target.name}-${target.dateStr}`
  if (targetKey !== prevTargetKey) {
    setPrevTargetKey(targetKey)
    setActivePhotoIdx(0)
  }

  const isReadOnly = target.isPastDay || (!onAddPhoto && !onCustomPhotoUploaded)
  const clampedIdx = activePhotoIdx < photos.length ? activePhotoIdx : 0
  const currentPhoto = photos[clampedIdx] || photos[0]

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string
      if (dataUrl) {
        if (onCustomPhotoUploaded) {
          onCustomPhotoUploaded(dataUrl)
        } else if (onAddPhoto) {
          onAddPhoto()
        }
      }
    }
    reader.readAsDataURL(file)
    e.target.value = ''
  }

  return (
    <Dialog open={Boolean(target)} onOpenChange={() => onClose()}>
      <DialogContent className="max-w-2xl sm:max-w-3xl w-full p-4 space-y-3 text-foreground text-left">
        {/* Hidden File Inputs for Native Camera & Gallery Upload */}
        <input
          type="file"
          ref={cameraInputRef}
          accept="image/*"
          capture="environment"
          className="hidden"
          onChange={handleFileChange}
        />
        <input
          type="file"
          ref={fileInputRef}
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
        />

        {/* ─── 1. HEADER: TIÊU ĐỀ + NÚT CHỤP ẢNH / TẢI ẢNH / CHUYỂN QC ─── */}
        <DialogHeader className="p-0 border-b border-border/60 pb-2.5">
          <div className="flex items-center justify-between pr-8 gap-3 flex-wrap">
            <div className="min-w-0 flex-1">
              <DialogTitle className="text-sm font-medium flex items-center gap-2 truncate">
                <Camera className="h-4 w-4 text-primary shrink-0" />
                <span className="truncate">
                  {target.type === 'category'
                    ? `Ảnh danh mục: ${target.name}`
                    : `Bằng chứng: ${target.name}`}
                </span>
              </DialogTitle>
              <p className="text-[11px] text-muted-foreground mt-0.5 truncate font-normal">
                Cơ sở {branchName} • Ngày {target.dateStr}
                {isReadOnly && ' (Dữ liệu lưu trữ lịch sử)'}
              </p>
            </div>

            {/* Nhóm nút thao tác: Chụp ảnh, Tải ảnh */}
            <div className="flex items-center gap-1.5 flex-wrap">
              {!isReadOnly && (
                <>
                  {/* Nút chụp camera (tự động kích hoạt camera trên iPad/Phone) */}
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => cameraInputRef.current?.click()}
                    className="h-7 text-xs gap-1.5 cursor-pointer font-normal border-primary/40 text-primary hover:bg-primary/5 shrink-0"
                    title="Mở camera iPad/điện thoại để chụp trực tiếp tại chỗ"
                  >
                    <Camera className="h-3.5 w-3.5" />
                    <span>📸 Chụp camera</span>
                  </Button>

                  {/* Nút chọn ảnh từ thư viện hoặc file */}
                  <Button
                    size="sm"
                    onClick={() => fileInputRef.current?.click()}
                    className="h-7 text-xs gap-1.5 cursor-pointer font-normal shrink-0"
                    title="Tải ảnh có sẵn từ máy tính hoặc thư viện ảnh"
                  >
                    <Upload className="h-3 w-3" />
                    <span>Tải ảnh</span>
                  </Button>
                </>
              )}
            </div>
          </div>
        </DialogHeader>

        {/* ─── 2. NỘI DUNG ẢNH: HIỂN THỊ FULL ẢNH TỰ NHIÊN ─── */}
        <div className="space-y-3">
          {photos.length === 0 ? (
            <div className="text-center py-12 border border-dashed border-border/80 rounded-lg text-xs text-muted-foreground flex flex-col items-center justify-center gap-2.5 bg-muted/10">
              <ImageIcon className="h-8 w-8 text-muted-foreground/40" />
              <p className="font-normal">Chưa có hình ảnh minh chứng nào cho hạng mục này.</p>
              {!isReadOnly && (
                <div className="flex items-center gap-2 mt-1">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => cameraInputRef.current?.click()}
                    className="h-7 text-xs gap-1.5 cursor-pointer font-normal border-primary/40 text-primary hover:bg-primary/5"
                  >
                    <Camera className="h-3.5 w-3.5" />
                    <span>Chụp ảnh camera</span>
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => fileInputRef.current?.click()}
                    className="h-7 text-xs gap-1.5 cursor-pointer font-normal"
                  >
                    <Upload className="h-3.5 w-3.5" />
                    <span>Tải từ thư viện</span>
                  </Button>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-2.5">
              {/* KHUNG HIỂN THỊ FULL ẢNH CHÍNH */}
              <div className="relative rounded-lg overflow-hidden border border-border/80 bg-black/5 dark:bg-black/40 flex items-center justify-center p-2 min-h-[300px] max-h-[62vh] group shadow-inner">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={currentPhoto}
                  alt={`Bằng chứng ${clampedIdx + 1}`}
                  className="max-h-[58vh] w-auto max-w-full object-contain rounded-md transition-all shadow-sm"
                />

                {/* Các nút thao tác nhanh trên ảnh */}
                <div className="absolute top-3 right-3 flex items-center gap-1.5 opacity-90 hover:opacity-100 transition-opacity">
                  <a
                    href={currentPhoto}
                    target="_blank"
                    rel="noreferrer"
                    className="h-7 px-2.5 rounded-md bg-black/60 hover:bg-black/80 text-white text-xs inline-flex items-center gap-1.5 transition-colors backdrop-blur-xs shadow-md font-normal"
                    title="Mở ảnh gốc trong tab mới"
                  >
                    <ExternalLink className="h-3.5 w-3.5" />
                    <span className="text-[11px]">Mở ảnh gốc</span>
                  </a>

                  {!isReadOnly && onDeletePhoto && (
                    <button
                      type="button"
                      onClick={() => onDeletePhoto(currentPhoto)}
                      className="h-7 w-7 rounded-md bg-rose-600/80 hover:bg-rose-600 text-white flex items-center justify-center transition-colors cursor-pointer shadow-md"
                      title="Xóa ảnh này"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>

                {/* Badge số thứ tự ảnh nếu có nhiều ảnh */}
                {photos.length > 1 && (
                  <div className="absolute bottom-3 left-3 px-2 py-0.5 rounded bg-black/60 text-white text-[10px] font-normal backdrop-blur-xs">
                    Ảnh {clampedIdx + 1} / {photos.length}
                  </div>
                )}
              </div>

              {/* DẢI THUMBNAIL PHÍA DƯỚI */}
              {photos.length > 1 && (
                <div className="flex items-center gap-2 overflow-x-auto py-1 px-0.5">
                  {photos.map((p, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setActivePhotoIdx(idx)}
                      className={cn(
                        'relative h-14 w-20 rounded-md overflow-hidden border-2 shrink-0 transition-all cursor-pointer bg-muted shadow-2xs',
                        idx === clampedIdx
                          ? 'border-primary ring-2 ring-primary/20 scale-102'
                          : 'border-border/60 opacity-60 hover:opacity-100'
                      )}
                      title={`Xem ảnh ${idx + 1}`}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={p}
                        alt={`Thumbnail ${idx + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
