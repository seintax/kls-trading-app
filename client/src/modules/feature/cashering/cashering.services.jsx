import { apiSlice } from "../../../utilities/redux/slices/apiSlice"
const BASE_URL = import.meta.env.MODE === "development" ?
    import.meta.env.VITE_API_BASE_URL :
    import.meta.env.VITE_API_BASE_URL_PROD
const ENDPOINT_URL = `${BASE_URL}/app/transaction`

export const transactionApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        createTransaction: builder.mutation({
            query: (body) => ({
                url: `${ENDPOINT_URL}`,
                method: 'POST',
                body
            }),
            invalidatesTags: ['transaction']
        }),
        updateTransaction: builder.mutation({
            query: (body) => ({
                url: `${ENDPOINT_URL}`,
                method: 'PATCH',
                body
            }),
            invalidatesTags: ['transaction', 'transaction/id']
        }),
        deleteTransaction: builder.mutation({
            query: (body) => ({
                url: `${ENDPOINT_URL}`,
                method: 'DELETE',
                body
            }),
            invalidatesTags: ['transaction']
        }),
        distinctTransaction: builder.mutation({
            query: (params) => ({
                url: `${ENDPOINT_URL}/id`,
                method: 'GET',
                params
            }),
            providesTags: ['transaction/id']
        }),
        fetchAllTransaction: builder.mutation({
            query: (params) => ({
                url: `${ENDPOINT_URL}`,
                method: 'GET',
                params
            }),
            providesTags: ['transaction']
        }),
        searchTransaction: builder.mutation({
            query: (params) => ({
                url: `${ENDPOINT_URL}/search`,
                method: 'GET',
                params
            }),
            providesTags: ['transaction']
        }),
        specifyTransaction: builder.mutation({
            query: (params) => ({
                url: `${ENDPOINT_URL}/specify`,
                method: 'GET',
                params
            }),
            providesTags: ['transaction']
        }),
    })
})

export const {
    useCreateTransactionMutation,
    useUpdateTransactionMutation,
    useDeleteTransactionMutation,
    useDistinctTransactionMutation,
    useFetchAllTransactionMutation,
    useSearchTransactionMutation,
    useSpecifyTransactionMutation,
} = transactionApiSlice