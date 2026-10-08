import type { SimulatedPackage } from '../studentCareDetailTypes'
import type { StudentCareAlert } from '@/mocks/careAlerts'
import type { Student } from '@/mocks/students'
import type { StudentPlacementStatus } from './studentCareClassCardTypes'

/**
 * Xác định chính xác trạng thái xếp lớp / học tập của học viên
 * Đồng bộ 100% với danh mục 11 trạng thái của màn /app/class_placement
 */
export function resolveStudentPlacementStatus(
  student?: StudentCareAlert | null,
  mockStudent?: Student | null,
  pkg?: SimulatedPackage
): StudentPlacementStatus {
  // 1. Ưu tiên kiểm tra thông tin gói học cụ thể (SimulatedPackage) khi đang thao tác / hiển thị trên gói đó
  if (pkg) {
    // 1.1 Gói đã hết buổi hoặc hết hạn -> Luôn là session_ended
    if (
      pkg.status === 'expired' ||
      (pkg.remainingSessions !== undefined && pkg.remainingSessions <= 0)
    ) {
      return 'session_ended'
    }

    // 1.2 Gói có trạng thái học viên riêng (studentStatus)
    if (pkg.studentStatus) {
      switch (pkg.studentStatus) {
        case 'Chờ xếp lớp':
        case 'Chưa ghép lớp':
          return 'wait_for_assignment'
        case 'Chờ chuyển lớp':
          return 'pending_transfer'
        case 'Bảo lưu':
          return 'reserve'
        case 'Hết buổi':
          return 'session_ended'
        case 'Chờ khai giảng':
          return 'awaiting_opening'
        case 'Học thử':
          return 'trial'
        case 'Lớp nháp':
          return 'draft_class'
        case 'Xếp lớp sau':
          return 'enroll_later'
        case 'Chờ thanh toán':
          return 'pending_payment'
        case 'Chuyển phí':
          return 'fee_transfer'
        case 'Đang học':
          return 'active'
      }
    }

    // 1.3 Gói phụ chưa ghép lớp (không phải pkg-1 hoặc không có mã lớp)
    if (pkg.id && pkg.id !== 'pkg-1') {
      if (!pkg.classCode || pkg.classCode === '-' || pkg.status === 'pending') {
        return 'wait_for_assignment'
      }
    }
  }

  // 2. Kiểm tra các trạng thái từ StudentCareAlert (real-time alerts & care flow của màn hình hiện tại)
  if (student) {
    const rawStatus = student.status as string
    const rawRealtime = student.realtimeStatus as string
    const careAlertText = (student.careAlert || '').toLowerCase()

    // 2.1 Hết buổi / session_ended (Kiểm tra trước khi xét các trạng thái khác để tránh nhầm lẫn)
    if (
      rawStatus === 'Hết buổi' ||
      rawStatus === 'session_ended' ||
      rawRealtime === 'Hết buổi' ||
      (student.remainingSessions !== undefined && student.remainingSessions <= 0)
    ) {
      return 'session_ended'
    }

    // 2.2 Chờ chuyển lớp
    if (
      rawStatus === 'Chờ chuyển lớp' ||
      rawStatus === 'pending_transfer' ||
      rawRealtime === 'Chờ chuyển lớp'
    ) {
      return 'pending_transfer'
    }

    // 2.3 Đang bảo lưu
    if (
      rawStatus === 'reserve' ||
      rawStatus === 'Bảo lưu' ||
      rawRealtime === 'Bảo lưu' ||
      careAlertText.includes('bảo lưu')
    ) {
      return 'reserve'
    }

    // 2.4 Chờ khai giảng
    if (
      rawStatus === 'awaiting_opening' ||
      rawStatus === 'Chờ khai giảng' ||
      rawRealtime === 'Chờ khai giảng' ||
      careAlertText.includes('khai giảng')
    ) {
      return 'awaiting_opening'
    }

    // 2.5 Lớp nháp
    if (
      rawStatus === 'draft_class' ||
      rawStatus === 'Lớp nháp' ||
      rawRealtime === 'Lớp nháp' ||
      careAlertText.includes('lớp nháp')
    ) {
      return 'draft_class'
    }

    // 2.6 Xếp lớp sau
    if (
      rawStatus === 'enroll_later' ||
      rawStatus === 'Xếp lớp sau' ||
      rawRealtime === 'Xếp lớp sau'
    ) {
      return 'enroll_later'
    }

    // 2.7 Chờ thanh toán
    if (
      rawStatus === 'pending_payment' ||
      rawStatus === 'Chờ thanh toán' ||
      rawRealtime === 'Chờ thanh toán'
    ) {
      return 'pending_payment'
    }

    // 2.8 Chuyển phí
    if (
      rawStatus === 'fee_transfer' ||
      rawStatus === 'Chuyển phí' ||
      rawRealtime === 'Chuyển phí'
    ) {
      return 'fee_transfer'
    }

    // 2.9 Học thử
    if (
      rawStatus === 'trial' ||
      rawStatus === 'Học thử' ||
      rawRealtime === 'Học thử'
    ) {
      return 'trial'
    }

    // 2.10 Chưa ghép lớp / Chờ xếp lớp
    if (
      rawStatus === 'Chưa ghép lớp' ||
      rawStatus === 'wait_for_assignment' ||
      rawStatus === 'pending_assignment' ||
      rawRealtime === 'Chưa ghép lớp' ||
      !student.classCode ||
      student.classCode === '-'
    ) {
      return 'wait_for_assignment'
    }
  }

  // 3. Fallback kiểm tra trạng thái từ mockStudent (dữ liệu nguồn phân hệ Xếp lớp)
  if (mockStudent?.status) {
    switch (mockStudent.status) {
      case 'session_ended':
        return 'session_ended'
      case 'pending_payment':
        return 'pending_payment'
      case 'draft_class':
        return 'draft_class'
      case 'enroll_later':
        return 'enroll_later'
      case 'fee_transfer':
        return 'fee_transfer'
      case 'awaiting_opening':
        return 'awaiting_opening'
      case 'trial':
        return 'trial'
      case 'pending_transfer':
        return 'pending_transfer'
      case 'wait_for_assignment':
        return 'wait_for_assignment'
      case 'reserve':
        return 'reserve'
      case 'active':
        break
    }
  }

  // 4. Fallback cho pkg
  if (pkg) {
    if (pkg.status === 'pending' || !pkg.classCode || pkg.classCode === '-') {
      return 'wait_for_assignment'
    }
  }

  return 'active'
}

/**
 * Kiểm tra xem trạng thái có nên hiển thị cụm 3 cột thông tin lớp học hay không
 */
export function shouldShowClass3Columns(
  status: StudentPlacementStatus,
  isHoldingClass: boolean
): boolean {
  if (isHoldingClass) return true
  return status === 'active' || status === 'awaiting_opening' || status === 'trial' || status === 'draft_class' || status === 'session_ended'
}

export const PLACEMENT_STATUS_META: Record<
  StudentPlacementStatus,
  { label: string; description: string }
> = {
  pending_payment: {
    label: 'Chờ thanh toán',
    description: 'Học viên chưa hoàn tất thanh toán học phí. Cần xác nhận phiếu thu trước khi chính thức xếp lớp.',
  },
  draft_class: {
    label: 'Lớp nháp',
    description: 'Học viên đang được ghép vào lớp nháp dự thảo (chưa chốt sổ mở lớp chính thức).',
  },
  wait_for_assignment: {
    label: 'Chờ xếp lớp',
    description: 'Học viên đã có gói học và đang chờ phòng Đào tạo phân bổ vào lớp học phù hợp.',
  },
  enroll_later: {
    label: 'Xếp lớp sau',
    description: 'Phụ huynh xin lùi thời gian bắt đầu học. Nhân viên CSKH theo dõi ngày hẹn để xếp lớp.',
  },
  pending_transfer: {
    label: 'Chờ chuyển lớp',
    description: 'Tiến trình chuyển lớp đang diễn ra, chờ ghép lớp mới.',
  },
  fee_transfer: {
    label: 'Chuyển phí',
    description: 'Học viên đang trong quy trình chuyển đổi số buổi / học phí sang môn khác hoặc học viên khác.',
  },
  awaiting_opening: {
    label: 'Chờ khai giảng',
    description: 'Học viên đã được xếp vào lớp, lớp đang chờ đến ngày khai giảng chính thức.',
  },
  trial: {
    label: 'Học thử',
    description: 'Học viên đang tham gia buổi trải nghiệm học thử (Trial).',
  },
  active: {
    label: 'Đang học',
    description: 'Học viên đang theo học bình thường tại lớp.',
  },
  reserve: {
    label: 'Bảo lưu',
    description: 'Học viên đang tạm dừng khóa học theo đơn bảo lưu học phí.',
  },
  session_ended: {
    label: 'Hết buổi',
    description: 'Học viên đã học hết toàn bộ số buổi đăng ký của gói học (Cần tư vấn tái phí).',
  },
}

/**
 * Trích xuất Tên Chương trình chuẩn từ thông tin gói học
 */
export function getPackageProgramName(pkg: SimulatedPackage): string {
  const text = `${pkg.packageName} ${pkg.className} ${pkg.classCode} ${pkg.level || ''}`.toLowerCase()
  if (
    text.includes('tiếng anh') ||
    text.includes('english') ||
    text.includes('ielts') ||
    text.includes('ld_ta') ||
    text.includes('ie_')
  ) {
    return 'Tiếng Anh'
  }
  if (
    text.includes('toán') ||
    text.includes('math') ||
    text.includes('ld_toan')
  ) {
    return 'Toán tư duy'
  }
  return pkg.level || 'Chương trình'
}

/**
 * Lấy nhãn trạng thái học viên của gói học (đặc biệt khi gói chưa có lớp ghép)
 */
export function getPackageStudentStatus(
  pkg: SimulatedPackage,
  student?: StudentCareAlert | null,
  mockStudent?: Student | null
): string {
  // 1. Gói đã hết buổi / hết hạn
  if (pkg.status === 'expired' || (pkg.remainingSessions !== undefined && pkg.remainingSessions <= 0)) {
    return 'Hết buổi'
  }

  // 2. Nếu trên đối tượng gói có cấu hình trực tiếp trạng thái học viên
  if (pkg.studentStatus) {
    return pkg.studentStatus
  }

  // 3. Phân giải chuẩn theo quy tắc 11 trạng thái xếp lớp
  const resolvedStatus = resolveStudentPlacementStatus(student, mockStudent, pkg)
  const meta = PLACEMENT_STATUS_META[resolvedStatus]
  if (meta?.label) {
    return meta.label
  }

  return 'Chờ xếp lớp'
}

/**
 * Xác định nhãn và kiểu hiển thị cho Dòng 2 trên Tab Gói học:
 * - Nếu trạng thái đã kết thúc / hết buổi:
 *   -> Hiển thị MÃ LỚP CŨ (Theo yêu cầu: "Nếu đã kết thúc, hiển thị mã lớp cũ")
 * - Nếu đang ở các trạng thái chờ ghép lớp / chưa có lớp (chờ chuyển lớp, bảo lưu, chờ xếp lớp, chưa ghép lớp, xếp lớp sau, chờ thanh toán, chuyển phí):
 *   -> Hiển thị TRẠNG THÁI GÓI (không hiển thị mã lớp)
 * - Nếu đang học bình thường / đã xếp lớp:
 *   -> Hiển thị MÃ LỚP
 */
export function getTabLine2Display(
  pkg: SimulatedPackage,
  student?: StudentCareAlert | null,
  mockStudent?: Student | null
): { text: string; isStatus: boolean } {
  // 1. Phân giải trạng thái xếp lớp chuẩn xác
  const status = resolveStudentPlacementStatus(student, mockStudent, pkg)

  // 2. Nếu đã kết thúc / hết buổi -> Hiển thị mã lớp cũ
  if (
    status === 'session_ended' ||
    pkg.status === 'expired' ||
    (pkg.remainingSessions !== undefined && pkg.remainingSessions <= 0)
  ) {
    const oldClassCode = pkg.classCode || student?.classCode || 'Lớp cũ'
    return { text: oldClassCode, isStatus: false }
  }

  // 3. Các trạng thái chưa ghép lớp / chờ ghép lớp:
  const isWaitingForPlacement =
    status === 'wait_for_assignment' ||
    status === 'pending_transfer' ||
    status === 'reserve' ||
    status === 'enroll_later' ||
    status === 'pending_payment' ||
    status === 'fee_transfer' ||
    !pkg.classCode ||
    pkg.classCode.trim() === '' ||
    pkg.classCode === '-'

  if (isWaitingForPlacement) {
    if (pkg.studentStatus) {
      return { text: pkg.studentStatus, isStatus: true }
    }
    if (student) {
      const rawStatus = student.status as string
      const rawRealtime = student.realtimeStatus as string
      if (rawStatus === 'Chưa ghép lớp' || rawRealtime === 'Chưa ghép lớp') {
        return { text: 'Chưa ghép lớp', isStatus: true }
      }
      if (rawStatus === 'Chờ chuyển lớp' || rawRealtime === 'Chờ chuyển lớp') {
        return { text: 'Chờ chuyển lớp', isStatus: true }
      }
      if (rawStatus === 'Bảo lưu' || rawRealtime === 'Bảo lưu') {
        return { text: 'Bảo lưu', isStatus: true }
      }
    }
    const label = PLACEMENT_STATUS_META[status]?.label || student?.status || 'Chờ xếp lớp'
    return { text: label, isStatus: true }
  }

  // 4. Nếu đang học / đã xếp lớp chính thức -> Hiển thị mã lớp
  const classCode = pkg.classCode || 'Cập nhật sau'
  return { text: classCode, isStatus: false }
}

/**
 * Chuẩn hóa định dạng lịch học dạng dòng phụ (tách thời gian chi tiết theo từng ngày):
 * VD: "T3 - 17:30-19:30, T6 - 17:30-19:30"
 */
export function formatCompactSchedule(schedule?: string): string {
  if (!schedule) return 'Chưa xếp lịch'
  const trimmed = schedule.trim()
  if (!trimmed || trimmed === '-') return 'Chưa xếp lịch'

  // Tách từng ca học theo dấu phẩy để hiển thị đầy đủ thời gian riêng cho từng ngày
  return trimmed
    .split(',')
    .map((s) => {
      let part = s.trim()
      // Rút gọn Thứ x thành Tx nếu có để dòng gọn gàng hơn
      part = part
        .replace(/^Thứ\s*([2-7])/i, 'T$1')
        .replace(/^Chủ\s*nhật/i, 'CN')
      return part
    })
    .filter(Boolean)
    .join(', ')
}

