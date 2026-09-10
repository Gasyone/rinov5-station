'use client'

import { use } from 'react'
import { useRouter } from 'next/navigation'
import { CrmLeadDetailPage } from '@/components/screens/crm-leads/detail/CrmLeadDetailPage'

export default function CrmLeadDetailRoutePage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)
  const router = useRouter()

  return (
    <div className="h-full min-h-0">
      <CrmLeadDetailPage
        leadId={id}
        onBack={() => router.push('/app/crm_leads')}
      />
    </div>
  )
}
