import z from 'zod'

import { boardSchema } from '@/types/entities/board/board.entities.schemas'
import {
  chatMessageSchema,
  chatMessageTypeArray,
  chatRoomSchema,
} from '@/types/entities/chat-room/chatRoom.schemas'
import { userSchema } from '@/types/entities/user/user.schemas'

/**
 * @name 채팅방 목록 조회
 * @method GET
 * @path `/boards/{boardId}/chats/rooms`
 */
export const getChatRoomsSchema = {
  path: z.object({
    boardId: boardSchema.shape.boardId,
  }),
  response: z.object({
    success: z.boolean(),
    message: z.string(),
    data: z.array(chatRoomSchema),
    code: z.string(),
    errors: z.string().nullable(),
  }),
}

/**
 * @name 채팅방 생성
 * @method POST
 * @path `/boards/{boardId}/chats/rooms`
 */
export const postChatRoomSchema = {
  path: z.object({
    boardId: boardSchema.shape.boardId,
  }),
  body: z.object({
    participantIds: z.array(userSchema.shape.id),
  }),
  response: z.object({
    success: z.boolean(),
    message: z.string(),
    data: z.object({ roomId: chatRoomSchema.shape.roomId }),
    code: z.string(),
    errors: z.null(),
  }),
}

/**
 * @name 채팅방 퇴장
 * @method DELETE
 * @path `/boards/{boardId}/chats/rooms/{roomId}`
 */
export const deleteChatRoomSchema = {
  path: z.object({
    boardId: boardSchema.shape.boardId,
    roomId: chatRoomSchema.shape.roomId,
  }),
  response: z.object({
    success: z.boolean(),
    message: z.string(),
    data: z.null(),
    code: z.string(),
    errors: z.null(),
  }),
}

/**
 * @name 채팅방 팀원 초대
 * @method POST
 * @path `/boards/{boardId}/chats/rooms/{roomId}/invite`
 */
export const postChatRoomInvitationSchema = {
  path: z.object({
    boardId: boardSchema.shape.boardId,
    roomId: chatRoomSchema.shape.roomId,
  }),
  body: z.object({
    participantIds: z.array(userSchema.shape.id),
  }),
  response: z.object({
    success: z.boolean(),
    message: z.string(),
    data: z.null(),
    code: z.string(),
    errors: z.null(),
  }),
}

export const paginationDirectionArray = ['up', 'down'] as const

/**
 * @name 채팅방 메시지 목록 조회
 * @method GET
 * @path `/chats/rooms/{roomId}/messages`
 */
export const getChatRoomMessagesSchema = {
  path: z.object({
    roomId: chatRoomSchema.shape.roomId,
  }),
  query: z.object({
    page: z.number(),
    size: z.number().optional(),
  }),
  response: z.object({
    success: z.boolean(),
    message: z.string(),
    data: z.object({
      messages: z.array(chatMessageSchema).optional().default([]),
      currentPage: z.number(),
      hasNext: z.boolean(),
      hasPrevious: z.boolean(),
      size: z.number(),
      totalElements: z.number(),
      totalPages: z.number(),
    }),
    code: z.string(),
    errors: z.null(),
  }),
}

/**
 * @name 채팅방 메시지 검색
 * @method GET
 * @path `/chats/rooms/{roomId}/search`
 */
export const getChatRoomMessagesWithSearchValueSchema = {
  path: z.object({
    roomId: chatRoomSchema.shape.roomId,
  }),
  query: z.object({
    keyword: z.string(),
  }),
  response: z.object({
    success: z.boolean(),
    message: z.string(),
    data: z.object({
      total: z.number(),
      messageIds: z.array(chatMessageSchema.shape.id),
    }),
    code: z.string(),
    errors: z.null(),
  }),
}

/**
 * @name 채팅방 메시지 검색 조회
 * @method GET
 * @path `/chats/rooms/{roomId}/messages/{messageId}/around`
 */
export const getChatRoomAroundMessagesSchema = {
  path: z.object({
    roomId: chatRoomSchema.shape.roomId,
    messageId: chatMessageSchema.shape.id,
  }),
  query: z.object({
    limit: z.number().default(2),
  }),
  response: z.object({
    success: z.boolean(),
    message: z.string(),
    data: z.object({
      content: z.array(chatMessageSchema),
      nextCursor: z.number(),
      hasNext: z.boolean(),
    }),
    code: z.string(),
    errors: z.null(),
  }),
}

/**
 * @name 메시지 일괄 읽음 처리
 * @method PATCH
 * @path `/chats/rooms/{roomId}/read-all`
 */
export const patchChatRoomMessageReadAllSchema = {
  path: z.object({
    roomId: chatRoomSchema.shape.roomId,
  }),
  body: z.object({
    messageId: chatMessageSchema.shape.id,
  }),
  response: z.object({
    success: z.boolean(),
    message: z.string(),
    data: z.null(),
    code: z.string(),
    errors: z.null(),
  }),
}

/**
 * @name 메시지 읽음 상세
 * @method GET
 * @path `/chats/rooms/{roomId}/messages/{messageId}/reads`
 */
export const getChatRoomMessageReadUserSchema = {
  path: z.object({
    roomId: chatRoomSchema.shape.roomId,
    messageId: chatMessageSchema.shape.id,
  }),

  response: z.object({
    success: z.boolean(),
    message: z.string(),
    data: z.object({
      messageId: chatMessageSchema.shape.id,
      readCount: z.number(),
      readUsers: z.array(z.object({ nickname: userSchema.shape.nickname })),
    }),
    code: z.string(),
    errors: z.null(),
  }),
}

// 멀티 파트 확인 후 수정 필요
/**
 * @name 파일/이미지 업로드
 * @method POST
 * @path `/chats/upload`
 */
export const postChatRoomImageUploadSchema = {
  query: z.object({ type: z.enum(chatMessageTypeArray) }),
  response: z.object({
    success: z.boolean(),
    message: z.string(),
    data: z.object({
      type: z.enum(chatMessageTypeArray),
      url: z.string(),
    }),
    code: z.string(),
    errors: z.null(),
  }),
}

/**
 * @name 메시지 전송
 * @method SEND
 * @protocol WebSocket
 * @path `/app/chats/rooms/{roomId}`
 */
export const sendChatRoomMessageSchema = {
  path: z.object({
    roomId: chatRoomSchema.shape.roomId,
  }),
  request: z.object({
    content: chatMessageSchema.shape.content,
    type: z.enum(chatMessageTypeArray),
  }),
}

/**
 * @name 메시지 읽음
 * @method SEND
 * @protocol WebSocket
 * @path `/app/chats/rooms/{roomId}/read`
 */
export const readChatRoomMessageSchema = {
  path: z.object({
    roomId: chatRoomSchema.shape.roomId,
  }),
  request: z.object({
    messageId: chatMessageSchema.shape.id,
  }),
}

/**
 * @name 채팅방 메시지 구독
 * @method SUBSCRIBE
 * @protocol WebSocket
 * @path `/topic/chats/rooms/{roomId}`
 */
export const subscribeChatRoomMessageSchema = {
  path: z.object({
    roomId: chatRoomSchema.shape.roomId,
  }),
  response: chatMessageSchema,
}

/**
 * @name 채팅방 시스템 메시지 구독
 * @method SUBSCRIBE
 * @protocol WebSocket
 * @path `/topic/chats/rooms/{roomId}/system`
 * @description 채팅방 내 시스템 알림 메시지(입장, 퇴장 등)를 수신
 */
export const subscribeChatRoomSystemMessageSchema = {
  path: z.object({
    roomId: chatRoomSchema.shape.roomId,
  }),
  response: chatMessageSchema.pick({
    id: true,
    roomId: true,
    content: true,
    type: true,
    createAt: true,
  }),
}

export const chatReadTypeArray = ['MESSAGE_READ', 'MESSAGE_READ_ALL'] as const
const messageReadSchema = z.object({
  type: z.literal('MESSAGE_READ'),
  userId: z.number(),
  messageId: z.number(),
})

const messagesReadAllSchema = z.object({
  type: z.literal('MESSAGES_READ_ALL'),
  userId: z.number(),
  oldLastReadMessageId: z.number(),
  newLastReadMessageId: z.number(),
})

/**
 * @name 채팅방 읽음 상태 구독
 * @method SUBSCRIBE
 * @protocol WebSocket
 * @path `/topic/chats/rooms/{roomId}/read`
 * @description 채팅방 내 읽음 처리 */
export const subscribeChatRoomMessageReadSchema = {
  path: z.object({
    roomId: chatRoomSchema.shape.roomId,
  }),
  response: z.discriminatedUnion('type', [messageReadSchema, messagesReadAllSchema]),
}
