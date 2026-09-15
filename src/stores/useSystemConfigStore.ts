import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

export type SystemDataScope = 'personal' | 'branch'

export interface StaffOption {
  id: string
  name: string
  role: string
  branch: string
  team: string
}

export const SIMULATED_STAFF_LIST: StaffOption[] = [
  {
    id: 'staff-1',
    name: 'Nguyễn Thị Ngọc Anh',
    role: 'Chuyên viên Tái phí & CSKH',
    branch: 'RinoEdu Linh Đàm',
    team: 'Tổ Chăm sóc Station 1',
  },
  {
    id: 'staff-2',
    name: 'Trần Thảo Anh 20',
    role: 'Chuyên viên Tái phí',
    branch: 'RinoEdu Nguyễn Tuân',
    team: 'Tổ Chăm sóc Station 1',
  },
  {
    id: 'staff-3',
    name: 'Lê Hoàng Long',
    role: 'Chuyên viên Tái phí & Tuyển sinh',
    branch: 'RinoEdu Smart City',
    team: 'Tổ Chăm sóc Station 2',
  },
]

export const SIMULATED_BRANCH_LIST: string[] = [
  'RinoEdu Nguyễn Tuân',
  'RinoEdu Linh Đàm',
  'RinoEdu Smart City',
]

export const SIMULATED_TEAM_LIST: Array<{ id: string; name: string; members: string[] }> = [
  {
    id: 'team-1',
    name: 'Tổ Chăm sóc Station 1',
    members: ['Nguyễn Thị Ngọc Anh', 'Trần Thảo Anh 20'],
  },
  {
    id: 'team-2',
    name: 'Tổ Chăm sóc Station 2',
    members: ['Lê Hoàng Long'],
  },
]

export interface ScopeDefinition {
  id: SystemDataScope
  label: string
  badgeLabel: string
  description: string
  ruleDetail: string
  iconName: 'user' | 'building'
}

export const SCOPE_DEFINITIONS: ScopeDefinition[] = [
  {
    id: 'personal',
    label: 'Cá nhân (Bản thân)',
    badgeLabel: 'Cá nhân',
    description: 'Chỉ truy cập và xử lý dữ liệu học viên do chính mình phụ trách.',
    ruleDetail: 'Hệ thống chỉ hiển thị học viên có người phụ trách (csStaff) khớp với chuyên viên đang đăng nhập.',
    iconName: 'user',
  },
  {
    id: 'branch',
    label: 'Cơ sở',
    badgeLabel: 'Cơ sở',
    description: 'Truy cập toàn bộ dữ liệu học viên thuộc cơ sở / chi nhánh công tác.',
    ruleDetail: 'Hệ thống hiển thị học viên đang theo học tại chi nhánh công tác, không phân biệt người phụ trách.',
    iconName: 'building',
  },
]

interface SystemConfigState {
  dataScope: SystemDataScope
  currentStaffName: string
  currentBranch: string
  currentTeam: string
  setDataScope: (scope: SystemDataScope) => void
  setCurrentStaffName: (staffName: string) => void
  setCurrentBranch: (branch: string) => void
  setCurrentTeam: (team: string) => void
  resetToDefaults: () => void
}

const DEFAULT_STATE = {
  dataScope: 'personal' as SystemDataScope,
  currentStaffName: 'Nguyễn Thị Ngọc Anh',
  currentBranch: 'RinoEdu Linh Đàm',
  currentTeam: 'Tổ Chăm sóc Station 1',
}

export const useSystemConfigStore = create<SystemConfigState>()(
  persist(
    (set) => ({
      ...DEFAULT_STATE,

      setDataScope: (scope: SystemDataScope) => {
        set({ dataScope: scope })
      },

      setCurrentStaffName: (staffName: string) => {
        const staff = SIMULATED_STAFF_LIST.find((s) => s.name === staffName)
        if (staff) {
          set({
            currentStaffName: staff.name,
            currentBranch: staff.branch,
            currentTeam: staff.team,
          })
        } else {
          set({ currentStaffName: staffName })
        }
      },

      setCurrentBranch: (branch: string) => {
        set({ currentBranch: branch })
      },

      setCurrentTeam: (team: string) => {
        set({ currentTeam: team })
      },

      resetToDefaults: () => {
        set({ ...DEFAULT_STATE })
      },
    }),
    {
      name: 'rinov5-system-data-scope',
      storage: createJSONStorage(() => localStorage),
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      migrate: (persistedState: any) => {
        if (
          persistedState &&
          persistedState.dataScope &&
          persistedState.dataScope !== 'personal' &&
          persistedState.dataScope !== 'branch'
        ) {
          persistedState.dataScope = 'personal'
        }
        return persistedState
      },
    }
  )
)
