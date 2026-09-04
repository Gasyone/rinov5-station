'use client'

import {
  Calendar,
  DollarSign,
  Layers,
  Percent,
  Plus,
  Save,
  Tag,
  Trash2,
} from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { FieldLabel, Panel } from '@/components/shared'
import { mockPromotions } from '@/mocks/promotions'
import { mockProducts } from '@/mocks/products'
import type {
  CampaignApplyType,
  CampaignDiscountType,
  CampaignItem,
  CampaignProductForm,
  CampaignSkuItem,
  CampaignStatus,
  CostAllocation,
} from '@/mocks/campaigns'

interface CampaignFormDialogProps {
  open: boolean
  campaign?: CampaignItem | null
  onOpenChange: (open: boolean) => void
  onSubmit: (data: Partial<CampaignItem>) => void
  onDeactivate?: (id: string) => void
}

interface CampaignFormInnerProps {
  campaign?: CampaignItem | null
  onClose: () => void
  onSubmit: (data: Partial<CampaignItem>) => void
  onDeactivate?: (id: string) => void
}

function CampaignFormInner({
  campaign,
  onClose,
  onSubmit,
  onDeactivate,
}: CampaignFormInnerProps) {
  const isEdit = Boolean(campaign)

  const [name, setName] = useState(campaign?.name || '')
  const [code, setCode] = useState(() => campaign?.code || '')
  const [description, setDescription] = useState(campaign?.description || '')
  const [status] = useState<CampaignStatus>(campaign?.status || 'hoat_dong')
  const [startDate, setStartDate] = useState(
    campaign?.startDate ? campaign.startDate.slice(0, 10) : new Date().toISOString().slice(0, 10)
  )
  const [endDate, setEndDate] = useState(campaign?.endDate ? campaign.endDate.slice(0, 10) : '')
  const [budget, setBudget] = useState<string>(campaign?.budget ? String(campaign.budget) : '')
  const [applyType, setApplyType] = useState<CampaignApplyType>(campaign?.applyType || 'ma_rieng')
  const [promoCode, setPromoCode] = useState(
    campaign?.promoCode || mockPromotions[0]?.code || 'CSCBNVLINHDAMTA'
  )
  const [campaignType, setCampaignType] = useState<CampaignDiscountType>(
    campaign?.campaignType || 'giam_truc_tiep'
  )
  const [discountValue, setDiscountValue] = useState<string>(
    campaign ? String(campaign.discountValue) : '500000'
  )
  const [maxUsagePerUser, setMaxUsagePerUser] = useState<number>(campaign?.maxUsagePerUser || 1)
  const [autoDisplay, setAutoDisplay] = useState<boolean>(campaign?.autoDisplay ?? false)
  const [limitRule, setLimitRule] = useState<'dong_thoi' | 'duy_nhat'>(
    campaign?.limitRule || 'dong_thoi'
  )
  const [uniqueLimitGroup, setUniqueLimitGroup] = useState(campaign?.uniqueLimitGroup || '')
  const [minOrderValue, setMinOrderValue] = useState<string>(
    campaign ? String(campaign.minOrderValue) : '1000000'
  )
  const [applyScope, setApplyScope] = useState<'sku' | 'category'>(
    campaign?.applyScope || 'sku'
  )
  const [productForm, setProductForm] = useState<CampaignProductForm>(
    campaign?.productForm || 'all'
  )

  // Cost allocations state
  const [costAllocations, setCostAllocations] = useState<CostAllocation[]>(
    campaign?.costAllocations || [{ id: 'c-1', source: 'STATION', percentage: 100 }]
  )
  const [newCostSource, setNewCostSource] = useState('MARKETING')
  const [newCostPercent, setNewCostPercent] = useState('')

  // Whitelist SKUs state
  const [applicableSkus, setApplicableSkus] = useState<CampaignSkuItem[]>(
    campaign?.applicableSkus || [
      {
        sku: 'SC00379',
        name: '[Station] Global Digi 96 buổi (2 Station + 2 Digi/ tuần)',
      },
    ]
  )
  const [selectedProductSku, setSelectedProductSku] = useState('')

  // Handlers for Cost Allocation
  const handleAddCostAllocation = () => {
    const p = parseFloat(newCostPercent)
    if (isNaN(p) || p <= 0 || p > 100) {
      toast.error('Vui lòng nhập tỷ lệ % hợp lệ (1-100)')
      return
    }
    setCostAllocations((prev) => [
      ...prev,
      { id: `c-${Date.now()}`, source: newCostSource, percentage: p },
    ])
    setNewCostPercent('')
  }

  const handleRemoveCostAllocation = (id: string) => {
    if (costAllocations.length === 1) {
      toast.error('Phải có ít nhất 1 nguồn chi phí phân bổ')
      return
    }
    setCostAllocations((prev) => prev.filter((a) => a.id !== id))
  }

  // Handlers for SKU whitelist
  const handleAddSku = () => {
    if (!selectedProductSku) {
      toast.error('Vui lòng chọn một sản phẩm/SKU')
      return
    }
    const found = mockProducts.find((p) => p.code === selectedProductSku)
    if (!found) return

    if (applicableSkus.some((s) => s.sku === found.code)) {
      toast.error('Sản phẩm này đã có trong danh sách áp dụng')
      return
    }

    setApplicableSkus((prev) => [
      ...prev,
      { sku: found.code, name: found.name },
    ])
    setSelectedProductSku('')
  }

  const handleRemoveSku = (sku: string) => {
    setApplicableSkus((prev) => prev.filter((s) => s.sku !== sku))
  }

  // Submit Handler
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!name.trim()) {
      toast.error('Vui lòng nhập tên chiến dịch')
      return
    }
    if (!promoCode.trim()) {
      toast.error('Vui lòng chọn hoặc nhập mã khuyến mại gắn kèm')
      return
    }

    const val = parseFloat(discountValue)
    if (isNaN(val) || val <= 0) {
      toast.error('Vui lòng nhập giá trị giảm hợp lệ (> 0)')
      return
    }

    onSubmit({
      id: campaign?.id,
      name: name.trim(),
      code: code.trim() || `CP${Date.now()}`,
      description: description.trim(),
      status,
      startDate: startDate ? `${startDate} 00:00:00` : new Date().toISOString(),
      endDate: endDate ? `${endDate} 23:59:59` : null,
      budget: budget ? parseFloat(budget) : null,
      applyType,
      promoCode,
      campaignType,
      discountValue: val,
      maxUsagePerUser: maxUsagePerUser || 1,
      autoDisplay,
      limitRule,
      uniqueLimitGroup: uniqueLimitGroup || undefined,
      costAllocations,
      minOrderValue: parseFloat(minOrderValue) || 0,
      applyScope,
      productForm,
      applicableSkus,
    })

    toast.success(isEdit ? 'Đã cập nhật chiến dịch thành công' : 'Đã tạo mới chiến dịch thành công')
    onClose()
  }

  const handleDeactivate = () => {
    if (campaign && onDeactivate) {
      onDeactivate(campaign.id)
      toast.success('Đã ngừng hoạt động chiến dịch')
      onClose()
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col h-full min-h-0">
      {/* Header */}
      <DialogHeader className="shrink-0 p-4 px-6 bg-card border-b border-border flex flex-row items-center justify-between space-y-0">
        <div className="min-w-0">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-0.5">
            <span>Quản lý chiến dịch</span>
            <span>&gt;</span>
            <span className="font-medium text-foreground">
              {isEdit ? 'Chỉnh sửa chiến dịch' : 'Thêm mới chiến dịch'}
            </span>
          </div>
          <DialogTitle className="text-base font-bold text-foreground truncate">
            {isEdit ? name || 'Chỉnh sửa chiến dịch' : 'Tạo mới chiến dịch khuyến mại'}
          </DialogTitle>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {isEdit && status === 'hoat_dong' && onDeactivate && (
            <Button
              type="button"
              variant="destructive"
              size="sm"
              onClick={handleDeactivate}
              className="h-8 text-xs font-semibold cursor-pointer"
            >
              NGỪNG HOẠT ĐỘNG
            </Button>
          )}

          <Button
            type="submit"
            size="sm"
            className="h-8 gap-1.5 bg-primary text-xs font-medium text-primary-foreground shadow-xs hover:bg-primary/90 cursor-pointer"
          >
            <Save className="size-3.5" />
            <span>LƯU</span>
          </Button>

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onClose}
            className="h-8 text-xs font-medium cursor-pointer"
          >
            QUAY LẠI
          </Button>
        </div>
      </DialogHeader>

      {/* Form Body */}
      <div className="flex-1 overflow-y-auto p-6 space-y-5">
        {/* KHỐI 1: THÔNG TIN CƠ BẢN */}
        <Panel title="Thông tin cơ bản" icon={<Tag className="size-4 text-primary" />}>
          <div className="space-y-3.5">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              <div className="sm:col-span-2">
                <FieldLabel label="Tên chiến dịch" required>
                  <Input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Nhập tên chiến dịch..."
                    className="h-8 text-xs font-medium"
                    required
                  />
                </FieldLabel>
              </div>

              <div>
                <FieldLabel label="Mã chiến dịch">
                  <Input
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    placeholder="Mã tự sinh..."
                    className="h-8 font-mono text-xs"
                  />
                </FieldLabel>
              </div>
            </div>

            <div>
              <FieldLabel label="Mô tả chiến dịch">
                <Textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Nhập mô tả tóm tắt mục tiêu chiến dịch..."
                  rows={2}
                  className="text-xs resize-none"
                />
              </FieldLabel>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              <div>
                <FieldLabel label="Áp dụng từ ngày" required>
                  <Input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="h-8 text-xs font-mono"
                    required
                  />
                </FieldLabel>
              </div>

              <div>
                <FieldLabel label="Áp dụng tới ngày">
                  <Input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="h-8 text-xs font-mono"
                  />
                </FieldLabel>
              </div>

              <div>
                <FieldLabel label="Ngân sách tối đa">
                  <Input
                    type="number"
                    value={budget}
                    onChange={(e) => setBudget(e.target.value)}
                    placeholder="Nhập số tiền tối đa (VNĐ)..."
                    className="h-8 text-xs font-mono"
                  />
                </FieldLabel>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              <div>
                <FieldLabel label="Hình thức áp dụng" required>
                  <Select
                    value={applyType}
                    onValueChange={(v) => setApplyType(v as CampaignApplyType)}
                  >
                    <SelectTrigger className="h-8 text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ma_rieng">MÃ RIÊNG</SelectItem>
                      <SelectItem value="ma_chung">MÃ CHUNG</SelectItem>
                      <SelectItem value="khong_can_ma">KHÔNG CẦN MÃ</SelectItem>
                    </SelectContent>
                  </Select>
                </FieldLabel>
              </div>

              <div>
                <FieldLabel label="Chọn mã khuyến mại" required>
                  <Select value={promoCode} onValueChange={setPromoCode}>
                    <SelectTrigger className="h-8 text-xs font-mono font-semibold">
                      <SelectValue placeholder="Chọn mã..." />
                    </SelectTrigger>
                    <SelectContent>
                      {mockPromotions.map((p) => (
                        <SelectItem key={p.id} value={p.code}>
                          {p.code} - {p.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FieldLabel>
              </div>

              <div>
                <FieldLabel label="Loại chiến dịch" required>
                  <Select
                    value={campaignType}
                    onValueChange={(v) => setCampaignType(v as CampaignDiscountType)}
                  >
                    <SelectTrigger className="h-8 text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="giam_truc_tiep">GIẢM GIÁ TRỰC TIẾP</SelectItem>
                      <SelectItem value="giam_theo_phantram">GIẢM GIÁ THEO %</SelectItem>
                    </SelectContent>
                  </Select>
                </FieldLabel>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              <div>
                <FieldLabel label="Tự động hiển thị cho người dùng" required>
                  <Select
                    value={autoDisplay ? 'true' : 'false'}
                    onValueChange={(v) => setAutoDisplay(v === 'true')}
                  >
                    <SelectTrigger className="h-8 text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="false">KHÔNG TỰ ĐỘNG HIỂN THỊ</SelectItem>
                      <SelectItem value="true">TỰ ĐỘNG HIỂN THỊ</SelectItem>
                    </SelectContent>
                  </Select>
                </FieldLabel>
              </div>

              <div>
                <FieldLabel label="Giới hạn dùng trên đơn hàng" required>
                  <Select
                    value={limitRule}
                    onValueChange={(v) => setLimitRule(v as 'dong_thoi' | 'duy_nhat')}
                  >
                    <SelectTrigger className="h-8 text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="dong_thoi">ÁP DỤNG ĐỒNG THỜI</SelectItem>
                      <SelectItem value="duy_nhat">ÁP DỤNG DUY NHẤT</SelectItem>
                    </SelectContent>
                  </Select>
                </FieldLabel>
              </div>

              <div>
                <FieldLabel label="Nhóm giới hạn duy nhất">
                  <Input
                    value={uniqueLimitGroup}
                    onChange={(e) => setUniqueLimitGroup(e.target.value)}
                    placeholder="Nhập tên nhóm độc quyền..."
                    className="h-8 text-xs"
                    disabled={limitRule === 'dong_thoi'}
                  />
                </FieldLabel>
              </div>
            </div>
          </div>
        </Panel>

        {/* KHỐI 2: NGUỒN CHI PHÍ */}
        <Panel title="Nguồn chi phí" icon={<DollarSign className="size-4 text-emerald-600" />}>
          <div className="space-y-3">
            <div className="overflow-hidden rounded-lg border border-border/60">
              <table className="w-full text-xs">
                <thead className="bg-muted/60 text-muted-foreground border-b border-border/60">
                  <tr>
                    <th className="py-2 px-3 text-left font-semibold">Nguồn chi phí</th>
                    <th className="py-2 px-3 text-left font-semibold w-40">% Chịu chi phí</th>
                    <th className="py-2 px-3 text-right font-semibold w-24">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/40">
                  {costAllocations.map((alloc) => (
                    <tr key={alloc.id} className="hover:bg-muted/20">
                      <td className="py-2 px-3 font-semibold text-foreground">{alloc.source}</td>
                      <td className="py-2 px-3 font-mono font-bold text-primary">{alloc.percentage} %</td>
                      <td className="py-2 px-3 text-right">
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => handleRemoveCostAllocation(alloc.id)}
                          className="size-7 text-muted-foreground hover:text-destructive cursor-pointer"
                        >
                          <Trash2 className="size-3.5" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Add cost allocation row */}
            <div className="flex items-center gap-2 pt-1">
              <Select value={newCostSource} onValueChange={setNewCostSource}>
                <SelectTrigger className="h-8 text-xs w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="STATION">STATION</SelectItem>
                  <SelectItem value="MARKETING">MARKETING</SelectItem>
                  <SelectItem value="CENTER">CENTER</SelectItem>
                  <SelectItem value="PARTNER">PARTNER / ĐỐI TÁC</SelectItem>
                </SelectContent>
              </Select>

              <Input
                type="number"
                value={newCostPercent}
                onChange={(e) => setNewCostPercent(e.target.value)}
                placeholder="Nhập % (ví dụ: 30)"
                className="h-8 text-xs w-36 font-mono"
              />

              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleAddCostAllocation}
                className="h-8 gap-1 text-xs cursor-pointer"
              >
                <Plus className="size-3.5" />
                <span>Thêm nguồn</span>
              </Button>
            </div>
          </div>
        </Panel>

        {/* KHỐI 3: CHI TIẾT GIẢM GIÁ & GIỚI HẠN USER */}
        <Panel title="Chi tiết giảm giá & Giới hạn người dùng" icon={<Percent className="size-4 text-sky-600" />}>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <FieldLabel
                label={
                  campaignType === 'giam_theo_phantram'
                    ? 'Nhập % giảm giá'
                    : 'Nhập số tiền giảm (VNĐ)'
                }
                required
              >
                <Input
                  type="number"
                  value={discountValue}
                  onChange={(e) => setDiscountValue(e.target.value)}
                  placeholder={campaignType === 'giam_theo_phantram' ? '14' : '23900000'}
                  className="h-8 text-xs font-mono font-bold"
                  required
                />
              </FieldLabel>
            </div>

            <div>
              <FieldLabel label="Số lượt tối đa / User">
                <Input
                  type="number"
                  value={maxUsagePerUser}
                  onChange={(e) => setMaxUsagePerUser(parseInt(e.target.value) || 1)}
                  min={1}
                  className="h-8 text-xs font-mono font-medium"
                />
              </FieldLabel>
            </div>
          </div>
        </Panel>

        {/* KHỐI 4: ĐIỀU KIỆN ÁP DỤNG */}
        <Panel title="Điều kiện áp dụng" icon={<Calendar className="size-4 text-amber-600" />}>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <div>
              <FieldLabel label="Giá trị đơn hàng tối thiểu" required>
                <Input
                  type="number"
                  value={minOrderValue}
                  onChange={(e) => setMinOrderValue(e.target.value)}
                  placeholder="1000000"
                  className="h-8 text-xs font-mono"
                  required
                />
              </FieldLabel>
            </div>

            <div>
              <FieldLabel label="Loại hình áp dụng" required>
                <Select
                  value={applyScope}
                  onValueChange={(v) => setApplyScope(v as 'sku' | 'category')}
                >
                  <SelectTrigger className="h-8 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sku">THEO SẢN PHẨM (SKU)</SelectItem>
                    <SelectItem value="category">THEO TOÀN BỘ DANH MỤC</SelectItem>
                  </SelectContent>
                </Select>
              </FieldLabel>
            </div>

            <div>
              <FieldLabel label="Hình thức sản phẩm" required>
                <Select
                  value={productForm}
                  onValueChange={(v) => setProductForm(v as CampaignProductForm)}
                >
                  <SelectTrigger className="h-8 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">MUA MỚI VÀ GIA HẠN</SelectItem>
                    <SelectItem value="new_only">CHỈ MUA MỚI</SelectItem>
                    <SelectItem value="renewal_only">CHỈ GIA HẠN</SelectItem>
                  </SelectContent>
                </Select>
              </FieldLabel>
            </div>
          </div>
        </Panel>

        {/* KHỐI 5: DANH SÁCH SẢN PHẨM ÁP DỤNG (WHITELIST SKU) */}
        <Panel title="Danh sách sản phẩm áp dụng" icon={<Layers className="size-4 text-violet-600" />}>
          <div className="space-y-3">
            {/* Search & Add SKU form */}
            <div className="flex items-center gap-2 bg-muted/40 p-2.5 rounded-lg border border-border/60">
              <div className="flex-1">
                <Select value={selectedProductSku} onValueChange={setSelectedProductSku}>
                  <SelectTrigger className="h-8 text-xs">
                    <SelectValue placeholder="Chọn sản phẩm / SKU cần áp dụng..." />
                  </SelectTrigger>
                  <SelectContent>
                    {mockProducts.map((p) => (
                      <SelectItem key={p.id} value={p.code}>
                        [{p.code}] {p.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Button
                type="button"
                variant="default"
                size="sm"
                onClick={handleAddSku}
                className="h-8 gap-1 bg-emerald-600 hover:bg-emerald-700 text-white text-xs cursor-pointer"
              >
                <Plus className="size-3.5" />
                <span>Thêm SKU</span>
              </Button>
            </div>

            {/* SKU Table */}
            <div className="overflow-hidden rounded-lg border border-border/60">
              <table className="w-full text-xs">
                <thead className="bg-muted/60 text-muted-foreground border-b border-border/60">
                  <tr>
                    <th className="py-2 px-3 text-left font-semibold w-32">SKU</th>
                    <th className="py-2 px-3 text-left font-semibold">Tên SKU *</th>
                    <th className="py-2 px-3 text-right font-semibold w-24">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/40">
                  {applicableSkus.length === 0 ? (
                    <tr>
                      <td colSpan={3} className="py-4 text-center text-muted-foreground italic">
                        Chưa có SKU nào được chọn. Hãy chọn SKU ở ô trên.
                      </td>
                    </tr>
                  ) : (
                    applicableSkus.map((item) => (
                      <tr key={item.sku} className="hover:bg-muted/20">
                        <td className="py-2 px-3 font-mono font-bold text-primary">{item.sku}</td>
                        <td className="py-2 px-3 font-medium text-foreground">{item.name}</td>
                        <td className="py-2 px-3 text-right">
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => handleRemoveSku(item.sku)}
                            className="size-7 text-muted-foreground hover:text-destructive cursor-pointer"
                          >
                            <Trash2 className="size-3.5" />
                          </Button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </Panel>
      </div>
    </form>
  )
}

export function CampaignFormDialog({
  open,
  campaign,
  onOpenChange,
  onSubmit,
  onDeactivate,
}: CampaignFormDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="w-[95vw] sm:max-w-[860px] max-h-[90vh] flex flex-col p-0 gap-0 bg-background border border-border rounded-xl shadow-2xl overflow-hidden"
      >
        <CampaignFormInner
          key={campaign?.id ?? 'create-new'}
          campaign={campaign}
          onClose={() => onOpenChange(false)}
          onSubmit={onSubmit}
          onDeactivate={onDeactivate}
        />
      </DialogContent>
    </Dialog>
  )
}
