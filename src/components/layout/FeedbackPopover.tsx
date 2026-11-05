'use client'

import { useState, useEffect } from 'react'
import { toJpeg } from 'html-to-image'
import {
  Clock,
  Copy,
  Globe,
  Loader2,
  Bug,
  Send,
  CheckCircle2,
  X,
  Palette,
  Sliders,
  Sparkles,
  Camera,
  RefreshCw,
  ListOrdered,
  MousePointerClick,
  Navigation,
  AlertCircle,
  ClipboardPaste,
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
import {
  initActivityTracker,
  getRecentActivities,
  logActivity,
  type ActivityItem,
} from '@/lib/activityTracker'
import { cn } from '@/lib/utils'

export function FeedbackPopover() {
  const [isOpen, setIsOpen] = useState(false)
  const [type, setType] = useState<'bug' | 'ui_ux' | 'feature' | 'other'>('bug')
  const [priority, setPriority] = useState<'normal' | 'high' | 'urgent'>('normal')
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [screenshotDataUrl, setScreenshotDataUrl] = useState<string | null>(null)
  const [isCapturing, setIsCapturing] = useState(false)
  const [currentUrl, setCurrentUrl] = useState('')
  const [currentTime, setCurrentTime] = useState('')
  const [requesterName, setRequesterName] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [actionList, setActionList] = useState<ActivityItem[]>([])

  const user = useAuthStore((s) => s.user)
  const currentMenuId = useUIStore((s) => s.currentMenuId)
  const customHeaderTitle = useUIStore((s) => s.customHeaderTitle)

  const screenName =
    customHeaderTitle || (currentMenuId ? screens[currentMenuId]?.label || currentMenuId : 'Màn hình chung')

  // Initialize tracker once on mount
  useEffect(() => {
    initActivityTracker()
  }, [])

  // Paste image from clipboard support (Ctrl + V)
  useEffect(() => {
    if (!isOpen) return

    const handlePaste = (e: ClipboardEvent) => {
      const items = e.clipboardData?.items
      if (!items) return

      for (let i = 0; i < items.length; i++) {
        if (items[i].type.indexOf('image') !== -1) {
          const blob = items[i].getAsFile()
          if (blob) {
            const reader = new FileReader()
            reader.onload = (event) => {
              if (event.target?.result) {
                setScreenshotDataUrl(event.target.result as string)
                toast.success('Đã dán ảnh từ bộ nhớ tạm (Clipboard)!')
              }
            }
            reader.readAsDataURL(blob)
            break
          }
        }
      }
    }

    window.addEventListener('paste', handlePaste)
    return () => window.removeEventListener('paste', handlePaste)
  }, [isOpen])

  // Screen capture using html-to-image (supports modern CSS & oklch)
  const captureCurrentScreen = async () => {
    if (typeof window === 'undefined' || typeof document === 'undefined') return
    setIsCapturing(true)

    // Prioritize whole station app container outside popover portals
    const targetEl =
      (document.getElementById('station-app-root') as HTMLElement) ||
      (document.querySelector('.ui-main-canvas') as HTMLElement) ||
      (document.querySelector('main') as HTMLElement) ||
      document.body

    try {
      const dataUrl = await toJpeg(targetEl, {
        quality: 0.8,
        pixelRatio: 1,
        skipFonts: true,
        cacheBust: false,
        backgroundColor: '#ffffff',
        imagePlaceholder:
          'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="1" height="1"></svg>',
        onImageErrorHandler: () =>
          'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="1" height="1"></svg>',
        filter: (node) => {
          if (!node || !node.tagName) return true
          const tag = node.tagName.toLowerCase()
          if (tag === 'iframe' || tag === 'video') return false
          if (node.hasAttribute?.('data-radix-popper-content-wrapper')) return false
          if (node.hasAttribute?.('data-feedback-container')) return false
          if (node.classList?.contains?.('ui-btn-feedback')) return false
          return true
        },
      })

      if (dataUrl && dataUrl.length > 500) {
        setScreenshotDataUrl(dataUrl)
        return
      }
    } catch (err) {
      console.warn('html-to-image root capture failed, attempting <main> target:', err)
      try {
        const mainEl = document.querySelector('main') as HTMLElement
        if (mainEl && mainEl !== targetEl) {
          const mainDataUrl = await toJpeg(mainEl, {
            quality: 0.8,
            pixelRatio: 1,
            skipFonts: true,
            cacheBust: false,
            backgroundColor: '#ffffff',
            imagePlaceholder:
              'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="1" height="1"></svg>',
            onImageErrorHandler: () =>
              'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="1" height="1"></svg>',
            filter: (node) => {
              if (!node || !node.tagName) return true
              const tag = node.tagName.toLowerCase()
              return tag !== 'iframe' && tag !== 'video'
            },
          })
          if (mainDataUrl && mainDataUrl.length > 500) {
            setScreenshotDataUrl(mainDataUrl)
            return
          }
        }
      } catch (err2) {
        console.warn('Fallback mainEl capture also failed:', err2)
      }
    } finally {
      setIsCapturing(false)
    }
  }

  // Triggered on popover open
  const handleOpenChange = (open: boolean) => {
    setIsOpen(open)
    if (open) {
      logActivity(`Mở cửa sổ Báo lỗi & Yêu cầu điều chỉnh`, 'click')
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

      // Load action trail
      const activities = getRecentActivities()
      setActionList(activities)

      // Automatically capture screen after animation settles
      setTimeout(() => {
        void captureCurrentScreen()
      }, 100)
    }
  }

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

    setIsSubmitting(true)

    const finalDescription =
      description.trim() ||
      `Báo cáo ${type === 'bug' ? 'lỗi kỹ thuật' : 'yêu cầu điều chỉnh'} tại màn hình ${screenName}`

    const trailStrings = actionList.map((a) => `[${a.time}] ${a.action}`)

    const payload = {
      id: 'fb_' + Date.now(),
      title: title.trim() || `${type === 'bug' ? 'Báo lỗi' : 'Yêu cầu'} tại ${screenName}`,
      type,
      priority,
      description: finalDescription,
      screenName,
      currentUrl: currentUrl || (typeof window !== 'undefined' ? window.location.href : ''),
      requesterName: requesterName.trim() || user?.name || 'Ẩn danh',
      requesterRole: user?.role || 'admin',
      requesterEmail: user?.email || '',
      createdAt: currentTime || new Date().toLocaleString('vi-VN'),
      screenshotBase64: screenshotDataUrl || undefined,
      actionTrail: trailStrings,
    }

    try {
      const res = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      const data = await res.json()

      if (res.ok && data.ok) {
        toast.success(
          type === 'bug'
            ? '🚨 Đã gửi báo lỗi kèm ảnh chụp & nhật ký thao tác về Telegram!'
            : '🎉 Đã gửi phản hồi thành công về Telegram!'
        )
        setTitle('')
        setDescription('')
        setScreenshotDataUrl(null)
        setIsOpen(false)
      } else {
        toast.error(data.error || 'Có lỗi khi gửi tin nhắn tới Telegram.')
      }
    } catch (err) {
      console.error('Submit feedback error:', err)
      toast.warning('Đã lưu nội dung! Lỗi kết nối gửi Telegram.')
      setIsOpen(false)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Popover open={isOpen} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="ui-btn-feedback inline-flex h-8 items-center gap-1.5 rounded-full border-amber-500/30 bg-amber-500/10 px-2.5 text-xs font-semibold text-amber-700 dark:text-amber-300 shadow-xs transition-all hover:bg-amber-500/20 hover:border-amber-500/50 focus-visible:ring-1 focus-visible:ring-amber-500"
          title="Báo lỗi kỹ thuật hoặc gửi yêu cầu điều chỉnh"
        >
          <Bug className="h-3.5 w-3.5 shrink-0 text-amber-600 dark:text-amber-400" />
          <span className="hidden sm:inline">Báo lỗi & Góp ý</span>
        </Button>
      </PopoverTrigger>

      <PopoverContent
        align="end"
        sideOffset={8}
        data-feedback-container="true"
        className="w-[95vw] sm:w-[740px] md:w-[780px] p-0 rounded-2xl border border-border bg-popover shadow-2xl text-foreground overflow-hidden"
      >
        {/* Top Header: Clean, No Tabs */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-border/80 bg-muted/30">
          <div className="flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-red-600/15 text-red-600 dark:text-red-400">
              <Bug className="h-4 w-4" />
            </div>
            <span className="font-bold text-sm text-foreground">
              Báo lỗi & Yêu cầu Điều chỉnh
            </span>
          </div>

          <div className="flex items-center gap-2 text-xs text-muted-foreground font-mono">
            <Clock className="h-3.5 w-3.5 text-muted-foreground" />
            <span>{currentTime || 'Đang lấy giờ...'}</span>
          </div>
        </div>

        {/* 2-Panel Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-[1.1fr_1fr] divide-y md:divide-y-0 md:divide-x divide-border/70">
          {/* PANEL TRÁI: Ảnh chụp màn hình + Đường dẫn + Danh sách thao tác */}
          <div className="p-4 space-y-3 bg-muted/15 flex flex-col justify-between">
            {/* 1. Ảnh chụp màn hình */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-foreground flex items-center gap-1.5">
                  <Camera className="h-3.5 w-3.5 text-primary" />
                  Ảnh chụp màn hình:
                </span>
                <div className="flex items-center gap-1.5">
                  {isCapturing ? (
                    <span className="text-[11px] text-amber-600 flex items-center gap-1 animate-pulse">
                      <Loader2 className="h-3 w-3 animate-spin" />
                      Đang chụp...
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={captureCurrentScreen}
                      className="text-[11px] text-primary hover:underline flex items-center gap-1 font-medium"
                      title="Chụp lại màn hình"
                    >
                      <RefreshCw className="h-3 w-3" />
                      Chụp lại
                    </button>
                  )}
                </div>
              </div>

              {screenshotDataUrl ? (
                <div className="relative group rounded-xl overflow-hidden border border-border shadow-xs bg-black aspect-video max-h-36">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={screenshotDataUrl}
                    alt="Ảnh chụp màn hình"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-1.5 left-2 px-1.5 py-0.5 rounded bg-black/75 backdrop-blur-xs text-[10px] text-white flex items-center gap-1 font-medium">
                    <CheckCircle2 className="h-3 w-3 text-emerald-400" />
                    Đã chụp màn hình
                  </div>
                  <button
                    type="button"
                    onClick={() => setScreenshotDataUrl(null)}
                    className="absolute top-1.5 right-1.5 p-1 rounded-full bg-black/70 text-white hover:bg-red-600 transition-colors"
                    title="Xóa ảnh này"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              ) : (
                <div className="p-3.5 rounded-xl border border-dashed border-border bg-background/50 text-center text-xs text-muted-foreground space-y-2">
                  <div className="flex justify-center gap-2 text-muted-foreground/60">
                    <Camera className="h-5 w-5" />
                    <ClipboardPaste className="h-5 w-5" />
                  </div>
                  <p className="text-[11px] text-muted-foreground leading-relaxed">
                    Chưa có ảnh. Bạn có thể bấm chụp hoặc nhấn <kbd className="px-1 py-0.5 text-[10px] bg-muted border rounded font-mono">Ctrl + V</kbd> để dán ảnh.
                  </p>
                  <div className="flex items-center justify-center gap-2 pt-0.5">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={captureCurrentScreen}
                      className="h-7 text-xs gap-1"
                    >
                      <RefreshCw className="h-3 w-3" />
                      Chụp màn hình
                    </Button>
                  </div>
                </div>
              )}
            </div>

            {/* 2. Đường dẫn & Màn hình */}
            <div className="rounded-xl border border-border/80 bg-background/80 p-2.5 text-xs space-y-1.5">
              <div className="flex items-center justify-between gap-2">
                <span className="text-muted-foreground font-medium">Màn hình:</span>
                <span className="font-semibold text-foreground bg-primary/10 text-primary px-2 py-0.5 rounded text-xs truncate max-w-[200px]">
                  {screenName}
                </span>
              </div>

              <div className="flex items-center justify-between gap-2">
                <span className="text-muted-foreground font-medium shrink-0 flex items-center gap-1">
                  <Globe className="h-3 w-3 text-muted-foreground" />
                  Đường dẫn:
                </span>
                <div className="flex items-center gap-1 min-w-0 flex-1 justify-end">
                  <span className="truncate text-muted-foreground font-mono text-xs max-w-[190px]">
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

            {/* 3. Danh sách thao tác vừa thực hiện (Action Trail) */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-foreground flex items-center gap-1.5">
                  <ListOrdered className="h-3.5 w-3.5 text-blue-500" />
                  Thao tác vừa thực hiện ({actionList.length}):
                </span>
                <span className="text-[10px] text-muted-foreground">Tự động ghi</span>
              </div>

              <div className="max-h-28 overflow-y-auto rounded-xl border border-border/70 bg-background/80 p-2 space-y-1 text-xs">
                {actionList.length > 0 ? (
                  actionList.slice(0, 6).map((item, idx) => (
                    <div
                      key={item.id || idx}
                      className="flex items-start gap-1.5 text-[11px] leading-tight text-muted-foreground"
                    >
                      <span className="shrink-0 font-mono text-[10px] text-zinc-400">
                        {item.time}
                      </span>
                      {item.type === 'route' ? (
                        <Navigation className="h-3 w-3 text-sky-500 shrink-0 mt-0.5" />
                      ) : item.type === 'error' ? (
                        <AlertCircle className="h-3 w-3 text-red-500 shrink-0 mt-0.5" />
                      ) : (
                        <MousePointerClick className="h-3 w-3 text-amber-500 shrink-0 mt-0.5" />
                      )}
                      <span className="truncate text-foreground font-medium">
                        {item.action}
                      </span>
                    </div>
                  ))
                ) : (
                  <p className="text-[11px] text-muted-foreground italic">
                    Chưa có thao tác nào được ghi nhận.
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* PANEL PHẢI: Phân loại, Tiêu đề, Mô tả & Nút Gửi */}
          <div className="p-4 flex flex-col bg-background">
            <form onSubmit={handleSubmit} className="flex-1 flex flex-col gap-2.5">
              {/* Type Selection */}
              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                  Phân loại phản hồi
                </label>
                <div className="grid grid-cols-4 gap-1">
                  {[
                    { id: 'bug', label: 'Báo lỗi', icon: Bug, color: 'text-red-500' },
                    { id: 'ui_ux', label: 'Giao diện', icon: Palette, color: 'text-purple-500' },
                    { id: 'feature', label: 'Nghiệp vụ', icon: Sliders, color: 'text-blue-500' },
                    { id: 'other', label: 'Khác', icon: Sparkles, color: 'text-amber-500' },
                  ].map((item) => {
                    const Icon = item.icon
                    const isSelected = type === item.id
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => setType(item.id as typeof type)}
                        className={cn(
                          'flex flex-col items-center justify-center p-1.5 rounded-lg border text-xs font-medium transition-all gap-0.5',
                          isSelected
                            ? 'border-primary bg-primary/10 text-primary shadow-xs'
                            : 'border-border/60 bg-muted/20 text-muted-foreground hover:bg-muted hover:text-foreground'
                        )}
                      >
                        <Icon className={cn('h-3.5 w-3.5', item.color)} />
                        <span className="text-[10px]">{item.label}</span>
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Severity / Priority */}
              <div className="flex items-center justify-between gap-1">
                <label className="text-xs font-semibold text-muted-foreground">
                  Mức độ:
                </label>
                <div className="flex items-center gap-1">
                  {[
                    { id: 'normal', label: 'Bình thường' },
                    { id: 'high', label: 'Cao' },
                    { id: 'urgent', label: '🚨 Khẩn cấp (P0)' },
                  ].map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => setPriority(p.id as typeof priority)}
                      className={cn(
                        'px-2 py-0.5 rounded text-[11px] font-medium border transition-colors',
                        priority === p.id
                          ? p.id === 'urgent'
                            ? 'bg-red-500/15 border-red-500 text-red-600 dark:text-red-400 font-bold'
                            : 'bg-primary/10 border-primary text-primary font-semibold'
                          : 'bg-muted/30 border-border/60 text-muted-foreground hover:text-foreground'
                      )}
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Title Input (Placeholder only) */}
              <Input
                id="fb-title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Tiêu đề (VD: Nút xác nhận bị đơ...)"
                className="h-8 text-xs bg-background"
              />

              {/* Description Textarea: Dịch lên trên & mở rộng chiều cao tự động lấp đầy khoảng trống */}
              <Textarea
                id="fb-popover-desc"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Mô tả chi tiết nếu cần (hoặc để trống bấm Gửi luôn)..."
                className="text-xs flex-1 min-h-[140px] resize-y leading-relaxed bg-background"
              />

              {/* Footer Actions */}
              <div className="flex items-center justify-end gap-2 pt-1 mt-auto">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setIsOpen(false)}
                  disabled={isSubmitting}
                  className="h-8 text-xs px-3"
                >
                  Đóng
                </Button>
                <Button
                  type="submit"
                  size="sm"
                  disabled={isSubmitting}
                  className={cn(
                    'h-8 gap-1.5 text-xs font-semibold px-4 text-white shadow-xs',
                    type === 'bug'
                      ? 'bg-red-600 hover:bg-red-500'
                      : 'bg-primary hover:bg-primary/90'
                  )}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-3 w-3 animate-spin" />
                      Đang gửi...
                    </>
                  ) : (
                    <>
                      <Send className="h-3 w-3" />
                      Gửi Telegram
                    </>
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}
