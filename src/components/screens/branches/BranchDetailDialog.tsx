'use client'

import { useState, useMemo } from 'react'
import {
  Check,
  DoorOpen,
  ExternalLink,
  History,
  Lock,
  Pencil,
  Plus,
  Trash2,
  Unlock,
  Users,
} from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { StatusBadge, FieldLabel } from '@/components/shared'
import { InlineSelect } from '@/components/controls'
import { cn } from '@/lib/utils'
import { BranchStaffTab } from './BranchStaffTab'
import { getInitialStaffForBranch } from './branchesHelpers'
import {
  BRANCH_REGIONS,
  type Branch,
  type BranchRoom,
  type BranchStaffMember,
} from './branchesTypes'

interface BranchDetailDialogProps {
  branch: Branch | null
  open: boolean
  initialEditMode?: boolean
  initialTab?: 'rooms' | 'staff' | 'history' | 'facilities'
  onOpenChange: (open: boolean) => void
  onToggleStatus: (branch: Branch) => void
  onAddRoom: (branchId: string, room: BranchRoom) => void
  onUpdateBranch?: (branchId: string, updates: Partial<Branch>) => void
}

const resolveTab = (t?: string): 'rooms' | 'staff' | 'history' => {
  if (t === 'staff') return 'staff'
  if (t === 'history') return 'history'
  return 'rooms'
}

export function BranchDetailDialog({
  branch,
  open,
  initialEditMode = false,
  initialTab = 'rooms',
  onOpenChange,
  onToggleStatus,
  onAddRoom,
  onUpdateBranch,
}: BranchDetailDialogProps) {
  const [prevBranchId, setPrevBranchId] = useState<string | null>(branch?.id || null)
  const [prevOpen, setPrevOpen] = useState(open)
  const [isEditing, setIsEditing] = useState(initialEditMode)
  const [activeTab, setActiveTab] = useState<'rooms' | 'staff' | 'history'>(() =>
    resolveTab(initialTab)
  )
  const [showAddRoom, setShowAddRoom] = useState(false)

  // Edit form state (facility & location attributes)
  const [editForm, setEditForm] = useState(() => ({
    name: branch?.name || '',
    region: branch?.region || '',
    province: branch?.province || '',
    district: branch?.district || '',
    address: branch?.address || '',
    coordinates: branch?.coordinates || '',
  }))

  // Rooms local state
  const [rooms, setRooms] = useState<BranchRoom[]>(() => branch?.rooms || [])

  // Staff local state
  const [staff, setStaff] = useState<BranchStaffMember[]>(() => getInitialStaffForBranch(branch))

  // Add room state
  const [newRoomName, setNewRoomName] = useState('')
  const [newRoomCapacity, setNewRoomCapacity] = useState(20)


  // Total capacity calculation
  const totalCapacity = useMemo(
    () => rooms.reduce((sum, r) => sum + (r.capacity || 0), 0),
    [rooms]
  )

  if (open && !prevOpen) {
    setPrevOpen(true)
    setActiveTab(resolveTab(initialTab))
    setIsEditing(initialEditMode)
  } else if (!open && prevOpen) {
    setPrevOpen(false)
  }

  if (branch && branch.id !== prevBranchId) {
    setPrevBranchId(branch.id)
    setIsEditing(initialEditMode)
    setActiveTab(resolveTab(initialTab))
    setRooms(branch.rooms || [])
    setStaff(getInitialStaffForBranch(branch))
    setEditForm({
      name: branch.name,
      region: branch.region,
      province: branch.province,
      district: branch.district,
      address: branch.address,
      coordinates: branch.coordinates,
    })
  }

  if (!branch) return null

  const handleRoomStatusChange = (roomId: string, newStatus: BranchRoom['status']) => {
    setRooms((prev) =>
      prev.map((r) => (r.id === roomId ? { ...r, status: newStatus } : r))
    )
  }

  const handleDeleteRoom = (roomId: string) => {
    setRooms((prev) => prev.filter((r) => r.id !== roomId))
  }

  const handleAddStaff = (member: BranchStaffMember) => {
    const updated = [...staff, member]
    setStaff(updated)
    if (!isEditing) {
      onUpdateBranch?.(branch.id, { assignedStaff: updated })
    }
  }

  const handleRemoveStaff = (memberId: string) => {
    const updated = staff.filter((s) => s.id !== memberId)
    setStaff(updated)
    if (!isEditing) {
      onUpdateBranch?.(branch.id, { assignedStaff: updated })
    }
  }

  const handleUpdateStaffRole = (memberId: string, newRole: string) => {
    const updated = staff.map((s) => (s.id === memberId ? { ...s, roleInBranch: newRole } : s))
    setStaff(updated)
    if (!isEditing) {
      onUpdateBranch?.(branch.id, { assignedStaff: updated })
    }
  }

  const handleSaveEdit = () => {
    const updates: Partial<Branch> = {
      name: editForm.name.trim() || branch.name,
      region: editForm.region || branch.region,
      province: editForm.province || branch.province,
      district: editForm.district || branch.district,
      address: editForm.address.trim() || branch.address,
      coordinates: editForm.coordinates || branch.coordinates,
      rooms: rooms,
      roomCount: rooms.length,
      totalCapacity: rooms.reduce((sum, r) => sum + r.capacity, 0),
      assignedStaff: staff,
    }

    onUpdateBranch?.(branch.id, updates)
    setIsEditing(false)
  }

  const handleCancelEdit = () => {
    setEditForm({
      name: branch.name,
      region: branch.region,
      province: branch.province,
      district: branch.district,
      address: branch.address,
      coordinates: branch.coordinates,
    })
    setRooms(branch.rooms || [])
    setStaff(getInitialStaffForBranch(branch))
    setIsEditing(false)
  }

  const handleCreateRoom = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newRoomName.trim()) return

    const newRoom: BranchRoom = {
      id: `rm-${branch.code.toLowerCase()}-${Date.now().toString().slice(-4)}`,
      name: newRoomName.trim(),
      code: `${branch.code}-${rooms.length + 101}`,
      roomType: 'standard',
      roomTypeLabel: 'Phòng tiêu chuẩn',
      capacity: Number(newRoomCapacity) || 20,
      floor: 'Tầng 1',
      status: 'available',
      equipment: [],
    }

    if (isEditing) {
      setRooms((prev) => [...prev, newRoom])
    } else {
      onAddRoom(branch.id, newRoom)
      setRooms((prev) => [...prev, newRoom])
    }
    setShowAddRoom(false)
    setNewRoomName('')
    setNewRoomCapacity(20)
  }

  const regionOptions = BRANCH_REGIONS.filter((r) => r.value !== 'all')

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[95vw] sm:max-w-4xl md:max-w-5xl lg:max-w-6xl h-[85vh] max-h-[760px] min-h-[580px] flex flex-col p-0 overflow-hidden shadow-2xl">
        {/* Dialog Header: Gọn gàng, tinh giản */}
        <DialogHeader className="px-4 py-2.5 border-b shrink-0 bg-background">
          <div className="flex items-center justify-between gap-3 pr-6">
            <div className="flex items-center gap-2 flex-wrap min-w-0">
              <span className="text-xs text-muted-foreground font-normal shrink-0">
                {isEditing ? 'Chỉnh sửa chi nhánh:' : 'Chi tiết chi nhánh:'}
              </span>
              <DialogTitle className="text-sm font-semibold text-foreground truncate">
                {isEditing ? editForm.name || branch.name : branch.name}
              </DialogTitle>
              {isEditing ? (
                <span className="inline-flex items-center rounded px-1.5 py-0.5 text-[10px] font-medium bg-primary/10 text-primary border border-primary/20">
                  Đang chỉnh sửa
                </span>
              ) : (
                <StatusBadge status={branch.status} label={branch.statusLabel} />
              )}
            </div>

            <div className="flex items-center gap-2 shrink-0">
              {isEditing ? (
                <>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-7 text-xs cursor-pointer px-2.5"
                    onClick={handleCancelEdit}
                  >
                    Hủy
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    className="h-7 text-xs gap-1.5 cursor-pointer px-2.5"
                    onClick={handleSaveEdit}
                  >
                    <Check className="h-3.5 w-3.5" />
                    <span>Lưu thay đổi</span>
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="h-7 text-xs gap-1.5 cursor-pointer px-2.5"
                    onClick={() => setIsEditing(true)}
                  >
                    <Pencil className="h-3.5 w-3.5 text-muted-foreground" />
                    <span>Chỉnh sửa</span>
                  </Button>
                  <Button
                    type="button"
                    variant={branch.status === 'active' ? 'outline' : 'default'}
                    size="sm"
                    className="h-7 text-xs gap-1.5 cursor-pointer px-2.5"
                    onClick={() => onToggleStatus(branch)}
                  >
                    {branch.status === 'active' ? (
                      <>
                        <Lock className="h-3.5 w-3.5 text-amber-600" />
                        <span>Tạm dừng cơ sở</span>
                      </>
                    ) : (
                      <>
                        <Unlock className="h-3.5 w-3.5 text-emerald-600" />
                        <span>Kích hoạt cơ sở</span>
                      </>
                    )}
                  </Button>
                </>
              )}
            </div>
          </div>
        </DialogHeader>

        {/* Dialog Body: Bố cục 2 cột với các Card Section đóng khung chuyên nghiệp */}
        <div className="flex-1 min-h-0 flex flex-col md:flex-row overflow-hidden p-3.5 sm:p-4 gap-3.5 bg-muted/20">
          {/* ========================================================= */}
          {/* PANEL TRÁI: SECTION CARD THUỘC TÍNH CƠ SỞ                */}
          {/* ========================================================= */}
          <div className="w-full md:w-[310px] lg:w-[330px] shrink-0 h-full min-h-0 flex flex-col rounded-lg border border-border/70 bg-card p-4 shadow-2xs overflow-y-auto">
            {isEditing ? (
              /* Form Chỉnh sửa Thông tin */
              <div className="space-y-3 text-xs">
                <div className="flex items-center justify-between pb-2 border-b border-border/50">
                  <span className="font-semibold text-foreground text-xs">Thuộc tính chi nhánh</span>
                  <span className="font-mono text-[10px] text-muted-foreground">{branch.code}</span>
                </div>

                <FieldLabel label="Tên cơ sở / Chi nhánh" required>
                  <Input
                    value={editForm.name}
                    onChange={(e) => setEditForm((p) => ({ ...p, name: e.target.value }))}
                    className="h-7 text-xs bg-background"
                  />
                </FieldLabel>

                <FieldLabel label="Khu vực">
                  <InlineSelect
                    value={editForm.region}
                    options={regionOptions}
                    onValueChange={(val) => setEditForm((p) => ({ ...p, region: val }))}
                    ariaLabel="Khu vực"
                    className="h-7 text-xs bg-background"
                  />
                </FieldLabel>

                <div className="grid grid-cols-2 gap-2">
                  <FieldLabel label="Tỉnh / Thành">
                    <Input
                      value={editForm.province}
                      onChange={(e) =>
                        setEditForm((p) => ({ ...p, province: e.target.value }))
                      }
                      className="h-7 text-xs bg-background"
                    />
                  </FieldLabel>
                  <FieldLabel label="Quận / Huyện">
                    <Input
                      value={editForm.district}
                      onChange={(e) =>
                        setEditForm((p) => ({ ...p, district: e.target.value }))
                      }
                      className="h-7 text-xs bg-background"
                    />
                  </FieldLabel>
                </div>

                <FieldLabel label="Địa chỉ chi tiết">
                  <Input
                    value={editForm.address}
                    onChange={(e) => setEditForm((p) => ({ ...p, address: e.target.value }))}
                    className="h-7 text-xs bg-background"
                  />
                </FieldLabel>

                <FieldLabel label="Tọa độ GPS">
                  <Input
                    value={editForm.coordinates}
                    onChange={(e) =>
                      setEditForm((p) => ({ ...p, coordinates: e.target.value }))
                    }
                    placeholder="VD: 20.9634, 105.8271"
                    className="h-7 text-xs font-mono bg-background"
                  />
                </FieldLabel>
              </div>
            ) : (
              /* Chế độ Xem: Section Card gọn gàng, rõ ràng */
              <div className="space-y-3.5 text-xs">
                {/* 1. Tiêu đề Section & Trạng thái */}
                <div className="flex items-center justify-between pb-2.5 border-b border-border/50">
                  <span className="text-xs font-semibold text-foreground">Thông tin cơ sở</span>
                  <StatusBadge status={branch.status} label={branch.statusLabel} />
                </div>

                {/* 2. Định danh cơ sở */}
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5">
                    <span className="font-mono text-xs font-semibold px-2 py-0.5 rounded bg-muted text-foreground border border-border/50">
                      {branch.code}
                    </span>
                    <span className="text-xs text-muted-foreground truncate">
                      {branch.typeLabel || 'Trung tâm Đào tạo'}
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-foreground leading-snug pt-1">
                    {branch.name}
                  </h3>
                  <p className="text-xs text-muted-foreground">{branch.region}</p>
                </div>

                {/* 3. Tóm tắt quy mô nhẹ nhàng */}
                <div className="py-2 px-2.5 rounded-md bg-muted/40 border border-border/40 text-xs text-muted-foreground flex items-center justify-between">
                  <span><strong className="text-foreground font-semibold">{rooms.length}</strong> phòng</span>
                  <span className="text-muted-foreground/40">•</span>
                  <span><strong className="text-foreground font-semibold">{totalCapacity}</strong> chỗ</span>
                  <span className="text-muted-foreground/40">•</span>
                  <span><strong className="text-foreground font-semibold">{staff.length}</strong> nhân sự</span>
                </div>

                {/* 4. Chi tiết thuộc tính */}
                <div className="space-y-3 pt-0.5">
                  <div>
                    <span className="text-[11px] text-muted-foreground block font-medium">
                      Địa chỉ chi nhánh
                    </span>
                    <p className="text-foreground leading-relaxed mt-0.5">
                      {branch.address}
                    </p>
                    <p className="text-[11px] text-muted-foreground mt-0.5">
                      {branch.province} {branch.district ? `(${branch.district})` : ''}
                    </p>
                  </div>

                  {branch.businessHours && (
                    <div>
                      <span className="text-[11px] text-muted-foreground block font-medium">
                        Giờ mở cửa
                      </span>
                      <p className="text-foreground mt-0.5">
                        {branch.businessHours.openTime} - {branch.businessHours.closeTime}
                      </p>
                      <p className="text-[11px] text-muted-foreground mt-0.5">
                        {branch.businessHours.daysOfWeek}
                      </p>
                    </div>
                  )}

                  <div>
                    <span className="text-[11px] text-muted-foreground block font-medium">
                      Tọa độ GPS
                    </span>
                    <div className="flex items-center gap-2 mt-0.5 font-mono text-[11px]">
                      <span className="text-foreground">
                        {branch.coordinates || 'Chưa định vị GPS'}
                      </span>
                      {branch.coordinates && (
                        <a
                          href={`https://maps.google.com/?q=${branch.coordinates}`}
                          target="_blank"
                          rel="noreferrer"
                          className="text-primary hover:underline flex items-center gap-0.5 cursor-pointer text-[11px]"
                        >
                          <span>Bản đồ</span>
                          <ExternalLink className="h-2.5 w-2.5" />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* ========================================================= */}
          {/* PANEL PHẢI: 3 TABS ĐÓNG KHUNG SECTION BẢNG               */}
          {/* ========================================================= */}
          <div className="flex-1 min-h-0 h-full flex flex-col gap-2">
            {/* Hàng Tabs điều hướng */}
            <div className="shrink-0 flex items-center gap-1">
              <button
                type="button"
                onClick={() => setActiveTab('rooms')}
                className={cn(
                  'flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors cursor-pointer',
                  activeTab === 'rooms'
                    ? 'bg-primary/10 text-primary font-semibold border border-primary/20 bg-background shadow-2xs'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                )}
              >
                <DoorOpen className="h-3.5 w-3.5" />
                <span>Phòng học ({rooms.length})</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('staff')}
                className={cn(
                  'flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors cursor-pointer',
                  activeTab === 'staff'
                    ? 'bg-primary/10 text-primary font-semibold border border-primary/20 bg-background shadow-2xs'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                )}
              >
                <Users className="h-3.5 w-3.5" />
                <span>Nhân sự ({staff.length})</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('history')}
                className={cn(
                  'flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors cursor-pointer',
                  activeTab === 'history'
                    ? 'bg-primary/10 text-primary font-semibold border border-primary/20 bg-background shadow-2xs'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                )}
              >
                <History className="h-3.5 w-3.5" />
                <span>Nhật ký ({branch.history?.length || 0})</span>
              </button>
            </div>

            {/* Nội dung Tab: Mỗi tab là 1 Card đóng khung Section hoàn chỉnh */}
            <div className="flex-1 min-h-0 flex flex-col">
              {/* Tab 1: Danh sách phòng - Đóng khung Section Card */}
              {activeTab === 'rooms' && (
                <div className="h-full min-h-0 flex flex-col rounded-lg border border-border/70 bg-card shadow-2xs overflow-hidden">
                  {/* Card Header: Tiêu đề + Nút thêm phòng */}
                  <div className="shrink-0 px-3.5 py-2.5 border-b border-border/50 flex items-center justify-between bg-muted/20 gap-2">
                    <span className="text-xs font-semibold text-foreground">
                      Danh sách phòng học ({rooms.length})
                    </span>
                    <Button
                      type="button"
                      variant={showAddRoom ? 'secondary' : 'outline'}
                      size="sm"
                      className="h-7 gap-1 text-xs cursor-pointer px-2.5"
                      onClick={() => setShowAddRoom(!showAddRoom)}
                    >
                      {showAddRoom ? (
                        <span>Đóng</span>
                      ) : (
                        <>
                          <Plus className="h-3.5 w-3.5" />
                          <span>Thêm phòng</span>
                        </>
                      )}
                    </Button>
                  </div>

                  {/* Form thêm phòng inline nếu mở */}
                  {showAddRoom ? (
                    <form
                      onSubmit={handleCreateRoom}
                      className="shrink-0 p-3 bg-primary/5 border-b border-primary/20 space-y-2"
                    >
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <FieldLabel label="Tên phòng" required>
                          <Input
                            placeholder="VD: Phòng 106 - STEAM"
                            value={newRoomName}
                            onChange={(e) => setNewRoomName(e.target.value)}
                            className="h-7 text-xs bg-background"
                            autoFocus
                          />
                        </FieldLabel>
                        <FieldLabel label="Sức chứa (HV)">
                          <Input
                            type="number"
                            min={1}
                            value={newRoomCapacity}
                            onChange={(e) => setNewRoomCapacity(Number(e.target.value))}
                            className="h-7 text-xs bg-background"
                          />
                        </FieldLabel>
                      </div>
                      <div className="flex justify-end gap-2 pt-0.5">
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="h-6 text-xs cursor-pointer"
                          onClick={() => setShowAddRoom(false)}
                        >
                          Hủy
                        </Button>
                        <Button type="submit" size="sm" className="h-6 text-xs cursor-pointer">
                          Lưu phòng
                        </Button>
                      </div>
                    </form>
                  ) : null}

                  {/* Bảng phòng: Đóng khung trọn vẹn trong Section Card */}
                  <div className="flex-1 min-h-0 overflow-auto">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead className="sticky top-0 z-10 border-b border-border/50 bg-muted/40 font-medium text-muted-foreground">
                        <tr>
                          <th className="py-2.5 px-3">Phòng</th>
                          <th className="py-2.5 px-3 text-center">Sức chứa</th>
                          <th className="py-2.5 px-3 text-center">Trạng thái</th>
                          {isEditing ? <th className="py-2.5 px-1 text-center w-8"></th> : null}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border/40">
                        {rooms && rooms.length > 0 ? (
                          rooms.map((room) => (
                            <tr key={room.id} className="hover:bg-muted/30 transition-colors">
                              <td className="py-2 px-3 font-medium text-foreground">{room.name}</td>
                              <td className="py-2 px-3 text-center font-semibold">{room.capacity} HV</td>
                              <td className="py-2 px-3 text-center">
                                {isEditing ? (
                                  <InlineSelect
                                    value={room.status}
                                    options={[
                                      { value: 'available', label: 'Sẵn sàng' },
                                      { value: 'in_use', label: 'Đang học' },
                                      { value: 'maintenance', label: 'Bảo trì' },
                                    ]}
                                    onValueChange={(val) =>
                                      handleRoomStatusChange(room.id, val as BranchRoom['status'])
                                    }
                                    ariaLabel="Trạng thái phòng"
                                    className="h-6 text-xs w-[105px] mx-auto"
                                  />
                                ) : (
                                  <StatusBadge
                                    status={
                                      room.status === 'available'
                                        ? 'active'
                                        : room.status === 'in_use'
                                        ? 'in_progress'
                                        : 'maintenance'
                                    }
                                    label={
                                      room.status === 'available'
                                        ? 'Sẵn sàng'
                                        : room.status === 'in_use'
                                        ? 'Đang học'
                                        : 'Bảo trì'
                                    }
                                  />
                                )}
                              </td>
                              {isEditing ? (
                                <td className="py-2 px-1 text-center">
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    className="h-6 w-6 text-muted-foreground hover:text-destructive cursor-pointer"
                                    title="Xóa phòng"
                                    onClick={() => handleDeleteRoom(room.id)}
                                  >
                                    <Trash2 className="h-3 w-3" />
                                    <span className="sr-only">Xóa phòng</span>
                                  </Button>
                                </td>
                              ) : null}
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan={isEditing ? 4 : 3} className="py-8 text-center text-muted-foreground">
                              Chưa có phòng nào được khai báo.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Tab 2: Nhân sự - Section Card đóng khung hoàn chỉnh */}
              {activeTab === 'staff' && (
                <BranchStaffTab
                  staff={staff}
                  branchName={branch.name}
                  isEditable={true}
                  onAddStaff={handleAddStaff}
                  onRemoveStaff={handleRemoveStaff}
                  onUpdateRole={handleUpdateStaffRole}
                />
              )}

              {/* Tab 3: Nhật ký - Section Card đóng khung hoàn chỉnh */}
              {activeTab === 'history' && (
                <div className="h-full min-h-0 flex flex-col rounded-lg border border-border/70 bg-card shadow-2xs overflow-hidden">
                  <div className="shrink-0 px-3.5 py-2.5 border-b border-border/50 flex items-center justify-between bg-muted/20">
                    <span className="text-xs font-semibold text-foreground">
                      Nhật ký hoạt động ({branch.history?.length || 0})
                    </span>
                  </div>

                  <div className="flex-1 min-h-0 overflow-auto p-3 divide-y divide-border/40 font-mono text-[11px]">
                    {branch.history && branch.history.length > 0 ? (
                      branch.history.map((item) => (
                        <div
                          key={item.id}
                          className="py-2 px-2 flex items-center gap-2.5 text-muted-foreground hover:bg-muted/30 transition-colors"
                        >
                          <span className="shrink-0 text-muted-foreground/80">{item.timestamp}</span>
                          <span className="shrink-0 font-semibold text-foreground">[{item.actor}]</span>
                          <span className="truncate text-foreground/90">
                            {item.action}: {item.details}
                          </span>
                        </div>
                      ))
                    ) : (
                      <div className="py-8 text-center text-muted-foreground text-xs font-sans">
                        Chưa có ghi nhận hệ thống.
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

      </DialogContent>
    </Dialog>
  )
}
