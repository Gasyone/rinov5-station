'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { ExternalLink, FileText, Phone, UserRound } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { EmptyState, InfoField, PageHeader, Panel } from '@/components/shared'
import { getBookingTests, type BookingTest } from '@/mocks/bookingTests'
import { formatDateTime, getStatusLabel, getSubjectLabel, maskPhone } from './bookingTestHelpers'
import { readStoredBookingResult } from './bookingTestAssessmentStorage'
import { SpeakingScore, LwrScore } from './BookingTestScoreDisplay'

interface BookingTestResultPageProps {
  bookingId: string
}

export function BookingTestResultPage({ bookingId }: BookingTestResultPageProps) {
  const fallbackBooking = useMemo(
    () => getBookingTests().find((booking) => booking.id === bookingId) ?? null,
    [bookingId]
  )
  const [booking] = useState<BookingTest | null>(
    () => readStoredBookingResult(bookingId) ?? fallbackBooking
  )

  if (!booking) {
    return (
      <div className="flex h-full min-h-0 flex-col bg-background px-4 py-3 lg:px-6">
        <EmptyState
          icon={<FileText className="h-7 w-7 text-muted-foreground" />}
          title="Không tìm thấy kết quả đánh giá"
          description="Lịch test này chưa có dữ liệu mock hoặc chưa được lưu trong phiên làm việc."
          className="h-full"
        />
      </div>
    )
  }

  const latestNote = booking.notes?.at(-1)?.text ?? booking.msg ?? '-'

  return (
    <div className="flex h-full min-h-0 flex-col bg-background">
      <PageHeader
        title={`Kết quả đánh giá - ${booking.childName}`}
        description={`${booking.program} · ${formatDateTime(booking.testTime)}`}
        code={booking.id}
        status={booking.status}
        statusLabel={getStatusLabel(booking.status)}
        showBackButton
        actions={
          <Button asChild variant="outline" size="sm">
            <Link href="/app/booking_test">
              <ExternalLink className="h-4 w-4" />
              Danh sách test
            </Link>
          </Button>
        }
      />

      <main className="min-h-0 flex-1 overflow-y-auto px-4 pb-6 lg:px-6">
        <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
          <section className="space-y-6">
            <Panel title="Tổng quan học viên" icon={<UserRound className="h-4 w-4" />}>
              <div className="grid gap-4 rounded-lg bg-muted/20 p-4 sm:grid-cols-2 lg:grid-cols-4">
                <InfoField label="Học viên" value={booking.childName} supporting={booking.id} />
                <InfoField label="Gia đình" value={booking.familyName} />
                <InfoField
                  label="Điện thoại"
                  value={maskPhone(booking.phone)}
                  supporting={booking.phone}
                />
                <InfoField label="Môn học" value={getSubjectLabel(booking.subject)} />
              </div>
            </Panel>

            <Panel title="Kết quả năng lực" icon={<FileText className="h-4 w-4" />}>
              <div className="grid gap-4 rounded-lg bg-muted/20 p-4 md:grid-cols-2">
                <div className="space-y-4">
                  <div className="grid gap-3 sm:grid-cols-2">
                    <InfoField label="Trình độ" value={booking.testResult?.level || 'Chưa chọn'} />
                    <InfoField label="Nhánh" value={booking.testResult?.subLevel || '-'} />
                  </div>
                  <InfoField
                    label="Lộ trình đề xuất"
                    value={booking.testResult?.path || 'Chưa có lộ trình'}
                  />
                </div>
                <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-1">
                  <SpeakingScore result={booking.testResult} />
                  <LwrScore result={booking.testResult} />
                </div>
              </div>
            </Panel>

            <Panel title="Nhận xét" icon={<FileText className="h-4 w-4" />}>
              <div className="rounded-lg bg-muted/20 p-4">
                <p className="text-sm leading-6">{latestNote}</p>
              </div>
            </Panel>
          </section>

          <aside className="space-y-6">
            <Panel title="Thông tin lịch test" icon={<FileText className="h-4 w-4" />}>
              <div className="space-y-4 rounded-lg bg-muted/20 p-4">
                <InfoField label="Cơ sở" value={booking.school} supporting={booking.room} />
                <InfoField label="Thời gian" value={formatDateTime(booking.testTime)} />
                <InfoField label="Giáo viên" value={booking.teacher || 'Chưa phân công'} />
                <InfoField label="Người phỏng vấn" value={booking.interviewer || '-'} />
              </div>
            </Panel>

            <Panel title="Liên hệ" icon={<Phone className="h-4 w-4" />}>
              <div className="space-y-2 rounded-lg bg-muted/20 p-4">
                {(booking.familyMembers.length
                  ? booking.familyMembers
                  : [{ name: booking.familyName, phone: booking.phone, isPrimary: true }]
                ).map((member) => (
                  <div key={`${member.name}-${member.phone}`} className="flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold">{member.name}</p>
                      <p className="font-mono text-xs text-muted-foreground">
                        {maskPhone(member.phone)}
                      </p>
                    </div>
                    {member.isPrimary ? (
                      <Badge variant="outline" className="rounded-md text-[10px]">
                        Chính
                      </Badge>
                    ) : null}
                  </div>
                ))}
              </div>
            </Panel>
          </aside>
        </div>
      </main>
    </div>
  )
}
