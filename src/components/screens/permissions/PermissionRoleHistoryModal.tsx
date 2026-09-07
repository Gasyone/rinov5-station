'use client'

import { useMemo } from 'react'
import { History, RotateCcw, ShieldCheck, CheckCircle2, Clock } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { EmptyState } from '@/components/shared'
import { getRoleAuditLogs } from './permissionsHelpers'
import type { PermissionRole, RolePermissionMatrixItem } from './permissionsTypes'

interface PermissionRoleHistoryModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  role?: PermissionRole | null
  topicName?: string
  onRestoreVersion: (permissions: RolePermissionMatrixItem[], timestamp: string) => void
}

export function PermissionRoleHistoryModal({
  open,
  onOpenChange,
  role,
  topicName,
  onRestoreVersion,
}: PermissionRoleHistoryModalProps) {
  const auditLogs = useMemo(() => {
    return getRoleAuditLogs(role)
  }, [role])

  if (!role && !open) return null

  const handleRestore = (permissions: RolePermissionMatrixItem[], timestamp: string) => {
    onRestoreVersion(permissions, timestamp)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[660px] max-h-[85vh] flex flex-col p-0 gap-0 overflow-hidden">
        {/* Header tinh gọn: Không dùng từ 'phiên bản', chỉ thể hiện Log cập nhật */}
        <DialogHeader className="px-5 pt-4 pb-3 border-b border-border bg-muted/20">
          <div className="flex items-center gap-2.5 pr-6">
            <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary shrink-0">
              <History className="h-4 w-4" />
            </div>
            <div className="space-y-0.5 text-left min-w-0 flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <DialogTitle className="text-sm font-bold text-foreground">
                  Log cập nhật
                </DialogTitle>
                <span className="px-2 py-0.2 text-[10.5px] font-bold rounded-md bg-primary/10 text-primary">
                  {auditLogs.length} lần cập nhật
                </span>
              </div>
              <DialogDescription className="text-xs text-muted-foreground truncate">
                Nhóm quyền:{' '}
                <span className="font-semibold text-foreground">
                  {role?.name || 'Chưa đặt tên'}
                </span>
                {topicName && (
                  <span className="ml-1.5 inline-flex items-center gap-1 text-[10.5px] bg-muted px-1.5 py-0.2 rounded border border-border/60">
                    <ShieldCheck className="h-3 w-3 text-muted-foreground" />
                    {topicName}
                  </span>
                )}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {/* Danh sách các lần cập nhật theo chuẩn hành vi hệ thống: Bỏ gì, Thêm gì */}
        <div className="flex-1 overflow-y-auto p-4 max-h-[520px]">
          {auditLogs.length === 0 ? (
            <div className="py-8">
              <EmptyState
                title="Chưa có lịch sử"
                description="Nhóm quyền này chưa ghi nhận nhật ký cập nhật hành vi nào."
              />
            </div>
          ) : (
            <div className="divide-y divide-border/50 rounded-lg border border-border/60 bg-card overflow-hidden">
              {auditLogs.map((log) => (
                <div
                  key={log.id}
                  className="p-3.5 hover:bg-muted/30 transition-colors flex flex-col gap-2.5"
                >
                  {/* Hàng trên: Thời gian, Người thực hiện & Trạng thái / Nút Khôi phục */}
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2 text-xs flex-wrap">
                      <span className="inline-flex items-center gap-1.5 font-bold text-foreground">
                        <Clock className="h-3.5 w-3.5 text-primary" />
                        {log.updatedAt}
                      </span>
                      <span className="text-muted-foreground">•</span>
                      <span className="text-muted-foreground text-[11.5px]">
                        Người thực hiện:{' '}
                        <strong className="font-semibold text-foreground/90">{log.updatedBy}</strong>
                      </span>
                    </div>

                    <div className="shrink-0">
                      {log.isCurrent ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950 dark:text-emerald-400 dark:border-emerald-800">
                          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                          Đang áp dụng
                        </span>
                      ) : (
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => handleRestore(log.permissionsSnapshot, log.updatedAt)}
                          className="h-7 px-2.5 text-xs font-semibold gap-1.5 cursor-pointer text-foreground hover:text-primary hover:bg-primary/5 hover:border-primary/40 transition-colors"
                          title={`Khôi phục ma trận phân quyền về thời điểm ${log.updatedAt}`}
                        >
                          <RotateCcw className="h-3 w-3 text-primary" />
                          <span>Khôi phục</span>
                        </Button>
                      )}
                    </div>
                  </div>

                  {/* Chi tiết hành vi hệ thống: Phân tách rõ ràng Thêm quyền (+) và Bỏ quyền (-) */}
                  <div className="space-y-1.5 pt-2 border-t border-border/40">
                    {log.diffs.map((diff, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-xs">
                        {diff.type === 'added' ? (
                          <span className="inline-flex items-center px-1.5 py-0.2 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-400 dark:border-emerald-800 shrink-0">
                            + Thêm
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-1.5 py-0.2 rounded text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200 dark:bg-rose-950/60 dark:text-rose-400 dark:border-rose-800 shrink-0">
                            - Bỏ
                          </span>
                        )}
                        <div className="text-foreground/90 leading-normal">
                          {diff.type === 'added' ? 'Cấp quyền' : 'Thu hồi quyền'}{' '}
                          <strong className="font-semibold text-foreground">
                            {diff.actionLabels.join(', ')}
                          </strong>{' '}
                          tại <span className="font-medium text-foreground">{diff.featureName}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
