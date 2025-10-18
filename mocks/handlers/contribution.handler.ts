import { http, HttpResponse, type HttpHandler } from 'msw'

import type { GetContributionScores } from '@/types/apis/board/contribution.api.types'

const API_URL = import.meta.env.VITE_API_BOARD_URL

const contributionHandlers: HttpHandler[] = [
  http.get<{ boardId: string }>(`${API_URL}/boards/:boardId/members/scores`, ({ params }) => {
    const { boardId } = params
    const data: GetContributionScores['response'] = {
      success: true,
      message: '요청이 성공적으로 처리되었습니다.',
      data: [
        {
          id: 1,
          memberName: '이윤지',
          part: 'Backend',
          taskCompletion: 88,
          attendanceRate: 94,
          communicationFrequency: {
            value: 8,
            total: 10,
          },
          contribution: 50,
        },
        {
          id: 2,
          memberName: '박우진',
          part: 'Planning',
          taskCompletion: 88,
          attendanceRate: 94,
          communicationFrequency: {
            value: 5,
            total: 10,
          },
          contribution: 50,
        },
        {
          id: 3,
          memberName: '이서현',
          part: 'Design',
          taskCompletion: 88,
          attendanceRate: 94,
          communicationFrequency: {
            value: 10,
            total: 10,
          },
          contribution: 50,
        },
        {
          id: 4,
          memberName: '김민지',
          part: 'Frontend',
          taskCompletion: 88,
          attendanceRate: 94,
          communicationFrequency: {
            value: 7,
            total: 10,
          },
          contribution: 50,
        },
      ],
      code: 'OK',
      errors: null,
    }
    return HttpResponse.json(data)
  }),
]
export default contributionHandlers
