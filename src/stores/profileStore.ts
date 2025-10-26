import { create } from 'zustand'

interface Portfolio {
  id: number
  userId?: number
  title: string
  summary: string | null | undefined
  contribution: number | null
  mainCategory: string | null
  subCategory: string | null
  positionName: string
  tag: string | null
  createdAt: string
  generatedByAi?: boolean
}

interface Profile {
  id: number | null
  nickname: string
  positionName: string
  university: string
  stackNames: string[]
  introductionTitle: string
  introductionContent: string
  portfolios: Portfolio[]
}

interface ProfileStore {
  profile: Profile | null
  setProfileInfo: (info: Omit<Profile, 'portfolios'>) => void
  setProfilePortfolios: (portfolios: Portfolio[]) => void
  clearProfile: () => void
}

export const useProfileStore = create<ProfileStore>((set) => ({
  profile: null,

  setProfileInfo: (info) =>
    set((state) => ({
      profile: state.profile ? { ...state.profile, ...info } : { ...info, portfolios: [] }, // 초기값 없을 경우 portfolios 빈 배열
    })),

  setProfilePortfolios: (portfolios) =>
    set((state) => ({
      profile: state.profile ? { ...state.profile, portfolios } : null,
    })),

  clearProfile: () => set({ profile: null }),
}))
