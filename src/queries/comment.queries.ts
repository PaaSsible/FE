import { createQueryKeys } from '@lukemorales/query-key-factory'
import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
  type UseMutationResult,
  type UseSuspenseQueryResult,
} from '@tanstack/react-query'

import { getTaskDetailComments, postTaskDetailComment } from '@/apis/task.api'
import type {
  GetTaskDetailComments,
  PostTaskDetailComment,
} from '@/types/apis/board/task.api.types'

export const commentQueryKeys = createQueryKeys('Comment', {
  list: (taskId: number, projectId: number) => ({
    queryKey: [{ taskId, projectId }],
  }),
})

export const useGetTaskComments = (
  path: GetTaskDetailComments['Path'],
): UseSuspenseQueryResult<GetTaskDetailComments['Response'], Error> => {
  return useSuspenseQuery({
    queryKey: commentQueryKeys.list(path.taskId, path.boardId).queryKey,
    queryFn: () => getTaskDetailComments(path),
  })
}

export const usePostTaskComment = (
  path: PostTaskDetailComment['Path'],
): UseMutationResult<PostTaskDetailComment['Response'], Error, PostTaskDetailComment['Body']> => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (body: PostTaskDetailComment['Body']) => postTaskDetailComment(path, body),
    onSuccess: () =>
      queryClient.refetchQueries({
        queryKey: commentQueryKeys.list(path.taskId, path.boardId).queryKey,
      }),
  })
}
