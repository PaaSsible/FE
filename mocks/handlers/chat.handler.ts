/* eslint-disable @typescript-eslint/no-unused-vars */
import { http, HttpResponse, type HttpHandler } from 'msw'

import * as ChatAPITypes from '@/types/apis/chat/chat.api.types'

const API_URL = import.meta.env.VITE_API_CHAT_URL
const BOARD_API_URL = import.meta.env.VITE_API_BOARD_URL

export const chatHandlers: HttpHandler[] = [
  /**
   * @name 채팅방 팀원 초대
   */
  http.get<{ boardId: string; roomId: string }>(
    `${BOARD_API_URL}/boards/:boardId/chats/rooms/:roomId/invite`,
    async ({ params, request }) => {
      const { boardId, roomId } = params
      const body = (await request.clone().json()) as ChatAPITypes.PostChatRoomInvitation['Body']

      const data: ChatAPITypes.PostChatRoomInvitation['Response'] = {
        success: true,
        message: '채팅방에 초대되었습니다.',
        data: null,
        code: 'INVITED',
        errors: null,
      }
      return HttpResponse.json(data)
    },
  ),

  /**
   * @name 채팅방 목록 조회
   */
  http.get<{ boardId: string }>(`${BOARD_API_URL}/boards/:boardId/chats/rooms`, ({ params }) => {
    const { boardId } = params
    const data: ChatAPITypes.GetChatRooms['Response'] = {
      success: true,
      message: '요청이 성공적으로 처리되었습니다.',
      data: [
        {
          roomId: 8,
          roomName: '홍길동',
          lastMessage: 'message 2',
          lastMessageTime: new Date('2025-10-15T14:43:23'),
          unreadCount: 2,
        },
        {
          roomId: 9,
          roomName: '홍길동, 박우진',
          lastMessage: 'message 3',
          lastMessageTime: new Date('2025-10-15T14:43:23'),
          unreadCount: 3,
        },
        {
          roomId: 10,
          roomName: '박우진',
          lastMessage: 'message 6',
          lastMessageTime: new Date('2025-10-15T14:43:23'),
          unreadCount: 2,
        },
      ],
      code: 'OK',
      errors: null,
    }
    return HttpResponse.json(data)
  }),

  /**
   * @name 채팅방 생성
   */
  http.post<{ boardId: string }>(
    `${API_URL}/boards/:boardId/chats/rooms`,
    async ({ request, params }) => {
      const { boardId } = params
      const body = (await request.clone().json()) as ChatAPITypes.PostChatRoom['Body']

      const data: ChatAPITypes.PostChatRoom['Response'] = {
        success: true,
        message: '리소스가 생성되었습니다.',
        data: null,
        code: 'CREATED',
        errors: null,
      }

      return HttpResponse.json(data)
    },
  ),

  /**
   * @name 채팅방 퇴장
   */
  http.delete<{ boardId: string; roomId: string }>(
    `${BOARD_API_URL}/boards/:boardId/chats/rooms/:roomId`,
    ({ params }) => {
      const { boardId, roomId } = params
      const data: ChatAPITypes.DeleteChatRoom['Response'] = {
        success: true,
        message: '채팅방을 퇴장하였습니다.',
        data: null,
        code: 'LEAVED',
        errors: null,
      }
      return HttpResponse.json(data)
    },
  ),

  /**
   * @name 채팅방 메시지 검색 조회
   */
  http.get<{ roomId: string; messageId: string }>(
    `${API_URL}/chats/rooms/:roomId/messages/:messageId/around`,
    ({ params, request }) => {
      const { roomId, messageId } = params
      const url = new URL(request.url)
      const limit = url.searchParams.get('limit')

      const data: ChatAPITypes.GetChatRoomAroundMessages['Response'] = {
        success: true,
        message: '요청이 성공적으로 처리되었습니다.',
        data: {
          content: [
            {
              id: 37,
              roomId: 4,
              senderId: 1,
              senderName: '박채은',
              senderImage: 'a.png',
              content: '안녕하세요',
              type: 'TEXT',
              createdAt: new Date('2025-09-05T16:00:19.048186'),
              readCount: 0,
            },
            {
              id: 38,
              roomId: 4,
              senderId: 1,
              senderName: '박채은',
              senderImage: 'a.png',
              content: '반갑습니다',
              type: 'TEXT',
              createdAt: new Date('2025-09-05T16:00:28.510405'),
              readCount: 0,
            },
            {
              id: 39,
              roomId: 4,
              senderId: 2,
              senderName: '홍길동',
              senderImage: 'b.png',
              content: '안녕하세요',
              type: 'TEXT',
              createdAt: new Date('2025-09-05T16:01:47.190931'),
              readCount: 0,
            },
            {
              id: 40,
              roomId: 4,
              senderId: 1,
              senderName: '박채은',
              senderImage: 'a.png',
              content: '회의 언제 진행할까요?',
              type: 'TEXT',
              createdAt: new Date('2025-09-05T16:02:02.687828'),
              readCount: 0,
            },
            {
              id: 41,
              roomId: 4,
              senderId: 2,
              senderName: '박채은',
              senderImage: 'a.png',
              content: 'abc.png',
              type: 'IMAGE',
              createdAt: new Date('2025-09-05T16:02:10.804294'),
              readCount: 0,
            },
          ],
          nextCursor: 37,
          hasNext: true,
        },
        code: 'OK',
        errors: null,
      }

      return HttpResponse.json(data)
    },
  ),

  /**
   * @name 채팅방 메시지 목록 조회
   */
  http.get<{ roomId: string }>(`${API_URL}/chats/rooms/:roomId/messages`, ({ params, request }) => {
    const { roomId } = params
    const url = new URL(request.url)
    const cursor = url.searchParams.get('cursor')
    const size = url.searchParams.get('size')
    const direction = url.searchParams.get('direction')
    const data: ChatAPITypes.GetChatRoomMessages['Response'] = {
      success: true,
      message: '요청이 성공적으로 처리되었습니다.',
      data: {
        content: [
          {
            id: 37,
            roomId: 4,
            senderId: 1,
            senderName: '박채은',
            senderImage: 'a.png',
            content: '안녕하세요',
            type: 'TEXT',
            createdAt: new Date('2025-09-05T16:00:19.048186'),
            readCount: 0,
          },
          {
            id: 38,
            roomId: 4,
            senderId: 1,
            senderName: '박채은',
            senderImage: 'a.png',
            content: '반갑습니다',
            type: 'TEXT',
            createdAt: new Date('2025-09-05T16:00:28.510405'),
            readCount: 0,
          },
          {
            id: 39,
            roomId: 4,
            senderId: 2,
            senderName: '홍길동',
            senderImage: 'b.png',
            content: '안녕하세요',
            type: 'TEXT',
            createdAt: new Date('2025-09-05T16:01:47.190931'),
            readCount: 0,
          },
          {
            id: 40,
            roomId: 4,
            senderId: 1,
            senderName: '박채은',
            senderImage: 'a.png',
            content: '회의 언제 진행할까요?',
            type: 'TEXT',
            createdAt: new Date('2025-09-05T16:02:02.687828'),
            readCount: 0,
          },
          {
            id: 41,
            roomId: 4,
            senderId: 2,
            senderName: '박채은',
            senderImage: 'a.png',
            content: 'abc.png',
            type: 'IMAGE',
            createdAt: new Date('2025-09-05T16:02:10.804294'),
            readCount: 0,
          },
        ],
        nextCursor: 37,
        hasNext: true,
      },
      code: 'OK',
      errors: null,
    }
  }),

  /**
   * @name 채팅방 메시지 검색
   */
  http.get<{ roomId: string }>(`${API_URL}/chats/rooms/:roomId/search`, ({ params, request }) => {
    const url = new URL(request.url)
    const keyword = url.searchParams.get('keyword')
    const { roomId } = params

    const data: ChatAPITypes.GetChatRoomMessagesWithSearchValue['Response'] = {
      success: true,
      message: '요청이 성공적으로 처리되었습니다.',
      data: {
        total: 3,
        messageIds: [1, 37, 39],
      },
      code: 'OK',
      errors: null,
    }
  }),

  /**
   * @name 메시지 일괄 읽음 처리
   */
  http.patch<{ roomId: string }>(
    `${API_URL}/chats/rooms/:roomId/read-all`,
    async ({ params, request }) => {
      const { roomId } = params
      const body = (await request
        .clone()
        .json()) as ChatAPITypes.PatchChatRoomMessageReadAll['Body']

      const data: ChatAPITypes.PatchChatRoomMessageReadAll['Response'] = {
        success: true,
        message: '메시지 읽음 처리가 되었습니다.',
        data: null,
        code: 'READ',
        errors: null,
      }
      return HttpResponse.json(data)
    },
  ),

  /**
   * @name 메시지 읽음 상세
   */
  http.get<{ roomId: string; messageId: string }>(
    `${API_URL}/chats/rooms/:roomId/messages/:messageId/reads`,
    ({ params }) => {
      const { roomId, messageId } = params
      const data: ChatAPITypes.GetChatRoomReadUser['Response'] = {
        success: true,
        message: '요청이 성공적으로 처리되었습니다.',
        data: {
          messageId: 46,
          readCount: 2,
          readUsers: [
            {
              nickname: '홍길동',
            },
            {
              nickname: '박우진',
            },
          ],
        },
        code: 'OK',
        errors: null,
      }
      return HttpResponse.json(data)
    },
  ),

  /**
   * @name 파일/이미지 업로드
   */
  http.post(`${API_URL}/chats/upload`, ({ request }) => {
    const url = new URL(request.url)
    const type = url.searchParams.get('type')
    const data: ChatAPITypes.PostChatRoomImageUpload['Response'] = {
      success: true,
      message: '요청이 성공적으로 처리되었습니다.',
      data: {
        type: 'FILE',
        url: 'a.pdf',
      },
      code: 'OK',
      errors: null,
    }

    return HttpResponse.json(data)
  }),
]
