export interface DataPoolConfig {
  id: string
  code: string
  name: string
  url?: string
  leadCount?: number
  isActive?: boolean
}

export type StageType = 'in_progress' | 'won' | 'global_lost'

export type SubStatusOrigin = 'system' | 'custom'

export type SystemLinkedModule =
  | 'booking_test'
  | 'trial_class'
  | 'orders'
  | 'payment_receipts'
  | 'call_log'
  | 'class_placement'
  | 'care'
  | 'order_fulfillment'

export interface PipelineSubStatusConfig {
  id: string
  code: string
  name: string
  color: string
  origin: SubStatusOrigin
  systemModule?: SystemLinkedModule
  systemModuleLabel?: string
  systemEventTrigger?: string
  leadCount: number
  requiresNote?: boolean
  suggestsCallback?: boolean
  description?: string
  isActive: boolean
  isSystemCore?: boolean
}

export interface PipelineStageConfig {
  id: string
  code: string
  name: string
  phaseGroup: 'T0' | 'T1' | 'T2' | 'T3' | 'T4' | 'T5' | 'intake' | 'active_sales' | 'terminal'
  phaseGroupLabel: string
  color: string
  order: number
  stageType: StageType
  isSystemCore: boolean
  slaHours?: number
  actionLabel?: string
  description: string
  isActive: boolean
  subStatuses?: PipelineSubStatusConfig[]
}

export type CallDispositionCategory = 'unreachable' | 'retry_scheduled' | 'invalid_number' | 'connected'

export interface CallDispositionConfig {
  id: string
  code: string
  name: string
  category: CallDispositionCategory
  categoryLabel: string
  color: string
  triggersCallback: boolean
  defaultCallbackMinutes?: number
  description: string
  isActive: boolean
}

export interface LegacyMappingItem {
  id: string
  legacyPhase: 'T0' | 'T1' | 'T2' | 'T3' | 'T4'
  legacyCode: string
  legacyName: string
  legacyColor: string
  canDelete: boolean
  modernDomain: 'Data Pool' | 'Sales Pipeline' | 'Call Disposition' | 'Order & Payment' | 'Fulfillment' | 'Master Profile'
  modernTarget: string
  modernRationale: string
}

export interface LeadLifecycleFilterState {
  search: string
  poolId: string
  phaseGroup: string
  stageType: string
  activeTab: 'pipeline' | 'pools' | 'dispositions' | 'migration'
}
