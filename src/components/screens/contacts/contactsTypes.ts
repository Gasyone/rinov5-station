export type ContactRoleFilter = 'all' | 'parent' | 'student'
export type ContactBirthdayFilter = 'all' | 'this_month' | 'today'

export interface ContactFilterState {
  roles: ContactRoleFilter[]
  birthday: ContactBirthdayFilter
}

export const CONTACT_ROLE_TABS: Array<{
  id: ContactRoleFilter
  label: string
}> = [
  { id: 'all', label: 'Tất cả liên hệ' },
  { id: 'parent', label: 'Phụ huynh' },
  { id: 'student', label: 'Học viên' },
]

export interface BirthdayInfo {
  isToday: boolean
  isThisMonth: boolean
  hasBirthday: boolean
  birthYear: number
  fullDob: string
  formattedDay: string
  age: number | null
}
