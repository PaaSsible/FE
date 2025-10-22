import React from 'react'

import ScrollDown from './ScrollDown'

interface HeroSectionProps {
  onScrollDown: () => void
}

const HeroSection: React.FC<HeroSectionProps> = ({ onScrollDown }) => {
  return (
    <section className="bg-gray-0 relative flex h-screen flex-col items-center justify-center">
      <h1 className="text-s1-bold text-gray-900">서비스 메인 카피 영역</h1>

      <ScrollDown onClick={onScrollDown} />
    </section>
  )
}

export default HeroSection
