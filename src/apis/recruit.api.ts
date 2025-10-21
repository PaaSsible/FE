import PaaSsibleRecruit from '@/config/interceptors/recruit.interceptor'
import {
  deleteRecruitCommentSchema,
  deleteRecruitSchema,
  getMyRecruitSchema,
  getPositionsSchema,
  getRecruitApplicantsSchema,
  getRecruitCommentsSchema,
  getRecruitDetailSchema,
  getRecruitsSchema,
  getStacksSchema,
  postRecruitApplicantAcceptSchema,
  postRecruitCommentSchema,
  postRecruitSchema,
  putRecruitCommentSchema,
  putRecruitSchema,
} from '@/types/apis/recruit/recruit.api.schemas'
import type {
  DeleteRecruit,
  DeleteRecruitComment,
  GetMyRecruit,
  GetPositions,
  GetRecruitApplicants,
  GetRecruitComments,
  GetRecruitDetail,
  GetRecruits,
  GetStacks,
  PostRecruit,
  PostRecruitApplicantAccept,
  PostRecruitComment,
  PutRecruit,
  PutRecruitComment,
} from '@/types/apis/recruit/recruit.api.types'

/**
 * @name 포지션목록조회
 */
export const getPositions = async (): Promise<GetPositions['Response']> => {
  const res = await PaaSsibleRecruit.get('/recruits/positions')
  return getPositionsSchema.response.parse(res.data)
}

/**
 * @name 기술스택목록조회
 */
export const getStacks = async (): Promise<GetStacks['Response']> => {
  const res = await PaaSsibleRecruit.get('/recruits/stacks')
  return getStacksSchema.response.parse(res.data)
}

/**
 * @name 모집공고생성
 * @param body
 */
export const postRecruit = async (body: PostRecruit['Body']): Promise<PostRecruit['Response']> => {
  const parsedBody = postRecruitSchema.body.parse(body)
  const res = await PaaSsibleRecruit.post(`/recruits`, parsedBody)
  return postRecruitSchema.response.parse(res.data)
}

/**
 * @name 모집공고목록조회
 * @param query
 */
export const getRecruits = async (
  query: GetRecruits['Query'],
): Promise<GetRecruits['Response']> => {
  const parsedQuery = getRecruitsSchema.query.parse(query)
  const res = await PaaSsibleRecruit.get(`/recruits`, { params: parsedQuery })
  return getRecruitsSchema.response.parse(res.data)
}

/**
 * @name 모집공고수정
 * @param path
 * @param body
 */
export const putRecruit = async (
  path: PutRecruit['Path'],
  body: PutRecruit['Body'],
): Promise<PutRecruit['Response']> => {
  const parsedPath = putRecruitSchema.path.parse(path)
  const parsedBody = putRecruitSchema.body.parse(body)
  const res = await PaaSsibleRecruit.put(`/recruits/${parsedPath.postId}`, parsedBody)
  return putRecruitSchema.response.parse(res.data)
}

/**
 * @name 모집공고상세조회
 * @param path
 */
export const getRecruitDetail = async (
  path: GetRecruitDetail['Path'],
): Promise<GetRecruitDetail['Response']> => {
  const parsedPath = getRecruitDetailSchema.path.parse(path)
  const res = await PaaSsibleRecruit.get(`/recruits/${parsedPath.postId}`)
  return getRecruitDetailSchema.response.parse(res.data)
}

/**
 * @name 모집공고삭제
 * @param path
 */
export const deleteRecruit = async (
  path: DeleteRecruit['Path'],
): Promise<DeleteRecruit['Response']> => {
  const parsedPath = deleteRecruitSchema.path.parse(path)
  const res = await PaaSsibleRecruit.delete(`/recruits/${parsedPath.postId}`, {
    params: { postId: parsedPath.postId },
  })
  return deleteRecruitSchema.response.parse(res.data)
}

/**
 * @name 지원자목록조회
 * @param path
 */
export const getRecruitApplicants = async (
  path: GetRecruitApplicants['Path'],
): Promise<GetRecruitApplicants['Response']> => {
  const parsedPath = getRecruitApplicantsSchema.path.parse(path)
  const res = await PaaSsibleRecruit.get(`/recruits/${parsedPath.postId}/applications`)
  return getRecruitApplicantsSchema.response.parse(res.data)
}

// 응답 temp
/**
 * @name 지원수락
 * @param path
 * @param body
 */
export const postRecruitApplicantAccept = async (
  path: PostRecruitApplicantAccept['Path'],
  body: PostRecruitApplicantAccept['Body'],
): Promise<any> => {
  const parsedPath = postRecruitApplicantAcceptSchema.path.parse(path)
  const parsedBody = postRecruitApplicantAcceptSchema.body.parse(body)
  const res = await PaaSsibleRecruit.post(
    `/recruits/${parsedPath.postId}/applications/${parsedPath.applicationId}/accept`,
    parsedBody,
  )
  return res.data
}

/**
 *@name 나의모집글조회
 * @param query
 */
export const getMyRecruit = async (
  query: GetMyRecruit['Query'],
): Promise<GetMyRecruit['Response']> => {
  const parsedQuery = getMyRecruitSchema.query.parse(query)
  const res = await PaaSsibleRecruit.get(`/recruits/me/posts`, { params: parsedQuery })
  return getMyRecruitSchema.response.parse(res.data)
}

/**
 * @name 댓글작성
 * @param path
 * @param body
 */
export const postRecruitComment = async (
  path: PostRecruitComment['Path'],
  body: PostRecruitComment['Body'],
): Promise<any> => {
  const parsedPath = postRecruitCommentSchema.path.parse(path)
  const parsedBody = postRecruitCommentSchema.body.parse(body)
  const res = await PaaSsibleRecruit.post(`/recruits/${parsedPath.postId}/comments`, parsedBody)
  return res.data
}

/**
 * @name 댓글조회
 * @param path
 */
export const getRecruitComment = async (
  path: GetRecruitComments['Path'],
): Promise<GetRecruitComments['Response']> => {
  const parsedPath = getRecruitCommentsSchema.path.parse(path)
  const res = await PaaSsibleRecruit.get(`/recruits/${parsedPath.postId}/comments`)
  return getRecruitCommentsSchema.response.parse(res.data)
}

/**
 * @name 댓글수정
 * @param path
 * @param body
 */
export const putRecruitComment = async (
  path: PutRecruitComment['Path'],
  body: PutRecruitComment['Body'],
): Promise<any> => {
  const parsedPath = putRecruitCommentSchema.path.parse(path)
  const parsedBody = putRecruitCommentSchema.body.parse(body)
  const res = await PaaSsibleRecruit.put(`/recruits/comments/${parsedPath.commentId}`, parsedBody)
  return res.data
}
/**
 * @name 댓글삭제
 * @param path
 */
export const deleteRecruitComment = async (
  path: DeleteRecruitComment['Path'],
): Promise<DeleteRecruitComment['Response']> => {
  const parsedPath = deleteRecruitCommentSchema.path.parse(path)
  const res = await PaaSsibleRecruit.delete(`/recruits/comments/${parsedPath.commentId}`)
  return deleteRecruitCommentSchema.response.parse(res.data)
}
