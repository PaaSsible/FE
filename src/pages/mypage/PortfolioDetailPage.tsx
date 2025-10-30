import dayjs from 'dayjs'
import DOMPurify from 'dompurify'
import { FileImage } from 'lucide-react'
import { useMemo, type ReactElement } from 'react'
import ReactMarkdown from 'react-markdown'
import { useNavigate, useParams } from 'react-router-dom'

import Button from '@/components/atoms/Button'
import { MypageHeader } from '@/components/feature/mypage/MypageHeader'
import { useUserPortfolioDetail } from '@/hooks/mypage/useUserPortfolioDetail'
import { detailTypeToLabel, mainCategoryToLabel } from '@/utils/recruitMeta'

// params shape is dynamic at runtime; we'll coerce from useParams instead of using a strict generic

export default function PortfolioDetailPage(): ReactElement {
  const navigate = useNavigate()
  // react-router's useParams can be untyped at runtime; coerce to a record of optional strings
  const params = useParams() as Record<string, string | undefined>
  const { portfolioId, userId } = params

  const numericPortfolioId = portfolioId ? Number(portfolioId) : NaN
  const isValidPortfolioId = Number.isInteger(numericPortfolioId) && numericPortfolioId > 0
  const fallbackPath = userId ? `/users/${userId}/profile` : '/mypage/portfolio'

  const { data, isLoading, isError } = useUserPortfolioDetail({
    portfolioId: isValidPortfolioId ? numericPortfolioId : undefined,
    enabled: isValidPortfolioId,
  })

  const pageTitle = data?.title ?? '포트폴리오 상세'

  const sanitizedDescription = useMemo(() => {
    if (!data?.description || typeof data.description !== 'string') return ''
    const purifier = DOMPurify as unknown as { sanitize: (s: string) => string }
    return purifier.sanitize(data.description)
  }, [data?.description])

  const hasHtml = useMemo(() => {
    if (!data?.description || typeof data.description !== 'string') return false
    return /<\/?[a-z][\s\S]*>/i.test(data.description)
  }, [data?.description])

  const formattedDate = useMemo(() => {
    if (!data?.createdAt) return null
    return dayjs(data.createdAt).format('YYYY.MM.DD')
  }, [data?.createdAt])

  const primaryMeta = useMemo(() => {
    if (!data) return null
    if (data.mainCategory && data.subCategory) {
      const mainCategoryLabel = mainCategoryToLabel(data.mainCategory)
      const subCategoryLabel = detailTypeToLabel(data.subCategory)
      return `${mainCategoryLabel} > ${subCategoryLabel}`
    }
    if (data.mainCategory) {
      return mainCategoryToLabel(data.mainCategory)
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
    <div className="flex min-h-screen flex-col bg-gray-50 px-[144px]">
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
          {data.imageName && (
            <div className="bg-gray-250 mt-4 flex w-fit items-center justify-center gap-2 rounded-md px-[11px] py-[6px]">
              <FileImage size={24} />
              {data.imageName}
            </div>
          )}

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

          <section className="prose prose-base text-b5-medium mt-6 max-w-none text-left text-gray-800">
            {data.description ? (
              hasHtml ? (
                <div
                  dangerouslySetInnerHTML={{
                    __html: sanitizedDescription,
                  }}
                />
              ) : (
                <ReactMarkdown>{data.description}</ReactMarkdown>
              )
            ) : (
              <p>본문 내용이 없습니다.</p>
            )}
          </section>
        </div>
      )}
    </div>
  )
}
