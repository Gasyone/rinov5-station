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
  // 1. Kiểm tra trạng thái từ mockStudent (dữ liệu nguồn phân hệ Xếp lớp) nếu có
  if (mockStudent?.status) {
    switch (mockStudent.status) {
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
      case 'session_ended':
        return 'session_ended'
      case 'active':
        // Nếu mockStudent là active, kiểm tra thêm xem có đang ở các trạng thái nghiệp vụ phát sinh không
        break
    }
  }

  // 2. Kiểm tra các trạng thái từ StudentCareAlert (real-time alerts & care flow)
  if (student) {
    const rawStatus = student.status as string
    const rawRealtime = student.realtimeStatus as string
    const careAlertText = (student.careAlert || '').toLowerCase()

    // 2.1 Chờ chuyển lớp
    if (
      rawStatus === 'Chờ chuyển lớp' ||
      rawStatus === 'pending_transfer' ||
      rawRealtime === 'Chờ chuyển lớp'
    ) {
      return 'pending_transfer'
    }

    // 2.2 Đang bảo lưu
    if (
      (rawStatus === 'Hết buổi' && careAlertText.includes('bảo lưu')) ||
      rawStatus === 'reserve' ||
      rawStatus === 'Bảo lưu' ||
      rawRealtime === 'Bảo lưu' ||
      careAlertText.includes('bảo lưu')
    ) {
      return 'reserve'
    }

    // 2.3 Chờ khai giảng
    if (
      rawStatus === 'awaiting_opening' ||
      rawStatus === 'Chờ khai giảng' ||
      rawRealtime === 'Chờ khai giảng' ||
      careAlertText.includes('khai giảng')
    ) {
      return 'awaiting_opening'
    }

    // 2.4 Lớp nháp
    if (
      rawStatus === 'draft_class' ||
      rawStatus === 'Lớp nháp' ||
      rawRealtime === 'Lớp nháp' ||
      careAlertText.includes('lớp nháp')
    ) {
      return 'draft_class'
    }

    // 2.5 Xếp lớp sau
    if (
      rawStatus === 'enroll_later' ||
      rawStatus === 'Xếp lớp sau' ||
      rawRealtime === 'Xếp lớp sau'
    ) {
      return 'enroll_later'
    }

    // 2.6 Chờ thanh toán
    if (
      rawStatus === 'pending_payment' ||
      rawStatus === 'Chờ thanh toán' ||
      rawRealtime === 'Chờ thanh toán'
    ) {
      return 'pending_payment'
    }

    // 2.7 Chuyển phí
    if (
      rawStatus === 'fee_transfer' ||
      rawStatus === 'Chuyển phí' ||
      rawRealtime === 'Chuyển phí'
    ) {
      return 'fee_transfer'
    }

    // 2.8 Học thử
    if (
      rawStatus === 'trial' ||
      rawStatus === 'Học thử' ||
      rawRealtime === 'Học thử'
    ) {
      return 'trial'
    }

    // 2.9 Hết buổi
    if (
      rawStatus === 'Hết buổi' ||
      rawStatus === 'session_ended' ||
      rawRealtime === 'Hết buổi' ||
      (student.remainingSessions !== undefined && student.remainingSessions <= 0)
    ) {
      return 'session_ended'
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

  // 3. Kiểm tra thông tin gói học (SimulatedPackage)
  if (pkg) {
    if (pkg.status === 'pending' || !pkg.classCode || pkg.classCode === '-') {
      return 'wait_for_assignment'
    }
    if (pkg.status === 'expired' || (pkg.remainingSessions !== undefined && pkg.remainingSessions <= 0)) {
      return 'session_ended'
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
  return status === 'active' || status === 'awaiting_opening' || status === 'trial' || status === 'draft_class'
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
    description: 'Tiến trình chuyển lớp đang diễn ra, chờ ghép sang lớp học đích.',
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

