import { apiSlice } from "../../../utilities/redux/slices/apiSlice"
const ENDPOINT_URL = '/app/supplier'

export const supplierApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        createSupplier: builder.mutation({
            query: (body) => ({
                url: `${ENDPOINT_URL}`,
                method: 'POST',
                body
            }),
            invalidatesTags: ['supplier']
        }),
        updateSupplier: builder.mutation({
            query: (body) => ({
                url: `${ENDPOINT_URL}`,
                method: 'PATCH',
                body
            }),
            invalidatesTags: ['supplier', 'supplier/id']
        }),
        deleteSupplier: builder.mutation({
            query: (body) => ({
                url: `${ENDPOINT_URL}`,
                method: 'DELETE',
                body
            }),
            invalidatesTags: ['supplier']
        }),
        distinctSupplier: builder.mutation({
            query: (params) => ({
                url: `${ENDPOINT_URL}/id`,
                method: 'GET',
                params
            }),
            providesTags: ['supplier/id']
        }),
        fetchAllSupplier: builder.mutation({
            query: (params) => ({
                url: `${ENDPOINT_URL}`,
                method: 'GET',
                params
            }),
            providesTags: ['supplier']
        }),
        searchSupplier: builder.mutation({
            query: (params) => ({
                url: `${ENDPOINT_URL}/search`,
                method: 'GET',
                params
            }),
            providesTags: ['supplier']
        }),
        specifySupplier: builder.mutation({
            query: (params) => ({
                url: `${ENDPOINT_URL}/specify`,
                method: 'GET',
                params
            }),
            providesTags: ['supplier']
        }),
    })
})

export const {
    useCreateSupplierMutation,
    useUpdateSupplierMutation,
    useDeleteSupplierMutation,
    useDistinctSupplierMutation,
    useFetchAllSupplierMutation,
    useSearchSupplierMutation,
    useSpecifySupplierMutation,
} = supplierApiSlice