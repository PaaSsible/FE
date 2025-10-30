import { ArrowUpIcon, Plus } from 'lucide-react'
import { useRef, useState, type ChangeEvent, type JSX } from 'react'
import { useParams } from 'react-router-dom'

import {
  InputGroupTextarea,
  InputGroupAddon,
  InputGroupButton,
  InputGroup,
} from '@/components/ui/input-group'
import { Separator } from '@/components/ui/separator'

interface ChatInputGroupProps {
  onSend: (message: string) => void
  onFileSend: (file: File | undefined) => void
}
const ChatInputGroup = ({ onSend, onFileSend }: ChatInputGroupProps): JSX.Element => {
  const { roomId } = useParams<{ roomId: string }>()
  const [message, setMessage] = useState<string>('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const onFileAddButton = () => {
    fileInputRef.current?.click()
  }

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    onFileSend(file)
  }

  const onSendButton = () => {
    onSend(message)
    setMessage('')
  }

  return (
    <InputGroup>
      <InputGroupTextarea
        placeholder="보낼 메시지를 입력하세요."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        className="!focus-visible:ring-none"
        onKeyDown={(e) => {
          if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault()
            onSendButton()
          }
        }}
      />
      <InputGroupAddon align="block-end" className="justify-end">
        <InputGroupButton
          variant="outline"
          className="rounded-full"
          size="icon-xs"
          onClick={onFileAddButton}
        >
          <Plus />
        </InputGroupButton>
        <input ref={fileInputRef} type="file" className="hidden" onChange={handleChange} />
        <Separator orientation="vertical" className="!h-4" />
        <InputGroupButton
          variant="default"
          className="bg-locallit-red-500 rounded-full"
          size="icon-xs"
          disabled={message ? false : true}
          onClick={() => onSendButton()}
        >
          <ArrowUpIcon />
          <span className="sr-only">Send</span>
        </InputGroupButton>
      </InputGroupAddon>
    </InputGroup>
  )
}

export default ChatInputGroup
