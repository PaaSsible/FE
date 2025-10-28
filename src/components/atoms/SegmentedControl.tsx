import clsx from 'clsx'

type Variant = 'participant' | 'chatting'

interface SegmentedControlProps {
  variant: Variant
  onChange: (variant: Variant) => void
}

export default function SegmentedControl({ variant, onChange }: SegmentedControlProps) {
  return (
    <div className="flex h-[52px] w-[325px] items-center rounded-[26px] bg-gray-700 px-2">
      {/* 참가자 */}
      <button
        onClick={() => onChange('participant')}
        className={clsx(
          'h-[40px] flex-1 rounded-[26px] transition-all duration-300',
          variant === 'participant'
            ? 'bg-gray-550 text-b4-bold text-gray-0'
            : 'text-b4-regular text-gray-500 hover:text-gray-300',
        )}
      >
        참가자
      </button>

      {/* 채팅 */}
      <button
        onClick={() => onChange('chatting')}
        className={clsx(
          'h-[40px] flex-1 rounded-[26px] transition-all duration-300',
          variant === 'chatting'
            ? 'bg-gray-550 text-b4-bold text-gray-0'
            : 'text-b4-regular text-gray-500 hover:text-gray-300',
        )}
      >
        채팅
      </button>
    </div>
  )
}
