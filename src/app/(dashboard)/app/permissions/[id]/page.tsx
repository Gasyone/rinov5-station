'use client'

import { use, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ModuleLoadingSkeleton } from '@/components/shared'

export default function PermissionRoleDetailRedirectPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)
  const router = useRouter()

  useEffect(() => {
    if (id) {
      router.replace(`/app/permissions?roleId=${encodeURIComponent(id)}`)
    }
  }, [id, router])

  return (
    <div className="h-full min-h-0 p-6">
      <ModuleLoadingSkeleton />
    </div>
  )
}
