'use client'

import React, { useState } from 'react'
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

  const getActivationBadgeInfo = (wType: string, src: string) => {
    if (src === 'periodic_time') {
      if (selectedMetricId === 'periodic_by_date_of_month') {
        if (wType === 'ngay_25') {
          return {
            title: 'Rà soát định kỳ hằng tháng (04:00 sáng Ngày 25)',
            description:
              'Hệ thống sẽ tự động quét dữ liệu vào 04:00 sáng Ngày 25 hằng tháng và kích hoạt phiếu chăm sóc cho toàn bộ đối tượng phù hợp.',
          }
        }
        if (wType === 'ngay_1') {
          return {
            title: 'Rà soát định kỳ hằng tháng (04:00 sáng Ngày 1)',
            description:
              'Hệ thống sẽ tự động quét dữ liệu vào 04:00 sáng Ngày 1 hằng tháng và kích hoạt phiếu chăm sóc cho toàn bộ đối tượng phù hợp.',
          }
        }
        if (wType === 'ngay_15') {
          return {
            title: 'Rà soát định kỳ hằng tháng (04:00 sáng Ngày 15)',
            description:
              'Hệ thống sẽ tự động quét dữ liệu vào 04:00 sáng Ngày 15 hằng tháng và kích hoạt phiếu chăm sóc cho toàn bộ đối tượng phù hợp.',
          }
        }
        if (wType === 'ngay_cuoi_thang') {
          return {
            title: 'Rà soát định kỳ cuối tháng (04:00 sáng Ngày cuối cùng)',
            description:
              'Hệ thống sẽ tự động quét dữ liệu vào 04:00 sáng ngày cuối cùng của tháng và kích hoạt phiếu chăm sóc.',
          }
        }
        return {
          title: 'Rà soát định kỳ theo mốc ngày đã chọn (04:00 sáng)',
          description:
            'Hệ thống sẽ tự động rà soát và kích hoạt phiếu chăm sóc vào 04:00 sáng của các mốc ngày được chọn hằng tháng.',
        }
      }

      if (selectedMetricId === 'periodic_by_week_and_day') {
        return {
          title: 'Rà soát định kỳ theo Tuần & Thứ (04:00 sáng)',
          description:
            'Hệ thống sẽ tự động rà soát và kích hoạt phiếu chăm sóc vào 04:00 sáng của ngày Thứ được chọn thuộc Tuần đã cấu hình hằng tháng.',
        }
      }

      if (selectedMetricId === 'periodic_by_annual_date') {
        return {
          title: 'Rà soát định kỳ theo Ngày lễ / Sự kiện năm (04:00 sáng)',
          description:
            'Hệ thống sẽ tự động rà soát và kích hoạt phiếu chăm sóc vào 04:00 sáng của mốc ngày lễ / sự kiện năm đã cấu hình.',
        }
      }
    }

    if (wType === 'dinh_ky_hang_tuan') {
      return {
        title: 'Rà soát định kỳ hằng tuần (04:00 sáng Thứ 2)',
        description:
          'Hệ thống sẽ tự động rà soát dữ liệu vào 04:00 sáng Thứ 2 hằng tuần và kích hoạt phiếu chăm sóc khi đạt ngưỡng thiết lập.',
      }
    }

    if (wType === 'dinh_ky_hang_thang') {
      return {
        title: 'Rà soát định kỳ hằng tháng (04:00 sáng Ngày 1)',
        description:
          'Hệ thống sẽ tự động rà soát dữ liệu vào 04:00 sáng Ngày 1 hằng tháng và kích hoạt phiếu chăm sóc khi đạt ngưỡng thiết lập.',
      }
    }

    if (wType === 'custom_sessions') {
      return {
        title: 'Kích hoạt theo buổi học (Sau mỗi buổi điểm danh)',
        description:
          'Hệ thống sẽ tự động tính toán chỉ số trên N buổi gần nhất ngay khi điểm danh kết thúc buổi học.',
      }
    }

    if (wType === 'toan_khoa' || wType === 'trong_thang' || wType === '30_ngay' || wType === 'dinh_ky_hang_ngay') {
      return {
        title: 'Rà soát định kỳ (04:00 sáng hằng ngày)',
        description:
          'Hệ thống sẽ tự động tổng hợp dữ liệu và rà soát vào 04:00 sáng hằng ngày để kích hoạt phiếu chăm sóc khi đạt ngưỡng.',
      }
    }

    // Mặc định Real-time nếu là realtime hoặc sự kiện tức thời
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

    return {
      title: 'Kích hoạt tức thời (Real-time)',
      description: 'Tự động kích hoạt phiếu chăm sóc cho học viên ngay khi hệ thống ghi nhận chỉ số đạt ngưỡng thiết lập.',
    }
  }

  const badgeInfo = getActivationBadgeInfo(windowType, activeMetric.source as string)

  const isPeriodicTime = activeMetric.source === 'periodic_time'
  const isScopeHidden = true

  const windowLabel =
    selectedMetricId === 'att_theo_so_buoi'
      ? 'Mốc số thứ tự buổi học'
      : selectedMetricId === 'att_theo_loai_buoi'
      ? 'Loại buổi học kích hoạt'
      : 'Chu kỳ đánh giá (Tần suất rà soát)'

  return (
    <>
      <FieldLabel label="Tiêu chí (Chỉ số theo dõi)">
        <InlineSelect
          value={activeMetric.id}
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
            <div className="flex items-center gap-2 w-full">
              {/* Bộ Stepper: Nút [-], Ô số ở giữa, Nút [+] */}
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

              {/* Tag Đơn vị hiển thị bên phải */}
              <div className="h-8 px-2.5 flex items-center justify-center border border-input bg-muted/40 rounded-md shrink-0 text-xs font-bold text-muted-foreground min-w-[48px]">
                {activeMetric.unit}
              </div>
            </div>
          </FieldLabel>
        </div>
      )}

      {/* HIỂN THỊ CỦA NGUỒN ĐỊNH KỲ THEO THỜI GIAN */}
      {isPeriodicTime ? (
        <div className="space-y-3">
          {selectedMetricId !== 'periodic_by_week_and_day' && (
            <FieldLabel label={windowLabel}>
              <InlineSelect
                value={windowType}
                options={activeMetric.windowOptions}
                onValueChange={(val: string) => setWindowType(val)}
                className="w-full h-8 text-xs font-semibold"
              />
            </FieldLabel>
          )}

          {selectedMetricId === 'periodic_by_date_of_month' && windowType === 'custom_dates_month' && (
            <FieldLabel label="Danh sách mốc ngày trong tháng (VD: 1; 15; 25)">
              <Input
                value={customDaysText}
                onChange={(e) => setCustomDaysText?.(e.target.value)}
                placeholder="Nhập mốc ngày, cách nhau bởi dấu ; (VD: 1; 15; 25)"
                className="h-8 text-xs font-mono font-bold"
              />
            </FieldLabel>
          )}

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
                  className="w-full h-8 text-xs font-semibold"
                />
              </FieldLabel>
            </div>
          )}

          {selectedMetricId === 'periodic_by_annual_date' && windowType === 'custom_holiday_date' && (
            <FieldLabel label="Danh sách mốc ngày lễ / sự kiện năm (DD/MM)">
              <Input
                value={customHolidayText}
                onChange={(e) => setCustomHolidayText(e.target.value)}
                placeholder="Nhập ngày/tháng, cách nhau bởi dấu ; (VD: 01/06; 20/11)"
                className="h-8 text-xs font-mono font-bold"
              />
            </FieldLabel>
          )}

          {/* BADGE THỜI ĐIỂM KÍCH HOẠT DÀNH CHO NGUỒN ĐỊNH KỲ THEO THỜI GIAN */}
          <div className="rounded-md border border-primary/20 bg-primary/5 p-3 text-xs flex items-center gap-2 mt-2">
            <div className="flex flex-col gap-0.5">
              <span className="font-bold text-primary">{badgeInfo.title}</span>
              <span className="text-muted-foreground text-[11px]">{badgeInfo.description}</span>
            </div>
          </div>
        </div>
      ) : selectedMetricId === 'att_theo_so_buoi' || selectedMetricId === 'att_theo_loai_buoi' ? (
        /* GIAO DIỆN DÀNH CHO MỐC BUỔI HỌC / LOẠI BUỔI HỌC CỦA HỌC VIÊN */
        <div className="space-y-3">
          <FieldLabel label={selectedMetricId === 'att_theo_so_buoi' ? 'Mốc thứ tự buổi học kích hoạt' : 'Loại buổi học kích hoạt'}>
            <InlineSelect
              value={windowType}
              options={activeMetric.windowOptions}
              onValueChange={(val: string) => setWindowType(val)}
              className="w-full h-8 text-xs font-semibold"
            />
          </FieldLabel>

          {selectedMetricId === 'att_theo_so_buoi' && windowType === 'custom_session_numbers' && (
            <FieldLabel label="Danh sách mốc số thứ tự buổi học (VD: 1; 5; 10)">
              <Input
                value={customSessionNumbersText}
                onChange={(e) => setCustomSessionNumbersText?.(e.target.value)}
                placeholder="Nhập mốc số buổi, cách nhau bởi dấu ; (VD: 1; 5; 10; 15)"
                className="h-8 text-xs font-mono font-bold"
              />
            </FieldLabel>
          )}

          <div className="rounded-md border border-primary/20 bg-primary/5 p-3 text-xs flex items-center gap-2">
            <div className="flex flex-col gap-0.5">
              <span className="font-bold text-primary">Kích hoạt tức thời (Real-time)</span>
              <span className="text-muted-foreground text-[11px]">
                Tự động kích hoạt phiếu chăm sóc cho học viên sau khi học xong buổi học đó.
              </span>
            </div>
          </div>
        </div>
      ) : activeMetric.isEventMilestone ? (
        /* GIAO DIỆN CHO TIÊU CHÍ SỰ KIỆN TỨC THỜI (LỚP HỌC BIẾN ĐỘNG) */
        <div className="rounded-md border border-primary/20 bg-primary/5 p-3 text-xs flex items-center gap-2">
          <div className="flex flex-col gap-0.5">
            <span className="font-bold text-primary">Kích hoạt tức thời (Real-time)</span>
            <span className="text-muted-foreground text-[11px]">
              Tự động kích hoạt phiếu chăm sóc ngay khi hệ thống ghi nhận sự kiện biến động.
            </span>
          </div>
        </div>
      ) : (activeMetric.source as string) === 'exam_grade' ? (
        /* GIAO DIỆN CHO CSDL ĐIỂM KIỂM TRA (GIỮ PHÉP TOÁN SO SÁNH & NGƯỠNG ĐIỂM, HIỂN THỊ BADGE REALTIME) */
        <div className="rounded-md border border-primary/20 bg-primary/5 p-3 text-xs flex items-center gap-2">
          <div className="flex flex-col gap-0.5">
            <span className="font-bold text-primary">Kích hoạt tức thời (Real-time)</span>
            <span className="text-muted-foreground text-[11px]">
              Tự động kích hoạt phiếu chăm sóc cho học viên ngay khi giáo viên nhập/lưu điểm bài kiểm tra.
            </span>
          </div>
        </div>
      ) : (activeMetric.source as string) === 'class_db' ? (
        /* GIAO DIỆN CHO CẢNH BÁO ĐẾM NGƯỢC CSDL LỚP HỌC (KHAI GIẢNG/BẾ GIẢNG) */
        <div className="rounded-md border border-primary/20 bg-primary/5 p-3 text-xs flex items-center gap-2">
          <div className="flex flex-col gap-0.5">
            <span className="font-bold text-primary">Rà soát định kỳ (04:00 sáng hằng ngày)</span>
            <span className="text-muted-foreground text-[11px]">
              Hệ thống sẽ tự động rà soát và kích hoạt phiếu chăm sóc vào 04:00 sáng hằng ngày khi đạt ngưỡng thiết lập.
            </span>
          </div>
        </div>
      ) : (
        /* GIAO DIỆN CHUẨN DÀNH CHO CÁC NGUỒN CÒN LẠI */
        <>
          <div
            className={
              windowType === 'custom_sessions'
                ? 'grid grid-cols-2 gap-3'
                : isScopeHidden
                ? 'grid grid-cols-1 gap-3'
                : 'grid grid-cols-2 gap-3'
            }
          >
            <FieldLabel label={windowLabel}>
              <InlineSelect
                value={windowType}
                options={activeMetric.windowOptions}
                onValueChange={(val: string) => setWindowType(val)}
                className="w-full h-8 text-xs"
              />
            </FieldLabel>

            {windowType === 'custom_sessions' ? (
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
            ) : !isScopeHidden ? (
              <FieldLabel label="Phạm vi tính toán">
                <InlineSelect
                  value={scope}
                  options={activeMetric.scopeOptions}
                  onValueChange={(val: string) => setScope(val)}
                  className="w-full h-8 text-xs"
                />
              </FieldLabel>
            ) : null}
          </div>

          {/* Ô NHẬP NẾU CHỌN MỐC SỐ BUỔI CỤ THỂ (VD: 1; 5; 10) */}
          {selectedMetricId === 'att_theo_so_buoi' && windowType === 'custom_session_numbers' && (
            <FieldLabel label="Danh sách mốc số thứ tự buổi học (VD: 1; 5; 10)">
              <Input
                value={customSessionNumbersText}
                onChange={(e) => setCustomSessionNumbersText?.(e.target.value)}
                placeholder="Nhập mốc số buổi, cách nhau bởi dấu ; (VD: 1; 5; 10; 15)"
                className="h-8 text-xs font-mono font-bold"
              />
            </FieldLabel>
          )}

          {/* BADGE THỜI ĐIỂM KÍCH HOẠT THAY ĐỔI ĐỘNG THEO CHU KỲ ĐÁNH GIÁ */}
          <div className="rounded-md border border-primary/20 bg-primary/5 p-3 text-xs flex items-center gap-2 mt-1">
            <div className="flex flex-col gap-0.5">
              <span className="font-bold text-primary">{badgeInfo.title}</span>
              <span className="text-muted-foreground text-[11px]">{badgeInfo.description}</span>
            </div>
          </div>
        </>
      )}
    </>
  )
}
