export interface IProductNameCellProps {
  name: string
  category: string
  imageUrl: string | null
}

export function ProductNameCell({ name, category, imageUrl }: IProductNameCellProps) {
  return (
    <div className="flex items-center gap-[18px]">
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
