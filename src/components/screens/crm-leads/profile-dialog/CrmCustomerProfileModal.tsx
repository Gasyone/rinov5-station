/* eslint-disable react-hooks/set-state-in-effect */
'use client'

import React, { useState, useEffect, useMemo, type FormEvent } from 'react'
import {
  X,
  User,
  Check,
  ExternalLink,
  Users,
  Compass,
  ShoppingCart,
  Receipt,
  Truck,
  FileText,
} from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import type { Lead } from '@/mocks/crmLeads'
import type { ParentItem, ChildItem, HistoricalSalesCycle } from '../crmCustomerCreateTypes'
import type {
  CustomerProfileTabKey,
  CustomerProfileParent,
} from './crmCustomerProfileTypes'
import {
  extractCustomerParents,
  extractCustomerLeadOccurrences,
  extractCustomerOrders,
  extractCustomerPayments,
  extractCustomerDeliveries,
} from './crmCustomerProfileHelpers'

// Tabs
import { CrmCustomerGeneralTab } from './tabs/CrmCustomerGeneralTab'
import { CrmCustomerParentsTab } from './tabs/CrmCustomerParentsTab'
import { CrmCustomerLeadsTab } from './tabs/CrmCustomerLeadsTab'
import { CrmCustomerOrdersTab } from './tabs/CrmCustomerOrdersTab'
import { CrmCustomerPaymentsTab } from './tabs/CrmCustomerPaymentsTab'
import { CrmCustomerDeliveriesTab } from './tabs/CrmCustomerDeliveriesTab'

export interface CrmCustomerProfileModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit?: (newLeads: Lead[]) => void
  initialLead?: Lead | null
  initialAction?: 'view' | 'add_parent' | 'add_child'
  initialTab?: CustomerProfileTabKey
  totalOrdersCount?: number
  totalOrdersAmount?: string
}

export function CrmCustomerProfileModal({
  open,
  onOpenChange,
  onSubmit,
  initialLead,
  initialAction = 'view',
  initialTab = 'general',
  totalOrdersCount: propTotalOrdersCount,
  totalOrdersAmount: propTotalOrdersAmount,
}: CrmCustomerProfileModalProps) {
  const [activeTab, setActiveTab] = useState<CustomerProfileTabKey>(initialTab)

  // Cột 1: Danh sách Phụ huynh & Địa chỉ
  const [parents, setParents] = useState<ParentItem[]>([
    {
      id: 'parent-1',
      name: '',
      phone: '',
      email: '',
      role: 'Mẹ',
      secondaryPhone: '',
      isCollapsed: false,
    },
  ])
  const [province, setProvince] = useState('TP. Hồ Chí Minh')
  const [district, setDistrict] = useState('Quận 1')
  const [ward, setWard] = useState('Phường Bến Nghé')
  const [addressDetail, setAddressDetail] = useState('')
  const [mapCoordinates, setMapCoordinates] = useState('')

  // Cột 2: Danh sách Học viên
  const [children, setChildren] = useState<ChildItem[]>([
    {
      id: 'child-1',
      name: '',
      currentSchool: '',
      birthYear: '',
      age: '',
      academicPerformance: '',
      phone: '',
      course: '',
      vuihocAccount: '',
      customerType: 'Tự học',
      industryGroup: 'Tiểu học',
      selectedSources: ['Web Rinoedu'],
      selectedStaff: ['Trần Thị Mai'],
      marketingStaff: 'Nguyễn Thị Lan (Marketing)',
      selectedProductGroups: ['Tiếng Anh Thiếu Nhi'],
      customerCode: '',
      isCollapsed: false,
    },
  ])

  // Profile Parents mở rộng (Chân dung chuyên sâu nhiều phụ huynh như Ảnh 2)
  const [detailedParents, setDetailedParents] = useState<CustomerProfileParent[]>([])

  const [validationError, setValidationError] = useState('')

  // Đồng bộ hóa State khi Dialog mở ra
  useEffect(() => {
    if (!open) return

    setActiveTab(initialAction === 'add_parent' ? 'parents' : initialTab)

    if (initialLead) {
      // 1. Phụ huynh cơ bản
      const loadedParents: ParentItem[] = [
        {
          id: `parent-${initialLead.id}`,
          name: initialLead.parentName || '',
          phone: initialLead.phone || '',
          email: initialLead.email || '',
          role: initialLead.parentRole || 'Mẹ',
          secondaryPhone: '',
          isCollapsed: initialAction === 'add_parent' ? true : Boolean(initialLead.parentName),
        },
      ]

      if (initialLead.otherParents && initialLead.otherParents.length > 0) {
        initialLead.otherParents.forEach((op, idx) => {
          loadedParents.push({
            id: `parent-other-${idx}-${initialLead.id}`,
            name: op.name || '',
            phone: op.phone || '',
            email: op.email || '',
            role: op.role || 'Bố',
            secondaryPhone: '',
            isCollapsed: true,
          })
        })
      }

      setParents(loadedParents)
      setDetailedParents(extractCustomerParents(initialLead, loadedParents))

      // 2. Học viên
      const pastSalesCycles: HistoricalSalesCycle[] = (initialLead.salesCycles || [])
        .filter((c) => c.status !== 'active')
        .map((c) => ({
          cycleId: c.cycleId,
          cycleNumber: c.cycleNumber,
          title: c.title.replace(/chu kỳ/gi, 'Đợt'),
          status: c.status,
          startDate: c.startDate,
          endDate: c.endDate,
          assignedSales: c.assignedSales,
          branch: initialLead.branch || 'RinoEdu Linh Đàm',
          channel: initialLead.source || 'Facebook',
          productInterest: initialLead.targetSubject || 'Anh văn Nhi đồng (SuperKids)',
          outcomeNote: c.outcomeNote,
          ordersCount: initialLead.ordersCount || 1,
          totalAmount: initialLead.totalSpend || '12.000.000đ',
        }))

      const loadedChildren: ChildItem[] = [
        {
          id: `child-${initialLead.id}`,
          name: initialLead.studentName || '',
          currentSchool: initialLead.schoolName || '',
          birthYear: initialLead.birthYear ? String(initialLead.birthYear) : '',
          age: initialLead.studentAge ? String(initialLead.studentAge) : '',
          academicPerformance: initialLead.academicAbility || '',
          phone: initialLead.studentPhone || '',
          course: initialLead.targetSubject || '',
          vuihocAccount: initialLead.vuihocAccount || '',
          customerType: initialLead.trainingType || 'Tự học',
          industryGroup: initialLead.industryGroup || 'Tiểu học',
          selectedSources: initialLead.source ? [initialLead.source] : ['Web Rinoedu'],
          selectedStaff: initialLead.assignedTo ? [initialLead.assignedTo] : ['Trần Thị Mai'],
          marketingStaff: initialLead.marketingStaff || 'Nguyễn Thị Lan (Marketing)',
          selectedProductGroups: initialLead.productGroup ? [initialLead.productGroup] : ['Tiếng Anh Thiếu Nhi'],
          customerCode: initialLead.code || '',
          isCollapsed: initialAction === 'add_child',
          isReturningLead: Boolean(initialLead.isReturningLead),
          returningReason: initialLead.returningReason || '',
          pastCycles: pastSalesCycles,
        },
      ]

      setChildren(loadedChildren)

      // 3. Địa chỉ
      setProvince(initialLead.province || 'TP. Hồ Chí Minh')
      setDistrict(initialLead.district || 'Quận 1')
      setWard(initialLead.ward || 'Phường Bến Nghé')
      setAddressDetail(initialLead.streetAddress || initialLead.address || '')
      setMapCoordinates(initialLead.mapLink || '')
      setValidationError('')
    } else {
      // Khi tạo mới
      const defaultParents: ParentItem[] = [
        {
          id: 'parent-1',
          name: '',
          phone: '',
          email: '',
          role: 'Mẹ',
          secondaryPhone: '',
          isCollapsed: false,
        },
      ]
      setParents(defaultParents)
      setDetailedParents(extractCustomerParents(null, defaultParents))
      setChildren([
        {
          id: 'child-1',
          name: '',
          currentSchool: '',
          birthYear: '',
          age: '',
          academicPerformance: '',
          phone: '',
          course: '',
          vuihocAccount: '',
          customerType: 'Tự học',
          industryGroup: 'Tiểu học',
          selectedSources: ['Web Rinoedu'],
          selectedStaff: ['Trần Thị Mai'],
          marketingStaff: 'Nguyễn Thị Lan (Marketing)',
          selectedProductGroups: ['Tiếng Anh Thiếu Nhi'],
          customerCode: '',
          isCollapsed: false,
        },
      ])
      setProvince('TP. Hồ Chí Minh')
      setDistrict('Quận 1')
      setWard('Phường Bến Nghé')
      setAddressDetail('')
      setMapCoordinates('')
      setValidationError('')
    }
  }, [open, initialLead, initialAction, initialTab])

  // Extract orders, payments, deliveries, lead occurrences
  const leadOccurrences = useMemo(
    () => extractCustomerLeadOccurrences(initialLead || null),
    [initialLead]
  )
  const orders = useMemo(() => extractCustomerOrders(initialLead || null), [initialLead])
  const payments = useMemo(
    () => extractCustomerPayments(initialLead || null, orders),
    [initialLead, orders]
  )
  const deliveries = useMemo(
    () => extractCustomerDeliveries(initialLead || null, orders),
    [initialLead, orders]
  )

  const effectiveOrdersCount = propTotalOrdersCount ?? initialLead?.ordersCount ?? orders.length
  const effectiveOrdersAmount =
    propTotalOrdersAmount ?? initialLead?.totalSpend ?? (orders[0]?.finalAmount ? `${orders[0].finalAmount.toLocaleString('vi-VN')}đ` : '0đ')

  const fullAddressSearchQuery = useMemo(() => {
    return [addressDetail, ward, district, province].filter(Boolean).join(', ')
  }, [addressDetail, ward, district, province])

  const handleResetForm = () => {
    setValidationError('')
    onOpenChange(false)
  }

  const handleOpenFullDetail = () => {
    window.open('/app/contact_directory', '_blank')
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()

    const mainParent = parents[0]
    if (!mainParent?.name.trim()) {
      setValidationError('Vui lòng nhập họ và tên của phụ huynh liên hệ chính.')
      setActiveTab('general')
      return
    }

    if (!mainParent.phone.trim()) {
      setValidationError('Vui lòng nhập số điện thoại của người liên hệ chính.')
      setActiveTab('general')
      return
    }

    const validChildren = children.filter((c) => c.name.trim() !== '')
    if (validChildren.length === 0) {
      setValidationError('Vui lòng nhập thông tin của ít nhất 01 học viên (tên con).')
      setActiveTab('general')
      return
    }

    setValidationError('')

    const siblingNames = validChildren.map((c) => c.name.trim())

    const otherParentsList = detailedParents.slice(1).map((p) => ({
      name: p.name.trim() || 'Phụ huynh',
      phone: p.phone.trim(),
      role: p.role,
      email: p.email?.trim() || '',
      occupation: p.occupation,
      financialSegment: p.financialSegment,
      budgetPerMonth: p.budgetPerMonth,
      decisionMakerRole: p.decisionMakerRole,
      preferredChannel: p.preferredChannel,
      bestTimeToCall: p.bestTimeToCall,
      zaloStatus: p.zaloStatus,
      parentExpectation: p.parentExpectation,
      parentPainPoint: p.parentPainPoint,
      parentPersonalityNote: p.parentPersonalityNote,
      address: p.address,
    }))

    const createdLeads: Lead[] = validChildren.map((child, index) => {
      const isInitialLead = initialLead && index === 0
      const generatedId = isInitialLead
        ? initialLead.id
        : `LEAD-${Date.now()}-${index + 1}`

      const finalCode = child.customerCode?.trim()
        ? index === 0
          ? child.customerCode.trim()
          : `${child.customerCode.trim()}-${index + 1}`
        : isInitialLead
        ? initialLead.code
        : `KH-${Math.floor(100000 + Math.random() * 900000)}`

      const calculatedBirthYear = child.birthYear ? parseInt(child.birthYear, 10) : 2018
      const calculatedAge = child.age ? parseInt(child.age, 10) || 8 : 8
      const base: Partial<Lead> = isInitialLead ? initialLead : {}

      return {
        ...base,
        id: generatedId,
        code: finalCode,
        studentName: child.name.trim(),
        studentAge: calculatedAge,
        birthYear: calculatedBirthYear,
        schoolName: child.currentSchool.trim() || base.schoolName,
        targetSubject: child.course || 'Tiếng Anh Thiếu Nhi',
        academicAbility: child.academicPerformance || base.academicAbility,
        studentPhone: child.phone.trim() || base.studentPhone,
        vuihocAccount: child.vuihocAccount.trim() || base.vuihocAccount,
        parentId: base.parentId || `P-${Date.now()}`,
        parentName: mainParent.name.trim(),
        parentRole: mainParent.role,
        phone: mainParent.phone.trim(),
        email: mainParent.email.trim() || 'khachhang@rinoedu.vn',
        province,
        district,
        ward,
        streetAddress: addressDetail,
        address: fullAddressSearchQuery || 'TP. Hồ Chí Minh',
        mapLink: mapCoordinates,
        familySiblings: siblingNames,
        otherParents: otherParentsList,
        trainingType: child.customerType || 'Tự học',
        industryGroup: child.industryGroup || 'Tiểu học',
        productGroup: child.selectedProductGroups?.join(', ') || 'Tiếng Anh Thiếu Nhi',
        marketingStaff: child.marketingStaff || 'Nguyễn Thị Lan (Marketing)',
        source: (child.selectedSources?.[0]?.toLowerCase().includes('facebook')
          ? 'facebook'
          : child.selectedSources?.[0]?.toLowerCase().includes('hotline')
          ? 'hotline'
          : child.selectedSources?.[0]?.toLowerCase().includes('event')
          ? 'event'
          : child.selectedSources?.[0]?.toLowerCase().includes('referral')
          ? 'referral'
          : 'website') as Lead['source'],
        status: base.status || 'chua_tiep_can',
        assignedTo: child.selectedStaff?.join(', ') || 'Chưa phân bổ',
        branch: base.branch || 'RinoEdu Linh Đàm',
        createdAt: base.createdAt || new Date().toISOString().slice(0, 10),
        lastNote:
          base.lastNote ||
          [
            child.currentSchool ? `Trường đang học: ${child.currentSchool}.` : '',
            child.selectedProductGroups?.length
              ? `Nhóm SP: ${child.selectedProductGroups.join(', ')}.`
              : '',
            child.marketingStaff ? `Phụ trách MKT: ${child.marketingStaff}.` : '',
            `Kênh tiếp nhận: ${child.selectedSources?.join(', ') || 'Web'}.`,
          ]
            .filter(Boolean)
            .join(' '),
        expectedPackage: base.expectedPackage || `Gói ${child.course || 'Tiếng Anh'} 6T`,
        expectedAmount: base.expectedAmount || '15.000.000đ',
        winProbability: base.winProbability || 40,
      } as Lead
    })

    if (onSubmit) {
      onSubmit(createdLeads)
    }

    onOpenChange(false)
  }

  const headerTitle = initialLead
    ? `Hồ sơ Khách hàng: ${initialLead.parentName || initialLead.studentName} • ${initialLead.code}`
    : 'Tạo khách hàng mới'

  return (
    <Dialog open={open} onOpenChange={(val) => (!val ? handleResetForm() : onOpenChange(true))}>
      <DialogContent
        className="w-[96vw] sm:max-w-[1240px] max-w-[1240px] max-h-[94vh] flex flex-col p-0 border-border shadow-2xl rounded-xl gap-0 overflow-hidden bg-[#f8fafc] dark:bg-zinc-950"
        style={{ maxWidth: '1240px', width: '96vw' }}
      >
        {/* ============================================================ */}
        {/* 1. HEADER DIALOG                                             */}
        {/* ============================================================ */}
        <DialogHeader className="sticky top-0 z-30 flex flex-row items-center justify-between px-4 py-2.5 bg-white dark:bg-zinc-900 border-b border-border shadow-2xs">
          <div className="flex items-center gap-2 min-w-0">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-sky-500/10 text-sky-600 dark:bg-sky-500/20 shrink-0">
              <User className="h-4 w-4" />
            </div>
            <div className="flex items-center gap-1.5 min-w-0">
              <span className="text-xs text-muted-foreground shrink-0">Khách hàng &gt;</span>
              <DialogTitle className="text-sm font-bold text-foreground truncate">
                {headerTitle}
              </DialogTitle>
            </div>

            <button
              type="button"
              onClick={handleOpenFullDetail}
              className="hidden sm:flex items-center gap-1 px-2 py-0.5 rounded text-xs text-primary hover:bg-primary/10 transition-colors ml-2 cursor-pointer border border-primary/20 shrink-0"
              title="Mở toàn màn hình chi tiết danh bạ"
            >
              <ExternalLink className="h-3 w-3" />
              <span>Xem chi tiết hồ sơ</span>
            </button>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="h-7.5 px-3 text-xs font-medium text-rose-600 border-rose-200 hover:bg-rose-50 dark:hover:bg-rose-950/30 cursor-pointer"
              onClick={handleResetForm}
            >
              <X className="mr-1 h-3 w-3" />
              <span>Huỷ Bỏ</span>
            </Button>
            <Button
              type="button"
              size="sm"
              className="h-7.5 px-4 text-xs font-medium bg-emerald-600 hover:bg-emerald-700 text-white shadow-2xs cursor-pointer"
              onClick={handleSubmit}
            >
              <Check className="mr-1 h-3 w-3" />
              <span>Lưu Khách Hàng</span>
            </Button>
          </div>
        </DialogHeader>

        {/* ============================================================ */}
        {/* 2. THANH TAB BAR NẰM NGANG VỚI BADGES SỐ LƯỢNG               */}
        {/* ============================================================ */}
        <div className="bg-white dark:bg-zinc-900 border-b border-border/80 px-4 py-1 flex items-center gap-1 overflow-x-auto select-none shrink-0 scrollbar-none">
          {/* Tab 1: Thông tin chung & Học viên */}
          <button
            type="button"
            onClick={() => setActiveTab('general')}
            className={cn(
              'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer whitespace-nowrap',
              activeTab === 'general'
                ? 'bg-sky-50 dark:bg-sky-950/60 text-sky-700 dark:text-sky-300 font-bold shadow-2xs border border-sky-200 dark:border-sky-800'
                : 'text-muted-foreground hover:text-foreground hover:bg-muted/60'
            )}
          >
            <FileText className="h-3.5 w-3.5" />
            <span>Thông tin chung &amp; Học viên</span>
            {children.length > 0 && (
              <Badge variant="secondary" className="h-4 px-1 text-[10px] font-bold rounded-full ml-0.5">
                {children.length}
              </Badge>
            )}
          </button>

          {/* Tab 2: Thông tin Phụ huynh */}
          <button
            type="button"
            onClick={() => setActiveTab('parents')}
            className={cn(
              'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer whitespace-nowrap',
              activeTab === 'parents'
                ? 'bg-sky-50 dark:bg-sky-950/60 text-sky-700 dark:text-sky-300 font-bold shadow-2xs border border-sky-200 dark:border-sky-800'
                : 'text-muted-foreground hover:text-foreground hover:bg-muted/60'
            )}
          >
            <Users className="h-3.5 w-3.5" />
            <span>Thông tin Phụ huynh</span>
            {detailedParents.length > 0 && (
              <Badge variant="secondary" className="h-4 px-1 text-[10px] font-bold rounded-full ml-0.5">
                {detailedParents.length}
              </Badge>
            )}
          </button>

          {/* Tab 3: Lịch sử Lead & Các lần Lead */}
          <button
            type="button"
            onClick={() => setActiveTab('leads')}
            className={cn(
              'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer whitespace-nowrap',
              activeTab === 'leads'
                ? 'bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 font-bold shadow-2xs border border-purple-200 dark:border-purple-800'
                : 'text-muted-foreground hover:text-foreground hover:bg-muted/60'
            )}
          >
            <Compass className="h-3.5 w-3.5 text-purple-600" />
            <span>Lịch sử Lead ({leadOccurrences.length})</span>
          </button>

          {/* Tab 4: Đơn hàng & Lịch sử Đơn hàng */}
          <button
            type="button"
            onClick={() => setActiveTab('orders')}
            className={cn(
              'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer whitespace-nowrap',
              activeTab === 'orders'
                ? 'bg-amber-50 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 font-bold shadow-2xs border border-amber-200 dark:border-amber-800'
                : 'text-muted-foreground hover:text-foreground hover:bg-muted/60'
            )}
          >
            <ShoppingCart className="h-3.5 w-3.5 text-amber-600" />
            <span>Đơn hàng</span>
            {orders.length > 0 && (
              <Badge className="h-4 px-1 text-[10px] font-bold rounded-full bg-amber-100 text-amber-800 dark:bg-amber-950 border-0 ml-0.5">
                {orders.length}
              </Badge>
            )}
          </button>

          {/* Tab 5: Thanh toán */}
          <button
            type="button"
            onClick={() => setActiveTab('payments')}
            className={cn(
              'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer whitespace-nowrap',
              activeTab === 'payments'
                ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 font-bold shadow-2xs border border-emerald-200 dark:border-emerald-800'
                : 'text-muted-foreground hover:text-foreground hover:bg-muted/60'
            )}
          >
            <Receipt className="h-3.5 w-3.5 text-emerald-600" />
            <span>Thanh toán</span>
            {payments.length > 0 && (
              <Badge className="h-4 px-1 text-[10px] font-bold rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 border-0 ml-0.5">
                {payments.length}
              </Badge>
            )}
          </button>

          {/* Tab 6: Giao hàng */}
          <button
            type="button"
            onClick={() => setActiveTab('deliveries')}
            className={cn(
              'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer whitespace-nowrap',
              activeTab === 'deliveries'
                ? 'bg-sky-50 dark:bg-sky-950/60 text-sky-800 dark:text-sky-300 font-bold shadow-2xs border border-sky-200 dark:border-sky-800'
                : 'text-muted-foreground hover:text-foreground hover:bg-muted/60'
            )}
          >
            <Truck className="h-3.5 w-3.5 text-sky-600" />
            <span>Giao hàng</span>
            {deliveries.length > 0 && (
              <Badge className="h-4 px-1 text-[10px] font-bold rounded-full bg-sky-100 text-sky-800 dark:bg-sky-950 border-0 ml-0.5">
                {deliveries.length}
              </Badge>
            )}
          </button>
        </div>

        {/* Thông báo lỗi validation */}
        {validationError && (
          <div className="mx-4 mt-2 p-2.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium animate-in fade-in">
            ⚠️ {validationError}
          </div>
        )}

        {/* ============================================================ */}
        {/* 3. BODY DIALOG - CHỨA CÁC TAB NỘI DUNG                       */}
        {/* ============================================================ */}
        <div className="flex-1 min-h-0 overflow-y-auto p-3.5 bg-[#f8fafc] dark:bg-zinc-950">
          <form onSubmit={handleSubmit} className="space-y-3">
            {activeTab === 'general' && (
              <CrmCustomerGeneralTab
                parents={parents}
                setParents={setParents}
                province={province}
                setProvince={setProvince}
                district={district}
                setDistrict={setDistrict}
                ward={ward}
                setWard={setWard}
                addressDetail={addressDetail}
                setAddressDetail={setAddressDetail}
                mapCoordinates={mapCoordinates}
                setMapCoordinates={setMapCoordinates}
                childrenList={children}
                setChildrenList={setChildren}
                totalOrdersCount={effectiveOrdersCount}
                totalOrdersAmount={effectiveOrdersAmount}
              />
            )}

            {activeTab === 'parents' && (
              <CrmCustomerParentsTab
                parents={detailedParents}
                onUpdateParents={setDetailedParents}
                leadCode={initialLead?.code || 'LD-10291-A'}
                leadCreatedAt={initialLead?.createdAt || '2026-08-10'}
                siblingNames={children.map((c) => c.name).filter(Boolean)}
              />
            )}

            {activeTab === 'leads' && (
              <CrmCustomerLeadsTab occurrences={leadOccurrences} />
            )}

            {activeTab === 'orders' && (
              <CrmCustomerOrdersTab orders={orders} />
            )}

            {activeTab === 'payments' && (
              <CrmCustomerPaymentsTab payments={payments} />
            )}

            {activeTab === 'deliveries' && (
              <CrmCustomerDeliveriesTab deliveries={deliveries} />
            )}
          </form>
        </div>
      </DialogContent>
    </Dialog>
  )
}
