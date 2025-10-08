import React from 'react'

const ServiceIntro: React.FC = () => {
  return (
    <section className="bg-gray-0 flex h-screen flex-col items-center justify-center">
      <h2 className="text-3xl font-semibold text-gray-900">서비스 소개</h2>
      <p className="mt-4 max-w-xl text-center text-gray-600">
        여기에 서비스 설명이 들어갑니다. 이후 섹션이 계속 아래로 이어질 수 있습니다.
      </p>
    </section>
  )
}

export default ServiceIntro
