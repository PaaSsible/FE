import { useNavigate } from 'react-router-dom'

import { MypageHeader } from '@/components/feature/mypage/MypageHeader'

export default function MypagePortfolioPage() {
  const navigate = useNavigate()

  return (
    <div className="bg-gray-50 px-[100px]">
      <MypageHeader title="지원 내역" count={3} />
    </div>
  )
}
