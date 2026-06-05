'use client'

import { useState } from 'react'
import { Clock, MessageSquare, SendHorizontal } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Textarea } from '@/components/ui/textarea'
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
  const [activeSideTab, setActiveSideTab] = useState<'notes' | 'audit'>('notes')
  const notes = booking.notes ?? []

  return (
    <aside className="flex min-h-0 flex-col overflow-hidden">
      <Tabs
        value={activeSideTab}
        onValueChange={(value) => setActiveSideTab(value as 'notes' | 'audit')}
        className="flex min-h-0 flex-1 flex-col"
      >
        <TabsList className="shrink-0">
          <TabsTrigger value="notes">
            <MessageSquare className="h-3.5 w-3.5" />
            Ghi chú
          </TabsTrigger>
          <TabsTrigger value="audit">
            <Clock className="h-3.5 w-3.5" />
            Lịch sử
          </TabsTrigger>
        </TabsList>

        <TabsContent value="notes" className="min-h-0 flex-1 overflow-hidden">
          <div className="flex h-full min-h-0 flex-col">
            <div className="min-h-0 flex-1 overflow-y-auto pb-3 pr-1">
              {notes.length > 0 ? (
                <div className="space-y-2 pt-1">
                  {notes.map((note, index) => (
                    <div key={`${note.timestamp}-${index}`} className="rounded-md bg-muted p-2.5">
                      <p className="text-sm">{note.text}</p>
                      <div className="mt-1 flex items-center justify-between text-[10px] text-muted-foreground">
                        <span className="text-xs font-semibold">{note.author}</span>
                        <span className="font-mono">{note.timestamp}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="pt-3 text-sm text-muted-foreground">
                  {booking.msg || 'Chưa có ghi chú.'}
                </p>
              )}
            </div>

            <div className="relative shrink-0 border-t pt-3">
              <Textarea
                value={detailNote}
                onChange={(event) => onDetailNoteChange(event.target.value)}
                placeholder="Thêm ghi chú..."
                rows={2}
                className="min-h-16 resize-none pr-11 text-sm"
              />
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                aria-label="Gửi ghi chú"
                className="absolute bottom-2 right-2"
                disabled={!detailNote.trim()}
                onClick={onAddNote}
              >
                <SendHorizontal className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="audit" className="min-h-0 flex-1 overflow-y-auto pr-1">
          {notes.length > 0 ? (
            <div className="space-y-2 pt-1">
              {notes.map((note, index) => (
                <div key={`${note.timestamp}-${index}-audit`} className="flex items-start gap-3 text-sm">
                  <div className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-primary" />
                  <div className="min-w-0 flex-1">
                    <p className="font-medium">Ghi chú</p>
                    <p className="text-xs text-muted-foreground">{note.text}</p>
                    <p className="mt-0.5 text-[10px] text-muted-foreground">
                      {note.timestamp} &middot; {note.author}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="py-6 text-center text-sm text-muted-foreground">
              Chưa có lịch sử thao tác.
            </p>
          )}
        </TabsContent>
      </Tabs>
    </aside>
  )
}
