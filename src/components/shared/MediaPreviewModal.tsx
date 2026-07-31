'use client'

import React from 'react'
import { Download, FileText, Share2, X } from 'lucide-react'
import { toast } from 'sonner'
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog'
import { AppAvatar } from './AppAvatar'

export interface TaggedStudentItem {
  id?: string
  name: string
  avatar?: string
}

export interface MediaPreviewItem {
  name: string
  url: string
  type?: string
  thumbnailUrl?: string
  taggedStudents?: TaggedStudentItem[]
}

export interface MediaPreviewModalProps {
  previewMedia: MediaPreviewItem | null
  onClose: () => void
}

export function MediaPreviewModal({
  previewMedia,
  onClose,
}: MediaPreviewModalProps) {
  if (!previewMedia) return null

  // Automatically upgrade image URL resolution parameter from low-res (e.g. w=300) to high-res (w=1200)
  const highResUrl = previewMedia.thumbnailUrl
    ? previewMedia.thumbnailUrl.replace(/w=\d+/, 'w=1200')
    : undefined

  // Fallback sample tagged students if none provided
  const taggedStudents: TaggedStudentItem[] = previewMedia.taggedStudents || [
    { name: 'Nguyễn Hoàng Vũ', avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Vu' },
    { name: 'Bảo Ngọc', avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Ngoc' }
  ]

  return (
    <Dialog open={!!previewMedia} onOpenChange={(open) => !open && onClose()}>
      <DialogContent
        className="w-[860px] max-w-[92vw] h-[520px] max-h-[85vh] p-0 bg-transparent border-none text-white rounded-2xl overflow-hidden z-[9999] shadow-2xl [&>button]:hidden flex items-center justify-center"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Standard Spacious Modal Frame (860px x 520px) */}
        <div className="relative w-full h-full rounded-2xl overflow-hidden shadow-2xl bg-zinc-950 flex items-center justify-center border border-white/15 group">
          {/* Header Bar Overlay with Semi-Transparent Backdrop */}
          <div className="absolute top-0 inset-x-0 bg-gradient-to-b from-black/90 via-black/60 to-transparent p-4 pb-8 z-20 flex items-center justify-between gap-4">
            <div className="min-w-0 pr-2">
              <DialogTitle className="font-bold text-base truncate text-white drop-shadow-xs">
                {previewMedia.name}
              </DialogTitle>
              <p className="text-xs text-zinc-300 font-medium">Tài liệu & hình ảnh đính kèm buổi học</p>
            </div>

            {/* Actions: Share Link, Download Link & Explicit High-Contrast Close "X" Button */}
            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  if (typeof navigator !== 'undefined' && navigator.clipboard && previewMedia.url) {
                    navigator.clipboard.writeText(previewMedia.url)
                  }
                  toast.success(`Đã sao chép liên kết tệp "${previewMedia.name}"!`)
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-zinc-200 hover:text-white bg-white/10 hover:bg-white/20 border border-white/20 transition-all shrink-0 cursor-pointer"
                title="Chia sẻ / Sao chép link"
              >
                <Share2 className="h-3.5 w-3.5 text-sky-400" />
                <span>Chia sẻ link</span>
              </button>

              <a
                href={previewMedia.url && previewMedia.url !== '#' ? previewMedia.url : undefined}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-sky-300 hover:text-white bg-sky-500/20 hover:bg-sky-500/30 border border-sky-400/30 transition-all shrink-0 cursor-pointer"
                onClick={(e) => {
                  e.stopPropagation()
                  toast.success(`Đang tải về: ${previewMedia.name}`)
                }}
                title="Tải về tệp gốc"
              >
                <Download className="h-3.5 w-3.5" />
                <span>Tải về tệp</span>
              </a>

              <button
                type="button"
                onClick={onClose}
                className="h-8 w-8 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-md text-white flex items-center justify-center transition-colors border border-white/20 shrink-0"
                title="Đóng cửa sổ"
              >
                <X className="h-4 w-4 stroke-[2.5]" />
              </button>
            </div>
          </div>

          {/* Full Cover Image Fill inside Spacious Standard Frame */}
          {highResUrl ? (
            <img
              src={highResUrl}
              alt={previewMedia.name}
              className="w-full h-full object-cover rounded-2xl block transition-transform duration-500 hover:scale-105"
            />
          ) : (
            <div className="p-12 text-center text-zinc-400 z-10 flex flex-col items-center justify-center h-full">
              <FileText className="h-16 w-16 mb-3 text-sky-400 opacity-80" />
              <p className="text-sm font-medium">Không có bản xem trực tiếp cho tệp tài liệu này.</p>
            </div>
          )}

          {/* Floating Footer Overlay for Tagged Students */}
          {taggedStudents.length > 0 && (
            <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent p-3.5 px-4 pt-8 z-20 flex items-center justify-end gap-2">
              <div className="flex items-center gap-2 overflow-x-auto scrollbar-none py-0.5">
                {taggedStudents.map((st, i) => (
                  <div
                    key={st.id || i}
                    className="inline-flex items-center gap-1.5 rounded-full bg-white/20 backdrop-blur-md px-3 py-1 text-xs font-semibold text-white border border-white/25 shrink-0 shadow-xs"
                  >
                    <AppAvatar
                      name={st.name}
                      src={st.avatar}
                      size="xs"
                      className="h-4 w-4 ring-1 ring-white/50 shrink-0"
                    />
                    <span className="truncate max-w-[130px] text-white text-xs">{st.name}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
