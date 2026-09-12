'use client'

import { useState, useEffect, useMemo, type FormEvent } from 'react'
import {
  X,
  User,
  Check,
  ExternalLink,
} from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import type { Lead } from '@/mocks/crmLeads'
import type { ParentItem, ChildItem, HistoricalSalesCycle } from './crmCustomerCreateTypes'
import { CrmCustomerParentSection } from './CrmCustomerParentSection'
import { CrmCustomerChildSection } from './CrmCustomerChildSection'

interface CrmCustomerCreateDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit?: (newLeads: Lead[]) => void
  initialLead?: Lead | null
  initialAction?: 'view' | 'add_parent' | 'add_child'
  totalOrdersCount?: number
  totalOrdersAmount?: string
}

export function CrmCustomerCreateDialog({
  open,
  onOpenChange,
  onSubmit,
  initialLead,
  initialAction = 'view',
  totalOrdersCount: propTotalOrdersCount,
  totalOrdersAmount: propTotalOrdersAmount,
}: CrmCustomerCreateDialogProps) {
  const effectiveOrdersCount = propTotalOrdersCount ?? initialLead?.ordersCount ?? 0
  const effectiveOrdersAmount = propTotalOrdersAmount ?? initialLead?.totalSpend ?? '0đ'

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

  // Cột 2: Danh sách Học viên (Con) kèm Định vị & Phân bổ theo từng bé
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

  const [validationError, setValidationError] = useState('')

  // Đồng bộ hóa State khi Dialog mở ra (Hỗ trợ mở mới, xem chi tiết, thêm phụ huynh, thêm con)
  useEffect(() => {
    if (!open) return

    if (initialLead) {
      // 1. Phụ huynh: Khởi tạo từ initialLead
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

      // Nếu action là add_parent: Đóng phụ huynh trước đó lại, mở ra phụ huynh mới
      if (initialAction === 'add_parent') {
        loadedParents.forEach((p) => {
          p.isCollapsed = true
        })
        loadedParents.push({
          id: `parent-new-${Date.now()}`,
          name: '',
          phone: '',
          email: '',
          role: 'Bố',
          secondaryPhone: '',
          isCollapsed: false,
        })
      }

      setParents(loadedParents)

      // 2. Học viên kèm Định vị & Phân bổ tác nghiệp: Khởi tạo từ initialLead
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

      if (pastSalesCycles.length === 0 && initialLead.isReturningLead) {
        pastSalesCycles.push({
          cycleId: 'cycle-old-1',
          cycleNumber: 1,
          title: 'Đợt 1 (Đợt tiếp cận trước đây)',
          status: 'converted',
          startDate: '05/10/2025',
          endDate: '20/01/2026',
          assignedSales: 'Lê Hoàng Nam (Sales)',
          branch: initialLead.branch || 'RinoEdu Linh Đàm',
          channel: initialLead.source || 'Facebook',
          productInterest: initialLead.targetSubject || 'Anh văn Nhi đồng (SuperKids)',
          outcomeNote: initialLead.returningReason || 'Cựu học viên hoàn thành đợt trước.',
          ordersCount: initialLead.ordersCount || 1,
          totalAmount: initialLead.totalSpend || '12.000.000đ',
        })
      }

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

      // Nếu action là add_child: Thêm bé mới
      if (initialAction === 'add_child') {
        loadedChildren.push({
          id: `child-new-${Date.now()}`,
          name: '',
          currentSchool: '',
          birthYear: '',
          age: '',
          academicPerformance: '',
          phone: '',
          course: '',
          vuihocAccount: '',
          customerType: initialLead.trainingType || 'Tự học',
          industryGroup: 'Tiểu học',
          selectedSources: ['Web Rinoedu'],
          selectedStaff: ['Trần Thị Mai'],
          marketingStaff: 'Nguyễn Thị Lan (Marketing)',
          selectedProductGroups: ['Tiếng Anh Thiếu Nhi'],
          customerCode: '',
          isCollapsed: false,
        })
      }

      setChildren(loadedChildren)

      // 3. Địa chỉ
      setProvince(initialLead.province || 'TP. Hồ Chí Minh')
      setDistrict(initialLead.district || 'Quận 1')
      setWard(initialLead.ward || 'Phường Bến Nghé')
      setAddressDetail(initialLead.streetAddress || initialLead.address || '')
      setMapCoordinates(initialLead.mapLink || '')
      setValidationError('')
    } else {
      // Khi tạo mới từ đầu (Create New Lead)
      setParents([
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
  }, [open, initialLead, initialAction])

  // Ghép chuỗi địa chỉ đầy đủ
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
      return
    }

    if (!mainParent.phone.trim()) {
      setValidationError('Vui lòng nhập số điện thoại của người liên hệ chính.')
      return
    }

    const validChildren = children.filter((c) => c.name.trim() !== '')
    if (validChildren.length === 0) {
      setValidationError('Vui lòng nhập thông tin của ít nhất 01 học viên (tên con).')
      return
    }

    setValidationError('')

    const siblingNames = validChildren.map((c) => c.name.trim())

    const otherParentsList = parents.slice(1).map((p) => ({
      name: p.name.trim() || 'Phụ huynh',
      phone: p.phone.trim(),
      role: p.role,
      email: p.email.trim(),
    }))

    const createdLeads: Lead[] = validChildren.map((child, index) => {
      const isInitialLead = initialLead && index === 0
      const generatedId = isInitialLead
        ? initialLead.id
        : `LEAD-${Date.now()}-${index + 1}`

      const finalCode = child.customerCode?.trim()
        ? (index === 0 ? child.customerCode.trim() : `${child.customerCode.trim()}-${index + 1}`)
        : (isInitialLead ? initialLead.code : `KH-${Math.floor(100000 + Math.random() * 900000)}`)

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
        lastNote: base.lastNote || [
          child.currentSchool ? `Trường đang học: ${child.currentSchool}.` : '',
          child.selectedProductGroups?.length ? `Nhóm SP: ${child.selectedProductGroups.join(', ')}.` : '',
          child.marketingStaff ? `Phụ trách MKT: ${child.marketingStaff}.` : '',
          `Kênh tiếp nhận: ${child.selectedSources?.join(', ') || 'Web'}.`,
        ].filter(Boolean).join(' '),
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

  return (
    <Dialog open={open} onOpenChange={(val) => (!val ? handleResetForm() : onOpenChange(true))}>
      <DialogContent
        className="w-[95vw] sm:max-w-[1200px] max-w-[1200px] max-h-[94vh] overflow-y-auto !bg-[#f1f5f9] dark:!bg-zinc-950 p-0 border-border shadow-2xl rounded-xl gap-0 opacity-100"
        style={{ maxWidth: '1200px', width: '95vw', backgroundColor: '#f1f5f9' }}
      >
        {/* Header Tinh Gọn */}
        <DialogHeader className="sticky top-0 z-30 flex flex-row items-center justify-between px-4 py-2.5 bg-white dark:bg-zinc-900 border-b border-border shadow-2xs">
          <div className="flex items-center gap-2">
            <div className="flex h-6.5 w-6.5 items-center justify-center rounded-md bg-blue-500/10 text-blue-600 dark:bg-blue-500/20">
              <User className="h-3.5 w-3.5" />
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-xs text-muted-foreground">Khách hàng &gt;</span>
              <DialogTitle className="text-sm font-semibold text-foreground">
                {initialLead ? 'Thông tin chi tiết khách hàng' : 'Tạo khách hàng mới'}
              </DialogTitle>
            </div>

            {/* Icon mở toàn màn hình chi tiết chuyên sâu */}
            <button
              type="button"
              onClick={handleOpenFullDetail}
              className="flex items-center gap-1 px-2 py-0.5 rounded text-xs text-primary hover:bg-primary/10 transition-colors ml-2 cursor-pointer border border-primary/20"
              title="Mở toàn màn hình chi tiết khách hàng"
            >
              <ExternalLink className="h-3 w-3" />
              <span>Xem chi tiết hồ sơ</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
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

        {/* Thông báo lỗi validation */}
        {validationError && (
          <div className="mx-4 mt-2 p-2.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium animate-in fade-in">
            ⚠️ {validationError}
          </div>
        )}

        {/* Body 2 Cột Cân Đối: Cột Trái (Phụ huynh ~42%) + Cột Phải (Học viên & Định vị tác nghiệp ~58%) */}
        <form onSubmit={handleSubmit} className="p-3 space-y-3 bg-[#f1f5f9] dark:bg-zinc-950">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 items-start">
            {/* CỘT 1: PHỤ HUYNH & ĐỊA CHỈ MAP (5/12 CỘT) */}
            <div className="lg:col-span-5">
              <CrmCustomerParentSection
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
              />
            </div>

            {/* CỘT 2: HỌC VIÊN & ĐỊNH VỊ PHÂN BỔ (7/12 CỘT) */}
            <div className="lg:col-span-7">
              <CrmCustomerChildSection
                childList={children}
                setChildren={setChildren}
                totalOrdersCount={effectiveOrdersCount}
                totalOrdersAmount={effectiveOrdersAmount}
              />
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
