'use client'

import React, { useState } from 'react'
import { Check, Copy, MapPin } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { InlineSelect, type ToolbarSelectOption } from '@/components/controls'
import { TrialClassParentSearchSelect } from './TrialClassParentSearchSelect'
import type { TrialContactPerson } from './trialClassCreateTypes'
import { PoExplainSectionWrapper } from './explain'

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
  childSelectOptions: ToolbarSelectOption[]
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
  const [copiedPhone, setCopiedPhone] = useState<string | null>(null)
  const [isChangingParent, setIsChangingParent] = useState(false)

  const parentDisplayName =
    selectedContactObj?.name || leadInfo?.parentName || 'Chưa gán phụ huynh'
  const parentRoleDisplay =
    selectedContactObj?.role || leadInfo?.parentRole || 'Phụ huynh'
  const parentPhoneDisplay =
    selectedContactObj?.phone || leadInfo?.phone || '---'
  const parentAddressDisplay =
    selectedContactObj?.address || leadInfo?.address || ''

  const handleCopyPhone = async (phoneToCopy: string) => {
    if (!phoneToCopy || phoneToCopy === '---') return
    try {
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(phoneToCopy)
      } else {
        const textArea = document.createElement('textarea')
        textArea.value = phoneToCopy
        textArea.style.position = 'fixed'
        textArea.style.opacity = '0'
        document.body.appendChild(textArea)
        textArea.select()
        document.execCommand('copy')
        document.body.removeChild(textArea)
      }
      setCopiedPhone(phoneToCopy)
      setTimeout(() => setCopiedPhone(null), 2000)
      toast.success(`Đã sao chép số điện thoại: ${phoneToCopy}`)
    } catch {
      toast.error('Không thể sao chép số điện thoại')
    }
  }

  return (
    <div className={className || 'w-full space-y-2.5'}>
      {/* KHỐI 1: CHỌN CON & THÔNG TIN CON (GỘP CHUNG, CÁCH NHAU ĐƯỜNG LINE) */}
      <PoExplainSectionWrapper sectionId="child-select" side="left" align="start">
        <div id="po-sec-child-select" className="rounded-lg border border-border/70 bg-background p-2.5 space-y-2">
          {/* Dòng cảnh báo / nhắc nhở chọn con đưa lên trên cùng */}
          {!childId && selectedContactObj && (
            <p className="text-[11.5px] text-amber-600 dark:text-amber-400 font-medium">
              * Vui lòng chọn con để hoàn tất đặt lịch
            </p>
          )}

          {/* Dropdown chọn con */}
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
            placeholder={
              selectedContactObj
                ? 'Chọn con / học viên'
                : 'Vui lòng chọn phụ huynh trước'
            }
            disabled={!selectedContactObj}
            ariaLabel="Chọn con / học viên"
          />

          {/* Đường line phân cách nhẹ giữa dropdown chọn con và thông tin con */}
          <div className="border-t border-border/60" />

          {/* Thông tin con */}
          {selectedChild ? (
            <div className="space-y-1 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-foreground text-xs">{selectedChild.name}</span>
                <span className="text-muted-foreground text-xs">
                  {selectedChild.age ? `${selectedChild.age} tuổi` : ''}
                  {selectedChild.dob ? ` (${selectedChild.dob})` : ''}
                </span>
              </div>
              <div className="space-y-1 text-xs pt-0.5">
                <div className="flex items-start justify-between gap-1">
                  <span className="text-muted-foreground shrink-0">Trường:</span>
                  <span className="font-normal text-muted-foreground text-right truncate">
                    {selectedChild.currentSchool || 'Tiểu học Lương Định Của (Quận 3)'}
                  </span>
                </div>
                <div className="flex items-center justify-between gap-1">
                  <span className="text-muted-foreground shrink-0">Học lực:</span>
                  <span className="font-normal text-muted-foreground text-right">
                    {selectedChild.academicPerformance || 'Giỏi / Tốt nghiệp loại Ưu'}
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <div className="py-2 text-center text-xs text-muted-foreground/80">
              <p className="font-medium text-foreground/75">Chưa chọn học viên</p>
              <p className="text-[11px] text-muted-foreground/60 mt-0.5">
                Vui lòng chọn con ở danh sách phía trên
              </p>
            </div>
          )}
        </div>
      </PoExplainSectionWrapper>

      {/* KHỐI 2: THÔNG TIN PHỤ HUYNH */}
      <PoExplainSectionWrapper sectionId="contact-select" side="left" align="start">
        <div id="po-sec-contact-select" className="rounded-lg border border-border/70 bg-background p-2.5 space-y-1.5">
          <div className="flex items-center justify-between pb-1 border-b border-border/60">
            <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Phụ huynh
            </div>
            {selectedContactObj ? (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setIsChangingParent(!isChangingParent)}
                className="h-5 px-1.5 text-[11px] font-medium text-muted-foreground hover:text-foreground cursor-pointer"
              >
                {isChangingParent ? 'Đóng' : 'Đổi phụ huynh'}
              </Button>
            ) : (
              onAddNewContact && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={onAddNewContact}
                  className="h-5 px-1.5 text-xs font-medium text-primary hover:bg-primary/10 gap-1 cursor-pointer"
                >
                  <span>+ Thêm phụ huynh</span>
                </Button>
              )
            )}
          </div>

          {isChangingParent || !selectedContactObj ? (
            <div className="space-y-1.5 pt-0.5">
              <TrialClassParentSearchSelect
                value={contactId}
                onValueChange={(newId) => {
                  onContactChange(newId)
                  setIsChangingParent(false)
                }}
                contacts={contactsList}
                onAddNewContact={onAddNewContact}
                placeholder="Tìm kiếm tên hoặc SĐT phụ huynh..."
              />
            </div>
          ) : (
            <div className="space-y-1.5 pt-0.5">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-foreground text-xs">
                  {parentDisplayName}
                  <span className="text-muted-foreground font-normal ml-1">
                    ({parentRoleDisplay})
                  </span>
                </span>
                <div className="flex items-center gap-1">
                  <span className="text-muted-foreground font-normal text-xs tabular-nums">
                    {parentPhoneDisplay}
                  </span>
                  {parentPhoneDisplay && parentPhoneDisplay !== '---' && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                        handleCopyPhone(parentPhoneDisplay)
                      }}
                      className="p-0.5 rounded text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
                      title="Sao chép số điện thoại phụ huynh"
                    >
                      {copiedPhone === parentPhoneDisplay ? (
                        <Check className="h-3 w-3 text-emerald-600 dark:text-emerald-400" />
                      ) : (
                        <Copy className="h-3 w-3" />
                      )}
                    </button>
                  )}
                </div>
              </div>

              {parentAddressDisplay && (
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground/80">
                  <MapPin className="h-3 w-3 text-rose-500/80 shrink-0" />
                  <span className="truncate">{parentAddressDisplay}</span>
                </div>
              )}
            </div>
          )}
        </div>
      </PoExplainSectionWrapper>
    </div>
  )
}
