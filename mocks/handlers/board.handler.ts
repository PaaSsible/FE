import { http, HttpHandler, HttpResponse } from 'msw'

import * as BoardAPITypes from '@/types/apis/board/board.api.types'

import { API_URL } from '.'

const boardHandlers: HttpHandler[] = [
  //보드 목록 조회
  http.get(`${API_URL}/boards`, ({ request }) => {
    // 쿼리 파라미터 가져오기
    const url = new URL(request.url)
    console.log('MSW handler called!', request.url)
    const status = url.searchParams.get('status') ?? undefined
    const keyword = url.searchParams.get('keyword') ?? undefined

    // 전체 샘플 데이터
    const allBoards: BoardAPITypes.GetBoardList['Response']['data'] = [
      {
        boardId: 1,
        name: '보드1',
        content: '보드1입니다',
        activityType: 'CONTEST',
        detailType: 'CONTEST_PLANNING',
        status: 'ONGOING',
        owner: '박채은',
      },
      {
        boardId: 3,
        name: '보드2',
        content: '보드2입니다',
        activityType: 'CONTEST',
        detailType: 'CONTEST_DEV',
        status: 'ONGOING',
        owner: '박채은',
      },
    ]

    // 쿼리 기반 필터링
    let filteredBoards = allBoards
    if (status) filteredBoards = filteredBoards.filter((b) => b.status === status)
    if (keyword) filteredBoards = filteredBoards.filter((b) => b.name.includes(keyword))

    // 응답 데이터
    const data: BoardAPITypes.GetBoardList['Response'] = {
      success: true,
      message: '요청이 성공적으로 처리되었습니다.',
      data: filteredBoards,
      code: 'OK',
      errors: null,
    }

    return HttpResponse.json(data)
  }),

  //보드 생성
  http.post(`/boards`, async ({ request }) => {
    const body = (await request.clone().json()) as BoardAPITypes.PostBoard['Body']

    const data: BoardAPITypes.PostBoard['Response'] = {
      success: true,
      message: '리소스가 생성되었습니다.',
      data: null,
      code: 'CREATED',
      errors: null,
    }

    return HttpResponse.json(data)
  }),

  //보드 수정
  http.put<{ boardId: string }>(`${API_URL}/boards/:boardId}`, async ({ params, request }) => {
    const { boardId } = params
    const body = (await request.clone().json()) as BoardAPITypes.PutBoard['Body']

    const data: BoardAPITypes.PutBoard['Response'] = {
      success: true,
      message: '리소스가 수정되었습니다.',
      data: null,
      code: 'MODIFIED',
      errors: null,
    }

    return HttpResponse.json(data)
  }),

  //보드 삭제
  http.delete<{ boardId: string }>(`${API_URL}/boards/:boardId`, ({ params }) => {
    const { boardId } = params

    const data: BoardAPITypes.DeleteBoard['Response'] = {
      success: true,
      message: '리소스가 삭제되었습니다.',
      data: null,
      code: 'DELETED',
      errors: null,
    }

    return HttpResponse.json(data)
  }),

  //보드 진입
  http.get<{ boardId: string }>(`${API_URL}/boards/:boardId`, ({ params }) => {
    const { boardId } = params

    const data: BoardAPITypes.GetBoardDetail['Response'] = {
      success: true,
      message: '요청이 성공적으로 처리되었습니다.',
      data: {
        boardId: 2,
        positionId: null,
      },
      code: 'OK',
      errors: null,
    }

    return HttpResponse.json(data)
  }),

  //보드 멤버 조회
  http.get<{ boardId: string }>(`${API_URL}/boards/:boardId/members`, ({ params }) => {
    const { boardId } = params

    const data: BoardAPITypes.GetBoardMember['Response'] = {
      success: true,
      message: '요청이 성공적으로 처리되었습니다.',
      data: [
        {
          userId: 1,
          userName: '박채은',
          profileImageUrl: 'a.png',
          role: 'OWNER',
        },
        {
          userId: 2,
          userName: 'chaeeun park',
          profileImageUrl: 'b.png',
          role: 'MEMBER',
        },
      ],
      code: 'OK',
      errors: null,
    }

    return HttpResponse.json(data)
  }),
  //보드 탈퇴
  http.delete<{ boardId: string }>(`${API_URL}/boards/:boardId/members`, ({ params }) => {
    const { boardId } = params

    const data: BoardAPITypes.DeleteBoardMember['Response'] = {
      success: true,
      message: '리소스가 삭제되었습니다.',
      data: null,
      code: 'DELETED',
      errors: null,
    }

    return HttpResponse.json(data)
  }),
  //보드 포지션 설정
  http.patch<{ boardId: string }>(`${API_URL}/boards/:boardId/members`, ({ request, params }) => {
    const { boardId } = params
    const url = new URL(request.url)
    const positionid = url.searchParams.get('positionId')

    const data: BoardAPITypes.PatchBoardMember['Response'] = {
      success: true,
      message: '리소스가 수정되었습니다.',
      data: null,
      code: 'MODIFIED',
      errors: null,
    }

    return HttpResponse.json(data)
  }),
]
export default boardHandlers
