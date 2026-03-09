import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import type {
  IProduct,
  IProductsParams,
  IProductsResponse,
  ISearchProductsParams,
} from '../model/types'

export const productsApi = createApi({
  reducerPath: 'productsApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'https://dummyjson.com' }),
  endpoints: (builder) => ({
    getProducts: builder.query<IProductsResponse, IProductsParams>({
      query: ({ limit, skip, sortBy, order }) => ({
        url: '/products',
        params: {
          limit,
          skip,
          ...(sortBy && { sortBy, order: order ?? 'asc' }),
          select: 'id,title,category,thumbnail,brand,sku,rating,price',
        },
      }),
    }),

    searchProducts: builder.query<IProductsResponse, ISearchProductsParams>({
      query: ({ q, limit, skip }) => ({
        url: '/products/search',
        params: { q, limit, skip, select: 'id,title,category,thumbnail,brand,sku,rating,price' },
      }),
    }),

    getProductById: builder.query<IProduct, number>({
      query: (id) => `/products/${id}`,
    }),
  }),
})

export const { useGetProductsQuery, useSearchProductsQuery, useGetProductByIdQuery } = productsApi
