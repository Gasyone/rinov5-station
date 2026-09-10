'use client'

import { useState } from 'react'
import { Check, DoorOpen, Plus, Trash2, Users } from 'lucide-react'
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
import { validateBranchCode } from './branchesHelpers'
import {
  BRANCH_REGIONS,
  type Branch,
  type BranchRoom,
  type BranchStaffMember,
} from './branchesTypes'

interface BranchCreateDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  existingBranches: Branch[]
  onSubmit: (newBranchData: Partial<Branch>) => void
}

interface CreateFormData {
  code: string
  name: string
  region: string
  province: string
  district: string
  address: string
  coordinates: string
}

const INITIAL_FORM: CreateFormData = {
  code: '',
  name: '',
  region: 'Miền Bắc - Hà Nội',
  province: 'Hà Nội',
  district: '',
  address: '',
  coordinates: '',
}

const DEFAULT_INITIAL_ROOMS: BranchRoom[] = [
  {
    id: 'rm-init-1',
    name: 'Phòng 101 - Tiêu chuẩn',
    code: 'P101',
    roomType: 'standard',
    roomTypeLabel: 'Phòng tiêu chuẩn',
    capacity: 20,
    floor: 'Tầng 1',
    status: 'available',
    equipment: [],
  },
  {
    id: 'rm-init-2',
    name: 'Phòng 102 - Hội trường',
    code: 'P102',
    roomType: 'multipurpose',
    roomTypeLabel: 'Phòng đa năng',
    capacity: 40,
    floor: 'Tầng 1',
    status: 'available',
    equipment: [],
  },
]

export function BranchCreateDialog({
  open,
  onOpenChange,
  existingBranches,
  onSubmit,
}: BranchCreateDialogProps) {
  const [formData, setFormData] = useState<CreateFormData>(INITIAL_FORM)
  const [rooms, setRooms] = useState<BranchRoom[]>(DEFAULT_INITIAL_ROOMS)
  const [staff, setStaff] = useState<BranchStaffMember[]>([])
  const [activeTab, setActiveTab] = useState<'rooms' | 'staff'>('rooms')
  const [showAddRoom, setShowAddRoom] = useState(false)
  const [newRoomName, setNewRoomName] = useState('')
  const [newRoomCapacity, setNewRoomCapacity] = useState(20)
  const [codeError, setCodeError] = useState<string | null>(null)
  const [formError, setFormError] = useState<string | null>(null)

  const regionOptions = BRANCH_REGIONS.filter((r) => r.value !== 'all')

  const handleRoomStatusChange = (roomId: string, newStatus: BranchRoom['status']) => {
    setRooms((prev) =>
      prev.map((r) => (r.id === roomId ? { ...r, status: newStatus } : r))
    )
  }

  const handleDeleteRoom = (roomId: string) => {
    setRooms((prev) => prev.filter((r) => r.id !== roomId))
  }

  const handleCreateRoom = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newRoomName.trim()) return

    const newRoom: BranchRoom = {
      id: `rm-new-${Date.now().toString().slice(-4)}`,
      name: newRoomName.trim(),
      code: `${formData.code || 'BR'}-${rooms.length + 101}`,
      roomType: 'standard',
      roomTypeLabel: 'Phòng tiêu chuẩn',
      capacity: Number(newRoomCapacity) || 20,
      floor: 'Tầng 1',
      status: 'available',
      equipment: [],
    }

    setRooms((prev) => [...prev, newRoom])
    setShowAddRoom(false)
    setNewRoomName('')
    setNewRoomCapacity(20)
  }

  const handleAddStaff = (member: BranchStaffMember) => {
    setStaff((prev) => [...prev, member])
  }

  const handleRemoveStaff = (memberId: string) => {
    setStaff((prev) => prev.filter((s) => s.id !== memberId))
  }

  const handleUpdateStaffRole = (memberId: string, newRole: string) => {
    setStaff((prev) =>
      prev.map((s) => (s.id === memberId ? { ...s, roleInBranch: newRole } : s))
    )
  }

  const handleSubmit = () => {
    setFormError(null)

    if (!formData.name.trim()) {
      setFormError('Vui lòng nhập tên chi nhánh.')
      return
    }

    const codeValidation = validateBranchCode(formData.code, existingBranches)
    if (codeValidation) {
      setCodeError(codeValidation)
      return
    }

    const totalCap = rooms.reduce((sum, r) => sum + r.capacity, 0)

    const payload: Partial<Branch> = {
      code: formData.code.trim().toUpperCase(),
      name: formData.name.trim(),
      region: formData.region,
      province: formData.province.trim(),
      district: formData.district.trim(),
      address: formData.address.trim(),
      coordinates: formData.coordinates.trim(),
      status: 'setup',
      statusLabel: 'Mới thiết lập',
      type: 'training_center',
      typeLabel: 'Trung tâm Đào tạo',
      roomCount: rooms.length,
      totalCapacity: totalCap,
      rooms: rooms,
      assignedStaff: staff,
      history: [
        {
          id: `h-init-${Date.now()}`,
          timestamp: new Date().toISOString().slice(0, 16).replace('T', ' '),
          actor: 'Admin Hệ thống',
          action: 'Khởi tạo cơ sở',
          details: `Khai báo mới cơ sở ${formData.name.trim()} (${formData.code.toUpperCase()}) với ${rooms.length} phòng và ${staff.length} nhân sự phụ trách`,
        },
      ],
    }

    onSubmit(payload)
    onOpenChange(false)
    setFormData(INITIAL_FORM)
    setRooms(DEFAULT_INITIAL_ROOMS)
    setStaff([])
    setActiveTab('rooms')
  }

  const handleClose = () => {
    onOpenChange(false)
    setFormData(INITIAL_FORM)
    setRooms(DEFAULT_INITIAL_ROOMS)
    setStaff([])
    setActiveTab('rooms')
    setFormError(null)
    setCodeError(null)
    setShowAddRoom(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[95vw] sm:max-w-4xl md:max-w-5xl lg:max-w-6xl h-[85vh] max-h-[760px] min-h-[580px] flex flex-col p-0 overflow-hidden shadow-2xl">
        {/* Header khớp với BranchDetailDialog */}
        <DialogHeader className="px-4 py-2.5 border-b shrink-0 bg-background">
          <div className="flex items-center justify-between gap-3 pr-6">
            <div className="flex items-center gap-2 flex-wrap min-w-0">
              <span className="text-xs text-muted-foreground font-normal shrink-0">
                Tạo mới chi nhánh:
              </span>
              <DialogTitle className="text-sm font-semibold text-foreground truncate">
                {formData.name || 'Chi nhánh mới'}
              </DialogTitle>
              <StatusBadge status="setup" label="Mới thiết lập" />
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-7 text-xs cursor-pointer px-2.5"
                onClick={handleClose}
              >
                Hủy
              </Button>
              <Button
                type="button"
                size="sm"
                className="h-7 text-xs cursor-pointer px-3 gap-1.5"
                onClick={handleSubmit}
              >
                <Check className="h-3.5 w-3.5" />
                <span>Lưu chi nhánh</span>
              </Button>
            </div>
          </div>
        </DialogHeader>

        {/* Dialog Body: Bố cục 2 cột với các Card Section đóng khung chuyên nghiệp */}
        <div className="flex-1 min-h-0 flex flex-col md:flex-row overflow-hidden p-3.5 sm:p-4 gap-3.5 bg-muted/20">
          {/* PANEL TRÁI: SECTION CARD THUỘC TÍNH CƠ SỞ */}
          <div className="w-full md:w-[310px] lg:w-[330px] shrink-0 h-full min-h-0 flex flex-col rounded-lg border border-border/70 bg-card p-4 shadow-2xs overflow-y-auto space-y-3">
            <div className="flex items-center justify-between pb-2.5 border-b border-border/50">
              <span className="text-xs font-semibold text-foreground">Thông tin cơ sở</span>
              <StatusBadge status="setup" label="Mới thiết lập" />
            </div>

            {formError ? (
              <div className="rounded-md bg-destructive/10 p-2 text-xs text-destructive">
                {formError}
              </div>
            ) : null}

            <FieldLabel label="Mã định danh cơ sở" required description="Viết hoa, không dấu (VD: CG_HN)">
              <Input
                placeholder="VD: CG_HN"
                value={formData.code}
                onChange={(e) => {
                  setFormData((p) => ({ ...p, code: e.target.value.toUpperCase() }))
                  setCodeError(null)
                }}
                className="h-7 font-mono text-xs uppercase bg-background"
              />
              {codeError ? (
                <span className="text-[11px] text-destructive mt-0.5 block">{codeError}</span>
              ) : null}
            </FieldLabel>

            <FieldLabel label="Tên cơ sở / Chi nhánh" required>
              <Input
                placeholder="VD: RinoEdu Cầu Giấy"
                value={formData.name}
                onChange={(e) => setFormData((p) => ({ ...p, name: e.target.value }))}
                className="h-7 text-xs bg-background"
              />
            </FieldLabel>

            <FieldLabel label="Khu vực">
              <InlineSelect
                value={formData.region}
                options={regionOptions}
                onValueChange={(val) => setFormData((p) => ({ ...p, region: val }))}
                ariaLabel="Khu vực"
                className="h-7 text-xs bg-background"
              />
            </FieldLabel>

            <div className="grid grid-cols-2 gap-2">
              <FieldLabel label="Tỉnh / Thành">
                <Input
                  placeholder="VD: Hà Nội"
                  value={formData.province}
                  onChange={(e) => setFormData((p) => ({ ...p, province: e.target.value }))}
                  className="h-7 text-xs bg-background"
                />
              </FieldLabel>
              <FieldLabel label="Quận / Huyện">
                <Input
                  placeholder="VD: Cầu Giấy"
                  value={formData.district}
                  onChange={(e) => setFormData((p) => ({ ...p, district: e.target.value }))}
                  className="h-7 text-xs bg-background"
                />
              </FieldLabel>
            </div>

            <FieldLabel label="Địa chỉ chi tiết" required>
              <Input
                placeholder="VD: Tầng 4, Discovery Complex, 302 Cầu Giấy"
                value={formData.address}
                onChange={(e) => setFormData((p) => ({ ...p, address: e.target.value }))}
                className="h-7 text-xs bg-background"
              />
            </FieldLabel>

            <FieldLabel label="Tọa độ GPS">
              <Input
                placeholder="VD: 21.0285, 105.8542"
                value={formData.coordinates}
                onChange={(e) => setFormData((p) => ({ ...p, coordinates: e.target.value }))}
                className="h-7 text-xs font-mono bg-background"
              />
            </FieldLabel>
          </div>

          {/* PANEL PHẢI: 2 TABS ĐÓNG KHUNG SECTION BẢNG */}
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
            </div>

            {/* Nội dung Tab: Mỗi tab là 1 Card đóng khung Section hoàn chỉnh */}
            <div className="flex-1 min-h-0 flex flex-col">
              {/* Tab 1: Danh sách phòng - Section Card */}
              {activeTab === 'rooms' && (
                <div className="h-full min-h-0 flex flex-col rounded-lg border border-border/70 bg-card shadow-2xs overflow-hidden">
                  {/* Card Header: Tiêu đề + Thêm phòng */}
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
                    <div className="shrink-0 p-3 bg-primary/5 border-b border-primary/20 space-y-2">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <FieldLabel label="Tên phòng" required>
                          <Input
                            placeholder="VD: Phòng 103 - STEAM"
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
                        <Button
                          type="button"
                          size="sm"
                          className="h-6 text-xs cursor-pointer"
                          onClick={handleCreateRoom}
                        >
                          Lưu phòng
                        </Button>
                      </div>
                    </div>
                  ) : null}

                  {/* Bảng phòng: Đóng khung trọn vẹn trong Section Card */}
                  <div className="flex-1 min-h-0 overflow-auto">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead className="sticky top-0 z-10 border-b border-border/50 bg-muted/40 font-medium text-muted-foreground">
                        <tr>
                          <th className="py-2.5 px-3">Phòng</th>
                          <th className="py-2.5 px-3 text-center">Sức chứa</th>
                          <th className="py-2.5 px-3 text-center">Trạng thái</th>
                          <th className="py-2.5 px-1 text-center w-8"></th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border/40">
                        {rooms && rooms.length > 0 ? (
                          rooms.map((room) => (
                            <tr key={room.id} className="hover:bg-muted/30 transition-colors">
                              <td className="py-2 px-3 font-medium text-foreground">{room.name}</td>
                              <td className="py-2 px-3 text-center font-semibold">{room.capacity} HV</td>
                              <td className="py-2 px-3 text-center">
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
                              </td>
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
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan={4} className="py-8 text-center text-muted-foreground">
                              Chưa có phòng nào được khai báo. Bấm &quot;+ Thêm phòng&quot; để bổ sung.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Tab 2: Nhân sự phụ trách - Section Card đóng khung hoàn chỉnh */}
              {activeTab === 'staff' && (
                <BranchStaffTab
                  staff={staff}
                  branchName={formData.name || 'cơ sở mới'}
                  isEditable={true}
                  onAddStaff={handleAddStaff}
                  onRemoveStaff={handleRemoveStaff}
                  onUpdateRole={handleUpdateStaffRole}
                />
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
