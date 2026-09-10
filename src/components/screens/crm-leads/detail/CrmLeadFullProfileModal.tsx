'use client'

import type { Lead } from '@/mocks/crmLeads'
import { CrmCustomerCreateDialog } from '../CrmCustomerCreateDialog'

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
    <CrmCustomerCreateDialog
      open={open}
      onOpenChange={onOpenChange}
      initialLead={lead}
      initialAction={initialAction}
      onSubmit={(updatedLeads) => {
        if (updatedLeads.length > 0 && onSave) {
          onSave(updatedLeads[0])
        }
      }}
      totalOrdersCount={lead.ordersCount || 0}
      totalOrdersAmount={lead.expectedAmount || '0đ'}
    />
  )
}
