'use client'

import { useState } from 'react'
import {
  GraduationCap,
  Plus,
  Trash2,
  Compass,
  ShoppingBag,
  CircleDollarSign,
  RotateCcw,
  Clock,
  ChevronDown,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import {
  ChildItem,
  BIRTH_YEAR_OPTIONS,
  COURSE_OPTIONS,
  POPULAR_SCHOOL_OPTIONS,
  LOAI_HINH_OPTIONS,
  NHOM_NGANH_OPTIONS,
  NGUON_KHACH_HANG_OPTIONS,
  STAFF_LIST,
  MARKETING_STAFF_OPTIONS,
  PRODUCT_GROUP_OPTIONS,
} from './crmCustomerCreateTypes'
import {
  SearchSelect,
  CreatableSearchSelect,
  StaffSelect,
  ProductGroupSelect,
  SmallLabel,
} from './CrmCustomerCreateSearchSelect'

interface CrmCustomerChildSectionProps {
  childList: ChildItem[]
  setChildren: React.Dispatch<React.SetStateAction<ChildItem[]>>
  totalOrdersCount?: number
  totalOrdersAmount?: string
}

export function CrmCustomerChildSection({
  childList,
  setChildren,
  totalOrdersCount = 0,
  totalOrdersAmount = '0đ',
}: CrmCustomerChildSectionProps) {
  const currentYear = 2026

  const [selectedChildId, setSelectedChildId] = useState<string>('')
  const [isHistoryExpanded, setIsHistoryExpanded] = useState(false)

  const activeChildId = childList.some((c) => c.id === selectedChildId)
    ? selectedChildId
    : childList[0]?.id || ''

  const activeIndex = Math.max(
    0,
    childList.findIndex((c) => c.id === activeChildId)
  )
  const activeChild = childList[activeIndex] || childList[0]

  const handleChildBirthYearChange = (childId: string, year: string) => {
    const y = parseInt(year, 10)
    const calculatedAge = !isNaN(y) && y <= currentYear ? String(currentYear - y) : ''
    setChildren((prev) =>
      prev.map((c) =>
        c.id === childId ? { ...c, birthYear: year, age: calculatedAge } : c
      )
    )
  }

  const handleUpdateChild = (childId: string, updatedFields: Partial<ChildItem>) => {
    setChildren((prev) =>
      prev.map((c) => (c.id === childId ? { ...c, ...updatedFields } : c))
    )
  }

  const handleAddChild = () => {
    const newId = `child-${Date.now()}`
    const firstChild = childList[0]

    const newChild: ChildItem = {
      id: newId,
      name: '',
      currentSchool: firstChild?.currentSchool || '',
      birthYear: '',
      age: '',
      academicPerformance: '',
      phone: '',
      course: '',
      vuihocAccount: '',
      customerType: firstChild?.customerType || 'Tự học',
      industryGroup: 'Tiểu học',
      selectedSources: firstChild?.selectedSources ? [...firstChild.selectedSources] : ['Web Rinoedu'],
      selectedStaff: firstChild?.selectedStaff ? [...firstChild.selectedStaff] : ['Trần Thị Mai'],
      marketingStaff: firstChild?.marketingStaff || 'Nguyễn Thị Lan (Marketing)',
      selectedProductGroups: firstChild?.selectedProductGroups ? [...firstChild.selectedProductGroups] : ['Tiếng Anh Thiếu Nhi'],
      customerCode: '',
    }

    setChildren((prev) => [...prev, newChild])
    setSelectedChildId(newId)
  }

  const handleRemoveChild = (id: string) => {
    if (childList.length <= 1) return
    const nextList = childList.filter((c) => c.id !== id)
    setChildren(nextList)
    if (activeChildId === id) {
      setSelectedChildId(nextList[0]?.id || '')
    }
  }

  if (!activeChild) return null

  return (
    <div className="space-y-3">
      {/* KHỐI 1: THÔNG TIN HỌC VIÊN & ĐỊNH VỊ PHÂN BỔ HIỆN TẠI */}
      <div className="bg-white dark:bg-zinc-900 rounded-xl p-3.5 border border-border shadow-xs space-y-3">
        {/* Header dòng đầu: Danh sách Tabs con + Nút "+ Thêm con" */}
      <div className="flex items-center justify-between gap-2 pb-2 border-b border-border/70 flex-wrap">
        <div className="flex items-center gap-1.5 overflow-x-auto py-0.5">
          {childList.map((child, idx) => {
            const isSelected = activeChild.id === child.id
            const label = child.name.trim() || `Bé ${idx + 1}`
            return (
              <button
                key={child.id}
                type="button"
                onClick={() => setSelectedChildId(child.id)}
                className={cn(
                  'h-7 px-3 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap',
                  isSelected
                    ? 'bg-primary text-primary-foreground shadow-xs'
                    : 'bg-muted/70 text-muted-foreground hover:bg-muted hover:text-foreground'
                )}
              >
                <div
                  className={cn(
                    'flex h-4 w-4 items-center justify-center rounded-full text-[10px] font-bold shrink-0',
                    isSelected ? 'bg-primary-foreground/20 text-primary-foreground' : 'bg-background text-foreground'
                  )}
                >
                  {idx + 1}
                </div>
                <span>{label}</span>
                {child.age && <span className="text-[10.5px] opacity-85">({child.age}t)</span>}
                {child.isReturningLead && (
                  <span
                    className={cn(
                      'text-[9.5px] px-1.5 py-0.2 rounded-full font-semibold inline-flex items-center gap-0.5',
                      isSelected
                        ? 'bg-amber-400/30 text-amber-100 border border-amber-300/40'
                        : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border border-amber-300/60'
                    )}
                  >
                    <RotateCcw className="h-2.5 w-2.5" />
                    <span>Quay lại</span>
                  </span>
                )}
              </button>
            )
          })}
        </div>

        <Button
          type="button"
          variant="outline"
          size="sm"
          className="h-7 px-2.5 text-xs font-medium text-emerald-700 bg-emerald-50/70 border-emerald-300 hover:bg-emerald-100 dark:bg-emerald-950/40 dark:text-emerald-300 cursor-pointer gap-1 shrink-0"
          onClick={handleAddChild}
        >
          <Plus className="h-3 w-3" />
          <span>Thêm con</span>
        </Button>
      </div>

      {/* ============================================================ */}
      {/* PHẦN 1: THÔNG TIN HỌC VIÊN (CON ĐANG CHỌN) */}
      {/* ============================================================ */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 font-bold text-xs text-foreground">
            <GraduationCap className="h-4 w-4 text-blue-600 shrink-0" />
            <span>Thông Tin Học Viên: {activeChild.name.trim() || `Bé ${activeIndex + 1}`}</span>
          </div>

          {childList.length > 1 && (
            <button
              type="button"
              onClick={() => handleRemoveChild(activeChild.id)}
              className="text-rose-500 hover:text-rose-700 text-xs flex items-center gap-1 cursor-pointer transition-colors"
              title="Xóa thông tin bé này"
            >
              <Trash2 className="h-3 w-3" />
              <span>Xóa bé này</span>
            </button>
          )}
        </div>

        {/* Hàng 1: Tên con * (col-1) + Năm sinh * & Tuổi (col-2) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          <div>
            <SmallLabel label="Họ và tên học sinh (con)" required />
            <Input
              value={activeChild.name}
              onChange={(e) => handleUpdateChild(activeChild.id, { name: e.target.value })}
              placeholder="VD: Bé An..."
              className="h-7.5 text-xs bg-white dark:bg-zinc-800 border-slate-200 dark:border-zinc-700 shadow-none focus-visible:border-primary focus-visible:ring-1 focus-visible:ring-primary/20 placeholder:text-slate-400 dark:placeholder:text-zinc-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-1.5">
            <div>
              <SmallLabel label="Năm sinh của con" required />
              <SearchSelect
                value={activeChild.birthYear}
                onValueChange={(val) => handleChildBirthYearChange(activeChild.id, val)}
                options={BIRTH_YEAR_OPTIONS}
                placeholder="Chọn năm..."
              />
            </div>
            <div>
              <SmallLabel label="Độ tuổi" />
              <Input
                type="number"
                value={activeChild.age}
                onChange={(e) => handleUpdateChild(activeChild.id, { age: e.target.value })}
                placeholder="Tuổi"
                className="h-7.5 text-xs bg-white dark:bg-zinc-800 border-slate-200 dark:border-zinc-700 shadow-none focus-visible:border-primary focus-visible:ring-1 focus-visible:ring-primary/20 placeholder:text-slate-400 dark:placeholder:text-zinc-500"
              />
            </div>
          </div>
        </div>

        {/* Hàng 2: Trường học hiện tại */}
        <div>
          <SmallLabel label="Trường đang theo học hiện tại của học viên" />
          <CreatableSearchSelect
            value={activeChild.currentSchool}
            onValueChange={(val) => handleUpdateChild(activeChild.id, { currentSchool: val })}
            options={POPULAR_SCHOOL_OPTIONS}
            placeholder="Chọn hoặc nhập tên trường..."
          />
        </div>

        {/* Hàng 3: Khóa học quan tâm (col-1) + Học lực hiện tại (col-2) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          <div>
            <SmallLabel label="Khóa học quan tâm" />
            <SearchSelect
              value={activeChild.course}
              onValueChange={(val) => handleUpdateChild(activeChild.id, { course: val })}
              options={COURSE_OPTIONS}
              placeholder="Chọn khóa học..."
            />
          </div>
          <div>
            <SmallLabel label="Học lực hiện tại" />
            <Input
              value={activeChild.academicPerformance}
              onChange={(e) => handleUpdateChild(activeChild.id, { academicPerformance: e.target.value })}
              placeholder="VD: Khá / Phản xạ tốt..."
              className="h-7.5 text-xs bg-white dark:bg-zinc-800 border-slate-200 dark:border-zinc-700 shadow-none focus-visible:border-primary focus-visible:ring-1 focus-visible:ring-primary/20 placeholder:text-slate-400 dark:placeholder:text-zinc-500"
            />
          </div>
        </div>

        {/* Hàng 4: SĐT riêng của con (col-1) + Tài khoản Vuihoc (col-2) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          <div>
            <SmallLabel label="SĐT riêng của con (nếu có)" />
            <Input
              value={activeChild.phone}
              onChange={(e) => handleUpdateChild(activeChild.id, { phone: e.target.value })}
              placeholder="09xxxxxxxx..."
              className="h-7.5 text-xs bg-white dark:bg-zinc-800 border-slate-200 dark:border-zinc-700 shadow-none focus-visible:border-primary focus-visible:ring-1 focus-visible:ring-primary/20 placeholder:text-slate-400 dark:placeholder:text-zinc-500"
            />
          </div>
          <div>
            <SmallLabel label="Tài khoản Vuihoc" />
            <Input
              value={activeChild.vuihocAccount}
              onChange={(e) => handleUpdateChild(activeChild.id, { vuihocAccount: e.target.value })}
              placeholder="VD: vh_an_2018..."
              className="h-7.5 text-xs bg-white dark:bg-zinc-800 border-slate-200 dark:border-zinc-700 shadow-none focus-visible:border-primary focus-visible:ring-1 focus-visible:ring-primary/20 placeholder:text-slate-400 dark:placeholder:text-zinc-500"
            />
          </div>
        </div>
      </div>

      {/* ============================================================ */}
      {/* PHẦN 2: ĐỊNH VỊ & PHÂN BỔ TÁC NGHIỆP (RIÊNG CHO CON NÀY) */}
      {/* ============================================================ */}
      <div className="pt-3 border-t border-border/70 space-y-2.5">
        <div className="flex items-center gap-1.5 font-bold text-xs text-foreground">
          <Compass className="h-3.5 w-3.5 text-sky-600 dark:text-sky-400 shrink-0" />
          <span>
            Định Vị &amp; Phân Bổ (Tác nghiệp cho {activeChild.name.trim() || `Bé ${activeIndex + 1}`})
          </span>
        </div>

        {/* Hàng 1: Loại hình đào tạo * (col-1) + Nhóm ngành * (col-2) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          <div>
            <SmallLabel label="Loại hình đào tạo" required />
            <SearchSelect
              value={activeChild.customerType || 'Tự học'}
              onValueChange={(val) => handleUpdateChild(activeChild.id, { customerType: val })}
              options={LOAI_HINH_OPTIONS}
            />
          </div>
          <div>
            <SmallLabel label="Nhóm ngành" required />
            <SearchSelect
              value={activeChild.industryGroup || 'Tiểu học'}
              onValueChange={(val) => handleUpdateChild(activeChild.id, { industryGroup: val })}
              options={NHOM_NGANH_OPTIONS}
            />
          </div>
        </div>

        {/* Hàng 2: Nhóm sản phẩm */}
        <div>
          <SmallLabel label="Nhóm sản phẩm" />
          <ProductGroupSelect
            selectedGroups={activeChild.selectedProductGroups || ['Tiếng Anh Thiếu Nhi']}
            onToggleGroup={(group) => {
              const current = activeChild.selectedProductGroups || []
              const next = current.includes(group)
                ? current.filter((g) => g !== group)
                : [...current, group]
              handleUpdateChild(activeChild.id, { selectedProductGroups: next })
            }}
            groups={PRODUCT_GROUP_OPTIONS}
          />
        </div>

        {/* Hàng 3: Nguồn tiếp nhận khách hàng (col-1) + Người phụ trách / Tư vấn viên (col-2) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          <div>
            <SmallLabel label="Nguồn tiếp nhận khách hàng" />
            <SearchSelect
              value={activeChild.selectedSources?.[0] || 'Web Rinoedu'}
              onValueChange={(val) => handleUpdateChild(activeChild.id, { selectedSources: [val] })}
              options={NGUON_KHACH_HANG_OPTIONS.map((s) => ({ value: s, label: s }))}
            />
          </div>
          <div>
            <SmallLabel label="Người phụ trách (Tư vấn viên)" />
            <StaffSelect
              mode="single"
              selectedStaff={activeChild.selectedStaff?.[0] || 'Trần Thị Mai'}
              onSelectStaff={(staff) => handleUpdateChild(activeChild.id, { selectedStaff: [staff.name] })}
              staffList={STAFF_LIST}
            />
          </div>
        </div>

        {/* Hàng 4: Nhân viên marketing (col-1) + Mã khách hàng / Deal (col-2) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          <div>
            <SmallLabel label="Nhân viên marketing" />
            <SearchSelect
              value={activeChild.marketingStaff || 'Nguyễn Thị Lan (Marketing)'}
              onValueChange={(val) => handleUpdateChild(activeChild.id, { marketingStaff: val })}
              options={MARKETING_STAFF_OPTIONS}
            />
          </div>
          <div>
            <SmallLabel label="Mã khách hàng / Deal (tùy chỉnh)" />
            <Input
              value={activeChild.customerCode || ''}
              onChange={(e) => handleUpdateChild(activeChild.id, { customerCode: e.target.value })}
              placeholder="VD: LD-10291-A..."
              className="h-7.5 text-xs bg-white dark:bg-zinc-800 border-slate-200 dark:border-zinc-700 shadow-none focus-visible:border-primary focus-visible:ring-1 focus-visible:ring-primary/20 font-mono placeholder:text-slate-400 dark:placeholder:text-zinc-500"
            />
          </div>
        </div>

      </div>
    </div>

      {/* ============================================================ */}
      {/* KHỐI 2: LỊCH SỬ (N ĐỢT TRƯỚC) - TÁCH SECTION RIÊNG, MẶC ĐỊNH THU GỌN */}
      {/* ============================================================ */}
      {activeChild.isReturningLead && activeChild.pastCycles && activeChild.pastCycles.length > 0 && (
        <div className="bg-white dark:bg-zinc-900 rounded-xl border border-border shadow-xs overflow-hidden">
          {/* Thanh tiêu đề mỏng, nhấn để mở rộng/thu gọn */}
          <button
            type="button"
            onClick={() => setIsHistoryExpanded(!isHistoryExpanded)}
            className="w-full px-3.5 py-2.5 flex items-center justify-between text-xs font-semibold hover:bg-muted/30 transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <Clock className="h-3.5 w-3.5 text-muted-foreground" />
              <span className="text-foreground">
                Lịch sử ({activeChild.pastCycles.length} đợt trước)
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-normal">
              <span>{isHistoryExpanded ? 'Thu gọn' : 'Xem chi tiết'}</span>
              <ChevronDown
                className={cn(
                  'h-3.5 w-3.5 transition-transform duration-200',
                  isHistoryExpanded && 'rotate-180'
                )}
              />
            </div>
          </button>

          {/* Chi tiết đợt trước khi mở rộng: Chỉ chứa Thông tin phân bổ cũ & Lịch sử giao dịch cũ */}
          {isHistoryExpanded && (
            <div className="px-3.5 pb-3.5 pt-1 border-t border-border/60 space-y-3">
              {activeChild.pastCycles.map((cycle, cIdx) => (
                <div
                  key={cycle.cycleId || `past-batch-${cIdx}`}
                  className="p-3 rounded-lg border border-border/70 bg-slate-50/50 dark:bg-zinc-800/30 space-y-2.5 text-xs"
                >
                  {/* Header đợt: Dùng chữ Đợt, không dùng Chu kỳ */}
                  <div className="flex items-center justify-between pb-1.5 border-b border-border/50 flex-wrap gap-2">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-foreground">
                        {cycle.title || `Đợt ${cycle.cycleNumber || cIdx + 1}`}
                      </span>
                      {(cycle.startDate || cycle.endDate) && (
                        <span className="text-[11px] text-muted-foreground">
                          ({cycle.startDate || ''} - {cycle.endDate || 'Hiện tại'})
                        </span>
                      )}
                    </div>
                    {cycle.status && (
                      <Badge
                        variant="outline"
                        className="text-[10px] font-semibold bg-slate-100 text-slate-700 border-slate-300 dark:bg-zinc-800 dark:text-zinc-300"
                      >
                        {cycle.status === 'converted'
                          ? 'Đã hoàn thành'
                          : cycle.status === 'dropped'
                          ? 'Tạm hoãn / Bảo lưu'
                          : 'Đã kết thúc'}
                      </Badge>
                    )}
                  </div>

                  {/* 1. THÔNG TIN PHÂN BỔ CŨ */}
                  <div className="space-y-1.5">
                    <span className="text-[10.5px] font-semibold text-muted-foreground block uppercase tracking-wider">
                      Thông tin phân bổ cũ
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1.5 text-xs">
                      {cycle.assignedSales && (
                        <div className="flex items-center gap-1.5">
                          <span className="text-muted-foreground">Tư vấn viên:</span>
                          <span className="font-medium text-foreground">{cycle.assignedSales}</span>
                        </div>
                      )}
                      {cycle.branch && (
                        <div className="flex items-center gap-1.5">
                          <span className="text-muted-foreground">Cơ sở:</span>
                          <span className="font-medium text-foreground">{cycle.branch}</span>
                        </div>
                      )}
                      {cycle.channel && (
                        <div className="flex items-center gap-1.5">
                          <span className="text-muted-foreground">Kênh tiếp nhận:</span>
                          <span className="font-medium text-foreground">{cycle.channel}</span>
                        </div>
                      )}
                      {cycle.productInterest && (
                        <div className="flex items-center gap-1.5">
                          <span className="text-muted-foreground">Khóa quan tâm:</span>
                          <span className="font-medium text-foreground">{cycle.productInterest}</span>
                        </div>
                      )}
                    </div>

                    {cycle.outcomeNote && (
                      <div className="mt-1 p-2 rounded bg-muted/40 border border-border/40 text-[11px] leading-relaxed">
                        <strong className="text-foreground font-medium">Ghi chú đợt cũ: </strong>
                        <span className="text-muted-foreground italic">&ldquo;{cycle.outcomeNote}&rdquo;</span>
                      </div>
                    )}
                  </div>

                  {/* 2. LỊCH SỬ GIAO DỊCH CŨ (TỔNG ĐƠN VÀ TỔNG TIỀN) */}
                  <div className="pt-2 border-t border-border/50 space-y-1.5">
                    <span className="text-[10.5px] font-semibold text-muted-foreground block uppercase tracking-wider">
                      Lịch sử giao dịch cũ
                    </span>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="p-2 rounded-lg border border-border/70 bg-white dark:bg-zinc-900 flex items-center gap-2">
                        <div className="flex h-6 w-6 items-center justify-center rounded-md bg-blue-500/10 text-blue-600 shrink-0">
                          <ShoppingBag className="h-3 w-3" />
                        </div>
                        <div className="min-w-0">
                          <span className="text-[10.5px] text-muted-foreground block">Đơn đã mua</span>
                          <span className="text-xs font-semibold text-foreground block truncate">
                            {(cycle.ordersCount ?? totalOrdersCount) > 0
                              ? `${cycle.ordersCount ?? totalOrdersCount} đơn`
                              : 'Chưa có đơn'}
                          </span>
                        </div>
                      </div>
                      <div className="p-2 rounded-lg border border-border/70 bg-white dark:bg-zinc-900 flex items-center gap-2">
                        <div className="flex h-6 w-6 items-center justify-center rounded-md bg-emerald-500/10 text-emerald-600 shrink-0">
                          <CircleDollarSign className="h-3 w-3" />
                        </div>
                        <div className="min-w-0">
                          <span className="text-[10.5px] text-muted-foreground block">Tổng chi tiêu</span>
                          <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 block truncate">
                            {cycle.totalAmount || totalOrdersAmount || '0đ'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
