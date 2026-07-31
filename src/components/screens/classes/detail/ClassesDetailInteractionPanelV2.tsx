'use client'

import { ClassesDetailOverview } from './ClassesDetailOverview'
import type { ClassNote, ClassAuditLog, RosterStudent } from './classesDetailTypes'
import type { ClassRecord } from '@/mocks/classRecords'
import type { ClassesStatusChangeRequest } from './ClassesDetailHeader'

interface ClassesDetailInteractionPanelV2Props {
  cls: ClassRecord
  notes: ClassNote[]
  logs: ClassAuditLog[]
  roster: RosterStudent[]
  onAddNote: (text: string) => void
  isEditing?: boolean
  editFormState?: ClassRecord | null
  onEditStateChange?: (val: ClassRecord) => void
  validationErrors?: Record<string, string>
  onStartEdit?: () => void
  onRescheduleClick?: () => void
  onCancelEdit?: () => void
  onSave?: () => void
  onRequestStatusChange?: (request: ClassesStatusChangeRequest) => void
  onAddStudent?: () => void
  onEditRoadmap?: () => void
}

export function ClassesDetailInteractionPanelV2({
  cls,
  notes: _notes,
  logs: _logs,
  roster: _roster,
  onAddNote: _onAddNote,
  isEditing,
  editFormState,
  onEditStateChange,
  validationErrors,
  onStartEdit,
  onRescheduleClick,
  onCancelEdit,
  onSave,
  onRequestStatusChange,
  onEditRoadmap,
}: ClassesDetailInteractionPanelV2Props) {
  return (
    <aside className="flex min-h-0 flex-col overflow-hidden h-full bg-transparent">
      <div className="min-h-0 flex-1 overflow-y-auto m-0 pt-0 focus-visible:outline-none pr-1">
        <ClassesDetailOverview
          cls={editFormState || cls}
          isEditing={isEditing}
          editFormState={editFormState}
          onEditStateChange={onEditStateChange}
          validationErrors={validationErrors}
          onStartEdit={onStartEdit}
          onRescheduleClick={onRescheduleClick}
          onCancelEdit={onCancelEdit}
          onSave={onSave}
          onRequestStatusChange={onRequestStatusChange}
          onEditRoadmap={onEditRoadmap}
        />
      </div>
    </aside>
  )
}
