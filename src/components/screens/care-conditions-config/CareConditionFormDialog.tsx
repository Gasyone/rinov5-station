'use client'

import React, { useState } from 'react'
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
import { InlineSelect } from '@/components/controls'
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
import { CareConditionFormRoadmapRules } from './CareConditionFormRoadmapRules'
import { CareConditionFormStandardRules } from './CareConditionFormStandardRules'
import { CareConditionFormSlaRules } from './CareConditionFormSlaRules'

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
  const initialSource: TriggerSource = condition?.triggerRule?.source || 'curriculum_path'
  const [selectedSource, setSelectedSource] = useState<TriggerSource>(initialSource)

  // Roadmap-specific states (`curriculum_path`)
  const [milestoneType, setMilestoneType] = useState<'theo_buoi' | 'theo_loai_buoi' | 'theo_moc_cap_do'>(
    condition?.triggerRule?.milestoneType || 'theo_buoi'
  )
  const [milestoneValue, setMilestoneValue] = useState<string>(
    condition?.triggerRule?.milestoneValue || '1; 5; 10'
  )

  // Non-roadmap metrics states
  const initialCatalog = METRIC_CATALOG[initialSource] || METRIC_CATALOG.attendance_session
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
  const [scope, setScope] = useState<string>(
    condition?.triggerRule?.scope || initialFoundMetric.scopeOptions[0]?.value || 'theo_tung_mon'
  )

  const [errors, setErrors] = useState<Record<string, string>>({})

  // Active metrics catalog for non-roadmap sources
  const availableMetrics = METRIC_CATALOG[selectedSource] || METRIC_CATALOG.attendance_session
  const activeMetric = availableMetrics.find((m) => m.id === selectedMetricId) || availableMetrics[0]

  // When source changes
  const handleSourceChange = (newSource: TriggerSource) => {
    setSelectedSource(newSource)
    if (newSource === 'curriculum_path') {
      setMilestoneType('theo_buoi')
      setMilestoneValue('1; 5; 10')
    } else {
      const newCatalog = METRIC_CATALOG[newSource] || METRIC_CATALOG.attendance_session
      const firstMetric = newCatalog[0]
      if (firstMetric) {
        setSelectedMetricId(firstMetric.id)
        setTriggerOperator(firstMetric.defaultOperator)
        setThresholdValue(firstMetric.defaultThreshold)
        setWindowType(firstMetric.windowOptions[0]?.value || 'tuc_thoi')
        setScope(firstMetric.scopeOptions[0]?.value || 'theo_tung_mon')
      }
    }
  }

  // When non-roadmap criterion changes
  const handleMetricChange = (metricId: string) => {
    setSelectedMetricId(metricId)
    const m = availableMetrics.find((item) => item.id === metricId)
    if (m) {
      setTriggerOperator(m.defaultOperator)
      setThresholdValue(m.defaultThreshold)
      setWindowType(m.windowOptions[0]?.value || 'tuc_thoi')
      setScope(m.scopeOptions[0]?.value || 'theo_tung_mon')
    }
  }

  const isMilestoneOperator = triggerOperator === 'milestone' || !!activeMetric.isEventMilestone
  const isSlaValueRequired = ['fixed_time', 'before_event_session', 'after_event_session', 'before_package_expiry', 'after_package_expiry', 'before_next_bill', 'before_next_session', 'after_next_session'].includes(slaType)

  // Dynamic computed SLA text label for UI & table
  const computedSlaLabel = (() => {
    const unitText = slaUnit === 'days' ? 'ngày' : 'giờ'
    if (slaType === 'fixed_time') return `⏱️ Trong vòng ${slaValueInput || 24} ${unitText}`
    if (slaType === 'before_event_session') return `🏫 Trước buổi học biến động ${slaValueInput || 12} ${unitText}`
    if (slaType === 'at_event_session') return '📅 Ngay giờ bắt đầu buổi học biến động'
    if (slaType === 'after_event_session') return `⌛ Sau buổi học biến động ${slaValueInput || 2} ${unitText}`
    if (slaType === 'before_package_expiry') return `⏳ Trước ngày gói hết hạn ${slaValueInput || 7} ${unitText}`
    if (slaType === 'at_package_expiry') return '📅 Ngay ngày gói học hết hạn (23:59)'
    if (slaType === 'after_package_expiry') return `⌛ Sau ngày gói hết hạn ${slaValueInput || 5} ${unitText}`
    if (slaType === 'before_next_bill') return `💰 Trước hạn đóng tiền đợt tiếp theo ${slaValueInput || 3} ${unitText}`
    if (slaType === 'before_next_session') return `⏳ Trước buổi tiếp theo ${slaValueInput || 3} ${unitText}`
    if (slaType === 'at_next_session') return '📅 Trước giờ học buổi tiếp theo'
    if (slaType === 'after_next_session') return `⌛ Sau buổi tiếp theo ${slaValueInput || 2} ${unitText}`
    if (slaType === 'end_of_month') return '📆 Đến ngày cuối cùng của tháng'
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

    let structuredRule: StructuredTriggerRule

    if (selectedSource === 'curriculum_path') {
      const typeLabelMap = {
        theo_buoi: `Theo số buổi (${milestoneValue})`,
        theo_loai_buoi: `Theo loại buổi (${milestoneValue})`,
        theo_moc_cap_do: `Theo mốc cấp độ (${milestoneValue})`,
      }

      structuredRule = {
        source: 'curriculum_path',
        sourceLabel: 'Lộ trình - Khung chương trình',
        metric: milestoneType,
        metricLabel: typeLabelMap[milestoneType],
        milestoneType,
        milestoneValue,
        slaType,
        slaUnit,
        slaValueInput,
        slaHoursInput: slaHoursConverted,
      }
    } else {
      const operatorObj = activeMetric.operators.find((op) => op.value === triggerOperator)
      const windowObj = activeMetric.windowOptions.find((w) => w.value === windowType)
      const scopeObj = activeMetric.scopeOptions.find((sc) => sc.value === scope)

      const windowRangeCode = windowType === 'custom_sessions' ? `${customSessionCount}_buoi_gan_nhat` : windowType
      const windowRangeText =
        windowType === 'custom_sessions' ? `Trong ${customSessionCount || 8} buổi cuộn gần nhất` : windowObj?.label || ''

      structuredRule = {
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
    <form onSubmit={handleSubmit} className="pt-3 space-y-4">
      <div className="grid grid-cols-2 gap-8">
        
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

        {/* CỘT BÊN PHẢI: QUY TẮC TỰ ĐỘNG KÍCH HOẠT & SLA */}
        <div className="space-y-3.5 border-l border-border/60 pl-8">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-foreground">
              Cấu hình quy tắc tự động kích hoạt
            </span>
            <div className="flex items-center gap-2">
              <Switch
                checked={isActive}
                onCheckedChange={setIsActive}
                id="is-active-toggle-modal"
              />
              <label htmlFor="is-active-toggle-modal" className="text-xs font-semibold cursor-pointer">
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

          {/* 2 & 3 & 4: LỘ TRÌNH VS NGUỒN CHUẨN */}
          {selectedSource === 'curriculum_path' ? (
            <CareConditionFormRoadmapRules
              milestoneType={milestoneType}
              setMilestoneType={setMilestoneType}
              milestoneValue={milestoneValue}
              setMilestoneValue={setMilestoneValue}
            />
          ) : (
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
              scope={scope}
              setScope={setScope}
            />
          )}

          {/* 5. CẤU HÌNH THỜI HẠN SLA */}
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

      <DialogFooter className="pt-3 border-t border-border flex items-center justify-between gap-2">
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

export const CareConditionFormDialog: React.FC<CareConditionFormDialogProps> = ({
  isOpen,
  onClose,
  condition,
  onSave,
  onDelete,
}) => {
  const isEditing = !!condition

  return (
    <Dialog open={isOpen} onOpenChange={(open) => { if (!open) onClose() }}>
      <DialogContent className="sm:max-w-5xl w-[92vw] max-h-[90vh] overflow-y-auto p-6 rounded-xl">
        <DialogHeader className="pb-2.5 border-b border-border">
          <DialogTitle className="text-base font-bold text-foreground">
            {isEditing ? `Cấu hình Mã điều kiện ${condition.code}` : 'Thêm mới Điều kiện Chăm sóc'}
          </DialogTitle>
        </DialogHeader>

        <CareConditionFormInner
          key={condition ? condition.id : isOpen ? 'open' : 'closed'}
          condition={condition}
          onSave={onSave}
          onDelete={onDelete}
          onClose={onClose}
        />
      </DialogContent>
    </Dialog>
  )
}
