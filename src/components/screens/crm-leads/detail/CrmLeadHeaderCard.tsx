'use client'

import { useState } from 'react'
import {
  ArrowLeft,
  Pencil,
  Check,
  ExternalLink,
  Sparkles,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import { AppAvatar } from '@/components/shared'
import type { Lead } from '@/mocks/crmLeads'

interface CrmLeadHeaderCardProps {
  lead: Lead
  onBack: () => void
  onOpenDetailModal?: () => void
  onOpenHistoryModal?: () => void
  onUpdateNote?: (newNote: string) => void
  onUpdateLead?: (updatedLead: Lead) => void
  onReactivateCycle?: () => void
  basePath?: string
}

export function CrmLeadHeaderCard({
  lead,
  onBack,
  onOpenDetailModal,
  onOpenHistoryModal: _onOpenHistoryModal,
  onUpdateNote,
  onUpdateLead,
  onReactivateCycle,
  basePath: _basePath,
}: CrmLeadHeaderCardProps) {
  const [isEditingNote, setIsEditingNote] = useState(false)
  const [noteText, setNoteText] = useState(
    lead.lastNote ||
      'Học viên tích cực, thích hoạt động nhóm, cần động viên nhiều hơn khi làm bài tập cá nhân.'
  )
  const [isNoteExpanded, setIsNoteExpanded] = useState(false)

  const birthDate = lead.birthYear
    ? `NS: ${lead.birthYear} (${lead.studentAge} tuổi)`
    : `NS: 2016 (10 tuổi)`
  const address = lead.address || 'Số 45 Nguyễn Tuân, Thanh Xuân, Hà Nội'

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
      {/* Top row: Back Button + Avatar + Tên Học viên & Thông tin trường/học lực */}
      <div className="flex items-start sm:items-center justify-between gap-3">
        {/* Bên trái: Nút Back + Avatar + Thông tin chủ thể */}
        <div className="flex items-start sm:items-center gap-3 min-w-0 flex-1">
          {/* Nút Back tròn */}
          <Button
            variant="outline"
            size="icon"
            className="h-9 w-9 rounded-full shrink-0 border-border/70 hover:bg-muted text-muted-foreground hover:text-foreground cursor-pointer"
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
              name={lead.studentName || 'Student'}
              size="lg"
              className="border-2 border-background shadow-xs shrink-0 h-13 w-13 pointer-events-none"
            />
          </button>

          {/* Cụm thông tin chủ thể */}
          <div className="min-w-0 space-y-1 flex-1">
            <div className="flex items-center gap-2 flex-wrap leading-tight">
              <span
                onClick={onOpenDetailModal}
                className="text-base font-bold text-foreground hover:text-primary cursor-pointer transition-colors shrink-0"
                title="Nhấp để mở chi tiết hồ sơ"
              >
                {lead.studentName}
              </span>

              {/* Nút Xem chi tiết hồ sơ đặt ngay cạnh tên */}
              {onOpenDetailModal && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={onOpenDetailModal}
                  className="h-6 px-2 text-[11px] font-semibold text-primary border-primary/30 hover:bg-primary/10 cursor-pointer shadow-3xs flex items-center gap-1 rounded-md shrink-0"
                  title="Mở toàn bộ biểu mẫu hồ sơ khách hàng để xem hoặc cập nhật chi tiết"
                >
                  <span>Xem chi tiết hồ sơ</span>
                  <ExternalLink className="h-2.5 w-2.5 opacity-80" />
                </Button>
              )}

              {/* Nút Kích hoạt Chu kỳ Bán mới nếu Lead đã Chuyển đổi hoặc Thất bại */}
              {(lead.status === 'that_bai' || lead.status === 'chuyen_doi' || lead.status === 'tam_dung') && onReactivateCycle && (
                <Button
                  size="sm"
                  onClick={onReactivateCycle}
                  className="h-6 px-2 text-[11px] font-semibold text-white bg-amber-600 hover:bg-amber-700 cursor-pointer shadow-3xs flex items-center gap-1 rounded-md shrink-0"
                  title="Kích hoạt bán mới (Win-back / Tái tiếp cận)"
                >
                  <Sparkles className="h-3 w-3" />
                  <span>Kích hoạt lại</span>
                </Button>
              )}
            </div>

            {/* Dòng thông tin: Năm sinh, Giới tính, Địa chỉ */}
            <div className="flex items-center gap-2 text-xs text-muted-foreground font-medium flex-wrap">
              <span className="shrink-0">{birthDate}</span>
              <span className="text-muted-foreground/40 shrink-0">•</span>
              <span className="shrink-0">{lead.studentGender || 'Nữ'}</span>
              <span className="text-muted-foreground/40 shrink-0">•</span>
              <span className="truncate max-w-[320px]" title={address}>
                📍 {address}
              </span>
            </div>
          </div>
        </div>
      </div>

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

