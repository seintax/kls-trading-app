import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

const baseQuery = fetchBaseQuery({
    baseUrl: '',
    prepareHeaders: (headers, { getState }) => {
        let token = getState().auth.token
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