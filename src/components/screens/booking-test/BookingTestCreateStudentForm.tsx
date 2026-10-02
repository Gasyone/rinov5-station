'use client'

import React from 'react'
import { MapPin, Plus } from 'lucide-react'
import { FieldLabel } from '@/components/shared'
import { Button } from '@/components/ui/button'
import { InlineSelect, type ToolbarSelectOption } from '@/components/controls'
import { PROGRAM_CONFIG } from './bookingTestCreateTypes'
import { ContactSearchableSelect, type ContactPerson } from './ContactSearchableSelect'

interface BookingTestCreateStudentFormProps {
  leadInfo?: {
    parentName: string
    parentRole?: string
    phone: string
    address?: string
    childName: string
    dob?: string
    age?: number | string
    currentSchool?: string
    academicPerformance?: string
  } | null
  contactId: string
  onContactChange: (id: string) => void
  contactsList?: ContactPerson[]
  selectedContactObj?: ContactPerson
  childId: string
  onChildChange: (id: string) => void
  childSelectOptions: ToolbarSelectOption[]
  onAddNewContact?: () => void
  onAddNewChild?: () => void
  school?: string
  onSchoolChange?: (val: string) => void
  schoolSelectOptions?: ToolbarSelectOption[]
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
  const selectedChild = selectedContactObj?.children.find((c) => c.id === childId)

  return (
    <div
      className={
        className ||
        'w-full lg:w-[280px] xl:w-[290px] shrink-0 space-y-2.5 lg:sticky lg:top-0 self-start'
      }
    >
      {/* SECTION 1: CONTACT VÀ HỌC VIÊN */}
      <div className="rounded-lg border border-border/70 bg-background p-2.5 space-y-2">
        <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground pb-1 border-b">
          Contact & Học viên
        </div>

        {leadInfo ? (
          <div className="space-y-2.5 pt-0.5">
            {/* Khối Phụ huynh (Contact) - Phẳng, kèm vai trò trong ngoặc */}
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-foreground text-xs">
                  {leadInfo.parentName}
                  <span className="text-muted-foreground font-normal ml-1">
                    ({leadInfo.parentRole || 'Mẹ'})
                  </span>
                </span>
                <span className="text-muted-foreground font-medium text-[11px] tabular-nums">{leadInfo.phone}</span>
              </div>
              {leadInfo.address && (
                <div className="flex items-start gap-1.5 text-[11px] text-muted-foreground/80">
                  <MapPin className="h-3 w-3 text-muted-foreground/60 shrink-0 mt-0.5" />
                  <span className="leading-snug truncate">{leadInfo.address}</span>
                </div>
              )}
            </div>

            {/* Dải phân cách nhẹ */}
            <div className="border-t border-border/50" />

            {/* Khối Con / Bé - Phẳng, tinh gọn, không nhãn học viên */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="font-bold text-foreground text-xs">{leadInfo.childName}</span>
                <span className="text-muted-foreground text-[11px]">
                  {leadInfo.age ? `${leadInfo.age} tuổi` : ''}
                  {leadInfo.dob ? ` (${leadInfo.dob})` : ''}
                </span>
              </div>
              <div className="space-y-1 text-[11px]">
                <div className="flex items-start justify-between gap-1">
                  <span className="text-muted-foreground shrink-0">Trường:</span>
                  <span className="font-medium text-foreground text-right truncate">
                    {leadInfo.currentSchool || 'Tiểu học Lương Định Của (Quận 3)'}
                  </span>
                </div>
                <div className="flex items-center justify-between gap-1">
                  <span className="text-muted-foreground shrink-0">Học lực:</span>
                  <span className="font-semibold text-emerald-700 dark:text-emerald-400">
                    {leadInfo.academicPerformance || 'Giỏi / Tốt nghiệp loại Ưu'}
                  </span>
                </div>
              </div>
            </div>
          </div>
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
            <div className="space-y-1">
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
                    className="h-5 px-1.5 text-[11px] font-medium text-primary hover:bg-primary/10 gap-1 cursor-pointer"
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
              {selectedChild && (
                <div className="space-y-1 pt-1.5 text-xs">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-muted-foreground">Tuổi / Ngày sinh:</span>
                    <span className="font-medium text-foreground">
                      {selectedChild.age ? `${selectedChild.age} tuổi` : ''}
                      {selectedChild.dob ? ` (${selectedChild.dob})` : ''}
                    </span>
                  </div>
                  <div className="flex items-start justify-between gap-2 text-[11px]">
                    <span className="text-muted-foreground shrink-0">Trường:</span>
                    <span className="font-medium text-foreground text-right truncate">
                      {selectedChild.currentSchool || 'Tiểu học Lương Định Của (Quận 3)'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between gap-2 text-[11px]">
                    <span className="text-muted-foreground shrink-0">Học lực:</span>
                    <span className="font-semibold text-emerald-700 dark:text-emerald-400">
                      {selectedChild.academicPerformance || 'Giỏi / Tốt nghiệp loại Ưu'}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </div>

      {/* SECTION 2: THÔNG TIN CHỌN TEST */}
      <div className="rounded-lg border border-border/70 bg-background p-2.5 space-y-2">
        <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground pb-1 border-b">
          Thông tin chọn test
        </div>

        {/* Chương trình & Level */}
        <div className="space-y-2">
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
            className="w-full rounded-md border border-input bg-background px-2.5 py-1.5 text-xs placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring min-h-[48px] resize-y"
          />
        </FieldLabel>
      </div>
    </div>
  )
}
