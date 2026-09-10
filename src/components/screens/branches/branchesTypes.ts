import type { Branch, BranchRoom, BranchHistoryItem } from '@/mocks/branches'

export type { Branch, BranchRoom, BranchHistoryItem }

export interface BranchFilterState {
  search: string
  status: string
  region: string
  type: string
}

export interface BranchFormValues {
  code: string
  name: string
  type: 'training_center' | 'headquarters' | 'testing_center'
  region: string
  province: string
  district: string
  address: string
  phone: string
  email: string
  coordinates: string
  managerName: string
  managerPhone: string
  managerEmail: string
  openTime: string
  closeTime: string
  daysOfWeek: string
  roomCount: number
  totalCapacity: number
}

export interface RoomFormValues {
  name: string
  code: string
  roomType: 'standard' | 'lab' | 'vip' | 'multipurpose'
  capacity: number
  floor: string
  equipment: string
}

export const BRANCH_TYPES = [
  { value: 'all', label: 'Tất cả loại hình' },
  { value: 'training_center', label: 'Trung tâm Đào tạo' },
  { value: 'headquarters', label: 'Trụ sở chính' },
  { value: 'testing_center', label: 'Trung tâm Khảo thí' },
]

export const BRANCH_REGIONS = [
  { value: 'all', label: 'Tất cả khu vực' },
  { value: 'Miền Bắc - Hà Nội', label: 'Miền Bắc - Hà Nội' },
  { value: 'Miền Nam - TP.HCM', label: 'Miền Nam - TP.HCM' },
  { value: 'Miền Trung - Đà Nẵng', label: 'Miền Trung - Đà Nẵng' },
]

export const ROOM_TYPES = [
  { value: 'standard', label: 'Phòng tiêu chuẩn' },
  { value: 'lab', label: 'Phòng Lab Máy tính' },
  { value: 'vip', label: 'Phòng VIP / Test' },
  { value: 'multipurpose', label: 'Phòng Đa năng' },
]

export interface BranchStaffMember {
  id: string
  name: string
  email: string
  phone: string
  department: string
  position: string
  roleInBranch?: string
  contractType?: string
  avatar?: string
}
