export type PackageOperationalStatus =
  | 'active' // Đang học
  | 'pending_placement' // Chờ xếp lớp
  | 'reserved' // Đang bảo lưu
  | 'expired' // Hết buổi / Hoàn thành
  | 'transferred' // Đã chuyển đổi / chuyển phí

export interface StudentEnrolledPackage {
  id: string // "pkg-1" | "pkg-2" | "pkg-3"
  packageCode: string // e.g. "PKG-800436-01"
  packageName: string // e.g. "[IE_TUTOR] Ielts Intermediate PLUS 5.0_40 buổi"
  programName: string // e.g. "Tiếng Anh" | "Toán tư duy"
  subject: string // e.g. "Tiếng Anh" | "Toán tư duy"
  level?: string // e.g. "Intermediate PLUS 5.0"
  studentId: string
  studentName: string

  // Linked Order (Key connection)
  linkedOrderNo?: string // e.g. "OD800436"
  linkedOrderId?: string
  purchaseDate?: string // e.g. "25/07/2026"
  saleRep?: string // e.g. "Vũ Thị Lan 1"
  orderType?: string // e.g. "Gia hạn" | "Mua mới"

  // Session Progress
  totalSessions: number // e.g. 46
  purchasedSessions: number // e.g. 40
  bonusSessions?: number // e.g. 6
  attendedSessions: number // e.g. 34
  remainingSessions: number // e.g. 12
  leaveSessions?: number // e.g. 2
  bonusText?: string // e.g. "Tặng thêm 6 buổi học"

  // Class & Schedule
  classCode?: string // e.g. "LD_ANH_00201"
  className?: string // e.g. "Lớp Tiếng Anh SuperKids B2"
  schedule?: string // e.g. "T4 (18:00 - 19:30) • T7 (09:00 - 10:30)"
  branchName?: string // e.g. "RinoEdu Nguyễn Tuân"
  primaryTeacher?: {
    name: string
    role: string
    avatar?: string
  }
  assistantTeacher?: {
    name: string
    role: string
    avatar?: string
  }
  csStaff?: string // e.g. "Minh Phương (CSM)"

  // Validity Dates
  startDate?: string // e.g. "25/07/2026"
  expectedEndDate?: string // e.g. "16/10/2026"
  expiryDate?: string // e.g. "25/07/2027"

  // Status
  status: PackageOperationalStatus
  statusLabel?: string
  isCurrentPackage?: boolean
}

export interface StudentPackagesTabProps {
  studentId: string
  studentName: string
  selectedPackageId?: string
  onSelectPackageId?: (packageId: string) => void
  onNavigateToOrder?: (orderNo: string) => void
  onOpenLeaveReserve?: () => void
  onRenewalClick?: (pkg: StudentEnrolledPackage) => void
}
