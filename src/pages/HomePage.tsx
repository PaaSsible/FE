import { useEffect } from 'react'

import { getBoardList } from '@/apis/board.api'

const HomePage = () => {
  useEffect(() => {
    void getBoardList({})
  }, [])
  return <div>this is home</div>
}

export default HomePage
