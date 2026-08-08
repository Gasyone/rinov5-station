'use client'

import React, { useState, useEffect } from 'react'
import { Plus, Minus } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { FieldLabel } from '@/components/shared'
import { InlineSelect } from '@/components/controls'
import { TriggerOperator } from './careConditionsTypes'
import { MetricDefinition } from './careConditionsCatalog'

interface StandardRulesProps {
  selectedMetricId: string
  handleMetricChange: (id: string) => void
  availableMetrics: MetricDefinition[]
  activeMetric: MetricDefinition
  triggerOperator: TriggerOperator
  setTriggerOperator: (op: TriggerOperator) => void
  thresholdValue: number
  setThresholdValue: (val: number) => void
  windowType: string
  setWindowType: (wt: string) => void
  customSessionCount: number
  setCustomSessionCount: (cnt: number) => void
  customSessionNumbersText?: string
  setCustomSessionNumbersText?: (val: string) => void
  customDaysText?: string
  setCustomDaysText?: (val: string) => void
  scope: string
  setScope: (sc: string) => void
}

export const CareConditionFormStandardRules: React.FC<StandardRulesProps> = ({
  selectedMetricId,
  handleMetricChange,
  availableMetrics,
  activeMetric,
  triggerOperator,
  setTriggerOperator,
  thresholdValue,
  setThresholdValue,
  windowType,
  setWindowType,
  customSessionCount,
  setCustomSessionCount,
  customSessionNumbersText = '1; 5; 10',
  setCustomSessionNumbersText,
  customDaysText = '1; 15; 25',
  setCustomDaysText,
  scope,
  setScope,
}) => {
  // Local states for dynamic week & weekday selection
  const [selectedWeek, setSelectedWeek] = useState<string>('tuan_1')
  const [selectedDayOfWeek, setSelectedDayOfWeek] = useState<string>('thu_2')
  const [customHolidayText, setCustomHolidayText] = useState<string>('01/06; 20/11')

  // Auto-sync fallback: if windowType, triggerOperator, or scope do not match current activeMetric options
  useEffect(() => {
    if (activeMetric.windowOptions && activeMetric.windowOptions.length > 0) {
      const isValidWindow = activeMetric.windowOptions.some((opt) => opt.value === windowType)
      if (!isValidWindow) {
        setWindowType(activeMetric.windowOptions[0].value)
      }
    }
    if (activeMetric.operators && activeMetric.operators.length > 0) {
      const isValidOperator = activeMetric.operators.some((opt) => opt.value === triggerOperator)
      if (!isValidOperator) {
        setTriggerOperator(activeMetric.defaultOperator || activeMetric.operators[0].value)
      }
    }
    if (activeMetric.scopeOptions && activeMetric.scopeOptions.length > 0) {
      const isValidScope = activeMetric.scopeOptions.some((opt) => opt.value === scope)
      if (!isValidScope) {
        setScope(activeMetric.scopeOptions[0].value)
      }
    }
  }, [activeMetric, windowType, triggerOperator, scope, setWindowType, setTriggerOperator, setScope])

  const getActivationBadgeInfo = (wType: string, src: string) => {
    const windowObj = activeMetric.windowOptions?.find((w) => w.value === wType)
    const windowLabelStr = windowObj?.label || wType

    if (src === 'periodic_time') {
      if (selectedMetricId === 'periodic_by_date_of_month') {
        if (wType === 'custom_dates_month') {
          return {
            title: `Rà soát định kỳ theo mốc ngày (${customDaysText || '1; 15; 25'})`,
            description: `Hệ thống sẽ tự động quét dữ liệu vào 04:00 sáng của các mốc ngày (${customDaysText || '1; 15; 25'}) hằng tháng.`,
          }
        }
        return {
          title: `Rà soát định kỳ hằng tháng (${windowLabelStr})`,
          description: `Hệ thống sẽ tự động quét dữ liệu vào 04:00 sáng (${windowLabelStr}) và kích hoạt phiếu chăm sóc cho đối tượng phù hợp.`,
        }
      }

      if (selectedMetricId === 'periodic_by_week_and_day') {
        const weekMap: Record<string, string> = {
          tuan_1: 'Tuần 1',
          tuan_2: 'Tuần 2',
          tuan_3: 'Tuần 3',
          tuan_4: 'Tuần 4',
          tuan_cuoi: 'Tuần cuối tháng',
        }
        const dayMap: Record<string, string> = {
          thu_2: 'Thứ Hai',
          thu_3: 'Thứ Ba',
          thu_4: 'Thứ Tư',
          thu_5: 'Thứ Năm',
          thu_6: 'Thứ Sáu',
          thu_7: 'Thứ Bảy',
          chu_nhat: 'Chủ Nhật',
        }
        const wStr = weekMap[selectedWeek] || 'Tuần 1'
        const dStr = dayMap[selectedDayOfWeek] || 'Thứ Hai'
        return {
          title: `Rà soát định kỳ theo Tuần & Thứ (04:00 sáng ${wStr} - ${dStr})`,
          description: `Hệ thống sẽ tự động rà soát vào 04:00 sáng của ${dStr} thuộc ${wStr} hằng tháng.`,
        }
      }

      if (selectedMetricId === 'periodic_by_annual_date') {
        if (wType === 'custom_holiday_date') {
          return {
            title: `Rà soát định kỳ mốc sự kiện (${customHolidayText || '01/06; 20/11'})`,
            description: `Hệ thống sẽ rà soát vào 04:00 sáng của các mốc ngày lễ đã nhập (${customHolidayText || '01/06; 20/11'}).`,
          }
        }
        return {
          title: `Rà soát định kỳ sự kiện năm (${windowLabelStr})`,
          description: `Hệ thống sẽ tự động rà soát và kích hoạt phiếu chăm sóc vào 04:00 sáng của mốc ${windowLabelStr}.`,
        }
      }
    }

    if (wType === 'dinh_ky_hang_tuan') {
      return {
        title: 'Rà soát định kỳ hằng tuần (04:00 sáng Thứ 2)',
        description: 'Hệ thống sẽ tự động rà soát dữ liệu vào 04:00 sáng Thứ 2 hằng tuần và kích hoạt phiếu chăm sóc khi đạt ngưỡng.',
      }
    }

    if (wType === 'dinh_ky_hang_thang') {
      return {
        title: 'Rà soát định kỳ hằng tháng (04:00 sáng Ngày 1)',
        description: 'Hệ thống sẽ tự động rà soát dữ liệu vào 04:00 sáng Ngày 1 hằng tháng và kích hoạt phiếu chăm sóc khi đạt ngưỡng.',
      }
    }

    if (wType === 'custom_sessions') {
      return {
        title: `Kích hoạt theo ${customSessionCount || 8} buổi học gần nhất`,
        description: `Hệ thống sẽ tự động tính toán chỉ số trên ${customSessionCount || 8} buổi học đã xảy ra ngay khi kết thúc điểm danh / chấm bài.`,
      }
    }

    if (wType === 'custom_session_numbers') {
      return {
        title: `Kích hoạt tại các mốc số buổi (${customSessionNumbersText || '1; 5; 10'})`,
        description: `Hệ thống sẽ tự động kích hoạt phiếu chăm sóc khi học viên hoàn thành điểm danh tại các buổi học thứ ${customSessionNumbersText || '1; 5; 10'}.`,
      }
    }

    if (wType === 'toan_khoa' || wType === 'trong_thang' || wType === '30_ngay' || wType === 'dinh_ky_04h_sang' || wType === 'dinh_ky_hang_ngay') {
      return {
        title: 'Rà soát định kỳ (04:00 sáng hằng ngày)',
        description: 'Hệ thống sẽ tự động tổng hợp dữ liệu và rà soát vào 04:00 sáng hằng ngày để kích hoạt phiếu chăm sóc khi đạt ngưỡng.',
      }
    }

    if (src === 'homework_db') {
      return {
        title: 'Kích hoạt tức thời (Real-time)',
        description: 'Tự động kích hoạt phiếu chăm sóc cho học viên ngay khi giáo viên chấm/lưu kết quả BTVN.',
      }
    }

    if (src === 'exam_grade') {
      return {
        title: 'Kích hoạt tức thời (Real-time)',
        description: 'Tự động kích hoạt phiếu chăm sóc cho học viên ngay khi giáo viên nhập/lưu điểm bài kiểm tra.',
      }
    }

    if (src === 'student_account') {
      return {
        title: `Tự động kích hoạt (${windowLabelStr})`,
        description: `Hệ thống sẽ tự động quét hồ sơ và kích hoạt phiếu chăm sóc khi mốc (${windowLabelStr}) được ghi nhận.`,
      }
    }

    return {
      title: 'Kích hoạt tức thời (Real-time)',
      description: `Tự động kích hoạt phiếu chăm sóc ngay khi hệ thống ghi nhận sự kiện (${windowLabelStr}).`,
    }
  }

  const badgeInfo = getActivationBadgeInfo(windowType, activeMetric.source as string)

  const windowLabel =
    selectedMetricId === 'att_theo_so_buoi'
      ? 'Mốc thứ tự buổi học kích hoạt'
      : selectedMetricId === 'att_theo_loai_buoi'
      ? 'Loại buổi học kích hoạt'
      : activeMetric.source === 'periodic_time'
      ? 'Mốc thời gian / Tần suất rà soát'
      : 'Chu kỳ đánh giá (Tần suất rà soát)'

  // Determine if comparison operator & numeric threshold fields should be shown
  const showNumericComparison = !activeMetric.isEventMilestone || (activeMetric.operators && activeMetric.operators.length > 1 && activeMetric.unit !== 'mốc')

  // Determine if scope selection should be shown (Temporarily disabled as requested)
  const hasScopeOptions = false

  // Determine if windowType selection should be shown
  const hasWindowOptions = activeMetric.windowOptions && activeMetric.windowOptions.length > 0 && selectedMetricId !== 'periodic_by_week_and_day'

  return (
    <>
      {/* 1. TIÊU CHÍ (CHỈ SỐ THEO DÕI) */}
      <FieldLabel label="Tiêu chí (Chỉ số theo dõi)">
        <InlineSelect
          value={activeMetric.id}
          options={availableMetrics.map((m) => ({ value: m.id, label: m.label }))}
          onValueChange={(val: string) => handleMetricChange(val)}
          placeholder="Chọn tiêu chí theo dõi..."
          className="w-full h-8 text-xs font-semibold text-foreground"
        />
      </FieldLabel>

      {/* 2. PHÉP TOÁN SO SÁNH & NGƯỠNG GIÁ TRỊ (NẾU CÓ) */}
      {showNumericComparison && (
        <div className="grid grid-cols-2 gap-3">
          <FieldLabel label="Phép toán so sánh">
            <InlineSelect
              value={triggerOperator}
              options={activeMetric.operators}
              onValueChange={(val: string) => {
                const op = val as TriggerOperator
                setTriggerOperator(op)
                if (op === 'milestone') setThresholdValue(1)
              }}
              placeholder="Chọn phép toán..."
              className="w-full h-8 text-xs font-semibold"
            />
          </FieldLabel>

          <FieldLabel label={`Ngưỡng giá trị (${activeMetric.unit})`}>
            <div className="flex items-center gap-2 w-full">
              <div className="flex items-center border border-input rounded-md overflow-hidden bg-background focus-within:ring-1 focus-within:ring-ring flex-1 h-8">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    const step = activeMetric.unit === 'VNĐ' ? 500000 : 1
                    setThresholdValue(Math.max(0, (thresholdValue || 0) - step))
                  }}
                  className="h-8 w-9 rounded-none border-r border-border hover:bg-muted font-bold text-muted-foreground hover:text-foreground shrink-0 cursor-pointer"
                >
                  <Minus className="h-3.5 w-3.5" />
                </Button>
                <Input
                  type="number"
                  min={0}
                  step={activeMetric.unit === 'VNĐ' ? '500000' : '1'}
                  value={thresholdValue}
                  onChange={(e) => setThresholdValue(Math.max(0, Number(e.target.value)))}
                  placeholder="0"
                  className="h-8 border-0 text-center font-mono font-bold text-xs focus-visible:ring-0 focus-visible:ring-offset-0 px-2 rounded-none min-w-0 flex-1 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    const step = activeMetric.unit === 'VNĐ' ? 500000 : 1
                    setThresholdValue((thresholdValue || 0) + step)
                  }}
                  className="h-8 w-9 rounded-none border-l border-border hover:bg-muted font-bold text-muted-foreground hover:text-foreground shrink-0 cursor-pointer"
                >
                  <Plus className="h-3.5 w-3.5" />
                </Button>
              </div>

              <div className="h-8 px-2.5 flex items-center justify-center border border-input bg-muted/40 rounded-md shrink-0 text-xs font-bold text-muted-foreground min-w-[48px]">
                {activeMetric.unit}
              </div>
            </div>
          </FieldLabel>
        </div>
      )}

      {/* 3. MỐC / CHU KỲ KÍCH HOẠT & PHẠM VI TÍNH TOÁN */}
      <div className="space-y-3">
        <div className={hasScopeOptions && hasWindowOptions ? 'grid grid-cols-2 gap-3' : 'grid grid-cols-1 gap-3'}>
          {hasWindowOptions && (
            <FieldLabel label={windowLabel}>
              <InlineSelect
                value={windowType}
                options={activeMetric.windowOptions}
                onValueChange={(val: string) => setWindowType(val)}
                placeholder="Chọn mốc / chu kỳ..."
                className="w-full h-8 text-xs font-semibold"
              />
            </FieldLabel>
          )}

          {hasScopeOptions && (
            <FieldLabel label="Phạm vi tính toán">
              <InlineSelect
                value={scope}
                options={activeMetric.scopeOptions}
                onValueChange={(val: string) => setScope(val)}
                placeholder="Chọn phạm vi..."
                className="w-full h-8 text-xs font-semibold"
              />
            </FieldLabel>
          )}
        </div>

        {/* CÁC Ô NHẬP DỮ LIỆU TỦY CHỈNH THEO MỐC ĐÃ CHỌN */}

        {/* a) Ô nhập N buổi học gần nhất */}
        {windowType === 'custom_sessions' && (
          <FieldLabel label="Số buổi đã xảy ra ở lớp học (N buổi)">
            <div className="flex items-center gap-2 w-full">
              <div className="flex items-center border border-input rounded-md overflow-hidden bg-background focus-within:ring-1 focus-within:ring-ring flex-1 h-8">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => setCustomSessionCount(Math.max(1, (customSessionCount || 1) - 1))}
                  className="h-8 w-9 rounded-none border-r border-border hover:bg-muted font-bold text-muted-foreground hover:text-foreground shrink-0 cursor-pointer"
                >
                  <Minus className="h-3.5 w-3.5" />
                </Button>
                <Input
                  type="number"
                  min={1}
                  max={100}
                  value={customSessionCount}
                  onChange={(e) => setCustomSessionCount(Math.max(1, Number(e.target.value)))}
                  placeholder="8"
                  className="h-8 border-0 text-center font-mono font-bold text-xs focus-visible:ring-0 focus-visible:ring-offset-0 px-2 rounded-none min-w-0 flex-1 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => setCustomSessionCount((customSessionCount || 0) + 1)}
                  className="h-8 w-9 rounded-none border-l border-border hover:bg-muted font-bold text-muted-foreground hover:text-foreground shrink-0 cursor-pointer"
                >
                  <Plus className="h-3.5 w-3.5" />
                </Button>
              </div>
              <div className="h-8 px-2.5 flex items-center justify-center border border-input bg-muted/40 rounded-md shrink-0 text-xs font-bold text-muted-foreground min-w-[48px]">
                buổi
              </div>
            </div>
          </FieldLabel>
        )}

        {/* b) Ô nhập danh sách mốc số thứ tự buổi học (VD: 1; 5; 10) */}
        {windowType === 'custom_session_numbers' && (
          <FieldLabel label="Danh sách mốc số thứ tự buổi học (VD: 1; 5; 10)">
            <Input
              value={customSessionNumbersText}
              onChange={(e) => setCustomSessionNumbersText?.(e.target.value)}
              placeholder="VD: 1; 5; 10; 15"
              className="h-8 text-xs font-mono font-bold"
            />
          </FieldLabel>
        )}

        {/* c) Ô nhập danh sách mốc ngày trong tháng (VD: 1; 15; 25) */}
        {selectedMetricId === 'periodic_by_date_of_month' && windowType === 'custom_dates_month' && (
          <FieldLabel label="Danh sách mốc ngày trong tháng (VD: 1; 15; 25)">
            <Input
              value={customDaysText}
              onChange={(e) => setCustomDaysText?.(e.target.value)}
              placeholder="VD: 1; 15; 25"
              className="h-8 text-xs font-mono font-bold"
            />
          </FieldLabel>
        )}

        {/* d) Chọn Tuần & Thứ trong tháng */}
        {selectedMetricId === 'periodic_by_week_and_day' && (
          <div className="grid grid-cols-2 gap-3">
            <FieldLabel label="Chọn tuần trong tháng">
              <InlineSelect
                value={selectedWeek}
                options={[
                  { value: 'tuan_1', label: 'Tuần 1' },
                  { value: 'tuan_2', label: 'Tuần 2' },
                  { value: 'tuan_3', label: 'Tuần 3' },
                  { value: 'tuan_4', label: 'Tuần 4' },
                  { value: 'tuan_cuoi', label: 'Tuần cuối tháng' },
                ]}
                onValueChange={(val: string) => setSelectedWeek(val)}
                placeholder="Chọn tuần..."
                className="w-full h-8 text-xs font-semibold"
              />
            </FieldLabel>

            <FieldLabel label="Chọn thứ trong tuần">
              <InlineSelect
                value={selectedDayOfWeek}
                options={[
                  { value: 'thu_2', label: 'Thứ Hai' },
                  { value: 'thu_3', label: 'Thứ Ba' },
                  { value: 'thu_4', label: 'Thứ Tư' },
                  { value: 'thu_5', label: 'Thứ Năm' },
                  { value: 'thu_6', label: 'Thứ Sáu' },
                  { value: 'thu_7', label: 'Thứ Bảy' },
                  { value: 'chu_nhat', label: 'Chủ Nhật' },
                ]}
                onValueChange={(val: string) => setSelectedDayOfWeek(val)}
                placeholder="Chọn thứ..."
                className="w-full h-8 text-xs font-semibold"
              />
            </FieldLabel>
          </div>
        )}

        {/* e) Ô nhập danh sách mốc ngày lễ / sự kiện năm (DD/MM) */}
        {selectedMetricId === 'periodic_by_annual_date' && windowType === 'custom_holiday_date' && (
          <FieldLabel label="Danh sách mốc ngày lễ / sự kiện năm (DD/MM)">
            <Input
              value={customHolidayText}
              onChange={(e) => setCustomHolidayText(e.target.value)}
              placeholder="VD: 01/06; 20/11"
              className="h-8 text-xs font-mono font-bold"
            />
          </FieldLabel>
        )}

        {/* 4. BADGE THỜI ĐIỂM KÍCH HOẠT HỆ THỐNG */}
        <div className="rounded-md border border-primary/20 bg-primary/5 p-3 text-xs flex items-center gap-2 mt-2">
          <div className="flex flex-col gap-0.5">
            <span className="font-bold text-primary">{badgeInfo.title}</span>
            <span className="text-muted-foreground text-[11px]">{badgeInfo.description}</span>
          </div>
        </div>
      </div>
    </>
  )
}

