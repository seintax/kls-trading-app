import { apiSlice } from "../../../utilities/redux/slices/apiSlice"
const BASE_URL = import.meta.env.MODE === "development" ?
    import.meta.env.VITE_API_BASE_URL :
    import.meta.env.VITE_API_BASE_URL_PROD
const ENDPOINT_URL = `${BASE_URL}/app/price`

export const priceApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        createPrice: builder.mutation({
            query: (body) => ({
                url: `${ENDPOINT_URL}`,
                method: 'POST',
                body
            }),
            invalidatesTags: ['price']
        }),
        updatePrice: builder.mutation({
            query: (body) => ({
                url: `${ENDPOINT_URL}`,
                method: 'PATCH',
                body
            }),
            invalidatesTags: ['price', 'price/id']
        }),
        deletePrice: builder.mutation({
            query: (body) => ({
                url: `${ENDPOINT_URL}`,
                method: 'DELETE',
                body
            }),
            invalidatesTags: ['price']
        }),
        distinctPrice: builder.mutation({
            query: (params) => ({
                url: `${ENDPOINT_URL}/id`,
                method: 'GET',
                params
            }),
            providesTags: ['price/id']
        }),
        fetchAllPrice: builder.mutation({
            query: (params) => ({
                url: `${ENDPOINT_URL}`,
                method: 'GET',
                params
            }),
            providesTags: ['price']
        }),
        searchPrice: builder.mutation({
            query: (params) => ({
                url: `${ENDPOINT_URL}/search`,
                method: 'GET',
                params
            }),
            providesTags: ['price']
        }),
        specifyPrice: builder.mutation({
            query: (params) => ({
                url: `${ENDPOINT_URL}/specify`,
                method: 'GET',
                params
            }),
            providesTags: ['price']
        }),
        byInventoryPrice: builder.mutation({
            query: (params) => ({
                url: `${ENDPOINT_URL}/byinventory`,
                method: 'GET',
                params
            }),
            providesTags: ['price']
        }),
        sqlAdjustPrice: builder.mutation({
            query: (body) => ({
                url: `${ENDPOINT_URL}/sqladjustprice`,
                method: 'POST',
                body
            }),
            invalidatesTags: ['price']
        }),
    })
})

export const {
    useCreatePriceMutation,
    useUpdatePriceMutation,
    useDeletePriceMutation,
    useDistinctPriceMutation,
    useFetchAllPriceMutation,
    useSearchPriceMutation,
    useSpecifyPriceMutation,
    useByInventoryPriceMutation,
    useSqlAdjustPriceMutation,
} = priceApiSlice