'use client'

import { useState } from 'react'
import { InteractionLogsPanel } from '@/components/shared'
import { formatNoteTimestamp } from './classesDetailHelpers'
import type { ClassNote, ClassAuditLog } from './classesDetailTypes'

interface ClassesDetailInteractionPanelProps {
  notes: ClassNote[]
  logs: ClassAuditLog[]
  onAddNote: (text: string) => void
}

export function ClassesDetailInteractionPanel({
  notes,
  logs,
  onAddNote,
}: ClassesDetailInteractionPanelProps) {
  const [activeSideTab, setActiveSideTab] = useState<'notes' | 'logs'>('notes')
  const [noteInput, setNoteInput] = useState('')

  const handleAdd = () => {
    if (!noteInput.trim()) return
    onAddNote(noteInput.trim())
    setNoteInput('')
  }

  return (
    <aside className="flex min-h-0 flex-col overflow-hidden h-full">
      <InteractionLogsPanel
        notes={notes.map((n) => ({
          id: n.id,
          text: n.text,
          performer: n.author,
          timestamp: formatNoteTimestamp(n.timestamp),
        }))}
        logs={logs.map((l) => ({
          id: l.id,
          text: l.action,
          performer: l.operator,
          timestamp: l.timestamp,
        }))}
        noteInput={noteInput}
        onNoteInputChange={setNoteInput}
        onAddNote={handleAdd}
        notePlaceholder="Ghi chú tương tác..."
        activeTab={activeSideTab}
        onActiveTabChange={setActiveSideTab}
      />
    </aside>
  )
}
