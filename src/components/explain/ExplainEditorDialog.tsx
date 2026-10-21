'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Plus, Trash2, Link as LinkIcon, Sparkles, X } from 'lucide-react'
import { toast } from 'sonner'
import type { ExplainTopic, DocumentLink } from './explainTypes'

interface RectPos {
  top: number
  left: number
  width: number
  height: number
}

interface ExplainEditorDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  screenId: string
  initialData?: Partial<ExplainTopic> | null
  targetRect?: RectPos | null
  onSaved: (topic: ExplainTopic) => void
}

export function ExplainEditorDialog({
  open,
  onOpenChange,
  screenId,
  initialData,
  targetRect,
  onSaved,
}: ExplainEditorDialogProps) {
  const [title, setTitle] = useState('')
  const [category, setCategory] = useState('Nghiệp vụ cốt lõi')
  const [badgeLabel, setBadgeLabel] = useState('')
  const [targetSelector, setTargetSelector] = useState('')
  const [what, setWhat] = useState('')
  const [why, setWhy] = useState('')
  const [who, setWho] = useState('')
  const [rules, setRules] = useState<string[]>([''])
  const [documentLinks, setDocumentLinks] = useState<DocumentLink[]>([])
  const [userStory, setUserStory] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    const handle = requestAnimationFrame(() => {
      if (initialData) {
        setTitle(initialData.title || '')
        setCategory(initialData.category || 'Nghiệp vụ cốt lõi')
        setBadgeLabel(initialData.badgeLabel || '')
        setTargetSelector(initialData.targetSelector || '')
        setWhat(initialData.what || '')
        setWhy(initialData.why || '')
        setWho(initialData.who || '')
        setRules(initialData.rules && initialData.rules.length > 0 ? initialData.rules : [''])
        setDocumentLinks(initialData.documentLinks || [])
        setUserStory(initialData.userStory || '')
      } else {
        setTitle('')
        setCategory('Nghiệp vụ cốt lõi')
        setBadgeLabel('')
        setTargetSelector('')
        setWhat('')
        setWhy('')
        setWho('')
        setRules([''])
        setDocumentLinks([])
        setUserStory('')
      }
    })
    return () => cancelAnimationFrame(handle)
  }, [initialData, open])

  // Thêm / xóa Rule
  const handleAddRule = () => {
    setRules((prev) => [...prev, ''])
  }

  const handleUpdateRule = (index: number, val: string) => {
    setRules((prev) => {
      const next = [...prev]
      next[index] = val
      return next
    })
  }

  const handleRemoveRule = (index: number) => {
    setRules((prev) => prev.filter((_, i) => i !== index))
  }

  // Thêm / xóa Link tài liệu
  const handleAddLink = () => {
    setDocumentLinks((prev) => [...prev, { label: '', url: '' }])
  }

  const handleUpdateLink = (index: number, field: 'label' | 'url', val: string) => {
    setDocumentLinks((prev) => {
      const next = [...prev]
      next[index] = { ...next[index], [field]: val }
      return next
    })
  }

  const handleRemoveLink = (index: number) => {
    setDocumentLinks((prev) => prev.filter((_, i) => i !== index))
  }

  const handleSave = async () => {
    if (!title.trim()) {
      toast.error('Vui lòng nhập tiêu đề nghiệp vụ!')
      return
    }

    const topicId = initialData?.id || `topic_${Date.now()}`
    const filteredRules = rules.map((r) => r.trim()).filter(Boolean)
    const filteredLinks = documentLinks.filter((l) => l.url.trim())

    const payload: ExplainTopic = {
      id: topicId,
      title: title.trim(),
      category: category.trim() || 'Nghiệp vụ',
      badgeLabel: badgeLabel.trim() || undefined,
      targetSelector: targetSelector.trim() || undefined,
      what: what.trim(),
      why: why.trim(),
      who: who.trim(),
      rules: filteredRules,
      documentLinks: filteredLinks,
      userStory: userStory.trim() || undefined,
    }

    setIsSubmitting(true)
    try {
      const res = await fetch('/api/explain-specs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          screenId,
          topic: payload,
        }),
      })

      const json = await res.json()
      if (!res.ok || !json.success) {
        throw new Error(json.error || 'Lỗi khi lưu dữ liệu')
      }

      toast.success('Đã lưu thuyết minh nghiệp vụ thành công!')
      onSaved(payload)
      onOpenChange(false)
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Không thể lưu thuyết minh'
      toast.error(message)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!open) return null

  // Tính toán vị trí Popover bám sát đối tượng (Không có lớp phủ mờ)
  const popoverStyle: React.CSSProperties = {}
  if (targetRect) {
    const spaceBelow = window.innerHeight - (targetRect.top + targetRect.height)
    const spaceAbove = targetRect.top

    if (spaceBelow > 450 || spaceBelow > spaceAbove) {
      popoverStyle.top = `${Math.min(window.innerHeight - 520, targetRect.top + targetRect.height + 8)}px`
    } else {
      popoverStyle.bottom = `${Math.max(16, window.innerHeight - targetRect.top + 8)}px`
    }

    const desiredLeft = targetRect.left
    const maxLeft = window.innerWidth - 460
    popoverStyle.left = `${Math.max(16, Math.min(desiredLeft, maxLeft))}px`
  } else {
    popoverStyle.top = '60px'
    popoverStyle.right = '24px'
  }

  return (
    <div
      data-explain-ui="true"
      style={popoverStyle}
      className="absolute pointer-events-auto z-[9996] flex flex-col w-[440px] max-h-[85vh] rounded-xl border border-amber-500/50 bg-background/95 shadow-2xl backdrop-blur-md animate-in fade-in zoom-in-95 text-foreground overflow-hidden"
    >
      {/* Popover Header */}
      <div className="flex items-center justify-between border-b border-border/80 bg-muted/40 px-4 py-2.5 rounded-t-xl shrink-0">
        <div className="flex items-center gap-2 min-w-0">
          <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-amber-500/20 text-amber-700 dark:text-amber-300">
            <Sparkles className="h-3 w-3" />
          </span>
          <span className="text-xs font-bold text-foreground truncate">
            {initialData?.id ? 'Chỉnh sửa Thuyết minh' : 'Tạo mới Thuyết minh Đối tượng'}
          </span>
        </div>

        <Button
          type="button"
          variant="ghost"
          size="icon-xs"
          onClick={() => onOpenChange(false)}
          className="text-muted-foreground hover:text-foreground cursor-pointer rounded-full"
          title="Đóng (Hủy)"
        >
          <X className="h-3.5 w-3.5" />
        </Button>
      </div>

      {/* Popover Body Content */}
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3 text-xs">
        {/* Row 1: Tiêu đề + Phân loại */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          <div className="sm:col-span-2 space-y-1">
            <label className="font-semibold text-foreground text-[11px]">Tiêu đề nghiệp vụ *</label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="VD: Nút Xuất dữ liệu, Cột Học viên..."
              className="h-7 text-xs"
            />
          </div>
          <div className="space-y-1">
            <label className="font-semibold text-foreground text-[11px]">Phân loại</label>
            <Input
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              placeholder="KPI, Bộ lọc..."
              className="h-7 text-xs"
            />
          </div>
        </div>

        {/* Row 2: Selector + Mã US */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          <div className="space-y-1">
            <label className="font-semibold text-foreground text-[11px]">Target Selector</label>
            <Input
              value={targetSelector}
              onChange={(e) => setTargetSelector(e.target.value)}
              placeholder="Selector DOM..."
              className="h-7 text-xs font-mono"
            />
          </div>
          <div className="space-y-1">
            <label className="font-semibold text-foreground text-[11px]">Mã User Story</label>
            <Input
              value={userStory}
              onChange={(e) => setUserStory(e.target.value)}
              placeholder="VD: US-CARE-01-01..."
              className="h-7 text-xs font-mono"
            />
          </div>
        </div>

        {/* 1. WHAT */}
        <div className="space-y-1">
          <label className="font-semibold text-sky-700 dark:text-sky-400 uppercase tracking-wider text-[10px]">
            1. WHAT - Đây là gì trên giao diện?
          </label>
          <Textarea
            value={what}
            onChange={(e) => setWhat(e.target.value)}
            placeholder="Mô tả đối tượng này là gì, gồm những thông tin nào..."
            className="text-xs min-h-[52px]"
          />
        </div>

        {/* 2. WHY */}
        <div className="space-y-1">
          <label className="font-semibold text-amber-800 dark:text-amber-300 uppercase tracking-wider text-[10px]">
            2. WHY - Ý đồ thiết kế của PO
          </label>
          <Textarea
            value={why}
            onChange={(e) => setWhy(e.target.value)}
            placeholder="Tại sao lại thiết kế như vậy? Giải quyết nỗi đau gì của người dùng..."
            className="text-xs min-h-[52px]"
          />
        </div>

        {/* 3. WHO */}
        <div className="space-y-1">
          <label className="font-semibold text-purple-700 dark:text-purple-400 uppercase tracking-wider text-[10px]">
            3. WHO - Ai sử dụng?
          </label>
          <Input
            value={who}
            onChange={(e) => setWho(e.target.value)}
            placeholder="VD: Chuyên viên CS, Quản lý chi nhánh (BM)..."
            className="h-7 text-xs"
          />
        </div>

        {/* 4. BUSINESS RULES */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="font-semibold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider text-[10px]">
              4. BUSINESS RULES - Quy tắc ngầm định
            </label>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleAddRule}
              className="h-5 text-[10px] gap-0.5 text-primary hover:bg-primary/10 px-1.5"
            >
              <Plus className="h-3 w-3" />
              <span>Thêm</span>
            </Button>
          </div>
          <div className="space-y-1">
            {rules.map((rule, idx) => (
              <div key={idx} className="flex items-center gap-1">
                <span className="text-[10px] text-muted-foreground w-3 text-center font-mono">
                  {idx + 1}
                </span>
                <Input
                  value={rule}
                  onChange={(e) => handleUpdateRule(idx, e.target.value)}
                  placeholder="Nhập quy tắc..."
                  className="h-6 text-xs flex-1"
                />
                {rules.length > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-xs"
                    onClick={() => handleRemoveRule(idx)}
                    className="text-muted-foreground hover:text-destructive h-6 w-6"
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* 5. GẮN LINK TÀI LIỆU */}
        <div className="space-y-1.5 border-t border-border pt-2.5">
          <div className="flex items-center justify-between">
            <label className="font-semibold text-foreground text-[10px] flex items-center gap-1">
              <LinkIcon className="h-3 w-3 text-primary" />
              <span>Link Tài liệu / Confluence / Figma</span>
            </label>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleAddLink}
              className="h-5 text-[10px] gap-0.5 text-primary hover:bg-primary/10 px-1.5"
            >
              <Plus className="h-3 w-3" />
              <span>Gắn link</span>
            </Button>
          </div>

          {documentLinks.length === 0 ? (
            <p className="text-[10px] text-muted-foreground italic">
              Chưa có link tài liệu nào được gắn.
            </p>
          ) : (
            <div className="space-y-1">
              {documentLinks.map((link, idx) => (
                <div key={idx} className="grid grid-cols-12 gap-1 items-center">
                  <Input
                    value={link.label}
                    onChange={(e) => handleUpdateLink(idx, 'label', e.target.value)}
                    placeholder="Tên tài liệu..."
                    className="h-6 text-xs col-span-5"
                  />
                  <Input
                    value={link.url}
                    onChange={(e) => handleUpdateLink(idx, 'url', e.target.value)}
                    placeholder="URL https://..."
                    className="h-6 text-xs col-span-6 font-mono"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-xs"
                    onClick={() => handleRemoveLink(idx)}
                    className="col-span-1 text-muted-foreground hover:text-destructive h-6 w-6 justify-self-center"
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Popover Footer */}
      <div className="flex items-center justify-between border-t border-border bg-muted/40 px-4 py-2 rounded-b-xl shrink-0">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => onOpenChange(false)}
          className="h-7 text-xs px-2.5"
        >
          Hủy
        </Button>
        <Button
          type="button"
          variant="default"
          size="sm"
          onClick={handleSave}
          disabled={isSubmitting}
          className="h-7 text-xs px-3 bg-amber-500 hover:bg-amber-600 text-amber-950 font-semibold"
        >
          {isSubmitting ? 'Đang lưu...' : 'Lưu Thuyết minh'}
        </Button>
      </div>
    </div>
  )
}
