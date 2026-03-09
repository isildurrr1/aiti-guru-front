import { useMemo } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import type { IProductsPaginationProps } from '../../model/types'

export function ProductsPagination({
  currentPage,
  totalPages,
  pageSize,
  totalItems,
  onPageChange,
  maxVisiblePages = 5,
}: IProductsPaginationProps) {
  const from = currentPage * pageSize + 1
  const to = Math.min((currentPage + 1) * pageSize, totalItems)

  const visiblePages = useMemo(() => {
    const pages: number[] = []
    let start = Math.max(0, currentPage - Math.floor(maxVisiblePages / 2))
    const end = Math.min(totalPages, start + maxVisiblePages)

    if (end - start < maxVisiblePages) {
      start = Math.max(0, end - maxVisiblePages)
    }

    for (let i = start; i < end; i++) {
      pages.push(i)
    }
    return pages
  }, [currentPage, totalPages, maxVisiblePages])

  const isFirstPage = currentPage === 0
  const isLastPage = currentPage === totalPages - 1

  return (
    <div className="border-t border-gray-100 px-6 py-[40px]">
      <div className="flex h-[52px] items-center justify-between">
        <p className="text-lg text-gray-500">
          Показано{' '}
          <span className="text-gray-900">
            {from}-{to}
          </span>{' '}
          из <span className="text-gray-900">{totalItems}</span>
        </p>

        <div className="flex items-center gap-1">
          <button
            type="button"
            disabled={isFirstPage}
            onClick={() => onPageChange(currentPage - 1)}
            className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-md text-gray-500 transition-colors hover:bg-gray-100 disabled:pointer-events-none disabled:opacity-30"
            aria-label="Предыдущая страница"
          >
            <ChevronLeft size={16} />
          </button>

          {visiblePages.map((page) => (
            <button
              key={page}
              type="button"
              onClick={() => onPageChange(page)}
              className={`flex h-8 w-8 items-center justify-center rounded-md text-sm font-medium transition-colors ${
                page === currentPage
                  ? 'cursor-default text-white'
                  : 'cursor-pointer text-gray-600 border border-gray-300 hover:bg-gray-100'
              }`}
              style={page === currentPage ? { backgroundColor: '#797FEA' } : undefined}
            >
              {page + 1}
            </button>
          ))}

          <button
            type="button"
            disabled={isLastPage}
            onClick={() => onPageChange(currentPage + 1)}
            className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-md text-gray-500 transition-colors hover:bg-gray-100 disabled:pointer-events-none disabled:opacity-30"
            aria-label="Следующая страница"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  )
}
