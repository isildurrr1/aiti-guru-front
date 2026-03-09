export interface IProductRatingBadgeProps {
  rating: number
  maxRating?: number
}

export function ProductRatingBadge({ rating, maxRating = 5 }: IProductRatingBadgeProps) {
  const isLow = rating < 3

  return (
    <span className="text-base">
      <span className={isLow ? 'text-red-500' : 'text-gray-900'}>
        {rating.toFixed(1)}
      </span>
      <span className="text-gray-900">/{maxRating}</span>
    </span>
  )
}
