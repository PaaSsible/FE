import { SendHorizonal, AtSign } from 'lucide-react'
import { useState, useRef, type ReactElement } from 'react'

interface ChatInputProps {
  onSend: (text: string) => void
  isSending?: boolean
}

export default function ChatInput({ onSend, isSending = false }: ChatInputProps): ReactElement {
  const [text, setText] = useState('')
  const isComposing = useRef(false)
  const justFinishedComposition = useRef(false)

  const handleSend = () => {
    if (!text.trim()) return
    onSend(text)
    setText('')
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      if (isComposing.current || justFinishedComposition.current) {
        e.preventDefault()
        return
      }

      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="mt-4">
      <div className="flex flex-col">
        <div className="text-b5-medium flex items-center gap-2 bg-gray-700 px-3 py-2 text-gray-400">
          <AtSign size={16} className="text-locallit-red-50" /> 언급한 사람에게만 메시지 보내기
        </div>

        <div className="flex items-start gap-2 bg-gray-600 px-[17px] py-[13px]">
          <textarea
            placeholder="모든 사람에게 메시지 적기"
            className="h-[123px] flex-1 resize-none overflow-hidden text-white placeholder-gray-400 outline-none"
            rows={1}
            value={text}
            onChange={(e) => setText(e.target.value)}
            onCompositionStart={() => {
              isComposing.current = true
              justFinishedComposition.current = false
            }}
            onCompositionEnd={() => {
              isComposing.current = false
              justFinishedComposition.current = true
              setTimeout(() => {
                justFinishedComposition.current = false
              }, 10)
            }}
            onKeyDown={handleKeyDown}
          />

          <button
            onClick={handleSend}
            disabled={isSending}
            className={`mb-1 rounded-md px-2 py-2 ${isSending ? 'bg-gray-700 text-gray-400' : 'bg-locallit-red-500 text-gray-0 hover:bg-locallit-red-600'}`}
          >
            <SendHorizonal size={20} />
          </button>
        </div>
      </div>
    </div>
  )
}
