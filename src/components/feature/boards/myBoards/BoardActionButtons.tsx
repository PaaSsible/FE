import Button from '@/components/atoms/Button'

interface BoardActionButtonsProps {
  onDeleteClick: () => void
}

export default function BoardActionButtons({ onDeleteClick }: BoardActionButtonsProps) {
  return (
    <div className="flex gap-2">
      <Button
        variant="secondary"
        size="big"
        className="!text-b5-medium !h-[40px] !border"
        onClick={onDeleteClick}
      >
        삭제하기
      </Button>
      <Button variant="secondary" size="big" className="!text-b5-medium !h-[40px] !border">
        수정하기
      </Button>
      <Button variant="primary">지원자 보러가기</Button>
    </div>
  )
}
