import type { SimulatedPackage, CSStaffMember } from '../studentCareDetailTypes'
import type { StudentCareAlert } from '@/mocks/careAlerts'
import type { Student } from '@/mocks/students'
import type { ClassRecord } from '@/mocks/classRecords'
import type { PersonnelItem } from '@/components/shared'

export type StudentPlacementStatus =
  | 'pending_payment'      // Chờ thanh toán
  | 'draft_class'          // Lớp nháp
  | 'wait_for_assignment'  // Chờ xếp lớp
  | 'enroll_later'         // Xếp lớp sau
  | 'pending_transfer'     // Chờ chuyển lớp
  | 'fee_transfer'         // Chuyển phí
  | 'awaiting_opening'     // Chờ khai giảng
  | 'trial'                // Học thử
  | 'active'               // Đang học
  | 'reserve'              // Bảo lưu
  | 'session_ended'        // Hết buổi

export interface StudentCareActiveClassCardProps {
  pkg: SimulatedPackage
  visiblePackages: SimulatedPackage[]
  selectedPackageId: string
  setSelectedPackageId: (id: string) => void
  currentBranchName: string
  pkgIsEnglish: boolean
  student?: StudentCareAlert | null
  onOpenLeaveReserveDialog?: () => void
  onOpenEarlyReturnDialog?: () => void
  onCreateLeaveReserve?: (type: 'off' | 'reservation') => void
  assignedCS?: string
  onAssignedCSChange?: (csName: string) => void
  staffInfo?: {
    cs: {
      id: string
      name: string
      role: string
      phone?: string
      email?: string
      avatar: string
    }
    teachers: Array<{
      id: string
      name: string
      role: string
      phone?: string
      email?: string
      avatar: string
    }>
  }
  isRenewal?: boolean
}

export interface StudentCareClassStatusBannerProps {
  placementStatus: StudentPlacementStatus
  student?: StudentCareAlert | null
  mockStudent?: Student | null
  pkg: SimulatedPackage
  pkgIsEnglish: boolean
  classCode: string
  assignedTargetClass: string | null
  isHoldingClass: boolean
  onOpenLeaveReserveDialog?: () => void
  onOpenEarlyReturnDialog?: () => void
  onOpenPlacementTab: () => void
}

export interface StudentCareClassActionMenuProps {
  placementStatus: StudentPlacementStatus
  onOpenPlacementTab: () => void
  onCreateLeaveReserve?: (type: 'off' | 'reservation') => void
  onOpenEarlyReturnDialog?: () => void
  onOpenLeaveReserveDialog?: () => void
}

export interface StudentCareClassExpandedInfoProps {
  currentBranchName: string
  attendedSessions: number
  totalSessions: number
  startDateDisplay: string
  endDateDisplay: string
  pkg: SimulatedPackage
  pkgIsEnglish: boolean
  classRecordForHover: ClassRecord
  csPersonnelItem: PersonnelItem
  currentCSObj: CSStaffMember
  effectiveCSName: string
  filteredCsList: CSStaffMember[]
  csSearchQuery: string
  setCsSearchQuery: (query: string) => void
  isCsPopoverOpen: boolean
  setIsCsPopoverOpen: (open: boolean) => void
  handleSelectCS: (staff: CSStaffMember) => void
  classTeachers: Array<{
    id: string
    name: string
    role: string
    phone?: string
    email?: string
    avatar: string
  }>
  isRenewal?: boolean
}
