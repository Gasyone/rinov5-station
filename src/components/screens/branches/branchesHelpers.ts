import { mockEmployees } from '@/mocks/employees'
import type { Branch, BranchFilterState, BranchStaffMember } from './branchesTypes'

/**
 * Mask phone number on list table per Enterprise Standard Rule 4.
 * e.g. 024 7300 8866 -> 024 **** 8866, 0988 123 456 -> 0988 **** 456
 */
export function maskPhoneNumber(phone: string): string {
  if (!phone) return '—'
  const digits = phone.replace(/\s+/g, '')
  if (digits.length < 7) return phone
  const prefix = digits.slice(0, 4)
  const suffix = digits.slice(-3)
  return `${prefix} **** ${suffix}`
}

export function filterBranches(branches: Branch[], filters: BranchFilterState): Branch[] {
  let result = [...branches]

  if (filters.search.trim()) {
    const q = filters.search.toLowerCase().trim()
    result = result.filter(
      (b) =>
        b.name.toLowerCase().includes(q) ||
        b.code.toLowerCase().includes(q) ||
        b.address.toLowerCase().includes(q) ||
        b.phone.includes(q) ||
        b.managerName.toLowerCase().includes(q)
    )
  }

  if (filters.status && filters.status !== 'all') {
    result = result.filter((b) => b.status === filters.status)
  }

  if (filters.region && filters.region !== 'all') {
    result = result.filter((b) => b.region === filters.region)
  }

  if (filters.type && filters.type !== 'all') {
    result = result.filter((b) => b.type === filters.type)
  }

  return result
}

export interface BranchMetrics {
  total: number
  active: number
  setup: number
  inactive: number
  totalRooms: number
  totalCapacity: number
}

export function calculateBranchMetrics(branches: Branch[]): BranchMetrics {
  return branches.reduce(
    (acc, b) => {
      acc.total += 1
      if (b.status === 'active') acc.active += 1
      else if (b.status === 'setup') acc.setup += 1
      else if (b.status === 'inactive') acc.inactive += 1
      acc.totalRooms += b.roomCount || 0
      acc.totalCapacity += b.totalCapacity || 0
      return acc
    },
    { total: 0, active: 0, setup: 0, inactive: 0, totalRooms: 0, totalCapacity: 0 }
  )
}

export function validateBranchCode(code: string, existingBranches: Branch[], currentId?: string): string | null {
  const trimmed = code.trim()
  if (!trimmed) return 'Vui lòng nhập mã cơ sở'
  if (/\s/.test(trimmed)) return 'Mã cơ sở không được chứa khoảng trắng'
  if (!/^[A-Za-z0-9_-]+$/.test(trimmed)) return 'Mã cơ sở chỉ bao gồm chữ, số, dấu gạch nối (- hoặc _)'

  const isDuplicate = existingBranches.some(
    (b) => b.code.toLowerCase() === trimmed.toLowerCase() && b.id !== currentId
  )
  if (isDuplicate) return 'Mã cơ sở này đã tồn tại trên hệ thống'

  return null
}

export function getStaffForBranch(branchName?: string): BranchStaffMember[] {
  if (!branchName) return []
  return mockEmployees
    .filter(
      (e) =>
        e.branch === branchName ||
        e.branches?.includes(branchName) ||
        (branchName.includes('Linh Đàm') && (e.branch?.includes('Linh Đàm') || e.branches?.some((b) => b.includes('Linh Đàm')))) ||
        (branchName.includes('Cầu Giấy') && (e.branch?.includes('Nguyễn Tuân') || e.branch?.includes('Cầu Giấy') || e.branch?.includes('Smart City')))
    )
    .map((e) => ({
      id: e.id,
      name: e.name,
      email: e.email,
      phone: e.phone,
      department: e.department,
      position: e.position,
      roleInBranch:
        e.position?.includes('Giám đốc') || e.position?.includes('Manager')
          ? 'Quản lý điểm trường'
          : e.position?.includes('Teacher') || e.position?.includes('Giáo viên')
          ? 'Giáo viên phụ trách'
          : 'Nhân sự cắm chốt',
      contractType: e.contractType,
      avatar: e.avatar,
    }))
}

export function getInitialStaffForBranch(branch?: Branch | null): BranchStaffMember[] {
  if (!branch) return []
  if (branch.assignedStaff && branch.assignedStaff.length > 0) {
    return branch.assignedStaff
  }
  const matched = getStaffForBranch(branch.name)
  if (matched.length > 0) return matched

  if (branch.managerName && branch.managerName !== 'Chưa phân công') {
    return [
      {
        id: branch.managerId || `emp-${branch.code.toLowerCase()}`,
        name: branch.managerName,
        email: branch.managerEmail || `${branch.code.toLowerCase()}.manager@rinoedu.vn`,
        phone: branch.managerPhone || '—',
        department: 'Ban Giám đốc',
        position: 'Giám đốc cơ sở',
        roleInBranch: 'Quản lý điểm trường',
        contractType: 'Full-time',
        avatar: branch.managerAvatar,
      },
    ]
  }

  return []
}

