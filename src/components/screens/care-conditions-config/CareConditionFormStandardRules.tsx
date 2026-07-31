'use client'

import React, { useState } from 'react'
import { Input } from '@/components/ui/input'
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
  scope,
  setScope,
}) => {
  // Local states for dynamic week & weekday selection
  const [selectedWeek, setSelectedWeek] = useState<string>('tuan_1')
  const [selectedDayOfWeek, setSelectedDayOfWeek] = useState<string>('thu_2')
  const [customDaysText, setCustomDaysText] = useState<string>('1; 15; 25')
  const [customHolidayText, setCustomHolidayText] = useState<string>('01/06; 20/11')

  const isPeriodicTime = activeMetric.source === 'periodic_time'

  return (
    <>
      <FieldLabel label="Tiêu chí (Chỉ số theo dõi)">
        <InlineSelect
          value={selectedMetricId}
          options={availableMetrics.map((m) => ({ value: m.id, label: m.label }))}
          onValueChange={(val: string) => handleMetricChange(val)}
          className="w-full h-8 text-xs font-semibold text-foreground"
        />
      </FieldLabel>

      {!activeMetric.isEventMilestone && (
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
              className="w-full h-8 text-xs font-semibold"
            />
          </FieldLabel>

          <FieldLabel label={`Ngưỡng giá trị (${activeMetric.unit})`}>
            <div className="relative flex items-center">
              <Input
                type="number"
                step={activeMetric.unit === 'VNĐ' ? '500000' : '1'}
                value={thresholdValue}
                onChange={(e) => setThresholdValue(Number(e.target.value))}
                placeholder="1"
                className="h-8 text-xs font-mono font-bold pr-12"
              />
              <span className="absolute right-2.5 text-xs text-muted-foreground font-semibold pointer-events-none">
                {activeMetric.unit}
              </span>
            </div>
          </FieldLabel>
        </div>
      )}

      {/* GIAO DIỆN RIÊNG DÀNH CHO "ĐỊNH KỲ - THEO THỜI GIAN" */}
      {isPeriodicTime ? (
        <div className="space-y-3">
          {/* LỰA CHỌN THEO MỐC TUẦN & THỨ */}
          {selectedMetricId === 'periodic_by_week_and_day' ? (
            <div className="grid grid-cols-2 gap-3">
              <FieldLabel label="Tuần trong tháng">
                <InlineSelect
                  value={selectedWeek}
                  options={[
                    { value: 'tuan_1', label: 'Tuần 1' },
                    { value: 'tuan_2', label: 'Tuần 2' },
                    { value: 'tuan_3', label: 'Tuần 3' },
                    { value: 'tuan_4', label: 'Tuần 4' },
                    { value: 'tuan_1_3', label: 'Tuần 1 & Tuần 3' },
                    { value: 'tuan_2_4', label: 'Tuần 2 & Tuần 4' },
                    { value: 'tat_ca_tuan', label: 'Tất cả các tuần (Hằng tuần)' },
                  ]}
                  onValueChange={(val: string) => setSelectedWeek(val)}
                  className="w-full h-8 text-xs font-semibold"
                />
              </FieldLabel>

              <FieldLabel label="Thứ trong tuần">
                <InlineSelect
                  value={selectedDayOfWeek}
                  options={[
                    { value: 'thu_2', label: 'Thứ 2' },
                    { value: 'thu_3', label: 'Thứ 3' },
                    { value: 'thu_4', label: 'Thứ 4' },
                    { value: 'thu_5', label: 'Thứ 5' },
                    { value: 'thu_6', label: 'Thứ 6' },
                    { value: 'thu_7', label: 'Thứ 7' },
                    { value: 'chu_nhat', label: 'Chủ nhật' },
                  ]}
                  onValueChange={(val: string) => setSelectedDayOfWeek(val)}
                  className="w-full h-8 text-xs font-semibold"
                />
              </FieldLabel>
            </div>
          ) : (
            /* LỰA CHỌN MỐC NGÀY TRONG THÁNG HOẶC NGÀY LỄ TRONG NĂM */
            <div className="grid grid-cols-2 gap-3">
              <FieldLabel label="Mốc thời gian định kỳ">
                <InlineSelect
                  value={windowType}
                  options={activeMetric.windowOptions}
                  onValueChange={(val: string) => setWindowType(val)}
                  className="w-full h-8 text-xs"
                />
              </FieldLabel>

              <FieldLabel label="Phạm vi tính toán">
                <InlineSelect
                  value={scope}
                  options={activeMetric.scopeOptions}
                  onValueChange={(val: string) => setScope(val)}
                  className="w-full h-8 text-xs"
                />
              </FieldLabel>
            </div>
          )}

          {/* Ô NHẬP TỰ CHỌN NGÀY NẾU CHỌN CUSTOM DATES */}
          {selectedMetricId === 'periodic_by_date_of_month' && windowType === 'custom_dates_month' && (
            <FieldLabel label="Danh sách ngày trong tháng">
              <Input
                value={customDaysText}
                onChange={(e) => setCustomDaysText(e.target.value)}
                placeholder="Nhập các ngày trong tháng, cách nhau bởi dấu ; (VD: 1; 15; 25)"
                className="h-8 text-xs font-mono font-bold"
              />
            </FieldLabel>
          )}

          {/* Ô NHẬP TỰ CHỌN NGÀY LỄ NẾU CHỌN CUSTOM HOLIDAY */}
          {selectedMetricId === 'periodic_by_annual_date' && windowType === 'custom_holiday_date' && (
            <FieldLabel label="Danh sách các ngày lễ trong năm (DD/MM)">
              <Input
                value={customHolidayText}
                onChange={(e) => setCustomHolidayText(e.target.value)}
                placeholder="Nhập các ngày lễ, cách nhau bởi dấu ; (VD: 01/06; 20/11; 25/12)"
                className="h-8 text-xs font-mono font-bold"
              />
            </FieldLabel>
          )}

          {/* PHẠM VI TÍNH TOÁN DÀNH CHO TUẦN & THỨ */}
          {selectedMetricId === 'periodic_by_week_and_day' && (
            <FieldLabel label="Phạm vi tính toán">
              <InlineSelect
                value={scope}
                options={activeMetric.scopeOptions}
                onValueChange={(val: string) => setScope(val)}
                className="w-full h-8 text-xs"
              />
            </FieldLabel>
          )}
        </div>
      ) : (
        /* GIAO DIỆN CHUẨN DÀNH CHO CÁC NGUỒN CÒN LẠI */
        <>
          <div className="grid grid-cols-2 gap-3">
            <FieldLabel label="Chu kỳ đánh giá (Tần suất rà soát)">
              <InlineSelect
                value={windowType}
                options={activeMetric.windowOptions}
                onValueChange={(val: string) => setWindowType(val)}
                className="w-full h-8 text-xs"
              />
            </FieldLabel>

            {windowType === 'custom_sessions' ? (
              <FieldLabel label="Số buổi xét gần nhất (N buổi)">
                <div className="relative flex items-center">
                  <Input
                    type="number"
                    min={1}
                    max={100}
                    value={customSessionCount}
                    onChange={(e) => setCustomSessionCount(Number(e.target.value))}
                    placeholder="8"
                    className="h-8 text-xs font-mono font-bold pr-12"
                  />
                  <span className="absolute right-2.5 text-xs text-muted-foreground font-semibold pointer-events-none">
                    buổi
                  </span>
                </div>
              </FieldLabel>
            ) : (
              <FieldLabel label="Phạm vi tính toán">
                <InlineSelect
                  value={scope}
                  options={activeMetric.scopeOptions}
                  onValueChange={(val: string) => setScope(val)}
                  className="w-full h-8 text-xs"
                />
              </FieldLabel>
            )}
          </div>

          {windowType === 'custom_sessions' && (
            <FieldLabel label="Phạm vi tính toán">
              <InlineSelect
                value={scope}
                options={activeMetric.scopeOptions}
                onValueChange={(val: string) => setScope(val)}
                className="w-full h-8 text-xs"
              />
            </FieldLabel>
          )}
        </>
      )}
    </>
  )
}
