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
  UserCheck,
  Users,
  GraduationCap,
} from 'lucide-react'
import { toast } from 'sonner'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { CrmLeadParentEditForm } from './CrmLeadParentEditForm'
import type { ParentContact } from './CrmLeadParentCard'
import type { SiblingLeadItem } from './leadSiblingsHelper'

export interface CrmLeadParentProfileViewProps {
  parent: ParentContact
  isEditing: boolean
  editedParent: ParentContact
  setEditedParent: React.Dispatch<React.SetStateAction<ParentContact>>
  allParents?: ParentContact[]
  siblingLeads?: SiblingLeadItem[]
  onSelectParent?: (parent: ParentContact) => void
  onSetPrimary?: (parent: ParentContact) => void
  onCopyPhone?: (phone: string, name: string) => void
  onCall?: (phone: string, name: string) => void
  onZalo?: (phone: string, name: string) => void
  onStartEdit?: () => void
  onCancelEdit?: () => void
  onSave?: () => void
  onZoom?: () => void
  leadCode?: string
  leadCreatedAt?: string
}

export function CrmLeadParentProfileView({
  parent,
  isEditing,
  editedParent,
  setEditedParent,
  allParents,
  siblingLeads,
  onSelectParent,
  onCopyPhone,
  onStartEdit,
  onCancelEdit,
  onSave,
  onZoom,
  leadCode,
  leadCreatedAt,
}: CrmLeadParentProfileViewProps) {
  const [isChannelsExpanded, setIsChannelsExpanded] = useState(false)

  return (
    <div className="space-y-3.5">
      {/* ============================================================ */}
      {/* THÔNG TIN PHỤ HUYNH / LEAD (GỘP CHÂN DUNG LEAD & PHỤ HUYNH)  */}
      {/* ============================================================ */}
      <div className="rounded-xl border border-border/70 bg-card p-3 space-y-3 shadow-2xs">
        {/* DÒNG TIÊU ĐỀ: THÔNG TIN PHỤ HUYNH + MÃ LEAD/NGÀY TẠO + CHỌN PHỤ HUYNH + ACTION BUTTONS */}
        <div className="flex items-start justify-between gap-2 pb-2 border-b border-border/60 text-xs flex-wrap">
          <div className="space-y-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-bold text-foreground text-xs flex items-center gap-1.5 shrink-0 mr-0.5">
                <UserCheck className="h-3.5 w-3.5 text-sky-600 dark:text-sky-400 shrink-0" />
                Thông tin Phụ huynh
              </span>

              {/* Chọn phụ huynh nếu gia đình có nhiều hơn 1 người liên hệ - Đưa lên header */}
              {allParents && allParents.length > 1 && onSelectParent && (
                <div className="flex items-center gap-1 flex-wrap">
                  {allParents.map((p) => {
                    const isSelected = parent.name === p.name
                    return (
                      <button
                        key={p.name}
                        type="button"
                        onClick={() => onSelectParent(p)}
                        className={cn(
                          'h-6 px-2 rounded-md text-[11px] font-medium transition-all flex items-center gap-1 cursor-pointer border shrink-0',
                          isSelected
                            ? 'bg-sky-600 text-white border-sky-600 shadow-xs font-semibold'
                            : 'bg-background hover:bg-muted text-foreground border-border/70'
                        )}
                      >
                        <span>
                          {p.role}: {p.name}
                        </span>
                        {p.isPrimary && (
                          <span
                            className={cn(
                              'text-[8px] px-1 rounded-xs font-bold uppercase',
                              isSelected
                                ? 'bg-white/20 text-white'
                                : 'bg-sky-100 text-sky-800 dark:bg-sky-900/60 dark:text-sky-200'
                            )}
                          >
                            Chính
                          </span>
                        )}
                      </button>
                    )
                  })}
                </div>
              )}
            </div>

            {/* Mã lead và Ngày tạo ở dưới title "Thông tin phụ huynh" ở header */}
            {(leadCode || leadCreatedAt) && (
              <div className="flex items-center gap-2 text-[11px] text-muted-foreground flex-wrap pl-5">
                {leadCode && (
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard.writeText(leadCode)
                      toast.success(`Đã sao chép mã Lead: ${leadCode}`)
                    }}
                    className="inline-flex items-center gap-1 font-mono text-[11px] text-muted-foreground hover:text-foreground transition-colors cursor-pointer shrink-0"
                    title="Nhấp để sao chép mã Lead"
                  >
                    <span>Mã: {leadCode}</span>
                    <Copy className="h-2.5 w-2.5 text-muted-foreground/70 hover:text-foreground" />
                  </button>
                )}
                {leadCode && leadCreatedAt && (
                  <span className="text-muted-foreground/40 shrink-0">•</span>
                )}
                {leadCreatedAt && (
                  <span className="text-[11px] text-muted-foreground font-normal shrink-0">
                    Ngày tạo: {leadCreatedAt}
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Action buttons (Sửa / Zoom / Lưu / Hủy) trên dòng tiêu đề Thông tin phụ huynh */}
          {!isEditing ? (
            <div className="flex items-center gap-0.5 shrink-0 ml-auto">
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
            </div>
          ) : (
            <div className="flex items-center gap-1.5 shrink-0 ml-auto">
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

        {/* NỘI DUNG THÔNG TIN PHỤ HUYNH: BỐ CỤC 2 CỘT SÓNG ĐÔI (ĐỊNH DANH & LIÊN HỆ vs VỊ TRÍ & CƠ SỞ) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 pt-0.5">
          {/* CỘT TRÁI: ĐỊNH DANH, LIÊN HỆ & CON KHÁC */}
          <div className="space-y-2 min-w-0">
            {/* Dòng 1: Tên & Vai trò */}
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


            {/* Dòng 3: Con khác (nếu có) */}
            {siblingLeads && siblingLeads.length > 0 && (
              <div className="flex items-center gap-1.5 text-[11px] flex-wrap pt-0.5">
                <span className="text-muted-foreground font-medium shrink-0 flex items-center gap-1">
                  <Users className="h-3 w-3 text-sky-600 dark:text-sky-400" />
                  Con khác:
                </span>
                <div className="flex items-center gap-1.5 flex-wrap">
                  {siblingLeads.map((sib) => (
                    <a
                      key={sib.id}
                      href={sib.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 h-5.5 px-2 rounded-md text-[11px] font-semibold text-sky-700 dark:text-sky-300 bg-sky-50 dark:bg-sky-950/40 hover:bg-sky-100 dark:hover:bg-sky-900/60 border border-sky-200/80 dark:border-sky-800/80 transition-colors cursor-pointer"
                      title={`Mở hồ sơ Lead của ${sib.name} trong tab mới`}
                    >
                      <GraduationCap className="h-3 w-3 text-sky-600 dark:text-sky-400" />
                      <span>{sib.name}</span>
                      <ExternalLink className="h-2 w-2 opacity-60 ml-0.5" />
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* CỘT PHẢI: ĐỊA CHỈ CƯ TRÚ & CƠ SỞ GẦN NHẤT */}
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
              <div className="space-y-2 min-w-0 md:border-l md:border-border/60 md:pl-3.5">
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

                {/* Dòng Khoảng cách với 3 cơ sở gần nhất */}
                <div className="flex items-center gap-1.5 text-[11px] flex-wrap">
                  <Navigation className="h-3 w-3 text-emerald-600 shrink-0" />
                  {nearestBranches.map((b, idx) => {
                    const cleanName = b.name
                    const cleanDistance = b.distance.replace('~', '').trim()
                    const branchMapUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(cleanName)}`

                    return (
                      <a
                        key={b.name}
                        href={branchMapUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={cn(
                          'inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[11px] shrink-0 transition-colors cursor-pointer hover:underline',
                          idx === 0
                            ? 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-300 font-semibold border border-emerald-200/80 dark:border-emerald-800/80 hover:text-emerald-900 dark:hover:text-emerald-200'
                            : 'bg-muted/40 text-muted-foreground border border-border/50 font-normal hover:text-foreground'
                        )}
                        title={`Mở vị trí ${cleanName} trên Google Maps`}
                      >
                        {idx === 0 && <MapPin className="h-2.5 w-2.5 text-emerald-600 shrink-0" />}
                        <span className={idx === 0 ? 'font-semibold' : 'text-foreground/80'}>{cleanName}</span>
                        <span className={cn('font-mono font-medium', idx === 0 ? 'text-emerald-700 dark:text-emerald-400 font-bold' : 'text-muted-foreground')}>
                          {cleanDistance}
                        </span>
                        <ExternalLink className="h-2 w-2 opacity-60 ml-0.5" />
                      </a>
                    )
                  })}
                </div>
              </div>
            )
          })()}
        </div>
      </div>

      {/* ============================================================ */}
      {/* 3. NỘI DUNG CHÂN DUNG TOÀN DIỆN (GỘP TRÊN 1 VIEW DUY NHẤT)    */}
      {/* ============================================================ */}
      {isEditing ? (
        <CrmLeadParentEditForm
          editedParent={editedParent}
          setEditedParent={setEditedParent}
        />
      ) : (
        <div className="space-y-3">
          {/* ============================================================ */}
          {/* CỤM GỘP: THÔNG TIN PHỤ HUYNH & KÊNH LIÊN HỆ (BỐ CỤC 2 CỘT)   */}
          {/* ============================================================ */}
          <div className="p-3 rounded-xl border border-border/70 bg-card space-y-2.5">
            {/* Header: Tiêu đề + Nghề nghiệp + Toggle mở rộng kênh */}
            {(() => {
              const rawChannel = parent.preferredChannel || 'Gọi điện'
              const cleanChannelName = rawChannel
                .replace(/^Ưu tiên\s+/i, '')
                .replace(/\s*trong giờ hành chính/i, '')
                .replace(/\s*ngoài giờ hành chính/i, '')
                .trim() || 'Gọi điện'

              return (
                <>
                  <div className="text-xs pb-1.5 border-b border-border/60 flex items-center justify-between gap-2 flex-wrap">
                    <div className="flex items-center gap-1.5 font-bold text-foreground">
                      <span>Thông tin phụ huynh & Kênh liên hệ</span>
                    </div>

                    <div className="flex items-center gap-2 flex-wrap shrink-0 ml-auto">
                      <span
                        className={cn(
                          "text-xs font-semibold truncate max-w-[200px]",
                          parent.occupation ? "text-foreground" : "text-muted-foreground/80 italic font-normal"
                        )}
                        title={parent.occupation}
                      >
                        {parent.occupation || 'Chưa cập nhật nghề nghiệp'}
                      </span>

                      {/* Icon Thu gọn / Mở rộng các kênh liên hệ khác */}
                      <button
                        type="button"
                        onClick={() => setIsChannelsExpanded((prev) => !prev)}
                        className="p-1 text-muted-foreground hover:text-foreground cursor-pointer rounded-md hover:bg-muted transition-colors"
                        title={isChannelsExpanded ? 'Thu gọn các kênh bổ sung' : 'Xem thêm kênh liên hệ khác (Facebook, Instagram...)'}
                      >
                        {isChannelsExpanded ? (
                          <ChevronUp className="h-3.5 w-3.5" />
                        ) : (
                          <ChevronDown className="h-3.5 w-3.5" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Bố cục 2 cột sóng đôi */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 text-xs">
                    {/* CỘT TRÁI: NGÂN SÁCH & QUYỀN HẠN QUYẾT ĐỊNH */}
                    <div className="space-y-2 min-w-0">
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

                      {/* Quyền hạn quyết định */}
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

                    {/* CỘT PHẢI: KÊNH LIÊN HỆ & THỜI GIAN LIÊN LẠC */}
                    <div className="space-y-2 min-w-0 md:border-l md:border-border/60 md:pl-3.5">
                      {/* Kênh ưu tiên & Trạng thái Zalo */}
                      <div className="space-y-0.5 min-w-0">
                        <span className="text-[11px] text-muted-foreground font-medium block">
                          Kênh liên hệ ưu tiên
                        </span>
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="text-xs font-semibold text-sky-700 dark:text-sky-300">
                            {cleanChannelName}
                          </span>
                          {parent.zaloStatus && (
                            <span className="inline-flex items-center gap-1 text-[10px] font-medium text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 px-1.5 py-0.5 rounded">
                              <span className="h-1.5 w-1.5 rounded-full bg-blue-500" />
                              <span>{parent.zaloStatus}</span>
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Khung giờ liên lạc */}
                      <div className="space-y-0.5 min-w-0">
                        <span className="text-[11px] text-muted-foreground font-medium block">
                          Thời gian liên lạc
                        </span>
                        <p
                          className={cn(
                            "text-xs font-medium truncate",
                            parent.bestTimeToCall ? "text-amber-700 dark:text-amber-400" : "text-muted-foreground/80 italic font-normal"
                          )}
                          title={parent.bestTimeToCall}
                        >
                          {parent.bestTimeToCall || 'Chưa cập nhật khung giờ'}
                        </p>
                      </div>
                    </div>
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
                </>
              )
            })()}
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
