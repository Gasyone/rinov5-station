'use client'

import React from 'react'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { FieldLabel } from '@/components/shared'
import { InlineSelect } from '@/components/controls'
import {
  ConditionNature,
  PrimaryStaffRole,
  ConditionPriority,
} from './careConditionsTypes'

interface BasicFieldsProps {
  code: string
  setCode: (val: string) => void
  name: string
  setName: (val: string) => void
  priority: ConditionPriority
  setPriority: (val: ConditionPriority) => void
  nature: ConditionNature
  setNature: (val: ConditionNature) => void
  assignedRoles: PrimaryStaffRole[]
  setAssignedRoles: (roles: PrimaryStaffRole[]) => void
  completionPolicy: 'any_role' | 'all_roles'
  setCompletionPolicy: (policy: 'any_role' | 'all_roles') => void
  focusContentText: string
  setFocusContentText: (val: string) => void
  errors: Record<string, string>
}

// Chỉ hỗ trợ 2 vai trò: CS và GV
const ALL_ROLES: { id: PrimaryStaffRole; label: string; subLabel: string }[] = [
  { id: 'CS', label: 'CS', subLabel: 'Chuyên viên CS' },
  { id: 'GV', label: 'GV', subLabel: 'Giáo viên Chủ nhiệm' },
]

export const CareConditionFormBasicFields: React.FC<BasicFieldsProps> = ({
  code,
  setCode,
  name,
  setName,
  priority,
  setPriority,
  nature,
  setNature,
  assignedRoles,
  setAssignedRoles,
  completionPolicy,
  setCompletionPolicy,
  focusContentText,
  setFocusContentText,
  errors,
}) => {
  const toggleRole = (roleId: PrimaryStaffRole) => {
    if (assignedRoles.includes(roleId)) {
      if (assignedRoles.length > 1) {
        setAssignedRoles(assignedRoles.filter((r) => r !== roleId))
      }
    } else {
      setAssignedRoles([...assignedRoles, roleId])
    }
  }

  return (
    <div className="space-y-3.5">
      <div className="grid grid-cols-2 gap-3">
        <FieldLabel label="Mã điều kiện" required error={errors.code}>
          <Input
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="VD: ĐB-01..."
            className="h-8 text-xs font-mono font-bold uppercase"
          />
        </FieldLabel>

        <FieldLabel label="Mức ưu tiên">
          <InlineSelect
            value={priority || 'high'}
            options={[
              { value: 'urgent', label: '🔴 Khẩn cấp' },
              { value: 'high', label: '🟠 Cao' },
              { value: 'medium', label: '🔵 Trung bình' },
              { value: 'low', label: '⚪ Thường' },
            ]}
            onValueChange={(val: string) => setPriority(val as ConditionPriority)}
            className="w-full h-8 text-xs"
          />
        </FieldLabel>
      </div>

      <FieldLabel label="Tên sự kiện phát sinh" required error={errors.name}>
        <Input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="VD: Học viên nghỉ không phép từ 2 buổi trong 8 buổi gần nhất..."
          className="h-8 text-xs"
        />
      </FieldLabel>

      <FieldLabel label="Tính chất chăm sóc">
        <InlineSelect
          value={nature || 'dac_biet'}
          options={[
            { value: 'dac_biet', label: 'Chăm sóc đặc biệt' },
            { value: 'tai_phi', label: 'Tái phí' },
            { value: 'dinh_ky', label: 'Định kỳ' },
            { value: 'theo_hanh_trinh', label: 'Theo hành trình' },
            { value: 'theo_moc', label: 'Theo mốc học tập' },
            { value: 'theo_yeu_cau', label: 'Theo yêu cầu' },
          ]}
          onValueChange={(val: string) => setNature(val as ConditionNature)}
          className="w-full h-8 text-xs"
        />
      </FieldLabel>

      {/* VAI TRÒ PHỤ TRÁCH CHĂM SÓC (CHỈ GỒM CS VÀ GV) */}
      <FieldLabel label="Các vai trò phụ trách chăm sóc" required error={errors.assignedRoles}>
        <div className="grid grid-cols-2 gap-3 pt-0.5">
          {ALL_ROLES.map((r) => {
            const isChecked = assignedRoles.includes(r.id)
            return (
              <button
                type="button"
                key={r.id}
                onClick={() => toggleRole(r.id)}
                className={`flex items-center gap-2.5 p-2.5 rounded-lg border text-xs cursor-pointer transition-all ${
                  isChecked
                    ? 'border-primary bg-primary/10 text-primary font-bold shadow-2xs'
                    : 'border-border/60 bg-card text-muted-foreground hover:bg-muted/40'
                }`}
              >
                <div
                  className={`h-4 w-4 rounded flex items-center justify-center border shrink-0 transition-colors ${
                    isChecked
                      ? 'bg-primary border-primary text-primary-foreground'
                      : 'border-input bg-background'
                  }`}
                >
                  {isChecked && (
                    <svg className="h-3 w-3 fill-current" viewBox="0 0 20 20">
                      <path d="M0 11l2-2 5 5L18 3l2 2L7 18z" />
                    </svg>
                  )}
                </div>
                <div className="flex flex-col text-left">
                  <span className="font-mono font-bold text-xs">{r.label}</span>
                  <span className="text-[10.5px] font-normal text-muted-foreground">{r.subLabel}</span>
                </div>
              </button>
            )
          })}
        </div>
      </FieldLabel>

      {/* QUY TẮC XÁC ĐỊNH HOÀN THÀNH PHIẾU (KHI CHỌN CẢ CS VÀ GV) */}
      {assignedRoles.length > 1 && (
        <FieldLabel label="Quy tắc hoàn thành phiếu">
          <div className="grid grid-cols-2 gap-2.5 pt-0.5">
            <button
              type="button"
              onClick={() => setCompletionPolicy('any_role')}
              className={`flex items-center gap-2 p-2 rounded-lg border text-xs cursor-pointer transition-all ${
                completionPolicy === 'any_role'
                  ? 'border-primary bg-primary/10 text-primary font-bold shadow-2xs'
                  : 'border-border/60 bg-card text-muted-foreground hover:bg-muted/40'
              }`}
            >
              <span className={`h-2 w-2 rounded-full shrink-0 ${completionPolicy === 'any_role' ? 'bg-primary' : 'bg-muted-foreground/40'}`} />
              <span>Chỉ cần 1 vai trò (OR)</span>
            </button>

            <button
              type="button"
              onClick={() => setCompletionPolicy('all_roles')}
              className={`flex items-center gap-2 p-2 rounded-lg border text-xs cursor-pointer transition-all ${
                completionPolicy === 'all_roles'
                  ? 'border-primary bg-primary/10 text-primary font-bold shadow-2xs'
                  : 'border-border/60 bg-card text-muted-foreground hover:bg-muted/40'
              }`}
            >
              <span className={`h-2 w-2 rounded-full shrink-0 ${completionPolicy === 'all_roles' ? 'bg-primary' : 'bg-muted-foreground/40'}`} />
              <span>Tất cả vai trò (AND)</span>
            </button>
          </div>
        </FieldLabel>
      )}

      <FieldLabel label="Nội dung chăm sóc trọng tâm">
        <Textarea
          value={focusContentText}
          onChange={(e) => setFocusContentText(e.target.value)}
          placeholder="Xác minh nguyên nhân nghỉ học...&#10;Đánh giá khả năng tham gia...&#10;Thống nhất phương án học bù..."
          className="text-xs min-h-[110px]"
        />
      </FieldLabel>
    </div>
  )
}
