'use client'

import { useEffect, useState, useMemo, useCallback, useRef } from 'react'
import { usePathname } from 'next/navigation'
import { useUIStore } from '@/stores/useUIStore'
import {
  Lightbulb,
  X,
  Target,
  Users,
  ShieldCheck,
  Maximize2,
  Minimize2,
  FileText,
  Sparkles,
  Edit3,
  Trash2,
  ExternalLink,
  Pin,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'
import type { ExplainTopic } from './explainTypes'
import { ExplainEditorDialog } from './ExplainEditorDialog'

interface RectPos {
  top: number
  left: number
  width: number
  height: number
}

// Hàm sinh selector thông minh cho phần tử được chọn
function generateSmartSelector(el: HTMLElement): string {
  if (el.tagName === 'HTML' || el.tagName === 'BODY') return ''

  const slot = el.getAttribute('data-slot')
  if (slot) return `[data-slot="${slot}"]`

  const ariaLabel = el.getAttribute('aria-label')
  if (ariaLabel) return `[aria-label="${ariaLabel}"]`

  const title = el.getAttribute('title')
  if (title) return `[title*="${title.slice(0, 20)}"]`

  if (el.tagName === 'TH' || el.tagName === 'TD') {
    const parent = el.parentElement
    if (parent) {
      const idx = Array.from(parent.children).indexOf(el) + 1
      const isHeader = el.tagName === 'TH'
      return isHeader ? `table thead th:nth-child(${idx})` : `table tbody tr:first-child td:nth-child(${idx})`
    }
  }

  const text = (el.innerText || '').trim()
  if (text && text.length < 25 && (el.tagName === 'BUTTON' || el.tagName === 'A' || el.tagName === 'SPAN')) {
    const tag = el.tagName.toLowerCase()
    return `${tag}:has-text("${text.slice(0, 15)}")`
  }

  if (el.id && !el.id.startsWith('radix-') && !el.id.includes(':')) {
    return `#${el.id}`
  }

  if (typeof el.className === 'string') {
    const cleanClass = el.className
      .split(' ')
      .filter((c) =>
        c &&
        !c.includes(':') &&
        !c.includes('[') &&
        !c.includes('variable') &&
        !c.includes('className') &&
        !c.startsWith('_') &&
        c.length > 3
      )[0]
    if (cleanClass) {
      return `${el.tagName.toLowerCase()}.${cleanClass}`
    }
  }

  return el.tagName.toLowerCase()
}

export function ExplainTourOverlay() {
  const isExplainMode = useUIStore((s) => s.isExplainMode)
  const setExplainMode = useUIStore((s) => s.setExplainMode)
  const pathname = usePathname()

  const screenId = useMemo(() => {
    if (!pathname) return 'student_operations_alert'
    return pathname.replace(/^\/app\//, '').split('/')[0] || 'student_operations_alert'
  }, [pathname])

  const [topics, setTopics] = useState<ExplainTopic[]>([])
  const [canEdit, setCanEdit] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)

  // 1. Topic đang được Ghim (Click để giữ cố định)
  const [pinnedTopic, setPinnedTopic] = useState<ExplainTopic | null>(null)
  // 2. Topic đang được Hover chuột qua
  const [hoveredTopic, setHoveredTopic] = useState<ExplainTopic | null>(null)

  // Vị trí bounding box của topic đang hiển thị
  const [activeRect, setActiveRect] = useState<RectPos | null>(null)

  // Vị trí hover của đối tượng chưa có topic (để hiện viền nét đứt ở Local)
  const [unmatchedHoverRect, setUnmatchedHoverRect] = useState<RectPos | null>(null)
  const [unmatchedLabel, setUnmatchedLabel] = useState<string>('')

  // Editor Popover State (Chỉ Local)
  const [editorOpen, setEditorOpen] = useState(false)
  const [editingTopic, setEditingTopic] = useState<Partial<ExplainTopic> | null>(null)
  const [editingRect, setEditingRect] = useState<RectPos | null>(null)

  // Cờ kiểm tra chuột có đang nằm bên trong Popover không
  const isMouseInPopoverRef = useRef(false)
  const hoverLeaveTimerRef = useRef<NodeJS.Timeout | null>(null)

  // Topic ưu tiên hiển thị: Ghim > Hover
  const displayTopic = pinnedTopic || hoveredTopic

  // 1. Tải danh sách thuyết minh từ API
  const loadSpecs = useCallback(async () => {
    try {
      const res = await fetch(`/api/explain-specs?screenId=${screenId}`)
      const json = await res.json()
      if (json.success) {
        setTopics(json.data || [])
        setCanEdit(Boolean(json.canEdit))
      }
    } catch (err) {
      console.error('Failed to load explain specs:', err)
    }
  }, [screenId])

  useEffect(() => {
    if (!isExplainMode) return
    const handle = requestAnimationFrame(() => {
      void loadSpecs()
    })
    return () => cancelAnimationFrame(handle)
  }, [isExplainMode, loadSpecs])

  // Reset khi tắt mode hoặc đổi màn hình
  useEffect(() => {
    if (!isExplainMode) {
      const handle = requestAnimationFrame(() => {
        setPinnedTopic(null)
        setHoveredTopic(null)
        setActiveRect(null)
        setUnmatchedHoverRect(null)
        setEditorOpen(false)
      })
      return () => cancelAnimationFrame(handle)
    }
  }, [isExplainMode, pathname])

  // 2. Tìm phần tử DOM theo topic (Chính xác, ưu tiên CSS Selector rồi mới đến Text)
  const findElementForTopic = useCallback((topic: ExplainTopic): HTMLElement | null => {
    if (typeof document === 'undefined' || !topic.targetSelector) return null

    const parts = topic.targetSelector.split(',').map((s) => s.trim())

    // 1. Ưu tiên tìm theo selector CSS chuẩn (aria-label, data-slot, class, tag)
    for (const part of parts) {
      if (!part.includes(':has-text(')) {
        try {
          const el = document.querySelector(part)
          if (el && el instanceof HTMLElement) {
            const r = el.getBoundingClientRect()
            if (r.width > 0 && r.height > 0 && r.width < window.innerWidth * 0.9) {
              return el
            }
          }
        } catch {}
      }
    }

    // 2. Sau đó mới tìm theo :has-text
    for (const part of parts) {
      if (part.includes(':has-text(')) {
        const match = part.match(/:has-text\("([^"]+)"\)/)
        if (match && match[1]) {
          const searchText = match[1].toLowerCase().trim()
          const allButtons = Array.from(document.querySelectorAll('button, a, span, th, [role="button"]'))

          // A. Tìm khớp 100% nội dung chữ
          const exactFound = allButtons.find((el) => {
            const txt = (el as HTMLElement).innerText?.toLowerCase().trim() || ''
            return txt === searchText
          })
          if (exactFound && exactFound instanceof HTMLElement) return exactFound

          // B. Tìm chứa cụm từ (bỏ qua từ quá chung như "tất cả")
          if (searchText !== 'tất cả') {
            const found = allButtons.find((el) => {
              const txt = (el as HTMLElement).innerText?.toLowerCase().trim() || ''
              return txt.includes(searchText) && txt.length < 60
            })
            if (found && found instanceof HTMLElement) return found
          }
        }
      }
    }
    return null
  }, [])

  // 3. Tìm topic khớp với 1 phần tử DOM (Thuật toán chính xác từng phần tử theo thứ tự ưu tiên)
  const findTopicForElement = useCallback((el: HTMLElement): { topic: ExplainTopic; targetElement: HTMLElement } | null => {
    if (el.tagName === 'HTML' || el.tagName === 'BODY') return null

    // 1. Nhận diện ô bảng (th hoặc td hoặc phần tử nằm trong ô)
    const tableCell = (el.tagName === 'TH' || el.tagName === 'TD' ? el : el.closest('th, td')) as HTMLTableCellElement | null
    if (tableCell && tableCell.parentElement && tableCell.closest('table')) {
      const colIndex = Array.from(tableCell.parentElement.children).indexOf(tableCell) + 1
      const colTopic = topics.find((t) => t.targetSelector?.includes(`:nth-child(${colIndex})`))
      if (colTopic) {
        return { topic: colTopic, targetElement: tableCell }
      }
    }

    const interactiveEl = (el.closest('button, a, input, select, [role="button"], [data-slot]') || el) as HTMLElement

    // 2. GIAI ĐOẠN 1: Khớp chính xác theo thuộc tính CSS (aria-label, data-slot, id)
    for (const t of topics) {
      if (!t.targetSelector) continue
      const parts = t.targetSelector.split(',').map((s) => s.trim())
      for (const part of parts) {
        if (part.includes(':has-text(')) continue
        try {
          if (el.matches(part) || interactiveEl.matches(part)) {
            return { topic: t, targetElement: interactiveEl }
          }
          const closestMatch = el.closest(part) as HTMLElement | null
          if (closestMatch && !closestMatch.closest('[data-explain-ui="true"]') && closestMatch.tagName !== 'BODY') {
            const r = closestMatch.getBoundingClientRect()
            if (r.width < window.innerWidth * 0.85 && r.height < window.innerHeight * 0.85) {
              return { topic: t, targetElement: closestMatch }
            }
          }
        } catch {}
      }
    }

    // 3. GIAI ĐOẠN 2: Khớp 100% nội dung chữ (Exact text match)
    const rawText = (interactiveEl.innerText || el.innerText || '').trim().toLowerCase()
    if (rawText) {
      for (const t of topics) {
        if (!t.targetSelector) continue
        const parts = t.targetSelector.split(',').map((s) => s.trim())
        for (const part of parts) {
          if (part.includes(':has-text(')) {
            const match = part.match(/:has-text\("([^"]+)"\)/)
            if (match && match[1]) {
              const searchText = match[1].toLowerCase().trim()
              if (rawText === searchText) {
                return { topic: t, targetElement: interactiveEl }
              }
            }
          }
        }
      }
    }

    // 4. GIAI ĐOẠN 3: Khớp cụm từ trong văn bản (Contains text)
    if (rawText) {
      for (const t of topics) {
        if (!t.targetSelector) continue
        const parts = t.targetSelector.split(',').map((s) => s.trim())
        for (const part of parts) {
          if (part.includes(':has-text(')) {
            const match = part.match(/:has-text\("([^"]+)"\)/)
            if (match && match[1]) {
              const searchText = match[1].toLowerCase().trim()
              if (searchText === 'tất cả') continue
              if (rawText.includes(searchText) && rawText.length < 60) {
                return { topic: t, targetElement: interactiveEl }
              }
            }
          }
        }
      }
    }

    return null
  }, [topics])

  // 4. Cập nhật vị trí bounding box cho displayTopic
  const updateDisplayRect = useCallback(() => {
    if (!displayTopic) {
      setActiveRect(null)
      return
    }
    const el = findElementForTopic(displayTopic)
    if (el) {
      const r = el.getBoundingClientRect()
      const pad = 4
      setActiveRect({
        top: Math.max(0, r.top - pad),
        left: Math.max(0, r.left - pad),
        width: r.width + pad * 2,
        height: r.height + pad * 2,
      })
    } else {
      setActiveRect(null)
    }
  }, [displayTopic, findElementForTopic])

  useEffect(() => {
    if (!isExplainMode) return
    const handle = () => requestAnimationFrame(updateDisplayRect)
    handle()
    window.addEventListener('resize', handle)
    window.addEventListener('scroll', handle, true)
    return () => {
      window.removeEventListener('resize', handle)
      window.removeEventListener('scroll', handle, true)
    }
  }, [isExplainMode, displayTopic, updateDisplayRect])

  // 5. LẮNG NGHE HOVER & CLICK: RÊ CHUỘT LÀ RA POPOVER NGAY
  useEffect(() => {
    if (!isExplainMode) return

    const handlePointerMove = (e: PointerEvent) => {
      if (editorOpen || isMouseInPopoverRef.current) return

      let target = document.elementFromPoint(e.clientX, e.clientY) as HTMLElement | null
      if (!target || target.closest('[data-explain-ui="true"]') || target.closest('header')) {
        // Chuột ở trên phần tử explain UI (như Popover, cầu nối Bridge, hoặc thanh Header)
        if (!pinnedTopic && !isMouseInPopoverRef.current) {
          if (!hoverLeaveTimerRef.current) {
            hoverLeaveTimerRef.current = setTimeout(() => {
              if (!isMouseInPopoverRef.current && !pinnedTopic) {
                setHoveredTopic(null)
                setActiveRect(null)
                setUnmatchedHoverRect(null)
              }
              hoverLeaveTimerRef.current = null
            }, 350)
          }
        }
        return
      }

      const interactiveEl = target.closest('button, a, th, td, input, select, [data-slot], [role="button"]') as HTMLElement | null
      if (interactiveEl && !interactiveEl.closest('[data-explain-ui="true"]') && !interactiveEl.closest('header')) {
        target = interactiveEl
      }

      // Tìm topic ứng với đối tượng
      const matchResult = findTopicForElement(target)

      if (matchResult) {
        // Xóa bộ đếm hủy hover vì đã chạm vào một đối tượng hợp lệ
        if (hoverLeaveTimerRef.current) {
          clearTimeout(hoverLeaveTimerRef.current)
          hoverLeaveTimerRef.current = null
        }

        setUnmatchedHoverRect(null)
        setHoveredTopic(matchResult.topic)

        const r = matchResult.targetElement.getBoundingClientRect()
        const pad = 4
        setActiveRect({
          top: Math.max(0, r.top - pad),
          left: Math.max(0, r.left - pad),
          width: r.width + pad * 2,
          height: r.height + pad * 2,
        })
      } else {
        // RÊ CHUỘT TRÚNG ĐỐI TƯỢNG CHƯA CÓ THUYẾT MINH
        // QUAN TRỌNG: Không tắt popover ngay lập tức! Cho 350ms grace period để người dùng lướt chuột vào Popover
        if (!pinnedTopic) {
          if (!hoverLeaveTimerRef.current) {
            hoverLeaveTimerRef.current = setTimeout(() => {
              if (!isMouseInPopoverRef.current && !pinnedTopic) {
                setHoveredTopic(null)
                setActiveRect(null)
              }
              hoverLeaveTimerRef.current = null
            }, 350)
          }
        }

        if (canEdit && !pinnedTopic && !hoveredTopic) {
          const r = target.getBoundingClientRect()
          if (r.width > 0 && r.height > 0 && r.width < window.innerWidth * 0.8) {
            setUnmatchedHoverRect({
              top: r.top,
              left: r.left,
              width: r.width,
              height: r.height,
            })
            const label = target.getAttribute('title') || target.getAttribute('aria-label') || (target.innerText || '').slice(0, 15) || target.tagName.toLowerCase()
            setUnmatchedLabel(`+ Click để ghi chú: ${label}`)
          }
        }
      }
    }

    const handleClickCapture = (e: MouseEvent) => {
      if (editorOpen) return

      let target = e.target as HTMLElement | null
      if (!target || target.closest('[data-explain-ui="true"]') || target.closest('header')) {
        return
      }

      if (target.tagName === 'HTML' || target.tagName === 'BODY') return

      const interactiveEl = target.closest('button, a, th, td, input, select, [data-slot], [role="button"]') as HTMLElement | null
      if (interactiveEl && !interactiveEl.closest('[data-explain-ui="true"]') && !interactiveEl.closest('header')) {
        target = interactiveEl
      }

      e.preventDefault()
      e.stopPropagation()

      const matchResult = findTopicForElement(target)

      if (matchResult) {
        // Click vào đối tượng có thuyết minh -> GHIM (PIN) Popover cố định, click lại thì bỏ ghim
        if (pinnedTopic?.id === matchResult.topic.id) {
          setPinnedTopic(null)
          toast.info('Đã bỏ ghim thuyết minh')
        } else {
          setPinnedTopic(matchResult.topic)
          setHoveredTopic(matchResult.topic)
          setUnmatchedHoverRect(null)
          toast.success(`Đã ghim: ${matchResult.topic.title}`)
        }
      } else {
        // Click vào đối tượng chưa có thuyết minh
        if (canEdit) {
          const r = target.getBoundingClientRect()
          const elementRect = {
            top: r.top,
            left: r.left,
            width: r.width,
            height: r.height,
          }
          const selector = generateSmartSelector(target)
          const rawText = (target.getAttribute('title') || target.getAttribute('aria-label') || target.innerText || target.tagName).trim()
          const suggestedTitle = rawText.replace(/Thuyết minh.*/i, '').trim().slice(0, 30)

          setEditingTopic({
            title: suggestedTitle || 'Mô tả đối tượng mới',
            category: 'Nghiệp vụ giao diện',
            targetSelector: selector,
            what: '',
            why: '',
            who: '',
            rules: [''],
            documentLinks: [],
          })
          setEditingRect(elementRect)
          setEditorOpen(true)
        } else {
          toast.info('Đối tượng này chưa có mô tả thuyết minh.')
        }
      }
    }

    window.addEventListener('pointermove', handlePointerMove)
    window.addEventListener('click', handleClickCapture, true)

    return () => {
      window.removeEventListener('pointermove', handlePointerMove)
      window.removeEventListener('click', handleClickCapture, true)
      if (hoverLeaveTimerRef.current) clearTimeout(hoverLeaveTimerRef.current)
    }
  }, [isExplainMode, editorOpen, canEdit, pinnedTopic, hoveredTopic, findTopicForElement])

  // Phím tắt bàn phím: ESC để unpin hoặc thoát
  useEffect(() => {
    if (!isExplainMode) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (editorOpen) {
          setEditorOpen(false)
        } else if (pinnedTopic) {
          setPinnedTopic(null)
          setHoveredTopic(null)
          setActiveRect(null)
        } else {
          setExplainMode(false)
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isExplainMode, editorOpen, pinnedTopic, setExplainMode])

  // Xóa Topic (Chỉ Local)
  const handleDeleteTopic = async (topicId: string) => {
    if (!confirm('Bạn có chắc chắn muốn xóa mục thuyết minh này?')) return

    try {
      const res = await fetch(`/api/explain-specs?screenId=${screenId}&topicId=${topicId}`, {
        method: 'DELETE',
      })
      const json = await res.json()
      if (json.success) {
        toast.success('Đã xóa mục thuyết minh thành công!')
        setTopics((prev) => prev.filter((t) => t.id !== topicId))
        setPinnedTopic(null)
        setHoveredTopic(null)
        setActiveRect(null)
      }
    } catch {
      toast.error('Lỗi khi xóa mục thuyết minh')
    }
  }

  if (!isExplainMode) return null

  // Tính toán vị trí Popover Card bám sát đối tượng
  const popoverStyle: React.CSSProperties = {}
  let isAbove = false
  let bridgeStyle: React.CSSProperties | null = null

  if (activeRect) {
    const spaceBelow = window.innerHeight - (activeRect.top + activeRect.height)
    const spaceAbove = activeRect.top
    const gap = 4

    if (spaceBelow > 380 || spaceBelow >= spaceAbove) {
      popoverStyle.top = `${activeRect.top + activeRect.height + gap}px`
      isAbove = false
    } else {
      popoverStyle.bottom = `${window.innerHeight - activeRect.top + gap}px`
      isAbove = true
    }

    const desiredLeft = activeRect.left
    const maxLeft = Math.max(16, window.innerWidth - (isExpanded ? 500 : 430))
    const computedLeft = Math.max(16, Math.min(desiredLeft, maxLeft))
    popoverStyle.left = `${computedLeft}px`

    // Cầu nối vô hình bao trùm khoảng cách giữa đối tượng và Popover
    const bridgeLeft = Math.min(activeRect.left, computedLeft)
    const bridgeWidth = Math.max(activeRect.width, isExpanded ? 480 : 410)

    if (!isAbove) {
      bridgeStyle = {
        position: 'fixed',
        top: `${activeRect.top + activeRect.height - 2}px`,
        left: `${bridgeLeft}px`,
        width: `${bridgeWidth}px`,
        height: `${gap + 6}px`,
        zIndex: 9994,
        pointerEvents: 'auto',
      }
    } else {
      bridgeStyle = {
        position: 'fixed',
        top: `${activeRect.top - gap - 4}px`,
        left: `${bridgeLeft}px`,
        width: `${bridgeWidth}px`,
        height: `${gap + 6}px`,
        zIndex: 9994,
        pointerEvents: 'auto',
      }
    }
  } else {
    popoverStyle.top = '60px'
    popoverStyle.right = '24px'
  }

  return (
    <>
      <div className="fixed inset-0 z-[9990] pointer-events-none" data-explain-ui="true">
        {/* 1. KHUNG VIỀN KHI HOVER QUA ĐỐI TƯỢNG CHƯA CÓ TOPIC (Local only) */}
        {unmatchedHoverRect && !editorOpen && !displayTopic && canEdit && (
          <div
            className="absolute pointer-events-none rounded border-2 border-dashed border-sky-500 bg-sky-500/10 z-[9992]"
            style={{
              top: `${unmatchedHoverRect.top}px`,
              left: `${unmatchedHoverRect.left}px`,
              width: `${unmatchedHoverRect.width}px`,
              height: `${unmatchedHoverRect.height}px`,
            }}
          >
            <span className="absolute -top-6 left-0 text-[10px] font-semibold px-1.5 py-0.5 rounded shadow bg-sky-600 text-white select-none whitespace-nowrap">
              {unmatchedLabel}
            </span>
          </div>
        )}

        {/* 2. VIỀN SÁNG ĐỐI TƯỢNG ĐANG ĐƯỢC HOVER HOẶC GHIM (Selected Box) */}
        {activeRect && displayTopic && (
          <div
            className="absolute pointer-events-none rounded-lg border-2 border-amber-500 shadow-[0_0_18px_rgba(245,158,11,0.5)] transition-all duration-150 ring-4 ring-amber-500/20 animate-pulse z-[9993]"
            style={{
              top: `${activeRect.top}px`,
              left: `${activeRect.left}px`,
              width: `${activeRect.width}px`,
              height: `${activeRect.height}px`,
            }}
          />
        )}

        {/* 3. CẦU NỐI VÔ HÌNH (INVISIBLE HOVER BRIDGE) ĐỂ DI CHUỘT VÀO POPOVER KHÔNG BỊ MẤT */}
        {bridgeStyle && displayTopic && (
          <div
            data-explain-ui="true"
            style={bridgeStyle}
            className="bg-transparent pointer-events-auto"
            onMouseEnter={() => {
              isMouseInPopoverRef.current = true
              if (hoverLeaveTimerRef.current) {
                clearTimeout(hoverLeaveTimerRef.current)
                hoverLeaveTimerRef.current = null
              }
            }}
            onMouseLeave={() => {
              isMouseInPopoverRef.current = false
            }}
          />
        )}

        {/* 4. POPOVER THUYẾT MINH CHI TIẾT (XUẤT HIỆN NGAY KHI RÊ CHUỘT / HOVER) */}
        {displayTopic && (
          <div
            data-explain-ui="true"
            className={cn(
              'absolute pointer-events-auto z-[9995] flex flex-col rounded-xl border border-amber-500/50 bg-background/95 p-0 text-foreground shadow-2xl backdrop-blur-md transition-all duration-150 animate-in fade-in zoom-in-95',
              isExpanded ? 'w-[480px] max-h-[85vh]' : 'w-[410px] max-h-[78vh]'
            )}
            style={popoverStyle}
            onMouseEnter={() => {
              isMouseInPopoverRef.current = true
              if (hoverLeaveTimerRef.current) {
                clearTimeout(hoverLeaveTimerRef.current)
                hoverLeaveTimerRef.current = null
              }
            }}
            onMouseLeave={() => {
              isMouseInPopoverRef.current = false
              if (!pinnedTopic) {
                if (!hoverLeaveTimerRef.current) {
                  hoverLeaveTimerRef.current = setTimeout(() => {
                    if (!isMouseInPopoverRef.current && !pinnedTopic) {
                      setHoveredTopic(null)
                      setActiveRect(null)
                    }
                    hoverLeaveTimerRef.current = null
                  }, 350)
                }
              }
            }}
          >
            {/* Popover Header */}
            <div className="flex items-center justify-between border-b border-border/80 bg-muted/40 px-4 py-2.5 rounded-t-xl shrink-0">
              <div className="flex items-center gap-2 min-w-0">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-amber-500/20 text-amber-700 dark:text-amber-300">
                  <Lightbulb className="h-3 w-3 fill-amber-500/30" />
                </span>
                <Badge variant="outline" className="border-amber-500/40 bg-amber-500/10 text-[11px] font-semibold text-amber-800 dark:text-amber-300 shrink-0">
                  {displayTopic.category}
                </Badge>
                {pinnedTopic && (
                  <button
                    type="button"
                    onClick={() => {
                      setPinnedTopic(null)
                      toast.info('Đã bỏ ghim thuyết minh')
                    }}
                    className="inline-flex items-center gap-1 text-[10px] text-amber-700 dark:text-amber-300 font-medium bg-amber-500/20 hover:bg-amber-500/30 px-1.5 py-0.5 rounded cursor-pointer transition-colors"
                    title="Bấm để bỏ ghim"
                  >
                    <Pin className="h-2.5 w-2.5 fill-amber-500/40" />
                    <span>Đã ghim (click để bỏ ghim)</span>
                  </button>
                )}
              </div>

              <div className="flex items-center gap-1 shrink-0">
                {/* Nút Sửa & Xóa (CHỈ CÓ Ở BẢN LOCAL DEV) */}
                {canEdit && (
                  <>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon-xs"
                      onClick={() => {
                        setEditingTopic(displayTopic)
                        setEditingRect(activeRect)
                        setEditorOpen(true)
                      }}
                      className="text-amber-700 hover:text-amber-900 hover:bg-amber-500/10 cursor-pointer"
                      title="Chỉnh sửa nội dung thuyết minh này (Local)"
                    >
                      <Edit3 className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon-xs"
                      onClick={() => handleDeleteTopic(displayTopic.id)}
                      className="text-muted-foreground hover:text-destructive cursor-pointer"
                      title="Xóa mục thuyết minh này (Local)"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </>
                )}

                <Button
                  type="button"
                  variant="ghost"
                  size="icon-xs"
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="text-muted-foreground hover:text-foreground cursor-pointer"
                  title={isExpanded ? 'Thu gọn' : 'Mở rộng'}
                >
                  {isExpanded ? <Minimize2 className="h-3.5 w-3.5" /> : <Maximize2 className="h-3.5 w-3.5" />}
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-xs"
                  onClick={() => {
                    setPinnedTopic(null)
                    setHoveredTopic(null)
                    setActiveRect(null)
                  }}
                  className="text-muted-foreground hover:text-foreground cursor-pointer"
                  title="Đóng (ESC)"
                >
                  <X className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>

            {/* Popover Content Body */}
            <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3 text-xs">
              <div>
                <h4 className="text-sm font-bold text-foreground leading-snug">
                  {displayTopic.title}
                </h4>
              </div>

              {/* 1. WHAT */}
              <div className="rounded-lg border border-border/60 bg-muted/30 p-2.5 space-y-1">
                <div className="flex items-center gap-1.5 font-bold uppercase tracking-wider text-[11px] text-sky-700 dark:text-sky-400">
                  <Sparkles className="h-3 w-3" />
                  <span>1. WHAT - Đây là gì?</span>
                </div>
                <p className="text-[11px] leading-relaxed text-foreground/80">
                  {displayTopic.what}
                </p>
              </div>

              {/* 2. WHY */}
              <div className="rounded-lg border border-amber-500/30 bg-amber-500/5 p-2.5 space-y-1">
                <div className="flex items-center gap-1.5 font-bold uppercase tracking-wider text-[11px] text-amber-800 dark:text-amber-300">
                  <Target className="h-3 w-3" />
                  <span>2. WHY - Ý đồ của PO</span>
                </div>
                <p className="text-[11px] leading-relaxed text-foreground/80">
                  {displayTopic.why}
                </p>
              </div>

              {/* 3. WHO */}
              <div className="rounded-lg border border-border/60 bg-muted/30 p-2.5 space-y-1">
                <div className="flex items-center gap-1.5 font-bold uppercase tracking-wider text-[11px] text-purple-700 dark:text-purple-400">
                  <Users className="h-3 w-3" />
                  <span>3. WHO - Ai sử dụng?</span>
                </div>
                <p className="text-[11px] leading-relaxed text-foreground/80 font-medium">
                  {displayTopic.who}
                </p>
              </div>

              {/* 4. RULES */}
              {displayTopic.rules && displayTopic.rules.length > 0 && (
                <div className="rounded-lg border border-border/60 bg-muted/30 p-2.5 space-y-1.5">
                  <div className="flex items-center gap-1.5 font-bold uppercase tracking-wider text-[11px] text-emerald-700 dark:text-emerald-400">
                    <ShieldCheck className="h-3 w-3" />
                    <span>4. RULES - Quy tắc ngầm định</span>
                  </div>
                  <ul className="space-y-1 pl-1">
                    {displayTopic.rules.map((rule, idx) => (
                      <li key={idx} className="flex items-start gap-1.5 text-[11px] leading-relaxed text-foreground/80">
                        <span className="text-emerald-600 dark:text-emerald-400 mt-0.5">•</span>
                        <span>{rule}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* 5. GẮN LINK TÀI LIỆU (DOCUMENT LINKS) */}
              {displayTopic.documentLinks && displayTopic.documentLinks.length > 0 && (
                <div className="rounded-lg border border-primary/20 bg-primary/5 p-2.5 space-y-1.5">
                  <div className="flex items-center gap-1.5 font-semibold text-[11px] text-primary">
                    <FileText className="h-3 w-3" />
                    <span>Tài liệu & Đặc tả liên kết:</span>
                  </div>
                  <div className="flex flex-col gap-1">
                    {displayTopic.documentLinks.map((link, idx) => (
                      <a
                        key={idx}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-between rounded px-2 py-1 text-[11px] font-medium bg-background border border-border/80 hover:bg-muted text-foreground hover:text-primary transition-colors"
                      >
                        <span className="truncate pr-2">{link.label || link.url}</span>
                        <ExternalLink className="h-3 w-3 shrink-0 text-muted-foreground" />
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {/* Traceability User Story */}
              {displayTopic.userStory && (
                <div className="flex items-center justify-between text-[11px] text-muted-foreground pt-0.5 border-t border-border/60">
                  <span className="flex items-center gap-1">
                    <FileText className="h-3 w-3" />
                    <span>Mã User Story:</span>
                  </span>
                  <span className="font-mono font-semibold text-foreground">
                    {displayTopic.userStory}
                  </span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Popover Chỉnh sửa / Tạo mới Thuyết minh (CHỈ LOCAL - KHÔNG LỚP PHỦ MỜ) */}
      {canEdit && (
        <ExplainEditorDialog
          open={editorOpen}
          onOpenChange={setEditorOpen}
          screenId={screenId}
          initialData={editingTopic}
          targetRect={editingRect}
          onSaved={(savedTopic) => {
            loadSpecs()
            setPinnedTopic(savedTopic)
            setHoveredTopic(savedTopic)
          }}
        />
      )}
    </>
  )
}
