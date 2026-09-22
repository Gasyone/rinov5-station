import { mockCareAlerts } from '@/mocks/careAlerts'
import { mockStudents } from '@/mocks/students'
import { getStudentOrders } from '../student-orders/studentOrdersTypes'
import { getProductSku } from '../renewal/renewalHelpers'
import type { StudentEnrolledPackage } from './studentPackagesTypes'

export function getStudentEnrolledPackages(
  studentId: string,
  studentName?: string
): StudentEnrolledPackage[] {
  const displayStudentName = studentName || 'Hà Phương'
  const studentAlert =
    mockCareAlerts.find((a) => a.studentId === studentId || a.id === studentId) ||
    mockCareAlerts.find((a) => a.studentName.toLowerCase() === displayStudentName.toLowerCase()) ||
    mockCareAlerts[0]

  const matchedStudent = mockStudents.find(
    (s) => s.id === studentId || s.name.toLowerCase() === displayStudentName.toLowerCase()
  )

  const isMath = studentAlert ? studentAlert.subject === 'Toán tư duy' : false
  const skuName = studentAlert ? getProductSku(studentAlert) : '[IE_TUTOR] Ielts Intermediate PLUS 5.0_40 buổi'
  const orders = getStudentOrders(studentId, displayStudentName)

  const currentOrder = orders.find((o) => o.isCurrentPackage) || orders[0]
  const currentOrderNo = currentOrder?.orderNo || 'OD800436'

  // ── 1. GÓI CHÍNH HIỆN TẠI (CHƯƠNG TRÌNH ĐANG HỌC) ─────────────────
  const pkg1Remaining = studentAlert?.remainingSessions ?? 12
  const pkg1Total = studentAlert?.totalSessions || 46
  const pkg1Attended = Math.max(0, pkg1Total - pkg1Remaining)

  const pkg1: StudentEnrolledPackage = {
    id: 'pkg-1',
    packageCode: `PKG-${currentOrderNo.replace(/\D/g, '') || '800436'}-01`,
    packageName: skuName,
    programName: isMath ? 'Toán tư duy' : 'Tiếng Anh',
    subject: isMath ? 'Toán tư duy' : 'Tiếng Anh',
    level: studentAlert?.level || (isMath ? 'Archimedes 1' : 'Intermediate PLUS 5.0'),
    studentId,
    studentName: displayStudentName,

    // Linked Order
    linkedOrderNo: currentOrderNo,
    linkedOrderId: currentOrder?.id,
    purchaseDate: currentOrder?.saleDate || '25/07/2026',
    saleRep: currentOrder?.saleRep || studentAlert?.csStaff || 'Vũ Thị Lan 1',
    orderType: currentOrder?.detailedItems?.[0]?.orderType || 'Gia hạn',

    // Session Progress
    totalSessions: pkg1Total,
    purchasedSessions: 40,
    bonusSessions: 6,
    attendedSessions: pkg1Attended,
    remainingSessions: pkg1Remaining,
    leaveSessions: 2,
    bonusText: 'Tặng thêm 6 buổi học & 1 x Khóa kỹ năng thuyết trình',

    // Class & Schedule
    classCode: studentAlert?.classCode || (isMath ? 'LD_TOAN_00088' : 'LD_ANH_00201'),
    className: isMath
      ? `Lớp Toán Tư Duy Archimedes G2 (${studentAlert?.classCode || 'LD_TOAN_00088'})`
      : `Lớp Tiếng Anh SuperKids B2 (${studentAlert?.classCode || 'LD_ANH_00201'})`,
    schedule: studentAlert?.schedule || 'T4 (18:00 - 19:30) • T7 (09:00 - 10:30)',
    branchName: matchedStudent?.branch || 'RinoEdu Nguyễn Tuân',
    primaryTeacher: {
      name: isMath ? 'Hoàng Thị Mai' : 'GV. Sarah Smith',
      role: isMath ? 'Giáo viên Toán tư duy' : 'Giáo viên Bản ngữ',
      avatar: `https://api.dicebear.com/7.x/adventurer/svg?seed=${isMath ? 'ThiMai' : 'Sarah'}`,
    },
    assistantTeacher: {
      name: 'Hoàng Anh',
      role: 'Trợ giảng (TA)',
      avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=HoangAnh',
    },
    csStaff: studentAlert?.csStaff || 'CSM Minh Phương',

    // Dates
    startDate: studentAlert?.startDate || '25/07/2026',
    expectedEndDate: studentAlert?.expectedEndDate || '16/10/2026',
    expiryDate: '25/07/2027',

    // Status
    status: studentAlert?.status === 'Bảo lưu' ? 'reserved' : !studentAlert?.classCode ? 'pending_placement' : 'active',
    statusLabel: studentAlert?.status === 'Bảo lưu' ? 'Đang bảo lưu' : !studentAlert?.classCode ? 'Chờ xếp lớp' : 'Đang học',
    isCurrentPackage: true,
  }

  // ── 2. GÓI CHƯƠNG TRÌNH KHÁC (SONG SONG) ──────────────────────────
  const secondOrder = orders.find((o) => o.orderNo === 'OD798202' || (!o.isCurrentPackage && !o.isExpired))
  const pkg2OrderNo = secondOrder?.orderNo || 'OD798202'

  const pkg2: StudentEnrolledPackage = {
    id: 'pkg-2',
    packageCode: `PKG-${pkg2OrderNo.replace(/\D/g, '') || '798202'}-01`,
    packageName: isMath
      ? '[IE_MOVERS] Tiếng Anh SuperKids Level 4_48 buổi'
      : '[MATH_ARCH] Toán Tư Duy Archimedes_48 buổi',
    programName: isMath ? 'Tiếng Anh' : 'Toán tư duy',
    subject: isMath ? 'Tiếng Anh' : 'Toán tư duy',
    level: isMath ? 'Level 4' : 'Archimedes 1',
    studentId,
    studentName: displayStudentName,

    linkedOrderNo: pkg2OrderNo,
    linkedOrderId: secondOrder?.id,
    purchaseDate: '10/01/2026',
    saleRep: 'Nguyễn Thu Trang',
    orderType: 'Mua mới',

    totalSessions: 48,
    purchasedSessions: 48,
    bonusSessions: 0,
    attendedSessions: 20,
    remainingSessions: 28,
    leaveSessions: 1,
    bonusText: '--',

    classCode: isMath ? 'LD_ANH_00201' : 'LD_TOAN_00088',
    className: isMath ? 'Lớp Tiếng Anh SuperKids B2' : 'Lớp Toán Tư Duy Archimedes G2',
    schedule: 'T3 (17:30 - 19:00) • T6 (17:30 - 19:00)',
    branchName: matchedStudent?.branch || 'RinoEdu Nguyễn Tuân',
    primaryTeacher: {
      name: isMath ? 'GV. Sarah Smith' : 'Phạm Thị Toán',
      role: isMath ? 'Giáo viên Bản ngữ' : 'Giáo viên Toán tư duy',
      avatar: `https://api.dicebear.com/7.x/adventurer/svg?seed=${isMath ? 'Sarah' : 'ThiToan'}`,
    },
    assistantTeacher: {
      name: 'Nguyễn Văn Minh',
      role: 'Trợ giảng (TA)',
      avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=VanMinh',
    },
    csStaff: 'CSM Thu Trang',

    startDate: '10/01/2026',
    expectedEndDate: '15/12/2026',
    expiryDate: '10/01/2027',

    status: 'active',
    statusLabel: 'Đang học',
    isCurrentPackage: true,
  }

  // ── 3. GÓI HỌC CŨ / LỊCH SỬ ĐÃ HẾT BUỔI ──────────────────────────
  const expiredOrder = orders.find((o) => o.isExpired || o.orderNo === 'OD790741')
  const pkg3OrderNo = expiredOrder?.orderNo || 'OD790741'

  const pkg3: StudentEnrolledPackage = {
    id: 'pkg-3',
    packageCode: `PKG-${pkg3OrderNo.replace(/\D/g, '') || '790741'}-01`,
    packageName: isMath
      ? '[MATH_PRE] Toán Einstein 0 Foundation_48 buổi'
      : '[IE_KID] Tiếng Anh Kindy 0 Foundation_48 buổi',
    programName: 'Lịch sử gói cũ',
    subject: isMath ? 'Toán tư duy' : 'Tiếng Anh',
    level: isMath ? 'Einstein 0' : 'Kindy 0',
    studentId,
    studentName: displayStudentName,

    linkedOrderNo: pkg3OrderNo,
    linkedOrderId: expiredOrder?.id,
    purchaseDate: '14/08/2024',
    saleRep: 'Nguyễn Văn Sale',
    orderType: 'Mua mới',

    totalSessions: 48,
    purchasedSessions: 48,
    bonusSessions: 0,
    attendedSessions: 48,
    remainingSessions: 0,
    leaveSessions: 3,
    bonusText: '--',

    classCode: isMath ? 'LD_TOAN_00008' : 'LD_ANH_00005',
    className: isMath ? 'Lớp Toán Einstein 0' : 'Lớp Tiếng Anh Kindy 0',
    schedule: 'T2 (17:30 - 19:00) • T5 (17:30 - 19:00)',
    branchName: matchedStudent?.branch || 'RinoEdu Nguyễn Tuân',
    primaryTeacher: {
      name: 'GV. Nguyễn Huy Hoàng',
      role: 'Giáo viên bộ môn',
      avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=HuyHoang',
    },
    csStaff: 'CSM Lan Anh',

    startDate: '14/08/2024',
    expectedEndDate: '14/08/2025',
    expiryDate: '14/08/2025',

    status: 'expired',
    statusLabel: 'Hết buổi',
    isCurrentPackage: false,
  }

  return [pkg1, pkg2, pkg3]
}
