'use client'

import { useState } from 'react'
import {
  Boxes,
  CheckCircle2,
  FileText,
  GraduationCap,
  Package,
  Plus,
  RefreshCw,
  Sparkles,
  StickyNote,
  Trash2,
  UserCheck,
  Users,
} from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { FieldLabel } from '@/components/shared'
import { InlineSelect, SYSTEM_BRANCHES } from '@/components/controls'
import {
  PRODUCT_CATEGORY_MAP,
  SOURCE_TYPE_MAP,
  type DeliveryMethod,
  type FulfillmentProduct,
  type FulfillmentProductCategory,
  type FulfillmentSourceType,
  type OrderFulfillmentRecord,
} from '@/mocks/orderFulfillments'
import {
  OrderFulfillmentStudentPickerModal,
  type SelectedStudentItem,
} from './OrderFulfillmentStudentPickerModal'
import { maskPhoneNumber } from './orderFulfillmentHelpers'
import { cn } from '@/lib/utils'

interface OrderFulfillmentCreateDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onCreate: (newRecords: OrderFulfillmentRecord[]) => void
}

const SOURCE_OPTIONS = [
  { value: 'care_gift', label: 'Quà tặng CSKH (Tri ân / Sinh nhật)' },
  { value: 'reward', label: 'Khen thưởng & Đổi quà tích lũy' },
  { value: 'event', label: 'Sự kiện, Workshop & Open Day' },
  { value: 'direct_issue', label: 'Xuất cấp tại quầy cơ sở' },
]

const CATEGORY_OPTIONS = Object.entries(PRODUCT_CATEGORY_MAP).map(([val, lbl]) => ({
  value: val,
  label: lbl,
}))

// Gói quà mẫu định hình sẵn (Preset bundles) giúp thao tác 1 chạm
const PRESET_BUNDLES = [
  {
    name: 'Set Khai giảng',
    items: [
      { id: 'p1', name: 'Balo RinoEdu Standard 2026', category: 'gift' as FulfillmentProductCategory, quantity: 1, unit: 'Cái' },
      { id: 'p2', name: 'Bình nước giữ nhiệt Eco', category: 'gift' as FulfillmentProductCategory, quantity: 1, unit: 'Cái' },
    ],
  },
  {
    name: 'Set Khen thưởng',
    items: [
      { id: 'p3', name: 'Huy hiệu Chiến binh RinoStar', category: 'gift' as FulfillmentProductCategory, quantity: 1, unit: 'Cái' },
      { id: 'p4', name: 'Sách khám phá khoa học 3 tập', category: 'textbook' as FulfillmentProductCategory, quantity: 1, unit: 'Bộ' },
    ],
  },
  {
    name: 'Set Sự kiện & Open Day',
    items: [
      { id: 'p5', name: 'Áo thun sự kiện RinoEdu', category: 'uniform' as FulfillmentProductCategory, quantity: 1, unit: 'Áo' },
      { id: 'p6', name: 'Bộ Kit STEM lắp ráp mini', category: 'kit' as FulfillmentProductCategory, quantity: 1, unit: 'Bộ' },
    ],
  },
]

function generateDefaultPxkCode(): string {
  const randomNum = Math.floor(Math.random() * 900) + 100
  return `PXK-2026-${randomNum}`
}

export function OrderFulfillmentCreateDialog({
  open,
  onOpenChange,
  onCreate,
}: OrderFulfillmentCreateDialogProps) {
  // Đợt bàn giao
  const [sourceType, setSourceType] = useState<FulfillmentSourceType>('care_gift')
  const [sourceTitle, setSourceTitle] = useState<string>('Quà tặng tri ân học viên')
  const [branch, setBranch] = useState<string>(SYSTEM_BRANCHES[0] || 'RinoEdu Linh Đàm')
  const [stockExportCode, setStockExportCode] = useState<string>(generateDefaultPxkCode())
  const [deliveryMethod, setDeliveryMethod] = useState<DeliveryMethod>('pickup')
  const [notes, setNotes] = useState<string>('')

  // Bộ quà tặng cố định xuất cho mỗi học viên
  const [products, setProducts] = useState<FulfillmentProduct[]>([
    {
      id: 'prd-init-1',
      name: 'Balo RinoEdu Standard 2026',
      category: 'gift',
      quantity: 1,
      unit: 'Cái',
    },
  ])

  // Danh sách học viên nhận quà
  const [selectedStudents, setSelectedStudents] = useState<SelectedStudentItem[]>([])

  // Quản lý modal chọn học viên
  const [isPickerOpen, setIsPickerOpen] = useState(false)

  // Xử lý bộ quà
  const handleAddProduct = () => {
    setProducts((prev) => [
      ...prev,
      {
        id: `prd-${Date.now()}`,
        name: '',
        category: 'gift',
        quantity: 1,
        unit: 'Món',
      },
    ])
  }

  const handleRemoveProduct = (index: number) => {
    setProducts((prev) => prev.filter((_, i) => i !== index))
  }

  const handleUpdateProduct = (
    index: number,
    field: keyof FulfillmentProduct,
    value: string | number
  ) => {
    setProducts((prev) =>
      prev.map((p, i) => (i === index ? { ...p, [field]: value } : p))
    )
  }

  const handleApplyPreset = (presetItems: typeof PRESET_BUNDLES[0]['items']) => {
    setProducts(
      presetItems.map((item) => ({
        ...item,
        id: `prd-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      }))
    )
  }

  // Xử lý danh sách học viên
  const handleRemoveStudent = (studentId: string) => {
    setSelectedStudents((prev) => prev.filter((s) => s.id !== studentId))
  }

  const handleClearAllStudents = () => {
    setSelectedStudents([])
  }

  const handleRegeneratePxk = () => {
    setStockExportCode(generateDefaultPxkCode())
  }

  // Tính tổng số lượng
  const totalItemsPerStudent = products.reduce((acc, p) => acc + (Number(p.quantity) || 0), 0)
  const totalIssueQuantity = selectedStudents.length * totalItemsPerStudent

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (selectedStudents.length === 0) return
    const validProducts = products.filter((p) => p.name.trim() !== '')
    if (validProducts.length === 0) return

    const now = new Date()
    const createdAt = now.toLocaleString('vi-VN', {
      hour: '2-digit',
      minute: '2-digit',
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    })

    const baseIdNum = Math.floor(Math.random() * 800) + 100

    const newRecords: OrderFulfillmentRecord[] = selectedStudents.map((st, idx) => {
      const studentPhone = st.parentPhone || st.phone || '0988000000'
      const recipientName = st.parentName || st.name
      return {
        id: `DLV-${now.getFullYear()}-${baseIdNum + idx}`,
        sourceType,
        sourceTitle: sourceTitle.trim() || SOURCE_TYPE_MAP[sourceType],
        stockExportCode: stockExportCode.trim() || undefined,
        studentName: st.name,
        customerName: recipientName,
        customerPhone: studentPhone,
        recipientName: recipientName,
        recipientPhone: studentPhone,
        recipientRole: st.parentName ? 'Phụ huynh' : 'Học viên',
        branch,
        deliveryMethod,
        status: 'pending_handover',
        products: validProducts,
        handoverBy: 'Lễ tân cơ sở',
        notes: notes.trim() || undefined,
        createdAt,
      }
    })

    onCreate(newRecords)
    onOpenChange(false)

    // Reset danh sách học viên
    setSelectedStudents([])
    setStockExportCode(generateDefaultPxkCode())
  }

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent
          className="w-[96vw] sm:max-w-4xl md:max-w-5xl lg:max-w-6xl max-h-[90vh] flex flex-col p-0 gap-0 overflow-hidden bg-card border border-border rounded-2xl shadow-2xl"
          onOpenAutoFocus={(e) => e.preventDefault()}
        >
          {/* ================= 1. HEADER (1 DÒNG DUY NHẤT) ================= */}
          <DialogHeader className="shrink-0 px-6 py-3.5 border-b border-border/80 bg-background text-left">
            <div className="flex items-center justify-between gap-3 pr-6">
              <DialogTitle className="text-sm font-normal text-muted-foreground flex items-center gap-1.5">
                <span>Tạo đợt bàn giao xuất kho:</span>
                <span className="font-mono font-bold text-foreground text-sm">{stockExportCode}</span>
                <button
                  type="button"
                  onClick={handleRegeneratePxk}
                  className="text-muted-foreground hover:text-foreground p-1 rounded hover:bg-muted transition-colors cursor-pointer ml-0.5"
                  title="Tự sinh mã PXK mới"
                >
                  <RefreshCw className="h-3.5 w-3.5" />
                </button>
              </DialogTitle>
              <DialogDescription className="sr-only">
                Tạo đợt bàn giao xuất kho quà tặng & học liệu cho học viên
              </DialogDescription>
            </div>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="flex-1 flex flex-col min-h-0 overflow-hidden">
            {/* ================= 2. BODY: SPLIT LEFT-RIGHT PANELS ================= */}
            <div className="flex-1 overflow-y-auto p-6">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
                {/* ================= LEFT PANEL (7 COLS): BỘ SẢN PHẨM & HỌC VIÊN NHẬN ================= */}
                <div className="lg:col-span-7 flex flex-col gap-4 min-w-0">
                  {/* 1. BỘ SẢN PHẨM ÁP DỤNG CHO MỖI HỌC VIÊN */}
                  <div className="rounded-xl border border-border/80 bg-card p-4 space-y-3 shadow-2xs">
                    <div className="flex items-center justify-between flex-wrap gap-2 pb-2 border-b border-border/60">
                      <div className="flex items-center gap-2 font-semibold text-xs text-foreground">
                        <Package className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                        <span>Bộ sản phẩm áp dụng cho mỗi học viên</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="text-[10px] py-0 px-2 font-mono font-medium">
                          {totalItemsPerStudent} món / bạn
                        </Badge>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          className="h-6 text-[11px] px-2 gap-1 cursor-pointer"
                          onClick={handleAddProduct}
                        >
                          <Plus className="h-3 w-3" />
                          <span>Thêm món</span>
                        </Button>
                      </div>
                    </div>

                    {/* Mẫu nhanh Preset */}
                    <div className="flex items-center gap-1.5 flex-wrap bg-muted/40 p-2 rounded-lg border border-border/60">
                      <span className="text-[11px] text-muted-foreground flex items-center gap-1 font-medium">
                        <Sparkles className="h-3 w-3 text-amber-500" />
                        <span>Mẫu nhanh:</span>
                      </span>
                      {PRESET_BUNDLES.map((preset) => (
                        <Button
                          key={preset.name}
                          type="button"
                          variant="outline"
                          size="sm"
                          className="h-5 text-[10px] px-2 rounded cursor-pointer bg-background hover:bg-muted font-normal"
                          onClick={() => handleApplyPreset(preset.items)}
                        >
                          {preset.name}
                        </Button>
                      ))}
                    </div>

                    {/* Bảng danh sách vật phẩm */}
                    <div className="space-y-2">
                      {products.map((p, idx) => (
                        <div
                          key={p.id || idx}
                          className="flex items-center gap-2 p-2 rounded-lg bg-background border border-border/70 shadow-2xs"
                        >
                          <div className="text-muted-foreground font-mono text-[11px] w-4 text-center">
                            {idx + 1}.
                          </div>

                          <Input
                            value={p.name}
                            onChange={(e) => handleUpdateProduct(idx, 'name', e.target.value)}
                            placeholder="Tên quà tặng / học liệu..."
                            className="h-7 text-xs flex-1"
                            required
                          />

                          <div className="w-28 shrink-0">
                            <InlineSelect
                              value={p.category}
                              options={CATEGORY_OPTIONS}
                              onValueChange={(val: string) =>
                                handleUpdateProduct(idx, 'category', val as FulfillmentProductCategory)
                              }
                              ariaLabel="Loại vật phẩm"
                            />
                          </div>

                          <div className="flex items-center gap-1 shrink-0">
                            <span className="text-[11px] text-muted-foreground">SL:</span>
                            <Input
                              type="number"
                              min={1}
                              value={p.quantity}
                              onChange={(e) =>
                                handleUpdateProduct(idx, 'quantity', parseInt(e.target.value) || 1)
                              }
                              className="h-7 w-12 text-xs font-mono text-center"
                              required
                            />
                          </div>

                          <Input
                            value={p.unit}
                            onChange={(e) => handleUpdateProduct(idx, 'unit', e.target.value)}
                            placeholder="Đơn vị"
                            className="h-7 w-16 text-xs text-center shrink-0"
                            required
                          />

                          {products.length > 1 && (
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded shrink-0 cursor-pointer"
                              onClick={() => handleRemoveProduct(idx)}
                              title="Xóa vật phẩm này"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* 2. DANH SÁCH HỌC VIÊN NHẬN QUÀ */}
                  <div className="rounded-xl border border-border/80 bg-card p-4 space-y-3 shadow-2xs">
                    <div className="flex items-center justify-between flex-wrap gap-2 pb-2 border-b border-border/60">
                      <div className="flex items-center gap-2 font-semibold text-xs text-foreground">
                        <Users className="h-4 w-4 text-primary" />
                        <span>Danh sách học viên nhận quà</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <Badge
                          variant={selectedStudents.length > 0 ? 'default' : 'outline'}
                          className={cn(
                            'text-[10px] py-0 px-2 font-medium',
                            selectedStudents.length > 0
                              ? 'bg-primary text-primary-foreground'
                              : 'text-muted-foreground'
                          )}
                        >
                          {selectedStudents.length} học viên
                        </Badge>
                        {selectedStudents.length > 0 && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="h-6 text-[11px] px-2 text-rose-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 cursor-pointer"
                            onClick={handleClearAllStudents}
                          >
                            Xóa hết
                          </Button>
                        )}
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          className="h-6 text-xs px-2.5 bg-primary/10 hover:bg-primary/20 text-primary border-primary/30 font-medium gap-1.5 cursor-pointer"
                          onClick={() => setIsPickerOpen(true)}
                        >
                          <UserCheck className="h-3.5 w-3.5" />
                          <span>
                            {selectedStudents.length === 0
                              ? '+ Chọn học viên'
                              : '+ Chọn thêm'}
                          </span>
                        </Button>
                      </div>
                    </div>

                    {/* Bảng danh sách hoặc Trạng thái trống */}
                    {selectedStudents.length === 0 ? (
                      <div className="p-6 text-center rounded-lg border border-dashed border-border/80 bg-background/50 space-y-2">
                        <div className="inline-flex p-2.5 rounded-full bg-primary/10 text-primary">
                          <Users className="h-5 w-5" />
                        </div>
                        <p className="font-medium text-xs text-foreground">
                          Chưa có học viên nào trong đợt bàn giao này
                        </p>
                        <p className="text-[11px] text-muted-foreground max-w-md mx-auto">
                          Mở bộ lọc để chọn học viên theo lớp học, cơ sở hoặc tìm kiếm theo tên và số điện thoại phụ huynh.
                        </p>
                        <Button
                          type="button"
                          size="sm"
                          className="h-7 text-xs bg-primary hover:bg-primary/90 text-primary-foreground gap-1.5 cursor-pointer mt-1"
                          onClick={() => setIsPickerOpen(true)}
                        >
                          <UserCheck className="h-3.5 w-3.5" />
                          <span>Mở bộ lọc chọn học viên ngay</span>
                        </Button>
                      </div>
                    ) : (
                      <div className="border border-border/70 rounded-lg max-h-56 overflow-y-auto bg-background">
                        <Table className="w-full text-xs">
                          <TableHeader className="sticky top-0 bg-muted/80 backdrop-blur">
                            <TableRow>
                              <TableHead className="w-9 text-center px-2">#</TableHead>
                              <TableHead className="w-[30%]">Học viên</TableHead>
                              <TableHead className="w-[25%]">Lớp đang học</TableHead>
                              <TableHead className="w-[30%]">Phụ huynh / SĐT</TableHead>
                              <TableHead className="w-9 text-center px-2"></TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {selectedStudents.map((st, idx) => (
                              <TableRow key={st.id} className="hover:bg-muted/30">
                                <TableCell className="text-center font-mono text-muted-foreground text-[10px] px-2">
                                  {idx + 1}
                                </TableCell>
                                <TableCell className="py-1.5 font-medium">
                                  <span className="text-foreground font-semibold">{st.name}</span>
                                </TableCell>
                                <TableCell className="py-1.5">
                                  {st.enrolledClass ? (
                                    <Badge variant="outline" className="text-[10px] py-0 px-1 font-normal gap-1">
                                      <GraduationCap className="h-2.5 w-2.5 text-primary" />
                                      <span>{st.enrolledClass}</span>
                                    </Badge>
                                  ) : (
                                    <span className="text-muted-foreground text-[11px]">—</span>
                                  )}
                                </TableCell>
                                <TableCell className="py-1.5">
                                  <span className="text-foreground text-[11px]">
                                    {st.parentName || 'Phụ huynh'}
                                  </span>{' '}
                                  <span className="text-muted-foreground font-mono text-[10px]">
                                    ({maskPhoneNumber(st.parentPhone || st.phone)})
                                  </span>
                                </TableCell>
                                <TableCell className="text-center py-1.5 px-2">
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    className="h-5 w-5 text-muted-foreground hover:text-rose-500 rounded cursor-pointer"
                                    onClick={() => handleRemoveStudent(st.id)}
                                    title="Loại khỏi đợt phát này"
                                  >
                                    <Trash2 className="h-3 w-3" />
                                  </Button>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    )}
                  </div>

                  {/* 3. GHI CHÚ BÀN GIAO */}
                  <div className="rounded-xl border border-border/80 bg-card p-4 space-y-2 shadow-2xs">
                    <div className="flex items-center gap-1.5 font-semibold text-xs text-foreground">
                      <StickyNote className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                      <span>Ghi chú đợt bàn giao</span>
                    </div>
                    <Textarea
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Ghi chú thêm về điều kiện trao quà, phát tại lớp trong giờ giải lao..."
                      className="text-xs resize-none min-h-[52px]"
                      rows={2}
                    />
                  </div>
                </div>

                {/* ================= RIGHT PANEL (5 COLS): THÔNG TIN ĐỢT PHÁT & TỔNG KẾT XUẤT KHO ================= */}
                <div className="lg:col-span-5 flex flex-col gap-4 min-w-0">
                  {/* 1. THÔNG TIN ĐỢT PHÁT & CHỨNG TỪ KHO */}
                  <div className="rounded-xl border border-border/80 bg-card p-4 space-y-3.5 shadow-2xs">
                    <div className="flex items-center justify-between pb-2 border-b border-border/60">
                      <div className="flex items-center gap-2 font-semibold text-xs text-foreground">
                        <FileText className="h-4 w-4 text-primary" />
                        <span>Thông tin đợt phát & Chứng từ kho</span>
                      </div>
                    </div>

                    <div className="space-y-3 text-xs">
                      <div>
                        <FieldLabel label="Tên chương trình / Đợt tặng quà" required>
                          <Input
                            value={sourceTitle}
                            onChange={(e) => setSourceTitle(e.target.value)}
                            placeholder="Ví dụ: Quà Tết Trung Thu, Set quà khai giảng..."
                            className="h-8 text-xs"
                            required
                          />
                        </FieldLabel>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <FieldLabel label="Phân loại xuất" required>
                          <InlineSelect
                            value={sourceType}
                            options={SOURCE_OPTIONS}
                            onValueChange={(val: string) => setSourceType(val as FulfillmentSourceType)}
                            ariaLabel="Phân loại xuất"
                          />
                        </FieldLabel>

                        <FieldLabel label="Cơ sở thực hiện" required>
                          <InlineSelect
                            value={branch}
                            options={SYSTEM_BRANCHES.map((b) => ({ value: b, label: b }))}
                            onValueChange={setBranch}
                            ariaLabel="Cơ sở xuất quà"
                          />
                        </FieldLabel>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <FieldLabel label="Phiếu xuất kho liên kết (PXK)" required>
                          <div className="relative flex items-center">
                            <Input
                              value={stockExportCode}
                              onChange={(e) => setStockExportCode(e.target.value)}
                              placeholder="PXK-2026-xxx"
                              className="h-8 text-xs font-mono font-semibold pr-8"
                              required
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6 absolute right-1 text-muted-foreground hover:text-foreground cursor-pointer"
                              onClick={handleRegeneratePxk}
                              title="Tự sinh mã PXK mới"
                            >
                              <RefreshCw className="h-3 w-3" />
                            </Button>
                          </div>
                        </FieldLabel>

                        <FieldLabel label="Kênh giao nhận" required>
                          <InlineSelect
                            value={deliveryMethod}
                            options={[
                              { value: 'pickup', label: 'Tại quầy / Phát tại lớp' },
                              { value: 'shipping', label: 'Giao hàng tận nơi' },
                            ]}
                            onValueChange={(val: string) => setDeliveryMethod(val as DeliveryMethod)}
                            ariaLabel="Hình thức giao nhận"
                          />
                        </FieldLabel>
                      </div>
                    </div>
                  </div>

                  {/* 2. TỔNG KẾT XUẤT KHO & ĐỊNH MỨC */}
                  <div className="rounded-xl border border-border/80 bg-card p-4 space-y-3.5 shadow-2xs">
                    <div className="flex items-center justify-between pb-2 border-b border-border/60">
                      <div className="flex items-center gap-2 font-semibold text-xs text-foreground">
                        <Boxes className="h-4 w-4 text-primary" />
                        <span>Tổng kết xuất kho & Định mức</span>
                      </div>
                      <Badge variant="outline" className="text-[10px] py-0 px-2 font-mono text-muted-foreground">
                        {stockExportCode}
                      </Badge>
                    </div>

                    <div className="space-y-2.5 text-xs">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-muted-foreground">Số lượng học viên:</span>
                        <span className="font-semibold text-foreground font-mono">
                          {selectedStudents.length} học viên
                        </span>
                      </div>

                      <div className="flex items-center justify-between gap-2">
                        <span className="text-muted-foreground">Định mức / học viên:</span>
                        <span className="font-semibold text-foreground font-mono">
                          {totalItemsPerStudent} món / bạn
                        </span>
                      </div>

                      <div className="flex items-center justify-between gap-2">
                        <span className="text-muted-foreground">Kênh giao nhận:</span>
                        <span className="font-medium text-foreground">
                          {deliveryMethod === 'pickup' ? 'Nhận tại quầy / Phát tại lớp' : 'Giao hàng tận nơi'}
                        </span>
                      </div>

                      <div className="pt-2 border-t border-border/60 flex items-center justify-between gap-2">
                        <span className="font-semibold text-foreground">Tổng xuất kho dự kiến:</span>
                        <span className="text-base font-bold text-primary font-mono">
                          {totalIssueQuantity} <span className="text-xs font-normal text-muted-foreground">món</span>
                        </span>
                      </div>
                    </div>

                    <div className="p-3 bg-muted/40 rounded-lg border border-border/60 text-[11px] text-muted-foreground leading-relaxed">
                      Hệ thống sẽ tự động tạo <strong className="text-foreground">{selectedStudents.length}</strong> phiếu bàn giao tương ứng cho từng học viên và liên kết với chứng từ xuất kho <strong className="font-mono text-foreground">{stockExportCode}</strong>.
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* ================= 3. FOOTER BAR ================= */}
            <DialogFooter className="shrink-0 px-6 py-3 border-t border-border/80 bg-muted/20 flex flex-row items-center justify-between gap-2">
              <div className="text-xs text-muted-foreground hidden sm:flex items-center gap-1.5">
                <span>
                  Đã chọn <strong className="text-foreground">{selectedStudents.length}</strong> học viên • Xuất <strong className="text-foreground">{totalIssueQuantity}</strong> món
                </span>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="text-xs h-8 cursor-pointer"
                  onClick={() => onOpenChange(false)}
                >
                  Hủy
                </Button>
                <Button
                  type="submit"
                  size="sm"
                  className="text-xs h-8 bg-primary hover:bg-primary/90 text-primary-foreground gap-1.5 cursor-pointer font-medium"
                  disabled={selectedStudents.length === 0 || totalItemsPerStudent === 0}
                >
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  <span>
                    {selectedStudents.length === 0
                      ? 'Chưa chọn học viên'
                      : `Tạo ${selectedStudents.length} phiếu bàn giao`}
                  </span>
                </Button>
              </div>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* MODAL 2: BỘ LỌC CHỌN HỌC VIÊN TÁCH BIỆT */}
      <OrderFulfillmentStudentPickerModal
        open={isPickerOpen}
        onOpenChange={setIsPickerOpen}
        selectedStudents={selectedStudents}
        onConfirm={setSelectedStudents}
        defaultBranch={branch}
      />
    </>
  )
}
