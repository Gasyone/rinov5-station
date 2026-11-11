'use client'

import React from 'react'
import { Building2 } from 'lucide-react'
import { InlineSelect } from '@/components/controls'
import { CenterProfileHoverCard } from '@/components/shared'
import { cn } from '@/lib/utils'
import type { CenterInfoItem } from './trialClassConstants'
import { PoExplainSectionWrapper } from './explain'

interface TrialClassCreateProgramSectionProps {
  program: string
  onProgramChange: (newProgram: string) => void
  subject?: string
  onSubjectChange?: (newSubject: string) => void
  school: string
  onSchoolChange: (newSchool: string) => void
  programOptions: Array<{
    value: string
    label: React.ReactNode
    textValue?: string
    selectedLabel?: React.ReactNode
  }>
  subjectOptions?: Array<{
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

export function TrialClassCreateProgramSection({
  program,
  onProgramChange,
  school,
  onSchoolChange,
  programOptions,
  schoolSelectOptions,
  centerData,
  className,
}: TrialClassCreateProgramSectionProps) {
  const top3ClosestCenters = centerData.slice(0, 3)

  return (
    <div
      className={cn(
        'rounded-lg border border-border/70 bg-background p-2.5 space-y-2',
        className
      )}
    >
      {/* 2 Dropdown chọn Chương trình, Cơ sở trên 1 hàng */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
        <span className="text-xs font-medium text-muted-foreground shrink-0">
          Chọn:
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 flex-1">
          <PoExplainSectionWrapper sectionId="program-select" side="bottom" align="start">
            <InlineSelect
              value={program}
              onValueChange={onProgramChange}
              options={programOptions}
              placeholder="Chọn chương trình"
              ariaLabel="Chọn chương trình"
            />
          </PoExplainSectionWrapper>

          <PoExplainSectionWrapper sectionId="school-select" side="bottom" align="start">
            <InlineSelect
              value={school}
              onValueChange={onSchoolChange}
              options={schoolSelectOptions}
              placeholder="Chọn trung tâm"
              ariaLabel="Chọn trung tâm"
            />
          </PoExplainSectionWrapper>
        </div>
      </div>

      {/* Liệt kê các cơ sở đề xuất để người dùng chọn nhanh (tạm ẩn khoảng cách, hover xem profile cơ sở) */}
      <PoExplainSectionWrapper sectionId="nearest-centers" side="bottom" align="start">
        <div className="flex flex-wrap items-center gap-1.5 text-xs pt-0.5">
          <span className="text-xs text-muted-foreground font-medium flex items-center gap-1 shrink-0">
            <Building2 className="h-3 w-3 text-primary" />
            <span>Cơ sở đề xuất:</span>
          </span>
          <div className="flex flex-wrap items-center gap-2">
            {top3ClosestCenters.map((item, idx) => {
              const isSelected = school === item.name
              return (
                <div key={item.name} className="flex items-center gap-2">
                  {idx > 0 && <span className="text-muted-foreground/30 text-xs">•</span>}
                  <CenterProfileHoverCard centerName={item.name} side="bottom" align="start">
                    <button
                      type="button"
                      onClick={() => onSchoolChange(item.name)}
                      className={cn(
                        'text-[11.5px] transition-colors cursor-pointer text-left inline-flex items-center gap-1 group',
                        isSelected
                          ? 'text-primary font-bold underline underline-offset-4 decoration-primary decoration-2'
                          : 'text-primary/80 hover:text-primary hover:underline underline-offset-2'
                      )}
                    >
                      <span className="group-hover:text-primary transition-colors">{item.name}</span>
                    </button>
                  </CenterProfileHoverCard>
                </div>
              )
            })}
          </div>
        </div>
      </PoExplainSectionWrapper>
    </div>
  )
}
