'use client'

import React, { useState, useMemo } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { User, Truck, Plus, ExternalLink, X, Users } from 'lucide-react'
import { formatCurrency } from '@/lib/format'
import { toast } from 'sonner'
import type { DetailedOrder } from '../StudentOrdersTab'
import { PRODUCT_CATALOG, type DraftOrderItem, type ChildGroup } from './draftOrderTypes'
import { ChildGroupCard, ChildProfileHoverCard, RICH_CHILD_OPTIONS } from './ChildGroupCard'
import { DraftOrderPaymentSummary } from './DraftOrderPaymentSummary'
import { StudentDetailDialog } from '@/components/screens/students/detail/StudentDetailDialog'
import { AddPaymentModalDialog } from './AddPaymentModalDialog'

interface DraftOrderEditorDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  studentId?: string
  studentName?: string
  studentPhone?: string
  studentAddress?: string
  existingOrder?: DetailedOrder | null
  onSaveSuccess?: (order: DetailedOrder) => void
  onDeleteDraft?: (orderId: string) => void
}

const CHILD_POOL = [
  { account: 'con-1', name: 'Đặng Nguyễn Phương Linh' },
  { account: 'con-2', name: 'Đặng Quốc Bảo (Con thứ 2)' },
  { account: 'con-3', name: 'Đặng Minh Châu (Con thứ 3)' },
  { account: 'con-4', name: 'Đặng Bảo An (Con thứ 4)' },
]

export function DraftOrderEditorDialog({
  open,
  onOpenChange,
  studentId = 'HV-8849',
  studentName = 'Đặng Hiền',
  studentPhone = '0903279888',
  studentAddress = '13 Tông Đản, Phường Tràng Tiền, Quận Hoàn Kiếm, TP. Hà Nội',
  existingOrder,
  onSaveSuccess,
  onDeleteDraft,
}: DraftOrderEditorDialogProps) {
  // Form State: Child Groups containing items grouped by child
  const [childGroups, setChildGroups] = useState<ChildGroup[]>([
    {
      id: 'group-1',
      childAccount: 'con-1',
      childName: studentName || 'Đặng Thiên An',
      items: [
        {
          id: 'item-1',
          category: 'gia_su',
          categoryName: 'Sản phẩm gia sư',
          isNew: true,
          isRenewal: false,
          program: '',
          teacher: '',
          packageType: '',
          center: '',
          productCode: '',
          productName: '',
          quantity: 1,
          unitPrice: 0,
          discount: 0,
          childAccount: 'con-1',
        },
      ],
    },
  ])

  // Sync primary child and order pre-fill whenever dialog opens or props change
  React.useEffect(() => {
    if (open) {
      const primaryName = studentName || 'Đặng Thiên An'
      const primaryChildOpt = RICH_CHILD_OPTIONS.find(
        (c) =>
          c.name.toLowerCase().includes(primaryName.toLowerCase()) ||
          primaryName.toLowerCase().includes(c.name.split(' ')[0].toLowerCase())
      ) || { value: 'con-1', name: primaryName }

      if (existingOrder && existingOrder.detailedItems && existingOrder.detailedItems.length > 0) {
        const firstItem = existingOrder.detailedItems[0]
        setChildGroups([
          {
            id: 'group-1',
            childAccount: primaryChildOpt.value,
            childName: primaryChildOpt.name,
            items: [
              {
                id: `item-${Date.now()}`,
                category: 'gia_su',
                categoryName: 'Sản phẩm gia sư',
                isNew: false,
                isRenewal: true,
                program: '',
                teacher: '',
                packageType: firstItem.durationText || '40 buổi',
                center: 'RinoEdu Nguyễn Tuân',
                productCode: firstItem.productId || 'P-001',
                productName: firstItem.productName || 'Gói học tái phí',
                quantity: firstItem.quantity || 1,
                unitPrice: firstItem.unitPrice || existingOrder.finalAmount || 8400000,
                discount: 0,
                childAccount: primaryChildOpt.value,
              },
            ],
          },
        ])
      } else {
        setChildGroups([
          {
            id: 'group-1',
            childAccount: primaryChildOpt.value,
            childName: primaryChildOpt.name,
            items: [
              {
                id: 'item-1',
                category: 'gia_su',
                categoryName: 'Sản phẩm gia sư',
                isNew: true,
                isRenewal: false,
                program: '',
                teacher: '',
                packageType: '',
                center: '',
                productCode: '',
                productName: '',
                quantity: 1,
                unitPrice: 0,
                discount: 0,
                childAccount: primaryChildOpt.value,
              },
            ],
          },
        ])
      }
    }
  }, [open, existingOrder, studentName])

  const [paymentOption, setPaymentOption] = useState<'MOT_LAN' | 'NHIEU_LAN'>('NHIEU_LAN')
  const [paymentMethod, setPaymentMethod] = useState<'COD' | 'BANK'>('BANK')
  const [profileStudentId, setProfileStudentId] = useState<string | null>(null)
  const [isAddPaymentOpen, setIsAddPaymentOpen] = useState(false)
  const [totalPaidAmount, setTotalPaidAmount] = useState(0)

  // Sync totalPaidAmount based on existingOrder when opening modal
  React.useEffect(() => {
    if (open) {
      if (existingOrder && existingOrder.totalPaidAmount !== undefined) {
        setTotalPaidAmount(existingOrder.totalPaidAmount)
      } else {
        setTotalPaidAmount(0)
      }
    }
  }, [open, existingOrder])

  // List of child accounts currently assigned across all groups
  const assignedChildAccounts = useMemo(
    () => childGroups.map((g) => g.childAccount),
    [childGroups]
  )

  // Flatten all items across child groups for total calculations
  const allItems = useMemo(
    () => childGroups.flatMap((g) => g.items),
    [childGroups]
  )

  const subtotalAmount = useMemo(
    () => allItems.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0),
    [allItems]
  )

  const totalDiscount = useMemo(
    () => allItems.reduce((sum, item) => sum + item.discount, 0),
    [allItems]
  )

  const finalAmount = Math.max(0, subtotalAmount - totalDiscount)

  // Child Group Handlers: Auto-pick next available unassigned child account
  const handleAddGroup = () => {
    const usedAccounts = new Set(childGroups.map((g) => g.childAccount))
    const availableChild = CHILD_POOL.find((c) => !usedAccounts.has(c.account))

    if (!availableChild) {
      toast.error('Tất cả tài khoản con đã có nhóm sản phẩm!')
      return
    }

    const newGroupId = `group-${Date.now()}`
    const newItem: DraftOrderItem = {
      id: `item-${Date.now()}`,
      category: 'gia_su',
      categoryName: 'Sản phẩm gia sư',
      isNew: true,
      isRenewal: false,
      program: '',
      teacher: '',
      packageType: '',
      center: '',
      productCode: '',
      productName: '',
      quantity: 1,
      unitPrice: 0,
      discount: 0,
      childAccount: '',
    }

    const newGroup: ChildGroup = {
      id: newGroupId,
      childAccount: '',
      childName: '',
      items: [newItem],
    }

    setChildGroups((prev) => [...prev, newGroup])
    toast.success('Đã thêm nhóm sản phẩm cho con mới')
  }

  const handleRemoveGroup = (groupId: string) => {
    if (childGroups.length > 0 && childGroups[0].id === groupId) {
      toast.error('Tài khoản con mặc định đầu tiên không thể xóa!')
      return
    }
    if (childGroups.length <= 1) {
      toast.error('Đơn hàng phải có ít nhất 1 nhóm sản phẩm cho con')
      return
    }
    setChildGroups((prev) => prev.filter((g) => g.id !== groupId))
    toast.info('Đã xóa nhóm sản phẩm')
  }

  const handleUpdateGroupChild = (groupId: string, childAccount: string, childName: string) => {
    setChildGroups((prev) =>
      prev.map((g) => {
        if (g.id === groupId) {
          const updatedItems = g.items.map((i) => ({ ...i, childAccount }))
          return { ...g, childAccount, childName, items: updatedItems }
        }
        return g
      })
    )
  }

  // Item Handlers within a group
  const handleAddItemToGroup = (groupId: string, category: 'gia_su' | 'khoa_hoc' | 'combo') => {
    const catName =
      category === 'gia_su'
        ? 'Sản phẩm gia sư'
        : category === 'khoa_hoc'
        ? 'Sản phẩm khóa học'
        : 'Sản phẩm combo'

    setChildGroups((prev) =>
      prev.map((g) => {
        if (g.id === groupId) {
          const newItem: DraftOrderItem = {
            id: `item-${Date.now()}`,
            category,
            categoryName: catName,
            isNew: true,
            isRenewal: false,
            program: '',
            teacher: '',
            packageType: '',
            center: '',
            productCode: '',
            productName: '',
            quantity: 1,
            unitPrice: 0,
            discount: 0,
            childAccount: g.childAccount,
            activationMethod: category === 'khoa_hoc' ? 'KÍCH HOẠT KHI LÊN ĐƠN' : undefined,
          }
          return { ...g, items: [...g.items, newItem] }
        }
        return g
      })
    )
    toast.success(`Đã thêm ${catName}`)
  }

  const handleUpdateItemInGroup = (groupId: string, itemId: string, updates: Partial<DraftOrderItem>) => {
    setChildGroups((prev) =>
      prev.map((g) => {
        if (g.id === groupId) {
          const updatedItems = g.items.map((i) => (i.id === itemId ? { ...i, ...updates } : i))
          return { ...g, items: updatedItems }
        }
        return g
      })
    )
  }

  const handleRemoveItemFromGroup = (groupId: string, itemId: string) => {
    setChildGroups((prev) =>
      prev.map((g) => {
        if (g.id === groupId) {
          if (g.items.length <= 1) {
            toast.error('Mỗi nhóm con phải có ít nhất 1 sản phẩm')
            return g
          }
          return { ...g, items: g.items.filter((i) => i.id !== itemId) }
        }
        return g
      })
    )
  }

  const handleResetItemInGroup = (groupId: string, itemId: string) => {
    handleUpdateItemInGroup(groupId, itemId, {
      program: '',
      teacher: '',
      packageType: '',
      center: '',
      productCode: '',
      productName: '',
      quantity: 1,
      unitPrice: 0,
      discount: 0,
    })
    toast.info('Đã làm mới thông tin sản phẩm')
  }

  const handleSaveOrder = () => {
    if (allItems.length === 0) {
      toast.error('Vui lòng chọn ít nhất 1 sản phẩm')
      return
    }

    const orderNo = existingOrder?.id || `DHN-${Math.floor(100000 + Math.random() * 900000)}`

    const newOrder: DetailedOrder = {
      id: orderNo,
      orderNo: orderNo,
      studentId: studentId,
      studentName: studentName,
      items: allItems.map((i) => ({
        productId: i.productCode,
        productName: i.productName,
        quantity: i.quantity,
        unitPrice: i.unitPrice,
        subtotal: i.unitPrice * i.quantity - i.discount,
      })),
      totalAmount: subtotalAmount,
      discountAmount: totalDiscount,
      finalAmount: finalAmount,
      paymentMethod: paymentMethod === 'BANK' ? 'bank_transfer' : 'cash',
      paymentStatus: 'unpaid',
      status: 'pending',
      branch: 'Station',
      saleBy: 'Vũ Thị Lan 1',
      createdAt: new Date().toISOString(),
      saleDate: new Date().toISOString().split('T')[0],
      detailedItems: allItems.map((i) => ({
        productId: i.productCode,
        productName: i.productName,
        quantity: i.quantity,
        unitPrice: i.unitPrice,
        subtotal: i.unitPrice * i.quantity - i.discount,
        studentName: i.childAccount || studentName,
        orderType: i.isRenewal ? 'Gia hạn' : 'Mua mới',
        durationText: i.packageType,
      })),
      payments: [],
    }

    if (onSaveSuccess) {
      onSaveSuccess(newOrder)
    }
    toast.success(`Đã tạo Đơn hàng nháp thành công! Mã: ${orderNo}`, {
      description: `Tổng tiền: ${formatCurrency(finalAmount)} - Trạng thái: Đơn nháp (Chờ thu phí)`,
    })
    onOpenChange(false)
  }

  const handleCreateLandingPage = () => {
    if (allItems.length === 0) {
      toast.error('Vui lòng thêm và chọn ít nhất 1 sản phẩm trước khi tạo Landing Page!')
      return
    }

    const hasIncompleteItems = allItems.some(
      (i) =>
        !i.productName ||
        i.productName.trim() === '' ||
        i.productName === 'Chọn...' ||
        !i.program ||
        i.program.trim() === '' ||
        i.program === 'Chọn...' ||
        i.unitPrice <= 0
    )

    if (hasIncompleteItems) {
      toast.error('Vui lòng chọn đầy đủ thông tin sản phẩm (Chương trình, Tên sản phẩm & Đơn giá) trước khi tạo Landing Page!')
      return
    }

    const orderNo = existingOrder?.orderNo || existingOrder?.id || `OD-DRAFT-${Math.floor(1000 + Math.random() * 9000)}`
    const origin = typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000'
    const quoteUrl = `${origin}/quote/${orderNo}`

    // Build dynamic payload for Landing Page
    const quoteChildGroups = childGroups.map((g) => ({
      childId: g.childAccount || studentId,
      childName: g.childAccount || studentName,
      studentCode: g.childAccount || studentId,
      accountPhone: studentPhone,
      branch: 'RinoEdu Nguyễn Tuân',
      items: g.items.map((i, idx) => ({
        id: i.id || `item-${idx}`,
        productName: i.productName || i.program || 'Sản phẩm học tập',
        orderType: i.isRenewal ? 'Gia hạn gói học' : 'Mua mới',
        durationText: i.packageType || '40 buổi học (Gia sư 1:1)',
        giftText: i.category === 'combo' ? 'Tặng 1 Bảng vẽ điện tử Canva & 1 Bộ Giáo trình Digital' : 'Tặng 1 x [IELTS] Khóa 5.0 nâng cao',
        unitPrice: i.unitPrice,
        quantity: i.quantity,
      })),
    }))

    const quoteData = {
      quoteNo: orderNo,
      createdDate: new Date().toLocaleDateString('vi-VN'),
      validUntil: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString('vi-VN'),
      customer: {
        parentName: studentName,
        role: 'Phụ huynh học viên',
        phone: studentPhone,
        email: `${studentPhone.replace(/\D/g, '')}@gmail.com`,
        address: studentAddress || 'Số 42 Nguyễn Tuân, Phường Thanh Xuân Trung, Quận Thanh Xuân, Hà Nội',
      },
      delivery: {
        recipientName: `${studentName} - ${studentPhone}`,
        address: studentAddress || 'Số 42 Nguyễn Tuân, Phường Thanh Xuân Trung, Quận Thanh Xuân, Hà Nội',
      },
      branch: {
        centerName: 'RinoEdu Nguyễn Tuân',
        csmName: 'Trần Nguyễn CSM',
        csmPhone: '0903.279.888',
      },
      childGroups: quoteChildGroups,
      subtotalAmount,
      totalDiscount,
      finalAmount,
    }

    // Save to localStorage so DraftQuoteLandingScreen receives dynamic data!
    if (typeof window !== 'undefined') {
      localStorage.setItem(`quote_data_${orderNo}`, JSON.stringify(quoteData))
      localStorage.setItem('latest_quote_data', JSON.stringify(quoteData))
    }

    // Trigger order save
    handleSaveOrder()

    // Copy link & Open Landing Page in new tab
    navigator.clipboard.writeText(quoteUrl)
    toast.success('Đã tạo và mở trang Landing Page Báo Giá!', {
      description: quoteUrl,
    })
    window.open(quoteUrl, '_blank')
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent showCloseButton={false} className="w-[98vw] sm:max-w-[1440px] h-[90vh] flex flex-col p-0 gap-0 bg-zinc-50 dark:bg-zinc-950 text-foreground border border-border rounded-xl shadow-2xl overflow-hidden">
        {/* Top Header Bar */}
        <DialogHeader className="p-3 px-3 pb-1 bg-transparent shrink-0 space-y-1">
          {/* Row 1: Title "Chi tiết đơn hàng" (Small text-xs, font-medium, no margin) */}
          <div className="flex items-center justify-between m-0 p-0">
            <DialogTitle className="text-xs font-medium text-muted-foreground leading-none">
              Chi tiết đơn hàng
            </DialogTitle>

            <button
              type="button"
              onClick={() => onOpenChange(false)}
              className="p-0.5 text-muted-foreground hover:text-foreground hover:bg-muted rounded-full transition-colors cursor-pointer"
              title="Đóng modal"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Row 2: Customer & Shipping Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 w-full pt-0.5">
            {/* Card 1: Khách hàng */}
            <div className="bg-white dark:bg-zinc-900 border border-border/80 rounded-lg p-2.5 px-3 flex items-center justify-between shadow-2xs">
              <div className="flex items-center gap-2.5">
                <div className="h-7 w-7 rounded-full bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center border border-indigo-100 dark:border-indigo-900 shrink-0">
                  <User className="h-3.5 w-3.5" />
                </div>
                <div>
                  <span className="text-[10px] font-medium text-indigo-600 dark:text-indigo-400 block tracking-normal">
                    Khách hàng
                  </span>
                  <p className="text-xs font-semibold text-foreground">
                    {studentName} - <span className="font-mono text-muted-foreground">{studentPhone}</span>
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => toast.info(`Thông tin học viên: ${studentName}`)}
                className="text-[11px] text-sky-600 dark:text-sky-400 hover:underline inline-flex items-center gap-1 font-medium cursor-pointer"
              >
                Xem chi tiết thông tin
                <ExternalLink className="h-3 w-3" />
              </button>
            </div>

            {/* Card 2: Giao hàng */}
            <div className="bg-white dark:bg-zinc-900 border border-border/80 rounded-lg p-2.5 px-3 flex items-center gap-2.5 shadow-2xs">
              <div className="h-7 w-7 rounded-full bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center border border-indigo-100 dark:border-indigo-900 shrink-0">
                <Truck className="h-3.5 w-3.5" />
              </div>
              <div className="min-w-0">
                <span className="text-[10px] font-medium text-indigo-600 dark:text-indigo-400 block tracking-normal">
                  Giao hàng
                </span>
                <p className="text-xs font-semibold text-foreground truncate">
                  {studentName} - <span className="font-mono text-muted-foreground">{studentPhone}</span>
                </p>
                <p className="text-[11px] text-muted-foreground truncate">
                  {studentAddress}
                </p>
              </div>
            </div>
          </div>
        </DialogHeader>

        {/* Scrollable Body Container (pb-36 prevents popover dropdown clipping) */}
        <div className="flex-1 overflow-y-auto p-3 space-y-4 pb-36">
          {/* ── MAIN LAYOUT: LEFT CHILD PRODUCT GROUPS & RIGHT PAYMENT SUMMARY ── */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5 w-full">
            {/* ── LEFT 9.5 COLUMNS (EXPANDED ~90%): SẢN PHẨM MUA THEO CON ── */}
            <div className="lg:col-span-9 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="text-base font-bold text-foreground tracking-tight">
                    Sản phẩm mua
                  </h3>
                  <span className="text-xs text-foreground font-normal flex items-center gap-1 flex-wrap">
                    <span>(</span>
                    {childGroups.map((g, idx) => {
                      const childOpt = RICH_CHILD_OPTIONS.find((c) => c.value === g.childAccount)
                      const name = g.childName ? g.childName.split(' (')[0] : 'Chưa chọn con'
                      const count = g.items.length
                      return (
                        <React.Fragment key={g.id}>
                          {idx > 0 && <span className="text-muted-foreground mx-0.5">•</span>}
                          {childOpt ? (
                            <ChildProfileHoverCard child={childOpt} onOpenProfile={(id) => setProfileStudentId(id)}>
                              <button
                                type="button"
                                onClick={() => setProfileStudentId(childOpt.studentId)}
                                className="font-semibold text-indigo-700 dark:text-indigo-300 hover:underline cursor-pointer"
                              >
                                {name}
                              </button>
                            </ChildProfileHoverCard>
                          ) : (
                            <span className="font-semibold text-indigo-700 dark:text-indigo-300">
                              {name}
                            </span>
                          )}
                          <span className="text-foreground font-medium">: {count} SP</span>
                        </React.Fragment>
                      )
                    })}
                    <span>)</span>
                  </span>
                </div>

                {/* Top Action: + Thêm con mới */}
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleAddGroup}
                  className="bg-white dark:bg-zinc-900 border border-border text-foreground hover:bg-indigo-50/60 hover:text-indigo-600 hover:border-indigo-200 dark:hover:bg-indigo-950/40 dark:hover:text-indigo-300 font-medium text-xs px-3.5 h-8.5 rounded-md shadow-2xs transition-colors cursor-pointer"
                >
                  <Plus className="h-3.5 w-3.5 mr-1 text-indigo-500" />
                  <span>Thêm con mới</span>
                </Button>
              </div>

              {/* Child Groups Cards List */}
              <div className="space-y-4">
                {childGroups.map((group, index) => (
                  <ChildGroupCard
                    key={group.id}
                    group={group}
                    assignedChildAccounts={assignedChildAccounts}
                    canRemoveGroup={index > 0}
                    onUpdateGroupChild={handleUpdateGroupChild}
                    onRemoveGroup={handleRemoveGroup}
                    onAddItemToGroup={handleAddItemToGroup}
                    onUpdateItem={handleUpdateItemInGroup}
                    onRemoveItem={handleRemoveItemFromGroup}
                    onResetItem={handleResetItemInGroup}
                    onOpenChildProfile={(id) => setProfileStudentId(id)}
                  />
                ))}
              </div>
            </div>

            {/* ── RIGHT 3 COLUMNS (~10-15% COMPACT SIDEBAR): THÔNG TIN THANH TOÁN ── */}
            <div className="lg:col-span-3 space-y-4">
              <DraftOrderPaymentSummary
                subtotalAmount={subtotalAmount}
                totalDiscount={totalDiscount}
                finalAmount={finalAmount}
                totalPaidAmount={totalPaidAmount}
                paymentOption={paymentOption}
                setPaymentOption={setPaymentOption}
                paymentMethod={paymentMethod}
                setPaymentMethod={setPaymentMethod}
                onSubmit={handleSaveOrder}
                onCreateLandingPage={handleCreateLandingPage}
                onAddPaymentMore={() => setIsAddPaymentOpen(true)}
                onCancelRemaining={() => toast.info('Đã hủy phần nợ còn lại của đơn hàng!')}
                isEditing={!!existingOrder}
                orderNo={existingOrder?.orderNo || existingOrder?.id}
              />
            </div>
          </div>
        </div>
      </DialogContent>

      {/* Student Detail Profile Modal Call */}
      <StudentDetailDialog
        studentId={profileStudentId}
        open={!!profileStudentId}
        onOpenChange={(open) => !open && setProfileStudentId(null)}
      />

      {/* Add Additional Payment Record Modal Call */}
      <AddPaymentModalDialog
        open={isAddPaymentOpen}
        onOpenChange={setIsAddPaymentOpen}
        orderNo={existingOrder?.orderNo || 'OD793011'}
        remainingAmount={Math.max(0, finalAmount - totalPaidAmount)}
        onAddPayment={(amount, method, note) => {
          setTotalPaidAmount((prev) => prev + amount)
          toast.success(`Đã ghi nhận giao dịch thanh toán thêm ${formatCurrency(amount)} (${method}) thành công!`, {
            description: `Mã phiếu thu: ${note}`,
          })
        }}
      />
    </Dialog>
  )
}
