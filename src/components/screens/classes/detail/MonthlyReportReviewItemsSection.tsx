'use client'

import React, { useState } from 'react'
import {
  Plus,
  Trash2,
  Upload,
  Link as LinkIcon,
  ExternalLink,
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

  return (
    <div className="space-y-4 pt-4 border-t border-border/70">
      {/* Header Bar: Tiêu đề & Nút thêm mới */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div>
          <h4 className="text-sm font-extrabold text-foreground uppercase tracking-wide flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-primary inline-block" />
            <span>2. NỘI DUNG ÔN TẬP RIÊNG</span>
          </h4>
          {!readOnly && (
            <p className="text-xs text-muted-foreground font-normal mt-0.5">
              Không cố định theo tuần. Bao gồm các chủ đề, bài tập kèm tài liệu đính kèm.
            </p>
          )}
        </div>

        {!readOnly && (
          <Button
            type="button"
            size="sm"
            onClick={handleAddItem}
            className="h-8 text-xs font-bold gap-1.5 rounded-lg bg-primary hover:bg-primary/90 text-primary-foreground shadow-2xs cursor-pointer transition-all active:scale-95"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Thêm nội dung</span>
          </Button>
        )}
      </div>

      {/* Danh sách các nội dung ôn tập (Xóa bỏ hoàn toàn nền và viền khối thô) */}
      <div className="space-y-4">
        {items.length === 0 ? (
          <div className="p-6 text-center rounded-xl border border-dashed border-border/80 bg-muted/10 space-y-2">
            <p className="text-sm text-muted-foreground">Chưa có nội dung ôn tập bổ trợ riêng cho tháng này.</p>
            {!readOnly && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleAddItem}
                className="text-xs font-semibold gap-1.5"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>Thêm nội dung đầu tiên</span>
              </Button>
            )}
          </div>
        ) : (
          items.map((item, idx) => {
            const hasAttachment = Boolean(item.thumbnailUrl || item.docLink)

            return (
              <div
                key={idx}
                className="pt-2 pb-4 border-b border-border/60 last:border-b-0"
              >
                <div className="flex flex-col md:flex-row items-stretch gap-3.5">
                  {/* ── CỘT TRÁI: HÌNH ẢNH / TẢI LÊN (CHIỀU CAO BẰNG CẢ CỤM TITLE + MÔ TẢ) ── */}
                  {(!readOnly || hasAttachment) && (
                    <div className="w-full md:w-56 shrink-0 flex flex-col">
                      {/* Popover / Input dán link nếu đang mở (Chỉ khi không readOnly) */}
                      {!readOnly && activeLinkInputIdx === idx ? (
                        <div className="h-full min-h-[140px] rounded-2xl border border-primary/50 bg-background p-3 flex flex-col justify-between shadow-xs">
                          <span className="text-xs font-bold text-foreground">Dán link tài liệu / ảnh:</span>
                          <input
                            type="text"
                            value={tempLinkValue}
                            onChange={(e) => setTempLinkValue(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') handleSaveLink(idx)
                              if (e.key === 'Escape') setActiveLinkInputIdx(null)
                            }}
                            placeholder="Link Google Drive, web..."
                            className="text-xs p-2 rounded-lg border border-border/80 bg-muted/20 focus:outline-none focus:border-primary font-mono"
                            autoFocus
                          />
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              type="button"
                              onClick={() => setActiveLinkInputIdx(null)}
                              className="text-xs px-2.5 py-1 rounded text-muted-foreground hover:bg-muted cursor-pointer"
                            >
                              Hủy
                            </button>
                            <button
                              type="button"
                              onClick={() => handleSaveLink(idx)}
                              className="text-xs px-3 py-1 rounded bg-primary text-primary-foreground font-bold cursor-pointer"
                            >
                              Lưu
                            </button>
                          </div>
                        </div>
                      ) : hasAttachment ? (
                        /* Thumboard hiển thị khi đã có file/ảnh */
                        <div className="relative h-full min-h-[140px] w-full rounded-2xl overflow-hidden border border-border/80 bg-muted/20 shadow-2xs group">
                          {item.thumbnailUrl ? (
                            /* eslint-disable-next-line @next/next/no-img-element */
                            <img
                              src={item.thumbnailUrl}
                              alt={item.title}
                              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                            />
                          ) : (
                            <div className="w-full h-full flex flex-col items-center justify-center p-3 text-center bg-primary/5">
                              <FileText className="h-8 w-8 text-primary mb-1.5" />
                              <span className="text-xs font-bold text-foreground truncate max-w-[180px]">
                                {item.docLink || 'Tài liệu đính kèm'}
                              </span>
                            </div>
                          )}

                          {/* Thumboard Overlay Controls on Hover */}
                          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-1.5 p-2 text-white">
                            {item.thumbnailUrl && (
                              <button
                                type="button"
                                onClick={() =>
                                  setPreviewMedia({
                                    name: item.title,
                                    url: item.thumbnailUrl!,
                                    thumbnailUrl: item.thumbnailUrl,
                                  })
                                }
                                className="inline-flex items-center gap-1 text-xs font-bold bg-white/20 hover:bg-white/30 px-3 py-1.5 rounded-lg cursor-pointer transition-colors w-full justify-center"
                              >
                                <Eye className="h-3.5 w-3.5" />
                                <span>Xem ảnh lớn</span>
                              </button>
                            )}

                            {item.docLink && (
                              <a
                                href={item.docLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 text-xs font-bold bg-primary hover:bg-primary/90 px-3 py-1.5 rounded-lg cursor-pointer transition-colors w-full justify-center text-white"
                              >
                                <ExternalLink className="h-3.5 w-3.5" />
                                <span>Mở link file</span>
                              </a>
                            )}

                            {!readOnly && (
                              <button
                                type="button"
                                onClick={() => handleRemoveAttachment(idx)}
                                className="inline-flex items-center gap-1 text-xs font-semibold text-rose-300 hover:text-rose-100 hover:bg-rose-500/20 px-2.5 py-1 rounded-lg transition-colors w-full justify-center"
                              >
                                <X className="h-3.5 w-3.5" />
                                <span>Gỡ đính kèm</span>
                              </button>
                            )}
                          </div>
                        </div>
                      ) : (
                        /* Thumboard rỗng: Click tải ảnh hoặc dán link */
                        <div className="h-full min-h-[140px] w-full rounded-2xl border-2 border-dashed border-border/80 hover:border-primary/60 hover:bg-primary/5 transition-all p-3 flex flex-col items-center justify-center gap-2 text-muted-foreground group">
                          <label className="cursor-pointer flex flex-col items-center gap-1.5 text-xs hover:text-primary transition-colors text-center">
                            <div className="p-2 rounded-xl bg-muted/60 group-hover:bg-primary/10 text-muted-foreground group-hover:text-primary transition-colors">
                              <Upload className="h-4 w-4" />
                            </div>
                            <span className="font-bold">Tải tệp / ảnh</span>
                            <input
                              type="file"
                              accept="image/*,.pdf,.doc,.docx"
                              className="hidden"
                              onChange={(e) => handleUploadFile(idx, e)}
                            />
                          </label>
                          <div className="flex items-center gap-1 text-[11px]">
                            <span>hoặc</span>
                            <button
                              type="button"
                              onClick={() => handleStartEditingLink(idx)}
                              className="font-semibold text-sky-600 dark:text-sky-400 hover:underline flex items-center gap-0.5 cursor-pointer"
                            >
                              <LinkIcon className="h-3 w-3" />
                              <span>dán link</span>
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* ── CỘT PHẢI: GOM TITLE VÀ MÔ TẢ VÀO 1 CỤM SECTION CÓ VIỀN, NỀN, HIGHLIGHT TITLE ── */}
                  <div className="flex-1 min-w-0 rounded-2xl border border-border/80 bg-card overflow-hidden shadow-2xs flex flex-col">
                    {/* Header Cụm: Title Highlight + Nút Xóa */}
                    <div className="bg-primary/5 dark:bg-primary/10 px-3.5 py-2 border-b border-border/60 flex items-center justify-between gap-2 shrink-0">
                      {readOnly ? (
                        <h5 className="text-sm font-black text-foreground truncate py-0.5">
                          {item.title || '(Chưa đặt tiêu đề)'}
                        </h5>
                      ) : (
                        <input
                          type="text"
                          value={item.title}
                          onChange={(e) => handleUpdateItem(idx, { title: e.target.value })}
                          placeholder="Nhập tiêu đề (VD: Tuần 1, Từ vựng Unit 1, Phonics Letter T...)"
                          className="flex-1 text-sm font-black text-foreground bg-transparent focus:outline-none placeholder:text-muted-foreground/60 min-w-0"
                        />
                      )}

                      {!readOnly && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon-xs"
                          onClick={() => handleRemoveItem(idx)}
                          className="h-6 w-6 text-muted-foreground/60 hover:text-destructive hover:bg-destructive/10 rounded-md shrink-0 transition-colors cursor-pointer"
                          title="Xóa nội dung này"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      )}
                    </div>

                    {/* Body Cụm: Mô tả nội dung */}
                    <div className="flex-1 p-3 flex flex-col">
                      {readOnly ? (
                        <div className="w-full h-full min-h-[90px] text-sm text-foreground leading-relaxed font-sans whitespace-pre-line">
                          {item.content || (
                            <span className="italic text-muted-foreground/60">Không có nội dung bổ sung.</span>
                          )}
                        </div>
                      ) : (
                        <textarea
                          rows={4}
                          value={item.content}
                          onChange={(e) => handleUpdateItem(idx, { content: e.target.value })}
                          placeholder="Nhập chi tiết bài tập, câu mẫu, từ vựng hoặc chỉ dẫn con luyện tập..."
                          className="w-full h-full min-h-[95px] text-sm bg-transparent border-none focus:outline-none leading-relaxed font-sans resize-y"
                        />
                      )}
                    </div>
                  </div>
                </div>
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
