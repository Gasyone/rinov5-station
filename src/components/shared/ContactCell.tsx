'use client'

import { useState } from 'react'
import { Copy, Check, Phone, Mail, Users } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { cn } from '@/lib/utils'
import { maskPhone } from '@/lib/format'
import { useCallStore } from '@/stores/useCallStore'

export interface AdditionalContact {
  name: string
  phone: string
  email?: string
}

interface ContactCellProps {
  /** Số điện thoại liên hệ chính */
  phone?: string | null
  /** Địa chỉ email liên hệ chính */
  email?: string | null
  /** Tên phụ huynh hoặc tên hiển thị phụ chính */
  name?: string | null
  /** ID thực thể (Học viên) dùng cho chức năng gọi điện */
  studentId?: string
  /** Tên thực thể (Học viên) dùng cho chức năng gọi điện */
  studentName?: string
  /** Tự động ẩn số điện thoại (ví dụ: 098***321) */
  masked?: boolean
  /** Danh sách liên hệ bổ sung (ví dụ: các thành viên khác trong gia đình) */
  additionalContacts?: AdditionalContact[]
  /** Hiển thị nút gọi điện thoại hay không */
  showCallButton?: boolean
  className?: string
}

/**
 * Component hiển thị thông tin liên hệ chuẩn hóa (SĐT & Email).
 * Hỗ trợ Copy nhanh, Click-to-call qua useCallStore, và hiển thị danh bạ gia đình/liên hệ phụ qua Popover.
 *
 * @see docs/DESIGN_SYSTEM.md §4.2 List Page Pattern
 */
export function ContactCell({
  phone,
  email,
  name,
  studentId,
  studentName,
  masked = false,
  additionalContacts = [],
  showCallButton = true,
  className,
}: ContactCellProps) {
  const [copiedKey, setCopiedKey] = useState<string | null>(null)
  const startCall = useCallStore((state) => state.startCall)

  const handleCopy = async (text: string, key: string, e: React.MouseEvent) => {
    e.stopPropagation()
    try {
      await navigator.clipboard.writeText(text)
      setCopiedKey(key)
      setTimeout(() => setCopiedKey(null), 1500)
    } catch (err) {
      console.error('Failed to copy text: ', err)
    }
  }

  const handleCall = (phoneNumber: string, contactName?: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation()
    startCall({
      studentId: studentId ?? 'unknown',
      studentName: studentName ?? name ?? 'Khách hàng',
      parentPhone: phoneNumber,
      parentName: contactName ?? name ?? studentName ?? 'Phụ huynh',
    })
  }

  const hasAdditional = additionalContacts && additionalContacts.length > 0

  if (!phone && !email && !name && !hasAdditional) {
    return <span className="text-sm text-muted-foreground italic">-</span>
  }

  return (
    <div className={cn('group/contact relative flex flex-col gap-0.5 min-w-0 text-left', className)}>
      {/* Tên liên hệ chính hoặc nhãn phụ */}
      {name && (
        <div className="flex items-center gap-1">
          <p className="truncate text-xs font-semibold text-muted-foreground" title={name}>
            {name}
          </p>

          {/* Nút hiển thị danh bạ phụ huynh/gia đình nếu có nhiều hơn 1 liên hệ */}
          {hasAdditional && (
            <Popover>
              <PopoverTrigger asChild onClick={(e) => e.stopPropagation()}>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-xs"
                  title="Liên hệ gia đình"
                  className="h-4 w-4 p-0 shrink-0 text-primary hover:bg-muted"
                >
                  <Users className="h-3 w-3" />
                </Button>
              </PopoverTrigger>
              <PopoverContent align="start" className="w-72 p-3 z-50 bg-popover text-popover-foreground shadow-lg border" onClick={(e) => e.stopPropagation()}>
                <p className="mb-2 text-xs font-bold uppercase tracking-wide text-muted-foreground">
                  Liên hệ gia đình
                </p>
                <div className="space-y-2">
                  {additionalContacts.map((member) => {
                    const key = `family-${studentId}-${member.phone}`
                    return (
                      <div
                        key={member.phone}
                        className="flex items-center justify-between gap-2 rounded-md p-1.5 transition-colors hover:bg-muted/50"
                      >
                        <div className="min-w-0">
                          <p className="truncate text-sm font-semibold">{member.name}</p>
                          <p className="font-mono text-xs text-muted-foreground">
                            {masked ? maskPhone(member.phone) : member.phone}
                          </p>
                        </div>
                        <div className="flex shrink-0 items-center gap-1">
                          {showCallButton && (
                            <Button
                              variant="ghost"
                              size="icon-xs"
                              aria-label={`Gọi ${member.name}`}
                              onClick={(e) => handleCall(member.phone, member.name, e)}
                            >
                              <Phone className="h-3.5 w-3.5 text-muted-foreground" />
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="icon-xs"
                            aria-label={`Sao chép số điện thoại của ${member.name}`}
                            onClick={(e) => handleCopy(member.phone, key, e)}
                          >
                            {copiedKey === key ? (
                              <Check className="h-3.5 w-3.5 text-emerald-500" />
                            ) : (
                              <Copy className="h-3.5 w-3.5 text-muted-foreground" />
                            )}
                          </Button>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </PopoverContent>
            </Popover>
          )}
        </div>
      )}

      {/* Số điện thoại chính */}
      {phone && (
        <div className="flex items-center gap-1.5 font-mono text-xs text-foreground">
          <Phone className="h-3 w-3 text-muted-foreground shrink-0" />
          <span className="truncate">{masked ? maskPhone(phone) : phone}</span>

          {/* Action buttons cho phone */}
          <div className="flex items-center gap-0.5 ml-1.5 shrink-0">
            <Button
              type="button"
              variant="ghost"
              size="icon-xs"
              title="Sao chép số điện thoại"
              onClick={(e) => handleCopy(phone, 'phone-main', e)}
              className="h-4 w-4 p-0 shrink-0 text-muted-foreground hover:text-foreground"
            >
              {copiedKey === 'phone-main' ? (
                <Check className="h-2.5 w-2.5 text-emerald-500" />
              ) : (
                <Copy className="h-2.5 w-2.5" />
              )}
            </Button>
            {showCallButton && (
              <Button
                type="button"
                variant="ghost"
                size="icon-xs"
                title="Gọi điện"
                onClick={(e) => handleCall(phone, name ?? undefined, e)}
                className="h-4 w-4 p-0 text-emerald-600 hover:text-emerald-700 shrink-0"
              >
                <Phone className="h-2.5 w-2.5 fill-emerald-600/10" />
              </Button>
            )}
          </div>
        </div>
      )}

      {/* Email chính */}
      {email && (
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Mail className="h-3 w-3 text-muted-foreground shrink-0" />
          <span className="truncate" title={email}>{email}</span>

          {/* Action button cho email */}
          <div className="invisible opacity-0 group-hover/contact:visible group-hover/contact:opacity-100 flex items-center ml-1 transition-all duration-150">
            <Button
              type="button"
              variant="ghost"
              size="icon-xs"
              title="Sao chép email"
              onClick={(e) => handleCopy(email, 'email-main', e)}
              className="h-4 w-4 p-0 shrink-0"
            >
              {copiedKey === 'email-main' ? (
                <Check className="h-2.5 w-2.5 text-emerald-500" />
              ) : (
                <Copy className="h-2.5 w-2.5" />
              )}
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
