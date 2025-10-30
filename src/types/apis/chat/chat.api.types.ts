import type z from 'zod'

import * as chatApiSchema from './chat.api.schemas'

export type GetChatRooms = {
  Path: z.infer<(typeof chatApiSchema)['getChatRoomsSchema']['path']>
  Response: z.infer<(typeof chatApiSchema)['getChatRoomsSchema']['response']>
}

export type PostChatRoom = {
  Path: z.infer<(typeof chatApiSchema)['postChatRoomSchema']['path']>
  Body: z.infer<(typeof chatApiSchema)['postChatRoomSchema']['body']>
  Response: z.infer<(typeof chatApiSchema)['postChatRoomSchema']['response']>
}

export type DeleteChatRoom = {
  Path: z.infer<(typeof chatApiSchema)['deleteChatRoomSchema']['path']>
  Response: z.infer<(typeof chatApiSchema)['deleteChatRoomSchema']['response']>
}

export type PostChatRoomInvitation = {
  Path: z.infer<(typeof chatApiSchema)['postChatRoomInvitationSchema']['path']>
  Body: z.infer<(typeof chatApiSchema)['postChatRoomInvitationSchema']['body']>
  Response: z.infer<(typeof chatApiSchema)['postChatRoomInvitationSchema']['response']>
}

export type GetChatRoomInvitationAvailableMember = {
  Path: z.infer<(typeof chatApiSchema)['getChatRoomInvitationAvailableMemberSchema']['path']>
  Response: z.infer<
    (typeof chatApiSchema)['getChatRoomInvitationAvailableMemberSchema']['response']
  >
}

export type GetChatRoomMember = {
  Path: z.infer<(typeof chatApiSchema)['getChatRoomMemberSchema']['path']>
  Response: z.infer<(typeof chatApiSchema)['getChatRoomMemberSchema']['response']>
}

export type GetChatRoomMessages = {
  Path: z.infer<(typeof chatApiSchema)['getChatRoomMessagesSchema']['path']>
  Query: z.infer<(typeof chatApiSchema)['getChatRoomMessagesSchema']['query']>
  Response: z.infer<(typeof chatApiSchema)['getChatRoomMessagesSchema']['response']>
}

export type GetChatRoomMessagesWithSearchValue = {
  Path: z.infer<(typeof chatApiSchema)['getChatRoomMessagesWithSearchValueSchema']['path']>
  Query: z.infer<(typeof chatApiSchema)['getChatRoomMessagesWithSearchValueSchema']['query']>
  Response: z.infer<(typeof chatApiSchema)['getChatRoomMessagesWithSearchValueSchema']['response']>
}

export type GetChatRoomAroundMessages = {
  Path: z.infer<(typeof chatApiSchema)['getChatRoomAroundMessagesSchema']['path']>
  Query: z.infer<(typeof chatApiSchema)['getChatRoomAroundMessagesSchema']['query']>
  Response: z.infer<(typeof chatApiSchema)['getChatRoomAroundMessagesSchema']['response']>
}

export type PatchChatRoomMessageReadAll = {
  Path: z.infer<(typeof chatApiSchema)['patchChatRoomMessageReadAllSchema']['path']>
  Body: z.infer<(typeof chatApiSchema)['patchChatRoomMessageReadAllSchema']['body']>
  Response: z.infer<(typeof chatApiSchema)['patchChatRoomMessageReadAllSchema']['response']>
}

export type GetChatRoomReadUser = {
  Path: z.infer<(typeof chatApiSchema)['getChatRoomMessageReadUserSchema']['path']>
  Response: z.infer<(typeof chatApiSchema)['getChatRoomMessageReadUserSchema']['response']>
}

export type PostChatRoomImageUpload = {
  Query: z.infer<(typeof chatApiSchema)['postChatRoomImageUploadSchema']['query']>
  Response: z.infer<(typeof chatApiSchema)['postChatRoomImageUploadSchema']['response']>
}

/**WEBSOCKET */
export type SendChatRoomMessage = {
  Path: z.infer<(typeof chatApiSchema)['sendChatRoomMessageSchema']['path']>
  Response: z.infer<(typeof chatApiSchema)['sendChatRoomMessageSchema']['request']>
}

export type ReadChatRoomMessage = {
  Path: z.infer<(typeof chatApiSchema)['readChatRoomMessageSchema']['path']>
  Request: z.infer<(typeof chatApiSchema)['readChatRoomMessageSchema']['request']>
}

export type SubscribeChatRoomMessage = {
  Path: z.infer<(typeof chatApiSchema)['subscribeChatRoomMessageSchema']['path']>
  Response: z.infer<(typeof chatApiSchema)['subscribeChatRoomMessageSchema']['response']>
}

export type SubscribeChatRoomSystemMessage = {
  Path: z.infer<(typeof chatApiSchema)['subscribeChatRoomSystemMessageSchema']['path']>
  Response: z.infer<(typeof chatApiSchema)['subscribeChatRoomSystemMessageSchema']['response']>
}

export type SubScribeChatRoomMessageRead = {
  Path: z.infer<(typeof chatApiSchema)['subscribeChatRoomMessageReadSchema']['path']>
  Response: z.infer<(typeof chatApiSchema)['subscribeChatRoomMessageReadSchema']['response']>
}
