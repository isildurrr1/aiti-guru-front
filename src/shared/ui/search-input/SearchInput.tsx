import { Search } from 'lucide-react'

export interface ISearchInputProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
}

export function SearchInput({ value, onChange, placeholder = 'Найти' }: ISearchInputProps) {
  return (
    <div className="relative w-full">
      <Search className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400" size={18} />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-lg border-0 bg-[#F3F3F3] py-2.5 pr-4 pl-10 text-sm text-gray-900 outline-none placeholder:text-gray-400"
      />
    </div>
  )
}
