'use client'

import { useMemo, useState } from 'react'
import { History, RotateCcw, Clock, CheckCircle2 } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { ConfirmDialog, EmptyState } from '@/components/shared'
import { getRoleAuditLogs } from './permissionsHelpers'
import type { PermissionRole, RolePermissionMatrixItem, RoleAuditLogItem } from './permissionsTypes'

interface PermissionRoleHistoryTabProps {
  role?: PermissionRole | null
  onRestoreVersion: (permissions: RolePermissionMatrixItem[], timestamp: string) => void
}

export function PermissionRoleHistoryTab({
  role,
  onRestoreVersion,
}: PermissionRoleHistoryTabProps) {
  const [confirmRestoreOpen, setConfirmRestoreOpen] = useState(false)
  const [selectedLogToRestore, setSelectedLogToRestore] = useState<RoleAuditLogItem | null>(null)

  const auditLogs = useMemo(() => {
    return getRoleAuditLogs(role)
  }, [role])

  const handleOpenRestoreConfirm = (log: RoleAuditLogItem) => {
    setSelectedLogToRestore(log)
    setConfirmRestoreOpen(true)
  }

  const handleConfirmRestore = () => {
    if (selectedLogToRestore) {
      onRestoreVersion(selectedLogToRestore.permissionsSnapshot, selectedLogToRestore.updatedAt)
      toast.success(`Đã khôi phục ma trận phân quyền về thời điểm ${selectedLogToRestore.updatedAt}`)
    }
    setConfirmRestoreOpen(false)
    setSelectedLogToRestore(null)
  }

  return (
    <div className="flex flex-col h-full min-h-0 space-y-4">
      {/* 1. Header info */}
      <div className="flex items-center justify-between pb-3 border-b border-border">
        <div className="flex items-center gap-2">
          <History className="h-4 w-4 text-primary" />
          <span className="text-xs font-bold text-foreground">Nhật ký cập nhật & Lịch sử phân quyền</span>
          <span className="px-2 py-0.5 rounded text-xs font-semibold bg-primary/10 text-primary border border-primary/20">
            {auditLogs.length} lần cập nhật
          </span>
        </div>
        <span className="text-xs text-muted-foreground">
          Ghi nhận toàn bộ các lần thay đổi hành vi cấp/thu hồi quyền
        </span>
      </div>

      {/* 2. Timeline cards */}
      <div className="flex-1 min-h-0 overflow-y-auto space-y-3 pr-1">
        {auditLogs.length === 0 ? (
          <div className="py-12">
            <EmptyState
              icon={<History className="h-8 w-8 text-muted-foreground/40" />}
              title="Chưa có nhật ký thay đổi"
              description="Nhóm quyền này chưa ghi nhận lịch sử thay đổi hành vi nào."
            />
          </div>
        ) : (
          auditLogs.map((log) => (
            <div
              key={log.id}
              className="p-4 rounded-lg border border-border bg-card hover:border-border/80 transition-colors flex flex-col gap-3 shadow-2xs"
            >
              {/* Header của từng log item */}
              <div className="flex items-center justify-between gap-3 flex-wrap">
                <div className="flex items-center gap-2 text-xs">
                  <span className="inline-flex items-center gap-1.5 font-bold text-foreground">
                    <Clock className="h-3.5 w-3.5 text-primary" />
                    {log.updatedAt}
                  </span>
                  <span className="text-muted-foreground">•</span>
                  <span className="text-muted-foreground">
                    Người thực hiện:{' '}
                    <strong className="font-semibold text-foreground">{log.updatedBy}</strong>
                  </span>
                </div>

                <div>
                  {log.isCurrent ? (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 dark:text-emerald-400">
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      Đang áp dụng
                    </span>
                  ) : (
                    <Button
                      type="button"
                      variant="outline"
                      size="xs"
                      onClick={() => handleOpenRestoreConfirm(log)}
                      className="h-7 px-2.5 text-xs font-medium gap-1.5 hover:text-primary hover:bg-primary/5 hover:border-primary/40"
                    >
                      <RotateCcw className="h-3 w-3 text-primary" />
                      <span>Khôi phục phiên bản</span>
                    </Button>
                  )}
                </div>
              </div>

              {/* Diffs: Chi tiết Thêm quyền (+) và Bỏ quyền (-) */}
              <div className="space-y-1.5 pt-2 border-t border-border/60">
                {log.diffs.map((diff, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-xs">
                    {diff.type === 'added' ? (
                      <span className="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-bold bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 shrink-0">
                        + Cấp
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-bold bg-destructive/10 text-destructive border border-destructive/20 shrink-0">
                        - Thu hồi
                      </span>
                    )}
                    <div className="text-foreground leading-normal">
                      {diff.type === 'added' ? 'Cấp quyền' : 'Thu hồi quyền'}{' '}
                      <strong className="font-semibold text-foreground">
                        {diff.actionLabels.join(', ')}
                      </strong>{' '}
                      tại <span className="font-medium text-muted-foreground">{diff.featureName}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Confirm Dialog khôi phục */}
      <ConfirmDialog
        open={confirmRestoreOpen}
        onOpenChange={setConfirmRestoreOpen}
        title={`Khôi phục ma trận về thời điểm ${selectedLogToRestore?.updatedAt}?`}
        description="Toàn bộ cấu hình quyền hiện tại sẽ được thay thế bằng cấu hình của thời điểm này. Bạn có chắc chắn muốn khôi phục?"
        confirmLabel="Khôi phục ngay"
        variant="default"
        onConfirm={handleConfirmRestore}
      />
    </div>
  )
}
