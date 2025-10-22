import { create } from 'zustand'

const getDefaultDeadline = (): Date => {
  const date = new Date()
  date.setDate(date.getDate() + 14)
  return date
}

interface RecruitmentItem {
  position: number | null
  stacks: number[]
}

interface BoardFormState {
  mainCategory: string
  subCategory: string
  deadline: Date | null
  projectDuration: string | null
  recruitment: RecruitmentItem[]
  title: string
  content: string
  setMainCategory: (mainCategory: string) => void
  setSubCategory: (subCategory: string) => void
  setDeadline: (deadline: Date | null) => void
  setProjectDuration: (duration: string | null) => void
  setRecruitment: (recruitment: RecruitmentItem[]) => void
  setTitle: (title: string) => void
  setContent: (content: string) => void
  reset: () => void
}

export const useBoardFormStore = create<BoardFormState>((set) => ({
  mainCategory: 'CONTEST',
  subCategory: 'CONTEST_PLANNING',
  deadline: getDefaultDeadline(),
  projectDuration: null,
  recruitment: [{ position: null, stacks: [] }],
  title: '',
  content: '',
  setMainCategory: (mainCategory) => set({ mainCategory }),
  setSubCategory: (subCategory) => set({ subCategory }),
  setDeadline: (deadline) => set({ deadline }),
  setProjectDuration: (duration) => set({ projectDuration: duration }),
  setRecruitment: (recruitment) => set({ recruitment }),
  setTitle: (title) => set({ title }),
  setContent: (content) => set({ content }),
  reset: () =>
    set({
      mainCategory: 'CONTEST',
      subCategory: 'CONTEST_PLANNING',
      deadline: getDefaultDeadline(),
      projectDuration: null,
      recruitment: [{ position: null, stacks: [] }],
      title: '',
      content: '',
    }),
}))
