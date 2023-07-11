import { apiSlice } from "../../../utilities/redux/slices/apiSlice"
const ENDPOINT_URL = '/app/variant'

export const variantApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        createVariant: builder.mutation({
            query: (body) => ({
                url: `${ENDPOINT_URL}`,
                method: 'POST',
                body
            }),
            invalidatesTags: ['variant']
        }),
        updateVariant: builder.mutation({
            query: (body) => ({
                url: `${ENDPOINT_URL}`,
                method: 'PATCH',
                body
            }),
            invalidatesTags: ['variant', 'variant/id']
        }),
        deleteVariant: builder.mutation({
            query: (body) => ({
                url: `${ENDPOINT_URL}`,
                method: 'DELETE',
                body
            }),
            invalidatesTags: ['variant']
        }),
        distinctVariant: builder.mutation({
            query: (params) => ({
                url: `${ENDPOINT_URL}/id`,
                method: 'GET',
                params
            }),
            providesTags: ['variant/id']
        }),
        fetchAllVariant: builder.mutation({
            query: (params) => ({
                url: `${ENDPOINT_URL}`,
                method: 'GET',
                params
            }),
            providesTags: ['variant']
        }),
        searchVariant: builder.mutation({
            query: (params) => ({
                url: `${ENDPOINT_URL}/search`,
                method: 'GET',
                params
            }),
            providesTags: ['variant']
        }),
        specifyVariant: builder.mutation({
            query: (params) => ({
                url: `${ENDPOINT_URL}/specify`,
                method: 'GET',
                params
            }),
            providesTags: ['variant']
        }),
        byProductVariant: builder.mutation({
            query: (params) => ({
                url: `${ENDPOINT_URL}/byproduct`,
                method: 'GET',
                params
            }),
            providesTags: ['variant']
        }),
        byCategoryVariant: builder.mutation({
            query: (params) => ({
                url: `${ENDPOINT_URL}/bycategory`,
                method: 'GET',
                params
            }),
            providesTags: ['variant']
        }),
    })
})

export const {
    useCreateVariantMutation,
    useUpdateVariantMutation,
    useDeleteVariantMutation,
    useDistinctVariantMutation,
    useFetchAllVariantMutation,
    useSearchVariantMutation,
    useSpecifyVariantMutation,
    useByProductVariantMutation,
    useByCategoryVariantMutation,
} = variantApiSlice