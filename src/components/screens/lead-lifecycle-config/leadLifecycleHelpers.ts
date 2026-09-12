import { LegacyMappingItem, PipelineStageConfig } from './leadLifecycleTypes'

/**
 * Lấy mã giai đoạn [T0] - [T4] của bước phễu
 */
export function getStagePhase(stage: PipelineStageConfig): 'T0' | 'T1' | 'T2' | 'T3' | 'T4' {
  if (
    stage.phaseGroup === 'T0' ||
    stage.phaseGroup === 'T1' ||
    stage.phaseGroup === 'T2' ||
    stage.phaseGroup === 'T3' ||
    stage.phaseGroup === 'T4'
  ) {
    return stage.phaseGroup as 'T0' | 'T1' | 'T2' | 'T3' | 'T4'
  }
  const match = stage.name.match(/^\[(T[0-4])\]/)
  if (match) {
    return match[1] as 'T0' | 'T1' | 'T2' | 'T3' | 'T4'
  }
  if (
    stage.stageType === 'won' ||
    stage.stageType === 'global_lost' ||
    stage.phaseGroup === 'terminal'
  ) {
    return 'T4'
  }
  if (stage.code === 'NEW') return 'T0'
  if (stage.code === 'QT') return 'T1'
  if (stage.code === 'CHO_CHOT') return 'T3'
  return 'T2'
}

/**
 * Lấy nhãn hiển thị cho loại trạng thái phễu
 */
export function getStageTypeBadge(type: PipelineStageConfig['stageType']): {
  label: string
  className: string
} {
  switch (type) {
    case 'in_progress':
      return {
        label: 'Đang tiến hành',
        className: 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-800',
      }
    case 'won':
      return {
        label: 'Chuyển đổi thành công (Won)',
        className: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800',
      }
    case 'global_lost':
      return {
        label: 'Thất bại toàn cục (Global Lost)',
        className: 'bg-slate-100 text-slate-700 border-slate-300 dark:bg-zinc-800 dark:text-zinc-300 dark:border-zinc-700',
      }
    default:
      return {
        label: 'Không xác định',
        className: 'bg-muted text-muted-foreground border-border',
      }
  }
}

/**
 * Lấy nhãn và màu sắc hiển thị cho miền nghiệp vụ mới của các mã legacy
 */
export function getModernDomainBadge(domain: LegacyMappingItem['modernDomain']): {
  label: string
  className: string
} {
  switch (domain) {
    case 'Data Pool':
      return {
        label: 'Kho Dữ liệu & Tiếp nhận',
        className: 'bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950/40 dark:text-purple-300 dark:border-purple-800',
      }
    case 'Sales Pipeline':
      return {
        label: 'Phễu Tuyển sinh',
        className: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800',
      }
    case 'Call Disposition':
      return {
        label: 'Mã Cuộc gọi Tức thời',
        className: 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-800',
      }
    case 'Order & Payment':
      return {
        label: 'Đơn hàng & Thanh toán',
        className: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800',
      }
    case 'Fulfillment':
      return {
        label: 'Vận chuyển & Bưu phẩm',
        className: 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-800',
      }
    case 'Master Profile':
      return {
        label: 'Thuộc tính Hồ sơ Khách',
        className: 'bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-950/40 dark:text-indigo-300 dark:border-indigo-800',
      }
    default:
      return {
        label: 'Khác',
        className: 'bg-muted text-muted-foreground border-border',
      }
  }
}

/**
 * Lấy nhãn rút gọn cho phân hệ hệ thống liên kết
 */
export function getSystemModuleShortLabel(sub: {
  systemModule?: string
  systemModuleLabel?: string
}): string {
  if (sub.systemModule === 'care') return 'CARE'
  if (sub.systemModule === 'booking_test') return 'Test'
  if (sub.systemModule === 'trial_class') return 'Học thử'
  if (sub.systemModule === 'orders') return 'Đơn hàng'
  if (sub.systemModule === 'payment_receipts') return 'Thu phí'
  if (sub.systemModule === 'order_fulfillment') return 'Bàn giao'
  if (sub.systemModule === 'class_placement') return 'Xếp lớp'
  if (sub.systemModule === 'call_log') return 'Phân bổ'
  return sub.systemModuleLabel ? sub.systemModuleLabel.split(' ')[0] : 'Hệ thống'
}

/**
 * Lấy nhãn giai đoạn cũ T0-T4
 */
export function getLegacyPhaseLabel(phase: LegacyMappingItem['legacyPhase']): string {
  switch (phase) {
    case 'T0':
      return 'T0 · Tiếp nhận & Kho thô'
    case 'T1':
      return 'T1 · Tiếp cận & Trải nghiệm'
    case 'T2':
      return 'T2 · Thất bại & Dừng'
    case 'T3':
      return 'T3 · Chốt đơn & Giao vận'
    case 'T4':
      return 'T4 · Hoàn hàng & Sự cố'
    default:
      return phase
  }
}
