import { Square, CheckSquare } from 'lucide-react'
import React from 'react'

type CheckboxSize = 'small' | 'medium' | 'large'

interface CheckboxProps {
  checked: boolean
  onChange: () => void
  size?: CheckboxSize
}

const sizeMap: Record<CheckboxSize, number> = {
  small: 24,
  medium: 30,
  large: 36,
}

const Checkbox: React.FC<CheckboxProps> = ({ checked, onChange, size = 'small' }) => {
  const Icon = checked ? CheckSquare : Square

  return (
    <button type="button" onClick={onChange} className="flex items-center justify-center">
      <Icon
        size={sizeMap[size]}
        strokeWidth={2}
        className={checked ? 'text-black' : 'text-gray-550'}
      />
    </button>
  )
}

export default Checkbox
