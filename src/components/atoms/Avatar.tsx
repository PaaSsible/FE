interface AvatarProps {
  name: string
  className?: string
}

export default function Avatar({ name, className = '' }: AvatarProps) {
  return (
    <div
      className={`text-b5-bold flex h-8 w-8 items-center justify-center rounded-full bg-gray-200 text-gray-700 ${className}`}
    >
      {name.charAt(0)}
    </div>
  )
}
