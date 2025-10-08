import type { JSX } from 'react'
import GoogleLoginButton from '@/components/feature/auth/GoogleLoginButton'
import startIllustration from '@/assets/images/start-illustration.png'

const StartPage = (): JSX.Element => {
  return (
    <div className="flex h-screen items-center justify-center bg-white px-[50px]">
      {/* 좌측 */}
      <div className="flex w-[512px] flex-col justify-center gap-[53px] text-left">
        <div className="space-y-2">
          <h1 className="text-h3-medium">시작하기</h1>
          <p className="text-b4-regular">로컬잇과 함께 온라인 IT 협업을 효과적으로 진행해보세요!</p>
        </div>
        <GoogleLoginButton />
      </div>

      {/* 우측 */}
      <div className="flex w-[565px] items-center justify-center">
        <img
          src={startIllustration}
          alt="시작하기 일러스트"
          className="h-[820px] w-[565px] rounded-2xl"
        />
      </div>
    </div>
  )
}

export default StartPage
