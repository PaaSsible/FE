import clsx from 'clsx'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import 'dayjs/locale/ko' // 한국어 로케일
import { ChevronLeft } from 'lucide-react'
import { Fragment, useEffect, useState, type JSX } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ZodError } from 'zod'

import { getTaskDetail, getTaskDetailComments, postTaskDetailComment } from '@/apis/task.api'
import Button from '@/components/atoms/Button'
import Separator from '@/components/feature/projects/Separator'
import { Textarea } from '@/components/ui/textarea'
import { useGetTaskComments, usePostTaskComment } from '@/queries/comment.queries'
import { useGetTaskDetail } from '@/queries/task.queries'
import { type Comment, type Task } from '@/types/entities/board/board.entitites.types'
import { getAuthUser } from '@/utils/authToken'

const ProjectTaskPage = (): JSX.Element => {
  const navigate = useNavigate()
  const { projectId, taskId } = useParams()
  const user = getAuthUser()
  const { data: taskData } = useGetTaskDetail({
    boardId: Number(projectId),
    taskId: Number(taskId),
  })
  const task = taskData.data
  const { data: commentData } = useGetTaskComments({
    boardId: Number(projectId),
    taskId: Number(taskId),
  })
  const { mutate: addComment, isPending } = usePostTaskComment({
    boardId: Number(projectId),
    taskId: Number(taskId),
  })
  const comments = commentData.data
  const [newComment, setNewComment] = useState<Comment['comment']>('')

  dayjs.extend(relativeTime)
  dayjs.locale('ko')

  const onAddComment = () => {
    if (!newComment) return
    addComment(
      { comment: newComment.trim() },
      {
        onSuccess: () => setNewComment(''),
      },
    )
  }

  if (task === undefined) {
    return <div>cannot find task</div>
  }
  return (
    <div className="flex min-h-full flex-col">
      <div className="mb-[3.375rem] flex items-center gap-3.5">
        <button onClick={() => void navigate(-1)}>
          <ChevronLeft className="h-10 w-10" />
        </button>

        <span className="justify-center text-3xl leading-10 font-semibold">{task.title}</span>
      </div>

      <div className="flex justify-between text-lg font-semibold opacity-80">
        <span>{task.assignees.map((a) => a.name).join(',')}</span>
        <span className="flex gap-6">
          <span>
            <span>마감일:</span> <span>{dayjs(task.dueDate).format('YYYY.MM.DD')}</span>
          </span>
          <span>
            <span>관련 파트:</span> <span>{task.positions.join(',')}</span>
          </span>
        </span>
      </div>
      <Separator className="mt-[1.8125rem] mb-[2.9375rem]" />

      <p className="flex justify-start text-left text-lg font-normal break-all">
        {task.description}
      </p>
      {/* <button className="mt-3 cursor-pointer self-start text-lg font-medium opacity-50">
        설명 편집
      </button> */}

      {/* 댓글 섹션 */}
      <section className="flex flex-1 flex-col">
        <h3 className="mt-[7.735rem] mb-[1.75rem] flex items-center justify-center self-start text-xl font-medium">
          댓글
          <span className="text-locallit-red-500 ml-2 text-2xl leading-9 font-medium">
            {comments ? comments.length : 0}
          </span>
        </h3>
        <div className="mb-3 flex items-center">
          <img className="mr-3 h-9 w-9 rounded-lg bg-zinc-500 p-2.5" />
          <span className="text-xl leading-8 font-medium">{user?.username}</span>
        </div>

        <div className="flex flex-1 flex-col">
          <div className="relative flex flex-col">
            <Textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="h-36 rounded bg-white px-6 py-3.5 text-base font-medium outline-1"
              placeholder="댓글을 입력해주세요"
            />
            <Button
              disabled={isPending ? true : false}
              onClick={() => void onAddComment()}
              className="absolute right-3 bottom-3"
            >
              등록하기
            </Button>
          </div>

          <Separator className="mt-6" />

          {comments && comments.length > 0 ? (
            <ol className="mt-10 flex flex-col rounded-lg bg-white px-6 py-[1.375rem] outline-1 outline-slate-200">
              {comments.map((c, index) => (
                <Fragment key={c.id}>
                  <li className="my-6 flex">
                    <img className="mr-2 h-9 w-9 rounded-lg bg-zinc-500 p-2.5" />
                    <div className="flex w-full flex-col items-start gap-3">
                      <div className="flex w-full justify-between">
                        <span
                          className={clsx(
                            'text-lg leading-7 font-medium',
                            task.assignees.some((a) => a.userId === c.userId) &&
                              'text-locallit-red-500',
                          )}
                        >
                          {c.userName}
                        </span>
                        <span className="text-lg leading-7 font-normal text-neutral-500">
                          {dayjs(c.createdAt).fromNow()}
                        </span>
                      </div>

                      {c.comment}
                    </div>
                  </li>
                  {index !== comments.length - 1 && <Separator />}
                </Fragment>
              ))}
            </ol>
          ) : (
            <div className="mt-24 flex justify-center">아직 댓글이 없습니다.</div>
          )}
        </div>
      </section>
    </div>
  )
}

export default ProjectTaskPage
