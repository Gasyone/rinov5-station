'use client'

import React, { useState } from 'react'
import {
  Plus,
  Trash2,
  Upload,
  Link as LinkIcon,
  FileText,
  Eye,
  X,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { MediaPreviewModal, type MediaPreviewItem } from '@/components/shared'
import type { WeekReviewItem } from './monthlyReportHelpers'

interface MonthlyReportReviewItemsSectionProps {
  items: WeekReviewItem[]
  onChange: (items: WeekReviewItem[]) => void
  readOnly?: boolean
}

export function MonthlyReportReviewItemsSection({
  items,
  onChange,
  readOnly = false,
}: MonthlyReportReviewItemsSectionProps) {
  const [previewMedia, setPreviewMedia] = useState<MediaPreviewItem | null>(null)
  const [activeLinkInputIdx, setActiveLinkInputIdx] = useState<number | null>(null)
  const [tempLinkValue, setTempLinkValue] = useState<string>('')

  // Thêm nội dung mới
  const handleAddItem = () => {
    const nextIndex = items.length + 1
    const newItem: WeekReviewItem = {
      weekNum: nextIndex,
      title: `Nội dung ${nextIndex}`,
      content: '',
      docLink: '',
      thumbnailUrl: '',
    }
    onChange([...items, newItem])
    toast.success('Đã thêm nội dung ôn tập mới!')
  }

  // Xóa nội dung
  const handleRemoveItem = (idxToRemove: number) => {
    const updated = items.filter((_, idx) => idx !== idxToRemove)
    onChange(updated)
    toast.success('Đã xóa nội dung ôn tập.')
  }

  // Cập nhật một mục
  const handleUpdateItem = (idxToUpdate: number, fields: Partial<WeekReviewItem>) => {
    const updated = items.map((item, idx) => {
      if (idx === idxToUpdate) {
        return { ...item, ...fields }
      }
      return item
    })
    onChange(updated)
  }

  // Upload file ảnh
  const handleUploadFile = (idx: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const url = URL.createObjectURL(file)
      handleUpdateItem(idx, {
        thumbnailUrl: url,
        docLink: file.name,
      })
      toast.success(`Đã đính kèm "${file.name}"!`)
    }
  }

  // Mở nhập link
  const handleStartEditingLink = (idx: number) => {
    setActiveLinkInputIdx(idx)
    setTempLinkValue(items[idx]?.docLink || '')
  }

  // Xác nhận link
  const handleSaveLink = (idx: number) => {
    if (tempLinkValue.trim()) {
      const isImg = tempLinkValue.match(/\.(jpeg|jpg|gif|png|webp)/i)
      handleUpdateItem(idx, {
        docLink: tempLinkValue.trim(),
        thumbnailUrl: isImg
          ? tempLinkValue.trim()
          : items[idx]?.thumbnailUrl || 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?q=80&w=400&auto=format&fit=crop',
      })
      toast.success('Đã lưu link đính kèm!')
    }
    setActiveLinkInputIdx(null)
    setTempLinkValue('')
  }

  // Gỡ ảnh/tệp đính kèm
  const handleRemoveAttachment = (idx: number) => {
    handleUpdateItem(idx, {
      thumbnailUrl: '',
      docLink: '',
    })
    toast.success('Đã gỡ tệp đính kèm.')
  }

  // Lọc các mục có nội dung thực tế (bỏ qua các mục rỗng)
  const validItems = items.filter((it) => it.content && it.content.trim().length > 0)

  // Khi xem báo cáo (readOnly), nếu không có nội dung ôn tập riêng nào thì ẩn hoàn toàn cả mục 2
  if (readOnly && validItems.length === 0) {
    return null
  }

  // Giao diện tinh gọn cho chế độ xem báo cáo (readOnly): không đóng hộp thô, không nhãn tuần cứng, chỉ có thumbnail đính kèm duy nhất
  if (readOnly) {
    return (
      <div className="space-y-1.5 pt-1.5">
        <h4 className="text-xs font-normal text-muted-foreground flex items-center gap-1.5">
          <span>2. Nội dung ôn tập riêng</span>
        </h4>

        <div className="space-y-1.5">
          {validItems.map((item, idx) => {
            const hasAttachment = Boolean(item.thumbnailUrl || item.docLink)

            return (
              <div
                key={idx}
                className="rounded-lg border border-border/60 bg-muted/20 px-2.5 py-1.5 flex items-center justify-between gap-2.5 min-w-0"
              >
                {/* Tiêu đề & Nội dung */}
                <div className="text-xs leading-relaxed font-sans flex-1 min-w-0">
                  {item.title ? (
                    <span className="font-normal text-foreground mr-1.5">
                      {item.title}:
                    </span>
                  ) : null}
                  <span className="text-foreground/80 font-normal">{item.content}</span>
                </div>

                {/* Thumbnail ảnh / tài liệu đính kèm duy nhất (Click mở xem lớn) */}
                {hasAttachment && (
                  <div className="shrink-0">
                    <button
                      type="button"
                      onClick={() => {
                        if (item.thumbnailUrl) {
                          setPreviewMedia({
                            name: item.title || 'Tài liệu ôn tập',
                            url: item.thumbnailUrl!,
                            thumbnailUrl: item.thumbnailUrl,
                          })
                        } else if (item.docLink) {
                          window.open(item.docLink, '_blank')
                        }
                      }}
                      className="h-9 w-9 sm:h-10 sm:w-10 rounded-md overflow-hidden border border-border/70 relative group cursor-pointer bg-muted/40 shadow-3xs"
                      title={item.thumbnailUrl ? 'Bấm để xem ảnh phóng to' : 'Bấm để mở tài liệu đính kèm'}
                    >
                      {item.thumbnailUrl ? (
                        /* eslint-disable-next-line @next/next/no-img-element */
                        <img
                          src={item.thumbnailUrl}
                          alt={item.title || 'Tài liệu'}
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-primary/5 text-primary">
                          <FileText className="h-4 w-4" />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                        <Eye className="h-3 w-3" />
                      </div>
                    </button>
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {/* Lightbox Modal xem ảnh lớn khi bấm Xem trên Thumbnail */}
        {previewMedia && (
          <MediaPreviewModal
            previewMedia={previewMedia}
            onClose={() => setPreviewMedia(null)}
          />
        )}
      </div>
    )
  }

  const displayItems = items

  return (
    <div className="space-y-1.5 pt-1.5">
      {/* Header Bar: Tiêu đề & Nút thêm mới cùng dòng */}
      <div className="flex items-center justify-between gap-2">
        <label className="text-xs font-normal text-muted-foreground flex items-center gap-1.5">
          2. Nội dung ôn tập riêng
        </label>

        {!readOnly && (
          <Button
            type="button"
            size="sm"
            onClick={handleAddItem}
            className="h-6 text-[11px] font-normal gap-1 px-2 text-sky-600 dark:text-sky-400 bg-transparent border border-transparent hover:border-sky-300 dark:hover:border-sky-700 hover:bg-sky-50 dark:hover:bg-sky-950/40 hover:text-sky-700 dark:hover:text-sky-300 rounded-md cursor-pointer transition-all shadow-none"
            title="Thêm nội dung ôn tập bổ trợ riêng cho học viên"
          >
            <Plus className="h-3 w-3 text-sky-600 dark:text-sky-400" />
            <span>Thêm nội dung</span>
          </Button>
        )}
      </div>

      {/* Danh sách các nội dung ôn tập */}
      <div className="space-y-2">
        {displayItems.length === 0 ? (
          <div className="p-2.5 sm:p-3 text-center rounded-lg border border-dashed border-border/70 bg-muted/5 space-y-1 select-none">
            <p className="text-xs font-medium text-muted-foreground">
              Chưa có nội dung ôn tập bổ trợ riêng cho học viên này.
            </p>
            <p className="text-[11px] text-muted-foreground/80 max-w-md mx-auto">
              Nội dung ôn tập riêng là tùy chọn bổ trợ. Khi để trống, mục này sẽ tự động ẩn đi trên báo cáo gửi phụ huynh.
            </p>
            {!readOnly && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleAddItem}
                className="h-6.5 text-[11px] font-medium gap-1 rounded-md cursor-pointer mt-0.5 px-2.5"
              >
                <Plus className="h-3 w-3" />
                <span>Thêm nội dung ôn tập</span>
              </Button>
            )}
          </div>
        ) : (
          displayItems.map((item, idx) => {
            const hasAttachment = Boolean(item.thumbnailUrl || item.docLink)

            return (
              <div
                key={idx}
                className="rounded-lg border border-border/80 bg-card p-2 space-y-1.5 shadow-3xs"
              >
                {/* ── HÀNG TRÊN: TIÊU ĐỀ + ĐÍNH KÈM + NÚT XÓA ── */}
                <div className="flex items-center gap-1.5">
                  <input
                    type="text"
                    value={item.title}
                    onChange={(e) => handleUpdateItem(idx, { title: e.target.value })}
                    placeholder="Tiêu đề (VD: Ôn tập Unit 1, Phonics Letter T...)"
                    className="flex-1 text-xs font-semibold px-2 py-1 rounded-md border border-border/70 bg-background focus:outline-none focus:border-primary text-foreground min-w-0"
                  />

                  {/* Attachment Chip hoặc Trigger Buttons */}
                  {hasAttachment ? (
                    <div className="flex items-center gap-1.5 h-6.5 px-2 rounded-md border border-border/70 bg-muted/30 text-xs shrink-0 max-w-[150px] sm:max-w-[200px]">
                      {item.thumbnailUrl ? (
                        /* eslint-disable-next-line @next/next/no-img-element */
                        <img
                          src={item.thumbnailUrl}
                          alt={item.title}
                          className="h-4 w-4 rounded object-cover shrink-0 cursor-pointer"
                          onClick={() =>
                            setPreviewMedia({
                              name: item.title,
                              url: item.thumbnailUrl!,
                              thumbnailUrl: item.thumbnailUrl,
                            })
                          }
                          title="Bấm để xem ảnh lớn"
                        />
                      ) : (
                        <FileText className="h-3.5 w-3.5 text-primary shrink-0" />
                      )}
                      <span
                        className="truncate text-[11px] font-medium text-foreground flex-1 cursor-pointer"
                        title={item.docLink}
                        onClick={() => {
                          if (item.thumbnailUrl) {
                            setPreviewMedia({
                              name: item.title,
                              url: item.thumbnailUrl!,
                              thumbnailUrl: item.thumbnailUrl,
                            })
                          } else if (item.docLink) {
                            window.open(item.docLink, '_blank')
                          }
                        }}
                      >
                        {item.docLink?.replace(/^.*[\\/]/, '') || 'Tệp'}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleRemoveAttachment(idx)}
                        className="text-muted-foreground hover:text-destructive shrink-0 cursor-pointer p-0.5 transition-colors"
                        title="Gỡ đính kèm"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1 shrink-0">
                      <label
                        className="h-6.5 px-2 text-[11px] font-medium inline-flex items-center gap-1 rounded-md border border-border/70 bg-background hover:bg-muted text-foreground cursor-pointer transition-colors shadow-3xs"
                        title="Tải ảnh hoặc tệp tài liệu"
                      >
                        <Upload className="h-3 w-3 text-muted-foreground" />
                        <span className="hidden sm:inline">Tải ảnh</span>
                        <input
                          type="file"
                          accept="image/*,.pdf,.doc,.docx"
                          className="hidden"
                          onChange={(e) => handleUploadFile(idx, e)}
                        />
                      </label>
                      <button
                        type="button"
                        onClick={() => handleStartEditingLink(idx)}
                        className="h-6.5 px-2 text-[11px] font-medium inline-flex items-center gap-1 rounded-md border border-border/70 bg-background hover:bg-muted text-foreground cursor-pointer transition-colors shadow-3xs"
                        title="Dán link tài liệu hoặc ảnh"
                      >
                        <LinkIcon className="h-3 w-3 text-muted-foreground" />
                        <span className="hidden sm:inline">Dán link</span>
                      </button>
                    </div>
                  )}

                  {/* Nút Xóa nội dung */}
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-xs"
                    onClick={() => handleRemoveItem(idx)}
                    className="h-6.5 w-6.5 text-muted-foreground/60 hover:text-destructive hover:bg-destructive/10 rounded-md shrink-0 cursor-pointer"
                    title="Xóa nội dung này"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>

                {/* Inline Popover / Input dán link nếu đang mở */}
                {activeLinkInputIdx === idx && (
                  <div className="flex items-center gap-1.5 p-1 rounded-md border border-primary/50 bg-primary/5">
                    <input
                      type="text"
                      value={tempLinkValue}
                      onChange={(e) => setTempLinkValue(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleSaveLink(idx)
                        if (e.key === 'Escape') setActiveLinkInputIdx(null)
                      }}
                      placeholder="Nhập đường link tài liệu, ảnh, google drive..."
                      className="flex-1 text-xs px-2 py-0.5 rounded border border-border/80 bg-background focus:outline-none"
                      autoFocus
                    />
                    <button
                      type="button"
                      onClick={() => handleSaveLink(idx)}
                      className="text-xs px-2.5 py-0.5 rounded bg-primary text-primary-foreground font-semibold cursor-pointer"
                    >
                      Lưu
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveLinkInputIdx(null)}
                      className="text-xs px-2 py-0.5 text-muted-foreground hover:bg-muted rounded cursor-pointer"
                    >
                      Hủy
                    </button>
                  </div>
                )}

                {/* ── HÀNG DƯỚI: TEXTAREA MÔ TẢ NỘI DUNG ── */}
                <textarea
                  rows={2}
                  value={item.content}
                  onChange={(e) => handleUpdateItem(idx, { content: e.target.value })}
                  placeholder="Nhập chi tiết bài tập, câu mẫu, từ vựng hoặc chỉ dẫn con luyện tập..."
                  className="w-full text-xs p-2 rounded-md border border-border/60 bg-muted/20 focus:bg-background focus:border-primary focus:outline-none resize-y min-h-[48px] leading-relaxed font-sans"
                />
              </div>
            )
          })
        )}
      </div>

      {/* Lightbox Modal xem ảnh lớn khi bấm Xem trên Thumboard */}
      {previewMedia && (
        <MediaPreviewModal
          previewMedia={previewMedia}
          onClose={() => setPreviewMedia(null)}
        />
      )}
    </div>
  )
}
