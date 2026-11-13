'use client'

import React, { useState } from 'react'
import {
  Copy,
  Check,
  ExternalLink,
  History,
  MapPin,
  Pencil,
} from 'lucide-react'
import { toast } from 'sonner'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import type { StudentPlacementLevels } from './unifiedSessionTypes'

interface AuditLogItem {
  timestamp: string
  author: string
  action: string
  detail?: string
}

interface StudentUnifiedProfilePanelProps {
  studentName: string
  studentAgeDob?: string
  studentSchool?: string
  studentAbility?: string
  placementLevels?: StudentPlacementLevels
  activeSubject?: 'english' | 'math' | 'other'
  parentName?: string
  parentPhone?: string
  parentAddress?: string
  notes?: string
  createdDate?: string
  creatorName?: string
  creatorRole?: string
  creatorPhone?: string | null
  creatorEmail?: string | null
  creatorAvatar?: string | null
  auditLogs?: AuditLogItem[]
  onSelectPlacementSubject?: (subject: 'english' | 'math') => void
  onEditLevel?: () => void
}

export function StudentUnifiedProfilePanel({
  studentName,
  studentAgeDob = '11 tuổi, 18/04/2015',
  studentSchool = 'Tiểu học Chu Văn An (Hà Nội)',
  studentAbility = 'Khá - Giỏi / Tiếp thu nhanh',
  placementLevels,
  activeSubject = 'english',
  parentName = 'Lê Quốc Anh (Bố)',
  parentPhone = '0988666555',
  parentAddress = 'Thanh Xuân, Hà Nội',
  notes,
  createdDate = '2026-08-05 09:30',
  creatorName = 'Nguyễn Thị Hà',
  creatorRole = 'Chuyên viên Tư vấn Tuyển sinh',
  creatorPhone = '0912345678',
  creatorEmail = 'ha.nguyen@rinoedu.vn',
  creatorAvatar,
  auditLogs = [],
  onEditLevel,
}: StudentUnifiedProfilePanelProps) {
  const [copied, setCopied] = useState(false)

  const handleCopyPhone = async () => {
    if (!parentPhone || parentPhone === '---') return
    try {
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(parentPhone)
      } else {
        const textArea = document.createElement('textarea')
        textArea.value = parentPhone
        textArea.style.position = 'fixed'
        textArea.style.opacity = '0'
        document.body.appendChild(textArea)
        textArea.select()
        document.execCommand('copy')
        document.body.removeChild(textArea)
      }
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
      toast.success(`Đã sao chép số điện thoại: ${parentPhone}`)
    } catch {
      toast.error('Không thể sao chép số điện thoại')
    }
  }

  // Lấy trình độ môn đang chọn (Tiếng Anh hoặc Toán)
  const currentPlacement = activeSubject === 'math' ? placementLevels?.math : placementLevels?.english

  return (
    <div className="flex flex-col gap-3 min-w-0">
      {/* ========================================================================= */}
      {/* SECTION 1: THÔNG TIN HỌC VIÊN                                           */}
      {/* ========================================================================= */}
      <div className="rounded-lg border border-border/70 bg-card overflow-hidden shadow-2xs">
        {/* Header Section Học viên */}
        <div className="flex items-center justify-between px-3.5 py-2 bg-muted/40 border-b border-border/60">
          <span className="text-xs font-medium text-foreground">Thông tin Học viên</span>
          <Badge variant="outline" className="text-[11px] font-mono h-4.5 px-1.5 text-muted-foreground bg-background">
            Hồ sơ học sinh
          </Badge>
        </div>

        <div className="p-3.5 space-y-2 text-xs">
          {/* Dòng 1: Họ tên học viên & Tuổi / DOB */}
          <div className="flex items-center justify-between gap-2 min-w-0">
            <span className="font-semibold text-foreground text-xs sm:text-sm truncate">
              {studentName}
            </span>
            <span className="text-muted-foreground text-xs shrink-0 text-right">
              {studentAgeDob}
            </span>
          </div>

          {/* Dòng 2: Trường học */}
          <div className="flex items-center justify-between gap-2 min-w-0">
            <span className="text-muted-foreground shrink-0">Trường:</span>
            <span className="font-normal text-muted-foreground truncate text-right" title={studentSchool}>
              {studentSchool}
            </span>
          </div>

          {/* Dòng 3: Học lực */}
          <div className="flex items-center justify-between gap-2 min-w-0">
            <span className="text-muted-foreground shrink-0">Học lực:</span>
            <span className="font-normal text-muted-foreground truncate text-right" title={studentAbility}>
              {studentAbility}
            </span>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* SECTION 2: TRÌNH ĐỘ HIỆN TẠI (TÁCH THÀNH KHỐI RIÊNG DƯỚI THÔNG TIN HỌC VIÊN) */}
      {/* ========================================================================= */}
      <div className="rounded-lg border border-border/70 bg-card overflow-hidden shadow-2xs">
        {/* Header Section Trình độ */}
        <div className="flex items-center justify-between px-3.5 py-2 bg-muted/40 border-b border-border/60">
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-medium text-foreground">Trình độ hiện tại</span>
            <Badge variant="outline" className="text-[11px] font-normal h-4.5 px-1.5 text-muted-foreground bg-background">
              {activeSubject === 'math' ? 'Toán tư duy' : 'Tiếng Anh'}
            </Badge>
          </div>
          {onEditLevel && (
            <button
              type="button"
              onClick={onEditLevel}
              className="inline-flex items-center gap-1 text-[11px] font-normal text-primary hover:underline cursor-pointer"
              title="Cập nhật thông tin trình độ học viên"
            >
              <Pencil className="h-3 w-3" />
              <span>Sửa</span>
            </button>
          )}
        </div>

        <div className="p-3.5 text-xs">
          <div className={cn("grid gap-2 text-xs", activeSubject === 'math' ? "grid-cols-1" : "grid-cols-2")}>
            <div className="space-y-0.5">
              <span className="text-muted-foreground text-[11px] block">Trình độ:</span>
              <div className="flex items-center gap-1">
                <span className="font-semibold text-sky-700 dark:text-sky-300 text-xs">
                  {currentPlacement?.level || 'Chưa kiểm tra'}
                </span>
                {currentPlacement?.isExpected && (
                  <span className="text-[10px] text-muted-foreground italic">(Dự kiến)</span>
                )}
              </div>
            </div>

            {activeSubject !== 'math' && (
              <div className="space-y-0.5">
                <span className="text-muted-foreground text-[11px] block">Trình độ phụ:</span>
                <span className="font-normal text-foreground text-xs">
                  {currentPlacement?.subLevel || '-'}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* SECTION 3: THÔNG TIN PHỤ HUYNH (TÁCH RIÊNG SECTION)                      */}
      {/* ========================================================================= */}
      <div className="rounded-lg border border-border/70 bg-card overflow-hidden shadow-2xs">
        {/* Header Section Phụ huynh: Tiêu đề + Nút Lịch sử audit log */}
        <div className="flex items-center justify-between px-3.5 py-2 bg-muted/40 border-b border-border/60">
          <span className="text-xs font-medium text-foreground">Thông tin Phụ huynh</span>

          {/* Lịch sử Audit log Popover */}
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-5 px-1.5 text-xs font-normal gap-1 text-primary hover:text-primary/80 shrink-0 cursor-pointer"
                title="Xem lịch sử thao tác & kiểm toán"
              >
                <History className="h-3 w-3 text-primary" />
                <span>Lịch sử ({auditLogs.length || 1})</span>
              </Button>
            </PopoverTrigger>
            <PopoverContent align="end" className="w-80 p-3 shadow-lg bg-popover z-50">
              <div className="flex items-center gap-1.5 border-b pb-2 mb-2">
                <History className="h-3.5 w-3.5 text-primary" />
                <span className="text-xs font-medium text-foreground">
                  Nhật ký thao tác hồ sơ
                </span>
              </div>
              <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                {auditLogs.length === 0 ? (
                  <div className="text-xs text-muted-foreground italic py-1">
                    Khởi tạo hồ sơ: {createdDate} bởi {creatorName}
                  </div>
                ) : (
                  auditLogs.map((log, idx) => (
                    <div key={idx} className="relative pl-3 border-l-2 border-primary/40 text-xs space-y-0.5">
                      <div className="flex items-center justify-between text-muted-foreground text-[11px]">
                        <span className="font-medium text-foreground">{log.author}</span>
                        <span>{log.timestamp}</span>
                      </div>
                      <p className="font-normal text-foreground">{log.action}</p>
                      {log.detail && (
                        <p className="text-muted-foreground text-[11px]">{log.detail}</p>
                      )}
                    </div>
                  ))
                )}
              </div>
            </PopoverContent>
          </Popover>
        </div>

        <div className="p-3.5 space-y-2 text-xs">
          {/* Dòng 1: Họ tên Phụ huynh & SĐT (có nút copy) */}
          <div className="flex items-center justify-between gap-2 min-w-0 text-xs">
            <span className="font-medium text-foreground truncate">
              {parentName}
            </span>
            <div className="flex items-center gap-1 shrink-0">
              <span className="font-mono text-muted-foreground">{parentPhone}</span>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={handleCopyPhone}
                className="h-5 w-5 text-muted-foreground hover:text-foreground cursor-pointer"
                title="Sao chép số điện thoại"
              >
                {copied ? <Check className="h-3 w-3 text-emerald-600" /> : <Copy className="h-3 w-3" />}
              </Button>
            </div>
          </div>

          {/* Dòng 2: Địa chỉ (Nhấp để mở tìm kiếm Google Maps) */}
          <div className="flex items-center justify-between gap-2 min-w-0 text-xs">
            <span className="text-muted-foreground shrink-0">Địa chỉ:</span>
            {parentAddress && parentAddress !== '---' ? (
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(parentAddress)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="font-normal text-foreground/90 hover:text-sky-600 dark:hover:text-sky-400 hover:underline truncate text-right inline-flex items-center gap-1.5 group/addr cursor-pointer"
                title={`Mở tìm kiếm Google Maps cho: ${parentAddress}`}
              >
                <MapPin className="h-3.5 w-3.5 text-rose-500 shrink-0" />
                <span className="truncate">{parentAddress}</span>
                <ExternalLink className="h-3 w-3 text-sky-600 dark:text-sky-400 group-hover/addr:translate-x-0.5 transition-transform shrink-0" />
              </a>
            ) : (
              <span className="font-normal text-muted-foreground truncate text-right">---</span>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
