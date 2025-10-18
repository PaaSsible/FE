import React from 'react'

import ArrowDownIcon from '@/assets/icons/arrow-down.svg'

interface ScrollDownProps {
  onClick: () => void
}

const ScrollDown: React.FC<ScrollDownProps> = ({ onClick }) => {
  return (
    <div
      className="absolute bottom-20 left-1/2 flex h-[56px] w-[36px] -translate-x-1/2 animate-bounce cursor-pointer justify-center"
      onClick={onClick}
    >
      <img src={ArrowDownIcon} alt="scroll down" className="h-[56px] w-[36px]" />
    </div>
  )
}

export default ScrollDown
