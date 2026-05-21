'use client'

import { MessageSquare } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import type { BookingTest } from '@/mocks/bookingTests'

interface BookingTestDetailNotesProps {
  booking: BookingTest
  detailNote: string
  onDetailNoteChange: (value: string) => void
  onAddNote: () => void
}

export function BookingTestDetailNotes({
  booking,
  detailNote,
  onDetailNoteChange,
  onAddNote,
}: BookingTestDetailNotesProps) {
  const notes = booking.notes ?? []

  return (
    <aside className="flex min-h-0 flex-col border-t border-border pt-4 lg:border-l lg:border-t-0 lg:pl-6 lg:pt-0">
      <h3 className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-muted-foreground">
        <MessageSquare className="h-4 w-4" />
        Ghi chú
      </h3>
      {notes.length > 0 ? (
        <div className="min-h-0 flex-1 overflow-y-auto pr-1 [scrollbar-width:thin] [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-border [&::-webkit-scrollbar-track]:bg-transparent">
          {notes.map((note, index) => (
            <div
              key={`${note.timestamp}-${index}`}
              className="border-b border-border/50 py-3 first:pt-0 last:border-b-0"
            >
              <div className="flex items-center justify-between gap-3 text-xs">
                <span className="font-semibold text-foreground">{note.author}</span>
                <span className="font-mono text-muted-foreground">{note.timestamp}</span>
              </div>
              <p className="mt-1 text-sm text-muted-foreground">{note.text}</p>
            </div>
          ))}
        </div>
      ) : (
        <p className="min-h-0 flex-1 text-sm text-muted-foreground">
          {booking.msg || 'Chưa có ghi chú.'}
        </p>
      )}
      <div className="mt-3 flex shrink-0 gap-2">
        <Textarea
          value={detailNote}
          onChange={(event) => onDetailNoteChange(event.target.value)}
          placeholder="Thêm ghi chú..."
          rows={2}
        />
        <Button className="self-end" disabled={!detailNote.trim()} onClick={onAddNote}>
          Thêm
        </Button>
      </div>
    </aside>
  )
}
