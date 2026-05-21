'use client'

import Link from 'next/link'
import {
  CheckCircle,
  Clock,
  Copy,
  ExternalLink,
  FileText,
  MessageSquare,
  Phone,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { TableCell, TableRow } from '@/components/ui/table'
import { InlineSelect } from '@/components/controls'
import { StatusBadge } from '@/components/shared'
import {
  PROGRAM_LEVELS,
  SUB_LEVELS,
  type BookingTest,
} from '@/mocks/bookingTests'
import {
  canSelectPlacementLevel,
  getInitials,
  getMemberList,
  getStatusLabel,
  getSubjectLabel,
  maskPhone,
} from './bookingTestHelpers'
import {
  getBookingResultHref,
  hasBookingAssessmentResult,
} from './bookingTestAssessmentStorage'
import { SpeakingScore, LwrScore } from './BookingTestScoreDisplay'
import { FamilyPopover } from './FamilyPopover'

interface BookingTestTableRowProps {
  booking: BookingTest
  isSelected: boolean
  copiedKey: string
  onToggle: (id: string, checked: boolean) => void
  onRowClick: (id: string) => void
  onOpenAssessment: (id: string) => void
  onUpdateBooking: (id: string, updater: (booking: BookingTest) => BookingTest) => void
  onCopy: (text: string, key: string) => Promise<void>
  onCall: (phone?: string) => void
}

export function BookingTestTableRow({
  booking,
  isSelected,
  copiedKey,
  onToggle,
  onRowClick,
  onOpenAssessment,
  onUpdateBooking,
  onCopy,
  onCall,
}: BookingTestTableRowProps) {
  const hasResult = hasBookingAssessmentResult(booking)
  const resultHref = booking.resultLink?.startsWith('/app/')
    ? booking.resultLink
    : getBookingResultHref(booking.id)

  return (
    <TableRow className="group cursor-pointer border-b-0" onClick={() => onRowClick(booking.id)}>
      <TableCell
        className="sticky left-0 z-30 w-12 min-w-12 max-w-12 overflow-hidden bg-background text-center group-hover:bg-muted"
        onClick={(event) => event.stopPropagation()}
      >
        <Checkbox
          checked={isSelected}
          onCheckedChange={(checked) => onToggle(booking.id, Boolean(checked))}
        />
      </TableCell>
      <TableCell className="sticky left-12 z-20 w-72 min-w-72 max-w-72 overflow-hidden bg-background group-hover:bg-muted">
        <div className="relative z-10 max-w-full overflow-hidden pr-24">
          <div className="min-w-0 space-y-1">
            <p className="truncate font-semibold" title={booking.program}>
              {booking.program}
            </p>
            <div className="flex min-w-0 items-center gap-2">
              <span className="font-mono text-xs text-muted-foreground">{booking.id}</span>
              <Badge variant="outline" className="rounded-md text-[10px] font-bold">
                {getSubjectLabel(booking.subject)}
              </Badge>
            </div>
          </div>

          <div
            className="absolute right-2 top-1/2 hidden -translate-y-1/2 items-center gap-1 group-hover:flex"
            onClick={(event) => event.stopPropagation()}
          >
            <Button
              variant="ghost"
              size="icon-sm"
              title="Mở đánh giá"
              aria-label={`Mở đánh giá cho ${booking.childName}`}
              disabled={booking.subject !== 'english'}
              onClick={() => onOpenAssessment(booking.id)}
              className="bg-transparent shadow-none hover:bg-transparent"
            >
              <FileText className="h-4 w-4 text-primary" />
            </Button>
            <Button
              variant="ghost"
              size="icon-sm"
              title="Gọi điện"
              aria-label={`Gọi ${booking.familyName}`}
              onClick={() => onCall(booking.phone)}
              className="bg-transparent shadow-none hover:bg-transparent"
            >
              <Phone className="h-4 w-4 text-muted-foreground" />
            </Button>
          </div>
        </div>
      </TableCell>
      <TableCell className="min-w-72">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-muted text-sm font-bold text-foreground">
            {booking.childName.charAt(0)}
          </div>
          <div className="min-w-0">
            <p className="truncate font-semibold">{booking.childName}</p>
            <p className="font-mono text-xs text-muted-foreground">{booking.id}</p>
          </div>
        </div>
      </TableCell>
      <TableCell onClick={(event) => event.stopPropagation()}>
        <div className="space-y-1">
          <div className="flex items-center gap-1 text-[10px] font-bold uppercase text-muted-foreground">
            <span className="truncate">{booking.familyName}</span>
            {booking.familyMembers.length > 1 ? (
              <FamilyPopover booking={booking} copiedKey={copiedKey} onCopy={onCopy} onCall={onCall} />
            ) : null}
          </div>
          <div className="flex items-center gap-1.5 font-mono text-xs">
            <Phone className="h-3 w-3 text-muted-foreground" />
            {maskPhone(booking.phone)}
            <Button
              variant="ghost"
              size="icon-xs"
              title="Sao chép số điện thoại"
              aria-label={`Sao chép số điện thoại của ${booking.familyName}`}
              onClick={() => void onCopy(booking.phone, `phone-${booking.id}`)}
            >
              {copiedKey === `phone-${booking.id}` ? (
                <CheckCircle className="h-3 w-3 text-primary" />
              ) : (
                <Copy className="h-3 w-3" />
              )}
            </Button>
          </div>
        </div>
      </TableCell>
      <TableCell>
        <p className="max-w-48 truncate font-semibold" title={booking.school}>
          {booking.school}
        </p>
        <p className="text-xs text-muted-foreground">{booking.room || 'Sảnh tư vấn'}</p>
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-1.5 font-semibold">
          <Clock className="h-3.5 w-3.5 text-muted-foreground" />
          {booking.testTime.split(' ')[1] || '-'}
        </div>
        <p className="text-xs text-muted-foreground">{booking.testTime.split(' ')[0] || '-'}</p>
      </TableCell>
      <TableCell onClick={(event) => event.stopPropagation()}>
        <InlineSelect
          value={booking.testResult?.level ?? ''}
          disabled={!canSelectPlacementLevel(booking)}
          ariaLabel={`Trình độ đầu vào của ${booking.childName}`}
          options={[
            { value: '', label: 'Chưa đặt' },
            ...PROGRAM_LEVELS.map((level) => ({ value: level, label: level })),
          ]}
          onValueChange={(value) =>
            onUpdateBooking(booking.id, (current) => ({
              ...current,
              testResult: { ...current.testResult, level: value },
            }))
          }
        />
      </TableCell>
      <TableCell onClick={(event) => event.stopPropagation()}>
        <InlineSelect
          value={booking.testResult?.subLevel ?? ''}
          disabled={!canSelectPlacementLevel(booking)}
          ariaLabel={`Nhánh trình độ đầu vào của ${booking.childName}`}
          options={[
            { value: '', label: '-' },
            ...SUB_LEVELS.map((subLevel) => ({ value: subLevel, label: subLevel })),
          ]}
          onValueChange={(value) =>
            onUpdateBooking(booking.id, (current) => ({
              ...current,
              testResult: { ...current.testResult, subLevel: value },
            }))
          }
        />
      </TableCell>
      <TableCell>
        <SpeakingScore result={booking.testResult} compact />
      </TableCell>
      <TableCell>
        <LwrScore result={booking.testResult} compact />
      </TableCell>
      <TableCell>
        <StatusBadge status={booking.status} label={getStatusLabel(booking.status)} />
      </TableCell>
      <TableCell onClick={(event) => event.stopPropagation()}>
        {hasResult ? (
          <Button
            asChild
            variant="outline"
            size="sm"
            title="Mở trang kết quả"
            aria-label={`Mở trang kết quả của ${booking.childName}`}
            className="h-8 gap-1.5 px-2"
          >
            <Link href={resultHref} target="_blank" rel="noreferrer">
              <ExternalLink className="h-3.5 w-3.5" />
              Mở
            </Link>
          </Button>
        ) : (
          <span className="text-muted-foreground">-</span>
        )}
      </TableCell>
      <TableCell>
        <div className="flex items-center -space-x-2">
          {getMemberList(booking).slice(0, 3).map((member) => (
            <div
              key={member}
              title={member}
              className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-card bg-muted text-[10px] font-bold text-foreground"
            >
              {getInitials(member)}
            </div>
          ))}
          {getMemberList(booking).length > 3 ? (
            <div className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-card bg-muted text-[10px] font-bold text-muted-foreground">
              +{getMemberList(booking).length - 3}
            </div>
          ) : null}
        </div>
      </TableCell>
      <TableCell>
        <div className="flex max-w-44 items-center gap-2">
          <MessageSquare className="h-4 w-4 shrink-0 text-muted-foreground" />
          <p
            className="truncate text-xs italic text-muted-foreground"
            title={booking.notes?.at(-1)?.text ?? booking.msg}
          >
            {booking.notes?.at(-1)?.text ?? booking.msg ?? '-'}
          </p>
        </div>
      </TableCell>
    </TableRow>
  )
}
