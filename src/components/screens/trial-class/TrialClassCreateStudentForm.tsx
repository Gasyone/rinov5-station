'use client'

import React from 'react'
import { Plus } from 'lucide-react'
import { FieldLabel } from '@/components/shared'
import { Button } from '@/components/ui/button'
import { BranchSelect, InlineSelect, SYSTEM_BRANCHES } from '@/components/controls'
import { Textarea } from '@/components/ui/textarea'
import { maskPhone } from '@/lib/format'
import { cn } from '@/lib/utils'
import { PROGRAM_OPTIONS } from './trialClassConstants'
import { TrialClassParentSearchSelect } from './TrialClassParentSearchSelect'
import type { TrialContactPerson } from './trialClassCreateTypes'

interface TrialClassCreateStudentFormProps {
  leadInfo?: {
    parentName: string
    phone: string
    childName: string
    school?: string
    program?: string
    notes?: string
  } | null
  contactId: string
  onContactChange: (id: string) => void
  contactsList: TrialContactPerson[]
  selectedContactObj?: TrialContactPerson | null
  childId: string
  onChildChange: (id: string) => void
  childSelectOptions: Array<{ value: string; label: string }>
  onAddNewContact?: () => void
  onAddNewChild?: () => void
  school: string
  onSchoolChange: (val: string) => void
  branchOptions?: string[]
  program: string
  onProgramChange: (val: string) => void
  subject: string
  notes: string
  onNotesChange: (val: string) => void
  className?: string
}

export function TrialClassCreateStudentForm({
  leadInfo,
  contactId,
  onContactChange,
  contactsList = [],
  selectedContactObj,
  childId,
  onChildChange,
  childSelectOptions,
  onAddNewContact,
  onAddNewChild,
  school,
  onSchoolChange,
  branchOptions = SYSTEM_BRANCHES,
  program,
  onProgramChange,
  subject,
  notes,
  onNotesChange,
  className,
}: TrialClassCreateStudentFormProps) {
  const programOptions = React.useMemo(() => {
    return [
      { value: '', label: 'Chọn chương trình học' },
      ...PROGRAM_OPTIONS.map((p) => ({ value: p, label: p })),
    ]
  }, [])

  return (
    <div className={className || "w-full lg:w-[380px] xl:w-[420px] shrink-0 space-y-3 bg-card border rounded-xl p-4 shadow-2xs flex flex-col justify-between"}>
      <div className="space-y-3">
        <div className="flex items-center justify-between pb-1 border-b">
          <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Đối tượng & Chương trình
          </span>
          {selectedContactObj?.isFromLead && (
            <span className="text-xs font-semibold text-violet-600 dark:text-violet-400 bg-violet-500/10 px-1.5 py-0.5 rounded">
              Lead CRM
            </span>
          )}
        </div>

        {leadInfo ? (
          <>
            {/* Chế độ Lead từ Query params */}
            <FieldLabel label="Contact / Phụ huynh" required>
              <div className="w-full rounded-md border border-input bg-muted/40 px-3 py-2 text-xs font-medium text-foreground">
                <span className="font-semibold">{leadInfo.parentName}</span> — <span className="font-mono">{maskPhone(leadInfo.phone)}</span>
              </div>
            </FieldLabel>

            <FieldLabel label="Con / Học viên" required>
              <div className="w-full rounded-md border border-emerald-500/40 bg-emerald-50/50 dark:bg-emerald-950/20 px-3 py-2 text-xs font-semibold text-emerald-800 dark:text-emerald-300">
                {leadInfo.childName}
              </div>
            </FieldLabel>
          </>
        ) : (
          <>
            {/* Chọn Phụ huynh / Contact (Searchable + Mở Modal tạo mới) */}
            <FieldLabel label="Contact / Phụ huynh" required>
              <TrialClassParentSearchSelect
                value={contactId}
                onValueChange={onContactChange}
                contacts={contactsList}
                onAddNewContact={onAddNewContact}
              />
            </FieldLabel>

            {/* Chọn Con / Học viên (Luôn hiển thị, khóa khi chưa chọn Phụ huynh) */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-medium text-foreground">
                  Con / Học viên <span className="text-destructive">*</span>
                </label>
                {selectedContactObj && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={onAddNewChild}
                    className="h-6 px-2 text-xs font-medium text-primary hover:bg-primary/10 gap-1 cursor-pointer"
                  >
                    <Plus className="h-3 w-3" />
                    <span>Thêm con</span>
                  </Button>
                )}
              </div>
              <InlineSelect
                value={childId}
                disabled={!selectedContactObj}
                placeholder={selectedContactObj ? "Chọn con / học viên" : "Vui lòng chọn phụ huynh trước"}
                onValueChange={(val) => {
                  if (val === 'custom_child' || val === 'add_new_child') {
                    onAddNewChild?.()
                  } else {
                    onChildChange(val)
                  }
                }}
                options={selectedContactObj ? childSelectOptions : [{ value: '', label: 'Vui lòng chọn phụ huynh trước' }]}
                ariaLabel="Chọn con / học viên"
                className={cn(
                  "h-9 border-solid text-sm shadow-xs",
                  !selectedContactObj && "opacity-70 bg-muted/40 cursor-not-allowed"
                )}
              />
            </div>
          </>
        )}

        {/* Cơ sở học */}
        <FieldLabel label="Cơ sở mong muốn học" required>
          <BranchSelect
            value={school}
            onValueChange={onSchoolChange}
            branches={branchOptions}
            variant="inline"
            includeAll={false}
            placeholder="Chọn cơ sở mong muốn học"
            className="w-full h-9 border-solid text-sm shadow-xs"
          />
        </FieldLabel>

        {/* Chương trình học */}
        <FieldLabel label="Chọn chương trình" required>
          <InlineSelect
            value={program}
            onValueChange={onProgramChange}
            options={programOptions}
            ariaLabel="Chọn chương trình học"
            className="h-9 border-solid text-sm shadow-xs"
          />
        </FieldLabel>

        {/* Môn học hiển thị tự động theo chương trình */}
        <FieldLabel label="Môn học (Tự động theo chương trình)">
          <div className="w-full rounded-md border border-input bg-muted/40 px-3 py-2 text-xs font-medium text-muted-foreground">
            {subject || 'Chưa xác định'}
          </div>
        </FieldLabel>

        {/* Ghi chú */}
        <FieldLabel label="Ghi chú">
          <Textarea
            value={notes}
            onChange={(e) => onNotesChange(e.target.value)}
            placeholder="VD: Bé học thử lần 1, tính cách nhút nhát, phụ huynh muốn gửi giáo viên nữ phụ trách..."
            rows={3}
            className="text-xs resize-none placeholder:text-muted-foreground/60"
          />
        </FieldLabel>
      </div>
    </div>
  )
}
