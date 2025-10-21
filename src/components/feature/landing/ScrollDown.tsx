import React from 'react'

interface ScrollDownProps {
  onClick: () => void
}

const ScrollDown: React.FC<ScrollDownProps> = ({ onClick }) => {
  const arrowDownIconSrc = '/assets/icons/arrow-down.svg'

  return (
    <div
      className="absolute bottom-20 left-1/2 flex h-[56px] w-[36px] -translate-x-1/2 animate-bounce cursor-pointer justify-center"
      onClick={onClick}
    >
      <img src={arrowDownIconSrc} alt="scroll down" className="h-[56px] w-[36px]" />
    </div>
  )
}

export default ScrollDown
