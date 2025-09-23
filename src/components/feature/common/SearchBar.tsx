import React from 'react'
import { FiSearch } from 'react-icons/fi'

interface SearchBarProps {
  placeholder?: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}

const SearchBar: React.FC<SearchBarProps> = ({
  placeholder = '검색어를 입력해 주세요.',
  value,
  onChange,
}) => {
  return (
    <div className="flex w-full max-w-[320px] items-center gap-2 rounded-xl bg-gray-200 px-4 py-3">
      <FiSearch className="text-gray-500" size={20} />
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="text-l1-bold placeholder:text-l1-medium w-full bg-transparent text-gray-700 placeholder-gray-500 focus:outline-none"
      />
    </div>
  )
}

export default SearchBar
