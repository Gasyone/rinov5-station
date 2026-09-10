'use client'

import { useState } from 'react'
import {
  ArrowLeft,
  Copy,
  ChevronDown,
  ChevronUp,
  Pencil,
  Check,
  ExternalLink,
  PhoneCall,
  MessageSquare,
  RotateCcw,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import { getStatusBadgeClass } from '@/lib/statusColors'
import { AppAvatar } from '@/components/shared'
import type { Lead } from '@/mocks/crmLeads'
import { STATUS_LABEL_MAP } from '../crmLeadsTypes'

interface CrmLeadHeaderCardProps {
  lead: Lead
  onBack: () => void
  onOpenDetailModal?: () => void
  onUpdateNote?: (newNote: string) => void
}

export function CrmLeadHeaderCard({
  lead,
  onBack,
  onOpenDetailModal,
  onUpdateNote,
}: CrmLeadHeaderCardProps) {
  const [isParentsExpanded, setIsParentsExpanded] = useState(false)
  const [isEditingNote, setIsEditingNote] = useState(false)
  const [noteText, setNoteText] = useState(
    lead.lastNote ||
      'Học viên tích cực, thích hoạt động nhóm, cần động viên nhiều hơn khi làm bài tập cá nhân.'
  )
  const [isNoteExpanded, setIsNoteExpanded] = useState(false)

  // Contacts list: Lead mặc định chỉ có 1 phụ huynh chính, đóng mặc định
  const primaryContact = {
    name: lead.parentName || 'Nguyễn Thị Mai',
    role: lead.parentRole || 'Mẹ',
    phone: lead.phone || '090161294',
    isPrimary: true,
  }

  const otherContacts = (lead.otherParents || []).map((c) => ({
    ...c,
    isPrimary: false,
  }))

  const allContacts = [primaryContact, ...otherContacts]

  const birthDate = lead.birthYear
    ? `NS: ${lead.birthYear} (${lead.studentAge} tuổi)`
    : `NS: 25/08/2017`
  const address = lead.address || 'Số 45 Nguyễn Tuân, Thanh Xuân, Hà Nội'

  const statusLabel = STATUS_LABEL_MAP[lead.status] || 'Đang tư vấn'
  const statusBadge = getStatusBadgeClass(
    lead.status === 'moi_tiep_nhan'
      ? 'pending'
      : lead.status === 'chuyen_doi'
        ? 'active'
        : lead.status === 'that_bai'
          ? 'inactive'
          : 'warning'
  )

  const handleCopy = (phone: string, name: string) => {
    navigator.clipboard
      .writeText(phone)
      .then(() => toast.success(`Đã sao chép SĐT ${name}: ${phone}`))
      .catch(() => toast.error('Không thể sao chép SĐT'))
  }

  const handleCall = (phone: string, name: string) => {
    toast.info(`Đang kích hoạt cuộc gọi tới ${name} (${phone})...`)
    window.open(`tel:${phone}`, '_self')
  }

  const handleZalo = (phone: string, name: string) => {
    const cleanPhone = phone.replace(/\D/g, '')
    toast.info(`Mở cửa sổ chat Zalo với ${name}...`)
    window.open(`https://zalo.me/${cleanPhone}`, '_blank')
  }

  const handleSaveNote = () => {
    setIsEditingNote(false)
    onUpdateNote?.(noteText)
    toast.success('Đã cập nhật ghi chú học viên!')
  }

  const studentAvatar =
    'https://api.dicebear.com/7.x/adventurer/svg?seed=' +
    encodeURIComponent(lead.studentName || 'Student')

  return (
    <div className="bg-card border border-border/80 rounded-2xl p-2.5 lg:p-3 shadow-xs space-y-2 text-left select-none">
      {/* Top row: Back Button + Avatar + Basic info + Chevron */}
      <div className="flex items-start gap-3">
        {/* Nút Back tròn */}
        <Button
          variant="outline"
          size="icon"
          className="h-9 w-9 rounded-full shrink-0 border-border/70 hover:bg-muted text-muted-foreground hover:text-foreground cursor-pointer mt-1"
          onClick={onBack}
          title="Quay lại danh sách Lead"
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>

        {/* Avatar tròn nhấp mở Modal Detail */}
        <button
          type="button"
          onClick={onOpenDetailModal}
          className="cursor-pointer hover:scale-105 hover:opacity-90 active:scale-95 transition-all shrink-0 rounded-full focus:outline-none"
          title="Nhấp để xem hồ sơ chi tiết của học viên"
        >
          <AppAvatar
            src={studentAvatar}
            name={lead.studentName}
            size="lg"
            className="border-2 border-background shadow-xs shrink-0 h-14 w-14 pointer-events-none"
          />
        </button>

        {/* Cụm thông tin học viên & phụ huynh phân định rõ ràng */}
        <div className="min-w-0 flex-1 flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
          {/* KHỐI 1: CHỦ THỂ HỌC SINH */}
          <div className="min-w-0 space-y-1">
            <div className="flex items-center gap-2 flex-wrap leading-tight">
              <span
                onClick={onOpenDetailModal}
                className="text-base font-bold text-foreground hover:text-primary cursor-pointer transition-colors"
                title="Nhấp để mở chi tiết hồ sơ"
              >
                {lead.studentName}
              </span>
              <Badge className={cn('text-xs font-semibold py-0.5 px-2 rounded-full leading-none shadow-none', statusBadge)}>
                {statusLabel}
              </Badge>
              {lead.isReturningLead && (
                <Badge
                  variant="outline"
                  className="text-xs font-semibold py-0.5 px-2 rounded-full bg-amber-50 dark:bg-amber-950/50 text-amber-800 dark:text-amber-300 border-amber-300 dark:border-amber-700 flex items-center gap-1 shadow-none"
                  title={lead.returningReason || 'Lead quay lại chăm sóc'}
                >
                  <RotateCcw className="h-3 w-3" />
                  <span>Lead quay lại ({lead.salesCycles?.length ? `Chu kỳ ${lead.salesCycles.length}` : 'Chu kỳ mới'})</span>
                </Badge>
              )}
              <span className="text-xs font-medium text-muted-foreground bg-muted/60 px-2 py-0.5 rounded border border-border/50">
                {lead.targetSubject}
              </span>
            </div>

            <div className="flex items-center gap-2 text-xs text-muted-foreground font-medium flex-wrap">
              <span>{birthDate}</span>
              <span className="text-border">•</span>
              <span>Lớp {lead.studentAge - 5 || 3}</span>
              <span className="text-border">•</span>
              <span className="truncate max-w-[260px]" title={address}>
                📍 {address}
              </span>
            </div>
          </div>

          {/* KHỐI 2: ĐẦU MỐI LIÊN HỆ PHỤ HUYNH (THANH TÁC NGHIỆP NHANH) */}
          <div className="bg-slate-50 dark:bg-zinc-800/60 border border-slate-200/80 dark:border-zinc-700/80 rounded-xl px-3 py-1.5 flex items-center gap-2.5 flex-wrap">
            <div className="flex items-center gap-1.5 min-w-0">
              <span className="font-bold text-foreground text-xs shrink-0">
                {primaryContact.name} ({primaryContact.role})
              </span>
              <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-sky-100 text-sky-800 border border-sky-200 dark:bg-sky-950 dark:text-sky-300 leading-none shrink-0">
                Chính
              </span>
            </div>

            <div className="flex items-center gap-1">
              <span className="font-mono font-bold text-sky-700 dark:text-sky-400 text-xs shrink-0">
                {primaryContact.phone}
              </span>
              <button
                type="button"
                onClick={() => handleCopy(primaryContact.phone, primaryContact.name)}
                className="p-1 hover:bg-background rounded text-muted-foreground hover:text-foreground cursor-pointer shrink-0 transition-colors"
                title="Sao chép số điện thoại"
              >
                <Copy className="h-3 w-3" />
              </button>
            </div>

            <div className="flex items-center gap-1">
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleZalo(primaryContact.phone, primaryContact.name)}
                className="h-6 px-2 text-[11px] font-semibold text-sky-700 border-sky-200 hover:bg-sky-50 dark:border-sky-800 dark:text-sky-300 dark:hover:bg-sky-950/60 cursor-pointer rounded"
                title="Nhắn tin Zalo với phụ huynh"
              >
                <MessageSquare className="h-3 w-3 mr-1 text-sky-600" />
                <span>Zalo</span>
              </Button>

              <Button
                size="sm"
                onClick={() => handleCall(primaryContact.phone, primaryContact.name)}
                className="h-6 px-2.5 text-[11px] font-semibold bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer rounded shadow-3xs"
                title="Gọi điện trực tiếp"
              >
                <PhoneCall className="h-3 w-3 mr-1 fill-current" />
                <span>Gọi</span>
              </Button>
            </div>

            {/* Chevron toggle nếu có nhiều hơn 1 phụ huynh */}
            {otherContacts.length > 0 && (
              <button
                type="button"
                onClick={() => setIsParentsExpanded(!isParentsExpanded)}
                className="p-1 hover:bg-background rounded text-sky-600 dark:text-sky-400 cursor-pointer shrink-0 transition-colors ml-0.5"
                title={isParentsExpanded ? 'Thu gọn danh bạ' : 'Xem thêm phụ huynh'}
              >
                {isParentsExpanded ? (
                  <ChevronUp className="h-4 w-4 stroke-[2.5]" />
                ) : (
                  <ChevronDown className="h-4 w-4 stroke-[2.5]" />
                )}
              </button>
            )}
          </div>
        </div>

        {/* Góc phải: Mã Lead + Nút Xem chi tiết hồ sơ */}
        {onOpenDetailModal && (
          <div className="shrink-0 flex flex-col items-end gap-1.5 self-start pt-0.5 ml-auto">
            <div className="flex items-center gap-1.5">
              <span className="font-mono text-xs font-bold text-sky-700 dark:text-sky-400 bg-sky-50 dark:bg-sky-950/60 px-2 py-0.5 rounded border border-sky-200/80 dark:border-sky-800">
                {lead.code}
              </span>
              {lead.createdAt && (
                <span className="text-[11px] text-muted-foreground hidden sm:inline">
                  Tạo: {lead.createdAt}
                </span>
              )}
            </div>

            <Button
              size="sm"
              variant="outline"
              onClick={onOpenDetailModal}
              className="h-7 px-2.5 text-xs font-semibold text-primary border-primary/30 hover:bg-primary/10 cursor-pointer shadow-3xs flex items-center gap-1"
              title="Mở toàn bộ biểu mẫu hồ sơ khách hàng để xem hoặc cập nhật chi tiết"
            >
              <span>Xem chi tiết hồ sơ</span>
              <ExternalLink className="h-3 w-3 ml-0.5 opacity-80" />
            </Button>
          </div>
        )}
      </div>

      {/* Expanded Accordion: Danh sách các phụ huynh nếu có nhiều hơn 1 phụ huynh */}
      {isParentsExpanded && otherContacts.length > 0 && (
        <div className="mt-2 space-y-1.5 border-t border-border/40 pt-2 text-left animate-in fade-in-50 duration-150">
          {allContacts.map((contact, idx) => (
            <div
              key={`${contact.phone}-${idx}`}
              className="group/contact flex items-center justify-between gap-2 p-2 bg-muted/20 dark:bg-zinc-800/30 border border-border/40 rounded-lg text-xs"
            >
              <div className="flex items-center gap-1.5 flex-wrap min-w-0">
                <span className="font-bold text-foreground">{contact.name}</span>
                <span className="text-muted-foreground font-normal">({contact.role})</span>
                {contact.isPrimary && (
                  <span className="text-[9px] font-semibold px-1.5 py-0.5 rounded-md bg-sky-50 text-sky-700 dark:bg-sky-950/60 dark:text-sky-300 border border-sky-200/60 dark:border-sky-900 leading-none">
                    Chính
                  </span>
                )}
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <span className="font-mono font-bold text-sky-600 dark:text-sky-400 mr-1">
                  {contact.phone}
                </span>
                <button
                  type="button"
                  onClick={() => handleCopy(contact.phone, contact.name)}
                  className="p-1 hover:bg-background/80 rounded text-muted-foreground opacity-0 group-hover/contact:opacity-100 transition-opacity cursor-pointer"
                  title="Sao chép số điện thoại"
                >
                  <Copy className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Dòng ghi chú học viên (Pencil icon ✎ màu cam) */}
      <div className="pt-2 mt-1 border-t border-border/40 w-full select-none text-left">
        {isEditingNote ? (
          <div className="flex items-center gap-1.5 w-full">
            <input
              type="text"
              value={noteText}
              onChange={(e) => setNoteText(e.target.value)}
              placeholder="Nhập thói quen, sở thích và mục tiêu học tập..."
              className="flex-1 bg-background border border-amber-400 dark:border-amber-600 rounded-md px-2.5 py-1 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-amber-500"
              autoFocus
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSaveNote()
                if (e.key === 'Escape') setIsEditingNote(false)
              }}
            />
            <Button
              size="sm"
              className="h-6 px-2 bg-amber-600 hover:bg-amber-700 text-white font-semibold text-xs rounded-md"
              onClick={handleSaveNote}
            >
              <Check className="h-3 w-3 mr-0.5" /> Lưu
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-6 px-1.5 text-muted-foreground text-xs"
              onClick={() => setIsEditingNote(false)}
            >
              Hủy
            </Button>
          </div>
        ) : (
          <div className="group/note flex items-start justify-between gap-1.5 w-full">
            <div className="flex items-start gap-1.5 flex-1 min-w-0">
              <button
                type="button"
                onClick={() => setIsEditingNote(true)}
                className="p-0.5 mt-0.5 hover:bg-amber-50 dark:hover:bg-amber-950/40 rounded text-amber-600 dark:text-amber-400 shrink-0 cursor-pointer transition-colors"
                title="Sửa trực tiếp ghi chú"
              >
                <Pencil className="h-3.5 w-3.5" />
              </button>

              <div className="relative flex-1 min-w-0">
                <p
                  className={cn(
                    'text-xs leading-relaxed font-semibold italic text-amber-600 dark:text-amber-400 cursor-pointer',
                    !isNoteExpanded && 'line-clamp-2'
                  )}
                  onClick={() => setIsNoteExpanded(!isNoteExpanded)}
                  title="Nhấp để xem đầy đủ / thu gọn ghi chú"
                >
                  {noteText ? (
                    <>
                      {noteText}
                      <span className="ml-1.5 text-xs font-normal not-italic text-amber-700 dark:text-amber-300 hover:underline cursor-pointer select-none">
                        {isNoteExpanded ? 'Thu gọn' : '... xem thêm'}
                      </span>
                    </>
                  ) : (
                    <span className="italic text-muted-foreground font-normal">
                      Thói quen, sở thích và mục tiêu học tập
                    </span>
                  )}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
