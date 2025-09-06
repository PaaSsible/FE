import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router'

const AuthCallBackPage = () => {
  const [searchParams] = useSearchParams()
  const [code, setCode] = useState<string>('')
  useEffect(() => {
    const code = searchParams.get('code')
    if (code) {
      console.log(code)
      setCode(code)
    }
  }, [searchParams])

  return <div>{code}</div>
}

export default AuthCallBackPage
