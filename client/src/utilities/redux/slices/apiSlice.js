import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

const baseQuery = fetchBaseQuery({
    baseUrl: '',
    prepareHeaders: (headers, { getState }) => {
        headers.set('Authorization', `Bearer ${localStorage.getItem("token")}`)
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