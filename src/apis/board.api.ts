import PaaSsibleBoard from '@/config/interceptors/board.interceptor'
import * as boardAPISchemas from '@/types/apis/board/board.api.schemas'
import type * as BoardAPITypes from '@/types/apis/board/board.api.types'

/**
 * @name 보드목록조회
 * @param query
 */
export const getBoardList = async (
  query: BoardAPITypes.GetBoardList['Query'],
): Promise<BoardAPITypes.GetBoardList['Response']> => {
  const parsedQuery = boardAPISchemas.getBoardListSchema.query.parse(query)
  const res = await PaaSsibleBoard.get(`/boards`, { params: parsedQuery })
  return boardAPISchemas.getBoardListSchema.response.parse(res.data)
}

/**
 * @name 보드생성
 * @param body
 */
export const postBoard = async (
  body: BoardAPITypes.PostBoard['Body'],
): Promise<BoardAPITypes.PostBoard['Response']> => {
  const parsedBody = boardAPISchemas.postBoardSchema.body.parse(body)
  const res = await PaaSsibleBoard.post(`/boards`, parsedBody)
  return boardAPISchemas.postBoardSchema.response.parse(res.data)
}

/**
 * @name 보드수정
 * @param path
 * @param body
 */
export const putBoard = async (
  path: BoardAPITypes.PutBoard['Path'],
  body: BoardAPITypes.PutBoard['Body'],
): Promise<BoardAPITypes.PutBoard['Response']> => {
  const parsedPath = boardAPISchemas.putBoardSchema.path.parse(path)
  const parsedBody = boardAPISchemas.putBoardSchema.path.parse(body)
  const res = await PaaSsibleBoard.put(`/boards/${parsedPath.boardId}`, parsedBody)
  return boardAPISchemas.putBoardSchema.response.parse(res.data)
}

/**
 * @name 보드삭제
 * @param path
 */
export const deleteBoard = async (
  path: BoardAPITypes.DeleteBoard['Path'],
): Promise<BoardAPITypes.DeleteBoard['Response']> => {
  const parsedPath = boardAPISchemas.deleteBoardSchema.path.parse(path)
  const res = await PaaSsibleBoard.delete(`/boards/${parsedPath.boardId}`)
  return boardAPISchemas.deleteBoardSchema.response.parse(res.data)
}

/**
 * @name 보드진입
 * @param path
 */
export const getBoardDetail = async (
  path: BoardAPITypes.GetBoardDetail['Path'],
): Promise<BoardAPITypes.GetBoardDetail['Response']> => {
  const parsedPath = boardAPISchemas.getBoardDetailSchema.path.parse(path)
  const res = await PaaSsibleBoard.get(`/boards/${parsedPath.boardId}`)
  return boardAPISchemas.getBoardDetailSchema.response.parse(res.data)
}

/**
 * @name 보드멤버조회
 * @param path
 */
export const getBoardMember = async (
  path: BoardAPITypes.GetBoardMember['Path'],
): Promise<BoardAPITypes.GetBoardMember['Response']> => {
  const parsedPath = boardAPISchemas.getBoardMemberSchema.path.parse(path)
  const res = await PaaSsibleBoard.get(`/boards/${parsedPath.boardId}/members`)
  return boardAPISchemas.getBoardMemberSchema.response.parse(res.data)
}

/**
 * @name 보드탈퇴
 * @param path
 */
export const deleteBoardMember = async (
  path: BoardAPITypes.DeleteBoardMember['Path'],
): Promise<BoardAPITypes.DeleteBoardMember['Response']> => {
  const parsedPath = boardAPISchemas.deleteBoardMemberSchema.path.parse(path)
  const res = await PaaSsibleBoard.delete(`/boards/${parsedPath.boardId}/members`)
  return boardAPISchemas.deleteBoardMemberSchema.response.parse(res.data)
}

/**
 * @name 보드포지션설정
 * @param path
 * @param query
 */
export const patchBoardMember = async (
  path: BoardAPITypes.PatchBoardMember['Path'],
  query: BoardAPITypes.PatchBoardMember['Query'],
): Promise<BoardAPITypes.PatchBoardMember['Response']> => {
  const parsedPath = boardAPISchemas.patchBoardMemberSchema.path.parse(path)
  const parsedQuery = boardAPISchemas.patchBoardMemberSchema.query.parse(query)
  const res = await PaaSsibleBoard.patch(
    `/boards/${parsedPath.boardId}/members`,
    {},
    { params: parsedQuery },
  )
  return boardAPISchemas.patchBoardMemberSchema.response.parse(res.data)
}

/**
 * @name 보드포트폴리오생성
 * @param path
 */
export const postBoardPortfolio = async (
  path: BoardAPITypes.PostBoardPortfolio['Path'],
): Promise<BoardAPITypes.PostBoardPortfolio['Response']> => {
  const parsedPath = boardAPISchemas.postBoardPortfolioSchema.path.parse(path)
  const res = await PaaSsibleBoard.post(`/boards/${parsedPath.boardId}/portfolio`)
  return boardAPISchemas.postBoardPortfolioSchema.response.parse(res.data)
}
