import type { JSX } from 'react'

import GoogleLoginButton from '@/components/feature/auth/GoogleLoginButton'

const StartPage = (): JSX.Element => {
  return (
    <div>
      this is login page
      <GoogleLoginButton />
    </div>
  )
}

export default StartPage
