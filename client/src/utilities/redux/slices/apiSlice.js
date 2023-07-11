import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

const token = localStorage.getItem('token') ? localStorage.getItem('token') : null

const baseQuery = fetchBaseQuery({
    baseUrl: '',
    prepareHeaders: (headers, { getState }) => {
        headers.set('Authorization', `Bearer ${token}`)
        return headers
    },
})

export const apiSlice = createApi({
    baseQuery,
    tagTypes: ['User'],
    endpoints: (builder) => ({}),
    refetchOnMountOrArgChange: true,
    refetchOnFocus: true
})