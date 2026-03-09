import { Plus, MoreHorizontal } from 'lucide-react'
import type { IProductActionsProps } from '../../model/types'

export function ProductActions({ onAddToCart, onMore }: IProductActionsProps) {
  return (
    <div className="flex items-center justify-center gap-8">
      <button
        type="button"
        onClick={onAddToCart}
        className="flex cursor-pointer items-center justify-center rounded-full text-white transition-opacity hover:opacity-85"
        style={{ width: 52, height: 27, backgroundColor: '#242EDB' }}
        aria-label="Добавить в корзину"
      >
        <Plus size={16} />
      </button>

      <button
        type="button"
        onClick={onMore}
        className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border border-gray-200 text-gray-400 transition-colors hover:bg-gray-50"
        aria-label="Ещё"
      >
        <MoreHorizontal size={16} />
      </button>
    </div>
  )
}
