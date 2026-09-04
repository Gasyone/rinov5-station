'use client'

import React from 'react'
import { Plus } from 'lucide-react'
import { FieldLabel } from '@/components/shared'
import { Button } from '@/components/ui/button'
import { InlineSelect } from '@/components/controls'
import { PROGRAM_CONFIG } from './bookingTestCreateTypes'
import { ContactSearchableSelect, type ContactPerson } from './ContactSearchableSelect'

interface BookingTestCreateStudentFormProps {
  leadInfo?: {
    parentName: string
    phone: string
    childName: string
  } | null
  contactId: string
  onContactChange: (id: string) => void
  contactsList?: ContactPerson[]
  selectedContactObj?: ContactPerson
  childId: string
  onChildChange: (id: string) => void
  childSelectOptions: Array<{ value: string; label: string }>
  onAddNewContact?: () => void
  onAddNewChild?: () => void
  school: string
  onSchoolChange: (val: string) => void
  schoolSelectOptions: Array<{ value: string; label: string }>
  program: string
  onProgramChange: (val: string) => void
  programOptions: Array<{ value: string; label: string }>
  level: string
  onLevelChange: (val: string) => void
  levelOptions: Array<{ value: string; label: string }>
  notes: string
  onNotesChange: (val: string) => void
  className?: string
}

export function BookingTestCreateStudentForm({
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
  schoolSelectOptions,
  program,
  onProgramChange,
  programOptions,
  level,
  onLevelChange,
  levelOptions,
  notes,
  onNotesChange,
  className,
}: BookingTestCreateStudentFormProps) {
  return (
    <div
      className={
        className ||
        'w-full lg:w-[360px] xl:w-[380px] shrink-0 space-y-3 bg-card border rounded-xl p-4 shadow-2xs lg:sticky lg:top-0 self-start'
      }
    >
      <div className="space-y-3">
        <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground pb-1 border-b">
          Đối tượng & Chương trình
        </div>

        {leadInfo ? (
          <>
            {/* Chế độ Lead: Hiển thị thông tin Contact/Phụ huynh có sẵn */}
            <FieldLabel label="Contact / Phụ huynh" required>
              <div className="w-full rounded-md border border-input bg-muted/40 px-3 py-1.5 text-xs font-medium text-foreground">
                {leadInfo.parentName} - {leadInfo.phone}
              </div>
            </FieldLabel>

            {/* Chế độ Lead: Hiển thị thông tin Con/Học viên có sẵn */}
            <FieldLabel label="Con / Học viên" required>
              <div className="w-full rounded-md border border-input bg-emerald-50/50 dark:bg-emerald-950/20 px-3 py-1.5 text-xs font-semibold text-emerald-800 dark:text-emerald-300">
                {leadInfo.childName}
              </div>
            </FieldLabel>
          </>
        ) : (
          <>
            {/* Chọn Contact / Phụ huynh (Searchable + Mở Modal tạo mới ở đầu) */}
            <FieldLabel label="Contact / Phụ huynh" required>
              <ContactSearchableSelect
                value={contactId}
                onValueChange={onContactChange}
                contacts={contactsList}
                onAddNewContact={onAddNewContact}
                placeholder="Tìm kiếm tên hoặc SĐT phụ huynh..."
              />
            </FieldLabel>

            {/* Chọn Con / Học viên */}
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
                onValueChange={(val) => {
                  if (val === 'add_new_child') {
                    onAddNewChild?.()
                  } else {
                    onChildChange(val)
                  }
                }}
                options={childSelectOptions}
                placeholder={selectedContactObj ? 'Chọn con / học viên' : 'Vui lòng chọn phụ huynh trước'}
                disabled={!selectedContactObj}
                ariaLabel="Chọn con / học viên"
              />
            </div>
          </>
        )}

        {/* Trường / Cơ sở */}
        <FieldLabel label="Trường / Cơ sở" required>
          <InlineSelect
            value={school}
            onValueChange={onSchoolChange}
            options={schoolSelectOptions}
            placeholder="Chọn trường / cơ sở"
            ariaLabel="Chọn trường / cơ sở"
          />
        </FieldLabel>

        {/* Chương trình & Level */}
        <div className="space-y-2.5">
          <FieldLabel label="Chọn chương trình" required>
            <InlineSelect
              value={program}
              onValueChange={(val) => {
                onProgramChange(val)
                const cfg = PROGRAM_CONFIG[val]
                if (cfg && cfg.levels.length > 0) {
                  onLevelChange(cfg.levels[0])
                } else {
                  onLevelChange('')
                }
              }}
              options={programOptions}
              placeholder="Chọn chương trình"
              ariaLabel="Chọn chương trình"
            />
          </FieldLabel>

          <FieldLabel label="Chọn level">
            <InlineSelect
              value={level}
              onValueChange={onLevelChange}
              options={levelOptions}
              placeholder={program ? 'Chọn level' : 'Vui lòng chọn chương trình'}
              disabled={!program || levelOptions.length === 0}
              ariaLabel="Chọn level"
            />
          </FieldLabel>
        </div>

        {/* Ghi chú */}
        <FieldLabel label="Ghi chú">
          <textarea
            value={notes}
            onChange={(e) => onNotesChange(e.target.value)}
            placeholder="Nhập ghi chú chi tiết..."
            rows={2}
            className="w-full rounded-md border border-input bg-background px-3 py-1.5 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          />
        </FieldLabel>
      </div>
    </div>
  )
}
