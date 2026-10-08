'use client'

import React from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import {
  Phone,
  AlertTriangle,
  ArrowUpRight,
  Clock,
  HeartHandshake,
  Check,
  Copy,
} from 'lucide-react'
import { AppAvatar } from '@/components/shared'
import { useCallStore } from '@/stores/useCallStore'
import { toast } from 'sonner'
import type { CareAvatarItem, RenewalAvatarItem } from './homeTypes'

interface HomeStudentDetailModalProps {
  careItem?: CareAvatarItem | null
  renewalItem?: RenewalAvatarItem | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onNavigateCare: () => void
  onNavigateRenewal: () => void
}

export function HomeStudentDetailModal({
  careItem,
  renewalItem,
  open,
  onOpenChange,
  onNavigateCare,
  onNavigateRenewal,
}: HomeStudentDetailModalProps) {
  const startCall = useCallStore((s) => s.startCall)
  const [copied, setCopied] = React.useState(false)

  const studentName = careItem?.studentName || renewalItem?.studentName || ''
  const studentCode = careItem?.profileItem.code || renewalItem?.profileItem.code || 'HV-001'
  const classCode = careItem?.classCode || renewalItem?.classCode || ''
  const avatar = careItem?.avatar || renewalItem?.avatar
  const parentName = careItem?.parentName || renewalItem?.parentName || 'Phụ huynh học sinh'
  const parentPhone = careItem?.parentPhone || renewalItem?.parentPhone || '0912345678'
  const isCare = Boolean(careItem)

  const handleCopyPhone = () => {
    if (parentPhone) {
      navigator.clipboard.writeText(parentPhone)
      setCopied(true)
      toast.success('Đã sao chép số điện thoại!')
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const handleStartCall = () => {
    startCall({
      studentId: careItem?.studentId || renewalItem?.studentId || 'st-unknown',
      studentName,
      parentPhone,
      parentName,
    })
    toast.info(`Đang kích hoạt cuộc gọi tới ${parentName}...`)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-2.5">
            <AppAvatar
              name={studentName}
              src={avatar}
              size="lg"
              className="border border-border shadow-xs"
            />
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <DialogTitle className="text-sm font-semibold text-foreground">
                  {studentName}
                </DialogTitle>
                <span className="font-mono text-xs bg-muted px-1.5 py-0.5 rounded text-muted-foreground font-normal">
                  {studentCode}
                </span>
              </div>
              <DialogDescription className="text-xs text-muted-foreground">
                Lớp {classCode} • Trạng thái: Đang theo học
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {/* Content */}
        <div className="space-y-2.5 py-1 text-xs">
          {/* Care or Renewal alert box */}
          {isCare && careItem && (
            <div className="p-2.5 bg-amber-50/70 border border-amber-200/80 rounded-lg space-y-1">
              <div className="flex items-center gap-1.5 font-normal text-amber-800 text-xs">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                <span>Nội dung cảnh báo CSKH:</span>
              </div>
              <p className="text-amber-900 leading-relaxed font-normal text-xs">
                {careItem.reason}
              </p>
              <div className="flex items-center gap-3 pt-0.5 text-xs text-amber-700">
                <span>Chuyên cần: {careItem.attendanceRatio}</span>
                <span>•</span>
                <span>Số buổi còn lại: {careItem.remainingSessions} buổi</span>
              </div>
            </div>
          )}

          {!isCare && renewalItem && (
            <div className="p-2.5 bg-emerald-50/70 border border-emerald-200/80 rounded-lg space-y-1">
              <div className="flex items-center gap-1.5 font-normal text-emerald-800 text-xs">
                <Clock className="w-3.5 h-3.5 text-emerald-600" />
                <span>Tình trạng tái phí:</span>
              </div>
              <p className="text-emerald-900 leading-relaxed font-normal text-xs">
                Học viên còn {renewalItem.remainingSessions} buổi học • Hạn dự kiến:{' '}
                {renewalItem.expectedEndDate}
              </p>
              <div className="flex items-center gap-3 pt-0.5 text-xs text-emerald-700">
                <span>Gói học: {renewalItem.packageName}</span>
                <span>•</span>
                <span>Mức độ: {renewalItem.renewalStatusLabel}</span>
              </div>
            </div>
          )}

          {/* Parent contact & Quick Call Box */}
          <div className="p-2.5 border rounded-lg space-y-1.5">
            <h4 className="font-normal text-muted-foreground flex items-center gap-1.5 text-xs">
              <HeartHandshake className="w-3.5 h-3.5 text-primary" />
              Thông tin liên hệ phụ huynh
            </h4>

            <div className="space-y-1">
              <p className="font-normal text-foreground text-xs">{parentName}</p>
              <div className="flex items-center justify-between pt-0.5">
                <span className="font-mono text-xs text-muted-foreground">{parentPhone}</span>
                <div className="flex items-center gap-1">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-6.5 w-6.5 text-muted-foreground hover:text-foreground"
                    onClick={handleCopyPhone}
                    title="Sao chép SĐT"
                  >
                    {copied ? (
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </Button>
                  <Button
                    type="button"
                    variant="default"
                    size="sm"
                    className="h-6.5 text-xs gap-1.5 px-2 font-normal"
                    onClick={handleStartCall}
                  >
                    <Phone className="w-3 h-3" />
                    <span>Gọi điện</span>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer actions */}
        <div className="flex items-center justify-between pt-2 border-t">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => onOpenChange(false)}
          >
            Đóng
          </Button>

          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => {
              onOpenChange(false)
              if (isCare) {
                onNavigateCare()
              } else {
                onNavigateRenewal()
              }
            }}
            className="text-primary hover:text-primary gap-1"
          >
            <span>{isCare ? 'Mở Danh mục Chăm sóc' : 'Mở Danh sách Tái phí'}</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
