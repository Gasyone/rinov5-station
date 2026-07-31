'use client'

import { InteractionLogsPanel } from '@/components/shared'
import type { BookingTest } from '@/mocks/bookingTests'

interface BookingTestDetailSidePanelProps {
  booking: BookingTest
  detailNote: string
  onDetailNoteChange: (value: string) => void
  onAddNote: () => void
}

export function BookingTestDetailSidePanel({
  booking,
  detailNote,
  onDetailNoteChange,
  onAddNote,
}: BookingTestDetailSidePanelProps) {
  const notes = booking.notes ?? []

  const mappedItems = notes.map((note, index) => ({
    id: `${note.timestamp}-${index}`,
    text: note.text,
    performer: note.author,
    timestamp: note.timestamp,
  }))

  return (
    <aside className="flex min-h-0 flex-col overflow-hidden">
      <InteractionLogsPanel
        notes={mappedItems}
        logs={mappedItems}
        noteInput={detailNote}
        onNoteInputChange={onDetailNoteChange}
        onAddNote={onAddNote}
        notesTitle="Ghi chú"
        logsTitle="Lịch sử"
        notePlaceholder="Thêm ghi chú..."
        notesEmptyText={booking.msg || 'Chưa có ghi chú.'}
        logsEmptyText="Chưa có lịch sử thao tác."
      />
    </aside>
  )
}
