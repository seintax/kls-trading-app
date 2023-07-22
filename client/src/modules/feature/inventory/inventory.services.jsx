import { apiSlice } from "../../../utilities/redux/slices/apiSlice"
const BASE_URL = import.meta.env.MODE === "development" ?
    import.meta.env.VITE_API_BASE_URL :
    import.meta.env.VITE_API_BASE_URL_PROD
const ENDPOINT_URL = `${BASE_URL}/app/inventory`

export const inventoryApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        createInventory: builder.mutation({
            query: (body) => ({
                url: `${ENDPOINT_URL}`,
                method: 'POST',
                body
            }),
            invalidatesTags: ['inventory']
        }),
        updateInventory: builder.mutation({
            query: (body) => ({
                url: `${ENDPOINT_URL}`,
                method: 'PATCH',
                body
            }),
            invalidatesTags: ['inventory', 'inventory/id']
        }),
        deleteInventory: builder.mutation({
            query: (body) => ({
                url: `${ENDPOINT_URL}`,
                method: 'DELETE',
                body
            }),
            invalidatesTags: ['inventory']
        }),
        distinctInventory: builder.mutation({
            query: (params) => ({
                url: `${ENDPOINT_URL}/id`,
                method: 'GET',
                params
            }),
            providesTags: ['inventory/id']
        }),
        fetchAllInventory: builder.mutation({
            query: (params) => ({
                url: `${ENDPOINT_URL}`,
                method: 'GET',
                params
            }),
            providesTags: ['inventory']
        }),
        fetchAllInventoryBranch: builder.mutation({
            query: (params) => ({
                url: `${ENDPOINT_URL}/branch`,
                method: 'GET',
                params
            }),
            providesTags: ['inventory']
        }),
        searchInventory: builder.mutation({
            query: (params) => ({
                url: `${ENDPOINT_URL}/search`,
                method: 'GET',
                params
            }),
            providesTags: ['inventory']
        }),
        specifyInventory: builder.mutation({
            query: (params) => ({
                url: `${ENDPOINT_URL}/specify`,
                method: 'GET',
                params
            }),
            providesTags: ['inventory']
        }),
        byStocksInventory: builder.mutation({
            query: (params) => ({
                url: `${ENDPOINT_URL}/bystocks`,
                method: 'GET',
                params
            }),
            providesTags: ['receipt']
        }),
        byTransmitInventory: builder.mutation({
            query: (params) => ({
                url: `${ENDPOINT_URL}/bytransmit`,
                method: 'GET',
                params
            }),
            providesTags: ['receiving']
        }),
        sqlAcquireInventory: builder.mutation({
            query: (body) => ({
                url: `${ENDPOINT_URL}/sqlacquire`,
                method: 'POST',
                body
            }),
            providesTags: ['receiving']
        }),
    })
})

export const {
    useCreateInventoryMutation,
    useUpdateInventoryMutation,
    useDeleteInventoryMutation,
    useDistinctInventoryMutation,
    useFetchAllInventoryMutation,
    useFetchAllInventoryBranchMutation,
    useSearchInventoryMutation,
    useSpecifyInventoryMutation,
    useByStocksInventoryMutation,
    useByTransmitInventoryMutation,
    useSqlAcquireInventoryMutation,
} = inventoryApiSlice