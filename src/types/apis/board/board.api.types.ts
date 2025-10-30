import z from 'zod'

import type {
  deleteBoardMemberSchema,
  deleteBoardSchema,
  getBoardDetailSchema,
  getBoardListSchema,
  getBoardMemberSchema,
  getBoardUserPositionSchema,
  patchBoardMemberSchema,
  postBoardPortfolioSchema,
  postBoardSchema,
  putBoardSchema,
} from './board.api.schemas'

/**
 * @name 보드목록조회
 * @method GET
 * @path `/boards`
 * @description 보드 목록을 조회하는 API의 타입
 */
export type GetBoardList = {
  Query: z.infer<typeof getBoardListSchema.query>
  Response: z.infer<typeof getBoardListSchema.response>
}

/**
 * @name 보드생성
 * @method Post
 * @path `/boards`
 * @description 보드 수정하는 API의 타입
 */
export type PostBoard = {
  Body: z.infer<typeof postBoardSchema.body>
  Response: z.infer<typeof postBoardSchema.response>
}

/**
 * @name 보드수정
 * @method Put
 * @path `/boards/{boardId}`
 * @description 보드 수정하는 API의 타입
 */
export type PutBoard = {
  Path: z.infer<typeof putBoardSchema.path>
  Body: z.infer<typeof putBoardSchema.body>
  Response: z.infer<typeof putBoardSchema.response>
}

/**
 * @name 보드삭제
 * @method DELETE
 * @path `/boards/{boardId}`
 * @description 보드 삭제하는 API의 타입
 */
export type DeleteBoard = {
  Path: z.infer<typeof deleteBoardSchema.path>
  Response: z.infer<typeof deleteBoardSchema.response>
}

/**
 * @name 보드진입
 * @method GET
 * @path `/boards/{boardId}`
 * @description 현재 유저의 역할 정보를 조회하는 API의 타입
 */
export type GetBoardUserPosition = {
  Path: z.infer<typeof getBoardUserPositionSchema.path>
  Response: z.infer<typeof getBoardUserPositionSchema.response>
}

/**
 * @name 보드 상세 조회
 * @method GET
 * @path `/boards/{boardId}`
 * @description 보드 상세 정보를 조회하는 API의 타입
 */
export type GetBoardDetail = {
  Path: z.infer<typeof getBoardDetailSchema.path>
  Response: z.infer<typeof getBoardDetailSchema.response>
}

/**
 * @name 보드멤버조회
 * @method GET
 * @path `/boards/{boardId}/members`
 * @description 보드 멤버를 조회하는 API의 스키마
 */
export type GetBoardMember = {
  Path: z.infer<typeof getBoardMemberSchema.path>
  Response: z.infer<typeof getBoardMemberSchema.response>
}

/**
 * @name 보드탈퇴
 * @method DELETE
 * @path `/boards/{boardId}/members`
 * @description 보드 멤버를 탈퇴하는 API의 타입
 */
export type DeleteBoardMember = {
  Path: z.infer<typeof deleteBoardMemberSchema.path>
  Response: z.infer<typeof deleteBoardMemberSchema.response>
}

/**
 * @name 보드포지션설정
 * @method PATCH
 * @path `/boards/{boardId}/members`
 * @description 보드 멤버의 포지션을 수정하는 API의 타입
 */
export type PatchBoardMember = {
  Path: z.infer<typeof patchBoardMemberSchema.path>
  Query: z.infer<typeof patchBoardMemberSchema.query>
  Response: z.infer<typeof patchBoardMemberSchema.response>
}

/**
 * @name 보드포트폴리오생성
 * @method POST
 * @path `/boards/{boardId}/portfolio`
 * @description 보드 포트폴리오 생성을 요청하는 API의 타입
 */
export type PostBoardPortfolio = {
  Path: z.infer<typeof postBoardPortfolioSchema.path>
  Response: z.infer<typeof postBoardPortfolioSchema.response>
}
