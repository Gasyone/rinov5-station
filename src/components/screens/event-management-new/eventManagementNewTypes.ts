export interface EventFilters {
  search: string
  branch: string
  status: string
}

export const INITIAL_FILTERS: EventFilters = {
  search: "",
  branch: "all",
  status: "all"
}

export type EventType = 'seminar' | 'open_day' | 'trial' | 'other'

export interface EventFormState {
  title: string
  type: EventType
  branch: string
  startDate: string
  endDate: string
  capacity: number
  location: string
  organizer: string
  description: string
  status: 'nhap' | 'mo_dang_ky' | 'dang_dien_ra' | 'ket_thuc' | 'huy'
}

export const INITIAL_FORM_STATE: EventFormState = {
  title: "",
  type: "seminar",
  branch: "RinoEdu Linh Đàm",
  startDate: "",
  endDate: "",
  capacity: 30,
  location: "",
  organizer: "Phòng Tuyển sinh",
  description: "",
  status: "nhap"
}
