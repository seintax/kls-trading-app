import { apiSlice } from "../../../utilities/redux/slices/apiSlice"
const BASE_URL = import.meta.env.MODE === "development" ?
    import.meta.env.VITE_API_BASE_URL :
    import.meta.env.VITE_API_BASE_URL_PROD
const ENDPOINT_URL = `${BASE_URL}/app/prints`

export const printsApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        createPrints: builder.mutation({
            query: (body) => ({
                url: `${ENDPOINT_URL}`,
                method: 'POST',
                body
            }),
            invalidatesTags: ['prints']
        }),
        updatePrints: builder.mutation({
            query: (body) => ({
                url: `${ENDPOINT_URL}`,
                method: 'PATCH',
                body
            }),
            invalidatesTags: ['prints', 'prints/id']
        }),
        deletePrints: builder.mutation({
            query: (body) => ({
                url: `${ENDPOINT_URL}`,
                method: 'DELETE',
                body
            }),
            invalidatesTags: ['prints']
        }),
        distinctPrints: builder.mutation({
            query: (params) => ({
                url: `${ENDPOINT_URL}/id`,
                method: 'GET',
                params
            }),
            providesTags: ['prints/id']
        }),
        fetchAllPrints: builder.mutation({
            query: (params) => ({
                url: `${ENDPOINT_URL}`,
                method: 'GET',
                params
            }),
            providesTags: ['prints']
        }),
        searchPrints: builder.mutation({
            query: (params) => ({
                url: `${ENDPOINT_URL}/search`,
                method: 'GET',
                params
            }),
            providesTags: ['prints']
        }),
        specifyPrints: builder.mutation({
            query: (params) => ({
                url: `${ENDPOINT_URL}/specify`,
                method: 'GET',
                params
            }),
            providesTags: ['prints']
        }),
    })
})

export const {
    useCreatePrintsMutation,
    useUpdatePrintsMutation,
    useDeletePrintsMutation,
    useDistinctPrintsMutation,
    useFetchAllPrintsMutation,
    useSearchPrintsMutation,
    useSpecifyPrintsMutation,
} = printsApiSlice