import clsx from 'clsx'
import type { JSX } from 'react'

interface ProjectHeaderProps {
  title: string
  className?: string
}

const ProjectHeader = ({ title, className }: ProjectHeaderProps): JSX.Element => {
  return (
    <h1
      className={clsx(
        'mb-6 justify-center text-3xl leading-10 font-semibold text-black',
        className,
      )}
    >
      {title}
    </h1>
  )
}

export default ProjectHeader
