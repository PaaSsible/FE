import z from 'zod'

import type {
  deleteBoardMemberSchema,
  getBoardDetailSchema,
  getBoardListSchema,
  getBoardMemberSchema,
  patchBoardMemberSchema,
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
 * @name 보드수정
 * @method PUT
 * @path `/boards/{boardId}`
 * @description 보드 수정하는 API의 타입
 */
export type PostBoard = {
  Body: z.infer<typeof postBoardSchema.body>
  Response: z.infer<typeof postBoardSchema.response>
}

/**
 * @name 보드삭제
 * @method DELETE
 * @path `/boards/{boardId}`
 * @description 보드 삭제하는 API의 타입
 */
export type PutBoard = {
  Path: z.infer<typeof putBoardSchema.path>
  Body: z.infer<typeof putBoardSchema.body>
}

/**
 * @name 보드진입
 * @method GET
 * @path `/boards/{boardId}`
 * @description 보드 상세 정보를 조회하는 API의 타입
 */
export type GetBoard = {
  Path: z.infer<typeof getBoardDetailSchema.path>
  Response: z.infer<typeof getBoardDetailSchema.response>
}

/**
 * @name 보드멤버조회
 * @method GET
 * @path `/boards/{boardId}/members`
 * @description 보드 멤버를 조회하는 API의 스키마
 */
export type GetBoardMemeber = {
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
