import { isBefore, startOfDay } from 'date-fns'
import z from 'zod'

import {
  activityTypeArray,
  boardSchema,
  detailTypeArray,
} from '@/types/entities/board/board.entities.schemas'
import {
  applicantSchema,
  applicationSchema,
  positionSchema,
  recruitCommentSchema,
  recruitPostSchema,
  stackSchema,
} from '@/types/entities/recruit-post/recruitPost.schemas'

/**
 * @name 포지션목록조회
 * @method GET
 * @path `/recruits/positions`
 */
export const getPositionsSchema = {
  response: z.object({
    success: z.boolean(),
    message: z.string().nullable(),
    data: z.array(positionSchema),
    code: z.string(),
    errors: z.string().nullable(),
  }),
}

/**
 * @name 기술스택목록조회
 * @method GET
 * @path `/recruits/stacks`
 */
export const getStacksSchema = {
  response: z.object({
    success: z.boolean(),
    message: z.string().nullable(),
    data: z.array(stackSchema),
    code: z.string(),
    errors: z.string().nullable(),
  }),
}

/**
 * @name 모집공고생성
 * @path `/recruits`
 */
const recruitPayloadSchema = z
  .array(
    z.object({
      position: positionSchema.shape.id,
      stacks: z.array(stackSchema.shape.id).default([]),
    }),
  )
  .default([])

export const postRecruitSchema = {
  body: recruitPostSchema
    .pick({
      mainCategory: true,
      subCategory: true,
      title: true,
      content: true,
      projectDuration: true,
    })
    .extend({
      deadline: z
        .string()
        .regex(/^\d{4}-\d{2}-\d{2}$/)
        .refine((value) => {
          const parsed = startOfDay(new Date(`${value}T00:00:00`))
          return !isBefore(parsed, startOfDay(new Date()))
        }, '마감기한은 현재 시간 이후여야 합니다.'),
      recruits: recruitPayloadSchema,
    }),
  response: z.object({
    success: z.boolean(),
    message: z.string().nullable(),
    data: z.object({ postId: recruitPostSchema.shape.postId }),
    code: z.string(),
    errors: z.string().nullable(),
  }),
}

export const sortArray = ['RECENT', 'DEADLINE', 'POPULAR'] as const
/**
 * @name 모집공고목록조회
 * @path `/recruits`
 */
export const getRecruitsSchema = {
  query: z.object({
    page: z.int().min(0),
    size: z.int().min(1).positive(),
    sort: z.enum(sortArray).default('RECENT'),
    mainCategory: z.enum(activityTypeArray).optional(),
    subCategory: z.enum(detailTypeArray).optional(),
    position: positionSchema.shape.id.optional(),
    keyword: z.string().optional(),
  }),

  response: z.object({
    success: z.boolean(),
    message: z.string().nullable(),
    data: z.object({
      posts: z.array(
        recruitPostSchema
          .pick({
            postId: true,
            title: true,
            mainCategory: true,
            subCategory: true,
            deadline: true,
          })
          .extend({
            createdAt: z.preprocess((val) => new Date(val as string), z.date()),
            modifiedAt: z.preprocess((val) => new Date(val as string), z.date()),
            viewCount: z.int(),
            applicationCount: z.int(),
            recruits: z
              .array(
                z.object({
                  position: positionSchema.shape.id,
                  stacks: z
                    .union([z.array(stackSchema.shape.id), stackSchema.shape.id])
                    .transform((v) => (Array.isArray(v) ? v : [v])),
                }),
              )
              .optional()
              .default([]),
          }),
      ),
      pageInfo: z.object({
        currentPage: z.int(),
        totalPages: z.int(),
        totalElements: z.int(),
        size: z.int(),
        hasNext: z.boolean(),
      }),
    }),
    code: z.string(),
    errors: z.string().nullable(),
  }),
}
/**
 * @name 모집공고수정
 * @path `/recruits/{postId}`
 */
export const putRecruitSchema = {
  path: z.object({
    postId: recruitPostSchema.shape.postId,
  }),
  body: recruitPostSchema.pick({
    mainCategory: true,
    subCategory: true,
    title: true,
    content: true,
    deadline: true,
    projectDuration: true,
    recruits: true,
  }),
  response: z.object({
    success: z.boolean(),
    message: z.string().nullable(),
    data: z.object({
      postId: recruitPostSchema.shape.postId,
    }),
    code: z.string(),
    errors: z.string().nullable(),
  }),
}

/**
 * @name 모집공고상세조회
 * @path `/recruits/{postId}`
 */
export const getRecruitDetailSchema = {
  path: z.object({
    postId: recruitPostSchema.shape.postId,
  }),
  response: z.object({
    success: z.boolean(),
    message: z.string().nullable(),
    data: recruitPostSchema,
    code: z.string(),
    errors: z.string().nullable(),
  }),
}

/**
 * @name 모집공고삭제
 * @path `/recruits/{postId}`
 */
export const deleteRecruitSchema = {
  path: z.object({
    postId: recruitPostSchema.shape.postId,
  }),
  response: z.object({
    success: z.boolean(),
    message: z.string().nullable(),
    data: z.null(),
    code: z.string(),
    errors: z.string().nullable(),
  }),
}

/**
 * @name 지원자목록조회
 * @path `/recruits/{postId}/applications`
 */
export const getRecruitApplicantsSchema = {
  path: z.object({
    postId: recruitPostSchema.shape.postId,
  }),
  response: z.object({
    success: z.boolean(),
    message: z.string().nullable(),
    data: z.array(
      z.object({
        id: z.number(),
        postId: recruitPostSchema.shape.postId,
        applicantId: applicantSchema.shape.applicantId,
        applicantName: applicantSchema.shape.applicantName,
        university: applicantSchema.shape.university,
        major: applicantSchema.shape.major,
        positionName: applicantSchema.shape.positionName,
        stackNames: applicantSchema.shape.stackNames,
      }),
    ),
    code: z.string(),
    errors: z.string().nullable(),
  }),
}

/**
 * @name 나의 지원 내역 조회
 * @path `/recruits/my`
 */
export const getMyRecruitApplicationsSchema = {
  response: z.object({
    success: z.boolean(),
    message: z.string().nullable(),
    data: z.array(
      z.object({
        applicationId: applicationSchema.shape.id,
        postId: recruitPostSchema.shape.postId,
        title: recruitPostSchema.shape.title,
        mainCategory: recruitPostSchema.shape.mainCategory,
        subCategory: recruitPostSchema.shape.subCategory,
        createdAt: z.string(),
        modifiedAt: z.string(),
        deadline: recruitPostSchema.shape.deadline,
        viewCount: recruitPostSchema.shape.viewCount,
        applicationCount: recruitPostSchema.shape.applicationCount,
        recruits: z.array(
          z.object({
            position: positionSchema.shape.id,
            stacks: z.array(stackSchema.shape.id),
          }),
        ),
        status: applicationSchema.shape.status,
      }),
    ),
    code: z.string(),
    errors: z.string().nullable(),
  }),
}

/**
 * @name 모집글지원
 * @path `/recruits/{postId}/applications`
 */
export const postRecruitApplicationSchema = {
  path: z.object({
    postId: recruitPostSchema.shape.postId,
  }),
  response: z.object({
    success: z.boolean(),
    message: z.string().nullable(),
    data: z.null(),
    code: z.string(),
    errors: z.string().nullable(),
  }),
}

/**
 * @name 모집 지원 취소
 * @path `/recruits/{applicationId}/cancel`
 */
export const deleteRecruitApplicationSchema = {
  path: z.object({
    applicationId: applicationSchema.shape.id,
  }),
  response: z.object({
    success: z.boolean(),
    message: z.string().nullable(),
    data: z.null(),
    code: z.string(),
    errors: z.string().nullable(),
  }),
}

/**
 *@name 지원수락
 *@path `/recruits/{postId}/applications/{applicationId}/accept`
 */
export const postRecruitApplicantAcceptSchema = {
  path: z.object({
    postId: recruitPostSchema.shape.postId,
    applicationId: applicationSchema.shape.id,
  }),
  body: z.object({
    boardId: boardSchema.shape.boardId,
  }),
  response: z.object({
    success: z.boolean(),
    message: z.string().nullable(),
    data: z.null(),
    code: z.string(),
    errors: z.string().nullable(),
  }),
}

/**
 *@name 지원거절
 *@path `/recruits/{postId}/applications/{applicationId}/reject`
 */
export const postRecruitApplicantRejectSchema = {
  path: z.object({
    postId: recruitPostSchema.shape.postId,
    applicationId: applicationSchema.shape.id,
  }),
  body: z.object({
    rejectReason: z.string().min(1).max(500),
  }),
  response: z.object({
    success: z.boolean(),
    message: z.string().nullable(),
    data: z.null(),
    code: z.string(),
    errors: z.string().nullable(),
  }),
}

/**
 *@name 지원거절사유조회
 *@path `/recruits/{applicationId}/reject-reason`
 */
export const getRecruitApplicationRejectReasonSchema = {
  path: z.object({
    applicationId: applicationSchema.shape.id,
  }),
  response: z.object({
    success: z.boolean(),
    message: z.string().nullable(),
    data: z
      .object({
        rejectReason: z.string().nullable(),
      })
      .nullable(),
    code: z.string(),
    errors: z.string().nullable(),
  }),
}

/**
 *@name 나의모집글조회
 *@path `/recruits/me/posts`
 */
export const getMyRecruitSchema = {
  query: z.object({ page: z.number(), size: z.number() }),
  response: getRecruitsSchema.response,
}

/**
 *@name 댓글작성
 *@path `/recruits/{postId}/comments`
 */
export const postRecruitCommentSchema = {
  path: z.object({
    postId: recruitPostSchema.shape.postId,
  }),
  body: z.object({
    content: recruitCommentSchema.shape.content,
    parentId: recruitCommentSchema.shape.parentId.optional(),
  }),
}

/**
 *@name 댓글조회
 *@path `/recruits/{postId}/comments`
 */
export const getRecruitCommentsSchema = {
  path: z.object({
    postId: recruitPostSchema.shape.postId,
  }),
  response: z.object({
    success: z.boolean(),
    message: z.string().nullable(),
    data: z.object({
      commentCount: z.int(),
      comments: z.array(recruitCommentSchema),
    }),
    code: z.string(),
    errors: z.string().nullable(),
  }),
}

/**
 *@name 댓글수정
 *@path `/recruits/comments/{commentId}`
 */
export const putRecruitCommentSchema = {
  path: z.object({
    commentId: recruitCommentSchema.shape.id,
  }),
  body: z.object({
    content: recruitCommentSchema.shape.content,
  }),
}

/**
 *@name 댓글삭제
 *@path `/recruits/comments/{commentId}`
 */
export const deleteRecruitCommentSchema = {
  path: z.object({
    commentId: recruitCommentSchema.shape.id,
  }),
  response: z.object({
    success: z.boolean(),
    message: z.string(),
    data: z.null(),
    code: z.string(),
    errors: z.string().nullable(),
  }),
}
