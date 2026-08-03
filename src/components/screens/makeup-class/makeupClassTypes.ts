import type { MakeupClassStatus } from '@/mocks/makeupClasses'

/** Tile Id for lifecycle statuses + 'all' */
export type MakeupStatusTileId = 'all' | 'cho_duyet' | 'da_xep_lich' | 'tu_choi' | 'cancelled'

/** Result filter chip ids */
export type MakeupResultFilterId = 'all' | 'completed' | 'da_vang' | 'het_han'

export interface MakeupClassFilterState {
  programs: string[]
  creators: string[]
  statuses: string[]
  subjects: string[]
  owners: string[]
  schools: string[]
}

export interface MakeupStatusConfigItem {
  id: Exclude<MakeupClassStatus, never>
  label: string
  status: string
}
