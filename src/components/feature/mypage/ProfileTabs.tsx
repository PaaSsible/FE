'use client'

import { useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import { Pagination } from '@/components/common/Pagination'
import PortfolioCard from '@/components/feature/mypage/PortfolioCard'
import { useUserPortfolios } from '@/hooks/mypage/useUserPortfolios'
import { useProfileStore } from '@/stores/profileStore'
import { getAuthUser } from '@/utils/authToken'

interface ProfileTabsProps {
  isMyProfile?: boolean
}

export default function ProfileTabs({ isMyProfile = false }: ProfileTabsProps) {
  const authUser = getAuthUser()
  const { userId: routeUserId } = useParams<{ userId?: string }>()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState<'info' | 'portfolio'>('info')
  const [currentPage, setCurrentPage] = useState(1)
  const pageSize = isMyProfile ? 8 : 10

  const { profile } = useProfileStore()
  const resolvedUserId = useMemo(() => {
    if (isMyProfile) {
      return authUser ? Number(authUser.id) : NaN
    }

    if (routeUserId) {
      const parsed = Number(routeUserId)
      if (!Number.isNaN(parsed)) {
        return parsed
      }
    }

    return authUser ? Number(authUser.id) : NaN
  }, [authUser, isMyProfile, routeUserId])
  const isUserIdValid = Number.isFinite(resolvedUserId) && !Number.isNaN(resolvedUserId)

  const { data, isLoading, isError } = useUserPortfolios({
    userId: isUserIdValid ? resolvedUserId : undefined,
    page: currentPage - 1,
    size: pageSize,
    enabled: activeTab === 'portfolio' && isUserIdValid,
  })

  const portfolios = data?.portfolios ?? []
  const pagination = data?.pagination
  const hasPortfolio = portfolios.length > 0
  const gridCols = isMyProfile ? 'grid-cols-4' : 'grid-cols-5'

  const totalPages = useMemo(() => {
    const pages = pagination?.totalPages ?? 1
    return Math.max(pages, 1)
  }, [pagination])

  const currentPortfolios = useMemo(() => portfolios, [portfolios])

  if (!profile) return null

  const title = isMyProfile ? '포트폴리오가 없습니다.' : '아직 업로드된 포트폴리오가 없습니다.'
  const description = isMyProfile
    ? `포트폴리오 관리 페이지에서 업로드 혹은 새로운 프로젝트 진행을 통해 포트폴리오를 채워보세요.`
    : `아직 등록된 작업물이 없습니다.\n곧 업데이트될 포트폴리오를 기다려주세요.`

  return (
    <div className="mt-8">
      {/* 탭 버튼 */}
      <div className="flex pl-2">
        <button
          onClick={() => {
            setActiveTab('info')
            setCurrentPage(1)
          }}
          className={`px-6 py-2 text-sm font-medium ${
            activeTab === 'info'
              ? 'border-locallit-red-500 text-locallit-red-500 border-b-2'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          정보
        </button>
        <button
          onClick={() => {
            setActiveTab('portfolio')
            setCurrentPage(1)
          }}
          className={`px-6 py-2 text-sm font-medium ${
            activeTab === 'portfolio'
              ? 'border-locallit-red-500 text-locallit-red-500 border-b-2'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          포트폴리오
        </button>
      </div>

      {/* 콘텐츠 영역 */}
      <div className="flex min-h-[614px] flex-col bg-gray-200 p-[55px]">
        {activeTab === 'info' ? (
          <div className="text-left">
            <h2 className="text-b3-bold mb-4 text-gray-800">{profile.introductionTitle}</h2>
            <p className="text-b5-medium leading-relaxed whitespace-pre-line text-gray-800">
              {profile.introductionContent}
            </p>
          </div>
        ) : isError ? (
          <div className="flex h-full items-center justify-center text-gray-500">
            포트폴리오를 불러오지 못했습니다.
          </div>
        ) : isLoading ? (
          <div className="flex h-full items-center justify-center text-gray-500">
            포트폴리오를 불러오는 중입니다...
          </div>
        ) : hasPortfolio ? (
          <>
            <div className={`grid ${gridCols} flex-1 gap-4`}>
              {currentPortfolios.map((p) => (
                <PortfolioCard
                  key={p.id}
                  {...p}
                  onSelect={(id) => {
                    if (isMyProfile) {
                      void navigate(`/mypage/portfolio/${id}`)
                    } else if (isUserIdValid) {
                      void navigate(`/users/${resolvedUserId}/profile/portfolio/${id}`)
                    }
                  }}
                />
              ))}
            </div>

            <div className="mt-auto">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={(page) => setCurrentPage(page)}
              />
            </div>
          </>
        ) : (
          <div className="flex h-full flex-col items-center justify-center gap-[29px] text-center">
            <h2 className="text-s1-bold text-gray-1000 mt-50">{title}</h2>
            <p className="text-b2-medium whitespace-pre-line text-gray-500">{description}</p>
          </div>
        )}
      </div>
    </div>
  )
}
