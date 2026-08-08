'use client'

import React from 'react'
import { Wrench } from 'lucide-react'
import { EmptyState } from '@/components/shared'
import { CareConditionConfig } from './careConditionsTypes'

interface CareConditionLogTabProps {
  condition: CareConditionConfig
}

export const CareConditionLogTab: React.FC<CareConditionLogTabProps> = () => {
  return (
    <div className="flex-1 min-h-0 flex flex-col justify-center items-center py-12">
      <EmptyState
        icon={<Wrench className="h-8 w-8 text-amber-500" />}
        title="Tính năng đang phát triển"
        description="Nhật ký theo dõi chi tiết phiếu phát sinh tự động cho mã điều kiện này đang được cập nhật. Vui lòng chuyển sang tab 'Thiết lập quy tắc' để xem hoặc điều chỉnh cấu hình."
        className="py-12 px-6 max-w-lg border rounded-xl bg-card/50 shadow-2xs"
      />
    </div>
  )
}
