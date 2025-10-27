import type z from 'zod'

import type { chatMessageSchema, chatMessageTypeArray, chatRoomSchema } from './chatRoom.schemas'

export type chatRoom = z.infer<typeof chatRoomSchema>
export type MessageType = (typeof chatMessageTypeArray)[number]
export type Message = z.infer<typeof chatMessageSchema>
