import { RefreshCw, Plus } from 'lucide-react'
import type { IProductsToolbarProps } from '../../model/types'

export function ProductsToolbar({ onAdd, onFilter }: IProductsToolbarProps) {
  return (
    <div className="flex items-center justify-between px-[30px] pt-[30px] pb-[40px]">
      <h2 className="text-xl font-semibold text-gray-900">Все позиции</h2>

      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onFilter}
          className="flex h-[42px] w-[42px] cursor-pointer items-center justify-center rounded-lg border border-gray-200 text-gray-500 transition-colors hover:bg-gray-50"
          aria-label="Фильтры"
        >
          <RefreshCw size={18} />
        </button>

        <button
          type="button"
          onClick={onAdd}
          className="inline-flex h-[42px] cursor-pointer items-center gap-2 rounded-lg px-5 text-sm font-medium text-white transition-opacity hover:opacity-85"
          style={{ backgroundColor: '#242EDB' }}
        >
          <span className="flex h-5 w-5 items-center justify-center rounded-full border border-white">
            <Plus size={12} />
          </span>
          Добавить
        </button>
      </div>
    </div>
  )
}
