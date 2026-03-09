import { ArrowUp, ArrowDown, ChevronsUpDown } from 'lucide-react'

export interface ISortableHeaderProps {
  children: React.ReactNode
  canSort: boolean
  isSorted: false | 'asc' | 'desc'
  onToggleSort: (e: React.MouseEvent) => void
}

export function SortableHeader({ children, canSort, isSorted, onToggleSort }: ISortableHeaderProps) {
  if (!canSort) return <>{children}</>

  return (
    <button
      type="button"
      onClick={onToggleSort}
      className="inline-flex cursor-pointer items-center gap-1 hover:text-gray-700"
    >
      {children}
      {isSorted === 'asc' && <ArrowUp size={14} className="text-blue-600" />}
      {isSorted === 'desc' && <ArrowDown size={14} className="text-blue-600" />}
      {!isSorted && <ChevronsUpDown size={14} className="text-gray-300" />}
    </button>
  )
}
