'use client'

import { useMemo, useState } from 'react'
import { Calendar, ChevronsUpDown, Edit, Plus, Repeat, Trash2 } from 'lucide-react'
import { DataTableFrame } from '@/components/data-table'
import { ExpandableSearch } from '@/components/controls'
import { ConfirmDialog, StatusBadge, StatusTiles, type StatusTile } from '@/components/shared'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import {
  addMockHoliday,
  batchDeleteMockHolidays,
  deleteMockHoliday,
  getMockHolidays,
  updateMockHoliday,
  type HolidayConfig,
} from '@/mocks/holidays'

interface WorkRegistrationHolidayPanelProps {
  activeBranch?: string
  branches?: string[]
}

const TYPE_CONFIG = {
  national: { label: 'Lễ Quốc gia', variant: 'national' },
  internal: { label: 'Nghỉ nội bộ', variant: 'internal' },
  center: { label: 'Nghỉ riêng cơ sở', variant: 'center' },
}

const AVAILABLE_YEARS = [2024, 2025, 2026, 2027, 2028]
const SYSTEM_SCOPE = 'Toàn hệ thống'

export function WorkRegistrationHolidayPanel({
  activeBranch = 'all',
  branches = [],
}: WorkRegistrationHolidayPanelProps) {
  const [selectedYear, setSelectedYear] = useState<number>(2026)
  const [holidays, setHolidays] = useState<HolidayConfig[]>(() => getMockHolidays(2026, activeBranch))
  const [search, setSearch] = useState('')
  const [selectedType, setSelectedType] = useState<string>('all')
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [editingHoliday, setEditingHoliday] = useState<HolidayConfig | null>(null)
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [batchDeleteOpen, setBatchDeleteOpen] = useState(false)
  const [scopeDropdownOpen, setScopeDropdownOpen] = useState(false)

  // Danh sách các cơ sở cụ thể
  const centerList = useMemo(() => {
    return branches.filter((b) => b !== 'all' && b !== SYSTEM_SCOPE)
  }, [branches])

  // Form state
  const [formData, setFormData] = useState<Omit<HolidayConfig, 'id'>>({
    name: '',
    year: 2026,
    startDate: '2026-08-18',
    endDate: '2026-08-18',
    daysCount: 1,
    type: 'national',
    scopes: [SYSTEM_SCOPE],
    isRecurring: false,
    status: 'active',
    description: '',
  })

  // Thống kê số lượng theo chuẩn StatusTiles
  const statusTiles: StatusTile<string>[] = useMemo(() => {
    const yearHolidays = holidays.filter((h) => h.year === selectedYear || h.isRecurring)
    const nationalCount = yearHolidays.filter((h) => h.type === 'national').length
    const internalCount = yearHolidays.filter((h) => h.type === 'internal').length
    const centerCount = yearHolidays.filter((h) => h.type === 'center').length
    const totalCount = yearHolidays.length

    return [
      { id: 'all', label: 'Tất cả', count: totalCount, semantic: 'neutral' },
      { id: 'national', label: 'Lễ Quốc gia', count: nationalCount, semantic: 'purple' },
      { id: 'internal', label: 'Nghỉ nội bộ', count: internalCount, semantic: 'info' },
      { id: 'center', label: 'Nghỉ riêng cơ sở', count: centerCount, semantic: 'warning' },
    ]
  }, [holidays, selectedYear])

  const filteredHolidays = useMemo(() => {
    return holidays.filter((item) => {
      // Lọc theo năm: hiển thị nếu đúng năm HOẶC có cờ lặp lại hàng năm
      if (item.year !== selectedYear && !item.isRecurring) return false
      // Lọc theo phân loại
      if (selectedType !== 'all' && item.type !== selectedType) return false
      // Lọc tìm kiếm
      if (search.trim()) {
        const q = search.toLowerCase().trim()
        const matchName = item.name.toLowerCase().includes(q)
        const matchScope = item.scopes.some((s) => s.toLowerCase().includes(q))
        if (!matchName && !matchScope) return false
      }
      return true
    })
  }, [holidays, search, selectedType, selectedYear])

  // Xử lý chọn nhiều checkbox
  const isAllSelected =
    filteredHolidays.length > 0 &&
    filteredHolidays.every((item) => selectedIds.includes(item.id))

  const handleToggleSelectAll = () => {
    if (isAllSelected) {
      setSelectedIds([])
    } else {
      setSelectedIds(filteredHolidays.map((item) => item.id))
    }
  }

  const handleToggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    )
  }

  const handleOpenCreate = () => {
    setFormData({
      name: '',
      year: selectedYear,
      startDate: `${selectedYear}-08-18`,
      endDate: `${selectedYear}-08-18`,
      daysCount: 1,
      type: 'national',
      scopes: activeBranch && activeBranch !== 'all' ? [activeBranch] : [SYSTEM_SCOPE],
      isRecurring: false,
      status: 'active',
      description: '',
    })
    setIsCreateOpen(true)
  }

  const handleOpenEdit = (holiday: HolidayConfig) => {
    setEditingHoliday(holiday)
    setFormData({
      name: holiday.name,
      year: holiday.year,
      startDate: holiday.startDate,
      endDate: holiday.endDate,
      daysCount: holiday.daysCount,
      type: holiday.type,
      scopes: holiday.scopes || [SYSTEM_SCOPE],
      isRecurring: Boolean(holiday.isRecurring),
      status: holiday.status,
      description: holiday.description || '',
    })
  }

  const calculateDays = (start: string, end: string) => {
    if (!start || !end) return 1
    const s = new Date(start).getTime()
    const e = new Date(end).getTime()
    const diff = Math.round((e - s) / (1000 * 60 * 60 * 24)) + 1
    return diff > 0 ? diff : 1
  }

  const handleDateChange = (field: 'startDate' | 'endDate', val: string) => {
    const updated = { ...formData, [field]: val }
    if (field === 'startDate') {
      if (updated.endDate < val) updated.endDate = val
      // Tự động nhận diện năm từ startDate
      const yearFromDate = parseInt(val.slice(0, 4), 10)
      if (yearFromDate && !isNaN(yearFromDate)) {
        updated.year = yearFromDate
      }
    }
    updated.daysCount = calculateDays(updated.startDate, updated.endDate)
    setFormData(updated)
  }

  // Toggle chọn trường/cơ sở trong droplist
  const handleToggleScope = (scope: string) => {
    if (scope === SYSTEM_SCOPE) {
      setFormData((prev) => ({
        ...prev,
        scopes: [SYSTEM_SCOPE],
      }))
      return
    }

    setFormData((prev) => {
      let current = prev.scopes.filter((s) => s !== SYSTEM_SCOPE)
      if (current.includes(scope)) {
        current = current.filter((s) => s !== scope)
      } else {
        current = [...current, scope]
      }
      if (current.length === 0) {
        current = [SYSTEM_SCOPE]
      }
      return { ...prev, scopes: current }
    })
  }

  const handleSave = () => {
    if (!formData.name.trim()) {
      toast.error('Vui lòng nhập tên ngày nghỉ lễ')
      return
    }

    if (editingHoliday) {
      updateMockHoliday(editingHoliday.id, formData)
      setHolidays((prev) =>
        prev.map((h) => (h.id === editingHoliday.id ? { ...h, ...formData } : h))
      )
      toast.success('Đã cập nhật lịch nghỉ lễ')
      setEditingHoliday(null)
    } else {
      const created = addMockHoliday(formData)
      setHolidays((prev) => [created, ...prev])
      toast.success('Đã thêm lịch nghỉ lễ mới')
      setIsCreateOpen(false)
    }
  }

  const handleDelete = () => {
    if (!deletingId) return
    deleteMockHoliday(deletingId)
    setHolidays((prev) => prev.filter((h) => h.id !== deletingId))
    setSelectedIds((prev) => prev.filter((id) => id !== deletingId))
    toast.success('Đã xóa ngày nghỉ lễ')
    setDeletingId(null)
  }

  const handleBatchDelete = () => {
    if (selectedIds.length === 0) return
    batchDeleteMockHolidays(selectedIds)
    setHolidays((prev) => prev.filter((h) => !selectedIds.includes(h.id)))
    toast.success(`Đã xóa ${selectedIds.length} ngày nghỉ lễ`)
    setSelectedIds([])
    setBatchDeleteOpen(false)
  }

  // Label hiển thị trên dropdown Phạm vi áp dụng
  const scopeDisplayText = useMemo(() => {
    if (formData.scopes.includes(SYSTEM_SCOPE)) {
      return 'Toàn hệ thống'
    }
    if (formData.scopes.length === 1) {
      return formData.scopes[0]
    }
    return `Đã chọn ${formData.scopes.length} cơ sở`
  }, [formData.scopes])

  return (
    <div className="flex h-full min-h-0 flex-1 flex-col gap-3">
      {/* TOOLBAR: STATUS TILES TRÁI - NĂM, SEARCH & NÚT THÊM PHẢI */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <StatusTiles
          tiles={statusTiles}
          activeId={selectedType}
          onSelect={(id) => setSelectedType(id)}
        />

        <div className="flex items-center gap-2">
          {/* BỘ CHỌN NĂM */}
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(Number(e.target.value))}
            className="h-8 rounded-md border border-input bg-background px-2.5 text-xs font-semibold text-foreground outline-none cursor-pointer hover:bg-muted/30"
          >
            {AVAILABLE_YEARS.map((y) => (
              <option key={y} value={y}>
                Năm {y}
              </option>
            ))}
          </select>

          {/* SEARCH DẠNG ICON MỞ RỘNG */}
          <ExpandableSearch
            value={search}
            onValueChange={setSearch}
            label="Tìm ngày lễ"
            placeholder="Tìm tên ngày lễ, cơ sở..."
            inputClassName="sm:w-60"
          />

          {/* NÚT XÓA NHIỀU NẾU CÓ CHỌN */}
          {selectedIds.length > 0 && (
            <Button
              type="button"
              variant="destructive"
              size="sm"
              onClick={() => setBatchDeleteOpen(true)}
              className="h-8 cursor-pointer font-semibold gap-1 px-3 shadow-2xs"
            >
              <Trash2 className="h-3.5 w-3.5" />
              Xóa ({selectedIds.length})
            </Button>
          )}

          {/* NÚT THÊM */}
          <Button
            type="button"
            size="sm"
            onClick={handleOpenCreate}
            className="h-8 cursor-pointer font-semibold gap-1 px-3 shadow-2xs"
          >
            <Plus className="h-4 w-4" />
            Thêm ngày nghỉ lễ
          </Button>
        </div>
      </div>

      {/* TABLE */}
      <DataTableFrame className="flex-1 min-h-0">
        <div className="h-full min-h-0 overflow-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="sticky top-0 z-10 bg-muted/70 text-muted-foreground uppercase text-[10px] font-bold tracking-wider border-b">
              <tr>
                <th className="py-2.5 px-3 w-9 text-center">
                  <Checkbox
                    checked={isAllSelected}
                    onCheckedChange={handleToggleSelectAll}
                    aria-label="Chọn tất cả"
                  />
                </th>
                <th className="py-2.5 px-3">Tên ngày nghỉ lễ</th>
                <th className="py-2.5 px-3">Thời gian</th>
                <th className="py-2.5 px-3">Số ngày</th>
                <th className="py-2.5 px-3">Phân loại</th>
                <th className="py-2.5 px-3">Phạm vi áp dụng</th>
                <th className="py-2.5 px-3">Trạng thái</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {filteredHolidays.map((item) => {
                const typeInfo = TYPE_CONFIG[item.type] || TYPE_CONFIG.national
                const isSelected = selectedIds.includes(item.id)

                return (
                  <tr
                    key={item.id}
                    className={cn(
                      'group hover:bg-muted/30 transition-colors',
                      isSelected && 'bg-primary/5'
                    )}
                  >
                    <td className="py-3 px-3 text-center">
                      <Checkbox
                        checked={isSelected}
                        onCheckedChange={() => handleToggleSelect(item.id)}
                        aria-label={`Chọn ${item.name}`}
                      />
                    </td>
                    <td className="py-3 px-3">
                      <div className="flex items-center justify-between gap-2">
                        <div className="min-w-0 flex-1">
                          <div className="font-semibold text-foreground flex items-center gap-1.5 flex-wrap">
                            <Calendar className="h-3.5 w-3.5 text-primary/70 shrink-0" />
                            <span>{item.name}</span>
                            {item.isRecurring && (
                              <span
                                className="inline-flex items-center gap-0.5 rounded bg-sky-100 dark:bg-sky-950 text-sky-700 dark:text-sky-300 px-1.5 py-0.2 text-[9px] font-semibold"
                                title="Lặp lại hàng năm"
                              >
                                <Repeat className="h-2.5 w-2.5" />
                                Hàng năm
                              </span>
                            )}
                          </div>
                          {item.description && (
                            <p className="text-[11px] text-muted-foreground line-clamp-1 mt-0.5">
                              {item.description}
                            </p>
                          )}
                        </div>

                        {/* NÚT THAO TÁC HIỂN THỊ KHI HOVER */}
                        <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                          <Button
                            variant="ghost"
                            size="icon-sm"
                            onClick={(e) => {
                              e.stopPropagation()
                              handleOpenEdit(item)
                            }}
                            className="h-6 w-6 text-muted-foreground hover:text-foreground cursor-pointer"
                            title="Sửa ngày lễ"
                          >
                            <Edit className="h-3 w-3" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon-sm"
                            onClick={(e) => {
                              e.stopPropagation()
                              setDeletingId(item.id)
                            }}
                            className="h-6 w-6 text-muted-foreground hover:text-destructive cursor-pointer"
                            title="Xóa ngày lễ"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-3 tabular-nums font-medium text-foreground whitespace-nowrap">
                      {item.startDate === item.endDate
                        ? item.startDate
                        : `${item.startDate} → ${item.endDate}`}
                    </td>
                    <td className="py-3 px-3 font-semibold text-primary">
                      {item.daysCount} ngày
                    </td>
                    <td className="py-3 px-3">
                      <StatusBadge status={typeInfo.variant} label={typeInfo.label} />
                    </td>
                    <td className="py-3 px-3">
                      <div className="flex flex-wrap gap-1">
                        {item.scopes?.map((sc) => (
                          <span
                            key={sc}
                            className="inline-flex items-center rounded-md bg-muted px-2 py-0.5 text-[11px] font-medium text-foreground"
                          >
                            {sc}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="py-3 px-3">
                      <StatusBadge
                        status={item.status === 'active' ? 'active' : 'inactive'}
                        label={item.status === 'active' ? 'Áp dụng' : 'Tạm dừng'}
                      />
                    </td>
                  </tr>
                )
              })}

              {filteredHolidays.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-xs text-muted-foreground italic">
                    Không có dữ liệu lịch nghỉ lễ phù hợp trong năm {selectedYear}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </DataTableFrame>

      {/* DIALOG THÊM / SỬA LỊCH NGHỈ LỄ */}
      <Dialog
        open={isCreateOpen || Boolean(editingHoliday)}
        onOpenChange={(val) => {
          if (!val) {
            setIsCreateOpen(false)
            setEditingHoliday(null)
          }
        }}
      >
        <DialogContent className="sm:max-w-md">
          {/* HEADER: TIÊU ĐỀ TRÁI - SWITCH TRẠNG THÁI PHẢI */}
          <DialogHeader className="pr-6">
            <div className="flex items-center justify-between gap-3">
              <DialogTitle className="text-sm font-semibold">
                {editingHoliday ? 'Chỉnh sửa ngày nghỉ lễ' : 'Thêm ngày nghỉ lễ mới'}
              </DialogTitle>
              <div className="flex items-center gap-2">
                <span
                  className={cn(
                    'text-xs font-medium',
                    formData.status === 'active'
                      ? 'text-primary font-semibold'
                      : 'text-muted-foreground'
                  )}
                >
                  {formData.status === 'active' ? 'Áp dụng' : 'Tạm dừng'}
                </span>
                <Switch
                  checked={formData.status === 'active'}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, status: checked ? 'active' : 'inactive' })
                  }
                />
              </div>
            </div>
          </DialogHeader>

          <div className="space-y-3.5 py-2 text-xs">
            {/* TÊN NGÀY LỄ */}
            <div className="space-y-1">
              <label className="font-semibold text-foreground">Tên ngày nghỉ lễ *</label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="VD: Nghỉ Tết Nguyên Đán, Giỗ Tổ Hùng Vương..."
                className="h-8 text-xs"
              />
            </div>

            {/* CHỌN NĂM & CHECKBOX LẶP LẠI HÀNG NĂM */}
            <div className="grid grid-cols-2 gap-3 items-center">
              <div className="space-y-1">
                <label className="font-semibold text-foreground">Năm áp dụng</label>
                <select
                  value={formData.year}
                  onChange={(e) => setFormData({ ...formData, year: Number(e.target.value) })}
                  className="h-8 w-full rounded-md border border-input bg-background px-2 text-xs font-medium text-foreground outline-none cursor-pointer"
                >
                  {AVAILABLE_YEARS.map((y) => (
                    <option key={y} value={y}>
                      Năm {y}
                    </option>
                  ))}
                </select>
              </div>

              <div className="pt-4">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <Checkbox
                    checked={formData.isRecurring}
                    onCheckedChange={(checked) =>
                      setFormData({ ...formData, isRecurring: Boolean(checked) })
                    }
                  />
                  <span className="text-xs font-semibold text-foreground">
                    Lặp lại hàng năm (Dương lịch)
                  </span>
                </label>
              </div>
            </div>

            {/* TỪ NGÀY - ĐẾN NGÀY */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="font-semibold text-foreground">Từ ngày *</label>
                <Input
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => handleDateChange('startDate', e.target.value)}
                  className="h-8 text-xs"
                />
              </div>
              <div className="space-y-1">
                <label className="font-semibold text-foreground">Đến ngày *</label>
                <Input
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => handleDateChange('endDate', e.target.value)}
                  className="h-8 text-xs"
                />
              </div>
            </div>

            {/* PHÂN LOẠI & PHẠM VI ÁP DỤNG (DROPLIST CHỌN NHIỀU) */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="font-semibold text-foreground">Phân loại</label>
                <select
                  value={formData.type}
                  onChange={(e) =>
                    setFormData({ ...formData, type: e.target.value as HolidayConfig['type'] })
                  }
                  className="h-8 w-full rounded-md border border-input bg-background px-2 text-xs font-medium text-foreground outline-none"
                >
                  <option value="national">Lễ Quốc gia</option>
                  <option value="internal">Nghỉ nội bộ</option>
                  <option value="center">Nghỉ riêng cơ sở</option>
                </select>
              </div>

              {/* PHẠM VI ÁP DỤNG: DROPDOWN CHỌN NHIỀU */}
              <div className="space-y-1">
                <label className="font-semibold text-foreground">Phạm vi áp dụng</label>
                <Popover open={scopeDropdownOpen} onOpenChange={setScopeDropdownOpen}>
                  <PopoverTrigger asChild>
                    <button
                      type="button"
                      className="flex h-8 w-full items-center justify-between rounded-md border border-input bg-background px-2.5 text-xs font-medium text-foreground outline-none hover:bg-muted/30 cursor-pointer text-left"
                    >
                      <span className="truncate">{scopeDisplayText}</span>
                      <ChevronsUpDown className="h-3.5 w-3.5 shrink-0 opacity-50 ml-1" />
                    </button>
                  </PopoverTrigger>
                  <PopoverContent className="w-56 p-1.5 space-y-1 text-xs" align="start">
                    {/* OPTION TOÀN HỆ THỐNG */}
                    <div
                      onClick={() => handleToggleScope(SYSTEM_SCOPE)}
                      className="flex items-center gap-2 p-1.5 rounded hover:bg-muted cursor-pointer select-none"
                    >
                      <Checkbox checked={formData.scopes.includes(SYSTEM_SCOPE)} />
                      <span className="font-semibold text-foreground">{SYSTEM_SCOPE}</span>
                    </div>

                    <div className="border-t my-1" />

                    {/* TỪNG CƠ SỞ */}
                    {centerList.map((center) => (
                      <div
                        key={center}
                        onClick={() => handleToggleScope(center)}
                        className="flex items-center gap-2 p-1.5 rounded hover:bg-muted cursor-pointer select-none"
                      >
                        <Checkbox checked={formData.scopes.includes(center)} />
                        <span className="text-foreground">{center}</span>
                      </div>
                    ))}
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            {/* GHI CHÚ */}
            <div className="space-y-1">
              <label className="font-semibold text-foreground">Ghi chú</label>
              <Input
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Ghi chú thêm về ca trực, quy định..."
                className="h-8 text-xs"
              />
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-2 pt-2 border-t">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => {
                setIsCreateOpen(false)
                setEditingHoliday(null)
              }}
              className="cursor-pointer"
            >
              Hủy
            </Button>
            <Button type="button" size="sm" onClick={handleSave} className="cursor-pointer font-semibold">
              Lưu
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* CONFIRM DELETE 1 MỤC */}
      <ConfirmDialog
        open={Boolean(deletingId)}
        onOpenChange={(val) => !val && setDeletingId(null)}
        title="Xác nhận xóa ngày nghỉ lễ"
        description="Bạn có chắc chắn muốn xóa ngày nghỉ lễ này khỏi hệ thống không?"
        variant="destructive"
        confirmLabel="Xóa ngày lễ"
        onConfirm={handleDelete}
      />

      {/* CONFIRM BATCH DELETE */}
      <ConfirmDialog
        open={batchDeleteOpen}
        onOpenChange={setBatchDeleteOpen}
        title="Xác nhận xóa các ngày nghỉ lễ đã chọn"
        description={`Bạn có chắc chắn muốn xóa đồng thời ${selectedIds.length} ngày nghỉ lễ đã chọn không?`}
        variant="destructive"
        confirmLabel={`Xóa ${selectedIds.length} ngày lễ`}
        onConfirm={handleBatchDelete}
      />
    </div>
  )
}
