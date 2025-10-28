import { useNavigate } from 'react-router-dom'

import Button from '@/components/atoms/Button'

interface BoardActionButtonsProps {
  postId: number
  onDeleteClick: () => void
}

export default function BoardActionButtons({ postId, onDeleteClick }: BoardActionButtonsProps) {
  const navigate = useNavigate()

  const handleEditClick = () => {
    void navigate(`/boards/${postId}/edit`)
  }

  const handleMoveClick = () => {
    void navigate(`/boards/${postId}/applicants`)
  }

  return (
    <div className="flex gap-2">
      <Button variant="secondary" shape="square" onClick={onDeleteClick}>
        삭제하기
      </Button>
      <Button variant="secondary" shape="square" onClick={handleEditClick}>
        수정하기
      </Button>
      <Button variant="primary" onClick={handleMoveClick}>
        지원자 보러가기
      </Button>
    </div>
  )
}
