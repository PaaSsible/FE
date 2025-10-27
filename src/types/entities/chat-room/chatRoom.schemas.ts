import z from 'zod'

import { userSchema } from '../user/user.schemas'

export const chatRoomSchema = z.object({
  roomId: z.number(),
  roomName: z.string(),
  lastMessage: z.string(),
  lastMessageTime: z.preprocess((val) => (typeof val === 'string' ? new Date(val) : val), z.date()),
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
  createAt: z.preprocess((val) => (typeof val === 'string' ? new Date(val) : val), z.date()),
  readCount: z.number(),
})
