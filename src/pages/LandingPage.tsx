import React, { useRef } from 'react'

import HeroSection from '@/components/feature/landing/HeroSection'
import ServiceIntro from '@/components/feature/landing/ServiceIntro'

const LandingPage: React.FC = () => {
  const introRef = useRef<HTMLDivElement | null>(null)

  const handleScrollDown = () => {
    introRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <div>
      <HeroSection onScrollDown={handleScrollDown} />
      <div ref={introRef}>
        <ServiceIntro />
      </div>
    </div>
  )
}

export default LandingPage
