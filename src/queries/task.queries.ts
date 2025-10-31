import { createQueryKeys } from '@lukemorales/query-key-factory'
import {
  QueryClient,
  useMutation,
  useQueryClient,
  useSuspenseQuery,
  type UseMutationResult,
  type UseSuspenseQueryResult,
} from '@tanstack/react-query'

import {
  deleteTask,
  getTaskDetail,
  getTaskList,
  patchTaskDescription,
  postTask,
} from '@/apis/task.api'
import type {
  DeleteTask,
  GetTaskDetail,
  GetTaskList,
  PatchTaskDescription,
  PostTask,
} from '@/types/apis/board/task.api.types'

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

export const usePatchTaskDescription = (
  path: PatchTaskDescription['Path'],
): UseMutationResult<PatchTaskDescription['Response'], Error, PatchTaskDescription['Body']> => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (body: PatchTaskDescription['Body']) => patchTaskDescription(path, body),
    onSuccess: () =>
      queryClient.refetchQueries({
        queryKey: taskQueryKeys.detail(path.taskId, path.boardId).queryKey,
      }),
  })
}

export const useDeleteTask = (
  path: DeleteTask['Path'],
): UseMutationResult<DeleteTask['Response'], Error, DeleteTask['Path']> => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: () => deleteTask(path),
    onSuccess: () => [
      queryClient.refetchQueries({
        queryKey: taskQueryKeys.list(path.boardId).queryKey,
      }),
      queryClient.invalidateQueries({
        queryKey: taskQueryKeys.detail(path.taskId, path.boardId).queryKey,
      }),
    ],
  })
}
