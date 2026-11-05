'use client'

import React, { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { BranchSelect, InlineSelect } from '@/components/controls'
import { FieldLabel } from '@/components/shared'
import { toast } from 'sonner'
import {
  DAILY_BRANCH_OPTIONS,
  DAILY_CLOSING_TASKS,
  type DailyCheckShift,
  type DailyCheckSubmission,
  type DailyAreaResult,
  type DailyClosingResult,
} from '@/mocks/dailyCheck'

export interface DailyCheckSubmitDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (submission: DailyCheckSubmission) => void
  currentStaffName?: string
}

const DEFAULT_AREAS = [
  { key: 'sanh_ngoai', name: '1. Sảnh ngoài' },
  { key: 'sanh_le_tan', name: '2. Sảnh lễ tân / Hành lang' },
  { key: 'quay_le_tan', name: '3. Quầy lễ tân' },
  { key: 'khu_ipad', name: '4. Khu vực iPad' },
  { key: 'tu_qua', name: '5. Khu vực tủ quà' },
  { key: 'phong_hoc', name: '6. Phòng học' },
  { key: 'nha_ve_sinh', name: '7. Khu vực nhà vệ sinh' },
  { key: 'ha_tang', name: '8. Hạ tầng trung tâm' },
  { key: 'tac_phong', name: '9. Tác phong nhân sự' },
]

export function DailyCheckSubmitDialog({
  open,
  onOpenChange,
  onSubmit,
  currentStaffName = 'Nhân sự trực ca',
}: DailyCheckSubmitDialogProps) {
  const [branch, setBranch] = useState(DAILY_BRANCH_OPTIONS[0])
  const [shift, setShift] = useState<DailyCheckShift>('dau_ca')
  const [staffName, setStaffName] = useState(currentStaffName)

  // State for daytime 9 items (pass/fail)
  const [daytimeStatuses, setDaytimeStatuses] = useState<Record<string, 'pass' | 'fail'>>({
    sanh_ngoai: 'pass',
    sanh_le_tan: 'pass',
    quay_le_tan: 'pass',
    khu_ipad: 'pass',
    tu_qua: 'pass',
    phong_hoc: 'pass',
    nha_ve_sinh: 'pass',
    ha_tang: 'pass',
    tac_phong: 'pass',
  })

  // State for closing 9 tasks (done/not_done)
  const [closingStatuses, setClosingStatuses] = useState<Record<string, 'done' | 'not_done'>>({
    closing_ac_tv: 'done',
    closing_tv_devices: 'done',
    closing_pc_printer: 'done',
    closing_ipad: 'done',
    closing_trash: 'done',
    closing_furniture: 'done',
    closing_gift_shelf: 'done',
    closing_play_area: 'done',
    closing_security: 'done',
  })

  const handleSubmit = () => {
    const now = new Date()
    const timeStr = `${now.getMonth() + 1}/${now.getDate()}/${now.getFullYear()} ${now.getHours()}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`

    let failCount = 0
    const daytimeItems: DailyAreaResult[] = DEFAULT_AREAS.map((a) => {
      const st = daytimeStatuses[a.key] || 'pass'
      if (st === 'fail') failCount++
      return {
        key: a.key,
        name: a.name,
        status: st,
        photos: ['https://drive.google.com/open?id=sample_photo_proof'],
      }
    })

    let notDoneCount = 0
    const closingItems: DailyClosingResult[] = DAILY_CLOSING_TASKS.map((t) => {
      const st = closingStatuses[t.id] || 'done'
      if (st === 'not_done') notDoneCount++
      return {
        id: t.id,
        name: t.name,
        status: st,
      }
    })

    const totalFailed = shift === 'dau_ca' ? failCount : notDoneCount
    const passRate = Math.round(((9 - totalFailed) / 9) * 100)

    const newSub: DailyCheckSubmission = {
      id: `chk_${Date.now().toString().slice(-4)}`,
      timestamp: timeStr,
      date: `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`,
      branch,
      staffName: staffName.trim() || currentStaffName,
      shift,
      status: 'on_time',
      daytimeItems,
      closingItems,
      passRate,
      failedItemsCount: totalFailed,
      escalatedToQc: false,
    }

    onSubmit(newSub)
    toast.success('Đã lưu và nộp biên bản kiểm tra ca thành công!')
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl w-full p-4 flex flex-col max-h-[90vh] overflow-hidden text-foreground gap-3 text-left">
        <DialogHeader className="p-0 pb-1 shrink-0 border-b border-border/50">
          <DialogTitle className="text-sm font-semibold text-foreground">
            Thực hiện Checklist Vận hành Cơ sở
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto space-y-3 pr-1 min-h-0 text-xs">
          {/* Header controls: Branch, Shift, Staff */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 bg-muted/30 p-2.5 rounded-lg border border-border/50">
            <FieldLabel label="Cơ sở thực hiện *" className="gap-1">
              <BranchSelect
                value={branch}
                onValueChange={setBranch}
                branches={DAILY_BRANCH_OPTIONS}
              />
            </FieldLabel>

            <FieldLabel label="Ca kiểm tra *" className="gap-1">
              <InlineSelect
                value={shift}
                options={[
                  { value: 'dau_ca', label: 'Đầu ca (Sáng)' },
                  { value: 'cuoi_ca', label: 'Cuối ca (Tối)' },
                ]}
                onValueChange={(v) => setShift(v as DailyCheckShift)}
                ariaLabel="Chọn ca"
                className="h-8 text-xs"
              />
            </FieldLabel>

            <FieldLabel label="Nhân sự thực hiện *" className="gap-1">
              <input
                type="text"
                value={staffName}
                onChange={(e) => setStaffName(e.target.value)}
                placeholder="Điền họ và tên..."
                className="flex h-8 w-full rounded-md border border-input bg-background px-2.5 py-1 text-xs shadow-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              />
            </FieldLabel>
          </div>

          {/* Daytime Items */}
          {shift === 'dau_ca' && (
            <div className="space-y-2">
              <h4 className="font-semibold text-xs text-foreground uppercase tracking-wider text-muted-foreground">
                Đánh giá 9 khu vực cơ sở (Đạt / Không đạt)
              </h4>
              <div className="space-y-1.5">
                {DEFAULT_AREAS.map((a) => {
                  const val = daytimeStatuses[a.key] || 'pass'
                  return (
                    <div
                      key={a.key}
                      className="flex items-center justify-between p-2 rounded-lg bg-card border border-border/60 hover:bg-muted/40 transition-colors"
                    >
                      <span className="font-medium text-foreground text-xs">{a.name}</span>
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => setDaytimeStatuses((prev) => ({ ...prev, [a.key]: 'pass' }))}
                          className={`h-6 px-2.5 rounded text-xs font-medium cursor-pointer transition-colors ${
                            val === 'pass'
                              ? 'bg-emerald-600 text-white'
                              : 'bg-muted text-muted-foreground hover:bg-muted/80'
                          }`}
                        >
                          Đạt
                        </button>
                        <button
                          type="button"
                          onClick={() => setDaytimeStatuses((prev) => ({ ...prev, [a.key]: 'fail' }))}
                          className={`h-6 px-2.5 rounded text-xs font-medium cursor-pointer transition-colors ${
                            val === 'fail'
                              ? 'bg-rose-600 text-white'
                              : 'bg-muted text-muted-foreground hover:bg-muted/80'
                          }`}
                        >
                          Không đạt
                        </button>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* Closing Items */}
          {shift === 'cuoi_ca' && (
            <div className="space-y-2">
              <h4 className="font-semibold text-xs text-foreground uppercase tracking-wider text-muted-foreground">
                Đánh giá 9 nhiệm vụ chốt ca cuối ngày (Đã xong / Chưa xong)
              </h4>
              <div className="space-y-1.5">
                {DAILY_CLOSING_TASKS.map((t, idx) => {
                  const val = closingStatuses[t.id] || 'done'
                  return (
                    <div
                      key={t.id}
                      className="flex items-center justify-between p-2 rounded-lg bg-card border border-border/60 hover:bg-muted/40 transition-colors"
                    >
                      <span className="font-medium text-foreground text-xs">
                        {idx + 1}. {t.name}
                      </span>
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => setClosingStatuses((prev) => ({ ...prev, [t.id]: 'done' }))}
                          className={`h-6 px-2.5 rounded text-xs font-medium cursor-pointer transition-colors ${
                            val === 'done'
                              ? 'bg-emerald-600 text-white'
                              : 'bg-muted text-muted-foreground hover:bg-muted/80'
                          }`}
                        >
                          Đã xong
                        </button>
                        <button
                          type="button"
                          onClick={() => setClosingStatuses((prev) => ({ ...prev, [t.id]: 'not_done' }))}
                          className={`h-6 px-2.5 rounded text-xs font-medium cursor-pointer transition-colors ${
                            val === 'not_done'
                              ? 'bg-amber-600 text-white'
                              : 'bg-muted text-muted-foreground hover:bg-muted/80'
                          }`}
                        >
                          Chưa xong
                        </button>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}
        </div>

        <DialogFooter className="p-0 pt-2 shrink-0 border-t border-border/50 gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onOpenChange(false)}
            className="h-8 text-xs cursor-pointer"
          >
            Hủy bỏ
          </Button>
          <Button
            size="sm"
            onClick={handleSubmit}
            className="h-8 text-xs cursor-pointer"
          >
            Xác nhận nộp checklist
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
