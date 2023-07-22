import { apiSlice } from "../../../utilities/redux/slices/apiSlice"
const BASE_URL = import.meta.env.MODE === "development" ?
    import.meta.env.VITE_API_BASE_URL :
    import.meta.env.VITE_API_BASE_URL_PROD
const ENDPOINT_URL = `${BASE_URL}/app/inclusion`

export const inclusionApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        createInclusion: builder.mutation({
            query: (body) => ({
                url: `${ENDPOINT_URL}`,
                method: 'POST',
                body
            }),
            invalidatesTags: ['inclusion']
        }),
        updateInclusion: builder.mutation({
            query: (body) => ({
                url: `${ENDPOINT_URL}`,
                method: 'PATCH',
                body
            }),
            invalidatesTags: ['inclusion', 'inclusion/id']
        }),
        deleteInclusion: builder.mutation({
            query: (body) => ({
                url: `${ENDPOINT_URL}`,
                method: 'DELETE',
                body
            }),
            invalidatesTags: ['inclusion']
        }),
        distinctInclusion: builder.mutation({
            query: (params) => ({
                url: `${ENDPOINT_URL}/id`,
                method: 'GET',
                params
            }),
            providesTags: ['inclusion/id']
        }),
        fetchAllInclusion: builder.mutation({
            query: (params) => ({
                url: `${ENDPOINT_URL}`,
                method: 'GET',
                params
            }),
            providesTags: ['inclusion']
        }),
        searchInclusion: builder.mutation({
            query: (params) => ({
                url: `${ENDPOINT_URL}/search`,
                method: 'GET',
                params
            }),
            providesTags: ['inclusion']
        }),
        specifyInclusion: builder.mutation({
            query: (params) => ({
                url: `${ENDPOINT_URL}/specify`,
                method: 'GET',
                params
            }),
            providesTags: ['inclusion']
        }),
    })
})

export const {
    useCreateInclusionMutation,
    useUpdateInclusionMutation,
    useDeleteInclusionMutation,
    useDistinctInclusionMutation,
    useFetchAllInclusionMutation,
    useSearchInclusionMutation,
    useSpecifyInclusionMutation,
} = inclusionApiSlice