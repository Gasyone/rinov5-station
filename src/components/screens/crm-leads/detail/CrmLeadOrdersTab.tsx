'use client'

import React, { useMemo } from 'react'
import { Lead, mockLeads } from '@/mocks/crmLeads'
import { StudentOrdersTab } from '@/components/screens/care/StudentOrdersTab'
import { mapLeadToDetailedOrders } from './leadOrderMapper'

interface CrmLeadOrdersTabProps {
  lead: Lead
  onOpenCreateOrder?: (lead: Lead) => void
}

export function CrmLeadOrdersTab({ lead, onOpenCreateOrder }: CrmLeadOrdersTabProps) {
  const orders = useMemo(() => {
    return mapLeadToDetailedOrders(lead, mockLeads)
  }, [lead])

  return (
    <div className="w-full">
      <StudentOrdersTab
        studentId={lead.code || lead.id}
        studentName={lead.studentName}
        initialOrders={orders}
        onOpenCreateOrder={onOpenCreateOrder ? () => onOpenCreateOrder(lead) : undefined}
      />
    </div>
  )
}
