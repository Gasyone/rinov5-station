'use client'

import React, { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Copy,
  Check,
  RotateCcw,
  Lightbulb,
  Plus,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  ShieldAlert,
  Database,
} from 'lucide-react'
import { toast } from 'sonner'
import { usePoExplainStore } from './usePoExplainStore'
import { exportPoSpecToMarkdown } from './bookingTrialPoConstants'

interface BookingTrialPoAllInOneModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function BookingTrialPoAllInOneModal({
  open,
  onOpenChange,
}: BookingTrialPoAllInOneModalProps) {
  const [copied, setCopied] = useState(false)
  const sections = usePoExplainStore((s) => s.sections)
  const resetSections = usePoExplainStore((s) => s.resetSections)

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

  const handleCopyAll = async () => {
    const md = exportPoSpecToMarkdown(sections)
    try {
      await navigator.clipboard.writeText(md)
      setCopied(true)
      toast.success('Đã sao chép toàn bộ bảng đặc tả PO sang Markdown!')
      setTimeout(() => setCopied(false), 2000)
    } catch {
      toast.error('Không thể sao chép vào bộ nhớ tạm')
    }
  }

  const handleResetAll = () => {
    resetSections()
    toast.info('Đã đặt lại toàn bộ mẫu trống cho tất cả phân vùng!')
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl max-h-[90vh] flex flex-col p-0 gap-0 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border bg-amber-500/10 px-6 py-4 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500 text-white shadow-xs">
              <Lightbulb className="h-4.5 w-4.5 fill-white" />
            </div>
            <div>
              <DialogTitle className="text-base font-bold text-foreground">
                Bảng Tổng Hợp Thuyết Minh PO — Đặt Lịch Học Thử
              </DialogTitle>
              <p className="text-xs text-muted-foreground">
                Tổng hợp 7 phân vùng giao diện cho URL: <code className="text-foreground">/booking-trial?leadId=lead-008</code>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="default"
              size="sm"
              onClick={handleCopyAll}
              className="h-8 gap-1.5 bg-amber-600 hover:bg-amber-700 text-white text-xs"
            >
              {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
              Sao chép Markdown
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleResetAll}
              className="h-8 gap-1.5 text-xs text-muted-foreground hover:text-foreground"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              Đặt lại mẫu trống
            </Button>
          </div>
        </div>

        {/* Scrollable Matrix */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {sections.map((sec, idx) => (
            <div
              key={sec.id}
              className="rounded-xl border border-border/80 bg-card p-4 space-y-4 shadow-2xs"
            >
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border/60 pb-2.5">
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/30 text-xs font-bold">
                    {idx + 1}. {sec.code}
                  </Badge>
                  <h4 className="text-sm font-bold text-foreground">{sec.title}</h4>
                </div>
                <span className="font-mono text-[10px] text-muted-foreground bg-muted px-2 py-0.5 rounded">
                  {sec.targetSelector}
                </span>
              </div>

              <div className="rounded-md bg-muted/40 p-2.5 text-xs text-foreground/80 leading-relaxed">
                <span className="font-semibold text-foreground">Ý đồ thiết kế: </span>
                {sec.intent}
              </div>

              {/* 1. Tiêu chí nghiệm thu (AC) */}
              <div className="space-y-2 pt-1 border-t border-border/50">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-foreground flex items-center gap-1.5">
                    <CheckCircle2 className="h-3.5 w-3.5 text-amber-500" />
                    <span>Tiêu chí nghiệm thu (Acceptance Criteria — BDD Gherkin)</span>
                  </span>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => addAc(sec.id)}
                    className="h-6 px-2 text-[10.5px] border-amber-500/40 text-amber-700 dark:text-amber-300 hover:bg-amber-500/15"
                  >
                    <Plus className="h-3 w-3 mr-0.5" /> Thêm tiêu chí (AC)
                  </Button>
                </div>
                <div className="space-y-2">
                  {sec.acceptanceCriteriaList.map((ac, acIdx) => (
                    <div key={ac.id} className="rounded-lg border border-border/70 bg-background/50 p-2.5 space-y-2 text-xs">
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-mono text-[10px] font-bold text-amber-700 dark:text-amber-300 shrink-0">
                          AC-{acIdx + 1}
                        </span>
                        <input
                          type="text"
                          value={ac.scenario}
                          onChange={(e) => updateAc(sec.id, ac.id, 'scenario', e.target.value)}
                          placeholder="[Để trống — Tên kịch bản (VD: Lưu thành công, Chặn thiếu trường...)]"
                          className="flex-1 rounded border border-input bg-card px-2 py-1 text-xs placeholder:text-muted-foreground/60"
                        />
                        {sec.acceptanceCriteriaList.length > 1 && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon-sm"
                            onClick={() => removeAc(sec.id, ac.id)}
                            className="h-6 w-6 text-muted-foreground hover:text-destructive shrink-0"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        )}
                      </div>
                      <div className="space-y-1 pl-2 border-l-2 border-amber-500/30">
                        <div className="grid grid-cols-[60px_1fr] items-center gap-1">
                          <span className="text-[10.5px] font-semibold text-muted-foreground">Giả sử:</span>
                          <input
                            type="text"
                            value={ac.given}
                            onChange={(e) => updateAc(sec.id, ac.id, 'given', e.target.value)}
                            placeholder="[Để trống — Giả sử: tiền điều kiện...]"
                            className="rounded border border-input bg-card px-2 py-0.5 text-xs placeholder:text-muted-foreground/60"
                          />
                        </div>
                        <div className="grid grid-cols-[60px_1fr] items-center gap-1">
                          <span className="text-[10.5px] font-semibold text-muted-foreground">Khi:</span>
                          <input
                            type="text"
                            value={ac.when}
                            onChange={(e) => updateAc(sec.id, ac.id, 'when', e.target.value)}
                            placeholder="[Để trống — Khi: người dùng hành động...]"
                            className="rounded border border-input bg-card px-2 py-0.5 text-xs placeholder:text-muted-foreground/60"
                          />
                        </div>
                        <div className="grid grid-cols-[60px_1fr] items-center gap-1">
                          <span className="text-[10.5px] font-semibold text-muted-foreground">Thì:</span>
                          <input
                            type="text"
                            value={ac.then}
                            onChange={(e) => updateAc(sec.id, ac.id, 'then', e.target.value)}
                            placeholder="[Để trống — Thì: hệ thống phản hồi...]"
                            className="rounded border border-input bg-card px-2 py-0.5 text-xs placeholder:text-muted-foreground/60"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 2. Corner cases */}
              <div className="space-y-2 pt-1 border-t border-border/50">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-foreground flex items-center gap-1.5">
                    <AlertTriangle className="h-3.5 w-3.5 text-rose-500" />
                    <span>Các trường hợp góc cạnh & Ngoại lệ (Corner Cases)</span>
                  </span>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => addCornerCase(sec.id)}
                    className="h-6 px-2 text-[10.5px] border-amber-500/40 text-amber-700 dark:text-amber-300 hover:bg-amber-500/15"
                  >
                    <Plus className="h-3 w-3 mr-0.5" /> Thêm Corner Case
                  </Button>
                </div>
                <div className="space-y-2">
                  {sec.cornerCasesList.map((cc) => (
                    <div key={cc.id} className="rounded-lg border border-border/70 bg-background/50 p-2.5 space-y-1.5 text-xs">
                      <div className="flex items-center justify-between gap-2">
                        <input
                          type="text"
                          value={cc.code}
                          onChange={(e) => updateCornerCase(sec.id, cc.id, 'code', e.target.value)}
                          className="w-20 rounded border border-input bg-card px-1.5 py-1 text-center font-mono text-[10px] font-bold text-amber-700 dark:text-amber-300"
                        />
                        <input
                          type="text"
                          value={cc.title}
                          onChange={(e) => updateCornerCase(sec.id, cc.id, 'title', e.target.value)}
                          placeholder="[Để trống — Tên trường hợp ngoại lệ...]"
                          className="flex-1 rounded border border-input bg-card px-2 py-1 text-xs placeholder:text-muted-foreground/60"
                        />
                        {sec.cornerCasesList.length > 1 && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon-sm"
                            onClick={() => removeCornerCase(sec.id, cc.id)}
                            className="h-6 w-6 text-muted-foreground hover:text-destructive shrink-0"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        )}
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 pl-2 border-l-2 border-rose-500/30">
                        <textarea
                          value={cc.scenario}
                          onChange={(e) => updateCornerCase(sec.id, cc.id, 'scenario', e.target.value)}
                          placeholder="[Để trống — Tình huống phát sinh...]"
                          rows={2}
                          className="rounded border border-input bg-card px-2 py-1 text-xs placeholder:text-muted-foreground/60 resize-y"
                        />
                        <textarea
                          value={cc.handling}
                          onChange={(e) => updateCornerCase(sec.id, cc.id, 'handling', e.target.value)}
                          placeholder="[Để trống — Cách hệ thống xử lý...]"
                          rows={2}
                          className="rounded border border-input bg-card px-2 py-1 text-xs placeholder:text-muted-foreground/60 resize-y"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 3. Quy tắc nghiệp vụ & Nguồn DL */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1 border-t border-border/50">
                {/* Quy tắc */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-foreground flex items-center gap-1.5">
                      <ShieldAlert className="h-3.5 w-3.5 text-blue-500" />
                      <span>Quy tắc nghiệp vụ (BR)</span>
                    </span>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => addBusinessRule(sec.id)}
                      className="h-6 px-1.5 text-[10px] border-amber-500/40 text-amber-700 dark:text-amber-300"
                    >
                      <Plus className="h-3 w-3 mr-0.5" /> Thêm BR
                    </Button>
                  </div>
                  <div className="space-y-2">
                    {sec.businessRulesList.map((br) => (
                      <div key={br.id} className="rounded-lg border border-border/70 bg-background/50 p-2 space-y-1 text-xs">
                        <div className="flex items-center gap-1.5">
                          <input
                            type="text"
                            value={br.code}
                            onChange={(e) => updateBusinessRule(sec.id, br.id, 'code', e.target.value)}
                            className="w-16 rounded border border-input bg-card px-1 py-0.5 text-center font-mono text-[10px] font-bold"
                          />
                          <input
                            type="text"
                            value={br.title}
                            onChange={(e) => updateBusinessRule(sec.id, br.id, 'title', e.target.value)}
                            placeholder="[Tên quy tắc...]"
                            className="flex-1 rounded border border-input bg-card px-2 py-0.5 text-xs placeholder:text-muted-foreground/60"
                          />
                          {sec.businessRulesList.length > 1 && (
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon-sm"
                              onClick={() => removeBusinessRule(sec.id, br.id)}
                              className="h-5 w-5 text-muted-foreground hover:text-destructive"
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          )}
                        </div>
                        <textarea
                          value={br.rule}
                          onChange={(e) => updateBusinessRule(sec.id, br.id, 'rule', e.target.value)}
                          placeholder="[Để trống — Nội dung quy tắc...]"
                          rows={2}
                          className="w-full rounded border border-input bg-card px-2 py-1 text-xs placeholder:text-muted-foreground/60 resize-y"
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Nguồn DL */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-foreground flex items-center gap-1.5">
                      <Database className="h-3.5 w-3.5 text-emerald-500" />
                      <span>Nguồn dữ liệu (Data Sources)</span>
                    </span>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => addDataSource(sec.id)}
                      className="h-6 px-1.5 text-[10px] border-amber-500/40 text-amber-700 dark:text-amber-300"
                    >
                      <Plus className="h-3 w-3 mr-0.5" /> Thêm Nguồn
                    </Button>
                  </div>
                  <div className="space-y-2">
                    {sec.dataSources.map((ds) => (
                      <div key={ds.id} className="rounded-lg border border-border/70 bg-background/50 p-2 space-y-1 text-xs">
                        <div className="flex items-center justify-between gap-1">
                          <input
                            type="text"
                            value={ds.entity}
                            onChange={(e) => updateDataSource(sec.id, ds.id, 'entity', e.target.value)}
                            placeholder="[Tên bảng/thực thể...]"
                            className="flex-1 rounded border border-input bg-card px-2 py-0.5 text-xs placeholder:text-muted-foreground/60"
                          />
                          {sec.dataSources.length > 1 && (
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon-sm"
                              onClick={() => removeDataSource(sec.id, ds.id)}
                              className="h-5 w-5 text-muted-foreground hover:text-destructive"
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          )}
                        </div>
                        <input
                          type="text"
                          value={ds.fields}
                          onChange={(e) => updateDataSource(sec.id, ds.id, 'fields', e.target.value)}
                          placeholder="[Thuộc tính / trường...]"
                          className="w-full rounded border border-input bg-card px-2 py-0.5 text-xs placeholder:text-muted-foreground/60"
                        />
                        <input
                          type="text"
                          value={ds.notes}
                          onChange={(e) => updateDataSource(sec.id, ds.id, 'notes', e.target.value)}
                          placeholder="[Ghi chú ràng buộc...]"
                          className="w-full rounded border border-input bg-card px-2 py-0.5 text-xs placeholder:text-muted-foreground/60"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* 4. Ghi chú PO */}
              <div className="pt-1 border-t border-border/50 space-y-1">
                <span className="font-bold text-xs text-foreground">Ghi chú bổ sung của PO:</span>
                <textarea
                  value={sec.poNotes}
                  onChange={(e) => updatePoNotes(sec.id, e.target.value)}
                  placeholder="[Để trống — Nhập ghi chú PO...]"
                  rows={2}
                  className="w-full rounded border border-input bg-card px-2.5 py-1.5 text-xs placeholder:text-muted-foreground/60 resize-y"
                />
              </div>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  )
}
