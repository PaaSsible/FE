import React, { useRef } from 'react'
import { useNavigate } from 'react-router-dom'

import Button from '@/components/atoms/Button'

const LandingPage: React.FC = () => {
  const introRef = useRef<HTMLDivElement | null>(null)

  const handleScrollDown = () => {
    introRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const navigate = useNavigate()

  return (
    <section className="bg-gray-0 relative flex h-screen flex-col items-center justify-center">
      <h1 className="text-h2-bold mb-10 text-gray-900">
        온라인 협업의 답은 단 하나, <span className="text-locallit-red-500">CoDo.</span> <br />{' '}
        복잡한 프로젝트 관리, 이제 한 곳에서 끝내세요.
      </h1>
      <Button shape="rounded" size="big" onClick={() => void navigate('/start')}>
        서비스 시작하기
      </Button>
    </section>
  )
}

export default LandingPage
