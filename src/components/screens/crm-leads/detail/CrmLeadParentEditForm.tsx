'use client'

import React from 'react'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import type { ParentContact } from './CrmLeadParentCard'

export interface CrmLeadParentEditFormProps {
  editedParent: ParentContact
  setEditedParent: React.Dispatch<React.SetStateAction<ParentContact>>
}

export function CrmLeadParentEditForm({
  editedParent,
  setEditedParent,
}: CrmLeadParentEditFormProps) {
  return (
    <div className="space-y-3">
      {/* ============================================================ */}
      {/* CỤM 1: THÔNG TIN PHỤ HUYNH (EDIT)                            */}
      {/* (Họ tên, Vai trò, SĐT, Email quản lý ở modal Chi tiết KH)     */}
      {/* ============================================================ */}
      <div className="p-3.5 rounded-xl border border-sky-100 dark:border-sky-900/40 bg-card space-y-3 shadow-2xs">
        <div className="text-xs font-semibold text-sky-700 dark:text-sky-400 pb-2 border-b border-sky-100 dark:border-sky-900/30 flex items-center justify-between">
          <span>Thông tin phụ huynh</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          <div className="space-y-1">
            <label className="text-[11px] font-normal text-muted-foreground">Nghề nghiệp / Vị trí</label>
            <Input
              value={editedParent.occupation || ''}
              onChange={(e) => setEditedParent((p) => ({ ...p, occupation: e.target.value }))}
              placeholder="VD: Kế toán trưởng - FPT Software..."
              className="h-8 text-xs bg-background"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-normal text-muted-foreground">Ngân sách học tập / tháng</label>
            <Input
              value={editedParent.budgetPerMonth || ''}
              onChange={(e) => setEditedParent((p) => ({ ...p, budgetPerMonth: e.target.value }))}
              placeholder="VD: 3.000.000đ - 5.000.000đ/tháng"
              className="h-8 text-xs bg-background"
            />
          </div>

          <div className="sm:col-span-2 space-y-1">
            <label className="text-[11px] font-normal text-muted-foreground">Quyền hạn quyết định</label>
            <Input
              value={editedParent.decisionMakerRole || ''}
              onChange={(e) => setEditedParent((p) => ({ ...p, decisionMakerRole: e.target.value }))}
              placeholder="VD: Mẹ toàn quyền quyết định tài chính & chương trình"
              className="h-8 text-xs bg-background"
            />
          </div>
        </div>
      </div>

      {/* ============================================================ */}
      {/* CỤM 2: KÊNH LIÊN HỆ & THỜI GIAN LIÊN LẠC (EDIT)              */}
      {/* ============================================================ */}
      <div className="p-3.5 rounded-xl border border-blue-100 dark:border-blue-900/40 bg-card space-y-3 shadow-2xs">
        <div className="text-xs font-semibold text-blue-700 dark:text-blue-400 pb-2 border-b border-blue-100 dark:border-blue-900/30 flex items-center justify-between">
          <span>Kênh liên hệ &amp; Thời gian liên lạc</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          <div className="space-y-1">
            <label className="text-[11px] font-normal text-muted-foreground">Kênh ưu tiên</label>
            <Select
              value={editedParent.preferredChannel}
              onValueChange={(val) => setEditedParent((p) => ({ ...p, preferredChannel: val }))}
            >
              <SelectTrigger className="h-8 text-xs bg-background">
                <SelectValue placeholder="Chọn kênh" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Ưu tiên Zalo">Ưu tiên Zalo</SelectItem>
                <SelectItem value="Ưu tiên Gọi điện">Ưu tiên Gọi điện</SelectItem>
                <SelectItem value="Gặp trực tiếp">Gặp trực tiếp</SelectItem>
                <SelectItem value="Email">Email</SelectItem>
                <SelectItem value="Facebook">Facebook</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-normal text-muted-foreground">Trạng thái Zalo</label>
            <Select
              value={editedParent.zaloStatus}
              onValueChange={(val) => setEditedParent((p) => ({ ...p, zaloStatus: val }))}
            >
              <SelectTrigger className="h-8 text-xs bg-background">
                <SelectValue placeholder="Trạng thái Zalo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Đã kết bạn Zalo">Đã kết bạn Zalo</SelectItem>
                <SelectItem value="Chưa kết bạn Zalo">Chưa kết bạn Zalo</SelectItem>
                <SelectItem value="Đã gửi lời mời">Đã gửi lời mời</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="sm:col-span-2 space-y-1">
            <label className="text-[11px] font-normal text-muted-foreground">Khung giờ vàng liên lạc</label>
            <Input
              value={editedParent.bestTimeToCall || ''}
              onChange={(e) => setEditedParent((p) => ({ ...p, bestTimeToCall: e.target.value }))}
              placeholder="VD: 12h00 - 13h30 hoặc sau 18h30 (Không gọi số lạ buổi sáng)"
              className="h-8 text-xs bg-background"
            />
          </div>

          {/* Các liên hệ khác (Mạng xã hội / Kênh mở rộng) */}
          <div className="sm:col-span-2 pt-1 border-t border-blue-100/60 dark:border-blue-900/20 space-y-2">
            <span className="text-[11px] font-medium text-muted-foreground block">
              Các kênh liên hệ khác (Mạng xã hội)
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <div className="space-y-1">
                <label className="text-[10px] text-muted-foreground">Facebook</label>
                <Input
                  value={editedParent.facebook || ''}
                  onChange={(e) => setEditedParent((p) => ({ ...p, facebook: e.target.value }))}
                  placeholder="fb.com/username hoặc tên FB"
                  className="h-8 text-xs bg-background"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] text-muted-foreground">Instagram</label>
                <Input
                  value={editedParent.instagram || ''}
                  onChange={(e) => setEditedParent((p) => ({ ...p, instagram: e.target.value }))}
                  placeholder="@username"
                  className="h-8 text-xs bg-background"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] text-muted-foreground">Zalo (SĐT / Link)</label>
                <Input
                  value={editedParent.zaloPhone || ''}
                  onChange={(e) => setEditedParent((p) => ({ ...p, zaloPhone: e.target.value }))}
                  placeholder="Số điện thoại hoặc link Zalo"
                  className="h-8 text-xs bg-background"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ============================================================ */}
      {/* CỤM 3: KỲ VỌNG & TÂM LÝ PHỤ HUYNH (EDIT)                    */}
      {/* ============================================================ */}
      <div className="p-3.5 rounded-xl border border-purple-100 dark:border-purple-900/40 bg-card space-y-3 shadow-2xs">
        <div className="text-xs font-semibold text-purple-700 dark:text-purple-400 pb-2 border-b border-purple-100 dark:border-purple-900/30 flex items-center justify-between">
          <span>Kỳ vọng &amp; Tâm lý phụ huynh</span>
        </div>
        <div className="space-y-2.5">
          <div className="space-y-1">
            <label className="text-[11px] font-normal text-muted-foreground">Kỳ vọng đối với chương trình học của con</label>
            <Textarea
              value={editedParent.parentExpectation || ''}
              onChange={(e) => setEditedParent((p) => ({ ...p, parentExpectation: e.target.value }))}
              placeholder="Nhập kỳ vọng lớn nhất của phụ huynh..."
              className="min-h-16 text-xs bg-background font-normal"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-normal text-muted-foreground">Nỗi đau / Rào cản từ trung tâm cũ</label>
            <Textarea
              value={editedParent.parentPainPoint || ''}
              onChange={(e) => setEditedParent((p) => ({ ...p, parentPainPoint: e.target.value }))}
              placeholder="Nhập nỗi đau hoặc rào cản phụ huynh từng trải qua..."
              className="min-h-16 text-xs bg-background font-normal"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-normal text-muted-foreground">Lưu ý tâm lý tư vấn &amp; Bí quyết chốt sales</label>
            <Textarea
              value={editedParent.parentPersonalityNote || ''}
              onChange={(e) => setEditedParent((p) => ({ ...p, parentPersonalityNote: e.target.value }))}
              placeholder="Ghi chú đặc điểm tâm lý, sở thích trao đổi..."
              className="min-h-16 text-xs bg-background font-normal"
            />
          </div>
        </div>
      </div>
    </div>
  )
}
