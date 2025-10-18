import React from 'react'

import Logo from '../atoms/Logo'

const Footer: React.FC = () => {
  return (
    <footer className="font-pretendard text-gray-550 mt-auto bg-gray-50 px-10 py-10">
      <div className="mx-auto flex max-w-6xl items-end justify-between">
        {/* 왼쪽 영역 */}
        <div className="flex flex-col gap-7">
          <Logo height={30} />
          <div className="flex flex-col gap-2">
            <div className="text-b5-medium flex gap-3">
              <a href="/terms">이용약관</a>
              <span className="text-gray-400">|</span>
              <a href="/privacy">개인정보처리방침</a>
            </div>
            <p className="text-l1-regular">E-mail | locallit.team@gmail.com</p>
          </div>
        </div>

        {/* 오른쪽 영역 */}
        <div className="text-l1-regular">Copyright © 2025 locallit. All right reserved</div>
      </div>
    </footer>
  )
}

export default Footer
