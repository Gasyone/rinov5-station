'use client'

import React from 'react'
import { Input } from '@/components/ui/input'
import { FieldLabel } from '@/components/shared'
import { InlineSelect } from '@/components/controls'

interface RoadmapRulesProps {
  milestoneType: 'theo_buoi' | 'theo_loai_buoi' | 'theo_moc_cap_do'
  setMilestoneType: (val: 'theo_buoi' | 'theo_loai_buoi' | 'theo_moc_cap_do') => void
  milestoneValue: string
  setMilestoneValue: (val: string) => void
}

export const CareConditionFormRoadmapRules: React.FC<RoadmapRulesProps> = ({
  milestoneType,
  setMilestoneType,
  milestoneValue,
  setMilestoneValue,
}) => {
  return (
    <>
      <FieldLabel label="Loại tiêu chí kích hoạt mốc">
        <InlineSelect
          value={milestoneType}
          options={[
            { value: 'theo_buoi', label: 'Theo số buổi học cụ thể (Ví dụ: Buổi 1, 5, 10)' },
            { value: 'theo_loai_buoi', label: 'Theo loại buổi học (Ví dụ: Buổi Project, Buổi Test)' },
            { value: 'theo_moc_cap_do', label: 'Theo mốc cấp độ / chặng' },
          ]}
          onValueChange={(val: string) => {
            const t = val as 'theo_buoi' | 'theo_loai_buoi' | 'theo_moc_cap_do'
            setMilestoneType(t)
            if (t === 'theo_buoi') setMilestoneValue('1; 5; 10')
            else if (t === 'theo_loai_buoi') setMilestoneValue('buoi_project')
            else setMilestoneValue('hoan_thanh_cap_do')
          }}
          className="w-full h-8 text-xs font-semibold"
        />
      </FieldLabel>

      <FieldLabel label="Giá trị kích hoạt mốc">
        {milestoneType === 'theo_buoi' ? (
          <Input
            value={milestoneValue}
            onChange={(e) => setMilestoneValue(e.target.value)}
            placeholder="Nhập số buổi, cách nhau bởi dấu ; (VD: 1; 5; 10)"
            className="h-8 text-xs font-mono font-bold"
          />
        ) : milestoneType === 'theo_loai_buoi' ? (
          <InlineSelect
            value={milestoneValue}
            options={[
              { value: 'buoi_1', label: 'Buổi Khai giảng / Buổi 1' },
              { value: 'buoi_prestudy', label: 'Buổi Prestudy chuẩn bị' },
              { value: 'buoi_project', label: 'Buổi Project / Mini Project' },
              { value: 'buoi_kiem_tra', label: 'Buổi Kiểm tra / Test' },
              { value: 'buoi_cuoi_khoa', label: 'Buổi Cuối khóa / Final Test' },
            ]}
            onValueChange={(val: string) => setMilestoneValue(val)}
            className="w-full h-8 text-xs"
          />
        ) : (
          <InlineSelect
            value={milestoneValue}
            options={[
              { value: 'hoan_thanh_cap_do', label: 'Hoàn thành Cấp độ / Chặng' },
              { value: 'chuyen_cap_do', label: 'Đủ điều kiện chuyển lớp / Chuyển cấp' },
            ]}
            onValueChange={(val: string) => setMilestoneValue(val)}
            className="w-full h-8 text-xs"
          />
        )}
      </FieldLabel>
    </>
  )
}
