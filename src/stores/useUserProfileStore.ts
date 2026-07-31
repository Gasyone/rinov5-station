import { create } from 'zustand'

export type UserProfileType = 'teacher' | 'student' | 'parent' | 'staff'

interface UserProfileState {
  isOpen: boolean
  userId: string | null
  userType: UserProfileType | null
  openProfile: (userId: string, userType: UserProfileType) => void
  closeProfile: () => void
}

export const useUserProfileStore = create<UserProfileState>((set) => ({
  isOpen: false,
  userId: null,
  userType: null,

  openProfile: (userId: string, userType: UserProfileType) => {
    set({ isOpen: true, userId, userType })
  },

  closeProfile: () => {
    set({ isOpen: false, userId: null, userType: null })
  },
}))
