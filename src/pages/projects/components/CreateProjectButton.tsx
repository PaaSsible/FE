import { PlusCircle } from 'lucide-react'
import type { JSX } from 'react'
import { useNavigate } from 'react-router-dom'

const CreateProjectButton = (): JSX.Element => {
  const navigate = useNavigate()
  return (
    <div
      onClick={() => {
        void navigate(`new`)
      }}
      className="flex h-60 cursor-pointer flex-col items-center justify-center rounded-[20px] bg-zinc-300 px-8 py-7 opacity-50"
    >
      <div className="mb-1.5 flex h-14 w-14 items-center justify-center">
        <PlusCircle className="h-11 w-11 opacity-80 outline-zinc-900" />
      </div>

      <div className="justify-center font-['Pretendard'] text-2xl leading-9 font-semibold text-zinc-900 opacity-80">
        새 프로젝트 보드 생성하기
      </div>
    </div>
  )
}

export default CreateProjectButton
