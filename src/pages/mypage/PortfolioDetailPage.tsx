import dayjs from 'dayjs'
import { useMemo } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import Button from '@/components/atoms/Button'
import { MypageHeader } from '@/components/feature/mypage/MypageHeader'
import { useUserPortfolioDetail } from '@/hooks/mypage/useUserPortfolioDetail'

type PortfolioDetailRouteParams = {
  portfolioId?: string
  userId?: string
}

export default function PortfolioDetailPage() {
  const navigate = useNavigate()
  const { portfolioId, userId } = useParams<PortfolioDetailRouteParams>()

  const numericPortfolioId = portfolioId ? Number(portfolioId) : NaN
  const isValidPortfolioId = Number.isInteger(numericPortfolioId) && numericPortfolioId > 0
  const fallbackPath = userId ? `/users/${userId}/profile` : '/mypage/portfolio'

  const { data, isLoading, isError } = useUserPortfolioDetail({
    portfolioId: isValidPortfolioId ? numericPortfolioId : undefined,
    enabled: isValidPortfolioId,
  })

  const pageTitle = data?.title ?? '포트폴리오 상세'

  const formattedDate = useMemo(() => {
    if (!data?.createdAt) return null
    return dayjs(data.createdAt).format('YYYY.MM.DD')
  }, [data?.createdAt])

  const primaryMeta = useMemo(() => {
    if (!data) return null
    if (data.mainCategory && data.subCategory) {
      return `${data.mainCategory} > ${data.subCategory}`
    }
    if (data.summary) {
      return data.summary
    }
    return null
  }, [data])

  const handleBack = () => {
    if (window.history.length > 1) {
      void navigate(-1)
    } else {
      void navigate(fallbackPath)
    }
  }

  if (!isValidPortfolioId) {
    return (
      <div className="flex min-h-screen flex-col bg-gray-50 px-[144px] py-[44px]">
        <MypageHeader title="포트폴리오 상세" onBackClick={handleBack} />
        <div className="mt-20 text-center text-gray-500">잘못된 포트폴리오입니다.</div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col bg-gray-50 px-[144px] py-[44px]">
      <MypageHeader title={pageTitle} onBackClick={handleBack} />

      {isLoading ? (
        <div className="flex flex-1 items-center justify-center text-gray-500">
          포트폴리오를 불러오는 중입니다...
        </div>
      ) : isError || !data ? (
        <div className="flex flex-1 flex-col items-center justify-center gap-4 text-gray-500">
          <p>포트폴리오를 불러오지 못했습니다.</p>
          <Button variant="secondary" onClick={handleBack}>
            이전 페이지로 돌아가기
          </Button>
        </div>
      ) : (
        <div>
          <header className="mt-6 flex justify-between border-b-[1.5px] border-gray-300 pb-6">
            {primaryMeta && <span className="text-b4-medium text-gray-700">{primaryMeta}</span>}
            <div className="text-b5-medium flex flex-wrap items-center gap-6 text-gray-900">
              {typeof data.contribution === 'number' && (
                <span className="flex gap-[9px]">
                  기여도:
                  <span className="text-b5-bold">{data.contribution}%</span>
                </span>
              )}
              {data.positionName && (
                <span className="flex gap-[9px]">
                  포지션:
                  <span className="text-b5-bold">{data.positionName}</span>
                </span>
              )}
              {formattedDate && (
                <span className="flex gap-[9px]">
                  작성일:
                  <span className="text-b5-bold">{formattedDate}</span>
                </span>
              )}
            </div>
          </header>

          <section className="prose prose-base text-b5-medium max-w-none text-left text-gray-800">
            {data.description ? (
              <div dangerouslySetInnerHTML={{ __html: data.description }} />
            ) : (
              <p>본문 내용이 없습니다.</p>
            )}
          </section>
        </div>
      )}
    </div>
  )
}
