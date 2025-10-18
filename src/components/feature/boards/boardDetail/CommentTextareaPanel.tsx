import Button from '@/components/atoms/Button'

interface CommentTextareaPanelProps {
  value: string
  placeholder: string
  onChange: (value: string) => void
  onCancel: () => void
  onSubmit: () => void
  variant?: 'primary' | 'nested'
  className?: string
}

export default function CommentTextareaPanel({
  value,
  placeholder,
  onChange,
  onCancel,
  onSubmit,
  variant = 'nested',
  className = '',
}: CommentTextareaPanelProps) {
  const containerClasses = 'rounded-md border border-[#E2E8F0] bg-gray-0 p-3'
  const textareaHeight = variant === 'primary' ? 'h-[100px]' : 'h-[72px]'
  const isEmpty = value.trim().length === 0

  return (
    <div className={`${containerClasses} ${className}`}>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`bg-gray-0 text-b4-medium focus:border-locallit-red-300 focus:ring-locallit-red-100 w-full resize-none rounded-md border border-transparent px-4 py-2 text-gray-900 placeholder:text-gray-500 focus:ring-2 focus:outline-none ${textareaHeight}`}
      />
      <div className="mt-3 flex justify-end gap-3">
        <Button
          variant="secondary"
          size="medium"
          className="!h-[34px] !w-[80px] !border-none !bg-gray-200 !text-gray-600 enabled:hover:!bg-gray-300 disabled:!cursor-not-allowed disabled:!bg-gray-100 disabled:!text-gray-400"
          onClick={onCancel}
          disabled={isEmpty}
        >
          취소
        </Button>
        <Button size="medium" className="!h-[34px] !w-[80px]" onClick={onSubmit} disabled={isEmpty}>
          등록
        </Button>
      </div>
    </div>
  )
}
