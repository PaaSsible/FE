import { useEffect, useState } from 'react'

import { cn } from '@/lib/utils'

interface AvatarProps {
  name: string
  src?: string | null
  className?: string
}

const DEFAULT_AVATAR_SRC = '/assets/images/profile_default.png'

const resolveSrc = (value?: string | null) => {
  const trimmed = typeof value === 'string' ? value.trim() : null
  return trimmed ? trimmed : DEFAULT_AVATAR_SRC
}

export default function Avatar({ name, src, className }: AvatarProps) {
  const [currentSrc, setCurrentSrc] = useState(() => resolveSrc(src))

  useEffect(() => {
    setCurrentSrc(resolveSrc(src))
  }, [src])

  const handleImageError = () => {
    if (currentSrc !== DEFAULT_AVATAR_SRC) {
      setCurrentSrc(DEFAULT_AVATAR_SRC)
    }
  }

  return (
    <div className={cn('relative h-8 w-8 overflow-hidden rounded-full', className)}>
      <img
        src={currentSrc}
        alt={name ? `${name}의 프로필 이미지` : '프로필 이미지'}
        className="h-full w-full object-cover"
        onError={handleImageError}
      />
    </div>
  )
}
