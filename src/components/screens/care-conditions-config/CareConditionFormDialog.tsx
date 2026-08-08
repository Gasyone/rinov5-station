'use client'

import React, { useState, useEffect } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { FieldLabel, ConfirmDialog } from '@/components/shared'
import { InlineSelect, SegmentedControl } from '@/components/controls'
import { CareConditionLogTab } from './CareConditionLogTab'
import {
  CareConditionConfig,
  ConditionCategory,
  ConditionNature,
  PrimaryStaffRole,
  ConditionPriority,
  TriggerSource,
  TriggerOperator,
  StructuredTriggerRule,
} from './careConditionsTypes'
import { METRIC_SOURCES, METRIC_CATALOG } from './careConditionsCatalog'
import { CareConditionFormBasicFields } from './CareConditionFormBasicFields'
import { CareConditionFormStandardRules } from './CareConditionFormStandardRules'
import { CareConditionFormSlaRules } from './CareConditionFormSlaRules'
import { getConditionNatureBadge } from './careConditionsMockData'

interface CareConditionFormDialogProps {
  isOpen: boolean
  onClose: () => void
  condition: CareConditionConfig | null
  onSave: (data: Partial<CareConditionConfig>) => void
  onDelete?: (id: string) => void
}

interface FormInnerProps {
  condition: CareConditionConfig | null
  onSave: (data: Partial<CareConditionConfig>) => void
  onDelete?: (id: string) => void
  onClose: () => void
}

const CareConditionFormInner: React.FC<FormInnerProps> = ({ condition, onSave, onDelete, onClose }) => {
  const isEditing = !!condition
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false)

  // Basic Info States (Left Column)
  const [code, setCode] = useState(condition?.code || '')
  const [name, setName] = useState(condition?.name || '')
  const [category] = useState<ConditionCategory>(condition?.category || 'hoc_tap')
  const [nature, setNature] = useState<ConditionNature>(condition?.nature || 'dac_biet')
  const [assignedRoles, setAssignedRoles] = useState<PrimaryStaffRole[]>(
    condition?.assignedRoles && condition.assignedRoles.length > 0
      ? condition.assignedRoles
      : [condition?.primaryRole || 'CS']
  )
  const [completionPolicy, setCompletionPolicy] = useState<'any_role' | 'all_roles'>(
    condition?.completionPolicy || 'any_role'
  )
  const [priority, setPriority] = useState<ConditionPriority>(condition?.priority || 'high')
  const [focusContentText, setFocusContentText] = useState(condition?.focusContent ? condition.focusContent.join('\n') : '')

  // Engine & SLA States (Right Column)
  const [isActive, setIsActive] = useState(condition?.isActive ?? true)

  // SLA States
  const initialSlaType = condition?.triggerRule?.slaType || 'fixed_time'
  const initialSlaUnit = condition?.triggerRule?.slaUnit || 'hours'
  const initialSlaValueInput = condition?.triggerRule?.slaValueInput ?? condition?.triggerRule?.slaHoursInput ?? (condition?.slaHours || 24)

  const [slaType, setSlaType] = useState<string>(initialSlaType)
  const [slaUnit, setSlaUnit] = useState<'hours' | 'days'>(initialSlaUnit)
  const [slaValueInput, setSlaValueInput] = useState<number>(initialSlaValueInput)

  // Source States
  const rawSource = condition?.triggerRule?.source
  const initialSource: TriggerSource = (rawSource && rawSource !== ('curriculum_path' as any) ? rawSource : 'class_db') as TriggerSource
  const [selectedSource, setSelectedSource] = useState<TriggerSource>(initialSource)

  // Standard metrics states
  const initialCatalog = METRIC_CATALOG[initialSource] || METRIC_CATALOG.class_db
  const initialFoundMetric = initialCatalog.find((m) => m.id === condition?.triggerRule?.metric) || initialCatalog[0]

  const [selectedMetricId, setSelectedMetricId] = useState<string>(initialFoundMetric.id)
  const [triggerOperator, setTriggerOperator] = useState<TriggerOperator>(
    condition?.triggerRule?.operator || initialFoundMetric.defaultOperator
  )
  const [thresholdValue, setThresholdValue] = useState<number>(
    condition?.triggerRule?.thresholdValue ?? initialFoundMetric.defaultThreshold
  )

  const initialCustomCount = (() => {
    if (condition?.triggerRule?.windowRange) {
      const matchNum = condition.triggerRule.windowRange.match(/\d+/)
      return matchNum ? Number(matchNum[0]) : 8
    }
    return 8
  })()

  const initialWindowType = (() => {
    if (condition?.triggerRule?.windowRange) {
      const matchNum = condition.triggerRule.windowRange.match(/\d+/)
      return matchNum ? 'custom_sessions' : condition.triggerRule.windowRange
    }
    return initialFoundMetric.windowOptions[0]?.value || 'custom_sessions'
  })()

  const [windowType, setWindowType] = useState<string>(initialWindowType)
  const [customSessionCount, setCustomSessionCount] = useState<number>(initialCustomCount)
  const [customSessionNumbersText, setCustomSessionNumbersText] = useState<string>('1; 5; 10')
  const [customDaysText, setCustomDaysText] = useState<string>('1; 15; 25')
  const [scope, setScope] = useState<string>(
    condition?.triggerRule?.scope || initialFoundMetric.scopeOptions[0]?.value || 'theo_tung_mon'
  )

  const [errors, setErrors] = useState<Record<string, string>>({})

  // Active metrics catalog for selected source
  const availableMetrics = METRIC_CATALOG[selectedSource] || METRIC_CATALOG.class_db
  const activeMetric = availableMetrics.find((m) => m.id === selectedMetricId) || availableMetrics[0]

  // Synchronize state when condition changes
  useEffect(() => {
    setErrors({})
    const rawSrc = condition?.triggerRule?.source
    const validSrc: TriggerSource = (rawSrc && METRIC_CATALOG[rawSrc] ? rawSrc : 'class_db') as TriggerSource
    setSelectedSource(validSrc)

    const catalog = METRIC_CATALOG[validSrc] || METRIC_CATALOG.class_db
    const foundMetric = catalog.find((m) => m.id === condition?.triggerRule?.metric) || catalog[0]

    if (foundMetric) {
      setSelectedMetricId(foundMetric.id)
      setTriggerOperator(condition?.triggerRule?.operator || foundMetric.defaultOperator)
      setThresholdValue(condition?.triggerRule?.thresholdValue ?? foundMetric.defaultThreshold)
      setWindowType(condition?.triggerRule?.windowRange || foundMetric.windowOptions[0]?.value || 'realtime')
      setScope(condition?.triggerRule?.scope || foundMetric.scopeOptions[0]?.value || 'theo_tung_mon')
    }

    if (condition) {
      setCode(condition.code || '')
      setName(condition.name || '')
      setNature(condition.nature || 'dac_biet')
      setAssignedRoles(condition.assignedRoles || [condition.primaryRole || 'CS'])
      setCompletionPolicy(condition.completionPolicy || 'any_role')
      setPriority(condition.priority || 'high')
      setFocusContentText(condition.focusContent ? condition.focusContent.join('\n') : '')
      setIsActive(condition.isActive ?? true)
      setSlaType(condition.triggerRule?.slaType || 'fixed_time')
      setSlaUnit(condition.triggerRule?.slaUnit || 'hours')
      setSlaValueInput(
        condition.triggerRule?.slaValueInput ?? condition.triggerRule?.slaHoursInput ?? condition.slaHours ?? 24
      )
    } else {
      setCode('')
      setName('')
      setNature('dac_biet')
      setAssignedRoles(['CS'])
      setCompletionPolicy('any_role')
      setPriority('high')
      setFocusContentText('')
      setIsActive(true)
      setSlaType('fixed_time')
      setSlaUnit('hours')
      setSlaValueInput(24)
    }
  }, [condition])

  // When source changes
  const handleSourceChange = (newSource: TriggerSource) => {
    setSelectedSource(newSource)
    const newCatalog = METRIC_CATALOG[newSource] || METRIC_CATALOG.class_db
    const firstMetric = newCatalog[0]
    if (firstMetric) {
      setSelectedMetricId(firstMetric.id)
      setTriggerOperator(firstMetric.defaultOperator)
      setThresholdValue(firstMetric.defaultThreshold)
      setWindowType(firstMetric.windowOptions[0]?.value || 'realtime')
      setScope(firstMetric.scopeOptions[0]?.value || 'theo_tung_lop')
    }
  }

  // When criterion changes
  const handleMetricChange = (metricId: string) => {
    setSelectedMetricId(metricId)
    const m = availableMetrics.find((item) => item.id === metricId)
    if (m) {
      setTriggerOperator(m.defaultOperator)
      setThresholdValue(m.defaultThreshold)
      setWindowType(m.windowOptions[0]?.value || 'realtime')
      setScope(m.scopeOptions[0]?.value || 'theo_tung_lop')
    }
  }

  const isMilestoneOperator = triggerOperator === 'milestone' || !!activeMetric.isEventMilestone
  const isSlaValueRequired = ['fixed_time', 'before_next_session', 'after_next_session', 'custom_date'].includes(slaType)

  // Dynamic computed SLA text label for UI & table
  const computedSlaLabel = (() => {
    const unitText = slaUnit === 'days' ? 'ngày' : 'giờ'
    if (slaType === 'fixed_time') return `Trong vòng ${slaValueInput || 24} ${unitText}`
    if (slaType === 'before_next_session') return `Trước buổi tiếp theo ${slaValueInput || 24} ${unitText}`
    if (slaType === 'at_next_session') return 'Buổi học tiếp theo (Ngay giờ bắt đầu)'
    if (slaType === 'after_next_session') return `Sau buổi tiếp theo ${slaValueInput || 24} ${unitText}`
    if (slaType === 'end_of_month') return 'Đến ngày cuối cùng của tháng (23:59)'
    if (slaType === 'custom_date') return `Đến ngày ${slaValueInput || 25} hằng tháng`
    return `Trong vòng ${slaValueInput || 24} ${unitText}`
  })()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const newErrors: Record<string, string> = {}

    if (!code.trim()) newErrors.code = 'Mã điều kiện không được để trống'
    if (!name.trim()) newErrors.name = 'Tên điều kiện phát sinh không được để trống'
    if (!assignedRoles || assignedRoles.length === 0) newErrors.assignedRoles = 'Phải chọn ít nhất 1 vai trò phụ trách'

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    const focusContentArray = focusContentText
      .split('\n')
      .map((s) => s.trim())
      .filter((s) => s.length > 0)

    const natureLabelMap: Record<ConditionNature, string> = {
      dac_biet: 'Chăm sóc đặc biệt',
      tai_phi: 'Tái phí',
      dinh_ky: 'Định kỳ',
      theo_hanh_trinh: 'Theo hành trình học',
      theo_moc: 'Theo mốc học tập',
      theo_yeu_cau: 'Theo yêu cầu',
    }

    const primaryRole = assignedRoles[0] || 'CS'
    const primaryRoleShortMap: Record<PrimaryStaffRole, string> = {
      CS: 'CS',
      GV: 'GV',
      QLCM: 'QLCM',
      QLCS: 'QLCS',
    }
    const primaryRoleLabel = assignedRoles.map((r) => primaryRoleShortMap[r]).join(' + ')

    const sourceObj = METRIC_SOURCES.find((s) => s.id === selectedSource)
    const slaHoursConverted = slaUnit === 'days' ? (slaValueInput || 1) * 24 : slaValueInput || 24

    const operatorObj = activeMetric.operators.find((op) => op.value === triggerOperator)
    const windowObj = activeMetric.windowOptions.find((w) => w.value === windowType)
    const scopeObj = activeMetric.scopeOptions.find((sc) => sc.value === scope)

    const windowRangeCode =
      windowType === 'custom_sessions'
        ? `${customSessionCount}_buoi_da_xay_ra`
        : windowType === 'custom_session_numbers'
        ? `custom_session_numbers_${customSessionNumbersText.replace(/\s+/g, '')}`
        : windowType === 'custom_dates_month'
        ? `custom_dates_month_${customDaysText.replace(/\s+/g, '')}`
        : windowType

    const windowRangeText =
      windowType === 'custom_sessions'
        ? `Trong ${customSessionCount || 8} buổi đã xảy ra ở lớp học`
        : windowType === 'custom_session_numbers'
        ? `Mốc số buổi: ${customSessionNumbersText || '1; 5; 10'}`
        : windowType === 'custom_dates_month'
        ? `Mốc ngày trong tháng: ${customDaysText || '1; 15; 25'}`
        : windowObj?.label || ''

    const structuredRule: StructuredTriggerRule = {
      source: selectedSource,
      sourceLabel: sourceObj?.label || selectedSource,
      metric: activeMetric.id,
      metricLabel: activeMetric.label,
      metricUnit: activeMetric.unit,
      operator: triggerOperator,
      operatorLabel: operatorObj?.label || triggerOperator,
      thresholdValue: isMilestoneOperator ? 1 : Number(thresholdValue),
      windowRange: windowRangeCode,
      windowRangeLabel: windowRangeText,
      scope,
      scopeLabel: scopeObj?.label || scope,
      slaType,
      slaUnit,
      slaValueInput,
      slaHoursInput: slaHoursConverted,
    }

    onSave({
      id: condition?.id,
      code: code.trim().toUpperCase(),
      name: name.trim(),
      category,
      nature,
      natureLabel: natureLabelMap[nature],
      primaryRole,
      primaryRoleLabel,
      assignedRoles,
      completionPolicy,
      slaHours: slaHoursConverted,
      slaLabel: computedSlaLabel,
      priority,
      focusContent: focusContentArray.length > 0 ? focusContentArray : ['Thực hiện cuộc gọi trao đổi nắm tình hình với phụ huynh.'],
      triggerRule: structuredRule,
      isActive,
    })

    onClose()
  }

  return (
    <form onSubmit={handleSubmit} className="flex-1 min-h-0 flex flex-col justify-between space-y-3">
      <div className="flex-1 min-h-0 overflow-y-auto pr-1">
        <div className="grid grid-cols-2 gap-5">
        
        {/* CỘT BÊN TRÁI: KHAI BÁO THÔNG TIN CƠ BẢN */}
        <CareConditionFormBasicFields
          code={code}
          setCode={setCode}
          name={name}
          setName={setName}
          priority={priority}
          setPriority={setPriority}
          nature={nature}
          setNature={setNature}
          assignedRoles={assignedRoles}
          setAssignedRoles={setAssignedRoles}
          completionPolicy={completionPolicy}
          setCompletionPolicy={setCompletionPolicy}
          focusContentText={focusContentText}
          setFocusContentText={setFocusContentText}
          errors={errors}
        />

        {/* CỘT BÊN PHẢI: QUY TẮC TỰ ĐỘNG KÍCH HOẠT & SLA (2 SECTION CO BORDER RIÊNG) */}
        <div className="space-y-3 flex flex-col justify-start">
          {/* SECTION 1: CẤU HÌNH QUY TẮC TỰ ĐỘNG KÍCH HOẠT */}
          <div className="rounded-lg border border-border bg-card p-3.5 space-y-3 shadow-2xs">
            <div className="flex items-center justify-between pb-2 border-b border-border/60">
              <span className="text-xs font-bold text-foreground">
                Cấu hình quy tắc tự động kích hoạt
              </span>
              <div className="flex items-center gap-2">
                <Switch
                  checked={isActive}
                  onCheckedChange={setIsActive}
                  id="is-active-toggle-modal"
                />
                <label htmlFor="is-active-toggle-modal" className="text-xs font-semibold cursor-pointer select-none">
                  {isActive ? 'Đang áp dụng' : 'Tạm dừng'}
                </label>
              </div>
            </div>

            {/* 1. NGUỒN CHỈ SỐ */}
            <FieldLabel label="Nguồn chỉ số">
              <InlineSelect
                value={selectedSource}
                options={METRIC_SOURCES.map((s) => ({ value: s.id, label: s.label }))}
                onValueChange={(val: string) => handleSourceChange(val as TriggerSource)}
                className="w-full h-8 text-xs font-bold text-primary"
              />
            </FieldLabel>

            {/* 2 & 3 & 4: NGUỒN CHUẨN */}
            <CareConditionFormStandardRules
              selectedMetricId={selectedMetricId}
              handleMetricChange={handleMetricChange}
              availableMetrics={availableMetrics}
              activeMetric={activeMetric}
              triggerOperator={triggerOperator}
              setTriggerOperator={setTriggerOperator}
              thresholdValue={thresholdValue}
              setThresholdValue={setThresholdValue}
              windowType={windowType}
              setWindowType={setWindowType}
              customSessionCount={customSessionCount}
              setCustomSessionCount={setCustomSessionCount}
              customSessionNumbersText={customSessionNumbersText}
              setCustomSessionNumbersText={setCustomSessionNumbersText}
              customDaysText={customDaysText}
              setCustomDaysText={setCustomDaysText}
              scope={scope}
              setScope={setScope}
            />
          </div>

          {/* SECTION 2: CẤU HÌNH THỜI HẠN SLA CHĂM SÓC */}
          <div className="rounded-lg border border-border bg-card p-3.5 space-y-3 shadow-2xs">
            <div className="pb-2 border-b border-border/60">
              <span className="text-xs font-bold text-foreground">
                Cấu hình thời hạn SLA chăm sóc
              </span>
            </div>

            <CareConditionFormSlaRules
              slaType={slaType}
              setSlaType={setSlaType}
              slaUnit={slaUnit}
              setSlaUnit={setSlaUnit}
              slaValueInput={slaValueInput}
              setSlaValueInput={setSlaValueInput}
              isSlaValueRequired={isSlaValueRequired}
            />
          </div>
        </div>
        </div>
      </div>

      <DialogFooter className="shrink-0 pt-3 border-t border-border flex items-center justify-between gap-2">
        {isEditing && onDelete && condition ? (
          <Button
            type="button"
            variant="destructive"
            size="sm"
            onClick={() => setDeleteConfirmOpen(true)}
            className="h-8 text-xs font-bold cursor-pointer"
          >
            Xóa điều kiện
          </Button>
        ) : (
          <div />
        )}
        <div className="flex items-center gap-2">
          <Button type="button" variant="outline" size="sm" onClick={onClose} className="h-8 text-xs">
            Hủy bỏ
          </Button>
          <Button type="submit" variant="default" size="sm" className="h-8 text-xs font-bold">
            {isEditing ? 'Lưu cấu hình' : 'Tạo điều kiện mới'}
          </Button>
        </div>
      </DialogFooter>

      {/* CONFIRM DIALOG KHI BẤM XÓA */}
      {deleteConfirmOpen && condition && (
        <ConfirmDialog
          open={deleteConfirmOpen}
          onOpenChange={setDeleteConfirmOpen}
          title="Xác nhận xóa điều kiện chăm sóc"
          description={`Bạn có chắc chắn muốn xóa mã điều kiện ${condition.code} khỏi danh mục? Hành động này không thể hoàn tác.`}
          confirmLabel="Xác nhận xóa"
          cancelLabel="Hủy bỏ"
          variant="destructive"
          onConfirm={() => {
            if (onDelete && condition) {
              onDelete(condition.id)
            }
            setDeleteConfirmOpen(false)
            onClose()
          }}
        />
      )}
    </form>
  )
}

import { Badge } from '@/components/ui/badge'

export const CareConditionFormDialog: React.FC<CareConditionFormDialogProps> = ({
  isOpen,
  onClose,
  condition,
  onSave,
  onDelete,
}) => {
  const isEditing = !!condition
  const [activeTab, setActiveTab] = useState<'log' | 'config'>('config')

  // Reset tab when modal opens or condition changes: Mặc định xem 'config' (Thiết lập quy tắc)
  useEffect(() => {
    if (isOpen) {
      setActiveTab('config')
    }
  }, [isOpen, condition])

  return (
    <Dialog open={isOpen} onOpenChange={(open) => { if (!open) onClose() }}>
      <DialogContent className="sm:max-w-5xl w-[92vw] h-[88vh] max-h-[720px] min-h-[640px] p-6 rounded-xl flex flex-col overflow-hidden">
        <DialogHeader className="shrink-0 pb-2.5 border-b border-border flex flex-col gap-1">
          <div className="flex items-center justify-between gap-3">
            <div className="flex flex-col gap-1 min-w-0">
              <span className="text-xs text-muted-foreground font-medium">
                Chi tiết điều kiện phát sinh
              </span>

              <div className="flex items-center gap-2">
                {isEditing && condition ? (
                  <>
                    {(() => {
                      const nb = getConditionNatureBadge(condition.nature)
                      return (
                        <Badge variant="outline" className={`text-[10.5px] font-medium px-2 py-0.5 shrink-0 ${nb.badgeClass}`}>
                          {nb.label}
                        </Badge>
                      )
                    })()}
                    <DialogTitle className="text-base font-bold text-foreground truncate">
                      {condition.name}
                    </DialogTitle>
                  </>
                ) : (
                  <DialogTitle className="text-base font-bold text-foreground">
                    Thêm mới Điều kiện Chăm sóc
                  </DialogTitle>
                )}
              </div>
            </div>

            {isEditing && (
              <SegmentedControl
                value={activeTab}
                options={[
                  { value: 'log', label: '📜 Nhật ký phiếu phát sinh' },
                  { value: 'config', label: '⚙️ Thiết lập quy tắc' },
                ]}
                onValueChange={(val: string) => setActiveTab(val as 'log' | 'config')}
                className="h-8 text-xs shrink-0 font-bold"
              />
            )}
          </div>

          {isEditing && condition && (
            <p className="text-[11.5px] text-muted-foreground truncate font-normal">
              {condition.autoTriggerRule || `Nguồn: ${condition.triggerRule?.sourceLabel || ''}`}
            </p>
          )}
        </DialogHeader>

        <div className="flex-1 min-h-0 flex flex-col pt-1">
          {isEditing && activeTab === 'log' && condition ? (
            <CareConditionLogTab condition={condition} />
          ) : (
            <CareConditionFormInner
              key={condition ? condition.id : isOpen ? 'open' : 'closed'}
              condition={condition}
              onSave={onSave}
              onDelete={onDelete}
              onClose={onClose}
            />
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
