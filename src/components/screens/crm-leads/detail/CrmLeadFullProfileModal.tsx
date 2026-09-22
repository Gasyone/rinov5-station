'use client'

import type { Lead } from '@/mocks/crmLeads'
import { CrmFamilyProfile360Modal } from '../family-360/CrmFamilyProfile360Modal'

interface CrmLeadFullProfileModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  lead: Lead
  initialAction?: 'view' | 'add_parent' | 'add_child'
  onSave?: (updatedLead: Lead) => void
}

export function CrmLeadFullProfileModal({
  open,
  onOpenChange,
  lead,
  initialAction = 'view',
  onSave,
}: CrmLeadFullProfileModalProps) {
  return (
    <CrmFamilyProfile360Modal
      open={open}
      onOpenChange={onOpenChange}
      lead={lead}
      initialTab={initialAction === 'add_child' ? 'children' : 'parents'}
      onUpdateLead={onSave}
    />
  )
}
