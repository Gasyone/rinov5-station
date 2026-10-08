'use client'

import React, { useState } from 'react'
import {
  Megaphone,
  Pin,
  AlertTriangle,
  Send,
} from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import { FieldLabel } from '@/components/shared'
import type { BulletinPost, BulletinCategory } from './homeTypes'

interface HomeCreatePostDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  userName?: string
  onCreatePost: (post: BulletinPost) => void
}

const CATEGORY_OPTIONS: { value: BulletinCategory; label: string; badgeColor: string }[] = [
  {
    value: 'urgent',
    label: 'Khẩn cấp',
    badgeColor: 'bg-rose-500/10 text-rose-700 dark:text-rose-400 border-rose-500/20',
  },
  {
    value: 'handover',
    label: 'Bàn giao ca',
    badgeColor: 'bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/20',
  },
  {
    value: 'operational',
    label: 'Vận hành cơ sở',
    badgeColor: 'bg-sky-500/10 text-sky-700 dark:text-sky-400 border-sky-500/20',
  },
  {
    value: 'notice',
    label: 'Thông báo chung',
    badgeColor: 'bg-purple-500/10 text-purple-700 dark:text-purple-400 border-purple-500/20',
  },
]

export function HomeCreatePostDialog({
  open,
  onOpenChange,
  userName = 'Quản lý cơ sở',
  onCreatePost,
}: HomeCreatePostDialogProps) {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [category, setCategory] = useState<BulletinCategory>('operational')
  const [isPinned, setIsPinned] = useState(false)
  const [isUrgent, setIsUrgent] = useState(false)
  const [actionLabel, setActionLabel] = useState('')
  const [actionUrl, setActionUrl] = useState('')

  const handleCategoryChange = (val: BulletinCategory) => {
    setCategory(val)
    if (val === 'urgent') {
      setIsUrgent(true)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim() || !content.trim()) return

    const selectedCat = CATEGORY_OPTIONS.find((c) => c.value === category) || CATEGORY_OPTIONS[2]

    const newPost: BulletinPost = {
      id: `post-${Date.now()}`,
      title: title.trim(),
      content: content.trim(),
      category,
      categoryLabel: selectedCat.label,
      authorName: userName,
      authorRole: 'Quản lý cơ sở',
      createdAt: 'Vừa xong',
      isPinned,
      isUrgent: isUrgent || category === 'urgent',
      badgeColor: selectedCat.badgeColor,
      actionLabel: actionLabel.trim() || undefined,
      actionUrl: actionUrl.trim() || undefined,
      acknowledgedCount: 1,
      isAcknowledged: true,
    }

    onCreatePost(newPost)
    // Reset form
    setTitle('')
    setContent('')
    setCategory('operational')
    setIsPinned(false)
    setIsUrgent(false)
    setActionLabel('')
    setActionUrl('')
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md sm:max-w-lg p-4 sm:p-5 rounded-xl">
        <DialogHeader className="space-y-1 pb-2 border-b border-border/50">
          <DialogTitle className="text-sm font-medium flex items-center gap-2 text-foreground">
            <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary/10 text-primary">
              <Megaphone className="w-3.5 h-3.5" />
            </div>
            <span>Đăng thông báo lên Bảng tin vận hành</span>
          </DialogTitle>
          <p className="text-xs text-muted-foreground font-normal">
            Bản tin sẽ được cập nhật tức thì đến toàn bộ nhân sự và giáo viên tại cơ sở.
          </p>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-3 pt-2">
          {/* Phân loại bản tin */}
          <div>
            <FieldLabel required>Phân loại thông tin</FieldLabel>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 mt-1">
              {CATEGORY_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => handleCategoryChange(opt.value)}
                  className={`px-2 py-1.5 rounded-lg border text-xs font-normal transition-all text-center cursor-pointer ${
                    category === opt.value
                      ? 'border-primary bg-primary/10 text-primary font-medium shadow-2xs'
                      : 'border-border/70 hover:bg-muted/50 text-muted-foreground'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Tiêu đề */}
          <div>
            <FieldLabel required>Tiêu đề thông báo</FieldLabel>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="VD: Cảnh báo sự cố máy chiếu phòng 204..."
              className="h-8 text-xs font-normal mt-1"
              required
            />
          </div>

          {/* Nội dung */}
          <div>
            <FieldLabel required>Nội dung chi tiết</FieldLabel>
            <Textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Nhập thông tin hướng dẫn, phân công, hoặc bàn giao công việc cụ thể..."
              rows={3}
              className="text-xs font-normal mt-1 resize-none"
              required
            />
          </div>

          {/* Tùy chọn ghim và highlight */}
          <div className="p-2 rounded-lg bg-muted/40 border border-border/50 space-y-2">
            <div className="flex items-center gap-2">
              <Checkbox
                id="isPinned"
                checked={isPinned}
                onCheckedChange={(checked) => setIsPinned(Boolean(checked))}
              />
              <label
                htmlFor="isPinned"
                className="text-xs font-normal text-foreground cursor-pointer flex items-center gap-1.5 select-none"
              >
                <Pin className="w-3.5 h-3.5 text-primary rotate-45" />
                <span>Ghim thông báo lên đầu bảng tin (Ưu tiên hiển thị)</span>
              </label>
            </div>

            <div className="flex items-center gap-2">
              <Checkbox
                id="isUrgent"
                checked={isUrgent || category === 'urgent'}
                onCheckedChange={(checked) => setIsUrgent(Boolean(checked))}
              />
              <label
                htmlFor="isUrgent"
                className="text-xs font-normal text-foreground cursor-pointer flex items-center gap-1.5 select-none"
              >
                <AlertTriangle className="w-3.5 h-3.5 text-rose-500" />
                <span className="text-rose-600 dark:text-rose-400 font-medium">
                  Đánh dấu Khẩn cấp (Làm nổi bật viền màu & nhãn cảnh báo)
                </span>
              </label>
            </div>
          </div>

          {/* Liên kết hành động (Tùy chọn) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <div>
              <FieldLabel>Nhãn nút thao tác (Tùy chọn)</FieldLabel>
              <Input
                value={actionLabel}
                onChange={(e) => setActionLabel(e.target.value)}
                placeholder="VD: Xem chi tiết ↗"
                className="h-8 text-xs font-normal mt-1"
              />
            </div>
            <div>
              <FieldLabel>Đường dẫn phân hệ (Tùy chọn)</FieldLabel>
              <Input
                value={actionUrl}
                onChange={(e) => setActionUrl(e.target.value)}
                placeholder="VD: /app/classes"
                className="h-8 text-xs font-normal mt-1"
              />
            </div>
          </div>

          <DialogFooter className="pt-2 gap-1.5 border-t border-border/50 sm:justify-end">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => onOpenChange(false)}
              className="h-8 text-xs font-normal px-3"
            >
              Hủy
            </Button>
            <Button
              type="submit"
              variant="default"
              size="sm"
              className="h-8 text-xs font-normal gap-1.5 px-3.5 shadow-2xs"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Đăng bảng tin</span>
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
