import { apiSlice } from "../../../utilities/redux/slices/apiSlice"
const BASE_URL = import.meta.env.MODE === "development" ?
    import.meta.env.VITE_API_BASE_URL :
    import.meta.env.VITE_API_BASE_URL_PROD
const ENDPOINT_URL = `${BASE_URL}/app/receipt`
const COMPLEX_SQL_URL = `${BASE_URL}/app/complex`

export const receiptApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        createReceipt: builder.mutation({
            query: (body) => ({
                url: `${ENDPOINT_URL}`,
                method: 'POST',
                body
            }),
            invalidatesTags: ['receipt']
        }),
        updateReceipt: builder.mutation({
            query: (body) => ({
                url: `${ENDPOINT_URL}`,
                method: 'PATCH',
                body
            }),
            invalidatesTags: ['receipt', 'receipt/id']
        }),
        deleteReceipt: builder.mutation({
            query: (body) => ({
                url: `${ENDPOINT_URL}`,
                method: 'DELETE',
                body
            }),
            invalidatesTags: ['receipt']
        }),
        distinctReceipt: builder.mutation({
            query: (params) => ({
                url: `${ENDPOINT_URL}/id`,
                method: 'GET',
                params
            }),
            providesTags: ['receipt/id']
        }),
        fetchAllReceipt: builder.mutation({
            query: (params) => ({
                url: `${ENDPOINT_URL}`,
                method: 'GET',
                params
            }),
            providesTags: ['receipt']
        }),
        searchReceipt: builder.mutation({
            query: (params) => ({
                url: `${ENDPOINT_URL}/search`,
                method: 'GET',
                params
            }),
            providesTags: ['receipt']
        }),
        specifyReceipt: builder.mutation({
            query: (params) => ({
                url: `${ENDPOINT_URL}/specify`,
                method: 'GET',
                params
            }),
            providesTags: ['receipt']
        }),
        byDeliveryReceipt: builder.mutation({
            query: (params) => ({
                url: `${ENDPOINT_URL}/bydelivery`,
                method: 'GET',
                params
            }),
            providesTags: ['receipt']
        }),
        createReceiptBySqlTransaction: builder.mutation({
            query: (body) => ({
                url: `${COMPLEX_SQL_URL}/sqlcreatereceipt`,
                method: 'POST',
                body
            }),
            providesTags: ['receipt']
        }),
    })
})

export const {
    useCreateReceiptMutation,
    useUpdateReceiptMutation,
    useDeleteReceiptMutation,
    useDistinctReceiptMutation,
    useFetchAllReceiptMutation,
    useSearchReceiptMutation,
    useSpecifyReceiptMutation,
    useByDeliveryReceiptMutation,
    useCreateReceiptBySqlTransactionMutation
} = receiptApiSlice