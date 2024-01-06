import { apiSlice } from "../../../utilities/redux/slices/apiSlice"
const BASE_URL = import.meta.env.MODE === "development" ?
    import.meta.env.VITE_API_BASE_URL :
    import.meta.env.VITE_API_BASE_URL_PROD
const ENDPOINT_URL = `${BASE_URL}/app`
const COMPLEX_SQL_URL = `${BASE_URL}/app/complex`

export const browserApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        fetchAllProductByCategory: builder.mutation({
            query: (params) => ({
                url: `${ENDPOINT_URL}/inventory/byproduct`,
                method: 'GET',
                params
            }),
            providesTags: ['browser']
        }),
        fetchAllBrowserByBranch: builder.mutation({
            query: (params) => ({
                url: `${ENDPOINT_URL}/inventory/branch`,
                method: 'GET',
                params
            }),
            providesTags: ['browser']
        }),
        byCodeDispensing: builder.mutation({
            query: (params) => ({
                url: `${ENDPOINT_URL}/dispensing/bycode`,
                method: 'GET',
                params
            }),
            providesTags: ['dispensing']
        }),
        byInventoryDispensing: builder.mutation({
            query: (params) => ({
                url: `${ENDPOINT_URL}/dispensing/byinventory`,
                method: 'GET',
                params
            }),
            providesTags: ['dispensing']
        }),
        byCodeReturned: builder.mutation({
            query: (params) => ({
                url: `${ENDPOINT_URL}/returned/bycode`,
                method: 'GET',
                params
            }),
            providesTags: ['returned']
        }),
        byInventoryReturned: builder.mutation({
            query: (params) => ({
                url: `${ENDPOINT_URL}/returned/byinventory`,
                method: 'GET',
                params
            }),
            providesTags: ['returned']
        }),
        byCodePayment: builder.mutation({
            query: (params) => ({
                url: `${ENDPOINT_URL}/payment/bycode`,
                method: 'GET',
                params
            }),
            providesTags: ['payment']
        }),
        createBrowserBySqlTransaction: builder.mutation({
            query: (body) => ({
                url: `${COMPLEX_SQL_URL}/sqlcreatetransaction`,
                method: 'POST',
                body
            }),
            providesTags: ['transaction']
        }),
        createReturnBySqlTransaction: builder.mutation({
            query: (body) => ({
                url: `${COMPLEX_SQL_URL}/sqlcreatereturn`,
                method: 'POST',
                body
            }),
            providesTags: ['transaction']
        }),
    })
})

export const {
    useFetchAllProductByCategoryMutation,
    useFetchAllBrowserByBranchMutation,
    useByCodeDispensingMutation,
    useByInventoryDispensingMutation,
    useByCodeReturnedMutation,
    useByInventoryReturnedMutation,
    useByCodePaymentMutation,
    useCreateBrowserBySqlTransactionMutation,
    useCreateReturnBySqlTransactionMutation,
} = browserApiSlice