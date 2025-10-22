import CommentTextareaPanel from './CommentTextareaPanel'

interface Props {
  value: string
  onChange: (value: string) => void
  onSubmit: () => void | Promise<void>
  isSubmitting?: boolean
}

export default function CommentInput({ value, onChange, onSubmit, isSubmitting }: Props) {
  return (
    <div className="mt-3 flex flex-col gap-[41px]">
      <CommentTextareaPanel
        value={value}
        placeholder="댓글을 입력해 주세요."
        onChange={onChange}
        onCancel={() => onChange('')}
        onSubmit={() => void onSubmit()}
        variant="primary"
        isSubmitting={isSubmitting}
      />
      <div className="bg-gray-250 h-[1.5px]" />
    </div>
  )
}
