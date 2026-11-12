export type EmployeeBirthdayFilter = 'all' | 'this_month' | 'today'

export interface EmployeeFilterState {
  departments: string[]
  branches: string[]
}

export interface BirthdayInfo {
  isToday: boolean
  isThisMonth: boolean
  hasBirthday: boolean
  birthYear: number
  fullDob: string
  formattedDay: string
  age: number | null
}
