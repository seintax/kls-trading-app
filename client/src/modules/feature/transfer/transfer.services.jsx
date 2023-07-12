import { apiSlice } from "../../../utilities/redux/slices/apiSlice"
const BASE_URL = import.meta.env.MODE === "development" ?
    import.meta.env.VITE_API_BASE_URL :
    import.meta.env.VITE_API_BASE_URL_PROD
const ENDPOINT_URL = `${BASE_URL}/app/transfer`

export const transferApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        createTransfer: builder.mutation({
            query: (body) => ({
                url: `${ENDPOINT_URL}`,
                method: 'POST',
                body
            }),
            invalidatesTags: ['transfer']
        }),
        updateTransfer: builder.mutation({
            query: (body) => ({
                url: `${ENDPOINT_URL}`,
                method: 'PATCH',
                body
            }),
            invalidatesTags: ['transfer', 'transfer/id']
        }),
        deleteTransfer: builder.mutation({
            query: (body) => ({
                url: `${ENDPOINT_URL}`,
                method: 'DELETE',
                body
            }),
            invalidatesTags: ['transfer']
        }),
        distinctTransfer: builder.mutation({
            query: (params) => ({
                url: `${ENDPOINT_URL}/id`,
                method: 'GET',
                params
            }),
            providesTags: ['transfer/id']
        }),
        fetchAllTransfer: builder.mutation({
            query: (params) => ({
                url: `${ENDPOINT_URL}`,
                method: 'GET',
                params
            }),
            providesTags: ['transfer']
        }),
        searchTransfer: builder.mutation({
            query: (params) => ({
                url: `${ENDPOINT_URL}/search`,
                method: 'GET',
                params
            }),
            providesTags: ['transfer']
        }),
        specifyTransfer: builder.mutation({
            query: (params) => ({
                url: `${ENDPOINT_URL}/specify`,
                method: 'GET',
                params
            }),
            providesTags: ['transfer']
        }),
    })
})

export const {
    useCreateTransferMutation,
    useUpdateTransferMutation,
    useDeleteTransferMutation,
    useDistinctTransferMutation,
    useFetchAllTransferMutation,
    useSearchTransferMutation,
    useSpecifyTransferMutation,
} = transferApiSlice