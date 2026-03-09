export interface IProduct {
  id: number
  title: string
  category: string
  thumbnail: string
  brand?: string
  sku: string
  rating: number
  price: number
}

export interface IProductsParams {
  limit: number
  skip: number
  sortBy?: string
  order?: 'asc' | 'desc'
}

export interface ISearchProductsParams {
  q: string
  limit: number
  skip: number
}

export interface IProductsResponse {
  products: IProduct[]
  total: number
  skip: number
  limit: number
}
