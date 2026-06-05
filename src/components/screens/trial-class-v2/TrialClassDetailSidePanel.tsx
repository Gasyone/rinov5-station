'use client'

import { useState } from 'react'
import { Clock, MessageSquare, SendHorizontal } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import type { TrialClass } from '@/mocks/trialClasses'

interface TrialClassDetailSidePanelProps {
  trial: TrialClass
  onUpdateTrial: (trialId: string, updater: (trial: TrialClass) => TrialClass) => void
}

export function TrialClassDetailSidePanel({
  trial,
  onUpdateTrial,
}: TrialClassDetailSidePanelProps) {
  const [activeTab, setActiveTab] = useState<'notes' | 'audit'>('notes')
  const [internalNote, setInternalNote] = useState('')

  const handleAddInternalNote = () => {
    if (!internalNote.trim()) return
    const now = new Date().toISOString().slice(0, 16).replace('T', ' ')
    const newNote = {
      text: internalNote.trim(),
      author: 'Người dùng hiện tại',
      timestamp: now,
    }
    onUpdateTrial(trial.id, (current) => ({
      ...current,
      internalNotes: [...(current.internalNotes ?? []), newNote],
    }))
    setInternalNote('')
  }

  return (
    <aside className="flex min-h-0 flex-col overflow-hidden">
      <Tabs
        value={activeTab}
        onValueChange={(value) => setActiveTab(value as 'notes' | 'audit')}
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
              {(trial.internalNotes ?? []).length > 0 ? (
                <div className="space-y-2 pt-1">
                  {(trial.internalNotes ?? []).map((note, index) => (
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
                <p className="pt-3 text-sm text-muted-foreground">Chưa có ghi chú.</p>
              )}
            </div>
            <div className="relative shrink-0 border-t pt-3">
              <Textarea
                value={internalNote}
                onChange={(event) => setInternalNote(event.target.value)}
                placeholder="Thêm ghi chú..."
                rows={2}
                className="min-h-16 resize-none pr-11 text-sm"
              />
              <Button 
                type="button"
                size="icon-sm" 
                variant="ghost" 
                className="absolute bottom-2 right-2 text-muted-foreground hover:text-foreground" 
                onClick={handleAddInternalNote} 
                disabled={!internalNote.trim()}
              >
                <SendHorizontal className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="audit" className="min-h-0 flex-1 overflow-y-auto">
          <div className="space-y-2 pr-1">
            {[...trial.auditLog].reverse().map((log, index) => (
              <div key={`${log.timestamp}-${index}`} className="flex items-start gap-3 text-sm">
                <div className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-primary" />
                <div className="min-w-0 flex-1">
                  <p className="font-medium">{log.action}</p>
                  {log.detail ? <p className="text-xs text-muted-foreground">{log.detail}</p> : null}
                  <p className="mt-0.5 text-[10px] text-muted-foreground">
                    {log.timestamp} &middot; {log.author}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </aside>
  )
}
