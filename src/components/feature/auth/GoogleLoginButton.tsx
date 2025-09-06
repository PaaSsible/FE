import type { JSX } from 'react'
import { FcGoogle } from 'react-icons/fc'

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID
const REDIRECT_URI = 'http://localhost:5173/login/oauth2/code/google'
const SCOPE = 'openid email profile'
const RESPONSE_TYPE = 'code'

const GoogleLoginButton = (): JSX.Element => {
  const handleLogin = () => {
    const authURL = new URL('https://accounts.google.com/o/oauth2/v2/auth')
    authURL.searchParams.set('client_id', GOOGLE_CLIENT_ID)
    authURL.searchParams.set('redirect_uri', REDIRECT_URI)
    authURL.searchParams.set('response_type', RESPONSE_TYPE)
    authURL.searchParams.set('scope', SCOPE)
    authURL.searchParams.set('access_type', 'offline') // refresh token 요청
    authURL.searchParams.set('prompt', 'consent') // 매번 동의 받기

    window.location.href = authURL.toString()
  }
  return (
    <>
      <button
        onClick={handleLogin}
        className="bg-google-button relative flex h-11 max-w-[25rem] cursor-pointer items-center justify-center gap-3 rounded-sm px-4 transition-shadow"
      >
        <FcGoogle size={20} />
        <span className="font-roboto text-roboto-medium">Continue with Google</span>
      </button>
    </>
  )
}

export default GoogleLoginButton
