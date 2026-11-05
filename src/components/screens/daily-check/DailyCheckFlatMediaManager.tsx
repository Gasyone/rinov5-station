'use client'
/* eslint-disable @next/next/no-img-element */

import React, { useRef } from 'react'
import { Button } from '@/components/ui/button'
import {
  Upload,
  Play,
  X,
  Plus,
  Film,
} from 'lucide-react'
import { toast } from 'sonner'

export interface FlatMediaItem {
  id: string
  mediaType: 'image' | 'video'
  url: string
  name: string
  size?: string
}

export interface DailyCheckFlatMediaManagerProps {
  items: FlatMediaItem[]
  onChange?: (items: FlatMediaItem[]) => void
  readOnly?: boolean
  onPreview?: (item: FlatMediaItem) => void
}

function detectMediaType(name: string): 'image' | 'video' {
  const lower = name.toLowerCase()
  if (
    lower.endsWith('.mp4') ||
    lower.endsWith('.webm') ||
    lower.endsWith('.mov') ||
    lower.endsWith('.mkv') ||
    lower.includes('video')
  ) {
    return 'video'
  }
  return 'image'
}

export function DailyCheckFlatMediaManager({
  items,
  onChange,
  readOnly = false,
  onPreview,
}: DailyCheckFlatMediaManagerProps) {
  const fileInputRef = useRef<HTMLInputElement | null>(null)

  // 1. Xử lý tải tệp trực tiếp từ máy (Ảnh & Video)
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    const newItems: FlatMediaItem[] = []
    Array.from(files).forEach((file) => {
      const isVideo = file.type.startsWith('video/') || detectMediaType(file.name) === 'video'
      const blobUrl = URL.createObjectURL(file)
      newItems.push({
        id: `upload_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
        mediaType: isVideo ? 'video' : 'image',
        url: blobUrl,
        name: file.name,
        size: `${(file.size / 1024 / 1024).toFixed(1)} MB`,
      })
    })

    if (onChange) {
      onChange([...items, ...newItems])
    }
    toast.success(`Đã tải lên trực tiếp ${files.length} tệp tư liệu.`)

    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  // 2. Thêm nhanh ảnh mẫu quy chuẩn
  const handleAddSampleImage = () => {
    const sampleUrls = [
      'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1582653291997-079a1c04e5a1?auto=format&fit=crop&w=900&q=80',
    ]
    const nextIdx = items.filter((it) => it.mediaType === 'image').length
    const chosenUrl = sampleUrls[nextIdx % sampleUrls.length]

    const newItem: FlatMediaItem = {
      id: `sample_photo_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      mediaType: 'image',
      url: chosenUrl,
      name: `anh_tieu_chuan_${(nextIdx + 1).toString().padStart(2, '0')}.jpg`,
    }

    if (onChange) {
      onChange([...items, newItem])
    }
    toast.success('Đã thêm 1 ảnh tư liệu tiêu chuẩn mẫu.')
  }

  // 3. Xóa một mục tư liệu
  const handleRemove = (id: string) => {
    if (onChange) {
      onChange(items.filter((it) => it.id !== id))
    }
  }

  return (
    <div className="space-y-2 text-xs text-left">
      {/* 1. Hàng tiêu đề & nút thao tác: Cùng một hàng, title bên trái, 2 nút bên phải */}
      <div className="flex items-center justify-between gap-2 flex-wrap min-h-[28px]">
        <span className="text-xs font-medium text-foreground flex items-center gap-1.5">
          <Film className="h-3.5 w-3.5 text-primary" />
          <span>Tư liệu mẫu đính kèm</span>
        </span>

        {/* 2 nút thao tác đưa lên cạnh phải, cùng hàng với title tư liệu */}
        {!readOnly ? (
          <div className="flex items-center gap-1.5 shrink-0">
            {/* Nút Tải lên trực tiếp từ máy tính / thiết bị */}
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*,video/*"
              multiple
              className="hidden"
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => fileInputRef.current?.click()}
              className="h-6 text-[11px] gap-1 font-normal cursor-pointer shrink-0 border-border/80 hover:bg-muted"
            >
              <Upload className="h-3 w-3 text-primary" />
              <span>Tải ảnh &amp; video từ máy</span>
            </Button>

            {/* Nút thêm nhanh ảnh mẫu */}
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleAddSampleImage}
              className="h-6 text-[11px] gap-1 font-normal cursor-pointer text-muted-foreground hover:text-foreground shrink-0"
              title="Thêm ảnh minh họa mẫu chuẩn"
            >
              <Plus className="h-3 w-3 text-primary" />
              <span>Thêm ảnh mẫu</span>
            </Button>
          </div>
        ) : items.length > 0 ? (
          <span className="text-[10px] text-muted-foreground font-normal">
            Bấm vào để xem phóng to
          </span>
        ) : null}
      </div>

      {/* 2. Hiển thị danh sách ảnh & video dạng preview trực tiếp, không hiển thị text liên kết */}
      {items.length === 0 ? (
        <div className="text-muted-foreground text-[11px] py-1 italic font-normal">
          {readOnly
            ? 'Chưa đính kèm tư liệu mẫu.'
            : 'Chưa có tư liệu nào. Bấm nút tải lên từ máy ở trên.'}
        </div>
      ) : (
        <div className="flex items-start gap-2.5 flex-wrap pt-0.5">
          {items.map((it, idx) => (
            <div key={it.id || idx} className="flex flex-col gap-1 w-28 shrink-0">
              {/* Thẻ preview trực tiếp (112px x 76px) */}
              <div
                onClick={() => onPreview && onPreview(it)}
                className="group relative w-28 h-18 sm:h-20 rounded-lg overflow-hidden border border-border/80 bg-neutral-900 cursor-pointer shadow-2xs hover:border-primary hover:ring-1 hover:ring-primary/40 transition-all flex items-center justify-center"
                title="Bấm để xem phóng to"
              >
                {it.mediaType === 'video' ? (
                  <div className="w-full h-full flex flex-col items-center justify-center text-white bg-neutral-900 group-hover:bg-neutral-800 transition-colors">
                    <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center mb-1 group-hover:scale-110 transition-transform">
                      <Play className="h-3.5 w-3.5 fill-white text-white translate-x-0.5" />
                    </div>
                    <span className="text-[10px] text-white/80 font-normal">Video mẫu</span>
                  </div>
                ) : (
                  <img
                    src={it.url}
                    alt={it.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = 'none'
                    }}
                  />
                )}

                {/* Nút xóa góc phải khi ở chế độ sửa */}
                {!readOnly && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleRemove(it.id)
                    }}
                    className="absolute top-1 right-1 p-0.5 rounded bg-black/70 hover:bg-destructive text-white cursor-pointer opacity-80 group-hover:opacity-100 transition-opacity"
                    title="Xóa tư liệu này"
                  >
                    <X className="h-3 w-3" />
                  </button>
                )}
              </div>

              {/* Tên tệp tư liệu (viết thường, gọn gàng, không hiển thị liên kết URL) */}
              <div className="text-center px-0.5">
                <span
                  onClick={() => onPreview && onPreview(it)}
                  className="text-[10px] text-muted-foreground hover:text-foreground cursor-pointer truncate block font-normal"
                  title={it.name}
                >
                  {it.name}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// ─────────────────────────────────────────────────────────────
// HELPER: Chuyển đổi giữa DailyStandardMedia và FlatMediaItem[]
// ─────────────────────────────────────────────────────────────
export function convertStandardToFlatMedia(
  standard: {
    sampleAvatar?: string
    samplePhotos?: string[]
    sampleVideo?: string
  }
): FlatMediaItem[] {
  const result: FlatMediaItem[] = []

  // Video tư liệu tải lên trực tiếp
  if (standard.sampleVideo) {
    result.push({
      id: `std_video_${Date.now()}`,
      mediaType: 'video',
      url: standard.sampleVideo,
      name: 'video_quy_chuan.mp4',
    })
  }

  // Ảnh tư liệu tải lên trực tiếp
  const photos =
    standard.samplePhotos && standard.samplePhotos.length > 0
      ? standard.samplePhotos
      : standard.sampleAvatar
        ? [standard.sampleAvatar]
        : []

  photos.forEach((photoUrl, idx) => {
    if (!photoUrl) return
    result.push({
      id: `std_photo_${idx}_${Date.now()}`,
      mediaType: 'image',
      url: photoUrl,
      name: `anh_tieu_chuan_${(idx + 1).toString().padStart(2, '0')}.jpg`,
    })
  })

  return result
}

export function convertFlatMediaToStandard(items: FlatMediaItem[]): {
  sampleAvatar?: string
  samplePhotos?: string[]
  sampleVideo?: string
} {
  const videoItem = items.find((it) => it.mediaType === 'video')
  const photoItems = items.filter((it) => it.mediaType === 'image')

  return {
    sampleVideo: videoItem ? videoItem.url : undefined,
    samplePhotos: photoItems.length > 0 ? photoItems.map((it) => it.url) : undefined,
    sampleAvatar: photoItems[0]?.url || videoItem?.url || undefined,
  }
}
