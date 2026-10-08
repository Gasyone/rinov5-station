'use client'

import React from 'react'
import { MapPin } from 'lucide-react'
import { InlineSelect } from '@/components/controls'
import { cn } from '@/lib/utils'

export interface CenterInfoItem {
  name: string
  distance: number
  distanceStr: string
  address: string
}

interface BookingTestCreateProgramSectionProps {
  program: string
  onProgramChange: (newProgram: string) => void
  level: string
  onLevelChange: (newLevel: string) => void
  school: string
  onSchoolChange: (newSchool: string) => void
  programOptions: Array<{
    value: string
    label: React.ReactNode
    textValue?: string
    selectedLabel?: React.ReactNode
  }>
  levelOptions: Array<{
    value: string
    label: React.ReactNode
    textValue?: string
    selectedLabel?: React.ReactNode
  }>
  schoolSelectOptions: Array<{
    value: string
    textValue: string
    label: React.ReactNode
    selectedLabel?: React.ReactNode
  }>
  centerData: CenterInfoItem[]
  className?: string
}

export function BookingTestCreateProgramSection({
  program,
  onProgramChange,
  level,
  onLevelChange,
  school,
  onSchoolChange,
  programOptions,
  levelOptions,
  schoolSelectOptions,
  centerData,
  className,
}: BookingTestCreateProgramSectionProps) {
  const top3ClosestCenters = centerData.slice(0, 3)

  return (
    <div
      className={cn(
        'rounded-lg border border-border/70 bg-background p-2.5 space-y-2',
        className
      )}
    >
      {/* 3 Dropdown chọn Chương trình, Level, Cơ sở trên 1 hàng với text "Chọn:" ở trước */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
        <span className="text-xs font-medium text-muted-foreground shrink-0">
          Chọn:
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 flex-1">
          <InlineSelect
            value={program}
            onValueChange={onProgramChange}
            options={programOptions}
            placeholder="Chọn chương trình"
            ariaLabel="Chọn chương trình"
          />

          <InlineSelect
            value={level}
            onValueChange={onLevelChange}
            options={levelOptions}
            placeholder={program ? 'Level dự kiến' : 'Chọn chương trình trước'}
            disabled={!program || levelOptions.length === 0}
            ariaLabel="Chọn level"
          />

          <InlineSelect
            value={school}
            onValueChange={onSchoolChange}
            options={schoolSelectOptions}
            placeholder="Chọn trung tâm"
            ariaLabel="Chọn trung tâm"
          />
        </div>
      </div>

      {/* Liệt kê text link 3 cơ sở gần nhất (khoảng cách) để người dùng chọn nhanh */}
      <div className="flex flex-wrap items-center gap-1.5 text-xs pt-0.5">
        <span className="text-xs text-muted-foreground font-medium flex items-center gap-1 shrink-0">
          <MapPin className="h-3 w-3 text-primary" />
          <span>Gần Nhất:</span>
        </span>
        <div className="flex flex-wrap items-center gap-2">
          {top3ClosestCenters.map((item, idx) => {
            const isSelected = school === item.name
            return (
              <div key={item.name} className="flex items-center gap-2">
                {idx > 0 && <span className="text-muted-foreground/30 text-xs">•</span>}
                <button
                  type="button"
                  onClick={() => onSchoolChange(item.name)}
                  className={cn(
                    'text-[11.5px] transition-colors cursor-pointer text-left',
                    isSelected
                      ? 'text-primary font-bold underline underline-offset-4 decoration-primary decoration-2'
                      : 'text-primary/80 hover:text-primary hover:underline underline-offset-2'
                  )}
                  title={`${item.name} (${item.distanceStr}) - ${item.address}`}
                >
                  <span>{item.name}</span>{' '}
                  <span className="text-[10.5px] text-muted-foreground font-normal">
                    ({item.distanceStr})
                  </span>
                </button>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
