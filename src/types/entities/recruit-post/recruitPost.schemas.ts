import z from 'zod'

import { activityTypeArray, detailTypeArray } from '../board/board.entities.schemas'
import { userSchema } from '../user/user.schemas'

export const stacksArray = [
  'JavaScript',
  'TypeScript',
  'React',
  'Vue',
  'NodeJS',
  'Spring',
  'Java',
  'NextJS',
  'Express',
  'Go',
  'C',
  'Python',
  'Django',
  'Swift',
  'Kotlin',
  'MySQL',
  'MongoDB',
  'PHP',
  'GraphQL',
  'Firebase',
  'ReactNative',
  'Unity',
  'Flutter',
  'AWS',
  'Kubernetes',
  'Docker',
  'Git',
  'Figma',
  'Zeplin',
  'Jest',
  'Svelte',
] as const

export const stackSchema = z
  .object({
    id: z.int().positive().min(1),
    name: z.enum(stacksArray),
  })
  .refine(({ id, name }) => id === stacksArray.indexOf(name) + 1, {
    error: 'id와 name 매핑이 올바르지 않습니다.',
  })

export const positionsArray = [
  '기획자',
  'PM',
  '마케터',
  '디자이너',
  '프론트엔드 개발자',
  '백엔드 개발자',
  'iOS',
  '안드로이드',
  '데브옵스',
  '기타',
]

export const positionSchema = z
  .object({
    id: z.int().positive().min(1),
    name: z.enum(positionsArray),
  })
  .refine(({ id, name }) => id === positionsArray.indexOf(name) + 1, {
    error: 'id와 name 매핑이 올바르지 않습니다.',
  })

export const projectDurationArray = [
  'UNDEFINED', //미정
  'ONE',
  'TWO',
  'THREE',
  'FOUR',
  'FIVE',
  'SIX',
  'LONG', //장기'
] as const

export const projectDurationSchema = z.enum(projectDurationArray)

export const recruitCommentSchema = z.object({
  id: z.number(),
  content: z.string().nullable(),
  writerId: userSchema.shape.id,
  writerName: userSchema.shape.nickname,
  deleted: z.boolean(),
  createdAt: z.string(),
  updatedAt: z.string(),
  parentId: z.number().optional(),
  get children() {
    return z.array(recruitCommentSchema)
  },
})

export const applicationStatusArray = ['PENDING', 'ACCEPTED', 'REJECTED'] as const
export const applicationSchema = z.object({
  id: z.number(),
  status: z.enum(applicationStatusArray),
  message: z.string().nullable(),
})

export const applicantSchema = z.object({
  applicantId: userSchema.shape.id,
  applicantName: userSchema.shape.nickname,
  university: z.string().nullable(),
  major: z.string().nullable(),
  positionName: z.string().nullable(),
  stackNames: z.array(stackSchema.shape.name),
})

export const recruitPostSchema = z.object({
  mainCategory: z.enum(activityTypeArray),
  subCategory: z.enum(detailTypeArray),
  postId: z.number(),
  title: z.string().min(1, { error: '제목은 최소 1자 이상이여야합니다.' }),
  content: z.string().min(1, { error: '내용은 최소 1자 이상이여야합니다.' }),
  createdAt: z.string().optional().nullable(),
  updatedAt: z.string().optional().nullable(),
  deadline: z.iso.date(),
  projectDuration: z.enum(projectDurationArray),
  writerId: userSchema.shape.id,
  writerName: userSchema.shape.nickname,
  viewCount: z.number(),
  applicationCount: z.number(),
  recruits: z
    .array(
      z.object({
        position: positionSchema.shape.id,
        stacks: z.array(stackSchema.shape.id),
      }),
    )
    .default([]),
})
