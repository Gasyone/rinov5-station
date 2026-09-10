'use client'

import { useMemo, useState } from 'react'
import {
  Briefcase,
  Plus,
  UserCheck,
  Users,
} from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { StatusBadge } from '@/components/shared'
import { cn } from '@/lib/utils'
import {
  ORG_TYPE_BADGE_MAP,
  type OrgStaffMember,
  type OrgUnit,
} from './orgStructureTypes'

interface OrgUnitDetailDialogProps {
  unit: OrgUnit | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onTransferStaffClick: (unit: OrgUnit, staff?: OrgStaffMember, targetTitle?: string) => void
  onAddPosition?: (unitId: string, positionName: string) => void
}

export function OrgUnitDetailDialog({
  unit,
  open,
  onOpenChange,
  onTransferStaffClick,
  onAddPosition,
}: OrgUnitDetailDialogProps) {
  const [activeTab, setActiveTab] = useState<'positions' | 'staff'>('positions')
  const [isAddPosOpen, setIsAddPosOpen] = useState(false)
  const [newPosName, setNewPosName] = useState('')

  const positionStats = useMemo(() => {
    if (!unit?.positions) return []
    return unit.positions.map((pos) => {
      const pClean = pos.trim().toLowerCase()
      const assignedStaff =
        unit.members?.filter((m) => {
          const mClean = m.title.trim().toLowerCase()
          return (
            mClean === pClean ||
            mClean.includes(pClean) ||
            pClean.includes(mClean)
          )
        }) || []
      return {
        title: pos,
        assignedCount: assignedStaff.length,
        staffList: assignedStaff,
      }
    })
  }, [unit])

  if (!unit) return null

  const typeConfig = ORG_TYPE_BADGE_MAP[unit.type] || {
    label: unit.typeLabel,
    badgeVariant: 'bg-muted text-muted-foreground',
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[95vw] sm:max-w-4xl md:max-w-5xl lg:max-w-6xl max-h-[90vh] flex flex-col p-0 overflow-hidden">
        {/* Header: Đã bỏ Mã đơn vị theo yêu cầu, chỉ giữ Tên đơn vị và trạng thái */}
        <DialogHeader className="px-4 py-2.5 border-b shrink-0 bg-background/95">
          <div className="flex items-center justify-between gap-3 pr-6">
            <div className="flex items-center gap-2 flex-wrap min-w-0">
              <span className="text-xs text-muted-foreground font-normal shrink-0">
                Chi tiết đơn vị:
              </span>
              <DialogTitle className="text-sm font-semibold text-foreground truncate max-w-[360px] sm:max-w-[500px]">
                {unit.name}
              </DialogTitle>
              <span
                className={cn(
                  'rounded px-1.5 py-0.5 text-[10px] font-semibold shrink-0',
                  typeConfig.badgeVariant
                )}
              >
                {typeConfig.label}
              </span>
              <div className="shrink-0">
                <StatusBadge status={unit.status} label={unit.statusLabel} />
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <Button
                type="button"
                size="sm"
                className="h-7 text-xs gap-1.5 cursor-pointer px-2.5"
                onClick={() => onTransferStaffClick(unit)}
              >
                <UserCheck className="h-3.5 w-3.5" />
                <span>Điều chuyển nhân sự</span>
              </Button>
            </div>
          </div>
        </DialogHeader>

        {/* Body: 2-Panel Layout (Trái: Thông tin tổ chức, Phải: Tabs Chức danh & Nhân sự) */}
        <div className="flex-1 overflow-y-auto p-3.5 sm:p-4 bg-muted/10">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3.5">
            {/* ========================================================= */}
            {/* PANEL TRÁI: THUỘC TÍNH ĐƠN VỊ (Bỏ Người phụ trách)        */}
            {/* ========================================================= */}
            <div className="md:col-span-5 lg:col-span-4">
              <div className="rounded-lg border bg-card p-3.5 space-y-3 shadow-2xs">
                <span className="font-semibold text-xs text-foreground block border-b pb-2">
                  Thông tin đơn vị
                </span>
                <div className="space-y-2.5 text-xs">
                  <div className="flex items-center justify-between py-1 border-b border-border/40">
                    <span className="text-muted-foreground shrink-0">Loại hình</span>
                    <span
                      className={cn(
                        'rounded px-1.5 py-0.5 text-[10px] font-semibold',
                        typeConfig.badgeVariant
                      )}
                    >
                      {typeConfig.label}
                    </span>
                  </div>
                  <div className="flex items-center justify-between py-1 border-b border-border/40">
                    <span className="text-muted-foreground shrink-0">Trạng thái</span>
                    <StatusBadge status={unit.status} label={unit.statusLabel} />
                  </div>
                  <div className="flex items-center justify-between py-1 border-b border-border/40 gap-2">
                    <span className="text-muted-foreground shrink-0">Đơn vị trực thuộc</span>
                    <span className="font-medium text-foreground text-right truncate max-w-[180px]">
                      {unit.parentId ? 'Đơn vị cấp trên' : 'Hội sở (Gốc BOD)'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between py-1 border-b border-border/40 gap-2">
                    <span className="text-muted-foreground shrink-0">Cơ sở / Địa điểm</span>
                    <span className="font-medium text-foreground text-right truncate max-w-[180px]">
                      {unit.branchId ? 'Cơ sở trực thuộc' : 'Hội sở chính (Toàn quốc)'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between py-1 border-b border-border/40">
                    <span className="text-muted-foreground shrink-0">Quy mô định biên</span>
                    <span className="font-semibold text-foreground">
                      {unit.memberCount} nhân sự
                    </span>
                  </div>
                  {unit.description ? (
                    <div className="pt-1 text-[11px] text-muted-foreground leading-relaxed">
                      <span className="text-muted-foreground block text-[10px] font-medium mb-0.5">
                        Mô tả chức năng:
                      </span>
                      {unit.description}
                    </div>
                  ) : null}
                </div>
              </div>
            </div>

            {/* ========================================================= */}
            {/* PANEL PHẢI: 2 TABS (1 TAB CHỨC DANH, 1 TAB NHÂN SỰ)      */}
            {/* ========================================================= */}
            <div className="md:col-span-7 lg:col-span-8 space-y-3">
              <div className="rounded-lg border bg-card p-3.5 shadow-2xs">
                <Tabs
                  value={activeTab}
                  onValueChange={(val) => setActiveTab(val as 'positions' | 'staff')}
                  className="space-y-3"
                >
                  {/* Tab bar switch */}
                  <div className="flex items-center justify-between border-b pb-2.5">
                    <TabsList className="grid grid-cols-2 h-8 w-[320px] p-0.5 bg-muted/70">
                      <TabsTrigger
                        value="positions"
                        className="text-xs gap-1.5 cursor-pointer data-[state=active]:bg-background"
                      >
                        <Briefcase className="h-3.5 w-3.5" />
                        <span>Chức danh ({unit.positions?.length || 0})</span>
                      </TabsTrigger>
                      <TabsTrigger
                        value="staff"
                        className="text-xs gap-1.5 cursor-pointer data-[state=active]:bg-background"
                      >
                        <Users className="h-3.5 w-3.5" />
                        <span>Nhân sự ({unit.members?.length || 0})</span>
                      </TabsTrigger>
                    </TabsList>

                    {activeTab === 'positions' ? (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="h-7 text-xs gap-1.5 px-2.5 cursor-pointer shrink-0"
                        onClick={() => {
                          setNewPosName('')
                          setIsAddPosOpen(true)
                        }}
                      >
                        <Plus className="h-3.5 w-3.5 text-primary" />
                        <span>Thêm chức danh</span>
                      </Button>
                    ) : (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="h-7 text-xs gap-1.5 px-2.5 cursor-pointer shrink-0"
                        onClick={() => onTransferStaffClick(unit)}
                      >
                        <UserCheck className="h-3.5 w-3.5 text-primary" />
                        <span>Điều chuyển nhân sự</span>
                      </Button>
                    )}
                  </div>

                  {/* ===================================================== */}
                  {/* TAB 1: CƠ CẤU CHỨC DANH                               */}
                  {/* ===================================================== */}
                  <TabsContent value="positions" className="m-0 space-y-2.5 pt-1">
                    <div className="rounded-md border overflow-hidden">
                      <table className="w-full text-left text-xs border-collapse">
                        <thead className="border-b bg-muted/40 font-medium text-muted-foreground">
                          <tr>
                            <th className="py-2.5 px-3 font-semibold">Chức danh / Vị trí</th>
                            <th className="py-2.5 px-3 font-semibold text-center">
                              Nhân sự hiện có
                            </th>
                            <th className="py-2.5 px-3 font-semibold">Thành viên</th>
                            <th className="py-2.5 px-3 font-semibold text-right">Thao tác</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-border/60">
                          {positionStats.map((pos) => {
                            const MAX_VISIBLE = 2
                            const visibleStaff = pos.staffList.slice(0, MAX_VISIBLE)
                            const remainingCount = pos.staffList.length - MAX_VISIBLE

                            return (
                              <tr
                                key={pos.title}
                                className="hover:bg-muted/30 transition-colors"
                              >
                                <td className="py-2.5 px-3 font-medium text-foreground">
                                  <div className="flex items-center gap-1.5">
                                    <Briefcase className="h-3.5 w-3.5 text-primary/70 shrink-0" />
                                    <span>{pos.title}</span>
                                  </div>
                                </td>
                                <td className="py-2.5 px-3 text-center">
                                  <span className="font-semibold text-foreground">
                                    {pos.assignedCount}
                                  </span>{' '}
                                  <span className="text-[11px] text-muted-foreground">người</span>
                                </td>
                                <td className="py-2.5 px-3">
                                  {pos.staffList.length > 0 ? (
                                    <div className="flex items-center gap-2">
                                      <div className="flex -space-x-2 overflow-hidden shrink-0">
                                        {visibleStaff.map((staff) => {
                                          const initial =
                                            staff.name.split(' ').pop()?.charAt(0) || 'U'
                                          return (
                                            <Avatar
                                              key={staff.id}
                                              className="h-6 w-6 border-2 border-background ring-1 ring-border/30 shrink-0"
                                              title={staff.name}
                                            >
                                              {staff.avatar ? (
                                                <AvatarImage src={staff.avatar} alt={staff.name} />
                                              ) : null}
                                              <AvatarFallback className="text-[9px] bg-primary/10 text-primary font-bold">
                                                {initial}
                                              </AvatarFallback>
                                            </Avatar>
                                          )
                                        })}
                                        {remainingCount > 0 ? (
                                          <div
                                            className="flex h-6 w-6 items-center justify-center rounded-full bg-muted border-2 border-background ring-1 ring-border/30 text-[10px] font-semibold text-muted-foreground shrink-0"
                                            title={`Còn ${remainingCount} nhân sự khác`}
                                          >
                                            +{remainingCount}
                                          </div>
                                        ) : null}
                                      </div>

                                      <div className="text-xs text-foreground font-medium truncate max-w-[200px]">
                                        {visibleStaff.map((s) => s.name).join(', ')}
                                        {remainingCount > 0 ? (
                                          <span className="text-muted-foreground text-[11px] ml-1 font-normal">
                                            +{remainingCount}
                                          </span>
                                        ) : null}
                                      </div>
                                    </div>
                                  ) : (
                                    <span className="text-muted-foreground text-[11px] italic">
                                      Chưa có
                                    </span>
                                  )}
                                </td>
                                <td className="py-2.5 px-3 text-right">
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    className="h-6 px-2 text-[11px] text-primary hover:text-primary cursor-pointer"
                                    onClick={() => onTransferStaffClick(unit, undefined, pos.title)}
                                  >
                                    Bổ nhiệm
                                  </Button>
                                </td>
                              </tr>
                            )
                          })}
                        </tbody>
                      </table>
                    </div>
                  </TabsContent>

                  {/* ===================================================== */}
                  {/* TAB 2: DANH SÁCH NHÂN SỰ (Đã bỏ Liên hệ và Vai trò)  */}
                  {/* ===================================================== */}
                  <TabsContent value="staff" className="m-0 space-y-2.5 pt-1">
                    <div className="rounded-md border overflow-hidden">
                      <table className="w-full text-left text-xs border-collapse">
                        <thead className="border-b bg-muted/40 font-medium text-muted-foreground">
                          <tr>
                            <th className="py-2.5 px-3 font-semibold">Họ tên nhân sự</th>
                            <th className="py-2.5 px-3 font-semibold">Chức danh</th>
                            <th className="py-2.5 px-3 font-semibold text-right">Thao tác</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-border/60">
                          {unit.members?.map((member) => (
                            <tr
                              key={member.id}
                              className="hover:bg-muted/30 transition-colors"
                            >
                              <td className="py-2.5 px-3">
                                <div className="font-medium text-foreground whitespace-nowrap">
                                  {member.name}
                                </div>
                                <div className="text-[10px] text-muted-foreground">
                                  Gia nhập: {member.joinedDate}
                                </div>
                              </td>
                              <td className="py-2.5 px-3">
                                <div className="flex items-center gap-1.5 flex-wrap">
                                  <span className="text-foreground/90 font-medium">
                                    {member.title}
                                  </span>
                                  {!member.isPrimary ? (
                                    <Badge
                                      variant="secondary"
                                      className="text-[10px] font-normal text-amber-700 bg-amber-50 dark:bg-amber-950 dark:text-amber-400"
                                    >
                                      Kiêm nhiệm
                                    </Badge>
                                  ) : null}
                                </div>
                              </td>
                              <td className="py-2.5 px-3 text-right whitespace-nowrap">
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  className="h-6 px-2 text-[11px] text-primary hover:text-primary cursor-pointer"
                                  onClick={() => onTransferStaffClick(unit, member)}
                                >
                                  Chuyển
                                </Button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>

      {/* Dialog Thêm chức danh vào đơn vị */}
      <Dialog open={isAddPosOpen} onOpenChange={setIsAddPosOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle className="text-sm font-semibold">Thêm chức danh vào đơn vị</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 py-2 text-xs">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-foreground">
                Tên chức danh / Vị trí việc làm
              </label>
              <Input
                placeholder="VD: Chuyên viên Tuyển sinh, Giáo viên..."
                value={newPosName}
                onChange={(e) => setNewPosName(e.target.value)}
                className="h-8 text-xs"
              />
            </div>
            <div className="space-y-1 text-muted-foreground">
              <span className="text-[11px] font-medium block text-foreground/80">
                Gợi ý từ danh mục chuẩn:
              </span>
              <div className="flex flex-wrap gap-1 mt-1 max-h-28 overflow-y-auto">
                {[
                  'Giám đốc Chi nhánh',
                  'Giáo viên Tiếng Anh',
                  'Giáo viên IELTS',
                  'Trợ giảng Đào tạo',
                  'Chuyên viên CSKH',
                  'Chuyên viên Tư vấn Tuyển sinh',
                  'Kế toán Cơ sở',
                ]
                  .filter((item) => !unit.positions?.includes(item))
                  .map((item) => (
                    <button
                      key={item}
                      type="button"
                      className="text-[10px] px-2 py-0.5 rounded-full border bg-muted/40 hover:bg-primary/10 hover:border-primary/40 hover:text-primary transition-colors cursor-pointer"
                      onClick={() => setNewPosName(item)}
                    >
                      + {item}
                    </button>
                  ))}
              </div>
            </div>
          </div>
          <DialogFooter className="gap-2 pt-1">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsAddPosOpen(false)}
            >
              Hủy
            </Button>
            <Button
              type="button"
              size="sm"
              disabled={!newPosName.trim()}
              onClick={() => {
                if (newPosName.trim()) {
                  onAddPosition?.(unit.id, newPosName.trim())
                  setIsAddPosOpen(false)
                }
              }}
            >
              Lưu chức danh
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Dialog>
  )
}
