import { http, HttpResponse, type HttpHandler } from 'msw'

import type * as RecruitTypes from '@/types/apis/recruit/recruit.api.types'

import { API_URL } from '.'

export const recruitHandlers: HttpHandler[] = [
  // 포지션 목록 조회
  http.get(`${API_URL}/recruits/positions`, () => {
    const data: RecruitTypes.GetPositions['Response'] = {
      success: true,
      message: '요청이 성공적으로 처리되었습니다.',
      data: [
        {
          id: 1,
          name: '기획자',
        },
        {
          id: 2,
          name: 'PM',
        },
        {
          id: 3,
          name: '마케터',
        },
        {
          id: 4,
          name: '디자이너',
        },
        {
          id: 5,
          name: '프론트엔드 개발자',
        },
        {
          id: 6,
          name: '백엔드 개발자',
        },
        {
          id: 7,
          name: 'iOS',
        },
        {
          id: 8,
          name: '안드로이드',
        },
        {
          id: 9,
          name: '데브옵스',
        },
        {
          id: 10,
          name: '기타',
        },
      ],
      code: 'OK',
      errors: null,
    }
    return HttpResponse.json(data)
  }),

  // 기술 스택 목록 조회
  http.get(`${API_URL}/recruits/stacks`, () => {
    const data: RecruitTypes.GetStacks['Response'] = {
      success: true,
      message: '요청이 성공적으로 처리되었습니다.',
      data: [
        {
          id: 1,
          name: 'JavaScript',
        },
        {
          id: 2,
          name: 'TypeScript',
        },
        {
          id: 3,
          name: 'React',
        },
        {
          id: 4,
          name: 'Vue',
        },
        {
          id: 5,
          name: 'NodeJS',
        },
        {
          id: 6,
          name: 'Spring',
        },
        {
          id: 7,
          name: 'Java',
        },
        {
          id: 8,
          name: 'NextJS',
        },
        {
          id: 9,
          name: 'Express',
        },
        {
          id: 10,
          name: 'Go',
        },
        {
          id: 11,
          name: 'C',
        },
        {
          id: 12,
          name: 'Python',
        },
        {
          id: 13,
          name: 'Django',
        },
        {
          id: 14,
          name: 'Swift',
        },
        {
          id: 15,
          name: 'Kotlin',
        },
        {
          id: 16,
          name: 'MySQL',
        },
        {
          id: 17,
          name: 'MongoDB',
        },
        {
          id: 18,
          name: 'PHP',
        },
        {
          id: 19,
          name: 'GraphQL',
        },
        {
          id: 20,
          name: 'Firebase',
        },
        {
          id: 21,
          name: 'ReactNative',
        },
        {
          id: 22,
          name: 'Unity',
        },
        {
          id: 23,
          name: 'Flutter',
        },
        {
          id: 24,
          name: 'AWS',
        },
        {
          id: 25,
          name: 'Kubernetes',
        },
        {
          id: 26,
          name: 'Docker',
        },
        {
          id: 27,
          name: 'Git',
        },
        {
          id: 28,
          name: 'Figma',
        },
        {
          id: 29,
          name: 'Zeplin',
        },
        {
          id: 30,
          name: 'Jest',
        },
        {
          id: 31,
          name: 'Svelte',
        },
      ],
      code: 'OK',
      errors: null,
    }
    return HttpResponse.json(data)
  }),

  // 모집 공고 생성
  http.get(`${API_URL}/recruits`, async ({ request }) => {
    const body = (await request.clone().json()) as RecruitTypes.PostRecruit['Body']

    const data: RecruitTypes.PostRecruit['Response'] = {
      success: true,
      message: '리소스가 생성되었습니다.',
      data: {
        postId: 32,
      },
      code: 'CREATED',
      errors: null,
    }
    return HttpResponse.json(data)
  }),

  // 모집 공고 목록 조회
  http.get(`${API_URL}/recruits`, ({ request }) => {
    const url = new URL(request.url)
    const page = url.searchParams.get('page') ?? undefined
    const size = url.searchParams.get('size') ?? undefined
    const sort = url.searchParams.get('sort') ?? undefined
    const mainCategory = url.searchParams.get('mainCategory') ?? undefined
    const subCategory = url.searchParams.get('subCategory') ?? undefined
    const position = url.searchParams.get('position') ?? undefined
    const keyword = url.searchParams.get('keyword') ?? undefined

    const data: RecruitTypes.GetRecruits['Response'] = {
      success: true,
      message: '요청이 성공적으로 처리되었습니다.',
      data: {
        posts: [
          {
            postId: 31,
            title: '공모전!!!',
            mainCategory: 'CONTEST',
            subCategory: 'CONTEST_DEV',
            createdAt: new Date('2025-09-16T13:08:48.343774'),
            modifiedAt: new Date('2025-09-16T13:08:48.343774'),
            deadline: '2025-11-16',
            viewCount: 0,
            applicationCount: 0,
            recruitments: [
              {
                recruitmentId: 47,
                positionId: 1,
                stackIds: [1],
              },
              {
                recruitmentId: 48,
                positionId: 2,
                stackIds: [2],
              },
              {
                recruitmentId: 49,
                positionId: 2,
                stackIds: [3],
              },
            ],
          },
          {
            postId: 28,
            title: '프엔!!!',
            mainCategory: 'CONTEST',
            subCategory: 'CONTEST_DEV',
            createdAt: new Date('2025-09-16T12:51:03.935134'),
            modifiedAt: new Date('2025-09-16T12:51:03.935134'),
            deadline: '2025-11-30',
            viewCount: 0,
            applicationCount: 0,
            recruitments: [
              {
                recruitmentId: 44,
                positionId: 1,
                stackIds: [7],
              },
            ],
          },
        ],
        pageInfo: {
          currentPage: 0,
          totalPages: 1,
          totalElements: 2,
          size: 2,
          hasNext: false,
        },
      },
      code: 'OK',
      errors: null,
    }

    return HttpResponse.json(data)
  }),

  // 모집 공고 수정
  http.put<{ postId: string }>(`${API_URL}/recruits/:postId`, async ({ params, request }) => {
    const postId = params.postId
    const body = (await request.clone().json()) as RecruitTypes.PostRecruit['Response']

    const data: RecruitTypes.PostRecruit['Response'] = {
      success: true,
      message: '리소스가 수정되었습니다.',
      data: {
        postId: 32,
      },
      code: 'MODIFIED',
      errors: null,
    }

    return HttpResponse.json(data)
  }),

  // 모집 공고 상세 조회
  http.get<{ postId: string }>(`${API_URL}/recruits/:postId`, ({ params }) => {
    const postId = params.postId

    const data: RecruitTypes.GetRecruitDetail['Response'] = {
      success: true,
      message: '요청이 성공적으로 처리되었습니다.',
      data: {
        mainCategory: 'CONTEST',
        subCategory: 'CONTEST_PLANNING',
        postId: 33,
        title: '타이틀',
        content: 'string',
        deadline: '2025-09-18',
        projectDuration: 'UNDEFINED',
        writerId: 1,
        writerName: 'gyuri',
        viewCount: 2,
        applicationCount: 0,
        recruits: [
          {
            position: 1,
            stacks: [1],
          },
        ],
      },
      code: 'OK',
      errors: null,
    }
    return HttpResponse.json(data)
  }),

  // 모집 공고 삭제
  http.delete<{ postId: string }>(`${API_URL}/recruits/:postId`, ({ params }) => {
    const postId = params.postId

    const data: RecruitTypes.DeleteRecruit['Response'] = {
      success: true,
      message: '리소스가 삭제되었습니다.',
      data: null,
      code: 'DELETED',
      errors: null,
    }

    return HttpResponse.json(data)
  }),

  // 지원자 목록 조회
  http.get<{ postId: string }>(`${API_URL}/recruits/:postId/applications`, ({ params }) => {
    const postId = params.postId

    const data: RecruitTypes.GetRecruitApplicants['Response'] = {
      success: true,
      message: '요청이 성공적으로 처리되었습니다.',
      data: [
        {
          id: 5,
          postId: 30,
          applicantId: 3,
        },
      ],
      code: 'OK',
      errors: null,
    }

    return HttpResponse.json(data)
  }),

  // 지원 수락
  http.post<{ postId: string; applicationId: string }>(
    `${API_URL}/recruits/:postId/applications/:applicationId/accept`,
    async ({ params, request }) => {
      const postId = params.postId
      const applicationId = params.applicationId
      const body = (await request.clone().json()) as RecruitTypes.PostRecruitApplicantAccept['Body']

      return HttpResponse.json({}, { status: 200 })
    },
  ),

  // 나의 모집글 조회
  http.get(`${API_URL}/recruits/me/posts`, ({ request }) => {
    const url = new URL(request.url)
    const page = url.searchParams.get('page') ?? undefined
    const size = url.searchParams.get('size') ?? undefined

    const data: RecruitTypes.GetMyRecruit['Response'] = {
      success: true,
      message: '요청이 성공적으로 처리되었습니다.',
      data: {
        posts: [
          {
            postId: 2,
            title: '팀원 모집함2',
            mainCategory: 'CONTEST',
            subCategory: 'CONTEST_DESIGN',
            createdAt: new Date('2025-08-30T17:13:21.470105'),
            modifiedAt: new Date('2025-08-30T17:13:21.470105'),
            deadline: '2025-08-30',
            viewCount: 0,
            applicationCount: 0,
            recruitments: [
              {
                recruitmentId: 5,
                positionId: 1,
                stackIds: [1],
              },
              {
                recruitmentId: 6,
                positionId: 1,
                stackIds: [2],
              },
              {
                recruitmentId: 7,
                positionId: 2,
                stackIds: [2],
              },
              {
                recruitmentId: 8,
                positionId: 2,
                stackIds: [3],
              },
            ],
          },
          {
            postId: 7,
            title: 'string',
            mainCategory: 'ETC',
            subCategory: 'CONTEST_ETC',
            createdAt: new Date('2025-08-30T19:00:20.222314'),
            modifiedAt: new Date('2025-08-30T19:00:20.222314'),
            deadline: '2025-08-30',
            viewCount: 0,
            applicationCount: 0,
            recruitments: [
              {
                recruitmentId: 9,
                positionId: 1,
                stackIds: [1],
              },
            ],
          },
        ],
        pageInfo: {
          currentPage: 0,
          totalPages: 10,
          totalElements: 20,
          size: 2,
          hasNext: true,
        },
      },
      code: 'OK',
      errors: null,
    }

    return HttpResponse.json(data)
  }),

  // 댓글작성
  http.post<{ postId: string }>(
    `${API_URL}/recruits/:postId/comments`,
    async ({ params, request }) => {
      const postId = params.postId
      const body = (await request.clone().json()) as RecruitTypes.PostRecruitComment['Body']

      return HttpResponse.json({}, { status: 200 })
    },
  ),

  // 댓글조회
  http.get<{ postId: string }>(`${API_URL}/recruits/:postId/comments`, ({ params }) => {
    const postId = params.postId

    const data: RecruitTypes.GetRecruitComments['Response'] = {
      success: true,
      message: '요청이 성공적으로 처리되었습니다.',
      data: {
        commentCount: 1,
        comments: [
          {
            id: 1,
            content: 'string',
            writerId: 1,
            deleted: false,
            children: [
              {
                id: 2,
                content: '대댓글',
                writerId: 1,
                deleted: false,
                children: [],
              },
              {
                id: 3,
                content: '대댓글2',
                writerId: 1,
                deleted: false,
                children: [],
              },
            ],
          },
        ],
      },
      code: 'OK',
      errors: null,
    }
    return HttpResponse.json(data)
  }),

  // 댓글수정
  http.put<{ commentId: string }>(
    `${API_URL}/recruits/comments/:commentId`,
    async ({ params, request }) => {
      const { commentId } = params
      const body = (await request.clone().json()) as RecruitTypes.PutRecruitComment['Body']

      return HttpResponse.json({}, { status: 200 })
    },
  ),

  // 댓글삭제
  http.delete<{ commentId: string }>(`${API_URL}/recruits/comments/:commentId`, ({ params }) => {
    const { commentId } = params

    const data: RecruitTypes.DeleteRecruitComment['Response'] = {
      success: true,
      message: '리소스가 삭제되었습니다.',
      data: null,
      code: 'DELETED',
      errors: null,
    }
  }),
]
