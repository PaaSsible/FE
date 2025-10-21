import CommentTextareaPanel from './CommentTextareaPanel'

interface Props {
  value: string
  onChange: (value: string) => void
  onSubmit: () => void | Promise<void>
  isSubmitting?: boolean
}

export default function CommentInput({ value, onChange, onSubmit, isSubmitting }: Props) {
  return (
    <div className="mt-4 mb-10">
      <CommentTextareaPanel
        value={value}
        placeholder="댓글을 입력해 주세요."
        onChange={onChange}
        onCancel={() => onChange('')}
        onSubmit={() => void onSubmit()}
        variant="primary"
        isSubmitting={isSubmitting}
      />
      <div className="mt-4 h-[1.5px] bg-gray-200" />
    </div>
  )
}
