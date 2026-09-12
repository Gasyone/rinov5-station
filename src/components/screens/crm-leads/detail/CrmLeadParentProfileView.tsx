'use client'

import React, { useState } from 'react'
import {
  MapPin,
  Navigation,
  ExternalLink,
  Phone,
  Mail,
  Copy,
  Pencil,
  Maximize2,
  X,
  Save,
  ChevronDown,
  ChevronUp,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { cn } from '@/lib/utils'
import type { ParentContact } from './CrmLeadParentCard'

export interface CrmLeadParentProfileViewProps {
  parent: ParentContact
  isEditing: boolean
  editedParent: ParentContact
  setEditedParent: React.Dispatch<React.SetStateAction<ParentContact>>
  allParents?: ParentContact[]
  onSelectParent?: (parent: ParentContact) => void
  onSetPrimary?: (parent: ParentContact) => void
  onCopyPhone?: (phone: string, name: string) => void
  onCall?: (phone: string, name: string) => void
  onZalo?: (phone: string, name: string) => void
  onStartEdit?: () => void
  onCancelEdit?: () => void
  onSave?: () => void
  onZoom?: () => void
}

export function CrmLeadParentProfileView({
  parent,
  isEditing,
  editedParent,
  setEditedParent,
  onCopyPhone,
  onStartEdit,
  onCancelEdit,
  onSave,
  onZoom,
}: CrmLeadParentProfileViewProps) {
  const [isChannelsExpanded, setIsChannelsExpanded] = useState(false)

  return (
    <div className="space-y-3.5">
      {/* ============================================================ */}
      {/* THẺ ĐỊNH DANH PHỤ HUYNH                                    */}
      {/* ============================================================ */}
      <div className="rounded-xl border border-border/70 bg-card p-3 space-y-2">
        {/* Dòng 1: Tên & Vai trò (trái) + Action buttons Sửa/Zoom (nổi ở cạnh phải dòng 1) */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 flex-wrap min-w-0">
            <h4 className="text-base font-semibold text-foreground truncate">
              {isEditing ? editedParent.name : parent.name}
            </h4>
            <Badge variant="outline" className="bg-muted/40 text-muted-foreground border-border/60 font-normal text-[11px] shrink-0">
              {isEditing ? editedParent.role : parent.role}
            </Badge>
            {parent.isPrimary && (
              <Badge className="bg-emerald-600/90 text-white font-normal text-[10px] shrink-0">
                Liên hệ chính
              </Badge>
            )}
          </div>

          {/* Action buttons (Chỉ nằm gọn ở Dòng 1) */}
          {!isEditing ? (
            <div className="flex items-center gap-0.5 shrink-0">
              {(onStartEdit || onZoom) && (
                <>
                  {onStartEdit && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={onStartEdit}
                      className="h-7 w-7 rounded-lg text-muted-foreground hover:text-sky-700 hover:bg-sky-100/70 dark:hover:bg-sky-950 dark:hover:text-sky-300 cursor-pointer transition-colors shadow-none border-0"
                      title="Chỉnh sửa chân dung phụ huynh"
                    >
                      <Pencil className="h-3.5 w-3.5" />
                    </Button>
                  )}
                  {onZoom && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={onZoom}
                      className="h-7 w-7 rounded-lg text-muted-foreground hover:text-sky-700 hover:bg-sky-100/70 dark:hover:bg-sky-950 dark:hover:text-sky-300 cursor-pointer transition-colors shadow-none border-0"
                      title="Phóng to chân dung phụ huynh"
                    >
                      <Maximize2 className="h-3.5 w-3.5" />
                    </Button>
                  )}
                </>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-1.5 shrink-0">
              {onCancelEdit && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={onCancelEdit}
                  className="h-7 px-2.5 text-xs font-semibold text-muted-foreground hover:text-destructive hover:bg-destructive/10 cursor-pointer transition-colors border-border/80"
                  title="Hủy chỉnh sửa"
                >
                  <X className="h-3.5 w-3.5 mr-1" />
                  <span>Hủy</span>
                </Button>
              )}
              {onSave && (
                <Button
                  type="button"
                  size="sm"
                  onClick={onSave}
                  className="h-7 px-3 text-xs font-bold bg-sky-600 hover:bg-sky-700 text-white cursor-pointer transition-colors shadow-2xs"
                  title="Lưu thay đổi"
                >
                  <Save className="h-3.5 w-3.5 mr-1" />
                  <span>Lưu</span>
                </Button>
              )}
            </div>
          )}
        </div>

        {/* Dòng 2: SĐT & Email */}
        <div className="flex items-center gap-2.5 text-xs text-muted-foreground flex-wrap">
          {/* Số điện thoại */}
          <div className="flex items-center gap-1 shrink-0">
            <Phone className="h-3 w-3 text-muted-foreground/70" />
            <span className="font-mono font-normal text-foreground">{parent.phone}</span>
            <button
              type="button"
              onClick={() => onCopyPhone?.(parent.phone, parent.name)}
              className="p-0.5 text-muted-foreground hover:text-foreground cursor-pointer rounded transition-colors"
              title="Sao chép số điện thoại"
            >
              <Copy className="h-2.5 w-2.5" />
            </button>
          </div>

          {/* Email */}
          {parent.email && (
            <>
              <span className="text-muted-foreground/40">•</span>
              <div className="flex items-center gap-1 min-w-0">
                <Mail className="h-3 w-3 text-sky-600 shrink-0" />
                <span className="text-foreground truncate">{parent.email}</span>
              </div>
            </>
          )}
        </div>

        {/* Dòng 3 & 4: Địa chỉ cư trú, Mở Map và Khoảng cách với 3 cơ sở gần nhất */}
        {(() => {
          const displayAddr =
            !parent.address || parent.address === 'Cùng địa chỉ gia đình'
              ? 'Phường Bến Nghé, Quận 1, TP.HCM'
              : parent.address
          const mapUrl =
            parent.mapLink ||
            `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(displayAddr)}`

          const targetBranch = parent.nearestBranch || 'RinoEdu Nguyễn Tuân'

          const nearestBranches =
            parent.nearestBranches && parent.nearestBranches.length > 0
              ? parent.nearestBranches
              : targetBranch.includes('Linh Đàm')
                ? [
                    { name: 'RinoEdu Linh Đàm', distance: '~1.2 km' },
                    { name: 'RinoEdu Nguyễn Tuân', distance: '~3.5 km' },
                    { name: 'RinoEdu Smart City', distance: '~5.2 km' },
                  ]
                : targetBranch.includes('Smart City')
                  ? [
                      { name: 'RinoEdu Smart City', distance: '~1.1 km' },
                      { name: 'RinoEdu Nguyễn Tuân', distance: '~4.2 km' },
                      { name: 'RinoEdu Linh Đàm', distance: '~5.8 km' },
                    ]
                  : [
                      { name: 'RinoEdu Nguyễn Tuân', distance: '~1.2 km' },
                      { name: 'RinoEdu Linh Đàm', distance: '~3.5 km' },
                      { name: 'RinoEdu Smart City', distance: '~4.8 km' },
                    ]

          return (
            <div className="space-y-1.5 pt-0.5">
              {/* Dòng địa chỉ & Mở Map */}
              <div className="flex items-center gap-1.5 min-w-0 text-xs text-muted-foreground flex-wrap">
                <MapPin className="h-3 w-3 text-rose-500 shrink-0" />
                <span className="text-foreground truncate" title={displayAddr}>
                  {displayAddr}
                </span>
                <span className="text-muted-foreground/40">•</span>
                <a
                  href={mapUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-[11px] text-sky-600 hover:text-sky-700 dark:text-sky-400 font-medium hover:underline shrink-0"
                  title="Mở Google Maps"
                >
                  <span>Mở map</span>
                  <ExternalLink className="h-2.5 w-2.5" />
                </a>
              </div>

              {/* Dòng riêng biệt: Khoảng cách với 3 cơ sở gần nhất (flex-wrap tự nhiên, không overflow-x-auto, không scrollbar) */}
              <div className="flex items-center gap-1.5 text-[11px] flex-wrap pt-0.5">
                <Navigation className="h-3 w-3 text-emerald-600 shrink-0" />
                {nearestBranches.map((b, idx) => {
                  const cleanName = b.name
                  const cleanDistance = b.distance.replace('~', '').trim()

                  return (
                    <span
                      key={b.name}
                      className={cn(
                        'inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[11px] shrink-0 transition-colors',
                        idx === 0
                          ? 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-300 font-semibold border border-emerald-200/80 dark:border-emerald-800/80'
                          : 'bg-muted/40 text-muted-foreground border border-border/50 font-normal'
                      )}
                    >
                      {idx === 0 && <MapPin className="h-2.5 w-2.5 text-emerald-600 shrink-0" />}
                      <span className={idx === 0 ? 'font-semibold' : 'text-foreground/80'}>{cleanName}</span>
                      <span className={cn('font-mono font-medium', idx === 0 ? 'text-emerald-700 dark:text-emerald-400 font-bold' : 'text-muted-foreground')}>
                        {cleanDistance}
                      </span>
                    </span>
                  )
                })}
              </div>
            </div>
          )
        })()}
      </div>

      {/* ============================================================ */}
      {/* 3. NỘI DUNG CHÂN DUNG TOÀN DIỆN (GỘP TRÊN 1 VIEW DUY NHẤT)    */}
      {/* ============================================================ */}
      {isEditing ? (
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
      ) : (
        <div className="space-y-3">
          {/* ============================================================ */}
          {/* CỤM 1: THÔNG TIN PHỤ HUYNH                                   */}
          {/* Nghề nghiệp đưa lên cạnh phải, Ngân sách và Ghi chú ở dưới    */}
          {/* ============================================================ */}
          <div className="p-3 rounded-xl border border-border/70 bg-card space-y-2">
            <div className="text-xs pb-1.5 border-b border-border/60 flex items-center justify-between gap-2 flex-wrap">
              <span className="font-bold text-foreground">Thông tin phụ huynh</span>
              <span
                className={cn(
                  "text-xs font-semibold truncate max-w-[60%]",
                  parent.occupation ? "text-foreground" : "text-muted-foreground/80 italic font-normal"
                )}
                title={parent.occupation}
              >
                {parent.occupation || 'Chưa cập nhật nghề nghiệp'}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              {/* Ngân sách học tập */}
              <div className="space-y-0.5 min-w-0">
                <span className="text-[11px] text-muted-foreground font-medium block">
                  Ngân sách học tập / tháng
                </span>
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span
                    className={cn(
                      "font-semibold text-xs",
                      parent.budgetPerMonth ? "text-emerald-600 dark:text-emerald-400" : "text-muted-foreground/80 italic font-normal"
                    )}
                  >
                    {parent.budgetPerMonth || 'Chưa cập nhật'}
                  </span>
                  {parent.financialSegment && (
                    <Badge
                      variant="outline"
                      className="text-[10px] py-0 px-1.5 font-medium bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800 shrink-0"
                    >
                      {parent.financialSegment}
                    </Badge>
                  )}
                </div>
              </div>

              {/* Quyền hạn quyết định & Ghi chú */}
              <div className="space-y-0.5 min-w-0">
                <span className="text-[11px] text-muted-foreground font-medium block">
                  Quyền hạn quyết định
                </span>
                <p
                  className={cn(
                    "text-xs truncate",
                    parent.decisionMakerRole ? "text-foreground" : "text-muted-foreground/80 italic font-normal"
                  )}
                  title={parent.decisionMakerRole}
                >
                  {parent.decisionMakerRole || 'Chưa cập nhật'}
                </p>
              </div>
            </div>
          </div>

          {/* ============================================================ */}
          {/* CỤM 2: KÊNH LIÊN HỆ & THỜI GIAN LIÊN LẠC                     */}
          {/* Tên kênh lựa chọn ở cạnh phải, icon thu gọn/mở rộng ở góc   */}
          {/* ============================================================ */}
          <div className="p-3 rounded-xl border border-border/70 bg-card space-y-2">
            {(() => {
              const rawChannel = parent.preferredChannel || 'Gọi điện'
              const cleanChannelName = rawChannel
                .replace(/^Ưu tiên\s+/i, '')
                .replace(/\s*trong giờ hành chính/i, '')
                .replace(/\s*ngoài giờ hành chính/i, '')
                .trim() || 'Gọi điện'

              return (
                <div className="text-xs pb-1.5 border-b border-border/60 flex items-center justify-between gap-2 flex-wrap">
                  <span className="font-bold text-foreground">Kênh liên hệ</span>
                  <div className="flex items-center gap-1.5 flex-wrap shrink-0">
                    <span className="text-xs font-semibold text-sky-700 dark:text-sky-300">
                      {cleanChannelName}
                    </span>
                    {parent.zaloStatus && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-medium text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 px-1.5 py-0.5 rounded">
                        <span className="h-1.5 w-1.5 rounded-full bg-blue-500" />
                        <span>{parent.zaloStatus}</span>
                      </span>
                    )}

                    {/* Icon Thu gọn / Mở rộng đưa lên header cạnh phải, chỉ để icon */}
                    <button
                      type="button"
                      onClick={() => setIsChannelsExpanded((prev) => !prev)}
                      className="p-1 text-muted-foreground hover:text-foreground cursor-pointer rounded-md hover:bg-muted transition-colors ml-0.5"
                      title={isChannelsExpanded ? 'Thu gọn' : 'Xem thêm kênh liên hệ khác'}
                    >
                      {isChannelsExpanded ? (
                        <ChevronUp className="h-3.5 w-3.5" />
                      ) : (
                        <ChevronDown className="h-3.5 w-3.5" />
                      )}
                    </button>
                  </div>
                </div>
              )
            })()}

            <div className="space-y-1.5 text-xs">
              <div className="flex items-baseline gap-1.5 flex-wrap min-w-0">
                <span className="text-[11px] text-muted-foreground font-medium shrink-0">
                  Thời gian liên lạc:
                </span>
                <span
                  className={cn(
                    "text-xs font-medium",
                    parent.bestTimeToCall ? "text-amber-700 dark:text-amber-400" : "text-muted-foreground/80 italic font-normal"
                  )}
                >
                  {parent.bestTimeToCall || 'Chưa cập nhật khung giờ'}
                </span>
              </div>

              {/* Phần mở rộng: Xem thêm các kênh liên hệ khác */}
              {isChannelsExpanded && (
                <div className="pt-2 border-t border-border/50 space-y-1.5 animate-in fade-in-0 duration-150">
                  <div className="text-[11px] font-medium text-muted-foreground">
                    Các kênh liên hệ bổ sung:
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    {/* Facebook */}
                    <div className="flex items-center gap-1.5 min-w-0">
                      <span className="text-[11px] text-muted-foreground shrink-0">Facebook:</span>
                      {parent.facebook ? (
                        <a
                          href={parent.facebook.startsWith('http') ? parent.facebook : `https://${parent.facebook}`}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 text-xs text-sky-600 dark:text-sky-400 hover:underline truncate"
                        >
                          <span className="truncate">{parent.facebook}</span>
                          <ExternalLink className="h-2.5 w-2.5 shrink-0" />
                        </a>
                      ) : (
                        <span className="text-muted-foreground/70 italic text-[11px]">Chưa cập nhật</span>
                      )}
                    </div>

                    {/* Instagram */}
                    <div className="flex items-center gap-1.5 min-w-0">
                      <span className="text-[11px] text-muted-foreground shrink-0">Instagram:</span>
                      {parent.instagram ? (
                        <span className="text-pink-600 dark:text-pink-400 truncate">{parent.instagram}</span>
                      ) : (
                        <span className="text-muted-foreground/70 italic text-[11px]">Chưa cập nhật</span>
                      )}
                    </div>

                    {/* Zalo phụ / Zalo riêng */}
                    <div className="flex items-center gap-1.5 min-w-0 sm:col-span-2">
                      <span className="text-[11px] text-muted-foreground shrink-0">Zalo riêng:</span>
                      {parent.zaloPhone && parent.zaloPhone !== parent.phone ? (
                        <span className="text-sky-700 dark:text-sky-300 font-mono">{parent.zaloPhone}</span>
                      ) : (
                        <span className="text-muted-foreground/70 italic text-[11px]">Dùng chung số điện thoại chính ({parent.phone})</span>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* ============================================================ */}
          {/* CỤM 3: KỲ VỌNG & TÂM LÝ PHỤ HUYNH                            */}
          {/* Bỏ viền, bỏ nền các ô con, chỉ để text có màu               */}
          {/* ============================================================ */}
          <div className="p-3 rounded-xl border border-border/70 bg-card space-y-2">
            <div className="pb-1.5 border-b border-border/60">
              <span className="text-xs font-bold text-foreground">Kỳ vọng &amp; Tâm lý phụ huynh</span>
            </div>

            <div className="space-y-2 text-xs">
              {/* 1. Kỳ vọng số 1 đối với chương trình học */}
              <div className="space-y-0.5">
                <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-400 block">
                  Kỳ vọng đối với chương trình học:
                </span>
                <p
                  className={cn(
                    "text-xs leading-relaxed",
                    parent.parentExpectation ? "text-foreground/90" : "text-muted-foreground/80 italic font-normal"
                  )}
                >
                  {parent.parentExpectation || 'Chưa cập nhật (Cập nhật sau)'}
                </p>
              </div>

              {/* 2. Nỗi đau / Rào cản lớn nhất từ trung tâm cũ */}
              <div className="space-y-0.5">
                <span className="text-xs font-semibold text-amber-700 dark:text-amber-400 block">
                  Nỗi đau / Rào cản từ trung tâm cũ:
                </span>
                <p
                  className={cn(
                    "text-xs leading-relaxed",
                    parent.parentPainPoint ? "text-foreground/90" : "text-muted-foreground/80 italic font-normal"
                  )}
                >
                  {parent.parentPainPoint || 'Chưa cập nhật (Cập nhật sau)'}
                </p>
              </div>

              {/* 3. Lưu ý tâm lý tư vấn & Bí quyết chốt sales */}
              <div className="space-y-0.5">
                <span className="text-xs font-semibold text-indigo-700 dark:text-indigo-400 block">
                  Lưu ý tâm lý tư vấn &amp; Bí quyết chốt sales:
                </span>
                <p
                  className={cn(
                    "text-xs leading-relaxed",
                    parent.parentPersonalityNote ? "text-foreground/90" : "text-muted-foreground/80 italic font-normal"
                  )}
                >
                  {parent.parentPersonalityNote || 'Chưa cập nhật (Cập nhật sau)'}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
