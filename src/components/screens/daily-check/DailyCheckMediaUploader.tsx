'use client'
/* eslint-disable @next/next/no-img-element */

import React, { useRef, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Upload,
  Camera,
  Video,
  X,
  Play,
  Image as ImageIcon,
  Check,
} from 'lucide-react'
import { cn } from '@/lib/utils'

export interface DailyCheckMediaUploaderProps {
  photoUrl: string
  onPhotoChange: (url: string) => void
  videoUrl?: string
  onVideoChange?: (url: string) => void
  className?: string
}

export function DailyCheckMediaUploader({
  photoUrl,
  onPhotoChange,
  videoUrl = '',
  onVideoChange,
  className,
}: DailyCheckMediaUploaderProps) {
  const photoInputRef = useRef<HTMLInputElement>(null)
  const videoInputRef = useRef<HTMLInputElement>(null)
  const [imgError, setImgError] = useState(false)

  // Handle local image file upload
  const handlePhotoFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setImgError(false)
    const reader = new FileReader()
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        onPhotoChange(reader.result)
      }
    }
    reader.readAsDataURL(file)
    // Reset file input so user can pick same file again if desired
    e.target.value = ''
  }

  // Handle local video file upload
  const handleVideoFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !onVideoChange) return

    const videoObjUrl = URL.createObjectURL(file)
    onVideoChange(videoObjUrl)
    e.target.value = ''
  }

  return (
    <div className={cn('space-y-2.5 text-xs text-left', className)}>
      {/* ─── 1. TẢI / XEM TRƯỚC HÌNH ẢNH MẪU ─── */}
      <div className="p-2.5 rounded-lg border border-border/70 bg-background space-y-1.5 shadow-2xs">
        <div className="flex items-center justify-between">
          <label className="font-semibold text-foreground text-[11px] flex items-center gap-1.5">
            <Camera className="h-3.5 w-3.5 text-primary" />
            <span>Hình ảnh mẫu tiêu chuẩn 5 sao</span>
          </label>
          {photoUrl && (
            <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-1">
              <Check className="h-3 w-3" />
              <span>Đã có ảnh mẫu</span>
            </span>
          )}
        </div>

        <div className="flex items-start gap-2.5">
          {/* Ô Xem trước ảnh (Preview Box) */}
          <div className="relative shrink-0 w-14 h-14 rounded-md border border-border/80 bg-muted/30 overflow-hidden flex items-center justify-center group shadow-2xs">
            {photoUrl && !imgError ? (
              <>
                <img
                  src={photoUrl}
                  alt="Ảnh mẫu preview"
                  onError={() => setImgError(true)}
                  className="w-full h-full object-cover transition-transform group-hover:scale-105"
                />
                <button
                  type="button"
                  onClick={() => {
                    onPhotoChange('')
                    setImgError(false)
                  }}
                  className="absolute top-0.5 right-0.5 w-4 h-4 rounded-full bg-black/70 hover:bg-destructive text-white flex items-center justify-center transition-colors cursor-pointer"
                  title="Xóa ảnh này"
                >
                  <X className="h-2.5 w-2.5" />
                </button>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center text-muted-foreground/60 p-1 text-center">
                <ImageIcon className="h-4 w-4 mb-0.5" />
                <span className="text-[8px] leading-tight">Chưa có ảnh</span>
              </div>
            )}
          </div>

          {/* Công cụ Tải tệp từ máy hoặc Dán link */}
          <div className="flex-1 space-y-1.5 min-w-0">
            <div className="flex items-center gap-2">
              <input
                ref={photoInputRef}
                type="file"
                accept="image/*"
                onChange={handlePhotoFileChange}
                className="hidden"
              />
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={() => photoInputRef.current?.click()}
                className="h-6 text-[11px] gap-1 px-2 font-medium cursor-pointer bg-muted/40 hover:bg-muted text-foreground border-border/80"
              >
                <Upload className="h-3 w-3 text-primary" />
                <span>Tải ảnh từ máy</span>
              </Button>
              <span className="text-[10px] text-muted-foreground">
                Hỗ trợ JPG, PNG, WebP (xem trước tức thì)
              </span>
            </div>

            <Input
              value={photoUrl.startsWith('data:') ? 'Ảnh đã tải lên từ máy tính (Local File)' : photoUrl}
              onChange={(e) => {
                setImgError(false)
                onPhotoChange(e.target.value)
              }}
              disabled={photoUrl.startsWith('data:')}
              placeholder="Hoặc dán URL ảnh trực tiếp (https://images.unsplash.com/...)"
              className="h-6 text-[11px] bg-background font-mono"
            />
          </div>
        </div>
      </div>

      {/* ─── 2. TẢI / XEM TRƯỚC VIDEO HƯỚNG DẪN (NẾU CÓ) ─── */}
      {onVideoChange && (
        <div className="p-2.5 rounded-lg border border-border/70 bg-background space-y-1.5 shadow-2xs">
          <div className="flex items-center justify-between">
            <label className="font-semibold text-foreground text-[11px] flex items-center gap-1.5">
              <Video className="h-3.5 w-3.5 text-indigo-500" />
              <span>Video mẫu hướng dẫn (tùy chọn)</span>
            </label>
            {videoUrl && (
              <span className="text-[10px] text-indigo-600 dark:text-indigo-400 font-medium flex items-center gap-1">
                <Play className="h-3 w-3 fill-indigo-600 dark:fill-indigo-400" />
                <span>Đã đính kèm video</span>
              </span>
            )}
          </div>

          <div className="flex items-start gap-2.5">
            {/* Ô Xem trước video icon */}
            <div className="relative shrink-0 w-14 h-14 rounded-md border border-border/80 bg-neutral-900 overflow-hidden flex flex-col items-center justify-center text-white shadow-2xs">
              {videoUrl ? (
                <>
                  <Play className="h-4 w-4 fill-white text-white mb-0.5" />
                  <span className="text-[8px] font-bold text-amber-300">Video MP4</span>
                  <button
                    type="button"
                    onClick={() => onVideoChange('')}
                    className="absolute top-0.5 right-0.5 w-4 h-4 rounded-full bg-black/70 hover:bg-destructive text-white flex items-center justify-center transition-colors cursor-pointer"
                    title="Xóa video"
                  >
                    <X className="h-2.5 w-2.5" />
                  </button>
                </>
              ) : (
                <div className="flex flex-col items-center justify-center text-neutral-400 p-1 text-center">
                  <Video className="h-4 w-4 mb-0.5 opacity-60" />
                  <span className="text-[8px] leading-tight opacity-70">Không có</span>
                </div>
              )}
            </div>

            {/* Công cụ Tải video hoặc Dán link */}
            <div className="flex-1 space-y-1.5 min-w-0">
              <div className="flex items-center gap-2">
                <input
                  ref={videoInputRef}
                  type="file"
                  accept="video/*"
                  onChange={handleVideoFileChange}
                  className="hidden"
                />
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={() => videoInputRef.current?.click()}
                  className="h-6 text-[11px] gap-1 px-2 font-medium cursor-pointer bg-muted/40 hover:bg-muted text-foreground border-border/80"
                >
                  <Upload className="h-3 w-3 text-indigo-500" />
                  <span>Tải video từ máy</span>
                </Button>
                <span className="text-[10px] text-muted-foreground">
                  Hỗ trợ tệp MP4 hoặc dán liên kết
                </span>
              </div>

              <Input
                value={videoUrl.startsWith('blob:') ? 'Video đã chọn từ máy tính (Local Video)' : videoUrl}
                onChange={(e) => onVideoChange(e.target.value)}
                disabled={videoUrl.startsWith('blob:')}
                placeholder="Hoặc dán URL video (https://.../video.mp4)"
                className="h-6 text-[11px] bg-background font-mono"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
