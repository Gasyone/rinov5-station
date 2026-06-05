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
          {members.map((member: import('@/mocks/trialClasses').TrialClassFamilyMember) => {
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
                      const cleanPhone = member.phone.replace(/\s+/g, '')
                      const callEvent = new CustomEvent('rinov5:desk-call', {
                        detail: { 
                          phone: cleanPhone, 
                          name: member.name, 
                          studentName: trial.studentName,
                          studentId: trial.id,
                          source: 'screen.trial-class' 
                        },
                        cancelable: true,
                      })
                      window.dispatchEvent(callEvent)
                    }}
                  >
                    <Phone className="h-3.5 w-3.5 text-emerald-600 hover:text-emerald-700" />
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
