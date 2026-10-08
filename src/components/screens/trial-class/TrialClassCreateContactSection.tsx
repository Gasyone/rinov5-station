'use client'

import React from 'react'
import { ExternalLink, MapPin, Plus } from 'lucide-react'
import { FieldLabel } from '@/components/shared'
import { Button } from '@/components/ui/button'
import { InlineSelect } from '@/components/controls'
import { TrialClassParentSearchSelect } from './TrialClassParentSearchSelect'
import type { TrialContactPerson } from './trialClassCreateTypes'

interface TrialClassCreateContactSectionProps {
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
    targetSubject?: string
  } | null
  contactId: string
  onContactChange: (id: string) => void
  contactsList?: TrialContactPerson[]
  selectedContactObj?: TrialContactPerson | null
  childId: string
  onChildChange: (id: string) => void
  childSelectOptions: Array<{ value: string; label: string }>
  onAddNewContact?: () => void
  onAddNewChild?: () => void
  className?: string
}

export function TrialClassCreateContactSection({
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
  className,
}: TrialClassCreateContactSectionProps) {
  const selectedChild = selectedContactObj?.children.find((c) => c.id === childId)

  const formatPhoneMask = (p?: string) => {
    if (!p) return '---'
    const clean = p.replace(/\s+/g, '')
    if (clean.length >= 7) {
      return `${clean.slice(0, 3)}****${clean.slice(-3)}`
    }
    return p
  }

  return (
    <div className={className || 'w-full space-y-2'}>
      <div className="rounded-lg border border-border/70 bg-background p-2.5 space-y-2">
        <div className="flex items-center justify-between pb-1 border-b">
          <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Contact & Học viên
          </span>
          {leadInfo && (
            <span className="text-xs font-semibold text-violet-600 dark:text-violet-400 bg-violet-500/10 px-1.5 py-0.5 rounded">
              Lead CRM
            </span>
          )}
        </div>

        {leadInfo ? (
          <div className="space-y-2 pt-0.5">
            {/* Khối Phụ huynh (Contact) - Phẳng, kèm vai trò trong ngoặc */}
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-foreground text-xs">
                  {leadInfo.parentName}
                  <span className="text-muted-foreground font-normal ml-1">
                    ({leadInfo.parentRole || 'Phụ huynh'})
                  </span>
                </span>
                <span className="text-muted-foreground font-medium text-xs tabular-nums">
                  {formatPhoneMask(leadInfo.phone)}
                </span>
              </div>
              {leadInfo.address && (
                <div className="flex items-center justify-between gap-1.5 text-xs text-muted-foreground/80">
                  <div className="flex items-center gap-1.5 min-w-0 pr-1">
                    <MapPin className="h-3 w-3 text-rose-500/80 shrink-0" />
                    <a
                      href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(leadInfo.address)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="leading-snug truncate hover:underline hover:text-foreground transition-colors cursor-pointer"
                      title={`Xem vị trí trên Google Maps: ${leadInfo.address}`}
                    >
                      {leadInfo.address}
                    </a>
                  </div>
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(leadInfo.address)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-0.5 text-primary hover:underline font-medium text-xs shrink-0 transition-colors cursor-pointer hover:text-primary/80 whitespace-nowrap"
                    title={`Mở bản đồ Google Maps cho: ${leadInfo.address}`}
                  >
                    <span>Xem bản đồ</span>
                    <ExternalLink className="h-2.5 w-2.5" />
                  </a>
                </div>
              )}
            </div>

            {/* Dải phân cách nhẹ */}
            <div className="border-t border-border/50" />

            {/* Khối Con / Bé - Phẳng, tinh gọn */}
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-bold text-foreground text-xs">{leadInfo.childName}</span>
                <span className="text-muted-foreground text-xs">
                  {leadInfo.age ? `${leadInfo.age} tuổi` : ''}
                  {leadInfo.dob ? ` (${leadInfo.dob})` : ''}
                </span>
              </div>
              <div className="space-y-1 text-xs">
                <div className="flex items-start justify-between gap-1">
                  <span className="text-muted-foreground shrink-0">Trường:</span>
                  <span className="font-medium text-foreground text-right truncate">
                    {leadInfo.currentSchool || 'Tiểu học Lương Định Của (Quận 3)'}
                  </span>
                </div>
                <div className="flex items-center justify-between gap-1">
                  <span className="text-muted-foreground shrink-0">Học lực / Quan tâm:</span>
                  <span className="font-semibold text-emerald-700 dark:text-emerald-400">
                    {leadInfo.academicPerformance || 'Quan tâm học thử'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <>
            {/* Chọn Contact / Phụ huynh (Searchable + Mở Modal tạo mới ở đầu) */}
            <FieldLabel label="Contact / Phụ huynh" required>
              <TrialClassParentSearchSelect
                value={contactId}
                onValueChange={onContactChange}
                contacts={contactsList}
                onAddNewContact={onAddNewContact}
                placeholder="Tìm kiếm tên hoặc SĐT phụ huynh..."
              />
            </FieldLabel>

            {selectedContactObj?.address && (
              <div className="flex items-center justify-between gap-1.5 text-xs text-muted-foreground/80 -mt-1 px-0.5">
                <div className="flex items-center gap-1.5 min-w-0 pr-1">
                  <MapPin className="h-3 w-3 text-rose-500/80 shrink-0" />
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(selectedContactObj.address)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="leading-snug truncate hover:underline hover:text-foreground transition-colors cursor-pointer"
                    title={`Xem vị trí trên Google Maps: ${selectedContactObj.address}`}
                  >
                    {selectedContactObj.address}
                  </a>
                </div>
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(selectedContactObj.address)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-0.5 text-primary hover:underline font-medium text-xs shrink-0 transition-colors cursor-pointer hover:text-primary/80 whitespace-nowrap"
                  title={`Mở bản đồ Google Maps cho: ${selectedContactObj.address}`}
                >
                  <span>Xem bản đồ</span>
                  <ExternalLink className="h-2.5 w-2.5" />
                </a>
              </div>
            )}

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
                    className="h-5 px-1.5 text-xs font-medium text-primary hover:bg-primary/10 gap-1 cursor-pointer"
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
                options={selectedContactObj ? childSelectOptions : [{ value: '', label: 'Vui lòng chọn phụ huynh trước' }]}
                placeholder={selectedContactObj ? 'Chọn con / học viên' : 'Vui lòng chọn phụ huynh trước'}
                disabled={!selectedContactObj}
                ariaLabel="Chọn con / học viên"
              />
              {selectedChild && (
                <div className="space-y-1 pt-1.5 text-xs">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">Tuổi / Ngày sinh:</span>
                    <span className="font-medium text-foreground">
                      {selectedChild.dob || 'Chưa cập nhật'}
                    </span>
                  </div>
                  {selectedChild.targetSubject && (
                    <div className="flex items-start justify-between gap-2 text-xs">
                      <span className="text-muted-foreground shrink-0">Quan tâm:</span>
                      <span className="font-medium text-emerald-700 dark:text-emerald-400 text-right truncate">
                        {selectedChild.targetSubject}
                      </span>
                    </div>
                  )}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
