import { createQueryKeys } from '@lukemorales/query-key-factory'
import {
  useMutation,
  useQueryClient,
  useSuspenseInfiniteQuery,
  type InfiniteData,
  type UseMutationResult,
  type UseSuspenseInfiniteQueryResult,
} from '@tanstack/react-query'

import { getChatRoomMessages, getChatRooms, postChatRoom } from '@/apis/chat.api'
import type {
  GetChatRoomMessages,
  GetChatRooms,
  PostChatRoom,
} from '@/types/apis/chat/chat.api.types'

export const chatQueryKeys = createQueryKeys('Chat', {
  list: (projectId: number) => ({
    queryKey: [projectId],
  }),
  messages: (roomId: number) => ({
    queryKey: [roomId],
  }),
})

export const getChatRoomsQueryOptions = (path: GetChatRooms['Path']) => ({
  queryKey: chatQueryKeys.list(path.boardId).queryKey,
  queryFn: () => getChatRooms(path),
  suspense: true,
})

export const usePostChatRoom = (
  path: PostChatRoom['Path'],
): UseMutationResult<PostChatRoom['Response'], Error, PostChatRoom['Body']> => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (body: PostChatRoom['Body']) => postChatRoom(path, body),
    onSuccess: () =>
      queryClient.refetchQueries({ queryKey: chatQueryKeys.list(path.boardId).queryKey }),
  })
}

export const useGetChatRoomMessages = (
  path: GetChatRoomMessages['Path'],
): UseSuspenseInfiniteQueryResult<InfiniteData<GetChatRoomMessages['Response']>, Error> => {
  return useSuspenseInfiniteQuery({
    queryKey: chatQueryKeys.messages(path.roomId).queryKey,
    queryFn: ({ pageParam = 0 }) => getChatRoomMessages(path, { page: pageParam, size: 20 }),
    getNextPageParam: (lastPage: GetChatRoomMessages['Response']) =>
      lastPage.data.hasNext ? lastPage.data.currentPage + 1 : undefined,
    initialPageParam: 0,
    retry: false,
  })
}
