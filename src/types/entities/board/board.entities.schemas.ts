import z from 'zod'

import { userSchema } from '../user/user.schemas'

export const boardStatusArray = ['ONGOING', 'COMPLETED'] as const
export const activityTypeArray = ['CONTEST', 'SIDE_PROJECT', 'STUDY', 'ETC'] as const
export const detailTypeArray = [
  // CONTEST만 해당
  'CONTEST_PLANNING',
  'CONTEST_PLANNING_DESIGN',
  'CONTEST_DESIGN',
  'CONTEST_DEV',
  'CONTEST_MIXED',
  'CONTEST_ETC',
  // STUDY만 해당
  'STUDY_PLANNING',
  'STUDY_DESIGN',
  'STUDY_FE',
  'STUDY_BE',
  'STUDY_ETC',
] as const
export const boardSchema = z.object({
  id: z.number(),
  name: z.string(),
  activityType: z.string().nullable(),
  detailType: z.string().nullable(),
  status: z.enum(boardStatusArray),
  owner: z.string(),
})

export const boardMemberSchema = z.object({
  userId: userSchema.shape.id,
  userName: userSchema.shape.nickname,
  profileImageUrl: userSchema.shape.profileImageUrl,
  role: z.string(),
})

export const linkSchema = z.object({ id: z.number(), title: z.string(), url: z.url() })

export const taskStatusArray = ['PENDING', 'ONGOING', 'COMPLETED'] as const
export const taskSchema = z.object({
  id: z.number(),
  title: z.string(),
  description: z.string().nullable(),
  dueDate: z.string(),
  status: z.enum(taskStatusArray),
  boardId: boardSchema.shape.id,
  assignee: z.array(z.object({ userId: userSchema.shape.id, name: userSchema.shape.nickname })),
  positions: z.array(z.string()), // '백엔드', '프론트엔드', '디자이너' ...
})

export const commentSchema = z.object({
  id: z.number(),
  taskId: taskSchema.shape.id,
  userId: userSchema.shape.id,
  userName: userSchema.shape.nickname,
  profileImageUrl: userSchema.shape.profileImageUrl,
  comment: z.string(),
  createdAt: z.string(),
})

export const meetingSchema = z.object({ id: z.number(), title: z.string(), content: z.string() })
