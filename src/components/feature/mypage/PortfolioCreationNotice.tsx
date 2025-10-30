'use client'

interface PortfolioCreationNoticeProps {
  isVisible?: boolean
  projectName?: string | null
  mainCategory?: string | null
  subCategory?: string | null
}

export default function PortfolioCreationNotice({
  isVisible = false,
  projectName,
  mainCategory,
  subCategory,
}: PortfolioCreationNoticeProps) {
  if (!isVisible) {
    return null
  }

  const displayName = projectName?.trim() || '프로젝트'
  const hasCategories = Boolean(mainCategory || subCategory)

  return (
    <div className="bg-locallit-red-100 mb-6 flex flex-col justify-between rounded-lg p-6 text-gray-900 sm:flex-row sm:items-center">
      <div className="flex flex-col gap-2">
        <p className="font-medium">‘{displayName}’의 포트폴리오 생성을 진행 중입니다.</p>

        {hasCategories && (
          <div className="text-left text-sm text-gray-700">
            {mainCategory ?? ''}
            {mainCategory && subCategory ? ' > ' : ''}
            {subCategory ?? ''}
          </div>
        )}

        <p className="text-sm text-gray-700">
          생성이 완료되면 나의 포트폴리오 목록에서 확인할 수 있어요.
        </p>
      </div>

      <div className="mt-4 flex items-center sm:mt-0">
        <span className="text-locallit-red-500 text-sm font-semibold">생성 중...</span>
      </div>
    </div>
  )
}
