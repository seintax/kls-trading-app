import { apiSlice } from "../../../utilities/redux/slices/apiSlice"
const BASE_URL = import.meta.env.MODE === "development" ?
    import.meta.env.VITE_API_BASE_URL :
    import.meta.env.VITE_API_BASE_URL_PROD
const ENDPOINT_URL = `${BASE_URL}/app/payment`

export const paymentApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        createPayment: builder.mutation({
            query: (body) => ({
                url: `${ENDPOINT_URL}`,
                method: 'POST',
                body
            }),
            invalidatesTags: ['payment']
        }),
        updatePayment: builder.mutation({
            query: (body) => ({
                url: `${ENDPOINT_URL}`,
                method: 'PATCH',
                body
            }),
            invalidatesTags: ['payment', 'payment/id']
        }),
        deletePayment: builder.mutation({
            query: (body) => ({
                url: `${ENDPOINT_URL}`,
                method: 'DELETE',
                body
            }),
            invalidatesTags: ['payment']
        }),
        distinctPayment: builder.mutation({
            query: (params) => ({
                url: `${ENDPOINT_URL}/id`,
                method: 'GET',
                params
            }),
            providesTags: ['payment/id']
        }),
        fetchAllPayment: builder.mutation({
            query: (params) => ({
                url: `${ENDPOINT_URL}`,
                method: 'GET',
                params
            }),
            providesTags: ['payment']
        }),
        searchPayment: builder.mutation({
            query: (params) => ({
                url: `${ENDPOINT_URL}/search`,
                method: 'GET',
                params
            }),
            providesTags: ['payment']
        }),
        specifyPayment: builder.mutation({
            query: (params) => ({
                url: `${ENDPOINT_URL}/specify`,
                method: 'GET',
                params
            }),
            providesTags: ['payment']
        }),
        byChequePayment: builder.mutation({
            query: (params) => ({
                url: `${ENDPOINT_URL}/bycheque`,
                method: 'GET',
                params
            }),
            providesTags: ['payment']
        }),
        sqlChequePayment: builder.mutation({
            query: (body) => ({
                url: `${ENDPOINT_URL}/sqlchequepayment`,
                method: 'POST',
                body
            }),
            providesTags: ['cheque']
        }),
    })
})

export const {
    useCreatePaymentMutation,
    useUpdatePaymentMutation,
    useDeletePaymentMutation,
    useDistinctPaymentMutation,
    useFetchAllPaymentMutation,
    useSearchPaymentMutation,
    useSpecifyPaymentMutation,
    useByChequePaymentMutation,
    useSqlChequePaymentMutation,
} = paymentApiSlice