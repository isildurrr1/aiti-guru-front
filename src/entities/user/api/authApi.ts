import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import type { ILoginRequest, ILoginResponse } from '../model/types'

export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'https://dummyjson.com' }),
  endpoints: (builder) => ({
    login: builder.mutation<ILoginResponse, ILoginRequest>({
      query: (credentials) => ({
        url: '/auth/login',
        method: 'POST',
        body: { ...credentials, expiresInMins: 60 },
      }),
    }),
  }),
})

export const { useLoginMutation } = authApi
