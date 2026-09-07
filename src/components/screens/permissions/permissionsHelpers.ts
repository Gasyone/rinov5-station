import {
  SYSTEM_PERMISSION_FEATURES,
  STATION_PERMISSION_FEATURES,
  type PermissionFeatureItem,
  type RolePermissionMatrixItem,
  type PermissionRole,
  type PermissionTopic,
  type DataScope,
} from '@/mocks/permissions'
import { mockEmployees, type Employee } from '@/mocks/employees'
import type { RoleAuditLogItem } from './permissionsTypes'

export interface GroupedFeatureSection {
  groupKey: string
  groupName: string
  features: PermissionFeatureItem[]
}

/**
 * Nhóm các tính năng nghiệp vụ theo Phân hệ:
 * - onlyStation = true: Dùng 32 tính năng chuẩn hóa của Station theo 8 phân hệ thực tế tại Station demo
 * - onlyStation = false: Dùng 73 tính năng CRM Core nguyên bản
 */
export function getGroupedFeatures(onlyStation?: boolean): GroupedFeatureSection[] {
  const map = new Map<string, GroupedFeatureSection>()

  const features = onlyStation
    ? STATION_PERMISSION_FEATURES
    : SYSTEM_PERMISSION_FEATURES

  features.forEach((item) => {
    if (!map.has(item.moduleGroupKey)) {
      map.set(item.moduleGroupKey, {
        groupKey: item.moduleGroupKey,
        groupName: item.moduleGroupName,
        features: [],
      })
    }
    map.get(item.moduleGroupKey)!.features.push(item)
  })

  return Array.from(map.values())
}

/**
 * Trả về mô tả ngữ nghĩa chi tiết của từng cấp độ Data Scope theo từng phân hệ / tính năng cụ thể
 */
export function getScopeContextualDescription(
  moduleGroupKey: string,
  featureKey: string,
  scope: DataScope
): string {
  if (!scope) return 'Chưa gán phạm vi riêng (sử dụng cấu hình mặc định)'

  switch (scope) {
    case 'personal':
      if (moduleGroupKey === 'crm') return 'Chỉ xem & xử lý lead do chính tài khoản này phụ trách / tạo ra'
      if (moduleGroupKey === 'operations') return 'Chỉ xem & thao tác lớp do mình trực tiếp giảng dạy / chủ nhiệm'
      if (moduleGroupKey === 'order_mgmt') return 'Chỉ xem các đơn hàng học phí do chính mình tạo'
      if (moduleGroupKey === 'care') return 'Chỉ nhận & xử lý ca cảnh báo / học viên được phân công cho mình'
      if (moduleGroupKey === 'hr_schedule') return 'Chỉ xem thời khóa biểu và ca làm việc của chính bản thân'
      return 'Chỉ truy cập bản ghi dữ liệu do chính tài khoản này phụ trách'

    case 'team':
      if (moduleGroupKey === 'crm') return 'Truy cập lead của toàn bộ chuyên viên trong cùng nhóm / tổ tư vấn'
      if (moduleGroupKey === 'operations') return 'Truy cập các lớp học thuộc tổ bộ môn phụ trách'
      if (moduleGroupKey === 'order_mgmt') return 'Xem đơn hàng của các nhân sự trong cùng team kinh doanh'
      if (moduleGroupKey === 'care') return 'Xem & điều phối ca chăm sóc trong phạm vi team CSKH'
      return 'Truy cập dữ liệu của tất cả thành viên trong cùng tổ / nhóm trực thuộc'

    case 'branch':
      if (moduleGroupKey === 'crm') return 'Xem & tìm kiếm toàn bộ lead của cơ sở / chi nhánh công tác'
      if (moduleGroupKey === 'operations') return 'Xem toàn bộ danh sách lớp học, phòng học và ca học của cơ sở'
      if (moduleGroupKey === 'order_mgmt') return 'Xem toàn bộ đơn hàng và doanh thu thực thu tại cơ sở'
      if (moduleGroupKey === 'care') return 'Xử lý toàn bộ cảnh báo học viên và phễu tái phí của cơ sở'
      if (moduleGroupKey === 'admissions') return 'Quản lý toàn bộ lịch test và xếp lớp mới của cơ sở'
      return 'Truy cập toàn bộ dữ liệu nội bộ thuộc phạm vi chi nhánh / cơ sở công tác'

    case 'global':
      return 'Truy cập không giới hạn cơ sở, xem toàn bộ chi nhánh trên toàn chuỗi hệ thống'
  }
}

/**
 * Tạo Ma trận quyền mặc định cho một nhóm quyền mới
 */
export function createDefaultRolePermissions(): RolePermissionMatrixItem[] {
  return SYSTEM_PERMISSION_FEATURES.map((item) => ({
    featureKey: item.featureKey,
    actions: {
      access: false,
      create: false,
      edit: false,
      delete: false,
      export: false,
      viewAll: false,
    },
    scope: '',
  }))
}

/**
 * Lọc danh sách Topic và các Role tương ứng theo từ khóa tìm kiếm
 */
export function filterTopicsAndRoles(
  topics: PermissionTopic[],
  roles: PermissionRole[],
  query: string
): { filteredTopics: PermissionTopic[]; rolesByTopic: Record<string, PermissionRole[]> } {
  const q = query.trim().toLowerCase()
  const rolesByTopic: Record<string, PermissionRole[]> = {}

  topics.forEach((topic) => {
    const topicRoles = roles.filter((r) => r.topicId === topic.id)
    if (!q) {
      rolesByTopic[topic.id] = topicRoles
    } else {
      const matchTopic = topic.name.toLowerCase().includes(q)
      const matchingRoles = topicRoles.filter(
        (r) => r.name.toLowerCase().includes(q) || r.description.toLowerCase().includes(q)
      )
      if (matchTopic) {
        rolesByTopic[topic.id] = topicRoles
      } else if (matchingRoles.length > 0) {
        rolesByTopic[topic.id] = matchingRoles
      } else {
        rolesByTopic[topic.id] = []
      }
    }
  })

  const filteredTopics = topics.filter((t) => (rolesByTopic[t.id] || []).length > 0 || !q)

  return { filteredTopics, rolesByTopic }
}

/**
 * Đếm số lượng tính năng được cấp quyền truy cập trong Role
 */
export function countActivePermissions(role: PermissionRole): number {
  return role.permissions.filter((p) => p.actions.access).length
}

/**
 * Trả về danh sách nhân sự được gán vào nhóm quyền cụ thể.
 * Ưu tiên đối khớp theo bộ phận/chức danh phù hợp với tên role hoặc trả về danh sách theo số lượng userCount.
 */
export function getAssignedEmployeesForRole(role?: PermissionRole | null): Employee[] {
  if (!role) return []

  const text = (role.name + ' ' + (role.code || '') + ' ' + (role.description || '')).toLowerCase()

  if (text.includes('giáo viên') || text.includes('teacher')) {
    return mockEmployees.filter((e) => e.department === 'Teaching' && !e.position.includes('Assistant'))
  }
  if (text.includes('trợ giảng') || text.includes('assistant') || text.includes('ta')) {
    return mockEmployees.filter((e) => e.position.includes('Teaching Assistant') || e.position.includes('Tutor'))
  }
  if (text.includes('telesale') || text.includes('sale') || text.includes('tuyển sinh')) {
    return mockEmployees.filter((e) => e.department === 'Sales')
  }
  if (text.includes('cskh') || text.includes('chăm sóc') || text.includes('csm')) {
    return mockEmployees.filter((e) => e.department === 'Customer Care')
  }
  if (text.includes('quản lý') || text.includes('manager') || text.includes('lead')) {
    return mockEmployees.filter((e) => e.department === 'Management' || e.position.includes('Manager') || e.position.includes('Lead'))
  }
  if (text.includes('kế toán') || text.includes('accounting') || text.includes('thu ngân')) {
    return mockEmployees.filter((e) => e.department === 'Finance' || e.department === 'Admin')
  }

  const targetCount = role.userCount > 0 ? role.userCount : 5
  return mockEmployees.slice(0, Math.min(targetCount, mockEmployees.length))
}

/**
 * Trả về danh sách nhật ký cập nhật hành vi của nhóm quyền.
 * Thể hiện rõ chuẩn hành vi hệ thống: thêm quyền gì (+), bỏ quyền gì (-) tại từng tính năng cụ thể.
 * Cho phép back lại (khôi phục) cấu hình quyền tại thời điểm tương ứng.
 */
export function getRoleAuditLogs(role?: PermissionRole | null): RoleAuditLogItem[] {
  if (!role) return []

  const currentPermissions = role.permissions || []

  // Snapshot lần cập nhật trước (02/09/2026)
  const prevPermissions: RolePermissionMatrixItem[] = currentPermissions.map((p) => {
    const isStudent = p.featureKey === 'station_students'
    const isLeave = p.featureKey === 'station_student_leaves'
    const isSchedule = p.featureKey === 'station_classes'

    return {
      ...p,
      actions: {
        ...p.actions,
        ...(isStudent ? { export: false } : {}),
        ...(isLeave ? { create: false, edit: false } : {}),
        ...(isSchedule ? { delete: true } : {}),
      },
    }
  })

  // Snapshot khởi tạo ban đầu (25/08/2026)
  const initPermissions: RolePermissionMatrixItem[] = currentPermissions.map((p) => {
    const isCore = ['station_students', 'station_classes', 'station_attendance'].includes(p.featureKey)
    return {
      ...p,
      actions: {
        access: isCore,
        create: isCore,
        edit: isCore,
        delete: false,
        export: false,
        viewAll: false,
      },
    }
  })

  return [
    {
      id: `${role.id}_log_3`,
      updatedAt: role.updatedAt || '04/09/2026 14:30',
      updatedBy: 'Nguyễn Văn Quản Lý (Admin)',
      isCurrent: true,
      diffs: [
        {
          type: 'added',
          featureName: 'Bảo lưu / Chuyển lớp / Nghỉ học',
          actionLabels: ['Thêm', 'Sửa'],
        },
        {
          type: 'added',
          featureName: 'Quản lý học viên',
          actionLabels: ['Download/Upload'],
        },
        {
          type: 'removed',
          featureName: 'Lớp học & Lịch giảng dạy',
          actionLabels: ['Xóa'],
        },
      ],
      permissionsSnapshot: currentPermissions,
    },
    {
      id: `${role.id}_log_2`,
      updatedAt: '02/09/2026 10:15',
      updatedBy: 'Trần Trọng Nghĩa (Lead Ops)',
      isCurrent: false,
      diffs: [
        {
          type: 'added',
          featureName: 'Chấm công & Giảng dạy',
          actionLabels: ['Xem tất cả'],
        },
        {
          type: 'removed',
          featureName: 'Bảo lưu / Chuyển lớp / Nghỉ học',
          actionLabels: ['Xóa'],
        },
        {
          type: 'removed',
          featureName: 'Đơn hàng & Học phí',
          actionLabels: ['Download/Upload'],
        },
      ],
      permissionsSnapshot: prevPermissions,
    },
    {
      id: `${role.id}_log_1`,
      updatedAt: '25/08/2026 09:00',
      updatedBy: 'Hệ thống (Khởi tạo)',
      isCurrent: false,
      diffs: [
        {
          type: 'added',
          featureName: 'Quản lý học viên, Lớp học, Điểm danh',
          actionLabels: ['Truy cập', 'Thêm', 'Sửa'],
        },
      ],
      permissionsSnapshot: initPermissions,
    },
  ]
}
