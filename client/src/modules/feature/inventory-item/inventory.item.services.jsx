import { apiSlice } from "../../../utilities/redux/slices/apiSlice"
const BASE_URL = import.meta.env.MODE === "development" ?
    import.meta.env.VITE_API_BASE_URL :
    import.meta.env.VITE_API_BASE_URL_PROD
const ENDPOINT_URL = `${BASE_URL}/app/adjustment`

export const adjustmentApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        createAdjustment: builder.mutation({
            query: (body) => ({
                url: `${ENDPOINT_URL}`,
                method: 'POST',
                body
            }),
            invalidatesTags: ['adjustment']
        }),
        updateAdjustment: builder.mutation({
            query: (body) => ({
                url: `${ENDPOINT_URL}`,
                method: 'PATCH',
                body
            }),
            invalidatesTags: ['adjustment', 'adjustment/id']
        }),
        deleteAdjustment: builder.mutation({
            query: (body) => ({
                url: `${ENDPOINT_URL}`,
                method: 'DELETE',
                body
            }),
            invalidatesTags: ['adjustment']
        }),
        distinctAdjustment: builder.mutation({
            query: (params) => ({
                url: `${ENDPOINT_URL}/id`,
                method: 'GET',
                params
            }),
            providesTags: ['adjustment/id']
        }),
        fetchAllAdjustment: builder.mutation({
            query: (params) => ({
                url: `${ENDPOINT_URL}`,
                method: 'GET',
                params
            }),
            providesTags: ['adjustment']
        }),
        searchAdjustment: builder.mutation({
            query: (params) => ({
                url: `${ENDPOINT_URL}/search`,
                method: 'GET',
                params
            }),
            providesTags: ['adjustment']
        }),
        specifyAdjustment: builder.mutation({
            query: (params) => ({
                url: `${ENDPOINT_URL}/specify`,
                method: 'GET',
                params
            }),
            providesTags: ['adjustment']
        }),
        byInventoryAdjustment: builder.mutation({
            query: (params) => ({
                url: `${ENDPOINT_URL}/byinventory`,
                method: 'GET',
                params
            }),
            providesTags: ['adjustment']
        }),
        byAuditAdjustment: builder.mutation({
            query: (params) => ({
                url: `${ENDPOINT_URL}/byaudit`,
                method: 'GET',
                params
            }),
            providesTags: ['adjustment']
        }),
        sqlAdjustment: builder.mutation({
            query: (body) => ({
                url: `${ENDPOINT_URL}/sqladjustment`,
                method: 'POST',
                body
            }),
            providesTags: ['adjustment']
        }),
    })
})

export const {
    useCreateAdjustmentMutation,
    useUpdateAdjustmentMutation,
    useDeleteAdjustmentMutation,
    useDistinctAdjustmentMutation,
    useFetchAllAdjustmentMutation,
    useSearchAdjustmentMutation,
    useSpecifyAdjustmentMutation,
    useByInventoryAdjustmentMutation,
    useByAuditAdjustmentMutation,
    useSqlAdjustmentMutation,
} = adjustmentApiSlice