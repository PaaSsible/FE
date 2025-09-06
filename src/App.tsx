import { type JSX } from 'react'

import '@/styles/App.css'
import GoogleLoginButton from './components/feature/auth/googleLoginButton'

function App(): JSX.Element {
  return (
    <>
      <GoogleLoginButton />
    </>
  )
}

export default App
