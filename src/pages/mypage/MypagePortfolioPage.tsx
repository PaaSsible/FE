'use client'

import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import Button from '@/components/atoms/Button'
import Modal from '@/components/common/Modal'
import { Pagination } from '@/components/common/Pagination'
import { MypageHeader } from '@/components/feature/mypage/MypageHeader'
import PortfolioCard from '@/components/feature/mypage/PortfolioCard'
import PortfolioCreationNotice from '@/components/feature/mypage/PortfolioCreationNotice'
import { useDeleteUserPortfolio } from '@/hooks/mypage/useDeleteUserPortfolio'
import { useUserPortfolios } from '@/hooks/mypage/useUserPortfolios'
import { getAuthUser } from '@/utils/authToken'

export default function MypagePortfolioPage() {
  const navigate = useNavigate()
  const authUser = getAuthUser()
  const [currentPage, setCurrentPage] = useState(1)
  const [modalType, setModalType] = useState<'edit' | 'delete' | null>(null)
  const [selectedId, setSelectedId] = useState<number | null>(null)
  const pageSize = 12

  const userId = Number(authUser?.id)

  const { data, isLoading, isError, refetch } = useUserPortfolios({
    userId,
    page: currentPage - 1,
    size: pageSize,
    enabled: Boolean(userId),
  })

  const portfolios = data?.portfolios ?? []
  const pagination = data?.pagination

  const totalPages = useMemo(() => {
    const pages = pagination?.totalPages ?? 1
    return Math.max(pages, 1)
  }, [pagination])

  const hasPortfolio = portfolios.length > 0
  const { deletePortfolio, isDeleting } = useDeleteUserPortfolio({
    onSuccess: () => {
      setModalType(null)
      setSelectedId(null)
      refetch()
    },
  })

  useEffect(() => {
    if (!pagination || isLoading) return
    const maxPage = Math.max(pagination.totalPages, 1)
    if (currentPage > maxPage) {
      setCurrentPage(maxPage)
    }
  }, [pagination, currentPage, isLoading])

  const handleEditClick = (id: number) => {
    setSelectedId(id)
    setModalType('edit')
  }

  const handleDeleteClick = (id: number) => {
    setSelectedId(id)
    setModalType('delete')
  }

  const handleConfirm = async () => {
    if (modalType === 'edit' && selectedId !== null) {
      setModalType(null)
      setSelectedId(null)
      void navigate('/mypage/portfolio/new', { state: { editId: selectedId } })
      return
    }

    if (modalType === 'delete' && selectedId !== null) {
      const success = await deletePortfolio(selectedId)
      if (!success) {
        return
      }
      return
    }

    setModalType(null)
    setSelectedId(null)
  }

  const handleCloseModal = () => {
    setModalType(null)
    setSelectedId(null)
  }

  if (!userId || Number.isNaN(userId)) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 px-[100px] text-gray-600">
        로그인 후 포트폴리오를 확인할 수 있습니다.
      </div>
    )
  }

  return (
    <div className="bg-gray-50 px-[100px]">
      <MypageHeader title="나의 포트폴리오 목록" />

      <div className="mb-4 flex w-full justify-end">
        <Button onClick={() => void navigate('/mypage/portfolio/new')}>추가하기</Button>
      </div>

      <PortfolioCreationNotice />

      <div className="flex min-h-[850px] flex-col">
        {isError ? (
          <div className="flex flex-1 items-center justify-center text-gray-500">
            포트폴리오를 불러오지 못했습니다.
          </div>
        ) : isLoading ? (
          <div className="flex flex-1 items-center justify-center text-gray-500">
            포트폴리오를 불러오는 중입니다...
          </div>
        ) : hasPortfolio ? (
          <>
            <div className="flex-1">
              <div className="grid grid-cols-4 gap-[19px]">
                {portfolios.map((p) => (
                  <PortfolioCard
                    key={p.id}
                    {...p}
                    onSelect={() => {
                      void navigate(`/mypage/portfolio/${p.id}`)
                    }}
                    onEdit={() => handleEditClick(p.id)}
                    onDelete={() => handleDeleteClick(p.id)}
                  />
                ))}
              </div>
            </div>

            <div className="mt-auto pb-10">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={(page) => setCurrentPage(page)}
              />
            </div>
          </>
        ) : (
          <div className="flex flex-1 flex-col items-center justify-center text-center">
            <h2 className="mb-2 text-[18px] font-semibold text-gray-900">포트폴리오가 없습니다.</h2>
            <p className="whitespace-pre-line text-gray-500">
              포트폴리오 업로드 혹은 새로운 프로젝트 진행을 통해 포트폴리오를 채워보세요.
            </p>
          </div>
        )}
      </div>

      <Modal
        isOpen={modalType !== null}
        title={
          modalType === 'edit' ? '포트폴리오를 수정하시겠어요?' : '포트폴리오를 삭제하시겠어요?'
        }
        description={
          modalType === 'edit' ? (
            <div>
              수정 후에는 이전 버전으로 되돌릴 수 없습니다.
              <br />
              그래도 수정하시겠어요?
            </div>
          ) : (
            <div>
              삭제한 포트폴리오는 복구할 수 없습니다.
              <br />
              정말 삭제하시겠어요?
            </div>
          )
        }
        cancelLabel="뒤로가기"
        confirmLabel={modalType === 'edit' ? '수정하기' : '삭제하기'}
        onCancel={handleCloseModal}
        onConfirm={() => {
          void handleConfirm()
        }}
        cancelDisabled={modalType === 'delete' && isDeleting}
        confirmDisabled={modalType === 'delete' && isDeleting}
      />
    </div>
  )
}
