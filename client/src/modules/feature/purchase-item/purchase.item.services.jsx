import { apiSlice } from "../../../utilities/redux/slices/apiSlice"
const BASE_URL = import.meta.env.MODE === "development" ?
    import.meta.env.VITE_API_BASE_URL :
    import.meta.env.VITE_API_BASE_URL_PROD
const ENDPOINT_URL = `${BASE_URL}/app/receivable`

export const receivableApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        createReceivable: builder.mutation({
            query: (body) => ({
                url: `${ENDPOINT_URL}`,
                method: 'POST',
                body
            }),
            invalidatesTags: ['receivable']
        }),
        updateReceivable: builder.mutation({
            query: (body) => ({
                url: `${ENDPOINT_URL}`,
                method: 'PATCH',
                body
            }),
            invalidatesTags: ['receivable', 'receivable/id']
        }),
        deleteReceivable: builder.mutation({
            query: (body) => ({
                url: `${ENDPOINT_URL}`,
                method: 'DELETE',
                body
            }),
            invalidatesTags: ['receivable']
        }),
        distinctReceivable: builder.mutation({
            query: (params) => ({
                url: `${ENDPOINT_URL}/id`,
                method: 'GET',
                params
            }),
            providesTags: ['receivable/id']
        }),
        fetchAllReceivable: builder.mutation({
            query: (params) => ({
                url: `${ENDPOINT_URL}`,
                method: 'GET',
                params
            }),
            providesTags: ['receivable']
        }),
        searchReceivable: builder.mutation({
            query: (params) => ({
                url: `${ENDPOINT_URL}/search`,
                method: 'GET',
                params
            }),
            providesTags: ['receivable']
        }),
        specifyReceivable: builder.mutation({
            query: (params) => ({
                url: `${ENDPOINT_URL}/specify`,
                method: 'GET',
                params
            }),
            providesTags: ['receivable']
        }),
        byPurchaseReceivable: builder.mutation({
            query: (params) => ({
                url: `${ENDPOINT_URL}/bypurchase`,
                method: 'GET',
                params
            }),
            providesTags: ['receivable']
        }),
        byBalanceReceivable: builder.mutation({
            query: (params) => ({
                url: `${ENDPOINT_URL}/bybalance`,
                method: 'GET',
                params
            }),
            providesTags: ['receivable']
        }),
        sqlReceivable: builder.mutation({
            query: (body) => ({
                url: `${ENDPOINT_URL}/sqlreceivable`,
                method: 'POST',
                body
            }),
            providesTags: ['receivable']
        }),
    })
})

export const {
    useCreateReceivableMutation,
    useUpdateReceivableMutation,
    useDeleteReceivableMutation,
    useDistinctReceivableMutation,
    useFetchAllReceivableMutation,
    useSearchReceivableMutation,
    useSpecifyReceivableMutation,
    useByPurchaseReceivableMutation,
    useByBalanceReceivableMutation,
    useSqlReceivableMutation,
} = receivableApiSlice