import z from 'zod'

import {
  boardMemberSchema,
  boardSchema,
  boardStatusArray,
} from '@/types/entities/board/board.entities.schemas'

/**
 * @name 보드목록조회
 * @method GET
 * @path `/boards`
 * @description 보드 목록을 조회하는 API의 스키마
 */
export const getBoardListSchema = {
  query: z.object({
    status: z.enum(boardStatusArray).optional(),
    keyword: z.string().optional(),
  }),
  response: z.object({
    success: z.boolean(),
    message: z.string(),
    data: z.array(boardSchema.extend({ content: z.string() })),
    code: z.string(),
    errors: z.string().nullable(),
  }),
}

/**
 * @name 보드생성
 * @method POST
 * @path `/boards`
 * @description 보드 생성하는 API의 스키마
 */
export const postBoardSchema = {
  body: boardSchema.pick({
    name: true,
    content: true,
    activityType: true,
    detailType: true,
  }),
  response: z.object({
    success: z.boolean(),
    message: z.string(),
    data: z.string().nullable(),
    code: z.string(),
    errors: z.string().nullable(),
  }),
}

/**
 * @name 보드수정
 * @method PUT
 * @path `/boards/{boardId}`
 * @description 보드 수정하는 API의 스키마
 */
export const putBoardSchema = {
  path: z.object({
    boardId: boardSchema.shape.boardId,
  }),
  body: boardSchema.pick({
    name: true,
    content: true,
    activityType: true,
    detailType: true,
  }),
  response: z.object({
    success: z.boolean(),
    message: z.string(),
    data: z.string().nullable(),
    code: z.string(),
    errors: z.string().nullable(),
  }),
}

/**
 * @name 보드삭제
 * @method DELETE
 * @path `/boards/{boardId}`
 * @description 보드 삭제하는 API의 스키마
 */
export const deleteBoardSchema = {
  path: z.object({
    boardId: boardSchema.shape.boardId,
  }),
  response: z.object({
    success: z.boolean(),
    message: z.string(),
    data: z.string().nullable(),
    code: z.string(),
    errors: z.string().nullable(),
  }),
}

/**
 * @name 보드진입
 * @method GET
 * @path `/boards/{boardId}/enter`
 * @description 현재 유저의 역할 정보를 조회하는 API의 스키마
 */
export const getBoardUserPositionSchema = {
  path: z.object({
    boardId: boardSchema.shape.boardId,
  }),
  response: z.object({
    success: z.boolean(),
    message: z.string(),
    data: z.object({
      boardId: boardSchema.shape.boardId,
      positionId: z.number().nullable(),
    }),
    code: z.string(),
    errors: z.string().nullable(),
  }),
}

/**
 * @name 보드 상세 조회
 * @method GET
 * @path `/boards/{boardId}`
 * @description 보드의 상세 정보를 조회하는 API의 스키마
 */
export const getBoardDetailSchema = {
  path: z.object({
    boardId: boardSchema.shape.boardId,
  }),
  response: z.object({
    success: z.boolean(),
    message: z.string(),
    data: boardSchema.pick({
      boardId: true,
      name: true,
      content: true,
      activityType: true,
      detailType: true,
    }),
    code: z.string(),
    errors: z.string().nullable(),
  }),
}

/**
 * @name 보드멤버조회
 * @method GET
 * @path `/boards/{boardId}/members`
 * @description 보드 멤버를 조회하는 API의 스키마
 */
export const getBoardMemberSchema = {
  path: z.object({
    boardId: boardSchema.shape.boardId,
  }),
  response: z.object({
    success: z.boolean(),
    message: z.string(),
    data: z.array(boardMemberSchema),
    code: z.string(),
    errors: z.string().nullable(),
  }),
}

/**
 * @name 보드탈퇴
 * @method DELETE
 * @path `/boards/{boardId}/members`
 * @description 보드 멤버를 탈퇴하는 API의 스키마
 */
export const deleteBoardMemberSchema = {
  path: z.object({
    boardId: boardSchema.shape.boardId,
  }),
  response: z.object({
    success: z.boolean(),
    message: z.string(),
    data: z.string().nullable(),
    code: z.string(),
    errors: z.string().nullable(),
  }),
}

/**
 * @name 보드포지션설정
 * @method PATCH
 * @path `/boards/{boardId}/members`
 * @description 보드 멤버의 포지션을 수정하는 API의 스키마
 */
export const patchBoardMemberSchema = {
  path: z.object({
    boardId: boardSchema.shape.boardId,
  }),
  query: z.object({
    positionId: z
      .number()
      .int()
      .min(1, 'positionId must be at least 1')
      .max(10, 'positionId must be at most 10'),
  }),
  response: z.object({
    success: z.boolean(),
    message: z.string(),
    data: z.string().nullable(),
    code: z.string(),
    errors: z.string().nullable(),
  }),
}
