import { apiSlice } from "../../../utilities/redux/slices/apiSlice"
const ENDPOINT_URL = '/app/inventory'

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
    })
})

export const {
    useCreateInventoryMutation,
    useUpdateInventoryMutation,
    useDeleteInventoryMutation,
    useDistinctInventoryMutation,
    useFetchAllInventoryMutation,
    useSearchInventoryMutation,
    useSpecifyInventoryMutation,
} = inventoryApiSlice