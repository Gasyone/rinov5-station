import { RenewalCareRecord } from '@/mocks/renewalCare'

export type RenewalStageFilter = 'T-1' | 'T' | 'T+1' | 'T+2'

export interface RenewalFilterState {
  search: string
  branch: string
  renewalStatus: string
  classCode: string
  stage: RenewalStageFilter
}

export type { RenewalCareRecord }
