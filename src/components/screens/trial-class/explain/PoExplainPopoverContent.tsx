'use client'

import React, { useState } from 'react'
import {
  Lightbulb,
  Copy,
  Check,
  Pin,
  PinOff,
  X,
  Plus,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  ShieldAlert,
  Database,
  FileText,
  Pencil,
  Eye,
  ChevronDown,
} from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { cn } from '@/lib/utils'
import { usePoExplainStore } from './usePoExplainStore'
import { exportPoSpecToMarkdown } from './bookingTrialPoConstants'

interface PoExplainPopoverContentProps {
  sectionId: string
  isPinned: boolean
  onTogglePin: () => void
  onClose: () => void
}

export function PoExplainPopoverContent({
  sectionId,
  isPinned,
  onTogglePin,
  onClose,
}: PoExplainPopoverContentProps) {
  const [copied, setCopied] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [activeTab, setActiveTab] = useState<'ac' | 'cc' | 'br' | 'ds' | 'notes'>('ac')

  // Trạng thái mở rộng từng dòng (mặc định đóng hết thành 1 dòng theo yêu cầu PO)
  const [expandedAcIds, setExpandedAcIds] = useState<string[]>([])
  const [expandedCcIds, setExpandedCcIds] = useState<string[]>([])
  const [expandedBrIds, setExpandedBrIds] = useState<string[]>([])
  const [expandedDsIds, setExpandedDsIds] = useState<string[]>([])

  const section = usePoExplainStore((s) => s.sections.find((sec) => sec.id === sectionId))
  const addAc = usePoExplainStore((s) => s.addAc)
  const updateAc = usePoExplainStore((s) => s.updateAc)
  const removeAc = usePoExplainStore((s) => s.removeAc)

  const addCornerCase = usePoExplainStore((s) => s.addCornerCase)
  const updateCornerCase = usePoExplainStore((s) => s.updateCornerCase)
  const removeCornerCase = usePoExplainStore((s) => s.removeCornerCase)

  const addBusinessRule = usePoExplainStore((s) => s.addBusinessRule)
  const updateBusinessRule = usePoExplainStore((s) => s.updateBusinessRule)
  const removeBusinessRule = usePoExplainStore((s) => s.removeBusinessRule)

  const addDataSource = usePoExplainStore((s) => s.addDataSource)
  const updateDataSource = usePoExplainStore((s) => s.updateDataSource)
  const removeDataSource = usePoExplainStore((s) => s.removeDataSource)

  const updatePoNotes = usePoExplainStore((s) => s.updatePoNotes)

  if (!section) return null

  const handleCopyMarkdown = async () => {
    const md = exportPoSpecToMarkdown([section], section.id)
    try {
      await navigator.clipboard.writeText(md)
      setCopied(true)
      toast.success(`Đã sao chép đặc tả phần "${section.title}" sang Markdown!`)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      toast.error('Không thể sao chép vào bộ nhớ tạm')
    }
  }

  const handleToggleEdit = () => {
    if (!isEditing && !isPinned) {
      onTogglePin() // Tự động ghim khi bắt đầu chỉnh sửa
    }
    setIsEditing((prev) => !prev)
  }

  // Helper toggle từng mục
  const toggleAc = (id: string) => {
    setExpandedAcIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    )
  }

  const toggleCc = (id: string) => {
    setExpandedCcIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    )
  }

  const toggleBr = (id: string) => {
    setExpandedBrIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    )
  }

  const toggleDs = (id: string) => {
    setExpandedDsIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    )
  }

  // Thêm mới và tự động mở dòng vừa thêm
  const handleAddAc = () => {
    const id = addAc(section.id)
    setExpandedAcIds((prev) => [...prev, id])
  }

  const handleAddCc = () => {
    const id = addCornerCase(section.id)
    setExpandedCcIds((prev) => [...prev, id])
  }

  const handleAddBr = () => {
    const id = addBusinessRule(section.id)
    setExpandedBrIds((prev) => [...prev, id])
  }

  const handleAddDs = () => {
    const id = addDataSource(section.id)
    setExpandedDsIds((prev) => [...prev, id])
  }

  return (
    <div className="w-[360px] sm:w-[460px] md:w-[500px] max-h-[82vh] flex flex-col rounded-xl border border-amber-500/40 bg-background/98 text-foreground shadow-2xl backdrop-blur-md overflow-hidden text-xs">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border/80 bg-amber-500/10 px-3.5 py-2.5 shrink-0">
        <div className="flex items-center gap-2 min-w-0">
          <div className="flex h-6 w-6 items-center justify-center rounded-md bg-amber-500 text-white shadow-2xs shrink-0">
            <Lightbulb className="h-3.5 w-3.5 fill-white" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="font-mono text-[10px] font-bold text-amber-700 dark:text-amber-300">
                {section.code}
              </span>
              <Badge
                variant="outline"
                className="text-[9px] px-1 py-0 border-amber-500/30 text-amber-700 dark:text-amber-300"
              >
                {isEditing ? 'Chế độ Sửa' : 'Thuyết minh PO'}
              </Badge>
            </div>
            <h4 className="text-xs font-bold text-foreground truncate" title={section.title}>
              {section.title}
            </h4>
          </div>
        </div>

        {/* Nút hành động góc phải header: Icon Sửa, Ghim, Đóng */}
        <div className="flex items-center gap-1 shrink-0">
          <Button
            type="button"
            variant={isEditing ? 'default' : 'ghost'}
            size="sm"
            onClick={handleToggleEdit}
            title={isEditing ? 'Hoàn tất sửa (Quay về chế độ xem)' : 'Click icon để chỉnh sửa'}
            className={
              isEditing
                ? 'h-6 px-2 text-[10.5px] bg-amber-600 hover:bg-amber-700 text-white gap-1'
                : 'h-6 w-6 p-0 text-amber-700 dark:text-amber-300 hover:bg-amber-500/15'
            }
          >
            {isEditing ? (
              <>
                <Check className="h-3 w-3" />
                <span>Xong</span>
              </>
            ) : (
              <Pencil className="h-3.5 w-3.5" />
            )}
          </Button>

          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            onClick={onTogglePin}
            title={isPinned ? 'Bỏ ghim popover' : 'Ghim popover để giữ cố định'}
            className={
              isPinned
                ? 'h-6 w-6 text-amber-600 bg-amber-500/15'
                : 'h-6 w-6 text-muted-foreground hover:text-foreground'
            }
          >
            {isPinned ? <PinOff className="h-3.5 w-3.5" /> : <Pin className="h-3.5 w-3.5" />}
          </Button>

          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            onClick={onClose}
            title="Đóng popover"
            className="h-6 w-6 text-muted-foreground hover:text-foreground"
          >
            <X className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>

      {/* Tabs Switcher */}
      <Tabs
        value={activeTab}
        onValueChange={(val) => setActiveTab(val as 'ac' | 'cc' | 'br' | 'ds' | 'notes')}
        className="flex-1 flex flex-col min-h-0"
      >
        <div className="border-b border-border/70 bg-muted/30 px-2 py-1 shrink-0 overflow-x-auto scrollbar-none">
          <TabsList className="bg-transparent h-7 p-0 gap-1">
            <TabsTrigger
              value="ac"
              className="h-6 px-2 text-[11px] data-[state=active]:bg-amber-500 data-[state=active]:text-white rounded-md flex items-center gap-1"
            >
              <CheckCircle2 className="h-3 w-3" />
              <span>Tiêu chí (AC)</span>
              <span className="text-[9px] opacity-80">({section.acceptanceCriteriaList.length})</span>
            </TabsTrigger>
            <TabsTrigger
              value="cc"
              className="h-6 px-2 text-[11px] data-[state=active]:bg-amber-500 data-[state=active]:text-white rounded-md flex items-center gap-1"
            >
              <AlertTriangle className="h-3 w-3" />
              <span>Corner Cases</span>
              <span className="text-[9px] opacity-80">({section.cornerCasesList.length})</span>
            </TabsTrigger>
            <TabsTrigger
              value="br"
              className="h-6 px-2 text-[11px] data-[state=active]:bg-amber-500 data-[state=active]:text-white rounded-md flex items-center gap-1"
            >
              <ShieldAlert className="h-3 w-3" />
              <span>Quy tắc (BR)</span>
              <span className="text-[9px] opacity-80">({section.businessRulesList.length})</span>
            </TabsTrigger>
            <TabsTrigger
              value="ds"
              className="h-6 px-2 text-[11px] data-[state=active]:bg-amber-500 data-[state=active]:text-white rounded-md flex items-center gap-1"
            >
              <Database className="h-3 w-3" />
              <span>Nguồn DL</span>
              <span className="text-[9px] opacity-80">({section.dataSources.length})</span>
            </TabsTrigger>
            <TabsTrigger
              value="notes"
              className="h-6 px-2 text-[11px] data-[state=active]:bg-amber-500 data-[state=active]:text-white rounded-md flex items-center gap-1"
            >
              <FileText className="h-3 w-3" />
              <span>Ghi chú</span>
            </TabsTrigger>
          </TabsList>
        </div>

        {/* ================= TAB 1: TIÊU CHÍ NGHIỆM THU (AC - BDD) ================= */}
        <TabsContent value="ac" className="flex-1 overflow-y-auto p-3.5 space-y-2.5 m-0">
          <div className="flex items-center justify-between pb-1 border-b border-border/50">
            <span className="font-semibold text-foreground text-xs flex items-center gap-1">
              <span>Tiêu chí nghiệm thu (BDD Gherkin)</span>
            </span>
            {isEditing && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleAddAc}
                className="h-6 px-2 text-[10.5px] border-amber-500/40 text-amber-700 dark:text-amber-300 hover:bg-amber-500/15"
              >
                <Plus className="h-3 w-3 mr-0.5" /> Thêm tiêu chí (AC)
              </Button>
            )}
          </div>

          {/* VIEW MODE: MỖI DÒNG 1 HÀNG THU GỌN — CLICK ĐỂ MỞ RỘNG CHI TIẾT */}
          {!isEditing ? (
            <div className="space-y-1.5">
              {section.acceptanceCriteriaList.length === 0 ? (
                <div className="flex flex-col items-center justify-center p-5 text-center rounded-lg border border-dashed border-border/80 bg-muted/20">
                  <CheckCircle2 className="h-6 w-6 text-muted-foreground/40 mb-1" />
                  <p className="text-xs font-medium text-foreground">Chưa có tiêu chí nghiệm thu</p>
                  <p className="text-[11px] text-muted-foreground mt-0.5">
                    Click vào icon <Pencil className="inline h-3 w-3 text-amber-600" /> ở trên để thêm
                  </p>
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setIsEditing(true)
                      handleAddAc()
                    }}
                    className="mt-2 h-6 text-[10.5px] border-amber-500/40 text-amber-700 dark:text-amber-300"
                  >
                    <Plus className="h-3 w-3 mr-1" /> Thêm tiêu chí (AC)
                  </Button>
                </div>
              ) : (
                section.acceptanceCriteriaList.map((ac, idx) => {
                  const isExpanded = expandedAcIds.includes(ac.id)
                  return (
                    <div
                      key={ac.id}
                      className="rounded-lg border border-border/70 bg-card overflow-hidden transition-all shadow-2xs"
                    >
                      {/* Dòng tóm tắt 1 hàng duy nhất */}
                      <button
                        type="button"
                        onClick={() => toggleAc(ac.id)}
                        className="flex w-full items-center justify-between gap-2 px-2.5 py-1.5 text-left hover:bg-muted/30 transition-colors cursor-pointer select-none"
                      >
                        <div className="flex items-center gap-1.5 min-w-0 flex-1">
                          <Badge variant="outline" className="text-[10px] font-bold border-amber-500/30 text-amber-700 dark:text-amber-300 shrink-0">
                            AC-{idx + 1}
                          </Badge>
                          <span className="font-semibold text-foreground text-xs truncate">
                            {ac.scenario || 'Kịch bản chưa đặt tên (click để xem)'}
                          </span>
                        </div>
                        <ChevronDown
                          className={cn(
                            'h-3.5 w-3.5 text-muted-foreground transition-transform duration-200 shrink-0',
                            isExpanded && 'rotate-180'
                          )}
                        />
                      </button>

                      {/* Chi tiết mở rộng: Giả sử - Khi - Thì */}
                      {isExpanded && (
                        <div className="px-3 pb-2.5 pt-1 border-t border-border/50 bg-muted/10 space-y-1 text-xs">
                          <div className="space-y-0.5 pl-2 border-l-2 border-amber-500/40">
                            <p className="text-muted-foreground leading-snug">
                              <span className="font-semibold text-foreground">Giả sử: </span>
                              {ac.given || '—'}
                            </p>
                            <p className="text-muted-foreground leading-snug">
                              <span className="font-semibold text-foreground">Khi: </span>
                              {ac.when || '—'}
                            </p>
                            <p className="text-muted-foreground leading-snug">
                              <span className="font-semibold text-foreground">Thì: </span>
                              {ac.then || '—'}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  )
                })
              )}
            </div>
          ) : (
            /* EDIT MODE: CÓ THỂ MỞ RỘNG / THU GỌN KHI NHẬP LIỆU */
            <div className="space-y-2">
              {section.acceptanceCriteriaList.map((ac, idx) => {
                const isExpanded = expandedAcIds.includes(ac.id)
                return (
                  <div
                    key={ac.id}
                    className="rounded-lg border border-border/80 bg-card shadow-2xs overflow-hidden"
                  >
                    <div className="flex items-center justify-between gap-1.5 p-2 bg-muted/20 border-b border-border/40">
                      <div className="flex items-center gap-1.5 flex-1 min-w-0">
                        <Badge variant="outline" className="text-[10px] font-bold border-amber-500/30 text-amber-700 dark:text-amber-300 shrink-0">
                          AC-{idx + 1}
                        </Badge>
                        <input
                          type="text"
                          value={ac.scenario}
                          onChange={(e) => updateAc(section.id, ac.id, 'scenario', e.target.value)}
                          placeholder="[Tên kịch bản (VD: Đặt lịch thành công...)]"
                          className="flex-1 rounded border border-input bg-background px-2 py-0.5 text-xs font-medium placeholder:text-muted-foreground/60 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-amber-500"
                        />
                      </div>
                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          type="button"
                          onClick={() => toggleAc(ac.id)}
                          className="p-1 text-muted-foreground hover:text-foreground rounded cursor-pointer"
                          title={isExpanded ? 'Thu gọn' : 'Mở rộng chi tiết'}
                        >
                          <ChevronDown className={cn('h-3.5 w-3.5 transition-transform', isExpanded && 'rotate-180')} />
                        </button>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon-sm"
                          onClick={() => removeAc(section.id, ac.id)}
                          title="Xóa tiêu chí này"
                          className="h-6 w-6 text-muted-foreground hover:text-destructive"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>

                    {isExpanded && (
                      <div className="p-2.5 space-y-1.5 pl-3 border-l-2 border-amber-500/30 bg-background/50">
                        <div className="grid grid-cols-[60px_1fr] items-center gap-1.5">
                          <span className="text-[11px] font-semibold text-muted-foreground">Giả sử:</span>
                          <input
                            type="text"
                            value={ac.given}
                            onChange={(e) => updateAc(section.id, ac.id, 'given', e.target.value)}
                            placeholder="[Tiền điều kiện...]"
                            className="w-full rounded border border-input bg-background px-2 py-0.5 text-xs placeholder:text-muted-foreground/60 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-amber-500"
                          />
                        </div>
                        <div className="grid grid-cols-[60px_1fr] items-center gap-1.5">
                          <span className="text-[11px] font-semibold text-muted-foreground">Khi:</span>
                          <input
                            type="text"
                            value={ac.when}
                            onChange={(e) => updateAc(section.id, ac.id, 'when', e.target.value)}
                            placeholder="[Hành động người dùng...]"
                            className="w-full rounded border border-input bg-background px-2 py-0.5 text-xs placeholder:text-muted-foreground/60 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-amber-500"
                          />
                        </div>
                        <div className="grid grid-cols-[60px_1fr] items-center gap-1.5">
                          <span className="text-[11px] font-semibold text-muted-foreground">Thì:</span>
                          <input
                            type="text"
                            value={ac.then}
                            onChange={(e) => updateAc(section.id, ac.id, 'then', e.target.value)}
                            placeholder="[Phản hồi hệ thống...]"
                            className="w-full rounded border border-input bg-background px-2 py-0.5 text-xs placeholder:text-muted-foreground/60 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-amber-500"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </TabsContent>

        {/* ================= TAB 2: CORNER CASES ================= */}
        <TabsContent value="cc" className="flex-1 overflow-y-auto p-3.5 space-y-2.5 m-0">
          <div className="flex items-center justify-between pb-1 border-b border-border/50">
            <span className="font-semibold text-foreground text-xs">
              Trường hợp ngoại lệ (Corner Cases)
            </span>
            {isEditing && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleAddCc}
                className="h-6 px-2 text-[10.5px] border-amber-500/40 text-amber-700 dark:text-amber-300 hover:bg-amber-500/15"
              >
                <Plus className="h-3 w-3 mr-0.5" /> Thêm Corner Case
              </Button>
            )}
          </div>

          {/* VIEW MODE: MỖI CORNER CASE LÀ 1 DÒNG DUY NHẤT — MỞ RỘNG ĐỂ XEM CHI TIẾT */}
          {!isEditing ? (
            <div className="space-y-1.5">
              {section.cornerCasesList.length === 0 ? (
                <div className="flex flex-col items-center justify-center p-5 text-center rounded-lg border border-dashed border-border/80 bg-muted/20">
                  <AlertTriangle className="h-6 w-6 text-muted-foreground/40 mb-1" />
                  <p className="text-xs font-medium text-foreground">Chưa có trường hợp ngoại lệ</p>
                  <p className="text-[11px] text-muted-foreground mt-0.5">
                    Click vào icon <Pencil className="inline h-3 w-3 text-amber-600" /> ở trên để thêm
                  </p>
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setIsEditing(true)
                      handleAddCc()
                    }}
                    className="mt-2 h-6 text-[10.5px] border-amber-500/40 text-amber-700 dark:text-amber-300"
                  >
                    <Plus className="h-3 w-3 mr-1" /> Thêm Corner Case
                  </Button>
                </div>
              ) : (
                section.cornerCasesList.map((cc) => {
                  const isExpanded = expandedCcIds.includes(cc.id)
                  return (
                    <div
                      key={cc.id}
                      className="rounded-lg border border-border/70 bg-card overflow-hidden transition-all shadow-2xs"
                    >
                      {/* Dòng tóm tắt 1 hàng duy nhất */}
                      <button
                        type="button"
                        onClick={() => toggleCc(cc.id)}
                        className="flex w-full items-center justify-between gap-2 px-2.5 py-1.5 text-left hover:bg-muted/30 transition-colors cursor-pointer select-none"
                      >
                        <div className="flex items-center gap-1.5 min-w-0 flex-1">
                          <span className="font-mono text-[10px] font-bold text-amber-700 dark:text-amber-300 bg-amber-500/10 px-1 py-0.5 rounded shrink-0">
                            {cc.code || 'CASE'}
                          </span>
                          <span className="font-semibold text-foreground text-xs truncate">
                            {cc.title || cc.scenario || 'Ngoại lệ chưa đặt tên (click để xem)'}
                          </span>
                        </div>
                        <ChevronDown
                          className={cn(
                            'h-3.5 w-3.5 text-muted-foreground transition-transform duration-200 shrink-0',
                            isExpanded && 'rotate-180'
                          )}
                        />
                      </button>

                      {/* Chi tiết mở rộng */}
                      {isExpanded && (
                        <div className="px-3 pb-2.5 pt-1 border-t border-border/50 bg-muted/10 space-y-1 text-xs">
                          <div className="space-y-1 pl-2 border-l-2 border-rose-500/40">
                            <p className="text-muted-foreground leading-snug">
                              <span className="font-semibold text-foreground">Tình huống phát sinh: </span>
                              {cc.scenario || '—'}
                            </p>
                            <p className="text-muted-foreground leading-snug">
                              <span className="font-semibold text-foreground">Cách hệ thống xử lý: </span>
                              {cc.handling || '—'}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  )
                })
              )}
            </div>
          ) : (
            /* EDIT MODE */
            <div className="space-y-2">
              {section.cornerCasesList.map((cc) => {
                const isExpanded = expandedCcIds.includes(cc.id)
                return (
                  <div
                    key={cc.id}
                    className="rounded-lg border border-border/80 bg-card shadow-2xs overflow-hidden"
                  >
                    <div className="flex items-center justify-between gap-1.5 p-2 bg-muted/20 border-b border-border/40">
                      <div className="flex items-center gap-1.5 flex-1 min-w-0">
                        <input
                          type="text"
                          value={cc.code}
                          onChange={(e) => updateCornerCase(section.id, cc.id, 'code', e.target.value)}
                          placeholder="Mã (CASE-01)"
                          className="w-18 rounded border border-input bg-background px-1.5 py-0.5 text-center font-mono text-[10px] font-bold text-amber-700 dark:text-amber-300 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-amber-500"
                        />
                        <input
                          type="text"
                          value={cc.title}
                          onChange={(e) => updateCornerCase(section.id, cc.id, 'title', e.target.value)}
                          placeholder="[Tên trường hợp ngoại lệ (VD: Trùng lịch, Hết chỗ...)]"
                          className="flex-1 rounded border border-input bg-background px-2 py-0.5 text-xs font-medium placeholder:text-muted-foreground/60 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-amber-500"
                        />
                      </div>
                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          type="button"
                          onClick={() => toggleCc(cc.id)}
                          className="p-1 text-muted-foreground hover:text-foreground rounded cursor-pointer"
                          title={isExpanded ? 'Thu gọn' : 'Mở rộng chi tiết'}
                        >
                          <ChevronDown className={cn('h-3.5 w-3.5 transition-transform', isExpanded && 'rotate-180')} />
                        </button>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon-sm"
                          onClick={() => removeCornerCase(section.id, cc.id)}
                          title="Xóa trường hợp này"
                          className="h-6 w-6 text-muted-foreground hover:text-destructive"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>

                    {isExpanded && (
                      <div className="p-2.5 space-y-1.5 pl-3 border-l-2 border-rose-500/30 bg-background/50">
                        <div className="space-y-0.5">
                          <span className="text-[10.5px] font-semibold text-muted-foreground">Tình huống phát sinh:</span>
                          <textarea
                            value={cc.scenario}
                            onChange={(e) => updateCornerCase(section.id, cc.id, 'scenario', e.target.value)}
                            placeholder="[Mô tả tình huống xảy ra ngoại lệ...]"
                            rows={2}
                            className="w-full rounded border border-input bg-background px-2 py-1 text-xs placeholder:text-muted-foreground/60 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-amber-500 resize-y"
                          />
                        </div>
                        <div className="space-y-0.5">
                          <span className="text-[10.5px] font-semibold text-muted-foreground">Cách hệ thống xử lý:</span>
                          <textarea
                            value={cc.handling}
                            onChange={(e) => updateCornerCase(section.id, cc.id, 'handling', e.target.value)}
                            placeholder="[Thông báo lỗi, chặn thao tác hoặc luồng xử lý...]"
                            rows={2}
                            className="w-full rounded border border-input bg-background px-2 py-1 text-xs placeholder:text-muted-foreground/60 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-amber-500 resize-y"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </TabsContent>

        {/* ================= TAB 3: QUY TẮC NGHIỆP VỤ (BR) ================= */}
        <TabsContent value="br" className="flex-1 overflow-y-auto p-3.5 space-y-2.5 m-0">
          <div className="flex items-center justify-between pb-1 border-b border-border/50">
            <span className="font-semibold text-foreground text-xs">
              Quy tắc nghiệp vụ & Ràng buộc (Business Rules)
            </span>
            {isEditing && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleAddBr}
                className="h-6 px-2 text-[10.5px] border-amber-500/40 text-amber-700 dark:text-amber-300 hover:bg-amber-500/15"
              >
                <Plus className="h-3 w-3 mr-0.5" /> Thêm Quy tắc (BR)
              </Button>
            )}
          </div>

          {!isEditing ? (
            <div className="space-y-1.5">
              {section.businessRulesList.length === 0 ? (
                <div className="flex flex-col items-center justify-center p-5 text-center rounded-lg border border-dashed border-border/80 bg-muted/20">
                  <ShieldAlert className="h-6 w-6 text-muted-foreground/40 mb-1" />
                  <p className="text-xs font-medium text-foreground">Chưa có quy tắc nghiệp vụ</p>
                  <p className="text-[11px] text-muted-foreground mt-0.5">
                    Click vào icon <Pencil className="inline h-3 w-3 text-amber-600" /> ở trên để thêm
                  </p>
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setIsEditing(true)
                      handleAddBr()
                    }}
                    className="mt-2 h-6 text-[10.5px] border-amber-500/40 text-amber-700 dark:text-amber-300"
                  >
                    <Plus className="h-3 w-3 mr-1" /> Thêm Quy tắc (BR)
                  </Button>
                </div>
              ) : (
                section.businessRulesList.map((br) => {
                  const isExpanded = expandedBrIds.includes(br.id)
                  return (
                    <div
                      key={br.id}
                      className="rounded-lg border border-border/70 bg-card overflow-hidden transition-all shadow-2xs"
                    >
                      <button
                        type="button"
                        onClick={() => toggleBr(br.id)}
                        className="flex w-full items-center justify-between gap-2 px-2.5 py-1.5 text-left hover:bg-muted/30 transition-colors cursor-pointer select-none"
                      >
                        <div className="flex items-center gap-1.5 min-w-0 flex-1">
                          <span className="font-mono text-[10px] font-bold text-amber-700 dark:text-amber-300 bg-amber-500/10 px-1 py-0.5 rounded shrink-0">
                            {br.code || 'BR'}
                          </span>
                          <span className="font-semibold text-foreground text-xs truncate">
                            {br.title || br.rule || 'Quy tắc chưa đặt tên (click để xem)'}
                          </span>
                        </div>
                        <ChevronDown
                          className={cn(
                            'h-3.5 w-3.5 text-muted-foreground transition-transform duration-200 shrink-0',
                            isExpanded && 'rotate-180'
                          )}
                        />
                      </button>

                      {isExpanded && (
                        <div className="px-3 pb-2.5 pt-1 border-t border-border/50 bg-muted/10 text-xs">
                          <div className="pl-2 border-l-2 border-blue-500/40">
                            <p className="text-muted-foreground leading-snug whitespace-pre-line">
                              {br.rule || '—'}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  )
                })
              )}
            </div>
          ) : (
            <div className="space-y-2">
              {section.businessRulesList.map((br) => {
                const isExpanded = expandedBrIds.includes(br.id)
                return (
                  <div
                    key={br.id}
                    className="rounded-lg border border-border/80 bg-card shadow-2xs overflow-hidden"
                  >
                    <div className="flex items-center justify-between gap-1.5 p-2 bg-muted/20 border-b border-border/40">
                      <div className="flex items-center gap-1.5 flex-1 min-w-0">
                        <input
                          type="text"
                          value={br.code}
                          onChange={(e) => updateBusinessRule(section.id, br.id, 'code', e.target.value)}
                          placeholder="Mã (BR-01)"
                          className="w-18 rounded border border-input bg-background px-1.5 py-0.5 text-center font-mono text-[10px] font-bold text-amber-700 dark:text-amber-300 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-amber-500"
                        />
                        <input
                          type="text"
                          value={br.title}
                          onChange={(e) => updateBusinessRule(section.id, br.id, 'title', e.target.value)}
                          placeholder="[Tên quy tắc (VD: Giới hạn sĩ số...)]"
                          className="flex-1 rounded border border-input bg-background px-2 py-0.5 text-xs font-medium placeholder:text-muted-foreground/60 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-amber-500"
                        />
                      </div>
                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          type="button"
                          onClick={() => toggleBr(br.id)}
                          className="p-1 text-muted-foreground hover:text-foreground rounded cursor-pointer"
                          title={isExpanded ? 'Thu gọn' : 'Mở rộng chi tiết'}
                        >
                          <ChevronDown className={cn('h-3.5 w-3.5 transition-transform', isExpanded && 'rotate-180')} />
                        </button>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon-sm"
                          onClick={() => removeBusinessRule(section.id, br.id)}
                          title="Xóa quy tắc này"
                          className="h-6 w-6 text-muted-foreground hover:text-destructive"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>

                    {isExpanded && (
                      <div className="p-2.5 space-y-1 pl-3 border-l-2 border-blue-500/30 bg-background/50">
                        <span className="text-[10.5px] font-semibold text-muted-foreground">Nội dung quy tắc / Điều kiện:</span>
                        <textarea
                          value={br.rule}
                          onChange={(e) => updateBusinessRule(section.id, br.id, 'rule', e.target.value)}
                          placeholder="[Mô tả chi tiết điều kiện và ràng buộc nghiệp vụ...]"
                          rows={2}
                          className="w-full rounded border border-input bg-background px-2 py-1 text-xs placeholder:text-muted-foreground/60 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-amber-500 resize-y"
                        />
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </TabsContent>

        {/* ================= TAB 4: NGUỒN DỮ LIỆU (DATA SOURCES) ================= */}
        <TabsContent value="ds" className="flex-1 overflow-y-auto p-3.5 space-y-2.5 m-0">
          <div className="flex items-center justify-between pb-1 border-b border-border/50">
            <span className="font-semibold text-foreground text-xs">
              Nguồn dữ liệu & CSDL (Data Sources)
            </span>
            {isEditing && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleAddDs}
                className="h-6 px-2 text-[10.5px] border-amber-500/40 text-amber-700 dark:text-amber-300 hover:bg-amber-500/15"
              >
                <Plus className="h-3 w-3 mr-0.5" /> Thêm Nguồn DL
              </Button>
            )}
          </div>

          {!isEditing ? (
            <div className="space-y-1.5">
              {section.dataSources.length === 0 ? (
                <div className="flex flex-col items-center justify-center p-5 text-center rounded-lg border border-dashed border-border/80 bg-muted/20">
                  <Database className="h-6 w-6 text-muted-foreground/40 mb-1" />
                  <p className="text-xs font-medium text-foreground">Chưa có thông tin nguồn dữ liệu</p>
                  <p className="text-[11px] text-muted-foreground mt-0.5">
                    Click vào icon <Pencil className="inline h-3 w-3 text-amber-600" /> ở trên để thêm
                  </p>
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setIsEditing(true)
                      handleAddDs()
                    }}
                    className="mt-2 h-6 text-[10.5px] border-amber-500/40 text-amber-700 dark:text-amber-300"
                  >
                    <Plus className="h-3 w-3 mr-1" /> Thêm Nguồn DL
                  </Button>
                </div>
              ) : (
                section.dataSources.map((ds, idx) => {
                  const isExpanded = expandedDsIds.includes(ds.id)
                  return (
                    <div
                      key={ds.id}
                      className="rounded-lg border border-border/70 bg-card overflow-hidden transition-all shadow-2xs"
                    >
                      <button
                        type="button"
                        onClick={() => toggleDs(ds.id)}
                        className="flex w-full items-center justify-between gap-2 px-2.5 py-1.5 text-left hover:bg-muted/30 transition-colors cursor-pointer select-none"
                      >
                        <div className="flex items-center gap-1.5 min-w-0 flex-1">
                          <span className="font-mono text-[10px] font-bold text-muted-foreground shrink-0">
                            #{idx + 1}
                          </span>
                          <span className="font-mono font-semibold text-foreground text-xs truncate">
                            {ds.entity || 'Bảng chưa đặt tên (click để xem)'}
                          </span>
                          {ds.fields && (
                            <span className="text-[10.5px] text-muted-foreground truncate hidden sm:inline">
                              ({ds.fields})
                            </span>
                          )}
                        </div>
                        <ChevronDown
                          className={cn(
                            'h-3.5 w-3.5 text-muted-foreground transition-transform duration-200 shrink-0',
                            isExpanded && 'rotate-180'
                          )}
                        />
                      </button>

                      {isExpanded && (
                        <div className="px-3 pb-2.5 pt-1 border-t border-border/50 bg-muted/10 space-y-1 text-xs">
                          <div className="space-y-0.5 pl-2 border-l-2 border-emerald-500/40">
                            <p className="text-muted-foreground leading-snug">
                              <span className="font-semibold text-foreground">Trường thông tin: </span>
                              <code className="text-foreground/90 font-mono text-[11px]">{ds.fields || '—'}</code>
                            </p>
                            {ds.notes && (
                              <p className="text-muted-foreground leading-snug">
                                <span className="font-semibold text-foreground">Ghi chú: </span>
                                {ds.notes}
                              </p>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  )
                })
              )}
            </div>
          ) : (
            <div className="space-y-2">
              {section.dataSources.map((ds, idx) => {
                const isExpanded = expandedDsIds.includes(ds.id)
                return (
                  <div
                    key={ds.id}
                    className="rounded-lg border border-border/80 bg-card shadow-2xs overflow-hidden"
                  >
                    <div className="flex items-center justify-between gap-1.5 p-2 bg-muted/20 border-b border-border/40">
                      <div className="flex items-center gap-1.5 flex-1 min-w-0">
                        <span className="font-mono text-[10px] font-bold text-muted-foreground shrink-0">
                          #{idx + 1}
                        </span>
                        <input
                          type="text"
                          value={ds.entity}
                          onChange={(e) => updateDataSource(section.id, ds.id, 'entity', e.target.value)}
                          placeholder="[Tên bảng (VD: crm_leads...)]"
                          className="flex-1 rounded border border-input bg-background px-2 py-0.5 text-xs font-mono placeholder:text-muted-foreground/60 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-amber-500"
                        />
                      </div>
                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          type="button"
                          onClick={() => toggleDs(ds.id)}
                          className="p-1 text-muted-foreground hover:text-foreground rounded cursor-pointer"
                          title={isExpanded ? 'Thu gọn' : 'Mở rộng chi tiết'}
                        >
                          <ChevronDown className={cn('h-3.5 w-3.5 transition-transform', isExpanded && 'rotate-180')} />
                        </button>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon-sm"
                          onClick={() => removeDataSource(section.id, ds.id)}
                          title="Xóa nguồn này"
                          className="h-6 w-6 text-muted-foreground hover:text-destructive"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>

                    {isExpanded && (
                      <div className="p-2.5 space-y-1.5 pl-3 border-l-2 border-emerald-500/30 bg-background/50">
                        <div className="grid grid-cols-[85px_1fr] items-center gap-1.5">
                          <span className="text-[10.5px] font-semibold text-muted-foreground">Thuộc tính:</span>
                          <input
                            type="text"
                            value={ds.fields}
                            onChange={(e) => updateDataSource(section.id, ds.id, 'fields', e.target.value)}
                            placeholder="[Thuộc tính (studentName, phone...)]"
                            className="w-full rounded border border-input bg-background px-2 py-0.5 text-xs placeholder:text-muted-foreground/60 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-amber-500"
                          />
                        </div>
                        <div className="grid grid-cols-[85px_1fr] items-center gap-1.5">
                          <span className="text-[10.5px] font-semibold text-muted-foreground">Ghi chú:</span>
                          <input
                            type="text"
                            value={ds.notes}
                            onChange={(e) => updateDataSource(section.id, ds.id, 'notes', e.target.value)}
                            placeholder="[Kiểu dữ liệu, ràng buộc...]"
                            className="w-full rounded border border-input bg-background px-2 py-0.5 text-xs placeholder:text-muted-foreground/60 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-amber-500"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </TabsContent>

        {/* ================= TAB 5: GHI CHÚ PO ================= */}
        <TabsContent value="notes" className="flex-1 overflow-y-auto p-3.5 space-y-3 m-0">
          <div className="rounded-lg bg-muted/40 p-2.5 text-[11px] text-muted-foreground leading-relaxed">
            <span className="font-semibold text-foreground">Ý đồ thiết kế: </span>
            {section.intent}
          </div>

          {!isEditing ? (
            <div className="space-y-1">
              <span className="font-semibold text-foreground text-xs">Ghi chú bổ sung của PO:</span>
              <div className="rounded-md border border-border/70 bg-card p-2.5 text-xs text-muted-foreground leading-relaxed whitespace-pre-line min-h-[60px]">
                {section.poNotes?.trim() ? (
                  <span className="text-foreground">{section.poNotes}</span>
                ) : (
                  <span className="italic text-muted-foreground/70">
                    Chưa có ghi chú bổ sung. Click vào icon ✏️ ở trên để nhập ghi chú cho Dev/Tester.
                  </span>
                )}
              </div>
            </div>
          ) : (
            <div className="space-y-1">
              <span className="font-semibold text-foreground text-xs">Ghi chú bổ sung của PO:</span>
              <textarea
                value={section.poNotes}
                onChange={(e) => updatePoNotes(section.id, e.target.value)}
                placeholder="[Nhập dặn dò cho Dev/Tester, câu hỏi làm rõ hoặc lưu ý phiên bản...]"
                rows={4}
                className="w-full rounded-md border border-input bg-background px-2.5 py-2 text-xs placeholder:text-muted-foreground/60 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-amber-500 resize-y"
              />
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Footer */}
      <div className="border-t border-border/80 bg-background/95 px-3.5 py-2 flex items-center justify-between gap-2 shrink-0">
        <span className="text-[10px] text-muted-foreground flex items-center gap-1">
          {isEditing ? (
            <>
              <Pencil className="h-3 w-3 text-amber-600 animate-pulse" />
              <span>Đang chỉnh sửa</span>
            </>
          ) : (
            <>
              <Eye className="h-3 w-3 text-muted-foreground" />
              <span>{isPinned ? '📌 Đang ghim' : 'Chế độ xem'}</span>
            </>
          )}
        </span>

        <div className="flex items-center gap-1.5">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleCopyMarkdown}
            className="h-7 px-2 text-[11px] text-muted-foreground hover:text-foreground"
          >
            {copied ? <Check className="h-3 w-3 mr-1 text-emerald-500" /> : <Copy className="h-3 w-3 mr-1" />}
            Copy MD
          </Button>

          {!isEditing ? (
            <Button
              type="button"
              variant="default"
              size="sm"
              onClick={handleToggleEdit}
              className="h-7 px-2.5 text-[11px] bg-amber-600 hover:bg-amber-700 text-white gap-1"
            >
              <Pencil className="h-3 w-3" />
              Sửa nội dung
            </Button>
          ) : (
            <Button
              type="button"
              variant="default"
              size="sm"
              onClick={handleToggleEdit}
              className="h-7 px-2.5 text-[11px] bg-emerald-600 hover:bg-emerald-700 text-white gap-1"
            >
              <Check className="h-3 w-3" />
              Hoàn tất sửa
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
