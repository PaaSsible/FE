import { useEffect, useMemo, useState, type JSX } from 'react'
import toast from 'react-hot-toast'
import { useNavigate, useParams } from 'react-router-dom'

import Button from '@/components/atoms/Button'
import Modal from '@/components/common/Modal'
import BoardsPageHeader from '@/components/feature/boards/BoardsPageHeader'
import BoardsDetailBody from '@/components/feature/boards/boardDetail/BoardsDetailBody'
import BoardsDetailComments from '@/components/feature/boards/boardDetail/BoardsDetailComments'
import BoardsDetailMeta from '@/components/feature/boards/boardDetail/BoardsDetailMeta'
import useCreateRecruitComment from '@/hooks/useCreateRecruitComment'
import useDeleteRecruitComment from '@/hooks/useDeleteRecruitComment'
import useDeleteRecruitPost from '@/hooks/useDeleteRecruitPost'
import useFetchRecruitComments from '@/hooks/useFetchRecruitComments'
import useRecruitDetail from '@/hooks/useRecruitDetail'
import useUpdateRecruitComment from '@/hooks/useUpdateRecruitComment'
import { getAuthUser } from '@/utils/authToken'

interface BoardDetailViewModel {
  postId: number
  title: string
  content: string
  mainCategory: string
  subCategory: string
  writerId: number
  writerName: string
  createdAt: string | null
  updatedAt: string | null
  deadline: string | null
  projectDuration: string | null
  viewCount: number
  applicationCount: number
  recruits: Array<{
    position: number | string
    stacks: Array<number | string>
  }>
}

export default function BoardDetailPage(): JSX.Element {
  const navigate = useNavigate()
  const { postId: postIdParam } = useParams<{ postId: string }>()
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const authUser = getAuthUser()

  const numericPostId = useMemo(() => {
    if (!postIdParam) return null

    const parsed = Number(postIdParam)
    return Number.isNaN(parsed) ? null : parsed
  }, [postIdParam])

  const { data: recruitDetail, isLoading, error } = useRecruitDetail(numericPostId)
  const {
    comments: recruitComments,
    totalCount: commentTotalCount,
    isLoading: isCommentsLoading,
    error: commentsError,
    refetch: refetchComments,
  } = useFetchRecruitComments(numericPostId)
  const { submitComment, isSubmitting: isCreatingComment } = useCreateRecruitComment(
    numericPostId,
    {
      onSuccess: refetchComments,
    },
  )
  const { updateComment, isUpdating: isUpdatingComment } = useUpdateRecruitComment({
    onSuccess: refetchComments,
  })
  const { deletePost, isDeleting: isDeletingPost } = useDeleteRecruitPost({
    onSuccess: () => {
      setIsDeleteModalOpen(false)
      void navigate('/boards')
    },
  })
  const { deleteComment, isDeleting: isDeletingComment } = useDeleteRecruitComment({
    onSuccess: refetchComments,
  })

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' })
  }, [numericPostId])

  const postForDisplay = useMemo<BoardDetailViewModel | null>(() => {
    if (!recruitDetail) {
      return null
    }

    return {
      postId: recruitDetail.postId,
      title: recruitDetail.title,
      content: recruitDetail.content,
      mainCategory: recruitDetail.mainCategory,
      subCategory: recruitDetail.subCategory,
      writerId: recruitDetail.writerId,
      writerName: recruitDetail.writerName,
      createdAt: null,
      updatedAt: null,
      deadline: recruitDetail.deadline ?? null,
      projectDuration: recruitDetail.projectDuration ?? null,
      viewCount: recruitDetail.viewCount,
      applicationCount: recruitDetail.applicationCount,
      recruits: recruitDetail.recruits ?? [],
    }
  }, [recruitDetail])

  const resolvedPostId = postForDisplay?.postId ?? numericPostId
  const resolvedPostIdString =
    resolvedPostId !== null && resolvedPostId !== undefined ? String(resolvedPostId) : null
  const isOwner =
    authUser?.id !== undefined &&
    postForDisplay !== null &&
    authUser.id === String(postForDisplay.writerId)

  const handleBackClick = () => {
    if (window.history.length > 1) {
      void navigate(-1)
    } else {
      void navigate('/boards')
    }
  }

  const handleApplyClick = () => {
    setIsApplyModalOpen(true)
  }

  const handleApplyCancel = () => {
    setIsApplyModalOpen(false)
  }

  const handleApplyConfirm = () => {
    setIsApplyModalOpen(false)
    //toast.success('지원이 완료되었습니다.')
  }

  const handleDeleteCancel = () => {
    setIsDeleteModalOpen(false)
  }

  const handleDeleteConfirm = () => {
    if (!postForDisplay) return
    void deletePost(postForDisplay.postId)
  }

  const handleViewApplicants = () => {
    if (!resolvedPostIdString) return
    void navigate(`/boards/${resolvedPostIdString}/applicants`)
  }

  return (
    <div className="flex min-h-screen flex-col bg-gray-50 px-[144px] py-[44px] text-start">
      <BoardsPageHeader
        title={
          postForDisplay?.title ??
          (isLoading ? '모집글 상세 보기' : error ? '모집글을 불러오지 못했습니다.' : '모집글 상세')
        }
        onBackClick={handleBackClick}
      />

      {isOwner && postForDisplay && (
        <div className="mt-5 flex w-full justify-end gap-3">
          <Button variant="secondary" onClick={() => setIsDeleteModalOpen(true)}>
            삭제하기
          </Button>
          <Button>수정하기</Button>
        </div>
      )}

      {isLoading && (
        <div className="text-b4-medium mt-10 text-center text-gray-600">
          모집글을 불러오는 중입니다.
        </div>
      )}

      {!isLoading && error && (
        <div className="text-b4-medium mt-10 rounded-md bg-red-50 p-6 text-center text-red-600">
          {error}
        </div>
      )}

      {!isLoading && !error && postForDisplay && (
        <>
          <BoardsDetailMeta post={postForDisplay} />
          <BoardsDetailBody content={postForDisplay.content} />

          <div className="mt-8 w-full">
            {isOwner ? (
              <Button className="w-full" onClick={handleViewApplicants}>
                지원자 보러 가기
              </Button>
            ) : (
              <Button className="w-full" onClick={handleApplyClick}>
                지원하기
              </Button>
            )}
          </div>

          <BoardsDetailComments
            comments={recruitComments}
            totalCount={commentTotalCount}
            currentUserId={authUser?.id ?? null}
            isLoading={isCommentsLoading}
            error={commentsError}
            onRetry={refetchComments}
            onSubmitComment={submitComment}
            onUpdateComment={updateComment}
            onDeleteComment={deleteComment}
            isSubmitting={isCreatingComment}
            isUpdating={isUpdatingComment}
            isDeleting={isDeletingComment}
          />
        </>
      )}

      {!isLoading && !error && !postForDisplay && (
        <div className="text-b4-medium mt-10 text-center text-gray-600">
          표시할 모집글을 찾지 못했습니다. 목록 페이지에서 다시 시도해 주세요.
        </div>
      )}

      {isOwner && postForDisplay && (
        <Modal
          isOpen={isApplyModalOpen}
          title="이 모집글에 지원하시겠어요?"
          description={
            <p>
              지원 시 작성자가 회원님의 프로필 정보를 확인할 수 있습니다.
              <br />
              지원 후에는 지원 취소가 불가능합니다.
            </p>
          }
          cancelLabel="취소"
          confirmLabel="지원하기"
          onCancel={handleApplyCancel}
          onConfirm={handleApplyConfirm}
        />
      )}
      {isOwner && postForDisplay && (
        <Modal
          isOpen={isDeleteModalOpen}
          title="모집글을 삭제하시겠어요?"
          description={
            <p>
              삭제한 모집글은 복구할 수 없습니다.
              <br />
              정말 삭제하시겠습니까?
            </p>
          }
          cancelLabel="삭제하기"
          confirmLabel="취소하기"
          onCancel={() => {
            handleDeleteConfirm()
          }}
          onConfirm={handleDeleteCancel}
          cancelDisabled={isDeletingPost}
          confirmDisabled={isDeletingPost}
        />
      )}
      {/* <Modal
        isOpen={isApplyModalOpen}
        title="프로필 설정이 완료되지 않았습니다."
        description={
          <p>
            지원을 위해 프로필의 필수 항목을 모두 입력해야 합니다.
            <br />
            프로필을 수정한 후 다시 시도해주세요.
          </p>
        }
        cancelLabel="취소"
        confirmLabel="프로필 설정하러 가기"
        onCancel={handleApplyCancel}
        onConfirm={handleApplyConfirm}
      /> */}
    </div>
  )
}
