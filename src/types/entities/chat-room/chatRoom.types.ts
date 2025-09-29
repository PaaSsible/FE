import type z from 'zod'

import type { chatRoomSchema, messageTypeArray, messageSchema } from './chatRoom.schemas'

export type ChatRooom = z.infer<typeof chatRoomSchema>
export type MessageType = (typeof messageTypeArray)[number]
export type Message = z.infer<typeof messageSchema>
