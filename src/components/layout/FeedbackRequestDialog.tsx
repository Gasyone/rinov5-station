'use client'

import { useState, useEffect } from 'react'
import {
  Calendar,
  Clock,
  Copy,
  Globe,
  Loader2,
  MessageSquarePlus,
  Send,
  User,
} from 'lucide-react'
import { toast } from 'sonner'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { useAuthStore } from '@/stores/useAuthStore'
import { useUIStore } from '@/stores/useUIStore'
import { screens } from '@/config/screens'
import { cn } from '@/lib/utils'

interface FeedbackRequestDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const FEEDBACK_TYPES = [
  { value: 'ui_ux', label: '🎨 Giao diện' },
  { value: 'feature', label: '⚙️ Tính năng' },
  { value: 'bug', label: '🐛 Báo lỗi' },
  { value: 'other', label: '💡 Ý kiến khác' },
]

export function FeedbackRequestDialog({ open, onOpenChange }: FeedbackRequestDialogProps) {
  const [currentUrl, setCurrentUrl] = useState('')
  const [currentTime, setCurrentTime] = useState('')
  const [type, setType] = useState('ui_ux')
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const user = useAuthStore((s) => s.user)
  const currentMenuId = useUIStore((s) => s.currentMenuId)
  const customHeaderTitle = useUIStore((s) => s.customHeaderTitle)

  const screenName =
    customHeaderTitle || (currentMenuId ? screens[currentMenuId]?.label || currentMenuId : 'Màn hình chung')

  // Auto-capture current URL and timestamp when dialog opens
  useEffect(() => {
    if (open) {
      if (typeof window !== 'undefined') {
        setCurrentUrl(window.location.href)
      }
      const now = new Date()
      const formattedTime = now.toLocaleString('vi-VN', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      })
      setCurrentTime(formattedTime)
    }
  }, [open])

  const handleCopyUrl = async () => {
    if (!currentUrl) return
    try {
      await navigator.clipboard.writeText(currentUrl)
      toast.success('Đã sao chép link màn hình!')
    } catch {
      toast.error('Không thể sao chép liên kết.')
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!description.trim()) {
      toast.error('Vui lòng nhập nội dung yêu cầu điều chỉnh!')
      return
    }

    setIsSubmitting(true)

    const payload = {
      title: title.trim() || `Yêu cầu điều chỉnh màn hình ${screenName}`,
      type,
      priority: 'normal',
      description: description.trim(),
      screenName,
      currentUrl: currentUrl || (typeof window !== 'undefined' ? window.location.href : ''),
      requesterName: user?.name || 'Người dùng Demo',
      requesterEmail: user?.email || 'N/A',
      requesterRole: user?.role || 'admin',
      createdAt: currentTime || new Date().toLocaleString('vi-VN'),
    }

    try {
      const res = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      const data = await res.json()

      if (res.ok && data.ok) {
        toast.success('🎉 Đã gửi yêu cầu thành công về nhóm Telegram!')
        setTitle('')
        setDescription('')
        setType('ui_ux')
        onOpenChange(false)
      } else {
        toast.error(data.error || 'Có lỗi xảy ra khi gửi tin nhắn.')
      }
    } catch (err) {
      console.error('Submit feedback error:', err)
      toast.error('Không thể kết nối đến máy chủ.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg p-5 sm:max-w-md">
        <DialogHeader className="space-y-1 pb-1 text-left">
          <div className="flex items-center gap-2 text-primary">
            <MessageSquarePlus className="h-5 w-5 text-primary" />
            <DialogTitle className="text-base font-bold text-foreground">
              Yêu cầu điều chỉnh
            </DialogTitle>
          </div>
          <DialogDescription className="text-xs text-muted-foreground">
            Nội dung kèm đường dẫn và thời gian sẽ được gửi trực tiếp về nhóm Telegram.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-3.5 pt-1">
          {/* Context box: Screen, Time, URL, User */}
          <div className="rounded-lg border border-border/80 bg-muted/40 p-2.5 text-xs space-y-1.5">
            <div className="flex items-center justify-between gap-2">
              <span className="font-medium text-muted-foreground">Màn hình:</span>
              <span className="font-semibold text-foreground px-1.5 py-0.5 rounded bg-primary/10 text-primary text-[11px]">
                {screenName}
              </span>
            </div>

            <div className="flex items-center justify-between gap-2">
              <span className="font-medium text-muted-foreground flex items-center gap-1">
                <Clock className="h-3 w-3 text-muted-foreground" />
                Thời gian:
              </span>
              <span className="font-medium text-foreground text-[11px] font-mono">
                {currentTime || 'Đang cập nhật...'}
              </span>
            </div>

            <div className="flex items-center justify-between gap-2">
              <span className="font-medium text-muted-foreground shrink-0 flex items-center gap-1">
                <Globe className="h-3 w-3 text-muted-foreground" />
                Đường dẫn:
              </span>
              <div className="flex items-center gap-1 min-w-0 flex-1 justify-end">
                <span className="truncate text-muted-foreground font-mono text-[10px] max-w-[200px]">
                  {currentUrl}
                </span>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={handleCopyUrl}
                  className="h-5 w-5 shrink-0 text-muted-foreground hover:text-foreground p-0"
                  title="Sao chép link"
                >
                  <Copy className="h-2.5 w-2.5" />
                </Button>
              </div>
            </div>

            <div className="flex items-center justify-between gap-2 border-t border-border/50 pt-1.5">
              <span className="font-medium text-muted-foreground flex items-center gap-1">
                <User className="h-3 w-3 text-muted-foreground" />
                Người gửi:
              </span>
              <span className="text-[11px] text-foreground truncate max-w-[220px]">
                <b>{user?.name || 'User'}</b> {user?.email ? `(${user.email})` : ''}
              </span>
            </div>
          </div>

          {/* Type Selector (Simple Compact Pills) */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-foreground">
              Phân loại
            </label>
            <div className="grid grid-cols-4 gap-1.5">
              {FEEDBACK_TYPES.map((t) => {
                const isSelected = type === t.value
                return (
                  <button
                    key={t.value}
                    type="button"
                    onClick={() => setType(t.value)}
                    className={cn(
                      'rounded-md border py-1 px-1.5 text-center text-xs font-medium transition-all',
                      isSelected
                        ? 'border-primary bg-primary text-primary-foreground font-semibold shadow-xs'
                        : 'border-border bg-background text-muted-foreground hover:text-foreground'
                    )}
                  >
                    {t.label}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Title (Optional / Short) */}
          <div className="space-y-1">
            <label htmlFor="fb-title" className="text-xs font-semibold text-foreground">
              Tiêu đề ngắn <span className="text-muted-foreground font-normal">(không bắt buộc)</span>
            </label>
            <Input
              id="fb-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="VD: Cần sửa màu nút, đổi thứ tự cột..."
              className="h-8 text-xs"
            />
          </div>

          {/* Description */}
          <div className="space-y-1">
            <label htmlFor="fb-desc" className="text-xs font-semibold text-foreground">
              Nội dung yêu cầu điều chỉnh <span className="text-rose-500">*</span>
            </label>
            <Textarea
              id="fb-desc"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Nhập chi tiết yêu cầu cần điều chỉnh tại màn hình này..."
              rows={4}
              className="text-xs resize-none"
              required
              autoFocus
            />
          </div>

          <DialogFooter className="pt-2 sm:justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Hủy
            </Button>
            <Button
              type="submit"
              size="sm"
              disabled={isSubmitting}
              className="gap-1.5 bg-primary text-primary-foreground font-semibold"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  Đang gửi...
                </>
              ) : (
                <>
                  <Send className="h-3.5 w-3.5" />
                  Gửi yêu cầu
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
