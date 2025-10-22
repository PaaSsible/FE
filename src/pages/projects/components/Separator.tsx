import clsx from 'clsx'
import type { JSX } from 'react'

interface SeparatorProps {
  className?: string
}
const Separator = ({ className }: SeparatorProps): JSX.Element => {
  return (
    <div
      className={clsx(
        'h-0 w-full opacity-20 outline-[1.50px] outline-offset-[-0.75px] outline-zinc-500',
        className,
      )}
    />
  )
}

export default Separator
