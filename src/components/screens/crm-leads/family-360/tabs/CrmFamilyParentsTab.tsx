'use client'

import React, { useState } from 'react'
import {
  UserCheck,
  Phone,
  Mail,
  Copy,
  Pencil,
  Plus,
  Save,
  X,
  Users,
  GraduationCap,
  User,
  Sparkles,
} from 'lucide-react'
import { toast } from 'sonner'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { cn } from '@/lib/utils'
import type { FamilyParentContact } from '../crmFamily360Types'

interface CrmFamilyParentsTabProps {
  parents: FamilyParentContact[]
  onUpdateParents: (parents: FamilyParentContact[]) => void
  familyCode?: string
  createdAt?: string
  siblingNames?: string[]
}

export function CrmFamilyParentsTab({
  parents,
  onUpdateParents,
  familyCode = 'FAM-10291',
  createdAt = '2026-08-10',
  siblingNames = ['Bé Bình'],
}: CrmFamilyParentsTabProps) {
  const [selectedParentId, setSelectedParentId] = useState<string>(
    parents.find((p) => p.isPrimary)?.id || parents[0]?.id || ''
  )
  const [isEditing, setIsEditing] = useState(false)
  const [isAddingNew, setIsAddingNew] = useState(false)

  const currentParent =
    parents.find((p) => p.id === selectedParentId) || parents[0] || null

  const [editForm, setEditForm] = useState<FamilyParentContact | null>(currentParent)

  const handleSelectParent = (p: FamilyParentContact) => {
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
    const newParent: FamilyParentContact = {
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
    toast.success('Đã cập nhật người liên hệ chính của gia đình.')
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
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5 items-start">
      {/* ============================================================ */}
      {/* CỘT TRÁI (PANEL CHÍNH, NHỎ ~ col-span-4): CHỌN & ĐỊNH DANH   */}
      {/* ============================================================ */}
      <div className="lg:col-span-4 space-y-3">
        {/* Khối 1: Danh sách phụ huynh để chọn */}
        <div className="rounded-xl border border-border/70 bg-card p-3 space-y-2.5 shadow-2xs">
          <div className="flex items-center justify-between gap-1 pb-1.5 border-b border-border/60">
            <span className="text-xs font-bold text-foreground flex items-center gap-1.5">
              <Users className="h-3.5 w-3.5 text-sky-600 dark:text-sky-400" />
              Phụ huynh trong gia đình ({parents.length})
            </span>
            <button
              type="button"
              onClick={handleAddNewParent}
              className={cn(
                'h-6 px-2 rounded-md text-[11px] font-medium transition-all flex items-center gap-1 cursor-pointer border border-dashed shrink-0',
                isAddingNew
                  ? 'bg-sky-600 text-white border-sky-600 font-semibold'
                  : 'border-sky-300 dark:border-sky-800 text-sky-700 dark:text-sky-400 hover:bg-sky-50 dark:hover:bg-sky-950/40'
              )}
            >
              <Plus className="h-3 w-3" />
              <span>Thêm mới</span>
            </button>
          </div>

          {/* Danh sách các phụ huynh */}
          <div className="space-y-1.5">
            {parents.map((p) => {
              const isSelected = !isAddingNew && p.id === selectedParentId
              return (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => handleSelectParent(p)}
                  className={cn(
                    'w-full text-left p-2.5 rounded-lg text-xs transition-all flex items-center justify-between gap-2 cursor-pointer border',
                    isSelected
                      ? 'bg-sky-50 dark:bg-sky-950/60 border-sky-300 dark:border-sky-800 shadow-2xs ring-1 ring-sky-300/60 dark:ring-sky-800'
                      : 'bg-background hover:bg-muted/60 border-border/70 text-foreground'
                  )}
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <div
                      className={cn(
                        'flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold shrink-0',
                        isSelected
                          ? 'bg-sky-600 text-white'
                          : 'bg-muted text-muted-foreground'
                      )}
                    >
                      {p.role.charAt(0)}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="font-semibold text-foreground truncate text-xs">
                          {p.name || 'Chưa đặt tên'}
                        </span>
                        <span className="text-[10px] text-muted-foreground">({p.role})</span>
                      </div>
                      <span className="font-mono text-[10px] text-muted-foreground block truncate">
                        {p.phone || 'Chưa có SĐT'}
                      </span>
                    </div>
                  </div>

                  {p.isPrimary && (
                    <span className="text-[9px] px-1.5 py-0.5 rounded-xs font-bold uppercase bg-sky-100 text-sky-800 dark:bg-sky-900/60 dark:text-sky-200 shrink-0">
                      Chính
                    </span>
                  )}
                </button>
              )
            })}
          </div>
        </div>

        {/* Khối 2: Thẻ tóm tắt định danh của phụ huynh đang chọn */}
        <div className="rounded-xl border border-border/70 bg-card p-3 space-y-3 shadow-2xs">
          <div className="flex items-center justify-between pb-2 border-b border-border/60">
            <span className="text-xs font-bold text-foreground flex items-center gap-1.5">
              <UserCheck className="h-3.5 w-3.5 text-sky-600" />
              Định danh &amp; Vai trò
            </span>

            {/* Nút sửa / lưu */}
            {!isEditing ? (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleStartEdit}
                className="h-6.5 px-2 text-[11px] font-semibold text-primary border-primary/30 hover:bg-primary/10 cursor-pointer"
              >
                <Pencil className="h-3 w-3 mr-1" />
                <span>Sửa hồ sơ</span>
              </Button>
            ) : (
              <div className="flex items-center gap-1">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleCancelEdit}
                  className="h-6 px-1.5 text-[10px] text-muted-foreground hover:text-destructive cursor-pointer"
                >
                  <X className="h-3 w-3 mr-0.5" />
                  Hủy
                </Button>
                <Button
                  type="button"
                  size="sm"
                  onClick={handleSaveEdit}
                  className="h-6 px-2 text-[10px] font-bold bg-sky-600 hover:bg-sky-700 text-white cursor-pointer"
                >
                  <Save className="h-3 w-3 mr-0.5" />
                  Lưu
                </Button>
              </div>
            )}
          </div>

          {/* Nội dung định danh */}
          <div className="space-y-2.5">
            {isEditing && editForm ? (
              <div className="space-y-2">
                <div>
                  <label className="text-[11px] font-medium text-muted-foreground block mb-0.5">
                    Họ và tên phụ huynh *
                  </label>
                  <Input
                    value={editForm.name}
                    onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                    className="h-7 text-xs"
                    placeholder="VD: Nguyễn Thu Hà..."
                  />
                </div>
                <div>
                  <label className="text-[11px] font-medium text-muted-foreground block mb-0.5">
                    Vai trò trong gia đình
                  </label>
                  <Input
                    value={editForm.role}
                    onChange={(e) => setEditForm({ ...editForm, role: e.target.value })}
                    className="h-7 text-xs"
                    placeholder="Mẹ, Bố, Bà ngoại..."
                  />
                </div>
              </div>
            ) : (
              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <h4 className="text-sm font-bold text-foreground truncate">
                    {activeParent.name}
                  </h4>
                  <Badge
                    variant="outline"
                    className="bg-muted/40 text-muted-foreground border-border/60 text-[10px]"
                  >
                    {activeParent.role}
                  </Badge>
                  {activeParent.isPrimary && (
                    <Badge className="bg-emerald-600/90 text-white text-[10px] font-normal">
                      Liên hệ chính
                    </Badge>
                  )}
                </div>

                {!activeParent.isPrimary && !isEditing && (
                  <button
                    type="button"
                    onClick={() => handleSetPrimary(activeParent.id)}
                    className="text-[11px] text-sky-600 hover:underline font-medium block pt-0.5 cursor-pointer"
                  >
                    Đặt làm liên hệ chính của gia đình
                  </button>
                )}
              </div>
            )}

            {/* Thông tin hồ sơ gia đình & con liên kết */}
            <div className="pt-2 border-t border-border/60 space-y-2 text-xs">
              <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                <span>Mã gia đình:</span>
                <span className="font-mono font-medium text-foreground">{familyCode}</span>
              </div>
              <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                <span>Ngày tạo hồ sơ:</span>
                <span className="font-medium text-foreground">{createdAt}</span>
              </div>

              {/* Các con trong gia đình */}
              {siblingNames && siblingNames.length > 0 && (
                <div className="pt-1">
                  <span className="text-[11px] text-muted-foreground font-medium block mb-1">
                    Các con trong gia đình:
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
          </div>
        </div>
      </div>

      {/* ============================================================ */}
      {/* CỘT PHẢI (PANEL LỚN ~ col-span-8): THÔNG TIN & LIÊN HỆ       */}
      {/* ============================================================ */}
      <div className="lg:col-span-8 space-y-3.5">
        {/* Khối 1: Thông tin phụ huynh & Kênh liên hệ */}
        <div className="p-3.5 rounded-xl border border-border/70 bg-card space-y-3 shadow-2xs">
          <div className="text-xs pb-2 border-b border-border/60 flex items-center justify-between gap-2 flex-wrap">
            <span className="font-bold text-foreground text-xs flex items-center gap-1.5">
              <User className="h-3.5 w-3.5 text-sky-600" />
              Thông tin phụ huynh &amp; Kênh liên hệ
            </span>
            {!isEditing ? (
              <span className="text-xs font-semibold text-foreground bg-muted/40 px-2 py-0.5 rounded border border-border/50">
                {activeParent.occupation || 'Kế toán trưởng - FPT Software'}
              </span>
            ) : (
              <div className="w-64">
                <Input
                  value={editForm?.occupation || ''}
                  onChange={(e) =>
                    setEditForm(editForm ? { ...editForm, occupation: e.target.value } : null)
                  }
                  className="h-6.5 text-xs"
                  placeholder="Nghề nghiệp & Đơn vị công tác..."
                />
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs">
            {/* SĐT & Email */}
            <div className="space-y-2 min-w-0">
              <div>
                <span className="text-[11px] text-muted-foreground font-medium block mb-0.5">
                  Số điện thoại *
                </span>
                {!isEditing ? (
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1.5 bg-muted/30 px-2 py-1 rounded border border-border/50">
                      <Phone className="h-3 w-3 text-muted-foreground/70" />
                      <span className="font-mono font-bold text-foreground text-xs">
                        {activeParent.phone}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => copyToClipboard(activeParent.phone, 'Số điện thoại')}
                      className="p-1 text-muted-foreground hover:text-foreground cursor-pointer rounded hover:bg-muted transition-colors"
                      title="Sao chép SĐT"
                    >
                      <Copy className="h-3 w-3" />
                    </button>
                  </div>
                ) : (
                  <Input
                    value={editForm?.phone || ''}
                    onChange={(e) =>
                      setEditForm(editForm ? { ...editForm, phone: e.target.value } : null)
                    }
                    className="h-7 text-xs font-mono"
                    placeholder="09xxxxxxxx"
                  />
                )}
              </div>

              <div>
                <span className="text-[11px] text-muted-foreground font-medium block mb-0.5">
                  Email liên hệ
                </span>
                {!isEditing ? (
                  <div className="flex items-center gap-1.5 text-foreground">
                    <Mail className="h-3 w-3 text-sky-600 shrink-0" />
                    <span className="truncate">{activeParent.email || 'Chưa cập nhật email'}</span>
                  </div>
                ) : (
                  <Input
                    value={editForm?.email || ''}
                    onChange={(e) =>
                      setEditForm(editForm ? { ...editForm, email: e.target.value } : null)
                    }
                    className="h-7 text-xs"
                    placeholder="email@example.com"
                  />
                )}
              </div>

              <div>
                <span className="text-[11px] text-muted-foreground font-medium block mb-0.5">
                  Ngân sách học tập / tháng
                </span>
                {!isEditing ? (
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="font-bold text-xs text-emerald-600 dark:text-emerald-400">
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
                    className="h-7 text-xs"
                    placeholder="3.000.000đ - 5.000.000đ/tháng..."
                  />
                )}
              </div>
            </div>

            {/* Quyền hạn & Kênh ưu tiên */}
            <div className="space-y-2 min-w-0 sm:border-l sm:border-border/60 sm:pl-3.5">
              <div>
                <span className="text-[11px] text-muted-foreground font-medium block mb-0.5">
                  Quyền hạn quyết định
                </span>
                {!isEditing ? (
                  <p className="text-xs text-foreground font-medium">
                    {activeParent.decisionMakerRole ||
                      'Mẹ toàn quyền quyết định tài chính & chương trình'}
                  </p>
                ) : (
                  <Input
                    value={editForm?.decisionMakerRole || ''}
                    onChange={(e) =>
                      setEditForm(
                        editForm ? { ...editForm, decisionMakerRole: e.target.value } : null
                      )
                    }
                    className="h-7 text-xs"
                    placeholder="Mẹ toàn quyền quyết định..."
                  />
                )}
              </div>

              <div>
                <span className="text-[11px] text-muted-foreground font-medium block mb-0.5">
                  Kênh liên hệ ưu tiên
                </span>
                {!isEditing ? (
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-xs font-semibold text-sky-700 dark:text-sky-300">
                      {activeParent.preferredChannel || 'Ưu tiên Zalo trong giờ hành chính'}
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
                      setEditForm(
                        editForm ? { ...editForm, preferredChannel: e.target.value } : null
                      )
                    }
                    className="h-7 text-xs"
                    placeholder="Zalo / Điện thoại..."
                  />
                )}
              </div>

              <div>
                <span className="text-[11px] text-muted-foreground font-medium block mb-0.5">
                  Thời gian liên lạc tốt nhất
                </span>
                {!isEditing ? (
                  <p className="text-xs font-semibold text-amber-700 dark:text-amber-400">
                    {activeParent.bestTimeToCall ||
                      '12h00 - 13h30 hoặc sau 18h30 (Không nghe số lạ buổi sáng)'}
                  </p>
                ) : (
                  <Input
                    value={editForm?.bestTimeToCall || ''}
                    onChange={(e) =>
                      setEditForm(
                        editForm ? { ...editForm, bestTimeToCall: e.target.value } : null
                      )
                    }
                    className="h-7 text-xs"
                    placeholder="12h00 - 13h30 hoặc sau 18h30..."
                  />
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Khối 2: Kỳ vọng & Tâm lý phụ huynh (Chuẩn Ảnh 2) */}
        <div className="p-3.5 rounded-xl border border-border/70 bg-card space-y-2.5 shadow-2xs">
          <div className="pb-1.5 border-b border-border/60 flex items-center justify-between">
            <span className="text-xs font-bold text-foreground flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5 text-amber-500" />
              Kỳ vọng &amp; Tâm lý phụ huynh
            </span>
          </div>

          <div className="space-y-2.5 text-xs">
            {/* Kỳ vọng */}
            <div className="space-y-1">
              <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400 block">
                Kỳ vọng đối với chương trình học:
              </span>
              {!isEditing ? (
                <p className="text-xs text-foreground/90 leading-relaxed bg-emerald-50/20 dark:bg-emerald-950/10 p-2 rounded-lg border border-emerald-100 dark:border-emerald-900/40">
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

            {/* Nỗi đau trung tâm cũ */}
            <div className="space-y-1">
              <span className="text-xs font-bold text-amber-700 dark:text-amber-400 block">
                Nỗi đau / Rào cản từ trung tâm cũ:
              </span>
              {!isEditing ? (
                <p className="text-xs text-foreground/90 leading-relaxed bg-amber-50/20 dark:bg-amber-950/10 p-2 rounded-lg border border-amber-100 dark:border-amber-900/40">
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

            {/* Bí quyết chốt sales & đặc điểm tâm lý */}
            <div className="space-y-1">
              <span className="text-xs font-bold text-sky-700 dark:text-sky-400 block">
                Đặc điểm tâm lý tư vấn &amp; Bí quyết chốt sales:
              </span>
              {!isEditing ? (
                <p className="text-xs text-foreground/90 leading-relaxed bg-sky-50/20 dark:bg-sky-950/10 p-2 rounded-lg border border-sky-100 dark:border-sky-900/40">
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
    </div>
  )
}
