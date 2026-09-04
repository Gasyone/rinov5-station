import {
  SYSTEM_PERMISSION_FEATURES,
  type PermissionFeatureItem,
  type RolePermissionMatrixItem,
  type PermissionRole,
  type PermissionTopic,
  type DataScope,
} from '@/mocks/permissions'

export interface GroupedFeatureSection {
  groupKey: string
  groupName: string
  features: PermissionFeatureItem[]
}

/**
 * Nhóm các tính năng nghiệp vụ theo Phân hệ (có hỗ trợ lọc chỉ Station)
 */
export function getGroupedFeatures(onlyStation?: boolean): GroupedFeatureSection[] {
  const map = new Map<string, GroupedFeatureSection>()

  const features = onlyStation
    ? SYSTEM_PERMISSION_FEATURES.filter((f) => f.isStation)
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
