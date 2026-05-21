'use client'

import { useState } from 'react'
import { Pencil, Save, Settings2, X } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'
import { WORK_SECTIONS, type WorkPrioritySlotRule } from '@/mocks/workRegistrations'

const ALL_DAYS = [0, 1, 2, 3, 4, 5, 6]

interface WorkRegistrationPrioritySetupDialogProps {
  open: boolean
  rules: WorkPrioritySlotRule[]
  onRulesChange: (rules: WorkPrioritySlotRule[]) => void
  onOpenChange: (open: boolean) => void
}

export function WorkRegistrationPrioritySetupDialog({
  open,
  rules,
  onRulesChange,
  onOpenChange,
}: WorkRegistrationPrioritySetupDialogProps) {
  const rulesKey = rules
    .map((rule) => `${rule.id}:${rule.enabled}:${rule.minEmployees}:${rule.dayIndexes.join(',')}:${rule.slotIds.join(',')}`)
    .join('|')

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {open ? (
        <PrioritySetupBody
          key={rulesKey}
          rules={rules}
          onRulesChange={onRulesChange}
          onOpenChange={onOpenChange}
        />
      ) : null}
    </Dialog>
  )
}

function PrioritySetupBody({
  rules,
  onRulesChange,
  onOpenChange,
}: {
  rules: WorkPrioritySlotRule[]
  onRulesChange: (rules: WorkPrioritySlotRule[]) => void
  onOpenChange: (open: boolean) => void
}) {
  const [editing, setEditing] = useState(false)
  const [activeSection, setActiveSection] = useState<string>(WORK_SECTIONS[0].id)
  const [globalStartDate, setGlobalStartDate] = useState(rules[0]?.startDate || '')

  const [draftRulesBySection, setDraftRulesBySection] = useState<
    Record<string, { slotIds: string[]; enabled: boolean; minEmployees: number }>
  >(() => {
    const dict: Record<string, { slotIds: string[]; enabled: boolean; minEmployees: number }> = {}
    WORK_SECTIONS.forEach((section) => {
      dict[section.id] = { slotIds: [], enabled: true, minEmployees: 2 }
    })
    
    rules.forEach((rule) => {
      rule.slotIds.forEach(slotId => {
        const sectionId = slotId.split('-')[0]
        if (dict[sectionId]) {
          if (!dict[sectionId].slotIds.includes(slotId)) {
            dict[sectionId].slotIds.push(slotId)
          }
          dict[sectionId].enabled = rule.enabled
          dict[sectionId].minEmployees = rule.minEmployees
        }
      })
    })
    return dict
  })

  const cancelEdit = () => {
    const dict: Record<string, { slotIds: string[]; enabled: boolean; minEmployees: number }> = {}
    WORK_SECTIONS.forEach((section) => {
      dict[section.id] = { slotIds: [], enabled: true, minEmployees: 2 }
    })
    
    rules.forEach((rule) => {
      rule.slotIds.forEach(slotId => {
        const sectionId = slotId.split('-')[0]
        if (dict[sectionId]) {
          if (!dict[sectionId].slotIds.includes(slotId)) {
            dict[sectionId].slotIds.push(slotId)
          }
          dict[sectionId].enabled = rule.enabled
          dict[sectionId].minEmployees = rule.minEmployees
        }
      })
    })
    setDraftRulesBySection(dict)
    setGlobalStartDate(rules[0]?.startDate || '')
    setEditing(false)
  }

  const handleSave = () => {
    const newRules: WorkPrioritySlotRule[] = []
    WORK_SECTIONS.forEach((section) => {
      const data = draftRulesBySection[section.id]
      if (data.slotIds.length > 0) {
        newRules.push({
          id: `rule-section-${section.id}`,
          label: `Giờ vàng ${section.label}`,
          enabled: data.enabled,
          startDate: globalStartDate,
          dayIndexes: ALL_DAYS,
          slotIds: data.slotIds,
          minEmployees: data.minEmployees,
        })
      }
    })

    if (newRules.length === 0) {
      newRules.push({
        id: 'rule-empty',
        label: 'Giờ vàng',
        enabled: false,
        startDate: globalStartDate,
        dayIndexes: ALL_DAYS,
        slotIds: [],
        minEmployees: 1,
      })
    }
    onRulesChange(newRules)
    setEditing(false)
  }

  const activeData = draftRulesBySection[activeSection]
  const activeSectionLabel = WORK_SECTIONS.find((s) => s.id === activeSection)?.label
  const currentSectionDef = WORK_SECTIONS.find((s) => s.id === activeSection)
  return (
    <DialogContent className="flex max-h-[90vh] sm:max-w-[900px] flex-col overflow-hidden p-0 gap-0">
      <DialogHeader className="p-6 pb-4 border-b border-border shrink-0">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <DialogTitle className="flex items-center gap-2">
            <Settings2 className="h-5 w-5" />
            Thiết lập giờ vàng
          </DialogTitle>
          <DialogDescription>
            Chọn ngày áp dụng, ca làm việc và số lượng nhân viên tối thiểu cho các khung giờ ưu tiên.
          </DialogDescription>
        </div>
      </DialogHeader>

      <div className="flex flex-1 min-h-0 bg-muted/30">
        <div className="w-56 border-r border-border shrink-0 flex flex-col bg-background">
          <div className="p-4 border-b border-border space-y-2">
            <Label className="text-xs font-bold uppercase text-muted-foreground">Ngày áp dụng từ</Label>
            <Input
              type="date"
              value={globalStartDate}
              disabled={!editing}
              onChange={(e) => setGlobalStartDate(e.target.value)}
            />
          </div>
          <div className="p-2 flex-1 space-y-1 overflow-y-auto">
            <Label className="px-2 pt-2 pb-1 text-xs font-bold uppercase text-muted-foreground block">
              Ca áp dụng
            </Label>
            {WORK_SECTIONS.map((section) => {
              const isActive = activeSection === section.id
              const count = draftRulesBySection[section.id].slotIds.length
              const isEnabled = draftRulesBySection[section.id].enabled
              return (
                <Button
                  key={section.id}
                  type="button"
                  variant="ghost"
                  onClick={() => setActiveSection(section.id)}
                  className={cn(
                    'flex h-auto items-center justify-between w-full px-3 py-2 text-sm font-medium rounded-md transition-colors',
                    isActive
                      ? 'bg-primary text-primary-foreground'
                      : 'hover:bg-accent text-muted-foreground hover:text-foreground'
                  )}
                >
                  <span className={cn(!isEnabled && count > 0 && 'line-through opacity-60')}>
                    {section.label}
                  </span>
                  {count > 0 && (
                    <Badge
                      variant="secondary"
                      className={cn(
                        'min-w-5 rounded-full px-1.5 py-0.5 text-center text-[10px] font-bold',
                        isActive && 'bg-primary-foreground text-primary'
                      )}
                    >
                      {count}
                    </Badge>
                  )}
                </Button>
              )
            })}
          </div>
        </div>

        <div className="flex-1 flex flex-col min-w-0 bg-background">
          <div className="p-4 border-b border-border flex flex-wrap items-center justify-between gap-4">
            <Label className="flex items-center gap-2 text-base font-bold cursor-pointer">
              <Checkbox
                checked={activeData.enabled}
                disabled={!editing}
                onCheckedChange={(checked) => {
                  setDraftRulesBySection((prev) => ({
                    ...prev,
                    [activeSection]: { ...prev[activeSection], enabled: checked === true },
                  }))
                }}
              />
              <span className={cn(!activeData.enabled && 'opacity-60')}>
                Kích hoạt giờ vàng {activeSectionLabel?.toLowerCase()}
              </span>
            </Label>
          </div>

          <div className="flex-1 p-4 overflow-y-auto space-y-4">
            <p className="text-xs font-bold uppercase text-muted-foreground">
              Khung giờ vàng ({activeSectionLabel})
            </p>
            <div className={cn('grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-4 pt-1', !activeData.enabled && 'opacity-50')}>
              {currentSectionDef?.slots.map((slot) => {
                const selected = activeData.slotIds.includes(slot.id)
                return (
                  <Label
                    key={slot.id}
                    className={cn(
                      'flex cursor-pointer items-center gap-2 rounded-md border p-2.5 text-sm transition-colors',
                      selected
                        ? 'border-primary bg-primary/5 text-primary shadow-sm'
                        : 'border-border bg-background text-foreground',
                      !editing ? 'pointer-events-none opacity-70' : 'hover:border-primary/50 hover:bg-muted/50'
                    )}
                  >
                    <Checkbox
                      checked={selected}
                      disabled={!editing}
                      onCheckedChange={(checked) => {
                        const currentSlots = draftRulesBySection[activeSection].slotIds
                        setDraftRulesBySection((prev) => ({
                          ...prev,
                          [activeSection]: {
                            ...prev[activeSection],
                            slotIds:
                              checked === true
                                ? [...currentSlots, slot.id]
                                : currentSlots.filter((id) => id !== slot.id),
                          },
                        }))
                      }}
                    />
                    {slot.label}
                  </Label>
                )
              })}
            </div>
          </div>
        </div>
      </div>

      <div className="flex shrink-0 justify-end gap-2 border-t border-border p-4 bg-muted/30">
        {editing ? (
          <>
            <Button type="button" variant="outline" onClick={cancelEdit}>
              <X className="mr-2 h-4 w-4" />
              Hủy chỉnh sửa
            </Button>
            <Button type="button" onClick={handleSave}>
              <Save className="mr-2 h-4 w-4" />
              Lưu thay đổi
            </Button>
          </>
        ) : (
          <>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Đóng
            </Button>
            <Button type="button" onClick={() => setEditing(true)}>
              <Pencil className="mr-2 h-4 w-4" />
              Chỉnh sửa
            </Button>
          </>
        )}
      </div>
    </DialogContent>
  )
}
