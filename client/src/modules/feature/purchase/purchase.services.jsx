import { apiSlice } from "../../../utilities/redux/slices/apiSlice"
const BASE_URL = import.meta.env.MODE === "development" ?
    import.meta.env.VITE_API_BASE_URL :
    import.meta.env.VITE_API_BASE_URL_PROD
const ENDPOINT_URL = `${BASE_URL}/app/purchase`

export const purchaseApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        createPurchase: builder.mutation({
            query: (body) => ({
                url: `${ENDPOINT_URL}`,
                method: 'POST',
                body
            }),
            invalidatesTags: ['purchase']
        }),
        updatePurchase: builder.mutation({
            query: (body) => ({
                url: `${ENDPOINT_URL}`,
                method: 'PATCH',
                body
            }),
            invalidatesTags: ['purchase', 'purchase/id']
        }),
        deletePurchase: builder.mutation({
            query: (body) => ({
                url: `${ENDPOINT_URL}`,
                method: 'DELETE',
                body
            }),
            invalidatesTags: ['purchase']
        }),
        distinctPurchase: builder.mutation({
            query: (params) => ({
                url: `${ENDPOINT_URL}/id`,
                method: 'GET',
                params
            }),
            providesTags: ['purchase/id']
        }),
        fetchAllPurchase: builder.mutation({
            query: (params) => ({
                url: `${ENDPOINT_URL}`,
                method: 'GET',
                params
            }),
            providesTags: ['purchase']
        }),
        searchPurchase: builder.mutation({
            query: (params) => ({
                url: `${ENDPOINT_URL}/search`,
                method: 'GET',
                params
            }),
            providesTags: ['purchase']
        }),
        specifyPurchase: builder.mutation({
            query: (params) => ({
                url: `${ENDPOINT_URL}/specify`,
                method: 'GET',
                params
            }),
            providesTags: ['purchase']
        }),
        byDatePurchase: builder.mutation({
            query: (params) => ({
                url: `${ENDPOINT_URL}/bydate`,
                method: 'GET',
                params
            }),
            providesTags: ['purchase']
        }),
        byFilterPurchase: builder.mutation({
            query: (params) => ({
                url: `${ENDPOINT_URL}/byfilter`,
                method: 'GET',
                params
            }),
            providesTags: ['purchase']
        }),
    })
})

export const {
    useCreatePurchaseMutation,
    useUpdatePurchaseMutation,
    useDeletePurchaseMutation,
    useDistinctPurchaseMutation,
    useFetchAllPurchaseMutation,
    useSearchPurchaseMutation,
    useSpecifyPurchaseMutation,
    useByDatePurchaseMutation,
    useByFilterPurchaseMutation,
} = purchaseApiSlice