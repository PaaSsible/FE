import * as ProgressPrimitive from '@radix-ui/react-progress'
import type { ComponentProps, JSX } from 'react'

import { cn } from '@/lib/utils'

export function ContributionProgressBar({
  className,
  value,
  ...props
}: ComponentProps<typeof ProgressPrimitive.Root>): JSX.Element {
  return (
    <ProgressPrimitive.Root
      data-slot="progress"
      className={cn('relative h-2 w-full overflow-hidden rounded-full bg-zinc-300', className)}
      {...props}
    >
      <ProgressPrimitive.Indicator
        data-slot="progress-indicator"
        className="bg-locallit-red-500 h-full w-full flex-1 transition-all"
        style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
      />
    </ProgressPrimitive.Root>
  )
}
