import type z from 'zod'

import type {
  chatMessageSchema,
  chatMessageTypeArray,
  chatRoomMemberSchema,
  chatRoomSchema,
} from './chatRoom.schemas'

export type ChatRoom = z.infer<typeof chatRoomSchema>
export type MessageType = (typeof chatMessageTypeArray)[number]
export type Message = z.infer<typeof chatMessageSchema>
export type ChatRoomMember = z.infer<typeof chatRoomMemberSchema>
