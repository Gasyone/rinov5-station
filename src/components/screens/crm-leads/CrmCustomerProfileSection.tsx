'use client'

import {
  Compass,
  ChevronDown,
  ShoppingBag,
  CircleDollarSign,
} from 'lucide-react'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import {
  LOAI_HINH_OPTIONS,
  NHOM_NGANH_OPTIONS,
  NGUON_KHACH_HANG_OPTIONS,
  MARKETING_STAFF_OPTIONS,
  STAFF_LIST,
  PRODUCT_GROUP_OPTIONS,
} from './crmCustomerCreateTypes'
import {
  SearchSelect,
  SimpleSelect,
  StaffSelect,
  ProductGroupSelect,
  SmallLabel,
} from './CrmCustomerCreateSearchSelect'

interface CrmCustomerProfileSectionProps {
  customerType: string
  setCustomerType: (v: string) => void
  industryGroup: string
  setIndustryGroup: (v: string) => void
  selectedSources: string[]
  setSelectedSources: React.Dispatch<React.SetStateAction<string[]>>
  selectedStaff: string[]
  setSelectedStaff: React.Dispatch<React.SetStateAction<string[]>>
  marketingStaff: string
  setMarketingStaff: (v: string) => void
  selectedProductGroups: string[]
  setSelectedProductGroups: React.Dispatch<React.SetStateAction<string[]>>
  customerCode: string
  setCustomerCode: (v: string) => void
  totalOrdersCount?: number
  totalOrdersAmount?: string
}

export function CrmCustomerProfileSection({
  customerType,
  setCustomerType,
  industryGroup,
  setIndustryGroup,
  selectedSources,
  setSelectedSources,
  selectedStaff,
  setSelectedStaff,
  marketingStaff,
  setMarketingStaff,
  selectedProductGroups,
  setSelectedProductGroups,
  customerCode,
  setCustomerCode,
  totalOrdersCount = 0,
  totalOrdersAmount = '0đ',
}: CrmCustomerProfileSectionProps) {
  const handleToggleSource = (sourceName: string) => {
    setSelectedSources((prev) =>
      prev.includes(sourceName)
        ? prev.filter((s) => s !== sourceName)
        : [...prev, sourceName]
    )
  }

  const handleToggleStaff = (staffName: string) => {
    setSelectedStaff((prev) =>
      prev.includes(staffName)
        ? prev.filter((s) => s !== staffName)
        : [...prev, staffName]
    )
  }

  const handleToggleProductGroup = (groupName: string) => {
    setSelectedProductGroups((prev) =>
      prev.includes(groupName)
        ? prev.filter((g) => g !== groupName)
        : [...prev, groupName]
    )
  }

  return (
    <div className="flex flex-col bg-white dark:bg-zinc-900 rounded-xl p-3.5 border border-border shadow-xs space-y-2.5">
      <div className="flex items-center justify-between pb-1.5 border-b border-border/70">
        <div className="flex items-center gap-1.5">
          <Compass className="h-4 w-4 text-purple-600" />
          <h3 className="text-xs font-semibold text-foreground">3. Định Vị &amp; Phân Bổ</h3>
        </div>
        <span className="text-[10.5px] text-muted-foreground font-normal">Tác nghiệp Sale</span>
      </div>

      <div className="space-y-2.5 flex-1">
        {/* HÀNG 1: Loại hình đào tạo + Nhóm ngành (Không cần search) */}
        <div className="grid grid-cols-2 gap-2">
          <div>
            <SmallLabel label="Loại hình đào tạo" required />
            <SearchSelect
              value={customerType}
              onValueChange={setCustomerType}
              options={LOAI_HINH_OPTIONS}
            />
          </div>
          <div>
            <SmallLabel label="Nhóm ngành" required />
            <SimpleSelect
              value={industryGroup}
              onValueChange={setIndustryGroup}
              options={NHOM_NGANH_OPTIONS}
            />
          </div>
        </div>

        {/* HÀNG 2: Multi-select Nguồn tiếp nhận */}
        <div>
          <SmallLabel label="Nguồn tiếp nhận khách hàng" />
          <Popover>
            <PopoverTrigger asChild>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="h-7.5 w-full justify-between text-xs px-2.5 bg-background font-normal border-input hover:bg-muted/30 cursor-pointer"
              >
                <span className="truncate text-xs text-foreground">
                  {selectedSources.length === 0 ? (
                    <span className="text-muted-foreground/50 text-xs font-normal">Chọn nguồn tiếp cận...</span>
                  ) : selectedSources.length <= 2 ? (
                    selectedSources.join(', ')
                  ) : (
                    `${selectedSources.length} nguồn đã chọn`
                  )}
                </span>
                <ChevronDown className="h-3 w-3 opacity-50 shrink-0 ml-1" />
              </Button>
            </PopoverTrigger>
            <PopoverContent align="start" className="w-72 p-2 space-y-1.5 max-h-64 overflow-y-auto z-50 shadow-md">
              <div className="text-[10.5px] font-semibold text-muted-foreground uppercase px-1 pb-1 border-b border-border/60">
                Chọn kênh tiếp thị
              </div>
              <div className="space-y-1 pt-1">
                {NGUON_KHACH_HANG_OPTIONS.map((src) => {
                  const isChecked = selectedSources.includes(src)
                  return (
                    <label
                      key={src}
                      className="flex items-center gap-2.5 px-2.5 py-2 rounded-md text-xs hover:bg-muted/70 cursor-pointer transition-colors min-h-[32px]"
                    >
                      <Checkbox
                        checked={isChecked}
                        onCheckedChange={() => handleToggleSource(src)}
                      />
                      <span className="truncate text-xs">{src}</span>
                    </label>
                  )
                })}
              </div>
            </PopoverContent>
          </Popover>
        </div>

        {/* HÀNG 3: Người phụ trách (Tư vấn viên - Search + Avatar + Checkbox) */}
        <div>
          <SmallLabel label="Người phụ trách (Tư vấn viên)" />
          <StaffSelect
            selectedStaff={selectedStaff}
            onToggleStaff={handleToggleStaff}
            staffList={STAFF_LIST}
          />
        </div>

        {/* HÀNG 4: Nhân viên Marketing */}
        <div>
          <SmallLabel label="Nhân viên marketing" />
          <SearchSelect
            value={marketingStaff}
            onValueChange={setMarketingStaff}
            options={MARKETING_STAFF_OPTIONS}
            placeholder="Chọn nhân viên marketing..."
          />
        </div>

        {/* HÀNG 5: Nhóm sản phẩm (Checkbox) */}
        <div>
          <SmallLabel label="Nhóm sản phẩm" />
          <ProductGroupSelect
            selectedGroups={selectedProductGroups}
            onToggleGroup={handleToggleProductGroup}
            groups={PRODUCT_GROUP_OPTIONS}
          />
        </div>

        {/* HÀNG 6: Mã khách hàng */}
        <div>
          <SmallLabel label="Mã khách hàng (tùy chỉnh)" />
          <Input
            value={customerCode}
            onChange={(e) => setCustomerCode(e.target.value)}
            placeholder="Để trống hệ thống tự sinh mã..."
            className="h-7.5 text-xs bg-background placeholder:text-xs placeholder:text-muted-foreground/50 placeholder:font-normal"
          />
        </div>

        {/* HÀNG 7: THỐNG KÊ ĐƠN ĐÃ MUA & TỔNG GIÁ TRỊ (Dùng chung tạo mới & detail) */}
        <div className="pt-2 border-t border-border/60">
          <span className="text-xs font-semibold text-foreground block mb-1.5">
            Lịch sử giao dịch &amp; Đơn hàng
          </span>
          <div className="grid grid-cols-2 gap-2">
            <div className="p-2.5 rounded-lg border border-border/70 bg-slate-50/50 dark:bg-zinc-800/30 flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-md bg-blue-500/10 text-blue-600 shrink-0">
                <ShoppingBag className="h-3.5 w-3.5" />
              </div>
              <div className="min-w-0">
                <span className="text-xs text-muted-foreground block">Đơn đã mua</span>
                <span className="text-xs font-semibold text-foreground block truncate">
                  {totalOrdersCount} đơn
                </span>
              </div>
            </div>

            <div className="p-2.5 rounded-lg border border-border/70 bg-slate-50/50 dark:bg-zinc-800/30 flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-md bg-emerald-500/10 text-emerald-600 shrink-0">
                <CircleDollarSign className="h-3.5 w-3.5" />
              </div>
              <div className="min-w-0">
                <span className="text-xs text-muted-foreground block">Tổng giá trị</span>
                <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 block truncate">
                  {totalOrdersAmount}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
