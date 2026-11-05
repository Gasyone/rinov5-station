import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import {
  PoSectionSpec,
  AcceptanceCriteriaItem,
  CornerCaseItem,
  BusinessRuleItem,
  DataSourceItem,
} from './bookingTrialPoTypes'
import {
  DEFAULT_PO_SECTIONS,
  STORAGE_KEY_PO_SECTIONS,
  createEmptyAc,
  createEmptyCornerCase,
  createEmptyBusinessRule,
  createEmptyDataSource,
} from './bookingTrialPoConstants'

interface PoExplainStoreState {
  sections: PoSectionSpec[]

  // AC actions
  addAc: (sectionId: string) => string
  updateAc: (
    sectionId: string,
    acId: string,
    fieldOrUpdates: keyof AcceptanceCriteriaItem | Partial<AcceptanceCriteriaItem>,
    value?: string
  ) => void
  removeAc: (sectionId: string, acId: string) => void

  // Corner Case actions
  addCornerCase: (sectionId: string) => string
  updateCornerCase: (
    sectionId: string,
    caseId: string,
    fieldOrUpdates: keyof CornerCaseItem | Partial<CornerCaseItem>,
    value?: string
  ) => void
  removeCornerCase: (sectionId: string, caseId: string) => void

  // Business Rule actions
  addBusinessRule: (sectionId: string) => string
  updateBusinessRule: (
    sectionId: string,
    ruleId: string,
    fieldOrUpdates: keyof BusinessRuleItem | Partial<BusinessRuleItem>,
    value?: string
  ) => void
  removeBusinessRule: (sectionId: string, ruleId: string) => void

  // Data Source actions
  addDataSource: (sectionId: string) => string
  updateDataSource: (
    sectionId: string,
    sourceId: string,
    fieldOrUpdates: keyof DataSourceItem | Partial<DataSourceItem>,
    value?: string
  ) => void
  removeDataSource: (sectionId: string, sourceId: string) => void

  // PO Notes action
  updatePoNotes: (sectionId: string, notes: string) => void

  // Reset
  resetSections: () => void
}

export const usePoExplainStore = create<PoExplainStoreState>()(
  persist(
    (set) => ({
      sections: DEFAULT_PO_SECTIONS,

      addAc: (sectionId: string) => {
        const item = createEmptyAc()
        set((state) => ({
          sections: state.sections.map((sec) =>
            sec.id === sectionId
              ? {
                  ...sec,
                  acceptanceCriteriaList: [
                    ...sec.acceptanceCriteriaList,
                    item,
                  ],
                }
              : sec
          ),
        }))
        return item.id
      },

      updateAc: (sectionId, acId, fieldOrUpdates, value) =>
        set((state) => {
          const updates =
            typeof fieldOrUpdates === 'string'
              ? { [fieldOrUpdates]: value }
              : fieldOrUpdates

          return {
            sections: state.sections.map((sec) =>
              sec.id === sectionId
                ? {
                    ...sec,
                    acceptanceCriteriaList: sec.acceptanceCriteriaList.map((ac) =>
                      ac.id === acId ? { ...ac, ...updates } : ac
                    ),
                  }
                : sec
            ),
          }
        }),

      removeAc: (sectionId, acId) =>
        set((state) => ({
          sections: state.sections.map((sec) =>
            sec.id === sectionId
              ? {
                  ...sec,
                  acceptanceCriteriaList: sec.acceptanceCriteriaList.filter(
                    (ac) => ac.id !== acId
                  ),
                }
              : sec
          ),
        })),

      addCornerCase: (sectionId: string) => {
        const item = createEmptyCornerCase()
        set((state) => ({
          sections: state.sections.map((sec) =>
            sec.id === sectionId
              ? {
                  ...sec,
                  cornerCasesList: [
                    ...sec.cornerCasesList,
                    item,
                  ],
                }
              : sec
          ),
        }))
        return item.id
      },

      updateCornerCase: (sectionId, caseId, fieldOrUpdates, value) =>
        set((state) => {
          const updates =
            typeof fieldOrUpdates === 'string'
              ? { [fieldOrUpdates]: value }
              : fieldOrUpdates

          return {
            sections: state.sections.map((sec) =>
              sec.id === sectionId
                ? {
                    ...sec,
                    cornerCasesList: sec.cornerCasesList.map((cc) =>
                      cc.id === caseId ? { ...cc, ...updates } : cc
                    ),
                  }
                : sec
            ),
          }
        }),

      removeCornerCase: (sectionId, caseId) =>
        set((state) => ({
          sections: state.sections.map((sec) =>
            sec.id === sectionId
              ? {
                  ...sec,
                  cornerCasesList: sec.cornerCasesList.filter(
                    (cc) => cc.id !== caseId
                  ),
                }
              : sec
          ),
        })),

      addBusinessRule: (sectionId: string) => {
        const item = createEmptyBusinessRule()
        set((state) => ({
          sections: state.sections.map((sec) =>
            sec.id === sectionId
              ? {
                  ...sec,
                  businessRulesList: [
                    ...sec.businessRulesList,
                    item,
                  ],
                }
              : sec
          ),
        }))
        return item.id
      },

      updateBusinessRule: (sectionId, ruleId, fieldOrUpdates, value) =>
        set((state) => {
          const updates =
            typeof fieldOrUpdates === 'string'
              ? { [fieldOrUpdates]: value }
              : fieldOrUpdates

          return {
            sections: state.sections.map((sec) =>
              sec.id === sectionId
                ? {
                    ...sec,
                    businessRulesList: sec.businessRulesList.map((br) =>
                      br.id === ruleId ? { ...br, ...updates } : br
                    ),
                  }
                : sec
            ),
          }
        }),

      removeBusinessRule: (sectionId, ruleId) =>
        set((state) => ({
          sections: state.sections.map((sec) =>
            sec.id === sectionId
              ? {
                  ...sec,
                  businessRulesList: sec.businessRulesList.filter(
                    (br) => br.id !== ruleId
                  ),
                }
              : sec
          ),
        })),

      addDataSource: (sectionId: string) => {
        const item = createEmptyDataSource()
        set((state) => ({
          sections: state.sections.map((sec) =>
            sec.id === sectionId
              ? {
                  ...sec,
                  dataSources: [...sec.dataSources, item],
                }
              : sec
          ),
        }))
        return item.id
      },

      updateDataSource: (sectionId, sourceId, fieldOrUpdates, value) =>
        set((state) => {
          const updates =
            typeof fieldOrUpdates === 'string'
              ? { [fieldOrUpdates]: value }
              : fieldOrUpdates

          return {
            sections: state.sections.map((sec) =>
              sec.id === sectionId
                ? {
                    ...sec,
                    dataSources: sec.dataSources.map((ds) =>
                      ds.id === sourceId ? { ...ds, ...updates } : ds
                    ),
                  }
                : sec
            ),
          }
        }),

      removeDataSource: (sectionId, sourceId) =>
        set((state) => ({
          sections: state.sections.map((sec) =>
            sec.id === sectionId
              ? {
                  ...sec,
                  dataSources: sec.dataSources.filter((ds) => ds.id !== sourceId),
                }
              : sec
          ),
        })),

      updatePoNotes: (sectionId, notes) =>
        set((state) => ({
          sections: state.sections.map((sec) =>
            sec.id === sectionId ? { ...sec, poNotes: notes } : sec
          ),
        })),

      resetSections: () =>
        set(() => ({
          sections: DEFAULT_PO_SECTIONS,
        })),
    }),
    {
      name: STORAGE_KEY_PO_SECTIONS,
      storage: createJSONStorage(() => localStorage),
      merge: (persistedState, currentState) => {
        const persisted = persistedState as Partial<PoExplainStoreState> | undefined
        if (!persisted || !Array.isArray(persisted.sections)) {
          return currentState
        }
        const mergedSections = currentState.sections.map((defSec) => {
          const found = persisted.sections?.find((s) => s.id === defSec.id)
          if (!found) return defSec
          return {
            ...defSec,
            ...found,
            dataSources: Array.isArray(found.dataSources) ? found.dataSources : [],
            acceptanceCriteriaList: Array.isArray(found.acceptanceCriteriaList)
              ? found.acceptanceCriteriaList
              : [],
            cornerCasesList: Array.isArray(found.cornerCasesList)
              ? found.cornerCasesList
              : [],
            businessRulesList: Array.isArray(found.businessRulesList)
              ? found.businessRulesList
              : [],
            poNotes: typeof found.poNotes === 'string' ? found.poNotes : '',
          }
        })
        return {
          ...currentState,
          sections: mergedSections,
        }
      },
    }
  )
)
