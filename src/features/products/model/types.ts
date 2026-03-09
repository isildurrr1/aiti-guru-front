export interface IProductActionsProps {
  onAddToCart: () => void
  onMore: () => void
}

export interface IProductsPaginationProps {
  currentPage: number
  totalPages: number
  pageSize: number
  totalItems: number
  onPageChange: (page: number) => void
  maxVisiblePages?: number
}

export interface IProductsToolbarProps {
  onAdd: () => void
  onFilter: () => void
}
