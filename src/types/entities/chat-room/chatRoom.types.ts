import type { chatRoomSchema, messageSchema, messageTypeArray } from './chatRoom.schema'

export type ChatRooom = z.infer<typeof chatRoomSchema>
export type MessageType = (typeof messageTypeArray)[number]
export type Message = z.infer<typeof messageSchema>
