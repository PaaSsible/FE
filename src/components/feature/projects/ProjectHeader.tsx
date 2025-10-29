import clsx from 'clsx'
import type { JSX, ReactNode } from 'react'

interface ProjectHeaderProps {
  title: string
  className?: string
  children?: ReactNode
}

const ProjectHeader = ({ title, className, children }: ProjectHeaderProps): JSX.Element => {
  return (
    <h1
      className={clsx(
        'relative mb-6 flex justify-start gap-3.5 text-3xl leading-10 font-semibold text-black',
        className,
      )}
    >
      {title}
      {children}
    </h1>
  )
}

export default ProjectHeader
