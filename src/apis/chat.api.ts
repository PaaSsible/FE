import type { M } from 'vitest/dist/chunks/reporters.d.BFLkQcL6.js'

import PaaSsibleChat from '@/config/interceptors/chat.interceptor'
import * as chatApiSchemas from '@/types/apis/chat/chat.api.schemas'
import * as ChatApiTypes from '@/types/apis/chat/chat.api.types'

/**
 * @name 채팅방 목록 조회
 * @method GET
 * @path `/boards/{boardId}/chats/rooms`
 */
export const getChatRooms = async (
  path: ChatApiTypes.GetChatRooms['Path'],
): Promise<ChatApiTypes.GetChatRooms['Response']> => {
  const parsedPath = chatApiSchemas.getChatRoomsSchema.path.parse(path)
  const res = await PaaSsibleChat.get(`/boards/${parsedPath.boardId}/chats/rooms`)
  return chatApiSchemas.getChatRoomsSchema.response.parse(res.data)
}

/**
 * @name 채팅방 생성
 * @method POST
 * @path `/boards/{boardId}/chats/rooms`
 */
export const postChatRoom = async (
  path: ChatApiTypes.PostChatRoom['Path'],
  body: ChatApiTypes.PostChatRoom['Body'],
): Promise<ChatApiTypes.PostChatRoom['Response']> => {
  const parsedPath = chatApiSchemas.postChatRoomSchema.path.parse(path)
  const parsedBody = chatApiSchemas.postChatRoomSchema.body.parse(body)
  const res = await PaaSsibleChat.post(`/boards/${parsedPath.boardId}/chats/rooms`, parsedBody)
  return chatApiSchemas.postChatRoomSchema.response.parse(res.data)
}

/**
 * @name 채팅방 퇴장
 * @method DELETE
 * @path `/boards/{boardId}/chats/rooms/{roomId}`
 */
export const deleteChatRoom = async (
  path: ChatApiTypes.DeleteChatRoom['Path'],
): Promise<ChatApiTypes.DeleteChatRoom['Response']> => {
  const parsedPath = chatApiSchemas.deleteChatRoomSchema.path.parse(path)
  const res = await PaaSsibleChat.delete(
    `/boards/${parsedPath.boardId}/chats/rooms/${parsedPath.roomId}`,
  )
  return chatApiSchemas.deleteChatRoomSchema.response.parse(res.data)
}

/**
 * @name 채팅방 팀원 초대
 * @method POST
 * @path `/boards/{boardId}/chats/rooms/{roomId}/invite`
 */
export const postChatRoomInvitation = async (
  path: ChatApiTypes.PostChatRoomInvitation['Path'],
): Promise<ChatApiTypes.PostChatRoomInvitation['Response']> => {
  const parsedPath = chatApiSchemas.postChatRoomInvitationSchema.path.parse(path)
  const res = await PaaSsibleChat.post(
    `/boards/${parsedPath.boardId}/chats/rooms/${parsedPath.roomId}/invite`,
  )
  return chatApiSchemas.postChatRoomInvitationSchema.response.parse(res.data)
}

/**
 * @name 채팅방 메시지 목록 조회
 * @method GET
 * @path `/chats/rooms/{roomId}/messages`
 */
export const getChatRoomMessages = async (
  path: ChatApiTypes.GetChatRoomMessages['Path'],
  query: ChatApiTypes.GetChatRoomMessages['Query'],
): Promise<ChatApiTypes.GetChatRoomMessages['Response']> => {
  const parsedPath = chatApiSchemas.getChatRoomMessagesSchema.path.parse(path)
  const parsedQuery = chatApiSchemas.getChatRoomMessagesSchema.query.parse(query)
  const res = await PaaSsibleChat.get(`/chats/rooms/${parsedPath.roomId}/messages`, {
    params: parsedQuery,
  })
  return chatApiSchemas.getChatRoomMessagesSchema.response.parse(res.data)
}

/**
 * @name 채팅방 메시지 검색
 * @method GET
 * @path `/chats/rooms/{roomId}/search`
 */
export const getChatRoomMessagesWithSearchValue = async (
  path: ChatApiTypes.GetChatRoomMessagesWithSearchValue['Path'],
  query: ChatApiTypes.GetChatRoomMessagesWithSearchValue['Query'],
): Promise<ChatApiTypes.GetChatRoomMessagesWithSearchValue['Response']> => {
  const parsedPath = chatApiSchemas.getChatRoomMessagesWithSearchValueSchema.path.parse(path)
  const parsedQuery = chatApiSchemas.getChatRoomMessagesWithSearchValueSchema.query.parse(query)
  const res = await PaaSsibleChat.get(`/chats/rooms/${parsedPath.roomId}/search`, {
    params: parsedQuery,
  })
  return chatApiSchemas.getChatRoomMessagesWithSearchValueSchema.response.parse(res.data)
}

/**
 * @name 채팅방 메시지 검색 조회
 * @method GET
 * @path `/chats/rooms/{roomId}/messages/{messageId}/around`
 */
export const getChatRoomAroundMessages = async (
  path: ChatApiTypes.GetChatRoomAroundMessages['Path'],
  query: ChatApiTypes.GetChatRoomAroundMessages['Query'],
): Promise<ChatApiTypes.GetChatRoomAroundMessages['Response']> => {
  const parsedPath = chatApiSchemas.getChatRoomAroundMessagesSchema.path.parse(path)
  const parsedQuery = chatApiSchemas.getChatRoomAroundMessagesSchema.query.parse(query)
  const res = await PaaSsibleChat.get(
    `/chats/rooms/${parsedPath.roomId}/messages/${parsedPath.messageId}/around`,
    { params: parsedQuery },
  )
  return chatApiSchemas.getChatRoomAroundMessagesSchema.response.parse(res.data)
}

/**
 * @name 메시지 일괄 읽음 처리
 * @method PATCH
 * @path `/chats/rooms/{roomId}/read-all`
 */
export const patchChatRoomMessageReadAll = async (
  path: ChatApiTypes.PatchChatRoomMessageReadAll['Path'],
  body: ChatApiTypes.PatchChatRoomMessageReadAll['Body'],
): Promise<ChatApiTypes.PatchChatRoomMessageReadAll['Response']> => {
  const parsedPath = chatApiSchemas.patchChatRoomMessageReadAllSchema.path.parse(path)
  const parsedBody = chatApiSchemas.patchChatRoomMessageReadAllSchema.body.parse(body)
  const res = await PaaSsibleChat.patch(`/chats/rooms/${parsedPath.roomId}/read-all`, parsedBody)
  return chatApiSchemas.patchChatRoomMessageReadAllSchema.response.parse(res.data)
}

/**
 * @name 메시지 읽음 상세
 * @method GET
 * @path `/chats/rooms/{roomId}/messages/{messageId}/reads`
 */
export const getChatRoomMessageReadUser = async (
  path: ChatApiTypes.GetChatRoomReadUser['Path'],
): Promise<ChatApiTypes.GetChatRoomReadUser['Response']> => {
  const parsedPath = chatApiSchemas.getChatRoomMessageReadUserSchema.path.parse(path)
  const res = await PaaSsibleChat.get(
    `/chats/rooms/${parsedPath.roomId}/messages/${parsedPath.messageId}/reads`,
  )
  return chatApiSchemas.getChatRoomMessageReadUserSchema.response.parse(res.data)
}

/**
 * @name 파일/이미지 업로드
 * @method POST
 * @path `/chats/upload`
 */
export const postChatRoomImageUpload = async (
  query: ChatApiTypes.PostChatRoomImageUpload['Query'],
): Promise<ChatApiTypes.PostChatRoomImageUpload['Response']> => {
  const parsedQuery = chatApiSchemas.postChatRoomImageUploadSchema.query.parse(query)
  const res = await PaaSsibleChat.post(`/chats/upload`, {}, { params: parsedQuery })
  return chatApiSchemas.postChatRoomImageUploadSchema.response.parse(res.data)
}
