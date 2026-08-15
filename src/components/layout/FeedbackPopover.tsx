'use client'

import { useState, useEffect } from 'react'
import {
  Clock,
  Copy,
  Globe,
  Loader2,
  MessageSquarePlus,
  Send,
} from 'lucide-react'
import { toast } from 'sonner'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { useAuthStore } from '@/stores/useAuthStore'
import { useUIStore } from '@/stores/useUIStore'
import { screens } from '@/config/screens'

const STORAGE_KEY = 'rinov5_feedback_history'

function saveToLocalStorage(data: Record<string, unknown>) {
  if (typeof window === 'undefined') return
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    const history = raw ? JSON.parse(raw) : []
    const updated = [data, ...history].slice(0, 50)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
    console.log('📌 [Rinov5 Feedback Logged Locally]:', data)
  } catch (err) {
    console.error('Failed to log feedback to localStorage', err)
  }
}

export function FeedbackPopover() {
  const [isOpen, setIsOpen] = useState(false)
  const [currentUrl, setCurrentUrl] = useState('')
  const [currentTime, setCurrentTime] = useState('')
  const [requesterName, setRequesterName] = useState('')
  const [description, setDescription] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const user = useAuthStore((s) => s.user)
  const currentMenuId = useUIStore((s) => s.currentMenuId)
  const customHeaderTitle = useUIStore((s) => s.customHeaderTitle)

  const screenName =
    customHeaderTitle || (currentMenuId ? screens[currentMenuId]?.label || currentMenuId : 'Màn hình chung')

  // Update URL, Timestamp, and pre-fill requester name when Popover opens
  useEffect(() => {
    if (isOpen) {
      if (typeof window !== 'undefined') {
        setCurrentUrl(window.location.href)
      }
      const now = new Date()
      const formatted = now.toLocaleString('vi-VN', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      })
      setCurrentTime(formatted)

      if (!requesterName) {
        setRequesterName(user?.name || '')
      }
    }
  }, [isOpen, user?.name, requesterName])

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
      toast.error('Vui lòng nhập nội dung điều chỉnh!')
      return
    }

    setIsSubmitting(true)

    const payload = {
      id: 'fb_' + Date.now(),
      description: description.trim(),
      screenName,
      currentUrl: currentUrl || (typeof window !== 'undefined' ? window.location.href : ''),
      requesterName: requesterName.trim() || user?.name || 'Ẩn danh',
      createdAt: currentTime || new Date().toLocaleString('vi-VN'),
    }

    // Save to local storage log
    saveToLocalStorage(payload)

    try {
      const res = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      const data = await res.json()

      if (res.ok && data.ok) {
        toast.success('Đã gửi yêu cầu thành công!')
        setDescription('')
        setIsOpen(false)
      } else {
        toast.error(data.error || 'Có lỗi khi gửi tin nhắn tới Telegram.')
      }
    } catch (err) {
      console.error('Submit feedback error:', err)
      toast.success('Đã lưu yêu cầu vào bộ nhớ máy.')
      setIsOpen(false)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="ui-btn-feedback inline-flex h-9 items-center gap-1.5 rounded-full border-primary/30 bg-primary/10 px-3 text-xs font-semibold text-primary shadow-xs transition-all hover:bg-primary hover:text-primary-foreground focus-visible:ring-1 focus-visible:ring-primary"
          title="Gửi yêu cầu điều chỉnh giao diện / tính năng"
        >
          <MessageSquarePlus className="h-4 w-4 shrink-0 text-primary group-hover:text-primary-foreground" />
          <span className="hidden sm:inline">Yêu cầu điều chỉnh</span>
        </Button>
      </PopoverTrigger>

      <PopoverContent
        align="end"
        sideOffset={8}
        className="w-[360px] sm:w-[420px] rounded-xl border border-border/80 bg-popover p-4 shadow-xl text-foreground"
      >
        <div className="flex items-center justify-between pb-2 border-b border-border/60">
          <span className="font-bold text-sm text-foreground">Yêu cầu điều chỉnh</span>
          <div className="flex items-center gap-1 text-[11px] text-muted-foreground font-mono">
            <Clock className="h-3 w-3" />
            <span>{currentTime || 'Đang lấy giờ...'}</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3 pt-2.5">
          {/* Info Box: Screen & URL */}
          <div className="rounded-lg border border-border/70 bg-muted/40 p-2 text-xs space-y-1.5">
            <div className="flex items-center justify-between gap-2">
              <span className="text-muted-foreground font-medium">Màn hình:</span>
              <span className="font-semibold text-foreground bg-primary/10 text-primary px-1.5 py-0.5 rounded text-[11px] truncate max-w-[220px]">
                {screenName}
              </span>
            </div>

            <div className="flex items-center justify-between gap-2">
              <span className="text-muted-foreground font-medium shrink-0 flex items-center gap-1">
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
                  className="h-4 w-4 shrink-0 text-muted-foreground hover:text-foreground p-0"
                  title="Sao chép link"
                >
                  <Copy className="h-2.5 w-2.5" />
                </Button>
              </div>
            </div>
          </div>

          {/* Requester Name Input */}
          <div className="space-y-1">
            <label htmlFor="fb-name" className="text-xs font-semibold text-foreground">
              Tên người gửi:
            </label>
            <Input
              id="fb-name"
              value={requesterName}
              onChange={(e) => setRequesterName(e.target.value)}
              placeholder="Nhập tên của bạn..."
              className="h-8 text-xs"
            />
          </div>

          {/* Description Textarea (Resizable) */}
          <div className="space-y-1">
            <label htmlFor="fb-popover-desc" className="text-xs font-semibold text-foreground">
              Nội dung yêu cầu:
            </label>
            <Textarea
              id="fb-popover-desc"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Nhập nội dung cần điều chỉnh..."
              rows={4}
              className="text-xs resize-y min-h-[100px] leading-relaxed"
              required
              autoFocus
            />
          </div>

          {/* Footer actions */}
          <div className="flex items-center justify-end gap-2 pt-1 border-t border-border/60">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsOpen(false)}
              disabled={isSubmitting}
              className="h-7 text-xs px-2.5"
            >
              Hủy
            </Button>
            <Button
              type="submit"
              size="sm"
              disabled={isSubmitting}
              className="h-7 gap-1.5 bg-primary text-primary-foreground text-xs font-semibold px-3"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-3 w-3 animate-spin" />
                  Đang gửi...
                </>
              ) : (
                <>
                  <Send className="h-3 w-3" />
                  Gửi ngay
                </>
              )}
            </Button>
          </div>
        </form>
      </PopoverContent>
    </Popover>
  )
}
