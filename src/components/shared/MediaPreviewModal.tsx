'use client'

import React from 'react'
import { Download, ExternalLink, FileText, Share2, X } from 'lucide-react'
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
  duration?: string
  size?: string
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

  const taggedStudents = previewMedia.taggedStudents
  const isVideo = previewMedia.type === 'video'
  const isDoc = previewMedia.type === 'doc'
  const isImage = previewMedia.type === 'image' || (!isVideo && !isDoc)

  return (
    <Dialog open={!!previewMedia} onOpenChange={(open) => !open && onClose()}>
      <DialogContent
        className="w-full sm:max-w-4xl lg:max-w-5xl max-w-[95vw] aspect-video max-h-[88vh] p-0 bg-transparent border-none text-white rounded-2xl overflow-hidden z-[9999] shadow-2xl [&>button]:hidden flex items-center justify-center"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Standard 16:9 Media Preview Frame */}
        <div className="relative w-full h-full aspect-video rounded-2xl overflow-hidden shadow-2xl bg-zinc-950 flex items-center justify-center border border-white/15 group">
          {/* Header Bar Overlay with Semi-Transparent Backdrop */}
          <div className="absolute top-0 inset-x-0 bg-gradient-to-b from-black/90 via-black/60 to-transparent p-4 pb-8 z-20 flex items-center justify-between gap-4">
            <div className="flex items-center gap-2 min-w-0 pr-2">
              <span className="shrink-0 px-2 py-0.5 rounded-md bg-white/20 text-[10px] font-bold tracking-wider uppercase text-white backdrop-blur-xs border border-white/10">
                {isVideo ? 'Video' : isDoc ? 'Tài liệu' : 'Ảnh'}
              </span>
              <DialogTitle className="font-bold text-base truncate text-white drop-shadow-xs">
                {previewMedia.name}
              </DialogTitle>
            </div>

            {/* Actions: Share Link, Download Link, Open Tab & Explicit Close "X" Button */}
            <div className="flex items-center gap-2 shrink-0">
              {isDoc && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    if (previewMedia.url && previewMedia.url !== '#') {
                      window.open(previewMedia.url, '_blank')
                      toast.success(`Đang mở tài liệu: ${previewMedia.name}`)
                    } else {
                      toast.info(`Tài liệu "${previewMedia.name}" đang được tải về...`)
                    }
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-sky-300 hover:text-white bg-sky-500/20 hover:bg-sky-500/30 border border-sky-400/30 transition-all shrink-0 cursor-pointer"
                  title="Mở trong tab mới"
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                  <span>Mở tab mới</span>
                </button>
              )}

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
                download={previewMedia.name}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-emerald-300 hover:text-white bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-400/30 transition-all shrink-0 cursor-pointer"
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
                className="h-8 w-8 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-md text-white flex items-center justify-center transition-colors border border-white/20 shrink-0 cursor-pointer"
                title="Đóng cửa sổ"
              >
                <X className="h-4 w-4 stroke-[2.5]" />
              </button>
            </div>
          </div>

          {/* Modal Body Content (Video / Image / Document) */}
          {isVideo ? (
            <div className="relative w-full h-full bg-black flex items-center justify-center overflow-hidden">
              <video
                key={previewMedia.url}
                src={previewMedia.url}
                poster={highResUrl || previewMedia.thumbnailUrl}
                controls
                autoPlay
                playsInline
                className="w-full h-full object-contain"
              />
            </div>
          ) : isImage && (highResUrl || previewMedia.url) ? (
            <div className="relative w-full h-full bg-zinc-950 flex items-center justify-center overflow-hidden">
              {/* Subtle ambient blurred background glow */}
              <div
                className="absolute inset-0 bg-cover bg-center filter blur-2xl opacity-25 scale-110 pointer-events-none"
                style={{ backgroundImage: `url(${highResUrl || previewMedia.url})` }}
                aria-hidden="true"
              />
              <img
                src={highResUrl || previewMedia.url}
                alt={previewMedia.name}
                className="relative z-10 max-w-full max-h-full object-contain block transition-transform duration-300"
              />
            </div>
          ) : (
            <div className="p-8 text-center text-zinc-300 z-10 flex flex-col items-center justify-center h-full max-w-lg mx-auto">
              <div className="h-20 w-20 rounded-2xl bg-sky-500/20 border border-sky-400/30 flex items-center justify-center mb-4 text-sky-400 shadow-lg">
                <FileText className="h-10 w-10" />
              </div>
              <h4 className="text-base font-bold text-white mb-1 truncate max-w-md" title={previewMedia.name}>
                {previewMedia.name}
              </h4>
              <p className="text-xs text-zinc-400 mb-6">
                Tài liệu học tập & nhiệm vụ ({previewMedia.size || 'Tài liệu'})
              </p>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => {
                    if (previewMedia.url && previewMedia.url !== '#') {
                      window.open(previewMedia.url, '_blank')
                      toast.success(`Đang mở tài liệu: ${previewMedia.name}`)
                    } else {
                      toast.info(`Tài liệu "${previewMedia.name}" đang được tải về...`)
                    }
                  }}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-sky-600 hover:bg-sky-500 shadow-md cursor-pointer transition-all"
                >
                  <ExternalLink className="h-4 w-4" />
                  <span>Mở trong tab mới</span>
                </button>
                <a
                  href={previewMedia.url && previewMedia.url !== '#' ? previewMedia.url : undefined}
                  target="_blank"
                  rel="noreferrer"
                  download={previewMedia.name}
                  onClick={() => toast.success(`Đang tải về: ${previewMedia.name}`)}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-zinc-200 bg-white/10 hover:bg-white/20 border border-white/20 cursor-pointer transition-all"
                >
                  <Download className="h-4 w-4" />
                  <span>Tải về tệp</span>
                </a>
              </div>
            </div>
          )}

          {/* Floating Footer Overlay for Tagged Students or Class Badge */}
          <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent p-3.5 px-4 pt-8 z-20 flex items-center justify-between gap-2 pointer-events-none">
            {/* Left: Video duration if available */}
            {isVideo && previewMedia.duration ? (
              <span className="px-2.5 py-1 rounded-md bg-black/60 backdrop-blur-md text-[11px] font-mono text-zinc-300 border border-white/20">
                Thời lượng: {previewMedia.duration}
              </span>
            ) : <span />}

            {/* Right: Tagged Students / Class-wide Badge */}
            <div className="pointer-events-auto">
              {taggedStudents && taggedStudents.length > 0 ? (
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
              ) : (
                <div className="inline-flex items-center gap-1.5 rounded-full bg-black/60 backdrop-blur-md px-3 py-1 text-xs font-medium text-white border border-white/20 shadow-xs">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span>Dành cho cả lớp</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
