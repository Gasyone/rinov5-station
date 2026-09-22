'use client'

import React, { useState } from 'react'
import {
  UserCheck,
  Phone,
  Mail,
  Copy,
  MapPin,
  Navigation,
  ExternalLink,
  Pencil,
  Plus,
  Save,
  X,
  Users,
  GraduationCap,
} from 'lucide-react'
import { toast } from 'sonner'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { cn } from '@/lib/utils'
import type { CustomerProfileParent } from '../crmCustomerProfileTypes'

interface CrmCustomerParentsTabProps {
  parents: CustomerProfileParent[]
  onUpdateParents: (parents: CustomerProfileParent[]) => void
  leadCode?: string
  leadCreatedAt?: string
  siblingNames?: string[]
}

export function CrmCustomerParentsTab({
  parents,
  onUpdateParents,
  leadCode = 'LD-10291-A',
  leadCreatedAt = '2026-08-10',
  siblingNames = ['Bé Bình'],
}: CrmCustomerParentsTabProps) {
  const [selectedParentId, setSelectedParentId] = useState<string>(
    parents.find((p) => p.isPrimary)?.id || parents[0]?.id || ''
  )
  const [isEditing, setIsEditing] = useState(false)
  const [isAddingNew, setIsAddingNew] = useState(false)

  const currentParent =
    parents.find((p) => p.id === selectedParentId) || parents[0] || null

  // Local state for editing current parent
  const [editForm, setEditForm] = useState<CustomerProfileParent | null>(currentParent)

  const handleSelectParent = (p: CustomerProfileParent) => {
    setSelectedParentId(p.id)
    setEditForm(p)
    setIsEditing(false)
    setIsAddingNew(false)
  }

  const handleStartEdit = () => {
    setEditForm(currentParent)
    setIsEditing(true)
  }

  const handleCancelEdit = () => {
    setEditForm(currentParent)
    setIsEditing(false)
    setIsAddingNew(false)
  }

  const handleSaveEdit = () => {
    if (!editForm) return
    if (!editForm.name.trim()) {
      toast.error('Vui lòng nhập họ và tên phụ huynh.')
      return
    }
    if (!editForm.phone.trim()) {
      toast.error('Vui lòng nhập số điện thoại.')
      return
    }

    if (isAddingNew) {
      const updated = [...parents, { ...editForm, id: `parent-${Date.now()}` }]
      onUpdateParents(updated)
      setSelectedParentId(editForm.id)
      setIsAddingNew(false)
      setIsEditing(false)
      toast.success(`Đã thêm phụ huynh: ${editForm.name}`)
    } else {
      const updated = parents.map((p) => (p.id === editForm.id ? editForm : p))
      onUpdateParents(updated)
      setIsEditing(false)
      toast.success(`Đã lưu thông tin phụ huynh: ${editForm.name}`)
    }
  }

  const handleAddNewParent = () => {
    const newParent: CustomerProfileParent = {
      id: `parent-new-${Date.now()}`,
      name: '',
      role: 'Bố',
      phone: '',
      email: '',
      isPrimary: false,
      occupation: '',
      financialSegment: 'Thu nhập ổn định',
      budgetPerMonth: '3.000.000đ - 5.000.000đ/tháng',
      decisionMakerRole: 'Tham khảo & hỗ trợ đưa đón con',
      preferredChannel: 'Gọi điện',
      bestTimeToCall: 'Sau 18h30 các ngày trong tuần',
      zaloStatus: 'Chưa kết nối',
      address: currentParent?.address || 'Phường Bến Nghé, Quận 1, TP.HCM',
      parentExpectation: '',
      parentPainPoint: '',
      parentPersonalityNote: '',
    }
    setEditForm(newParent)
    setIsAddingNew(true)
    setIsEditing(true)
  }

  const handleSetPrimary = (parentId: string) => {
    const updated = parents.map((p) => ({
      ...p,
      isPrimary: p.id === parentId,
    }))
    onUpdateParents(updated)
    toast.success('Đã cập nhật người liên hệ chính.')
  }

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text)
    toast.success(`Đã sao chép ${label}: ${text}`)
  }

  if (!currentParent && !isAddingNew) {
    return (
      <div className="p-8 text-center text-muted-foreground bg-card rounded-xl border border-border">
        <Users className="h-10 w-10 mx-auto text-muted-foreground/50 mb-2" />
        <p className="text-sm">Chưa có thông tin phụ huynh.</p>
        <Button size="sm" onClick={handleAddNewParent} className="mt-3">
          <Plus className="h-4 w-4 mr-1" /> Thêm phụ huynh
        </Button>
      </div>
    )
  }

  const activeParent = isEditing && editForm ? editForm : currentParent

  return (
    <div className="space-y-3.5">
      {/* ============================================================ */}
      {/* 1. KHỐI ĐẦU: SELECTOR TỪNG PHỤ HUYNH & HEADER (NHƯ ẢNH 2)     */}
      {/* ============================================================ */}
      <div className="rounded-xl border border-border/70 bg-card p-3 space-y-3 shadow-2xs">
        <div className="flex items-start justify-between gap-2 pb-2 border-b border-border/60 text-xs flex-wrap">
          <div className="space-y-1.5 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-bold text-foreground text-xs flex items-center gap-1.5 shrink-0 mr-1">
                <UserCheck className="h-4 w-4 text-sky-600 dark:text-sky-400 shrink-0" />
                Thông tin Phụ huynh
              </span>

              {/* Tabs chọn từng phụ huynh */}
              <div className="flex items-center gap-1.5 flex-wrap">
                {parents.map((p) => {
                  const isSelected = !isAddingNew && p.id === selectedParentId
                  return (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => handleSelectParent(p)}
                      className={cn(
                        'h-6.5 px-2.5 rounded-md text-[11px] font-medium transition-all flex items-center gap-1.5 cursor-pointer border shrink-0',
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
                            'text-[9px] px-1 py-0.5 rounded-xs font-bold uppercase',
                            isSelected
                              ? 'bg-white/25 text-white'
                              : 'bg-sky-100 text-sky-800 dark:bg-sky-900/60 dark:text-sky-200'
                          )}
                        >
                          Chính
                        </span>
                      )}
                    </button>
                  )
                })}

                {/* Nút thêm phụ huynh mới */}
                <button
                  type="button"
                  onClick={handleAddNewParent}
                  className={cn(
                    'h-6.5 px-2 rounded-md text-[11px] font-medium transition-all flex items-center gap-1 cursor-pointer border border-dashed shrink-0',
                    isAddingNew
                      ? 'bg-sky-600 text-white border-sky-600 font-semibold'
                      : 'border-sky-300 dark:border-sky-800 text-sky-700 dark:text-sky-400 hover:bg-sky-50 dark:hover:bg-sky-950/40'
                  )}
                >
                  <Plus className="h-3 w-3" />
                  <span>Thêm phụ huynh</span>
                </button>
              </div>
            </div>

            {/* Mã lead và Ngày tạo */}
            <div className="flex items-center gap-2 text-[11px] text-muted-foreground flex-wrap">
              <span className="font-mono">Mã: {leadCode}</span>
              <span className="text-muted-foreground/40">•</span>
              <span>Ngày tạo: {leadCreatedAt}</span>
            </div>
          </div>

          {/* Action buttons (Sửa / Lưu / Hủy / Đặt làm chính) */}
          <div className="flex items-center gap-1.5 shrink-0 ml-auto">
            {!isEditing ? (
              <>
                {!currentParent?.isPrimary && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => handleSetPrimary(currentParent.id)}
                    className="h-7 px-2 text-xs text-sky-700 dark:text-sky-400 border-sky-200 dark:border-sky-800 hover:bg-sky-50"
                  >
                    Đặt làm liên hệ chính
                  </Button>
                )}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleStartEdit}
                  className="h-7 px-2.5 text-xs font-semibold text-primary border-primary/30 hover:bg-primary/10"
                >
                  <Pencil className="h-3 w-3 mr-1" />
                  <span>Sửa hồ sơ</span>
                </Button>
              </>
            ) : (
              <div className="flex items-center gap-1.5">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleCancelEdit}
                  className="h-7 px-2.5 text-xs text-muted-foreground hover:text-destructive"
                >
                  <X className="h-3 w-3 mr-1" />
                  <span>Hủy</span>
                </Button>
                <Button
                  type="button"
                  size="sm"
                  onClick={handleSaveEdit}
                  className="h-7 px-3 text-xs font-bold bg-sky-600 hover:bg-sky-700 text-white"
                >
                  <Save className="h-3 w-3 mr-1" />
                  <span>Lưu phụ huynh</span>
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* ============================================================ */}
        {/* NỘI DUNG 2 CỘT SÓNG ĐÔI: ĐỊNH DANH & LIÊN HỆ vs ĐỊA CHỈ & CƠ SỞ */}
        {/* ============================================================ */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 pt-0.5">
          {/* CỘT TRÁI: TÊN, SĐT, EMAIL, CON KHÁC */}
          <div className="space-y-2 min-w-0">
            {isEditing && editForm ? (
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[11px] font-medium text-muted-foreground block mb-0.5">
                    Họ và tên *
                  </label>
                  <Input
                    size={1}
                    value={editForm.name}
                    onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                    className="h-7 text-xs"
                    placeholder="VD: Nguyễn Thu Hà..."
                  />
                </div>
                <div>
                  <label className="text-[11px] font-medium text-muted-foreground block mb-0.5">
                    Vai trò
                  </label>
                  <Input
                    size={1}
                    value={editForm.role}
                    onChange={(e) => setEditForm({ ...editForm, role: e.target.value })}
                    className="h-7 text-xs"
                    placeholder="Mẹ, Bố, Bà ngoại..."
                  />
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2 flex-wrap min-w-0">
                <h4 className="text-base font-semibold text-foreground truncate">
                  {activeParent.name}
                </h4>
                <Badge
                  variant="outline"
                  className="bg-muted/40 text-muted-foreground border-border/60 font-normal text-[11px] shrink-0"
                >
                  {activeParent.role}
                </Badge>
                {activeParent.isPrimary && (
                  <Badge className="bg-emerald-600/90 text-white font-normal text-[10px] shrink-0">
                    Liên hệ chính
                  </Badge>
                )}
              </div>
            )}

            {/* SĐT & Email */}
            {isEditing && editForm ? (
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[11px] font-medium text-muted-foreground block mb-0.5">
                    Số điện thoại *
                  </label>
                  <Input
                    size={1}
                    value={editForm.phone}
                    onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                    className="h-7 text-xs font-mono"
                    placeholder="09xxxxxxxx"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-medium text-muted-foreground block mb-0.5">
                    Email
                  </label>
                  <Input
                    size={1}
                    value={editForm.email || ''}
                    onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                    className="h-7 text-xs"
                    placeholder="email@example.com"
                  />
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2.5 text-xs text-muted-foreground flex-wrap">
                <div className="flex items-center gap-1 shrink-0">
                  <Phone className="h-3 w-3 text-muted-foreground/70" />
                  <span className="font-mono font-medium text-foreground">
                    {activeParent.phone}
                  </span>
                  <button
                    type="button"
                    onClick={() => copyToClipboard(activeParent.phone, 'Số điện thoại')}
                    className="p-0.5 text-muted-foreground hover:text-foreground cursor-pointer rounded transition-colors"
                    title="Sao chép SĐT"
                  >
                    <Copy className="h-2.5 w-2.5" />
                  </button>
                </div>

                {activeParent.email && (
                  <>
                    <span className="text-muted-foreground/40">•</span>
                    <div className="flex items-center gap-1 min-w-0">
                      <Mail className="h-3 w-3 text-sky-600 shrink-0" />
                      <span className="text-foreground truncate">{activeParent.email}</span>
                    </div>
                  </>
                )}
              </div>
            )}

            {/* Con khác trong gia đình */}
            {siblingNames && siblingNames.length > 0 && !isEditing && (
              <div className="flex items-center gap-1.5 text-[11px] flex-wrap pt-0.5">
                <span className="text-muted-foreground font-medium shrink-0 flex items-center gap-1">
                  <Users className="h-3 w-3 text-sky-600 dark:text-sky-400" />
                  Con khác:
                </span>
                <div className="flex items-center gap-1.5 flex-wrap">
                  {siblingNames.map((sib) => (
                    <span
                      key={sib}
                      className="inline-flex items-center gap-1 h-5 px-2 rounded-md text-[11px] font-semibold text-sky-700 dark:text-sky-300 bg-sky-50 dark:bg-sky-950/40 border border-sky-200/80 dark:border-sky-800/80"
                    >
                      <GraduationCap className="h-3 w-3 text-sky-600" />
                      <span>{sib}</span>
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* CỘT PHẢI: ĐỊA CHỈ CƯ TRÚ & CƠ SỞ GẦN NHẤT */}
          <div className="space-y-2 min-w-0 md:border-l md:border-border/60 md:pl-3.5">
            {isEditing && editForm ? (
              <div>
                <label className="text-[11px] font-medium text-muted-foreground block mb-0.5">
                  Địa chỉ cư trú
                </label>
                <Input
                  size={1}
                  value={editForm.address || ''}
                  onChange={(e) => setEditForm({ ...editForm, address: e.target.value })}
                  className="h-7 text-xs"
                  placeholder="Nhập số nhà, tên đường, phường xã..."
                />
              </div>
            ) : (
              <>
                <div className="flex items-center gap-1.5 min-w-0 text-xs text-muted-foreground flex-wrap">
                  <MapPin className="h-3 w-3 text-rose-500 shrink-0" />
                  <span className="text-foreground truncate" title={activeParent.address}>
                    {activeParent.address || 'Phường Bến Nghé, Quận 1, TP.HCM'}
                  </span>
                  <span className="text-muted-foreground/40">•</span>
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                      activeParent.address || 'Quận 1, TP.HCM'
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-[11px] text-sky-600 hover:underline font-medium shrink-0"
                  >
                    <span>Mở map</span>
                    <ExternalLink className="h-2.5 w-2.5" />
                  </a>
                </div>

                {/* Khoảng cách cơ sở RinoEdu */}
                <div className="flex items-center gap-1.5 text-[11px] flex-wrap">
                  <Navigation className="h-3 w-3 text-emerald-600 shrink-0" />
                  {(activeParent.nearestBranches || [
                    { name: 'RinoEdu Linh Đàm', distance: '1.2 km' },
                    { name: 'RinoEdu Nguyễn Tuân', distance: '3.5 km' },
                    { name: 'RinoEdu Smart City', distance: '5.2 km' },
                  ]).map((b, idx) => (
                    <span
                      key={b.name}
                      className={cn(
                        'inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[11px] shrink-0 border',
                        idx === 0
                          ? 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-300 border-emerald-200 font-semibold'
                          : 'bg-muted/40 text-muted-foreground border-border/50'
                      )}
                    >
                      {idx === 0 && <MapPin className="h-2.5 w-2.5 text-emerald-600" />}
                      <span>{b.name}</span>
                      <span className="font-mono font-bold text-emerald-700 dark:text-emerald-400">
                        {b.distance}
                      </span>
                    </span>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* ============================================================ */}
      {/* 2. CỤM: THÔNG TIN PHỤ HUYNH & KÊNH LIÊN HỆ (NHƯ ẢNH 2)         */}
      {/* ============================================================ */}
      <div className="p-3 rounded-xl border border-border/70 bg-card space-y-2.5 shadow-2xs">
        <div className="text-xs pb-1.5 border-b border-border/60 flex items-center justify-between gap-2 flex-wrap">
          <span className="font-bold text-foreground">Thông tin phụ huynh &amp; Kênh liên hệ</span>
          {!isEditing ? (
            <span className="text-xs font-semibold text-foreground">
              {activeParent.occupation || 'Kế toán trưởng - FPT Software'}
            </span>
          ) : (
            <div className="w-56">
              <Input
                value={editForm?.occupation || ''}
                onChange={(e) =>
                  setEditForm(editForm ? { ...editForm, occupation: e.target.value } : null)
                }
                className="h-6.5 text-xs"
                placeholder="Nghề nghiệp & Đơn vị..."
              />
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 text-xs">
          {/* CỘT TRÁI: NGÂN SÁCH & QUYỀN HẠN QUYẾT ĐỊNH */}
          <div className="space-y-2 min-w-0">
            <div>
              <span className="text-[11px] text-muted-foreground font-medium block">
                Ngân sách học tập / tháng
              </span>
              {!isEditing ? (
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="font-semibold text-xs text-emerald-600 dark:text-emerald-400">
                    {activeParent.budgetPerMonth || '3.000.000đ - 5.000.000đ/tháng'}
                  </span>
                  {activeParent.financialSegment && (
                    <Badge
                      variant="outline"
                      className="text-[10px] py-0 px-1.5 bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 border-emerald-200"
                    >
                      {activeParent.financialSegment}
                    </Badge>
                  )}
                </div>
              ) : (
                <Input
                  value={editForm?.budgetPerMonth || ''}
                  onChange={(e) =>
                    setEditForm(editForm ? { ...editForm, budgetPerMonth: e.target.value } : null)
                  }
                  className="h-7 text-xs mt-0.5"
                  placeholder="3.000.000đ - 5.000.000đ/tháng..."
                />
              )}
            </div>

            <div>
              <span className="text-[11px] text-muted-foreground font-medium block">
                Quyền hạn quyết định
              </span>
              {!isEditing ? (
                <p className="text-xs text-foreground">
                  {activeParent.decisionMakerRole ||
                    'Mẹ toàn quyền quyết định tài chính & chương trình'}
                </p>
              ) : (
                <Input
                  value={editForm?.decisionMakerRole || ''}
                  onChange={(e) =>
                    setEditForm(editForm ? { ...editForm, decisionMakerRole: e.target.value } : null)
                  }
                  className="h-7 text-xs mt-0.5"
                  placeholder="Mẹ toàn quyền quyết định..."
                />
              )}
            </div>
          </div>

          {/* CỘT PHẢI: KÊNH LIÊN HỆ & THỜI GIAN LIÊN LẠC */}
          <div className="space-y-2 min-w-0 md:border-l md:border-border/60 md:pl-3.5">
            <div>
              <span className="text-[11px] text-muted-foreground font-medium block">
                Kênh liên hệ ưu tiên
              </span>
              {!isEditing ? (
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-xs font-semibold text-sky-700 dark:text-sky-300">
                    {activeParent.preferredChannel || 'Zalo'}
                  </span>
                  {activeParent.zaloStatus && (
                    <span className="inline-flex items-center gap-1 text-[10px] font-medium text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/60 border border-blue-200 px-1.5 py-0.5 rounded">
                      <span className="h-1.5 w-1.5 rounded-full bg-blue-500" />
                      <span>{activeParent.zaloStatus}</span>
                    </span>
                  )}
                </div>
              ) : (
                <Input
                  value={editForm?.preferredChannel || ''}
                  onChange={(e) =>
                    setEditForm(editForm ? { ...editForm, preferredChannel: e.target.value } : null)
                  }
                  className="h-7 text-xs mt-0.5"
                  placeholder="Zalo / Điện thoại..."
                />
              )}
            </div>

            <div>
              <span className="text-[11px] text-muted-foreground font-medium block">
                Thời gian liên lạc
              </span>
              {!isEditing ? (
                <p className="text-xs font-medium text-amber-700 dark:text-amber-400">
                  {activeParent.bestTimeToCall ||
                    '12h00 - 13h30 hoặc sau 18h30 (Không nghe số lạ buổi sáng)'}
                </p>
              ) : (
                <Input
                  value={editForm?.bestTimeToCall || ''}
                  onChange={(e) =>
                    setEditForm(editForm ? { ...editForm, bestTimeToCall: e.target.value } : null)
                  }
                  className="h-7 text-xs mt-0.5"
                  placeholder="12h00 - 13h30 hoặc sau 18h30..."
                />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ============================================================ */}
      {/* 3. CỤM: KỲ VỌNG & TÂM LÝ PHỤ HUYNH (NHƯ ẢNH 2)                 */}
      {/* ============================================================ */}
      <div className="p-3 rounded-xl border border-border/70 bg-card space-y-2 shadow-2xs">
        <div className="pb-1.5 border-b border-border/60">
          <span className="text-xs font-bold text-foreground">
            Kỳ vọng &amp; Tâm lý phụ huynh
          </span>
        </div>

        <div className="space-y-2.5 text-xs">
          {/* 1. Kỳ vọng */}
          <div className="space-y-0.5">
            <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-400 block">
              Kỳ vọng đối với chương trình học:
            </span>
            {!isEditing ? (
              <p className="text-xs text-foreground/90 leading-relaxed">
                {activeParent.parentExpectation ||
                  'Con tự tin phản xạ giao tiếp tự nhiên, phát âm chuẩn quốc tế và lấy chứng chỉ Starters/Movers'}
              </p>
            ) : (
              <Textarea
                rows={2}
                value={editForm?.parentExpectation || ''}
                onChange={(e) =>
                  setEditForm(editForm ? { ...editForm, parentExpectation: e.target.value } : null)
                }
                className="text-xs"
                placeholder="Nhập kỳ vọng đối với chương trình học..."
              />
            )}
          </div>

          {/* 2. Nỗi đau / Rào cản từ trung tâm cũ */}
          <div className="space-y-0.5">
            <span className="text-xs font-semibold text-amber-700 dark:text-amber-400 block">
              Nỗi đau / Rào cản từ trung tâm cũ:
            </span>
            {!isEditing ? (
              <p className="text-xs text-foreground/90 leading-relaxed">
                {activeParent.parentPainPoint ||
                  'Trước đây học trung tâm cũ sĩ số đông (18-20 bé), giáo viên ít tương tác nên con bị nhút nhát và sợ nói'}
              </p>
            ) : (
              <Textarea
                rows={2}
                value={editForm?.parentPainPoint || ''}
                onChange={(e) =>
                  setEditForm(editForm ? { ...editForm, parentPainPoint: e.target.value } : null)
                }
                className="text-xs"
                placeholder="Nhập nỗi đau / rào cản từ trung tâm cũ..."
              />
            )}
          </div>

          {/* 3. Bí quyết chốt sales */}
          <div className="space-y-0.5">
            <span className="text-xs font-semibold text-sky-700 dark:text-sky-400 block">
              Đặc điểm tâm lý tư vấn &amp; Bí quyết chốt sales:
            </span>
            {!isEditing ? (
              <p className="text-xs text-foreground/90 leading-relaxed">
                {activeParent.parentPersonalityNote ||
                  'Kỹ tính, chu đáo; thích xem số liệu minh bạch, báo cáo tiến độ học tập hàng tuần; thích trao đổi qua Zalo có hình ảnh lớp'}
              </p>
            ) : (
              <Textarea
                rows={2}
                value={editForm?.parentPersonalityNote || ''}
                onChange={(e) =>
                  setEditForm(
                    editForm ? { ...editForm, parentPersonalityNote: e.target.value } : null
                  )
                }
                className="text-xs"
                placeholder="Ghi chú kinh nghiệm tư vấn và bí quyết chốt sales..."
              />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
