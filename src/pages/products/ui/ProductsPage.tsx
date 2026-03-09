/**
 * FSD: pages/products/ui/ProductsPage.tsx
 *
 * Страница «Товары» — каталог товаров с таблицей, поиском,
 * клиентской сортировкой и пагинацией.
 *
 * Зависимости:
 *   - @tanstack/react-table v8
 *   - lucide-react
 *   - shadcn/ui (Checkbox, Button)
 *   - tailwindcss v4
 */

import { useState, useMemo } from 'react'
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  getFilteredRowModel,
  flexRender,
  type ColumnDef,
  type SortingState,
  type RowSelectionState,
} from '@tanstack/react-table'
import {
  Search,
  Plus,
  RefreshCw,
  ArrowUp,
  ArrowDown,
  ChevronsUpDown,
  ChevronLeft,
  ChevronRight,
  MoreHorizontal,
} from 'lucide-react'

/* ────────────────────────────────────────────────────────────
 * Типы
 * FSD: entities/product/model/types.ts
 * ──────────────────────────────────────────────────────────── */

interface IProduct {
  id: string
  name: string
  category: string
  imageUrl: string | null
  vendor: string
  sku: string
  rating: number
  price: number
}

/* ────────────────────────────────────────────────────────────
 * Пропсы компонентов
 * ──────────────────────────────────────────────────────────── */

/** FSD: shared/ui/SearchInput */
interface ISearchInputProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
}

/** FSD: shared/ui/PageHeader */
interface IPageHeaderProps {
  title: string
  children?: React.ReactNode
}

/** FSD: features/products/ui/ProductsToolbar */
interface IProductsToolbarProps {
  onAdd: () => void
  onFilter: () => void
}

/** FSD: entities/product/ui/ProductNameCell */
interface IProductNameCellProps {
  name: string
  category: string
  imageUrl: string | null
}

/** FSD: entities/product/ui/ProductRatingBadge */
interface IProductRatingBadgeProps {
  rating: number
  maxRating?: number
}

/** FSD: features/products/ui/ProductActions */
interface IProductActionsProps {
  onAddToCart: () => void
  onMore: () => void
}

/** FSD: features/products/ui/ProductsPagination */
interface IProductsPaginationProps {
  currentPage: number
  totalPages: number
  pageSize: number
  totalItems: number
  onPageChange: (page: number) => void
  maxVisiblePages?: number
}

/* ────────────────────────────────────────────────────────────
 * Утилиты
 * FSD: shared/lib/format.ts
 * ──────────────────────────────────────────────────────────── */

/** Форматирует число в строку с пробелом-разделителем тысяч и запятой */
function formatPrice(value: number): { integer: string; fraction: string } {
  const formatted = value.toLocaleString('ru-RU', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
  const sepIndex = formatted.lastIndexOf(',')
  return {
    integer: formatted.slice(0, sepIndex),
    fraction: formatted.slice(sepIndex),
  }
}

/* ────────────────────────────────────────────────────────────
 * Моковые данные
 * FSD: entities/product/api/mocks.ts
 * ──────────────────────────────────────────────────────────── */

const MOCK_PRODUCTS: IProduct[] = [
  {
    id: '1',
    name: 'USB Флэшкарта 16GB',
    category: 'Аксессуары',
    imageUrl: null,
    vendor: 'Samsung',
    sku: 'RCH45Q1A',
    rating: 4.3,
    price: 48652.0,
  },
  {
    id: '2',
    name: 'Утюг Braun TexStyle 9',
    category: 'Бытовая техника',
    imageUrl: null,
    vendor: 'TexStyle',
    sku: 'DFCHQ1A',
    rating: 4.9,
    price: 4233.0,
  },
  {
    id: '3',
    name: 'Смартфон Apple iPhone 17',
    category: 'Телефоны',
    imageUrl: null,
    vendor: 'Apple',
    sku: 'GUYHD2-X4',
    rating: 4.7,
    price: 88652.0,
  },
  {
    id: '4',
    name: 'Игровая консоль PlayStation 5 Pro Max Edition',
    category: 'Игровые приставки',
    imageUrl: null,
    vendor: 'Sony',
    sku: 'HT45Q21',
    rating: 4.1,
    price: 56236.0,
  },
  {
    id: '5',
    name: 'Фен Dyson Supersonic Nural',
    category: 'Электроника',
    imageUrl: null,
    vendor: 'Dyson',
    sku: 'FJHHGF-CR4',
    rating: 3.3,
    price: 48652.0,
  },
  {
    id: '6',
    name: 'Наушники Sony WH-1000XM5',
    category: 'Аудио',
    imageUrl: null,
    vendor: 'Sony',
    sku: 'WH1000XM5',
    rating: 4.8,
    price: 32490.0,
  },
  {
    id: '7',
    name: 'Ноутбук ASUS ROG Strix G16',
    category: 'Компьютеры',
    imageUrl: null,
    vendor: 'ASUS',
    sku: 'ROG-G16-24',
    rating: 4.5,
    price: 129990.0,
  },
  {
    id: '8',
    name: 'Планшет Samsung Galaxy Tab S9 Ultra Wi-Fi Edition',
    category: 'Планшеты',
    imageUrl: null,
    vendor: 'Samsung',
    sku: 'SM-X910',
    rating: 4.6,
    price: 94990.0,
  },
  {
    id: '9',
    name: 'Клавиатура Logitech MX Keys S',
    category: 'Аксессуары',
    imageUrl: null,
    vendor: 'Logitech',
    sku: '920-011406',
    rating: 4.4,
    price: 11290.0,
  },
  {
    id: '10',
    name: 'Монитор LG UltraGear 27GR95QE',
    category: 'Мониторы',
    imageUrl: null,
    vendor: 'LG',
    sku: '27GR95QE-B',
    rating: 4.7,
    price: 78990.0,
  },
  {
    id: '11',
    name: 'Мышь Razer DeathAdder V3 Pro',
    category: 'Аксессуары',
    imageUrl: null,
    vendor: 'Razer',
    sku: 'RZ01-0463',
    rating: 4.2,
    price: 12990.0,
  },
  {
    id: '12',
    name: 'Стиральная машина Bosch Serie 8',
    category: 'Бытовая техника',
    imageUrl: null,
    vendor: 'Bosch',
    sku: 'WAX32M41',
    rating: 4.0,
    price: 67490.0,
  },
  {
    id: '13',
    name: 'Телевизор Samsung Neo QLED 65"',
    category: 'Электроника',
    imageUrl: null,
    vendor: 'Samsung',
    sku: 'QE65QN90C',
    rating: 4.8,
    price: 149990.0,
  },
  {
    id: '14',
    name: 'Робот-пылесос Xiaomi Roborock S8 Pro Ultra',
    category: 'Бытовая техника',
    imageUrl: null,
    vendor: 'Xiaomi',
    sku: 'S8PRO-U',
    rating: 4.6,
    price: 54990.0,
  },
  {
    id: '15',
    name: 'Кофемашина DeLonghi Magnifica Evo',
    category: 'Бытовая техника',
    imageUrl: null,
    vendor: 'DeLonghi',
    sku: 'ECAM290.61',
    rating: 3.2,
    price: 42990.0,
  },
  {
    id: '16',
    name: 'Фотоаппарат Canon EOS R6 Mark II',
    category: 'Фото и видео',
    imageUrl: null,
    vendor: 'Canon',
    sku: 'EOS-R6M2',
    rating: 4.9,
    price: 219990.0,
  },
  {
    id: '17',
    name: 'Умные часы Apple Watch Ultra 2',
    category: 'Аксессуары',
    imageUrl: null,
    vendor: 'Apple',
    sku: 'MQDY3',
    rating: 4.5,
    price: 79990.0,
  },
  {
    id: '18',
    name: 'Колонка JBL Charge 5',
    category: 'Аудио',
    imageUrl: null,
    vendor: 'JBL',
    sku: 'JBLCHARGE5',
    rating: 4.3,
    price: 13990.0,
  },
  {
    id: '19',
    name: 'Электросамокат Segway Ninebot MAX G2',
    category: 'Транспорт',
    imageUrl: null,
    vendor: 'Segway',
    sku: 'G2-MAX',
    rating: 3.1,
    price: 59990.0,
  },
  {
    id: '20',
    name: 'Видеокарта NVIDIA GeForce RTX 4080 Super Founders Edition',
    category: 'Компоненты',
    imageUrl: null,
    vendor: 'NVIDIA',
    sku: 'RTX4080S-FE',
    rating: 4.7,
    price: 109990.0,
  },
  {
    id: '21',
    name: 'SSD Samsung 990 PRO 2TB',
    category: 'Компоненты',
    imageUrl: null,
    vendor: 'Samsung',
    sku: 'MZ-V9P2T0',
    rating: 4.8,
    price: 18990.0,
  },
  {
    id: '22',
    name: 'Микроволновая печь LG NeoChef',
    category: 'Бытовая техника',
    imageUrl: null,
    vendor: 'LG',
    sku: 'MS2595CIS',
    rating: 3.4,
    price: 12490.0,
  },
  {
    id: '23',
    name: 'Проектор Epson EH-TW7100',
    category: 'Электроника',
    imageUrl: null,
    vendor: 'Epson',
    sku: 'V11HA29040',
    rating: 4.1,
    price: 134990.0,
  },
  {
    id: '24',
    name: 'Гарнитура HyperX Cloud III Wireless',
    category: 'Аудио',
    imageUrl: null,
    vendor: 'HyperX',
    sku: '77Z46AA',
    rating: 4.4,
    price: 11990.0,
  },
  {
    id: '25',
    name: 'Беспроводное зарядное устройство Belkin BoostCharge Pro 3-in-1',
    category: 'Аксессуары',
    imageUrl: null,
    vendor: 'Belkin',
    sku: 'WIZ017',
    rating: 4.0,
    price: 14990.0,
  },
  {
    id: '26',
    name: 'Кондиционер Daikin Stylish FTXA',
    category: 'Бытовая техника',
    imageUrl: null,
    vendor: 'Daikin',
    sku: 'FTXA35BB',
    rating: 4.6,
    price: 89990.0,
  },
  {
    id: '27',
    name: 'Смартфон Google Pixel 9 Pro',
    category: 'Телефоны',
    imageUrl: null,
    vendor: 'Google',
    sku: 'GA05850',
    rating: 4.5,
    price: 84990.0,
  },
  {
    id: '28',
    name: 'Электрическая зубная щётка Oral-B iO Series 10',
    category: 'Здоровье',
    imageUrl: null,
    vendor: 'Oral-B',
    sku: 'IO-S10-BK',
    rating: 2.9,
    price: 29990.0,
  },
  {
    id: '29',
    name: 'Внешний аккумулятор Anker PowerCore 26800mAh',
    category: 'Аксессуары',
    imageUrl: null,
    vendor: 'Anker',
    sku: 'A1277011',
    rating: 4.3,
    price: 5490.0,
  },
  {
    id: '30',
    name: 'Процессор AMD Ryzen 9 7950X3D',
    category: 'Компоненты',
    imageUrl: null,
    vendor: 'AMD',
    sku: '100-100000908',
    rating: 4.9,
    price: 54990.0,
  },
]

/* ────────────────────────────────────────────────────────────
 * Компоненты
 * ──────────────────────────────────────────────────────────── */

/**
 * Поле поиска с иконкой.
 * FSD: shared/ui/SearchInput/SearchInput.tsx
 */
function SearchInput({ value, onChange, placeholder = 'Найти' }: ISearchInputProps) {
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

/**
 * Заголовок страницы с поисковой строкой.
 * FSD: shared/ui/PageHeader/PageHeader.tsx
 */
function PageHeader({ title, children }: IPageHeaderProps) {
  return (
    <header className="relative flex items-center px-6 h-[100px] bg-white">
      <h1 className="shrink-0 text-2xl font-bold text-gray-900">{title}</h1>
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <div className="pointer-events-auto w-[53%]">
          {children}
        </div>
      </div>
    </header>
  )
}

/**
 * Тулбар: заголовок секции, кнопка фильтров и «Добавить».
 * FSD: features/products/ui/ProductsToolbar/ProductsToolbar.tsx
 */
function ProductsToolbar({ onAdd, onFilter }: IProductsToolbarProps) {
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

/**
 * Ячейка «Наименование»: изображение + название + категория.
 * FSD: entities/product/ui/ProductNameCell/ProductNameCell.tsx
 */
function ProductNameCell({ name, category, imageUrl }: IProductNameCellProps) {
  return (
    <div className="flex items-center gap-[18px]">
      {/* Плейсхолдер / изображение товара */}
      <div className="h-12 w-12 shrink-0 overflow-hidden rounded-md bg-gray-200">
        {imageUrl && <img src={imageUrl} alt={name} className="h-full w-full object-cover" />}
      </div>

      <div className="min-w-0">
        <p className="truncate text-base font-bold text-gray-900">{name}</p>
        <p className="truncate text-sm text-gray-400">{category}</p>
      </div>
    </div>
  )
}

/**
 * Бейдж оценки: красный при < 3.5.
 * FSD: entities/product/ui/ProductRatingBadge/ProductRatingBadge.tsx
 */
function ProductRatingBadge({ rating, maxRating = 5 }: IProductRatingBadgeProps) {
  const isLow = rating < 3.5

  return (
    <span className="text-base">
      <span className={isLow ? 'text-red-500' : 'text-gray-900'}>
        {rating.toFixed(1)}
      </span>
      <span className="text-gray-900">/{maxRating}</span>
    </span>
  )
}

/**
 * Кнопки действий в строке: «Добавить в корзину» + «Ещё».
 * FSD: features/products/ui/ProductActions/ProductActions.tsx
 */
function ProductActions({ onAddToCart, onMore }: IProductActionsProps) {
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

/**
 * Чекбокс (кастомный, стилизация под shadcn/ui).
 * FSD: shared/ui/Checkbox/Checkbox.tsx
 *
 * В реальном проекте — импорт из @/shared/ui/checkbox (shadcn).
 */
function Checkbox({
  checked,
  indeterminate,
  onChange,
}: {
  checked: boolean
  indeterminate?: boolean
  onChange: (checked: boolean) => void
}) {
  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={indeterminate ? 'mixed' : checked}
      onClick={() => onChange(!checked)}
      className="inline-flex align-middle h-[22px] w-[22px] cursor-pointer shrink-0 items-center justify-center rounded border border-gray-300 outline-none"
      style={{ backgroundColor: checked || indeterminate ? '#3C538E' : '#fff' }}
    />
  )
}

/**
 * Пагинация с номерами страниц и стрелками.
 * FSD: features/products/ui/ProductsPagination/ProductsPagination.tsx
 */
function ProductsPagination({
  currentPage,
  totalPages,
  pageSize,
  totalItems,
  onPageChange,
  maxVisiblePages = 5,
}: IProductsPaginationProps) {
  const from = currentPage * pageSize + 1
  const to = Math.min((currentPage + 1) * pageSize, totalItems)

  /** Список номеров видимых страниц */
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
        {/* Счётчик: «Показано 1-20 из 120» */}
        <p className="text-lg text-gray-500">
          Показано{' '}
          <span className="text-gray-900">
            {from}-{to}
          </span>{' '}
          из <span className="text-gray-900">{totalItems}</span>
        </p>

        {/* Навигация */}
        <div className="flex items-center gap-1">
          {/* Стрелка «Назад» */}
          <button
            type="button"
            disabled={isFirstPage}
            onClick={() => onPageChange(currentPage - 1)}
            className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-md text-gray-500 transition-colors hover:bg-gray-100 disabled:pointer-events-none disabled:opacity-30"
            aria-label="Предыдущая страница"
          >
            <ChevronLeft size={16} />
          </button>

          {/* Номера страниц */}
          {visiblePages.map((page) => (
            <button
              key={page}
              type="button"
              onClick={() => onPageChange(page)}
              className={`flex h-8 w-8 items-center justify-center rounded-md text-sm font-medium transition-colors ${
                page === currentPage ? 'cursor-default text-white' : 'cursor-pointer text-gray-600 border border-gray-300 hover:bg-gray-100'
              }`}
              style={page === currentPage ? { backgroundColor: '#797FEA' } : undefined}
            >
              {page + 1}
            </button>
          ))}

          {/* Стрелка «Вперёд» */}
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

/* ────────────────────────────────────────────────────────────
 * Определение колонок TanStack Table
 * FSD: entities/product/model/columns.tsx
 * ──────────────────────────────────────────────────────────── */

const PAGE_SIZE = 20

function useProductColumns(): ColumnDef<IProduct>[] {
  return useMemo<ColumnDef<IProduct>[]>(
    () => [
      /* ── Checkbox ── */
      {
        id: 'select',
        size: 40,
        enableSorting: false,
        header: ({ table }) => (
          <Checkbox
            checked={table.getIsAllPageRowsSelected()}
            indeterminate={table.getIsSomePageRowsSelected()}
            onChange={(checked) => table.toggleAllPageRowsSelected(checked)}
          />
        ),
        cell: ({ row }) => (
          <Checkbox
            checked={row.getIsSelected()}
            onChange={(checked) => row.toggleSelected(checked)}
          />
        ),
      },

      /* ── Наименование ── */
      {
        accessorKey: 'name',
        header: 'Наименование',
        size: 351,
        cell: ({ row }) => (
          <ProductNameCell
            name={row.original.name}
            category={row.original.category}
            imageUrl={row.original.imageUrl}
          />
        ),
      },

      /* ── Вендор ── */
      {
        accessorKey: 'vendor',
        header: 'Вендор',
        size: 125,
        cell: ({ getValue }) => (
          <span className="text-base font-bold text-gray-900 font-['Open_Sans']">{getValue<string>()}</span>
        ),
      },

      /* ── Артикул ── */
      {
        accessorKey: 'sku',
        header: 'Артикул',
        size: 160,
        cell: ({ getValue }) => <span className="text-base text-gray-600">{getValue<string>()}</span>,
      },

      /* ── Оценка ── */
      {
        accessorKey: 'rating',
        header: 'Оценка',
        size: 125,
        cell: ({ getValue }) => <ProductRatingBadge rating={getValue<number>()} />,
      },

      /* ── Цена ── */
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

      /* ── Действия ── */
      {
        id: 'actions',
        size: 265,
        enableSorting: false,
        header: () => null,
        cell: () => <ProductActions onAddToCart={() => {}} onMore={() => {}} />,
      },
    ],
    []
  )
}

/* ────────────────────────────────────────────────────────────
 * Заголовок колонки с индикатором сортировки
 * FSD: shared/ui/SortableHeader/SortableHeader.tsx
 * ──────────────────────────────────────────────────────────── */

interface ISortableHeaderProps {
  children: React.ReactNode
  canSort: boolean
  isSorted: false | 'asc' | 'desc'
  onToggleSort: (e: React.MouseEvent) => void
}

function SortableHeader({ children, canSort, isSorted, onToggleSort }: ISortableHeaderProps) {
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


/* ────────────────────────────────────────────────────────────
 * Страница «Товары»
 * FSD: pages/products/ui/ProductsPage.tsx
 * ──────────────────────────────────────────────────────────── */

export default function ProductsPage() {
  /* ── Стейт ── */
  const [searchQuery, setSearchQuery] = useState('')
  const [sorting, setSorting] = useState<SortingState>([])
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({})

  const columns = useProductColumns()

  /* ── Инстанс таблицы ── */
  const table = useReactTable({
    data: MOCK_PRODUCTS,
    columns,
    state: { sorting, rowSelection, globalFilter: searchQuery },
    onSortingChange: setSorting,
    onRowSelectionChange: setRowSelection,
    onGlobalFilterChange: setSearchQuery,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    enableSortingRemoval: true /* третий клик — сброс сортировки */,
    initialState: {
      pagination: { pageSize: PAGE_SIZE },
    },
  })

  const { pageIndex } = table.getState().pagination
  const totalPages = table.getPageCount()
  const totalItems = table.getFilteredRowModel().rows.length

  const handlePageChange = (page: number) => {
    table.setPageIndex(page)
  }

  return (
    <div className="min-h-screen bg-[#F3F3F3] pt-[22.5px]">
      {/* ── 1. Шапка страницы ── */}
      <PageHeader title="Товары">
        <SearchInput value={searchQuery} onChange={setSearchQuery} />
      </PageHeader>

      {/* ── Контейнер-карточка ── */}
      <div className="mt-[30px] overflow-hidden bg-white min-h-[calc(100vh-152.5px)]">
        {/* ── 2. Тулбар ── */}
        <ProductsToolbar onAdd={() => {}} onFilter={() => {}} />

        {/* ── 3–5. Таблица ── */}
        <div className="overflow-x-auto px-[30px]">
          <table className="w-full min-w-[900px] table-fixed border-collapse">
            {/* Заголовки */}
            <thead>
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id} className="border-b border-gray-100">
                  {headerGroup.headers.map((header) => (
                    <th
                      key={header.id}
                      className={`py-[31px] align-middle text-base font-medium text-gray-400 ${
                        header.column.id === 'select' ? 'text-left pl-4 pr-0' :
                        header.column.id === 'name' ? 'text-left pl-[18px] pr-4' :
                        header.column.id === 'price' ? 'text-center pl-4 pr-0' :
                        header.column.id === 'actions' ? 'text-center pl-0 pr-0' :
                        'text-center px-4'
                      }`}
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

            {/* Строки */}
            <tbody>
              {table.getRowModel().rows.length === 0 && (
                <tr>
                  <td
                    colSpan={columns.length}
                    className="px-4 py-12 text-center text-sm text-gray-400"
                  >
                    Ничего не найдено
                  </td>
                </tr>
              )}

              {table.getRowModel().rows.map((row) => {
                const isSelected = row.getIsSelected()

                return (
                  <tr
                    key={row.id}
                    className={`group border-b border-l-4 border-gray-100 ${
                      isSelected
                        ? 'bg-blue-50/60 border-l-[#3C538E]'
                        : 'border-l-transparent hover:bg-gray-50/50'
                    }`}
                  >

                    {row.getVisibleCells().map((cell) => (
                      <td key={cell.id} className={`py-3 align-middle ${
                        cell.column.id === 'select' ? 'text-left pl-4 pr-0' :
                        cell.column.id === 'name' ? 'text-left pl-[18px] pr-4' :
                        cell.column.id === 'price' ? 'text-center pl-4 pr-0' :
                        cell.column.id === 'actions' ? 'text-center pl-0 pr-0' :
                        'text-center px-4'
                      }`}>
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    ))}
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        {/* ── 7. Пагинация ── */}
        <div>
          <ProductsPagination
            currentPage={pageIndex}
            totalPages={totalPages}
            pageSize={PAGE_SIZE}
            totalItems={totalItems}
            onPageChange={handlePageChange}
          />
        </div>
      </div>
    </div>
  )
}
