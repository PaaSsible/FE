import { SquareArrowOutUpRight, X } from 'lucide-react'
import type { JSX } from 'react'

import type { Link } from '@/types/entities/board/board.entitites.types'

import DeleteLinkButton from './DeleteLinkButton'

interface ExternalLinkItemProps {
  item: Link
}
const ExternalLinkItem = ({ item }: ExternalLinkItemProps): JSX.Element => {
  return (
    <div className="flex flex-1/2 justify-between">
      <a
        href={item.url}
        className="flex gap-4 text-base leading-6 font-semibold text-zinc-800 underline underline-offset-2 opacity-80"
      >
        <SquareArrowOutUpRight className="h-6 w-6 text-zinc-800" />
        {item.name}
      </a>
      <DeleteLinkButton id={item.id} />
    </div>
  )
}
export default ExternalLinkItem
