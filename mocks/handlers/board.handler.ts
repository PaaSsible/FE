import { http, HttpResponse } from 'msw'

import * as boardAPISchemas from '@/types/apis/board/board.api.schemas'
import * as BoardAPITypes from '@/types/apis/board/board.api.types'

const API_URL = import.meta.env.VITE_API_BOARD_URL

export const boardHandlers = [
  http.get(`${API_URL}/boards`, ({ request }) => {
    // 쿼리 파라미터 가져오기
    const url = new URL(request.url)
    console.log('MSW handler called!', request.url)
    const status = url.searchParams.get('status') ?? undefined
    const keyword = url.searchParams.get('keyword') ?? undefined
    // Zod로 런타임 검증
    boardAPISchemas.getBoardListSchema.query.parse({
      status,
      keyword,
    })

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

    // Zod로 런타임 검증
    boardAPISchemas.getBoardListSchema.response.parse(data)

    return HttpResponse.json(data)
  }),
]
