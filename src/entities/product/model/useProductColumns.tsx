import { useMemo } from 'react'
import { type ColumnDef, type Row } from '@tanstack/react-table'
import { TableCheckbox } from 'shared/ui/table-checkbox/TableCheckbox'
import { ProductNameCell } from '../ui/ProductNameCell/ProductNameCell'
import { ProductRatingBadge } from '../ui/ProductRatingBadge/ProductRatingBadge'
import { formatPrice } from 'shared/lib/format'
import type { IProduct } from './types'

export const PAGE_SIZE = 20

interface IUseProductColumnsOptions {
  renderActions?: (row: Row<IProduct>) => React.ReactNode
}

export function useProductColumns({ renderActions }: IUseProductColumnsOptions = {}): ColumnDef<IProduct>[] {
  return useMemo<ColumnDef<IProduct>[]>(
    () => [
      {
        id: 'select',
        size: 40,
        enableSorting: false,
        header: ({ table }) => (
          <TableCheckbox
            checked={table.getIsAllPageRowsSelected()}
            indeterminate={table.getIsSomePageRowsSelected()}
            onChange={(checked) => table.toggleAllPageRowsSelected(checked)}
          />
        ),
        cell: ({ row }) => (
          <TableCheckbox
            checked={row.getIsSelected()}
            onChange={(checked) => row.toggleSelected(checked)}
          />
        ),
      },

      {
        accessorKey: 'title',
        header: 'Наименование',
        size: 351,
        cell: ({ row }) => (
          <ProductNameCell
            name={row.original.title}
            category={row.original.category}
            imageUrl={row.original.thumbnail}
          />
        ),
      },

      {
        accessorKey: 'brand',
        header: 'Вендор',
        size: 125,
        cell: ({ getValue }) => (
          <span className="text-base font-bold text-gray-900 font-['Open_Sans']">
            {getValue<string | undefined>() ?? '—'}
          </span>
        ),
      },

      {
        accessorKey: 'sku',
        header: 'Артикул',
        size: 160,
        cell: ({ getValue }) => <span className="text-base text-gray-600">{getValue<string>()}</span>,
      },

      {
        accessorKey: 'rating',
        header: 'Оценка',
        size: 125,
        cell: ({ getValue }) => <ProductRatingBadge rating={getValue<number>()} />,
      },

      {
        accessorKey: 'price',
        header: 'Цена, ₽',
        size: 160,
        cell: ({ getValue }) => {
          const { integer, fraction } = formatPrice(getValue<number>())
          return (
            <span className="text-base tabular-nums font-['Roboto_Mono']">
              <span className="text-gray-900">{integer}</span>
              <span className="text-gray-400">{fraction}</span>
            </span>
          )
        },
      },

      {
        id: 'actions',
        size: 265,
        enableSorting: false,
        header: () => null,
        cell: ({ row }) => renderActions?.(row) ?? null,
      },
    ],
    [renderActions]
  )
}
