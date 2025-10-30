import { createQueryKeys } from '@lukemorales/query-key-factory'
import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
  type UseMutationResult,
  type UseSuspenseQueryResult,
} from '@tanstack/react-query'

import { getTaskDetail, getTaskList, postTask } from '@/apis/task.api'
import type { GetTaskDetail, GetTaskList, PostTask } from '@/types/apis/board/task.api.types'

export const taskQueryKeys = createQueryKeys('Task', {
  list: (projectId: number) => ({
    queryKey: [projectId],
  }),
  detail: (taskId: number, projectId: number) => ({
    queryKey: [{ taskId, projectId }],
  }),
})

export const useGetProjectTasks = (
  path: GetTaskList['Path'],
): UseSuspenseQueryResult<GetTaskList['Response'], Error> => {
  return useSuspenseQuery({
    queryKey: taskQueryKeys.list(path.boardId).queryKey,
    queryFn: () => getTaskList(path),
  })
}

export const usePostTask = (
  path: PostTask['Path'],
): UseMutationResult<PostTask['Response'], Error, PostTask['Body']> => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (body: PostTask['Body']) => postTask(path, body),
    onSuccess: () =>
      queryClient.refetchQueries({ queryKey: taskQueryKeys.list(path.boardId).queryKey }),
  })
}

export const useGetTaskDetail = (
  path: GetTaskDetail['Path'],
): UseSuspenseQueryResult<GetTaskDetail['Response'], Error> => {
  return useSuspenseQuery({
    queryKey: taskQueryKeys.detail(path.taskId, path.boardId).queryKey,
    queryFn: () => getTaskDetail(path),
  })
}
