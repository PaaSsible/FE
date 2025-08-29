import z from 'zod'

export const chatRoomSchema = z.object({
  id: z.bigint(),
  name: z.string(),
  isGroup: z.boolean(),
  isDeleted: z.boolean(),
})

export const messageTypeArray = ['TEXT', 'IMAGE', 'FILE'] as const
export const messageSchema = z.object({
  id: z.bigint(),
  content: z.string(),
  fileUrl: z.url().nullable(),
  type: z.enum(messageTypeArray),
})
