import { useState, useCallback } from 'react'
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  flexRender,
  type SortingState,
  type RowSelectionState,
} from '@tanstack/react-table'

import { PageHeader } from 'shared/ui/page-header/PageHeader'
import { SearchInput } from 'shared/ui/search-input/SearchInput'
import { SortableHeader } from 'shared/ui/sortable-header/SortableHeader'
import { useDebounce } from 'shared/lib/useDebounce'

import { useGetProductsQuery, useSearchProductsQuery } from 'entities/product/api/productsApi'
import { useProductColumns, PAGE_SIZE } from 'entities/product/model/useProductColumns'

import { ProductsToolbar, ProductActions, ProductsPagination } from 'features/products'
import { TopProgressBar } from 'shared/ui/top-progress-bar/TopProgressBar'
import { AddProductModal } from 'widgets/add-product-modal'

const COLUMN_ALIGNMENT: Record<string, string> = {
  select: 'text-left pl-4 pr-0',
  title: 'text-left pl-[18px] pr-4',
  price: 'text-center pl-4 pr-0',
  actions: 'text-center pl-0 pr-0',
}

const columnAlignment = (columnId: string) => COLUMN_ALIGNMENT[columnId] ?? 'text-center px-4'

export default function ProductsPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [page, setPage] = useState(0)
  const [sorting, setSorting] = useState<SortingState>([])
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({})
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)

  const debouncedSearch = useDebounce(searchQuery, 400)
  const isSearching = debouncedSearch.trim().length > 0

  // Сортировка: берём первый элемент из TanStack state
  const sortBy = sorting[0]?.id
  const order = sorting[0] ? (sorting[0].desc ? 'desc' : 'asc') : undefined

  const skip = page * PAGE_SIZE

  const productsQuery = useGetProductsQuery(
    { limit: PAGE_SIZE, skip, sortBy, order },
    { skip: isSearching },
  )

  const searchQueryResult = useSearchProductsQuery(
    { q: debouncedSearch.trim(), limit: PAGE_SIZE, skip },
    { skip: !isSearching },
  )

  const activeQuery = isSearching ? searchQueryResult : productsQuery
  const { data, isLoading, isFetching, isError } = activeQuery

  const products = data?.products ?? []
  const total = data?.total ?? 0
  const totalPages = Math.ceil(total / PAGE_SIZE)

  const renderActions = useCallback(
    () => <ProductActions onAddToCart={() => {}} onMore={() => {}} />,
    []
  )

  const columns = useProductColumns({ renderActions })

  const table = useReactTable({
    data: products,
    columns,
    state: { sorting, rowSelection },
    onSortingChange: (updater) => {
      setSorting(updater)
      setPage(0) // сброс страницы при смене сортировки
    },
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    // Пагинация и фильтрация — server-side
    manualPagination: true,
    manualSorting: !isSearching, // при поиске сортировка отключается
    pageCount: totalPages,
  })

  const handleSearchChange = (value: string) => {
    setSearchQuery(value)
    setPage(0)
  }

  const handleReset = () => {
    setSearchQuery('')
    setSorting([])
    setPage(0)
    // если уже на дефолтных параметрах — форсируем рефетч
    productsQuery.refetch()
  }

  return (
    <div className="min-h-screen bg-[#F3F3F3] pt-[22.5px]">
      <TopProgressBar visible={isFetching} />
      <PageHeader title="Товары">
        <SearchInput value={searchQuery} onChange={handleSearchChange} />
      </PageHeader>

      <div className="mt-[30px] overflow-hidden bg-white min-h-[calc(100vh-152.5px)]">
        <ProductsToolbar onAdd={() => setIsAddModalOpen(true)} onFilter={handleReset} />

        <div className="overflow-x-auto px-[30px]">
          <table className="w-full min-w-[900px] table-fixed border-collapse">
            <thead>
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id} className="border-b border-gray-100">
                  {headerGroup.headers.map((header) => (
                    <th
                      key={header.id}
                      className={`py-[31px] align-middle text-base font-medium text-gray-400 ${columnAlignment(header.column.id)}`}
                      style={{ width: header.getSize() }}
                    >
                      {header.isPlaceholder ? null : (
                        <SortableHeader
                          canSort={header.column.getCanSort()}
                          isSorted={header.column.getIsSorted()}
                          onToggleSort={(e) => header.column.getToggleSortingHandler()?.(e)}
                        >
                          {flexRender(header.column.columnDef.header, header.getContext())}
                        </SortableHeader>
                      )}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>

            <tbody>
              {/* Загрузка — только при первом открытии */}
              {isLoading && (
                <tr>
                  <td colSpan={columns.length} className="px-4 py-12 text-center text-sm text-gray-400">
                    Загрузка...
                  </td>
                </tr>
              )}

              {/* Ошибка */}
              {isError && !isFetching && (
                <tr>
                  <td colSpan={columns.length} className="px-4 py-12 text-center text-sm text-red-400">
                    Не удалось загрузить данные. Попробуйте позже.
                  </td>
                </tr>
              )}

              {/* Пусто */}
              {!isLoading && !isError && products.length === 0 && (
                <tr>
                  <td colSpan={columns.length} className="px-4 py-12 text-center text-sm text-gray-400">
                    Ничего не найдено
                  </td>
                </tr>
              )}

              {/* Данные */}
              {!isLoading && !isError && table.getRowModel().rows.map((row) => {
                const isSelected = row.getIsSelected()
                return (
                  <tr
                    key={row.id}
                    className={`border-b border-l-4 border-gray-100 ${
                      isSelected
                        ? 'bg-blue-50/60 border-l-[#3C538E]'
                        : 'border-l-transparent hover:bg-gray-50/50'
                    } ${isFetching ? 'opacity-50' : ''}`}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <td
                        key={cell.id}
                        className={`py-3 align-middle ${columnAlignment(cell.column.id)}`}
                      >
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    ))}
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        <ProductsPagination
          currentPage={page}
          totalPages={totalPages}
          pageSize={PAGE_SIZE}
          totalItems={total}
          onPageChange={setPage}
        />
      </div>

      <AddProductModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} />
    </div>
  )
}
