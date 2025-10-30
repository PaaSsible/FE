import z from 'zod'

import { userSchema } from '../user/user.schemas'

export const chatRoomSchema = z.object({
  roomId: z.number(),
  roomName: z.string(),
  lastMessage: z.string().nullable(),
  lastMessageTime: z
    .preprocess((val) => (typeof val === 'string' ? new Date(val) : val), z.date())
    .nullable(),
  unreadCount: z.number(),
})

export const chatMessageTypeArray = ['TEXT', 'IMAGE', 'FILE', 'SYSTEM'] as const
export const chatMessageSchema = z.object({
  id: z.number(),
  roomId: chatRoomSchema.shape.roomId,
  senderId: userSchema.shape.id,
  senderName: userSchema.shape.nickname,
  senderImage: userSchema.shape.profileImageUrl,
  content: z.string(),
  type: z.enum(chatMessageTypeArray),
  createdAt: z.preprocess((val) => (typeof val === 'string' ? new Date(val) : val), z.date()),
  readCount: z.number(),
})

export const chatRoomMemberSchema = z.object({
  userId: userSchema.shape.id,
  nickname: userSchema.shape.nickname,
})
