'use client'

import React from 'react'
import { FieldLabel } from '@/components/shared'
import { InlineSelect } from '@/components/controls'
import { PROGRAM_CONFIG } from './bookingTestCreateTypes'

interface ContactPerson {
  id: string
  name: string
  phone: string
  children: Array<{ id: string; name: string; dob?: string }>
}

interface BookingTestCreateStudentFormProps {
  contactId: string
  onContactChange: (id: string) => void
  contactSelectOptions: Array<{ value: string; label: string }>
  selectedContactObj?: ContactPerson
  childId: string
  onChildChange: (id: string) => void
  childSelectOptions: Array<{ value: string; label: string }>
  customChildName: string
  onCustomChildNameChange: (val: string) => void
  customParentName: string
  onCustomParentNameChange: (val: string) => void
  customPhone: string
  onCustomPhoneChange: (val: string) => void
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
}

export function BookingTestCreateStudentForm({
  contactId,
  onContactChange,
  contactSelectOptions,
  selectedContactObj,
  childId,
  onChildChange,
  childSelectOptions,
  customChildName,
  onCustomChildNameChange,
  customParentName,
  onCustomParentNameChange,
  customPhone,
  onCustomPhoneChange,
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
}: BookingTestCreateStudentFormProps) {
  return (
    <div className="w-full md:w-[35%] shrink-0 space-y-2.5 bg-white dark:bg-zinc-950 rounded-xl p-3.5 shadow-2xs flex flex-col justify-between">
      <div className="space-y-2.5">
        <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground pb-0.5">
          Đối tượng & Chương trình
        </div>

        {/* Chọn Contact / Phụ huynh */}
        <FieldLabel label="Contact / Phụ huynh" required>
          <InlineSelect
            value={contactId}
            onValueChange={onContactChange}
            options={contactSelectOptions}
            ariaLabel="Chọn phụ huynh"
          />
        </FieldLabel>

        {/* Nếu chọn Contact có sẵn -> Chọn Con của họ */}
        {contactId !== 'custom' && selectedContactObj && (
          <FieldLabel label="Con / Học viên" required>
            <InlineSelect
              value={childId}
              onValueChange={onChildChange}
              options={childSelectOptions}
              ariaLabel="Chọn con / học viên"
            />
          </FieldLabel>
        )}

        {/* Nếu thêm con mới dưới Contact hiện tại */}
        {contactId !== 'custom' && childId === 'custom_child' && (
          <FieldLabel label="Tên con / Học viên mới" required>
            <input
              type="text"
              value={customChildName}
              onChange={(e) => onCustomChildNameChange(e.target.value)}
              placeholder="Nhập tên học viên..."
              className="w-full rounded-md border border-input bg-background px-3 py-1.5 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              required
            />
          </FieldLabel>
        )}

        {/* Nếu thêm Contact mới hoàn toàn */}
        {contactId === 'custom' && (
          <div className="space-y-2 rounded-md bg-muted/30 p-2.5 border">
            <div className="grid grid-cols-1 gap-2">
              <FieldLabel label="Tên phụ huynh" required>
                <input
                  type="text"
                  value={customParentName}
                  onChange={(e) => onCustomParentNameChange(e.target.value)}
                  placeholder="Nhập tên phụ huynh..."
                  className="w-full rounded-md border border-input bg-background px-3 py-1.5 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  required
                />
              </FieldLabel>
              <FieldLabel label="SĐT phụ huynh" required>
                <input
                  type="tel"
                  value={customPhone}
                  onChange={(e) => onCustomPhoneChange(e.target.value)}
                  placeholder="Nhập SĐT phụ huynh..."
                  className="w-full rounded-md border border-input bg-background px-3 py-1.5 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  required
                />
              </FieldLabel>
            </div>
            <FieldLabel label="Tên con / Học viên" required>
              <input
                type="text"
                value={customChildName}
                onChange={(e) => onCustomChildNameChange(e.target.value)}
                placeholder="Nhập tên con / học viên..."
                className="w-full rounded-md border border-input bg-background px-3 py-1.5 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                required
              />
            </FieldLabel>
          </div>
        )}

        {/* Trường / Cơ sở */}
        <FieldLabel label="Trường / Cơ sở" required>
          <InlineSelect
            value={school}
            onValueChange={onSchoolChange}
            options={schoolSelectOptions}
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
                }
              }}
              options={programOptions}
              ariaLabel="Chọn chương trình"
            />
          </FieldLabel>

          <FieldLabel label="Chọn level" required>
            <InlineSelect
              value={level}
              onValueChange={onLevelChange}
              options={levelOptions}
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
