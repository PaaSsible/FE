import { http, HttpResponse, type HttpHandler } from 'msw'

import * as TaskAPITypes from '@/types/apis/board/task.api.types'

const API_URL = import.meta.env.VITE_API_BOARD_URL

const taskHandlers: HttpHandler[] = [
  //업무 목록 조회
  http.get<{ boardId: string }>(`${API_URL}/boards/:boardId/tasks`, ({ params }) => {
    const { boardId } = params
    void boardId

    const data: TaskAPITypes.GetTaskList['Response'] = {
      success: true,
      message: '요청이 성공적으로 처리되었습니다.',
      data: [
        {
          id: 1,
          title: '기획 회의',
          description: '기획 회의입니다.',
          dueDate: '2025-09-11T15:06:37.073',
          status: 'PENDING',
          boardId: 1,
          assignees: [
            {
              userId: 1,
              name: '박채은',
            },
            {
              userId: 2,
              name: '홍길동',
            },
          ],
          positions: ['기획자', 'PM', '마케터'],
        },
        {
          id: 2,
          title: '개발',
          description: '개발입니다',
          dueDate: '2025-09-11T15:06:37.073',
          status: 'PENDING',
          boardId: 1,
          assignees: [
            {
              userId: 1,
              name: '박채은',
            },
          ],
          positions: ['백엔드'],
        },
      ],
      code: 'OK',
      errors: null,
    }

    return HttpResponse.json(data)
  }),
  //업무 생성
  http.post<{ boardId: string }>(
    `${API_URL}/boards/:boardId/tasks`,
    async ({ params, request }) => {
      const { boardId } = params
      const body = (await request.clone().json()) as TaskAPITypes.PostTask['Body']
      void boardId
      void body

      const data: TaskAPITypes.PostTask['Response'] = {
        success: true,
        message: '리소스가 생성되었습니다.',
        data: null,
        code: 'CREATED',
        errors: null,
      }

      return HttpResponse.json(data)
    },
  ),
  //업무 수정
  http.patch<{ boardId: string; taskId: string }>(
    `${API_URL}/boards/:boardId/tasks/:taskId`,
    async ({ params, request }) => {
      const boardId = params.boardId
      const taskId = params.taskId
      const body = (await request.clone().json()) as TaskAPITypes.PatchTask['Body']
      void boardId
      void taskId
      void body

      const data: TaskAPITypes.PatchTask['Response'] = {
        success: true,
        message: '리소스가 수정되었습니다.',
        data: null,
        code: 'MODIFIED',
        errors: null,
      }

      return HttpResponse.json(data)
    },
  ),
  //업무 설명 수정
  http.patch<{ boardId: string; taskId: string }>(
    `${API_URL}/boards/:boardId/tasks/:taskId/description`,
    async ({ params, request }) => {
      const boardId = params.boardId
      const taskId = params.taskId
      const body = (await request.clone().json()) as TaskAPITypes.PatchTaskDescription['Body']
      void boardId
      void taskId
      void body

      const data: TaskAPITypes.PatchTaskDescription['Response'] = {
        success: true,
        message: '리소스가 수정되었습니다.',
        data: null,
        code: 'MODIFIED',
        errors: null,
      }
      return HttpResponse.json(data)
    },
  ),
  //업무 상태 수정
  http.patch<{ boardId: string; taskId: string }>(
    `${API_URL}/boards/{boardId}/tasks/{taskId}/status`,
    async ({ params, request }) => {
      const boardId = params.boardId
      const taskId = params.taskId
      const body = (await request.clone().json()) as TaskAPITypes.PatchTaskStatus['Body']
      void boardId
      void taskId
      void body

      const data: TaskAPITypes.PatchTaskStatus['Response'] = {
        success: true,
        message: '리소스가 수정되었습니다.',
        data: null,
        code: 'MODIFIED',
        errors: null,
      }
      return HttpResponse.json(data)
    },
  ),
  //업무 삭제
  http.delete<{ boardId: string; taskId: string }>(
    `${API_URL}/boards/:boardId}/tasks/:taskId`,
    ({ params }) => {
      const boardId = params.boardId
      const taskId = params.taskId
      void boardId
      void taskId
      const data: TaskAPITypes.DeleteTask['Response'] = {
        success: true,
        message: '리소스가 삭제되었습니다.',
        data: null,
        code: 'DELETED',
        errors: null,
      }
      return HttpResponse.json(data)
    },
  ),
  //업무 상세 보기
  http.get<{ boardId: string; taskId: string }>(
    `${API_URL}/boards/{boardId}/tasks/{taskId}`,
    ({ params }) => {
      const boardId = params.boardId
      const taskId = params.taskId
      void boardId
      void taskId
      const data: TaskAPITypes.GetTaskDetail['Response'] = {
        success: true,
        message: '요청이 성공적으로 처리되었습니다.',
        data: {
          id: 1,
          title: '기획 회의',
          description: '기획 회의입니다',
          dueDate: '2025-09-11T15:06:37.073',
          status: 'PENDING',
          boardId: 1,
          assignees: [
            {
              userId: 1,
              name: '박채은',
            },
            {
              userId: 2,
              name: 'chaeeun park',
            },
          ],
          positions: ['기획자', 'PM', '마케터'],
        },
        code: 'OK',
        errors: null,
      }

      return HttpResponse.json(data)
    },
  ),
  //업무 댓글 조회
  http.get<{ boardId: string; taskId: string }>(
    `${API_URL}/boards/:boardId/tasks/:taskId/comments`,
    ({ params }) => {
      const boardId = params.boardId
      const taskId = params.taskId
      void boardId
      void taskId

      const data: TaskAPITypes.GetTaskDetailComments['Response'] = {
        success: true,
        message: '요청이 성공적으로 처리되었습니다.',
        data: [
          {
            id: 2,
            taskId: 1,
            userId: 1,
            userName: '박채은',
            profileImageUrl: 'a.png',
            comment: '업무1 댓글입니다.',
            createdAt: '2025-09-09T11:13:47.304661',
          },
          {
            id: 3,
            taskId: 1,
            userId: 1,
            userName: '박채은',
            profileImageUrl: 'a.png',
            comment: '업무1 댓글2입니다.',
            createdAt: '2025-09-09T11:24:04.76883',
          },
          {
            id: 4,
            taskId: 1,
            userId: 1,
            userName: '박채은',
            profileImageUrl: 'a.png',
            comment: '업무1 댓글3입니다.',
            createdAt: '2025-09-09T11:24:11.686567',
          },
        ],
        code: 'OK',
        errors: null,
      }
      return HttpResponse.json(data)
    },
  ),
  //업무 댓글 생성
  http.post<{ boardId: string; taskId: string }>(
    `${API_URL}/boards/:boardId/tasks/:taskId/comments`,
    async ({ params, request }) => {
      const boardId = params.boardId
      const taskId = params.taskId
      const body = (await request.clone().json()) as TaskAPITypes.PostTaskDetailComment['Body']
      void boardId
      void taskId
      void body

      const data: TaskAPITypes.PostTaskDetailComment['Response'] = {
        success: true,
        message: '리소스가 생성되었습니다.',
        data: null,
        code: 'CREATED',
        errors: null,
      }

      return HttpResponse.json(data)
    },
  ),
  //업무 댓글 수정
  http.patch<{ boardId: string; taskId: string; commentId: string }>(
    `${API_URL}/boards/:boardId/tasks/:taskId/comments/:commentId`,
    async ({ params, request }) => {
      const boardId = params.boardId
      const taskId = params.taskId
      const commentId = params.commentId
      const body = (await request.clone().json()) as TaskAPITypes.PatchTaskDetailComment['Body']
      void boardId
      void taskId
      void commentId
      void body

      const data: TaskAPITypes.PatchTaskDetailComment['Response'] = {
        success: true,
        message: '리소스가 수정되었습니다.',
        data: null,
        code: 'MODIFIED',
        errors: null,
      }

      return HttpResponse.json(data)
    },
  ),
  //업무 댓글 삭제
  http.delete<{ boardId: string; taskId: string; commentId: string }>(
    `${API_URL}/boards/:boardId/tasks/:taskId/comments/:commentId`,
    ({ params }) => {
      const boardId = params.boardId
      const taskId = params.taskId
      const commentId = params.commentId
      void boardId
      void taskId
      void commentId

      const data: TaskAPITypes.DeleteTaskDetailComment['Response'] = {
        success: true,
        message: '리소스가 삭제되었습니다.',
        data: null,
        code: 'DELETED',
        errors: null,
      }
      return HttpResponse.json(data)
    },
  ),
  //업무 상태 차트 조회(업무 상태 시각화)
  http.get<{ boardId: string }>(`${API_URL}/boards/:boardId/tasks/visualization`, ({ params }) => {
    const { boardId } = params
    void boardId
    const data: TaskAPITypes.GetTaskStatusChart['Response'] = {
      success: true,
      message: '요청이 성공적으로 처리되었습니다.',
      data: {
        completedRate: 25,
        total: 4,
        tasks: [
          {
            status: 'PENDING',
            count: 2,
          },
          {
            status: 'ONGOING',
            count: 1,
          },
          {
            status: 'COMPLETED',
            count: 1,
          },
        ],
      },
      code: 'OK',
      errors: null,
    }

    return HttpResponse.json(data)
  }),
  //주간 목표 달성률
  http.get<{ boardId: string }>(`${API_URL}/boards/:boardId/reports/weekly`, ({ params }) => {
    const { boardId } = params
    void boardId

    const data: TaskAPITypes.GetWeeklyGoalAchievement['Response'] = {
      success: true,
      message: '요청이 성공적으로 처리되었습니다.',
      data: {
        weeklyGoalRate: 55,
      },
      code: 'OK',
      errors: null,
    }

    return HttpResponse.json(data)
  }),
  //링크 목록 조회
  http.get<{ boardId: string }>(`${API_URL}/boards/:boardId/shortcuts`, ({ params }) => {
    const { boardId } = params
    void boardId

    const data: TaskAPITypes.GetExternalLinks['Response'] = {
      success: true,
      message: '요청이 성공적으로 처리되었습니다.',
      data: [
        {
          id: 2,
          name: '네이버',
          url: 'naver',
        },
        {
          id: 3,
          name: '구글',
          url: 'google',
        },
      ],
      code: 'OK',
      errors: null,
    }
    return HttpResponse.json(data)
  }),
  //링크 추가
  http.post<{ boardId: string }>(
    `${API_URL}/boards/:boardId/shortcuts`,
    async ({ params, request }) => {
      const { boardId } = params
      const body = (await request.clone().json()) as TaskAPITypes.PostExternalLink['Body']
      void boardId
      void body

      const data: TaskAPITypes.PostExternalLink['Response'] = {
        success: true,
        message: '리소스가 생성되었습니다.',
        data: null,
        code: 'CREATED',
        errors: null,
      }
      return HttpResponse.json(data)
    },
  ),
  //링크 삭제
  http.delete<{ boardId: string; shortcutId: string }>(
    `${API_URL}/boards/:boardId/shortcuts/:shortcutId`,
    ({ params }) => {
      const boardId = params.boardId
      const shortcutId = params.shortcutId
      void boardId
      void shortcutId

      const data: TaskAPITypes.DeleteExternalLink['Response'] = {
        success: true,
        message: '리소스가 삭제되었습니다.',
        data: null,
        code: 'DELETED',
        errors: null,
      }
      return HttpResponse.json(data)
    },
  ),
]
export default taskHandlers
