'use client'
/* eslint-disable @next/next/no-img-element */

import React, { useState, useMemo } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import {
  CheckCircle2,
  XCircle,
  Play,
  Film,
  Pencil,
  Plus,
  Trash2,
  Check,
  X,
  Sparkles,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'
import {
  getStandardForTarget,
  setCustomItemStandard,
  type DailyStandardMedia,
} from './dailyCheckStandards'
import { DailyCheckMediaUploader } from './DailyCheckMediaUploader'

export interface DailyStandardTarget {
  type: 'category' | 'item'
  group: string
  name?: string
  requirement?: string
  isNew?: boolean
  initialMode?: 'view' | 'edit'
}

export interface DailyCheckStandardDialogProps {
  target: DailyStandardTarget | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onSaveNewItem?: (
    group: string,
    name: string,
    requirement: string,
    standard: Partial<DailyStandardMedia>
  ) => void
  onUpdateItem?: (
    group: string,
    oldName: string,
    newName: string,
    requirement: string,
    standard: Partial<DailyStandardMedia>
  ) => void
}

export function DailyCheckStandardDialog({
  target,
  open,
  onOpenChange,
  onSaveNewItem,
  onUpdateItem,
}: DailyCheckStandardDialogProps) {
  const [selectedPhotoIdx, setSelectedPhotoIdx] = useState(0)
  const [showVideo, setShowVideo] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [revision, setRevision] = useState(0)

  // Track target switch to reset states during render without useEffect
  const targetKey = target
    ? `${target.isNew ? 'new' : 'item'}-${target.group}-${target.name || ''}-${target.initialMode || ''}`
    : ''
  const [prevTargetKey, setPrevTargetKey] = useState<string | null>(null)

  // Form states for editing / adding
  const [editName, setEditName] = useState('')
  const [editRequirement, setEditRequirement] = useState('')
  const [editPhotoUrl, setEditPhotoUrl] = useState('')
  const [editVideoUrl, setEditVideoUrl] = useState('')
  const [editDoList, setEditDoList] = useState<string[]>([])
  const [editDontList, setEditDontList] = useState<string[]>([])

  if (targetKey !== prevTargetKey) {
    setPrevTargetKey(targetKey)
    const shouldEdit = target?.isNew || target?.initialMode === 'edit'
    setIsEditing(Boolean(shouldEdit))
    setSelectedPhotoIdx(0)
    setShowVideo(false)

    if (target?.isNew) {
      setEditName('')
      setEditRequirement('Theo quy chuẩn vận hành 5 sao của cơ sở.')
      setEditPhotoUrl('')
      setEditVideoUrl('')
      setEditDoList(['Kiểm tra trực quan và đảm bảo sạch sẽ, ngăn nắp'])
      setEditDontList(['Để tồn tại bụi bẩn hoặc không đạt chuẩn'])
    } else if (target) {
      const data = getStandardForTarget(target)
      setEditName(target.name || data.title || '')
      setEditRequirement(target.requirement || data.requirement || data.standardDescription || '')
      setEditPhotoUrl(data.samplePhotos?.[0] || data.sampleAvatar || '')
      setEditVideoUrl(data.sampleVideo || '')
      setEditDoList(data.doList.length > 0 ? [...data.doList] : [''])
      setEditDontList(data.dontList.length > 0 ? [...data.dontList] : [''])
    }
  }

  // Derive standard data dynamically based on target and revision counter
  const currentData: DailyStandardMedia | null = useMemo(() => {
    if (!target) return null
    return getStandardForTarget(target)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [target, revision])

  if (!target || !currentData) return null

  const isNew = Boolean(target.isNew)
  const photos = currentData.samplePhotos || []
  const hasVideo = Boolean(currentData.sampleVideo)

  // Handlers for edit lists
  const handleStartEdit = () => {
    setEditName(target.name || currentData.title || '')
    setEditRequirement(currentData.requirement || currentData.standardDescription || '')
    setEditPhotoUrl(currentData.samplePhotos?.[0] || currentData.sampleAvatar || '')
    setEditVideoUrl(currentData.sampleVideo || '')
    setEditDoList(currentData.doList.length > 0 ? [...currentData.doList] : [''])
    setEditDontList(currentData.dontList.length > 0 ? [...currentData.dontList] : [''])
    setIsEditing(true)
  }

  const handleCancelEdit = () => {
    if (isNew) {
      onOpenChange(false)
    } else {
      setIsEditing(false)
    }
  }

  const handleAddDoItem = () => {
    setEditDoList((prev) => [...prev, ''])
  }

  const handleUpdateDoItem = (idx: number, val: string) => {
    setEditDoList((prev) => {
      const next = [...prev]
      next[idx] = val
      return next
    })
  }

  const handleRemoveDoItem = (idx: number) => {
    setEditDoList((prev) => prev.filter((_, i) => i !== idx))
  }

  const handleAddDontItem = () => {
    setEditDontList((prev) => [...prev, ''])
  }

  const handleUpdateDontItem = (idx: number, val: string) => {
    setEditDontList((prev) => {
      const next = [...prev]
      next[idx] = val
      return next
    })
  }

  const handleRemoveDontItem = (idx: number) => {
    setEditDontList((prev) => prev.filter((_, i) => i !== idx))
  }

  const handleSaveEdit = () => {
    const finalName = editName.trim() || currentData.title || target.name || ''
    if (!finalName) {
      toast.error('Vui lòng nhập tên tiêu chí / nhiệm vụ.')
      return
    }

    const cleanedDoList = editDoList.map((s) => s.trim()).filter(Boolean)
    const cleanedDontList = editDontList.map((s) => s.trim()).filter(Boolean)
    const cleanReq = editRequirement.trim() || 'Theo quy chuẩn vận hành 5 sao.'

    const updatedMedia: Partial<DailyStandardMedia> = {
      title: finalName,
      group: target.group,
      requirement: cleanReq,
      standardDescription: cleanReq,
      sampleAvatar: editPhotoUrl.trim() || undefined,
      samplePhotos: editPhotoUrl.trim() ? [editPhotoUrl.trim()] : undefined,
      sampleVideo: editVideoUrl.trim() || undefined,
      doList: cleanedDoList,
      dontList: cleanedDontList,
    }

    // Always persist to custom item standards cache
    setCustomItemStandard(finalName, updatedMedia)

    if (isNew) {
      if (onSaveNewItem) {
        onSaveNewItem(target.group, finalName, cleanReq, updatedMedia)
      }
      toast.success(`Đã thêm mới tiêu chí "${finalName}" kèm quy chuẩn 5 sao!`)
      onOpenChange(false)
      return
    }

    if (onUpdateItem && target.name) {
      onUpdateItem(target.group, target.name, finalName, cleanReq, updatedMedia)
    }
    toast.success(`Đã cập nhật quy chuẩn cho tiêu chí "${finalName}".`)

    // Refresh local view immediately by updating revision
    setRevision((r) => r + 1)
    setIsEditing(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[95vw] sm:max-w-3xl md:max-w-4xl lg:max-w-5xl p-0 gap-0 overflow-hidden shadow-2xl rounded-xl border-border/80 text-foreground">
        {/* ─── HEADER: TIÊU ĐỀ TIÊU CHÍ, KHU VỰC & NÚT SỬA ─── */}
        <DialogHeader className="p-3.5 px-6 border-b border-border/70 bg-muted/20 shrink-0">
          <div className="flex items-center justify-between gap-3 pr-8 flex-wrap">
            <div className="flex items-center gap-2.5 min-w-0">
              <DialogTitle className="text-sm sm:text-base font-bold truncate text-foreground text-left flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-primary shrink-0" />
                <span>
                  {isNew
                    ? 'Thêm tiêu chí & Quy chuẩn 5 sao mới'
                    : `Tiêu chuẩn: ${currentData.title}`}
                </span>
              </DialogTitle>

              <Badge variant="outline" className="text-[10px] font-medium text-muted-foreground border-border/70 shrink-0">
                Khu vực: {target.group}
              </Badge>
            </div>

            {/* Nút bật/tắt chế độ sửa */}
            <div className="flex items-center gap-2">
              {isEditing ? (
                <div className="flex items-center gap-1.5">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={handleCancelEdit}
                    className="h-7 text-xs px-2.5 gap-1 cursor-pointer"
                  >
                    <X className="h-3 w-3" />
                    <span>Hủy</span>
                  </Button>
                  <Button
                    size="sm"
                    onClick={handleSaveEdit}
                    className="h-7 text-xs px-3 gap-1.5 cursor-pointer font-medium"
                  >
                    <Check className="h-3.5 w-3.5" />
                    <span>{isNew ? 'Lưu tiêu chí mới' : 'Lưu quy chuẩn'}</span>
                  </Button>
                </div>
              ) : (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleStartEdit}
                  className="h-7 text-xs gap-1.5 cursor-pointer font-medium hover:bg-muted text-foreground border-border/80"
                  title="Chỉnh sửa mô tả, ảnh, video, tiêu chuẩn đạt & lỗi thường gặp"
                >
                  <Pencil className="h-3 w-3 text-primary" />
                  <span>Sửa quy chuẩn</span>
                </Button>
              )}
            </div>
          </div>
        </DialogHeader>

        {/* ─── NỘI DUNG CHÍNH (VIEW MODE HOẶC EDIT MODE) ─── */}
        {isEditing ? (
          /* FORM CHỈNH SỬA / THÊM MỚI ĐẦY ĐỦ TIÊU CHUẨN ĐẠT & LỖI THƯỜNG GẶP */
          <div className="p-5 md:p-6 space-y-4 max-h-[82vh] overflow-y-auto text-left text-xs animate-in fade-in-0 duration-150">
            {/* 1. Tên tiêu chí & Khu vực */}
            <div className="space-y-1.5">
              <label className="font-semibold text-xs text-foreground flex items-center justify-between">
                <span>
                  Tên tiêu chí / nhiệm vụ kiểm tra <span className="text-destructive">*</span>
                </span>
                <span className="text-[11px] font-normal text-muted-foreground">
                  (Nhóm: {target.group})
                </span>
              </label>
              <Input
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                placeholder="VD: Biển hiệu quảng cáo, Thang máy, Cửa chính..."
                className="text-xs h-7.5 bg-background font-medium"
                autoFocus={isNew}
              />
            </div>

            {/* 2. Yêu cầu tiêu chuẩn */}
            <div className="space-y-1.5">
              <label className="font-semibold text-xs text-foreground flex items-center justify-between">
                <span>Mô tả / Yêu cầu tiêu chuẩn 5 sao</span>
                <span className="text-[11px] font-normal text-muted-foreground">
                  (Hiển thị tóm tắt cho nhân viên khi kiểm tra)
                </span>
              </label>
              <Textarea
                value={editRequirement}
                onChange={(e) => setEditRequirement(e.target.value)}
                rows={2}
                placeholder="Nhập mô tả quy chuẩn vận hành chung..."
                className="text-xs resize-none"
              />
            </div>

            {/* 3. Bộ tải ảnh & video có khung xem trước trực tiếp */}
            <DailyCheckMediaUploader
              photoUrl={editPhotoUrl}
              onPhotoChange={setEditPhotoUrl}
              videoUrl={editVideoUrl}
              onVideoChange={setEditVideoUrl}
            />

            {/* 4. Danh sách TIÊU CHUẨN ĐẠT (CHUẨN 5 SAO) */}
            <div className="p-3.5 rounded-xl border border-emerald-300 dark:border-emerald-800 bg-emerald-50/40 dark:bg-emerald-950/20 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs text-emerald-800 dark:text-emerald-300 uppercase tracking-wide flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                  <span>Tiêu chuẩn Đạt (Các tiêu chí phải làm đúng)</span>
                </span>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleAddDoItem}
                  className="h-6 text-[11px] gap-1 px-2 text-emerald-700 border-emerald-300 hover:bg-emerald-100 dark:border-emerald-700 cursor-pointer"
                >
                  <Plus className="h-3 w-3" />
                  <span>Thêm tiêu chí Đạt</span>
                </Button>
              </div>

              <div className="space-y-2">
                {editDoList.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <span className="text-emerald-600 font-bold text-xs shrink-0 w-4 text-center">✓</span>
                    <Input
                      value={item}
                      onChange={(e) => handleUpdateDoItem(idx, e.target.value)}
                      placeholder={`Tiêu chí đạt #${idx + 1}...`}
                      className="h-7 text-xs bg-background flex-1"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveDoItem(idx)}
                      className="p-1 rounded text-muted-foreground hover:text-destructive hover:bg-muted/80 cursor-pointer shrink-0"
                      title="Xóa dòng này"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* 5. Danh sách LỖI THƯỜNG GẶP (KHÔNG ĐẠT) */}
            <div className="p-3.5 rounded-xl border border-rose-300 dark:border-rose-800 bg-rose-50/40 dark:bg-rose-950/20 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs text-rose-800 dark:text-rose-300 uppercase tracking-wide flex items-center gap-1.5">
                  <XCircle className="h-4 w-4 text-rose-600" />
                  <span>Lỗi thường gặp (Các vi phạm không đạt chuẩn)</span>
                </span>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleAddDontItem}
                  className="h-6 text-[11px] gap-1 px-2 text-rose-700 border-rose-300 hover:bg-rose-100 dark:border-rose-700 cursor-pointer"
                >
                  <Plus className="h-3 w-3" />
                  <span>Thêm lỗi thường gặp</span>
                </Button>
              </div>

              <div className="space-y-2">
                {editDontList.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <span className="text-rose-600 font-bold text-xs shrink-0 w-4 text-center">✕</span>
                    <Input
                      value={item}
                      onChange={(e) => handleUpdateDontItem(idx, e.target.value)}
                      placeholder={`Lỗi thường gặp #${idx + 1}...`}
                      className="h-7 text-xs bg-background flex-1"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveDontItem(idx)}
                      className="p-1 rounded text-muted-foreground hover:text-destructive hover:bg-muted/80 cursor-pointer shrink-0"
                      title="Xóa dòng này"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Footer hành động của form */}
            <div className="flex items-center justify-end gap-2 pt-2 border-t border-border/50">
              <Button
                size="sm"
                variant="ghost"
                onClick={handleCancelEdit}
                className="h-7 text-xs px-3 cursor-pointer"
              >
                Hủy
              </Button>
              <Button
                size="sm"
                onClick={handleSaveEdit}
                className="h-7 text-xs px-4 gap-1.5 cursor-pointer font-medium"
              >
                <Check className="h-3.5 w-3.5" />
                <span>{isNew ? 'Tạo tiêu chí chuẩn 5 sao' : 'Lưu thay đổi quy chuẩn'}</span>
              </Button>
            </div>
          </div>
        ) : (
          /* CHẾ ĐỘ XEM RỘNG RÃI (VIEW MODE) */
          <div className="p-5 md:p-6 grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6 max-h-[85vh] overflow-y-auto">
            {/* CỘT TRÁI: HÌNH ẢNH & VIDEO MẪU RỘNG RÃI */}
            <div className="flex flex-col gap-3">
              <div className="relative aspect-16/10 w-full rounded-xl overflow-hidden border border-border bg-black/95 flex items-center justify-center shadow-xs">
                {showVideo && currentData.sampleVideo ? (
                  <video
                    src={currentData.sampleVideo}
                    controls
                    autoPlay
                    className="w-full h-full object-contain"
                  />
                ) : photos[selectedPhotoIdx] ? (
                  <img
                    src={photos[selectedPhotoIdx]}
                    alt={currentData.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <p className="text-xs text-muted-foreground">Chưa có ảnh mẫu</p>
                )}

                {/* Nút phát video hướng dẫn đè lên ảnh */}
                {!showVideo && hasVideo && (
                  <button
                    type="button"
                    onClick={() => setShowVideo(true)}
                    className="absolute inset-0 bg-black/35 hover:bg-black/50 transition-colors flex flex-col items-center justify-center gap-2 text-white cursor-pointer group"
                    title="Bấm để phát video mẫu hướng dẫn"
                  >
                    <div className="w-14 h-14 rounded-full bg-primary/95 text-primary-foreground flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform">
                      <Play className="h-6 w-6 fill-white translate-x-0.5" />
                    </div>
                    <span className="text-xs font-semibold bg-black/70 px-3 py-1 rounded-full backdrop-blur-xs">
                      Xem video hướng dẫn
                    </span>
                  </button>
                )}
              </div>

              {/* Dải ảnh Thumbnail to rõ (khi có > 1 ảnh hoặc có video) */}
              {(photos.length > 1 || hasVideo) && (
                <div className="flex items-center gap-2 overflow-x-auto pb-1">
                  {hasVideo && (
                    <button
                      type="button"
                      onClick={() => setShowVideo(true)}
                      className={cn(
                        'relative h-14 w-20 shrink-0 rounded-lg overflow-hidden border transition-all cursor-pointer bg-neutral-900 flex flex-col items-center justify-center text-white',
                        showVideo
                          ? 'border-primary ring-2 ring-primary/40'
                          : 'border-border opacity-70 hover:opacity-100'
                      )}
                    >
                      <Film className="h-4 w-4 text-amber-400 mb-0.5" />
                      <span className="text-[10px] font-bold">Video</span>
                    </button>
                  )}

                  {photos.map((url, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        setShowVideo(false)
                        setSelectedPhotoIdx(idx)
                      }}
                      className={cn(
                        'relative h-14 w-20 shrink-0 rounded-lg overflow-hidden border transition-all cursor-pointer',
                        !showVideo && selectedPhotoIdx === idx
                          ? 'border-primary ring-2 ring-primary/40'
                          : 'border-border opacity-70 hover:opacity-100'
                      )}
                    >
                      <img
                        src={url}
                        alt={`Ảnh mẫu ${idx + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* CỘT PHẢI: QUY CHUẨN ĐẠT & LỖI THƯỜNG GẶP RÕ RÀNG */}
            <div className="flex flex-col gap-3.5 text-left">
              {/* Yêu cầu tiêu chuẩn vận hành */}
              <div className="p-3.5 px-4 rounded-xl border border-primary/25 bg-primary/5 space-y-1">
                <span className="text-[11px] font-bold text-primary uppercase tracking-wider block">
                  Yêu cầu tiêu chuẩn
                </span>
                <p className="text-sm text-foreground font-medium leading-relaxed">
                  {currentData.requirement || currentData.standardDescription}
                </p>
              </div>

              {/* Tiêu chuẩn Đạt (Chuẩn 5 sao) */}
              <div className="p-3.5 px-4 rounded-xl border border-emerald-200 dark:border-emerald-900/60 bg-emerald-50/50 dark:bg-emerald-950/20 space-y-2">
                <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4" />
                  <span>Tiêu chuẩn Đạt (Chuẩn 5 sao)</span>
                </span>
                {currentData.doList.length > 0 ? (
                  <ul className="space-y-1.5 text-sm text-foreground/90">
                    {currentData.doList.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2 leading-relaxed">
                        <span className="text-emerald-600 dark:text-emerald-400 font-bold text-sm shrink-0">✓</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-xs text-muted-foreground italic">Chưa cấu hình tiêu chuẩn đạt. Bấm &quot;Sửa quy chuẩn&quot; để bổ sung.</p>
                )}
              </div>

              {/* Lỗi thường gặp (Không đạt) */}
              <div className="p-3.5 px-4 rounded-xl border border-rose-200 dark:border-rose-900/60 bg-rose-50/50 dark:bg-rose-950/20 space-y-2">
                <span className="text-xs font-bold text-rose-700 dark:text-rose-400 uppercase tracking-wider flex items-center gap-1.5">
                  <XCircle className="h-4 w-4" />
                  <span>Lỗi thường gặp (Không đạt)</span>
                </span>
                {currentData.dontList.length > 0 ? (
                  <ul className="space-y-1.5 text-sm text-foreground/90">
                    {currentData.dontList.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2 leading-relaxed">
                        <span className="text-rose-600 dark:text-rose-400 font-bold text-sm shrink-0">✕</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-xs text-muted-foreground italic">Chưa cấu hình danh sách lỗi. Bấm &quot;Sửa quy chuẩn&quot; để bổ sung.</p>
                )}
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
