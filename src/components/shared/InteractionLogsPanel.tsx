'use client'

import { useState } from 'react'
import { Clock, MessageSquare, SendHorizontal } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Textarea } from '@/components/ui/textarea'
import { cn } from '@/lib/utils'
import { AppAvatar } from './AppAvatar'

export interface InteractionLogsPanelItem {
  id: string
  text: string
  performer: string
  timestamp: string
}

export interface InteractionLogsPanelProps {
  notes: InteractionLogsPanelItem[]
  logs?: InteractionLogsPanelItem[]
  noteInput?: string
  onNoteInputChange?: (value: string) => void
  onAddNote?: () => void
  notesTitle?: string
  logsTitle?: string
  notePlaceholder?: string
  className?: string
  activeTab?: 'notes' | 'logs'
  onActiveTabChange?: (tab: 'notes' | 'logs') => void
  notesEmptyText?: string
  logsEmptyText?: string
  onlyShowNotes?: boolean
}


export function InteractionLogsPanel({
  notes,
  logs,
  noteInput,
  onNoteInputChange,
  onAddNote,
  notesTitle = 'Tương tác',
  logsTitle = 'Nhật ký',
  notePlaceholder = 'Ghi chú tương tác...',
  className,
  activeTab,
  onActiveTabChange,
  notesEmptyText = 'Chưa có ghi chú tương tác.',
  logsEmptyText = 'Chưa có nhật ký hoạt động.',
  onlyShowNotes = false,
}: InteractionLogsPanelProps) {
  const [localActiveTab, setLocalActiveTab] = useState<'notes' | 'logs'>('notes')

  const currentTab = activeTab ?? localActiveTab
  const setCurrentTab = (tab: 'notes' | 'logs') => {
    if (onActiveTabChange) {
      onActiveTabChange(tab)
    } else {
      setLocalActiveTab(tab)
    }
  }

  const renderList = (items: InteractionLogsPanelItem[], emptyText: string) => {
    if (items.length === 0) {
      return (
        <p className="pt-3 text-xs text-muted-foreground italic">
          {emptyText}
        </p>
      )
    }

    return (
      <div className="space-y-4 pt-1">
        {items.map((item, index) => (
          <div key={item.id || `${item.timestamp}-${index}`} className="group relative text-xs">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {/* User profile avatar component */}
                <AppAvatar
                  name={item.performer}
                  size="sm"
                  userId={item.performer}
                  userType="staff"
                  className="size-7"
                />
                <span className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                  {item.performer}
                </span>
              </div>
              <span className="text-[10px] text-muted-foreground font-mono">
                {item.timestamp}
              </span>
            </div>
            <p className="text-xs text-foreground leading-relaxed mt-1.5 pl-0">
              {item.text}
            </p>
          </div>
        ))}
      </div>
    )
  }

  const showNotesInput = onAddNote !== undefined && noteInput !== undefined && onNoteInputChange !== undefined

  if (onlyShowNotes) {
    return (
      <div className={cn("flex min-h-0 flex-1 flex-col overflow-hidden", className)}>
        <div className="flex h-full min-h-0 flex-col justify-between">
          <div className="min-h-0 flex-1 overflow-y-auto pr-1">
            {renderList(notes, notesEmptyText)}
          </div>
 
          {/* Note Input Textarea */}
          {showNotesInput && (
            <div className="relative shrink-0 border-none pt-3 mt-3 bg-transparent">
              <Textarea
                value={noteInput}
                onChange={(e) => onNoteInputChange(e.target.value)}
                placeholder={notePlaceholder}
                rows={2}
                className="min-h-16 resize-none pr-11 text-xs rounded-xl shadow-xs border-muted focus-visible:ring-primary"
              />
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                className="absolute bottom-2 right-2 rounded-lg"
                disabled={!noteInput.trim()}
                onClick={onAddNote}
              >
                <SendHorizontal className="h-4 w-4 text-primary" />
              </Button>
            </div>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className={cn("flex min-h-0 flex-1 flex-col overflow-hidden", className)}>
      <Tabs
        value={currentTab}
        onValueChange={(val) => setCurrentTab(val as 'notes' | 'logs')}
        className="flex min-h-0 flex-1 flex-col"
      >
        <TabsList variant="line" className="shrink-0 w-full border-b border-border p-0 gap-6 h-9 flex justify-start bg-transparent">
          <TabsTrigger
            value="notes"
            className="rounded-none border-none bg-transparent data-[state=active]:bg-transparent px-1 font-semibold text-xs h-9 py-0 flex items-center gap-1.5 focus:outline-none focus-visible:ring-0 shadow-none"
          >
            <MessageSquare className="h-3.5 w-3.5" />
            {notesTitle} ({notes.length})
          </TabsTrigger>
          {logs && (
            <TabsTrigger
              value="logs"
              className="rounded-none border-none bg-transparent data-[state=active]:bg-transparent px-1 font-semibold text-xs h-9 py-0 flex items-center gap-1.5 focus:outline-none focus-visible:ring-0 shadow-none"
            >
              <Clock className="h-3.5 w-3.5" />
              {logsTitle} ({logs.length})
            </TabsTrigger>
          )}
        </TabsList>

        {/* Tab Content: Interaction Notes */}
        <TabsContent value="notes" className="min-h-0 flex-1 flex flex-col overflow-hidden m-0 pt-2 focus-visible:outline-none">
          <div className="flex h-full min-h-0 flex-col gap-2">
            {/* Note Input Textarea at TOP (ngay dưới tab tương tác) */}
            {showNotesInput && (
              <div className="relative shrink-0 border-b border-border/60 pb-3 pt-1 bg-transparent">
                <Textarea
                  value={noteInput}
                  onChange={(e) => onNoteInputChange(e.target.value)}
                  placeholder={notePlaceholder}
                  rows={2}
                  className="min-h-16 resize-none pr-11 text-xs rounded-xl shadow-xs border-muted focus-visible:ring-primary"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  className="absolute bottom-5 right-2 rounded-lg"
                  disabled={!noteInput.trim()}
                  onClick={onAddNote}
                >
                  <SendHorizontal className="h-4 w-4 text-primary" />
                </Button>
              </div>
            )}

            {/* Scrollable list of interaction notes below */}
            <div className="min-h-0 flex-1 overflow-y-auto pr-1">
              {renderList(notes, notesEmptyText)}
            </div>
          </div>
        </TabsContent>
 
        {/* Tab Content: Logs */}
        {logs && (
          <TabsContent value="logs" className="min-h-0 flex-1 overflow-y-auto m-0 pt-3 pr-1 focus-visible:outline-none">
            {renderList(logs, logsEmptyText)}
          </TabsContent>
        )}
      </Tabs>
    </div>
  )
}
