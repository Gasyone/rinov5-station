'use client'

import React, { useState, useMemo } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Sparkles,
  Pencil,
  Plus,
  Trash2,
  Check,
  X,
  BookOpen,
  CheckCircle2,
  XCircle,
  HelpCircle,
} from 'lucide-react'
import { toast } from 'sonner'
import {
  getStandardForTarget,
  type DailyStandardMedia,
} from './dailyCheckStandards'
import {
  DailyCheckFlatMediaManager,
  convertStandardToFlatMedia,
  convertFlatMediaToStandard,
  type FlatMediaItem,
} from './DailyCheckFlatMediaManager'
import { DailyCheckMediaLightbox } from './DailyCheckMediaLightbox'

// ─────────────────────────────────────────────────────────────
// 1. SUB-COMPONENT: FORM TẠO MỚI TIÊU CHÍ & QUY CHUẨN 5 SAO
// ─────────────────────────────────────────────────────────────
interface CreateFormProps {
  group: string
  onCancel: () => void
  onSave: (
    name: string,
    requirement: string,
    media: Partial<DailyStandardMedia>
  ) => void
}

function RightPanelCreateForm({ group, onCancel, onSave }: CreateFormProps) {
  const [name, setName] = useState('')
  const [requirement, setRequirement] = useState('')
  const [mediaItems, setMediaItems] = useState<FlatMediaItem[]>([])
  const [previewMedia, setPreviewMedia] = useState<FlatMediaItem | null>(null)

  const [doList, setDoList] = useState<string[]>([
    'Kiểm tra trực quan và đảm bảo trạng thái hoạt động tốt',
  ])
  const [dontList, setDontList] = useState<string[]>([
    'Để bám bụi bẩn hoặc xảy ra hư hỏng không báo cáo',
  ])

  const handleAddDo = () => setDoList((prev) => [...prev, ''])
  const handleUpdateDo = (idx: number, val: string) => {
    setDoList((prev) => {
      const next = [...prev]
      next[idx] = val
      return next
    })
  }
  const handleRemoveDo = (idx: number) => {
    setDoList((prev) => prev.filter((_, i) => i !== idx))
  }

  const handleAddDont = () => setDontList((prev) => [...prev, ''])
  const handleUpdateDont = (idx: number, val: string) => {
    setDontList((prev) => {
      const next = [...prev]
      next[idx] = val
      return next
    })
  }
  const handleRemoveDont = (idx: number) => {
    setDontList((prev) => prev.filter((_, i) => i !== idx))
  }

  const handleSubmit = () => {
    const trimmedName = name.trim()
    if (!trimmedName) {
      toast.error('Vui lòng nhập tên tiêu chí / nhiệm vụ.')
      return
    }

    const trimmedReq = requirement.trim() || 'Theo tiêu chuẩn vận hành 5 sao của cơ sở.'
    const cleanedDoList = doList.map((s) => s.trim()).filter(Boolean)
    const cleanedDontList = dontList.map((s) => s.trim()).filter(Boolean)

    const { sampleAvatar, samplePhotos, sampleVideo } = convertFlatMediaToStandard(mediaItems)

    const media: Partial<DailyStandardMedia> = {
      title: trimmedName,
      group,
      requirement: trimmedReq,
      standardDescription: trimmedReq,
      sampleAvatar,
      samplePhotos,
      sampleVideo,
      doList: cleanedDoList.length > 0 ? cleanedDoList : ['Kiểm tra và duy trì chuẩn sạch đẹp.'],
      dontList: cleanedDontList.length > 0 ? cleanedDontList : ['Bỏ qua tiêu chuẩn không kiểm tra.'],
    }

    onSave(trimmedName, trimmedReq, media)
  }

  return (
    <div className="flex flex-col h-full overflow-hidden text-left text-xs bg-background">
      {/* Header */}
      <div className="p-3 px-4.5 border-b border-border/70 bg-muted/20 flex items-center justify-between gap-3 shrink-0">
        <div className="flex items-center gap-2 min-w-0">
          <Sparkles className="h-4 w-4 text-primary shrink-0" />
          <span className="text-sm font-medium text-foreground truncate">
            Thêm tiêu chí &amp; Quy chuẩn mới
          </span>
          <Badge variant="outline" className="text-[10px] font-normal border-border/80 shrink-0">
            Khu vực: {group}
          </Badge>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          <Button size="sm" variant="ghost" onClick={onCancel} className="h-6.5 text-xs px-2.5 font-normal">
            <X className="h-3 w-3 mr-1" />
            <span>Hủy</span>
          </Button>
          <Button size="sm" onClick={handleSubmit} className="h-6.5 text-xs px-3 font-normal">
            <Check className="h-3 w-3 mr-1" />
            <span>Lưu tiêu chí</span>
          </Button>
        </div>
      </div>

      {/* Body Form */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {/* 1. Tên tiêu chí */}
        <div>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Tên tiêu chí / nhiệm vụ kiểm tra... *"
            className="text-xs h-7.5 bg-background font-normal"
            autoFocus
          />
        </div>

        {/* 2. Mô tả yêu cầu tiêu chuẩn 5 sao (ô nhập 2 dòng) */}
        <div>
          <Textarea
            value={requirement}
            onChange={(e) => setRequirement(e.target.value)}
            placeholder="Mô tả / Yêu cầu tiêu chuẩn 5 sao..."
            rows={2}
            className="text-xs bg-background font-normal min-h-[50px] resize-none leading-relaxed"
          />
        </div>

        {/* 2. Tiêu chuẩn Đạt & Lỗi thường gặp (Song song 2 cột) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {/* Cột Đạt */}
          <div className="p-2.5 rounded-lg border border-emerald-300 dark:border-emerald-800 bg-emerald-50/40 dark:bg-emerald-950/20 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-medium text-emerald-800 dark:text-emerald-300 flex items-center gap-1">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                <span>Tiêu chuẩn Đạt (phải làm đúng)</span>
              </span>
              <Button
                size="sm"
                variant="outline"
                onClick={handleAddDo}
                className="h-5 text-[10px] gap-1 px-1.5 text-emerald-700 border-emerald-300 hover:bg-emerald-100 dark:border-emerald-700 cursor-pointer font-normal"
              >
                <Plus className="h-2.5 w-2.5" />
                <span>Thêm</span>
              </Button>
            </div>

            <div className="space-y-1.5 max-h-[140px] overflow-y-auto pr-0.5">
              {doList.map((item, idx) => (
                <div key={idx} className="flex items-center gap-1.5">
                  <span className="text-emerald-600 text-xs shrink-0 w-3 text-center">✓</span>
                  <Input
                    value={item}
                    onChange={(e) => handleUpdateDo(idx, e.target.value)}
                    placeholder={`Tiêu chí đạt #${idx + 1}...`}
                    className="h-6 text-xs bg-background flex-1 font-normal"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveDo(idx)}
                    className="p-0.5 rounded text-muted-foreground hover:text-destructive cursor-pointer shrink-0"
                    title="Xóa dòng"
                  >
                    <Trash2 className="h-3 w-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Cột Lỗi */}
          <div className="p-2.5 rounded-lg border border-rose-300 dark:border-rose-800 bg-rose-50/40 dark:bg-rose-950/20 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-medium text-rose-800 dark:text-rose-300 flex items-center gap-1">
                <XCircle className="h-3.5 w-3.5 text-rose-600 dark:text-rose-400" />
                <span>Lỗi thường gặp (không đạt)</span>
              </span>
              <Button
                size="sm"
                variant="outline"
                onClick={handleAddDont}
                className="h-5 text-[10px] gap-1 px-1.5 text-rose-700 border-rose-300 hover:bg-rose-100 dark:border-rose-700 cursor-pointer font-normal"
              >
                <Plus className="h-2.5 w-2.5" />
                <span>Thêm</span>
              </Button>
            </div>

            <div className="space-y-1.5 max-h-[140px] overflow-y-auto pr-0.5">
              {dontList.map((item, idx) => (
                <div key={idx} className="flex items-center gap-1.5">
                  <span className="text-rose-600 text-xs shrink-0 w-3 text-center">✕</span>
                  <Input
                    value={item}
                    onChange={(e) => handleUpdateDont(idx, e.target.value)}
                    placeholder={`Lỗi thường gặp #${idx + 1}...`}
                    className="h-6 text-xs bg-background flex-1 font-normal"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveDont(idx)}
                    className="p-0.5 rounded text-muted-foreground hover:text-destructive cursor-pointer shrink-0"
                    title="Xóa dòng"
                  >
                    <Trash2 className="h-3 w-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 3. Tư liệu mẫu: Phẳng, không viền, không nền */}
        <div className="pt-1">
          <DailyCheckFlatMediaManager
            items={mediaItems}
            onChange={setMediaItems}
            onPreview={(it) => setPreviewMedia(it)}
          />
        </div>
      </div>

      {/* Lightbox xem phóng to nếu bấm thumbnail */}
      <DailyCheckMediaLightbox media={previewMedia} onClose={() => setPreviewMedia(null)} />
    </div>
  )
}

// ─────────────────────────────────────────────────────────────
// 2. SUB-COMPONENT: FORM CHỈNH SỬA TIÊU CHUẨN ĐANG CÓ
// ─────────────────────────────────────────────────────────────
interface EditFormProps {
  item: { group: string; name: string; requirement?: string }
  onCancel: () => void
  onSave: (
    newName: string,
    newReq: string,
    media: Partial<DailyStandardMedia>
  ) => void
}

function RightPanelEditForm({ item, onCancel, onSave }: EditFormProps) {
  const initialStandard = getStandardForTarget({
    type: 'item',
    group: item.group,
    name: item.name,
    requirement: item.requirement,
  })

  const [name, setName] = useState(item.name)
  const [requirement, setRequirement] = useState(
    item.requirement || initialStandard.requirement || ''
  )
  const [mediaItems, setMediaItems] = useState<FlatMediaItem[]>(() =>
    convertStandardToFlatMedia(initialStandard)
  )
  const [previewMedia, setPreviewMedia] = useState<FlatMediaItem | null>(null)

  const [doList, setDoList] = useState<string[]>(
    initialStandard.doList && initialStandard.doList.length > 0
      ? initialStandard.doList
      : ['Kiểm tra trực quan và duy trì chuẩn sạch đẹp.']
  )
  const [dontList, setDontList] = useState<string[]>(
    initialStandard.dontList && initialStandard.dontList.length > 0
      ? initialStandard.dontList
      : ['Bỏ qua tiêu chuẩn không kiểm tra.']
  )

  const handleAddDo = () => setDoList((prev) => [...prev, ''])
  const handleUpdateDo = (idx: number, val: string) => {
    setDoList((prev) => {
      const next = [...prev]
      next[idx] = val
      return next
    })
  }
  const handleRemoveDo = (idx: number) => {
    setDoList((prev) => prev.filter((_, i) => i !== idx))
  }

  const handleAddDont = () => setDontList((prev) => [...prev, ''])
  const handleUpdateDont = (idx: number, val: string) => {
    setDontList((prev) => {
      const next = [...prev]
      next[idx] = val
      return next
    })
  }
  const handleRemoveDont = (idx: number) => {
    setDontList((prev) => prev.filter((_, i) => i !== idx))
  }

  const handleSubmit = () => {
    const trimmedName = name.trim()
    if (!trimmedName) {
      toast.error('Vui lòng nhập tên tiêu chí / nhiệm vụ.')
      return
    }

    const trimmedReq = requirement.trim() || 'Theo tiêu chuẩn vận hành 5 sao của cơ sở.'
    const cleanedDoList = doList.map((s) => s.trim()).filter(Boolean)
    const cleanedDontList = dontList.map((s) => s.trim()).filter(Boolean)

    const { sampleAvatar, samplePhotos, sampleVideo } = convertFlatMediaToStandard(mediaItems)

    const media: Partial<DailyStandardMedia> = {
      title: trimmedName,
      group: item.group,
      requirement: trimmedReq,
      standardDescription: trimmedReq,
      sampleAvatar,
      samplePhotos,
      sampleVideo,
      doList: cleanedDoList,
      dontList: cleanedDontList,
    }

    onSave(trimmedName, trimmedReq, media)
  }

  return (
    <div className="flex flex-col h-full overflow-hidden text-left text-xs bg-background">
      {/* Header */}
      <div className="p-3 px-4.5 border-b border-border/70 bg-muted/20 flex items-center justify-between gap-3 shrink-0">
        <div className="flex items-center gap-2 min-w-0">
          <Pencil className="h-4 w-4 text-primary shrink-0" />
          <span className="text-sm font-medium text-foreground truncate">
            {item.name}
          </span>
          <Badge variant="outline" className="text-[10px] font-normal border-border/80 shrink-0">
            Khu vực: {item.group}
          </Badge>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          <Button size="sm" variant="ghost" onClick={onCancel} className="h-6.5 text-xs px-2.5 font-normal">
            <X className="h-3 w-3 mr-1" />
            <span>Hủy</span>
          </Button>
          <Button size="sm" onClick={handleSubmit} className="h-6.5 text-xs px-3 font-normal">
            <Check className="h-3 w-3 mr-1" />
            <span>Lưu thay đổi</span>
          </Button>
        </div>
      </div>

      {/* Body Form */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {/* 1. Tên tiêu chí */}
        <div>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Tên tiêu chí / nhiệm vụ kiểm tra... *"
            className="text-xs h-7.5 bg-background font-normal"
          />
        </div>

        {/* 2. Mô tả yêu cầu tiêu chuẩn 5 sao (ô nhập 2 dòng) */}
        <div>
          <Textarea
            value={requirement}
            onChange={(e) => setRequirement(e.target.value)}
            placeholder="Mô tả / Yêu cầu tiêu chuẩn 5 sao..."
            rows={2}
            className="text-xs bg-background font-normal min-h-[50px] resize-none leading-relaxed"
          />
        </div>

        {/* 2. Tiêu chuẩn Đạt & Lỗi thường gặp (Song song 2 cột) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {/* Cột Đạt */}
          <div className="p-2.5 rounded-lg border border-emerald-300 dark:border-emerald-800 bg-emerald-50/40 dark:bg-emerald-950/20 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-medium text-emerald-800 dark:text-emerald-300 flex items-center gap-1">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                <span>Tiêu chuẩn Đạt (phải làm đúng)</span>
              </span>
              <Button
                size="sm"
                variant="outline"
                onClick={handleAddDo}
                className="h-5 text-[10px] gap-1 px-1.5 text-emerald-700 border-emerald-300 hover:bg-emerald-100 dark:border-emerald-700 cursor-pointer font-normal"
              >
                <Plus className="h-2.5 w-2.5" />
                <span>Thêm</span>
              </Button>
            </div>

            <div className="space-y-1.5 max-h-[140px] overflow-y-auto pr-0.5">
              {doList.map((d, idx) => (
                <div key={idx} className="flex items-center gap-1.5">
                  <span className="text-emerald-600 text-xs shrink-0 w-3 text-center">✓</span>
                  <Input
                    value={d}
                    onChange={(e) => handleUpdateDo(idx, e.target.value)}
                    placeholder={`Tiêu chí đạt #${idx + 1}...`}
                    className="h-6 text-xs bg-background flex-1 font-normal"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveDo(idx)}
                    className="p-0.5 rounded text-muted-foreground hover:text-destructive cursor-pointer shrink-0"
                    title="Xóa dòng"
                  >
                    <Trash2 className="h-3 w-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Cột Lỗi */}
          <div className="p-2.5 rounded-lg border border-rose-300 dark:border-rose-800 bg-rose-50/40 dark:bg-rose-950/20 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-medium text-rose-800 dark:text-rose-300 flex items-center gap-1">
                <XCircle className="h-3.5 w-3.5 text-rose-600 dark:text-rose-400" />
                <span>Lỗi thường gặp (không đạt)</span>
              </span>
              <Button
                size="sm"
                variant="outline"
                onClick={handleAddDont}
                className="h-5 text-[10px] gap-1 px-1.5 text-rose-700 border-rose-300 hover:bg-rose-100 dark:border-rose-700 cursor-pointer font-normal"
              >
                <Plus className="h-2.5 w-2.5" />
                <span>Thêm</span>
              </Button>
            </div>

            <div className="space-y-1.5 max-h-[140px] overflow-y-auto pr-0.5">
              {dontList.map((d, idx) => (
                <div key={idx} className="flex items-center gap-1.5">
                  <span className="text-rose-600 text-xs shrink-0 w-3 text-center">✕</span>
                  <Input
                    value={d}
                    onChange={(e) => handleUpdateDont(idx, e.target.value)}
                    placeholder={`Lỗi thường gặp #${idx + 1}...`}
                    className="h-6 text-xs bg-background flex-1 font-normal"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveDont(idx)}
                    className="p-0.5 rounded text-muted-foreground hover:text-destructive cursor-pointer shrink-0"
                    title="Xóa dòng"
                  >
                    <Trash2 className="h-3 w-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 3. Tư liệu mẫu: Phẳng, không viền, không nền */}
        <div className="pt-1">
          <DailyCheckFlatMediaManager
            items={mediaItems}
            onChange={setMediaItems}
            onPreview={(it) => setPreviewMedia(it)}
          />
        </div>
      </div>

      {/* Lightbox xem phóng to nếu bấm thumbnail */}
      <DailyCheckMediaLightbox media={previewMedia} onClose={() => setPreviewMedia(null)} />
    </div>
  )
}

// ─────────────────────────────────────────────────────────────
// 3. SUB-COMPONENT: VIEW MODE (VIẾT THƯỜNG, ÍT IN ĐẬM, PHẲNG)
// ─────────────────────────────────────────────────────────────
interface ViewProps {
  item: { group: string; name: string; requirement?: string }
  onStartEdit: () => void
}

function RightPanelView({ item, onStartEdit }: ViewProps) {
  const standard = getStandardForTarget({
    type: 'item',
    group: item.group,
    name: item.name,
    requirement: item.requirement,
  })

  // Media items phẳng
  const mediaItems = useMemo(() => convertStandardToFlatMedia(standard), [standard])

  // State xem phóng to ảnh hoặc video khi bấm thumbnail
  const [previewMedia, setPreviewMedia] = useState<FlatMediaItem | null>(null)

  return (
    <div className="flex flex-col h-full overflow-hidden text-left bg-background text-xs">
      {/* 1. Header tinh gọn, chữ thường thanh thoát */}
      <div className="p-3 px-4.5 border-b border-border/70 bg-muted/20 flex items-center justify-between gap-3 shrink-0">
        <div className="flex items-center gap-2 min-w-0 flex-wrap">
          <span className="text-sm font-medium text-foreground truncate">
            {standard.title}
          </span>
          <Badge variant="outline" className="text-[10px] font-normal border-border/80 text-muted-foreground">
            Khu vực: {standard.group}
          </Badge>
          <Badge className="text-[10px] font-normal bg-primary/15 text-primary border-primary/30">
            Chuẩn 5 sao
          </Badge>
        </div>

        <Button
          size="sm"
          variant="outline"
          onClick={onStartEdit}
          className="h-6.5 text-xs gap-1.5 cursor-pointer font-normal hover:bg-muted text-foreground border-border/80 shrink-0"
          title="Chỉnh sửa mô tả, tiêu chuẩn đạt, lỗi thường gặp hoặc ảnh/video"
        >
          <Pencil className="h-3 w-3 text-primary" />
          <span>Sửa quy chuẩn</span>
        </Button>
      </div>

      {/* 2. Toàn bộ nội dung đưa lên trước, viết thường, vừa vặn trong 1 khung hình */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {/* Yêu cầu tiêu chuẩn vận hành */}
        <div className="p-2.5 px-3 rounded-lg border border-sky-200 dark:border-sky-900 bg-sky-50/50 dark:bg-sky-950/20 space-y-1">
          <div className="flex items-center gap-1.5 text-sky-800 dark:text-sky-300 font-medium text-[11px]">
            <BookOpen className="h-3.5 w-3.5 shrink-0 text-sky-600 dark:text-sky-400" />
            <span>Yêu cầu tiêu chuẩn vận hành</span>
          </div>
          <p className="text-foreground/90 text-xs leading-relaxed font-normal">
            {standard.requirement || 'Theo quy chuẩn vận hành 5 sao của cơ sở.'}
          </p>
          {standard.standardDescription && standard.standardDescription !== standard.requirement && (
            <p className="text-muted-foreground text-[11px] leading-relaxed font-normal">
              {standard.standardDescription}
            </p>
          )}
        </div>

        {/* 2 Cột Tiêu chuẩn Đạt & Lỗi thường gặp (Song song 2 bên) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* Cột Tiêu chuẩn Đạt */}
          <div className="p-3 rounded-lg border border-emerald-300 dark:border-emerald-800 bg-emerald-50/40 dark:bg-emerald-950/20 space-y-1.5">
            <div className="flex items-center gap-1.5 text-emerald-800 dark:text-emerald-300 font-medium text-[11px]">
              <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-emerald-600 dark:text-emerald-400" />
              <span>Tiêu chuẩn Đạt (chuẩn 5 sao)</span>
            </div>
            <ul className="space-y-1.5 pt-0.5">
              {standard.doList.map((item, idx) => (
                <li key={idx} className="flex items-start gap-1.5 text-foreground/85 text-xs leading-snug font-normal">
                  <span className="text-emerald-600 text-xs shrink-0">✓</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Cột Lỗi thường gặp */}
          <div className="p-3 rounded-lg border border-rose-300 dark:border-rose-800 bg-rose-50/40 dark:bg-rose-950/20 space-y-1.5">
            <div className="flex items-center gap-1.5 text-rose-800 dark:text-rose-300 font-medium text-[11px]">
              <XCircle className="h-3.5 w-3.5 shrink-0 text-rose-600 dark:text-rose-400" />
              <span>Lỗi thường gặp (không đạt)</span>
            </div>
            <ul className="space-y-1.5 pt-0.5">
              {standard.dontList.map((item, idx) => (
                <li key={idx} className="flex items-start gap-1.5 text-foreground/85 text-xs leading-snug font-normal">
                  <span className="text-rose-600 text-xs shrink-0">✕</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* 3. Tư liệu mẫu: Bỏ viền, bỏ nền, để phẳng hoàn toàn, preview to rõ */}
        <div className="pt-1">
          <DailyCheckFlatMediaManager
            items={mediaItems}
            readOnly={true}
            onPreview={(it) => setPreviewMedia(it)}
          />
        </div>
      </div>

      {/* Lightbox xem phóng to nếu bấm thumbnail */}
      <DailyCheckMediaLightbox media={previewMedia} onClose={() => setPreviewMedia(null)} />
    </div>
  )
}

// ─────────────────────────────────────────────────────────────
// 4. MAIN EXPORT: RIGHT PANEL ORCHESTRATOR
// ─────────────────────────────────────────────────────────────
export interface DailyCheckCatalogRightPanelProps {
  selectedItem: { group: string; name: string; requirement?: string } | null
  isCreating: boolean
  createGroup: string | null
  isEditing: boolean
  setIsEditing: (editing: boolean) => void
  onCancelCreate: () => void
  onSaveNewItem: (
    group: string,
    name: string,
    requirement: string,
    media: Partial<DailyStandardMedia>
  ) => void
  onUpdateItem: (
    group: string,
    oldName: string,
    newName: string,
    requirement: string,
    media: Partial<DailyStandardMedia>
  ) => void
}

export function DailyCheckCatalogRightPanel({
  selectedItem,
  isCreating,
  createGroup,
  isEditing,
  setIsEditing,
  onCancelCreate,
  onSaveNewItem,
  onUpdateItem,
}: DailyCheckCatalogRightPanelProps) {
  // 1. Chế độ tạo mới
  if (isCreating && createGroup) {
    return (
      <RightPanelCreateForm
        key={`create-${createGroup}`}
        group={createGroup}
        onCancel={onCancelCreate}
        onSave={(name, req, media) => onSaveNewItem(createGroup, name, req, media)}
      />
    )
  }

  // 2. Chế độ chỉnh sửa tiêu chuẩn
  if (isEditing && selectedItem) {
    return (
      <RightPanelEditForm
        key={`edit-${selectedItem.group}-${selectedItem.name}`}
        item={selectedItem}
        onCancel={() => setIsEditing(false)}
        onSave={(newName, req, media) => {
          onUpdateItem(selectedItem.group, selectedItem.name, newName, req, media)
          setIsEditing(false)
        }}
      />
    )
  }

  // 3. Chế độ xem tiêu chuẩn đầy đủ (Nội dung lên trước, ảnh phẳng ở dưới)
  if (selectedItem) {
    return (
      <RightPanelView
        key={`view-${selectedItem.group}-${selectedItem.name}`}
        item={selectedItem}
        onStartEdit={() => setIsEditing(true)}
      />
    )
  }

  // 4. Empty State khi chưa chọn mục nào
  return (
    <div className="flex flex-col items-center justify-center h-full p-8 text-center text-muted-foreground gap-3">
      <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
        <HelpCircle className="h-6 w-6 text-muted-foreground" />
      </div>
      <div className="space-y-1 max-w-sm">
        <p className="font-normal text-foreground text-sm">
          Chưa chọn tiêu chí nào
        </p>
        <p className="text-xs text-muted-foreground leading-relaxed font-normal">
          Vui lòng bấm chọn một tiêu chí trong danh sách bên trái để xem quy chuẩn 5 sao, hoặc bấm nút &quot;+ Thêm&quot; tại một khu vực để tạo mới.
        </p>
      </div>
    </div>
  )
}
