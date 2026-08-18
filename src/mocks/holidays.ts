export interface HolidayConfig {
  id: string
  name: string
  year: number
  startDate: string
  endDate: string
  daysCount: number
  type: 'national' | 'internal' | 'center'
  scopes: string[] // 'Toàn hệ thống' hoặc mảng các chi nhánh cụ thể
  isRecurring: boolean // lặp lại hàng năm (dương lịch)
  status: 'active' | 'inactive'
  description?: string
}

export const HOLIDAY_TYPE_LABELS: Record<HolidayConfig['type'], string> = {
  national: 'Lễ Quốc gia',
  internal: 'Nghỉ nội bộ',
  center: 'Nghỉ riêng cơ sở',
}

export const initialHolidays: HolidayConfig[] = [
  {
    id: 'hol-1',
    name: 'Tết Dương lịch',
    year: 2026,
    startDate: '2026-01-01',
    endDate: '2026-01-01',
    daysCount: 1,
    type: 'national',
    scopes: ['Toàn hệ thống'],
    isRecurring: true,
    status: 'active',
    description: 'Nghỉ 1 ngày theo quy định của Nhà nước (Lặp lại hàng năm)',
  },
  {
    id: 'hol-2',
    name: 'Tết Nguyên Đán Bính Ngọ 2026',
    year: 2026,
    startDate: '2026-02-14',
    endDate: '2026-02-22',
    daysCount: 9,
    type: 'national',
    scopes: ['Toàn hệ thống'],
    isRecurring: false,
    status: 'active',
    description: 'Nghỉ Tết Âm lịch 9 ngày liên tục',
  },
  {
    id: 'hol-3',
    name: 'Giỗ Tổ Hùng Vương (10/3 ÂL)',
    year: 2026,
    startDate: '2026-04-26',
    endDate: '2026-04-26',
    daysCount: 1,
    type: 'national',
    scopes: ['Toàn hệ thống'],
    isRecurring: false,
    status: 'active',
    description: 'Nghỉ lễ Giỗ Tổ Hùng Vương',
  },
  {
    id: 'hol-4',
    name: 'Chiến thắng 30/4 & Quốc tế Lao động 1/5',
    year: 2026,
    startDate: '2026-04-30',
    endDate: '2026-05-03',
    daysCount: 4,
    type: 'national',
    scopes: ['Toàn hệ thống'],
    isRecurring: true,
    status: 'active',
    description: 'Nghỉ lễ 30/4 - 1/5 và nghỉ bù',
  },
  {
    id: 'hol-5',
    name: 'Nghỉ hè & Team Building nội bộ RinoEdu',
    year: 2026,
    startDate: '2026-07-10',
    endDate: '2026-07-12',
    daysCount: 3,
    type: 'internal',
    scopes: ['Toàn hệ thống'],
    isRecurring: false,
    status: 'active',
    description: 'Tất cả cơ sở tạm dừng hoạt động giảng dạy',
  },
  {
    id: 'hol-6',
    name: 'Quốc khánh 2/9',
    year: 2026,
    startDate: '2026-09-01',
    endDate: '2026-09-03',
    daysCount: 3,
    type: 'national',
    scopes: ['Toàn hệ thống'],
    isRecurring: true,
    status: 'active',
    description: 'Nghỉ lễ Quốc khánh 2/9',
  },
  {
    id: 'hol-7',
    name: 'Bảo trì cơ sở Smart City & Nguyễn Tuân',
    year: 2026,
    startDate: '2026-10-15',
    endDate: '2026-10-15',
    daysCount: 1,
    type: 'center',
    scopes: ['RinoEdu Smart City', 'RinoEdu Nguyễn Tuân'],
    isRecurring: false,
    status: 'active',
    description: 'Bảo trì phòng máy và thiết bị kỹ thuật',
  },
]

let currentHolidays: HolidayConfig[] = [...initialHolidays]

export function getMockHolidays(year?: number, branch?: string): HolidayConfig[] {
  return currentHolidays.filter((h) => {
    // Nếu có lọc năm: lấy các ngày lễ thuộc năm đó HOẶC có cờ lặp lại hàng năm
    if (year && h.year !== year && !h.isRecurring) {
      return false
    }
    // Lọc theo chi nhánh
    if (branch && branch !== 'all' && branch !== 'Toàn hệ thống') {
      const isSystemWide = h.scopes.includes('Toàn hệ thống')
      const isBranchIncluded = h.scopes.includes(branch)
      if (!isSystemWide && !isBranchIncluded) return false
    }
    return true
  })
}

export function addMockHoliday(holiday: Omit<HolidayConfig, 'id'>): HolidayConfig {
  const newHoliday: HolidayConfig = {
    ...holiday,
    id: `hol-${Date.now()}`,
  }
  currentHolidays = [newHoliday, ...currentHolidays]
  return newHoliday
}

export function updateMockHoliday(id: string, updates: Partial<HolidayConfig>): void {
  currentHolidays = currentHolidays.map((h) => (h.id === id ? { ...h, ...updates } : h))
}

export function deleteMockHoliday(id: string): void {
  currentHolidays = currentHolidays.filter((h) => h.id !== id)
}

export function batchDeleteMockHolidays(ids: string[]): void {
  currentHolidays = currentHolidays.filter((h) => !ids.includes(h.id))
}

/**
 * Kiểm tra 1 ngày cụ thể (YYYY-MM-DD) có rơi vào đợt nghỉ lễ nào không
 */
export function checkDateHoliday(dateKey: string, branch?: string): HolidayConfig | undefined {
  return currentHolidays.find((h) => {
    if (h.status !== 'active') return false
    if (branch && branch !== 'all' && branch !== 'Toàn hệ thống') {
      const isSystemWide = h.scopes.includes('Toàn hệ thống')
      const isBranchIncluded = h.scopes.includes(branch)
      if (!isSystemWide && !isBranchIncluded) return false
    }

    if (h.isRecurring) {
      // Đối với ngày lặp lại hàng năm: so khớp tháng-ngày (MM-DD)
      const targetMMDD = dateKey.slice(5)
      const startMMDD = h.startDate.slice(5)
      const endMMDD = h.endDate.slice(5)
      if (targetMMDD >= startMMDD && targetMMDD <= endMMDD) return true
    }

    return dateKey >= h.startDate && dateKey <= h.endDate
  })
}
