'use client'

import { useState, useMemo, type FormEvent } from 'react'
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
import type { ParentItem, ChildItem } from './crmCustomerCreateTypes'
import { CrmCustomerParentSection } from './CrmCustomerParentSection'
import { CrmCustomerChildSection } from './CrmCustomerChildSection'
import { CrmCustomerProfileSection } from './CrmCustomerProfileSection'

interface CrmCustomerCreateDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit?: (newLeads: Lead[]) => void
  initialLead?: Lead | null
  totalOrdersCount?: number
  totalOrdersAmount?: string
}

export function CrmCustomerCreateDialog({
  open,
  onOpenChange,
  onSubmit,
  initialLead,
  totalOrdersCount = 0,
  totalOrdersAmount = '0đ',
}: CrmCustomerCreateDialogProps) {
  // Cột 1: Danh sách Phụ huynh & Địa chỉ (Khởi tạo theo initialLead nếu có)
  const [parents, setParents] = useState<ParentItem[]>(() => [
    {
      id: initialLead ? `parent-${initialLead.id}` : 'parent-1',
      name: initialLead?.parentName || '',
      phone: initialLead?.phone || '',
      email: initialLead?.email || '',
      role: initialLead?.parentRole || 'Mẹ',
      secondaryPhone: '',
      isCollapsed: false,
    },
  ])
  const [province, setProvince] = useState('TP. Hồ Chí Minh')
  const [district, setDistrict] = useState('Quận 1')
  const [ward, setWard] = useState('Phường Bến Nghé')
  const [addressDetail, setAddressDetail] = useState(() => initialLead?.address || '')
  const [mapCoordinates, setMapCoordinates] = useState('')

  // Cột 2: Danh sách Học viên (Con)
  const [children, setChildren] = useState<ChildItem[]>(() => [
    {
      id: initialLead ? `child-${initialLead.id}` : 'child-1',
      name: initialLead?.studentName || '',
      currentSchool: '',
      birthYear: initialLead?.birthYear ? String(initialLead.birthYear) : '',
      age: initialLead?.studentAge ? String(initialLead.studentAge) : '',
      academicPerformance: '',
      phone: '',
      course: initialLead?.targetSubject || '',
      vuihocAccount: '',
      isCollapsed: false,
    },
  ])

  // Cột 3: Định vị & Phân bổ
  const [customerType, setCustomerType] = useState('Tự học')
  const [industryGroup, setIndustryGroup] = useState('Tiểu học')
  const [selectedSources, setSelectedSources] = useState<string[]>(() =>
    initialLead?.source ? [initialLead.source] : ['Web Rinoedu']
  )
  const [selectedStaff, setSelectedStaff] = useState<string[]>(() =>
    initialLead?.assignedTo ? [initialLead.assignedTo] : ['Trần Thị Mai']
  )
  const [marketingStaff, setMarketingStaff] = useState('Nguyễn Thị Lan (Marketing)')
  const [selectedProductGroups, setSelectedProductGroups] = useState<string[]>(['Tiếng Anh Thiếu Nhi'])
  const [customerCode, setCustomerCode] = useState(() => initialLead?.code || '')

  const [validationError, setValidationError] = useState('')

  const fullAddressSearchQuery = useMemo(() => {
    return [addressDetail, ward, district, province].filter(Boolean).join(', ')
  }, [addressDetail, ward, district, province])

  const handleResetForm = () => {
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
    setAddressDetail('')
    setMapCoordinates('')
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
        isCollapsed: false,
      },
    ])
    setCustomerType('Tự học')
    setIndustryGroup('Tiểu học')
    setSelectedSources(['Web Rinoedu'])
    setSelectedStaff(['Trần Thị Mai'])
    setMarketingStaff('Nguyễn Thị Lan (Marketing)')
    setSelectedProductGroups(['Tiếng Anh Thiếu Nhi'])
    setCustomerCode('')
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

    const createdLeads: Lead[] = validChildren.map((child, index) => {
      const generatedId = `LEAD-${Date.now()}-${index + 1}`
      const finalCode = customerCode.trim()
        ? `${customerCode.trim()}-${index + 1}`
        : `KH-${Math.floor(100000 + Math.random() * 900000)}`

      const calculatedBirthYear = child.birthYear ? parseInt(child.birthYear, 10) : 2018
      const calculatedAge = child.age ? parseInt(child.age, 10) || 8 : 8

      return {
        id: generatedId,
        code: finalCode,
        studentName: child.name.trim(),
        studentAge: calculatedAge,
        birthYear: calculatedBirthYear,
        targetSubject: child.course || 'Tiếng Anh Thiếu Nhi',
        parentId: `P-${Date.now()}`,
        parentName: mainParent.name.trim(),
        parentRole: mainParent.role,
        phone: mainParent.phone.trim(),
        address: fullAddressSearchQuery || 'TP. Hồ Chí Minh',
        email: mainParent.email.trim() || 'khachhang@rinoedu.vn',
        familySiblings: siblingNames,
        source: (selectedSources[0]?.toLowerCase().includes('facebook')
          ? 'facebook'
          : selectedSources[0]?.toLowerCase().includes('hotline')
          ? 'hotline'
          : selectedSources[0]?.toLowerCase().includes('event')
          ? 'event'
          : selectedSources[0]?.toLowerCase().includes('referral')
          ? 'referral'
          : 'website') as Lead['source'],
        status: 'chua_tiep_can',
        assignedTo: selectedStaff.join(', ') || 'Chưa phân bổ',
        branch: 'Chi nhánh Quận 1',
        createdAt: new Date().toISOString().slice(0, 10),
        lastNote: [
          child.currentSchool ? `Trường đang học: ${child.currentSchool}.` : '',
          selectedProductGroups.length > 0 ? `Nhóm SP: ${selectedProductGroups.join(', ')}.` : '',
          marketingStaff ? `Phụ trách MKT: ${marketingStaff}.` : '',
          `Kênh tiếp nhận: ${selectedSources.join(', ') || 'Web'}.`,
        ].filter(Boolean).join(' '),
        expectedPackage: `Gói ${child.course || 'Tiếng Anh'} 6T`,
        expectedAmount: '15.000.000đ',
        winProbability: 40,
      }
    })

    if (onSubmit) {
      onSubmit(createdLeads)
    }

    handleResetForm()
  }

  return (
    <Dialog open={open} onOpenChange={(val) => (!val ? handleResetForm() : onOpenChange(true))}>
      <DialogContent
        className="w-[96vw] sm:max-w-[1380px] max-w-[1380px] max-h-[96vh] overflow-y-auto bg-slate-100 dark:bg-zinc-950 p-0 border-border shadow-2xl rounded-xl gap-0"
        style={{ maxWidth: '1380px', width: '96vw' }}
      >
        {/* Header Tinh Gọn - Khoảng cách tối thiểu */}
        <DialogHeader className="sticky top-0 z-30 flex flex-row items-center justify-between px-3.5 py-2 bg-white dark:bg-zinc-900 border-b border-border shadow-2xs">
          <div className="flex items-center gap-2">
            <div className="flex h-6.5 w-6.5 items-center justify-center rounded-md bg-pink-500/10 text-pink-600 dark:bg-pink-500/20">
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
              className="flex items-center gap-1 px-1.5 py-0.5 rounded text-xs text-primary hover:bg-primary/10 transition-colors ml-2 cursor-pointer border border-primary/20"
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
              className="h-7 px-2.5 text-xs font-medium text-rose-600 border-rose-200 hover:bg-rose-50 dark:hover:bg-rose-950/30 cursor-pointer"
              onClick={handleResetForm}
            >
              <X className="mr-1 h-3 w-3" />
              <span>Huỷ Bỏ</span>
            </Button>
            <Button
              type="button"
              size="sm"
              className="h-7 px-3.5 text-xs font-medium bg-emerald-600 hover:bg-emerald-700 text-white shadow-2xs cursor-pointer"
              onClick={handleSubmit}
            >
              <Check className="mr-1 h-3 w-3" />
              <span>Lưu Khách Hàng</span>
            </Button>
          </div>
        </DialogHeader>

        {/* Thông báo lỗi validation */}
        {validationError && (
          <div className="mx-3 mt-1.5 p-2 rounded-md bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium animate-in fade-in">
            ⚠️ {validationError}
          </div>
        )}

        {/* Body 3 Cột Rộng Rãi Đồng Mức */}
        <form onSubmit={handleSubmit} className="p-2.5 space-y-2">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-2.5 items-stretch">
            {/* CỘT 1: PHỤ HUYNH & ĐỊA CHỈ MAP */}
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

            {/* CỘT 2: THÔNG TIN HỌC VIÊN (CON) */}
            <CrmCustomerChildSection
              childList={children}
              setChildren={setChildren}
            />

            {/* CỘT 3: ĐỊNH VỊ & PHÂN BỔ */}
            <CrmCustomerProfileSection
              customerType={customerType}
              setCustomerType={setCustomerType}
              industryGroup={industryGroup}
              setIndustryGroup={setIndustryGroup}
              selectedSources={selectedSources}
              setSelectedSources={setSelectedSources}
              selectedStaff={selectedStaff}
              setSelectedStaff={setSelectedStaff}
              marketingStaff={marketingStaff}
              setMarketingStaff={setMarketingStaff}
              selectedProductGroups={selectedProductGroups}
              setSelectedProductGroups={setSelectedProductGroups}
              customerCode={customerCode}
              setCustomerCode={setCustomerCode}
              totalOrdersCount={totalOrdersCount}
              totalOrdersAmount={totalOrdersAmount}
            />
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
