'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import {
  useSystemConfigStore,
  type SystemDataScope,
} from '@/stores/useSystemConfigStore'
import { cn } from '@/lib/utils'

const SCOPE_OPTIONS: Array<{ id: SystemDataScope; label: string }> = [
  { id: 'personal', label: 'Cá nhân' },
  { id: 'team', label: 'Cùng nhóm' },
  { id: 'branch', label: 'Toàn cơ sở' },
  { id: 'global', label: 'Toàn hệ thống' },
]

export function SystemConfigScreen() {
  const dataScope = useSystemConfigStore((s) => s.dataScope)
  const setDataScope = useSystemConfigStore((s) => s.setDataScope)
  const [selectedScope, setSelectedScope] = useState<SystemDataScope>(dataScope)

  const handleSelect = (id: SystemDataScope) => {
    setSelectedScope(id)
    setDataScope(id)
    const opt = SCOPE_OPTIONS.find((o) => o.id === id)
    toast.info(`Đã chọn phạm vi: ${opt?.label || id}`)
  }

  const handleSave = () => {
    setDataScope(selectedScope)
    toast.success('Đã lưu cấu hình phạm vi dữ liệu thành công!')
  }

  return (
    <div className="flex flex-col h-full w-full min-h-0 overflow-y-auto bg-background p-6">
      <div className="max-w-xl mx-auto w-full space-y-6">
        {/* Tiêu đề & Nút Lưu tối giản */}
        <div className="flex items-center justify-between pb-4 border-b border-border">
          <h1 className="text-xl font-bold tracking-tight text-foreground">
            Cấu hình phạm vi dữ liệu
          </h1>
          <Button
            size="sm"
            onClick={handleSave}
            className="h-9 px-4 text-xs font-semibold bg-primary text-primary-foreground hover:bg-primary/90 cursor-pointer"
          >
            Lưu cấu hình
          </Button>
        </div>

        {/* Danh sách lựa chọn tối giản */}
        <div className="space-y-2.5">
          {SCOPE_OPTIONS.map((option) => {
            const isSelected = selectedScope === option.id
            return (
              <div
                key={option.id}
                onClick={() => handleSelect(option.id)}
                className={cn(
                  'flex items-center justify-between px-4 py-3.5 rounded-lg border transition-colors cursor-pointer select-none',
                  isSelected
                    ? 'border-primary bg-primary/5 text-primary font-medium ring-1 ring-primary/20'
                    : 'border-border bg-card hover:bg-muted/40 text-foreground'
                )}
              >
                <span className="text-sm font-medium">{option.label}</span>
                <div
                  className={cn(
                    'h-4 w-4 rounded-full border flex items-center justify-center transition-colors',
                    isSelected
                      ? 'border-primary bg-primary'
                      : 'border-muted-foreground/40 bg-background'
                  )}
                >
                  {isSelected && (
                    <div className="h-1.5 w-1.5 rounded-full bg-primary-foreground" />
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default SystemConfigScreen
