'use client'

import { CheckCircle, Copy, Phone, Users } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import type { BookingTest } from '@/mocks/bookingTests'
import { maskPhone } from './bookingTestHelpers'

interface FamilyPopoverProps {
  booking: BookingTest
  copiedKey: string
  onCopy: (text: string, key: string) => Promise<void>
  onCall: (phone?: string) => void
}

export function FamilyPopover({ booking, copiedKey, onCopy, onCall }: FamilyPopoverProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon-xs"
          title="Liên hệ gia đình"
          aria-label={`Liên hệ gia đình của ${booking.familyName}`}
        >
          <Users className="h-3.5 w-3.5 text-primary" />
        </Button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-72 p-3">
        <p className="mb-2 text-xs font-bold uppercase tracking-wide text-muted-foreground">
          Liên hệ gia đình
        </p>
        <div className="space-y-2">
          {booking.familyMembers.map((member) => {
            const key = `family-${booking.id}-${member.phone}`
            return (
              <div
                key={member.phone}
                className="flex items-center justify-between gap-2 rounded-md p-2 transition-colors hover:bg-muted/50"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold">{member.name}</p>
                  <p className="font-mono text-xs text-muted-foreground">
                    {maskPhone(member.phone)}
                  </p>
                </div>
                <div className="flex shrink-0 items-center gap-1">
                  <Button
                    variant="ghost"
                    size="icon-xs"
                    aria-label={`Gọi ${member.name}`}
                    onClick={() => onCall(member.phone)}
                  >
                    <Phone className="h-3.5 w-3.5 text-muted-foreground" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon-xs"
                    aria-label={`Sao chép số điện thoại của ${member.name}`}
                    onClick={() => void onCopy(member.phone, key)}
                  >
                    {copiedKey === key ? (
                      <CheckCircle className="h-3.5 w-3.5 text-primary" />
                    ) : (
                      <Copy className="h-3.5 w-3.5" />
                    )}
                  </Button>
                </div>
              </div>
            )
          })}
        </div>
      </PopoverContent>
    </Popover>
  )
}
