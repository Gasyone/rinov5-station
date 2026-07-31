export type RoomStatusTileId = 'all' | 'active' | 'free' | 'conflict'

export interface RoomSessionSlot {
  id: string
  classCode: string
  className: string
  teacherName: string
  timeSlot: string // e.g. "18:00 - 19:30"
  shift: 'morning' | 'afternoon' | 'evening'
  dayOfWeek: string // e.g. "Thứ 2"
  studentCount: number
  maxCapacity: number
  status: 'active' | 'free' | 'conflict'
  subject?: string
}

export interface RoomRecord {
  id: string
  roomName: string
  capacity: number
  roomType: 'theory' | 'lab' | 'online'
  typeLabel: string
  facilities: string[]
  branch: string
  sessions: RoomSessionSlot[]
}

export interface RoomFilterState {
  branches: string[]
  roomTypes: string[]
  shifts: string[]
}

export const INITIAL_ROOM_FILTER_STATE: RoomFilterState = {
  branches: [],
  roomTypes: [],
  shifts: [],
}
