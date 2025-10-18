import React, { useRef, useState } from 'react'

import TermsConsentModal from '@/components/feature/auth/TermsConsentModal'
import HeroSection from '@/components/feature/landing/HeroSection'
import ServiceIntro from '@/components/feature/landing/ServiceIntro'

const LandingPage: React.FC = () => {
  const introRef = useRef<HTMLDivElement | null>(null)
  const [showModal, setShowModal] = useState(true)

  const handleScrollDown = () => {
    introRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <div>
      <HeroSection onScrollDown={handleScrollDown} />
      <div ref={introRef}>
        <ServiceIntro />
      </div>

      <TermsConsentModal
        isOpen={showModal}
        onClose={() => setShowModal(false)} // "둘러보기" 눌렀을 때 닫힘
        onConfirm={() => {
          console.log('프로필 설정 페이지로 이동')
          setShowModal(false)
        }}
      />
    </div>
  )
}

export default LandingPage
