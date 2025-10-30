import { CircleQuestionMark } from 'lucide-react'
import type { JSX } from 'react'

import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'

interface QuestionTooltipProps {
  tipContent: string
}
const QuestionTooltip = ({ tipContent }: QuestionTooltipProps): JSX.Element => {
  return (
    <Tooltip>
      <TooltipTrigger>
        <CircleQuestionMark className="h-6 w-6 text-gray-500" />
      </TooltipTrigger>
      <TooltipContent
        side="bottom"
        align="start"
        className="max-w-80 bg-white py-3 pr-7 pl-5 font-['Pretendard'] text-sm leading-6 font-medium break-keep text-neutral-800 shadow-lg"
      >
        {tipContent}
      </TooltipContent>
    </Tooltip>
  )
}

export default QuestionTooltip
