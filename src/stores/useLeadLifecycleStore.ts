import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import type {
  PipelineStageConfig,
  PipelineSubStatusConfig,
  DataPoolConfig,
  CallDispositionConfig,
} from '@/components/screens/lead-lifecycle-config/leadLifecycleTypes'
import {
  MOCK_DATA_POOLS,
  MOCK_PIPELINE_STAGES,
  MOCK_STAGES_BY_POOL,
  MOCK_CALL_DISPOSITIONS,
} from '@/components/screens/lead-lifecycle-config/leadLifecycleMockData'

interface LeadLifecycleState {
  selectedPoolId: string
  setSelectedPoolId: (poolId: string) => void

  stagesByPool: Record<string, PipelineStageConfig[]>
  pools: DataPoolConfig[]
  callDispositions: CallDispositionConfig[]

  // Stages getter for active pool (for backward compatibility)
  stages: PipelineStageConfig[]
  getStagesForPool: (poolId: string) => PipelineStageConfig[]

  // Stage Actions (operate on selectedPoolId by default)
  setStages: (
    stages:
      | PipelineStageConfig[]
      | ((prev: PipelineStageConfig[]) => PipelineStageConfig[])
  ) => void
  setStagesForPool: (
    poolId: string,
    stages:
      | PipelineStageConfig[]
      | ((prev: PipelineStageConfig[]) => PipelineStageConfig[])
  ) => void
  addStage: (stage: PipelineStageConfig) => void
  updateStage: (stageId: string, partial: Partial<PipelineStageConfig>) => void
  deleteStage: (stageId: string) => void
  reorderStages: (sourceIndex: number, destIndex: number) => void

  // SubStatus Actions for selectedPoolId
  addSubStatus: (stageId: string, subStatus: PipelineSubStatusConfig) => void
  updateSubStatus: (
    stageId: string,
    subStatusId: string,
    partial: Partial<PipelineSubStatusConfig>
  ) => void
  deleteSubStatus: (stageId: string, subStatusId: string) => void

  // Pool Actions
  setPools: (
    pools: DataPoolConfig[] | ((prev: DataPoolConfig[]) => DataPoolConfig[])
  ) => void
  addPool: (pool: DataPoolConfig) => void
  updatePool: (poolId: string, partial: Partial<DataPoolConfig>) => void
  deletePool: (poolId: string) => void

  // Clone stages between pools
  copyStagesFromPool: (sourcePoolId: string, targetPoolId: string) => void

  // Call Disposition Actions
  setCallDispositions: (dispositions: CallDispositionConfig[]) => void
  updateCallDisposition: (
    id: string,
    partial: Partial<CallDispositionConfig>
  ) => void

  // Reset Actions
  resetToDefaults: () => void
  resetPoolStagesToDefault: (poolId: string) => void
}

const DEFAULT_POOLS = MOCK_DATA_POOLS
const DEFAULT_CALL_DISPOSITIONS = MOCK_CALL_DISPOSITIONS
const DEFAULT_STAGES_BY_POOL = MOCK_STAGES_BY_POOL

export const useLeadLifecycleStore = create<LeadLifecycleState>()(
  persist(
    (set, get) => ({
      selectedPoolId: 'pool-t',
      stagesByPool: DEFAULT_STAGES_BY_POOL,
      stages: DEFAULT_STAGES_BY_POOL['pool-t'] || MOCK_PIPELINE_STAGES,
      pools: DEFAULT_POOLS,
      callDispositions: DEFAULT_CALL_DISPOSITIONS,

      setSelectedPoolId: (poolId) =>
        set((state) => {
          const poolStages =
            state.stagesByPool[poolId] ||
            state.stagesByPool['pool-t'] ||
            DEFAULT_STAGES_BY_POOL['pool-t']
          return {
            selectedPoolId: poolId,
            stages: poolStages,
          }
        }),

      getStagesForPool: (poolId) => {
        const state = get()
        if (state.stagesByPool && state.stagesByPool[poolId]) {
          return state.stagesByPool[poolId]
        }
        return (
          state.stagesByPool?.['pool-t'] ||
          DEFAULT_STAGES_BY_POOL['pool-t'] ||
          MOCK_PIPELINE_STAGES
        )
      },

      // Stages for active pool
      setStages: (stages) =>
        set((state) => {
          const currentPoolId = state.selectedPoolId
          const currentStages =
            state.stagesByPool[currentPoolId] ||
            state.stagesByPool['pool-t'] ||
            []
          const updatedStages =
            typeof stages === 'function' ? stages(currentStages) : stages
          return {
            stages: updatedStages,
            stagesByPool: {
              ...state.stagesByPool,
              [currentPoolId]: updatedStages,
            },
          }
        }),

      setStagesForPool: (poolId, stages) =>
        set((state) => {
          const currentStages =
            state.stagesByPool[poolId] ||
            state.stagesByPool['pool-t'] ||
            []
          const updatedStages =
            typeof stages === 'function' ? stages(currentStages) : stages
          return {
            stages: state.selectedPoolId === poolId ? updatedStages : state.stages,
            stagesByPool: {
              ...state.stagesByPool,
              [poolId]: updatedStages,
            },
          }
        }),

      addStage: (stage) =>
        set((state) => {
          const currentPoolId = state.selectedPoolId
          const currentStages =
            state.stagesByPool[currentPoolId] ||
            state.stagesByPool['pool-t'] ||
            []
          const updatedStages = [...currentStages, stage]
          return {
            stages: updatedStages,
            stagesByPool: {
              ...state.stagesByPool,
              [currentPoolId]: updatedStages,
            },
          }
        }),

      updateStage: (stageId, partial) =>
        set((state) => {
          const currentPoolId = state.selectedPoolId
          const currentStages =
            state.stagesByPool[currentPoolId] ||
            state.stagesByPool['pool-t'] ||
            []
          const updatedStages = currentStages.map((s) =>
            s.id === stageId ? { ...s, ...partial } : s
          )
          return {
            stages: updatedStages,
            stagesByPool: {
              ...state.stagesByPool,
              [currentPoolId]: updatedStages,
            },
          }
        }),

      deleteStage: (stageId) =>
        set((state) => {
          const currentPoolId = state.selectedPoolId
          const currentStages =
            state.stagesByPool[currentPoolId] ||
            state.stagesByPool['pool-t'] ||
            []
          const updatedStages = currentStages.filter((s) => s.id !== stageId)
          return {
            stages: updatedStages,
            stagesByPool: {
              ...state.stagesByPool,
              [currentPoolId]: updatedStages,
            },
          }
        }),

      reorderStages: (sourceIndex, destIndex) =>
        set((state) => {
          const currentPoolId = state.selectedPoolId
          const currentStages =
            state.stagesByPool[currentPoolId] ||
            state.stagesByPool['pool-t'] ||
            []
          const next = [...currentStages]
          const [removed] = next.splice(sourceIndex, 1)
          next.splice(destIndex, 0, removed)
          const updatedStages = next.map((item, idx) => ({
            ...item,
            order: idx + 1,
          }))
          return {
            stages: updatedStages,
            stagesByPool: {
              ...state.stagesByPool,
              [currentPoolId]: updatedStages,
            },
          }
        }),

      // SubStatuses
      addSubStatus: (stageId, subStatus) =>
        set((state) => {
          const currentPoolId = state.selectedPoolId
          const currentStages =
            state.stagesByPool[currentPoolId] ||
            state.stagesByPool['pool-t'] ||
            []
          const updatedStages = currentStages.map((s) => {
            if (s.id !== stageId) return s
            const existing = s.subStatuses || []
            return {
              ...s,
              subStatuses: [...existing, subStatus],
            }
          })
          return {
            stages: updatedStages,
            stagesByPool: {
              ...state.stagesByPool,
              [currentPoolId]: updatedStages,
            },
          }
        }),

      updateSubStatus: (stageId, subStatusId, partial) =>
        set((state) => {
          const currentPoolId = state.selectedPoolId
          const currentStages =
            state.stagesByPool[currentPoolId] ||
            state.stagesByPool['pool-t'] ||
            []
          const updatedStages = currentStages.map((s) => {
            if (s.id !== stageId) return s
            return {
              ...s,
              subStatuses: (s.subStatuses || []).map((sub) =>
                sub.id === subStatusId ? { ...sub, ...partial } : sub
              ),
            }
          })
          return {
            stages: updatedStages,
            stagesByPool: {
              ...state.stagesByPool,
              [currentPoolId]: updatedStages,
            },
          }
        }),

      deleteSubStatus: (stageId, subStatusId) =>
        set((state) => {
          const currentPoolId = state.selectedPoolId
          const currentStages =
            state.stagesByPool[currentPoolId] ||
            state.stagesByPool['pool-t'] ||
            []
          const updatedStages = currentStages.map((s) => {
            if (s.id !== stageId) return s
            return {
              ...s,
              subStatuses: (s.subStatuses || []).filter(
                (sub) => sub.id !== subStatusId
              ),
            }
          })
          return {
            stages: updatedStages,
            stagesByPool: {
              ...state.stagesByPool,
              [currentPoolId]: updatedStages,
            },
          }
        }),

      // Pools
      setPools: (pools) =>
        set((state) => ({
          pools: typeof pools === 'function' ? pools(state.pools) : pools,
        })),

      addPool: (pool) =>
        set((state) => {
          const template =
            state.stagesByPool['pool-t'] ||
            DEFAULT_STAGES_BY_POOL['pool-t'] ||
            []
          const clonedStages = template.map((s) => ({
            ...s,
            id: `stage-${pool.id}-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
            subStatuses: (s.subStatuses || []).map((sub) => ({
              ...sub,
              id: `sub-${pool.id}-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
            })),
          }))
          return {
            pools: [...state.pools, pool],
            stagesByPool: {
              ...state.stagesByPool,
              [pool.id]: clonedStages,
            },
          }
        }),

      updatePool: (poolId, partial) =>
        set((state) => ({
          pools: state.pools.map((p) =>
            p.id === poolId ? { ...p, ...partial } : p
          ),
        })),

      deletePool: (poolId) =>
        set((state) => {
          const updatedPools = state.pools.filter((p) => p.id !== poolId)
          const updatedStagesByPool = { ...state.stagesByPool }
          delete updatedStagesByPool[poolId]
          const nextSelected =
            state.selectedPoolId === poolId
              ? updatedPools[0]?.id || 'pool-t'
              : state.selectedPoolId
          const nextStages =
            updatedStagesByPool[nextSelected] ||
            updatedStagesByPool['pool-t'] ||
            []
          return {
            pools: updatedPools,
            stagesByPool: updatedStagesByPool,
            selectedPoolId: nextSelected,
            stages: nextStages,
          }
        }),

      copyStagesFromPool: (sourcePoolId, targetPoolId) =>
        set((state) => {
          const sourceStages =
            state.stagesByPool[sourcePoolId] ||
            DEFAULT_STAGES_BY_POOL[sourcePoolId] ||
            []
          const clonedStages = sourceStages.map((stage) => ({
            ...stage,
            id: `stage-${targetPoolId}-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
            subStatuses: (stage.subStatuses || []).map((sub) => ({
              ...sub,
              id: `sub-${targetPoolId}-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
            })),
          }))
          const updatedStagesByPool = {
            ...state.stagesByPool,
            [targetPoolId]: clonedStages,
          }
          return {
            stagesByPool: updatedStagesByPool,
            stages:
              state.selectedPoolId === targetPoolId
                ? clonedStages
                : state.stages,
          }
        }),

      // Call Dispositions
      setCallDispositions: (callDispositions) => set({ callDispositions }),

      updateCallDisposition: (id, partial) =>
        set((state) => ({
          callDispositions: state.callDispositions.map((cd) =>
            cd.id === id ? { ...cd, ...partial } : cd
          ),
        })),

      // Reset
      resetToDefaults: () =>
        set({
          selectedPoolId: 'pool-t',
          stagesByPool: DEFAULT_STAGES_BY_POOL,
          stages: DEFAULT_STAGES_BY_POOL['pool-t'],
          pools: DEFAULT_POOLS,
          callDispositions: DEFAULT_CALL_DISPOSITIONS,
        }),

      resetPoolStagesToDefault: (poolId) =>
        set((state) => {
          const defaultForPool =
            DEFAULT_STAGES_BY_POOL[poolId] ||
            DEFAULT_STAGES_BY_POOL['pool-t'] ||
            []
          const updatedStagesByPool = {
            ...state.stagesByPool,
            [poolId]: defaultForPool,
          }
          return {
            stagesByPool: updatedStagesByPool,
            stages:
              state.selectedPoolId === poolId ? defaultForPool : state.stages,
          }
        }),
    }),
    {
      name: 'rinov5-lead-lifecycle-store',
      version: 2,
      storage: createJSONStorage(() => localStorage),
      migrate: (persistedState: unknown, version: number) => {
        const state = persistedState as Record<string, unknown>
        if (version < 2 || !state?.stagesByPool) {
          return {
            ...state,
            selectedPoolId: 'pool-t',
            stagesByPool: DEFAULT_STAGES_BY_POOL,
            stages: DEFAULT_STAGES_BY_POOL['pool-t'],
          }
        }
        return state
      },
    }
  )
)
