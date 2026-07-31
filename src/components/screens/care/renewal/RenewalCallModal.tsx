'use client'

import { useEffect, useState } from 'react'
import { Phone, PhoneOff, Check, X } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { getFamilyContacts, type StudentCareAlert } from '@/mocks/careAlerts'

interface RenewalCallModalProps {
  student: StudentCareAlert | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onCallOutcome: (outcome: StudentCareAlert['callConfirmation']) => void
}

export function RenewalCallModal({
  student,
  open,
  onOpenChange,
  onCallOutcome,
}: RenewalCallModalProps) {
  const [seconds, setSeconds] = useState(0)

  useEffect(() => {
    if (!open) return
    const timer = setInterval(() => {
      setSeconds((prev) => prev + 1)
    }, 1000)
    return () => clearInterval(timer)
  }, [open])

  if (!student) return null

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60).toString().padStart(2, '0')
    const s = (secs % 60).toString().padStart(2, '0')
    return `${m}:${s}`
  }

  // Mask phone number
  const contacts = getFamilyContacts(student.studentId, student.studentName)
  const primaryContact = contacts.find((c) => c.isPrimary) || contacts[0]
  const rawPhone = primaryContact?.phone || '0912345678'
  const maskedPhone = rawPhone.length >= 7 
    ? `${rawPhone.slice(0, 3)}****${rawPhone.slice(-3)}`
    : rawPhone

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-sm p-6 text-center flex flex-col items-center gap-4">
        <DialogHeader className="w-full">
          <DialogTitle className="text-center text-sm font-bold uppercase tracking-wider text-muted-foreground">
            Cuộc gọi hệ thống (Call Center)
          </DialogTitle>
        </DialogHeader>

        {/* Dialing Animation */}
        <div className="relative flex items-center justify-center h-20 w-20 rounded-full bg-emerald-50 dark:bg-emerald-950/30">
          <div className="absolute inset-0 rounded-full bg-emerald-400/20 animate-ping" />
          <Phone className="h-9 w-9 text-emerald-600 dark:text-emerald-400" />
        </div>

        <div className="space-y-1">
          <h3 className="font-bold text-lg text-foreground">{student.studentName}</h3>
          <p className="font-mono text-sm text-muted-foreground">{maskedPhone}</p>
          <p className="text-xs font-bold text-emerald-600 dark:text-emerald-400 animate-pulse mt-2">
            ĐANG KẾT NỐI... {formatTime(seconds)}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-2 w-full mt-4">
          <Button
            variant="outline"
            className="text-xs h-10 border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 font-bold"
            onClick={() => {
              onCallOutcome('KNM')
              onOpenChange(false)
            }}
          >
            <X className="h-4 w-4 mr-1.5 shrink-0" />
            Không nghe máy
          </Button>
          <Button
            variant="default"
            className="text-xs h-10 bg-emerald-600 hover:bg-emerald-700 text-white font-bold"
            onClick={() => {
              onCallOutcome('Đã gọi')
              onOpenChange(false)
            }}
          >
            <Check className="h-4 w-4 mr-1.5 shrink-0" />
            Đã kết nối
          </Button>
        </div>

        <Button
          variant="ghost"
          size="sm"
          className="text-[10px] text-muted-foreground hover:bg-muted font-bold mt-2"
          onClick={() => onOpenChange(false)}
        >
          <PhoneOff className="h-3.5 w-3.5 mr-1" />
          Hủy cuộc gọi
        </Button>
      </DialogContent>
    </Dialog>
  )
}
