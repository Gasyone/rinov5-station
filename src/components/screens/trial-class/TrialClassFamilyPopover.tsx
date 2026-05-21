'use client'

import { CheckCircle, Copy, Phone, Users } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import type { TrialClass } from '@/mocks/trialClasses'
import { getTrialFamilyMembers, maskPhone } from './trialClassHelpers'

interface TrialClassFamilyPopoverProps {
  trial: TrialClass
  copiedKey: string
  onCopy: (text: string, key: string) => void
}

export function TrialClassFamilyPopover({
  trial,
  copiedKey,
  onCopy,
}: TrialClassFamilyPopoverProps) {
  const members = getTrialFamilyMembers(trial)

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon-xs"
          title="Liên hệ phụ huynh"
          aria-label={`Liên hệ phụ huynh của ${trial.familyName}`}
          onClick={(event) => event.stopPropagation()}
        >
          <Users className="h-3.5 w-3.5 text-primary" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        align="start"
        className="w-72 p-3"
        onClick={(event) => event.stopPropagation()}
      >
        <p className="mb-2 text-xs font-bold uppercase tracking-wide text-muted-foreground">
          Liên hệ phụ huynh
        </p>
        <div className="space-y-2">
          {members.map((member) => {
            const key = `family-${trial.id}-${member.phone}`
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
                    onClick={(event) => {
                      event.stopPropagation()
                      window.location.href = `tel:${member.phone.replace(/\s+/g, '')}`
                    }}
                  >
                    <Phone className="h-3.5 w-3.5 text-muted-foreground" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon-xs"
                    aria-label={`Sao chép số điện thoại của ${member.name}`}
                    onClick={(event) => {
                      event.stopPropagation()
                      onCopy(member.phone, key)
                    }}
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
